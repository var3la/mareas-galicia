// Adaptado de ekmas/neobrutalism-components (MIT, © 2023 Samuel Breznjak).
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
