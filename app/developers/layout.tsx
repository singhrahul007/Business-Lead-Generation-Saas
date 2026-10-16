import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developers & White-Label Ecosystem | LeadPilot AI',
  description: 'Manage API keys, webhooks, mobile application endpoints, white-label branding, and self-hosted migration.',
};

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

