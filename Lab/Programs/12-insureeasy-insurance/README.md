# Experiment 12: InsureEasy Online Insurance Management Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online insurance management platform that provides policy comparison (Health, Auto, Home), policyholder claim submissions, agent commission calculations, automated SMS renewal alerts, and administrator agent authorization workflows.

---

## 2. System Architecture & Components
1. **Policyholder Portal:**
   - Multi-policy comparison matrix (Health, Motor, Home).
   - Digital policy purchase and certificate generation (`POL-XXX`).
   - Claim filing module capturing incident dates and estimated losses.
   - SMS alert notification inbox.
2. **Licensed Agent Portal:**
   - Client policy management dashboard.
   - 10% agent commission tracking engine:
     $$\text{Agent Commission} = \text{Annual Premium} \times 0.10$$
   - SMS dispatcher tool with customizable reminder templates (Upcoming Due, Overdue Grace, Renewal Confirmation).
3. **Platform Administrator Portal:**
   - Agent license approval gate verifying credentials prior to issuing client management rights.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `ins_plans`, `ins_policies`, `ins_agents`, `ins_sms`.

---

## 3. Algorithm & Policy Flow
1. **Agent Authorization Gate:**
   - Newly registered agents default to `approved: false`.
   - The Administrator inspects the agent license code (`IRDAI-AG-XXXXX`) and toggles approval status before client onboarding permissions are granted.
2. **SMS Alert Trigger:**
   - Agent selects a client whose due date is approaching.
   - The system formats a personalized SMS notification, recording the dispatch timestamp and forwarding it to the policyholder's notification inbox.

---

## 4. Input & Output Specifications
- **Input:** Plan selection, policyholder details, claim particulars, agent approval actions.
- **Output:** Policy enrollment slip, active claim tracking ticket (`CLM-XXXXX`), and policyholder SMS alert records.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does InsureEasy solve the inefficiencies of legacy manual insurance record keeping?**
   - **A:** Manual ledgers require substantial manpower to track expiration dates, calculate agent commissions, and send physical letters. InsureEasy automates commission accounting and triggers instant SMS renewal alerts.
2. **Q: How is agent authorization enforced in the application?**
   - **A:** Role states check the `approved` attribute in the agent collection. Agents awaiting validation remain locked in restricted mode until authorized by the platform administrator.
