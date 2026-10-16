'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  Building2,
  UserCheck,
  Briefcase,
  CheckSquare,
  FileText,
  Plus,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { Button, Badge, Modal, Table } from '@/components/ui';
import {
  CompanyForm,
  ContactForm,
  DealForm,
  LeadForm,
  NoteForm,
  TaskForm,
} from '@/components/crm/crm-forms';
import {
  getCompanies,
  getContacts,
  getDeals,
  getLeads,
  getTasks,
  getActivityTimeline,
} from '@/services/crm';
import type { ActivityItem, Company, Contact, Deal, Lead, TaskItem } from '@/types/crm';

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'leads' | 'companies' | 'contacts' | 'deals' | 'tasks'>('leads');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal open states
  const [openModal, setOpenModal] = useState<null | 'lead' | 'company' | 'contact' | 'deal' | 'task' | 'note'>(null);

  async function load() {
    setLoading(true);
    const [leadResult, companyResult, contactResult, dealResult, taskResult, activityResult] = await Promise.all([
      getLeads(),
      getCompanies(),
      getContacts(),
      getDeals(),
      getTasks(),
      getActivityTimeline(),
    ]);

    setLeads(leadResult.data ?? []);
    setCompanies(companyResult.data ?? []);
    setContacts(contactResult.data ?? []);
    setDeals(dealResult.data ?? []);
    setTasks(taskResult.data ?? []);
    setActivity(activityResult.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  const handleCreated = (entityName: string) => {
    setOpenModal(null);
    setRefreshKey((k) => k + 1);
    toast.success(`${entityName} created successfully!`);
  };

  // Filtered views
  const filteredLeads = useMemo(() => {
    return leads.filter((item) =>
      !searchQuery ||
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company_name && item.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [leads, searchQuery]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((item) =>
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.industry && item.industry.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [companies, searchQuery]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) =>
      !searchQuery ||
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [contacts, searchQuery]);

  const filteredDeals = useMemo(() => {
    return deals.filter((item) =>
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deals, searchQuery]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((item) =>
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="CRM Workspace"
          description="Manage all your prospects, accounts, deals, pipeline stages, and communication tasks in one integrated view."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={() => setOpenModal('lead')}>
                <Plus size={15} /> Add Lead
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setOpenModal('company')}>
                <Plus size={15} /> Company
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setOpenModal('contact')}>
                <Plus size={15} /> Contact
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setOpenModal('deal')}>
                <Plus size={15} /> Deal
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setOpenModal('task')}>
                <Plus size={15} /> Task
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOpenModal('note')}>
                <FileText size={15} /> Note
              </Button>
            </div>
          }
        />

        {/* Top KPI Metrics Bar */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div
            onClick={() => setActiveTab('leads')}
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              activeTab === 'leads' ? 'border-cyan-400/40 bg-slate-900/90 shadow-xl' : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Leads</span>
              <Users size={16} className="text-cyan-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{leads.length}</p>
            <span className="text-xs text-slate-400">Active prospects</span>
          </div>

          <div
            onClick={() => setActiveTab('companies')}
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              activeTab === 'companies' ? 'border-emerald-400/40 bg-slate-900/90 shadow-xl' : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Companies</span>
              <Building2 size={16} className="text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{companies.length}</p>
            <span className="text-xs text-slate-400">Target accounts</span>
          </div>

          <div
            onClick={() => setActiveTab('contacts')}
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              activeTab === 'contacts' ? 'border-blue-400/40 bg-slate-900/90 shadow-xl' : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Contacts</span>
              <UserCheck size={16} className="text-blue-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{contacts.length}</p>
            <span className="text-xs text-slate-400">Decision makers</span>
          </div>

          <div
            onClick={() => setActiveTab('deals')}
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              activeTab === 'deals' ? 'border-amber-400/40 bg-slate-900/90 shadow-xl' : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Deals</span>
              <Briefcase size={16} className="text-amber-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{deals.length}</p>
            <span className="text-xs text-slate-400">Open pipeline</span>
          </div>

          <div
            onClick={() => setActiveTab('tasks')}
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              activeTab === 'tasks' ? 'border-purple-400/40 bg-slate-900/90 shadow-xl' : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Tasks</span>
              <CheckSquare size={16} className="text-purple-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{tasks.length}</p>
            <span className="text-xs text-slate-400">Pending actions</span>
          </div>
        </div>

        {/* Main Entity Data Table View */}
        <WidgetCard
          title={`${activeTab.toUpperCase()} Table`}
          subtitle={`Browse and filter records in your active ${activeTab} directory`}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/70 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          }
        >
          {activeTab === 'leads' && (
            <Table
              isLoading={loading}
              columns={[
                {
                  header: 'Name',
                  cell: (item: Lead) => (
                    <div>
                      <p className="font-medium text-white">{item.full_name}</p>
                      <p className="text-xs text-slate-400">{item.company_name || 'No company'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Contact Info',
                  cell: (item: Lead) => (
                    <div className="text-xs text-slate-300">
                      <p>{item.email || 'No email'}</p>
                      <p className="text-slate-400">{item.phone || 'No phone'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Status',
                  cell: (item: Lead) => (
                    <Badge variant={item.status === 'won' ? 'emerald' : item.status === 'qualified' ? 'cyan' : 'blue'} size="sm">
                      {item.status.toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  header: 'Source',
                  cell: (item: Lead) => (
                    <span className="text-xs text-slate-400">{item.source || 'Direct import'}</span>
                  ),
                },
                {
                  header: 'Created',
                  cell: (item: Lead) => (
                    <span className="text-xs text-slate-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  ),
                },
              ]}
              data={filteredLeads}
              keyExtractor={(item) => item.id}
              emptyMessage="No leads recorded yet. Add your first lead or import from lead discovery."
            />
          )}

          {activeTab === 'companies' && (
            <Table
              isLoading={loading}
              columns={[
                {
                  header: 'Company Name',
                  cell: (item: Company) => (
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      {item.website ? (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                        >
                          {item.website} <ExternalLink size={11} />
                        </a>
                      ) : null}
                    </div>
                  ),
                },
                {
                  header: 'Industry',
                  cell: (item: Company) => (
                    <Badge variant="slate" size="sm">{item.industry || 'General'}</Badge>
                  ),
                },
                {
                  header: 'Phone / Location',
                  cell: (item: Company) => (
                    <div className="text-xs text-slate-300">
                      <p>{item.phone || 'N/A'}</p>
                      <p className="text-slate-400">{item.address || 'Address pending'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Status',
                  cell: (item: Company) => (
                    <Badge variant={item.status === 'active' ? 'emerald' : 'slate'} size="sm">
                      {item.status.toUpperCase()}
                    </Badge>
                  ),
                },
              ]}
              data={filteredCompanies}
              keyExtractor={(item) => item.id}
              emptyMessage="No companies tracked yet. Click '+ Company' above to register your first account."
            />
          )}

          {activeTab === 'contacts' && (
            <Table
              isLoading={loading}
              columns={[
                {
                  header: 'Full Name',
                  cell: (item: Contact) => (
                    <div>
                      <p className="font-medium text-white">{item.full_name}</p>
                      <p className="text-xs text-slate-400">{item.title || 'Stakeholder'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Email & Phone',
                  cell: (item: Contact) => (
                    <div className="text-xs text-slate-300">
                      <p>{item.email || 'No email'}</p>
                      <p className="text-slate-400">{item.phone || 'No phone'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Status',
                  cell: (item: Contact) => (
                    <Badge variant={item.status === 'active' ? 'blue' : 'slate'} size="sm">
                      {item.status.toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  header: 'LinkedIn',
                  cell: (item: Contact) =>
                    item.linkedin_url ? (
                      <a href={item.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">
                        Profile
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    ),
                },
              ]}
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              emptyMessage="No contacts created yet. Click '+ Contact' above to log key decision makers."
            />
          )}

          {activeTab === 'deals' && (
            <Table
              isLoading={loading}
              columns={[
                {
                  header: 'Deal Title',
                  cell: (item: Deal) => (
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.notes || 'No description'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Amount',
                  cell: (item: Deal) => (
                    <p className="font-semibold text-emerald-400">
                      {item.amount != null ? `$${item.amount.toLocaleString()}` : '$0.00'}
                    </p>
                  ),
                },
                {
                  header: 'Stage',
                  cell: (item: Deal) => (
                    <Badge variant={item.stage === 'won' ? 'emerald' : item.stage === 'lost' ? 'rose' : 'amber'} size="sm">
                      {item.stage.toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  header: 'Expected Close',
                  cell: (item: Deal) => (
                    <span className="text-xs text-slate-300">{item.expected_close_date || 'TBD'}</span>
                  ),
                },
              ]}
              data={filteredDeals}
              keyExtractor={(item) => item.id}
              emptyMessage="No open deals yet. Click '+ Deal' to move an opportunity into your sales funnel."
            />
          )}

          {activeTab === 'tasks' && (
            <Table
              isLoading={loading}
              columns={[
                {
                  header: 'Task Title',
                  cell: (item: TaskItem) => (
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.description || 'No notes'}</p>
                    </div>
                  ),
                },
                {
                  header: 'Priority',
                  cell: (item: TaskItem) => (
                    <Badge variant={item.priority === 'high' ? 'rose' : item.priority === 'medium' ? 'amber' : 'slate'} size="sm">
                      {item.priority.toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  header: 'Status',
                  cell: (item: TaskItem) => (
                    <Badge variant={item.status === 'done' ? 'emerald' : item.status === 'in_progress' ? 'cyan' : 'slate'} size="sm">
                      {item.status.toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  header: 'Due Date',
                  cell: (item: TaskItem) => (
                    <span className="flex items-center gap-1 text-xs text-slate-300">
                      <Clock size={12} /> {item.due_date || 'No due date'}
                    </span>
                  ),
                },
              ]}
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              emptyMessage="All caught up! Click '+ Task' to schedule follow-ups or team assignments."
            />
          )}
        </WidgetCard>

        {/* Timeline & Follow-up Row */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <WidgetCard title="Activity Timeline" subtitle="Live stream of modifications and customer interactions">
            <div className="space-y-3">
              {activity.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No activity logged yet.</p>
              ) : (
                activity.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                    <p className="text-sm font-medium text-white">{item.action}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.details || 'No additional details'}</p>
                  </div>
                ))
              )}
            </div>
          </WidgetCard>

          <WidgetCard title="Quick Note & Context" subtitle="Add notes against any prospect or company">
            <NoteForm onCreated={() => handleCreated('Note')} />
          </WidgetCard>
        </div>

        {/* Modal Dialogs for Quick Creation */}
        <Modal
          isOpen={openModal === 'lead'}
          onClose={() => setOpenModal(null)}
          title="Create New Lead"
          description="Capture prospect details and initiate growth tracking."
        >
          <LeadForm onCreated={() => handleCreated('Lead')} />
        </Modal>

        <Modal
          isOpen={openModal === 'company'}
          onClose={() => setOpenModal(null)}
          title="Create Company Account"
          description="Register business details, domain, and industry context."
        >
          <CompanyForm onCreated={() => handleCreated('Company')} />
        </Modal>

        <Modal
          isOpen={openModal === 'contact'}
          onClose={() => setOpenModal(null)}
          title="Create Contact"
          description="Store key decision makers and contact information."
        >
          <ContactForm onCreated={() => handleCreated('Contact')} />
        </Modal>

        <Modal
          isOpen={openModal === 'deal'}
          onClose={() => setOpenModal(null)}
          title="Create Deal Opportunity"
          description="Forecast revenue and track deal stage progress."
        >
          <DealForm onCreated={() => handleCreated('Deal')} />
        </Modal>

        <Modal
          isOpen={openModal === 'task'}
          onClose={() => setOpenModal(null)}
          title="Schedule Task"
          description="Queue priority follow-up actions and reminders."
        >
          <TaskForm onCreated={() => handleCreated('Task')} />
        </Modal>

        <Modal
          isOpen={openModal === 'note'}
          onClose={() => setOpenModal(null)}
          title="Log Context Note"
          description="Save persistent notes for any customer or team record."
        >
          <NoteForm onCreated={() => handleCreated('Note')} />
        </Modal>
      </div>
    </DashboardShell>
  );
}
