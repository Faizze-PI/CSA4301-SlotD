// OmniStore Universal E-Commerce Engine
const STORAGE_PREFIX = 'omnistore_';

const DEFAULT_PRODUCTS = [
    {
        id: 'PRD-101',
        title: 'Sony WH-1000XM5 Noise Canceling Headphones',
        brand: 'Sony',
        category: 'Electronics',
        price: 29990,
        rating: 4.8,
        reviewsCount: 420,
        stock: 24,
        desc: 'Industry-leading noise cancelation with two processors and 8 microphones for exceptional call quality and spatial audio.'
    },
    {
        id: 'PRD-102',
        title: 'Apple Watch Series 9 GPS 45mm',
        brand: 'Apple',
        category: 'Electronics',
        price: 41900,
        rating: 4.9,
        reviewsCount: 310,
        stock: 15,
        desc: 'S9 SiP chip with double tap gesture control, brighter always-on display, and advanced health metric sensors.'
    },
    {
        id: 'PRD-103',
        title: 'Nike Air Zoom Pegasus 40 Running Shoes',
        brand: 'Nike',
        category: 'Footwear',
        price: 8495,
        rating: 4.7,
        reviewsCount: 560,
        stock: 30,
        desc: 'Springy ride for any road run with dual Zoom Air units and an engineered circular mesh upper for maximum breathability.'
    },
    {
        id: 'PRD-104',
        title: 'Levi\'s 501 Original Fit Denim Jeans',
        brand: 'Levi\'s',
        category: 'Apparel',
        price: 3299,
        rating: 4.6,
        reviewsCount: 680,
        stock: 40,
        desc: 'The blueprint for every pair of modern jeans since 1873, featuring a straight leg cut and signature button fly.'
    },
    {
        id: 'PRD-105',
        title: 'Philips Smart WiFi Ambient Hue Lamp',
        brand: 'Philips',
        category: 'Home',
        price: 1999,
        rating: 4.5,
        reviewsCount: 290,
        stock: 55,
        desc: '16 million colors and tunable white lighting controllable via mobile app or voice assistants with timer automation.'
    },
    {
        id: 'PRD-106',
        title: 'Apple MagSafe Leather Wallet with Find My',
        brand: 'Apple',
        category: 'Accessories',
        price: 5900,
        rating: 4.7,
        reviewsCount: 180,
        stock: 20,
        desc: 'Crafted from specially tanned French leather with built-in magnets and Find My support to locate misplaced cards.'
    }
];

// State
let products = [];
let cart = [];
let orders = [];
let promoDiscountPct = 0;
let currentRole = 'customer';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderFeaturedProducts();
    renderCatalog();
    renderCart();
    renderOrders();
    renderInventory();
});

function loadData() {
    products = labDB.get(STORAGE_PREFIX + 'products', DEFAULT_PRODUCTS);
    cart = labDB.get(STORAGE_PREFIX + 'cart', []);
    orders = labDB.get(STORAGE_PREFIX + 'orders', [
        {
            orderId: 'ORD-719402',
            date: '2026-10-03',
            customerName: 'Alex Kumar',
            items: [{ title: 'Nike Air Zoom Pegasus 40 Running Shoes', qty: 1, price: 8495 }],
            total: 8495,
            status: 'In Transit',
            trackingStep: 3
        }
    ]);
    updateCartBadges();
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'products', products);
    labDB.set(STORAGE_PREFIX + 'cart', cart);
    labDB.set(STORAGE_PREFIX + 'orders', orders);
    updateCartBadges();
}

