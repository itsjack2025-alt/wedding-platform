import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-body tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-wedding-primary/20 text-wedding-primary border border-wedding-primary/30',
        gold:
          'bg-gold-400/15 text-gold-400 border border-gold-400/25',
        muted:
          'bg-wedding-surface text-wedding-muted border border-wedding-border',
        success:
          'bg-green-500/15 text-green-400 border border-green-500/25',
        warning:
          'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
        error:
          'bg-red-500/15 text-red-400 border border-red-500/25',
        outline:
          'border border-wedding-border text-wedding-muted bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
