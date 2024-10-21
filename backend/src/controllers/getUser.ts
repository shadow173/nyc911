import { error } from "elysia"
import { verifyToken } from "../utils/jwt"
import { db } from "../utils/db";
import { users } from "../db/schema";
import { eq, } from "drizzle-orm";

export const getUser = async ({ cookie, request }:any) => {
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    console.log(cookie)
    console.log(token)
    const verified:any = verifyToken(token)
    if(verified){
        const userId = verified.id
       const [userToken] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
       const userToReturn = 
       { id: userToken.id, 
        email: userToken.email, 
        isActive: userToken.isActive,
         emailVerified: userToken.isEmailVerified, 
         agencyId: userToken.agencyId, 
         agencyEmail: userToken.agencyEmail,  
         agencyEmailVerified: userToken.isAgencyEmailVerified,
         needsManualApproval: userToken.needsManualApproval,
         phoneNumber: userToken.phoneNumber,
         phoneVerified: userToken.phoneVerified

        }
        return userToReturn
    }
    return error(401, "Unauthorized")
}