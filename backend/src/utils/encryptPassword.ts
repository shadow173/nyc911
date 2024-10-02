
import bcrypt from 'bcrypt'
const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
    const pass = bcrypt.hash(password, saltRounds)
    return pass;
}

export async function checkPassword(plaintextPassword: string, hash: string): Promise<boolean>{
    const result = bcrypt.compare(plaintextPassword, hash)
    return result
}