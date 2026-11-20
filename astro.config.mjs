import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// SSR: los datos de MeteoGalicia se piden en el servidor (evita CORS y
// permite cachear la respuesta entre visitantes).
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: true, port: 4321 },
});
