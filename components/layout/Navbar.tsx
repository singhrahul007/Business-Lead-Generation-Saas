'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const appWorkspacePrefixes = [
  '/dashboard',
  '/leads',
  '/crm',
  '/intelligence',
  '/analytics',
  '/developers',
  '/organizations',
];

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/crm', label: 'CRM' },
  { href: '/intelligence', label: 'Intelligence & AI' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/developers', label: 'Developers & API' },
  { href: '/organizations', label: 'Organizations' },
];

export function Navbar() {
  const pathname = usePathname();

  // If we are inside an app workspace, DashboardShell provides the workspace header
  if (appWorkspacePrefixes.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-white transition hover:text-cyan-200">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            LP
          </span>
          <span>
            <span className="block text-base font-semibold tracking-wide">LeadPilot AI</span>
            <span className="block text-xs text-slate-400">Growth OS for revenue teams</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20"
          >
            Start free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}