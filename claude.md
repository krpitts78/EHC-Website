# Executive Hunting Club Website

## Project Overview

Member portal and public website for the Executive Hunting Club, a Texas non-profit hunting and fishing club founded August 11, 1975 (Charter No. 366138). Replaces the current Wix site at executivehuntingclub.com.

## Tech Stack

- **Framework:** Next.js 16 (App Router, src/) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (config-in-CSS via `@theme` in `globals.css`) + `@tailwindcss/typography`
- **Backend:** Supabase project `cdyhxgsijrmbkubafbah` (auth, database, storage)
- **Email:** Resend (planned — not yet integrated)
- **Payments:** Stripe (planned — not yet integrated; payments tracked manually for now)
- **Hosting:** Vercel — live at https://ehc-website-sigma.vercel.app
- **Repo:** github.com/krpitts78/EHC-Website

## Repo Layout

- `src/app/` — App Router pages and route handlers
- `src/lib/` — server helpers (`supabase/server.ts`, `supabase/client.ts`, `supabase/middleware.ts`, `beach-house.ts`, `permissions.ts`)
- `src/middleware.ts` — refreshes Supabase auth cookies on every request
- `scripts/` — one-shot Node scripts for seeding data (documents, content pages, calendar)
- `_prototype/` — original prototype HTML/TSX, kept for reference, excluded from build via `tsconfig.json`
- `_docs_source/` — gitignored staging area for source PDFs (member directory, calendars, etc.)
- `public/logo.png` — official club logo

## Brand Colors (Charcoal + Cream + UT Accent)

Theme tokens defined in `src/app/globals.css` via `@theme`. Components currently use inline hex literals; that pattern is fine for new code.

| Color | Hex | Token | Use |
|-------|-----|-------|-----|
| Burnt Orange | `#BF5700` | `--color-burnt-orange` | Wordmarks, primary CTAs, board-role badges, links (the "Texas touch") |
| Burnt Orange Dark | `#7a3500` | `--color-burnt-orange-dark` | Hover state for primary CTAs |
| Gold | `#D4AF37` | `--color-gold` | Hero divider only (decorative) |
| UT Yellow | `#FFD600` | `--color-ut-yellow` | Reserved for hidden UT easter eggs |
| Charcoal | `#333F48` | `--color-charcoal` | Public hero, public dark section bg, portal nav, auth screens |
| Charcoal Deep | `#1a2128` | `--color-charcoal-deep` | Footer, admin sub-nav strip, default dark text |
| Charcoal Accent | `#4a5763` | `--color-charcoal-accent` | Cards on dark surfaces |
| Slate Border | `#5a6470` | `--color-slate-border` | Borders on dark surfaces, Website Admin badge bg |
| Cream | `#D6D2C4` | `--color-cream` | Dashboard bg, public alternate light sections |
| Cream Border | `#a8a395` | `--color-cream-border` | Borders on light surfaces |
| Buckskin | `#d4c89c` | `--color-buckskin` | Warm text on dark bg (in nav, hero subtitle) |

**Contrast rule:** the Website Admin badge (`bg-[#5a6470]`) and Director badge (`bg-[#BF5700]`) must use `text-white`. Card titles on white surfaces must use `text-[#1a2128]`, not `text-white`.

## Database Schema (Supabase)

All tables are RLS-enabled. Helper functions:
- `public.current_user_is_admin()` — `is_admin = true` OR any `board_role` set
- `public.current_user_manages_beach_house()` — `is_admin = true` OR `board_role = 'vp_beach_house'`
- `public.is_email_eligible(text)` — used by signup gate (email is in `members` and not yet claimed)
- `public.set_updated_at()` — updated_at trigger
- `public.link_auth_user_to_member()` — auth.users trigger that links a confirming user to their members row

### `members`
Source-of-truth directory. 83 rows seeded from "Membership Directory 2.13.26.pdf".
- `member_number` (PK shape `R-NNN-YY` / `C-NNN-YY` / `HC-NNN-YY`), `member_type`
- `first_name, last_name, preferred_name, suffix, spouse_name`
- `email` (unique on `lower(email)`, nullable for members without email)
- `phone_home, phone_work, phone_cell`
- `address_line1, city, state, zip`
- `dues_amount_cents, joined_year`
- `board_role` (string code: `president`, `vp_beach_house`, `vp_legal`, `vp_membership`, `vp_secretary_treasurer`, `director`)
- `board_role_label` (display string, e.g., "Director - Spring Trip Coordinator")
- `is_admin` (boolean — site admin separate from board)
- `is_prime_list` (boolean — eligible to reserve prime weeks)
- `auth_user_id` (FK to auth.users, NULL until claim)
- `claimed_at` (timestamp set when email confirmed)

RLS: any authed user reads; members update own row; admins (any board or admin) full access.

