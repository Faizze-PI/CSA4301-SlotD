# Experiment 19: Veterinary Telehealth & Disease Analytics System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate a comprehensive veterinary teleconsultation platform allowing farmers and pet owners to transmit diagnostic multimedia symptoms (video, audio, photographic, and clinical text) to veterinarians, subscribe to free Government Civil Veterinary Hospitals (CVH) or pay private specialists via Bank Transfer / EasyPaisa, and perform spatial epidemiological analytics to identify regional livestock disease outbreaks.

---

## 2. System Architecture & Components
1. **Farmer & Pet Owner Module:**
   - Multi-species clinical symptom submission (Cattle, Buffalo, Goat, Dog, Cat, Poultry).
   - Multimedia diagnostic evidence transmission (lesion photos, rumination audio logs, gait videos).
   - Subscription routing: Free Government Civil Veterinary Hospitals (CVH) vs. fee-based private veterinary clinics.
   - Dual payment gateway integration (EasyPaisa mobile wallet / direct IMPS bank transfer).
   - Comprehensive Vetcure disease and first-aid encyclopedia with high-resolution imagery.
2. **Veterinary Doctor Console:**
   - Diagnostic case triage queue.
   - Clinical prescription formulation (confirmed diagnosis, dosage schedule, quarantine protocols).
   - Epidemic news and preventive livestock bulletin broadcast module.
   - Financial settlement profile management (Bank account and EasyPaisa credentials).
3. **Regional Disease Analytics Engine:**
   - Dynamic frequency distribution of livestock morbidities.
   - Geographic clustering identifying high-risk epidemic epicenters across agro zones.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `vet_doctors`, `vet_diseases`, `vet_cases`, `vet_news`.

---

## 3. Algorithm & Diagnostic Pipeline
1. **Telehealth Consultation State Machine:**
   $$\text{Farmer Upload} \longrightarrow \begin{cases} 
   \text{Govt. CVH} & \text{Auto-verify Free Coverage} \\ 
   \text{Private Clinic} & \text{Verify Bank Transfer / EasyPaisa UTR} 
   \end{cases} \longrightarrow \text{Clinical Review} \longrightarrow \text{Prescription Issued}$$
2. **Regional Outbreak Frequency Formulation:**
   $$\text{Prevalence}(D) = \frac{\sum \text{Reported Cases of Disease } D}{\text{Total Regional Diagnostic Cases}} \times 100\%$$

---

## 4. Input & Output Specifications
- **Input:** Animal species, clinical symptom observations, diagnostic media URL, attending veterinarian selection, payment reference (if private), doctor clinical prescription.
- **Output:** Registered case token (`VET-CASE-XXX`), official digital veterinary prescription, regional outbreak distribution bars, and health warning bulletins.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the system handle the pricing differentiation between Government CVHs and private veterinary practitioners?**
   - **A:** Government CVHs are enrolled under public animal husbandry schemes with zero consultation fees ($\text{Fee} = 0$), whereas private specialists specify consultation tariffs where the platform activates Bank Transfer and EasyPaisa transaction confirmation forms.
2. **Q: How does the regional disease analytics module assist veterinary public health authorities?**
   - **A:** By aggregating diagnostic reports by geographic cluster (e.g., Chengalpattu, Kanchipuram), the platform pinpoints emerging clusters of contagious zoonoses (such as Foot & Mouth Disease or Lumpy Skin Disease), enabling timely deployment of ring vaccination squads.
