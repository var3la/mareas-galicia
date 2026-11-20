# Mareas Galicia

Aplicación Astro (SSR) que consulta la predicción oficial de mareas de
[MeteoGalicia](https://www.meteogalicia.gal/web/predicion/mareas-e-luas)
y muestra el estado de la marea por zonas de Galicia.

## Uso

```bash
npm install
npm run dev        # desarrollo en http://localhost:4321
npm run build      # genera dist/
npm start          # servidor de producción (PORT y HOST opcionales)
```

## Estructura

- `src/lib/zones.ts` — zonas de Galicia y `idPorto` de cada puerto.
- `src/lib/meteogalicia.ts` — cliente del servicio JSON `jsonMareas.action` (sin API key), con caché de 15 min.
- `src/lib/tide.ts` — estado actual (subiendo/bajando), altura interpolada y curva del día.
- `src/lib/time.ts` — fechas en horario de Galicia (Europe/Madrid).
- `src/components/PortCard.astro` — tarjeta de puerto con gráfico SVG.
- `src/pages/index.astro` — página principal (`?zona=rias-baixas&dia=2026-11-20`).

## Notas

- Las consultas a MeteoGalicia se hacen en el servidor, así se evitan problemas de CORS.
- Las alturas entre pleamar y bajamar son una interpolación orientativa; no sirven para navegación.
- Si el servidor no puede validar el certificado de `servizos.meteogalicia.gal` (proxies corporativos), la página mostrará el aviso de error.
