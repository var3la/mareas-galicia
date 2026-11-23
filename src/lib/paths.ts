// Prefijo de despliegue (p. ej. "/mareas-galicia/" en GitHub Pages). Viene de `base` en astro.config.mjs.
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