function switchRole(role) {
    currentRole = role;
    const tabMerchant = document.getElementById('tabMerchant');
    if (role === 'merchant') {
        tabMerchant.style.display = 'inline-flex';
    } else {
        tabMerchant.style.display = 'none';
        if (document.getElementById('tab-merchant').classList.contains('active')) {
            showTab('storefront');
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

// Storefront & Featured
function renderFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    grid.innerHTML = products.slice(0, 4).map(p => createProductCardHTML(p)).join('');
}

function createProductCardHTML(p) {
    return `
        <div class="prod-card">
            <div class="prod-thumb-area">
                <span class="prod-badge">${p.category}</span>
                <i class="fas ${getProductIcon(p.category)} fa-4x" style="color:rgba(255,255,255,0.3)"></i>
            </div>
            <div class="prod-body">
                <span class="prod-brand">${p.brand}</span>
                <h4 class="prod-title">${p.title}</h4>
                <div class="prod-rating">
                    <i class="fas fa-star"></i> ${p.rating} (${p.reviewsCount} reviews)
                </div>
                <div class="prod-foot-row">
                    <span class="prod-price">₹${p.price.toLocaleString('en-IN')}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')"><i class="fas fa-cart-plus"></i> Add</button>
                </div>
            </div>
        </div>
    `;
}

function getProductIcon(cat) {
    if (cat === 'Electronics') return 'fa-headphones';
    if (cat === 'Footwear') return 'fa-shoe-prints';
    if (cat === 'Apparel') return 'fa-tshirt';
    if (cat === 'Home') return 'fa-lightbulb';
    return 'fa-wallet';
}

function quickFilterCategory(cat) {
    showTab('catalog');
    const select = document.getElementById('catSelect');
    if (select) {
        select.value = cat;
        filterProducts();
    }
}

// Catalog Filtering
function renderCatalog(list = products) {
    const grid = document.getElementById('catalogGrid');
    const countEl = document.getElementById('resultsCount');
    if (!grid) return;

    countEl.textContent = `Showing ${list.length} item(s) found in store`;
    grid.innerHTML = list.map(p => createProductCardHTML(p)).join('');
}

function filterProducts() {
    const query = (document.getElementById('headerSearchInput').value || '').toLowerCase();
    const cat = document.getElementById('catSelect').value;
    const brand = document.getElementById('brandSelect').value;
    const maxPrice = parseFloat(document.getElementById('priceRange').value) || 999999;
    const sort = document.getElementById('sortSelect').value;

    let filtered = products.filter(p => {
        const matchesQuery = p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
        const matchesCat = (cat === 'All') || (p.category === cat);
        const matchesBrand = (brand === 'All') || (p.brand === brand);
        const matchesPrice = p.price <= maxPrice;
        return matchesQuery && matchesCat && matchesBrand && matchesPrice;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') filtered.sort((a, b) => b.rating - a.rating);

    renderCatalog(filtered);
}

function updatePrice(val) {
    document.getElementById('priceDisplay').textContent = '₹' + parseInt(val).toLocaleString('en-IN');
    filterProducts();
}

function handleHeaderSearch(e) {
    showTab('catalog');
    filterProducts();
}

// Shopping Cart
function addToCart(prodId) {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    const existing = cart.find(i => i.id === prodId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: prod.id, title: prod.title, price: prod.price, qty: 1 });
    }

    saveData();
    renderCart();
    alert(`🛍️ "${prod.title}" added to your OmniStore cart!`);
}

function updateCartQty(prodId, delta) {
    const item = cart.find(i => i.id === prodId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== prodId);
    }

    saveData();
    renderCart();
}

function updateCartBadges() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartCountBadge');
    const navCount = document.getElementById('cartCountNav');
    if (badge) badge.textContent = totalQty;
    if (navCount) navCount.textContent = totalQty;
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--text-muted);">
                <i class="fas fa-shopping-basket fa-3x" style="margin-bottom:12px; opacity:0.3"></i>
                <p>Your shopping bag is empty.</p>
                <button class="btn btn-secondary btn-sm" style="margin-top:12px;" onclick="showTab('catalog')">Start Shopping</button>
            </div>
        `;
        recalcSummary(0);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item-row">
            <div>
                <h4 style="font-size:0.95rem; margin-bottom:4px;">${item.title}</h4>
                <span style="color:var(--text-muted); font-size:0.85rem;">₹${item.price.toLocaleString('en-IN')}</span>
            </div>
            <div class="cart-qty-ctrl">
                <button onclick="updateCartQty('${item.id}', -1)">-</button>
                <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                <button onclick="updateCartQty('${item.id}', 1)">+</button>
                <span style="font-weight:700; margin-left:14px; min-width:80px; text-align:right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    recalcSummary(subtotal);
}

function recalcSummary(subtotal) {
    const delivery = (subtotal === 0 || subtotal > 1000) ? 0 : 99;
    const discount = Math.round(subtotal * promoDiscountPct);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.18);
    const grandTotal = taxableAmount + tax + delivery;

    document.getElementById('subtotalVal').textContent = '₹' + subtotal.toLocaleString('en-IN');
    document.getElementById('deliveryVal').textContent = delivery === 0 ? 'FREE' : '₹' + delivery;

    if (promoDiscountPct > 0) {
        document.getElementById('discountLine').style.display = 'flex';
        document.getElementById('discountVal').textContent = '-₹' + discount.toLocaleString('en-IN');
    } else {
        document.getElementById('discountLine').style.display = 'none';
    }

    document.getElementById('taxVal').textContent = '₹' + tax.toLocaleString('en-IN');
    document.getElementById('totalVal').textContent = '₹' + grandTotal.toLocaleString('en-IN');
}

function applyCoupon() {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    if (code === 'SAVE15') {
        promoDiscountPct = 0.15;
        alert('🎉 Promotional code SAVE15 applied! You received 15% discount.');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        recalcSummary(subtotal);
    } else {
        alert('❌ Invalid coupon code. Try entering "SAVE15".');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your shopping bag is empty.');
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const payMode = document.getElementById('payMethod').value;

    if (!name || !phone || !address) {
        alert('Please fill out recipient details and delivery address.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = (subtotal > 1000) ? 0 : 99;
    const discount = Math.round(subtotal * promoDiscountPct);
    const tax = Math.round((subtotal - discount) * 0.18);
    const grandTotal = (subtotal - discount) + tax + delivery;

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
        orderId,
        date: new Date().toLocaleDateString(),
        customerName: name,
        phone,
        address,
        payMode,
        items: [...cart],
        subtotal,
        discount,
        tax,
        total: grandTotal,
        status: 'Order Placed',
        trackingStep: 1
    };

    orders.unshift(newOrder);
    cart = [];
    promoDiscountPct = 0;
    saveData();
    renderCart();
    renderOrders();
    showOrderModal(newOrder);
}

function showOrderModal(order) {
    const modal = document.getElementById('orderConfirmModal');
    const content = document.getElementById('orderConfirmModalContent');

    content.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <div style="width:60px; height:60px; border-radius:50%; background:rgba(16,185,129,0.2); color:#10b981; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:1.8rem;">
                <i class="fas fa-check"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p style="color:var(--text-muted); font-size:0.9rem;">Consignment ID: <strong>#${order.orderId}</strong></p>
            <p style="color:#10b981; font-size:0.85rem; margin-top:4px;"><i class="fas fa-envelope-circle-check"></i> Dispatch confirmation email dispatched to ${order.customerName}</p>
        </div>

        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:8px; margin-bottom:18px; font-size:0.9rem;">
            <p><strong>Deliver To:</strong> ${order.customerName} (${order.phone})</p>
            <p style="color:var(--text-muted); margin-top:4px;">${order.address}</p>
            <p style="color:var(--text-muted); margin-top:4px;"><strong>Payment Mode:</strong> ${order.payMode}</p>
        </div>

        <div style="margin-bottom:20px;">
            <h4 style="margin-bottom:8px; font-size:0.95rem;">Purchased Consignment:</h4>
            ${order.items.map(i => `
                <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem;">
                    <span>${i.title} (x${i.qty})</span>
                    <span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span>
                </div>
            `).join('')}
            <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:8px; margin-top:8px; display:flex; justify-content:space-between; font-weight:700;">
                <span>Total Amount Paid:</span>
                <span style="color:#10b981;">₹${order.total.toLocaleString('en-IN')}</span>
            </div>
        </div>

        <button class="btn btn-primary btn-block" onclick="window.print();"><i class="fas fa-print"></i> Print Official Tax Invoice</button>
    `;

    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderConfirmModal').classList.remove('active');
}

