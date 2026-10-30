export const customer = {
  firstName: "Kasun",
  fullName: "Kasun Rathnayake",
  initials: "KR",
  membership: "Premium Member",
  role: "Vehicle Owner",
};

export const dashboardStats = [
  {
    title: "Total Bookings",
    value: 12,
    note: "↑ +2 this month",
    icon: "calendar",
    color: "blue",
  },
  {
    title: "Pending Approvals",
    value: 1,
    note: "Awaiting slot review",
    icon: "clock",
    color: "orange",
  },
  {
    title: "Approved / In Progress",
    value: 1,
    note: "Scheduled today",
    icon: "wrench",
    color: "blue",
  },
  {
    title: "Completed Services",
    value: 10,
    note: "100% on-time",
    icon: "shield",
    color: "green",
  },
];

export const appointment = {
  id: "AC-8924",
  packageName: "Comprehensive Brake Service & Fluid Flush",
  description:
    "Full 32-point safety check, brake pads inspection, hydraulic bleed.",
  amount: 11500,
  vehicle: "2021 BMW X3 M-Sport",
  registrationNumber: "WP CBG-4892",
  time: "02:30 PM - 03:30 PM",
  date: "Oct 24, 2025",
  technician: "Master Technician",
  currentStep: 2,
  status: "Approved / Scheduled",
};

export const vehicles = [
  {
    id: 1,
    make: "BMW",
    model: "2021 BMW X3 M-Sport",
    registrationNumber: "WP CBG-4892",
    status: "Service Scheduled Today",
    statusType: "service",
  },
  {
    id: 2,
    make: "TOY",
    model: "2023 Toyota RAV4 Prime",
    registrationNumber: "WP CAD-1205",
    status: "Next service in 4,500 km",
    statusType: "healthy",
  },
];

export const bookings = [
  {
    id: "AC-8924",
    service: "Brake Service & Fluid Flush",
    vehicle: "2021 BMW X3",
    date: "Oct 24, 2025",
    time: "02:30 PM",
    status: "Approved",
    amount: 6500,
  },
  {
    id: "AC-8751",
    service: "Full Synthetic Oil Change",
    vehicle: "2023 Toyota RAV4",
    date: "Oct 10, 2025",
    time: "09:00 AM",
    status: "Completed",
    amount: 6500,
  },
  {
    id: "AC-8610",
    service: "Engine Diagnostics & Tune-up",
    vehicle: "2021 BMW X3",
    date: "Sep 15, 2025",
    time: "11:15 AM",
    status: "Completed",
    amount: 6500,
  },
  {
    id: "AC-8490",
    service: "AC Sanitization & Cabin Filter",
    vehicle: "2023 Toyota RAV4",
    date: "Aug 02, 2025",
    time: "03:45 PM",
    status: "Completed",
    amount: 6500,
  },
  {
    id: "AC-8215",
    service: "Tire Alignment & Wheel Balance",
    vehicle: "2021 BMW X3",
    date: "Jun 18, 2025",
    time: "01:30 PM",
    status: "Pending",
    amount: 6500,
  },
  {
    id: "AC-8077",
    service: "Vehicle General Inspection",
    vehicle: "2023 Toyota RAV4",
    date: "May 12, 2025",
    time: "10:00 AM",
    status: "Completed",
    amount: 4500,
  },
];

export const pipelineSteps = ["Approved", "Check-in", "Servicing", "Ready"];
