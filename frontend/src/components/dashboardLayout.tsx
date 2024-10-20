import { PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

const api = process.env.NEXT_PUBLIC_API_ROUTE

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

  console.log("Fetching user data...");
  // const api = process.env.NEXT_PUBLIC_API_ROUTE;

  // // Retrieve cookies from the request headers on the server side
  // const cookieStore = cookies();

  // // Log all cookies
  // console.log("All cookies:");
  // cookieStore.getAll().forEach((cookie) => {
  //   console.log(`${cookie.name}: ${cookie.value}`);
  // });

  // // Retrieve and log the specific token cookie
  // const token = cookieStore.get('token')?.value;
  // console.log("Token accessed:", token);

  // if (!token) {
  //   console.log("No token found, redirecting to login...");
  //   redirect('/login');
  //   return null;
  // }

  // // Check if token exists and fetch user authentication status
  // const authResponse = await fetch(`${api}/auth/me`, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${token}`
  //   }
  // });

  // console.log("Response status:", authResponse.status);

  // if (authResponse.status === 401 || !authResponse.ok) {
  //   console.log("User is not authenticated, redirecting to login...");
  //   redirect('/login');
  //   return null; // Prevent further execution
  // }

  
  


return (
<div>

<main>{children}</main>
</div>

)

}
export default DashboardLayout
