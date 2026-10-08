# Experiment 11: Home Finder Real Estate Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, develop, and evaluate an online real estate property transaction platform providing residential and commercial listings, persistent buyer search criteria presets, an exact mathematical mortgage loan EMI calculator, site viewing schedulers, and administrative visitor traffic auditing.

---

## 2. Algorithm & Mathematical Formulation (Mortgage EMI)

### A. Algorithm
1. **Input Acquisition:** Read user-selected property criteria (location, property type, budget) or loan parameters (principal $P$, annual rate $R$, tenure in years $Y$).
2. **Preset Storage:** If saving criteria, serialize filter parameters and store them in `re_criteria` for quick retrieval.
3. **EMI Computation:**
   - Convert annual rate $R$ to monthly fractional rate $r = \frac{R}{12 \times 100}$.
   - Convert tenure in years to months $n = Y \times 12$.
   - Evaluate formula: $\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$.
   - Compute $\text{Total Payment} = \text{EMI} \times n$ and $\text{Total Interest} = \text{Total Payment} - P$.
4. **Schedule Viewing:** On appointment booking, link buyer details with the assigned property agent and store in `re_viewings`.
5. **Visitor Audit:** Persist visitor access telemetry to `re_visitors` for administrative analytics.

### B. Mathematical Formulation
The monthly Equated Monthly Installment (EMI) is calculated using the standard amortized loan formula:
$$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
Where:
- $P = \text{Principal Loan Amount (in ₹)}$
- $r = \frac{\text{Annual Interest Rate}}{12 \times 100} = \text{Monthly Compounding Interest Rate}$
- $n = \text{Tenure in Years} \times 12 = \text{Total Number of Monthly Installments}$
- $\text{Total Payment} = \text{EMI} \times n$
- $\text{Total Interest Payable} = \text{Total Payment} - P$

---

## 3. System Architecture & Components
1. **Property Buyer / Renter View:**
   - Multi-parameter filtering (Location, Property Type, Budget Bracket).
   - "Save Active Search Criteria" engine storing user query presets for one-click re-use.
   - Interactive home loan mortgage & EMI simulator with real-time recalculation.
   - Viewing scheduler linking buyers directly with property-assigned real estate brokers.
   - Certified Broker and Agency directory.
2. **Real Estate Agent View:**
   - Property listing creator (Title, Location, Square Footage, Price, Amenities).
3. **Platform Administrator View:**
   - Visitor tracking log recording customer names, viewing sessions, and IP/browser footprints.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `re_properties`, `re_criteria`, `re_viewings`, `re_agents`, `re_visitors`.

---

## 4. Input & Output Verification
- **Sample Input (EMI):** Principal $P = ₹65,00,000$, Rate $= 8.5\%$, Tenure $= 20\text{ years}$ ($n = 240\text{ months}$).
- **Calculation:**
  - $r = 8.5 / 1200 \approx 0.0070833$
  - $(1 + r)^{240} \approx 5.4299$
  - $\text{EMI} = \frac{6500000 \times 0.0070833 \times 5.4299}{4.4299} \approx ₹56,423/\text{month}$
- **Expected Output:** Live DOM display of monthly installment, total interest payable ($₹70,41,520$), and confirmed site viewing booking slip (`VISIT-XXX`).

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why does the system maintain persistent buyer search criteria in `localStorage`?**
   - **A:** Home searching is an iterative, multi-day process. Saving complex filter combinations (e.g., "OMR Chennai - 3BHK Apartment - Under 1 Crore") enables buyers to return to the site and re-execute searches in a single click without reconfiguring forms.
2. **Q: How does the platform track visitor leads without invasive tracking scripts?**
   - **A:** When a user schedules a property visit or views detailed listings, the application logs a non-invasive telemetry event (`session ID`, `user name/contact`, `property viewed`, `timestamp`) into the administrative audit collection.
