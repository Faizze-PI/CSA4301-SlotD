# Experiment 43: PlacementPro Online Examination & Assessment System

## 1. Aim
To design, implement, and evaluate **PlacementPro**, a secure computer-based testing (CBT) online placement examination platform featuring timed assessment with real-time countdown, color-coded question palette navigation, automated evaluation and sectional scoring, merit pass list generation, student scorecards, a re-evaluation challenge desk, and placement directorate cutoff administrative controls.

---

## 2. Theoretical Architecture & System Design
- **Computer-Based Testing (CBT) Design:**
  - High-reliability stateful exam console preventing question loss during navigation.
  - Multi-section curriculum: Quantitative Aptitude & Reasoning, Data Structures & Algorithms, and Core Systems / Web Engineering.
- **Color-Coded Question Palette State Engine:**
  - Distinct visual markers:
    - **Green:** Answered and recorded.
    - **Orange / Amber:** Marked for review.
    - **Gray:** Unvisited.
    - **Blue Outline:** Currently displayed question.
- **Auto-Evaluation & Merit Generation:**
  - Immediately computes raw score out of 10, sectional accuracy percentages, and qualifying cutoff threshold status ($\text{Score} \ge \text{Cutoff} \implies \text{Qualified}$).
  - Updates cohort merit rankings with percentile formulations.
- **Academic Re-Evaluation Petition Desk:**
  - Formal submission channel for candidates to challenge question ambiguity or request manual key re-checks.
- **Admin Directorate Mode:**
  - Dynamic cutoff score configuration and CSV candidate roster export for corporate recruiters.

---

## 3. Algorithm

### Algorithm 1: Test Grading & Sectional Breakdown
1. **Inputs:** Student response map $U = \{q_0: a_0, q_1: a_1, \dots\}$ and question bank $Q$.
2. **Evaluation:** Iterate through each question $q_i \in Q$:
   - Increment domain count: $\text{domainCount}[q_i.\text{section}] {+}{=} 1$.
   - Check response correctness:
     $$\text{isCorrect} = (U[i] = q_i.\text{correct})$$
   - If true: increment raw score $\text{RawScore} {+}{=} 1$ and domain correct count $\text{domainCorrect}[q_i.\text{section}] {+}{=} 1$.
3. **Accuracy Formulation:**
   $$\text{Accuracy}(sec) = \left(\frac{\text{domainCorrect}[sec]}{\text{domainCount}[sec]}\right) \times 100$$
4. **Pass / Qualification Predicate:**
   $$\text{Status} = \begin{cases} \text{'QUALIFIED'} & \text{if } \text{RawScore} \ge \text{Cutoff} \\ \text{'NEEDS IMPROVEMENT'} & \text{otherwise} \end{cases}$$

### Algorithm 2: Palette State Update
1. **Trigger:** Question transition, option radio selection, or "Mark for Review" action.
2. **Evaluation:**
   $$\text{State}(i) = \begin{cases} \text{'review'} & \text{if } i \in \text{reviewFlags} \\ \text{'answered'} & \text{if } U[i] \neq \text{undefined} \\ \text{'unvisited'} & \text{otherwise} \end{cases}$$
3. **DOM Synthesis:** Update class attributes and live count metrics in the summary sidebar.

---

## 4. Key Modules & Features
| Module | Description | Technical Implementation |
|---|---|---|
| **Hall Ticket & Rules** | Candidate verification and exam guidelines | CSS Grid layout with QR code simulation |
| **Exam Console** | Timed CBT interface with 15-minute countdown | `setInterval` timer, auto-submit trigger |
| **Question Palette** | 10-question color-coded navigation grid | Stateful CSS classes, jump-to-index handler |
| **Scorecard** | Section breakdown, accuracy, and printable rank card | Dynamic calculation, `window.print()` styles |
| **Merit Pass List** | Cohort rank listing with status filters | Array `.sort()`, filter by cutoff threshold |
| **Re-Evaluation Desk**| Challenge submission with academic justification | Form validation, persistent petition store |
| **Directorate Admin** | Cutoff score modifier and CSV candidate export | LocalStorage state updates in `placement_cutoff` |

---

## 5. File Structure
```
43-online-placement-exam/
├── index.html        # Secure CBT examination interface with 6 tabs
├── styles.css        # Sapphire/slate academic testing design
├── script.js         # Reactive test engine, timer, auto-grading, and merit list
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: How do online exam systems handle client network disconnections during a live assessment?**  
*Answer:* Client-side assessment software periodically syncs candidate answers to browser storage (`localStorage` or IndexedDB) and dispatches asynchronous background heartbeat pings. If the network drops, answers remain cached locally and are committed immediately upon reconnection without student progress loss.

**Q2: What is the purpose of the "Mark for Review" status in competitive computer-based tests?**  
*Answer:* "Mark for Review" allows candidates to flag uncertain questions for later inspection without losing their currently selected tentative option, helping students effectively manage their test time across difficult sections.

**Q3: How is percentile rank defined mathematically in a student cohort?**  
*Answer:* A candidate's percentile rank represents the percentage of candidates in the tested cohort who scored below that candidate:
$$\text{Percentile} = \left(\frac{\text{Number of candidates scored below}}{\text{Total number of candidates}}\right) \times 100$$
