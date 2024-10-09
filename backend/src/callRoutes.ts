import Elysia, { t } from "elysia";
import { createIncident } from "./services/createIncident";
import { addNoteUpdate } from "./controllers/addNoteUpdate";

export const authRoutes = new Elysia({ prefix: '/'})
.post('/incidents', createIncident, { // i will put my function in my second body. // this is destructuring context I think
    body: t.Object({
       incidentType: t.String(),
       description: t.String(),
       textAddress: t.String(),
       assignedUnits: t.Array(t.String()),
       agencyType: t.String(), // must be "fire", "pd", "ems"
       severity: t.String() //   "non-urgent" "low","moderate","high","critical","citywide-incident",
    })
})
.post('/addNoteToIncident', addNoteUpdate, {
    body: t.Object({
       unitId: t.String(),
       noteDescription: t.String(),
    }) 
})
// IMPORTANT MUST AUTHENTICATE BEFORE PRODUCTION. I JUST DK HOW ILL DO IT YET
