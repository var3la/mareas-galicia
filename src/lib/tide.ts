import type { Extremo } from './meteogalicia';

export interface TideStatus {
  /** Altura estimada en este instante (m). */
  height: number | null;
  /** 'subindo' | 'baixando' | 'parada' cuando no hay datos suficientes. */
  trend: 'subindo' | 'baixando' | 'desconocido';
  prev: Extremo | null;
  next: Extremo | null;
  /** Minutos hasta el siguiente extremo. */
  minutesToNext: number | null;
  /** Progreso entre extremos, 0..1. */
  progress: number;
}

/** Interpolación coseno entre dos extremos: la forma real de la marea se aproxima bien así. */
function cosineInterp(a: Extremo, b: Extremo, t: number): number {
  const f = (1 - Math.cos(Math.PI * t)) / 2;
  return a.altura + (b.altura - a.altura) * f;
}

export function tideStatus(extremos: Extremo[], now: number): TideStatus {
  const prev = [...extremos].reverse().find((e) => e.minutes <= now) ?? null;
  const next = extremos.find((e) => e.minutes > now) ?? null;

  if (!prev || !next) {
    return { height: null, trend: 'desconocido', prev, next, minutesToNext: null, progress: 0 };
  }

  const span = next.minutes - prev.minutes;
  const progress = span > 0 ? (now - prev.minutes) / span : 0;
  return {
    height: round2(cosineInterp(prev, next, progress)),
    trend: next.tipo === 'pleamar' ? 'subindo' : 'baixando',
    prev,
    next,
    minutesToNext: next.minutes - now,
    progress,
  };
}

export interface CurvePoint {
  minute: number; // 0..1440 dentro del día
  height: number;
}

/**
 * Muestras de la curva de marea a lo largo de un día (cada 10 min).
 * Usa los extremos de los días anterior y siguiente para no quedar planos en los bordes.
 */
export function tideCurve(extremos: Extremo[], dayStart: number, step = 10): CurvePoint[] {
  const points: CurvePoint[] = [];
  for (let m = 0; m <= 1440; m += step) {
    const abs = dayStart + m;
    const prev = [...extremos].reverse().find((e) => e.minutes <= abs);
    const next = extremos.find((e) => e.minutes > abs);
    let h: number;
    if (prev && next) {
      h = cosineInterp(prev, next, (abs - prev.minutes) / (next.minutes - prev.minutes));
    } else {
      h = (prev ?? next)?.altura ?? NaN;
    }
    if (!Number.isNaN(h)) points.push({ minute: m, height: h });
  }
  return points;
}

/** Ruta SVG suave (Catmull-Rom -> Bézier) a partir de puntos ya proyectados. */
export function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
