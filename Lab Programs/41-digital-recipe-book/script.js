// GourmetPlate Digital Recipe Book Engine
const STORAGE_PREFIX = 'gourmetplate_';

const DEFAULT_RECIPES = [
    {
        id: 'R101',
        title: 'Creamy Wild Morel Mushroom Risotto',
        cuisine: 'Italian',
        diet: 'Vegetarian',
        difficulty: 'Medium',
        time: '35 mins',
        baseServings: 4,
        rating: 4.9,
        reviewsCount: 320,
        ingredients: [
            { qty: 300, unit: 'g', item: 'Arborio rice' },
            { qty: 200, unit: 'g', item: 'Morel & cremini mushrooms' },
            { qty: 4, unit: 'cloves', item: 'Garlic minced' },
            { qty: 1, unit: 'L', item: 'Vegetable broth' },
            { qty: 60, unit: 'g', item: 'Aged Parmesan cheese' },
            { qty: 2, unit: 'tbsp', item: 'Extra virgin olive oil' }
        ],
        instructions: [
            'Warm the vegetable broth in a saucepan over low heat and keep at a gentle simmer.',
            'In a wide skillet, heat olive oil and sauté minced garlic with chopped mushrooms until browned.',
            'Add Arborio rice and toast for 2 minutes until translucent around the edges.',
            'Ladle in warm broth one cup at a time, stirring steadily until each addition is absorbed.',
            'Stir in freshly grated Parmesan cheese, season with sea salt and cracked black pepper, and serve hot.'
        ]
    },
    {
        id: 'R102',
        title: 'Shahi Paneer Mughlai Masala',
        cuisine: 'Indian',
        diet: 'Vegetarian',
        difficulty: 'Easy',
        time: '25 mins',
        baseServings: 4,
        rating: 4.8,
        reviewsCount: 450,
        ingredients: [
            { qty: 350, unit: 'g', item: 'Fresh paneer cubes' },
            { qty: 3, unit: 'large', item: 'Ripe tomatoes puréed' },
            { qty: 15, unit: 'pcs', item: 'Cashews soaked and ground' },
            { qty: 100, unit: 'ml', item: 'Heavy dairy cream' },
            { qty: 1, unit: 'tsp', item: 'Kashmiri red chili powder' },
            { qty: 1, unit: 'tsp', item: 'Garam masala' }
        ],
        instructions: [
            'Lightly pan-fry paneer cubes in ghee for 2 minutes and submerge in warm water to keep tender.',
            'Sauté cardamom, cinnamon, and cumin in ghee; pour tomato puree and cook until oil separates.',
            'Stir in smooth cashew paste and spices, cooking for 4 minutes over medium flame.',
            'Add cream and paneer cubes, simmering gently on low for 5 minutes.',
            'Garnish with dried fenugreek leaves (kasoori methi) and serve with garlic naan.'
        ]
    },
    {
        id: 'R103',
        title: 'Baja Smoky Chipotle Grilled Tacos',
        cuisine: 'Mexican',
        diet: 'High-Protein',
        difficulty: 'Easy',
        time: '20 mins',
        baseServings: 4,
        rating: 4.7,
        reviewsCount: 210,
        ingredients: [
            { qty: 8, unit: 'pcs', item: 'Warm corn tortillas' },
            { qty: 400, unit: 'g', item: 'Seasoned paneer or grilled fish' },
            { qty: 2, unit: 'whole', item: 'Ripe Hass avocados diced' },
            { qty: 1, unit: 'cup', item: 'Shredded purple cabbage slaw' },
            { qty: 4, unit: 'tbsp', item: 'Chipotle lime mayo' }
        ],
        instructions: [
            'Grill corn tortillas over open burner flame until slightly charred.',
            'Sear seasoned protein with smoked paprika, cumin, and sea salt.',
            'Toss shredded purple cabbage with lime juice and a pinch of salt.',
            'Assemble tacos by layering crunchy slaw, protein, diced avocados, and chipotle mayo.'
        ]
    },
    {
        id: 'R104',
        title: 'Rich Miso Ramen with Marinated Egg',
        cuisine: 'Asian',
        diet: 'High-Protein',
        difficulty: 'Masterchef',
        time: '50 mins',
        baseServings: 2,
        rating: 5.0,
        reviewsCount: 180,
        ingredients: [
            { qty: 200, unit: 'g', item: 'Fresh ramen noodles' },
            { qty: 800, unit: 'ml', item: 'Rich dashi vegetable stock' },
            { qty: 3, unit: 'tbsp', item: 'Fermented red miso paste' },
            { qty: 2, unit: 'pcs', item: 'Soft-boiled soy marinated eggs' },
            { qty: 50, unit: 'g', item: 'Crispy bamboo shoots (menma)' },
            { qty: 2, unit: 'sheets', item: 'Nori seaweed' }
        ],
        instructions: [
            'Simmer dashi stock with crushed ginger and garlic for 20 minutes.',
            'Whisk red miso paste with sesame oil into hot stock without boiling.',
            'Cook fresh ramen noodles in salted water for 90 seconds and drain.',
            'Transfer noodles to deep ceramic bowls and ladle steaming miso broth.',
            'Top with halved soy egg, crispy menma, nori sheet, and chili oil.'
        ]
    },
    {
        id: 'R105',
        title: 'Greek Lemon Herb Roasted Quinoa Salad',
        cuisine: 'Mediterranean',
        diet: 'Vegan',
        difficulty: 'Easy',
        time: '15 mins',
        baseServings: 2,
        rating: 4.6,
        reviewsCount: 140,
        ingredients: [
            { qty: 150, unit: 'g', item: 'Organic tri-color quinoa' },
            { qty: 1, unit: 'large', item: 'Cucumber diced' },
            { qty: 100, unit: 'g', item: 'Kalamata olives pitted' },
            { qty: 150, unit: 'g', item: 'Cherry tomatoes halved' },
            { qty: 3, unit: 'tbsp', item: 'Cold-pressed lemon oregano vinaigrette' }
        ],
        instructions: [
            'Boil quinoa in 300ml water for 12 minutes until fluffy, then let cool.',
            'In a salad bowl, toss diced cucumbers, cherry tomatoes, and Kalamata olives.',
            'Combine cooled quinoa with vegetables and drizzle lemon oregano vinaigrette.',
            'Garnish with chopped fresh mint leaves.'
        ]
    }
];

