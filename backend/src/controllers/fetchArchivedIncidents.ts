import { archivedIncidents } from "../db/schema"
import { db } from "../utils/db"
import { eq } from "drizzle-orm"
import { sql } from 'drizzle-orm';
import logger from "../utils/logger";

export async function fetchArchivedIncidents({ body }: any) {
  const { coordinates } = body; // Assuming latitude and longitude are provided in the request body

  // Check if coordinates exist and are a valid array of two numbers
  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    typeof coordinates[0] !== 'number' ||
    typeof coordinates[1] !== 'number'
  ) {
    logger.error("Invalid coordinates provided! ")
    throw new Error('Invalid coordinates: Please provide an array with two numeric values [longitude, latitude].');
  }

  // Fetch incidents with matching coordinates using the SQL point type
  const pastIncidents = await db
    .select()
    .from(archivedIncidents)
    .where(
      eq(archivedIncidents.coordinates, sql`point(${coordinates[0]}, ${coordinates[1]})`)
    );
  return pastIncidents;
}