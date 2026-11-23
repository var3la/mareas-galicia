# Mareas Galicia

Aplicación Astro (SSR) que consulta la predicción oficial de mareas de
[MeteoGalicia](https://www.meteogalicia.gal/web/predicion/mareas-e-luas)
y muestra el estado de la marea por zonas de Galicia.

## Uso

```bash
npm install
npm run dev        # desarrollo en http://localhost:4321
npm run build      # genera dist/ (sitio estático)
npm run preview    # sirve dist/ en local
```

## Estructura

- `src/lib/zones.ts` — zonas de Galicia y `idPorto` de cada puerto.
- `src/lib/meteogalicia.ts` — cliente del servicio JSON `jsonMareas.action` (sin API key), con caché de 15 min.
- `src/lib/tide.ts` — estado actual (subiendo/bajando), altura interpolada y curva del día.
- `src/lib/time.ts` — fechas en horario de Galicia (Europe/Madrid).
- `src/components/PortCard.astro` — tarjeta de puerto con gráfico SVG.
- `src/components/MareasPage.astro` — vista de mareas (zona + día).
- `src/pages/index.astro` — página principal (zona por defecto, hoy).
- `src/pages/[zona]/[dia].astro` — una página estática por zona y día (ayer a +6 días).
- `src/lib/paths.ts` — prefijo `base` para enlaces.

## Notas

- El sitio es estático: las consultas a MeteoGalicia se hacen al construir, no en el navegador.
- Despliegue en GitHub Pages (`.github/workflows/deploy.yml`): se publica en cada push a `main` y cada hora. En el repositorio, Settings → Pages → Source: **GitHub Actions**. URL: `https://var3la.github.io/mareas-galicia/`.
- En local, si el certificado de MeteoGalicia no es válido (proxy corporativo), arranca con `NODE_EXTRA_CA_CERTS=ruta/al/bundle.pem npm run dev`.
- Las alturas entre pleamar y bajamar son una interpolación orientativa; no sirven para navegación.
