# Experiment 23: Blood Bank Management & Donor Information System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online blood bank and voluntary donor management information system enabling emergency donor discovery across ABO/Rh blood groups, automated 90-day cooling-period donation eligibility checks, digital donor card generation, and hospital blood centre inventory matrix monitoring.

---

## 2. System Architecture & Components
1. **Voluntary Donor & Public Recipient Module:**
   - Multi-group blood search ($A^+, A^-, B^+, B^-, AB^+, AB^-, O^+, O^-$) with district-level filtering.
   - Voluntary donor registration capturing age ($18-65$), minimum body weight ($\ge 50\text{ kg}$), and previous donation dates.
   - Automated 90-day biological donation interval validation.
   - Digital donor card generation with printable emergency contact credentials.
2. **Hospital Blood Transfusion Centre Module:**
   - Real-time 8-group component reserve matrix with single-click unit adjustments.
   - Critical reserve alerts triggering when group stock falls below safe operational levels ($<10\text{ units}$).
   - Blood requisition routing and direct emergency helpline integration.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `blood_donors`, `blood_banks`, `blood_hospital_stock`.

---

## 3. Algorithm & Eligibility Policy
1. **Biological Cooling Period Formulation:**
   $$\Delta t = \lfloor (\text{Current Date} - \text{Last Donation Date}) \text{ in days} \rfloor$$
   $$\text{Eligibility} = \begin{cases} 
   \text{Eligible} & \text{if } \Delta t \ge 90 \land \text{Age} \in [18, 65] \land \text{Weight} \ge 50\text{ kg} \\ 
   \text{Cooling Period} & \text{otherwise} 
   \end{cases}$$
2. **Transfusion Compatibility Invariant:**
   - Universal Donor: $O^-$ (Can safely donate to all recipient blood groups).
   - Universal Recipient: $AB^+$ (Can safely receive whole blood/RBC from all groups).

---

## 4. Input & Output Specifications
- **Input:** Blood group selection, district/city search string, donor registration parameters (age, weight, contact), hospital unit increment/decrement triggers.
- **Output:** Verified donor roster, cooling-period status badges, hospital inventory cards, and official printable digital donor cards.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is a minimum 90-day cooling period enforced between whole blood donations?**
   - **A:** The 90-day (approx. 12-week) interval allows the donor's bone marrow sufficient time to regenerate depleted erythrocytes (red blood cells) and restore iron and hemoglobin stores to physiologically healthy levels.
2. **Q: How does the system handle critical shortages for rare blood groups like O- or AB-?**
   - **A:** The hospital component matrix visually flags any blood group with fewer than 10 units in red alert status (`CRITICAL RESERVE`), prioritizing those groups in search results and prompting targeted donor requisition calls.
