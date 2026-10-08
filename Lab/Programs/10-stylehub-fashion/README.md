# Experiment 10: StyleHub Online Fashion Retailer
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and verify an e-commerce fashion and apparel retail platform featuring multi-department categorization (Men, Women, Kids), size selection with standard apparel size guides, dynamic shopping bag calculations, wishlist bookmarking, return/exchange policy actions, and administrative customer checkout auditing.

---

## 2. System Architecture & Components
1. **Shopper Experience Portal:**
   - Seasonal flash sale alert banner with dynamic discount promotion.
   - Apparel filters by gender department, category (Casual, Formal, Footwear, Accessories), and text search.
   - Size selector (S, M, L, XL, XXL) integrated directly into product cards.
   - Comprehensive Size Chart reference guide.
   - Wishlist toggle with one-click transfer to shopping bag.
   - 30-Day Easy Return & Exchange policy request trigger.
2. **Fashion Administrator Portal:**
   - Catalog pricing, stock level, and product description editor.
   - Customer checkout audit logs tracking order numbers, client identities, and transaction values.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `fashion_inventory`, `fashion_bag`, `fashion_wishlist`, `fashion_orders`.

---

## 3. Algorithm & Policy Flow
1. **Size-Specific SKU Cart Storage:**
   - Cart items are uniquely identified by composite key $(\text{Item ID}, \text{Selected Size})$.
   - Adding the same item in different sizes creates separate line items; adding the same item in the same size increments quantity and computes:
     $$\text{Subtotal} = \text{Unit Price} \times \text{Quantity}$$
2. **30-Day Return & Exchange Workflow:**
   - Customers can register return or size exchange requests against confirmed orders, capturing reason codes and triggering simulated reverse logistics.

---

## 4. Input & Output Specifications
- **Input:** Department/Category filters, apparel size selection, checkout identity.
- **Output:** Filtered fashion cards, updated bag total, unique order token (`SH-XXXX`), and administrative customer audit logs.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why does fashion e-commerce require composite identification for cart items?**
   - **A:** Unlike uniform electronics, garments require physical inventory tracking by size and color. A customer may order one Size S and two Size L of the same shirt; treating $(\text{Item ID}, \text{Size})$ as composite keys prevents overwriting.
2. **Q: How does the application implement client-side wishlists?**
   - **A:** The wishlist stores an array of product IDs in `localStorage`. Product cards perform an $O(1)$ lookup to toggle the heart icon between saved and un-saved states.
