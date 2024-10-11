import {  registerUser } from "./controllers/registerUser";
import { loginUser } from "./services/loginAccount";
import { Elysia, t} from 'elysia'
export const authRoutes = new Elysia({ prefix: '/auth'})
.post('register', registerUser, { // i will put my function in my second body. // this is destructuring context I think
    body: t.Object({
        email: t.String(),
        name: t.String(),
        password: t.String(),
    })
})
.post('/login', loginUser, {
    body: t.Object({
        email: t.String(),
        password: t.String()
    })
})
