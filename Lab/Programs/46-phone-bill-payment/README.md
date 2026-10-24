# Experiment 46: Online Phone Bill Payment Website
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online postpaid mobile phone bill payment portal featuring monthly cycle management, dynamic late fee surcharge computation (₹10 per day late past the due date), partial/full payment capabilities, auto-pay configurations, and digital tax invoice issuance.

---

## 2. Mathematical Formulation & Algorithm
1. **Late Overdue Fine Computation:**
   $$\Delta \text{days} = \max\left(0, \left\lceil \frac{\text{Current Date} - \text{Due Date}}{86{,}400{,}000\text{ ms}} \right\rceil\right)$$
   $$\text{Late Fine} = \Delta \text{days} \times ₹10$$
2. **Total Due Calculation:**
   $$\text{Total Outstanding} = \text{Base Monthly Bill} + \text{Late Fine}$$
3. **Partial vs Full Payment Allocation:**
   - If Full Payment selected: $\text{Pay Amount} = \text{Total Outstanding}$.
   - If Custom Payment selected: $\text{Pay Amount} = \text{Entered Custom Amount} \ge ₹100$.

---

## 3. System Architecture & Components
1. **Subscriber Account Portal:**
   - Account overview (Mobile number, postpaid plan, billing cycle).
   - Dynamic breakdown of rental, roaming/VAS, GST, and overdue fine surcharge.
   - Dual payment options (Full vs Custom amount) across UPI, Card, Net Banking, and Wallets.
   - Recurring auto-pay toggle and SMS notification preference manager.
   - Printable telecom GST tax invoice generator.
2. **Telecom Billing Administrator View:**
   - Monthly billing cycle schedule (Start Date, End Date, Due Date, and Fine Rate).
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `phone_cycle`, `phone_subscriber`, `phone_invoices`.

---

## 4. Input & Output Verification
- **Sample Input:** Mobile Number: `+91 98765 43210`, Base Bill: ₹693.84, Due Date: `2026-10-02` (4 days overdue).
- **Calculation:**
  - $\Delta \text{days} = 4\text{ days}$
  - $\text{Fine} = 4 \times ₹10 = ₹40.00$
  - $\text{Total Payable} = 693.84 + 40.00 = ₹733.84$
- **Expected Output:** Dynamic display of total due, generated invoice `TC-INV-XXXXX`, and print slip.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the application differentiate full versus custom payment amounts?**
   - **A:** Radio button state listeners toggle an optional numeric input field; during checkout submission, the engine checks which radio option is checked and validates the payment threshold accordingly.
2. **Q: Why is the fine calculated dynamically rather than stored statically?**
   - **A:** Calculating fine as $\Delta\text{days} \times \text{Rate}$ relative to the current date ensures that each day a subscriber delays payment past the due date, the late surcharge automatically escalates without requiring background cron updates.