### `documents`
Metadata for files in private `documents` storage bucket. 13 files seeded across categories (tax_returns, financial_statements, articles, board_minutes, other).
- `storage_path, title, category, description, size_bytes, mime_type, uploaded_by`
- Categories: `tax_returns | financial_statements | bylaws | articles | board_minutes | beach_house | other`

RLS: members read; admins write. Storage policies match.

Downloads issue 60s signed URLs via `/dashboard/documents/[id]/download`.

### `content_pages`
Editable narrative pages.
- `slug` (PK), `title, body_markdown, updated_by, updated_at`
- Current pages: `bylaws`, `beach-house-rules`, `beach-house-dos-donts`, `beach-house-contacts`, `payment-instructions`
- Renderer: `marked` → `dangerouslySetInnerHTML` with Tailwind `prose` (light surface)
- RLS write: any board member or `is_admin`. Editing on the rendered page itself via "Edit" button.

### `reservations`
Beach house bookings AND blocks/events.
- `member_id` (nullable — null for blocks/events), `week_start_friday` (legacy column name; for blocks may be any weekday), `end_date`, `kind` (`rental` | `block` | `event`)
- `status` (`requested` | `confirmed` | `cancelled` | `completed`), `is_prime`
- `rate_cents, cleaning_fee_cents`
- `deposit_paid_at, balance_paid_at, requested_at, confirmed_at, cancelled_at, approved_by, notes`
- Partial unique index on `week_start_friday` where `status in ('requested','confirmed') and kind='rental'` — prevents double-booking but allows overlapping blocks/events.

RLS: members read all; members can insert own request (`kind='rental'`); members update own pending; **VP Beach House + admin** full access via `current_user_manages_beach_house()`.

## Beach House

Located at **2940 Tropicana Dr, Ramada Beach Subdivision, Bolivar Peninsula** (~13 miles past the Galveston Ferry on Hwy 87).

Real rates (per `beach-house-rules` content page):
- **Prime week:** $1,000 (Friday before first full week of May → Friday after Labor Day)
- **Non-Prime week:** $600
- **Cleaning fee:** $125 (paid directly to housekeeper)
- **Deposit:** $100, due within 2 weeks of confirmed reservation
- **Balance:** due 4 weeks before stay

Reservations open at 6:00 AM **one year prior** to the start date. Weeks run Friday 4 PM → next Friday 12 PM. Prime weeks limited to members on the prime-time list.

Constants in `src/lib/beach-house.ts`. Prime-window is computed per-year (not stored).

## Authentication Flow

1. Member visits `/signup`, enters email + password.
2. Server action validates email is in `members` AND `claimed_at IS NULL` via `is_email_eligible(email)` RPC.
3. Calls `supabase.auth.signUp` with `emailRedirectTo: /auth/confirm`.
4. Supabase sends verification email.
5. Member clicks → `/auth/confirm` route handler exchanges token → session.
6. Postgres trigger `on_auth_user_confirmed` runs after `email_confirmed_at` is set → updates the `members` row's `auth_user_id` and `claimed_at`.
7. Member lands on `/dashboard`.

Login: `/login` → `signInWithPassword` → `/dashboard`. Sign-out: POST `/auth/signout`.

## Roles & Permissions

| Capability | Site admin (`is_admin`) | Board (any `board_role`) | VP Beach House | Regular member |
|---|---|---|---|---|
| Read directory, documents, pages, reservations | ✓ | ✓ | ✓ | ✓ |
| Edit own profile | ✓ | ✓ | ✓ | ✓ |
| Request own beach-house rental | ✓ | ✓ | ✓ | ✓ |
| Edit any member, upload/delete documents, edit content pages | ✓ | ✓ | ✓ | — |
| Approve/reject reservations, manage prime list | ✓ | — | ✓ | — |

Helpers in `src/lib/permissions.ts` (`isSiteAdmin`, `canManageBeachHouse`, `getCurrentMemberPerm`).

## Routes

### Public
- `/` — landing
- `/login`, `/signup`, `/signup/check-email`
- `/auth/confirm`, `/auth/signout`

### Member portal (auth required)
- `/dashboard` — greeting + tile grid
- `/dashboard/directory` — full member list with search and All / Board only toggle
- `/dashboard/profile` — edit own contact info
- `/dashboard/documents` — list + download
- `/dashboard/documents/upload` — admin upload
- `/dashboard/documents/[id]/download` — issues signed URL
- `/dashboard/p/bylaws`, `/dashboard/p/beach-house-rules`, `/dashboard/p/beach-house-dos-donts`, `/dashboard/p/beach-house-contacts`, `/dashboard/p/payment-instructions`
- `/dashboard/p/[slug]/edit` — admin/board markdown editor
- `/dashboard/beach-house` — hub
- `/dashboard/beach-house/calendar` — year-grid (52 weeks, ★ on prime, color-coded)
- `/dashboard/beach-house/reserve?week=YYYY-MM-DD` — request form
- `/dashboard/beach-house/my-reservations` — own bookings

