import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import type { Property } from '../../api/types';
import '../../styles/admin.css';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

function hasScope(user: { permissions?: string[] } | null, scope: string): boolean {
  return (user?.permissions ?? []).includes(scope);
}

export default function Overview() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const canViewProps = hasScope(user, 'properties:view');
  const canCreateProps = hasScope(user, 'properties:create');
  const canViewUsers = hasScope(user, 'users:view');
  const canEditUsers = hasScope(user, 'users:edit');

  useEffect(() => {
    if (canViewProps) {
      getProperties({ limit: '5', status: '' }).then((res) => setProperties(res.data)).catch(() => {});
    }
  }, [canViewProps]);

  const stats = useMemo(() => ({
    total: properties.length,
    active: properties.filter((p) => p.status === 'ACTIVE').length,
    pending: properties.filter((p) => p.status === 'PENDING').length,
  }), [properties]);

  return (
    <main className="admin-main" id="main">
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Welcome{user?.name ? `, ${user.name}` : ''}</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)' }}>
        {user?.role ?? 'User'} · {user?.permissions?.length ?? 0} permissions
      </p>

      {/* Properties section — only if user can view */}
      {canViewProps ? (
        <>
          <div className="stat-cards" style={{ marginTop: 'var(--space-5)' }}>
            <div className="card stat-card"><div className="stat-card__label">Total</div><div className="stat-card__value">{stats.total}</div></div>
            <div className="card stat-card"><div className="stat-card__label">Active</div><div className="stat-card__value">{stats.active}</div></div>
            <div className="card stat-card"><div className="stat-card__label">Pending</div><div className="stat-card__value">{stats.pending}</div></div>
          </div>

          <div style={{ marginTop: 'var(--space-5)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Recent listings</h2>
            {properties.length === 0 ? (
              <p style={{ color: 'var(--color-fg-muted)' }}>No properties yet.</p>
            ) : (
              <div className="card" style={{ overflow: 'hidden', marginTop: 'var(--space-3)' }}>
                <table className="data-table">
                  <thead><tr><th>Property</th><th>Price</th><th>Status</th></tr></thead>
                  <tbody>
                    {properties.slice(0, 5).map((p) => (
                      <tr key={p.uuid}>
                        <td><strong>{p.title}</strong><br /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>{p.addressLine}, {p.city}</span></td>
                        <td>{formatPrice(p.price)}</td>
                        <td><span className={`badge ${p.status === 'ACTIVE' ? 'badge--success' : p.status === 'PENDING' ? 'badge--pending' : 'badge--muted'}`}>{p.status.charAt(0) + p.status.slice(1).toLowerCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {canCreateProps && (
              <Link className="btn btn--primary btn--sm" to="/admin/listings" style={{ marginTop: 'var(--space-4)' }}>Manage listings</Link>
            )}
          </div>
        </>
      ) : (
        /* No properties:view — show welcome card */
        <div className="card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-5)', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-fg-subtle)', marginBottom: 'var(--space-3)' }} aria-hidden="true">
            <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>Welcome to Berry Admin</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)', marginTop: 'var(--space-2)', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            You're signed in. Here's what you can do:
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
            {canViewUsers && (
              <Link className="btn btn--ghost btn--sm" to="/admin/users">View users</Link>
            )}
            {canEditUsers && (
              <Link className="btn btn--ghost btn--sm" to="/admin/roles">Manage roles</Link>
            )}
            <Link className="btn btn--ghost btn--sm" to="/admin/settings">Settings</Link>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        {canViewUsers && (
          <Link className="card" to="/admin/users" style={{ padding: 'var(--space-4)', flex: '1 1 200px' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)' }}>Users</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Manage people</div>
          </Link>
        )}
        {canCreateProps && (
          <Link className="card" to="/admin/listings" style={{ padding: 'var(--space-4)', flex: '1 1 200px' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)' }}>Listings</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Manage properties</div>
          </Link>
        )}
        {canEditUsers && (
          <Link className="card" to="/admin/roles" style={{ padding: 'var(--space-4)', flex: '1 1 200px' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)' }}>Roles</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Manage permissions</div>
          </Link>
        )}
      </div>
    </main>
  );
}
