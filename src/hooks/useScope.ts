import { useAuth } from '../contexts/AuthContext';

/** Check if the current user has one or more permissions */
export function useScope(...required: string[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  const perms = user.permissions ?? [];
  if (perms.length === 0) return false;
  return required.every((p) => perms.includes(p));
}

/** Check if user has ANY of the given permissions */
export function useScopeAny(...required: string[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  const perms = user.permissions ?? [];
  if (perms.length === 0) return false;
  return required.some((p) => perms.includes(p));
}
