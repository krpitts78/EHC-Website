# Executive Hunting Club Website

## Project Overview

Member portal and public website for the Executive Hunting Club, a Texas non-profit hunting and fishing club founded August 11, 1975 (Charter No. 366138). Replaces the current Wix site at executivehuntingclub.com.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (auth, database, storage)
- **Payments:** Stripe (cards + ACH for dues, reservations, events)
- **Email:** Resend (sender domain TBD — likely a subdomain or new domain)
- **Hosting:** Railway or Vercel
- **Repo:** github.com/krpitts78/ehc-website

## Design Reference

The visual prototype lives at `/docs/prototype/prototype.tsx`. Use it as the source of truth for layout, color usage, and component structure. The actual logo PNG is at `/public/logo.png`.

## Brand Colors (Official UT Austin Palette)

The site owner is a UT graduate; the design uses official UT colors.

| Color | Hex | Use |
|-------|-----|-----|
| Burnt Orange | `#BF5700` | Primary CTAs, links, accents |
| White | `#FFFFFF` | Surface |
| Charcoal | `#333F48` | Headings, dark sections |
| Dark Charcoal | `#1a2128` | Hero, footer, deep dark sections |
| Light Orange | `#F8971F` | Accent only — NEVER as text on light bg (fails contrast) |
| Cream/Tan | `#D6D2C4` | Header background, card borders |
| Yellow | `#FFD600` | Accent text on dark backgrounds (high contrast) |

**Critical contrast rule:** never use `#F8971F` as text color on white/cream backgrounds. Use `#BF5700` or `#7a3500` instead.

## Site Structure

### Public (no auth)
- Home / landing page
- Guests page (limited info for non-members)
- Membership inquiry form

### Member Portal (auth required)
- Dashboard
- Membership (directory, board, waiting list, new member info)
- Beach House (calendar, reservations, prime time list, rules, photo gallery, directions)
- Events (upcoming + past, RSVP, payment)
- Documents (founding docs, bylaws, financials, board minutes)
- Payments (dues, reservations, event fees, transaction history)
- Message Center (announcements + member discussions)
- Links

### Admin Panel (board members)
- Manage members, approve waitlist
- Post announcements/events
- Upload documents
- Manage beach house calendar and prime time list
- View transactions, mark manual payments paid
- Send payment reminders
- Export financial reports

## Beach House

Located at **2940 Tropicana Dr, Ramada Beach Subdivision, Bolivar Peninsula** (~13 miles past the Galveston Ferry on Hwy 87).

Rates (placeholders — confirm with board):
- Off-season night: $150
- Peak night: $225
- Prime time week: $1,800
- Cleaning fee: $125

## Key Decisions

- **Auth:** Supabase email/password to start. Add SSO later if needed.
- **Order/reservation IDs:** Use Supabase auto-generated UUIDs; surface a human-readable booking number like `BH-2026-0042`.
- **Timezone:** America/Chicago (Houston-based club).
- **Payments are read-only after Stripe processes them** — admin can mark manual (check) payments paid but can't modify Stripe records.
- **Receipt emails** sent via Resend on every successful payment.
- **Prime time list** is a separately-managed list — only certain members can book those weeks.

## Easter Eggs (UT)

- Type `texas` anywhere on the dashboard → full-screen "HOOK 'EM!" flash
- Triple-click the EHC logo in sidebar → reveals 🤘 next to member name + "UT '##" badge if applicable
- Tiny 🤘 in the public footer next to the charter number
- Hidden Longhorn silhouette watermark in dashboard corner (~6% opacity)

Keep these subtle and tasteful — the club site is brown/red/orange-themed and UT touches are accents only.

## Conventions

- File paths with `[id]` brackets: use `-LiteralPath` in PowerShell.
- Large JSX files: write via Python script, not PowerShell heredoc.
- Deeply nested Supabase queries: use the two-step pattern (fetch IDs, then fetch related rows).
- TypeScript: use `Array.from(new Set(...))` instead of spread on Set for compatibility.

## Phase Plan

**Phase 1 (MVP):** Auth, member directory, beach house reservations, message center
**Phase 2:** Documents, events with RSVP, photo galleries, Stripe integration (dues + reservations)
**Phase 3:** Admin panel polish, public marketing pages, guest portal, trip/event payments, financial reporting

## Outstanding Questions for Board

Before going live, confirm:
- Real dues amounts and billing schedule
- Real beach house rates (off-season / peak / prime time)
- Who manages the waiting list
- Admin access list (who's on the board)
- Whether Stripe fees are absorbed or passed to members
- Email domain preference
- Existing data migration from Wix (member list, past events, documents)