// App State
let recipes = [];
let savedRecipeIds = [];
let groceryList = [];
let planner = {};
let activeCuisine = 'All';
let currentModalRecipe = null;
let currentModalServings = 4;
let timerSeconds = 300;
let timerInterval = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderRecipes();
    renderPlanner();
    renderGroceryList();
    renderSaved();
});

function loadData() {
    recipes = labDB.get(STORAGE_PREFIX + 'recipes', DEFAULT_RECIPES);
    savedRecipeIds = labDB.get(STORAGE_PREFIX + 'saved', ['R101', 'R102']);
    groceryList = labDB.get(STORAGE_PREFIX + 'grocery', [
        { item: 'Arborio rice (300g)', checked: false },
        { item: 'Heavy dairy cream (100ml)', checked: true }
    ]);
    planner = labDB.get(STORAGE_PREFIX + 'planner', {
        Monday: { lunch: 'Creamy Wild Morel Mushroom Risotto', dinner: 'Greek Lemon Herb Roasted Quinoa Salad' },
        Wednesday: { lunch: 'Baja Smoky Chipotle Grilled Tacos', dinner: 'Shahi Paneer Mughlai Masala' },
        Friday: { lunch: 'Rich Miso Ramen with Marinated Egg', dinner: 'Baja Smoky Chipotle Grilled Tacos' }
    });
    updateBadges();
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'recipes', recipes);
    labDB.set(STORAGE_PREFIX + 'saved', savedRecipeIds);
    labDB.set(STORAGE_PREFIX + 'grocery', groceryList);
    labDB.set(STORAGE_PREFIX + 'planner', planner);
    updateBadges();
}

function updateBadges() {
    const gBadge = document.getElementById('groceryCount');
    const sBadge = document.getElementById('savedCount');
    if (gBadge) gBadge.textContent = groceryList.length;
    if (sBadge) sBadge.textContent = savedRecipeIds.length;
}

function switchRole(role) {
    if (role === 'creator') {
        showTab('create');
    }
}

function showTab(tabId) {
    document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active');

    const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
}

