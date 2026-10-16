'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { Button, Badge } from '@/components/ui';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const exportCSV = () => {
    const headers = ['Month', 'Leads Generated', 'Converted Deals', 'Revenue ($)', 'Conversion Rate'];
    const rows = [
      ['January', '340', '28', '$42,000', '8.2%'],
      ['February', '420', '39', '$58,500', '9.2%'],
      ['March', '510', '52', '$78,000', '10.1%'],
      ['April', '630', '68', '$102,000', '10.7%'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeadPilot_Revenue_Report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Report exported successfully!');
  };

  const exportPDF = () => {
    toast.success('Generating PDF Executive Summary report…');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Revenue & Performance Analytics"
          description="Track conversion funnels, pipeline attribution, ROI performance, and export audit-ready reports."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-200"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last Quarter</option>
                <option value="1y">Past Year</option>
              </select>
              <Button variant="secondary" size="sm" onClick={exportCSV}>
                <FileSpreadsheet size={15} /> Export CSV
              </Button>
              <Button size="sm" onClick={exportPDF}>
                <FileText size={15} /> Export PDF
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Total Pipeline Value</span>
              <DollarSign size={18} className="text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">$280,500</p>
            <p className="mt-1 flex items-center text-xs text-emerald-400">
              <ArrowUpRight size={14} /> +24.8% vs last period
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Lead-to-Deal Rate</span>
              <Target size={18} className="text-cyan-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">10.4%</p>
            <p className="mt-1 flex items-center text-xs text-emerald-400">
              <ArrowUpRight size={14} /> +2.1% efficiency
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Discovered Leads</span>
              <Users size={18} className="text-blue-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">1,892</p>
            <p className="mt-1 flex items-center text-xs text-emerald-400">
              <ArrowUpRight size={14} /> +180 this week
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Campaign ROI</span>
              <TrendingUp size={18} className="text-purple-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">4.8x</p>
            <p className="mt-1 flex items-center text-xs text-emerald-400">
              <ArrowUpRight size={14} /> High conversion return
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <WidgetCard title="Lead Conversion Funnel" subtitle="Prospect progression from discovery to closed-won revenue">
            <div className="space-y-4 py-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>1. Discovered Prospects</span>
                  <span>1,892 (100%)</span>
                </div>
                <div className="mt-1.5 h-3 w-full rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-cyan-500" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>2. Contacted via AI Sequences</span>
                  <span>1,240 (65.5%)</span>
                </div>
                <div className="mt-1.5 h-3 w-full rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-blue-500" style={{ width: '65.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>3. Qualified Opportunities</span>
                  <span>482 (25.4%)</span>
                </div>
                <div className="mt-1.5 h-3 w-full rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-indigo-500" style={{ width: '25.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>4. Active Proposals & In-Negotiation</span>
                  <span>198 (10.4%)</span>
                </div>
                <div className="mt-1.5 h-3 w-full rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-amber-500" style={{ width: '10.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>5. Closed-Won Deals</span>
                  <span>92 (4.8%)</span>
                </div>
                <div className="mt-1.5 h-3 w-full rounded-full bg-slate-800">
                  <div className="h-3 rounded-full bg-emerald-500" style={{ width: '4.8%' }} />
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Top Performing Channels" subtitle="Attribution of revenue won by discovery medium">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Google Places Local Discovery</p>
                  <p className="text-xs text-slate-400">46 Deals · $138,000</p>
                </div>
                <Badge variant="cyan" size="sm">49% Revenue</Badge>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Automated WhatsApp Outreach</p>
                  <p className="text-xs text-slate-400">28 Deals · $84,000</p>
                </div>
                <Badge variant="emerald" size="sm">30% Revenue</Badge>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Cold SEO Audit Pitch Emails</p>
                  <p className="text-xs text-slate-400">18 Deals · $58,500</p>
                </div>
                <Badge variant="purple" size="sm">21% Revenue</Badge>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </DashboardShell>
  );
}

