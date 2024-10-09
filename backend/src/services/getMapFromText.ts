import { sql } from "drizzle-orm";
import { precincts } from "../db/schema";
import { db } from "../utils/db";
import type { StringMappingType } from "typescript";

interface PrecinctInfo {
  precinct: string | null;
  patrolBoro: string | null;
  precinctAndSector: string | null;
}
interface Map {
  latitude: number | null,
  longitude: number | null,
  precinct: string | null,
  patrolBoro: string | null,
  precinctAndSector: string | null,
  title: string | null,
  layer: any,
  neighbourhood: string | null,
  gid: string | null,
  id: string | null,
  source: string | null,
  source_id: string | null,
  node: string | null,
  error?: string; //  optional
}

export const sendToMapsAPI = async (address: string) => {
  // let API_URL = process.env.MAPS_API_URL!;
  let API_URL = process.env.TEST_MAPS_API!;
  let API_KEY = process.env.MAPS_API_KEY!;
  const focusLat = "40.709069";
  const focusLong = "-73.924988"; // iput this to somewhere in brooklyn. should work well for now
  const encodedAddress = encodeURIComponent(address);

  // Check if the address contains an '&' sign and set the layers accordingly
  const layers = address.includes("&")
    ? "intersection"
    : "venue,address,intersection";

  API_URL += `/autocomplete?api_key=${API_KEY}&focus.point.lat=${focusLat}&focus.point.lon=${focusLong}&text=${encodedAddress}&size=1&layers=${layers}`; // for use with geocode.earth

  // API_URL += `/autocomplete?focus.point.lat=${focusLat}&focus.point.lon=${focusLong}&text=${encodedAddress}&size=1&layers=${layers}`;
  const response = await fetch(API_URL);
  console.log("fetching: " + API_URL);
  const body = await response.json();

  return body;
};

export const getPrecinctFromCoordinates = async (latitude: number, longitude: number): Promise<PrecinctInfo | null> =>{
  const lat = latitude
  const long = longitude
  try {
    const result = await db
      .select({
        precinct: precincts.precinct,
        patrolBoro: precincts.patrolBoro,
        precinctAndSector: precincts.precinctAndSector,
      })
      .from(precincts)
      .where(
        sql`ST_Contains(
          ${precincts.geometry},
          ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326)
        )`
      )
      .limit(1);

    if (result.length > 0) {
      return result[0];
    } else {
      console.warn('No precinct found for the given coordinates.');
      return null;
    }
  } catch (err: any) {
    console.error(`Error executing search query: ${err.message}`);
    throw err;
  }
};


export const getMapFromText = async (textAddress: string): Promise<Map> => {
  try {
    // Send to API and get information back (placeholder for now)
    const firstObjectReturned = await sendToMapsAPI(textAddress);

    if (firstObjectReturned.features && firstObjectReturned.features.length > 0) {
      const firstFeature = firstObjectReturned.features[0];
      const { coordinates } = firstFeature.geometry;
      const { name, layer, neighbourhood, gid, id, source, source_id } = firstFeature.properties;

      // Extract the 'n' value from the id
      const nodeMatch = id.match(/n(\d+)/);
      const node = nodeMatch ? nodeMatch[1] : null; // Extracts the 'n' value if it exists

      // Coordinates are reversed in the array
      const latitude = coordinates[1];
      const longitude = coordinates[0];

      // Get precinct data
      const precinctData = await getPrecinctFromCoordinates(latitude, longitude);

      if (precinctData) {
        const { precinct, patrolBoro, precinctAndSector } = precinctData;

        return {
          latitude,
          longitude,
          precinct,
          patrolBoro,
          precinctAndSector,
          title: name || "N/A", // Fallback to "N/A" if the title is missing
          layer: layer || "N/A",
          neighbourhood: neighbourhood || "N/A",
          gid: gid || "N/A",
          id: id || "N/A",
          source: source || "N/A",
          source_id: source_id || "N/A",
          node: node || "N/A", // Include the extracted 'node' value in the return object
        };
      } else {
        throw new Error("Not a NYC address. Unable to find precinct data!");
      }
    } else {
      throw new Error("Error, no results found for that address");
    }
  } catch (e) {
    console.error("Error getting address in getMapFromText.ts: " + e);
    return {
      latitude: null,
      longitude: null,
      precinct: null,
      patrolBoro: null,
      precinctAndSector: null,
      title: null,
      layer: null,
      neighbourhood: null,
      gid: null,
      id: null,
      source: null,
      source_id: null,
      node: null, // Return null for node if there's an error
      error: e instanceof Error ? e.message : "Error generating address!", // Properly returning the error message
    };
  }
};

console.log(await getMapFromText("W 34 and 6"));
