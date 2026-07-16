import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Nav() {
  const { isAuthenticated } = useAuth();

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

        <nav className="nav__links" aria-label="Primary">
          <a href="#">Sell with Berry</a>
          <a href="#">Agents</a>
        </nav>

        <div className="nav__actions">
          {!isAuthenticated && (
            <Link className="btn btn--ghost btn--sm nav__signin" to="/login">
              Sign in
            </Link>
          )}
          <Link className="btn btn--primary btn--sm" to={isAuthenticated ? '/admin' : '/login'}>
            {isAuthenticated ? 'Dashboard' : 'List a property'}
          </Link>
          <button className="nav__menu-btn" type="button" aria-label="Open menu" aria-expanded="false">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
