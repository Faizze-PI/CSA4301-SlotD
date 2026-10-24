# Experiment 32: Ram Infotech Laptop Sales, Repair Service Center & Corporate Rentals
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an integrated computer hardware commerce and technical services portal supporting multi-brand laptop retail sales with dynamic inventory management, chip-level service ticket scheduling with live stage tracking, and corporate workstation rental lease agreements with security deposit formulations.

---

## 2. System Architecture & Components
1. **Customer & Buyer Portal:**
   - Laptop sales catalog filterable by brand (Dell, Lenovo, Apple, ASUS, HP) and usage tier (Business, Gaming, Student) with shopping cart checkout.
   - Chip-level repair service booking interface capturing customer device models, fault categories (display, motherboard, battery, liquid spill), and logistics modes (lab drop-off vs doorstep pickup).
   - Real-time service ticket tracker featuring a 4-milestone stepper: `Received in Lab` $\rightarrow$ `Diagnosed` $\rightarrow$ `Under Repair` $\rightarrow$ `Ready for Pickup`.
   - Corporate laptop rental calculator and formal binding lease contract generator.
2. **Technician Bench Console:**
   - Active bench workbench allowing certified engineers to advance service ticket stages and adjust repair estimates.
3. **Store Management Console:**
   - Inventory tracking and restock controls.
   - Master ledger of active corporate leases, security deposits, and active bench tickets.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `ram_laptops_v1`, `ram_tickets_v1`, `ram_leases_v1`, `ram_cart_v1`.

---

## 3. Algorithm & Logic
1. **Corporate Rental Contract Calculation:**
   $$\text{Monthly Base} = \text{Monthly Rate per Unit} \times \text{Quantity}$$
   $$\text{Security Deposit} = \text{Deposit Rate per Unit} \times \text{Quantity}$$
   $$\text{Discount Multiplier} = \begin{cases} 0.90 & \text{if Tenure} = 12 \text{ Months (Annual)} \\ 1.00 & \text{otherwise} \end{cases}$$
   $$\text{Advance Commitment} = (\text{Monthly Base} \times \text{Tenure} \times \text{Discount Multiplier}) + \text{Security Deposit}$$
2. **Inventory Stock Management:**
   $$\text{Stock}_{\text{new}} = \max\left(0, \text{Stock}_{\text{initial}} - \text{Quantity}_{\text{purchased}}\right)$$

---

## 4. Input & Output Specifications
- **Input:** Brand filter criteria, repair fault description, laptop model, rental configuration tier, quantity, lease tenure.
- **Output:** Dynamic product catalog cards, trackable service progress steppers, printable legal rental agreements, and bench diagnostic updates.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is ticket stage tracking essential in consumer electronics repair software?**
   - **A:** Electronic repairs involve sensitive diagnostic testing and sourcing of specialized chip components. Providing customers with a transparent milestone stepper reduces repetitive customer support inquiries and builds trust.
2. **Q: How does the rental lease calculator handle long-term commercial commitments?**
   - **A:** It automatically applies duration-based volume discounts (e.g. 10% annual contract discount) while calculating and isolating refundable security deposits from monthly operating rent.
