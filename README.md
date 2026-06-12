# mor-klein

Website for **Mor Klein** — [mor-klein.co.il](https://mor-klein.co.il).

## Stack
Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase · Vercel.

See [CLAUDE.md](./CLAUDE.md) for the full project source of truth (services, env vars, conventions) and [PROJECT_JOURNAL.md](./PROJECT_JOURNAL.md) for the running change log.

## Development
```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

Environment variables (Supabase) live in `.env.local` and are mirrored in Vercel.

> Note: this is Next.js 16, which has breaking changes vs. earlier versions. Read `node_modules/next/dist/docs/` before writing framework code (see [AGENTS.md](./AGENTS.md)).
