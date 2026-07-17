import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SkipLink from './components/SkipLink';
import Nav from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Overview from './pages/admin/Overview';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import Roles from './pages/admin/Roles';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SkipLink />
        <Nav />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout><Overview /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/listings" element={<ProtectedRoute requireAdmin><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminLayout><Users /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute requireAdmin><AdminLayout><Roles /></AdminLayout></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
