import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface Agency {
  id: string;
  name: string;
  emailDomain: string;
  requiresManualApproval: boolean;
}
async function getAgencies(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch agencies');
  return response.json();
}

async function verifyAdminStatus(token: string) {
  const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!authResponse.ok) {
    return false;
  }

  const userData = await authResponse.json();
  return userData.isAdmin;
}

export default async function AgencyDashboardServer() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const isAdmin = await verifyAdminStatus(token);
    if (!isAdmin) {
      redirect('/'); // Redirect non-admin users to home
    }

    const agenciesList: Agency[] = await getAgencies(token);
    console.log('Agencies List from Dashboard:', agenciesList); // Test console log with Agency interface

    return {
      agenciesList,
      token
    };
  } catch (error) {
    console.log(error)
    redirect('/login');
  }
}