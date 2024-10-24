import { error } from "elysia";
import { agencies, users, verificationData } from "../db/schema";
import { db } from "../utils/db";
import { signToken, verifyToken } from "../utils/jwt";
import { eq } from "drizzle-orm";
import logger from "../utils/logger";
import {
  verifyEmail,
  verifyPhoneNumber,
  verifyPhoneNumberCode,
} from "../utils/twilio";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const isDevelopment = process.env.NODE_ENV === "development";

export const createPersonalEmailVerificationCode = async ({
  cookie,
  request,
}: any) => {
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return error(401, "Unauthorized");
  }

  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    return error(401, "Unauthorized");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, verified.id))
    .limit(1);
  if (!user) {
    logger.error("USER NOT FOUND FOR VERIFICATION");
    return error(500, "Internal Server Error");
  }
  if (user.isDisabled) {
    return error(401, "Unauthorized");
  }
  const now = new Date();
  const lastVerification = user.lastEmailVerification
    ? new Date(user.lastEmailVerification)
    : null;

  if (lastVerification) {
    const timeDifferenceInSeconds = Math.floor(
      (now.getTime() - lastVerification.getTime()) / 1000
    );
    if (timeDifferenceInSeconds < 60) {
      return error(
        401,
        `Please wait ${
          60 - timeDifferenceInSeconds
        } seconds before requesting a new code`
      );
    }
  }
  try {
    const code = await verifyEmail(user.email);
    await db
      .update(users)
      .set({
        personalVerificationCode: code,
        lastEmailVerification: now,
      })
      .where(eq(users.id, verified.id));
    return { success: true };
  } catch (e) {
    logger.error(e);
    error(500, "Internal Server Error, possibly invalid email provided");
  }
};

export const verifyPersonalCode = async ({ cookie, request, body }: any) => {
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];
  const userInputtedCode = body.code;

  if (!token) {
    return error(401, "Unauthorized");
  }

  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    throw new Error("Invalid token");
  }
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.id))
      .limit(1);
    if (!user) {
      logger.error("USER NOT FOUND FOR VERIFICATION");
      return error(500, "Internal Server Error");
    }
    if (user.isDisabled) {
      return error(401, "Unauthorized");
    }
    if (user.totalVerificationAttempts > 100) {
      await db
        .update(users)
        .set({
          isDisabled: true,
        })
        .where(eq(users.id, verified.id));
      return error(429, "Too Many Attempts");
    }
    await db
      .update(users)
      .set({
        totalVerificationAttempts: user.totalVerificationAttempts + 1,
      })
      .where(eq(users.id, verified.id));

    // now check token
    if (userInputtedCode === user.personalVerificationCode) {
      // Successful verification
      await db
        .update(users)
        .set({
          isEmailVerified: true,
          personalVerificationCode: null,
          totalVerificationAttempts: 0,
        })
        .where(eq(users.id, verified.id));
      return { success: true };
    }
    return error(400, "Bad Request");
  } catch (e) {
    return error(500, "Internal Server Error");
  }
};
// phone number stuff

