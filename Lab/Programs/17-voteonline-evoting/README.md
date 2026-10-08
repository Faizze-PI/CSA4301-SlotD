# Experiment 17: VoteOnline Secure E-Voting Platform
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, develop, and evaluate a secure, tamper-evident electronic voting platform featuring dual-step OTP multi-factor authentication, ward-based constituency candidate allocation, double-voting prevention, VVPAT digital cryptographic receipts, and real-time election tally analytics.

---

## 2. System Architecture & Components
1. **Voter Authentication & Secret Ballot:**
   - Step 1: Voter ID (EPIC) registry verification against the official electoral roll.
   - Step 2: One-Time Passcode (OTP) phone validation to unlock the private digital ballot room.
   - Constituency / Ward-specific candidate roster filtering (preventing out-of-ward voting).
   - Candidate selection and second-factor confirmation OTP prior to irreversible ballot signing.
   - Digital Voter Verifiable Paper Audit Trail (VVPAT) with deterministic cryptographic verification hash.
2. **Election Commission / Admin Panel:**
   - Candidate registration, party affiliation, and electoral symbol binding.
   - Electoral roll management (voter enrollment, ward allocation, and eligibility audit).
   - Live turnout monitoring and official certified results tally.
3. **Database Layer (`shared/js/db.js`):**
   - Collections: `vote_voters`, `vote_candidates`, `vote_receipts`.

---

## 3. Algorithm & Cryptographic Flow
1. **Double-Voting Prevention Invariant:**
   $$\forall v \in \text{Voters}, \quad \text{hasVoted}(v) = \text{true} \implies \text{BallotSubmission}(v) = \text{Blocked}$$
2. **Deterministic VVPAT Hash Signature:**
   $$\text{Hash} = \text{FNV-1a}\Big(\text{VoterID} \parallel \text{CandidateID} \parallel \text{Timestamp} \parallel \text{SecretKey}\Big)$$

---

## 4. Input & Output Specifications
- **Input:** Voter ID, mobile number, 6-digit login OTP, candidate selection, 6-digit final ballot OTP, admin candidate details.
- **Output:** Authorized electronic ballot, verifiable VVPAT token (`VVPAT-XXXXXX`), live ward tally bars, and certified winner declarations.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does VoteOnline ensure the fundamental principle of secret balloting while maintaining auditability?**
   - **A:** While the voter registry records that an elector has exercised their franchise (`hasVoted = true`), the official VVPAT digital receipt encrypts candidate association using a cryptographic hash token, allowing the voter to verify their participation without publicly broadcasting their candidate choice.
2. **Q: Why is dual-step OTP authentication critical for remote electronic voting?**
   - **A:** Step 1 authenticates the identity of the person logging in with the Voter ID, while Step 2 confirms the voter's explicit, deliberate decision at the moment of casting the ballot, preventing session hijacking or unauthorized auto-submission.
