import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type UserItem } from '../../api/client';
import '../../styles/admin.css';

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchUsers = () => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setError(null);
    try {
      await createUser(newEmail.trim());
      setNewEmail('');
      setLoading(true);
      fetchUsers();
    } catch (err) { setError((err as Error).message); }
  }

  async function handleToggle(uuid: string, enabled: boolean) {
    await updateUser(uuid, { isEnabled: !enabled });
    setUsers((prev) => prev.map((u) => u.uuid === uuid ? { ...u, isEnabled: !enabled } : u));
  }

  async function handleDelete(uuid: string) {
    if (confirmDelete !== uuid) { setConfirmDelete(uuid); return; }
    await deleteUser(uuid);
    setConfirmDelete(null);
    setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <a className="brand" href="/" style={{ fontSize: 'var(--text-md)' }}>Berry Admin</a>
        <nav className="admin-nav" aria-label="Admin">
          <a href="/admin">Overview</a>
          <a href="/admin" aria-current="page">Listings</a>
          <a href="/admin/users">Users</a>
          <a href="#">Settings</a>
        </nav>
      </aside>
      <div>
        <header className="admin-topbar">
          <div><h1 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Users</h1></div>
          <a className="btn btn--ghost btn--sm" href="/admin">← Back to listings</a>
        </header>
        <main className="admin-main" id="main">
          {error && <p style={{ color: 'var(--color-destructive)', marginBottom: 'var(--space-4)' }}>{error}</p>}

          <form onSubmit={handleAdd} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <input className="input" type="email" placeholder="new.user@email.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={{ maxWidth: 320 }} />
            <button className="btn btn--primary btn--sm" type="submit">Add User</button>
          </form>

          {loading ? (
            <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>Loading users…</p>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Email</th><th>Role</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>No users found.</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.uuid}>
                      <td><strong>{u.email}</strong></td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'badge--success' : 'badge--muted'}`}>{u.role}</span></td>
                      <td>
                        <button
                          className={`chip ${u.isEnabled ? '' : ''}`}
                          style={u.isEnabled ? { borderColor: 'var(--color-success)', color: 'var(--color-success)' } : { opacity: 0.5 }}
                          onClick={() => handleToggle(u.uuid, u.isEnabled)}
                        >
                          {u.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="icon-btn"
                          style={confirmDelete === u.uuid ? { color: 'var(--color-destructive)', borderColor: 'var(--color-destructive)' } : undefined}
                          onClick={() => handleDelete(u.uuid)}
                          aria-label={confirmDelete === u.uuid ? 'Confirm delete' : 'Delete user'}
                        >
                          {confirmDelete === u.uuid ? '✓' : '✕'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
