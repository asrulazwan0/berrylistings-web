import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Nav() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link className="brand" to="/">
          <svg className="brand__mark" viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <circle cx="13" cy="19" r="7" fill="#7c2d12" />
            <circle cx="21" cy="19" r="7" fill="#a8431c" />
            <path d="M17 11C17 7 19.5 4.5 23 4C21 7 20 9 20 11" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Berry Listings
        </Link>
        <div className="nav__actions">
          {!isAuthenticated && (
            <Link className="btn btn--ghost btn--sm nav__signin" to="/login">Sign in</Link>
          )}
          <Link className="btn btn--primary btn--sm" to={isAuthenticated ? '/admin' : '/login'}>
            {isAuthenticated ? 'Dashboard' : 'List a property'}
          </Link>
        </div>
      </div>
    </header>
  );
}
