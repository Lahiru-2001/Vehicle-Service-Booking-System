import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Download,
  CircleCheck,
  CircleDot,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../api/client";

import StatCard from "../../components/customer/StatCard";
import UpcomingAppointment from "../../components/customer/UpcomingAppointment";
import MyVehicles from "../../components/customer/MyVehicles";
import RecentBookings from "../../components/customer/RecentBookings";

import {
  customer as sampleCustomer,
  dashboardStats as sampleStats,
  appointment as sampleAppointment,
  vehicles as sampleVehicles,
  bookings as sampleBookings,
} from "../../data/customerDashboardData";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(sampleCustomer);
  const [stats, setStats] = useState(sampleStats);
  const [appointment, setAppointment] = useState(sampleAppointment);
  const [vehicles, setVehicles] = useState(sampleVehicles);
  const [bookings, setBookings] = useState(sampleBookings);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setApiError("");

      try {
        /*
         * Expected optional endpoint:
         * GET /api/customer/dashboard
         *
         * Expected response:
         * {
         *   customer: {...},
         *   stats: [...],
         *   appointment: {...},
         *   vehicles: [...],
         *   bookings: [...]
         * }
         *
         * If your backend returns a different shape, map its response here.
         */

        const response = await api.get("/customer/dashboard");

        if (!active) return;

        const data = response.data?.data ?? response.data;

        if (data.customer) {
          setCustomer((previous) => ({
            ...previous,
            ...data.customer,
          }));
        }

        if (Array.isArray(data.stats)) {
          setStats(data.stats);
        }

        if (data.appointment) {
          setAppointment(data.appointment);
        }

        if (Array.isArray(data.vehicles)) {
          setVehicles(data.vehicles);
        }

        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
      } catch (error) {
        if (!active) return;

        /*
         * Sample data remains visible if the backend endpoint has not
         * been implemented. This allows frontend development to continue.
         */
        if (error.response?.status !== 404) {
          setApiError(
            "Showing demonstration data because live dashboard data could not be loaded."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const filteredStats = useMemo(() => {
    return stats;
  }, [stats]);

  const handleNewService = () => {
    navigate("/customer/book-service");
  };

  const handleDownloadInvoices = async () => {
    try {
      const response = await api.get("/customer/invoices/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "autocare-invoice-history";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      setApiError(
        "Invoice history export is not available yet. Please connect the invoice export API."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1700px] px-4 py-5 sm:px-6 sm:py-6 lg:px-[26px]">
      {/* Welcome banner */}
      <section className="flex flex-col justify-between gap-5 rounded-[14px] border border-[#d9dde5] bg-white p-5 shadow-[0_1px_1px_rgba(15,23,42,0.02)] sm:p-6 xl:flex-row xl:items-center">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f0ff] px-2.5 py-1 text-[10px] font-semibold text-[#416995]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff681c]" />
            Automotive Telemetry Active
          </div>

          <h1 className="text-[25px] font-extrabold leading-tight tracking-[-0.8px] text-[#102338] sm:text-[28px]">
            Welcome back, {customer.firstName || "Customer"}{" "}
            <span aria-hidden="true">👋</span>
          </h1>

          <p className="mt-1 max-w-[520px] text-[12px] leading-[1.7] text-[#555a62] sm:text-[13px]">
            Manage your vehicle services, track active maintenance in workshop
            bays, and schedule appointments seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownloadInvoices}
            className="inline-flex min-h-[35px] items-center justify-center gap-2 rounded-lg border border-[#cbd1dc] bg-white px-3 py-2 text-[11px] font-semibold text-[#20334a] transition hover:border-[#8a9db6] hover:bg-slate-50"
          >
            <Download size={15} />
            Download Invoice History
          </button>

          <button
            type="button"
            onClick={handleNewService}
            className="inline-flex min-h-[35px] items-center justify-center gap-2 rounded-lg bg-[#ed5b00] px-3.5 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#d94f00]"
          >
            <CircleDot size={15} />
            Book New Service
          </button>
        </div>
      </section>

      {/* Loading and API messages */}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <LoaderCircle size={15} className="animate-spin" />
          Syncing customer dashboard...
        </div>
      )}

      {apiError && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {apiError}
        </div>
      )}

      {/* Statistics cards */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredStats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </section>

      {/* Appointment and vehicles */}
      <section className="mt-6 grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[1.45fr_1fr]">
        <UpcomingAppointment appointment={appointment} />

        <MyVehicles vehicles={vehicles} />
      </section>

      {/* Recent bookings */}
      <section className="mt-6">
        <RecentBookings
          bookings={bookings}
          searchTerm={searchTerm}
        />
      </section>

      {/* Footer status line */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-[#717784]">
        <span className="flex items-center gap-1.5">
          <CircleCheck size={13} className="text-emerald-600" />
          Customer portal ready
        </span>

        <span>
          {customer.membership} · AutoCare Fleet Management
        </span>
      </div>
    </div>
  );
}