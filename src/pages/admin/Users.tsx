import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type UserItem } from '../../api/client';
import '../../styles/admin.css';

function getMyEmail(): string {
  try { return JSON.parse(localStorage.getItem('berry_user') ?? '{}').email ?? ''; } catch { return ''; }
}

export default function Users() {
  const myEmail = getMyEmail();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<string | null>(null);

  const fetchUsers = () => {
    getUsers().then((res) => setUsers(res.data)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setError(null);
    try { await createUser(newEmail.trim()); setNewEmail(''); setLoading(true); fetchUsers(); } catch (err) { setError((err as Error).message); }
  }

  function handleToggle(uuid: string, enabled: boolean) {
    if (confirmToggle !== uuid) { setConfirmToggle(uuid); return; }
    updateUser(uuid, { isEnabled: !enabled })
      .then(() => { setConfirmToggle(null); setUsers((prev) => prev.map((u) => u.uuid === uuid ? { ...u, isEnabled: !enabled } : u)); })
      .catch((e) => setError(e.message));
  }

  function handleDelete(uuid: string) {
    if (confirmDelete !== uuid) { setConfirmDelete(uuid); return; }
    deleteUser(uuid).then(() => { setConfirmDelete(null); setUsers((prev) => prev.filter((u) => u.uuid !== uuid)); }).catch((e) => setError(e.message));
  }

  return (
    <main className="admin-main" id="main">
      {error && <p style={{ color: 'var(--color-destructive)', marginBottom: 'var(--space-4)' }}>{error}</p>}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <input className="input" type="email" placeholder="new.user@email.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={{ maxWidth: 320 }} />
        <button className="btn btn--primary btn--sm" type="submit">Add User</button>
      </form>
      {loading ? (
        <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>Loading…</p>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Email</th><th>Role</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>No users found.</td></tr> :
                users.map((u) => {
                  const isMe = u.email === myEmail;
                  return (
                    <tr key={u.uuid}>
                      <td><strong>{u.email}</strong>{isMe && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)', marginLeft: 6 }}>(you)</span>}</td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'badge--success' : 'badge--muted'}`}>{u.role}</span></td>
                      <td>
                        {isMe ? <span className="chip" style={{ opacity: 0.6 }}>{u.isEnabled ? 'Enabled' : 'Disabled'}</span> :
                          confirmToggle === u.uuid ? <button className="chip" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }} onClick={() => handleToggle(u.uuid, u.isEnabled)}>Confirm {u.isEnabled ? 'disable' : 'enable'}?</button> :
                          <button className="chip" style={u.isEnabled ? { borderColor: 'var(--color-success)', color: 'var(--color-success)' } : { opacity: 0.5 }} onClick={() => handleToggle(u.uuid, u.isEnabled)}>{u.isEnabled ? 'Enabled' : 'Disabled'}</button>
                        }
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isMe ? <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)' }}>—</span> :
                          <button className="icon-btn" style={confirmDelete === u.uuid ? { color: 'var(--color-destructive)', borderColor: 'var(--color-destructive)' } : undefined} onClick={() => handleDelete(u.uuid)} aria-label={confirmDelete === u.uuid ? 'Confirm delete' : 'Delete user'}>
                            {confirmDelete === u.uuid ? '✓' : '✕'}
                          </button>
                        }
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
