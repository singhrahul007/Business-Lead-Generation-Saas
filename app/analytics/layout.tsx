import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revenue & Performance Analytics | LeadPilot AI',
  description: 'Track conversion funnels, pipeline attribution, and export audit-ready reports.',
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

