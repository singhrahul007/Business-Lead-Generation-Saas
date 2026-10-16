'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Shield, User, Briefcase, Eye, ShieldAlert } from 'lucide-react';
import { AuthCard, OAuthButtons, SubmitButton } from '@/components/auth/AuthCard';
import { loginSchema } from '@/lib/validators/auth';
import { signInWithOAuth, signInWithPassword } from '@/services/auth';
import type { LoginFormValues } from '@/types/auth';

const DEFAULT_ROLE_CREDENTIALS = [
  {
    role: 'Owner',
    email: 'owner@leadpilot.ai',
    password: 'Password123!',
    description: 'Full workspace ownership, billing & permissions',
    icon: ShieldAlert,
    badgeColor: 'border-cyan-400/30 text-cyan-300 bg-cyan-950/40',
  },
  {
    role: 'Admin',
    email: 'admin@leadpilot.ai',
    password: 'Password123!',
    description: 'Team management, settings, integrations & CRM controls',
    icon: Shield,
    badgeColor: 'border-purple-400/30 text-purple-300 bg-purple-950/40',
  },
  {
    role: 'Manager',
    email: 'manager@leadpilot.ai',
    password: 'Password123!',
    description: 'Campaign builder, lead assignments & pipeline supervision',
    icon: Briefcase,
    badgeColor: 'border-emerald-400/30 text-emerald-300 bg-emerald-950/40',
  },
  {
    role: 'Member',
    email: 'member@leadpilot.ai',
    password: 'Password123!',
    description: 'Lead discovery, prospecting, note logging & task execution',
    icon: User,
    badgeColor: 'border-blue-400/30 text-blue-300 bg-blue-950/40',
  },
  {
    role: 'Viewer',
    email: 'viewer@leadpilot.ai',
    password: 'Password123!',
    description: 'Read-only access to analytics dashboards & reports',
    icon: Eye,
    badgeColor: 'border-slate-500/30 text-slate-300 bg-slate-900/60',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Owner');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEFAULT_ROLE_CREDENTIALS[0].email,
      password: DEFAULT_ROLE_CREDENTIALS[0].password,
    },
  });

  const handleSelectRole = (cred: (typeof DEFAULT_ROLE_CREDENTIALS)[0]) => {
    setSelectedRole(cred.role);
    setValue('email', cred.email, { shouldValidate: true });
    setValue('password', cred.password, { shouldValidate: true });
    toast.success(`Filled credentials for ${cred.role}`);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const { data, error } = await signInWithPassword(values);
    setIsSubmitting(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Signed in successfully.');
    router.refresh();
    router.replace(searchParams.get('redirectTo') || '/dashboard');
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await signInWithOAuth(provider);
    if (error) {
      toast.error(error);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue managing growth, leads, and campaigns."
      footerText="New here?"
      footerHref="/signup"
      footerLinkText="Create an account"
    >
      {/* 1-Click Role Quick Fill Bar */}
      <div className="mb-5 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Default Role Credentials (Click to fill)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_ROLE_CREDENTIALS.map((cred) => {
            const Icon = cred.icon;
            const isSelected = selectedRole === cred.role;

            return (
              <button
                key={cred.role}
                type="button"
                onClick={() => handleSelectRole(cred)}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-sm'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title={`${cred.email} - ${cred.description}`}
              >
                <Icon size={13} />
                <span>{cred.role}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-cyan-400"
            {...register('email')}
          />
          {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email.message?.toString()}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none ring-0 focus:border-cyan-400"
            {...register('password')}
          />
          {errors.password && <p className="mt-2 text-sm text-rose-300">{errors.password.message?.toString()}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-cyan-300 transition hover:text-cyan-200">
            Forgot password?
          </Link>
        </div>
        <SubmitButton label="Sign in" loading={isSubmitting} />
        <OAuthButtons onOAuth={handleOAuth} />
      </form>
    </AuthCard>
  );
}
