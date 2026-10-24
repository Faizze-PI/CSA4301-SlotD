# Experiment 25: On-Road Breakdown Assistance & Licensed Mechanic Dispatch
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate a full-stack, client-side web application for on-road vehicle breakdown assistance and certified mobile mechanic dispatch, featuring real-time issue categorization, corridor filtering, 1-Click Highway SOS dispatch, live telemetry GPS van tracking, and government licensing verification controls.

---

## 2. System Architecture & Components
1. **Stranded Motorist (User) Portal:**
   - Problem categorization filter (Flat Tyre, Dead Battery, Radiator Overheating, Hydraulic Flatbed Towing, Emergency Fuel).
   - Highway corridor sectoring (Tambaram GST Road NH-45, OMR IT Corridor, Sriperumbudur NH-48, Guindy Kathipara).
   - Mechanic distance calculation, transparent callout pricing, and verified customer star ratings.
   - **1-Click Highway SOS Alert:** Dispatches closest certified roadside assistance van instantly.
   - **Live Rescue Telemetry:** Real-time progress bar simulating stages: Dispatched $\rightarrow$ En-Route $\rightarrow$ Arrived $\rightarrow$ Repaired, with dynamic ETA countdown.
   - Review and feedback submission ledger.
2. **Mobile Mechanic Dashboard:**
   - Workshop credentials configuration (garage name, highway zone, phone number, callout tariff, specialization services).
   - Live availability toggle (`Available for Duty` vs `Off-Duty / Busy`).
   - Customer feedback and rating ledger viewer.
3. **Licensing Authority Admin Console:**
   - Background check and toolkit verification queue for mobile mechanics.
   - License approval, suspension, and revocation controls (strictly verified mechanics appear in public search).
   - Metric aggregates for registered mechanics, active licenses, and cumulative highway SOS dispatches.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `resq_mechanics_v1`, `resq_dispatches_v1`, `resq_feedback_v1`, `resq_active_dispatch_v1`.

---

## 3. Algorithm & Logic
1. **Dynamic ETA Calculation:**
   $$\text{ETA}_{\text{remaining}} = \max\left(1, \text{round}\left(\text{ETA}_{\text{initial}} \times \left(1 - \frac{\text{progress}}{100}\right)\right)\right)$$
2. **Weighted Mechanic Rating Update:**
   $$\text{Rating}_{\text{new}} = \frac{\text{Rating}_{\text{old}} \times (\text{Reviews}_{\text{count}} - 1) + \text{Rating}_{\text{submitted}}}{\text{Reviews}_{\text{count}}}$$
3. **1-Click SOS Auto-Allocation:**
   $$\text{Mechanic}_{\text{assigned}} = \arg\min_{m \in \text{Approved Mechanics} \land m.\text{available}} \left(\text{distance}(m)\right)$$

---

## 4. Input & Output Specifications
- **Input:** Vehicle registration number, breakdown type selection, highway corridor, current mile marker/landmark, mechanic profile updates, motorist feedback scores.
- **Output:** Filtered mechanic directory cards, emergency dispatch confirmation modal, animated telemetry tracker with progress stages, and administrative licensing status badges.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is administrative license verification essential in roadside assistance portals?**
   - **A:** Stranded motorists on isolated highway corridors are vulnerable to predatory pricing or unqualified mechanics. Licensing verification ensures that only background-checked technicians with standard equipment and verified identification are dispatched.
2. **Q: How does the system simulate real-time GPS tracking on the client side?**
   - **A:** The system employs timed asynchronous telemetry intervals updating a milestone progress percentage and dynamic ETA calculation, persisting state transitions into `localStorage` so tracking survives page refreshes.
