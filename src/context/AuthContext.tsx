import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { postAuthGoogle } from '../api/client';

interface AuthState {
  token: string | null;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwt(token: string): { email?: string; name?: string; role?: string } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function loadStoredAuth(): AuthState {
  const token = localStorage.getItem('berry_jwt');
  if (!token) return { token: null, email: null, name: null, isAdmin: false };

  const claims = parseJwt(token);
  return {
    token,
    email: claims?.email ?? null,
    name: claims?.name ?? null,
    isAdmin: claims?.role === 'ADMIN',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadStoredAuth);

  const login = useCallback(async (credential: string) => {
    const { token } = await postAuthGoogle(credential);
    localStorage.setItem('berry_jwt', token);
    const claims = parseJwt(token);
    setAuth({
      token,
      email: claims?.email ?? null,
      name: claims?.name ?? null,
      isAdmin: claims?.role === 'ADMIN',
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('berry_jwt');
    setAuth({ token: null, email: null, name: null, isAdmin: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        isAuthenticated: !!auth.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
