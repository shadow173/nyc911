
import { users } from '../db/schema.js';
import { db } from '../utils/db.ts';
import {  checkPassword } from '../utils/encryptPassword.ts';
import { signToken } from '../utils/jwt.ts';
import { eq } from "drizzle-orm"


const isDevelopment = process.env.NODE_ENV === 'development';


export const loginUser = async ({ body, set, cookie, error}: any ) => {   
    const { email, password } = body
 
    const userArray = await db.select().from(users).where(eq(users.email, email.toLowerCase()))
    const user = userArray[0]
     if(!user){
         return error(401, { message: "Invalid username or password."})
     } 
     console.log(user)
 
     const isPasswordValid = await checkPassword(password, user.password!)
 
     if(!isPasswordValid){
         return error(401, { message: "Invalid username or password."})
     }
     // now the user should be able to be authenticated
 
     const token = await signToken({id: user.id, email: user.email, name: user.username, isAdmin: user.isAdmin})
 
     set.headers['Authorization'] = `Bearer ${token}`;
 
     const cookieOptions: any = {
         secure: isDevelopment ? false : true,
         sameSite: isDevelopment ? 'Strict' : 'Lax', // Strict for development, Lax for others
         maxAge: 43200, // 12 hours
     };
 
     if (!isDevelopment) {
         cookieOptions.domain = 'nyccommand.com';
     }
     cookie.token.value = token;
     cookie.token.set(cookieOptions);
 
     return {message: "Logged in successfully."}
 
 }