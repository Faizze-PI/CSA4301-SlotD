# Experiment 04: Online Train Reservation System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, develop, and evaluate an online railway reservation portal featuring train lookup with intermediate stations, tiered travel class booking (1A, 2A, 3A, SL), real-time PNR berth allocation (Confirmed, RAC, Waiting List), digital e-ticket printing, and cancellation refund disbursement.

---

## 2. System Architecture & Components
1. **Passenger Portal:**
   - Multi-station route search with intermediate via-stops.
   - Interactive class selection and berth preference (Lower, Middle, Upper, Side Lower).
   - 10-digit PNR enquiry lookup system.
   - Electronic Reservation Slip (ERS) print utility.
2. **Railway Administrator Portal:**
   - Zone and class fare rule management.
   - Train schedule creation with intermediate stoppages.
   - Refund queue management where the admin verifies cancellation percentages and disburses refunds to passengers.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `rail_trains`, `rail_bookings`.

---

## 3. Algorithm & Logic Flow
1. **Berth Allocation Logic (Confirmed / RAC / WL):**
   - For requested seats $K$:
     - If $\text{Available} \ge K \implies \text{Status} = \text{"Confirmed (CNF)"}$; $\text{Available} = \text{Available} - K$.
     - Else if $\text{RAC} \ge K \implies \text{Status} = \text{"RAC (RAC-" + quota + ")"}$; $\text{RAC} = \text{RAC} - K$.
     - Else $\implies \text{Status} = \text{"Waiting List (WL-" + (\text{WL} + K) + ")"}$; $\text{WL} = \text{WL} + K$.
2. **PNR Generation:**
   - Generate pseudo-random 10-digit numerical token:
     $$\text{PNR} = \lfloor 10^9 + \text{rand}() \times 9 \times 10^9 \rfloor$$
3. **Refund Calculation:**
   $$\text{Refund Amount} = \text{Total Fare} \times \frac{\text{Refund Percentage}}{100}$$
   - Scheduled $> 48\text{ hrs}$: 75% refund.
   - $12\text{ to }48\text{ hrs}$: 50% refund.
   - $< 12\text{ hrs}$: 25% refund.

---

## 4. Input & Output Specifications
- **Input:** Origin code (`MAS`), Destination code (`SBC`), Journey date, Travel class (`3A`), Passenger names & ages.
- **Output:** Dynamic 10-digit PNR ticket, real-time status inquiry modal, print-ready ERS slip.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: What is the significance of RAC and Waiting List in railway reservation logic?**
   - **A:** Confirmed grants an assigned berth. RAC (Reservation Against Cancellation) guarantees a seat on board with probability of getting upgraded to a berth when cancellations occur. Waiting List does not permit boarding unless upgraded before chart preparation.
2. **Q: How does the ticket printing system isolate the ticket content from the web page chrome?**
   - **A:** By opening a detached print window via `window.open()`, writing standalone semantic HTML with custom print styles, and executing `printWin.print()`.
