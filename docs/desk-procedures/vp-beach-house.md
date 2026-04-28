# VP Beach House — Desk Procedures

**Role:** `members.board_role = 'vp_beach_house'` (or `is_admin = true`)
**Scope:** Operational owner of the beach house at 2940 Tropicana Dr, Bolivar Peninsula. Approves and tracks all reservations, manages the prime-time list, collects deposits and balances, and handles cancellations.

---

## Rates & rules (quick reference)

| Item | Amount | Notes |
|---|---|---|
| Prime week | **$1,000** | Friday before first full week of May → Friday after Labor Day |
| Non-prime week | **$600** | All other weeks |
| Cleaning fee | **$125** | Paid directly to housekeeper |
| Deposit | **$100** | Due within 14 days of confirmation |
| Balance | rate − deposit | Due 4 weeks before stay |

**Booking window:** opens at **6:00 AM Central, exactly one year before** the start Friday.
**Week shape:** Friday 4 PM check-in → next Friday 12 PM check-out.
**Per-year limits (members):** prime-list members get 1 prime + 1 non-prime; everyone else gets 1 non-prime. (Admin path bypasses these — use sparingly.)

Full rules are in the **Beach House Rules** content page (`/dashboard/p/beach-house-rules`) — that page is canonical and editable by board members.

---

## Routine tasks

### Reviewing pending requests
1. Go to **`/dashboard/admin/reservations`**.
2. The **Pending requests** section is at the top. Each card shows: week, member, prime/non-prime, total cost, optional notes from the member.
3. **Approve** → status flips to `confirmed`, `confirmed_at` is stamped, member sees it on `/dashboard/beach-house/my-reservations`. The week is now blocked on the calendar.
4. **Reject** → status flips to `cancelled` with your optional reason in `notes`. Member sees the cancellation.

There is currently no email notification — you must follow up by phone/email yourself. (Email via Resend is on the Phase 2 list.)

### Tracking deposits and balances
On the **Confirmed** section of the admin page, every card has two toggles:

- **Mark deposit paid / unmark** — sets/clears `deposit_paid_at`.
- **Mark balance paid / unmark** — sets/clears `balance_paid_at`.

The **Deposit overdue** banner at the top of the page lists every confirmed booking where the deposit hasn't been recorded and the confirmation is more than **14 days old**. Use it as your call list.

### Creating a reservation on behalf of a member
1. **`/dashboard/admin/reservations/new`**
2. Pick the member (or leave blank for blocks/events).
3. Pick **Kind**: `rental` (Friday-to-Friday weekly rental), `block` (house unavailable — repairs, weather, etc.), `event` (club event spanning multiple days).
4. Set **Start date** (Friday for rentals; any date for blocks/events) and **End date**.
5. Status defaults to **Confirmed** so you skip the request flow. Pre-mark deposit/balance if already collected.
6. Save.

**This path bypasses per-year limits and the prime-list gate.** Use it when a member calls in, for board events, comp weeks, or retroactive entries — but document the reason in **Notes**.

### Editing a reservation
- Every card on the admin page has an **Edit** button.
- You can change member, dates, kind, status, rate, fees, payment timestamps, and notes.
- Use this to correct entry errors, move a week if the house has a conflict, or convert a `block` to a `rental` after the fact.

### Cancelling a confirmed booking
- Click **Cancel** on the confirmed card. The row moves to **Past / cancelled** with `cancelled_at` stamped.
- The **Late cancellation** flag (red badge) appears automatically if the cancel happened within 28 days of the stay — that means the member is liable for the full rental fee per the rules. Follow up.

### Managing the prime-time list
- **`/dashboard/admin/prime-list`**
- Toggle members on/off. Only `is_prime_list = true` members can request prime weeks through the member-facing form.
- The list is reset annually based on the prior season's usage; refer to the Beach House Rules for the policy.

---

## Calendar at a glance

`/dashboard/beach-house/calendar` — 52-week year grid. Stars (★) mark prime weeks. Color codes:

- **Green** — confirmed rental
- **Amber** — pending request
- **Grey** — block (house unavailable)
- **Burnt orange** — club event
- **Empty** — available

Members see the same view but can click empty weeks to start a request.

---

## Common scenarios

**Member emails: "Can I switch my week from June 12 to June 19?"**
→ Open the reservation in admin reservations, click Edit, change Start/End dates, save. Add a note: "Switched from 6/12 at member's request 2026-04-28."

**Member emails: "I need to cancel — family emergency."**
→ Cancel from admin page. If the cancel is within 28 days of the stay, the system flags it as a late cancellation. Use board discretion on whether to enforce the full-rental-fee rule per bylaws.

**A repair contractor needs the house for 3 days.**
→ New reservation, Kind = `block`, no member, status = `confirmed`, dates = the 3 days. Note: "HVAC repair — Smith Plumbing."

**Two members are arguing about the same week.**
→ The DB has a partial unique index that enforces only one rental request/confirmation per Friday. Whoever's row was inserted first wins. Use Edit to change the week if you need to swap them at board discretion, then add notes to both rows.

**A member is on the prime list but their request shows non-prime rate.**
→ The system computes prime status from the date, not the member. The rate is correct; prime-list status only controls *eligibility* to request a prime week.

---

## Escalation

| Problem | Who |
|---|---|
| Member dispute / bylaws interpretation | President |
| Bylaws change | VP Legal |
| Member can't sign up to portal | Site Admin |
| Site bug or data correction | Site Admin |
| Housekeeping / contractor coordination | (as currently arranged outside the portal) |

---

## Reference

- Beach House Rules: `/dashboard/p/beach-house-rules`
- Do's and Don'ts: `/dashboard/p/beach-house-dos-donts`
- Contacts (housekeeper, neighbors, utilities): `/dashboard/p/beach-house-contacts`
- Payment Instructions: `/dashboard/p/payment-instructions`
- Admin reservation page: `/dashboard/admin/reservations`
- Prime list page: `/dashboard/admin/prime-list`
- Helpers in code: `src/lib/beach-house.ts` (rates, prime window, week math)
