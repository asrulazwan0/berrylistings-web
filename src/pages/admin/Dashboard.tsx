import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProperties } from '../../api/client';
import type { Property } from '../../api/types';
import PhotoPlaceholder from '../../components/PhotoPlaceholder';
import '../../styles/admin.css';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'badge badge--success',
  PENDING: 'badge badge--pending',
  DRAFT: 'badge badge--muted',
  SOLD: 'badge badge--muted',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getProperties({ limit: '50', status: '' })
      .then((res) => setProperties(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        (p.agent?.email ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        p.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [properties, search, statusFilter]);

  const stats = useMemo(() => {
    const active = properties.filter((p) => p.status === 'ACTIVE').length;
    const pending = properties.filter((p) => p.status === 'PENDING').length;
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    return {
      total: properties.length,
      active,
      pending,
      totalValue,
    };
  }, [properties]);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}
        id="admin-sidebar"
        aria-label="Admin navigation"
      >
        <Link className="brand" to="/" style={{ fontSize: 'var(--text-md)' }}>
          <svg
            className="brand__mark"
            viewBox="0 0 34 34"
            fill="none"
            aria-hidden="true"
            style={{ width: 28, height: 28 }}
          >
            <circle cx="13" cy="19" r="7" fill="#7c2d12" />
            <circle cx="21" cy="19" r="7" fill="#a8431c" />
            <path
              d="M17 11C17 7 19.5 4.5 23 4C21 7 20 9 20 11"
              stroke="#a16207"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Berry Admin
        </Link>

        <nav className="admin-nav" aria-label="Admin">
          <a href="#">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
              <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
              <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
              <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Overview
          </a>
          <a href="#" aria-current="page">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 4.5L9 1l6 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Listings
          </a>
          <a href="#">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Users
          </a>
          <a href="#">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 5l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 5v8l7 4 7-4V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Inquiries
          </a>
          <a href="#">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
              <path d="M14.8 9a5.8 5.8 0 0 0-.08-.94l1.42-1.1-1.4-2.42-1.7.5a5.8 5.8 0 0 0-1.6-.94L11 2.4H8l-.44 1.7a5.8 5.8 0 0 0-1.6.94l-1.7-.5-1.4 2.42 1.42 1.1a5.8 5.8 0 0 0 0 1.88l-1.42 1.1 1.4 2.42 1.7-.5c.47.4 1 .72 1.6.94L8 15.6h3l.44-1.7c.6-.22 1.13-.54 1.6-.94l1.7.5 1.4-2.42-1.42-1.1c.05-.31.08-.62.08-.94Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Settings
          </a>
        </nav>

        {user && (
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 'var(--space-5)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className="agent-card__avatar" style={{ width: 38, height: 38, fontSize: 'var(--text-sm)' }}>
                {getInitials(user.name)}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>
                  Admin
                </div>
              </div>
            </div>
            <button
              className="btn btn--ghost btn--sm btn--block"
              style={{ marginTop: 'var(--space-4)' }}
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Backdrop overlay */}
      <button
        className={`admin-backdrop${sidebarOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close admin menu"
        onClick={closeSidebar}
      />

      {/* Main content */}
      <div>
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
            <button
              className="nav__menu-btn admin-menu-btn"
              type="button"
              aria-label="Open admin menu"
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>
                Berry Admin
              </div>
              <h1 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                Listings
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Link className="btn btn--ghost btn--sm admin-view-site" to="/">
              View site
            </Link>
            <button className="btn btn--primary btn--sm" type="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              New listing
            </button>
          </div>
        </header>

        <main className="admin-main" id="main">
          {/* Stats cards */}
          <div className="stat-cards">
            <div className="card stat-card">
              <div className="stat-card__label">Total listings</div>
              <div className="stat-card__value">{stats.total.toLocaleString()}</div>
              <div className="stat-card__delta">All properties</div>
            </div>
            <div className="card stat-card">
              <div className="stat-card__label">Active</div>
              <div className="stat-card__value">{stats.active.toLocaleString()}</div>
              <div className="stat-card__delta">
                {stats.total > 0
                  ? `${Math.round((stats.active / stats.total) * 100)}% of total`
                  : '0%'}
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-card__label">Pending review</div>
              <div className="stat-card__value">{stats.pending}</div>
              <div
                className="stat-card__delta"
                style={{ color: stats.pending > 0 ? 'var(--color-accent)' : undefined }}
              >
                {stats.pending > 0 ? 'Needs attention' : 'All clear'}
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-card__label">Total portfolio value</div>
              <div className="stat-card__value">
                {formatPrice(stats.totalValue).replace(/,/g, '')}
              </div>
              <div className="stat-card__delta">{stats.total} properties</div>
            </div>
          </div>

          {/* Listings table */}
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div className="table-toolbar">
              <div className="field" style={{ minWidth: 260 }}>
                <label htmlFor="admin-search" className="visually-hidden">
                  Search listings
                </label>
                <input
                  className="input"
                  id="admin-search"
                  type="text"
                  placeholder="Search by title, city, or agent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {['all', 'active', 'pending', 'draft'].map((s) => (
                  <button
                    key={s}
                    className="chip"
                    type="button"
                    aria-pressed={statusFilter === s}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>
                Loading listings…
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Agent</th>
                      <th>
                        <span className="visually-hidden">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>
                          No listings found.
                        </td>
                      </tr>
                    ) : (
                      filtered.slice(0, 10).map((property) => (
                        <tr key={property.uuid}>
                          <td>
                            <div className="row-title-cell">
                              <div className="row-thumb">
                                {property.photos.length > 0 ? (
                                  <img src={property.photos[0].url} alt="" />
                                ) : (
                                  <PhotoPlaceholder />
                                )}
                              </div>
                              <div>
                                <strong>{property.title}</strong>
                                <span>
                                  {property.addressLine}, {property.city}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{formatPrice(property.price)}</td>
                          <td>
                            <span className={STATUS_BADGE[property.status] ?? 'badge badge--muted'}>
                              {property.status.charAt(0) + property.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td>{property.agent?.email ?? 'Unassigned'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                              <button className="icon-btn" type="button" aria-label="Edit listing">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11 2l3 3-8 8H3v-3l8-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                                </svg>
                              </button>
                              <button className="icon-btn" type="button" aria-label="Delete listing">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8.5a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'var(--space-5)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-fg-muted)',
              }}
            >
              <span>
                Showing {Math.min(filtered.length, 10)} of {filtered.length} listings
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn--ghost btn--sm" type="button">
                  Previous
                </button>
                <button className="btn btn--ghost btn--sm" type="button">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
