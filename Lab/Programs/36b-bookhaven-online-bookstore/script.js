// BookHaven Online Bookstore Engine
const STORAGE_PREFIX = 'bookhaven_';

const DEFAULT_BOOKS = [
    {
        id: 'B101',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        genre: 'Fiction',
        price: 499,
        rating: 4.8,
        reviewsCount: 340,
        stock: 35,
        synopsis: 'Between life and death there is a library with infinite shelves of what might have been. Nora Seed must examine her regrets and choose what truly matters in living.',
        reviews: [
            { user: 'Siddharth R.', comment: 'Poignant, uplifting, and deeply transformative.', rating: 5 },
            { user: 'Aparna V.', comment: 'A comforting read for anyone who has ever questioned their life choices.', rating: 5 }
        ]
    },
    {
        id: 'B102',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        price: 650,
        rating: 4.9,
        reviewsCount: 512,
        stock: 22,
        synopsis: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed.',
        reviews: [
            { user: 'Karthik N.', comment: 'Hard sci-fi at its absolute peak. Unputdownable!', rating: 5 }
        ]
    },
    {
        id: 'B103',
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'Self-Help',
        price: 450,
        rating: 4.9,
        reviewsCount: 890,
        stock: 50,
        synopsis: 'An extraordinarily practical framework for breaking bad behaviors and mastering tiny habits that lead to remarkable results.',
        reviews: [
            { user: 'Devika P.', comment: 'Systems over goals changed my entire academic routine.', rating: 5 }
        ]
    },
    {
        id: 'B104',
        title: 'Clean Code: A Handbook of Agile Craft',
        author: 'Robert C. Martin',
        genre: 'Academic',
        price: 850,
        rating: 4.7,
        reviewsCount: 220,
        stock: 15,
        synopsis: 'Learn to write clean, maintainable code with best practices, unit testing patterns, code smells identification, and refactoring techniques.',
        reviews: [
            { user: 'Vignesh M.', comment: 'Essential reading for every software engineer.', rating: 5 }
        ]
    },
    {
        id: 'B105',
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        genre: 'Mystery',
        price: 399,
        rating: 4.6,
        reviewsCount: 410,
        stock: 28,
        synopsis: 'Alicia Berenson’s life is seemingly perfect. Then one evening she shoots her husband five times in the face and never speaks another word.',
        reviews: [
            { user: 'Neha S.', comment: 'The twist completely blindsided me!', rating: 5 }
        ]
    },
    {
        id: 'B106',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        genre: 'Academic',
        price: 1199,
        rating: 5.0,
        reviewsCount: 180,
        stock: 12,
        synopsis: 'The definitive guide to the fundamental principles behind distributed data processing, storage engines, transactions, and consensus.',
        reviews: [
            { user: 'Prof. Nair', comment: 'The gold standard reference text for distributed architecture.', rating: 5 }
        ]
    }
];

const BLOG_POSTS = [
    {
        id: 1,
        title: '10 Essential Books That Defined Modern Science Fiction',
        date: 'October 2, 2026',
        author: 'Elena Vance, Senior Literary Critic',
        snippet: 'From Asimov’s psychohistory to Ted Chiang’s thought experiments, explore the speculative fiction masterpieces that forecasted our AI era.'
    },
    {
        id: 2,
        title: 'The Architecture of Clean Code: An Interview with Robert C. Martin',
        date: 'September 24, 2026',
        author: 'Editorial Desk',
        snippet: 'We sat down with Uncle Bob to discuss code craftsmanship, legacy refactoring, and why readability remains the supreme developer virtue.'
    },
    {
        id: 3,
        title: 'The Healing Power of Bibliotherapy: Reading for Mental Clarity',
        date: 'September 12, 2026',
        author: 'Dr. Aruna Sen',
        snippet: 'How immersing yourself in narrative empathy reduces cognitive stress and rewires neuroplasticity.'
    }
];

// App State
let books = [];
let cart = [];
let appliedDiscount = 0;
let currentSlide = 0;
let currentRole = 'customer';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderHomeBooks();
    renderCatalog();
    renderBlog();
    renderCart();
    renderOrders();
    startCarouselAutoPlay();
});

