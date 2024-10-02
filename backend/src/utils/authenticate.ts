import { verifyToken } from "./jwt";
interface UserToken {
    isAdmin: boolean; 
}


export async function authenticated(token: string):Promise<boolean>{
    const userToken = verifyToken(token)
    console.log(userToken)
    if(userToken){
        return true
    } else{
        return false
    }
}
export async function authenticatedAndAdmin(token: string): Promise<boolean> {
    const userToken = verifyToken(token) as UserToken | null; // cast the return type of verifyToken

    
    if (userToken) {
        // Ensure isAdmin is checked properly
        if (userToken.isAdmin === true) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}