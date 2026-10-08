# Experiment 14: ReNewMarket C2C Second-Hand Goods Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and validate a Consumer-to-Consumer (C2C) peer-to-peer marketplace application enabling users to list pre-owned goods with item condition ratings, negotiate and submit purchase offers, and allow platform administrators to moderate listings for fraud prevention.

---

## 2. System Architecture & Components
1. **Buyer & Seller Marketplace Portal:**
   - Multi-category catalog filtering (Electronics, Furniture, Books, Vehicles, Fashion).
   - Item condition grading: *Brand New*, *Like New*, *Good Condition*, *Fair*.
   - Dynamic listing creation form with item photographs, descriptions, pricing, and seller contact information.
   - Interactive offer negotiation modal allowing prospective buyers to place counter-offers or make direct inquiries.
2. **Moderator & Admin Portal:**
   - Listing verification queue to approve, reject, or flag suspicious or counterfeit postings.
   - System audit log for peer-to-peer transactions and offer states (*Pending*, *Accepted*, *Countered*, *Rejected*).
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `renew_items`, `renew_offers`, `renew_inquiries`.

---

## 3. Algorithm & Negotiation Flow
1. **Item Submission & Quality Grading:**
   $$\text{Seller Form} \xrightarrow{\text{Validate Attributes}} \text{Assign Condition Score} \xrightarrow{\text{Verification Check}} \text{Published Catalog}$$
2. **Offer Negotiation Protocol:**
   $$\text{Buyer Offer} \to \text{Seller Notification} \to \{\text{Accept} \mid \text{Counter} \mid \text{Reject}\} \to \text{Transaction Clearance}$$

---

## 4. Input & Output Specifications
- **Input:** Item category, title, description, asking price, condition level, seller details, buyer offer amounts.
- **Output:** Categorized item listings, dynamic price negotiation status logs, and verified purchase receipts.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: What is the primary difference between B2C and C2C eCommerce models implemented in ReNewMarket?**
   - **A:** B2C involves enterprise vendors retailing to end consumers with standardized inventory, whereas C2C enables private individuals to both list inventory and transact with other consumers, requiring reputation and moderation mechanisms.
2. **Q: How does the system handle anti-scam and content moderation for user-submitted listings?**
   - **A:** Listings are passed through verification status flags (`Verified`, `Pending Review`, `Flagged`) where moderators inspect suspicious price anomalies, disallowed keywords, and unverified seller accounts before making items publicly discoverable.
