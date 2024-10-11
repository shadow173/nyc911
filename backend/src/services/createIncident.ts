import { eq, sql } from "drizzle-orm";
import { incidents } from "../db/schema";
import { db } from "../utils/db";
import { addNoteToIncident } from "./addNoteToIncident";
import { getMapFromText } from "./getMapFromText";
import { DateTime } from "luxon";
import {
  assignUnitToIncident,
  closeIncident,
  preemptUnit,
} from "./getLastUnitIncident";
import logger from "../utils/logger"; // Adjust the path accordingly
import { setIncidentActive } from "./setIncidentActive";
import { checkAPIKey } from "./checkAPIKey";
import { error } from "elysia";

type Incident = typeof incidents.$inferInsert;

export async function createIncident({ body }: any) {
  // Get current date in EST for the 'date' field (formatted as YYYY-MM-DD)
  const currentDateInEST = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");

  // Get current timestamp in EST for the 'createdAt' field
  const currentTimestampInEST = DateTime.now()
    .setZone("America/New_York")
    .toJSDate();

  const {
    incidentType,
    description,
    textAddress,
    assignedUnits,
    agencyType,
    severity,
    rerouted,
    apiKey
  } = body;

    if(!await checkAPIKey(apiKey)){
      logger.warn("Invalid key or no key attempted to create incident")
      return error(401, "Unauthorized")
    }
  logger.info("Creating new incident", {
    incidentType,
    textAddress,
    assignedUnits,
  });

  let note: string = "";
  try {
    // **First check**: Check for existing incident based on user-inputted 'inputAddress'
    const existingIncidentByInputAddress = await db
      .select()
      .from(incidents)
      .where(eq(incidents.inputAddress, textAddress)) // Use 'inputAddress' for the duplicate check
      .limit(1);

    if (existingIncidentByInputAddress.length > 0) {
      logger.warn("Duplicate incident detected based on input address", {
        textAddress,
      });

      // Add note to existing incident
      note = `Another unit assigned to same address. Description: ${description}\nCall Type: ${incidentType}`;
      await addNoteToIncident(existingIncidentByInputAddress[0].id, note);
      await setIncidentActive(existingIncidentByInputAddress[0].id)
      await Promise.all(
        assignedUnits.map((unitId: string) =>
          assignUnitToIncident(unitId, existingIncidentByInputAddress[0].id),
        ),
      );

      return {
        message: "Incident already exists",
        incident: existingIncidentByInputAddress[0],
      };
    } else {
      // Proceed to create new incident after further checks

      // Handle unit assignments based on 'rerouted' flag
      if (rerouted) {
        logger.info("Units are being rerouted off assignment", {
          assignedUnits,
        });
        await Promise.all(assignedUnits.map((unit: any) => preemptUnit(unit)));
      } else {
        logger.info("Closing previous incidents for units", { assignedUnits });
        await Promise.all(
          assignedUnits.map((unit: any) => closeIncident(unit)),
        );
      }

      // Fetch map data
      const mapObject = await getMapFromText(textAddress);
      if (
        mapObject &&
        mapObject.precinct &&
        mapObject.latitude &&
        mapObject.longitude
      ) {
        const {
          latitude,
          longitude,
          precinct,
          patrolBoro,
          precinctAndSector,
          title,
          layer,
          neighbourhood,
          gid,
          id,
          source,
          source_id,
          node,
        } = mapObject;

        if (node) {
          const existingIncidentByNode = await db
            .select()
            .from(incidents)
            .where(eq(incidents.nodeId, node))
            .limit(1);
          if (existingIncidentByNode.length > 0) {
            logger.warn("Duplicate incident detected based on node ID", {
              node,
            });

            note = `Duplicate incident at same location detected. Description: ${description}\nCall Type: ${incidentType}`;
            await addNoteToIncident(existingIncidentByNode[0].id, note);

            await Promise.all(
              assignedUnits.map((unitId: string) =>
                assignUnitToIncident(unitId, existingIncidentByNode[0].id),
              ),
            );

            return {
              message: "Incident already exists based on node ID",
              incident: existingIncidentByNode[0],
            };
          }
        }
        // **Second check**: Check for existing incident based on 'nodeId'
        // No duplicates found, create a new incident
        if (patrolBoro && precinct && precinctAndSector && gid && id && node) {
          const incident: Incident = {
            latitude: latitude,
            longitude: longitude,
            inputAddress: textAddress, // Include 'inputAddress' in the incident data
            patrolBoro: patrolBoro,
            incidentType: incidentType,
            description: description,
            agencyType: agencyType,
            precinct: precinct,
            severity: severity,
            gid: gid,
            oid: id,
            nodeId: node,
            sector: precinctAndSector,
            textAddress: title, // This is the formatted address from the map data
            coordinates: [longitude, latitude],
            sublocality: neighbourhood,
            addressType: layer,
            status: "active",
            date: currentDateInEST,
            createdAt: currentTimestampInEST,
            assignedUnits: assignedUnits,
          };

          const createdJobArray = await db
            .insert(incidents)
            .values(incident)
            .returning();
          const createdJob = createdJobArray[0];
          logger.info("New incident created", { incidentId: createdJob.id });

          await addNoteToIncident(
            createdJob.id,
            `JOB CREATED AT TIME: ${currentTimestampInEST}`,
          );
          await addNoteToIncident(
            createdJob.id,
            `UNIT(S) INITIALLY ASSIGNED: ${assignedUnits.join(", ")}`,
          );

          return { message: "New incident created", incident: createdJob };
        } else {
          logger.error("Required map data is missing", { mapObject });
          throw new Error("Required map data is missing");
        }
      } else {
        logger.error("Map information could not be retrieved", { textAddress });
        throw new Error("Map information could not be retrieved");
      }
    }
  } catch (error) {
    console.log(error);

    logger.error("Error in createIncident", {
      error,
      incidentType,
      textAddress,
    });
    throw new Error("Failed to process incident");
  }
}
