import { incidents } from "../db/schema"
import { db } from "../utils/db"
import logger from "../utils/logger"
import { eq } from "drizzle-orm"

export const setIncidentActive = async (incidentId: number):Promise<string> => {
    logger.info("Attempting to set incident to pending" + incidentId)
    try {
        await db.update(incidents).set({ status: "active"}).where(eq(incidents.id, incidentId))
        logger.info("Incident " + incidentId +  " sucessfully set as active.")
        return "Incident: " + incidentId + " sucessfully set as active. "

    } catch (e){
        logger.warn("Error setting incident as active" + e)
        return "Error setting incident active. Check logs for more information"
    }
}