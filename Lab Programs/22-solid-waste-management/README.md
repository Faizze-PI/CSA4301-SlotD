# Experiment 22: Solid Waste Management & Fleet Route Optimization
**Course:** CSA4301 - Internet Programming Lab | SIMATS Engineering

---

## 1. Aim
To design, implement, and evaluate a municipal solid waste tracking and logistics management platform featuring ultrasonic smart dustbin fill level telemetry, civic waste grievance lodging with photographic evidence, dynamic shortest-path waypoint route generation for compactor trucks, and driver clearance load tracking to sanitary landfills.

---

## 2. System Architecture & Components
1. **General Public Module:**
   - Civic waste reporting portal (overflowing dustbins, illegal debris, hazardous medical waste).
   - High-resolution photographic evidence upload and exact landmark logging.
   - Interactive ward-level smart dustbin telemetry grid showing real-time capacity and fill percentages.
2. **Sanitation Compactor Truck Driver Console:**
   - Multi-waypoint route sequence linking Depot $\to$ Critical Bins ($\ge 80\%$) $\to$ Regional Landfill.
   - Mechanical compactor arm lifting simulation that empties bins, resets fill levels to 0%, and logs collected tonnage.
   - Landfill offload action restoring compactor capacity.
3. **Municipal Administration Dashboard:**
   - Smart dustbin provisioning (wet biodegradable, dry recyclable, e-waste).
   - Real-time fleet tracking and daily evacuation tonnage audit.
   - Public complaint assignment and resolution tracking.
4. **Database Layer (`shared/js/db.js`):**
   - Collections: `waste_bins`, `waste_complaints`, `waste_driver_load`.

---

## 3. Algorithm & Optimization Strategy
1. **Critical Evacuation Invariant:**
   $$\text{Bin Priority} = \begin{cases} 
   \text{Urgent Evacuation (Red)} & \text{if } \text{Fill} \ge 80\% \\ 
   \text{Moderate Surveillance (Amber)} & \text{if } 50\% \le \text{Fill} < 80\% \\ 
   \text{Normal (Green)} & \text{if } \text{Fill} < 50\% 
   \end{cases}$$
2. **Compactor Fleet Route Formation:**
   $$\text{Route Path} = \Big[\text{Depot}\Big] \cup \text{SortByDistance}\Big(\{b \in \text{Bins} \mid \text{Fill}(b) \ge 80\%\}\Big) \cup \Big[\text{Landfill}\Big]$$

---

## 4. Input & Output Specifications
- **Input:** Waste incident category, severity rating, location landmark, photo URL, driver collected load tonnage, admin bin provisioning data.
- **Output:** Color-coded fill level gauges, grievance tracking ticket (`WST-XXX`), visual route map waypoint paths, and landfill clearance confirmations.

---

## 5. Lab Viva Voce Questions & Answers
1. **Q: How does ultrasonic sensor monitoring optimize municipal fuel expenditure?**
   - **A:** Instead of sending compactor trucks on rigid, pre-timed daily routes where many bins are half-empty, the system dynamically routes trucks only to bins exceeding the critical threshold ($\ge 80\%$), drastically reducing idle travel mileage and carbon emissions.
2. **Q: What happens when a compactor truck driver empties an overflowing bin?**
   - **A:** The driver console resets the bin's fill level to $0\%$ in `labDB`, updates the truck's cumulative collected tonnage, and automatically marks all linked citizen complaints for that landmark as resolved.
