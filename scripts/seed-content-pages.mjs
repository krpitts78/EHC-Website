// One-shot: seed the 4 narrative content pages converted from EHC PDFs.
// Run: node scripts/seed-content-pages.mjs
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

async function loadEnv() {
  const env = {};
  const txt = await readFile(".env.local", "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const PAGES = [
  {
    slug: "bylaws",
    title: "Bylaws",
    body_markdown: `*Bylaws of the Executive Hunting Club of Houston, Texas*

## Article I — Members

**Section 1.** Charter members of The Executive Hunting Club are those members which participated in the organized hunting trip to Laredo, Texas in September of 1973, paid their 1974 Executive Hunting Club dues during the first calendar quarter of 1974, and, generally were instrumental in the formation and structure of The Executive Hunting Club. All members, including Charter Members, shall have the same rights and obligations except as to annual dues and as noted in Section 4 of Article 1.

**Section 2.** Any adult individual shall be eligible for membership, provided that such adult shall be proposed by one member and seconded by another member of The Executive Hunting Club (hereinafter referred to as EHC). A proposal for membership, signed by the sponsor and cosponsor, shall be sent to the Secretary of the Board of Trustees. The Secretary shall present the proposed member for confirmation by the Board of Trustees at the next board meeting. A proposed member may receive tentative approval of membership from the Executive Committee, subject to formal confirmation by the Board of Trustees. A two-thirds vote of the Board of Trustees shall elect to membership. A person so elected shall be declared a member of The Executive Hunting Club upon payment of the initiation fee, if any, and the annual dues for the first year.

**Section 3.** The initiation fee shall be set by the Board of Trustees (hereinafter referred to as the Board) subject to approval by the membership at large. Effective January 1, 1994, the annual dues shall be set by the Board of Trustees with Charter members' dues set a rate fifty dollars below the rate for non-Charter members. Dues are payable on or before January 15 of each year. A member shall be assessed a late payment penalty of ten dollars if dues are not received by January 15. Membership status shall be automatically terminated if dues are not received by February 15. *(as amended 12/30/80, 11/15/93 and 3/31/02)*

**Section 4.** Upon the signed recommendation of one member, seconded by another member, and by a three-fourths vote by ballot, honorary life membership can be conferred upon an adult who shall have rendered notable service to The Executive Hunting Club. Balloting shall take place either by mail or at a scheduled meeting of the members. An honorary member shall have none of the obligations of membership in The EHC but shall be entitled to all of the privileges of membership except those of making motions, of voting, and of holding office.

**Section 5.** A proposal to revoke a membership shall be placed before the membership for voting when a written petition stating the reasons for the proposal and bearing the signatures of twenty-five percent of The EHC membership or of seven Board members is presented to the President of the Board. The President shall promptly notify a member whose membership status is being proposed for revocation and all Board members of the proposal and set a date within thirty days for a special Board meeting. The Board, at its special meeting will review the petition, determine the facts to the degree possible and make a recommendation on the proposal to the membership at large. The President of the Board shall direct the Balloting Committee to carry out a vote of the members within sixty days. Revocation of a membership shall occur upon a two-thirds vote.

**Section 6.** A member, unless suspended, shall be entitled to participate in all EHC activities. Such a member shall be entitled to use or benefit from any or all EHC vehicles, equipment, leases or such other benefits as may be available subject to guidelines established by the Board of Trustees. A member may challenge any Board policy or decision by presenting to the President a written petition stating the policy or decision objected to and bearing the signatures of twenty-five percent of the members. Upon verification of the petition by the Board at its next meeting, the President shall direct the Balloting Committee to carry out a balloting of members to either affirm or reject the Board's decision or policy.

**Section 7.** A member's resignation and/or termination for cause shall irrevocably invalidate any former member's claim to any and all EHC assets.

## Article II — Board of Trustees

**Section 1.** Ten elected members and the immediate past president of the Board shall constitute the Board of Trustees and serve as the officers of The Executive Hunting Club. The Board shall perform the duties prescribed by these bylaws and by the parliamentary authority adopted by The EHC. The Board of Trustees shall have general supervision of the affairs of The EHC between its business meetings, fix the date, hour and place of meetings and make recommendations to The EHC. The Board shall be subject to the orders of The EHC and none of its acts shall conflict with action taken by The Executive Hunting Club.

**Section 2.** The Board of Trustees shall set a date during October or November for the annual election of officers. The Board shall decide whether to have balloting by mail or to convene the members for the purpose of elections. The President of the Board shall appoint a Nominating Committee of five members, at least two of which shall not be serving on the Board. It shall be the duty of this committee to nominate a candidate for each office to be filled. The Nominating Committee shall report to the members at least sixty days prior to the election date if balloting is to be by mail or thirty days prior to the election date if balloting is to be a convention. A member is entitled to two nominations for officers. If balloting is to be by mail, written and signed nominations shall be sent to the Balloting Committee not later than thirty days prior to the election date. If balloting is to be at a convention, nominations shall be taken from the floor. Election to the Board shall be by plurality vote if balloting is by mail and by majority vote if balloting is at a convention.

**Section 3.** The officers shall be elected by ballot to serve for two years, except as noted below, or until their successors are elected. Terms of office shall begin on the first calendar day of the year and shall be staggered so as to effect the expiration of terms for five officers each year. The five members of the founding Board of Trustees with the lowest membership numbers, excluding the current President, shall be presented for reelection or replacement at the first general election for terms beginning January 1, 1977. The five remaining members of the founding Board shall be presented for reelection or replacement at the general election for terms beginning January 1, 1978.

**Section 4.** The Board of Trustees shall, at its first meeting of the calendar year, elect Board officers from among its members. The officers of the Board shall be a Chairman, who shall be the immediate past President, a President, a Vice President(s), and a Secretary-Treasurer. A Vice President shall, if possible, be elected from each metropolitan area comprising twenty percent of the membership at large.

**Section 5.** The Executive Committee consisting of the President and two other Board members appointed by the Board shall conduct the business of the Board during the intervals between Board meetings. The Executive Committee shall meet as necessary to conduct the business of the Board.

**Section 6.** In the event a member of the Board tenders his resignation, the Board shall appoint another member to complete the unexpired portion of the former Board member's term. If the resigning member is an officer of the Board, the Board shall declare the office vacant and hold an election to fill the vacancy.

**Section 7.** Meetings of the Board shall be held as deemed necessary by the Board. Special meetings of the Board can be called by the President and shall be called upon the written request of three members of the Board. The presence of six members of the Board shall constitute a quorum.

## Article III — Committees

**Section 1.** An Auditing Committee of three members shall be appointed by the President at the first regular meeting of the calendar year, whose duty it shall be to audit the Treasurer's accounts at the close of the fiscal year and to report to The Executive Hunting Club.

**Section 2.** A Balloting Committee of three members, at least one of which shall not be serving on the Board, shall be appointed by the President at the first meeting of the calendar year, whose duty it shall be to effect the voting of EHC members as prescribed by these bylaws and as directed by the Board. The Balloting Committee shall not allow a suspended member to vote.

**Section 3.** Such other committees, standing or special, shall be appointed by the President as The EHC or the Board of Trustees shall from time to time deem necessary to carry on the work of The EHC. The President shall be ex-officio a member of all committees except the Nominating Committee.

## Article IV — Parliamentary Authority

The rules contained in the current edition of *Robert's Rules of Order Newly Revised* shall govern The Executive Hunting Club in all cases to which they are applicable and in which they are not inconsistent with these bylaws and any special rules of order The EHC may adopt.

## Article V — Amendment of Bylaws

These bylaws can be amended by a two-thirds vote. A proposed amendment shall be placed before The EHC members for voting when a written petition stating the proposed amendment and bearing the signatures of twenty-five percent of the members or of six Board members is presented to the President of the Board. Upon verification of a properly presented petition, the Board shall direct the Balloting Committee to carry out a vote of the members.

## Article VI — Guest Privileges

**Section 1.** Any member may invite guests to participate in any EHC activity designated by the Board as open to guests. A member under suspension may not participate as a guest. A member shall be held accountable to the Board and to the EHC for the conduct and cost of his guest(s). Guests shall not participate in any EHC activity or otherwise benefit from the EHC unless accompanied by the inviting member. In the event of space limitations, members shall have preference over guests up to a cut-off date specified by the Board.

**Section 2.** The cost of a guest participating in any activity organized and sponsored for the benefit of all EHC members shall be equal to a member's cost and shall be borne by The EHC member. The Board of Trustees shall have authority to regulate all other aspects of guest activities. *(As amended October 4, 1976)*

## Article VII — Dissolution of the Club

**Section 1.** Dissolution of the EHC can be effected by a three-fourths vote. A proposal for dissolution of The EHC shall be placed before The EHC members for voting when a written petition for dissolution bearing the signatures of twenty-five percent of the members or of six Board members is presented to the President of the Board. Upon verification of a properly presented petition, the Board shall direct the Balloting Committee to carry out a vote of the members.

**Section 2.** Each member shall receive one "member-year" for every consecutive year that he pays dues for so long as he remains a member. Once a member resigns or is terminated or suspended from The EHC, he loses any member-years he has accumulated.

**Section 3.** Upon a then current member's death, he may bequeath or transfer his member-years to another member or prospective member. In the case of a bequest or transfer to a prospective member only, the Board of Trustees may approve or disapprove any such prospective member pursuant to Article I, Section 2 of these bylaws. In the event the Board of Trustees disapproves the prospective member for membership, the member-years that are the subject of the proposed bequest or transfer shall revert to The EHC.

**Section 4.** Upon dissolution of The EHC, after the liquidation of non-cash assets by the Board of Trustees, and after all liabilities and obligations of The EHC have been paid, satisfied, and discharged, each then current member of The EHC shall receive his share of EHC assets by the following formula. Each current member shall be entitled to receive a share of The EHC's remaining assets in direct proportion that his total member-years shall bear to the cumulative total member-years of the then current membership at large. This provision shall be reformed to effectuate The EHC's goals as expressed herein, if possible (or set aside if reformation is not possible) to the extent this provision violates the procedures for dissolution established by the laws of the State of Texas. *(As amended March 24, 2003)*
`,
  },
  {
    slug: "beach-house-rules",
    title: "Beach House Rules",
    body_markdown: `*Effective July 8, 2025*

## General Information

The Executive Hunting Club's beach house is the sole property of the Executive Hunting Club (EHC), which pays for its maintenance and repairs, insurance, and taxes. Only EHC members can rent the beach house and they are solely responsible for the actions of themselves and their guests during their stay at the beach house. The EHC Board of Trustees is responsible for holding members responsible for the actions of the members and their guests while staying at the beach house.

## Reserving the Beach House

All reservations begin on Friday at **4:00 p.m.** and conclude on the following Friday at **12:00 p.m.**

- **Prime-time** is from the Friday before the first full week in May through the Friday after Labor Day.
- **Non-Prime-time** is the period outside of Prime-time.

Prime-time reservations can only be made by EHC members who have attended at least one scheduled EHC event (Fall/Spring) during the 12 months preceding the last Spring Trip. EHC members on the Prime-time list are eligible to make one reservation during Prime-time and one during Non-Prime-time. EHC members not on the Prime-time list are eligible to make one reservation during Non-Prime-time.

Reservations can be made starting at **6:00 a.m. one year prior** to the desired reservation date. Reservations may be made by emailing **Troy Smith, House Vice-President**, at [troy@tlsinc-tx.com](mailto:troy@tlsinc-tx.com). The first email received at this address on or after 6:00 a.m. one year prior to the reservation date will receive the reservation.

The House Vice-President is responsible for achieving the maximum number of rental dates at the house and will periodically notify the members of dates when the reservation requirements will be waived in order to achieve the maximum rental dates. This is done to try to help cover the costs associated with operating the beach house.

## Rental Rates

| Period | Weekly Rate |
|---|---|
| Prime-time | **$1,000** |
| Non-Prime-time | **$600** |

Within 2 weeks of making a reservation, a **$100 deposit** should be sent by Zelle to **executivehuntingclub@gmail.com** or by check made payable to EHC to the House Vice-President, Troy Smith, at 11340 Neeshaw Dr., Houston, TX 77065. The remainder of the rental is due **4 weeks prior** to the reservation period.

## Cancellation of Reservations

Reservations may be cancelled up to 4 weeks prior to the reservation period by notifying the House Vice-President. Members are responsible for paying the rental fee for cancellations less than 4 weeks prior to the reservation period. The House Vice-President will assist the member in finding another member who may be willing to rent the beach house by notifying the membership of the cancellation.

## Arriving at the Beach House

Do not arrive for your stay at the beach house before 4:00pm or depart after your scheduled reservation period unless you have made arrangements with the House Vice-President to do so. Upon arriving at the house, also remember that **THERE IS NO SMOKING INSIDE OF THE HOUSE.**

When you arrive at the beach house, check that the house is in the condition expected, and that you have a good supply of coffee, toilet paper, trash bags, and other basic items which the last member is responsible for leaving. On your walk through, please note any damages, repairs, issues, or lack of inventory and take a few minutes to text or call **Troy Smith** or **Scott Greenlee, VP-Maintenance**, with your results. This will help Scott keep up with maintenance and plan for work days to resolve issues.

If the house condition was left in such bad shape that you feel it needs immediate cleaning, please contact:

- Troy Smith — **(713) 248-6048**
- Scott Greenlee — **(713) 829-3801**

## Staying at the Beach House

**The elevator should be in the up position. The elevator should only be operated by adults and the gate should be closed at all times.**

To make any suggestions for improvements contact Troy Smith at 713-248-6048. To report any maintenance problems please contact Scott Greenlee at 713-829-3801. If something breaks while you are using the house, please take the appropriate action to make the repair. If you estimate the repair might exceed $100, please contact our VP-Maintenance Scott Greenlee at 713-829-3801.

As with your home (and this is our home) if anything needs repair or breaks while you are there, please fix it (let the VP-Maintenance know so he can see if it needs to be completely replaced or redone). If substantial (over $25), keep your receipts and send them to the VP-Maintenance to initiate a refund. Please replenish normal inventory items like light bulbs, coffee filters, toilet paper, paper towels, bath soap, and garbage bags at your own expense.

Make sure all trash is emptied and placed in the trash receptacles outside each Sunday and Wednesday evening. **Trash placed in the receptacles outside MUST be placed in plastic bags.** Otherwise these receptacles are very hard to empty and clean.

**Don't pour grease down the drain.**

Don't leave the charcoal grills dirty or used charcoal in the grills. A wire brush is located in the storage room.

### Housekeeping fee — $125

Each member who rents the beach house is responsible for paying the housekeeper $125 by leaving cash or check in the payment box attached to the wall in the kitchen / living room area, or paying the housekeeper directly with Venmo. If you require additional services, call the housekeeper to discuss and arrange additional payment.

The housekeeper's responsibilities are:

- Dust house and ceiling fans
- Sterilize and wipe down all bathrooms, toilets, showers, door knobs, cabinet knobs, door facings, light switches, and remotes
- Wipe down blinds, windows, and kitchen surfaces
- Mop all floors
- Change A/C filter when needed
- Check inside oven, microwave oven, refrigerator, and freezer for cleanliness and left-behind food, and report to VP House (any additional cleaning required may be an additional charge to the member)
- Check beds, closets, and dresser drawers for items left behind, and report to VP House so he can contact the previous member
- Determine whether there are any missing items such as sheets, pillows, blankets, towels, or remotes, and report to VP House

## Departing the Beach House

- **Do not leave food** in the refrigerators or freezer unless you have made arrangements with the member following your reservation and the housekeeper. For items you leave, it's helpful to date them.
- **Leave the elevator in the up position** — this is a safety issue.
- Make sure all the windows and doors are closed and locked.
- Wash and put away all linens, sheets, rugs, blankets, dishes, towels, etc. that were used during your reservation. Members are responsible for cleaning the inside of the oven, microwave, refrigerator, and freezer before leaving for the next member coming in. Housekeeping only disinfects the outside surfaces and is not responsible for cleaning grease or spills inside appliances.
- **Do not use bath towels at the beach.** Use the older towels in the laundry rooms (upstairs and down) and wash all beach towels in the downstairs washer.
- You are responsible for any washing or cleaning not listed in the housekeeper's responsibilities above. If you don't want to do these things, either don't rent the beach house or find someone to do them for you. You still need to vacate the house by **noon on Friday**.
- **Do not leave the house with any appliances operating** (dishwasher, washer, dryer). This is a fire hazard.
- Floors should be swept and all trash placed in bags in the garbage receptacle outside.
- **Everything downstairs is the member's responsibility to clean** including the downstairs bathroom. The Housekeeper does not have any responsibilities downstairs. A blower is provided for the downstairs.
- If you store fish bait in the refrigerator, please clean out and make sure the stains and smell are neutralized. Same goes for propane — replace and keep full.
- Set the thermostat to **A/C 78°F or Heat 60°F**, turn off all lights, close all blinds, and lock all doors and windows. Tar stains on the floors can be removed with Simple Green; tar on skin can be removed with baby oil.

## Member / Owner Responsibility

We have a nice, well-maintained house that we work to update each year and that everyone can be proud of. Please treat it as your own (it actually is) and leave it in better shape than you found it.

We each have the personal responsibility to maintain the house as if it was our own — including responsible behavior from guests, other adults, children, grandchildren, and pets. **Each member renting the beach house is responsible for reimbursement of any direct costs associated with cleaning, repairs, or replacement of any items damaged or broken** by the member or member's guests during the rental period.

Our desire is to maintain the house in this condition so that the next member bringing his family can enjoy this great facility as the member before him did. Have a great week, and please preach water safety to your guests.

## Maintaining the Beach House

The EHC Board of Trustees has designated the **VP-Maintenance** as the primary authority to maintain the beach house. All members and their guests who use the beach house are required to assist the VP-Maintenance in this responsibility. This includes allowing access to the VP-Maintenance and his designated repair representatives to remediate maintenance issues. **Maintenance personnel must be allowed access to the house.**

> Beach house contact information (utility accounts, contractors, housekeeper) is on the [Beach House Contacts](/dashboard/p/beach-house-contacts) page.
`,
  },
  {
    slug: "beach-house-dos-donts",
    title: "Beach House Do's and Don'ts",
    body_markdown: `*Effective February 6, 2026*

## Do's

1. Upon arriving at the house, do a walk-through to see if you notice any issues that need to be reported to the VP House.
2. Keep the elevator in the up position and gate closed — this is a safety issue.
3. Make sure all the windows and doors are closed and locked.
4. Make minor repairs on the house.
5. Report major repairs needed to the VP Maintenance.
6. Put all trash in plastic bags and place in trash receptacles outside.
7. Wash and put away all linens, sheets, rugs, blankets, dishes, towels, etc.
8. Clean the inside of the oven, microwave, refrigerator, and freezer before you leave for the next member coming in.
9. Sweep all floors before you leave the house for the next member.
10. Clean downstairs including the bathroom before you leave the house.
11. Before you leave the house, set the thermostat on appropriate temperature, turn off all lights, close all blinds, and lock all doors and windows.
12. Allow access inside the house to the VP-Maintenance and his designated repair representatives in order to remediate any maintenance issues.
13. Unattended dogs must be crated.
14. Check A/C filters and replace as needed (located in west bedroom closet).

## Don'ts

1. Don't arrive for your stay at the beach house before 4:00 PM.
2. **Don't smoke inside the house.**
3. Don't leave food in the refrigerators or freezer unless you have made arrangements with the member following your reservation and the housekeeper.
4. **Don't pour grease down the drain.**
5. Don't take bath towels to the beach.
6. Don't leave the house with any appliances operating.
`,
  },
  {
    slug: "beach-house-contacts",
    title: "Beach House Contact Information",
    body_markdown: `*Effective July 8, 2025. EHC Tax ID #: 74-1854841*

## Utilities

**Electricity — Entergy**
- Phone: 1-800-368-3749
- Account #: 139778930
- Telephone on file: 713-937-6403 (Don Guyton's home)

**Water — Bolivar Peninsula S.U.D.**
- Phone: 409-684-3515
- Account # (main water line): 09023-91000438000
- Account # (sprinkler system): 09023-1000646400
- Call the water company if a water line is broken or leaking before reaching our meter.

**Sewer — Undine TX Environmental (30)**
- Phone: 888-201-4314
- Account #: 79030-1000438000

> If you see backup in the downstairs toilet, check the sewer pump alarm located on the west side of the garage. If it is flashing **RED** or sewerage is not moving as it should, call:
> - **Lange's Septic Service** (Michael — Bolivar): 409-791-4131
> - **AMI Services** (Greg Holt): 281-924-1621 — 2506 Brutus Dr., New Caney, TX 77357
> - Sewer spill clean-up emergencies: **713-828-5477**

**Internet — Southern Broadband LLC** (Crystal Beach TX 77650)
- Phone: 409-684-7021
- User name: dguyton@uh.edu
- Telephone on file: 713-725-3990 (Don Guyton's cell)
- **WiFi password:** \`tropicana2940\`

**Satellite TV — Direct TV**
- Account holder: Kelly Pitts
- Account #: 6972349
- Phone: 800-531-5000

**Garbage — Frontier Waste Solutions**
- Phone: 409-684-1925

## Services & Vendors

**Housekeeper — Kimberly Isaacks**
- Phone: 409-519-6805

**Lawn Service — Mike Hambleton (Greenlife Nursery)**
- Phone: 409-454-4701

**Air Conditioner — Hughston Air Conditioning**
- 1813 Front Ave, Crystal Beach, TX 77650
- Phone: 512-924-3064
- Email: [hughstonac@gmail.com](mailto:hughstonac@gmail.com)

**Elevator Lift Service — Easy Lift (Anthony, on Bolivar)**
- Work: 409-684-6110
- Cell: 936-635-0656

**Electrician — Justin Kuhnert (Riptide Electric)**
- P.O. Box 1432, Bolivar Peninsula, TX 77650
- Cell: 409-750-2344
- Office: 409-261-7581
- Email: [riptide.electric.409@gmail.com](mailto:riptide.electric.409@gmail.com)
`,
  },
];

async function main() {
  const env = await loadEnv();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  for (const page of PAGES) {
    process.stdout.write(`Upserting ${page.slug}... `);
    const { error } = await supabase
      .from("content_pages")
      .upsert(page, { onConflict: "slug" });
    console.log(error ? `FAILED: ${error.message}` : "OK");
  }

  const { data } = await supabase
    .from("content_pages")
    .select("slug, title, length(body_markdown)")
    .order("slug");
  console.log("\nContent pages:");
  for (const p of data ?? []) console.log(`  ${p.slug}: ${p.title}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
