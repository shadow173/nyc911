import { Elysia } from 'elysia';
import { pool } from './utils/db';
import { authRoutes } from './authRoutes';

const port: number = 3000;

const app = new Elysia()
    .use(authRoutes)
    .get('/', 'hi')
    .listen(port)
    console.log("running on port: " + port)

    // USE CORS FOR COOKIES TO PERSIST