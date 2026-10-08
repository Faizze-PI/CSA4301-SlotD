# Experiment 33: KodaikanalEats Dining & Room Stays Management Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an integrated hill station hospitality web platform facilitating local dining table reservations, multi-tier resort suite bookings (Single Room, Double Room, Deluxe Mountain-View Suite), dynamic seasonal tariff surge computations (+40% peak multiplier), and room attendant (room boy) staffing rosters.

---

## 2. System Architecture & Components
1. **Tourist & Vacationer Portal:**
   - Restaurant directory filterable by cuisine (South Indian & Chettinad, Continental Bakery, Tibetan Himalayan) and locality (Lake Road, Coaker's Walk, Upper Shola).
   - Table reservation system capturing party size, dining time slots, and seating views (balcony lake view, fireplace).
   - Resort suites catalog featuring room amenities, capacity limits, and seasonal surge badges.
   - Comprehensive stay booking form allowing selection of check-in dates, nights duration, and assignment of dedicated room attendants.
   - Digital voucher issuance with unique reference IDs (`VCHR-TBL-XXXX`, `VCHR-RM-XXXX`).
2. **Resort Operations & Hospitality Admin Console:**
   - Room boy & attendant staffing registry (staff ID, name, assigned suite tier, availability status toggle).
   - Central guest bookings ledger tracking covers and room occupancy.
   - Dynamic seasonality surge switch controlling a +40% tariff multiplier across all room inventory.
3. **Data Persistence (`shared/js/db.js`):**
   - Collections: `kodai_restaurants_v1`, `kodai_suites_v1`, `kodai_attendants_v1`, `kodai_bookings_v1`, `kodai_is_peak_season_v1`.

---

## 3. Algorithm & Logic
1. **Seasonal Room Tariff Formulation:**
   $$\text{Multiplier} = \begin{cases} 1.40 & \text{Peak Flower / Summer Season} \\ 1.00 & \text{Regular Off-Season} \end{cases}$$
   $$\text{Nightly Rate}_{\text{effective}} = \text{round}(\text{Base Price} \times \text{Multiplier})$$
   $$\text{Total Stay Tariff} = \text{Nightly Rate}_{\text{effective}} \times \text{Nights}$$

---

## 4. Input & Output Specifications
- **Input:** Restaurant filter selections, party headcount, dining slots, suite tier choice, check-in calendar dates, duration of stay, attendant assignment, season toggle.
- **Output:** Filtered restaurant cards, suite availability listings, itemized booking preview calculations, and printable hospitality vouchers.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why are seasonal surge pricing algorithms essential in hill station hospitality software?**
   - **A:** Hill station tourist destinations like Kodaikanal experience extreme demand fluctuations during summer vacation and seasonal flower blooms. Dynamic pricing multipliers optimize occupancy revenue during peaks while maintaining competitive off-season baseline pricing.
2. **Q: How does the platform coordinate room boy attendants with suite bookings?**
   - **A:** The booking engine reads available attendants from the live staffing ledger and associates a specific dedicated staff member to the guest's digital voucher, enabling prompt guest room service upon arrival.
