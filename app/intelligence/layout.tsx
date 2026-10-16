import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Growth Intelligence & AI Automation | LeadPilot AI',
  description: 'AI website audits, marketing automation, and automated sales co-pilot.',
};

export default function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

