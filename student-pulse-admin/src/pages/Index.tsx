
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../components/auth/LoginPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import StudentsManagement from '../components/dashboard/StudentsManagement';
import RFIDLogs from '../components/dashboard/RFIDLogs';
import RFIDSettings from '../components/dashboard/RFIDSettings';
import PlanSubscription from '../components/dashboard/PlanSubscription';
import InstitutionProfile from '../components/dashboard/InstitutionProfile';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Index = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Overview />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/students" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <StudentsManagement />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/logs" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RFIDLogs />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/rfid-settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RFIDSettings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/plan" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PlanSubscription />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InstitutionProfile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default Index;
