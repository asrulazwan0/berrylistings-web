import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  scope?: string;
}

export default function ProtectedRoute({ children, scope }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <main id="main" className="container" style={{ paddingBlock: 'var(--space-7)', textAlign: 'center' }}><p style={{ color: 'var(--color-fg-muted)' }}>Checking authentication…</p></main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (scope && user && !(user.permissions ?? []).includes(scope)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
