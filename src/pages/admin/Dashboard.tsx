import { useEffect, useState, useMemo, useCallback } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../../api/client';
import type { Property } from '../../api/types';
import PropertyForm from '../../components/PropertyForm';
import '../../styles/admin.css';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

const STATUS_BADGE: Record<string, string> = { ACTIVE: 'badge badge--success', PENDING: 'badge badge--pending', DRAFT: 'badge badge--muted', SOLD: 'badge badge--muted' };

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    getProperties({ limit: '50', status: '' }).then((res) => setProperties(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (p: Property) => { setEditing(p); setFormOpen(true); };
  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    try { editing ? await updateProperty(editing.uuid, data) : await createProperty(data); setFormOpen(false); fetchAll(); }
    finally { setSaving(false); }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProperty(deleteTarget.uuid);
    setDeleteTarget(null);
    fetchAll();
  };

  const filtered = useMemo(() => properties.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()) || (p.agent?.email ?? '').toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return ms && mst;
  }), [properties, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);
  const setSearchAndReset = (v: string) => { setSearch(v); setPage(1); };
  const setStatusAndReset = (v: string) => { setStatusFilter(v); setPage(1); };

  return (
    <main className="admin-main" id="main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>Listings</h1>
        <button className="btn btn--primary btn--sm" type="button" onClick={handleCreate}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          New listing
        </button>
      </div>

      <div className="card" style={{ padding: 'var(--space-5)' }}>
        <div className="table-toolbar">
          <div className="field" style={{ minWidth: 260 }}>
            <label htmlFor="admin-search" className="visually-hidden">Search listings</label>
            <input className="input" id="admin-search" type="text" placeholder="Search by title, city, or agent" value={search} onChange={(e) => setSearchAndReset(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {['all', 'active', 'pending', 'draft'].map((s) => (
              <button key={s} className="chip" type="button" aria-pressed={statusFilter === s} onClick={() => setStatusAndReset(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>

        {loading ? <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>Loading…</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Property</th><th>Price</th><th>Status</th><th>Agent</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>No listings found.</td></tr> :
                  paged.map((p) => (
                    <tr key={p.uuid}>
                      <td><div className="row-title-cell"><div className="row-thumb" style={{ width: 48, height: 36, borderRadius: 4, overflow: 'hidden' }}>
                        {p.photos.length > 0 ? <img src={p.photos[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="photo-placeholder" aria-hidden="true" style={{ width: 48, height: 36 }}><svg width="16" height="16" viewBox="0 0 28 28" fill="none"><rect x="2" y="2" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2 20l7-7 5 5 4-4 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg></div>}
                      </div><div><strong>{p.title}</strong><span>{p.addressLine}, {p.city}</span></div></div></td>
                      <td>{formatPrice(p.price)}</td>
                      <td><span className={STATUS_BADGE[p.status] ?? 'badge badge--muted'}>{p.status.charAt(0) + p.status.slice(1).toLowerCase()}</span></td>
                      <td>{p.agent?.email ?? 'Unassigned'}</td>
                      <td><div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                        <button className="icon-btn" type="button" aria-label="Edit listing" onClick={() => handleEdit(p)}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg></button>
                        <button className="icon-btn" type="button" aria-label="Delete listing" onClick={() => setDeleteTarget(p)}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8.5a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                      </div></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)' }}>
          <span>Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} listings</span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn--ghost btn--sm" type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span style={{ padding: '4px 8px' }}>Page {page} of {totalPages}</span>
            <button className="btn btn--ghost btn--sm" type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {formOpen && <PropertyForm property={editing} onSave={handleSave} onClose={() => setFormOpen(false)} saving={saving} />}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-panel" style={{ maxWidth: 420, padding: 'var(--space-6)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: 0 }}>Delete listing</h2>
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>This will permanently delete <strong>{deleteTarget.title}</strong> and all associated data. This cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              <button className="btn btn--danger btn--sm" type="button" onClick={handleDelete}>Delete permanently</button>
              <button className="btn btn--ghost btn--sm" type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