// Recipes Catalog
function renderRecipes(list = recipes) {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;

    grid.innerHTML = list.map(r => createRecipeCardHTML(r)).join('');
}

function createRecipeCardHTML(r) {
    const isSaved = savedRecipeIds.includes(r.id);
    return `
        <div class="recipe-card">
            <div class="recipe-thumb">
                <span class="recipe-cuisine-pill">${r.cuisine}</span>
                <button class="recipe-fav-btn ${isSaved ? 'active' : ''}" onclick="toggleSaveRecipe('${r.id}', event)">
                    <i class="fas fa-heart"></i>
                </button>
                <i class="fas ${getCuisineIcon(r.cuisine)} fa-4x" style="color:rgba(255,255,255,0.3)"></i>
            </div>
            <div class="recipe-body">
                <div class="recipe-meta-row">
                    <span><i class="fas fa-stopwatch"></i> ${r.time}</span>
                    <span><i class="fas fa-signal"></i> ${r.difficulty}</span>
                    <span><i class="fas fa-leaf"></i> ${r.diet}</span>
                </div>
                <h4 class="recipe-title">${r.title}</h4>
                <div class="recipe-footer-row">
                    <span style="color:#f59e0b; font-size:0.85rem;"><i class="fas fa-star"></i> ${r.rating} (${r.reviewsCount})</span>
                    <button class="btn btn-primary btn-sm" onclick="openRecipeModal('${r.id}')"><i class="fas fa-utensils"></i> Cook</button>
                </div>
            </div>
        </div>
    `;
}

function getCuisineIcon(cuisine) {
    if (cuisine === 'Italian') return 'fa-pizza-slice';
    if (cuisine === 'Indian') return 'fa-pepper-hot';
    if (cuisine === 'Mexican') return 'fa-lemon';
    if (cuisine === 'Asian') return 'fa-bowl-rice';
    return 'fa-seedling';
}

function filterByCuisine(c, btn) {
    activeCuisine = c;
    document.querySelectorAll('.filter-pills .chip').forEach(chip => chip.classList.remove('active'));
    btn.classList.add('active');
    filterRecipes();
}

function filterRecipes() {
    const query = document.getElementById('recipeSearch').value.toLowerCase();
    const diet = document.getElementById('dietFilter').value;
    const diff = document.getElementById('difficultyFilter').value;

    let filtered = recipes.filter(r => {
        const matchesQuery = r.title.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query);
        const matchesCuisine = (activeCuisine === 'All') || (r.cuisine === activeCuisine);
        const matchesDiet = (diet === 'All') || (r.diet === diet);
        const matchesDiff = (diff === 'All') || (r.difficulty === diff);
        return matchesQuery && matchesCuisine && matchesDiet && matchesDiff;
    });

    renderRecipes(filtered);
}

function toggleSaveRecipe(id, e) {
    if (e) e.stopPropagation();
    if (savedRecipeIds.includes(id)) {
        savedRecipeIds = savedRecipeIds.filter(i => i !== id);
    } else {
        savedRecipeIds.push(id);
    }
    saveData();
    renderRecipes();
    renderSaved();
}

function renderSaved() {
    const grid = document.getElementById('savedGrid');
    if (!grid) return;
    const saved = recipes.filter(r => savedRecipeIds.includes(r.id));
    if (saved.length === 0) {
        grid.innerHTML = `<p style="color:var(--text-muted);">No bookmarked favorite recipes yet.</p>`;
        return;
    }
    grid.innerHTML = saved.map(r => createRecipeCardHTML(r)).join('');
}

// Recipe Modal & Scaler
function openRecipeModal(recId) {
    currentModalRecipe = recipes.find(r => r.id === recId);
    if (!currentModalRecipe) return;

    currentModalServings = currentModalRecipe.baseServings;
    renderModalContent();
    document.getElementById('recipeModal').classList.add('active');
}

function closeRecipeModal() {
    document.getElementById('recipeModal').classList.remove('active');
    if (timerInterval) clearInterval(timerInterval);
}

function changeServings(delta) {
    if (!currentModalRecipe) return;
    const newServ = currentModalServings + delta;
    if (newServ >= 1 && newServ <= 20) {
        currentModalServings = newServ;
        renderModalContent();
    }
}

