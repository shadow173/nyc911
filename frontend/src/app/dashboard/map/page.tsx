
import { cookies } from 'next/headers';
import { Instrument_Sans } from 'next/font/google';

import { redirect } from 'next/navigation';


import DashboardLayout from '@/components/dashboardLayout';
import Navbar from '@/components/navbar';
import MapPageClientWrapper from '@/components/MapPageClientWrapper';
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
});
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

export default async function MapPage() {
  const api = process.env.NEXT_PUBLIC_API_ROUTE;

  // Retrieve cookies from the request headers on the server side
  const cookieStore = cookies();

  // Log all cookies
  console.log("All cookies:");
  cookieStore.getAll().forEach((cookie) => {
    console.log(`${cookie.name}: ${cookie.value}`);
  });

  // Retrieve and log the specific token cookie
  const token = cookieStore.get('token')?.value;
  console.log("Token accessed:", token);

  if (!token) {
    console.log("No token found");
  }
    // Fetch user authentication status
    const authResponse = await fetch(`${api}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Response status:", authResponse.status);

    if (authResponse.status === 401 || !authResponse.ok) {
      console.log("User is not authenticated, redirecting to login...");
      redirect('/login');
      return null; // Prevent further execution
    }

    // Parse the JSON response to access user data
    const userData = await authResponse.json();
    console.log("User data fetched:", userData);
    // Check if the user is active
    if (userData.isDisabled) {
      redirect('/disabled');
      return null; // Prevent further execution
    }
    if (!userData.isActive) {
      console.log("User is not active, redirecting to login...");
      redirect('/login');
      return null; // Prevent further execution
    }
  
  // Fetch incidents data on the server, including cookies for authentication
  const response = await fetch(`${api}/incidents/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    cache: 'no-store', // Ensure fresh data on each request
  });

  if (!response.ok) {
    // Handle errors appropriately
    console.error('Failed to fetch incidents:', response.statusText);
    // You can throw an error or return a fallback UI
    throw new Error('Failed to fetch incidents');
  }

  const data = await response.json();
  const incidents = data.result as Incident[];

  return (
    <div className={instrumentSans.className}>
    <DashboardLayout>
      <Navbar />
      <MapPageClientWrapper incidents={incidents} />
    </DashboardLayout>
    </div>

  );
}
