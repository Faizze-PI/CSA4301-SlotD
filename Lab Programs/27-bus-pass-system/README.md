# Experiment 27: Metropolitan Bus Pass & Concession Management System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and validate an automated bus pass management portal featuring multi-tier concession logic (100% free government student passes, 50% subsidized private college passes, and standard employee route passes), digital e-Wallet renewal deductions, instant single-journey e-Ticket generation, dynamic QR verification, and real-time ETA calculation.

---

## 2. System Architecture & Components
1. **Commuter / Student Portal:**
   - Multi-tier concession application (Govt School Student $\rightarrow$ 100% free; Private College $\rightarrow$ 50% subsidy; Route Commuter $\rightarrow$ standard fare).
   - e-Wallet engine with top-up mechanism and automatic monthly renewal deductions.
   - Single-journey e-Ticket issuance from digital wallet with instantaneous PNR assignment.
   - Dynamic 2D QR Code generator embedding unique cryptographic pass tokens (`SMARTPASS-TN-XXXX`).
   - Real-time ETA route calculator dynamically projecting arrival times across scheduled corridor stops based on bus waypoint telemetry.
2. **Conductor Verification Terminal:**
   - Optical QR code scanner simulation validating pass genuineness, validity date, and assigned corridor.
   - Single-journey ticket scanner preventing double-riding or expired ticket reuse.
   - Live waypoint milestone updater broadcasting current bus stops and passenger occupancy to commuter apps.
3. **Transport Authority Admin Dashboard:**
   - Pass approval and concession vetting workflow.
   - Route and fleet inventory management (origins, destinations, timings, stopping stages, and tariffs).
   - Financial analytics for collected wallet revenue and total government subsidized concessions.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `buspass_passes_v1`, `buspass_routes_v1`, `buspass_tickets_v1`, `buspass_wallet_v1`.

---

## 3. Algorithm & Logic
1. **Concession Tariff Formulation:**
   $$\text{Gross Fare} = \text{Base Monthly Rate} \times \text{Duration (Months)}$$
   $$\text{Concession Subsidy} = \begin{cases} 
   1.00 \times \text{Gross Fare} & \text{Govt School Student (100\% Free)} \\
   0.50 \times \text{Gross Fare} & \text{College Student (50\% Discount)} \\
   0.00 & \text{Route Commuter (Standard)}
   \end{cases}$$
   $$\text{Net Payable} = \text{Gross Fare} - \text{Concession Subsidy}$$
2. **Real-Time Stop ETA Computation:**
   $$\Delta \text{Stops} = \text{Index}(\text{Target Stop}) - \text{Index}(\text{Current Bus Stop})$$
   $$\text{ETA} = \begin{cases}
   \max(2, \Delta \text{Stops} \times 4)\text{ minutes} & \text{if } \Delta \text{Stops} \ge 0 \\
   \text{"Bus Passed Stop"} & \text{if } \Delta \text{Stops} < 0
   \end{cases}$$

---

## 4. Input & Output Specifications
- **Input:** Student personal details, institution name, route selection, duration multiplier, wallet recharge amount, QR scan string, conductor location waypoint update.
- **Output:** Approved digital pass cards with responsive QR codes, e-ticket PNR receipts, stop-by-stop ETA projections, and administrative fleet ledgers.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the system enforce public welfare concession schemes?**
   - **A:** The tariff calculation module evaluates applicant demographic parameters; applicants from verified government institutions automatically receive a 100% discount waiver ($\text{Net} = ₹0$), while tertiary college students receive a 50% state co-funded concession.
2. **Q: What role does the digital conductor verification terminal serve?**
   - **A:** The conductor interface validates the authenticity of commuter QR codes in real time, preventing fraudulent ticket duplication, out-of-route travel, and expired pass usage.
