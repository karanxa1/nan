import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import FIRForm from '@/pages/FIRForm';
import MyFIRs from '@/pages/MyFIRs';
import FIRDetail from '@/pages/FIRDetail';
import LegalSearch from '@/pages/LegalSearch';
import LegalDetail from '@/pages/LegalDetail';
import MyCases from '@/pages/MyCases';
import CaseDetail from '@/pages/CaseDetail';
import Documents from '@/pages/Documents';
import AdminPanel from '@/pages/admin/AdminPanel';
import AdminFIRs from '@/pages/admin/AdminFIRs';
import AdminCases from '@/pages/admin/AdminCases';
import AdminLegal from '@/pages/admin/AdminLegal';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminReports from '@/pages/admin/AdminReports';
import AdminNotifications from '@/pages/admin/AdminNotifications';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* User routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/fir/new" element={<ProtectedRoute><FIRForm /></ProtectedRoute>} />
          <Route path="/fir/my" element={<ProtectedRoute><MyFIRs /></ProtectedRoute>} />
          <Route path="/fir/:id" element={<ProtectedRoute><FIRDetail /></ProtectedRoute>} />
          <Route path="/legal" element={<ProtectedRoute><LegalSearch /></ProtectedRoute>} />
          <Route path="/legal/:id" element={<ProtectedRoute><LegalDetail /></ProtectedRoute>} />
          <Route path="/case/my" element={<ProtectedRoute><MyCases /></ProtectedRoute>} />
          <Route path="/case/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/firs" element={<ProtectedRoute adminOnly><AdminFIRs /></ProtectedRoute>} />
          <Route path="/admin/cases" element={<ProtectedRoute adminOnly><AdminCases /></ProtectedRoute>} />
          <Route path="/admin/legal" element={<ProtectedRoute adminOnly><AdminLegal /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute adminOnly><AdminNotifications /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
