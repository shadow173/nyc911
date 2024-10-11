import { db } from '../utils/db'; // Adjust the import path as necessary
import { incidents, incidentUpdates } from '../db/schema'; // Adjust the import path as necessary
import { eq, desc } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { sql } from 'drizzle-orm';

export async function addNoteToIncident(
    incidentID: number | null,
    noteToAdd: string,
    unitID?: string
  ): Promise<string> {
    try {
      let incidentIdToUse = incidentID;
        
      function arrayContains<T>(arrayColumn: any, value: T) {
        return sql`${arrayColumn} @> ARRAY[${value}]`;
      }
      
      if (incidentIdToUse === null && unitID) {
        // Find the most recent incident where the unit is assigned
        const incidentsResult = await db
          .select()
          .from(incidents)
          .where(arrayContains(incidents.assignedUnits, unitID))
          .orderBy(desc(incidents.createdAt))
          .limit(1);
  
        if (incidentsResult.length === 0) {
          return 'No incident found for the specified unit';
        }
  
        incidentIdToUse = incidentsResult[0].id;
      }
  
      if (incidentIdToUse === null) {
        return 'Incident ID or Unit ID must be provided';
      }
  
      // Check if the incident exists
      const incident = await db
        .select()
        .from(incidents)
        .where(eq(incidents.id, incidentIdToUse))
        .limit(1);
  
      if (incident.length === 0) {
        return 'Incident not found';
      }
  
      // Get current EST timestamp using Luxon
      const currentTimestampInEST = DateTime.now()
        .setZone('America/New_York')
        .toJSDate();
  
      // Insert new incident update
      await db.insert(incidentUpdates).values({
        incidentId: incidentIdToUse,
        message: noteToAdd,
        timestamp: currentTimestampInEST,
      });
      await db.update(incidents).set({ updatedAt: currentTimestampInEST}).where(eq(incidents.id, incidentIdToUse))
  
      return 'Note added to incident successfully';
    } catch (e) {
      console.error(e);
      return 'Error adding note to incident';
    }
  }
  