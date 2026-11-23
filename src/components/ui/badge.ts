// Adaptado de ekmas/neobrutalism-components (MIT, © 2023 Samuel Breznjak).
import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        neutral: 'bg-secondary-background text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
