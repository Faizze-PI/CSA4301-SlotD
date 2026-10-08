# Experiment 20: RentRide Vehicle Rental & Fleet Reservation System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online vehicle rental and fleet reservation platform featuring multi-hub geolocation filtering, dynamic rental duration tariff computation with refundable security deposits, digital pre-departure check-in verification, and administrator reservation approvals.

---

## 2. System Architecture & Components
1. **Customer / Hirer Portal:**
   - Multi-category fleet browser (Luxury Sedans, 7-Seater SUVs, Compact City Hatchbacks, Commercial Pickups).
   - Hub location filters (Airport T2, OMR IT Expressway, Koyambedu Central, Tambaram Bypass).
   - Reservation calculation engine factoring in duration days and refundable deposits.
   - Digital check-in module verifying driving licenses and vehicle inspection checklists.
   - Dynamic smart keycode allocation (`KEY-XXXX`) for keybox pickup.
   - Hirer rating and review submission interface.
2. **Fleet Operations & Admin Console:**
   - Reservation approval and rejection workflow.
   - Fleet inventory management with daily pricing tariffs and availability toggles.
   - Fleet addition interface capturing vehicle registration numbers, seating capacity, fuel, and transmission types.
   - Real-time fleet utilization and rental revenue analytics.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `rent_fleet`, `rent_bookings`, `rent_reviews`.

---

## 3. Algorithm & Fare Computation
1. **Rental Fare Formula:**
   $$\text{Duration (Days)} = \max\left(1, \; \left\lceil \frac{\text{Return Date} - \text{Pickup Date}}{24 \times 3600 \times 1000} \right\rceil\right)$$
   $$\text{Total Payable} = (\text{Duration} \times \text{Daily Tariff}) + \text{Refundable Security Deposit (₹3,000)}$$
2. **Handover Lifecycle State Machine:**
   $$\text{Pending Approval} \xrightarrow{\text{Admin Approves}} \text{Approved} \xrightarrow{\text{Digital Check-In}} \text{Checked-In (Key Issued)} \xrightarrow{\text{Return Fleet}} \text{Completed}$$

---

## 4. Input & Output Specifications
- **Input:** Pickup/return dates, hub location, vehicle category, hirer KYC documentation, driving license number, checklist affirmations.
- **Output:** Filtered fleet roster, confirmed reservation token (`RR-BK-XXXX`), smart keybox passcode (`KEY-XXXX`), and operational revenue totals.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is a digital pre-departure check-in form required before vehicle handover?**
   - **A:** It records legal driving license verification, identity proof, and confirms pre-existing condition inspections (exterior scratches, fuel level, spare wheel), establishing an audit trail that protects both the hirer and the rental agency against liability disputes.
2. **Q: How does the system handle duration calculation when pickup and return occur on the same day?**
   - **A:** The duration calculation enforces a minimum boundary condition of $\max(1, \text{days})$ to ensure a standard single-day base tariff applies even if the vehicle is returned within a few hours.
