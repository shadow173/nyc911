import { users } from '../db/schema.js';
import { authenticated, authenticatedAndAdmin } from '../utils/authenticate.ts';
import { db } from '../utils/db.ts';
import { hashPassword } from '../utils/encryptPassword.ts';
const isDevelopment = process.env.NODE_ENV === 'development';

export const createAccount = async ({ body, error, headers, cookie }: any) => {
    const userToken = cookie.token?.value;
    const isAuth = await authenticated(userToken)
    if(!isAuth){
        return error(401)
    }
    const isAdmin = await authenticatedAndAdmin(userToken)
    // const authAndAdmin = await verifyToken()
    if(!isAdmin){
         return error(401, { message: 'Invalid Permissions!'})
    }
    const { name, email, password } = body
    try{
        
    const pass = await hashPassword(password)

    const userArray = await db.insert(users).values({username: name, email: email, password: pass}).returning({ id: users.id})
    const user = userArray[0]
    console.log(user)
    // now the user is created, have the user login. not returning the jwt here only in login because only admins can create users
    return { message: 'User created successfully', id: user.id } 


    } catch (e){
        console.error(e);
        return error(500, { message: 'Error creating user! Possible duplicate' });
    }

}


    