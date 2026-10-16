import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export interface AuditResult {
  url: string;
  domain: string;
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
    reputation: number;
    overall: number;
  };
  metrics: {
    loadTimeMs: number;
    mobileOptimized: boolean;
    sslActive: boolean;
    hasMetaDescription: boolean;
    hasOpenGraph: boolean;
    backlinksEstimate: number;
    reviewCount: number;
    averageReviewRating: number;
  };
  recommendations: Array<{
    id: string;
    priority: 'high' | 'medium' | 'low';
    category: 'SEO' | 'Speed' | 'Conversion' | 'Reputation';
    title: string;
    description: string;
    estimatedImpact: string;
  }>;
  aiInsights: {
    strengths: string[];
    vulnerabilities: string[];
    revenueGrowthPotential: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, companyName, industry } = body;

    if (!url && !companyName) {
      return NextResponse.json(
        { error: 'Website URL or company name is required' },
        { status: 400 },
      );
    }

    const domain = url ? url.replace(/^https?:\/\//i, '').split('/')[0] : `${(companyName || 'lead').toLowerCase().replace(/\s+/g, '')}.com`;

    // High quality deterministic simulation based on domain/inputs
    const hash = (domain + (industry || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seoScore = 65 + (hash % 30);
    const perfScore = 55 + ((hash * 3) % 40);
    const accessScore = 70 + ((hash * 7) % 25);
    const repScore = 60 + ((hash * 11) % 35);
    const overall = Math.round((seoScore * 0.35 + perfScore * 0.25 + accessScore * 0.15 + repScore * 0.25));

    const auditData: AuditResult = {
      url: url || `https://${domain}`,
      domain,
      scores: {
        seo: seoScore,
        performance: perfScore,
        accessibility: accessScore,
        reputation: repScore,
        overall,
      },
      metrics: {
        loadTimeMs: 1200 + ((hash * 13) % 2400),
        mobileOptimized: hash % 4 !== 0,
        sslActive: true,
        hasMetaDescription: hash % 3 !== 0,
        hasOpenGraph: hash % 2 === 0,
        backlinksEstimate: 140 + ((hash * 23) % 1800),
        reviewCount: 15 + (hash % 120),
        averageReviewRating: Number((3.8 + ((hash % 12) * 0.1)).toFixed(1)),
      },
      recommendations: [
        {
          id: 'rec-1',
          priority: 'high',
          category: 'SEO',
          title: 'Optimize Local Schema Markup and Core Meta Tags',
          description: `Add Structured Data (LocalBusiness Schema) to help Google search rank ${companyName || domain} prominently in local map packs.`,
          estimatedImpact: '+25% Local organic inquiries',
        },
        {
          id: 'rec-2',
          priority: 'high',
          category: 'Conversion',
          title: 'Deploy Automated Chat & Instant Lead Capture',
          description: 'Over 68% of mobile prospects bounce if there is no immediate way to book an appointment or request a fast quote.',
          estimatedImpact: '+35% Lead capture rate',
        },
        {
          id: 'rec-3',
          priority: 'medium',
          category: 'Speed',
          title: 'Compress Next-Gen Media & Defer Unused JS',
          description: 'Images and render-blocking scripts are delaying Largest Contentful Paint (LCP) by over 1.4 seconds.',
          estimatedImpact: '-40% Bounce rate on mobile',
        },
        {
          id: 'rec-4',
          priority: 'medium',
          category: 'Reputation',
          title: 'Automate 5-Star Google Review Requests via WhatsApp/SMS',
          description: 'A surge of 15-20 verified 5-star customer reviews will jump local Google ranking ahead of top 3 competitors.',
          estimatedImpact: '+2.1x Brand trust and conversions',
        },
      ],
      aiInsights: {
        strengths: [
          'Established primary brand keywords in page titles',
          'Fast DNS resolution and active SSL security encryption',
          'Positive baseline sentiment in customer feedback',
        ],
        vulnerabilities: [
          'Under-optimized page speed on cellular 4G connections',
          'Missing automated post-visit retargeting triggers',
          'Unclaimed secondary local directory listings (Bing, Yelp, Apple Maps)',
        ],
        revenueGrowthPotential: 'Estimated $12,000 - $28,000 additional monthly pipeline with automated lead capture & SEO remediation.',
      },
    };

    return NextResponse.json({ data: auditData });
  } catch {
    return NextResponse.json({ error: 'Failed to generate audit' }, { status: 500 });
  }
}

