import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Landing from "../pages/Public/Landing.jsx";

// Authentication pages
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Customer layout and pages
import CustomerLayout from "../layouts/CustomerLayout.jsx";
import CustomerDashboard from "../pages/customer/Dashboard.jsx";
import BookService from "../pages/customer/BookService.jsx";
import MyBookings from "../pages/customer/MyBookings.jsx";
import MyProfile from "../pages/customer/MyProfile.jsx";

// Admin layout and pages
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import AdminBookings from "../pages/admin/Bookings.jsx";
import ServiceCategories from "../pages/admin/ServiceCategories.jsx";
import AdminCustomers from "../pages/admin/Customers.jsx";
// import AdminSettings from "../pages/admin/Settings.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />

      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer routes */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="book-service" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
         <Route path="profile" element={<MyProfile />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="service-categories" element={<ServiceCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
         {/*<Route path="settings" element={<AdminSettings />} /> */}
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}