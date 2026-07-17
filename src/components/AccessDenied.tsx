export default function AccessDenied() {
  return (
    <main className="admin-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', textAlign: 'center' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-fg-subtle)', marginBottom: 'var(--space-4)' }} aria-hidden="true">
        <path d="M12 15v-2m0-4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>Access denied</h2>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-fg-muted)', marginTop: 'var(--space-2)', maxWidth: 360 }}>
        You don't have permission to view this page. Contact an admin if you think this is a mistake.
      </p>
    </main>
  );
}