function loadData() {
    books = labDB.get(STORAGE_PREFIX + 'books', DEFAULT_BOOKS);
    cart = labDB.get(STORAGE_PREFIX + 'cart', []);
    updateCartCount();
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'books', books);
    labDB.set(STORAGE_PREFIX + 'cart', cart);
    updateCartCount();
}

// Role Switcher
function switchRole(role) {
    currentRole = role;
    const tabAdmin = document.getElementById('tabAdmin');
    if (role === 'manager') {
        tabAdmin.style.display = 'inline-flex';
    } else {
        tabAdmin.style.display = 'none';
        if (document.getElementById('tab-admin').classList.contains('active')) {
            showTab('home');
        }
    }
}

// Navigation Tabs
function showTab(tabId) {
    document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active');

    const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
}

// Hero Carousel
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
    }, 6000);
}

// Catalog & Books
function renderHomeBooks() {
    const grid = document.getElementById('homeBooksGrid');
    if (!grid) return;
    grid.innerHTML = books.slice(0, 4).map(b => createBookCardHTML(b)).join('');
}

function renderCatalog(list = books) {
    const grid = document.getElementById('catalogGrid');
    const countEl = document.getElementById('resultsCount');
    if (!grid) return;

    countEl.textContent = `Showing ${list.length} curated title(s)`;
    grid.innerHTML = list.map(b => createBookCardHTML(b)).join('');
}

function createBookCardHTML(b) {
    return `
        <div class="book-card">
            <div class="book-cover-area">
                <span class="book-genre-pill">${b.genre}</span>
                <i class="fas fa-book fa-4x" style="color:rgba(255,255,255,0.4)"></i>
            </div>
            <div class="book-info">
                <h4 class="book-title">${b.title}</h4>
                <p class="book-author">by ${b.author}</p>
                <div class="book-rating">
                    <i class="fas fa-star"></i> ${b.rating} (${b.reviewsCount} reviews)
                </div>
                <div class="book-price-row">
                    <span class="book-price">₹${b.price}</span>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-secondary btn-sm" onclick="openBookModal('${b.id}')"><i class="fas fa-info-circle"></i></button>
                        <button class="btn btn-primary btn-sm" onclick="quickAddToCart('${b.id}')"><i class="fas fa-cart-plus"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function filterCatalog() {
    const query = document.getElementById('catalogSearchInput').value.toLowerCase();
    const genre = document.getElementById('genreSelect').value;
    const maxPrice = parseFloat(document.getElementById('priceRange').value) || 9999;
    const sort = document.getElementById('sortSelect').value;

    let filtered = books.filter(b => {
        const matchesQuery = b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
        const matchesGenre = (genre === 'All') || (b.genre === genre);
        const matchesPrice = b.price <= maxPrice;
        return matchesQuery && matchesGenre && matchesPrice;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);

    renderCatalog(filtered);
}

function updatePriceFilter(val) {
    document.getElementById('priceLabel').textContent = '₹' + val;
    filterCatalog();
}

function filterByGenre(g) {
    showTab('catalog');
    const genreSelect = document.getElementById('genreSelect');
    if (genreSelect) {
        genreSelect.value = g;
        filterCatalog();
    }
}

// Book Details Modal
function openBookModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('bookModal');
    const content = document.getElementById('modalBookContent');

    content.innerHTML = `
        <div style="display:flex; gap:20px; margin-bottom:20px;">
            <div style="width:100px; height:130px; background:#1e1b4b; border-radius:8px; display:flex; align-items:center; justify-content:center;">
                <i class="fas fa-book fa-3x" style="color:#d97706"></i>
            </div>
            <div>
                <span class="badge" style="background:rgba(217,119,6,0.2); color:#f59e0b; padding:4px 10px; border-radius:12px; font-size:0.75rem;">${book.genre}</span>
                <h3 style="margin: 8px 0 4px 0;">${book.title}</h3>
                <p style="color:var(--secondary); font-size:0.9rem;">Author: ${book.author}</p>
                <p style="color:#f59e0b; font-size:0.85rem; margin-top:4px;"><i class="fas fa-star"></i> ${book.rating} / 5.0 (${book.reviewsCount} customer ratings)</p>
                <h4 style="margin-top:10px; color:#fff; font-size:1.3rem;">₹${book.price}</h4>
            </div>
        </div>
        <div style="margin-bottom:20px;">
            <h4 style="margin-bottom:8px; color:var(--text-muted); font-size:0.9rem;">SYNOPSIS</h4>
            <p style="line-height:1.6; font-size:0.95rem; color:#e2e8f0;">${book.synopsis}</p>
        </div>
        <div style="margin-bottom:20px;">
            <h4 style="margin-bottom:8px; color:var(--text-muted); font-size:0.9rem;">CUSTOMER REVIEWS</h4>
            ${book.reviews.map(r => `
                <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:6px; margin-bottom:8px; font-size:0.85rem;">
                    <strong>${r.user}</strong> <span style="color:#f59e0b;">★ ${r.rating}</span>
                    <p style="color:#94a3b8; margin-top:4px;">"${r.comment}"</p>
                </div>
            `).join('')}
        </div>
        <button class="btn btn-primary btn-block" onclick="quickAddToCart('${book.id}'); closeBookModal();"><i class="fas fa-shopping-bag"></i> Add to Bag - ₹${book.price}</button>
    `;

    modal.classList.add('active');
}

function closeBookModal() {
    document.getElementById('bookModal').classList.remove('active');
}

// Cart Management
function quickAddToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const existing = cart.find(item => item.id === bookId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: book.id, title: book.title, price: book.price, qty: 1 });
    }

    saveData();
    renderCart();
    alert(`📖 Added "${book.title}" to your BookHaven cart!`);
}

function updateCartQty(bookId, delta) {
    const item = cart.find(i => i.id === bookId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== bookId);
    }

    saveData();
    renderCart();
}

function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = totalQty;
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--text-muted);">
                <i class="fas fa-shopping-bag fa-3x" style="margin-bottom:12px; opacity:0.3"></i>
                <p>Your book bag is currently empty.</p>
                <button class="btn btn-secondary btn-sm" style="margin-top:12px;" onclick="showTab('catalog')">Explore Catalog</button>
            </div>
        `;
        updateOrderSummary(0);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item-row">
            <div>
                <h4 style="font-size:1rem; margin-bottom:4px;">${item.title}</h4>
                <span style="color:var(--text-muted); font-size:0.85rem;">₹${item.price} each</span>
            </div>
            <div class="cart-qty-ctrl">
                <button onclick="updateCartQty('${item.id}', -1)">-</button>
                <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                <button onclick="updateCartQty('${item.id}', 1)">+</button>
                <span style="font-weight:700; margin-left:12px; min-width:60px; text-align:right;">₹${item.price * item.qty}</span>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    updateOrderSummary(subtotal);
}

