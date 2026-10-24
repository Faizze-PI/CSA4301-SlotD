# Experiment 31: Ko-Matha Smart Dairy Farm Management Portal
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an integrated smart dairy management portal showcasing indigenous Indian cow (A1/A2 beta-casein) products, online consumer delivery scheduling, milk vendor intake with quality-adjusted pricing (Fat% and SNF formulas), and administrative livestock inventory ledgers with periodic daily/monthly/yearly stock reports.

---

## 2. System Architecture & Components
1. **Consumer & Customer Portal:**
   - Catalog of pure indigenous cow products: Raw A1 Milk, Set Curd, Palkova (Cova-sweet), Cultured White Butter, and Bilona Desi Ghee.
   - Delivery scheduler with early morning vs evening slot selection and digital shopping basket checkout.
   - Interactive educational dossier detailing the biochemical benefits of native Gir/Sahiwal livestock.
2. **Milk Vendor / Dairy Farmer Console:**
   - Session milk logging form capturing quantity (liters), fat percentage (3.0% - 8.0%), and Solids Not Fat (SNF 8.0% - 10.5%).
   - Dynamic quality-adjusted pricing engine computing instant farmer compensation.
   - Registered dairy cattle herd ledger (Cattle Tag, Breed, Average Yield, Health Status).
3. **Farm Administration Console:**
   - Periodic stock and yield analytics generating Daily, Monthly, and Yearly summaries.
   - Master customer delivery fulfillment ledger.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `komatha_products_v1`, `komatha_orders_v1`, `komatha_milklogs_v1`, `komatha_cows_v1`, `komatha_cart_v1`.

---

## 3. Algorithm & Logic
1. **Quality-Adjusted Milk Purchase Rate Formula:**
   $$\text{Rate (₹/L)} = \max\left(30, 35.00 + (\text{Fat} - 3.5) \times 6.00 + (\text{SNF} - 8.5) \times 4.00\right)$$
   $$\text{Session Payout} = \text{Rate} \times \text{Milk Volume (Liters)}$$
2. **Periodic Stock Reconciliation:**
   $$\text{Closing Balance} = \text{Milk Inflow} - \text{Milk Dispatched}$$

---

## 4. Input & Output Specifications
- **Input:** Product selections, delivery address and slot, vendor milking session logs, Fat% and SNF meter values, periodic report filter toggles.
- **Output:** Dynamic shopping cart invoices, automated vendor payout estimations, cow health registers, and administrative stock flow tables.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the quality-based payout formula incentivize smallholder dairy farmers?**
   - **A:** By dynamically scaling the purchase rate per liter based on laboratory-verified Fat% and SNF (Solids Not Fat), farmers who nourish cattle on natural feed and maintain high hygiene standards receive higher financial compensation.
2. **Q: Why is stock balance tracking critical in perishable dairy management?**
   - **A:** Milk has a short shelf-life and strict cold-chain requirements. Tracking daily inflow against retail packaging and processing prevents spoilage and maintains supply predictability.
