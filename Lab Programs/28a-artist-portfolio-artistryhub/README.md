# Experiment 28a: ArtistryHub - Emily Harris Artist Portfolio & Exhibition Studio
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate an interactive, multimedia-rich portfolio web application celebrating the works, monographs, discography, and exhibitions of renowned artist Emily Harris, featuring dynamic categorization, audio soundscape streaming, museum print commerce, and curator dispatch routing.

---

## 2. System Architecture & Components
1. **Art Lover & Collector Portal:**
   - Visual arts gallery filterable by medium (Oil on Canvas, Modern Abstract, Charcoal & Ink) with dimensional metadata and high-contrast previews.
   - Interactive studio audio player streaming ambient sonic soundscapes composed to accompany visual collections.
   - Formal scholarly bibliography and discography table detailing monographs, exhibition catalogues, publishers, and ISBN/UPC registry keys.
   - International exhibition calendar timeline and press review quotes.
   - Studio Print Store enabling purchase of limited-edition museum archival giclée prints with shopping cart state.
   - Fan message, gallery loan proposal, and private commission dispatch form.
2. **Artist Admin Console (Emily Harris Studio):**
   - Artwork archiving module for adding new paintings with mediums, dimensions, and descriptions.
   - Inbound curator and collector inquiries management inbox.
   - Studio inventory and metric trackers.
3. **Data Persistence (`shared/js/db.js`):**
   - Collections: `artistry_artworks_v1`, `artistry_messages_v1`, `artistry_cart_v1`.

---

## 3. Algorithm & Design Decisions
1. **Multimedia Synchronization:**
   - Synchronizes ambient acoustic playback duration timers with progress bar indicators, demonstrating client-side media simulation.
2. **Cart State Aggregations:**
   $$\text{Cart Headcount} = \sum_{i \in \text{Cart}} i.\text{qty}$$
   $$\text{Gross Total} = \sum_{i \in \text{Cart}} (i.\text{price} \times i.\text{qty})$$

---

## 4. Input & Output Specifications
- **Input:** Portfolio category filter, audio track selection, print purchase requests, artwork submission parameters, booking proposal fields.
- **Output:** Categorized art cards, ambient audio playback, interactive shopping cart modal, and archival monograph references.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: Why are audio players and soundscapes incorporated into modern digital fine art portfolios?**
   - **A:** Contemporary visual artists frequently craft multisensory installations where acoustic compositions or binaural field recordings provide auditory context to large-scale physical canvases. Embedding an audio player elevates digital engagement.
2. **Q: How does the platform organize diverse media outputs like books, prints, and paintings?**
   - **A:** The system decouples the presentation layer into tabbed architectural facets: visual pieces in the portfolio grid, literary monographs in the formal bibliography table, soundscapes in the audio deck, and commercial editions in the giclée print store.
