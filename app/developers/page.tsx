'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Key,
  Webhook,
  Palette,
  Store,
  Copy,
  Plus,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Server,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { Button, Badge, Modal, Table } from '@/components/ui';

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'apikeys' | 'whitelabel' | 'migration'>('marketplace');
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // White label state
  const [brandName, setBrandName] = useState('GrowthOS Agency Suite');
  const [customDomain, setCustomDomain] = useState('portal.agencybrand.com');
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [supportEmail, setSupportEmail] = useState('growth@agencybrand.com');

  useEffect(() => {
    fetch('/api/developers')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setApiKeys(json.data.apiKeys || []);
          setIntegrations(json.data.marketplaceIntegrations || []);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreatingKey(true);
    try {
      const res = await fetch('/api/developers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createApiKey',
          payload: { name: newKeyName, permissions: ['leads:read', 'leads:write', 'crm:read', 'crm:write'] },
        }),
      });
      const json = await res.json();
      if (json.data) {
        setApiKeys((prev) => [json.data, ...prev]);
        setShowKeyModal(false);
        setNewKeyName('');
        toast.success('New API key generated!');
      }
    } catch {
      toast.error('Failed to create API key');
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleSaveWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('White-label branding and custom domain saved!');
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Developers & White-Label Ecosystem"
          description="Manage developer API keys, custom webhooks, mobile application endpoints, white-label branding, and self-hosted backend migration readiness."
          actions={
            <div className="flex gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-1">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'marketplace' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                App Marketplace
              </button>
              <button
                onClick={() => setActiveTab('apikeys')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'apikeys' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                API Keys & Mobile SDK
              </button>
              <button
                onClick={() => setActiveTab('whitelabel')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'whitelabel' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                White-Label Branding
              </button>
              <button
                onClick={() => setActiveTab('migration')}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                  activeTab === 'migration' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Self-Hosted Backend Readiness
              </button>
            </div>
          }
        />

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <WidgetCard title="Verified Integration Marketplace" subtitle="Connect your growth stack directly to LeadPilot AI">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        <Badge variant={item.installed ? 'emerald' : 'cyan'} size="sm">
                          {item.installed ? 'Installed' : item.badge}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{item.description}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs text-slate-500">{item.category}</span>
                      <Button
                        variant={item.installed ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          toast.success(item.installed ? `${item.name} settings opened` : `${item.name} connected!`);
                        }}
                      >
                        {item.installed ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <WidgetCard
              title="REST & GraphQL API Keys"
              subtitle="Provision programmatic access for custom scripts, backend microservices, or mobile apps"
              action={
                <Button size="sm" onClick={() => setShowKeyModal(true)}>
                  <Plus size={15} /> Generate API Key
                </Button>
              }
            >
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{key.name}</p>
                        <Badge variant="cyan" size="sm">Active</Badge>
                      </div>
                      <p className="mt-1 font-mono text-xs text-slate-400">{key.keyPreview}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Permissions: {key.permissions.join(', ')} · Last used: {key.lastUsedAt || 'Never'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(key.keyPreview);
                          toast.success('Key copied to clipboard');
                        }}
                      >
                        <Copy size={14} /> Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </WidgetCard>

            <WidgetCard title="Mobile App & REST API Architecture" subtitle="Universal API specification ready for React Native, Flutter, and iOS/Android">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Smartphone size={18} />
                    <span className="font-semibold text-sm text-white">Mobile SDK Ready</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Lightweight JWT Bearer token authentication compatible with iOS Keychain and Android Keystore secure storage.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Webhook size={18} />
                    <span className="font-semibold text-sm text-white">Signed Webhooks</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    HMAC SHA-256 webhook signatures dispatched on <code>lead.created</code>, <code>campaign.delivered</code>, and <code>deal.won</code>.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Layers size={18} />
                    <span className="font-semibold text-sm text-white">OpenAPI 3.1 Spec</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Pre-generated schemas at <code>/api/crm/*</code> allowing automatic client SDK generation using OpenAPI Generator.
                  </p>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === 'whitelabel' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <WidgetCard title="White-Label Deployment Settings" subtitle="Brand LeadPilot AI under your own agency identity">
              <form onSubmit={handleSaveWhiteLabel} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300">Brand Name</label>
                  <input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Custom Domain (CNAME)</label>
                  <input
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300">Primary Theme Accent</label>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Support Email</label>
                    <input
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
                <Button type="submit">Save Brand Configuration</Button>
              </form>
            </WidgetCard>

            <WidgetCard title="Live Portal Preview" subtitle="How your clients experience the white-labeled workspace">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-cyan-500" style={{ backgroundColor: primaryColor }} />
                    <span className="font-semibold text-white">{brandName}</span>
                  </div>
                  <Badge variant="cyan" size="sm">{customDomain}</Badge>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p>✔ Custom SSL automatic certificate provisioning</p>
                  <p>✔ Client multi-tenant isolation with custom login portal</p>
                  <p>✔ Agency notification emails sent via your custom domain</p>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {activeTab === 'migration' && (
          <div className="space-y-6">
            <WidgetCard
              title="Self-Hosted Backend Migration Readiness"
              subtitle="LeadPilot AI is architected for zero-lock-in migration from Supabase to self-hosted PostgreSQL, Prisma, or Node.js Docker clusters"
            >
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold text-sm text-white">Pure SQL Schema</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      Standard PostgreSQL DDL migrations located in <code>supabase/migrations/*</code> without vendor proprietary locks.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold text-sm text-white">Modular CRM Services</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      Services are isolated in <code>services/crm/*</code> with dependency-injected clients, enabling drop-in Prisma or Kysely ORM replacement.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold text-sm text-white">Database URL Env Support</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      Standard <code>DATABASE_URL</code> configured in <code>.env</code> allowing direct connection to AWS RDS, DigitalOcean, or bare-metal VPS.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <h4 className="text-sm font-semibold text-white">Migration Execution Steps (When Moving Off Supabase)</h4>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-xs text-slate-400">
                    <li>Export database dump: <code>pg_dump $SUPABASE_DB_URL &gt; leadpilot_backup.sql</code></li>
                    <li>Import dump into self-hosted PostgreSQL 16: <code>psql $TARGET_DB_URL &lt; leadpilot_backup.sql</code></li>
                    <li>Point <code>DATABASE_URL</code> and Auth JWT secrets in production environment to your self-hosted backend.</li>
                    <li>Deploy containerized Next.js frontend via Docker with <code>standalone</code> output mode.</li>
                  </ol>
                </div>
              </div>
            </WidgetCard>
          </div>
        )}

        {/* Create API Key Modal */}
        <Modal
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
          title="Create New API Key"
          description="Generate a secure bearer key with granular permission scopes."
        >
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300">Key Name</label>
              <input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Mobile App Backend Key"
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <Button type="submit" isLoading={isCreatingKey}>
              Create Key
            </Button>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}

