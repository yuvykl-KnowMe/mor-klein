# Mor Klein — Project Source of Truth

@AGENTS.md

## Client & Identity
- **Client:** Mor Klein
- **Domain:** mor-klein.co.il
- **Pro email:** mor@mor-klein.co.il (Cloudflare Email Routing → Mor's Gmail)

## Repositories & Hosting
- **GitHub:** yuvykl-KnowMe/mor-klein (private)
- **Vercel:** mor-klein (hobby, team: yuvykl-7526)
- **Local path:** /Users/yuvalklein/Documents/mor-klein

## Stack
- **Next.js 16** (App Router, TypeScript) — repo runs 16.2.9. See AGENTS.md; read `node_modules/next/dist/docs/` before writing framework code.
- **Tailwind CSS** (v4)
- **Supabase** (`@supabase/supabase-js`, client in `lib/supabase.ts`)
- **Vercel** (hosting / CI)

## Supabase
- **Project:** mor-klein
- **ID:** itxplaiwjtskhunvpzkk
- **URL:** https://itxplaiwjtskhunvpzkk.supabase.co
- **Region:** eu-central-1

## Integrations
- **Video:** Zoom Pro
- **Scheduling:** Cal.com (free)
- **Invoicing:** Morning API
- **Email (transactional):** Resend (free, 3,000/mo)
- **Payments:** Bit + PayBox (no API — manual confirmation)

## Environment Variables
Already set in Vercel and `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Language Rules
- **Site content:** Hebrew, right-to-left (RTL). `<html lang="he" dir="rtl">`.
- **Code, comments, identifiers, commit messages:** English.

## How to Work
- You have broad permissions — act autonomously and do as much as possible without hand-holding.
- **Always explain a short plan before running it.** Plan first, then execute.
- Append every meaningful decision or change to `PROJECT_JOURNAL.md` (newest on top).
- This is Next.js 16 with breaking changes — consult `node_modules/next/dist/docs/` before writing framework code (per AGENTS.md).

## Guardrail
- Work **only** inside this repo (`/Users/yuvalklein/Documents/mor-klein`). Never touch or modify any other project on this machine (e.g. Yadayim, KnowMe).
