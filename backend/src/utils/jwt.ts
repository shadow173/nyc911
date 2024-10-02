import jwt from 'jsonwebtoken'

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