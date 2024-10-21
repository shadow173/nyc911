import React, { useEffect, useState } from 'react';

interface IncidentDetailsSidebarProps {
  incidentId: number;
  onClose: () => void;
}

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

interface IncidentUpdate {
  id: number;
  timestamp: string;
  message: string;
}
interface IncidentDetailsResponse {
    incident: Incident;
    incidentUpdates: IncidentUpdate[];
    premiseHistoryFound: boolean;
  }
const severityColors = {
  'citywide-incident': 'bg-purple-200 text-purple-800',
  critical: 'bg-[#DB0000] text-white',
  high: 'bg-orange-200 text-orange-800',
  moderate: 'bg-yellow-200 text-yellow-800',
  low: 'bg-green-200 text-green-800',
  'non-urgent': 'bg-blue-200 text-blue-800',
} as const;
const api = process.env.NEXT_PUBLIC_API_ROUTE
const IncidentDetailsSidebar: React.FC<IncidentDetailsSidebarProps> = ({ incidentId, onClose }) => {
    const [incident, setIncident] = useState<Incident | null>(null);
    const [incidentUpdates, setIncidentUpdates] = useState<IncidentUpdate[]>([]);
    const [premiseHistoryFound, setPremiseHistoryFound] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const fetchIncidentDetails = async () => {
          const api = process.env.NEXT_PUBLIC_API_ROUTE;
          const response = await fetch(`${api}/incident/${incidentId}`, {
            credentials: 'include',
            cache: 'no-store',
          });
      
          if (!response.ok) {
            console.error('Failed to fetch incident details:', response.statusText);
            return;
          }
      
          const data: IncidentDetailsResponse = await response.json();
          setIncident(data.incident);
          setIncidentUpdates(data.incidentUpdates);
          setPremiseHistoryFound(data.premiseHistoryFound);
        };
      
        fetchIncidentDetails();
    }, [incidentId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!incident) {
        return null;
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
    };

    const formatDuration = (createdAt: string) => {
        const createdTime = new Date(createdAt).getTime();
        const seconds = Math.floor((currentTime - createdTime) / 1000);
    
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-1/4 bg-[#080F25] text-white flex flex-col">
            {/* Header */}
            <div className="bg-[#232B46] p-4 relative">
                <button className="absolute top-2 right-2 text-white" onClick={onClose}>
                    X
                </button>
                <div className="text-2xl font-bold text-[#FF6A00] flex items-center justify-center">
                    {incident.incidentType}
                    <div
                        className={`ml-2 px-2 py-1 rounded-full text-sm ${
                            severityColors[incident.severity as keyof typeof severityColors]
                        }`}
                    >
                        {incident.severity}
                    </div>
                </div>
                <div className="flex justify-between mt-1">
                    <div>
                        {incident.sector} - {incident.textAddress}
                    </div>
                    <div>{formatTime(incident.createdAt)}</div>
                </div>
                <div className="flex justify-between ">
                    <div>Units: {incident.assignedUnits.join(', ')}</div>
                    <div>{formatDuration(incident.createdAt)}</div>
                </div>
                {premiseHistoryFound && (
                    <button className="mt-1 bg-[#D05700]  rounded-lg text-white w-full py-2">
                        View Premise History
                    </button>
                )}
            </div>
            {/* Incident Updates */}
            <div className="flex-1 overflow-y-auto p-4">
                {incidentUpdates.map((update) => (
                    <div key={update.id} className="mb-1">
                        <div>
                            {formatTime(update.timestamp)} - {update.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncidentDetailsSidebar;