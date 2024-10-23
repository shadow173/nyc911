import jwt from 'jsonwebtoken'
import logger from './logger'
import { error } from 'elysia'

const secret = process.env.JWT_SECRET!

export function signToken(payload: object){
    return jwt.sign(payload, secret)
}

export function verifyToken(token: string){
    try{
        return jwt.verify(token, secret)
    } catch(e){
        console.log("error verifying token")
    }
}

export function verifyTokenAndActive(token: string){
    try{

        const tokenToVerify: any = verifyToken(token)
        
        // object of token values
        if(!tokenToVerify){
            return false;
        }
        console.log({tokenToVerify})
        if(tokenToVerify.isDisabled === true){
            return false
        } else if(tokenToVerify.isActive === true){
            return true
        }
    
        
        return false
        
}
catch(e){
       logger.error("Error parsing JSON TOKEN " + error)
       return false; 
}
}