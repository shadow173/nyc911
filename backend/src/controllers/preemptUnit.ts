import { error } from "elysia";
import { checkAPIKey } from "../services/checkAPIKey";
import { preemptUnit } from "../services/getLastUnitIncident";
import logger from "../utils/logger";

export async function preemptUnitAPI({ body }: any) {
  // only for use when a unit is cancelled. If there is another assignment
  // they were called for call the createincident with the preempt flag
  const { unitId, apiKey } = body;

  const checkedAPI = checkAPIKey(apiKey)

  if(checkedAPI){
    try {
      const preemptedResponse = await preemptUnit(unitId);
      return {
        status: 200,
        preemptedResponse,
      };
    } catch (e) {
      logger.error("Error in preemptUnitAPI: " + e);
      return {
        status: 500,
        message: "Error preempting unit. Please check the logs for more information.",
      };
    }
  } else {
    logger.warn("Invalid or no Api key for preempt unit")
    return error(401, "Unauthorized")

  }
}
