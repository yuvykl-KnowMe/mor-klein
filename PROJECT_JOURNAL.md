# Project Journal — Mor Klein

A running log of every meaningful decision and change. **Newest entry on top.**

---

## 2026-06-12 — Homepage v1 built (design locked: cream + sage, Heebo/Assistant)

- Replaced the Stage-1 placeholder with the full production **homepage**: hero (with decorative portrait slot for Mor's future photo), three focus areas (career / couples / early parenthood), Adlerian-approach teaser, online-via-Zoom-as-advantage, closing CTA. All real Hebrew copy, drafted per copy ethics (always "פסיכותרפיסטית" + "עובדת סוציאלית קלינית (M.S.W)", never the forbidden title; no superlatives, no testimonials) — to be refined with Mor.
- **Theme:** locked tokens baked into Tailwind v4 `@theme` in `app/globals.css` (cream `#F4EFE4`, surface `#FBF8F1`, ink `#2F2A22`, ink-muted `#6B6354`, sage `#7C8C6E`, sage-deep `#5E6E50`, on-accent, line `#E6DECF`). Removed dark-mode swap (single warm light theme, `color-scheme: light`). Hebrew leading 1.7 baked into base/lg text sizes. Flat design — zero shadows; surfaces separate via `bg-surface` + `border-line`.
- **Contrast decision (computed):** on-accent on sage = 3.14:1 → **fails AA**, so sage is decorative-only (illustration/icons); all CTAs and accent text use sage-deep (4.79:1, passes). Added `sage-deeper #4D5A40` for hover.
- **Fonts:** Heebo (headings) + Assistant (body) via `next/font/google`, hebrew+latin subsets, CSS-variable strategy wired into `@theme inline`.
- **Structure:** new `lib/site.ts` (site constants; `BOOKING_URL = "#contact"` placeholder — Cal.com swap is a one-line change), `components/site/{Header,Footer}.tsx`, `components/ui/CtaLink.tsx`, `components/home/{Hero,PortraitSlot,FocusAreas,Approach,OnlineTherapy,ClosingCta}.tsx`. All server components, fully static prerender.
- **SEO/GEO:** real Hebrew title + description, title template for future pages, `metadataBase`, canonical, OG (`he_IL`), separate `viewport` export (Next 16), JSON-LD `@graph` of `ProfessionalService` + `Person` (cross-linked `@id`s; only true facts — deliberately no address/phone/hours/prices/ratings since the practice is online-only).
- **Accessibility (IS 5568):** skip link, landmarks, one H1 + proper hierarchy, logical properties only (`ms-/me-/ps-/pe-`), global `:focus-visible` sage-deep ring, 44px touch targets, smooth scroll only under `prefers-reduced-motion: no-preference`, decorative SVGs `aria-hidden`.
- **Verified:** `next build` → `○ /` static, lint clean, rendered HTML has 1×`<h1>`, valid JSON-LD, `og:locale he_IL`, canonical; greps clean for physical-direction classes and the forbidden title.
- **Deferred (next phases):** accessibility-statement page + footer link (required by IS 5568 before launch marketing), OG image, robots.txt + sitemap, Cal.com booking URL swap, Mor's portrait photo into the hero slot, copy refinement with Mor.

## 2026-06-12 — Installed hebrew-seo-geo-toolkit skill

- Added the **`hebrew-seo-geo-toolkit`** skill via the `skills-il` CLI (`npx skills-il add skills-il/marketing-growth@v2.2.0-hebrew-seo-geo-toolkit --skill hebrew-seo-geo-toolkit -a claude-code`), at **project scope** → `.claude/skills/hebrew-seo-geo-toolkit/`.
- **Why:** directly relevant to mor-klein.co.il — Hebrew SEO + GEO (AI-search optimization) for `.co.il`: keyword research, Hebrew morphology, JSON-LD/Israeli-business schema, EEAT, GEO methods, AI-bot/robots/sitemap audit.
- **Vetted closely (11 executable scripts — highest script count so far):** `credential.py` reads `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD` from env only (no hardcoded secrets, no file reads); `dataforseo_api.py` sends them via Basic auth to `https://api.dataforseo.com/v3` and nowhere else. URL scan across all scripts found only `api.dataforseo.com` + an `example.com` placeholder — no exfil endpoints, no subprocess/os.system/eval/smtplib/sockets. `seo_audit.py` just fetches a user-supplied URL + its robots/sitemap. SKILL.md frontmatter has no `allowed-tools`.
- **Usage notes:** DataForSEO scripts need the user's own paid API creds in env; the SEO audit + schema/checklist references work with no API setup.
- **Source:** `skills-il` npm pkg (verified previously); skill repo `github.com/skills-il/marketing-growth @ v2.2.0-hebrew-seo-geo-toolkit`.

## 2026-06-12 — Installed ui-ux-pro-max skill (UI/UX design intelligence)

- Added the **`ui-ux-pro-max`** UI/UX design skill into **this repo only** via `npx uipro-cli init --ai claude` (chose `npx` over the requested `npm i -g` to avoid a global footprint). Lives at `.claude/skills/ui-ux-pro-max/` (`SKILL.md`, `scripts/*.py`, `data/*.csv` + 13 stack files). Source: npm `uipro-cli@2.2.3` (maintainer viettranx) → GitHub `nextlevelbuilder/ui-ux-pro-max-skill`; both verified to exist before running.
- **Vetted, clean:** `SKILL.md` is UI/UX guidance (no `allowed-tools`, no injection); `core.py`/`design_system.py`/`search.py` are a self-contained BM25 CSV search + markdown generator — no network, subprocess, eval, or exfiltration. Functional test passed (`search.py … --domain style`). Deleted shipped `scripts/__pycache__/*.pyc` as hygiene (regenerated from source on demand).
- **CORRECTION (recorded for honesty):** I initially suspected the installer had tampered with `.claude/settings.json` because permission-allowlist entries appeared right after `uipro init`. On investigation this was **wrong** — the additions are the Claude Code **permission system persisting approved session commands** (the list kept growing with my own later `git checkout` / `rm` / `xcode-select` / `python3` commands, long after the installer exited). The `uipro` package did NOT modify settings.json. No malicious behavior found.
- **python3 prerequisite:** confirmed working — system Python 3.9.6 via Xcode Command Line Tools (already installed; no Homebrew on machine).
- **Lesson:** before attributing a settings.json change to a tool, check whether the harness's own approved-permission persistence explains it — the timing can be coincidental.

## 2026-06-12 — Installed remotion-best-practices skill

- Added the **`remotion-best-practices`** skill via the `skills-il` CLI (`npx skills-il add skills-il/developer-tools@v1.7.0-remotion-best-practices --skill remotion-best-practices -a claude-code`), at **project scope** → `.claude/skills/remotion-best-practices/`.
- **What it is:** best practices for Remotion (programmatic React video) with strong Hebrew/RTL coverage — fonts, bidi, RTL captions/typewriter, voiceover (ElevenLabs), charts, maps, rendering (local + Lambda). 40+ on-demand rule files + 3 `.tsx` example components.
- **Vetted:** scanned SKILL.md + all rules/assets for risky patterns. Clean — only benign hits: a commented-out `execSync('ffmpeg …')` example, and standard `process.env.*` API-key reads (ElevenLabs/Mapbox from `.env`). No injection, no exfiltration, no `allowed-tools` in frontmatter.
- **Fit / caveats:** more tangential than the privacy/a11y/tailwind skills — it's for generating *video* content (social/promo), not the site itself. Licensing: Remotion is free for orgs ≤3 employees; **4+ requires a paid Company License** (remotion.pro). Voiceover/maps need the user's own API keys in `.env`.
- **Source:** `skills-il` npm pkg (verified previously); skill repo `github.com/skills-il/developer-tools @ v1.7.0-remotion-best-practices`.

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
