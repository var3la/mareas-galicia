import { addDays, isoToMinutes, toMeteoGaliciaDate } from './time';

// Servicio JSON oficial de predicción de mareas de MeteoGalicia (sin clave de API).
const ENDPOINT = 'https://servizos.meteogalicia.gal/mgrss/predicion/mareas/jsonMareas.action';
const CACHE_TTL_MS = 15 * 60_000;
const TIMEOUT_MS = 8_000;

export interface Extremo {
  /** Minutos "de reloj" de Galicia desde 1970 (UTC-aligned). */
  minutes: number;
  hora: string;
  altura: number;
  tipo: 'pleamar' | 'bajamar';
}

export interface Porto {
  id: number;
  nome: string;
  lat: number;
  lon: number;
  extremos: Extremo[];
}

type RawMarea = {
  data: string;
  idPorto: number;
  nomePorto: string;
  latitude: number;
  lonxitude: number;
  listaMareas: { altura: number; hora: string; idTipoMarea: number; tipoMarea: string }[];
};

const cache = new Map<string, { at: number; ports: Map<number, Porto> }>();

/**
 * Devuelve los extremos (pleamares/bajamares) de todos los puertos entre
 * `fromIso` y `toIso` (ambos incluidos). Máximo 30 días según la API.
 */
export async function getMareas(fromIso: string, toIso: string): Promise<Map<number, Porto>> {
  const key = `${fromIso}|${toIso}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.ports;

  const url = new URL(ENDPOINT);
  url.searchParams.set('dataIni', toMeteoGaliciaDate(fromIso));
  url.searchParams.set('dataFin', toMeteoGaliciaDate(toIso));

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`MeteoGalicia respondió ${res.status}`);

  const json = (await res.json()) as { mareas?: RawMarea[] };
  const ports = new Map<number, Porto>();

  for (const day of json.mareas ?? []) {
    const dayIso = day.data.slice(0, 10);
    let porto = ports.get(day.idPorto);
    if (!porto) {
      porto = { id: day.idPorto, nome: day.nomePorto, lat: day.latitude, lon: day.lonxitude, extremos: [] };
      ports.set(day.idPorto, porto);
    }
    for (const m of day.listaMareas) {
      porto.extremos.push({
        minutes: isoToMinutes(dayIso, m.hora),
        hora: m.hora,
        altura: m.altura,
        tipo: m.idTipoMarea === 1 ? 'pleamar' : 'bajamar',
      });
    }
  }
  for (const p of ports.values()) p.extremos.sort((a, b) => a.minutes - b.minutes);

  cache.set(key, { at: Date.now(), ports });
  return ports;
}

/** Ventana de días necesaria para mostrar un día completo y calcular el estado actual. */
export function windowAround(dayIso: string): { from: string; to: string } {
  return { from: addDays(dayIso, -1), to: addDays(dayIso, 1) };
}
