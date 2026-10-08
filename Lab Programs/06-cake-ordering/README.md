# Experiment 06: Online Cake Ordering System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design and construct an e-commerce cake ordering portal enabling flavor and occasion filtering, custom weight selection (0.5 kg to 2.0 kg), personalized message inscription, dynamic cart management, and administrative order fulfillment with real-time status transitions.

---

## 2. System Architecture & Components
1. **Customer Web Portal:**
   - Catalog browsing filtered by occasion and flavor.
   - Modal customizer for weight options, custom inscription, and quantity.
   - Interactive shopping cart with subtotal and grand total recalculation.
   - Order history and delivery status tracker (`Order Placed` $\to$ `Baking` $\to$ `Out for Delivery` $\to$ `Delivered`).
2. **Bakery Administration Portal:**
   - Inventory catalog product publisher.
   - Real-time customer order fulfillment and status update transitions.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `cake_products`, `cake_cart`, `cake_orders`.

---

## 3. Algorithm & Logic Flow
1. **Custom Weight & Price Multiplier:**
   $$\text{Weight Multiplier} = \frac{\text{Selected Weight}}{0.5\text{ kg}}$$
   $$\text{Unit Price} = \text{Base Price} \times \text{Weight Multiplier}$$
   $$\text{Subtotal} = \text{Unit Price} \times \text{Quantity}$$
2. **Order State Machine Transitions:**
   $$\text{Order Placed} \longrightarrow \text{Baking in Oven} \longrightarrow \text{Decorating \& Inscribing} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$

---

## 4. Input & Output Specifications
- **Input:** Flavor/occasion filters, cake size, custom message text, delivery address.
- **Output:** Live shopping cart total, order receipt with generated Order ID (`ORD-XXXX`), and active status delivery tracker.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the cake customizer compute price scaling dynamically without server roundtrips?**
   - **A:** The client binds input change listeners on the `<select>` size dropdown and computes $\text{Base Price} \times (\text{Weight} / 0.5)$ directly in JavaScript, updating the DOM price element instantly.
2. **Q: How does the application maintain cart items across browser sessions?**
   - **A:** The cart state is stored in the `cake_cart` key inside `localStorage` through `labDB`, ensuring items remain in the user's cart until ordered or cleared.
