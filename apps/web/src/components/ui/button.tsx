import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-heading tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:pointer-events-none disabled:opacity-50 uppercase',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-wedding-primary to-wedding-primary/80 text-white shadow-lg shadow-wedding-primary/25 hover:shadow-wedding-primary/40 hover:scale-[1.02] active:scale-[0.98]',
        gold:
          'bg-gold-gradient text-wedding-background shadow-lg shadow-gold-400/20 hover:shadow-gold-400/40 hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-wedding-border bg-transparent text-wedding-text hover:bg-wedding-border/20 hover:border-gold-400/50',
        ghost:
          'text-wedding-muted hover:text-wedding-text hover:bg-white/5',
        subtle:
          'bg-wedding-surface text-wedding-text border border-wedding-border hover:border-gold-400/30 hover:bg-wedding-surface/80',
        destructive:
          'bg-red-600 text-white hover:bg-red-700',
        link:
          'text-wedding-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-14 rounded-full px-10 text-base',
        xl: 'h-16 rounded-full px-12 text-lg',
        icon: 'h-10 w-10 rounded-full',
        'icon-sm': 'h-8 w-8 rounded-full',
        'icon-lg': 'h-12 w-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-4 h-4 border-2 border-current border-opacity-30 border-t-current rounded-full"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Need motion import for the loading spinner
import { motion } from 'framer-motion';

export { Button, buttonVariants };
