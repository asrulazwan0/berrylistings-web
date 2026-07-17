import { useAuth } from '../../contexts/AuthContext';
import '../../styles/admin.css';

export default function Settings() {
  const { user } = useAuth();

  return (
    <main className="admin-main" id="main">
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>Settings</h1>

      <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 600 }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-body)', marginBottom: 'var(--space-2)' }}>Profile</h2>
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>Your account information.</p>
        <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
          <label>Name</label>
          <input className="input" value={user?.name ?? ''} readOnly style={{ opacity: 0.7 }} />
        </div>
        <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
          <label>Email</label>
          <input className="input" value={user?.email ?? ''} readOnly style={{ opacity: 0.7 }} />
        </div>
        <div className="field">
          <label>Role</label>
          <input className="input" value={user?.role ?? ''} readOnly style={{ opacity: 0.7 }} />
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)', maxWidth: 600, marginTop: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-body)', marginBottom: 'var(--space-2)' }}>General</h2>
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>Application settings coming soon.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <label className="chip" style={{ cursor: 'pointer' }}><input type="checkbox" style={{ marginRight: 8 }} /> Email notifications for new listings</label>
          <label className="chip" style={{ cursor: 'pointer' }}><input type="checkbox" style={{ marginRight: 8 }} /> Email notifications for inquiries</label>
        </div>
      </div>
    </main>
  );
}
