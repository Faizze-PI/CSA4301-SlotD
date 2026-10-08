# Experiment 36a: EduConnect Online Teaching & Learning Platform

## 1. Aim
To design, develop, and implement **EduConnect**, a comprehensive and interactive online teaching and learning management platform that provides a course catalog, live virtual classroom simulation, study materials repository, auto-graded quizzes, weekly timetable scheduling, instructor course creation, and academic support helpdesk.

---

## 2. Theoretical Architecture & System Design
EduConnect bridges pedagogical requirements with modern client-server web architecture:
- **Role-Based Access Control (RBAC):** Distinct interfaces for **Student** (course discovery, live video viewer, quiz taking, certificate tracker), **Instructor** (course publishing, notes upload, roster oversight), and **Administrator** (curriculum audits, support triage).
- **Virtual Classroom Stream Simulator:** High-fidelity simulation of live video lectures featuring visual audio frequency waveforms, mic/cam state controllers, attendee rosters, and reactive two-way chat.
- **Auto-Grading Quiz Engine:** Timed question evaluation featuring real-time countdown, stateful choice persistence, score calculation, pass/fail thresholding (60%), and student record logging.
- **Course Scheduling & Timetable Matrix:** Structured weekly time allocation model preventing overlapping schedules.
- **Client-Side Persistence:** Local database engine (`shared/js/db.js`) handling dynamic courses, notes, enrollments, and support tickets under the `educonnect_` namespace.

---

## 3. Algorithm

### Algorithm 1: Course Enrollment & Allocation
1. **Input:** Course Identifier `courseId` selected by the active student.
2. **Fetch:** Retrieve current enrolled list from storage (`educonnect_enrolled`).
3. **Validation:** Check if `enrolledCourseIds.includes(courseId)`.
4. **Processing:**
   - If already enrolled, notify student and direct to live classroom.
   - If new enrollment, append `courseId` to array and commit to database (`labDB.set`).
5. **UI Update:** Re-render Course Catalog with "Go to Class" state and recalculate metrics in Student "My Learning" dashboard.

### Algorithm 2: Timed Assessment & Grading
1. **Input:** Student selected option indices $A = \{a_0, a_1, \dots, a_{n-1}\}$.
2. **Evaluation:** Iterate through assessment questions:
   $$\text{Score} = \sum_{i=0}^{n-1} \mathbb{I}(a_i = q_i.\text{correct})$$
3. **Percentage Formulation:**
   $$\text{Percentage} = \left(\frac{\text{Score}}{n}\right) \times 100$$
4. **Certification Verification:** If $\text{Percentage} \ge 60\%$, flag as `Passed` and authorize completion certificate generation.
5. **Output:** Render modal scorecard breakdown and log results to student academic profile.

---

## 4. Key Modules & Features
| Module | Description | Technical Implementation |
|---|---|---|
| **Course Catalog** | Filterable academic subjects by domain and keyword | DOM rendering, keyword query engine |
| **Virtual Classroom** | Simulated live stream with mic/cam controls and chat | HTML5 audio wave simulation, real-time message bus |
| **Downloadable Notes** | Unit-wise syllabus lecture notes and slide decks | Dynamic data table with size and date metadata |
| **Interactive Assessment** | Multi-choice timed evaluation with immediate scores | Timer `setInterval`, automated answer key comparator |
| **Time Management** | Weekly structured schedule for live classes & labs | Responsive day-slot CSS Grid matrix |
| **Instructor Studio** | Faculty course publication and study material uploader | Form serialization, dynamic DB insertion |
| **Support Helpdesk** | Issue tracking ticketing system with priority categorization | Auto-generated ticket IDs and status badges |

---

## 5. File Structure
```
36a-educonnect-online-lms/
├── index.html        # Unified interface with 8 functional learning tabs
├── styles.css        # Modern slate/indigo UI styling and responsive layouts
├── script.js         # Reactive course catalog, quiz engine, and simulation bus
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: What is the primary difference between synchronous and asynchronous e-learning platforms?**  
*Answer:* Synchronous learning happens in real-time where students and instructors interact simultaneously (e.g., live video lectures and webinars), whereas asynchronous learning allows students to access pre-recorded lectures, readings, and quizzes at their own pace.

**Q2: How does the client-side quiz auto-grading engine ensure data integrity?**  
*Answer:* Questions and answer keys are evaluated against stored state; scores are computed immediately upon time expiration or student submission and persisted via JSON serialization to avoid loss of attempt data.

**Q3: How are roles managed in EduConnect without a backend authentication server?**  
*Answer:* Through client-side Role-Based Access Control (RBAC) where switching the header selector alters available views, action permissions, and displayed user profiles while maintaining common access to shared course records.
