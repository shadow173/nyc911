'use client';

import React, { useEffect, useState } from 'react';
import IncidentsSidebar from './IncidentsSidebar';
import Map from './Map';
import IncidentDetailsSidebar from './IncidentDetailsSidebar';

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

interface MapPageClientWrapperProps {
  incidents: Incident[];
}

const MapPageClientWrapper: React.FC<MapPageClientWrapperProps> =  () => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const handleSelectIncident = (incidentId: number) => {
    setSelectedIncidentId(incidentId);
  };

  const handleCloseIncidentDetails = () => {
    setSelectedIncidentId(null);
  };
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_ROUTE;

    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${api}/incidents/`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error('Failed to fetch incidents:', response.statusText);
          return;
        }

        const data = await response.json();
        const newIncidents = data.result as Incident[];

        // Update the state with new incidents
        setIncidents((prevIncidents) => {
          console.log(prevIncidents)
          // Compare prevIncidents and newIncidents to detect changes
          // For now, we'll simply replace the state
          return newIncidents;
        });
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    // Initial fetch
    fetchIncidents();

    // Set up interval to fetch every second
    const intervalId = setInterval(fetchIncidents, 6000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <IncidentsSidebar incidents={incidents} onSelectIncident={handleSelectIncident} />

      {/* Map */}
      <div className="flex-1 relative">
        <Map
          incidents={incidents}
          selectedIncidentId={selectedIncidentId}
          onSelectIncident={handleSelectIncident}
        />
      </div>

      {/* Right Sidebar */}
      {selectedIncidentId && (
        <IncidentDetailsSidebar
          incidentId={selectedIncidentId}
          onClose={handleCloseIncidentDetails}
        />
      )}
    </div>
  );
};

export default MapPageClientWrapper;
