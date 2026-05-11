import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-wedding-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl bg-black/30 border px-4 py-2 text-sm font-body text-wedding-text transition-all duration-300',
            'placeholder:text-wedding-muted/50',
            'focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-red-500/50 focus:ring-red-500/30',
            className
          )}
          style={{ borderColor: error ? undefined : 'rgba(212,160,23,0.2)' }}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-xl bg-black/30 border px-4 py-3 text-sm font-body text-wedding-text transition-all duration-300 resize-none',
            'placeholder:text-wedding-muted/50',
            'focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50',
            className
          )}
          style={{ borderColor: error ? undefined : 'rgba(212,160,23,0.2)' }}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
