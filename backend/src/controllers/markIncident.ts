import { error } from "elysia";
import { addNoteToIncident } from "../services/addNoteToIncident";
import { checkAPIKey } from "../services/checkAPIKey";
import { closeIncident } from "../services/getLastUnitIncident";
import logger from "../utils/logger";

export const markIncident = async ({ body }: any) => {
    const { unitId, disposition, message, apiKey } = body;
    const checkedKey = await checkAPIKey(apiKey);

    if (checkedKey) {
        try {
            await addNoteToIncident(null, "Assignment marked and closed. Disposition: ", disposition);
            const incidentRemoved = await closeIncident(unitId, message);
            logger.info("Incident successfully closed: " + incidentRemoved);
            return { status: 200, incidentRemoved };
        } catch (e) {
            logger.warn("Error closing incident: " + e);
            return { status: 500, message: "There was an error in closing the incident. Check logs for more info" };
        }
    }

    logger.warn("Invalid key attempted to call close incident")
    return error(401, "Unauthorized");
};
