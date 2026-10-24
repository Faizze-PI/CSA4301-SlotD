# Experiment 39: OmniStore Universal E-Commerce Store

## 1. Aim
To design, engineer, and implement **OmniStore**, a comprehensive client-side e-commerce web platform featuring product catalog search and faceted filtering, a reactive shopping cart with promotional coupon validation, tax and shipping calculations, multi-step checkout, simulated email dispatch notifications, order tracking milestones, and merchant inventory management.

---

## 2. Theoretical Architecture & System Design
- **Single-Page Application (SPA) E-Commerce Architecture:**
  - Fast client-side navigation between Storefront, Catalog, Cart, Order History, and Merchant Inventory.
- **Faceted Product Search & Filtering:**
  - Real-time text search across title and brand.
  - Multi-attribute filtering (Category, Brand, Continuous Price Slider).
  - Sorting algorithms (Popularity/Rating, Price Ascending, Price Descending).
- **Reactive Shopping Cart State Machine:**
  - Real-time total formulation incorporating item price, quantity multiplier, promotional discounts (`SAVE15` = 15% off), progressive shipping thresholds (Free shipping above ₹1,000, else ₹99), and standard 18% GST.
  - Stateful cart badge updates in both header and sub-navigation.
- **Order Fulfilment & Dispatch Pipeline:**
  - Generates unique consignment identifiers (`ORD-XXXXXX`).
  - Simulates automated transactional email dispatch to the buyer.
  - 4-stage tracking visualizer (Placed $\rightarrow$ Packed $\rightarrow$ In Transit $\rightarrow$ Delivered).
- **Merchant Mode (RBAC):**
  - Allows inventory owners to add products, adjust stock quantities, and view warehouse stock levels.

---

## 3. Algorithm

### Algorithm 1: Order Total & Tax Formulation
1. **Cart Subtotal:**
   $$\text{Subtotal} = \sum_{i=1}^{m} (item_i.\text{price} \times item_i.\text{qty})$$
2. **Promotional Discount:**
   $$\text{Discount} = \begin{cases} \lfloor 0.15 \times \text{Subtotal} \rfloor & \text{if coupon is 'SAVE15'} \\ 0 & \text{otherwise} \end{cases}$$
3. **Taxable Base:**
   $$\text{Base} = \max(0, \text{Subtotal} - \text{Discount})$$
4. **Goods & Services Tax (GST 18%):**
   $$\text{GST} = \lfloor \text{Base} \times 0.18 \rfloor$$
5. **Shipping Freight:**
   $$\text{Shipping} = \begin{cases} 0 & \text{if } \text{Subtotal} > 1000 \lor \text{Subtotal} = 0 \\ 99 & \text{otherwise} \end{cases}$$
6. **Grand Total:**
   $$\text{Total} = \text{Base} + \text{GST} + \text{Shipping}$$

### Algorithm 2: Dynamic Multi-Factor Filtering
1. **Input:** Search term $S$, Category $C$, Brand $B$, Maximum Price $P_{\max}$, and Sort Order $O$.
2. **Matching Rule:** For each catalog item $p$:
   $$\text{Valid}(p) = \Big(\text{includes}(p.\text{title}, S) \lor \text{includes}(p.\text{brand}, S)\Big) \land (C = \text{'All'} \lor p.\text{category} = C) \land (B = \text{'All'} \lor p.\text{brand} = B) \land (p.\text{price} \le P_{\max})$$
3. **Sorting:** Sort matching products according to key $O$ (ascending, descending, or star rating).
4. **Output:** Render product cards with price, badges, rating stars, and Add to Cart triggers.

---

## 4. Key Modules & Features
| Module | Description | Technical Implementation |
|---|---|---|
| **Storefront** | Promotional banners and category shortcuts | CSS Flexbox strips and promotional card styling |
| **Catalog Browser** | Faceted filtering by category, brand, and price | Array `.filter()`, `.sort()`, dynamic DOM injection |
| **Reactive Cart** | Quantity adjustments and live price recalculations | Persistent storage in `omnistore_cart` |
| **Checkout & Invoice** | Multi-step destination capture and payment modes | Modal dialogue with printable invoice formatting |
| **Order Tracking** | 4-stage consignment progress visualizer | Flexbox stepper with active milestone highlights |
| **Merchant Inventory** | Add new warehouse products and view stock levels | Form serialization, table rendering, `labDB` commits |

---

## 5. File Structure
```
39-general-ecommerce-store/
├── index.html        # Modern storefront with 5 navigation sections
├── styles.css        # Slate/emerald e-commerce responsive styling
├── script.js         # Reactive cart, checkout engine, and faceted filtering
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: How does a progressive free-shipping threshold encourage higher average order value (AOV)?**  
*Answer:* By offering free shipping once an order exceeds a certain threshold (e.g., ₹1,000), shoppers are incentivized to add additional lower-cost items to their cart to avoid the delivery fee, increasing total revenue per transaction.

**Q2: What is the significance of the 4-stage tracking stepper in customer e-commerce portals?**  
*Answer:* The stepper provides transparent logistical progress (Order Placed $\rightarrow$ Packed $\rightarrow$ In Transit $\rightarrow$ Delivered), reducing customer service inquiries and improving delivery confidence.

**Q3: How are client-side product search queries optimized to avoid lag on large datasets?**  
*Answer:* On larger datasets, search queries should be debounced so the filter routine triggers only after the user stops typing (e.g., 300ms delay), rather than executing on every keystroke.
