import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export interface CampaignPayload {
  name: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'multichannel';
  targetAudience: string;
  triggerEvent: string;
  messageTemplate: string;
  scheduleDelay: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: CampaignPayload = await request.json();

    if (!payload.name || !payload.messageTemplate) {
      return NextResponse.json(
        { error: 'Campaign name and message template are required' },
        { status: 400 },
      );
    }

    const campaign = {
      id: `camp-${Date.now()}`,
      ...payload,
      status: 'active',
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        responded: 0,
        conversions: 0,
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: campaign, message: 'Campaign workflow created successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

