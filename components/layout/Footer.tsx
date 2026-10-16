'use client';

import { usePathname } from 'next/navigation';

const appWorkspacePrefixes = [
  '/dashboard',
  '/leads',
  '/crm',
  '/intelligence',
  '/analytics',
  '/developers',
  '/organizations',
];

export function Footer() {
  const pathname = usePathname();

  if (appWorkspacePrefixes.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-slate-200">LeadPilot AI</p>
          <p className="mt-1">AI-powered growth operations for modern teams.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span>CRM</span>
          <span>Automation</span>
          <span>Analytics</span>
          <span>Lead Discovery</span>
        </div>
      </div>
    </footer>
  );
}