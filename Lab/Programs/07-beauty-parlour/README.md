# Experiment 07: Beauty Parlour Appointment Booking System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online salon appointment management portal supporting real-time stylist calendar slots, lockout of unavailable hours, full payment vs. 30% partial deposit checkout (Stripe/PayPal), auto-cancellation of unpaid bookings, and client SMS alert simulations.

---

## 2. System Architecture & Components
1. **Customer Web Portal:**
   - Catalog of beauty/spa treatments and senior stylist profiles.
   - Interactive calendar slot selection with instant lockout checks.
   - Dual payment options (100% Full Payment vs. 30% Partial Deposit).
   - Appointment history, rescheduling, cancellation, and customer reviews.
2. **Salon Manager & Staff Portal:**
   - Master staff reservations board.
   - Slot lockout interface (blocking specific stylists for leave or busy hours).
   - Automated batch cleanup to cancel unpaid bookings.
   - One-click client SMS dispatch.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `parlour_services`, `parlour_stylists`, `parlour_appointments`, `parlour_lockouts`, `parlour_reviews`.

---

## 3. Algorithm & Policy Flow
1. **Deposit Calculation:**
   $$\text{Deposit Amount} = \text{round}(\text{Service Price} \times 0.30)$$
   $$\text{Balance Due at Salon} = \text{Service Price} - \text{Deposit Amount}$$
2. **Calendar Slot Lockout Validation:**
   - When a booking is submitted for $(\text{Date } D, \text{Slot } S, \text{Stylist } T)$:
     - If $(\exists L \in \text{Lockouts} \mid L.date = D \land (L.stylist = T \lor L.stylist = 'ALL') \land (L.slot = S \lor L.slot = 'ALL')) \implies \mathbf{REJECT}$.
     - Else $\implies \mathbf{APPROVE}$ and record appointment.

---

## 4. Input & Output Specifications
- **Input:** Service selection, stylist selection, appointment date, time slot, payment mode.
- **Output:** Confirmed appointment token (`GL-XXX`), SMS dispatch alert, and updated staff calendar.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is partial deposit functionality essential for beauty parlour booking systems?**
   - **A:** Partial deposits (e.g. 30%) commit customers to attend their appointment while minimizing customer checkout hesitation, drastically reducing salon no-shows.
2. **Q: How does the application enforce lockout of unavailable hours?**
   - **A:** By querying the `parlour_lockouts` table against the requested stylist, date, and time slot before inserting a new appointment, rejecting conflicted bookings immediately.
