'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Filter, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  'citywide-incident': 'bg-purple-700 text-purple-100',
  'critical': 'bg-red-700 text-red-100',
  'high': 'bg-orange-700 text-orange-100',
  'moderate': 'bg-yellow-700 text-yellow-100',
  'low': 'bg-green-700 text-green-100',
  'non-urgent': 'bg-blue-700 text-blue-100',
} as const;

const patrolBoroOrder = ['PBSI', 'PBQN', 'PBMS', 'PBBS', 'PBQS', 'PBMN', 'PBBX', 'PBBN'];

const severityOrder: (keyof typeof severityColors)[] = [
  'citywide-incident', 'critical', 'high', 'moderate', 'low', 'non-urgent'
];

type SeverityColor = typeof severityColors;
const api = process.env.NEXT_PUBLIC_API_ROUTE;

export default function IncidentsTable() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [severityFilter, setSeverityFilter] = useState<keyof SeverityColor | 'all'>('all');
  const [patrolBoroFilter, setPatrolBoroFilter] = useState<string>('all');
  const [precinctFilter, setPrecinctFilter] = useState<string>('all');
  const [precincts, setPrecincts] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${api}/incidents/`, { credentials: 'include' });
        const data = await response.json();
        const sortedIncidents = sortIncidents(data.result);
        setIncidents(sortedIncidents);
        const uniquePrecincts = Array.from(new Set(sortedIncidents.map(incident => incident.precinct))).sort();
        setPrecincts(uniquePrecincts);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
    const fetchInterval = setInterval(fetchIncidents, 5000);

    const updateInterval = setInterval(() => {
      setIncidents(prevIncidents => [...prevIncidents]);
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
    return [...incidentsToSort].sort((a, b) => {
      // First, sort by severity
      const severityDiff = severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
      if (severityDiff !== 0) return severityDiff;
      
      // If severity is the same, sort by patrolBoro
      const boroIndexA = patrolBoroOrder.indexOf(a.patrolBoro);
      const boroIndexB = patrolBoroOrder.indexOf(b.patrolBoro);
      if (boroIndexA !== boroIndexB) return boroIndexA - boroIndexB;

      // If patrolBoro is the same, sort by precinct
      if (a.precinct !== b.precinct) return a.precinct.localeCompare(b.precinct);
      
      // If all above are the same, sort by updatedAt based on sortOrder
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }; 
  
  const filteredAndSortedIncidents = useMemo(() => {
    let filtered = incidents;
    if (severityFilter !== 'all') {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }
    if (patrolBoroFilter !== 'all') {
      filtered = filtered.filter(incident => incident.patrolBoro === patrolBoroFilter);
    }
    if (precinctFilter !== 'all') {
      filtered = filtered.filter(incident => incident.precinct === precinctFilter);
    }
    return sortIncidents(filtered);
  }, [incidents, severityFilter, patrolBoroFilter, precinctFilter, sortOrder]);

  const handleViewDetails = (id: number) => {
    router.push(`/dashboard/incident/${id}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Incidents</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select onValueChange={(value) => setSeverityFilter(value as keyof SeverityColor | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {severityOrder.map((severity) => (
                <SelectItem key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setPatrolBoroFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Patrol Boros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patrol Boros</SelectItem>
              {patrolBoroOrder.map((boro) => (
                <SelectItem key={boro} value={boro}>{boro}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setPrecinctFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Precincts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Precincts</SelectItem>
              {precincts.map((precinct) => (
                <SelectItem key={precinct} value={precinct}>{precinct}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Assigned Units</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Patrol Boro</TableHead>
              <TableHead>Precinct</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead className="cursor-pointer" onClick={toggleSortOrder}>
                Last Updated
                {sortOrder === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />}
              </TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedIncidents.map((incident) => (
              <TableRow key={incident.id} className={`${incident.isNew ? 'animate-flash' : ''}`}>
                <TableCell>
                  <Badge className={severityColors[incident.severity]}>
                    {incident.severity}
                  </Badge>
                </TableCell>
                <TableCell>{incident.incidentType}</TableCell>
                <TableCell>
                  <div className="truncate max-w-xs" title={incident.description}>
                    {incident.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate max-w-xs" title={incident.assignedUnits.join(', ')}>
                    {incident.assignedUnits.join(', ')}
                  </div>
                </TableCell>
                <TableCell>{incident.textAddress}</TableCell>
                <TableCell>{incident.patrolBoro}</TableCell>
                <TableCell>{incident.precinct}</TableCell>
                <TableCell>{incident.sector}</TableCell>
                <TableCell>
                  {new Date(incident.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {calculateAge(incident.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(incident.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}