# Experiment 34: LearnWell Tuition Centre Management & Progress Portal
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an academic coaching centre management portal facilitating student online registration, dual-mode class delivery scheduling (Offline Smart Classroom vs Online Live Interactive), automated fee structure calculation, monthly/yearly progress card reporting, and facility maintenance ticketing.

---

## 2. System Architecture & Components
1. **Student & Parent Portal:**
   - Central announcement circular board tracking examination dates, timetables, and festival holiday sessions.
   - Comprehensive course offerings catalog with grade filters (Class 10 CBSE, Class 12 Science PCM+B, JEE/NEET Entrance) and delivery modes.
   - Profile enrollment module automatically issuing unique student enrollment tokens (`STU-XXXX`) and calculating first-month tuition totals.
   - Dynamic academic progress card displaying monthly unit test scores, percentage attainment, letter grades, and qualitative faculty feedback remarks.
   - Facility maintenance request desk for reporting classroom air-conditioning, projector, or meeting link faults.
2. **Faculty / Teacher Console:**
   - Test score evaluation recorder publishing grades directly to student progress cards.
   - Broadcast announcement tool for issuing homework revisions and schedule changes.
3. **Centre Administration Console:**
   - Enrolled student fee ledger tracking paid invoices and collection accounts.
   - Facility maintenance helpdesk queue for resolving classroom repair requests.
4. **Data Persistence (`shared/js/db.js`):**
   - Collections: `learnwell_courses_v1`, `learnwell_students_v1`, `learnwell_announcements_v1`, `learnwell_scores_v1`, `learnwell_maintenance_v1`.

---

## 3. Algorithm & Logic
1. **Automated Academic Letter Grade Formulation:**
   $$\text{Grade} = \begin{cases}
   \text{A+} & \text{Marks} \ge 90 \\
   \text{A} & 80 \le \text{Marks} < 90 \\
   \text{B+} & 70 \le \text{Marks} < 80 \\
   \text{B} & \text{otherwise}
   \end{cases}$$
2. **First-Month Enrollment Commitment:**
   $$\text{Gross Initial Fee} = \text{Monthly Subject Fee} + \text{Registration/Lab Fee (₹500)}$$

---

## 4. Input & Output Specifications
- **Input:** Student personal details, grade selection, subject bundle choice, classroom delivery mode, teacher marks inputs, facility maintenance descriptions.
- **Output:** Filtered course offering cards, student enrollment IDs, automated grade letters on report cards, circular notices, and administrative revenue summaries.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the system cater to dual-mode (online vs offline) educational delivery?**
   - **A:** The course schema explicitly tags every subject track as either offline (with physical centre hall allocations) or online (with video room URLs), allowing parents to filter and enroll students based on logistical convenience.
2. **Q: Why is an integrated maintenance request ticketing system vital in tuition centre administration?**
   - **A:** Physical classroom issues (faulty air conditioners, dim projectors) or digital streaming problems directly impact learning outcomes. Providing a structured reporting channel enables rapid resolution before evening batches commence.
