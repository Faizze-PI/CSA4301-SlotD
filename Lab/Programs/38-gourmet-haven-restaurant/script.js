// Gourmet Haven Fine Dining Engine
const STORAGE_PREFIX = 'gourmethaven_';

const DEFAULT_MENU = [
    {
        id: 'M101',
        name: 'Black Truffle & Wild Forest Arancini',
        category: 'Appetizers',
        price: 850,
        diet: 'Veg',
        desc: 'Crispy arborio spheres infused with Périgord winter truffles, aged parmesan cream, and smoked garlic emulsion.'
    },
    {
        id: 'M102',
        name: 'Pan-Seared Hokkaido Scallops',
        category: 'Appetizers',
        price: 1250,
        diet: 'Non-Veg',
        desc: 'Sustainably dived scallops resting on velvety cauliflower purée, crispy pancetta lardons, and finger lime caviar.'
    },
    {
        id: 'M103',
        name: 'Sous-Vide Nilgiri Herb Lamb Rack',
        category: 'Mains',
        price: 1850,
        diet: 'Non-Veg',
        desc: 'Crusted with Nilgiri mountain herbs and pink peppercorns, served with glazed heirloom carrots and reduced port wine jus.'
    },
    {
        id: 'M104',
        name: 'Wild Morel & Saffron Risotto',
        category: 'Mains',
        price: 1450,
        diet: 'Veg',
        desc: 'Carnaroli rice slow-simmered in vegetable broth with Kashmiri saffron threads, sautéed morel mushrooms, and 24-month Parmigiano.'
    },
    {
        id: 'M105',
        name: 'The 7-Course Chef’s Degustation Tasting',
        category: 'Signatures',
        price: 3600,
        diet: 'Chef Special',
        desc: 'Our flagship culinary journey spanning cold appetisers, line-caught seafood, woodfire mains, and bespoke dessert progressions.'
    },
    {
        id: 'M106',
        name: 'Valrhona Dark Chocolate Sphère',
        category: 'Desserts',
        price: 750,
        diet: 'Veg',
        desc: '70% single-origin French chocolate shell melted tableside with hot spiced salted caramel sauce, hazelnut praline, and gold leaf.'
    },
    {
        id: 'M107',
        name: 'Boutique Domaine Pinot Noir (2018 Glass)',
        category: 'Beverages',
        price: 950,
        diet: 'Sommelier Choice',
        desc: 'Silky red fruit notes with subtle earthy undertones from Burgundy, decanted and aerated at cellar temperature.'
    }
];

const DEFAULT_REVIEWS = [
    {
        critic: 'The Hindu MetroPlus Food Review',
        rating: 5,
        text: 'A tour de force of fine dining. Chef Moreau and Raman balance classical European technique with indigenous spices without ever feeling contrived.'
    },
    {
        critic: 'Vikramaditya Seth (Gourmand Club)',
        rating: 5,
        text: 'The private wine cellar dinner for our wedding anniversary was the most sublime gastronomic evening in southern India.'
    },
    {
        critic: 'Pooja Singhania (Verified Diner)',
        rating: 5,
        text: 'The Black Truffle Arancini alone makes Gourmet Haven worth booking three weeks in advance. Flawless hospitality.'
    }
];

// App State
let menuItems = [];
let reservations = [];
let currentSlide = 0;
let activeMenuFilter = 'All';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderMenu();
    renderReviews();
    renderManifest();
    initDateInput();
    startCarouselAutoPlay();
});

function loadData() {
    menuItems = labDB.get(STORAGE_PREFIX + 'menu', DEFAULT_MENU);
    reservations = labDB.get(STORAGE_PREFIX + 'reservations', [
        {
            voucherId: 'GH-TABLE-4081',
            guestName: 'Aditya Birla',
            phone: '+91 98402 11223',
            date: '2026-10-10',
            time: '08:45 PM (Dinner)',
            guests: '4',
            area: 'Main Dining Salon',
            status: 'Confirmed'
        }
    ]);
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'reservations', reservations);
}

function initDateInput() {
    const input = document.getElementById('resDate');
    if (input) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        input.value = tomorrow.toISOString().split('T')[0];
        input.min = new Date().toISOString().split('T')[0];
    }
}

