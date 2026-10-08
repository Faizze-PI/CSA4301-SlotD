# Experiment 42: Online Electricity Bill Payment & Tariff Engine
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design and build an online electricity bill payment system with bi-monthly billing cycles, multi-tier domestic and commercial progressive tariff slab algorithms, overdue fine surcharge computation (₹10 per day late), and digital tax receipt generation.

---

## 2. Mathematical Formulation & Algorithm
The bill calculation strictly implements the syllabus specifications:

### A. Domestic Connection Tariff Slabs
$$\text{Domestic Bill}(U) = \begin{cases}
U \times 1.00 & 0 \le U \le 100 \\
(100 \times 1.00) + (U - 100) \times 2.50 & 101 \le U \le 200 \\
(100 \times 1.00) + (100 \times 2.50) + (U - 200) \times 4.00 & 201 \le U \le 500 \\
(100 \times 1.00) + (100 \times 2.50) + (300 \times 4.00) + (U - 500) \times 6.00 & U > 500
\end{cases}$$

### B. Commercial Connection Tariff Slabs
$$\text{Commercial Bill}(U) = \begin{cases}
U \times 2.00 & 0 \le U \le 100 \\
(100 \times 2.00) + (U - 100) \times 4.50 & 101 \le U \le 200 \\
(100 \times 2.00) + (100 \times 4.50) + (U - 200) \times 6.00 & 201 \le U \le 500 \\
(100 \times 2.00) + (100 \times 4.50) + (300 \times 6.00) + (U - 500) \times 7.00 & U > 500
\end{cases}$$

### C. Overdue Fine Computation
$$\Delta \text{days} = \max\left(0, \left\lceil \frac{\text{Current Date} - \text{Due Date}}{86{,}400{,}000\text{ ms}} \right\rceil\right)$$
$$\text{Fine Amount} = \Delta \text{days} \times ₹10$$
$$\text{Total Payable} = \text{Base Energy Charge} + \text{Fine Amount}$$

---

## 3. System Components
1. **Consumer Web Portal:**
   - Active account overview (Service No, Bi-monthly cycle, units consumed).
   - Real-time late payment alert if current date exceeds due date.
   - Interactive multi-tier slab breakdown simulator.
   - Payment method gateway selection and printable tax invoice generator.
2. **TNEB Administrator Portal:**
   - Real-time editing of domestic and commercial slab rates.
   - Bi-monthly cycle configuration (Start Date, End Date, Due Date, and Fine Rate).
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `eb_tariffs`, `eb_cycle`, `eb_consumer`, `eb_receipts`.

---

## 4. Input & Output Specifications
- **Sample Input:** Connection Type: `Domestic`, Units: `340`, Due Date: `2026-10-01` (5 days overdue).
- **Calculation:**
  - First 100 units @ ₹1.00 = ₹100
  - Next 100 units @ ₹2.50 = ₹250
  - Remaining 140 units @ ₹4.00 = ₹560
  - Base Energy Charge = $100 + 250 + 560 = ₹910.00$
  - Overdue Fine = $5 \times ₹10 = ₹50.00$
  - Total Payable = $910 + 50 = ₹960.00$
- **Expected Output:** Exact breakdown rendered to DOM, payment clearance with receipt number `EB-REC-XXXXX`.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is electricity billing implemented using progressive tiered slabs rather than flat rates?**
   - **A:** Tiered (telescopic) pricing encourages conservation by charging higher incremental marginal rates for high consumption while ensuring essential basic electricity remains affordable for lower-income households.
2. **Q: How does JavaScript handle date arithmetic accurately for the daily fine?**
   - **A:** By converting dates into epoch milliseconds via `.getTime()`, computing the time differential, and dividing by the milliseconds in a standard day ($1000 \times 60 \times 60 \times 24 = 86,400,000$).
