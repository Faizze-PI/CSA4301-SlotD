# Experiment 05: Online Flight Reservation System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and validate an online flight reservation portal featuring multi-airline Global Distribution System (GDS) aggregation, cabin class filtering, seat selection, baggage tier add-ons, 6-character alphanumeric PNR generation, printable boarding passes, and customer flight reviews.

---

## 2. System Architecture & Components
1. **Passenger Travel Portal:**
   - Airport origin/destination search (IATA codes: MAA, DEL, BOM, BLR, DXB).
   - Cabin class multipliers (Economy, Premium Economy, Business).
   - Seat and baggage selection modal.
   - Print-ready digital boarding pass generator.
2. **Airline Administration Portal:**
   - Flight schedule creation and IATA city pair routing.
   - Real-time seat inventory decrements upon booking.
   - GDS operational and airline gross revenue reporting.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `flight_inventory`, `flight_bookings`, `flight_feedback`.

---

## 3. Algorithm & Logic Flow
1. **Dynamic Fare Pricing:**
   $$\text{Cabin Multiplier} = \begin{cases} 1.0 & \text{Economy} \\ 1.4 & \text{Premium Economy} \\ 2.5 & \text{Business} \end{cases}$$
   $$\text{Final Fare} = (\text{Base Fare} \times \text{Cabin Multiplier}) + \text{Baggage Fee}$$
2. **Airline PNR Token Generation:**
   - Sample 6 pseudo-random alphanumeric characters from the unambiguous character set:
     `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
3. **Boarding Pass Slip Generation:**
   - Renders a boarding pass containing IATA gate information, assigned seat code, passenger name, and flight number in an isolated print window.

---

## 4. Input & Output Specifications
- **Input:** Departure city code, Arrival city code, Cabin class, Passenger identity details, Seat and baggage choice.
- **Output:** Printable boarding pass with 6-character PNR, passenger feedback submission card, and admin aviation revenue stats.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: What role does a Global Distribution System (GDS) play in internet programming?**
   - **A:** A GDS functions as a centralized B2B computer network facilitating automated transactions between travel service providers (airlines, hotels) and travel booking engines by consolidating inventory, schedules, and fare tiers in real time.
2. **Q: How does the application prevent duplicate seat allocation in flights?**
   - **A:** The system validates remaining capacity (`seatsAvailable > 0`) before executing the transaction and decrements the inventory counter immediately upon confirming the ticket.
