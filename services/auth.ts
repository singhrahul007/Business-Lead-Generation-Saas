import { createClient } from '@/lib/supabase/client';
import type {
  AuthActionResult,
  AuthCredentials,
  AuthRecoveryResult,
  AuthSessionResult,
  AuthUserResult,
  SignupPayload,
} from '@/types/auth';
import { toAuthUser, toUserSession, type UserSession } from '@/types/user';
import { UserService } from '@/services/user';

const supabase = createClient();

export const AuthService = {
  signInWithPassword,
  signInWithOAuth,
  signUpWithPassword,
  resetPasswordForEmail,
  updatePassword,
  recoverSessionFromUrl,
  signOut,
  getCurrentSession,
  getAuthenticatedUser: (client = supabase) => UserService.getAuthenticatedUser(client),
  signOutWithClient: async (client = supabase): Promise<AuthActionResult> => {
    const { error } = await client.auth.signOut();
    return { error: error?.message ?? null };
  },
};

function getRedirectUrl(pathname: string) {
  if (typeof window !== 'undefined') {
    return new URL(pathname, window.location.origin).toString();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return new URL(pathname, siteUrl).toString();
}

export async function signInWithPassword(payload: AuthCredentials): Promise<AuthSessionResult> {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  return { data: toUserSession(data), error: error?.message ?? null };
}

export async function signInWithOAuth(provider: 'google' | 'github'): Promise<AuthActionResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getRedirectUrl('/dashboard'),
    },
  });
  return { error: error?.message ?? null };
}

export async function signUpWithPassword(payload: SignupPayload): Promise<AuthSessionResult> {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: getRedirectUrl('/dashboard'),
      data: {
        full_name: payload.fullName ?? '',
        organization_name: payload.organizationName ?? '',
      },
    },
  });

  return { data: toUserSession(data), error: error?.message ?? null };
}

export async function resetPasswordForEmail(email: string): Promise<AuthActionResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRedirectUrl('/reset-password'),
  });

  return { error: error?.message ?? null };
}

export async function updatePassword(password: string): Promise<AuthUserResult> {
  const { data, error } = await supabase.auth.updateUser({ password });
  return { data: toAuthUser(data.user), error: error?.message ?? null };
}

export async function recoverSessionFromUrl(): Promise<AuthRecoveryResult> {
  if (typeof window === 'undefined') {
    return { error: null, recovered: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return { error: error?.message ?? null, recovered: true };
  }

  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return { error: null, recovered: false };
  }

  const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  return { error: error?.message ?? null, recovered: true };
}

export async function signOut(): Promise<AuthActionResult> {
  return AuthService.signOutWithClient(supabase);
}

export async function getCurrentSession(): Promise<UserSession['session']> {
  return UserService.getCurrentSession(supabase);
}
