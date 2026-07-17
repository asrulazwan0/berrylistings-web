import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`} id="admin-sidebar" aria-label="Admin navigation">
        <Link className="brand" to="/" style={{ fontSize: 'var(--text-md)' }}>
          <svg className="brand__mark" viewBox="0 0 34 34" fill="none" aria-hidden="true" style={{ width: 28, height: 28 }}>
            <circle cx="13" cy="19" r="7" fill="#7c2d12" /><circle cx="21" cy="19" r="7" fill="#a8431c" />
            <path d="M17 11C17 7 19.5 4.5 23 4C21 7 20 9 20 11" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Berry Admin
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          <Link to="/admin">Overview</Link>
          <Link to="/admin/listings">Listings</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/settings">Settings</Link>
        </nav>
        {user && (
          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className="agent-card__avatar" style={{ width: 38, height: 38, fontSize: 'var(--text-sm)' }}>{getInitials(user.name ?? user.email ?? 'A')}</div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{user.name ?? user.email}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>Admin</div>
              </div>
            </div>
            <button className="btn btn--ghost btn--sm btn--block" style={{ marginTop: 'var(--space-4)' }} onClick={logout}>Sign out</button>
          </div>
        )}
      </aside>
      <button className={`admin-backdrop${sidebarOpen ? ' is-open' : ''}`} type="button" aria-label="Close admin menu" onClick={() => setSidebarOpen(false)} />
      <div style={{ width: '100%' }}>
        <button
          className="nav__menu-btn admin-menu-btn"
          type="button"
          aria-label="Open admin menu"
          aria-controls="admin-sidebar"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((o) => !o)}
          style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', zIndex: 50 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}
