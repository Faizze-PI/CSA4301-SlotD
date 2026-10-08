# Experiment 30: IJSSE Scopus Journal Publishing & Editorial Management Portal
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate a scholarly journal publishing platform for the International Journal of Scientific and Social Excellence (IJSSE, Print ISSN 2395-1443, Online ISSN 2395-1451), featuring manuscript submission and tracking, double-blind peer reviewer scoring, chief editorial decisions, DOI generation, and Open Access issue archiving.

---

## 2. System Architecture & Components
1. **Author Management Portal:**
   - Manuscript submission form capturing paper title, discipline track, author affiliation, abstract, and keywords.
   - Real-time submission tracker displaying manuscript progress stages: `Under Review` $\rightarrow$ `Revision Required` $\rightarrow$ `Published`.
   - Author instruction guidelines, Turnitin plagiarism thresholds, and Article Processing Charge (APC) fee schedule (₹3,000 INR / $50 USD).
   - Word template and copyright transfer agreement download portal.
2. **Double-Blind Peer Reviewer Console:**
   - Dedicated review evaluation form assessing technical rigor (1-10), novelty (1-10), publication recommendation, and confidential editor remarks.
3. **Chief Editorial Board Dashboard:**
   - Master submissions ledger coordinating referee assignments.
   - Editorial decision engine supporting manuscript acceptance, rejection, volume assignment, and automated DOI minting (`10.5281/ijsse.2026.XXX`).
4. **Current Issue & Archival Directory:**
   - Volume 12, Issue 4 open-access publication repository with full citation metadata and simulated PDF downloads.
5. **Data Persistence (`shared/js/db.js`):**
   - Collection: `ijsse_manuscripts_v1`.

---

## 3. Algorithm & Logic
1. **Composite Reviewer Scoring:**
   $$\text{Score}_{\text{composite}} = \frac{\text{Rigor Score} + \text{Novelty Score}}{2}$$
2. **DOI Minting Formulation:**
   $$\text{DOI} = \text{"10.5281/ijsse.2026."} + \text{Manuscript ID}_{\text{suffix}}$$

---

## 4. Input & Output Specifications
- **Input:** Manuscript metadata, abstract text, author affiliation credentials, referee evaluation scores, editorial publication decisions.
- **Output:** Trackable author paper cards, scored peer review matrices, official publication certificates with DOIs, and volume archives.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why are ISSN identifiers and DOIs critical in scholarly web publishing?**
   - **A:** The International Standard Serial Number (ISSN) uniquely identifies the serial publication worldwide (print vs online editions), while Digital Object Identifiers (DOIs) provide persistent, actionable citable links guaranteed by CrossRef and scholarly indexers like Scopus.
2. **Q: How does a double-blind peer review system maintain academic integrity?**
   - **A:** Reviewers evaluate the scientific methodology and contribution without seeing author affiliations or names, mitigating institutional bias and ensuring impartial meritocratic evaluation.
