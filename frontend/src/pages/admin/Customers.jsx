
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  CalendarDays,
  Bell,
  CircleHelp,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  LoaderCircle,
} from "lucide-react";

import api from "../../api/client";

import {
  initialCustomers,
  getCustomerName,
} from "../../data/customerData";

import CustomerStats from "../../components/admin/customers/CustomerStats";
import CustomerList from "../../components/admin/customers/CustomerList";
import CustomerInspector from "../../components/admin/customers/CustomerInspector";
import CustomerModal from "../../components/admin/customers/CustomerModal";
import VehicleModal from "../../components/admin/customers/VehicleModal";
import CustomerBookingModal from "../../components/admin/customers/CustomerBookingModal";

export default function Customers() {
  const navigate = useNavigate();

  // CUSTOMER DATA
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomers[0]?.id || null
  );

  // SEARCH AND PAGINATION
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // CHECKBOX SELECTION
  const [selectedIds, setSelectedIds] = useState([]);

  // LOADING
  const [loading, setLoading] = useState(false);

  // MODALS
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);

  // NOTIFICATION
  const [notification, setNotification] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const notify = (message, type = "success") => {
    setNotification({ message, type });
  };

  // -----------------------------------------
  // LOAD CUSTOMERS
  // -----------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadCustomers = async () => {
      setLoading(true);

      try {
        const response = await api.get("/customers");

        const raw =
          response.data?.data?.customers ||
          response.data?.customers ||
          response.data?.data ||
          response.data;

        if (mounted && Array.isArray(raw)) {
          const normalized = raw.map(normalizeCustomer);

          setCustomers(normalized);

          setSelectedCustomerId((current) =>
            normalized.some((item) => item.id === current)
              ? current
              : normalized[0]?.id || null
          );
        }
      } catch (error) {
        console.warn(
          "Customer API unavailable. Using demonstration data.",
          error.message
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  // -----------------------------------------
  // NORMALIZE CUSTOMER DATA
  // -----------------------------------------

  function normalizeCustomer(item) {
    const id = String(item.id || item._id);

    const vehicles = (item.vehicles || []).map((vehicle) => ({
      ...vehicle,
      id: String(vehicle.id || vehicle._id),
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: Number(vehicle.year || 0),
      plate: vehicle.plate || vehicle.registrationNumber || "",
      vin: vehicle.vin || "",
      mileage: vehicle.mileage
        ? String(vehicle.mileage).includes("km")
          ? String(vehicle.mileage)
          : `${vehicle.mileage} km`
        : "N/A",
      status: vehicle.status || "Healthy",
    }));

    const firstName =
      item.firstName ||
      item.name?.split(" ")[0] ||
      "";

    const lastName =
      item.lastName ||
      item.name?.split(" ").slice(1).join(" ") ||
      "";

    return {
      ...item,
      id,
      firstName,
      lastName,
      fullName:
        item.fullName ||
        item.name ||
        `${firstName} ${lastName}`.trim(),
      email: item.email || "",
      phone: item.phone || "",
      location: item.location || item.address || "",
      customerType: item.customerType || item.type || "Individual",
      tier: item.tier || item.loyaltyTier || "Standard",
      points: Number(item.points || 0),
      memberSince: item.memberSince || "",
      verified: Boolean(item.verified),
      vehicles,
      activeVehicles: Number(
        item.activeVehicles ?? vehicles.length
      ),
      totalVisits: Number(item.totalVisits || 0),
      lifetimeSpend: Number(item.lifetimeSpend || 0),
      overdueInvoices: Number(item.overdueInvoices || 0),
      recentServices: item.recentServices || [],
    };
  }

  // -----------------------------------------
  // SELECTED CUSTOMER
  // -----------------------------------------

  const selectedCustomer = useMemo(
    () =>
      customers.find(
        (customer) => customer.id === selectedCustomerId
      ) || null,
    [customers, selectedCustomerId]
  );

  // -----------------------------------------
  // FILTER CUSTOMERS
  // -----------------------------------------

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (filter !== "all") {
      result = result.filter(
        (customer) =>
          customer.tier.toLowerCase() === filter.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((customer) => {
        const vehicles = customer.vehicles || [];

        return (
          getCustomerName(customer).toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query) ||
          customer.id.toLowerCase().includes(query) ||
          vehicles.some(
            (vehicle) =>
              `${vehicle.make} ${vehicle.model}`
                .toLowerCase()
                .includes(query) ||
              vehicle.plate?.toLowerCase().includes(query)
          )
        );
      });
    }

    return result;
  }, [customers, filter, search]);

  // -----------------------------------------
  // PAGINATION
  // -----------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize)
  );

  const visibleCustomers = filteredCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // -----------------------------------------
  // CUSTOMER SELECTION
  // -----------------------------------------

  const selectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
  };

  const toggleCustomer = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = visibleCustomers.map(
      (customer) => customer.id
    );

    const allSelected = visibleIds.every((id) =>
      selectedIds.includes(id)
    );

    setSelectedIds((previous) =>
      allSelected
        ? previous.filter((id) => !visibleIds.includes(id))
        : [...new Set([...previous, ...visibleIds])]
    );
  };

  // -----------------------------------------
  // OPEN MODALS
  // -----------------------------------------

  const openAddCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerModal(true);
  };

  const openEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerModal(true);
  };

  const openAddVehicle = (customer) => {
    setActiveCustomer(customer);
    setShowVehicleModal(true);
  };

  const openCreateBooking = (customer) => {
    setActiveCustomer(customer);
    setShowBookingModal(true);
  };

  // -----------------------------------------
  // SAVE CUSTOMER
  // -----------------------------------------

  const handleSaveCustomer = async (form) => {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      location: form.location,
      customerType: form.customerType,
      tier: form.tier,
    };

    try {
      if (editingCustomer) {
        const response = await api.patch(
          `/customers/${editingCustomer.id}`,
          payload
        );

        const saved =
          response.data?.data?.customer ||
          response.data?.customer ||
          response.data?.data ||
          response.data;

        const updated = normalizeCustomer({
          ...editingCustomer,
          ...payload,
          ...saved,
          id: editingCustomer.id,
        });

        setCustomers((previous) =>
          previous.map((item) =>
            item.id === editingCustomer.id ? updated : item
          )
        );

        setSelectedCustomerId(editingCustomer.id);
        notify("Customer updated successfully.");
      } else {
        const response = await api.post(
          "/customers",
          payload
        );

        const saved =
          response.data?.data?.customer ||
          response.data?.customer ||
          response.data?.data ||
          response.data;

        const created = normalizeCustomer({
          ...payload,
          ...saved,
        });

        setCustomers((previous) => [created, ...previous]);
        setSelectedCustomerId(created.id);
        setPage(1);

        notify("New customer created successfully.");
      }

      setShowCustomerModal(false);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Unable to save customer. Check the customer API."
      );
    }
  };

  // -----------------------------------------
  // ADD VEHICLE
  // -----------------------------------------

  const handleAddVehicle = async (vehicle) => {
    if (!activeCustomer) return;

    const payload = {
      make: vehicle.make,
      model: vehicle.model,
      year: Number(vehicle.year),
      registrationNumber: vehicle.plate,
      plate: vehicle.plate,
      vin: vehicle.vin,
      mileage: Number.parseInt(vehicle.mileage, 10) || 0,
      status: vehicle.status,
    };

    try {
      const response = await api.post(
        `/customers/${activeCustomer.id}/vehicles`,
        payload
      );

      const saved =
        response.data?.data?.vehicle ||
        response.data?.vehicle ||
        response.data?.data ||
        response.data;

      const newVehicle = {
        ...vehicle,
        ...saved,
        id: String(saved.id || saved._id || `VEH-${Date.now()}`),
        plate: saved.plate || saved.registrationNumber || vehicle.plate,
        mileage: vehicle.mileage,
      };

      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === activeCustomer.id
            ? {
                ...customer,
                vehicles: [
                  ...(customer.vehicles || []),
                  newVehicle,
                ],
                activeVehicles:
                  (customer.activeVehicles || 0) + 1,
              }
            : customer
        )
      );

      setShowVehicleModal(false);
      notify("Vehicle registered successfully.");
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Unable to register vehicle."
      );
    }
  };

  // -----------------------------------------
  // CREATE BOOKING
  // -----------------------------------------

  const handleCreateBooking = async (booking) => {
    try {
      await api.post("/bookings", {
        customerId: booking.customerId,
        vehicleId: booking.vehicleId,
        servicePackage: booking.servicePackage,
        serviceDate: booking.serviceDate,
        serviceTime: booking.serviceTime,
        notes: booking.notes,
      });

      setShowBookingModal(false);
      notify("Service booking created successfully.");
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Unable to create booking. Check the booking API."
      );
    }
  };

  // -----------------------------------------
  // SMS REMINDER
  // -----------------------------------------

  const handleSendReminder = async (customer) => {
    if (!customer.phone) {
      notify("Customer phone number is not available.", "error");
      return;
    }

    const confirmed = window.confirm(
      `Send a service reminder to ${customer.fullName} at ${customer.phone}?`
    );

    if (!confirmed) return;

    setActionLoading(true);

    try {
      await api.post("/notifications/sms", {
        customerId: customer.id,
        phone: customer.phone,
        message: `Hello ${customer.firstName}, this is AutoCare. Please contact us to arrange your vehicle service.`,
      });

      notify("SMS reminder sent successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "SMS service is not configured or the reminder could not be sent.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------------------
  // VIEW CUSTOMER DOSSIER
  // -----------------------------------------

  const handleViewDossier = async (customer) => {
    setActionLoading(true);

    try {
      const response = await api.get(
        `/customers/${customer.id}/dossier`
      );

      const dossier =
        response.data?.data?.dossier ||
        response.data?.dossier ||
        response.data;

      // Open a readable print view using the returned dossier data.
      const printable = window.open("", "_blank");

      if (!printable) {
        throw new Error("Please allow popups to view the dossier.");
      }

      const safe = (value) =>
        String(value ?? "").replace(/[&<>"']/g, (character) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character]);

      printable.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>AutoCare Customer Dossier</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 35px; color: #10243b; }
            h1 { color: #10243b; }
            h2 { margin-top: 28px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
            p { font-size: 13px; line-height: 1.8; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 10px; border: 1px solid #ddd; text-align: left; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>AutoCare Customer Dossier</h1>
          <p>Customer: ${safe(customer.fullName)}</p>
          <p>Reference: ${safe(customer.id)}</p>
          <p>Email: ${safe(customer.email)}</p>
          <p>Phone: ${safe(customer.phone)}</p>
          <h2>Customer Records</h2>
          <pre>${safe(JSON.stringify(dossier, null, 2))}</pre>
          <script>window.onload = () => window.print();</script>
        </body>
        </html>
      `);

      printable.document.close();
      notify("Customer dossier opened.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          error.message ||
          "Unable to retrieve customer dossier.",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] space-y-4">

      {/* -------------------------------- */}
      {/* PAGE TOP BAR */}
      {/* -------------------------------- */}

      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Admin Portal</span>

          <span className="text-slate-300">›</span>

          <h1 className="font-extrabold text-[#10243b]">
            Customers
          </h1>

          <span className="ml-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            OPERATIONAL: 6/6 ACTIVE BAYS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[190px] flex-1 sm:flex-none">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search customers by name, phone..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-orange-400 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
            <CalendarDays size={14} className="text-slate-500" />

            <span className="text-[10px] font-semibold text-slate-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <button
            title="Notifications"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-white"
          >
            <Bell size={17} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          <button
            title="Help"
            className="rounded-lg p-2 text-slate-500 hover:bg-white"
          >
            <CircleHelp size={17} />
          </button>

          <button
            onClick={openAddCustomer}
            className="flex items-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
          >
            <Plus size={15} />
            Add Customer
          </button>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* NOTIFICATION */}
      {/* -------------------------------- */}

      {notification && (
        <div
          role="status"
          className={`flex items-center justify-between rounded-lg border p-3 text-xs ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertCircle size={15} />
            )}
            {notification.message}
          </span>

          <button onClick={() => setNotification(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* -------------------------------- */}
      {/* STATISTICS */}
      {/* -------------------------------- */}

      <CustomerStats customers={customers} />

      {/* -------------------------------- */}
      {/* CUSTOMER FILTER */}
      {/* -------------------------------- */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#10243b]">
            Customer Management
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Manage customer accounts, vehicles and loyalty programs.
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-400"
        >
          <option value="all">All Customers</option>
          <option value="Platinum">Platinum</option>
          <option value="Gold">Gold</option>
          <option value="Standard">Standard</option>
          <option value="Enterprise">Enterprise</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* -------------------------------- */}
      {/* CUSTOMER LIST + INSPECTOR */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.35fr_0.9fr]">

        {/* LEFT: CUSTOMER TABLE */}
        <div className="min-w-0">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white">
              <LoaderCircle
                size={28}
                className="animate-spin text-orange-500"
              />
            </div>
          ) : (
            <CustomerList
              customers={visibleCustomers}
              selectedCustomer={selectedCustomer}
              onSelect={selectCustomer}
              selectedIds={selectedIds}
              onToggleSelect={toggleCustomer}
              onSelectAll={toggleSelectAll}
              page={page}
              pageSize={pageSize}
              total={filteredCustomers.length}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* RIGHT: CUSTOMER INSPECTOR */}
        <div className="min-w-0">
          <CustomerInspector
            customer={selectedCustomer}
            onClose={() => setSelectedCustomerId(null)}
            onEdit={openEditCustomer}
            onAddVehicle={openAddVehicle}
            onCreateBooking={openCreateBooking}
            onSendReminder={handleSendReminder}
            onViewDossier={handleViewDossier}
          />
        </div>
      </div>

      {/* CUSTOMER MODAL */}
      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />

      {/* VEHICLE MODAL */}
      <VehicleModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        customer={activeCustomer}
        onSave={handleAddVehicle}
      />

      {/* BOOKING MODAL */}
      <CustomerBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        customer={activeCustomer}
        onSave={handleCreateBooking}
      />

      {actionLoading && (
        <div className="fixed bottom-5 right-5 z-[200] flex items-center gap-2 rounded-lg bg-[#10243b] px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <LoaderCircle size={15} className="animate-spin" />
          Processing request...
        </div>
      )}
    </div>
  );
}
