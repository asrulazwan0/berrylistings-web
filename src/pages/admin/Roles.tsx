import { useEffect, useState } from 'react';
import { fetchApi } from '../../api/client';
import '../../styles/admin.css';

const ALL_PERMISSIONS = [
  'properties:view', 'properties:create', 'properties:edit', 'properties:delete',
  'users:view', 'users:create', 'users:edit', 'users:delete',
];

interface ManagedRole {
  id: number;
  name: string;
  permissions: string[];
}

export default function Roles() {
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [perms, setPerms] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [showNew, setShowNew] = useState(false);

  const fetchRoles = () => {
    setLoading(true);
    fetchApi<{ data: ManagedRole[] }>('/roles').then((r) => setRoles(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoles(); }, []);

  const togglePerm = (perm: string) => {
    setPerms((prev) => prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]);
  };

  const startEdit = (role: ManagedRole) => {
    setEditing(role.name);
    setPerms([...(typeof role.permissions === 'string' ? JSON.parse(role.permissions as string) : role.permissions)]);
  };

  const saveRole = async (name: string) => {
    try {
      await fetchApi(`/roles/${encodeURIComponent(name)}`, { method: 'PUT', body: JSON.stringify({ name, permissions: perms }) });
      setEditing(null);
      fetchRoles();
    } catch (e) { setError((e as Error).message); }
  };

  const deleteRole = async (name: string) => {
    if (name === 'ADMIN' || name === 'USER') { setError('Cannot delete built-in roles.'); return; }
    try {
      await fetchApi(`/roles/${encodeURIComponent(name)}`, { method: 'DELETE' });
      fetchRoles();
    } catch (e) { setError((e as Error).message); }
  };

  const createRole = async () => {
    const name = newName.trim().toUpperCase();
    if (!name) return;
    try {
      await fetchApi(`/roles/${encodeURIComponent(name)}`, { method: 'PUT', body: JSON.stringify({ name, permissions: [] }) });
      setNewName('');
      setShowNew(false);
      fetchRoles();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <main className="admin-main" id="main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>Roles</h1>
        <button className="btn btn--primary btn--sm" type="button" onClick={() => setShowNew(true)}>+ New role</button>
      </div>

      {error && <p style={{ color: 'var(--color-destructive)', marginBottom: 'var(--space-4)' }} role="alert">{error}</p>}

      {showNew && (
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="new-role-name">Role name</label>
              <input className="input" id="new-role-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. EDITOR" />
            </div>
            <button className="btn btn--primary btn--sm" type="button" onClick={createRole} disabled={!newName.trim()}>Create</button>
            <button className="btn btn--ghost btn--sm" type="button" onClick={() => { setShowNew(false); setNewName(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {roles.map((role) => {
            const isBuiltin = role.name === 'ADMIN' || role.name === 'USER';
            const rolePerms: string[] = typeof role.permissions === 'string' ? JSON.parse(role.permissions as string) : role.permissions;
            const isEditing = editing === role.name;
            const currentPerms = isEditing ? perms : rolePerms;

            return (
              <div className="card" key={role.id} style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-md)' }}>{role.name}</h3>
                    {isBuiltin && <span className="badge badge--muted">built-in</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    {isEditing ? (
                      <>
                        <button className="btn btn--primary btn--sm" type="button" onClick={() => saveRole(role.name)}>Save</button>
                        <button className="btn btn--ghost btn--sm" type="button" onClick={() => setEditing(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="icon-btn" type="button" aria-label="Edit role" onClick={() => startEdit(role)}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                        </button>
                        {!isBuiltin && (
                          <button className="icon-btn" type="button" aria-label="Delete role" onClick={() => deleteRole(role.name)}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8.5a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {ALL_PERMISSIONS.map((perm) => {
                    const hasIt = currentPerms.includes(perm);
                    return (
                      <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: hasIt ? 'var(--color-fg)' : 'var(--color-fg-subtle)', cursor: isEditing ? 'pointer' : 'default', padding: '2px 0' }}>
                        {isEditing ? (
                          <input type="checkbox" checked={hasIt} onChange={() => togglePerm(perm)} style={{ accentColor: 'var(--color-primary)' }} />
                        ) : (
                          <span>{hasIt ? '✓' : '✕'}</span>
                        )}
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
