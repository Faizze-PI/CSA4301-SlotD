# Experiment 45: Income Tax Calculation Webpage
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and verify an income tax assessment webpage that accepts salaried employee income streams (Gross pay, HRA), enforces statutory exemptions (Standard deduction of ₹50,000, Section 80C pension cap of ₹1,50,000, and Section 80D health insurance), and calculates progressive income tax with the ₹5,00,000 zero-tax rebate limit.

---

## 2. Algorithm & Mathematical Formulation

### A. Algorithm
1. **Input Collection:** Read employee's monthly gross salary, monthly HRA, monthly 80C pension contribution, and monthly 80D health insurance premium.
2. **Annualize Figures:** Multiply each monthly income and deduction component by 12.
3. **Apply Statutory Deductions:**
   - Subtract standard deduction ($₹50,000$).
   - Subtract annual HRA exemption.
   - Cap Section 80C deduction at $\min(\text{Annual Pension}, ₹1,50,000)$.
   - Subtract Section 80D health insurance.
4. **Compute Net Taxable Income (NTI):**
   $$\text{NTI} = \max(0, \text{Annual Gross} - \text{Total Deductions})$$
5. **Evaluate Tax Slabs & Rebates:**
   - If $\text{NTI} \le ₹5,00,000$, apply Section 87A rebate: $\text{Tax} = ₹0$.
   - Otherwise, apply progressive marginal rates across brackets (0%, 5%, 20%, 30%).
6. **Output Generation:** Update DOM breakdown table and prepare printable Form 16 assessment slip.

### B. Mathematical Formulation & Slabs

#### Net Taxable Income (NTI) Formulation
$$\text{NTI} = (\text{Gross Pay} \times 12) - (\text{HRA} \times 12) - 50{,}000 - \min(\text{Pension} \times 12, 150{,}000) - (\text{Health Insurance} \times 12)$$

#### Rebate Rule (Section 87A)
$$\text{If } \text{NTI} \le 500{,}000 \implies \text{Tax Liability} = ₹0 \text{ (NIL)}$$

#### Progressive Slab Brackets (when $\text{NTI} > 500{,}000$)
$$\text{Tax Liability} = \begin{cases}
0 & \text{for } [0 \text{ to } 250{,}000] \\
5\% \times 250{,}000 = 12{,}500 & \text{for } [250{,}001 \text{ to } 500{,}000] \\
12{,}500 + 20\% \times (\text{NTI} - 500{,}000) & \text{if } 500{,}001 \le \text{NTI} \le 1{,}000{,}000 \\
112{,}500 + 30\% \times (\text{NTI} - 1{,}000{,}000) & \text{if } \text{NTI} > 1{,}000{,}000
\end{cases}$$

---

## 3. System Architecture & Components
1. **Employee Financial Portal:**
   - Input forms for monthly gross pay, HRA, Section 80C PF/Pension, and Section 80D health insurance.
   - Real-time reactivity recalculating NTI and tax liabilities.
   - Printable Form 16 Annual Tax Assessment document.
2. **Tax Authority Administration View:**
   - Interface to adjust the statutory standard deduction, the Section 80C pension ceiling, and the Section 87A zero-tax threshold.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `tax_gov_norms`, `tax_saved_returns`.

---

## 4. Input & Output Verification
- **Sample Input:**
  - Monthly Gross Pay: ₹85,000 ($\implies$ Annual Gross: ₹10,20,000)
  - Monthly HRA: ₹15,000 ($\implies$ Annual HRA: ₹1,80,000)
  - Standard Deduction: ₹50,000
  - Monthly Pension: ₹10,000 ($\implies$ Annual Pension: ₹1,20,000 $\le$ ₹1,50,000 cap)
  - Monthly Health Insurance: ₹2,000 ($\implies$ Annual 80D: ₹24,000)
- **Calculation:**
  $$\text{NTI} = 1{,}020{,}000 - 180{,}000 - 50{,}000 - 120{,}000 - 24{,}000 = ₹646{,}000$$
  - Slab 1 (0 to 2.5L): ₹0
  - Slab 2 (2.5L to 5.0L): $5\% \times 250{,}000 = ₹12{,}500$
  - Slab 3 (5.0L to 6.46L): $20\% \times (646{,}000 - 500{,}000) = 20\% \times 146{,}000 = ₹29{,}200$
  - **Total Tax Liability:** $12{,}500 + 29{,}200 = ₹41{,}700$
  - **Net Take-Home Pay:** $1{,}020{,}000 - 41{,}700 = ₹978{,}300$
- **Expected Output:** Exact penny-matched output on DOM and printable summary.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why does a taxpayer earning ₹5,00,000 pay zero tax while one earning ₹5,00,001 pays tax on the entire amount exceeding ₹2.5 Lakhs?**
   - **A:** Under Section 87A rebate rules, taxpayers with NTI $\le$ ₹5,00,000 receive a 100% tax rebate of up to ₹12,500. Once the income exceeds ₹5,00,000 by even ₹1, the rebate is completely forfeited, activating normal progressive slab rates from ₹2,50,001 onwards.
2. **Q: How is the Section 80C deduction cap enforced in code?**
   - **A:** Using `Math.min(monthlyPension * 12, 150000)`, ensuring that no matter how much is deposited, the maximum deduction awarded cannot exceed the legal threshold of ₹1.5 Lakhs.
