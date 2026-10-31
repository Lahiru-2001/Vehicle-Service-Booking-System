
import { dashboardStats } from "../../data/adminDashboardData";

import AdminStatCard from "../../components/admin/AdminStatCard";
import WorkshopChart from "../../components/admin/WorkshopChart";
import ServiceBreakdown from "../../components/admin/ServiceBreakdown";
import RecentBookings from "../../components/admin/RecentBookings";

export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">

      {/* DASHBOARD STATISTICS */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <AdminStatCard key={stat.title} stat={stat} />
        ))}
      </section>

      {/* ANALYTICS */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <WorkshopChart />
        <ServiceBreakdown />
      </section>

      {/* RECENT BOOKINGS */}
      <section>
        <RecentBookings />
      </section>

    </div>
  );
}
