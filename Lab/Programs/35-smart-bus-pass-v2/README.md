# Experiment 35: Smart Bus Pass System v2 (Transit Concessions, IoT ETA & Conductor Scanner)
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate the second-generation Smart Bus Pass System (v2) integrating multi-tier welfare concessions (100% free government student passes, 50% subsidized private college passes, and corporate commuter passes), digital e-Wallet tap-and-pay transactions, single-journey paperless transit e-Tickets, real-time IoT stop waypoint broadcasting, and optical conductor QR validation.

---

## 2. System Architecture & Components
1. **Commuter Portal (v2):**
   - Welfare category concession evaluation: Government school/college applicants travel 100% free ($₹0$), private college students receive 50% state co-funding ($₹425/\text{month}$), and corporate commuters pay standard rates ($₹850/\text{month}$).
   - Rechargeable smart e-Wallet engine with real-time balance tracking and one-click monthly renewal deductions.
   - Paperless transit e-Ticket generation issuing unique PNR tokens with embedded 2D QR codes.
   - Telemetry-driven corridor ETA calculator providing dynamic countdown minutes to upcoming stops based on live conductor GPS milestone feeds.
2. **Conductor Mobile Scanner Console:**
   - Optical simulated laser scanner validating passes and single tickets against local authority registries.
   - Live corridor waypoint milestone broadcaster updating current bus stop locations and passenger load levels (Low, Moderate, High).
3. **Transport Directorate Admin Dashboard:**
   - Pass approval queue and concession vetting workflow.
   - Dynamic metropolitan route creator registering origin, destination, stage fares, and sequential corridor stopping points.
   - Live revenue metrics tracking cumulative wallet turnover and welfare subsidies.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `smartbus_passes_v2`, `smartbus_routes_v2`, `smartbus_tickets_v2`, `smartbus_wallet_v2`.

---

## 3. Algorithm & Logic
1. **Concession Formulation:**
   $$\text{Base Cost} = 850 \times \text{Duration (Months)}$$
   $$\text{Payable} = \begin{cases}
   ₹0 & \text{Govt School / College (100\% Free)} \\
   0.50 \times \text{Base Cost} & \text{Private College (50\% Subsidy)} \\
   \text{Base Cost} & \text{Corporate Commuter (Standard)}
   \end{cases}$$
2. **Dynamic Stop ETA Formulation:**
   $$\Delta \text{Stops} = \text{Index}(\text{Target Stop}) - \text{Index}(\text{Current Waypoint})$$
   $$\text{ETA} = \begin{cases}
   \max(2, \Delta \text{Stops} \times 4)\text{ mins} & \text{if } \Delta \text{Stops} \ge 0 \\
   \text{"Bus Passed Stop"} & \text{otherwise}
   \end{cases}$$

---

## 4. Input & Output Specifications
- **Input:** Student identity credentials, institution category, route selection, duration multiplier, wallet top-up value, conductor milestone broadcast.
- **Output:** Digital pass cards with reactive QR codes, single journey e-ticket PNR receipts, stop-by-stop ETA countdowns, and route fleet registries.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: What architectural upgrades does SmartBus Pass v2 provide over basic bus pass systems?**
   - **A:** Version 2 introduces an integrated e-Wallet ecosystem for both pass renewal and single-journey paperless tickets, alongside a live conductor waypoint broadcasting system that powers real-time stop ETA countdowns for waiting passengers.
2. **Q: How does the system ensure fast offline verification by conductors?**
   - **A:** The system generates encoded tokens and QR hashes containing commuter ID, validity dates, and allowed route numbers, allowing quick optical validation even when internet connectivity drops along highway corridors.
