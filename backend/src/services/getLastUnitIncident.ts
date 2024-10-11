import { desc, sql, eq } from "drizzle-orm";
import { archivedIncidents, incidents } from "../db/schema";
import { db } from "../utils/db";
import logger from '../utils/logger';
import { addNoteToIncident } from "./addNoteToIncident";
import { DateTime } from "luxon";


export async function getLastUnitIncidents(unitId: string) {
    logger.debug('Fetching all incidents for unit', { unitId });

    const unit = unitId
    function arrayContains<T>(arrayColumn: any, value: T) {
        return sql`${arrayColumn} @> ARRAY[${value}]`;
      }
      
        const incidentsResult = await db
          .select()
          .from(incidents)
          .where(arrayContains(incidents.assignedUnits, unit))
          .orderBy(desc(incidents.createdAt))

        if (incidentsResult.length === 0) {
            logger.info('No incidents found for unit', { unitId });

          return null
        } else{
            logger.debug('Incidents found for unit', { unitId, count: incidentsResult.length });

            return incidentsResult
        }
} // find only active incidents


// perhaps I should make an archived incidents section
// for incidents at the same address it will run a query for that incident, if the address is the same it will have an option to view call history at that location for the past month

export async function assignUnitToIncident(unitId: string, incidentId: number) {
    logger.info('Assigning unit to incident', { unitId, incidentId });
  
    try {
      // Fetch the incident to ensure it exists
      const [incident] = await db
        .select()
        .from(incidents)
        .where(eq(incidents.id, incidentId))
        .limit(1);
  
      if (!incident) {
        logger.warn('Incident not found', { incidentId });
        return 'Incident not found';
      }
  
      // Check if the unit is already assigned
      if (incident.assignedUnits.includes(unitId)) {
        logger.info('Unit already assigned to incident', { unitId, incidentId });
        return 'Unit already assigned to incident';
      }
      // Update the assignedUnits array
      await db
        .update(incidents)
        .set({
          assignedUnits: sql`array_append(${incidents.assignedUnits}, ${unitId})`,
          updatedAt: DateTime.now().setZone('America/New_York').toJSDate(),
        })
        .where(eq(incidents.id, incidentId));
  
      logger.info('Unit assigned to incident successfully', { unitId, incidentId });
  
      // Optionally, add a note to the incident
      await addNoteToIncident(incidentId, `Unit ${unitId} assigned to incident.`);
  
      return 'Unit assigned to incident successfully';
    } catch (error) {
      logger.error('Error assigning unit to incident', { error, unitId, incidentId });
      return 'Error assigning unit to incident';
    }
  }
// perhaps also make functionality to assign them to another units job by unit number aswell

// add note
// and also add note to assignedunit functionality
export async function preemptUnit(unitId: string):Promise<object> {
    logger.info('Preempting Unit from assignment: ' + unitId)
    const incidentToPreempt = await getLastUnitIncidents(unitId);
    if (incidentToPreempt) {
      await db.execute(
        sql`UPDATE incidents SET assigned_units = array_remove(assigned_units, ${unitId}) WHERE id = ${incidentToPreempt[0].id}`
      );
  
      if (incidentToPreempt[0].assignedUnits.length <= 1) {

        // Update the incident status to pending
        await db.update(incidents)
          .set({ status: 'pending' })
          .where(eq(incidents.id, incidentToPreempt[0].id));
        logger.info('Unit removed from assignment and incident moved to pending')
        const preemptedUnitMessage = "Unit " + unitId + " preempted from incident"
        await addNoteToIncident(incidentToPreempt[0].id, preemptedUnitMessage)
        return {
          message: "Incident updated to pending and unit removed from assignment."
        };
      }
  
      return {
        message: "Incident still active, other units on assignment, but unit was removed from assignment."
      };
    }
    logger.debug('No assignments found to preempt unit from: ', {unitId})
    return{
        message: "No incidents found to preempt unit from"
    }
  }

  export async function archiveIncident(incidentId: number): Promise<string> {
    logger.info('Archiving incident', { incidentId });

    try {
      // Start a transaction
      await db.transaction(async (tx) => {
        // Fetch the incident to be archived
        const [incident] = await tx
          .select()
          .from(incidents)
          .where(eq(incidents.id, incidentId))
          .limit(1);
  
        if (!incident) {
        logger.warn('Incident not found during archiving', { incidentId });
          throw new Error('Incident not found');
        }
  
        // Insert the incident into archived_incidents
        await tx.insert(archivedIncidents).values(incident);
  
        // Delete the incident from active incidents
        await tx.delete(incidents).where(eq(incidents.id, incidentId));
        logger.debug('Incident archived successfully within transaction', { incidentId });
      });
      logger.info('Incident archived successfully', { incidentId });
      return 'Incident archived successfully';
    } catch (error) {
    logger.error('Error archiving incident', { error, incidentId });
      return 'Error archiving incident';
    }
  }

  export async function closeIncident(unitId: string, message?: string) {
    logger.info('Closing incidents for unit', { unitId });
  
    // Fetch all incidents where the unit is assigned
    const incidentsToClose = await getLastUnitIncidents(unitId);
  
    if (incidentsToClose && incidentsToClose.length > 0) {
      const archivedIncidents = [];
  
      for (const incident of incidentsToClose) {
        logger.debug('Closing incident', { incidentId: incident.id });
  
        // Update the incident status to 'closed'
        await db
          .update(incidents)
          .set({ status: 'closed' })
          .where(eq(incidents.id, incident.id));
  
        // Add a note to the incident with the provided message
        const noteMessage = message
          ? message
          : 'Incident closed and archived.';
  
        await addNoteToIncident(incident.id, noteMessage);
  
        // Archive the incident
        const archiveResult = await archiveIncident(incident.id);
        logger.debug('Incident archived', { incidentId: incident.id, archiveResult });
  
        archivedIncidents.push({ incidentId: incident.id, result: archiveResult });
      }
  
      logger.info('All incidents closed and archived for unit', { unitId });
  
      return archivedIncidents;
    } else {
      logger.info('No incidents found to close for the specified unit', { unitId });
      return 'No incidents found to close for the specified unit.';
    }
  }
  

  // make function more abstract
  // make one basically to when unit gets a new call it automatically calls this with the unit id and if the unit is on a call it automatically sets the call for pending
  // otherwise if they mark it perhaps add another function or a flag

  // make a timer function aswell to remove calls for ems older than 8 hours old
// if a unit is called for another assignment not a hire I will assume they cleared that call and can go back in service