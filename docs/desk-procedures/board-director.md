# Board / Director — Desk Procedures

**Role:** `members.board_role` is set to one of `president`, `vp_legal`, `vp_membership`, `vp_secretary_treasurer`, `director` (with `board_role_label` for the specific assignment).
**Scope:** Governance and member-facing content. Board members maintain the directory, documents, and content pages but do **not** approve beach-house reservations (that's VP Beach House) or perform site-admin tech operations.

---

## What you can do

| Capability | Location |
|---|---|
| Read full directory, documents, content pages, reservations | Anywhere in `/dashboard/*` |
| Edit your own profile | `/dashboard/profile` |
| Edit any member's record | `/dashboard/directory` → member → Edit |
| Upload, replace, delete documents | `/dashboard/documents` and `/dashboard/documents/upload` |
| Edit content pages (Bylaws, Beach House Rules, Do's/Don'ts, Contacts, Payment Instructions) | `/dashboard/p/<slug>` → Edit |
| Request your own beach-house rental | `/dashboard/beach-house/calendar` |

**You cannot** approve/reject reservations, manage the prime-time list, or change `is_admin` / `board_role` flags. Those require VP Beach House or Site Admin.

---

## Routine tasks by role

### President
- Annual review: confirm board roster in members table is current. Update `board_role` and `board_role_label` for any changes via the directory edit screen.
- Bylaws amendments: edit `/dashboard/p/bylaws`. Save with summary in your edit notes (the page tracks `updated_by` and `updated_at`).
- Sign tax returns and financial documents — upload PDFs to `/dashboard/documents/upload` under category `tax_returns` or `financial_statements`.

### VP Legal
- Bylaws ownership: keep `/dashboard/p/bylaws` current. Source PDF lives in Google Drive (`g:/My Drive/EHC Documents/ByLaws_EHC.pdf`); the portal page is the canonical version after edits.
- Articles of Incorporation: stored as a document under `articles` category; replace if amended.
- Corporate filings (Texas SOS): upload to `documents` under `other` with descriptive titles.

### VP Membership
- Add new members: `/dashboard/directory` → Add (or via a future bulk-import flow). Set `member_number` (`R-NNN-YY` / `C-NNN-YY` / `HC-NNN-YY`), `member_type`, contact info, dues amount.
- Mark members inactive when they leave: clear or annotate their entry per board policy.
- Annual dues tracking: `dues_amount_cents` per member. Payments are tracked manually until Stripe integration ships in Phase 3.
- The signup gate keys off `members.email` — every new member you add with an email becomes eligible for portal signup automatically.

### VP Secretary / Treasurer
- Board minutes: upload to `/dashboard/documents/upload` under `board_minutes` with title like "Board Minutes — 2026-04 Meeting".
- Financial statements: upload under `financial_statements`. The most recent year is what members typically read.
- Payment instructions for dues and beach-house fees: edit `/dashboard/p/payment-instructions`.

### Director (general / Spring Trip Coordinator / etc.)
- Maintain whatever scope your `board_role_label` describes.
- Spring Trip Coordinator example: upload event flyers and attendee rosters to `documents` under `other`. Use content pages for any standing event guides if needed (ask Site Admin to create a new slug).

---

## Editing a content page

1. Navigate to the page (e.g., `/dashboard/p/bylaws`).
2. Click **Edit**.
3. Edit the Markdown body. Common formatting:
   - `# Heading 1`, `## Heading 2`, `### Heading 3`
   - `**bold**`, `*italic*`
   - `- bullet` lists
   - `[link text](https://url)`
4. Save. The page renders via `marked` with Tailwind `prose` styling — no need to fight the layout.

The DB is canonical after the first save. Don't ask Site Admin to "reseed from the source PDF" without confirming you want your edits overwritten.

---

## Editing a member record

1. **`/dashboard/directory`** → click the member.
2. Edit any field: name, contact, address, dues, joined year, board role, prime list, admin flag.
3. Save.

**Be careful with:**
- `auth_user_id` and `claimed_at` — leave alone unless coordinating with Site Admin to fix a broken signup.
- `is_admin` — only set this for true site administrators (technical role).
- `board_role` — only set per board vote; the role determines portal permissions automatically.
- `email` — changing it after a member has claimed their account does NOT change their login email. They have to update that in `auth.users` (Site Admin can help).

---

## Uploading a document

1. **`/dashboard/documents/upload`**
2. Pick a category — this drives where it shows up in the documents list:
   - `tax_returns` — IRS filings (990, 990-T, etc.)
   - `financial_statements` — annual financials
   - `bylaws` — bylaws PDFs (the editable page is preferred)
   - `articles` — Articles of Incorporation
   - `board_minutes` — meeting minutes
   - `beach_house` — beach-house-related docs
   - `other` — anything else
3. Title clearly. Members see the title in the list.
4. Upload. The file lands in the private `documents` storage bucket; downloads use 60-second signed URLs so the file is never publicly hotlinkable.

To replace a document: upload the new version with the same/similar title, then delete the old one (you have delete permission as a board member).

---

## Common scenarios

**A member calls saying their phone number is wrong in the directory.**
→ Directory → click their name → Edit → update `phone_cell` (or whichever) → Save.

**The board voted to update Bylaws Section 4.**
→ `/dashboard/p/bylaws` → Edit → make the change → Save. The portal page is canonical; do NOT also edit the source PDF in Drive without coordinating, or the two will diverge.

**A new member joined at the spring meeting.**
→ Add them via the directory. Set `member_number`, contact info, dues. They can sign up at `/signup` as soon as their email is in the system.

**A member's email bounces / they say they never got the signup email.**
→ Confirm the email is correct. Then escalate to Site Admin — they can check Supabase auth logs and reset the `claimed_at` flag if needed.

**A member asks for last year's tax return.**
→ Direct them to `/dashboard/documents` and the `tax_returns` category. They can download it with a signed URL.

---

## Escalation

| Problem | Who |
|---|---|
| Beach-house reservation question | VP Beach House |
| Portal signup / login broken | Site Admin |
| Site outage or bug | Site Admin |
| Bylaws / legal interpretation | VP Legal / President |
| Membership status / dues | VP Membership / VP Secretary-Treasurer |

---

## Reference

- Roles & permissions table: `claude.md` § Roles & Permissions
- Member schema: `claude.md` § Database Schema → `members`
- Document categories: `claude.md` § Database Schema → `documents`
- Content pages: `claude.md` § Database Schema → `content_pages`
