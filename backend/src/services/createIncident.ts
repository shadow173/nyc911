import { eq } from 'drizzle-orm';
import { incidents } from '../db/schema';
import { db } from '../utils/db';
import { addNoteToIncident } from './addNoteToIncident';
import { getMapFromText } from './getMapFromText';

export async function createIncident({ body, cookie }:any){
    //perhaps have some different authentication cuz llama will just be doing this

    const { incidentType, description, textAddress, assignedUnits } = body
// addNoteToIncident if duplicate, of another call
    let note:string = ""
try {
    // Check for existing incident
    const existingIncident = await db.select().from(incidents).where(
      eq(incidents.textAddress, textAddress)
    ).limit(1);

    
    if (existingIncident.length > 0) {
        // add note to incident
        note = "Duplicate job prevented from being added. Description: " + description
        addNoteToIncident(existingIncident[0].id, note)
      // Incident exists, add a note or update as needed
      return { message: 'Incident already exists', incident: existingIncident[0] };
    } else {
      
      
      // Create new incident
      
    // ADD !!!! attempts to get a location using an address validator api !!!


    // updates the coordinates, textAddress, streetNumber, route, sublocality for the incident after getting the api

      const mapObject = await getMapFromText(textAddress)
      // Now I have an object of map information
      

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