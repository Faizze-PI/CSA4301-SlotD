// ArtSentiment Painting Rating & Review Engine
const STORAGE_PREFIX = 'artsentiment_';

const POSITIVE_LEXICON = [
    'breathtaking', 'masterpiece', 'beautiful', 'stunning', 'luminous', 'exquisite', 
    'sublime', 'brilliant', 'wonderful', 'love', 'superb', 'elegant', 'peaceful', 
    'gorgeous', 'vibrant', 'magnificent', 'transcendent', 'harmony', 'depth', 'great'
];

const NEGATIVE_LEXICON = [
    'chaotic', 'muddy', 'dull', 'boring', 'amateur', 'flawed', 'harsh', 'poorly', 
    'terrible', 'bad', 'awful', 'uninspired', 'flat', 'messy', 'disappointing', 
    'overpriced', 'cluttered', 'harsh', 'cold', 'lacks'
];

const DEFAULT_PAINTINGS = [
    {
        id: 'A101',
        title: 'Nocturne in Azure & Gold',
        artist: 'Camille Laurent',
        year: 2024,
        medium: 'Oil on Canvas',
        price: '₹6,80,000',
        desc: 'A mesmerizing interplay between deep twilight blues and textured gold leaf, capturing the quiet dignity of a Mediterranean harbor under moonlight.',
        reviews: [
            { user: 'Siddharth R.', rating: 5, comment: 'Breathtaking use of light! The gold pigments look luminous in person.', sentiment: 'Positive', date: '2026-09-28', response: 'Thank you Siddharth. The artist used 24k Bavarian gold leaf.' },
            { user: 'Ananya S.', rating: 4, comment: 'Very peaceful composition, though slightly heavy on the cobalt side.', sentiment: 'Neutral', date: '2026-10-01', response: null }
        ]
    },
    {
        id: 'A102',
        title: 'Echoes of the Nilgiri Dawn',
        artist: 'S. Ramanathan',
        year: 2025,
        medium: 'Acrylic on Linen',
        price: '₹4,20,000',
        desc: 'Atmospheric mountain ridges dissolving into early morning tea plantation fog, rendered with delicate dry-brush gradients.',
        reviews: [
            { user: 'Maya Sundaram', rating: 5, comment: 'An exquisite masterpiece. The mist appears three-dimensional!', sentiment: 'Positive', date: '2026-10-02', response: 'We are thrilled you connected with Ramanathan\'s pastoral vision.' },
            { user: 'Vikramaditya', rating: 5, comment: 'Stunning harmony of earthy ochres and forest greens.', sentiment: 'Positive', date: '2026-10-04', response: null }
        ]
    },
    {
        id: 'A103',
        title: 'Symphony of the Mechanical Age',
        artist: 'Elena Rostova',
        year: 2023,
        medium: 'Tempera & Gold Leaf',
        price: '₹8,50,000',
        desc: 'Geometric constructivist forms interrogating the human psyche surrounded by interlocking industrial cogs and architectural angles.',
        reviews: [
            { user: 'Dr. Anand', rating: 3, comment: 'Intellectually challenging, but feels overly chaotic and cold to the senses.', sentiment: 'Negative', date: '2026-09-15', response: 'The artist intentionally cultivated cognitive friction to provoke contemplation.' }
        ]
    },
    {
        id: 'A104',
        title: 'Solitude in Monsoon Mist',
        artist: 'Meera Nambiar',
        year: 2025,
        medium: 'Watercolor on Paper',
        price: '₹2,40,000',
        desc: 'Minimalist wet-on-wet watercolor capturing a solitary temple bell swaying against driving Kerala monsoon rains.',
        reviews: [
            { user: 'Rohan Sharma', rating: 5, comment: 'Sublime restraint. Every brush stroke conveys weight and moisture.', sentiment: 'Positive', date: '2026-10-05', response: null }
        ]
    }
];

// App State
let paintings = [];
let currentArtModalId = null;
let selectedStarRating = 5;
let currentRole = 'customer';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderExhibition();
    updateSentimentDashboard();
    renderCuratorModeration();
});