export const resendPhoneVerification = async ({ cookie, request }: any) => {
  // CALL GET will check the users cookies for this value
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return error(401, "Unauthorized");
  }
  // ADD RATE LIMITING TOTAL OF 6 checks and 60 seconds apart
  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    throw new Error("Invalid token");
  }
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.id))
      .limit(1);
    if (!user) {
      logger.error("USER NOT FOUND FOR VERIFICATION");
      return error(500, "Internal Server Error");
    }
    if (user.isDisabled) {
      return error(401, "Unauthorized");
    }
    const phoneNumber = user.phoneNumber;
    if (!phoneNumber) {
      return error(400, "Bad Request");
    }
    const now = new Date();
    const lastVerification = user.lastPhoneVerification
      ? new Date(user.lastPhoneVerification)
      : null;

    if (lastVerification) {
      const timeDifferenceInSeconds = Math.floor(
        (now.getTime() - lastVerification.getTime()) / 1000
      );
      if (timeDifferenceInSeconds < 60) {
        return error(
          429,
          `Please wait ${
            60 - timeDifferenceInSeconds
          } seconds before requesting a new code`
        );
      }
    }
    if (
      user.totalPhoneVerificationAttempts > 9 ||
      user.totalVerificationAttempts > 100
    ) {
      await db
        .update(users)
        .set({
          isDisabled: true,
        })
        .where(eq(users.id, verified.id));

      return error(429, "Too Many Attempts.");
    }

    if (!phoneNumber) {
      return error(400, "Phone number not set for this user.");
    }

    await db
      .update(users)
      .set({
        totalPhoneVerificationAttempts: user.totalPhoneVerificationAttempts + 1,
        totalVerificationAttempts: user.totalVerificationAttempts + 1,
      })
      .where(eq(users.id, verified.id));

    // now number is valid send phone verification
    await verifyPhoneNumber(phoneNumber);
    return { success: true };
  } catch (e) {
    logger.error(e);
    error(500, "Internal Server Error");
  }
};

export const setPhoneNumber = async ({ cookie, request, body }: any) => {
  // THIS IS ONLY FOR ONE TIME USE !! IMPORTANT
  try {
    const token =
      cookie.token?.value ||
      request.headers.get("authorization")?.split(" ")[1];
    const phoneNumber = body.phoneNumber;

    // Input Validation
    if (!phoneNumber) {
      return error(400, "Phone number not provided.");
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return error(
        400,
        "Incorrect phone format. It must be exactly 10 digits."
      );
    }
    if (!token) {
      return error(401, "Unauthorized. Token not provided.");
    }

    // Verify Token
    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
      return error(401, "Invalid token.");
    }

    try {
      // Fetch User from Database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, verified.id))
        .limit(1);
      if (!user) {
        logger.error("USER NOT FOUND FOR VERIFICATION", {
          userId: verified.id,
        });
        return error(500, "Internal Server Error.");
      }

      // Check if User is Disabled
      if (user.isDisabled) {
        return error(401, "Unauthorized");
      }

      // Check and Update Verification Attempts
      if (user.totalPhoneCodeVerificationAttempts >= 5) {
        await db
          .update(users)
          .set({ isDisabled: true })
          .where(eq(users.id, verified.id));
        logger.warn(
          `User ${verified.id} has been disabled due to too many verification attempts.`
        );
        return error(401, "Unauthorized");
      }

      // Increment Verification Attempts
      await db
        .update(users)
        .set({
          totalPhoneCodeVerificationAttempts:
            user.totalPhoneCodeVerificationAttempts + 1,
        })
        .where(eq(users.id, verified.id));

      // Check if Phone Number is Already in Use
      const [phoneSearch] = await db
        .select()
        .from(users)
        .where(eq(users.phoneNumber, phoneNumber))
        .limit(1);
      if (phoneSearch) {
        return error(409, "Conflict. Phone number is already in use.");
      }

      // Check if User Already Has a Phone Number Set
      if (user.phoneNumber !== null) {
        return error(403, "Forbidden. Phone number is already set.");
      }

      // Initialize Twilio Client
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      if (!accountSid || !authToken) {
        logger.error(
          "Twilio credentials are not set in environment variables."
        );
        return error(500, "Internal Server Error.");
      }
      const client = twilio(accountSid, authToken);

      // Check if Phone Number is Mobile
      const phoneToCheck = "+1" + phoneNumber;
      const number = await client.lookups.v2
        .phoneNumbers(phoneToCheck)
        .fetch({ fields: "line_type_intelligence" });

      if (
        !number.lineTypeIntelligence ||
        number.lineTypeIntelligence.type !== "mobile"
      ) {
        logger.error(`Invalid phone type for number: ${phoneNumber}`, {
          phoneType: number.lineTypeIntelligence?.type,
        });
        return error(
          400,
          "Invalid phone number. Please use a mobile number or contact support@incidents.nyc for assistance."
        );
      }

      // Send Phone Verification
      await verifyPhoneNumber(phoneNumber);

      // Update User's Phone Number in Database
      await db
        .update(users)
        .set({ phoneNumber: phoneNumber })
        .where(eq(users.id, verified.id));

      return { success: true };
    } catch (e) {
      // Enhanced Error Logging
      if (e instanceof Error) {
        logger.error("Error in setPhoneNumber:", {
          message: e.message,
          stack: e.stack,
        });
      } else {
        logger.error("Unknown error in setPhoneNumber:", { error: e });
      }
      return error(500, "Internal Server Error.");
    }
  } catch (e) {
    logger.error(e);

    return error("Internal Server Error");
  }
};

