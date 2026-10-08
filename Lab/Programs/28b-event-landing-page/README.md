# Experiment 28b: Single Event Landing Page & Registration Portal
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate a single event landing page for a flagship technology conference (NexusTech 2026), structured into distinct visual chunks showcasing event purpose, audience target segments, distinguished speaker line-ups, detailed schedule timetables, logistics, and an interactive delegate registration modal issuing printable QR event badges.

---

## 2. System Architecture & Components
1. **Header & Hero Banner:**
   - Event branding, theme definition, venue locator, and real-time days countdown indicator.
2. **Chunk 1 - Purpose & Audience Matrix:**
   - Tri-pillar audience categorization tailored for AI/ML researchers, cloud DevOps architects, and startup founders.
3. **Chunk 2 - Keynote Speakers Lineup:**
   - Speaker portrait cards, industrial roles, keynote lecture abstracts, and external profile routing.
4. **Chunk 3 - Comprehensive Schedule & Agenda:**
   - Sequential 2-day timetable featuring keynote addresses, parallel workshop tracks, luncheons, and startup pitch awards.
5. **Chunk 4 - Venue & Logistics:**
   - SIMATS Grand Auditorium complex information, airport/metro transit logistics, and navigational GPS coordinates.
6. **Delegate Registration Engine & Badge Issuance:**
   - Interactive modal supporting multi-tier pass categories (Student Pass, General Professional, VIP Executive).
   - Generates an official printable convention pass badge with delegate identification and 2D QR validation code.
7. **Organizer / Admin Console:**
   - Attendee ledger displaying registration credentials, organization affiliation, and gate check-in status toggles.
8. **Data Persistence (`shared/js/db.js`):**
   - Collection: `nexustech_attendees_v1`.

---

## 3. Algorithm & Design Decisions
1. **Dynamic Pass Pricing:**
   $$\text{Registration Fee} = \begin{cases}
   ₹499 & \text{Student Delegate Pass} \\
   ₹1,999 & \text{General Professional Pass} \\
   ₹4,999 & \text{VIP Executive All-Access}
   \end{cases}$$
2. **Section Chunking:**
   - Adheres to web design best practices by dividing the event layout into modular thematic chunks with distinct backgrounds, typographic hierarchy, and responsive grid layouts.

---

## 4. Input & Output Specifications
- **Input:** Delegate name, work email, organization, job title, pass tier selection, workshop track preference.
- **Output:** Live countdown banner, speaker dossiers, chronological timeline, printable QR badges, and administrative attendance logs.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why is modular "chunking" critical in high-converting event landing pages?**
   - **A:** Chunking prevents cognitive overload by segmenting complex conference information (speakers, schedule, logistics, tickets) into digestible visual units, boosting readability and conversion rates.
2. **Q: How does the system manage event check-ins without third-party services?**
   - **A:** It issues unique digital badges with client-rendered QR tokens and stores registration state in local persistence, allowing organizers to toggle check-in statuses at entry gates directly from the administrative view.
