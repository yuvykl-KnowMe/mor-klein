# Project Journal — Mor Klein

A running log of every meaningful decision and change. **Newest entry on top.**

---

## 2026-06-12 — Installed hebrew-tailwind-preset skill

- Added the **`hebrew-tailwind-preset`** skill via the `skills-il` CLI (`npx skills-il add skills-il/localization@v1.0.4-hebrew-tailwind-preset --skill hebrew-tailwind-preset -a claude-code`), at **project scope** → `.claude/skills/hebrew-tailwind-preset/`.
- **Why:** the stack is Tailwind v4 + Hebrew RTL; this preset provides CSS-first `@theme` config (Heebo/Assistant font stacks, Hebrew line-heights), the physical→logical utility mapping (`ms-`/`me-`/`ps-`/`pe-`/`text-start`), `rtl:` variant patterns, and RTL-first component templates.
- **Vetted:** SKILL.md + `references/rtl-config.md` are pure guidance — no scripts, no `allowed-tools` in frontmatter, no injection. Lowest-risk of the three skills installed today.
- **Caveat for adoption:** the preset's `@theme` block overrides Tailwind defaults for `--text-*` and `--leading-*`; applying it wholesale resets the global type scale. Adopt the font stacks + Hebrew line-heights, but review the type-scale overrides against the existing design first.
- **Source:** `skills-il` npm pkg (verified previously); skill repo `github.com/skills-il/localization @ v1.0.4-hebrew-tailwind-preset`.

## 2026-06-12 — Installed israeli-accessibility-compliance skill

- Added the **`israeli-accessibility-compliance`** skill via the `skills-il` CLI (`npx skills-il add skills-il/localization@v1.2.0-israeli-accessibility-compliance --skill israeli-accessibility-compliance -a claude-code`), at **project scope** → `.claude/skills/israeli-accessibility-compliance/`.
- **Why:** mor-klein.co.il is a public-facing Hebrew RTL site, so IS 5568 / Equal Rights for Persons with Disabilities accessibility compliance is legally mandatory (civil statutory damages up to 50k NIS + Commission administrative penalties). Skill covers exemption tiers, the 60-day cure period, accessibility coordinator role, Hebrew screen-reader/RTL ARIA patterns, the mandatory Hatzaharat Negishot statement, and a Regulation-35 accessibility-widget guide.
- **Vetted before trusting:** SKILL.md is pure guidance with no injection; `scripts/audit_a11y.py` is benign — one outbound `requests.get()` to a user-supplied URL (its purpose), BeautifulSoup parse, no subprocess/eval/exfiltration.
- **Heads-up:** the skill's frontmatter declares `allowed-tools: Bash(python:*) Bash(pip:*)`, so when active it's pre-authorized to run python/pip; the audit script needs `requests` + `beautifulsoup4` (install into a venv, not system Python). `references/widget-implementation.md` is copy-pasteable TS/React — review before lifting into the site.
- **Source:** `skills-il` npm pkg (verified previously); skill repo `github.com/skills-il/localization @ v1.2.0-israeli-accessibility-compliance`.

## 2026-06-12 — Installed israeli-privacy-shield compliance skill

- Added the **`israeli-privacy-shield`** skill via the `skills-il` CLI (`npx skills-il add skills-il/security-compliance@v1.4.1-israeli-privacy-shield --skill israeli-privacy-shield -a claude-code`), installed at **project scope** → `.claude/skills/israeli-privacy-shield/`. Also created `skills-lock.json` at the repo root.
- **Why:** Mor Klein is an Israeli business handling client personal data; this skill provides Privacy Protection Law / Amendment 13 (effective 2025-08-14) compliance guidance — security levels, database registration, consent, cross-border transfers, 72h breach notification, DSR workflow, DPIA, minors' data, plus a consent-banner implementation guide.
- **Vetted before trusting** (skills run with full agent permissions): SKILL.md is pure domain guidance with no hidden/injection directives; `scripts/compliance_checker.py` is self-contained (argparse + json, no network/subprocess/eval, no filesystem writes beyond an explicit `--output`).
- **Known caveat:** `compliance_checker.py` still applies the pre-Amendment registration rule (10k+ records AND sensitive ⇒ register), which Amendment 13 narrowed — it over-reports registration need vs. the skill's own SKILL.md. Treat the script's registration flag as conservative, not authoritative.
- **Source:** `skills-il` npm package (v1.10.0, maintainer yootech, agentskills.co.il); skill repo `github.com/skills-il/security-compliance @ v1.4.1-israeli-privacy-shield`. `skills-il` package existence + provenance verified before install.

---

## 2026-06-12 — Domain live in production

- **mor-klein.co.il** is purchased and registered at **livedns.co.il**.
- DNS is wired to **Vercel** with a valid configuration; `www` redirects to the apex.
- The domain is serving the placeholder homepage ("מור קליין" / "אתר בהקמה") in production.
- No further Vercel domain setup needed — documented in CLAUDE.md so it isn't re-added.

---

## 2026-06-12 — Committed setup; adopted autonomous git workflow

- Committed the cleanup + CLAUDE.md + PROJECT_JOURNAL.md work to `main` (`da957fe`) and pushed to GitHub (yuvykl-KnowMe/mor-klein). Verified local HEAD matches remote `main`.
- **Workflow going forward:** after each meaningful chunk of work, commit and push autonomously with a clear English message and log it here. Git is no longer managed manually by the user.

---

## 2026-06-12 — Project setup & de-boilerplating

Cleaned up the Create-Next-App starter and established the project's source of truth.

**Decisions**
- **Next.js version:** repo actually runs **16.2.9**, not 15 as originally assumed. Documented "Next.js 16" everywhere (CLAUDE.md, README) instead of the stale assumption. Breaking changes apply — consult `node_modules/next/dist/docs/` before framework code (per AGENTS.md).
- **Language:** site content is Hebrew RTL (`<html lang="he" dir="rtl">`); all code, comments, and commits in English.
- **Fonts:** using a clean Hebrew-friendly system font stack for now. Not investing in typography — the real Hebrew typeface is chosen in Stage 2 (site build).
- **Guardrail:** work only inside this repo; never touch other projects on this machine (Yadayim, KnowMe).

**Changes**
- Rewrote `CLAUDE.md` as the single source of truth (client, hosting, Supabase, integrations, env vars, language rules, how-to-work, guardrail). Still imports `AGENTS.md`.
- `app/page.tsx` → minimal placeholder homepage showing "מור קליין" + "אתר בהקמה", so the live domain looks intentional.
- `app/layout.tsx` → Hebrew RTL root, real metadata ("מור קליין"), dropped Geist/Google fonts.
- `app/globals.css` → trimmed to Tailwind import + base tokens + system font stack.
- Deleted unused starter assets: `public/{next,vercel,file,globe,window}.svg`.
- Replaced the default `README.md` with a short project-specific one.
- Created this journal.

**Kept untouched:** `lib/supabase.ts`, `AGENTS.md`, and all config files (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`).
