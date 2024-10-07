import { incidents } from "../db/schema"
import { db } from "../utils/db"
import { eq } from "drizzle-orm"
// non api route
// for API to add notes use the addNoteToIncidentWithAPI
export async function addNoteToIncident(incidentID: number, noteToAdd: string):Promise<string>{
    
    const id = incidentID
    const note = noteToAdd
    try { 
       const incident =  await db.select().from(incidents).where(eq(incidents.id, id)).limit(1)
        
       // not get the incident updates object or make a new one that refrences this incident. add the data
    
    } catch(e){
        console.log(e)
        return "error adding note to incident" 
    }
}
// not even sure if i need to return anything