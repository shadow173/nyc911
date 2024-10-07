import { eq } from 'drizzle-orm';
import { incidents } from '../db/schema';
import { db } from '../utils/db';

export async function createIncident({ body, cookie }:any){
    //perhaps have some different authentication cuz llama will just be doing this

    const { incidentType, description, textAddress, assignedUnits } = body
// addNoteToIncident if duplicate, of another call

try {
    // Check for existing incident
    const existingIncident = await db.select().from(incidents).where(
      eq(incidents.textAddress, textAddress)
    ).limit(1);

    if (existingIncident.length > 0) {
        // add note to incident
        

      // Incident exists, add a note or update as needed
      return { message: 'Incident already exists', incident: existingIncident[0] };
    } else {
      // Create new incident
      
    // check if a dupliate incident exists by text address and call type, if both are the same, just add a note to the current one

    // attempts to get a location using the google maps api
    // updates the coordinates, textAddress, streetNumber, route, sublocality for the incident after getting the google api
    // When displaying it use coordinates on map from googleapi
     // for the google maps api make sure to mention New York City
     return { message: 'New incident created', incident: newIncident[0] };

}
    // create the incident
    // if the incident is not a duplicate, create

} catch (error) {
    console.error('Error in createIncident:', error);
    throw new Error('Failed to process incident');
  }
}