import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean }) => void) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load Google Identity Services script
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGisReady(true);
    script.onerror = () => setError('Failed to load Google sign-in. Please try again.');
    document.head.appendChild(script);
  }, []);

  // Initialize Google button once GIS is loaded and DOM is ready
  useEffect(() => {
    if (!gisReady || !buttonRef.current || !window.google) return;

    const handleCredentialResponse = async (response: { credential: string }) => {
      setError(null);
      setIsLoading(true);
      try {
        await login(response.credential);
        navigate('/admin', { replace: true });
      } catch (err: unknown) {
        setError((err as Error).message || 'Sign-in failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: buttonRef.current.offsetWidth || 400,
      });

      // Also trigger One Tap
      window.google.accounts.id.prompt();
    } else {
      // No client ID configured — show a message instead
      setError(
        'Google OAuth is not configured. Set VITE_GOOGLE_CLIENT_ID in your .env file.',
      );
    }
  }, [gisReady, login, navigate]);

  if (isAuthenticated) return null;

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
        <p style={{ marginTop: 'var(--space-4)', maxWidth: '40ch', opacity: 0.85 }}>
          Publish new properties, update pricing, and respond to buyer inquiries —
          all from the Berry agent dashboard.
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
            Access is managed through your Google account — no separate password needed.
          </p>

          {error && (
            <div
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
            </div>
          )}

          <div style={{ marginTop: 'var(--space-7)' }}>
            {isLoading ? (
              <button className="google-btn" type="button" disabled>
                Signing in…
              </button>
            ) : (
              <div ref={buttonRef} />
            )}
          </div>

          <p
            style={{
              marginTop: 'var(--space-6)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-fg-subtle)',
              textAlign: 'center',
            }}
          >
            By continuing you agree to Berry Listings'{' '}
            <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              Terms
            </a>{' '}
            and{' '}
            <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
