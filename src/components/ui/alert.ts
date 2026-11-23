// Adaptado de ekmas/neobrutalism-components (MIT, © 2023 Samuel Breznjak).
import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  'relative w-full rounded-base border-2 border-border px-4 py-3 text-sm grid grid-cols-[0_1fr] gap-y-0.5 items-start shadow-shadow',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'bg-black text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
