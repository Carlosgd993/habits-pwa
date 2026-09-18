# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repositorio.

## Qué es esto

La PWA del ecosistema de hábitos: el cliente que se usa desde el navegador y
desde el móvil. Es el cuarto cliente previsto en `../habits-core/CLAUDE.md`, y
el único pensado también para **mirar** los datos, no solo para actuar sobre
ellos: rachas, mapas de calor y analítica viven aquí.

**Es un cliente tonto**, igual que `../streamdeck-habits`. No decide ninguna
lógica de negocio: qué día es hoy, si un hábito toca, cuál es su siguiente
valor o qué pasa al completar una tarea lo decide `habits-core`. Si para pintar
algo hace falta un cálculo, el sitio correcto es una vista nueva en la base, no
una función en TypeScript. Ver `../CLAUDE.md` para el contexto que atraviesa
los repos.

## Estado

Fase 1: login y pantalla "Hoy" de hábitos (`habit_step` / `habit_undo`) contra
el proyecto **de test**. El plan completo por fases está en la conversación que
lo creó; el resumen es: paridad con el deck (fase 2), analítica con vistas
nuevas en `habits-core` (fase 3), gestión del catálogo con RPC nuevas (fase 4),
cierre del rol `anon` (fase 5).

## Stack

React 19 + Vite + TypeScript, Tailwind v4, TanStack Query, `vite-plugin-pwa`,
`@supabase/supabase-js`. Desplegada en Vercel.

## Dónde está cada cosa

```
src/lib/supabase.ts        Cliente unico. Lee VITE_SUPABASE_*
src/lib/queries.ts         LA UNICA CAPA QUE HABLA POSTGREST. Todo pasa por aqui
src/lib/database.types.ts  Tipos del contrato (generados y podados, ver abajo)
src/lib/errors.ts          Clasifica fallos en auth / red / api, como el deck
src/auth/                  AuthGate (sesion) + LoginScreen
src/features/today/        Pantalla "Hoy"
```

## Reglas que no se deducen leyendo el código

- **Ninguna fecha sale de este repo.** `app_today()` decide qué es hoy, con la
  zona horaria fijada en la base. No uses `new Date()` para decidir qué mostrar
  ni para enviar nada: si necesitas una fecha, es que falta una vista o una RPC
  en `habits-core`.
- **`database.types.ts` está podado a propósito.** La generación del MCP de
  Supabase incluye todas las tablas base; aquí solo están las 8 vistas y las 12
  funciones del contrato. Las tablas están cerradas con RLS y sin grant:
  tenerlas en los tipos solo serviría para que el autocompletado sugiera
  consultas que responden 401. Al ampliar el contrato, regenerar y volver a
  podar.
- **Al pulsar, la fila se marca en su sitio y no se mueve.** El valor nuevo lo
  devuelve la propia RPC y se escribe sobre la fila con `setQueryData`, **sin**
  invalidar la consulta. Invalidar reordenaría o haría desaparecer la fila
  entre dos pulsaciones seguidas, que es justo el bug que `../ideario.md`
  recoge del deck. Quien reordena es el refetch real (al volver a la pestaña o
  pasado el `staleTime`).
- **No hay cola de escrituras offline, y es deliberado.** El service worker
  precachea el shell y cachea lecturas (`NetworkFirst`), así que sin red la app
  abre y enseña lo último leído, pero no deja marcar. Una pulsación encolada
  ayer se aplicaría a hoy, porque `habit_step` es relativo al día que decide la
  base.
- **La clave publishable no es secreta.** Viaja en el JavaScript servido al
  navegador. Lo que protege los datos es la sesión de Supabase Auth y el
  contrato cerrado de `habits-core`. Mientras el rol `anon` siga teniendo
  grants (para el deck), esa clave sola abre las mismas vistas: cerrar `anon`
  es la fase 5 y exige migrar antes el daemon.
- **Las claves `sb_publishable_…` no son JWT.** Si acaban en
  `Authorization: Bearer`, PostgREST las rechaza con `Invalid JWT`. `supabase-js`
  lo gestiona solo; si algún día se toca el transporte a mano, cuidado con esto.
- **Los iconos PNG se generan, no se dibujan.** Las fuentes son `public/icon.svg`
  y `public/icon-maskable.svg`; los PNG salen de ahí con
  `npx sharp-cli --input public/icon.svg --output public/icon-192.png resize 192 192`
  (y 512, el maskable a 512 y el `apple-touch-icon` a 180). Existen porque Chrome
  exige PNG de 192 y 512 para considerar la app instalable: con solo SVG, la
  instalación puede no ofrecerse. `sharp-cli` se usa vía `npx` y no es una
  dependencia del proyecto.
- **Los hábitos con `manual_entry` no se pulsan.** Hay que pedir el valor exacto
  y fijarlo con `habit_set`. En la fase 1 su botón está deshabilitado en vez de
  sumar `step`, que sería escribir un dato incorrecto.

## Entornos

| Proyecto | ref | Cuándo |
|---|---|---|
| `habits-core-test` | `dkomeqbvhobkaulogibw` | Desarrollo (ahora) |
| `habits-core` | `ufyzpixnhrsltoxdqihn` | Producción |

Se cambia con `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` en
`.env.local` (local) o en las variables de entorno de Vercel (desplegado). No
hay conmutador en la interfaz: es una variable de build, igual que el
`SUPABASE_ENV` del daemon.

Auth está configurado en cada proyecto por separado: proveedor Email, un único
usuario, registro cerrado. La URL desplegada tiene que estar en
**Authentication → URL Configuration** del proyecto, o el login redirige mal.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # tsc -b && vite build (genera tambien el service worker)
npm run preview  # sirve dist/, unica forma de probar el SW en local
npm run lint     # oxlint
```

El service worker **no se registra en `npm run dev`**: para probar instalación
y comportamiento offline hay que usar `npm run build && npm run preview`, o el
despliegue de Vercel.

## Mantén este fichero al día

Si al trabajar descubres que algo aquí ya no coincide con la realidad,
corrígelo en el mismo turno.
