'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companyFormSchema,
  contactFormSchema,
  dealFormSchema,
  leadFormSchema,
  noteFormSchema,
  taskFormSchema,
} from '@/lib/validators/crm';
import {
  createCompanyFromForm,
  createContactFromForm,
  createDealFromForm,
  createLeadFromForm,
  createNoteFromForm,
  createTaskFromForm,
} from '@/services/crm';
import type {
  CompanyFormValues,
  ContactFormValues,
  DealFormValues,
  LeadFormValues,
  NoteFormValues,
  TaskFormValues,
} from '@/types/crm';

interface FormProps {
  onCreated?: () => void;
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400">{message}</p>;
}

export function LeadForm({ onCreated }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { status: 'new' },
  });

  async function onSubmit(values: LeadFormValues) {
    const result = await createLeadFromForm(values);
    if (!result.error) {
      reset();
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input {...register('full_name')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Full name" />
      <FormError message={errors.full_name?.message} />
      <input {...register('email')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Email" />
      <FormError message={errors.email?.message} />
      <input {...register('phone')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Phone" />
      <input {...register('company_name')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Company" />
      <textarea {...register('notes')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Notes" />
      <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add lead'}</button>
    </form>
  );
}

export function CompanyForm({ onCreated }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: { status: 'active' },
  });

  async function onSubmit(values: CompanyFormValues) {
    const result = await createCompanyFromForm(values);
    if (!result.error) {
      reset();
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input {...register('name')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Company name" />
      <FormError message={errors.name?.message} />
      <input {...register('website')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Website" />
      <input {...register('industry')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Industry" />
      <input {...register('phone')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Phone" />
      <input {...register('address')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Address" />
      <textarea {...register('description')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Description" />
      <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add company'}</button>
    </form>
  );
}

export function ContactForm({ onCreated }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { status: 'active' },
  });

  async function onSubmit(values: ContactFormValues) {
    const result = await createContactFromForm(values);
    if (!result.error) {
      reset();
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input {...register('full_name')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Contact full name" />
      <FormError message={errors.full_name?.message} />
      <input {...register('email')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Email" />
      <FormError message={errors.email?.message} />
      <input {...register('phone')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Phone" />
      <input {...register('title')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Job title / role" />
      <input {...register('linkedin_url')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="LinkedIn URL" />
      <textarea {...register('notes')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Notes" />
      <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add contact'}</button>
    </form>
  );
}

export function DealForm({ onCreated }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: { stage: 'lead', status: 'open' },
  });

  async function onSubmit(values: DealFormValues) {
    const result = await createDealFromForm(values);
    if (!result.error) {
      reset();
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input {...register('title')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Deal title" />
      <FormError message={errors.title?.message} />
      <input {...register('amount', { valueAsNumber: true })} type="number" className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Amount" />
      <FormError message={errors.amount?.message} />
      <select {...register('stage')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
        <option value="lead">Lead</option>
        <option value="qualified">Qualified</option>
        <option value="proposal">Proposal</option>
        <option value="negotiation">Negotiation</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <select {...register('status')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
        <option value="open">Open</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <textarea {...register('notes')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Notes" />
      <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add deal'}</button>
    </form>
  );
}

export function TaskForm({ onCreated }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { priority: 'medium', status: 'todo' },
  });

  async function onSubmit(values: TaskFormValues) {
    const result = await createTaskFromForm(values);
    if (!result.error) {
      reset();
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input {...register('title')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Task title" />
      <FormError message={errors.title?.message} />
      <input {...register('due_date')} type="date" className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" />
      <FormError message={errors.due_date?.message} />
      <select {...register('priority')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select {...register('status')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
        <option value="todo">To do</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <textarea {...register('description')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Description" />
      <button type="submit" className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add task'}</button>
    </form>
  );
}

export function NoteForm({ onCreated }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { entity_type: 'lead' },
  });

  async function onSubmit(values: NoteFormValues) {
    const result = await createNoteFromForm(values);
    if (!result.error) {
      reset();
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <textarea {...register('content')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Write a note" />
      <FormError message={errors.content?.message} />
      <select {...register('entity_type')} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white">
        <option value="lead">Lead</option>
        <option value="company">Company</option>
        <option value="deal">Deal</option>
        <option value="contact">Contact</option>
        <option value="pipeline">Pipeline</option>
        <option value="task">Task</option>
      </select>
      <FormError message={errors.entity_type?.message} />
      <button type="submit" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add note'}</button>
    </form>
  );
}
