# Experiment 01: Local Library Management System
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, develop, and implement a responsive web application for a local library management system providing a book catalog, user borrow/return tracking, overdue fine computation, and semester-wise academic material distribution with role-based access control (Librarian Admin & Student User).

---

## 2. System Architecture & Components
1. **Frontend Layer:** Semantic HTML5, CSS custom properties (`theme.css`), and responsive grid layout.
2. **Business Logic Layer:** JavaScript ES6 handling catalog search, fine calculation algorithms, loan duration management, and role state toggling.
3. **Data Persistence Layer:** Reactive client-side relational storage (`shared/js/db.js`) maintaining persistent collections for `library_books`, `library_borrows`, and `library_materials`.

---

## 3. Algorithm & Logic Flow
1. **Catalog Search & Filtering:**
   - Listen to text inputs and genre dropdown changes.
   - Filter `library_books` matching `title.includes(query)` or `author.includes(query)`.
2. **Issue Book:**
   - Verify available copies > 0.
   - Decrement book stock count by 1.
   - Calculate due date = `currentDate + 14 days`.
   - Insert borrow record with status `'Issued'`.
3. **Overdue Fine Computation:**
   - If `currentDate > expDate` and `status === 'Issued'`:
     $$\text{Overdue Days} = \lceil (\text{currentDate} - \text{expDate}) / (1000 \times 60 \times 60 \times 24) \rceil$$
     $$\text{Fine} = \text{Overdue Days} \times ₹5$$
4. **Return Book:**
   - Update borrow status to `'Returned'`.
   - Increment available stock copies by 1.

---

## 4. Input & Output Specifications
- **Input:** Book details (Title, Author, Genre, Copies), Search keywords, Student Registration Number, Loan Duration.
- **Output:** Filtered book grid, dynamic borrow history table with real-time fine counter, and download links for semester notes.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does the fine calculation algorithm prevent fines on already returned books?**
   - **A:** The system checks the `status` flag; if `status === 'Returned'`, the fine is automatically fixed at ₹0 regardless of the expiration date.
2. **Q: How is role-based access control simulated without a heavy backend?**
   - **A:** Using view-state management where role switches trigger display toggles between `#userSection` and `#adminSection`, with isolated DOM operations and event listeners.
3. **Q: How is data persisted when the browser is refreshed?**
   - **A:** Through HTML5 `localStorage` wrapped in the `LabDB` singleton, ensuring atomic JSON reads and writes.
