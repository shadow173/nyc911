import { Elysia, t } from 'elysia';
import { pool } from './utils/db';
import { authRoutes } from './authRoutes';
import { callRoutes } from './callRoutes';
import { addNoteUpdate } from './controllers/addNoteUpdate';
import { createIncident } from './services/createIncident';

const port: number = 3000;

const app = new Elysia()
    .use(authRoutes)
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
    .get('/', 'hi')
    .listen(port)

    console.log("running on port: " + port)
    

    // USE CORS FOR COOKIES TO PERSIST