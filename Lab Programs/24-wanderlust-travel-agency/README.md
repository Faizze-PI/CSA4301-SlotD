# Experiment 24: Wanderlust Travels Agency Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online travel agency and tour package booking platform supporting curated holiday itineraries, multi-tier meal plan catering (CP, MAP, AP), partner resort/hostel reservations, dynamic group fare computations, and digital travel voucher issuance.

---

## 2. System Architecture & Components
1. **Traveler / Vacationer Module:**
   - Holiday package catalog with destination filters (Ooty, Munnar, Kodaikanal, Goa) and duration selectors (3D/2N, 4D/3N).
   - Day-by-day interactive itinerary viewer displaying sightseeing points, road transit legs, and included meals.
   - Partner accommodation directory featuring colonial tea bungalows, eco-resorts, and boutique lodges with amenity badges.
   - Comprehensive catering meal plans (Bed & Breakfast CP, Half Board MAP, Full Board AP).
   - Dynamic booking calculator with travel voucher issuance (`WNDR-VCHR-XXX`).
2. **Travel Agency Admin Console:**
   - Tourism package authoring interface capturing scenic photography, destination landmarks, and base tariffs.
   - Central booking ledger with customer traveler counts, departure dates, and aggregate agency turnover metrics.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `tour_packages`, `tour_hotels`, `tour_dining`, `tour_bookings`.

---

## 3. Algorithm & Pricing Architecture
1. **Total Tour Fare Formulation:**
   $$\text{Base Cost} = \text{Package Price} \times \text{Traveler Count}$$
   $$\text{Addon Cost} = (\text{Meal Surcharge} + \text{Room Tier Surcharge}) \times \text{Traveler Count}$$
   $$\text{Grand Total} = \text{Base Cost} + \text{Addon Cost}$$
2. **Meal Plan Taxonomy:**
   - **CP (Continental Plan):** Bed & Breakfast ($\text{Surcharge} = \text{₹}0$).
   - **MAP (Modified American Plan):** Breakfast + Dinner ($\text{Surcharge} = \text{₹}600/\text{pax}$).
   - **AP (American Plan):** All meals included ($\text{Surcharge} = \text{₹}1,200/\text{pax}$).

---

## 4. Input & Output Specifications
- **Input:** Destination search string, duration filter, departure date, group headcount, meal plan selection, room tier preference, admin package attributes.
- **Output:** Curated tour cards, day-by-day sightseeing timelines, breakdown receipts, and official printable travel vouchers.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: What is the industry significance of hotel meal plans (CP, MAP, AP) in travel agency software?**
   - **A:** Standardized meal plans allow travel aggregators to offer flexible pricing models suited to traveler styles—CP for independent day-explorers, MAP for sightseers returning for evening meals, and AP for remote resort stays where dining outside is impractical.
2. **Q: How does the system ensure transparency for group travelers?**
   - **A:** The booking modal dynamically multiplies both the package base fare and individual surcharges across the traveler count ($\text{pax}$), rendering a clear itemized breakdown before issuing the confirmed voucher.