### Admin (VP Beach House + site admin)
- `/dashboard/admin/reservations` — pending queue, confirmed list, payment tracking, cancel
- `/dashboard/admin/prime-list` — toggle members on/off prime list

## Mobile

`src/app/dashboard/PortalNav.tsx` is a server component that loads permissions and hands an item list to `NavMenu.tsx` (client component). On `>= md` the nav renders inline; below `md` a hamburger toggles a stacked dropdown. Public homepage is responsive via Tailwind `sm:` / `md:` breakpoints. Card grids collapse to single column on small screens.

## Conventions

- Server components use `createClient` from `@/lib/supabase/server`; client components use `@/lib/supabase/client`.
- Always `await createClient()` and `await cookies()` — both are async in Next 15+.
- Server actions are colocated in `actions.ts` next to their consumer.
- For nested foreign-key selects: cast via `as unknown as T[]` because supabase-js types over-defensively return arrays.
- For Postgres date arithmetic: keep dates as ISO `YYYY-MM-DD` strings on the wire; convert to UTC `Date` via `toUtcDate` (in `src/lib/beach-house.ts`) for any computation.
- Markdown source for content pages stays in `scripts/seed-content-pages.mjs` for first run only — once admins start editing, the DB is canonical.
- Don't reseed data over user edits without confirming first.

## Easter Eggs (UT)

All four are live:

- **Type `texas` anywhere on the dashboard** → full-screen burnt-orange "HOOK 'EM!" flash for ~1.5s. Implementation: `EasterEggClient.tsx` listens to `keydown` with a 5-char rolling buffer, ignored when focus is in inputs/textareas.
- **Triple-click the EHC logo in the portal nav** (within 1.5s) → toggles `localStorage.utReveal`, dispatches a `ut-reveal-changed` event, and `EasterEggClient` toggles `body.ut-revealed`. CSS rule in `globals.css` reveals any `.ut-badge` 🤘 spans (currently next to member name in dashboard greeting; add more elsewhere as needed).
- **🤘 in the public footer** next to the charter number — always visible (`src/app/page.tsx` SiteFooter).
- **Longhorn silhouette watermark** at 4% opacity in the bottom-right of every dashboard page — always visible. Asset is `public/longhorn.svg` (a PNG-embedded SVG supplied by the user); rendered via `<img>` in `src/app/dashboard/layout.tsx`.

The "UT '##" graduation-year badge from the original spec was dropped — we don't track grad year on members. Add a `ut_grad_year` column if you ever want it back.

Keep additions subtle and tasteful — the club site is brown/orange themed and UT touches are accents only.

## Phase Plan

**Phase 1 — MVP (mostly done):** Auth ✓, member directory ✓, profile editing ✓, documents (private + signed URLs) ✓, content pages (bylaws, beach house rules/donts/contacts) ✓, beach house calendar with request→approve flow ✓, prime list management ✓.

**Phase 2 (next):** Email notifications via Resend, booking-window enforcement, per-member booking limits, auto-mark "completed" for past weeks, public marketing pages, guest portal, membership inquiry form.

**Phase 3:** Stripe payments (deposits + balances + dues), events with RSVP, photo galleries, message center, financial reporting, admin role split (Treasurer / Secretary / VP Membership scopes).

## Outstanding Questions for Board

- Real annual dues amounts (currently seeded as $250 R / $200 C / $0 HC from observed data — confirm)
- Whether Stripe fees absorbed or passed to members
- Email sender domain (Resend) — likely a `@executivehuntingclub.com` subdomain
- Tannie Shannon's email (currently NULL — she can't sign up until set)
- Existing data migration from Wix (past events, photos, anything else)
- Should the AVP Beach House (Jeremy Williams) also have admin access during Troy's absences? Currently no.

## Source PDFs (in Google Drive: `g:/My Drive/EHC Documents/`)

These were the canonical inputs and may be re-parsed if the seeded data drifts. Drop into `_docs_source/` (gitignored) when needed.

- `Membership Directory 2.13.26.pdf` — drives `members`
- `Board of Directors 2026.pdf` — drives `board_role` columns
- `Prime Time List 2026.pdf` — drives `is_prime_list`
- `EHC House Calender 2026.pdf` / `2027.pdf` — drives historical reservations
- `ByLaws_EHC.pdf`, `EHC BEACH HOUSE RULES_7-8-25.pdf`, `beach house do and dont_2-6-26.pdf`, `Contact Information for Beach House_7-8-25.pdf` — drive content_pages
- `Articles of Incorporation EHC.pdf`, `2022_EHC_Form990-EZ_final return.pdf`, `2024 Form 990T tax _final.pdf`, `Financial Statements 2023.pdf`, `Financial Statements 2024_BW.pdf`, `financial-stmts-ending-2025.pdf` — uploaded to documents bucket
