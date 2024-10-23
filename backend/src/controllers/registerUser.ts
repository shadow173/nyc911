import { error } from 'elysia';
import { users } from '../db/schema.js';
import { authenticated, authenticatedAndAdmin } from '../utils/authenticate.ts';
import { db } from '../utils/db.ts';
import { hashPassword } from '../utils/encryptPassword.ts';
import { eq } from 'drizzle-orm'
import { normalizeEmail } from '../services/normalizeEmail.ts';
import { signToken } from '../utils/jwt.ts';
const isDevelopment = process.env.NODE_ENV === 'development';


export const registerUser = async ({ body, cookie }: any) => {
    const domain = process.env.DOMAIN!
    const { email, password, name } = body

    // check for existing user
    const checkExistingUser = await db.select().from(users).where(eq(users.email, email))
    if(checkExistingUser.length > 0){
        console.log("IN USER")
        return error(409, "Conflict")
    }
    const hashedPassword = await hashPassword(password)
    const correctEmail = normalizeEmail(email)

    // create user
// with isEmailVerified = false.
    const user = await db.insert(users).values({
        email: email.toLowerCase(),
        isAdmin: false,
        password: hashedPassword,
        isEmailVerified: false,
    }).returning()
    console.log("CREATING USER")
    // set cookie
    const signedToken =  signToken({email: email, id: user[0].id, isActive: false, isEmailVerified: false, isAgencyEmailVerified:  false, needsManualApproval: false})
    
    // set cookie as token
   cookie.token = {
        domain: domain,
        sameSite: "Strict", // perhaps this should be false because we will be using subdomains
        httpOnly: true,
        name: "token",
        secure: false,
        maxAge: 60 * 60 * 24 * 7,

        // add expires
    }
    cookie.token.value = signedToken
    console.log("COOKIE SIGNED")
    // redirect user to 
    // generate email token, expires in 12 hours


    // need to add this functionality
    // send verification email

    // other functionality in other endpoints
    const userObject = {email: email, isActive: 'false', isEmailVerified: false, isAgencyEmailVerified:  false, needsManualApproval: false}
    return { message: "User Created Successfully", user: userObject, }
}


// console.log(await registerUser({body: {email: "Helpp"}}))