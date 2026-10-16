import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPreview: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt: string | null;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'paused';
  secret: string;
  createdAt: string;
}

export interface WhiteLabelConfig {
  brandName: string;
  customDomain: string;
  logoUrl: string;
  primaryColor: string;
  supportEmail: string;
  customCssEnabled: boolean;
}

let mockApiKeys: ApiKeyItem[] = [
  {
    id: 'key_live_01',
    name: 'Production Mobile SDK Key',
    keyPreview: 'lp_live_*******************9f4a',
    permissions: ['leads:read', 'leads:write', 'crm:read', 'campaigns:trigger'],
    createdAt: new Date().toISOString(),
    lastUsedAt: 'Just now',
  },
  {
    id: 'key_test_02',
    name: 'Zapier & Make Integration',
    keyPreview: 'lp_test_*******************82bc',
    permissions: ['crm:read', 'crm:write', 'webhooks:listen'],
    createdAt: new Date().toISOString(),
    lastUsedAt: '2 hours ago',
  },
];

let mockWebhooks: WebhookConfig[] = [
  {
    id: 'wh_01',
    url: 'https://api.partnerportal.com/webhooks/leadpilot',
    events: ['lead.created', 'deal.won', 'audit.completed'],
    status: 'active',
    secret: 'whsec_892348a7b9c201',
    createdAt: new Date().toISOString(),
  },
];

let mockWhiteLabel: WhiteLabelConfig = {
  brandName: 'LeadPilot Pro',
  customDomain: 'app.growthagency.io',
  logoUrl: '',
  primaryColor: '#06b6d4',
  supportEmail: 'support@growthagency.io',
  customCssEnabled: true,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  return NextResponse.json({
    data: {
      apiKeys: type === 'apiKeys' || type === 'all' ? mockApiKeys : undefined,
      webhooks: type === 'webhooks' || type === 'all' ? mockWebhooks : undefined,
      whiteLabel: type === 'whiteLabel' || type === 'all' ? mockWhiteLabel : undefined,
      marketplaceIntegrations: [
        {
          id: 'int_hubspot',
          name: 'HubSpot CRM Sync',
          category: 'CRM',
          description: 'Two-way sync of discovered accounts, contacts, and opportunities with HubSpot.',
          installed: true,
          badge: 'Verified',
        },
        {
          id: 'int_salesforce',
          name: 'Salesforce Enterprise',
          category: 'CRM',
          description: 'Sync high-value leads and deals into Salesforce lead queues automatically.',
          installed: false,
          badge: 'Popular',
        },
        {
          id: 'int_whatsapp',
          name: 'WhatsApp Cloud API',
          category: 'Messaging',
          description: 'Send templated conversational messages and track delivery metrics natively.',
          installed: true,
          badge: 'Official',
        },
        {
          id: 'int_zapier',
          name: 'Zapier Automation',
          category: 'Automation',
          description: 'Connect LeadPilot AI to 5,000+ business applications with instant triggers.',
          installed: true,
          badge: 'No-Code',
        },
        {
          id: 'int_slack',
          name: 'Slack Deal Alerts',
          category: 'Notifications',
          description: 'Post real-time channel alerts when high-intent leads are discovered or deals are won.',
          installed: false,
          badge: 'Team',
        },
      ],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === 'createApiKey') {
      const newKey: ApiKeyItem = {
        id: `key_${Date.now()}`,
        name: payload.name || 'Untitled API Key',
        keyPreview: `lp_live_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        permissions: payload.permissions || ['leads:read', 'crm:read'],
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
      };
      mockApiKeys.unshift(newKey);
      return NextResponse.json({ data: newKey, message: 'API Key generated successfully' });
    }

    if (action === 'updateWhiteLabel') {
      mockWhiteLabel = { ...mockWhiteLabel, ...payload };
      return NextResponse.json({ data: mockWhiteLabel, message: 'White-label configuration saved' });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error processing request' }, { status: 500 });
  }
}

