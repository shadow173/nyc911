import { Elysia, error, t } from "elysia";
import { pool } from "./utils/db";
import { authRoutes } from "./authRoutes";
import { addNoteUpdate } from "./controllers/addNoteUpdate";
import { createIncident } from "./services/createIncident";
import { preemptUnitAPI } from "./controllers/preemptUnit";
import { getIncidentById, getIncidents } from "./controllers/getIncidents";
import { markIncident } from "./controllers/markIncident";
import { cors } from '@elysiajs/cors'
import bearer from "@elysiajs/bearer";

const port: number = 3001;

const app = new Elysia()
  .use(cors())
  .use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
  }))
  .use(bearer())
  .use(authRoutes)
  .post("/incidents", createIncident, {
    // i will put my function in my second body. // this is destructuring context I think
    body: t.Object({
      incidentType: t.String(),
      apiKey: t.String(),
      description: t.String(),
      textAddress: t.String(),
      assignedUnits: t.Array(t.String()),
      agencyType: t.String(), // must be "fire", "pd", "ems"
      severity: t.String(), //   "non-urgent" "low","moderate","high","critical","citywide-incident",
    }),
  })
  .get("/incidents", getIncidents) // to display each on map or get a list
  // add different filter options such as by agency, by severity, by type, precinct, patrolboro, by status
  // ex .get("/incidents/severity/id", getIncidents) and other options

  .post("/addNoteToIncident", addNoteUpdate, {
    body: t.Object({
      unitId: t.String(),
      note: t.String(),
      apiKey: t.String(),
    }),
  })
  .post("/preemptUnit", preemptUnitAPI, {
    body: t.Object({
      unitId: t.String(),
      apiKey: t.String(),
    }),
  })
  .post("/closeIncident", markIncident, {
    body: t.Object({
        unitId: t.String(),
        disposition: t.String(),
        message: t.String(),
        apiKey: t.String(),
    })
  })
  .get("/incident/:id", getIncidentById)
  .get("/", error(401, "Unauthorized"))
  .listen(port);

console.log("running on port: " + port);

// USE CORS FOR COOKIES TO PERSIST
