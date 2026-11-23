// Adaptado de ekmas/neobrutalism-components (MIT, © 2023 Samuel Breznjak).
import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'rounded-base flex flex-col shadow-shadow border-2 gap-6 py-6 border-border bg-background text-foreground font-base',
  {
    variants: {
      size: {
        default: '',
        sm: 'gap-4 py-4',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export type CardVariants = VariantProps<typeof cardVariants>;
