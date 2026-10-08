# Experiment 03: Online Bus Ticket Booking System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design and build an online bus ticket booking platform supporting route search, category customization (Volvo, Sleeper, Seater), visual seat layout matrix selection, PNR ticket issuance, cancellations, passenger feedback, and administrative revenue analytics.

---

## 2. System Architecture & Components
1. **Passenger Client View:**
   - Origin/destination route search engine.
   - Interactive 2D Seat Matrix (aisle separation, real-time availability states).
   - Passenger details capture, PNR generation, and ticket cancellation.
   - Passenger rating & comment forum.
2. **Administrator View:**
   - Bus category configuration (Volvo Multi-Axle, AC Sleeper, etc.).
   - Route and fleet schedule management.
   - Live revenue metrics & printable tabular reporting.
3. **Data Storage (`shared/js/db.js`):**
   - Collections: `bus_categories`, `bus_fleet`, `bus_tickets`, `bus_comments`.

---

## 3. Algorithm & Logic Flow
1. **Interactive Seat Selection & Booking:**
   - Render $N$ seat buttons corresponding to bus capacity.
   - Flag seats present in `bus.bookedSeats` as disabled (`.booked`).
   - On clicking an available seat, toggle `.selected` class and update the selected seats array:
     $$\text{Total Fare} = |\text{Selected Seats}| \times \text{Unit Seat Fare}$$
2. **Ticket Confirmation & PNR Generation:**
   - Generate unique 5-digit PNR string: `CE-XXXXX`.
   - Append selected seats to the bus's `bookedSeats` list to lock availability.
3. **Cancellation & Inventory Release:**
   - Update ticket status to `'Cancelled'`.
   - Remove the cancelled seat numbers from the bus's `bookedSeats` array, immediately restoring seat availability.

---

## 4. Input & Output Specifications
- **Input:** Origin city, Destination city, Journey Date, Seat selection, Passenger details.
- **Output:** Printable digital e-ticket with PNR, updated seat layout map, and administrative operations report.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the application ensure two users cannot book the same seat simultaneously?**
   - **A:** The system checks the `bookedSeats` array in the database record prior to confirming the transaction; any seat already present in `bookedSeats` cannot be re-reserved.
2. **Q: How is seat layout visualization implemented using CSS?**
   - **A:** Using CSS Grid with 4 columns (`grid-template-columns: repeat(4, 1fr)`), where the second seat in each row (`:nth-child(4n-2)`) has a right margin simulating the bus walking aisle.
