# COISalud Láser

Sitio público independiente de COISalud Láser. No contiene panel, Prisma ni
resolución multitenant. Consume la API pública tenant-scoped de TuOdonto desde
el servidor usando `TUODONTO_SITE_API_KEY`.

```bash
cp .env.example .env
pnpm install
pnpm dev
```

La credencial de sitio se guarda únicamente en el runtime del servidor. Los
formularios del navegador llaman a los route handlers locales, que reenvían la
solicitud a TuOdonto sin revelar el secreto.
