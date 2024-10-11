import { preemptUnit } from "../services/getLastUnitIncident";

export async function preemptUnitAPI({ body, cookie }: any) {
  // only for use when a unit is cancelled. If there is another assignment
  // they were called for call the createincident with the preempt flag
  const { unitId } = body;
  // add authentication before all this!!

  const preemptedResponse = await preemptUnit(unitId);
  return {
    status: 200,
    preemptedResponse,
  };
}
