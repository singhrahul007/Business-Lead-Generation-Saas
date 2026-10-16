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
  try {
    // If running in local demo / dev mode without a connected Supabase backend
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const isMock = !url || url.includes('demo-leadpilot') || url.includes('your_supabase_project_url');

    if (isMock) {
      // Provide instant local session for default role credentials
      const email = payload.email.toLowerCase();
      let role = 'owner';
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('manager')) role = 'manager';
      else if (email.includes('member')) role = 'member';
      else if (email.includes('viewer')) role = 'viewer';

      const mockUser = {
        id: `usr_${role}_001`,
        app_metadata: {},
        user_metadata: {
          full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
          organization_name: 'LeadPilot Global',
          role,
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: payload.email,
        phone: '',
      };

      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser as any,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('leadpilot_demo_user', JSON.stringify(mockUser));
        // Set standard session cookie so middleware grants access immediately
        document.cookie = `sb-access-token=mock-token-${role}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `sb-demo-role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }

      return {
        data: {
          user: mockUser as any,
          session: mockSession as any,
        },
        error: null,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword(payload);
    return { data: toUserSession(data), error: error?.message ?? null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Authentication service unreachable.' };
  }
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