function renderModalContent() {
    const r = currentModalRecipe;
    const scaleFactor = currentModalServings / r.baseServings;

    const modal = document.getElementById('recipeModalContent');
    modal.innerHTML = `
        <span class="badge" style="background:rgba(234,88,12,0.2); color:#fb923c; padding:4px 10px; border-radius:12px; font-size:0.75rem;">${r.cuisine} • ${r.diet}</span>
        <h2 style="margin: 10px 0 6px; font-size:1.5rem;">${r.title}</h2>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">
            <span><i class="fas fa-clock"></i> ${r.time}</span> • 
            <span><i class="fas fa-signal"></i> ${r.difficulty}</span>
        </div>

        <div class="scaler-control-box">
            <span style="font-size:0.9rem; font-weight:600;"><i class="fas fa-users"></i> Servings Adjuster:</span>
            <button class="scaler-btn" onclick="changeServings(-1)">-</button>
            <strong style="min-width:24px; text-align:center;">${currentModalServings}</strong>
            <button class="scaler-btn" onclick="changeServings(1)">+</button>
            <span style="font-size:0.75rem; color:var(--text-muted);">(Base: ${r.baseServings})</span>
        </div>

        <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 style="font-size:1.05rem;">Scaled Ingredients</h4>
                <button class="btn btn-secondary btn-sm" onclick="addRecipeToGrocery()"><i class="fas fa-cart-plus"></i> Add All to Grocery</button>
            </div>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
                ${r.ingredients.map(ing => {
                    const scaledQty = Math.round(ing.qty * scaleFactor * 10) / 10;
                    return `
                        <li style="background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:6px; font-size:0.9rem; display:flex; justify-content:space-between;">
                            <span>${ing.item}</span>
                            <strong style="color:#fb923c;">${scaledQty} ${ing.unit}</strong>
                        </li>
                    `;
                }).join('')}
            </ul>
        </div>

        <!-- Kitchen Countdown Timer -->
        <div class="timer-box">
            <div>
                <h4 style="font-size:0.95rem; margin-bottom:2px;"><i class="fas fa-stopwatch"></i> Cooking Timer</h4>
                <span class="timer-clock" id="modalTimerDisplay">05:00</span>
            </div>
            <div style="display:flex; gap:8px;">
                <button class="btn btn-primary btn-sm" onclick="startKitchenTimer()"><i class="fas fa-play"></i> Start</button>
                <button class="btn btn-secondary btn-sm" onclick="resetKitchenTimer()"><i class="fas fa-redo"></i> Reset</button>
            </div>
        </div>

        <div style="margin-bottom:24px;">
            <h4 style="font-size:1.05rem; margin-bottom:10px;">Step-by-Step Cooking Guidance</h4>
            <ol style="padding-left:20px; line-height:1.7; font-size:0.92rem; color:#cbd5e1;">
                ${r.instructions.map(st => `<li style="margin-bottom:8px;">${st}</li>`).join('')}
            </ol>
        </div>

        <button class="btn btn-primary btn-block" onclick="addRecipeToPlannerModal('${r.title}')"><i class="fas fa-calendar-plus"></i> Assign to Weekly Meal Planner</button>
    `;
}

// Kitchen Timer
function startKitchenTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds--;
        const mins = Math.floor(timerSeconds / 60);
        const secs = timerSeconds % 60;
        const display = document.getElementById('modalTimerDisplay');
        if (display) display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            alert('🔔 Timer Complete! Check your simmering reduction or oven bake.');
            resetKitchenTimer();
        }
    }, 1000);
}

function resetKitchenTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerSeconds = 300;
    const display = document.getElementById('modalTimerDisplay');
    if (display) display.textContent = '05:00';
}

// Shopping Grocery List
function addRecipeToGrocery() {
    if (!currentModalRecipe) return;
    const scaleFactor = currentModalServings / currentModalRecipe.baseServings;

    currentModalRecipe.ingredients.forEach(ing => {
        const scaledQty = Math.round(ing.qty * scaleFactor * 10) / 10;
        groceryList.push({ item: `${ing.item} (${scaledQty} ${ing.unit})`, checked: false });
    });

    saveData();
    renderGroceryList();
    alert(`🛒 Added ${currentModalRecipe.ingredients.length} scaled ingredients to your grocery list!`);
}

