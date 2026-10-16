import { requireAuthenticatedUser } from '@/lib/auth/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuthenticatedUser('/dashboard');

  return children;
}
