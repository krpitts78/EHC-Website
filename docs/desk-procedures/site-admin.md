# Site Admin — Desk Procedures

**Role:** `members.is_admin = true`
**Scope:** Full operational control of the EHC member portal. Site admins are the technical owners — they keep data correct, accounts working, and content current. They are *not* a board role; the site-admin flag is independent of `board_role`.

---

## What you can do

| Capability | Location |
|---|---|
| Edit any member record | `/dashboard/directory` → member → Edit |
| Upload, replace, delete documents | `/dashboard/documents` and `/dashboard/documents/upload` |
| Edit content pages (Bylaws, Beach House Rules, Do's/Don'ts, Contacts, Payment Instructions) | `/dashboard/p/<slug>` → Edit |
| Approve, reject, edit, create beach-house reservations | `/dashboard/admin/reservations` |
| Manage the prime-time list | `/dashboard/admin/prime-list` |
| Toggle `is_admin` / set `board_role` on other members | Member edit page |

VP Beach House also has reservation + prime-list rights. Everything else above is admin-only.

---

## Routine tasks

### Onboarding a new member to the portal
1. Confirm the member's row exists in `members` and has a working email. If not, add it from the directory page.
2. Tell the member to visit **`/signup`** and use the email exactly as it appears on file.
3. They receive a confirmation email from Supabase, click the link, and land on `/dashboard`.
4. The Postgres trigger automatically links their `auth.users` record to the `members` row. No manual linking needed.

**If signup says "email not eligible":** the email isn't in `members`, or it's already claimed (`claimed_at IS NOT NULL`). Check the directory.

### Resetting a member's access
- They forgot their password → direct them to **`/login`** and use the "forgot password" flow.
- They lost the email account → update the member's email in the directory, then have them sign up again with the new email. Old `auth.users` row should be deleted in Supabase Studio if it's blocking re-claim.

### Uploading a document
1. Go to `/dashboard/documents/upload`.
2. Pick category: `tax_returns | financial_statements | bylaws | articles | board_minutes | beach_house | other`.
3. Title it descriptively (members see this).
4. Upload — file lands in the private `documents` bucket; metadata row is written to the `documents` table.
5. Members get 60-second signed download URLs from `/dashboard/documents/[id]/download`.

### Editing a content page
- Bylaws, Beach House Rules, Do's/Don'ts, Contacts, Payment Instructions all live as Markdown in `content_pages`.
- Click **Edit** on the rendered page. Save. The DB is canonical — don't re-run `scripts/seed-content-pages.mjs` after edits.

### Adding a new admin
1. Find the member in the directory.
2. Click Edit.
3. Toggle `is_admin = true`. Save.
4. They now see the **Admin** strip in the portal nav on next page load.

---

## Things to watch

- **Tannie Shannon's email is `NULL`.** She can't sign up until the board gets her email and you update it.
- **Don't reseed.** `scripts/seed-*.mjs` files are first-run only. They will overwrite admin edits to content pages.
- **`SUPABASE_SERVICE_ROLE_KEY`** must NEVER be exposed in client code. If you see it imported in a `"use client"` file, that's a critical bug — file an issue.
- **RLS is the security boundary.** If a non-admin can see something they shouldn't, the fix is in the RLS policy, not in the UI.

---

## Escalation

| Problem | Who |
|---|---|
| Site is down / Vercel deploy failure | Kelly Pitts (site dev) |
| Domain / DNS / Vercel access | Kelly Pitts |
| Supabase project access | Kelly Pitts |
| Beach-house policy questions | VP Beach House (Troy) |
| Membership eligibility | VP Membership |
| Bylaws / legal | VP Legal / President |

---

## Reference

- Full architecture & schema: `claude.md` at repo root
- Roles & permissions table: `claude.md` § Roles & Permissions
- Permission helpers: `src/lib/permissions.ts`
- Supabase project: `cdyhxgsijrmbkubafbah` (us-west-2)
- Live site: <https://ehc-website-sigma.vercel.app>
- Repo: <https://github.com/krpitts78/EHC-Website>