// create phone verification now

export const verifyPhoneCode = async ({ cookie, request, body }: any) => {
  // THIS IS ONLY FOR ONE TIME USE !! IMPORTANT
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];
  const code = body.code;
  if (!code) {
    return error(400, "Code not provided");
  }

  if (!token) {
    return error(401, "Unauthorized");
  }
  // add rate limiting

  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    throw new Error("Invalid token");
  }
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.id))
      .limit(1);
    if (!user) {
      logger.error("USER NOT FOUND FOR VERIFICATION");
      return error(500, "Internal Server Error");
    }
    if (user.isDisabled) {
      return error(401, "Unauthorized");
    }
    if (!user.phoneNumber) {
      return error(400, "Bad Request");
    }
    if (
      user.totalPhoneCodeVerificationAttempts > 40 ||
      user.totalVerificationAttempts > 100
    ) {
      await db
        .update(users)
        .set({
          isDisabled: true,
        })
        .where(eq(users.id, verified.id));
      return error(429, "Too Many Attempts. Please try again later.");
    }

    await db
      .update(users)
      .set({
        totalPhoneCodeVerificationAttempts:
          user.totalPhoneCodeVerificationAttempts + 1,
      })
      .where(eq(users.id, verified.id));
    // now check verification code
    const verifyResponse = await verifyPhoneNumberCode(user.phoneNumber, code);
    console.log("VERIFICATION RESPONSE");
    console.log(verifyResponse);
    if (verifyResponse) {
      console.log("VERIFIED!");
      await db
        .update(users)
        .set({
          phoneVerified: true,
        })
        .where(eq(users.id, verified.id));
      return { success: true };
    } else {
      return error(400, "Invalid Code");
    }
  } catch (e) {
    logger.error(e);
    return error(500, "Internal Server Error");
  }
};

// finally check agency email

export const setAgencyEmail = async ({ cookie, request, body }: any) => {
  // THIS IS ONLY FOR ONE TIME USE !! IMPORTANT
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];
  const email = body.email;
  if (!email) {
    return error(400, "Email not provided");
  }

  if (!token) {
    return error(401, "Unauthorized");
  }
  // add rate limiting

  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    throw new Error("Invalid token");
  }
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.id))
      .limit(1);
    if (!user) {
      logger.error("USER NOT FOUND FOR VERIFICATION");
      return error(500, "Internal Server Error");
    }
    if (user.isDisabled) {
      return error(401, "Unauthorized");
    }
    if (user.agencyEmail !== null) {
      return error(403, "Agency email is already set");
    }
    try {
      const [agencySearch] = await db
        .select()
        .from(users)
        .where(eq(users.agencyEmail, email))
        .limit(1);
      if (agencySearch) {
        return error(409, "Email already in use.");
      }
    } catch (e) {
      return error(409, "Email already in use.");
    }

    const emailDomainMatch = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/); // hope this works lol
    const emailDomain = emailDomainMatch ? emailDomainMatch[1] : null;
    if (user.totalVerificationAttempts > 100) {
      return error(429, "Too Many Attempts. Please try again later.");
    }
    if (!emailDomain) {
      return error(400, "Invalid email format");
    }

    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.emailDomain, emailDomain))
      .limit(1);
    if (!agency) {
      await db
        .update(users)
        .set({
          agencyEmail: email,
          totalVerificationAttempts: user.totalVerificationAttempts + 1,
          needsManualApproval: true,
        })
        .where(eq(users.id, verified.id));
      return { success: true };
    }
    if (agency.requiresManualApproval) {
      try {
        await db
          .update(users)
          .set({
            agencyEmail: email,
            totalVerificationAttempts: user.totalVerificationAttempts + 1,
            needsManualApproval: true,
          })
          .where(eq(users.id, verified.id));

        return { success: true };
      } catch (e) {
        logger.error(e);
        error(500, "Internal Server Error, possibly invalid email provided");
      }
    }
    try {
      await db
        .update(users)
        .set({
          agencyEmail: email,
          totalVerificationAttempts: user.totalVerificationAttempts + 1,
          needsManualApproval: false,
        })
        .where(eq(users.id, verified.id));

      return { success: true };
    } catch (e) {
      logger.error(e);
      error(500, "Internal Server Error, possibly invalid email provided");
    }
  } catch (e) {
    logger.error(e);
    return error(500, "Internal Server Error");
  }
};

