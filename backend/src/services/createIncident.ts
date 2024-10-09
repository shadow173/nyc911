import { eq, sql } from 'drizzle-orm';
import { incidents } from '../db/schema';
import { db } from '../utils/db';
import { addNoteToIncident } from './addNoteToIncident';
import { getMapFromText } from './getMapFromText';
import { DateTime } from 'luxon';

type Incident = typeof incidents.$inferInsert;

// !!! IMPORTANT
/// add a check to make sure the unit is not on another assignment. if it is, close that assignment as marked. If they were redirected or called for the hire, the llama should have called the function removeunit or something like that which should 
// keep the job open

// and for ESU, do not assign the esu unit to bypass this feature. only assign if they state they are 84 or onscene

export async function createIncident({ body, cookie }:any){
  // Get current date in EST for the 'date' field (formatted as YYYY-MM-DD)
const currentDateInEST = DateTime.now().setZone('America/New_York').toFormat('yyyy-MM-dd');

// Get current timestamp in EST for the 'createdAt' field
const currentTimestampInEST = DateTime.now().setZone('America/New_York').toJSDate();
    //perhaps have some different authentication cuz llama will just be doing this

    const { incidentType, description, textAddress, assignedUnits, agencyType, severity } = body // agency type must be fire,pd or ems ONLY
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



      const mapObject = await getMapFromText(textAddress) // this returns relevant info.
      if (mapObject && mapObject.precinct && mapObject.latitude && mapObject.longitude) {
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

        if(patrolBoro && precinct && precinctAndSector && gid && id && node){
          const incident:Incident = {
            latitude: latitude,
            longitude: longitude,
            patrolBoro: patrolBoro,
            incidentType: incidentType,
            description: description,
            agencyType: agencyType, // must be fire, ems or pd,
            precinct: precinct,
            severity: severity,
            gid: gid,
            oid: id,
            nodeId: node,
            sector: precinctAndSector,
            textAddress: title,
            coordinates: [longitude,latitude],
            sublocality: neighbourhood,
            addressType: layer,
            status: 'active', //  add one for holding jobs. if ems unit was preempted ensure that it stays open
            date: currentDateInEST,
            createdAt: currentTimestampInEST,
            assignedUnits: assignedUnits // this needs to be an array when sent to the endpoint
          }
          const createdJobArray = await db.insert(incidents).values(incident).returning()
          const createdJob = createdJobArray[0]

          addNoteToIncident(createdJob.id, `JOB CREATED AT TIME: ${currentTimestampInEST}`)
          return { message: 'New incident created', incident: createdJob };

        }

      // Now I have an object of map information
      // now insert relevant info into the db!
        
        

    // When displaying it use coordinates on map from googleapi
     // for the google maps api make sure to mentwhyion New York City

     // when creating incident. note call that was entered with a timestamp
     // add a note for that, also add a note for the description of the call aswell
     // also make sure that when notes are displayed for the incident they are displayed in a chronological order starting from the creation time

}
}
    // create the incident
    // if the incident is not a duplicate, create

} catch (error) {
    console.error('Error in createIncident:', error);
    throw new Error('Failed to process incident');
  }
}

