// Wanderlust Chronicles Travel Blog & Atlas Engine
const STORAGE_PREFIX = 'wanderlust_';

const DEFAULT_JOURNALS = [
    {
        id: 'J101',
        title: 'Meditations in Kyoto: Zen Temples & Bamboo Groves',
        category: 'Cultural & Heritage',
        location: 'Kyoto, Japan',
        coords: '35.0116° N, 135.7681° E',
        date: 'October 3, 2026',
        readTime: '6 min read',
        snippet: 'Wandering through the vermilion torii gates of Fushimi Inari and finding stillness amidst the morning mist of Arashiyama’s towering bamboo canopy.',
        body: 'Kyoto feels like a continuous meditation on temporality and elegance. Dawn at Fushimi Inari offers silence before tour buses arrive. As you ascend Mount Inari, stone fox deities (kitsune) gaze through curling incense smoke. The Japanese concept of wabi-sabi—finding perfection in imperfection—pervades every moss garden in Ryoan-ji. Take time to participate in an authentic matcha ceremony in Gion, where every hand gesture honors centuries of refined hospitality.',
        comments: [
            { user: 'Maya K.', text: 'The description of early morning Gion gave me chills. Adding this to my Japan itinerary!', rating: 5 }
        ]
    },
    {
        id: 'J102',
        title: 'Traversing the Bernese Oberland: Swiss Alpine Ridges',
        category: 'Alpine & Treks',
        location: 'Grindelwald, Switzerland',
        coords: '46.5476° N, 7.9854° E',
        date: 'September 22, 2026',
        readTime: '8 min read',
        snippet: 'Hiking underneath the imposing North Face of the Eiger and hearing glacial seracs crackle above wildflower meadows.',
        body: 'The Bernese Oberland represents European alpine glory at its most dramatic. Starting from Grindelwald, the trail up to First and Bachalpsee mirrors jagged peaks across crystalline water. The air smells of crisp pine resin and sweet pasture wildflowers. Cowbells ring out across rolling ridges while cogwheel trains slice through sheer granite tunnels toward Jungfraujoch.',
        comments: [
            { user: 'Lukas B.', text: 'I completed this exact trek last August. The North Face trail is truly magnificent!', rating: 5 }
        ]
    },
    {
        id: 'J103',
        title: 'The Ring Road Odyssey: Glaciers & Basalt Canyons',
        category: 'Arctic & Geothermal',
        location: 'Reykjavik & Vik, Iceland',
        coords: '64.1466° N, 21.9426° W',
        date: 'September 10, 2026',
        readTime: '7 min read',
        snippet: 'Chasing midnight sun along Route 1, walking upon black sand beaches of Reynisfjara, and bathing in geothermal rivers.',
        body: 'Iceland redefines what it means to feel raw Earth. Waterfalls like Skógafoss thunder with enough mist to create perpetual double rainbows. At Reynisfjara, towering hexagonal basalt columns look carved by Nordic gods. Beware of sneaker waves that surge unpredictably against obsidian sands.',
        comments: []
    },
    {
        id: 'J104',
        title: 'Cliffside Lemon Groves of the Amalfi Coast',
        category: 'Coastal & Islands',
        location: 'Positano, Italy',
        coords: '40.6340° N, 14.6027° E',
        date: 'August 28, 2026',
        readTime: '5 min read',
        snippet: 'Navigating dizzying coastal hairpin bends, savoring cold Limoncello, and trekking the Path of the Gods high above the Tyrrhenian Sea.',
        body: 'Suspended between cobalt sea and limestone cliff, the Amalfi Coast is an intoxicating feast of color. Walking the Sentiero degli Dei (Path of the Gods) offers panoramic vantage points overlooking pastel Positano houses tumbling into the sea.',
        comments: []
    },
    {
        id: 'J105',
        title: 'Sacred Rice Terraces & Spiritual Solitude in Bali',
        category: 'Coastal & Islands',
        location: 'Ubud, Indonesia',
        coords: '8.4095° S, 115.1889° E',
        date: 'August 14, 2026',
        readTime: '6 min read',
        snippet: 'Exploring subak irrigation systems in Tegallalang, artisan woodcarving studios, and sunrise volcanic hikes up Mount Batur.',
        body: 'In the volcanic interior of Ubud, mornings begin with the aromatic fragrance of canang sari floral offerings placed upon mossy thresholds. Hiking the emerald terraces of Tegallalang reveals the thousand-year-old subak cooperative irrigation philosophy.',
        comments: []
    },
    {
        id: 'J106',
        title: 'Trekking the High Passes of Ladakh: Moonscapes & Monasteries',
        category: 'Alpine & Treks',
        location: 'Leh & Nubra Valley, India',
        coords: '34.1526° N, 77.5771° E',
        date: 'July 29, 2026',
        readTime: '9 min read',
        snippet: 'Crossing 5,300m high-altitude mountain passes, chanting monks at Thiksey Gompa, and camping beside indigo Pangong Tso.',
        body: 'Ladakh feels like another planet. The stark rain-shadow mountains of the Himalayas glow in shades of ochre, violet, and dusty rose under an intensely pure cobalt sky. Sitting in the courtyard of Thiksey Monastery at 6:00 AM as deep copper horns echo across the Indus Valley is an experience etched forever into memory.',
        comments: [
            { user: 'Rohan Sharma', text: 'Pangong Tso at sunrise is unforgettable. Your photos captured the exact color of the water!', rating: 5 }
        ]
    }
];

