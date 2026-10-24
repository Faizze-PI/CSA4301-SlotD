# Experiment 16: ComplainEase Public Grievance Redressal Portal
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online civic grievance redressal and workflow tracking system supporting multi-category incident registration, interactive map geolocation pinning, field officer dispatch, cryptographic proof-of-work inspection, and citizen resolution feedback.

---

## 2. System Architecture & Components
1. **Citizen / User Module:**
   - Multi-category grievance registration (Roads, Drainage, Street Lights, Sanitation, Health).
   - Interactive spatial coordinate pinning on a simulated municipal grid map.
   - Live 4-stage tracking stepper (`Registered` $\to$ `Under Investigation` $\to$ `In Progress` $\to$ `Resolved`).
   - Incident photo evidence upload and verified resolution inspection.
   - Star-rating feedback module for completed cases.
2. **Field Officer Console:**
   - Ward-specific assigned task queue.
   - Status state-machine transitions.
   - Proof-of-work documentation (uploading post-resolution photographs and repair notes).
3. **Department Administrator Panel:**
   - Provisioning officer login credentials with departmental jurisdiction.
   - Full OES (Online Grievance System) authority (account creation, deletion, feature masking).
   - Central registry analytics, resolution metrics, and CSV reporting.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `complain_registry`, `complain_officers`, `complain_feedbacks`.

---

## 3. Algorithm & Policy Flow
1. **Lifecycle State Transition:**
   $$\text{Pending Triage} \xrightarrow{\text{Assign Officer}} \text{Under Investigation} \xrightarrow{\text{Deploy Crew}} \text{In Progress} \xrightarrow{\text{Proof of Work Uploaded}} \text{Resolved}$$
2. **Interactive Coordinate Mapping:**
   $$(\text{Click } X, Y) \implies \begin{cases} 
   \text{Latitude} = 13.0000 + (100 - Y_{\%}) \times 0.0012 \\
   \text{Longitude} = 80.2000 + X_{\%} \times 0.0010 
   \end{cases}$$

---

## 4. Input & Output Specifications
- **Input:** Department category, urgency rating, incident description, photo URL, spatial map pin, contact details, officer proof-of-work.
- **Output:** Unique tracking token (`GRV-XXXX`), live status progression timeline, before/after evidence cards, and officer performance ratings.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is proof-of-work mandatory before marking a grievance as 'Resolved'?**
   - **A:** Requiring photographic evidence and detailed field repair notes prevents fraudulent closures and ensures public accountability and transparent civic governance.
2. **Q: How does ComplainEase handle geographic jurisdiction allocation?**
   - **A:** Grievances logged with coordinates are mapped to municipal wards (e.g., Ward 14 & 15), automatically indexing the report to the corresponding zonal field officer.
