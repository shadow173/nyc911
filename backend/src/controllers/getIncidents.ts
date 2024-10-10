import { incidents } from "../db/schema";
import { db } from "../utils/db";
import logger from "../utils/logger";

export const getIncidents = async (): Promise<object> => {
  // implement authentication
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
