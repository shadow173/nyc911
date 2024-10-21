import DashboardLayout from "@/components/dashboardLayout";
import IncidentsTable from "@/components/IncidentsTable";
import Navbar from "@/components/navbar";
import { Instrument_Sans } from 'next/font/google';
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
});
export default function DashboardPage() {
  return (
    <div className={instrumentSans.className}>
    <DashboardLayout>
        <Navbar></Navbar>
      <IncidentsTable />
    </DashboardLayout>
    </div>



  );
}