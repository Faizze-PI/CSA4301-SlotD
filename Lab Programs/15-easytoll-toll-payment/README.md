# Experiment 15: EasyToll Online Toll Payment & QR Verification System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an automated highway toll payment and digital pass management system that eliminates manual queuing through advance e-ticket booking, subsidized commuter passes, e-wallet auto-deduction, and operator QR barrier clearance.

---

## 2. System Architecture & Components
1. **Commuter / Driver Portal:**
   - Real-time e-wallet balance tracker and instant top-up gateway.
   - Advance toll e-ticket booking with vehicle categorization (Car, LCV, Truck, Multi-Axle) and return journey discounts.
   - Commuter monthly and route pass application with document verification.
   - Instant cryptographic QR code token generation for offline toll booth presentation.
2. **Toll Gate Operator Console:**
   - Digital camera / scanner simulation lane interface.
   - Real-time token validation engine checking ticket status, pass expiry, and fraud redemption flags.
   - Physical boom barrier clearance actuation trigger with live transaction logging.
3. **Highway Authority / Admin Dashboard:**
   - Multi-plaza network oversight and dynamic tariff structure configuration.
   - Pass application approval queue.
   - Centralized highway revenue and traffic crossing audit logging.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `easytoll_wallet`, `easytoll_plazas`, `easytoll_passes`, `easytoll_tickets`, `easytoll_crossings`.

---

## 3. Algorithm & Policy Flow
1. **Fare Computation Logic:**
   $$\text{Base Rate} = \text{Plaza Tariff}[\text{Vehicle Category}]$$
   $$\text{Single Journey Fare} = \text{Base Rate}$$
   $$\text{Return Journey Fare} = \lfloor 1.5 \times \text{Base Rate} \rfloor$$
2. **Toll Clearance Verification Flow:**
   $$\text{Scan Token} \longrightarrow \begin{cases} 
   \text{Single Ticket} & \text{If Active} \to \text{Clear Barrier} \to \text{Mark Redeemed} \\
   \text{Pass Token} & \text{If Approved \& Valid} \to \text{Clear Barrier} \\
   \text{Invalid / Reused} & \text{Trigger Alarm \& Deny Access}
   \end{cases}$$

---

## 4. Input & Output Specifications
- **Input:** Vehicle registration number, vehicle category, toll plaza selection, journey type, top-up amount, pass documentation.
- **Output:** Encrypted QR e-ticket tokens (`ET-TKT-XXXX`), approved toll pass cards (`ET-PASS-XXXX`), barrier clearance logs, and system revenue summaries.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does advance toll e-ticketing prevent double-redemption at the toll plaza?**
   - **A:** Each issued e-ticket contains a unique, stateful token (`ET-TKT-XXXX`). Once the toll operator executes the barrier clearance, the system transitions the token status from `Active` to `Redeemed` in the database, preventing subsequent attempts to reuse the same ticket.
2. **Q: What is the benefit of the return journey pricing model?**
   - **A:** The system incentivizes pre-paid round trips by charging a discounted rate of $1.5\times$ the single toll fare instead of $2\times$, reducing transaction overhead and queue latency at highway checkpoints.
