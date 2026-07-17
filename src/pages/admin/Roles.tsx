import '../../styles/admin.css';

/** Permission labels mirroring backend PERMISSIONS */
const PERMISSIONS = [
  'properties:create', 'properties:edit', 'properties:delete',
  'users:view', 'users:create', 'users:edit', 'users:delete',
];

const ROLE_PERMS: Record<string, string[]> = {
  ADMIN: PERMISSIONS,
  USER: ['properties:create', 'properties:edit'],
};

export default function Roles() {
  return (
    <main className="admin-main" id="main">
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Roles</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-subtle)' }}>Default permissions per role. Custom permissions can be overridden per-user.</p>

      <div style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-5)', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {(['ADMIN', 'USER'] as const).map((role) => (
          <div className="card" key={role} style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-md)' }}>{role === 'ADMIN' ? 'Admin' : 'User'}</h3>
              <span className={`badge ${role === 'ADMIN' ? 'badge--success' : 'badge--muted'}`}>{role}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {PERMISSIONS.map((perm) => {
                const hasIt = ROLE_PERMS[role].includes(perm);
                return (
                  <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: hasIt ? 'var(--color-fg)' : 'var(--color-fg-subtle)' }}>
                    <span>{hasIt ? '✓' : '✕'}</span>
                    <span>{perm}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