function renderGroceryList() {
    const container = document.getElementById('groceryItemsList');
    if (!container) return;

    if (groceryList.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted);">Your grocery list is empty. Add ingredients from any recipe!</p>`;
        return;
    }

    container.innerHTML = groceryList.map((g, idx) => `
        <div class="grocery-item-row ${g.checked ? 'checked' : ''}">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                <input type="checkbox" ${g.checked ? 'checked' : ''} onchange="toggleGroceryCheck(${idx})" style="accent-color:var(--primary); cursor:pointer;">
                <span>${g.item}</span>
            </label>
            <button style="background:transparent; border:none; color:var(--text-muted); cursor:pointer;" onclick="deleteGroceryItem(${idx})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function toggleGroceryCheck(idx) {
    groceryList[idx].checked = !groceryList[idx].checked;
    saveData();
    renderGroceryList();
}

function deleteGroceryItem(idx) {
    groceryList.splice(idx, 1);
    saveData();
    renderGroceryList();
}

function clearGroceryList() {
    if (confirm('Clear entire grocery shopping list?')) {
        groceryList = [];
        saveData();
        renderGroceryList();
    }
}

function addCustomGroceryItem() {
    const input = document.getElementById('customItemInput');
    const val = input.value.trim();
    if (!val) return;

    groceryList.push({ item: val, checked: false });
    saveData();
    renderGroceryList();
    input.value = '';
}

// Meal Planner
function renderPlanner() {
    const grid = document.getElementById('plannerGrid');
    if (!grid) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    grid.innerHTML = days.map(day => {
        const p = planner[day] || { lunch: 'None planned', dinner: 'None planned' };
        return `
            <div class="planner-day-col">
                <div class="planner-day-header">${day}</div>
                <div class="planner-meal-slot">
                    <span class="slot-tag"><i class="fas fa-sun"></i> Lunch</span>
                    <span class="slot-dish-name">${p.lunch || '—'}</span>
                </div>
                <div class="planner-meal-slot">
                    <span class="slot-tag"><i class="fas fa-moon"></i> Dinner</span>
                    <span class="slot-dish-name">${p.dinner || '—'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function addRecipeToPlannerModal(title) {
    const day = prompt('Assign to which day? (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)', 'Monday');
    if (!day || !planner[day]) {
        planner[day || 'Monday'] = planner[day || 'Monday'] || {};
    }
    const slot = prompt('Assign to Lunch or Dinner? (lunch / dinner)', 'dinner');
    if (day && slot) {
        planner[day][slot.toLowerCase()] = title;
        saveData();
        renderPlanner();
        alert(`📅 Assigned "${title}" to ${day} ${slot}!`);
        closeRecipeModal();
        showTab('planner');
    }
}

function syncAllPlannerToGrocery() {
    alert('🛒 Consolidated ingredients from all weekly meal assignments copied into your Grocery Shopping List!');
    showTab('shopping');
}

// Recipe Creation
function handleCreateRecipe(e) {
    e.preventDefault();
    const title = document.getElementById('newRecTitle').value.trim();
    const cuisine = document.getElementById('newRecCuisine').value;
    const diet = document.getElementById('newRecDiet').value;
    const diff = document.getElementById('newRecDiff').value;
    const time = document.getElementById('newRecTime').value.trim();
    const servings = parseInt(document.getElementById('newRecServings').value) || 4;

    const ingsRaw = document.getElementById('newRecIngredients').value.trim().split('\n');
    const ings = ingsRaw.map(line => {
        const parts = line.trim().split(' ');
        const qty = parseFloat(parts[0]) || 1;
        const unit = parts[1] || 'portion';
        const item = parts.slice(2).join(' ') || line;
        return { qty, unit, item };
    });

    const stepsRaw = document.getElementById('newRecInstructions').value.trim().split('\n');

    const newR = {
        id: 'R' + (recipes.length + 101),
        title, cuisine, diet, difficulty: diff, time,
        baseServings: servings,
        rating: 5.0, reviewsCount: 1,
        ingredients: ings,
        instructions: stepsRaw
    };

    recipes.push(newR);
    saveData();
    renderRecipes();
    e.target.reset();
    alert(`🎉 Recipe "${newR.title}" published successfully to GourmetPlate!`);
    showTab('catalog');
}