function loadData() {
    paintings = labDB.get(STORAGE_PREFIX + 'paintings', DEFAULT_PAINTINGS);
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'paintings', paintings);
    updateSentimentDashboard();
    renderCuratorModeration();
}

function switchRole(role) {
    currentRole = role;
    const tabAdmin = document.getElementById('tabAdmin');
    if (role === 'admin') {
        tabAdmin.style.display = 'inline-flex';
    } else {
        tabAdmin.style.display = 'none';
        if (document.getElementById('tab-admin').classList.contains('active')) {
            showTab('exhibition');
        }
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

// Exhibition
function renderExhibition(list = paintings) {
    const grid = document.getElementById('artworksGrid');
    if (!grid) return;

    grid.innerHTML = list.map(art => {
        const stats = computePaintingStats(art);
        return `
            <div class="art-card">
                <div class="art-canvas-preview">
                    <span class="art-tag">${art.medium}</span>
                    <i class="fas fa-palette fa-5x" style="color:rgba(255,255,255,0.25)"></i>
                </div>
                <div class="art-body">
                    <h3 class="art-title">${art.title}</h3>
                    <p class="art-artist">${art.artist} (${art.year})</p>
                    <p class="art-desc">${art.desc}</p>
                    
                    <div class="art-sentiment-strip">
                        <span class="sentiment-pill sent-pos"><i class="fas fa-thumbs-up"></i> ${stats.posCount} Pos</span>
                        <span class="sentiment-pill sent-neg"><i class="fas fa-thumbs-down"></i> ${stats.negCount} Neg</span>
                        <span style="margin-left:auto; color:var(--gold); font-weight:700;"><i class="fas fa-star"></i> ${stats.avgRating} / 5.0</span>
                    </div>

                    <div class="art-footer-row">
                        <span style="font-weight:700; color:#fff;">${art.price}</span>
                        <button class="btn btn-primary btn-sm" onclick="openArtModal('${art.id}')"><i class="fas fa-star-half-alt"></i> Rate & Review</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function computePaintingStats(art) {
    const revs = art.reviews || [];
    if (revs.length === 0) return { avgRating: '5.0', posCount: 0, negCount: 0, neuCount: 0 };

    let totalStars = 0;
    let posCount = 0;
    let negCount = 0;
    let neuCount = 0;

    revs.forEach(r => {
        totalStars += r.rating;
        if (r.sentiment === 'Positive') posCount++;
        else if (r.sentiment === 'Negative') negCount++;
        else neuCount++;
    });

    const avgRating = (totalStars / revs.length).toFixed(1);
    return { avgRating, posCount, negCount, neuCount, count: revs.length };
}

function filterArtworks() {
    const q = document.getElementById('artSearch').value.toLowerCase();
    const filtered = paintings.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.artist.toLowerCase().includes(q) || 
        a.medium.toLowerCase().includes(q)
    );
    renderExhibition(filtered);
}

// Sentiment Engine NLP Lexicon
function analyzeSentiment(text, rating) {
    const clean = text.toLowerCase();
    let posScore = 0;
    let negScore = 0;

    POSITIVE_LEXICON.forEach(w => { if (clean.includes(w)) posScore++; });
    NEGATIVE_LEXICON.forEach(w => { if (clean.includes(w)) negScore++; });

    if (rating >= 4 && posScore >= negScore) return 'Positive';
    if (rating <= 2 || negScore > posScore) return 'Negative';
    if (posScore > negScore) return 'Positive';
    return 'Neutral';
}

// Modal & Rating Submission
function openArtModal(artId) {
    currentArtModalId = artId;
    selectedStarRating = 5;
    renderArtModalContent();
    document.getElementById('artModal').classList.add('active');
}

function closeArtModal() {
    document.getElementById('artModal').classList.remove('active');
}

function setStarRating(num) {
    selectedStarRating = num;
    document.querySelectorAll('.star-rating-selector i').forEach((star, idx) => {
        if (idx < num) star.className = 'fas fa-star active';
        else star.className = 'far fa-star';
    });
}

function renderArtModalContent() {
    const art = paintings.find(a => a.id === currentArtModalId);
    if (!art) return;

    const stats = computePaintingStats(art);
    const content = document.getElementById('artModalContent');

    content.innerHTML = `
        <span class="badge" style="background:rgba(236,72,153,0.2); color:#f472b6; padding:4px 10px; border-radius:12px; font-size:0.75rem;">${art.medium} • ${art.year}</span>
        <h2 style="margin: 10px 0 4px; font-size:1.5rem;">${art.title}</h2>
        <p style="color:var(--secondary); font-size:0.95rem; margin-bottom:14px;">Master: <strong>${art.artist}</strong> | Est: <strong>${art.price}</strong></p>
        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5; margin-bottom:20px;">${art.desc}</p>

        <!-- Rating Form -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:20px; border-radius:12px; margin-bottom:24px;">
            <h4 style="font-size:1rem; margin-bottom:10px;">Leave Your Critical Aesthetic Impression</h4>
            <div class="star-rating-selector">
                <i class="fas fa-star active" onclick="setStarRating(1)"></i>
                <i class="fas fa-star active" onclick="setStarRating(2)"></i>
                <i class="fas fa-star active" onclick="setStarRating(3)"></i>
                <i class="fas fa-star active" onclick="setStarRating(4)"></i>
                <i class="fas fa-star active" onclick="setStarRating(5)"></i>
            </div>
            <div class="form-group">
                <input type="text" id="reviewerName" placeholder="Your Name or Critic Handle" style="margin-bottom:8px;">
                <textarea id="reviewerComment" rows="2" placeholder="Critique brushwork, emotion, use of color, and balance..."></textarea>
            </div>
            <button class="btn btn-primary btn-sm" onclick="submitReview()"><i class="fas fa-paper-plane"></i> Submit Rating & Sentiment Review</button>
        </div>

        <!-- Visitor Reviews List -->
        <div>
            <h4 style="font-size:1.05rem; margin-bottom:14px;"><i class="fas fa-comments"></i> Visitor Critical Appraisals (${stats.count || 0})</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
                ${(art.reviews && art.reviews.length > 0) ? art.reviews.map(r => `
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:14px; border-radius:10px; font-size:0.88rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <strong>${r.user}</strong>
                            <div>
                                <span style="color:var(--gold); margin-right:8px;">★ ${r.rating}</span>
                                <span class="sentiment-pill ${r.sentiment === 'Positive' ? 'sent-pos' : (r.sentiment === 'Negative' ? 'sent-neg' : '')}" style="font-size:0.75rem;">${r.sentiment}</span>
                            </div>
                        </div>
                        <p style="color:#cbd5e1; margin-bottom:6px;">"${r.comment}"</p>
                        <small style="color:var(--text-muted);">${r.date}</small>
                        ${r.response ? `
                            <div style="margin-top:8px; padding-left:12px; border-left:2px solid var(--primary); font-size:0.8rem; color:#f472b6;">
                                <strong>Curator Reply:</strong> ${r.response}
                            </div>
                        ` : ''}
                    </div>
                `).join('') : '<p style="color:var(--text-muted); font-size:0.85rem;">Be the first gallery visitor to review this work!</p>'}
            </div>
        </div>
    `;
}

function submitReview() {
    const name = document.getElementById('reviewerName').value.trim();
    const comment = document.getElementById('reviewerComment').value.trim();
    if (!name || !comment) {
        alert('Please fill out your name and review comments.');
        return;
    }

    const art = paintings.find(a => a.id === currentArtModalId);
    if (!art) return;

    const sentiment = analyzeSentiment(comment, selectedStarRating);
    const newRev = {
        user: name,
        rating: selectedStarRating,
        comment,
        sentiment,
        date: new Date().toLocaleDateString(),
        response: null
    };

    if (!art.reviews) art.reviews = [];
    art.reviews.unshift(newRev);

    saveData();
    renderExhibition();
    renderArtModalContent();
    alert(`🎨 Review recorded! Automated Sentiment Engine detected: "${sentiment}" response.`);
}

// Sentiment Dashboard Analytics
function updateSentimentDashboard() {
    let totalReviews = 0;
    let posCount = 0;
    let neuCount = 0;
    let negCount = 0;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    paintings.forEach(art => {
        (art.reviews || []).forEach(r => {
            totalReviews++;
            if (r.sentiment === 'Positive') posCount++;
            else if (r.sentiment === 'Negative') negCount++;
            else neuCount++;

            if (starCounts[r.rating] !== undefined) starCounts[r.rating]++;
        });
    });

    const posPct = totalReviews ? Math.round((posCount / totalReviews) * 100) : 0;
    const neuPct = totalReviews ? Math.round((neuCount / totalReviews) * 100) : 0;
    const negPct = totalReviews ? Math.round((negCount / totalReviews) * 100) : 0;

    const pEl = document.getElementById('statPositivePct');
    const uEl = document.getElementById('statNeutralPct');
    const nEl = document.getElementById('statNegativePct');

    if (pEl) pEl.textContent = posPct + '%';
    if (uEl) uEl.textContent = neuPct + '%';
    if (nEl) nEl.textContent = negPct + '%';

    // Rating Bars
    const container = document.getElementById('ratingBarsContainer');
    if (!container) return;

    container.innerHTML = [5, 4, 3, 2, 1].map(stars => {
        const count = starCounts[stars] || 0;
        const widthPct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
        return `
            <div class="rating-bar-row">
                <span style="min-width:55px;">${stars} Stars</span>
                <div class="rating-bar-track">
                    <div class="rating-bar-fill" style="width:${widthPct}%;"></div>
                </div>
                <span style="min-width:35px; text-align:right; color:var(--text-muted);">${count}</span>
            </div>
        `;
    }).join('');
}

// Curator Admin Studio
function handleUploadPainting(e) {
    e.preventDefault();
    const newArt = {
        id: 'A' + (paintings.length + 101),
        title: document.getElementById('newArtTitle').value.trim(),
        artist: document.getElementById('newArtArtist').value.trim(),
        year: parseInt(document.getElementById('newArtYear').value) || 2026,
        medium: document.getElementById('newArtMedium').value,
        price: document.getElementById('newArtPrice').value.trim(),
        desc: document.getElementById('newArtDesc').value.trim(),
        reviews: []
    };

    paintings.unshift(newArt);
    saveData();
    renderExhibition();
    e.target.reset();
    alert(`✅ Artwork "${newArt.title}" successfully curated and hung in ArtSentiment gallery!`);
    showTab('exhibition');
}

function renderCuratorModeration() {
    const list = document.getElementById('adminFeedbackList');
    if (!list) return;

    const allRevs = [];
    paintings.forEach(art => {
        (art.reviews || []).forEach(r => {
            allRevs.push({ artTitle: art.title, artId: art.id, ...r });
        });
    });

    list.innerHTML = allRevs.map((r, idx) => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:10px; margin-bottom:12px; font-size:0.88rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong>${r.artTitle}</strong>
                <span class="sentiment-pill ${r.sentiment === 'Positive' ? 'sent-pos' : 'sent-neg'}">${r.sentiment}</span>
            </div>
            <p style="color:#cbd5e1; margin-bottom:6px;">"${r.comment}" — <em>${r.user} (★ ${r.rating})</em></p>
            ${r.response ? `
                <p style="color:#f472b6; font-size:0.8rem;"><strong>Replied:</strong> ${r.response}</p>
            ` : `
                <button class="btn btn-secondary btn-sm" onclick="curatorReplyPrompt('${r.artId}', '${r.user}')"><i class="fas fa-reply"></i> Add Curator Reply</button>
            `}
        </div>
    `).join('');
}

function curatorReplyPrompt(artId, user) {
    const reply = prompt(`Reply to ${user}'s review as Gallery Curator:`);
    if (reply) {
        const art = paintings.find(a => a.id === artId);
        if (art) {
            const rev = art.reviews.find(r => r.user === user);
            if (rev) rev.response = reply;
            saveData();
            renderExhibition();
            alert('✅ Curator reply posted to exhibition catalogue!');
        }
    }
}
