import DashboardLayout from "@/components/dashboardLayout";
import IncidentsTable from "@/components/IncidentsTable";
import Navbar from "@/components/navbar";

export default function DashboardPage() {
  return (
    <DashboardLayout>
        <Navbar></Navbar>
      <IncidentsTable />
    </DashboardLayout>
  );
}