// add one to verification attempts

export const createAgencyEmailVerificationCode = async ({
  cookie,
  request,
}: any) => {
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return error(401, "Unauthorized");
  }

  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    return error(401, "Unauthorized");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, verified.id))
    .limit(1);
  if (!user) {
    logger.error("USER NOT FOUND FOR VERIFICATION");
    return error(500, "Internal Server Error");
  }
  if (user.isDisabled) {
    return error(401, "Unauthorized");
  }
  const now = new Date();
  const lastVerification = user.lastAgencyEmailVerification
    ? new Date(user.lastAgencyEmailVerification)
    : null;

  if (lastVerification) {
    const timeDifferenceInSeconds = Math.floor(
      (now.getTime() - lastVerification.getTime()) / 1000
    );
    if (timeDifferenceInSeconds < 60) {
      return error(
        401,
        `Please wait ${
          60 - timeDifferenceInSeconds
        } seconds before requesting a new code`
      );
    }
  }
  try {
    if (!user.agencyEmail) {
      return error(400, "Bad Request");
    }
    const code = await verifyEmail(user.agencyEmail);
    await db
      .update(users)
      .set({
        agencyVerificationCode: code,
        lastAgencyEmailVerification: now,
      })
      .where(eq(users.id, verified.id));
    return { success: true };
  } catch (e) {
    logger.error(e);
    error(500, "Internal Server Error, possibly invalid email provided");
  }
};
// function to check and if its right update agency email to verified
// ensure it checks if manual approval is needed

export const checkAgencyEmailCode = async ({ cookie, request, body }: any) => {
  const { code } = body;
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return error(401, "Unauthorized");
  }

  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    return error(401, "Unauthorized");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, verified.id))
    .limit(1);
  if (!user) {
    logger.error("USER NOT FOUND FOR VERIFICATION");
    return error(500, "Internal Server Error");
  }
  if (user.isDisabled) {
    return error(401, "Unauthorized");
  }
  const createdCode = user.agencyVerificationCode;
  if (!user.agencyVerificationCode) {
    return error(400, "Bad Request");
  }
  if (user.totalVerificationAttempts > 100) {
    await db
      .update(users)
      .set({
        isDisabled: true,
      })
      .where(eq(users.id, verified.id));
    return error(429, "Too Many Requests");
  }
  await db
    .update(users)
    .set({
      totalVerificationAttempts: user.totalVerificationAttempts + 1,
    })
    .where(eq(users.id, verified.id));
  if (code === createdCode) {
    // update email verified to true
    await db
      .update(users)
      .set({
        isAgencyEmailVerified: true,
      })
      .where(eq(users.id, verified.id));
    return { success: true };
  }
  return error(400, "Bad Request");
};

export const setActive = async ({ cookie, request }: any) => {
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return error(401, "Unauthorized");
  }
  // add rate limiting
  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    throw new Error("Invalid token");
  }
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.id))
      .limit(1);
    if (!user) {
      logger.error("USER NOT FOUND FOR VERIFICATION");
      return error(500, "Internal Server Error");
    }
    if (user.isDisabled) {
      return error(401, "Unauthorized");
    }
    if (
      user.isAgencyEmailVerified &&
      user.isEmailVerified &&
      user.phoneVerified &&
      !user.needsManualApproval
    ) {
      try {
        await db
          .update(users)
          .set({
            isActive: true,
          })
          .where(eq(users.id, verified.id));

        const token = await signToken({
          id: user.id,
          email: user.email,
          isActive: user.isActive,
          isAdmin: user.isAdmin,
          isDisabled: user.isDisabled,
        });

        const cookieOptions: any = {
          secure: isDevelopment ? false : true,
          //  httpOnly: true,
          sameSite: isDevelopment ? "Strict" : "Lax", // Strict for development, Lax for others
          maxAge: 43200, // 12 hours
        };

        if (!isDevelopment) {
          cookieOptions.domain = "incidents.nyc";
        } else {
          cookieOptions.domain = "localhost";
        }
        cookie.token.value = token;
        cookie.token.set(cookieOptions);
      } catch (e) {
        logger.error(e);
        return error(500, "Internal Server Error");
      }
      return { success: true };
    }
    return error(401, "Unauthorized");
  } catch (e) {
    logger.error(e);
    return error(500, "Internal Server Error");
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export const submitVerificationForm = async ({
  request,
  set,
  cookie,
}: {
  request: Request;
  set: any;
  cookie: any;
}) => {
  const token =
    cookie.token?.value || request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return error(401, "Unauthorized");
  }
  // add rate limiting
  const verified: any = verifyToken(token);
  if (!verified || !verified.id) {
    throw new Error("Invalid token");
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verified.id))
      .limit(1);
    if (!user) {
      logger.error("USER NOT FOUND FOR VERIFICATION");
      return error(500, "Internal Server Error");
    }
    if (user.isDisabled) {
      return error(401, "Unauthorized");
    }

    // Log the content type
    logger.info("Content-Type:", request.headers.get("Content-Type"));

    // Extract the form data
    const formData = await request.formData();

    // Get the file
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      set.status = 400;
      return {
        success: false,
        message: "No file uploaded or invalid file",
      };
    }

    logger.info("File name:", file.name);
    logger.info("File size:", file.size);
    logger.info("File type:", file.type);

    // Get other form fields
    const role = formData.get("role") as string;
    const name = formData.get("name") as string;
    const companyName = formData.get("companyName") as string;
    const streetAddress = formData.get("streetAddress") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zipCode") as string;

    // Validate required fields
    if (
      !role ||
      !name ||
      !companyName ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode
    ) {
      set.status = 400;
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    // Generate file ID and S3 key
    const fileId = randomUUID();
    const s3Key = `verifications/${fileId}.pdf`;

    // Convert the file to buffer for S3
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3Client.send(uploadCommand);
    logger.info(`File uploaded to S3: ${s3Key}`);

    // Create user data

    // add a check to ensure they didnt already make one
    const check = await db.select().from(verificationData).where(eq(verificationData.userId, user.id)).limit(1)
    if(check.length > 0){
        return error(429, "Verification Data already exists.")
    }
    if (
      !role ||
      !companyName ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode ||
      !user.id
    ) {
      return;
    }
    await db.insert(verificationData).values({
      userId: user.id,
      role: role,
      companyName: companyName,
      streetAddress: streetAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      documentId: fileId,
      documentURL: `s3://${process.env.AWS_BUCKET_NAME}/${s3Key}`,
      status: "pending",
    
    });
    return {
      success: true,
      message: "Verification submission successful",
      documentId: fileId,
    };
  } catch (e) {
    logger.error("Verification submission error:", e);
    return error(500, "Failed to process verification submission")
  }
};
