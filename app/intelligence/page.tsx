'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Search,
  Globe,
  Gauge,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Mail,
  Send,
  MessageSquare,
  Bot,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { Button, Badge, EmptyState } from '@/components/ui';
import type { AuditResult } from '@/app/api/intelligence/audit/route';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'campaigns' | 'assistant'>('audit');

  // Audit state
  const [url, setUrl] = useState('https://modernhealthcare.example.com');
  const [companyName, setCompanyName] = useState('Premier Health Clinic');
  const [industry, setIndustry] = useState('Healthcare');
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  // Campaign state
  const [campaignName, setCampaignName] = useState('High-Intent Prospect Follow-up');
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'sms' | 'multichannel'>('multichannel');
  const [targetAudience, setTargetAudience] = useState('Discovered leads with no response in 48h');
  const [messageTemplate, setMessageTemplate] = useState(
    'Hi {{contact_name}}, I noticed {{company_name}} could easily rank higher on Google local search in {{city}}. We prepared a complimentary 3-minute performance roadmap for your team. Would Thursday at 11am work for a quick review?',
  );
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'Hello! I am LeadPilot AI Assistant. I can analyze leads, compose personalized outreach campaigns, forecast pipeline conversion, or suggest next-best sales actions. How can I help today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const runAudit = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch('/api/intelligence/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, companyName, industry }),
      });
      const json = await res.json();
      if (json.data) {
        setAuditResult(json.data);
        toast.success('AI Audit completed successfully!');
      } else {
        toast.error(json.error || 'Audit failed');
      }
    } catch {
      toast.error('Network error running audit');
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCampaign(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          channel,
          targetAudience,
          triggerEvent: 'Discovered Lead Added',
          messageTemplate,
          scheduleDelay: '2 hours',
        }),
      });
      const json = await res.json();
      if (json.data) {
        toast.success('Marketing automation workflow launched!');
      } else {
        toast.error(json.error || 'Failed to start campaign');
      }
    } catch {
      toast.error('Error starting campaign');
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `Based on your revenue goals and pipeline, prioritizing high-intent local businesses in ${industry} will yield the highest ROI. I recommend launching our automated multichannel sequence to 25 verified contacts.`;
      if (userText.toLowerCase().includes('seo') || userText.toLowerCase().includes('audit')) {
        reply = `I ran an instant SEO check: the biggest lever for ${companyName || 'your leads'} is adding LocalBusiness Schema markup and claiming missing directory citations to leapfrog competitors.`;
      } else if (userText.toLowerCase().includes('email') || userText.toLowerCase().includes('template')) {
        reply = `Here is a high-converting cold email template for decision-makers: "Subject: Quick question regarding {{company_name}}'s Google visibility - Hi {{contact_name}}, noticed your team is missing out on ~30 monthly appointment bookings due to unindexed keywords. Let's fix this in 15 mins."`;
      }
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Growth Intelligence & AI Automation"
          description="Analyze target websites, generate AI business opportunity reports, launch multi-channel campaigns, and consult your sales assistant."
          actions={
            <div className="flex gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-1">
              <button
                onClick={() => setActiveTab('audit')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'audit' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                SEO & Website Audit
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'campaigns' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Campaigns & Automation
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'assistant' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                AI Sales Assistant
              </button>
            </div>
          }
        />

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <WidgetCard title="Analyze Target Business" subtitle="Enter a prospect URL or company to evaluate performance, SEO, and opportunities">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs text-slate-400">Website URL</label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Company Name</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Clinic"
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Industry</label>
                  <input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Healthcare / Legal / SaaS"
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
                  />
                </div>
              </div>
              <div className="mt-5">
                <Button onClick={runAudit} isLoading={loadingAudit}>
                  <Sparkles size={16} /> Run AI Growth Audit
                </Button>
              </div>
            </WidgetCard>

            {auditResult && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Overall Health</p>
                    <p className="mt-2 text-4xl font-bold text-cyan-400">{auditResult.scores.overall}/100</p>
                    <Badge variant="cyan" size="sm" className="mt-2">Good Baseline</Badge>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-400">SEO Score</p>
                    <p className="mt-2 text-4xl font-bold text-emerald-400">{auditResult.scores.seo}/100</p>
                    <Badge variant="emerald" size="sm" className="mt-2">Search Visible</Badge>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Speed & UX</p>
                    <p className="mt-2 text-4xl font-bold text-amber-400">{auditResult.scores.performance}/100</p>
                    <Badge variant="amber" size="sm" className="mt-2">Needs Speed Boost</Badge>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Reputation</p>
                    <p className="mt-2 text-4xl font-bold text-blue-400">{auditResult.scores.reputation}/100</p>
                    <Badge variant="blue" size="sm" className="mt-2">{auditResult.metrics.reviewCount} Reviews</Badge>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Accessibility</p>
                    <p className="mt-2 text-4xl font-bold text-purple-400">{auditResult.scores.accessibility}/100</p>
                    <Badge variant="purple" size="sm" className="mt-2">Compliant</Badge>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <WidgetCard title="AI Strategic Opportunity & ROI Forecast" subtitle="Predictive revenue gains from closing lead capture gaps">
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Revenue Upside</p>
                        <p className="mt-1 text-base font-medium text-white">{auditResult.aiInsights.revenueGrowthPotential}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-200">Competitive Advantages Identified</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
                          {auditResult.aiInsights.strengths.map((str, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-emerald-400">✓</span> {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-200">High-Impact Growth Bottlenecks</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
                          {auditResult.aiInsights.vulnerabilities.map((vul, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-rose-400">⚠</span> {vul}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </WidgetCard>

                  <WidgetCard title="Actionable Action Plan" subtitle="High priority fixes that pitch directly to this business">
                    <div className="space-y-3">
                      {auditResult.recommendations.map((rec) => (
                        <div key={rec.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-white">{rec.title}</span>
                            <Badge variant={rec.priority === 'high' ? 'rose' : 'amber'} size="sm">
                              {rec.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{rec.description}</p>
                          <p className="mt-2 text-xs font-medium text-cyan-400">Expected ROI: {rec.estimatedImpact}</p>
                        </div>
                      ))}
                    </div>
                  </WidgetCard>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <WidgetCard title="Marketing Automation Builder" subtitle="Create automated sequences triggered by incoming leads">
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300">Campaign Name</label>
                  <input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                  >
                    <option value="multichannel">Omnichannel (Email + WhatsApp Follow-up)</option>
                    <option value="email">Email Only</option>
                    <option value="whatsapp">WhatsApp Business API</option>
                    <option value="sms">SMS Text Blast</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300">Target Segment</label>
                  <input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Personalized Template</label>
                  <textarea
                    rows={4}
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                  />
                  <p className="mt-1 text-xs text-slate-400">Available merge tags: {'{{contact_name}}, {{company_name}}, {{city}}, {{industry}}'}</p>
                </div>
                <Button type="submit" isLoading={creatingCampaign}>
                  <Send size={15} /> Launch Automation Sequence
                </Button>
              </form>
            </WidgetCard>

            <WidgetCard title="Live Campaign Performance" subtitle="Active delivery metrics across all connected communication channels">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Local Healthcare Outreach Sequence</h4>
                      <p className="text-xs text-slate-400">Multichannel · Active · 142 Contacts Enrolled</p>
                    </div>
                    <Badge variant="emerald" size="sm">Running</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Sent</p>
                      <p className="text-base font-bold text-white">142</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Open Rate</p>
                      <p className="text-base font-bold text-cyan-400">68%</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Replies</p>
                      <p className="text-base font-bold text-emerald-400">24%</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Deals Won</p>
                      <p className="text-base font-bold text-purple-400">9</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">SEO Audit Report Cold Outreach</h4>
                      <p className="text-xs text-slate-400">Email · Active · 89 Contacts</p>
                    </div>
                    <Badge variant="emerald" size="sm">Running</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Sent</p>
                      <p className="text-base font-bold text-white">89</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Open Rate</p>
                      <p className="text-base font-bold text-cyan-400">54%</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Replies</p>
                      <p className="text-base font-bold text-emerald-400">18%</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2">
                      <p className="text-slate-400">Deals Won</p>
                      <p className="text-base font-bold text-purple-400">4</p>
                    </div>
                  </div>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === 'assistant' && (
          <WidgetCard title="AI Sales & Growth Co-Pilot" subtitle="Interact conversationally to generate campaign ideas, audit companies, or automate follow-ups">
            <div className="flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        msg.sender === 'user' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-300'
                      }`}
                    >
                      {msg.sender === 'user' ? 'You' : <Bot size={16} />}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500/15 border border-cyan-400/30 text-white'
                          : 'bg-slate-950/70 border border-white/10 text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                    <span>LeadPilot AI is thinking…</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask the AI assistant (e.g. 'How do I pitch dentist leads this week?')"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white"
                />
                <Button type="submit">
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </WidgetCard>
        )}
      </div>
    </DashboardShell>
  );
}

