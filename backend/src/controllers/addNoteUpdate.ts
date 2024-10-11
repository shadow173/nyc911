import { error } from "elysia"
import { addNoteToIncident } from "../services/addNoteToIncident"
import { checkAPIKey } from "../services/checkAPIKey"
import logger from "../utils/logger"



export const addNoteUpdate = async ({body}:any): Promise<object> => {
// add authentication before all this!!
// this is a very basic implementation
    const { unitId, note, apiKey } = body
    if(!(await checkAPIKey(apiKey))){
        logger.error("Invalid key or no key attempted to add note to incident.")
        return error(401, "Unauthorized")
    }
    try{
        const addedNote = await addNoteToIncident(null, note, unitId)
        logger.info("Note added to incident")
       return {
        message: addedNote
       }
    } catch (e){
        logger.warn("Error in addNoteUpdate: " + e)
        return {message: "Error adding note to incident. Check logs for more info"}
    }
  
}

