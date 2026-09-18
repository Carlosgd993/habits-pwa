# PWA de hábitos

Cliente web e instalable del ecosistema de hábitos. Consume la base
`habits-core` vía PostgREST y no decide ninguna lógica de negocio por su
cuenta.

```bash
cp .env.example .env.local   # y rellenar con el proyecto Supabase
npm install
npm run dev
```

Para probar la instalación y el comportamiento sin conexión hace falta el build,
porque el service worker no se registra en `dev`:

```bash
npm run build && npm run preview
```

El contexto completo (reglas, entornos, decisiones) está en `CLAUDE.md`.
