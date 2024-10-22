import { error } from "elysia";
import { verifyToken } from "../utils/jwt";
import { eq } from "drizzle-orm";
import { agencies, users } from "../db/schema";
import { db } from "../utils/db";
import logger from "../utils/logger";

export const getAgencies = async ({cookie, request}:any) => {
const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];

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
        if(!user.isAdmin){
            return error(401, "Unauthorized")
        }
        const agenciesList = await db.select().from(agencies)
        return { agenciesList: agenciesList}
    } catch (e){
        return error(500, "Internal Server Error")
    }
}
export const addAgency = async ({cookie, request, body}:any) => {
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
        return error(401, "Unauthorized")
    }
    // add rate limiting
    const {name, emailDomain, requiresManualApproval} = body
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
            if(!user.isAdmin){
                return error(401, "Unauthorized")
            }
            await db.insert(agencies).values({ name: name, emailDomain: emailDomain, requiresManualApproval: requiresManualApproval })
            const agenciesList = await db.select().from(agencies)
            
            return { agenciesList: agenciesList}
        } catch (e){
            return error(500, "Internal Server Error")
        }
    }

    export const removeAgency = async ({cookie, request, body}:any) => {
        const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
        
        if (!token) {
            return error(401, "Unauthorized")
        }
        // add rate limiting
        const {id} = body
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
                if(!user.isAdmin){
                    return error(401, "Unauthorized")
                }
                await db.delete(agencies).where(eq(agencies.id, id))
                const agenciesList = await db.select().from(agencies)
                return { agenciesList: agenciesList}
            } catch (e){
                return error(500, "Internal Server Error")
            }
        }  
        export const updateAgency = async ({cookie, request, body}:any) => {
            const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
            
            if (!token) {
                return error(401, "Unauthorized")
            }
            // add rate limiting
            const {id, name, emailDomain, requiresManualApproval} = body
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
                    if(!user.isAdmin){
                        return error(401, "Unauthorized")
                    }
                    await db.update(agencies)
                    .set({ name: name,  emailDomain: emailDomain, requiresManualApproval: requiresManualApproval })
                    .where(eq(agencies.id, id));
                    const agenciesList = await db.select().from(agencies)
                    return { agenciesList: agenciesList}
                } catch (e){
                    return error(500, "Internal Server Error")
                }
            } 
             