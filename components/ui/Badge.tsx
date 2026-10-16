import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/20',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-400/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-400/20',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-400/20',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-400/20',
    slate: 'bg-slate-800 text-slate-300 border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

