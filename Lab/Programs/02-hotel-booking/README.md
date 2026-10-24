# Experiment 02: Online Hotel Room Booking Website
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design and build an online hotel reservation system supporting multi-tier room browsing, availability verification, booking management, policy enforcement (3-day cancellation/modification cutoff), and administrator inventory & CMS content management.

---

## 2. System Architecture & Components
1. **User Client View:**
   - Date range availability search.
   - 4-Tier Room showcase with amenities and dynamic rates.
   - Personal booking history with policy-enforced modification/cancellation controls.
   - Static informational views (About, Room Info, Contact, Q&A, Travel Guide, Privacy Policy).
2. **Administrator View:**
   - Quantity & price management for all 4 room categories.
   - Master booking controls (ability to cancel or edit any booking).
   - Real-time CMS editor for static site pages.
3. **Storage & State:**
   - Relational browser collections for `hotel_rooms`, `hotel_bookings`, and `hotel_cms`.

---

## 3. Algorithm & Policy Logic Flow
1. **Room Booking & Cost Calculation:**
   $$\text{Nights} = \max\left(1, \frac{\text{CheckOut} - \text{CheckIn}}{86{,}400{,}000}\right)$$
   $$\text{Total Cost} = \text{Room Price} \times \text{Nights}$$
2. **3-Day Cancellation / Modification Rule:**
   $$\Delta t = \text{CheckIn Date} - \text{Current Date}$$
   $$\text{Days Remaining} = \left\lceil \frac{\Delta t}{1000 \times 60 \times 60 \times 24} \right\rceil$$
   - If $\text{Days Remaining} \ge 3$: User can freely cancel or reschedule.
   - If $\text{Days Remaining} < 3$: Cancellation/rescheduling is locked for guests; only Administrator override is permitted.

---

## 4. Input & Output Specifications
- **Input:** Check-in / Check-out dates, guest counts, room tier selection, payment mode selection.
- **Output:** Live booking confirmation with unique Booking ID (`HB-XXX`), updated booking history table, policy warning badges.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How is the 3-day cancellation restriction computed?**
   - **A:** By comparing the epoch millisecond timestamps of the scheduled check-in date against midnight of the current system date, dividing by $86,400,000\text{ ms}$, and ensuring the remaining days are $\ge 3$.
2. **Q: How can administrators alter prices dynamically across all rooms?**
   - **A:** The admin dashboard binds input listeners to the `hotel_rooms` collection. Updating a price triggers an atomic `db.update()` call, immediately recalculating new booking quotes.
