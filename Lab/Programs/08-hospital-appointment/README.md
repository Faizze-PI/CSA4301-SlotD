# Experiment 08: MedCare Hospital Online Appointment System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design and implement an online hospital appointment booking platform supporting doctor specialty searches, pre-visit digital check-in and medical triage forms, hospital branch GPS mapping, and medical administrative roster management.

---

## 2. System Architecture & Components
1. **Patient Web Portal:**
   - Multi-criteria doctor lookup (Specialty, Hospital Branch, Doctor Name).
   - Consultation scheduling modal with automated token generation (`MC-XXXX`).
   - Digital pre-visit triage check-in form collecting symptoms, duration, and known allergies.
   - Hospital locations directory with interactive coordinates map simulation.
2. **Hospital Branch View:**
   - Direct management of branch contact numbers, physical addresses, and emergency hotlines.
3. **Medical Administrator View:**
   - Doctor enrollment and consultation fee configuration.
   - Real-time patient volume and pre-check-in triage metrics.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `med_doctors`, `med_appointments`, `med_checkins`, `med_branches`.

---

## 3. Algorithm & Logic Flow
1. **Doctor Availability Filtering:**
   $$\text{Filtered Doctors} = \{ D \in \text{Doctors} \mid (D.\text{specialty} = S \lor S = \text{'all'}) \land (D.\text{branch} = B \lor B = \text{'all'}) \}$$
2. **Pre-Visit Check-In Synchronization:**
   - On submitting the triage questionnaire, find existing appointment where $A.\text{patientName} = \text{CheckIn}.\text{name}$.
   - Mutate $A.\text{checkedIn} = \mathbf{true}$, instantly alerting consulting physicians of early triage arrival.

---

## 4. Input & Output Specifications
- **Input:** Medical specialty selection, branch selection, appointment date/time, triage symptom answers.
- **Output:** Digital consultation token (`MC-XXXX`), verified check-in status badge, and GPS navigation data.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the digital pre-visit check-in form optimize clinical hospital operations?**
   - **A:** It records patient vitals and chief complaints before arrival, allowing medical staff to review histories in advance and prioritize triage queues.
2. **Q: How is data privacy preserved during medical appointment bookings?**
   - **A:** Patient identification and clinical records are partitioned into distinct relational entities with role-specific views preventing unauthorized cross-user inspections.
