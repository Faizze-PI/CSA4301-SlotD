# Experiment 18: AgriMart Agriculture & Farmer Marketplace
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an agricultural e-commerce and farmer supply-chain portal featuring direct farmer listing, categorization across agro-inputs (seeds, fertilizers, bio-pesticides, machinery, hand tools), AgriPay e-wallet settlement, subsidy calculations, and order shipment milestone tracking.

---

## 2. System Architecture & Components
1. **Public Buyer / Farmer Consumer Module:**
   - Faceted search and category filter pills (Seeds, Fertilizers, Pesticides, Equipment, Tools).
   - Real-time shopping basket with stock deduction checks.
   - Transparent price calculation engine factoring in government agro-subsidies (10%) and freight charges.
   - Multiple checkout options including AgriPay e-Wallet, Cash on Delivery, and Kisan Credit Cards (KCC).
   - 4-stage logistics stepper (`Placed` $\to$ `Dispatched` $\to$ `In Transit` $\to$ `Delivered`).
2. **Farmer / Vendor Management Console:**
   - Product publishing form with category classification, pricing, inventory stock, and high-resolution photo integration.
   - Stock maintenance and one-click restocking controls.
   - Shipment fulfillment console to dispatch consignments and append carrier tracking notes.
   - Real-time sales turnover analytics.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `agri_products`, `agri_cart`, `agri_orders`, `agri_wallet`.

---

## 3. Algorithm & Pricing Formula
1. **Order Total & Farmer Subsidy Formulation:**
   $$\text{Subtotal} = \sum_{i=1}^{n} (\text{Price}_i \times \text{Quantity}_i)$$
   $$\text{Farmer Subsidy} = \lfloor 0.10 \times \text{Subtotal} \rfloor$$
   $$\text{Grand Total} = \text{Subtotal} - \text{Farmer Subsidy} + \text{Freight Flat Rate (₹120)}$$
2. **Stock Invariant:**
   $$\text{Post-Purchase Stock} = \max(0, \text{Current Stock} - \text{Order Quantity})$$

---

## 4. Input & Output Specifications
- **Input:** Search queries, category filters, cart quantity modifiers, product creation parameters, shipping address, wallet top-up amounts.
- **Output:** Filtered product cards, dynamic cart breakdown, order confirmation token (`AGRI-ORD-XXXX`), and logistics milestone statuses.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is direct farmer-to-consumer e-commerce advantageous over traditional agricultural mandis?**
   - **A:** It disintermediates middlemen and commission agents, enabling farmers to command fair retail prices for their certified organic inputs and produce while buyers benefit from subsidized logistics and direct quality assurance.
2. **Q: How does the inventory system prevent over-selling agricultural machinery with low stock?**
   - **A:** During both cart item addition and final order placement, stock limits are validated against the database. If quantity exceeds available stock, the interface bounds the input and prevents checkout until inventory is replenished.
