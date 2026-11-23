// Cámaras web de MeteoGalicia, desde el servicio JSON oficial (sin clave de API).
// Descripción del formato: https://www.meteogalicia.gal/datosred/infoweb/meteo/docs/rss/JSON_camaras_gl.pdf
// Página pública: https://www.meteogalicia.gal/web/observacion/camaras

const ENDPOINT = 'https://servizos.meteogalicia.gal/mgrss/observacion/jsonCamaras.action';
const CACHE_TTL_MS = 5 * 60_000;
const TIMEOUT_MS = 8_000;

export interface Cam {
  id: number;
  nome: string;
  concello: string;
  provincia: string;
  lat: number;
  lon: number;
  /** URL de la última imagen (se actualiza periódicamente). */
  imaxe: string;
  /** Versión reducida de la última imagen. */
  imaxeMini: string;
  /** Fecha de la última actualización, tal como la devuelve MeteoGalicia. */
  dataUltimaAct: string;
}

type RawCam = {
  identificador: number;
  nomeCamara: string;
  concello: string;
  provincia: string;
  lat: number;
  lon: number;
  imaxeCamara: string;
  imaxeCamaraMini: string;
  dataUltimaAct: string;
};

let cache: { at: number; cams: Cam[] } | null = null;

/** Lista de cámaras disponibles. Caché de 5 min en el servidor. */
export async function getCams(): Promise<Cam[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.cams;

  const res = await fetch(ENDPOINT, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`MeteoGalicia respondió ${res.status}`);

  const json = (await res.json()) as { listaCamaras?: RawCam[] };
  const cams: Cam[] = (json.listaCamaras ?? []).map((c) => ({
    id: c.identificador,
    nome: c.nomeCamara,
    concello: c.concello,
    provincia: c.provincia,
    lat: c.lat,
    lon: c.lon,
    imaxe: c.imaxeCamara,
    imaxeMini: c.imaxeCamaraMini,
    dataUltimaAct: c.dataUltimaAct,
  }));
  cams.sort((a, b) => a.nome.localeCompare(b.nome, 'gl'));

  cache = { at: Date.now(), cams };
  return cams;
}
