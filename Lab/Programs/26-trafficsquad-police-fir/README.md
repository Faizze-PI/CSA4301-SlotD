# Experiment 26: Traffic Squad E-Challan FIR & Penalty Management System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, develop, and test a web application for traffic police enforcement, digital FIR registration with photographic proof evidence, vehicle owner notice tracking, online penalty collection, and live metropolitan traffic advisory management.

---

## 2. System Architecture & Components
1. **Citizen / Vehicle Owner Portal:**
   - Registration search querying vehicle registration number or unique E-Challan notice reference.
   - Case detail viewer displaying offense location, timestamp, reporting officer badge, and statutory section under Motor Vehicles (Amendment) Act 2019.
   - Photographic ANPR/radar evidence viewer verifying the violation.
   - Payment gateway simulation with instant treasury clearance and printable tax receipt generation.
2. **Traffic Police Officer Console:**
   - Online FIR Case generation interface capturing vehicle registration, category, owner contact, offense type, statutory fine, location, and ANPR proof feed.
   - Comprehensive statutory penalty master chart viewer with violation sections, fine amounts, and seizure clauses.
   - Road advisory broadcasting tool for live congestion, accident, or roadwork alerts.
3. **Department Admin Dashboard:**
   - On-duty police officer registry with badge verification and filed case counts.
   - Real-time financial analytics displaying total cases logged, recovered penalties, and outstanding dues.
   - Violation category distribution chart for strategic enforcement deployment.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `traffic_challans_v1`, `traffic_officers_v1`, `traffic_bulletins_v1`.

---

## 3. Algorithm & Logic
1. **Statutory Fine Assignment:**
   $$\text{Fine}(\text{Offense}) = \begin{cases} 
   ₹1,000 & \text{Helmet / Signal / Triple / Seatbelt} \\
   ₹1,500 & \text{Mobile Phone Driving} \\
   ₹2,000 & \text{Over-Speeding} \\
   ₹5,000 & \text{Dangerous / One-Way Driving} \\
   ₹10,000 & \text{Driving Under Influence (DUI)}
   \end{cases}$$
2. **Treasury Revenue Aggregations:**
   $$\text{Revenue}_{\text{collected}} = \sum_{c \in \text{Challans}, c.\text{status} = \text{'Paid'}} c.\text{fine}$$
   $$\text{Revenue}_{\text{pending}} = \sum_{c \in \text{Challans}, c.\text{status} = \text{'Unpaid'}} c.\text{fine}$$

---

## 4. Input & Output Specifications
- **Input:** Vehicle registration plate number, offense category selection, incident location, ANPR snapshot source, citizen payment credentials.
- **Output:** Search results with photographic proof, filed FIR table, printable government treasury receipt, live traffic advisories, and administrative category metrics.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does photographic evidence improve the efficacy of e-challan systems?**
   - **A:** Attaching ANPR and junction CCTV camera snapshots provides undeniable photographic proof of the infraction (e.g. stop-line crossing, unfastened helmet), significantly reducing disputes, eliminating arbitrary officer citations, and accelerating fine settlement.
2. **Q: Why is digital penalty collection beneficial compared to spot cash collection?**
   - **A:** Digital collection ensures immediate treasury reconciliation, prevents leakage or corruption, generates an immutable audit trail with unique transaction IDs, and provides citizens with official printable tax receipts.
