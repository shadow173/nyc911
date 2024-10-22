import { error } from "elysia";
import { agencies, users } from "../db/schema";
import { db } from "../utils/db";
import { verifyToken } from "../utils/jwt";
import { eq } from 'drizzle-orm'
import logger from "../utils/logger";
import { verifyEmail, verifyPhoneNumber, verifyPhoneNumberCode } from "../utils/twilio";
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

export const createPersonalEmailVerificationCode = async ({ cookie, request }:any) => {
    

    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
      
    if (!token) {
        return error(401, "Unauthorized")
    }

    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
        return error(401, 'Unauthorized');
    }

              const [user] = await db.select().from(users).where(eq(users.id, verified.id)).limit(1);
        if(!user){
            logger.error("USER NOT FOUND FOR VERIFICATION")
            return error(500, "Internal Server Error")
        }
        const now = new Date();
        const lastVerification = user.lastEmailVerification ? new Date(user.lastEmailVerification) : null;
        
        if (lastVerification) {
            const timeDifferenceInSeconds = Math.floor((now.getTime() - lastVerification.getTime()) / 1000);
            if (timeDifferenceInSeconds < 60) {
               return error(401, `Please wait ${60 - timeDifferenceInSeconds} seconds before requesting a new code`);
            }
        }
        try{
            const code = await verifyEmail(user.email)
            await db
            .update(users)
            .set({
                personalVerificationCode: code,
                lastEmailVerification: now,
            })
            .where(eq(users.id, verified.id));
            return { success: true };
        } catch(e){
            logger.error(e)
            error(500, "Internal Server Error, possibly invalid email provided")
            
        }
}



export const verifyPersonalCode = async ({ cookie, request, body }:any) => {
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    const userInputtedCode = body.code
      
    if (!token) {
        return error(401, "Unauthorized")
    }

    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
        throw new Error('Invalid token');
    }
        try{
            const [user] = await db.select().from(users).where(eq(users.id, verified.id)).limit(1);
            if(!user){
                logger.error("USER NOT FOUND FOR VERIFICATION")
                return error(500, "Internal Server Error")
            }
            if(user.totalVerificationAttempts > 100) {
                return error(429, "Too Many Attempts");
            }
            await db
            .update(users)
            .set({
                totalVerificationAttempts: user.totalVerificationAttempts +1,
            })
            .where(eq(users.id, verified.id));
    
            // now check token
            if(userInputtedCode === user.personalVerificationCode) {
                // Successful verification
                await db.update(users).set({
                    isEmailVerified: true,
                    personalVerificationCode: null,
                    totalVerificationAttempts: 0, 
                }).where(eq(users.id, verified.id));
                return { success: true };
            } 
            return error(400, "Bad Request")
        } catch(e){
            return error(500, "Internal Server Error")
        }
}
// phone number stuff

export const resendPhoneVerification = async ({cookie, request }:any) => { // CALL GET will check the users cookies for this value
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
        return error(401, "Unauthorized")
    }
     // ADD RATE LIMITING TOTAL OF 6 checks and 60 seconds apart
    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
        throw new Error('Invalid token');
    }
        try{
            const [user] = await db.select().from(users).where(eq(users.id, verified.id)).limit(1);
            if(!user){
                logger.error("USER NOT FOUND FOR VERIFICATION")
                return error(500, "Internal Server Error")
            }

          const phoneNumber = user.phoneNumber
          if(!phoneNumber){
            return error(400, "Bad Request")
          }
          const now = new Date();
          const lastVerification = user.lastPhoneVerification ? new Date(user.lastPhoneVerification) : null;
          
          if (lastVerification) {
              const timeDifferenceInSeconds = Math.floor((now.getTime() - lastVerification.getTime()) / 1000);
              if (timeDifferenceInSeconds < 60) {
                return error(429, `Please wait ${60 - timeDifferenceInSeconds} seconds before requesting a new code`);
              }
            }
              if (user.totalPhoneVerificationAttempts > 6 || user.totalVerificationAttempts > 100) {
                return error(429, "Too Many Attempts. Please try again later.");
              }
              
              if (!phoneNumber) {
                return error(400, "Phone number not set for this user.");
              }


          await db
            .update(users)
            .set({
                totalPhoneVerificationAttempts: user.totalPhoneVerificationAttempts +1,
                totalVerificationAttempts: user.totalVerificationAttempts +1,

            })
            .where(eq(users.id, verified.id));

                // now number is valid send phone verification
            await verifyPhoneNumber(phoneNumber)
            return { success: true}


             } catch(e){
                logger.error(e)
                error(500, "Internal Server Error")
             }
            }


