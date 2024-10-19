import { error } from "elysia"
import { verifyToken } from "../utils/jwt"

export const getUser = async ({ cookie, request }:any) => {
    const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
    console.log(cookie)
    console.log(token)
    const verified = verifyToken(token)
    if(verified){
        return {verified}
    }
    return error(401, "Unauthorized")
}