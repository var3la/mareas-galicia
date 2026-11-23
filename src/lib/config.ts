// Configuración del servidor. Leer solo en código que se ejecuta en el servidor (.astro frontmatter, *.ts de lib).
// La clave se define en `.env` (ver `.env.example`) y nunca se envía al navegador.

/** Clave de la API MeteoSIX (API_KEY). Vacía si no está configurada. */
export function meteosixApiKey(): string {
  return process.env.METEOSIX_API_KEY?.trim() ?? '';
}