function updateOrderSummary(subtotal) {
    const discountAmt = Math.round(subtotal * appliedDiscount);
    const total = Math.max(0, subtotal - discountAmt);

    document.getElementById('summarySubtotal').textContent = '₹' + subtotal;
    if (appliedDiscount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = '-₹' + discountAmt;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    document.getElementById('summaryTotal').textContent = '₹' + total;
}

function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    if (code === 'BOOKWORM10') {
        appliedDiscount = 0.10;
        alert('🎉 10% Reader Discount coupon applied successfully!');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        updateOrderSummary(subtotal);
    } else {
        alert('❌ Invalid coupon code. Try code "BOOKWORM10" for 10% discount.');
    }
}

function processOrder() {
    if (cart.length === 0) {
        alert('Your bag is empty! Please add books before proceeding.');
        return;
    }

    const name = document.getElementById('shipName').value.trim();
    const address = document.getElementById('shipAddress').value.trim();
    if (!name || !address) {
        alert('Please fill out your shipping name and delivery address.');
        return;
    }

    const orderId = 'BH-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = Math.round(subtotal * appliedDiscount);
    const total = subtotal - discount;

    const newOrder = {
        orderId,
        date: new Date().toLocaleDateString(),
        customerName: name,
        address,
        items: [...cart],
        subtotal,
        discount,
        total
    };

    const orders = labDB.get(STORAGE_PREFIX + 'orders', []);
    orders.unshift(newOrder);
    labDB.set(STORAGE_PREFIX + 'orders', orders);

    // Clear cart
    cart = [];
    appliedDiscount = 0;
    saveData();
    renderCart();
    renderOrders();

    showReceipt(newOrder);
}

