# Experiment 41: GourmetPlate Digital Recipe Book & Smart Culinary Assistant

## 1. Aim
To design, implement, and evaluate **GourmetPlate**, a digital recipe book platform featuring categorized culinary dishes by cuisine, dietary needs, and difficulty, a dynamic mathematical ingredient scaler based on custom serving sizes, step-by-step guidance with an interactive kitchen countdown timer, a weekly meal planning calendar, an aggregated grocery shopping list generator, and a personal recipe publisher.

---

## 2. Theoretical Architecture & System Design
- **Gastronomic Modeling & Data Schema:**
  - Recipes modeled with structured arrays of discrete ingredients `{ qty: Number, unit: String, item: String }` and ordered step sequences.
- **Dynamic Mathematical Ingredient Scaler:**
  - Recomputes ingredient proportions in real time when the user alters target serving counts:
    $$\text{Quantity}_{\text{scaled}} = \text{Quantity}_{\text{base}} \times \left(\frac{S_{\text{target}}}{S_{\text{base}}}\right)$$
- **Integrated Kitchen Countdown Timer:**
  - Real-time `setInterval` timer controlling boiling, baking, and sautéing stages with audio alert notifications upon completion.
- **Weekly Meal Planner & Aggregated Grocery Engine:**
  - 7-day calendar matrix allocating lunch and dinner selections.
  - Aggregates ingredients across planned meals into an interactive grocery checklist with print and custom item addition capabilities.
- **Personal Recipe Publishing:**
  - Enables home chefs to submit custom recipes parsed into scalable data objects committed to browser storage under `gourmetplate_`.

---

## 3. Algorithm

### Algorithm 1: Dynamic Ingredient Scaling
1. **Input:** Recipe $R$, base servings $S_{\text{base}}$, requested target servings $S_{\text{target}}$.
2. **Scale Factor Calculation:**
   $$\lambda = \frac{S_{\text{target}}}{S_{\text{base}}}$$
3. **Array Transformation:** For each ingredient $ing \in R.\text{ingredients}$:
   $$q_{\text{scaled}} = \text{round}(ing.\text{qty} \times \lambda, 1)$$
4. **DOM Update:** Re-render ingredient list showing new scaled quantities and units alongside the original ingredient names.

### Algorithm 2: Consolidated Grocery List Aggregation
1. **Input:** User selection to sync recipe or weekly meal planner to grocery list.
2. **Extraction:** Map ingredients of target recipes into grocery items array $G$.
3. **Commitment:** Update `gourmetplate_grocery` in `labDB` and refresh grocery badge count.

---

## 4. Key Modules & Features
| Module | Description | Technical Implementation |
|---|---|---|
| **Recipe Catalog** | Filter by Italian, Indian, Mexican, Asian, and Mediterranean | Multi-attribute array `.filter()`, cuisine pill tabs |
| **Ingredient Scaler** | Real-time proportional math scaling by serving size | Dynamic DOM recalculation with unit formatting |
| **Kitchen Timer** | Interactive minute-second countdown with alert | JavaScript `setInterval`, audio/alert modal notification |
| **Weekly Planner** | Monday-to-Sunday lunch and dinner allocation grid | JSON day-slot storage in `labDB` |
| **Smart Grocery List**| Aggregated shopping checklist with strike-through toggle | Interactive checkboxes, custom item addition, print view |
| **Recipe Creator** | Form to publish personal family recipes to catalog | Input string parsing and dynamic object creation |

---

## 5. File Structure
```
41-digital-recipe-book/
├── index.html        # Culinary recipe book with 5 navigation sections
├── styles.css        # Terracotta/warm slate responsive food styling
├── script.js         # Reactive scaler, timer, planner, and grocery engine
└── README.md         # Lab record documentation and viva preparation
```

---

## 6. Viva Questions & Answers
**Q1: Why is structured data representation (JSON) critical for dynamic ingredient scaling compared to raw unstructured text?**  
*Answer:* Structured representation separates numeric quantities, measurement units, and item names into distinct properties, enabling mathematical multipliers to operate cleanly on quantities without breaking prose sentences or misidentifying fractional measurements.

**Q2: What is the benefit of integrating a grocery shopping list directly with meal planning?**  
*Answer:* Direct grocery integration eliminates manual transcription errors and prevents food waste by consolidating exact ingredient portions required for the week's scheduled meals into a single actionable checklist.

**Q3: How does the kitchen countdown timer maintain state if a user changes tabs within the platform?**  
*Answer:* By operating through a central global JavaScript `setInterval` variable, the timer decrements the counter in background memory, updating the displayed clock whenever the active view renders.
