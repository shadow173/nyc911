import Elysia from "elysia";
import { createIncident } from "./services/createIncident";

export const authRoutes = new Elysia({ prefix: '/'})
.post('/incidents', createIncident)
