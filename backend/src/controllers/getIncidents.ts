import { error } from "elysia";
import { archivedIncidents, incidents, incidentUpdates } from "../db/schema";
import { db } from "../utils/db";
import { verifyToken, verifyTokenAndActive } from "../utils/jwt";
import logger from "../utils/logger";
import { eq } from 'drizzle-orm'

export const getIncidents = async ({ cookie, request }:any): Promise<object> => {
  // implement authentication
  const token = cookie.token?.value || request.headers.get('authorization')?.split(' ')[1];
  if(!verifyTokenAndActive(token)){
    return error(401, "Unauthorized")
  }

  try {
    logger.info("Fetching incidents");
    const result = await db.select().from(incidents);
    return {
      status: 200,
      result,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const getIncidentById = async ({cookie, params}:any) => {
// also return premise history for all incidents previously at that location with the option to view those incidents

  const { id } = params
  const token  = cookie.token.value
  
  // verify token first

  if(!verifyTokenAndActive(token)){
    return error(401, "Unauthorized")
  }

  try{
    // perhaps add functionality to search for nearby calls that were recently generated. Possibly to find duplicate incidents
    // if found alert user.. if not then return nothing extra
    const result = await db.select().from(incidents).where(eq(incidents.id, id))
    const [currentIncident] = result
    if(!currentIncident){
      return {message: "No incidents found with that ID"}
    }
    const updates = await db.select().from(incidentUpdates).where(eq(incidentUpdates.incidentId, id))
    const archived = await db.select().from(archivedIncidents).where(eq(archivedIncidents.nodeId, currentIncident.nodeId))
    if(archived?.length > 0) { // if true previous incidents exist for that location
      return { incident: currentIncident, incidentUpdates: updates, premiseHistoryFound: true, premiseHistory: archived}

    }
    return { incident: currentIncident, incidentUpdates: updates, premiseHistoryFound: false}
  } catch(e){
    error(500, "Internal Server Error. Error fetching incident")
    logger.error("Error when searching for incident "+ e)
  }
  



}