function showReceipt(order) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptModalContent');

    content.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <div style="width:60px; height:60px; border-radius:50%; background:rgba(16,185,129,0.2); color:#10b981; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:1.8rem;">
                <i class="fas fa-check"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p style="color:var(--text-muted); font-size:0.9rem;">Receipt Reference: <strong>#${order.orderId}</strong></p>
        </div>
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:8px; margin-bottom:20px; font-size:0.9rem;">
            <p><strong>Deliver To:</strong> ${order.customerName}</p>
            <p style="color:var(--text-muted);">${order.address}</p>
            <p style="color:var(--text-muted); margin-top:6px;"><strong>Date:</strong> ${order.date}</p>
        </div>
        <div style="margin-bottom:20px;">
            <h4 style="margin-bottom:10px; font-size:0.95rem;">Purchased Titles:</h4>
            ${order.items.map(i => `
                <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem;">
                    <span>${i.title} (x${i.qty})</span>
                    <span>₹${i.price * i.qty}</span>
                </div>
            `).join('')}
            <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:10px; margin-top:10px; display:flex; justify-content:space-between; font-weight:700;">
                <span>Total Amount Paid:</span>
                <span style="color:#10b981;">₹${order.total}</span>
            </div>
        </div>
        <button class="btn btn-primary btn-block" onclick="window.print();"><i class="fas fa-print"></i> Print Official Invoice</button>
    `;

    modal.classList.add('active');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('active');
}

// Blog
function renderBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    grid.innerHTML = BLOG_POSTS.map(p => `
        <article class="value-card" style="text-align:left; padding:24px;">
            <small style="color:var(--primary); font-weight:600;"><i class="fas fa-calendar-alt"></i> ${p.date}</small>
            <h3 style="margin: 8px 0; font-size:1.15rem;">${p.title}</h3>
            <p style="color:var(--secondary); font-size:0.85rem; margin-bottom:12px;">By ${p.author}</p>
            <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5; margin-bottom:16px;">${p.snippet}</p>
            <button class="btn btn-secondary btn-sm" onclick="alert('📖 Opening complete literary editorial: ${p.title}')">Read Full Article <i class="fas fa-arrow-right"></i></button>
        </article>
    `).join('');
}

// Admin / Store Manager
function handleAddNewBook(e) {
    e.preventDefault();
    const newBook = {
        id: 'B' + (books.length + 101),
        title: document.getElementById('newBookTitle').value.trim(),
        author: document.getElementById('newBookAuthor').value.trim(),
        genre: document.getElementById('newBookGenre').value,
        price: parseInt(document.getElementById('newBookPrice').value) || 299,
        stock: parseInt(document.getElementById('newBookStock').value) || 10,
        synopsis: document.getElementById('newBookSynopsis').value.trim(),
        rating: 5.0,
        reviewsCount: 1,
        reviews: [{ user: 'Editorial Staff', comment: 'Newly listed editorial selection.', rating: 5 }]
    };

    books.push(newBook);
    saveData();
    renderHomeBooks();
    renderCatalog();
    e.target.reset();
    alert(`✅ New book "${newBook.title}" added to BookHaven storefront!`);
}

function renderOrders() {
    const container = document.getElementById('recentOrdersContainer');
    if (!container) return;
    const orders = labDB.get(STORAGE_PREFIX + 'orders', [
        { orderId: 'BH-884912', customerName: 'Sneha Rao', total: 1149, date: '2026-10-04', items: [{ title: 'The Midnight Library', qty: 1 }, { title: 'Project Hail Mary', qty: 1 }] }
    ]);

    container.innerHTML = orders.map(o => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:12px; border-radius:8px; margin-bottom:10px; font-size:0.85rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong>#${o.orderId} - ${o.customerName}</strong>
                <span style="color:#10b981; font-weight:700;">₹${o.total}</span>
            </div>
            <p style="color:var(--text-muted);">${o.items.map(i => i.title).join(', ')}</p>
            <small style="color:var(--secondary);">${o.date}</small>
        </div>
    `).join('');
}

// Contact & FAQ
function handleContactSubmit(e) {
    e.preventDefault();
    alert('📬 Thank you! Your literary inquiry has been received. Our team will contact you within 24 hours.');
    e.target.reset();
}

function toggleFaq(header) {
    const item = header.parentElement;
    item.classList.toggle('open');
}
