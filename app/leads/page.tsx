'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Building2, Search, CheckCircle2 } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { Button, Badge, EmptyState } from '@/components/ui';
import { getSearchHistory, saveBusiness, searchBusinesses } from '@/services/lead-discovery/google-places';
import { createLeadFromForm, createCompanyFromForm } from '@/services/crm';
import type { BusinessRecord, SearchHistoryItem } from '@/types/lead-discovery';

export default function LeadsPage() {
  const [keyword, setKeyword] = useState('dentist');
  const [industry, setIndustry] = useState('Healthcare');
  const [city, setCity] = useState('Chicago');
  const [state, setState] = useState('IL');
  const [country, setCountry] = useState('US');
  const [radius, setRadius] = useState(10);
  const [results, setResults] = useState<BusinessRecord[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [importedIds, setImportedIds] = useState<Record<string, boolean>>({});

  const search = async () => {
    setLoading(true);

    const { data, error } = await searchBusinesses({ keyword, industry, radius, city, state, country, page: 1, pageSize: 10 });

    if (!error) {
      if (data[0]) {
        await saveBusiness(data[0]);
      }
      setResults(data);
    } else {
      toast.error(error);
    }

    const { data: historyData } = await getSearchHistory();
    setHistory(historyData ?? []);
    setLoading(false);
  };

  const handleImportToCRM = async (business: BusinessRecord, index: number) => {
    const key = business.id || `lead-${index}`;
    try {
      const companyResult = await createCompanyFromForm({
        name: business.business_name,
        website: business.website,
        industry: business.category || industry,
        phone: business.phone,
        address: business.address,
        description: `Discovered lead in ${business.city || city}, rating: ${business.rating ?? 'N/A'}`,
      });

      const leadResult = await createLeadFromForm({
        full_name: `${business.business_name} Contact`,
        company_name: business.business_name,
        phone: business.phone,
        source: 'Google Places Discovery',
        notes: `Imported from lead discovery search (${keyword} in ${city}, ${state}). Website: ${business.website}`,
      });

      if (!leadResult.error || !companyResult.error) {
        setImportedIds((prev) => ({ ...prev, [key]: true }));
        toast.success(`"${business.business_name}" added to CRM!`);
      } else {
        toast.error(leadResult.error || companyResult.error || 'Failed to import to CRM');
      }
    } catch {
      toast.error('Could not import to CRM');
    }
  };

  const historySummary = useMemo(() => history.slice(0, 5), [history]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <PageHeader title="Lead discovery" description="Search local businesses by keyword, industry, and geography." />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <WidgetCard title="Business search" subtitle="Find businesses that match your target audience">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-300">
                Keyword
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-300">
                Industry
                <input value={industry} onChange={(event) => setIndustry(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-300">
                City
                <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-300">
                State
                <input value={state} onChange={(event) => setState(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-300">
                Country
                <input value={country} onChange={(event) => setCountry(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-300">
                Radius (mi)
                <input type="number" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
              </label>
            </div>
            <div className="mt-5">
              <Button onClick={search} isLoading={loading}>
                {loading ? 'Searching…' : 'Search businesses'}
              </Button>
            </div>
          </WidgetCard>

          <WidgetCard title="Search history" subtitle="Recent queries and filters">
            {historySummary.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No recent searches"
                description="Run your first query to track target locations and industries."
              />
            ) : (
              <div className="space-y-2">
                {historySummary.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-slate-300">
                    <p className="font-medium text-white">{entry.keyword || 'Untitled search'}</p>
                    <p className="mt-1 text-xs text-slate-400">{entry.city || 'Unknown city'} · {entry.state || 'Unknown state'} · {entry.country || 'Unknown country'}</p>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        </div>

        <div className="mt-6">
          <WidgetCard title="Discovered businesses" subtitle="Results stored in Supabase with deduplication and 1-click CRM import">
            {results.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No businesses found yet"
                description="Adjust your search criteria and click Search businesses above to generate leads."
              />
            ) : (
              <div className="space-y-3">
                {results.map((business, index) => {
                  const key = business.id || `lead-${index}`;
                  const isImported = importedIds[key];

                  return (
                    <div key={`${business.business_name}-${index}`} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{business.business_name}</p>
                          <Badge variant="blue" size="sm">
                            {business.category || 'Local business'}
                          </Badge>
                          {business.rating ? (
                            <Badge variant="amber" size="sm">
                              {business.rating} ★
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {business.address || 'Address pending'} {business.phone ? `· ${business.phone}` : ''}
                        </p>
                        {business.website ? (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs text-cyan-400 hover:underline"
                          >
                            {business.website}
                          </a>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        {isImported ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                            <CheckCircle2 size={16} /> Added to CRM
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleImportToCRM(business, index)}
                          >
                            <UserPlus size={14} /> Add to CRM
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </WidgetCard>
        </div>
      </div>
    </DashboardShell>
  );
}