const GALLERY_IMAGES = [
    { id: 1, title: 'Torii Gates of Fushimi Inari, Kyoto', location: 'Japan', icon: 'fa-torii-gate' },
    { id: 2, title: 'Bachalpsee Alpine Mirror, Grindelwald', location: 'Switzerland', icon: 'fa-mountain' },
    { id: 3, title: 'Skógafoss Waterfall Mist, Ring Road', location: 'Iceland', icon: 'fa-water' },
    { id: 4, title: 'Cliffside Terraces of Positano', location: 'Italy', icon: 'fa-umbrella-beach' },
    { id: 5, title: 'Emerald Subak Terraces, Ubud', location: 'Indonesia', icon: 'fa-seedling' },
    { id: 6, title: 'Thiksey Monastic Perch, Leh', location: 'India', icon: 'fa-place-of-worship' }
];

// App State
let journals = [];
let activeJournalFilter = 'All';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderJournals();
    renderGallery();
    generatePackingList();
    calculateTripBudget();
});

function loadData() {
    journals = labDB.get(STORAGE_PREFIX + 'journals', DEFAULT_JOURNALS);
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'journals', journals);
}

// Role Switcher
function switchRole(role) {
    const tabAuthor = document.getElementById('tabAuthor');
    if (role === 'blogger') {
        tabAuthor.style.display = 'inline-flex';
    } else {
        tabAuthor.style.display = 'none';
        if (document.getElementById('tab-author').classList.contains('active')) {
            showTab('journals');
        }
    }
}

// Tab Navigation
function showTab(tabId) {
    document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active');

    const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
}

// Journals Rendering & Filtering
function renderJournals() {
    const grid = document.getElementById('journalsGrid');
    if (!grid) return;

    const filtered = (activeJournalFilter === 'All')
        ? journals
        : journals.filter(j => j.category === activeJournalFilter);

    grid.innerHTML = filtered.map(j => `
        <article class="journal-card">
            <div class="journal-cover">
                <span class="journal-category-pill">${j.category}</span>
                <i class="fas ${getCategoryIcon(j.category)} fa-3x" style="color:rgba(255,255,255,0.3)"></i>
            </div>
            <div class="journal-body">
                <div class="journal-meta">
                    <span><i class="fas fa-map-pin"></i> ${j.location}</span> • 
                    <span><i class="fas fa-clock"></i> ${j.readTime}</span>
                </div>
                <h3 class="journal-title">${j.title}</h3>
                <p class="journal-snippet">${j.snippet}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <button class="btn btn-primary btn-sm" onclick="readJournal('${j.id}')"><i class="fas fa-book-reader"></i> Read Dispatch</button>
                    <button class="btn btn-secondary btn-sm" onclick="shareJournal('${j.title}')"><i class="fas fa-share-alt"></i> Share</button>
                </div>
            </div>
        </article>
    `).join('');
}

function getCategoryIcon(cat) {
    if (cat.includes('Alpine')) return 'fa-mountain';
    if (cat.includes('Cultural')) return 'fa-landmark';
    if (cat.includes('Coastal')) return 'fa-water';
    return 'fa-snowflake';
}

