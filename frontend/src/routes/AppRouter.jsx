import { Routes, Route, Navigate } from 'react-router-dom';

import Landing from '../pages/Public/Landing.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />

      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}

      {/* Customer routes */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}