// Order History
function renderOrders() {
    const grid = document.getElementById('ordersListGrid');
    if (!grid) return;

    if (orders.length === 0) {
        grid.innerHTML = `<p style="color:var(--text-muted);">No past orders found.</p>`;
        return;
    }

    grid.innerHTML = orders.map(o => `
        <div class="order-history-card">
            <div class="order-hist-header">
                <div>
                    <h4 style="font-size:1.05rem;">Consignment #${o.orderId}</h4>
                    <small style="color:var(--text-muted);">${o.date} • ${o.customerName}</small>
                </div>
                <span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; padding:4px 12px; border-radius:12px; font-weight:600;">
                    ${o.status}
                </span>
            </div>

            <div class="stepper-row">
                <div class="step-node active"><i class="fas fa-check-circle"></i><span>Placed</span></div>
                <div class="step-node ${o.trackingStep >= 2 ? 'active' : ''}"><i class="fas fa-box-open"></i><span>Packed</span></div>
                <div class="step-node ${o.trackingStep >= 3 ? 'active' : ''}"><i class="fas fa-truck"></i><span>In Transit</span></div>
                <div class="step-node ${o.trackingStep >= 4 ? 'active' : ''}"><i class="fas fa-home"></i><span>Delivered</span></div>
            </div>

            <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:12px;">
                ${o.items.map(i => `${i.title} (x${i.qty})`).join(', ')}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; font-size:1.1rem; color:#fff;">Total: ₹${o.total.toLocaleString('en-IN')}</span>
                <button class="btn btn-secondary btn-sm" onclick="showOrderModal(orders.find(ord => ord.orderId === '${o.orderId}'))"><i class="fas fa-file-invoice"></i> View Tax Invoice</button>
            </div>
        </div>
    `).join('');
}

// Merchant Inventory
function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
        <tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.title}<br><small style="color:var(--text-muted);">${p.brand}</small></td>
            <td>${p.category}</td>
            <td>₹${p.price.toLocaleString('en-IN')}</td>
            <td><span class="badge" style="background:${p.stock > 10 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${p.stock > 10 ? '#10b981' : '#ef4444'}; padding:2px 8px; border-radius:10px;">${p.stock} Units</span></td>
        </tr>
    `).join('');
}

function handleCreateProduct(e) {
    e.preventDefault();
    const newP = {
        id: 'PRD-' + (products.length + 101),
        title: document.getElementById('newProdName').value.trim(),
        brand: document.getElementById('newProdBrand').value.trim(),
        category: document.getElementById('newProdCategory').value,
        price: parseInt(document.getElementById('newProdPrice').value) || 999,
        stock: parseInt(document.getElementById('newProdStock').value) || 20,
        desc: document.getElementById('newProdDesc').value.trim(),
        rating: 5.0,
        reviewsCount: 1
    };

    products.push(newP);
    saveData();
    renderFeaturedProducts();
    renderCatalog();
    renderInventory();
    e.target.reset();
    alert(`✅ Product "${newP.title}" successfully registered in OmniStore warehouse inventory!`);
}
