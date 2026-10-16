import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadPilot AI',
  description: 'AI-powered Lead Generation, CRM, Marketing Automation and Customer Acquisition Platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50" suppressHydrationWarning>
        <Toaster />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}