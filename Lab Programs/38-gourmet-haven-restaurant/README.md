# Experiment 38: Gourmet Haven Fine Dining Restaurant

## 1. Aim
To design, engineer, and implement **Gourmet Haven**, an upscale fine dining restaurant web application featuring an ambiance carousel, an interactive seasonal à la carte menu categorized by course with dietary indicators, an instant table reservation engine with seating preference selection, chef bios, ambiance gallery, critic reviews, and a Maître d' management manifest.

---

## 2. Theoretical Architecture & System Design
- **Gastronomic Brand Aesthetics:** Dark luxury color scheme (obsidian `#0a0b0e` and gold `#d4af37`), high contrast hierarchy, and bespoke plating showcase.
- **Dynamic Menu Engine:** Categorized courses (Appetizers, Mains, Signatures, Desserts, Beverages) with real-time category filtering, price representation, and dietary taxonomy pills (Veg, Non-Veg, Gluten-Free, Sommelier Pairings).
- **Table Reservation System:**
  - Date input constrained to forward booking windows (preventing historic booking dates).
  - Multi-service allocation (Lunch Service, Prime Dinner Seating, Late Evening Lounge).
  - Spatial dining salon preferences (Main Dining Salon, Garden Terrace, Private Wine Vault, Chef Counter).
  - Unique cryptographically-inspired pass identifier generation (`GH-TABLE-XXXX`) paired with simulated QR boarding vouchers.
- **Maître d' Manifest & Ledger:** Administrative oversight tab enabling reception staff to monitor upcoming reservations and handle cancellations.

---

## 3. Algorithm

### Algorithm 1: Menu Categorization & Filter
1. **Input:** Course category filter string $C$ and menu array $M$.
2. **Evaluation:** For each dish record $d \in M$:
   $$\text{match}(d) = (C = \text{'All'}) \lor (d.\text{category} = C)$$
3. **DOM Synthesis:** Render cards containing title, price, descriptions, and dietary pills with active gold transitions.

### Algorithm 2: Table Reservation & Voucher Issue
1. **Input:** Date $D$, Time slot $T$, Party size $P$, Salon $S$, Guest name $G$, Contact $C$, Notes $N$.
2. **Validation:** Ensure $D \ge D_{\text{current}}$ and $G, C$ are non-empty strings.
3. **Voucher Reference Minting:**
   $$\text{VoucherID} = \text{'GH-TABLE-'} + \text{RandomInteger}(1000, 9999)$$
4. **State Commitment:** Create JSON reservation object and prepend to `gourmethaven_reservations` array in `labDB`.
5. **Output:** Render modal confirmation voucher with booking details and QR scan badge for printing.

---

## 4. Key Modules & Features
| Section | Description | Technical Implementation |
|---|---|---|
| **Ambiance Carousel** | Rotating showcase of restaurant spaces and vintages | Automated timer interval with dot markers |
| **Interactive Menu** | Course-wise browsing with dietary badges | Dynamic filtering and grid card layouts |
| **Table Booking** | Calendar and salon slot selector with instant pass | HTML5 date validation and modal voucher generator |
| **Culinary Heritage** | Executive Chef bios and philosophy | Responsive 2-column card layout |
| **Reviews & Critics** | Verified diner testimonials with 5-star badges | Flexbox rating displays |
| **Maître d' Ledger** | Administrative reservation manifest & cancellation | RBAC header switcher, data table with action triggers |

---

## 5. File Structure
```
38-gourmet-haven-restaurant/
├── index.html        # Fine dining web application interface
├── styles.css        # Obsidian/gold luxury restaurant styling
├── script.js         # Menu filter, table reservation engine, and manifest
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: How do reservation systems prevent double-booking or overcapacity in restaurant software?**  
*Answer:* Production booking engines maintain table inventory caps per service slot (e.g., maximum 40 covers for the 7:00 PM sitting). When bookings reach capacity for a given time window, that specific option is disabled in the dropdown or calendar picker.

**Q2: What is the purpose of dietary indicators (e.g., Veg, Non-Veg, Gluten-Free) in web menus?**  
*Answer:* Dietary indicators improve accessibility and user safety by clearly communicating allergen and lifestyle suitability, adhering to modern food safety regulations and guest dietary requirements.

**Q3: How are reservation tickets verified at the venue without requiring network roundtrips?**  
*Answer:* A digital QR pass containing the encrypted or signed booking identifier can be optically scanned by the Maître d' on a handheld device, verifying validity against the offline-synced manifest.
