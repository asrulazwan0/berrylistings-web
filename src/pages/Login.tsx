import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('asrulazwan90@gmail.com');

  // Already authenticated
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleDevLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Login failed');
      }
      const { data } = await res.json();
      localStorage.setItem('berry_jwt', data.token);
      localStorage.setItem('berry_user', JSON.stringify({ name: email.split('@')[0], email, role: data.user.role, permissions: data.user.permissions }));
      window.location.href = '/admin';
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main id="main" className="auth-wrap">
      <div className="auth-visual">
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>For agents &amp; admins</div>
        <h2 style={{ color: 'inherit', fontSize: 'var(--text-2xl)', maxWidth: '16ch', marginTop: 'var(--space-4)' }}>
          Manage your listings in one calm place.
        </h2>
        <p style={{ marginTop: 'var(--space-4)', maxWidth: '40ch', opacity: 0.85 }}>
          Publish new properties, update pricing, and respond to buyer inquiries — all from the Berry agent dashboard.
        </p>
      </div>

      <div className="auth-panel">
        <div className="auth-card card">
          <div className="eyebrow">Development Login</div>
          <h1 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-3)' }}>Sign in to Berry Listings</h1>
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Dev mode — enter your registered email to sign in.
          </p>

          {error && (
            <p style={{ color: 'var(--color-destructive)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-destructive-bg)', borderRadius: 'var(--radius-sm)' }}>
              {error}
            </p>
          )}

          <form onSubmit={handleDevLogin} style={{ marginTop: 'var(--space-6)' }}>
            <label htmlFor="email" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', marginTop: 'var(--space-2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)' }}
              placeholder="asrulazwan90@gmail.com"
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isLoading}
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
            >
              {isLoading ? 'Signing in…' : 'Sign in as Admin'}
            </button>
          </form>

          <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-fg-subtle)', textAlign: 'center' }}>
            Also try: demo@berrylistings.local (regular user)
          </p>
        </div>
      </div>
    </main>
  );
}
