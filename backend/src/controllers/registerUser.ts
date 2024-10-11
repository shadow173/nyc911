import { error } from 'elysia';
import { users } from '../db/schema.js';
import { authenticated, authenticatedAndAdmin } from '../utils/authenticate.ts';
import { db } from '../utils/db.ts';
import { hashPassword } from '../utils/encryptPassword.ts';
import { eq } from 'drizzle-orm'
import { normalizeEmail } from '../services/normalizeEmail.ts';
const isDevelopment = process.env.NODE_ENV === 'development';


export const registerUser = async ({ body, cookie }: any) => {
    const { email, password, name } = body
    // check for existing user
    const checkExistingUser = await db.select().from(users).where(eq(users.email, email))
    if(checkExistingUser.length > 0){
        console.log("IN USER")
        return error(409, "Conflict")
    }
    const hashedPassword = await hashPassword(password)
    const correctEmail = normalizeEmail(email)
    // hash password

    // create user
// with isEmailVerified = false.

    // set cookie
    
    // generate email token, expires in 12 hours

    // send verification email

    // other functionality in other endpoints
}


console.log(await registerUser({body: {email: "Helpp"}}))