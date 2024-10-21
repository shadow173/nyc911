import cors from "@elysiajs/cors";
import { getUser } from "./controllers/getUser";
import {  registerUser } from "./controllers/registerUser";
import { loginUser } from "./services/loginAccount";
import { Elysia, t} from 'elysia'
import bearer from "@elysiajs/bearer";
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
// .post('/verifyPersonalCode', ) BODY STRING
// .post('/resendEmail') // TAKE IN ID AND CHECK JWT TOKEN FIRST THEN IF ITS VALID RESEND THE EMAIL
// .post /checkPhoneNumber takes in phone number as string
// post to /auth/setAgencyEmail