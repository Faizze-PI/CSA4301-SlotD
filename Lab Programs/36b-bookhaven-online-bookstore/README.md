# Experiment 36b: BookHaven Online Bookstore

## 1. Aim
To design and implement **BookHaven**, an online bookstore web application featuring a homepage with bestsellers carousel, catalog browsing with multifaceted filters, responsive shopping cart with coupon discounts, literary blog articles, customer support forms, FAQ accordions, and manager inventory desk.

---

## 2. Theoretical Architecture & System Design
- **Single Page Application (SPA) Design:** Tabbed modular navigation providing frictionless switching between storefront, catalog, editorial blog, helpdesk, and shopping cart.
- **Dynamic Catalog Engine:** Supports multi-criteria client-side filtering:
  - String pattern search across title and author.
  - Category / Genre segmentation (Fiction, Sci-Fi, Academic, Self-Help, Mystery).
  - Continuous price slider thresholding ($P \le \text{maxPrice}$).
  - Multi-property sorting (bestselling, ascending/descending price, star ratings).
- **Cart State Machine & Order Settlement:**
  - Dynamic item quantity adjustment $(q \ge 1)$ with zero-quantity auto removal.
  - Coupon evaluation engine supporting promotional discount formulation (`BOOKWORM10` = 10% off).
  - Automated printable invoice modal with unique order identifiers (`BH-XXXXXX`).
- **Store Manager RBAC Mode:** Reveals administrative catalog management allowing additions of new titles directly to the shared local storage database.

---

## 3. Algorithm

### Algorithm 1: Multifaceted Catalog Filtering
1. **Input:** Search term $S$, selected genre $G$, upper price bound $P_{\max}$, and sorting criterion $O$.
2. **Filter Predicate:** For each book $b$ in inventory $B$:
   $$\text{match}(b) = \Big(\text{includes}(b.\text{title}, S) \lor \text{includes}(b.\text{author}, S)\Big) \land (G = \text{'All'} \lor b.\text{genre} = G) \land (b.\text{price} \le P_{\max})$$
3. **Sort Order:**
   - If $O = \text{'price-asc'}$: sort in ascending order of price.
   - If $O = \text{'price-desc'}$: sort in descending order of price.
   - If $O = \text{'rating-desc'}$: sort by customer review score descending.
4. **Output:** Render matching card elements to DOM with book cover, author, rating, and add-to-cart buttons.

### Algorithm 2: Cart Calculation & Order Settlement
1. **Cart Subtotal:**
   $$\text{Subtotal} = \sum_{i=1}^m (item_i.\text{price} \times item_i.\text{qty})$$
2. **Promotional Discount:**
   $$\text{Discount} = \begin{cases} 0.10 \times \text{Subtotal} & \text{if coupon is 'BOOKWORM10'} \\ 0 & \text{otherwise} \end{cases}$$
3. **Net Total:**
   $$\text{Total} = \text{Subtotal} - \text{Discount}$$
4. **Order Commitment:** Generate unique timestamped order payload, prepend to orders ledger, empty active cart, and generate formatted printable tax invoice.

---

## 4. Key Modules & Features
| Section | Description | Technical Implementation |
|---|---|---|
| **Hero Carousel** | Rotating showcase of featured bestsellers and staff picks | Interval timer, transform transitions, active dot indicators |
| **Catalog Browser** | Real-time faceted search and slider filtering | Array `.filter()`, `.sort()`, dynamic DOM template strings |
| **Book Synopsis Modal** | Detailed overview with verified reader reviews | Modal overlay, rating stars, dynamic content injection |
| **Shopping Cart** | Reactive bag with increment/decrement and coupon | LocalStorage state updates, discount calculator |
| **Literary Blog** | Editorial articles on literature, interviews, and reading | Semantic card layouts, author and date metadata |
| **Inventory Desk** | Manager view for publishing new books to the storefront | RBAC header toggle, form serialization, DB commit |

---

## 5. File Structure
```
36b-bookhaven-online-bookstore/
├── index.html        # Clean, editorial online bookstore interface
├── styles.css        # Literary amber/navy theme, responsive cards, and modals
├── script.js         # Reactive cart state, carousel controller, and catalog filters
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: How does client-side search indexing differ from server-side database querying in e-commerce?**  
*Answer:* Client-side searching downloads a catalog dataset and filters in-memory using JavaScript array methods, providing instant zero-latency feedback for small-to-medium inventories. Server-side searching leverages indexed SQL or search engines (e.g., Elasticsearch) when dealing with millions of records to minimize payload transfer.

**Q2: What is the benefit of using an interactive range slider for price filtering?**  
*Answer:* An HTML5 `<input type="range">` provides an intuitive tactile interface for customers, triggering the `input` event to re-evaluate the price threshold continuously without page reloads.

**Q3: How is persistent cart storage handled across browser tabs and refreshes?**  
*Answer:* Cart items are serialized into a JSON array and written to the browser's persistent `localStorage` via `labDB.set()`. Upon page reload, the state is retrieved and rehydrated into memory.
