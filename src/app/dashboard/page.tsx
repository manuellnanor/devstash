import { TopBar } from "@/components/top-bar";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <DashboardLayout>
        <></>
      </DashboardLayout>
    </div>
  );
}