// Role Switcher
function switchRole(role) {
    const tabAdmin = document.getElementById('tabAdmin');
    if (role === 'maitre') {
        tabAdmin.style.display = 'inline-flex';
    } else {
        tabAdmin.style.display = 'none';
        if (document.getElementById('tab-admin').classList.contains('active')) {
            showTab('home');
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

// Carousel
function setSlide(idx) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = idx % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    setSlide(currentSlide + 1);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    setSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startCarouselAutoPlay() {
    setInterval(() => {
        nextSlide();
    }, 7000);
}

// Menu
function renderMenu() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    const filtered = (activeMenuFilter === 'All')
        ? menuItems
        : menuItems.filter(m => m.category === activeMenuFilter);

    grid.innerHTML = filtered.map(m => `
        <div class="menu-card">
            <div class="menu-top-row">
                <span class="dish-name">${m.name}</span>
                <span class="dish-price">₹${m.price}</span>
            </div>
            <p class="dish-desc">${m.desc}</p>
            <div class="dish-diet-pills">
                <span class="diet-pill ${m.diet === 'Veg' ? 'diet-veg' : 'diet-nonveg'}">${m.diet}</span>
                <span class="diet-pill" style="background:rgba(212,175,55,0.1); color:var(--gold);">${m.category}</span>
            </div>
        </div>
    `).join('');
}

function filterMenu(cat, btn) {
    activeMenuFilter = cat;
    document.querySelectorAll('.menu-filter-chips .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderMenu();
}

// Reservations
function handleReservationSubmit(e) {
    e.preventDefault();
    const voucherId = 'GH-TABLE-' + Math.floor(1000 + Math.random() * 9000);
    const newRes = {
        voucherId,
        guestName: document.getElementById('resName').value.trim(),
        phone: document.getElementById('resPhone').value.trim(),
        date: document.getElementById('resDate').value,
        time: document.getElementById('resTime').value,
        guests: document.getElementById('resGuests').value,
        area: document.getElementById('resArea').value,
        notes: document.getElementById('resNotes').value.trim(),
        status: 'Confirmed'
    };

    reservations.unshift(newRes);
    saveData();
    renderManifest();
    showConfirmationVoucher(newRes);
    e.target.reset();
    initDateInput();
}

function showConfirmationVoucher(res) {
    const modal = document.getElementById('voucherModal');
    const content = document.getElementById('voucherModalContent');

    content.innerHTML = `
        <div style="text-align:center; margin-bottom:24px;">
            <div style="width:64px; height:64px; border-radius:50%; background:rgba(212,175,55,0.15); color:var(--gold); display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:1.8rem; border:1px solid var(--gold);">
                <i class="fas fa-wine-glass"></i>
            </div>
            <h2 style="color:var(--gold); font-size:1.6rem;">Dining Reservation Confirmed</h2>
            <p style="color:var(--text-muted); font-size:0.9rem;">Pass Reference: <strong>#${res.voucherId}</strong></p>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:20px; border-radius:12px; margin-bottom:20px; font-size:0.95rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-muted);">Guest of Honor:</span>
                <strong>${res.guestName}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-muted);">Date & Service:</span>
                <span>${res.date} at ${res.time}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-muted);">Party Size:</span>
                <span>${res.guests} Guests</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-muted);">Salon Seating:</span>
                <span style="color:var(--gold); font-weight:600;">${res.area}</span>
            </div>
            ${res.notes ? `
                <div style="border-top:1px solid var(--border-color); padding-top:10px; margin-top:10px; font-size:0.85rem; color:var(--text-muted);">
                    <strong>Notes:</strong> ${res.notes}
                </div>
            ` : ''}
        </div>

        <div style="text-align:center; margin-bottom:24px;">
            <div style="display:inline-block; padding:12px; background:#fff; border-radius:8px;">
                <i class="fas fa-qrcode fa-5x" style="color:#000;"></i>
            </div>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">Present this digital QR boarding pass to the Maître d' upon arrival.</p>
        </div>

        <button class="btn btn-gold btn-block" onclick="window.print();"><i class="fas fa-print"></i> Print Official Dining Voucher</button>
    `;

    modal.classList.add('active');
}

function closeVoucherModal() {
    document.getElementById('voucherModal').classList.remove('active');
}

// Reviews
function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    grid.innerHTML = DEFAULT_REVIEWS.map(r => `
        <div class="review-box">
            <div class="stars-gold"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
            <p>"${r.text}"</p>
            <span class="review-diner">— ${r.critic}</span>
        </div>
    `).join('');
}

// Maître d' Manifest
function renderManifest() {
    const tbody = document.getElementById('resTableBody');
    if (!tbody) return;

    tbody.innerHTML = reservations.map(r => `
        <tr>
            <td><strong>#${r.voucherId}</strong></td>
            <td>${r.guestName}<br><small style="color:var(--text-muted);">${r.phone}</small></td>
            <td>${r.date}<br><small style="color:var(--gold);">${r.time}</small></td>
            <td>${r.guests} Guests</td>
            <td>${r.area}</td>
            <td>
                <span class="badge" style="background:${r.status === 'Confirmed' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${r.status === 'Confirmed' ? '#10b981' : '#ef4444'}; font-size:0.75rem; padding:4px 8px; border-radius:10px;">
                    ${r.status}
                </span>
            </td>
            <td>
                ${r.status === 'Confirmed' 
                    ? `<button class="btn btn-secondary btn-sm" onclick="cancelReservation('${r.voucherId}')"><i class="fas fa-times"></i> Cancel</button>`
                    : `<span style="color:var(--text-muted); font-size:0.8rem;">Cancelled</span>`
                }
            </td>
        </tr>
    `).join('');
}

function cancelReservation(id) {
    const item = reservations.find(r => r.voucherId === id);
    if (item && confirm(`Cancel dining reservation #${id} for ${item.guestName}?`)) {
        item.status = 'Cancelled';
        saveData();
        renderManifest();
    }
}
