// Zonas de Galicia y puertos de MeteoGalicia (idPorto) que pertenecen a cada una.
// Los identificadores proceden de la documentación oficial del servicio JSON de mareas.

export interface Zone {
  slug: string;
  name: string;
  blurb: string;
  ports: number[];
}

export const zones: Zone[] = [
  {
    slug: 'marina-lucense',
    name: 'Mariña lucense',
    blurb: 'Costa norte de Lugo, entre Ribadeo y El Vicedo.',
    ports: [6],
  },
  {
    slug: 'rias-altas',
    name: 'Rías Altas',
    blurb: 'A Coruña, Ferrol y sus rías del norte.',
    ports: [1, 14, 16],
  },
  {
    slug: 'costa-da-morte',
    name: 'Costa da Morte',
    blurb: 'Cabos, playas abiertas y puertos del oeste coruñés.',
    ports: [7, 8, 9],
  },
  {
    slug: 'rias-baixas',
    name: 'Rías Baixas',
    blurb: 'Vigo, Pontevedra, Vilagarcía y las rías del sur.',
    ports: [3, 4, 10, 11, 12, 13, 15],
  },
];

export const DEFAULT_ZONE = 'rias-baixas';

export function getZone(slug: string | null | undefined): Zone {
  return zones.find((z) => z.slug === slug) ?? zones.find((z) => z.slug === DEFAULT_ZONE)!;
}
