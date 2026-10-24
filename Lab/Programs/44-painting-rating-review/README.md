# Experiment 44: ArtSentiment Painting Rating & Review Platform

## 1. Aim
To design, implement, and evaluate **ArtSentiment**, a contemporary fine art gallery curation and review platform featuring painting uploads by gallery admins, customer star rating (1–5 stars) and written feedback submissions, dynamic real-time sentiment analysis summarizing positive and negative public perceptions, and curator moderation tools.

---

## 2. Theoretical Architecture & System Design
- **Exhibition Catalog Architecture:**
  - Dynamic painting showcase displaying medium, year, master artist, estimated value, and aesthetic descriptions.
- **Natural Language Sentiment Analysis Engine:**
  - Tokenizes review comments against positive aesthetic lexicon ($L_{\text{pos}}$) and critical/negative lexicon ($L_{\text{neg}}$):
    $$\text{Score} = \frac{\text{Count}(L_{\text{pos}}) - \text{Count}(L_{\text{neg}})}{\max\big(1, \text{Count}(L_{\text{pos}}) + \text{Count}(L_{\text{neg}})\big)}$$
  - Classifies user responses into **Positive**, **Neutral**, and **Negative** sentiment buckets combined with star ratings.
- **Curator Sentiment Intelligence Dashboard:**
  - Computes global sentiment ratios (e.g., 78% Positive, 14% Neutral, 8% Negative).
  - Renders a 5-star distribution histogram and semantic keyword polarity tag cloud.
- **Admin Moderation & Response Channel:**
  - Curators can post official gallery replies to visitor critiques, which are displayed inline with reviews.

---

## 3. Algorithm

### Algorithm 1: Lexicon Sentiment Decomposition
1. **Inputs:** Review string $T$ and star rating $R \in \{1, 2, 3, 4, 5\}$.
2. **Preprocessing:** Normalize string $T_{\text{norm}} = \text{toLowerCase}(T)$.
3. **Keyword Counting:**
   $$c_{\text{pos}} = \sum_{w \in L_{\text{pos}}} \mathbb{I}(w \in T_{\text{norm}}), \quad c_{\text{neg}} = \sum_{w \in L_{\text{neg}}} \mathbb{I}(w \in T_{\text{norm}})$$
4. **Classification Heuristic:**
   $$\text{Sentiment} = \begin{cases} \text{'Positive'} & \text{if } R \ge 4 \land c_{\text{pos}} \ge c_{\text{neg}} \\ \text{'Negative'} & \text{if } R \le 2 \lor c_{\text{neg}} > c_{\text{pos}} \\ \text{'Positive'} & \text{if } c_{\text{pos}} > c_{\text{neg}} \\ \text{'Neutral'} & \text{otherwise} \end{cases}$$
5. **Output:** Assign sentiment tag to review record and update artwork metrics.

### Algorithm 2: Dynamic Average Star Rating
1. **Input:** Array of reviews for painting $A$: $V = \{v_1, v_2, \dots, v_k\}$.
2. **Average Formulation:**
   $$\bar{R} = \frac{1}{k} \sum_{i=1}^k v_i.\text{rating}$$
3. **DOM Synthesis:** Format to 1 decimal place and render gold star badge.

---

## 4. Key Modules & Features
| Module | Description | Technical Implementation |
|---|---|---|
| **Art Exhibition** | Gallery display of classical and modern paintings | Card layouts, sentiment pill badges, and search filter |
| **Rating & Review** | 1-to-5 star selector with written critique input | Clickable font-awesome stars, sentiment auto-tagging |
| **Sentiment Intelligence**| Aggregate positive vs negative ratios and histogram | Dynamic percentage bars and sentiment tag cloud |
| **Admin Curator Desk** | Upload new artworks and post curator replies | Form serialization, `labDB` commit |

---

## 5. File Structure
```
44-painting-rating-review/
├── index.html        # Contemporary art exhibition interface with 3 tabs
├── styles.css        # Slate/rose gold fine art gallery styling
├── script.js         # Lexicon sentiment engine, rating calculator, and curator tools
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: How does automated lexicon-based sentiment analysis work in web applications without external machine learning APIs?**  
*Answer:* It matches words against pre-compiled positive and negative valence dictionaries. By calculating the difference between positive and negative term frequencies weighted against star ratings, it categorizes sentiment with low computational latency entirely in the client's browser.

**Q2: What is the benefit of aggregating sentiment for art curators and galleries?**  
*Answer:* Sentiment aggregation enables curators to identify which compositions resonate emotionally with audiences, providing quantitative guidance for future museum acquisitions, exhibition curation, and valuation.

**Q3: How are curator responses linked to customer reviews in the document store?**  
*Answer:* The response text is stored as a nested `response` property on the specific review object within the painting's review array in `labDB`, ensuring that replies render directly underneath the corresponding visitor critique.
