# Experiment 13: BlossomGifts Online Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online gifting and floral delivery platform supporting occasion and recipient filtering, customizable delivery date & time slot scheduling, email inquiries, and florist order logistics management.

---

## 2. System Architecture & Components
1. **Shopper Web Portal:**
   - Catalog filtering by Occasion (Birthday, Anniversary, Congratulations, Sympathy) and Recipient (For Her, For Him, For Family).
   - Delivery scheduler modal binding specific dates and time windows (Morning, Afternoon, Evening, Midnight Surprise) to individual cart items.
   - Dynamic basket management with real-time subtotal and grand total calculations.
   - Bulk corporate / custom inquiry submission form simulating direct florist email inquiries.
2. **Florist Administrator Portal:**
   - Fresh floral stock and pricing controller.
   - Order fulfillment state management (`Design Arranged` $\to$ `Out for Courier Dispatch` $\to$ `Hand-Delivered`).
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `gift_catalog`, `gift_cart`, `gift_orders`.

---

## 3. Algorithm & Policy Flow
1. **Delivery Slot Binding:**
   - Instead of a single delivery date for the entire cart, each item in `gift_cart` stores custom attributes: $(\text{Delivery Date}, \text{Delivery Slot})$.
   - This allows users to bundle separate gifts destined for different times (e.g. Midnight surprise delivery vs daytime party).
2. **Order State Transitions:**
   $$\text{Floral Design Arranged} \longrightarrow \text{Out for Courier Dispatch} \longrightarrow \text{Hand-Delivered to Recipient}$$

---

## 4. Input & Output Specifications
- **Input:** Occasion filter, recipient filter, gift item, delivery date/slot, recipient contact and address.
- **Output:** Live cart breakdown, confirmed gift order token (`BG-XXXX`), and florist tracking log.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the delivery scheduler handle date constraints for perishable floral goods?**
   - **A:** The date picker restricts selection to present or future dates (`min = tomorrow`) ensuring bouquets are cut and arranged fresh rather than attempting retrospective delivery.
2. **Q: How does the email inquiry form communicate with the administration?**
   - **A:** By capturing form parameters (Name, Email, Subject, Message) and transmitting them as asynchronous events to the platform's support inbox while presenting immediate feedback to the user.
