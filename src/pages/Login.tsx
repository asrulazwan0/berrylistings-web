import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

export default function Login() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to admin
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleGoogleSignIn() {
    setError(null);
    try {
      // Use Google Identity Services — the client ID would come from env config
      // For now, we simulate with a credential prompt.
      // In production, use: google.accounts.id.initialize({ client_id, callback })
      // and google.accounts.id.prompt()

      // Store a mock/demo credential for development
      // In real deployment, Google OAuth popup returns a credential JWT
      const mockCredential = prompt(
        'Enter a demo credential token (or press Cancel to cancel)',
      );

      if (!mockCredential) return;

      await login(mockCredential);
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  return (
    <main id="main" className="auth-wrap">
      <div className="auth-visual">
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>
          For agents &amp; admins
        </div>
        <h2
          style={{
            color: 'inherit',
            fontSize: 'var(--text-2xl)',
            maxWidth: '16ch',
            marginTop: 'var(--space-4)',
          }}
        >
          Manage your listings in one calm place.
        </h2>
        <p
          style={{
            marginTop: 'var(--space-4)',
            maxWidth: '40ch',
            opacity: 0.85,
          }}
        >
          Publish new properties, update pricing, and respond to buyer inquiries
          — all from the Berry agent dashboard.
        </p>
      </div>

      <div className="auth-panel">
        <div className="auth-card card">
          <div className="eyebrow">Welcome back</div>
          <h1 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-3)' }}>
            Sign in to Berry Listings
          </h1>
          <p
            style={{
              color: 'var(--color-fg-muted)',
              fontSize: 'var(--text-sm)',
              marginTop: 'var(--space-2)',
            }}
          >
            Access is managed through your Google account — no separate password
            needed.
          </p>

          {error && (
            <p
              style={{
                color: 'var(--color-destructive)',
                fontSize: 'var(--text-sm)',
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                background: 'var(--color-destructive-bg)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {error}
            </p>
          )}

          <button
            className="google-btn"
            type="button"
            style={{ marginTop: 'var(--space-7)' }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62Z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
              />
              <path
                fill="#FBBC05"
                d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
              />
            </svg>
            {isLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p
            style={{
              marginTop: 'var(--space-6)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-fg-subtle)',
              textAlign: 'center',
            }}
          >
            By continuing you agree to Berry Listings&apos;{' '}
            <a
              href="#"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'underline',
              }}
            >
              Terms
            </a>{' '}
            and{' '}
            <a
              href="#"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'underline',
              }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
