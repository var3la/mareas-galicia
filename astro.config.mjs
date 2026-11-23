import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Sitio estático para GitHub Pages (https://var3la.github.io/mareas-galicia/).
// BASE_PATH se define en el workflow de despliegue; en local queda en "/".
export default defineConfig({
  output: 'static',
  site: 'https://var3la.github.io',
  base: process.env.BASE_PATH || '/',
  vite: { plugins: [tailwindcss()] },
});
