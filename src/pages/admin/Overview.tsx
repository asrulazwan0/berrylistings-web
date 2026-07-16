import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../../api/client';
import type { Property } from '../../api/types';
import '../../styles/admin.css';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export default function Overview() {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, totalValue: 0, recent: [] as Property[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties({ limit: '50', status: '' })
      .then((res) => {
        const data = res.data;
        setStats({
          total: data.length,
          active: data.filter((p) => p.status === 'ACTIVE').length,
          pending: data.filter((p) => p.status === 'PENDING').length,
          totalValue: data.reduce((s, p) => s + p.price, 0),
          recent: data.slice(0, 5),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>Loading…</p>;

  return (
    <main className="admin-main" id="main">
      <div className="stat-cards">
        <div className="card stat-card"><div className="stat-card__label">Total listings</div><div className="stat-card__value">{stats.total}</div><div className="stat-card__delta">All properties</div></div>
        <div className="card stat-card"><div className="stat-card__label">Active</div><div className="stat-card__value">{stats.active}</div><div className="stat-card__delta">{stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : '0%'}</div></div>
        <div className="card stat-card"><div className="stat-card__label">Pending</div><div className="stat-card__value">{stats.pending}</div><div className="stat-card__delta" style={{ color: stats.pending > 0 ? 'var(--color-accent)' : undefined }}>{stats.pending > 0 ? 'Needs attention' : 'All clear'}</div></div>
        <div className="card stat-card"><div className="stat-card__label">Portfolio value</div><div className="stat-card__value">{formatPrice(stats.totalValue)}</div><div className="stat-card__delta">{stats.total} properties</div></div>
      </div>

      <div className="card" style={{ padding: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-body)' }}>Recent listings</h3>
          <Link to="/admin/listings" className="btn btn--ghost btn--sm">View all</Link>
        </div>
        <table className="data-table">
          <thead><tr><th>Property</th><th>Price</th><th>Status</th></tr></thead>
          <tbody>
            {stats.recent.map((p) => (
              <tr key={p.uuid}>
                <td><strong>{p.title}</strong><br /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-muted)' }}>{p.addressLine}, {p.city}</span></td>
                <td>{formatPrice(p.price)}</td>
                <td><span className={`badge ${p.status === 'ACTIVE' ? 'badge--success' : p.status === 'PENDING' ? 'badge--pending' : 'badge--muted'}`}>{p.status.charAt(0) + p.status.slice(1).toLowerCase()}</span></td>
              </tr>
            ))}
            {stats.recent.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-fg-muted)' }}>No listings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
