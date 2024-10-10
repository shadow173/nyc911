import { addNoteToIncident } from "../services/addNoteToIncident";

export const addNoteUpdate = async ({ body, cookie }: any): Promise<object> => {
  // add authentication before all this!!
  // this is a very basic implementation
  const { unitId, noteDescription } = body;
  const addedNote = await addNoteToIncident(null, noteDescription, unitId);
  return {
    message: "Note added Successfully",
    addedNote: addedNote,
  };
};
