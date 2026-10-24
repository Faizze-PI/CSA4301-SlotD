# Experiment 21: Online Job Recruitment Portal
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an online job recruitment and applicant tracking system (ATS) enabling applicants to search, bookmark, and apply for employment vacancies, allowing verified hiring directors to screen resumes and manage pipeline stages, and equipping administrators with corporate vetting and hiring audit controls.

---

## 2. System Architecture & Components
1. **Applicant / Job Seeker Module:**
   - Multi-parameter search by skill keyword, job category, and work location (Chennai, Bengaluru, Hyderabad, Remote).
   - Vacancy bookmarking and one-click application submission with expected CTC and portfolio URLs.
   - Live ATS application status tracker (`Applied` $\to$ `Shortlisted` $\to$ `Interview Scheduled` $\to$ `Rejected`).
   - Granular recruiter privacy controls (Public, Restricted, Confidential).
2. **Hiring Director / Corporate Recruiter Module:**
   - Job vacancy publication portal capturing title, category, location, salary range, and company logos.
   - Candidate resume screening queue with portfolio inspection and pipeline stage updates.
   - Vacancy lifecycle management (active vs. paused postings).
3. **System Administrator Console:**
   - Corporate hiring director verification and approval gate.
   - Comprehensive candidate registry and hiring funnel analytics reporting.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `job_vacancies`, `job_applications`, `job_saved`, `job_directors`.

---

## 3. Algorithm & Hiring Pipeline Workflow
1. **ATS Stage Transitions:**
   $$\text{Application Submitted} \longrightarrow \text{Recruiter Screening} \longrightarrow \begin{cases} 
   \text{Shortlist} \to \text{Interview Scheduled} \\ 
   \text{Reject} \to \text{Feedback Dispatched} 
   \end{cases}$$
2. **Faceted Search Intersection:**
   $$\text{Match} = (\text{Title} \lor \text{Desc} \lor \text{Company}) \cap (\text{Location} = \text{Target} \lor \text{All}) \cap (\text{Category} = \text{Target} \lor \text{All})$$

---

## 4. Input & Output Specifications
- **Input:** Search queries, location/category filters, vacancy parameters, application portfolio link, expected CTC, director screening decisions.
- **Output:** Categorized job rosters, submitted application receipts (`APP-XXX`), updated ATS status badges, and quarterly recruitment funnels.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is administrative approval necessary for hiring directors before they post vacancies?**
   - **A:** Pre-vetting recruiter accounts prevents fraudulent recruitment scams, fake job postings, and unauthorized harvesting of sensitive applicant personal data.
2. **Q: How does the privacy configuration feature benefit currently employed job seekers?**
   - **A:** Setting privacy to "Restricted" or "Confidential" shields the candidate's current employer information and contact details from unverified third parties until the candidate explicitly accepts a formal interview request.
