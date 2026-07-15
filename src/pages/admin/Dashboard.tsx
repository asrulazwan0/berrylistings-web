import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProperties } from '../../api/client';
import type { Property } from '../../api/types';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return '1 week ago';
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  if (diff < 60) return '1 month ago';
  return `${Math.floor(diff / 30)} months ago`;
}

type StatusFilter = 'all' | 'active' | 'pending' | 'draft';

export default function AdminDashboard() {
  const { name } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AZ';

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProperties({ limit: '50' });
      setProperties(res.data);
      setTotal(res.meta.total);
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = properties.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.street.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && p.status !== 'ACTIVE') return false;
      if (statusFilter === 'pending' && p.status !== 'PENDING') return false;
      if (statusFilter === 'draft' && p.status !== 'DRAFT') return false;
    }
    return true;
  });

  const activeCount = properties.filter((p) => p.status === 'ACTIVE').length;

  function statusBadge(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'badge--success';
      case 'PENDING':
        return 'badge--pending';
      case 'DRAFT':
        return 'badge--muted';
      case 'SOLD':
        return 'badge--muted';
      default:
        return 'badge--muted';
    }
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

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="agent-card__avatar" style={{ width: 38, height: 38, fontSize: 'var(--text-sm)' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{name ?? 'Admin'}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      <button
        className={`admin-backdrop${sidebarOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close admin menu"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div>
        {/* Top bar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
            <button
              className="nav__menu-btn admin-menu-btn"
              type="button"
              aria-label="Open admin menu"
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>Berry Admin</div>
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
          {/* Loading */}
          {loading && (
            <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
              Loading listings…
            </p>
          )}

          {/* Error */}
          {error && (
            <p style={{ color: 'var(--color-destructive)', textAlign: 'center', padding: 'var(--space-8)' }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              {/* Stat cards */}
              <div className="stat-cards">
                <div className="card stat-card">
                  <div className="stat-card__label">Total listings</div>
                  <div className="stat-card__value">{total.toLocaleString()}</div>
                  <div className="stat-card__delta">+{properties.length} loaded</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-card__label">Active</div>
                  <div className="stat-card__value">{activeCount.toLocaleString()}</div>
                  <div className="stat-card__delta">
                    {total > 0 ? `${Math.round((activeCount / total) * 100)}% of total` : '—'}
                  </div>
                </div>
                <div className="card stat-card">
                  <div className="stat-card__label">Pending review</div>
                  <div className="stat-card__value">
                    {properties.filter((p) => p.status === 'PENDING').length}
                  </div>
                  <div className="stat-card__delta" style={{ color: 'var(--color-accent)' }}>Needs attention</div>
                </div>
                <div className="card stat-card">
                  <div className="stat-card__label">Total portfolio value</div>
                  <div className="stat-card__value">
                    {formatPrice(
                      properties
                        .filter((p) => p.status === 'ACTIVE')
                        .reduce((sum, p) => sum + p.price, 0),
                    )}
                  </div>
                  <div className="stat-card__delta">{activeCount} active listings</div>
                </div>
              </div>

              {/* Listings table */}
              <div className="card admin-table-card" style={{ padding: 'var(--space-5)' }}>
                <div className="table-toolbar">
                  <div className="field" style={{ minWidth: 260 }}>
                    <label htmlFor="search" className="visually-hidden">
                      Search listings
                    </label>
                    <input
                      className="input"
                      id="search"
                      type="text"
                      placeholder="Search by title, city, or agent"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {(['all', 'active', 'pending', 'draft'] as const).map((f) => (
                      <button
                        key={f}
                        className="chip"
                        type="button"
                        aria-pressed={statusFilter === f}
                        onClick={() => setStatusFilter(f)}
                      >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
                    No listings match your search.
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Updated</th>
                          <th>
                            <span className="visually-hidden">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="row-title-cell">
                                <div className="row-thumb">
                                  {p.images.length > 0 ? (
                                    <img src={p.images[0].url} alt="" />
                                  ) : (
                                    <div className="photo-placeholder" aria-hidden="true" />
                                  )}
                                </div>
                                <div>
                                  <strong>{p.title}</strong>
                                  <span>
                                    {p.street}, {p.city}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>{formatPrice(p.price)}</td>
                            <td>
                              <span className={`badge ${statusBadge(p.status)}`}>
                                {p.status}
                              </span>
                            </td>
                            <td>{timeAgo(p.updatedAt)}</td>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                <div
                  className="admin-pagination"
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
                    Showing {filtered.length} of {total.toLocaleString()} listings
                  </span>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn--ghost btn--sm" type="button" disabled>
                      Previous
                    </button>
                    <button className="btn btn--ghost btn--sm" type="button">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
