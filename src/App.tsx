import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SkipLink from './components/SkipLink';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SkipLink />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
