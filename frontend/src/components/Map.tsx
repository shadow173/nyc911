'use client'
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../app/map.module.css'
import { FeatureCollection, Feature, Point } from 'geojson';

import { useRef, useEffect, useState } from 'react'
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';

interface Incident {
    id: number;
    latitude: number;
    longitude: number;
    inputAddress: string;
    createdTimestamp: string;
    updatedTimestamp: string;
    addressType: string;
    patrolBoro: string;
    incidentType: string;
    description: string;
    agencyType: string;
    precinct: string;
    severity: string;
    gid: string;
    oid: string;
    nodeId: string;
    sector: string;
    textAddress: string;
    coordinates: [number, number]; // [longitude, latitude]
    sublocality: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    assignedUnits: string[];
  }
  interface IncidentProperties {
    id: string;
    agencyType: string;
    severity: string;
    status: string;
  }
  
  interface MapProps {
    incidents: Incident[];
    selectedIncidentId: number | null;
    onSelectIncident: (incidentId: number) => void;
  }
  
  export default function Map({ incidents, selectedIncidentId, onSelectIncident }: MapProps) {
    console.log("Map component rendering");

    const [sourcesLoaded, setSourcesLoaded] = useState(false);

    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const publicMapsToken = process.env.NEXT_PUBLIC_MAPS_API_KEY!;
    console.log(publicMapsToken)

    

    useEffect(() => {
        console.log("Map useEffect running");

        if (!mapContainerRef.current) return;
        console.log("Map useEffect running");

            mapboxgl.accessToken = publicMapsToken;
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                // Add other necessary options here, like style, center, zoom, etc.
                style: 'mapbox://styles/d4nkk/cm2i5zi6l00hc01pdf8dn8l9c',
                center: [-73.936151, 40.735609],
                zoom: 12
            }); 
        // make const incidents: GeoJSON.FeatureCollection ={

        const places: GeoJSON.FeatureCollection ={
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "description": "102A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.82876277173663,
                    40.6933066872526
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "102B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8550324318208,
                    40.686675556634455
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "102C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.82855228725722,
                    40.70686599352488
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "102D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.85189097412699,
                    40.700217479745476
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "104A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8813803019386,
                    40.6980524350711
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "013B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99282010409294,
                    40.73845977570744
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "104B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90264071749942,
                    40.70394019665445
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "104C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9069276219408,
                    40.72120102537441
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "104D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8820003347428,
                    40.7175041694168
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "105A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.7508818255743,
                    40.657634744005534
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "110D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.87328712093114,
                    40.74157793380963
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "105B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.7412576875074,
                    40.675936974897546
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "105C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.73582355292324,
                    40.6946699322659
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "110G"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.861442427556,
                    40.74213750283041
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "110J"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8444631251066,
                    40.74743328278405
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "013C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99079412547432,
                    40.74329482268097
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "105D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.74116973042409,
                    40.719002073224964
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "107C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.80455658395832,
                    40.71245981528909
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "105E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.71717362906317,
                    40.74107469838722
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "111D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.77671730824615,
                    40.76789344314171
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "107B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.7722738956564,
                    40.72943716623359
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "107A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.79515535063,
                    40.72755451893724
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "071C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95502034851098,
                    40.659432239441756
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "107D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.82066100377554,
                    40.72963781133889
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "108C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90581595878479,
                    40.746676501421845
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "071B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93844928028945,
                    40.666538034517565
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "108B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93249900749963,
                    40.74008752028984
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "014A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9810023387059,
                    40.74945868551819
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "014B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98873532124999,
                    40.748145843611
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "108D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91128564425884,
                    40.73385421354238
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "110A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88314779415774,
                    40.73802235188274
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "014D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98906354921677,
                    40.75279095325454
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "014E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98652352080086,
                    40.75627836159227
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "014C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99460698901291,
                    40.75062065311867
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "111A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.75127527797989,
                    40.74088401021719
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "111B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.73849919536502,
                    40.763656938044505
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "111C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.77335405038987,
                    40.75159170984283
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "112A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.84874675504528,
                    40.71565052936567
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "112B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86354832359702,
                    40.725027825543435
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "112C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.85451009462635,
                    40.733674245866304
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "020B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97956558202156,
                    40.780139346344455
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "112D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.83982461033877,
                    40.72426001391619
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "121A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.16749290921301,
                    40.631351272713204
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "013D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97855347358558,
                    40.73873265376952
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "121B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.13960022475122,
                    40.62346747023191
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "121C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.1671242016126,
                    40.60711672901995
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "121D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.17628119146923,
                    40.58235402764856
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "013A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98113624607292,
                    40.73354096458514
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "017A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97597595967306,
                    40.74596827319425
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "017B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96994975715249,
                    40.75250304515612
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "017C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9649576719843,
                    40.75813230355389
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "018A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97383251860079,
                    40.758818488499884
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "018B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98022485036608,
                    40.759816283496924
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "018C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98610382508863,
                    40.762288627817966
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "018E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98462173126799,
                    40.767550315678434
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "018D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99415412803683,
                    40.76490584384242
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "019A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96383927094314,
                    40.763903557715054
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "019B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9584808322374,
                    40.76931995757998
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "078D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97391035253926,
                    40.67947346932562
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "019D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95046224608828,
                    40.78112767305776
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "001A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00571686229443,
                    40.70847102423117
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "001B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.01923551218411,
                    40.69615425676642
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "020C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97868622218759,
                    40.78549666366046
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "078E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98169337281375,
                    40.66829928468452
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "001C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.0109845356081,
                    40.71623134129987
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "001D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00460814918075,
                    40.72523856575664
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "020A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98555871365012,
                    40.77428850889988
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "024C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96426766012978,
                    40.799164229632716
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "022A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97613241630447,
                    40.76816559844484
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "022B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97299234304178,
                    40.771880139972694
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "022C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97008642171787,
                    40.77648905366888
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "022D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96392397788229,
                    40.78468014736729
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "022E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95672496768074,
                    40.79458695390833
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "024B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96962696811394,
                    40.791258018939644
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "024A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97391932252772,
                    40.79688737797216
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "026A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96057044541844,
                    40.80661505889321
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "026C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9628034755508,
                    40.81164145331389
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "026E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95280392795885,
                    40.816731256900326
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "045A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8220324072799,
                    40.82058163616571
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "045B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.82951443459747,
                    40.84483205501139
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "045C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.80627005130485,
                    40.868695183475104
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "049A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.85312009720705,
                    40.84886161563001
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "049B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.85906986423585,
                    40.859240002005976
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "005C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9973851384065,
                    40.72023652346491
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "019C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95449253652592,
                    40.77542983115769
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "049C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.84983653772474,
                    40.86499216774959
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "050A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89735151271908,
                    40.8775741816008
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "061B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9606611967701,
                    40.59666465954824
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "050B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89215857960059,
                    40.89283817522445
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "066C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99778179951106,
                    40.638194880842825
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "050C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90855127672519,
                    40.89566451332415
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "005A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99881541429313,
                    40.71272403724115
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "005B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9923016753126,
                    40.719648465619095
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "061A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95993335553717,
                    40.60613320874193
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "062B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.983635589343,
                    40.6097857348423
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "062D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98728391071909,
                    40.59842892060343
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "071D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93975212303211,
                    40.65999671547308
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "062C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00657154824312,
                    40.60365488973307
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "062A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99760149833018,
                    40.61576033289694
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "066A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97319231871222,
                    40.61992118610425
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "066B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98708157536863,
                    40.631419344642715
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "066D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97636533675696,
                    40.641235156835826
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "068A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.02817733124448,
                    40.61406502676387
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "068B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.01062703883498,
                    40.62371807351463
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "068C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.03025040141515,
                    40.62737843860253
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "078A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98759498842946,
                    40.67474571548654
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "068D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.02590532139399,
                    40.63540766096882
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "006A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99788002862392,
                    40.72955787964545
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "006B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99727994063669,
                    40.73526239519845
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "006C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00332260962068,
                    40.73273684483533
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "006D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.0084277251856,
                    40.73568524667782
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "078G"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96993362809177,
                    40.66419088494738
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "007A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98495249519392,
                    40.71200370732609
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "007B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.985422847285,
                    40.71573608818686
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "007C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98182585863789,
                    40.718714686550086
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "108A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94933082437066,
                    40.74665784980461
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "101A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.74916520255734,
                    40.59905529432037
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "101D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.78234633832962,
                    40.59856696803604
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "103A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.80058867561523,
                    40.70511230415784
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "103B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.7703148997074,
                    40.71293073940943
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "103C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8036418545709,
                    40.69363434109178
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "103D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.77821543850624,
                    40.70306340413472
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "106A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.84082400988007,
                    40.65914788096634
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "079A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94694662129896,
                    40.68104939427423
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "106B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.83823380526606,
                    40.67428698727301
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "106C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.82396743730199,
                    40.6842893694581
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "106D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.81158445514134,
                    40.67427321033852
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "048D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.87958062455758,
                    40.84126142416549
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "109A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.81474745610355,
                    40.74695484776296
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "109B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8172980553636,
                    40.758342819094175
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "109C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8345890663995,
                    40.77861587747453
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "109D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.80031032767,
                    40.7820379812538
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "010A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.0040877869003,
                    40.74329415686221
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "010B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00184481698894,
                    40.748353586182894
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "010C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00011781744094,
                    40.75673540530618
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "113B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.76832932994576,
                    40.675752275646346
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "113A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.78809637887728,
                    40.64726633737856
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "113C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.78057095968103,
                    40.68724628044513
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "113D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.75765901031087,
                    40.69650387758788
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "114A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90908965058293,
                    40.75939789217793
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "114C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92705295840818,
                    40.76090926099573
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "114B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90063777819961,
                    40.780725014151784
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "115B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88606770596506,
                    40.761443908772996
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "114D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93977551165054,
                    40.76500452425779
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "115A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8712593129165,
                    40.770167015494536
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "115C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88836970769746,
                    40.75131895084252
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "115D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86687249245223,
                    40.75352921779035
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "120C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.10766472479445,
                    40.620196845983784
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "122A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.1368412978617,
                    40.55881582804415
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "123B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.21850148035118,
                    40.513137777617764
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "123A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.22196811029887,
                    40.53724187875848
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "123C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.18308856742023,
                    40.54985464826313
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "033C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93498998282212,
                    40.84311561258604
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "122B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.09613716891954,
                    40.57936061447683
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "122C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.10014822699803,
                    40.59585183802628
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "023A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94106399597405,
                    40.7882464575901
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "023B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94632985617773,
                    40.79018222339435
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "023C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95066483240332,
                    40.79201464081136
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "023D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94089947269721,
                    40.79577122009467
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "025A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93282829347744,
                    40.797877613729355
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "025C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93985719174185,
                    40.807145326016524
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "028D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94647034751165,
                    40.80666975452444
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "028B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95561504878707,
                    40.803540684851534
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "028C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95191070888035,
                    40.80859440967976
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "030A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95395571379824,
                    40.82115447665566
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "030B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94695157039548,
                    40.82516695167806
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "067C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92421682643617,
                    40.658410596168714
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "025D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92592735097755,
                    40.79284425509107
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "028A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95016938972658,
                    40.801016992775175
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "030C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9496101189259,
                    40.82846723441738
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "032A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94536719713709,
                    40.81185610885565
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "032C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93975889671565,
                    40.81527789695048
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "033B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94543639660593,
                    40.83845654480455
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "032D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93725633860802,
                    40.82548481733305
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "032B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94391363583179,
                    40.81900809376761
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "033A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94016107727275,
                    40.8354002628494
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "033D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94239661716277,
                    40.84648754684332
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "034A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92918507944208,
                    40.853017542584816
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "040B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92515386636684,
                    40.8113500051834
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "034B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9361127193507,
                    40.85715622736404
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "034C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92367944943453,
                    40.86124372087422
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "034D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92207491680342,
                    40.86986534891324
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "042A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89848194903811,
                    40.83790369516987
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "040A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91206455782417,
                    40.80559853312923
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "040D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90702874809837,
                    40.817300237352626
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "040C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91651649901917,
                    40.81930599794065
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "041B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89120120452604,
                    40.8099246291524
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "079C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94769381508989,
                    40.691800785454575
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "041A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.87855572536392,
                    40.81084443056594
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "041C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89905156722476,
                    40.818665859777106
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "041D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89101439634615,
                    40.82292425132656
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "088A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96289677448269,
                    40.6845445071845
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "042B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88980355736861,
                    40.832418341196494
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "042C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90888596637654,
                    40.827877572348534
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "042D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90297153677956,
                    40.82532956135605
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "043A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8644373298071,
                    40.816340944381295
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "043D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86802167018799,
                    40.83091721897359
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "088B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96489207946043,
                    40.6930948473155
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "043B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.84990057278223,
                    40.8242275268481
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "043C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.87889383199195,
                    40.829726592400895
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "043E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.85904581108461,
                    40.837030193469936
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "044A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92662057749439,
                    40.82390182722247
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "044B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9281102547038,
                    40.833971534711935
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "044C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91728756000286,
                    40.830757764151045
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "044D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9228688556471,
                    40.84171275229253
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "044E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91168642339744,
                    40.839870327009955
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "046B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89886214941572,
                    40.85527161230029
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "046A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90729428818268,
                    40.848230677007365
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "046C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90215705531229,
                    40.857639312788876
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "067E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92099817153604,
                    40.64780081205729
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "046D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91244003549455,
                    40.85133179269773
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "046E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91817609223014,
                    40.85286095286429
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "047A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86263360663132,
                    40.881355732056726
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "088D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97408055635017,
                    40.68821316893872
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "047D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.84493112681568,
                    40.87413625758221
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "047C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8357056949846,
                    40.8861945981161
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "048C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89302766879374,
                    40.845647009883706
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "047B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86188325188749,
                    40.89634931688787
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "048A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.8859049899741,
                    40.859717320413175
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "048B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88924717894047,
                    40.85234277413293
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "052A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90665721475082,
                    40.864959233662326
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "052B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89326223416245,
                    40.86593557102258
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "052C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88836755490702,
                    40.87426197384608
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "070D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96335763192089,
                    40.647962225341466
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "052D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.87701238700903,
                    40.86383107398876
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "060A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96115402057282,
                    40.57767327420591
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "063D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93021157407911,
                    40.63221703652916
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "060B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98019286948511,
                    40.58663034056912
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "067A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94963781264572,
                    40.64935030469936
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "071A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95532539193393,
                    40.667128671208594
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "060C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97691320547077,
                    40.577235827314944
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "067B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94425511700733,
                    40.638226655445166
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "067D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93585736487263,
                    40.64647570347618
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "060D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.998612398728,
                    40.57603840745392
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "063C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92477332616423,
                    40.62157251916901
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "063A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90868566612639,
                    40.616251847561436
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "063B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90466103669712,
                    40.599076506058545
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "069A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90576837497963,
                    40.64666984902014
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "069C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90828163526695,
                    40.635886999268
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "069B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88984705268903,
                    40.63845891368847
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "070A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95482699845999,
                    40.61942026372233
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "070B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96006206057638,
                    40.631542481804715
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "070C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96129555394661,
                    40.63876742938463
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "072A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98723237580906,
                    40.65508703194269
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "072B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.01231541092254,
                    40.65413522229134
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "072C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00768738306151,
                    40.647036030166475
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "072D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.01189141893171,
                    40.64048798716187
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "073A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91074583248775,
                    40.67933456839727
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "073B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91669031399655,
                    40.67067988919694
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "073C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9055395132307,
                    40.66696261111545
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "073D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90967790324999,
                    40.65895274856345
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "079B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95032700465632,
                    40.68620597928414
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "075A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88000130028158,
                    40.68328950676809
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "075B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89205941523136,
                    40.66972060240105
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "076D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.00469955844507,
                    40.672639311365685
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "075C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86862565764311,
                    40.66986593561628
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "075D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.88334106373024,
                    40.66019237965817
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "076C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.01210558710443,
                    40.67661531106363
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "077D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92762242255039,
                    40.67213811910749
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "076A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.0000922441301,
                    40.68395462577955
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "076B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99190733496718,
                    40.680278147017106
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "077A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.96193261638639,
                    40.675946669820775
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "077B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95032908523626,
                    40.67410967791696
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "077C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93944641945306,
                    40.67378186455847
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "079D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95152259286594,
                    40.6965960756308
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "081A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9349202687766,
                    40.69347174931802
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "081B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92748861321182,
                    40.68764335817779
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "081C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93364786460845,
                    40.68249816039999
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "081D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92268493210668,
                    40.680454846432006
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "083A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.90661239347631,
                    40.68744541007667
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "083B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.91706571989796,
                    40.69402411647103
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "083C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9302716239547,
                    40.6983992021168
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "083D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.92048974907257,
                    40.70288212246202
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "090B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95622491878021,
                    40.70354510941497
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "084A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99441770802615,
                    40.6953565759232
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "084B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98610698884913,
                    40.70095460690479
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "084C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98474625631737,
                    40.69110391045812
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "084D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98542768589645,
                    40.68569217576829
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "088C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97295571408148,
                    40.69886352375131
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "090A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9607202775997,
                    40.71150576288253
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "090C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.94462142142574,
                    40.70841867792007
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "090D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93181882979103,
                    40.71089800795235
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "094B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93856980984262,
                    40.722667673776435
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "094A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95634392527306,
                    40.72041633019305
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "094C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.95219308422688,
                    40.731153924106344
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "009A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.97877954173937,
                    40.723410893908934
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "009B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98070481543127,
                    40.72771786231136
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "009D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.98774788250245,
                    40.73079972039728
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "009C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.99112914290868,
                    40.72641765005027
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "101C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.76806103278108,
                    40.59522227842785
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "069D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.877113643052,
                    40.62266384503094
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "100C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.89011132951785,
                    40.564125638095895
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "075E"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.86959790168122,
                    40.64628660378987
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "101B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.75856412918668,
                    40.60741427395764
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "100B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.82324398478558,
                    40.610739879698464
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "100A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.80021085257194,
                    40.59175186531134
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "025B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93863400544836,
                    40.800682499390604
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "061C"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.93610102368694,
                    40.59773600442083
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "061D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -73.9421766394692,
                    40.58490555012129
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "120A"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.11087389838309,
                    40.636180070413126
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "120B"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.08380535777897,
                    40.64024109786192
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "description": "120D"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    -74.07380299312548,
                    40.61560385674315
                  ]
                }
              }
            ]
          }
          mapRef.current.on('style.load', () => {
            if (!mapRef.current) return;
      
            const imagesToLoad = [
                { name: 'staroflife', url: '/staroflife.png' },
                { name: 'staroflife-gray', url: '/staroflife-gray.png' },
                { name: 'staroflife-red', url: '/staroflife-red.png' },
                { name: 'pd-blue', url: '/pd-blue.png' },
                { name: 'pd-red', url: '/pd-red.png' }
              ];
      
            let loadedImages = 0;
            imagesToLoad.forEach(img => {
              console.log(`Loading image: ${img.url}`);
              mapRef.current!.loadImage(img.url, (error, image) => {
                if (error) {
                  console.error(`Error loading image ${img.name}:`, error);
                  return;
                }
                if (image && mapRef.current) {
                  mapRef.current.addImage(img.name, image);
                  console.log(`Image loaded and added: ${img.name}`);
                }
                loadedImages++;
                if (loadedImages === imagesToLoad.length) {
                  console.log('All images loaded, adding sources and layers');
                  addSourcesAndLayers();
                }
              });
            });
      
            function addSourcesAndLayers() {
              if (!mapRef.current) return;
      
              // Add sources
              mapRef.current.addSource('places', {
                type: 'geojson',
                data: places // Ensure 'places' is defined or imported
              });
      
              mapRef.current.addSource('incidents', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: [],
                },
              });
      
              // Add places layer first
              mapRef.current.addLayer({
                id: 'poi-labels',
                type: 'symbol',
                source: 'places',
                minzoom: 11.9,
                paint: {
                  "text-color": "#000000"
                },
                layout: {
                  'text-field': ['get', 'description'],
                  'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                  'text-radial-offset': 0.5,
                  'text-justify': 'auto',
                }
              });
              console.log("PLACESS ADDDDDDDDDDDDDDDDDDDDDDDDDDED")
              // Add incidents layer on top of places layer
              mapRef.current.addLayer({
                id: 'incidents-layer',
                type: 'symbol',
                source: 'incidents',
                layout: {
                  'icon-image':[
                    'case',
                    ['==', ['get', 'status'], 'pending'], 'staroflife-gray',
                    ['all', ['==', ['get', 'agencyType'], 'ems'], ['==', ['get', 'severity'], 'critical']], 'staroflife-red',
                    ['==', ['get', 'agencyType'], 'ems'], 'staroflife',
                    ['all', ['==', ['get', 'agencyType'], 'pd'], ['==', ['get', 'severity'], 'critical']], 'pd-red',
                    'pd-blue'
                  ], // Use a fixed icon name
                  'icon-size': 0.14,
                  'icon-allow-overlap': true,
                },
              });
      
              console.log('Layers added');
              setSourcesLoaded(true); // Add this line
              addEventListeners();
            }
      
            function addEventListeners() {
              if (!mapRef.current) return;
      
              mapRef.current.on('click', 'incidents-layer', (e) => {
                if (e.features && e.features.length > 0 && e.features[0].properties) {
                  const incident = e.features[0].properties;
                  onSelectIncident(incident.id as number);
                }
              });
      
              mapRef.current.on('mouseenter', 'incidents-layer', () => {
                if (mapRef.current) mapRef.current.getCanvas().style.cursor = 'pointer';
              });
      
              mapRef.current.on('mouseleave', 'incidents-layer', () => {
                if (mapRef.current) mapRef.current.getCanvas().style.cursor = '';
              });
      
              console.log('Event listeners added');
            }
          });
      
          return () => {
            if (mapRef.current) {
              mapRef.current.remove();
            }
          };
        }, []);
      
        // Update incidents data
        useEffect(() => {
            if (!mapRef.current || !sourcesLoaded) return;
          
            const source = mapRef.current.getSource('incidents') as GeoJSONSource;
            if (source) {
                const features: Feature<Point, IncidentProperties>[] = incidents.map((incident) => ({
                    type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [incident.longitude, incident.latitude],
                },
                properties: {
                  id: incident.id.toString(),
                  agencyType: incident.agencyType.toLowerCase(),
                  severity: incident.severity.toLowerCase(),
                  status: incident.status.toLowerCase(),
                },
              }));
          
              const data: FeatureCollection<Point, IncidentProperties> = {
                type: 'FeatureCollection',
                features: features,
              };
          
              console.log('Updating incidents source with data:', data);
              source.setData(data);
              console.log('Source updated');


            } else {
              console.warn('Source "incidents" not found');
            }
          }, [incidents, sourcesLoaded]);
      
        // Center map on selected incident
        useEffect(() => {
          if (selectedIncidentId && mapRef.current) {
            const selectedIncident = incidents.find((inc) => inc.id === selectedIncidentId);
            if (selectedIncident) {
              mapRef.current.flyTo({
                center: [selectedIncident.longitude, selectedIncident.latitude],
                zoom: 14,
              });
            }
          }
        }, [selectedIncidentId, incidents]);
      
        return (
          <div className={styles.mapRoot}>
            <div
              id="map-container"
              ref={mapContainerRef}
              className={`${styles.mapContainer} w-full h-full`}
            ></div>
          </div>
        );
      }