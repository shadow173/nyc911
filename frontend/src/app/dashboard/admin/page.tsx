
import AgencyDashboardServer from '@/components/AgencyDashbaordServer';
import AgencyDashboardClient from '@/components/AgencyDashboardClient';
import { Suspense } from 'react';


export default async function AdminPage() {
    const { agenciesList, token } = await AgencyDashboardServer();
    
    return (
      <main className="min-h-screen bg-slate-800">
        <Suspense fallback={<div>Loading...</div>}>
          <AgencyDashboardClient 
            initialAgencies={agenciesList} 
            token={token} 
          />
        </Suspense>
      </main>
    );
  }