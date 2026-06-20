import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { JobSeekerDashboard } from './pages/JobSeeker/Dashboard';
import { EmployerDashboard } from './pages/Employer/Dashboard';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { Loader2 } from 'lucide-react';

// Protected route: redirects to /login if not authenticated
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Decides whether to show top Navbar (hide it on dashboard pages)
function Layout() {
  const { user } = useAuth();
  const location = window.location.pathname;
  const isDashboard = location.startsWith('/dashboard');
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-primary/30">
      {!isDashboard && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/job-seeker" element={
            <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/employer" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;
