
export const getMapFromText = async (textAddress: string):Promise<object> => {

    const newAddress = textAddress
    // To focus your search based upon a geographical area, such as the center of the user's map or at the device's GPS location, supply the parameters focus.point.lat and focus.point.lon. This boosts locally relevant results higher. For example, if you search for Union Square:
//     In this example, you want to find all YMCA locations within a 35-kilometer radius of a location in Ontario, Canada. This time, you can use the boundary.circle.* parameter group, where boundary.circle.lat and boundary.circle.lon is your location in Ontario and boundary.circle.radius is the acceptable distance from that location. Note that the boundary.circle.radius parameter is always specified in kilometers.

// /v1/autocomplete?text=YMCA&boundary.circle.lon=-79.186484&boundary.circle.lat=43.818156&boundary.circle.radius=35
    // make sure to search for intersections or streets not places
    try {
        // send to api, get info back
        // will implement that later
        const firstObjectReturned = await sendtoAPI(textAddress)
        const { coordinates } = firstObjectReturned.geometry;
    const {
      name,
      layer,
      neighbourhood,
      gid,
      id,
      source,
      source_id,
    } = firstObjectReturned.properties;

    return {
      coordinates,
      name,
      layer,
      neighbourhood,
      gid,
      id,
      source,
      source_id,
    };
  } catch (e) {
    console.error("Error getting address in getMapFromText.ts: " + e);
    return { error: "Error generating address!" };
  }
};