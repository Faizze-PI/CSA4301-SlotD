# Experiment 09: TechSavvy Electronics Shopping Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and verify an e-commerce electronics shopping platform that models all **13 standard UML Use Cases**, supports categorized catalog browsing (Smartphones, Laptops, Tablets, Accessories), real-time cart manipulation, order status tracking, and administrative customer checkout auditing.

---

## 2. Formal Compliance with 13 UML Use Cases
| # | Use Case Name | Implementation Mechanism |
| :---: | :--- | :--- |
| **1** | **Visit a site** | Responsive homepage rendering category pills and featured electronics |
| **2** | **Login** | Dynamic role switcher and active user profile session |
| **3** | **Search for Items** | Instant text input filtering and subcategory selector |
| **4** | **Check Availability** | Real-time stock counters (`stock > 0` vs `Out of Stock`) |
| **5** | **Add Items to Cart** | One-click button appending product to `tech_cart` |
| **6** | **Edit Items in Cart** | Dedicated `+` and `-` quantity controls with reactive total calculation |
| **7** | **Remove Items from Cart** | Instant deletion button recalculating grand totals |
| **8** | **Check out Cart** | Capture customer name/email, issue Order ID, and clear cart |
| **9** | **Check Order Status** | Status tracker (`Order Placed` $\to$ `Packaging` $\to$ `Shipped`) |
| **10**| **Browse Order History** | Persistent historical orders table |
| **11**| **Display Item Details** | Modal dialogue rendering technical specifications and stock counts |
| **12**| **Logout** | Session switch resetting views to guest state |
| **13**| **Leave a site** | Clean exit hyperlink redirecting to the Master Lab Portal |

---

## 3. Algorithm
1. **Initialize State:** Load product catalog and active cart from client-side storage (`shared/js/db.js`).
2. **Catalog Browsing & Search:** On search keystroke or category click, apply case-insensitive matching against item title, brand, and category, and dynamically update DOM product cards.
3. **Cart Management:**
   - On 'Add to Cart', check stock availability, append item to `tech_cart`, and update cart counter badge.
   - On quantity changes (+/-), recalculate line item totals, tax estimates, and cart grand total.
   - On 'Remove Item', excise product from cart and trigger reactive UI refresh.
4. **Checkout Execution:** Validate customer checkout credentials (name, email, shipping address), generate unique order identifier (`TS-XXXX`), append to `tech_orders`, and reset cart.
5. **Administrative Auditing:** Populate admin dashboard with searchable historical customer order logs and financial turnover.

---

## 4. System Architecture & Components
1. **Shopper Web Portal:**
   - Popular categories strip (Smartphones, Laptops, Tablets, Accessories).
   - Real-time cart state with subtotal recalculation.
   - 13 UML Use Cases compliance verification view.
2. **Store Administrator Portal:**
   - Full CRUD over gadgets (Add item, adjust pricing, edit specifications, delete).
   - Customer checkout audit logs displaying purchaser contact details and spending totals.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `tech_categories`, `tech_gadgets`, `tech_cart`, `tech_orders`.

---

## 5. Input & Output Specifications
- **Input:** Search queries, category filters, cart quantity modifiers, checkout customer details.
- **Output:** Live filtered gadget grid, updated shopping cart total, order tracking confirmation (`TS-XXXX`), and administrative customer audit logs.

---

## 6. Lab Viva Voce Questions & Answers
1. **Q: What is a UML Use Case diagram, and why are 13 use cases enumerated for TechSavvy?**
   - **A:** A Use Case diagram depicts the functional interactions between external actors (User, Admin) and the software system. Enumerating all 13 interactions guarantees full-cycle coverage from site entry, discovery, acquisition, to checkout and administrative monitoring.
2. **Q: How does the administrative checkout audit log function?**
   - **A:** Upon checkout completion, the system creates a customer record linking their identity, contact information, ordered SKU list, and timestamp into `tech_orders`, allowing the administrator to inspect checkout trends without altering live inventory.
