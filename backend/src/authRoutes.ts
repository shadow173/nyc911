import cors from "@elysiajs/cors";
import { getUser } from "./controllers/getUser";
import {  registerUser } from "./controllers/registerUser";
import { loginUser } from "./services/loginAccount";
import { Elysia, t} from 'elysia'
import bearer from "@elysiajs/bearer";
import { checkAgencyEmailCode, createAgencyEmailVerificationCode, createPersonalEmailVerificationCode, resendPhoneVerification, setActive, setAgencyEmail, setPhoneNumber, submitVerificationForm, verifyPersonalCode, verifyPhoneCode } from "./controllers/verification";
export const authRoutes = new Elysia({ prefix: '/auth'})
.use(cors())
.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}))
.use(bearer())
.post('register', registerUser, {
    body: t.Object({
        email: t.String(),
        name: t.String(),
        password: t.String(),
    })
})
.post('/login', loginUser, {
    body: t.Object({
        email: t.String(),
        password: t.String()
    })
})
.get('/me', getUser)
// also generate personal code create
.post('/verifyPersonalCode', verifyPersonalCode, {
    body: t.Object({
        code: t.String()
    })
})
.get('/sendPersonalEmail', createPersonalEmailVerificationCode) // sends the verification email on that page load // start a counter for 60 seconds client side where the user cant send the email again

.post('/setPhoneNumber', setPhoneNumber, {
    body: t.Object({
        phoneNumber: t.String()
    })
})
.post('/verifyPhoneCode', verifyPhoneCode, {
    body: t.Object({
        code: t.String()
    })
})
.get('/resendCode', resendPhoneVerification)

.post('/verifyAgencyCode', checkAgencyEmailCode, {
    body: t.Object({
        code: t.String()
    })
})
.post('/setAgencyEmail', setAgencyEmail, {
    body: t.Object({
        email: t.String()
    })
})

.get('/createAgencyEmailVerificationCode', createAgencyEmailVerificationCode)
.get('/setActive', setActive)
.post('/submitVerificationForm', submitVerificationForm,
    // {
    //     body: t.Object({
    //         file: t.Any(),
    //         role: t.String(),
    //         name: t.String(),
    //         companyName: t.String(),
    //         streetAddress: t.String(),
    //         city: t.String(),
    //         state: t.String(),
    //         zipCode: t.String()
    //     })
    // }
)
// create endpoint that says agency email passed and make that true 
// this way it can check if email verified or email passed and return the form 







// }) BODY STRING
// .post('/resendEmail') // TAKE IN ID AND CHECK JWT TOKEN FIRST THEN IF ITS VALID RESEND THE EMAIL
// .post /checkPhoneNumber takes in phone number as string
// post to /auth/setAgencyEmail
// add checks to ensure agency email and phone number arent already being used
// call the lookup api for twilio to ensure that the number is not voip or landline we must only use mobile when trying to save the phone number