function filterJournals(cat, btn) {
    activeJournalFilter = cat;
    document.querySelectorAll('.filter-category-strip .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderJournals();
}

// Map Interactive Atlas
function selectMapPin(journalId) {
    const j = journals.find(item => item.id === journalId);
    if (!j) return;

    const preview = document.getElementById('destinationPreview');
    preview.innerHTML = `
        <span class="badge" style="background:rgba(2,132,199,0.2); color:#38bdf8; padding:4px 10px; border-radius:12px; font-size:0.75rem;">${j.category}</span>
        <h3 style="margin: 10px 0 6px 0; font-size:1.25rem;">${j.title}</h3>
        <p style="color:var(--secondary); font-size:0.85rem; margin-bottom:10px;"><i class="fas fa-crosshairs"></i> ${j.coords}</p>
        <p style="color:var(--text-muted); font-size:0.88rem; line-height:1.5; margin-bottom:16px;">${j.snippet}</p>
        <button class="btn btn-primary btn-block" onclick="readJournal('${j.id}')"><i class="fas fa-book-open"></i> Read Full Expedition Journal</button>
    `;
}

// Reading Modal & Comments
function readJournal(journalId) {
    const j = journals.find(item => item.id === journalId);
    if (!j) return;

    const modal = document.getElementById('journalModal');
    const content = document.getElementById('journalModalContent');

    content.innerHTML = `
        <span class="badge" style="background:rgba(2,132,199,0.2); color:#38bdf8; padding:4px 10px; border-radius:12px; font-size:0.75rem;">${j.category}</span>
        <h2 style="margin: 10px 0 6px 0; font-size:1.5rem; line-height:1.3;">${j.title}</h2>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">
            <span><i class="fas fa-map-marker-alt"></i> ${j.location}</span> • 
            <span><i class="fas fa-calendar-alt"></i> ${j.date}</span> • 
            <span><i class="fas fa-clock"></i> ${j.readTime}</span>
        </div>

        <div style="line-height:1.7; font-size:0.95rem; color:#cbd5e1; margin-bottom:24px; border-bottom:1px solid var(--border-color); padding-bottom:20px;">
            ${j.body}
        </div>

        <div style="margin-bottom:24px;">
            <h4 style="font-size:1.05rem; margin-bottom:12px;"><i class="fas fa-comments"></i> Reader Reflections (${j.comments ? j.comments.length : 0})</h4>
            <div id="journalCommentsList">
                ${(j.comments && j.comments.length > 0) ? j.comments.map(c => `
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:10px 14px; border-radius:8px; margin-bottom:8px; font-size:0.85rem;">
                        <strong>${c.user}</strong> <span style="color:#f59e0b;">★ ${c.rating}</span>
                        <p style="color:#94a3b8; margin-top:2px;">${c.text}</p>
                    </div>
                `).join('') : '<p style="color:var(--text-muted); font-size:0.85rem;">Be the first fellow traveler to leave a thought!</p>'}
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:18px; border-radius:12px;">
            <h4 style="font-size:0.95rem; margin-bottom:10px;">Leave a Comment & Star Rating</h4>
            <div class="form-group">
                <input type="text" id="commUser" placeholder="Your Name" style="margin-bottom:8px;">
                <textarea id="commText" rows="2" placeholder="Share your experience or question..."></textarea>
            </div>
            <button class="btn btn-primary btn-sm" onclick="submitComment('${j.id}')"><i class="fas fa-paper-plane"></i> Post Comment</button>
        </div>
    `;

    modal.classList.add('active');
}

function closeJournalModal() {
    document.getElementById('journalModal').classList.remove('active');
}

function submitComment(journalId) {
    const name = document.getElementById('commUser').value.trim();
    const text = document.getElementById('commText').value.trim();
    if (!name || !text) {
        alert('Please provide your name and comment text.');
        return;
    }

    const j = journals.find(item => item.id === journalId);
    if (!j) return;

    if (!j.comments) j.comments = [];
    j.comments.push({ user: name, text, rating: 5 });

    saveData();
    readJournal(journalId);
    alert('💬 Thank you for joining the discussion!');
}

function shareJournal(title) {
    alert(`🔗 Direct expedition link copied to clipboard for: "${title}". Ready to share with travelers!`);
}

// Gallery Lightbox
function renderGallery() {
    const grid = document.getElementById('photoGalleryGrid');
    if (!grid) return;

    grid.innerHTML = GALLERY_IMAGES.map(img => `
        <div class="gallery-card" onclick="openLightbox('${img.title}', '${img.location}', '${img.icon}')">
            <div class="gallery-visual">
                <i class="fas ${img.icon} fa-4x"></i>
            </div>
            <div class="gallery-desc">
                <strong>${img.title}</strong>
                <p style="color:var(--text-muted); font-size:0.75rem;">${img.location}</p>
            </div>
        </div>
    `).join('');
}

function openLightbox(title, loc, icon) {
    const modal = document.getElementById('lightboxModal');
    const content = document.getElementById('lightboxModalContent');

    content.innerHTML = `
        <div style="height:260px; background:#060b14; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
            <i class="fas ${icon} fa-6x" style="color:var(--primary);"></i>
        </div>
        <h3 style="margin-bottom:4px; font-size:1.2rem;">${title}</h3>
        <p style="color:var(--secondary); font-size:0.85rem;"><i class="fas fa-map-marker-alt"></i> ${loc}</p>
    `;

    modal.classList.add('active');
}

function closeLightboxModal() {
    document.getElementById('lightboxModal').classList.remove('active');
}

// Travel Tools: Packing & Budget
function generatePackingList() {
    const climate = document.getElementById('packClimate').value;
    const container = document.getElementById('packingChecklist');
    if (!container) return;

    let items = [];
    if (climate === 'alpine') {
        items = [
            'Insulated Gore-Tex Hardshell Jacket',
            'Merino Wool Thermal Base Layers (x3)',
            'Waterproof High-Ankle Vibram Hiking Boots',
            'UV400 Category 4 Glacier Sunglasses',
            'Portable Water Filtration Pump & Electrolytes',
            'Satellite SOS Communicator & Emergency Bivy'
        ];
    } else if (climate === 'tropical') {
        items = [
            'Quick-Dry Breathable Linen Shirts & Shorts',
            'Biodegradable Reef-Safe SPF50+ Sunscreen',
            'Waterproof Dry-Bag (20L) for Island Hopping',
            'Mosquito Repellent with 30% DEET',
            'Lightweight Rain Poncho & Quick-Drying Towel',
            'Hydration Flask with Activated Charcoal Filter'
        ];
    } else {
        items = [
            'Comfortable Walking Trainers (15k+ steps/day)',
            'Compact Packable Trench Coat & Umbrella',
            'Universal Travel Adapter with PD Fast Charger',
            'RFID-Blocking Anti-Theft Daypack',
            'Noise-Canceling Earbuds for Rail Transit',
            'Reusable Canvas Tote for Local Artisan Markets'
        ];
    }

    container.innerHTML = items.map((it, idx) => `
        <label class="check-item" style="cursor:pointer;">
            <input type="checkbox" checked style="accent-color:var(--primary); cursor:pointer;">
            <span>${it}</span>
        </label>
    `).join('');
}

function calculateTripBudget() {
    const days = parseInt(document.getElementById('calcDays').value) || 7;
    const style = document.getElementById('calcStyle').value;
    const flights = parseInt(document.getElementById('calcFlights').value) || 0;

    let dailyRate = 8500;
    if (style === 'budget') dailyRate = 3500;
    else if (style === 'luxury') dailyRate = 22000;

    const ground = dailyRate * days;
    const total = ground + flights;

    document.getElementById('dailyBudgetVal').textContent = '₹' + dailyRate.toLocaleString('en-IN');
    document.getElementById('groundBudgetVal').textContent = '₹' + ground.toLocaleString('en-IN');
    document.getElementById('totalBudgetVal').textContent = '₹' + total.toLocaleString('en-IN');
}

// Author CMS
function handleCreateJournal(e) {
    e.preventDefault();
    const newJ = {
        id: 'J' + (journals.length + 101),
        title: document.getElementById('newJTitle').value.trim(),
        location: document.getElementById('newJLoc').value.trim(),
        category: document.getElementById('newJCategory').value,
        readTime: document.getElementById('newJTime').value.trim(),
        coords: document.getElementById('newJCoords').value.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        snippet: document.getElementById('newJBody').value.trim().substring(0, 120) + '...',
        body: document.getElementById('newJBody').value.trim(),
        comments: []
    };

    journals.unshift(newJ);
    saveData();
    renderJournals();
    e.target.reset();
    alert(`✅ Expedition journal "${newJ.title}" published to live blog and geotagged atlas!`);
    showTab('journals');
}
