'use client'

import React, { useState, useEffect, useRef  } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Filter, Eye } from 'lucide-react';

interface Incident {
  id: number;
  latitude: number;
  longitude: number;
  inputAddress: string;
  addressType: string;
  patrolBoro: string;
  incidentType: string;
  description: string;
  agencyType: string;
  precinct: string;
  severity: 'non-urgent' | 'low' | 'moderate' | 'high' | 'critical' | 'citywide-incident';
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
  isNew?: boolean;
}

const severityColors = {
  'citywide-incident': 'bg-purple-200 text-purple-800',
  'critical': 'bg-red-200 text-red-800',
  'high': 'bg-orange-200 text-orange-800',
  'moderate': 'bg-yellow-200 text-yellow-800',
  'low': 'bg-green-200 text-green-800',
  'non-urgent': 'bg-blue-200 text-blue-800',
} as const;
const patrolBoroOrder = ['PBSI', 'PBQN', 'PBMS', 'PBBS', 'PBQS', 'PBMN', 'PBBX', 'PBBN'];

const severityOrder: (keyof typeof severityColors)[] = [
  'citywide-incident', 'critical', 'high', 'moderate', 'low', 'non-urgent'
];

type SeverityColor = typeof severityColors;
const api = process.env.NEXT_PUBLIC_API_ROUTE;

export default function IncidentsTable() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
    const [severityFilter, setSeverityFilter] = useState<keyof SeverityColor | ''>('');
    const [patrolBoroFilter, setPatrolBoroFilter] = useState<string>('');
    const [precinctFilter, setPrecinctFilter] = useState<string>('');
    const [precincts, setPrecincts] = useState<string[]>([]);
    const router = useRouter();
    const api = process.env.NEXT_PUBLIC_API_ROUTE;
  
    useEffect(() => {
      const fetchIncidents = async () => {
        try {
          const response = await fetch(`${api}/incidents/`, { credentials: 'include' });
          const data = await response.json();
          const sortedIncidents = sortIncidents(data.result);
          setIncidents(sortedIncidents);
          setFilteredIncidents(sortedIncidents);
          const uniquePrecincts = Array.from(new Set(sortedIncidents.map(incident => incident.precinct))).sort();
          setPrecincts(uniquePrecincts);
        } catch (error) {
          console.error('Error fetching incidents:', error);
        }
      };
  
      fetchIncidents();
      const fetchInterval = setInterval(fetchIncidents, 5000);
  
      // Set up interval for updating the component every second
      const updateInterval = setInterval(() => {
        setIncidents(prevIncidents => [...prevIncidents]); // Force re-render
      }, 1000);
  
      return () => {
        clearInterval(fetchInterval);
        clearInterval(updateInterval);
      };
    }, []);
  
    const formatAge = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        if (hours > 0) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
          return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
      };
    
      const calculateAge = (createdAt: string) => {
        const createdTime = new Date(createdAt).getTime();
        const currentTime = Date.now();
        const ageInSeconds = Math.floor((currentTime - createdTime) / 1000);
        return formatAge(ageInSeconds);
      };
    

  const updateIncidents = (newIncidents: Incident[]) => {
    setIncidents(prevIncidents => {
      const updatedIncidents = newIncidents.map(incident => {
        const existingIncident = prevIncidents.find(i => i.id === incident.id);
        if (!existingIncident) {
          return { ...incident, isNew: true };
        }
        return incident;
      });
      return sortIncidents(updatedIncidents);
    });
  };

  const sortIncidents = (incidentsToSort: Incident[]): Incident[] => {
    return incidentsToSort.sort((a, b) => {
      // First, sort by severity
      const severityDiff = severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
      if (severityDiff !== 0) return severityDiff;
      
      // If severity is the same, sort by patrolBoro
      const boroIndexA = patrolBoroOrder.indexOf(a.patrolBoro);
      const boroIndexB = patrolBoroOrder.indexOf(b.patrolBoro);
      if (boroIndexA !== boroIndexB) return boroIndexA - boroIndexB;

      // If patrolBoro is the same, sort by precinct
      if (a.precinct !== b.precinct) return a.precinct.localeCompare(b.precinct);
      
      // If all above are the same, sort by updatedAt (most recent first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  
  useEffect(() => {
    let filtered = incidents;
    if (severityFilter) {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }
    if (patrolBoroFilter) {
      filtered = filtered.filter(incident => incident.patrolBoro === patrolBoroFilter);
    }
    if (precinctFilter) {
      filtered = filtered.filter(incident => incident.precinct === precinctFilter);
    }
    setFilteredIncidents(filtered);
  }, [severityFilter, patrolBoroFilter, precinctFilter, incidents]);

  const handleViewDetails = (id: number) => {
    router.push(`/dashboard/incident/${id}`);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Incidents</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="mr-2" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as keyof SeverityColor | '')}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Severities</option>
              {severityOrder.map((severity) => (
                <option key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <Filter className="mr-2" />
            <select
              value={patrolBoroFilter}
              onChange={(e) => setPatrolBoroFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Patrol Boros</option>
              {patrolBoroOrder.map((boro) => (
                <option key={boro} value={boro}>{boro}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <Filter className="mr-2" />
            <select
              value={precinctFilter}
              onChange={(e) => setPrecinctFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Precincts</option>
              {precincts.map((precinct) => (
                <option key={precinct} value={precinct}>{precinct}</option>
              ))}
            </select>
          </div>
        </div>
       
      </div>
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Assigned Units</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Patrol Boro</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Precinct</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Sector</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredIncidents.map((incident) => (
              <tr 
                key={incident.id} 
                className={`hover:bg-gray-750 ${incident.isNew ? 'animate-flash' : ''}`}
              >
                <td className="px-6 py-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${severityColors[incident.severity]}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-6 py-2">{incident.incidentType}</td>
                <td className="px-6 py-2">
                  <div className="truncate max-w-xs" title={incident.description}>
                    {incident.description}
                  </div>
                </td>
                <td className="px-6 py-1">
                  <div className="truncate max-w-xs" title={incident.assignedUnits.join(', ')}>
                    {incident.assignedUnits.join(', ')}
                  </div>
                </td>
                <td className="px-6 py-2">{incident.textAddress}</td>
                <td className="px-6 py-2">{incident.patrolBoro}</td>
                <td className="px-6 py-2">{incident.precinct}</td>
                <td className="px-6 py-2">{incident.sector}</td>
                <td className="px-6 py-2">
                  {new Date(incident.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-2`">
                  {calculateAge(incident.createdAt)}
                </td>
                <td className="px-6 py-2">
                  <button
                    onClick={() => handleViewDetails(incident.id)}
                    className="text-blue-400 hover:text-blue-300 focus:outline-none"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}