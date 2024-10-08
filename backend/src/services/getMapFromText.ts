export const sendToMapsAPI = async (address: string) => {
  let API_URL = process.env.MAPS_API_URL!;
  const focusLat = "40.709069";
  const focusLong = "-73.924988"; // iput this to somewhere in brooklyn. should work well for now
  const encodedAddress = encodeURIComponent(address);
  API_URL += `/autocomplete?focus.point.lat=${focusLat}&focus.point.lon=${focusLong}&text=${encodedAddress}&size=1`;
  const response = await fetch(API_URL);
  console.log("fetching: " + API_URL);
  const body = await response.json();

  return body;
};

export const getMapFromText = async (textAddress: string): Promise<object> => {
  const newAddress = textAddress;
  // make sure to search for intersections or streets not places
  try {
    // send to api, get info back
    // will implement that later
    const firstObjectReturned = await sendToMapsAPI(newAddress);
    if (
      firstObjectReturned.features &&
      firstObjectReturned.features.length > 0
    ) {
      const firstFeature = firstObjectReturned.features[0];
      const { coordinates } = firstFeature.geometry;
      const { name, layer, neighbourhood, gid, id, source, source_id } =
        firstFeature.properties;
      // for some reason the api returns them in an array reversed. very odd but ok
      const latitude = coordinates[1];
      const longitude = coordinates[0];
      return {
        latitude,
        longitude,
        name,
        layer,
        neighbourhood,
        gid,
        id,
        source,
        source_id,
      };
    } else {
      throw new Error("Error, no results found for that address");
    }
  } catch (e) {
    console.error("Error getting address in getMapFromText.ts: " + e);
    return { error: "Error generating address!" };
  }
};
console.log(await getMapFromText("West 57 and 6"));
