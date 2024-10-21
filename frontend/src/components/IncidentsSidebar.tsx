'use client'
import React, { useEffect, useState } from 'react';

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
  coordinates: [number, number];
  sublocality: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  assignedUnits: string[];
}

const api = process.env.NEXT_PUBLIC_API_ROUTE

const severityColors = {
  'citywide-incident': 'bg-purple-200 text-purple-800',
  critical: 'bg-[#DB0000] text-white-800',
  high: 'bg-orange-200 text-orange-800',
  moderate: 'bg-yellow-200 text-yellow-800',
  low: 'bg-green-200 text-green-800',
  'non-urgent': 'bg-blue-200 text-blue-800',
} as const;

interface IncidentsSidebarProps {
  incidents: Incident[];
  onSelectIncident: (incidentId: number) => void;
}const IncidentsSidebar: React.FC<IncidentsSidebarProps> = ({ incidents: propIncidents, onSelectIncident }) => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
    const [filters, setFilters] = useState({
      time: null as number | null,
      precinct: null as string | null,
      severity: null as string | null,
      status: null as string | null,
      department: null as string | null, 
    });
    const [currentTime, setCurrentTime] = useState(Date.now());
  
    useEffect(() => {
      setIncidents(propIncidents);
    }, [propIncidents]);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    useEffect(() => {
      let filtered = [...incidents];
  
      if (filters.time) {
        const timeLimit = filters.time * 60 * 1000;
        filtered = filtered.filter(
          (incident) => currentTime - new Date(incident.createdAt).getTime() <= timeLimit
        );
      }

      if (filters.precinct) {
        filtered = filtered.filter((incident) => incident.precinct === filters.precinct);
      }

      if (filters.severity) {
        filtered = filtered.filter((incident) => incident.severity === filters.severity);
      }

      if (filters.status) {
        filtered = filtered.filter((incident) => incident.status === filters.status);
      }
      if (filters.department) {
        filtered = filtered.filter((incident) => {
          switch (filters.department) {
            case 'EMS':
              return incident.agencyType === 'ems';
            case 'NYPD':
              return incident.agencyType === 'pd';
            case 'FDNY':
              return incident.agencyType === 'fire';
            default:
              return true;
          }
        });
      }
      const severityOrder = ['critical', 'high', 'moderate', 'low', 'non-urgent', 'citywide-incident'];
      filtered.sort((a, b) => {
        // Sort pending incidents first
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;

        // Then sort by severity
        const severityComparison =
          severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
        if (severityComparison !== 0) {
          return severityComparison;
        }

        // Finally, sort by creation time (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setFilteredIncidents(filtered);
    }, [incidents, filters, currentTime]);

  const formatAge = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    }
  };

  const calculateAge = (createdAt: string) => {
    const createdTime = new Date(createdAt).getTime();
    const ageInSeconds = Math.floor((currentTime - createdTime) / 1000);
    return formatAge(ageInSeconds);
  };

  return (
        <div className="w-full sm:w-64 md:w-72 lg:w-75 xl:w-75 bg-[#080F25] text-white flex flex-col">      <div className="px-1 bg-[#080F25]">
            <select
            value={filters.time || ''}
            onChange={(e) =>
                setFilters({ ...filters, time: e.target.value ? parseInt(e.target.value) : null })
            }
            className="bg-[#132764] text-white p-2 w-full mt-1"
            >
            <option value="">All Times</option>
            <option value="5">Last 5 minutes</option>
            <option value="10">Last 10 minutes</option>
            <option value="30">Last 30 minutes</option>
            </select>
            <select
                    value={filters.status || ''}
                    onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value || null })
                    }
                    className="bg-[#132764] text-white p-2 w-full mt-1"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                </select>
            <select
            value={filters.precinct || ''}
            onChange={(e) =>
                setFilters({ ...filters, precinct: e.target.value || null })
            }
            className="bg-[#132764] text-white p-2 w-full mt-1"
            >
            <option value="">All Precincts</option>
            <option value="009">009</option>
            <option value="013">013</option>
            <option value="106">106</option>
            </select>
            <select
          value={filters.department || ''}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value || null })
          }
          className="bg-[#132764] text-white p-2 w-full mt-1"
        >
          <option value="">All Departments</option>
          <option value="EMS">EMS</option>
          <option value="NYPD">NYPD</option>
          <option value="FDNY">FIRE</option>
        </select>
            <select
            value={filters.severity || ''}
            onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value || null })
            }
            className="bg-[#132764] text-white p-2 w-full mt-1"
            >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
            <option value="non-urgent">Non-Urgent</option>
            <option value="citywide-incident">Citywide Incident</option>
            </select>
        </div>
        <div className="overflow-y-auto flex-1">
                {filteredIncidents.map((incident) => (
                    <div
                        key={incident.id}
                        className={`p-[.55rem] bg-[#132764] mt-1 cursor-pointer flex ${
                            incident.status === 'pending' ? 'border-l-4 border-gray-400' : ''
                        }`}
                        onClick={() => onSelectIncident(incident.id)}
                    >
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[#FF6A00]">{incident.incidentType.toUpperCase()}</span>
                                    <span
                                        className={`px-2 py-[0.05rem] rounded-full text-xs ${
                                            severityColors[incident.severity as keyof typeof severityColors]
                                        }`}
                                    >
                                        {incident.severity.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm">{calculateAge(incident.createdAt)}</div>
                            </div>
                            <div className="flex justify-between items-center mt-1 text-sm">
                                <div>
                                    {incident.status === 'pending' ? (
                                        <span className="text-gray-400">PENDING NUA</span>
                                    ) : (
                                        <>
                                            {incident.assignedUnits.slice(0, 3).join(', ')}
                                            {incident.assignedUnits.length > 3 ? '...' : ''}
                                        </>
                                    )}
                                </div>
                                <div className="text-right">{incident.textAddress}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default IncidentsSidebar;