export const setPhoneNumber = async ({cookie, request, body }:any) => { // THIS IS ONLY FOR ONE TIME USE !! IMPORTANT
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    const phoneNumber = body.phoneNumber
    if(!phoneNumber){
        return error(400, "Phone not provided")
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
        return error(400, "Incorrect phone format")
        }
    if (!token) {
        return error(401, "Unauthorized")
    }
    // add check to ensure phone isnt on another account

    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
        throw new Error('Invalid token');
    }
        try{
            const [user] = await db.select().from(users).where(eq(users.id, verified.id)).limit(1);
            if(!user){
                logger.error("USER NOT FOUND FOR VERIFICATION")
                return error(500, "Internal Server Error")
            }
            try{
                const [phoneSearch] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber)).limit(1);
                if(phoneSearch){
                    return error(409, "Conflict, phone already in use.")
                }
            } catch(e){
                return error(409, "Conflict, phone already in use.")
            }
           
            if(user.phoneNumber !== null){
                return error(403, "Phone number is already set");
            }
            // check if the phone is mobile or voip. oNLY ALLOW MOBILE
            const phoneToCheck = "+1" + phoneNumber
            const number = await client.lookups.v2
                .phoneNumbers(phoneToCheck)
                .fetch({ fields: "line_type_intelligence" });


            if(number.lineTypeIntelligence.type !== "mobile") {
                return error(400, "Invalid Phone number Sorry. Contact support@incidents.nyc for assistance.") }

                // now number is valid send phone verification
            await verifyPhoneNumber(phoneNumber)
             await db
            .update(users)
            .set({
                phoneNumber: phoneNumber

            })
            .where(eq(users.id, verified.id));
            return { success: true}


                } catch(e){
                logger.error(e)
                error(500, "Internal Server Error")
                }
            }


            // create phone verification now 


export const verifyPhoneCode = async ({cookie, request, body }:any) => { // THIS IS ONLY FOR ONE TIME USE !! IMPORTANT
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    const code = body.code
    if(!code){
        return error(400, "Code not provided")
    }
  
    if (!token) {
        return error(401, "Unauthorized")
    }
    // add rate limiting

    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
        throw new Error('Invalid token');
    }
        try{
            const [user] = await db.select().from(users).where(eq(users.id, verified.id)).limit(1);
            if(!user){
                logger.error("USER NOT FOUND FOR VERIFICATION")
                return error(500, "Internal Server Error")
            }
            if(!user.phoneNumber){
                return error(400, "Bad Request")
            }
            if (user.totalPhoneCodeVerificationAttempts > 40 || user.totalVerificationAttempts > 100) {
                return error(429, "Too Many Attempts. Please try again later.");
            }
  
            await db
              .update(users)
              .set({
                totalPhoneCodeVerificationAttempts: user.totalPhoneCodeVerificationAttempts + 1
  
              })
              .where(eq(users.id, verified.id));
            // now check verification code
              const verifyResponse = await verifyPhoneNumberCode(user.phoneNumber, code)
              console.log("VERIFICATION RESPONSE")
              console.log(verifyResponse)
              if(verifyResponse){
                console.log("VERIFIED!")
                await db
                .update(users)
                .set({
                    phoneVerified: true
    
                })
                .where(eq(users.id, verified.id));
                return {success: true}
              } else{
                return error(400, "Invalid Code")

              }
              
            } catch(e){
                logger.error(e)
                return error(500, "Internal Server Error")
            }
        }

        // finally check agency email

export const setAgencyEmail = async ({cookie, request, body }:any) => { // THIS IS ONLY FOR ONE TIME USE !! IMPORTANT
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    const email = body.email
    if(!email){
        return error(400, "Email not provided")
    }
    
    if (!token) {
        return error(401, "Unauthorized")
    }
    // add rate limiting

    const verified: any = verifyToken(token);
    if (!verified || !verified.id) {
        throw new Error('Invalid token');
    }
        try{
            const [user] = await db.select().from(users).where(eq(users.id, verified.id)).limit(1);
            if(!user){
                logger.error("USER NOT FOUND FOR VERIFICATION")
                return error(500, "Internal Server Error")
            }
            if(user.agencyEmail !== null){
                return error(403, "Agency email is already set");
            }
            try{
                const [agencySearch] = await db.select().from(users).where(eq(users.agencyEmail, email)).limit(1);
                if(agencySearch){
                    return error(409, "Email already in use.")
                }
            } catch(e){
                return error(409, "Email already in use.")
            }

            const emailDomainMatch = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/); // hope this works lol
            const emailDomain = emailDomainMatch ? emailDomainMatch[1] : null;
            if (user.totalVerificationAttempts > 100) {
                return error(429, "Too Many Attempts. Please try again later.");
            }
            if (!emailDomain) {
                return error(400, "Invalid email format");
            }

            const [agency] = await db.select().from(agencies).where(eq(agencies.emailDomain, emailDomain)).limit(1);
            if(!agency){
                await db
                    .update(users)
                    .set({
                        totalVerificationAttempts: user.totalVerificationAttempts +1,
                        needsManualApproval: true
                    })
            .where(eq(users.id, verified.id));
            return {success: true, needsManualApproval: true}
            }
            // verify email now
            const now = new Date();
             const lastVerification = user.lastAgencyEmailVerification ? new Date(user.lastAgencyEmailVerification) : null;
        
            if (lastVerification) {
                const timeDifferenceInSeconds = Math.floor((now.getTime() - lastVerification.getTime()) / 1000);
                if (timeDifferenceInSeconds < 60) {
                return error(401, `Please wait ${60 - timeDifferenceInSeconds} seconds before requesting a new code`);
                }
            }
                try{
                    const code = await verifyEmail(email)
                    await db
                    .update(users)
                    .set({
                        totalVerificationAttempts: user.totalVerificationAttempts +1,
                        agencyVerificationCode: code,
                        lastEmailVerification: now,
                    })
                    .where(eq(users.id, verified.id));
                    return { success: true };
                } catch(e){
                    logger.error(e)
                    error(500, "Internal Server Error, possibly invalid email provided")
                    
                }
            } catch(e){
                logger.error(e)
                return error(500, "Internal Server Error")
            }
        }

            
            // add one to verification attempts