import React from 'react';
import { cn } from '../lib/utils';

export const Button = ({
  children,
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600',
    secondary: 'bg-sky-400 text-white hover:bg-sky-500',
    outline: 'border border-sky-500 text-sky-500 hover:bg-sky-50',
    ghost: 'hover:bg-sky-50 text-gray-600',
  };
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div
    className={cn('bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow', className)}
    onClick={onClick}
  >
    {children}
  </div>
);
