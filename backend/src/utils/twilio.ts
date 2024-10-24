import sgMail from '@sendgrid/mail'
import twilio from "twilio"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
import * as EmailValidator from 'email-validator';
import logger from './logger';


const generateVerificationCode = (): string => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
};



    export const verifyEmail = async (email: string) => {
        // add check to ensure email is okay
        if (!EmailValidator.validate(email)) {
            throw new Error('Invalid email format');
        }

        const verificationCode = generateVerificationCode();

        const msg = {
            to: email,
            from: 'verification@mail.incidents.nyc',
            templateId: 'd-66d9304dbaf34949a7c48900eb40cdf6',
            dynamicTemplateData: {
                verificationCode: verificationCode
            }
        }
        try {
            await sgMail.send(msg);
            return verificationCode;
        } catch (error) {
            logger.error('Error sending verification email:', error);
            throw new Error('Error sending email' + error);
        }
    }


// phone verification

export const verifyPhoneNumber = async (phoneNumber: string) => {
    try {
        // Validate phone number format
        if (!/^\d{10}$/.test(phoneNumber)) {
            throw new Error("Phone number must be exactly 10 digits.");
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        if (!accountSid || !authToken) {
            throw new Error("Twilio credentials are not set in environment variables.");
        }

        const client = twilio(accountSid, authToken);

        // Lookup phone number to verify it's mobile
        const number = await client.lookups.v2
            .phoneNumbers(phoneNumber)
            .fetch({ fields: "line_type_intelligence" });

        if (!number.lineTypeIntelligence || number.lineTypeIntelligence.type !== "mobile") {
            logger.error(`Phone number ${phoneNumber} is not a mobile number.`);
            throw new Error("Phone number is not a mobile number.");
        }

        // Create verification
        const verification = await client.verify.v2
            .services("VA643780aa8b72d2c2a2c31469b4f85a3c")
            .verifications.create({
                channel: "sms",
                to: `+1${phoneNumber}`,
            });

        console.log(`Verification SID: ${verification.sid}`);
        console.log(`Verification Status: ${verification.status}`);

        return verification.sid; // Or any other relevant data

    } catch (error) {
        // Enhanced error logging
        if (error instanceof Error) {
            logger.error(`Error in verifyPhoneNumber: ${error.message}`, { stack: error.stack });
            throw error; // Re-throw if you want upstream handlers to catch it
        } else {
            logger.error('An unknown error occurred in verifyPhoneNumber.', { error });
            throw new Error('An unknown error occurred during phone verification.');
        }
    }
};


export const verifyPhoneNumberCode = async (phoneNumber:string, code: string) => { // should work
try{
    if (!/^\d{7}$/.test(code)) {
        throw new Error("Code must be exactly 7 digits.");
        return
      }
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    const verificationCheck = await client.verify.v2
    .services("VA643780aa8b72d2c2a2c31469b4f85a3c")
    .verificationChecks.create({
      code: code,
      to: "+1" + phoneNumber,
    });
    console.log("Verification Check: ", verificationCheck);
    console.log("Verification Status: ", verificationCheck.status);

    if (verificationCheck.status === "approved") {
      return true;
    }
    return false;
} catch(e){
    logger.error(e)
}

}

