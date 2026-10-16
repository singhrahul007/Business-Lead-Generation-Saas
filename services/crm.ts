// Backward-compatible barrel for the legacy monolithic CRM service API.
// Prefer importing from @/services/crm/<module> or @/services/crm/index for new code.
import { createClient } from '@/lib/supabase/client';
import type { Pipeline, PipelineStage, Tag, TagAssignment } from '@/types/crm';
import { ActivityService } from './crm/activity';
import { CompanyService } from './crm/company';
import { ContactService } from './crm/contact';
import { DealService } from './crm/deal';
import { LeadService } from './crm/lead';
import { NoteService } from './crm/note';
import { TaskService } from './crm/task';

const supabase = createClient();

export {
  ActivityService,
  CompanyService,
  ContactService,
  DealService,
  LeadService,
  NoteService,
  TaskService,
};

// Leads
export const getLeads = LeadService.getAll.bind(LeadService);
export const createLead = LeadService.create.bind(LeadService);
export const createLeadFromForm = LeadService.createFromForm.bind(LeadService);
export const updateLead = LeadService.update.bind(LeadService);

// Companies
export const getCompanies = CompanyService.getAll.bind(CompanyService);
export const createCompany = CompanyService.create.bind(CompanyService);
export const createCompanyFromForm = CompanyService.createFromForm.bind(CompanyService);
export const updateCompany = CompanyService.update.bind(CompanyService);

// Contacts
export const getContacts = ContactService.getAll.bind(ContactService);
export const createContact = ContactService.create.bind(ContactService);
export const createContactFromForm = ContactService.createFromForm.bind(ContactService);
export const updateContact = ContactService.update.bind(ContactService);

// Deals
export const getDeals = DealService.getAll.bind(DealService);
export const createDeal = DealService.create.bind(DealService);
export const createDealFromForm = DealService.createFromForm.bind(DealService);
export const updateDeal = DealService.update.bind(DealService);

// Tasks
export const getTasks = TaskService.getAll.bind(TaskService);
export const createTask = TaskService.create.bind(TaskService);
export const createTaskFromForm = TaskService.createFromForm.bind(TaskService);
export const updateTask = TaskService.update.bind(TaskService);

// Notes
export const createNote = NoteService.create.bind(NoteService);
export const createNoteFromForm = NoteService.createFromForm.bind(NoteService);
export const updateNote = NoteService.update.bind(NoteService);

// Activity timeline
export const getActivityTimeline = ActivityService.getAll.bind(ActivityService);

// Tags and tag assignments (legacy helpers; consider extracting a TagService later).
export async function getPipelines() {
  const { data, error } = await supabase
    .from('crm_pipelines')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as Pipeline[] | null, error: error?.message ?? null };
}

export async function getPipelineStages() {
  const { data, error } = await supabase
    .from('crm_pipeline_stages')
    .select('*')
    .order('position', { ascending: true });
  return { data: data as PipelineStage[] | null, error: error?.message ?? null };
}

export async function getTags() {
  const { data, error } = await supabase.from('crm_tags').select('*').order('name', { ascending: true });
  return { data: data as Tag[] | null, error: error?.message ?? null };
}

export async function getTagAssignments() {
  const { data, error } = await supabase
    .from('crm_tag_assignments')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as TagAssignment[] | null, error: error?.message ?? null };
}
