import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type UserItem } from '../../api/client';
import '../../styles/admin.css';

function getMyEmail(): string {
  try { return JSON.parse(localStorage.getItem('berry_user') ?? '{}').email ?? ''; } catch { return ''; }
}

type ModalMode = 'add' | 'edit' | 'toggle' | 'delete' | null;

export default function Users() {
  const myEmail = getMyEmail();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: ModalMode; user: UserItem | null }>({ mode: null, user: null });
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'ADMIN' | 'USER'>('USER');

  const fetchUsers = () => {
    setLoading(true);
    getUsers().then((res) => setUsers(res.data)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, []);

  const openModal = (mode: ModalMode, user: UserItem | null = null) => {
    if (mode === 'edit' && user) { setFormEmail(user.email); setFormRole(user.role as 'ADMIN' | 'USER'); }
    if (mode === 'add') { setFormEmail(''); setFormRole('USER'); }
    setModal({ mode, user });
    setError(null);
  };

  const handleAdd = async () => {
    try { await createUser(formEmail.trim(), formRole); fetchUsers(); setModal({ mode: null, user: null }); }
    catch (e) { setError((e as Error).message); }
  };

  const handleEdit = async () => {
    if (!modal.user) return;
    try { await updateUser(modal.user.uuid, { email: formEmail, role: formRole }); fetchUsers(); setModal({ mode: null, user: null }); }
    catch (e) { setError((e as Error).message); }
  };

  const handleToggle = async () => {
    if (!modal.user) return;
    try { await updateUser(modal.user.uuid, { isEnabled: !modal.user.isEnabled }); fetchUsers(); setModal({ mode: null, user: null }); }
    catch (e) { setError((e as Error).message); }
  };

  const handleDelete = async () => {
    if (!modal.user) return;
    try { await deleteUser(modal.user.uuid); fetchUsers(); setModal({ mode: null, user: null }); }
    catch (e) { setError((e as Error).message); }
  };

  const isSelf = (email: string) => email === myEmail;

  return (
    <main className="admin-main" id="main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, margin: 0 }}>Users</h1>
        <button className="btn btn--primary btn--sm" type="button" onClick={() => openModal('add')}>+ Add user</button>
      </div>

      {error && <p style={{ color: 'var(--color-destructive)', marginBottom: 'var(--space-4)' }} role="alert">{error}</p>}

      {loading ? (
        <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>Loading…</p>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Email</th><th>Role</th><th>Status</th><th style={{ width: 120, textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-fg-muted)' }}>No users found.</td></tr> :
                users.map((u) => {
                  const self = isSelf(u.email);
                  return (
                    <tr key={u.uuid}>
                      <td><strong>{u.email}</strong>{self && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)', marginLeft: 6 }}>(you)</span>}</td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'badge--success' : 'badge--muted'}`}>{u.role}</span></td>
                      <td><span className="chip">{u.isEnabled ? 'Enabled' : 'Disabled'}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                          <button className="icon-btn" type="button" aria-label="Edit user" onClick={() => openModal('edit', u)} title="Edit">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                          </button>
                          <button className="icon-btn" type="button" aria-label={`${u.isEnabled ? 'Disable' : 'Enable'} user`} onClick={() => openModal('toggle', u)} disabled={self} title={self ? 'Cannot modify yourself' : (u.isEnabled ? 'Disable' : 'Enable')}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4v4M8 12h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                          </button>
                          <button className="icon-btn" type="button" aria-label="Delete user" onClick={() => openModal('delete', u)} disabled={self} style={self ? undefined : {}} title={self ? 'Cannot delete yourself' : 'Delete'}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.6 8.5a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      )}

      {/* ---- Modal ---- */}
      {modal.mode && (
        <div className="modal-overlay" onClick={() => setModal({ mode: null, user: null })}>
          <div className="modal-panel" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            {modal.mode === 'add' && (
              <>
                <h2 style={{ margin: 0 }}>Add user</h2>
                <div className="field" style={{ marginTop: 'var(--space-4)' }}>
                  <label htmlFor="add-email">Email address</label>
                  <input className="input" id="add-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="user@example.com" />
                </div>
                <div className="field">
                  <label htmlFor="add-role">Role</label>
                  <div className="select-wrapper">
                    <select className="select" id="add-role" value={formRole} onChange={(e) => setFormRole(e.target.value as 'ADMIN' | 'USER')}>
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <button className="btn btn--primary btn--sm" type="button" onClick={handleAdd} disabled={!formEmail.trim()}>Create</button>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => setModal({ mode: null, user: null })}>Cancel</button>
                </div>
              </>
            )}
            {modal.mode === 'edit' && (
              <>
                <h2 style={{ margin: 0 }}>Edit user</h2>
                <div className="field" style={{ marginTop: 'var(--space-4)' }}>
                  <label htmlFor="edit-email">Email address</label>
                  <input className="input" id="edit-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="edit-role">Role</label>
                  <div className="select-wrapper">
                    <select className="select" id="edit-role" value={formRole} onChange={(e) => setFormRole(e.target.value as 'ADMIN' | 'USER')}>
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <button className="btn btn--primary btn--sm" type="button" onClick={handleEdit}>Save</button>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => setModal({ mode: null, user: null })}>Cancel</button>
                </div>
              </>
            )}
            {modal.mode === 'toggle' && modal.user && (
              <>
                <h2 style={{ margin: 0 }}>{modal.user.isEnabled ? 'Disable' : 'Enable'} user</h2>
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-fg-muted)' }}>
                  Are you sure you want to {modal.user.isEnabled ? 'disable' : 'enable'} <strong>{modal.user.email}</strong>?
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <button className="btn btn--primary btn--sm" type="button" onClick={handleToggle}>Confirm</button>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => setModal({ mode: null, user: null })}>Cancel</button>
                </div>
              </>
            )}
            {modal.mode === 'delete' && modal.user && (
              <>
                <h2 style={{ margin: 0 }}>Delete user</h2>
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-destructive)' }}>
                  This will permanently delete <strong>{modal.user.email}</strong> and all their data. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <button className="btn btn--danger btn--sm" type="button" onClick={handleDelete}>Delete permanently</button>
                  <button className="btn btn--ghost btn--sm" type="button" onClick={() => setModal({ mode: null, user: null })}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
