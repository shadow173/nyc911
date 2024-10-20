'use client'
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../app/map.module.css'

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

export default function Map() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const publicMapsToken = process.env.NEXT_PUBLIC_MAPS_API_KEY!;

    useEffect(() => {
        if (mapContainerRef.current) {
            mapboxgl.accessToken = publicMapsToken;
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                // Add other necessary options here, like style, center, zoom, etc.
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-74.006480, 40.712978],
                zoom: 9
            }); 
        }

        // Cleanup function
        return () => {
            mapRef.current?.remove();
        };
    }, []); 

        
    return(
        <>
        <div className={styles.mapRoot}>
            
        <div id='map-container' ref={mapContainerRef} className={`${styles.mapContainer} w-full h-full`}>

        </div>

        </div>
        </>
    )
}
