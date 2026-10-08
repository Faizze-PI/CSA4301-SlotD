/**
 * Ko-Matha Smart Dairy Farm Management Portal
 * Experiment 31 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  PRODUCTS: 'komatha_products_v1',
  ORDERS: 'komatha_orders_v1',
  MILK_LOGS: 'komatha_milklogs_v1',
  COWS: 'komatha_cows_v1',
  CART: 'komatha_cart_v1'
};

const DEFAULT_PRODUCTS = [
  { id: 'PRD-01', name: 'Raw A1 Native Cow Milk', unit: '1 Liter Pouch', price: 75, icon: '🥛', desc: 'Single-source raw unadulterated milk from pasture-grazed Gir cows. Chilled within 15 minutes of milking.' },
  { id: 'PRD-02', name: 'Thick Farm Set Curd (Dahi)', unit: '500g Clay Tub', price: 55, icon: '🥣', desc: 'Cultured naturally with heritage microbial cultures, creating a velvety, probiotic-rich texture.' },
  { id: 'PRD-03', name: 'Traditional Palkova (Cova-Sweet)', unit: '250g Gift Box', price: 160, icon: '🍯', desc: 'Slowly simmered whole milk condensed over firewood with organic raw jaggery.' },
  { id: 'PRD-04', name: 'Cultured Desi Butter (Makkhan)', unit: '250g Pack', price: 210, icon: '🧈', desc: 'Traditional hand-churned white butter rich in aromatic butyric acid.' },
  { id: 'PRD-05', name: 'Vedic Bilona Desi Cow Ghee', unit: '500ml Glass Jar', price: 580, icon: '✨', desc: 'Boiled from cultured butter according to traditional ayurvedic protocols.' }
];

const DEFAULT_COWS = [
  { tag: 'COW-GIR-01', breed: 'Pure Gir (Gujarat)', avgYield: '15.5 L/day', health: 'Healthy • Lactating' },
  { tag: 'COW-SAH-04', breed: 'Sahiwal (Punjab)', avgYield: '17.0 L/day', health: 'Healthy • Peak Lactation' },
  { tag: 'COW-RDS-07', breed: 'Red Sindhi', avgYield: '13.2 L/day', health: 'Healthy • Monitored' },
  { tag: 'COW-KAN-09', breed: 'Kangeyam (Tamil Nadu)', avgYield: '11.0 L/day', health: 'Healthy • Grazing' }
];

const DEFAULT_REPORTS = [
  { period: 'Today (06 Oct 2026)', inflow: 340, dispatched: 310, balance: 30, fat: '4.8%', turnover: 25500 },
  { period: 'Yesterday (05 Oct 2026)', inflow: 360, dispatched: 345, balance: 15, fat: '4.7%', turnover: 27000 },
  { period: '04 Oct 2026', inflow: 330, dispatched: 320, balance: 10, fat: '4.9%', turnover: 24750 }
];

const DEFAULT_ORDERS = [
  { id: 'ORD-KM-4811', customer: 'S. Ramachandran', items: '2x Raw A1 Milk, 1x Ghee', slot: 'Morning (06:00 AM - 07:30 AM)', total: 730, date: '2026-10-05', status: 'Delivered' }
];

let appState = {
  currentRole: 'customer',
  activeCustomerTab: 'products',
  products: [],
  orders: [],
  cows: [],
  cart: [],
  currentReportPeriod: 'Daily'
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedProducts = labDB.get(STORAGE_KEYS.PRODUCTS);
  if (!storedProducts || storedProducts.length === 0) {
    labDB.set(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    appState.products = [...DEFAULT_PRODUCTS];
  } else {
    appState.products = storedProducts;
  }

  const storedOrders = labDB.get(STORAGE_KEYS.ORDERS);
  if (!storedOrders || storedOrders.length === 0) {
    labDB.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    appState.orders = [...DEFAULT_ORDERS];
  } else {
    appState.orders = storedOrders;
  }

  const storedCows = labDB.get(STORAGE_KEYS.COWS);
  if (!storedCows || storedCows.length === 0) {
    labDB.set(STORAGE_KEYS.COWS, DEFAULT_COWS);
    appState.cows = [...DEFAULT_COWS];
  } else {
    appState.cows = storedCows;
  }

  appState.cart = labDB.get(STORAGE_KEYS.CART) || [];
}

function renderApp() {
  renderProductsGrid();
  renderCustomerOrders();
  renderVendorCows();
  renderAdminReports();
  updateCartBadge();
  updateAdminMetrics();
  calculateVendorPayoutPreview();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('customerSection').classList.toggle('hidden', role !== 'customer');
  document.getElementById('vendorSection').classList.toggle('hidden', role !== 'vendor');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminReports();
    updateAdminMetrics();
  } else if (role === 'vendor') {
    renderVendorCows();
    calculateVendorPayoutPreview();
  } else {
    renderProductsGrid();
  }
}

// Customer Tabs
function switchCustomerTab(tabName) {
  appState.activeCustomerTab = tabName;
  const tabs = {
    products: 'custTabProducts',
    farmPractices: 'custTabFarm',
    myOrders: 'custTabOrders'
  };

  document.querySelectorAll('#customerSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

function renderProductsGrid() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = appState.products.map(p => `
    <div class="product-card">
      <div>
        <div class="product-icon-banner">
          <span>${p.icon}</span>
        </div>
        <h4>${p.name}</h4>
        <span class="badge badge-secondary text-xs my-1">${p.unit}</span>
        <p class="text-xs muted mt-1">${p.desc}</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 1rem;">
        <span class="font-bold text-success font-mono" style="font-size: 1.2rem;">₹${p.price}</span>
        <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">🛒 Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function addToCart(prdId) {
  const p = appState.products.find(x => x.id === prdId);
  if (!p) return;

  const existing = appState.cart.find(c => c.id === p.id);
  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({ ...p, qty: 1 });
  }

  labDB.set(STORAGE_KEYS.CART, appState.cart);
  updateCartBadge();
  showAlert(`Added ${p.name} to farm cart!`, 'success');
}

function updateCartBadge() {
  const totalQty = appState.cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = appState.cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const countBadge = document.getElementById('cartCountBadge');
  const totalBadge = document.getElementById('cartTotalBadge');

  if (countBadge) countBadge.innerText = totalQty;
  if (totalBadge) totalBadge.innerText = `₹${totalPrice.toLocaleString()}`;
}

function openCartModal() {
  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartModalTotal');
  if (!container || !totalEl) return;

  if (appState.cart.length === 0) {
    container.innerHTML = `<p class="muted text-center py-3">Your dairy basket is currently empty.</p>`;
    totalEl.innerText = '₹0';
  } else {
    const total = appState.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    totalEl.innerText = `₹${total.toLocaleString()}`;

    container.innerHTML = appState.cart.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
        <div>
          <strong>${item.name}</strong><br>
          <span class="text-xs muted">₹${item.price} x ${item.qty} (${item.unit})</span>
        </div>
        <div class="font-mono font-bold text-success">
          ₹${(item.price * item.qty).toLocaleString()}
        </div>
      </div>
    `).join('');
  }

  document.getElementById('cartModal').classList.remove('hidden');
}

function closeCartModal() {
  document.getElementById('cartModal').classList.add('hidden');
}

function handleCustomerCheckoutSubmit(event) {
  event.preventDefault();
  if (appState.cart.length === 0) {
    showAlert('Please select dairy items before ordering.', 'info');
    return;
  }

  const name = document.getElementById('custOrderName').value.trim();
  const phone = document.getElementById('custOrderPhone').value.trim();
  const address = document.getElementById('custOrderAddress').value.trim();
  const slot = document.getElementById('custOrderSlot').value;

  const total = appState.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemsSummary = appState.cart.map(i => `${i.qty}x ${i.name}`).join(', ');

  const newOrder = {
    id: 'ORD-KM-' + Math.floor(1000 + Math.random() * 9000),
    customer: name,
    phone,
    address,
    items: itemsSummary,
    slot,
    total,
    date: new Date().toISOString().split('T')[0],
    status: 'Scheduled'
  };

  appState.orders.unshift(newOrder);
  labDB.set(STORAGE_KEYS.ORDERS, appState.orders);

  appState.cart = [];
  labDB.set(STORAGE_KEYS.CART, appState.cart);
  updateCartBadge();

  closeCartModal();
  showAlert(`🎉 Delivery Scheduled! Order Ref: ${newOrder.id}. Slot: ${slot}`, 'success');

  renderCustomerOrders();
  updateAdminMetrics();
}

function renderCustomerOrders() {
  const container = document.getElementById('customerOrdersList');
  if (!container) return;

  if (appState.orders.length === 0) {
    container.innerHTML = `<p class="muted">No past purchase orders found.</p>`;
    return;
  }

  container.innerHTML = appState.orders.map(o => `
    <div class="order-history-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge badge-success text-xs mb-1">${o.status}</span>
          <h4>Order Ref: <span class="font-mono text-primary">${o.id}</span></h4>
          <p class="text-sm">Items: <strong>${o.items}</strong></p>
          <p class="text-xs muted">Slot: <strong>${o.slot}</strong> | Ordered on ${o.date}</p>
        </div>
        <div class="text-right">
          <span class="muted text-xs block">BILL AMOUNT</span>
          <span class="font-mono font-bold text-success" style="font-size: 1.25rem;">₹${o.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Vendor Payouts
function calculateVendorPayoutPreview() {
  const qty = parseFloat(document.getElementById('logQuantity')?.value) || 45;
  const fat = parseFloat(document.getElementById('logFat')?.value) || 4.8;
  const snf = parseFloat(document.getElementById('logSnf')?.value) || 8.9;

  // Rate formula: Base 35 + (fat - 3.5)*6 + (snf - 8.5)*4
  const ratePerLiter = Math.max(30, 35 + (fat - 3.5) * 6.0 + (snf - 8.5) * 4.0);
  const totalPayout = ratePerLiter * qty;

  const rateEl = document.getElementById('vendorRatePerLiter');
  const payoutEl = document.getElementById('vendorSessionPayout');

  if (rateEl) rateEl.innerText = `₹${ratePerLiter.toFixed(2)} / L`;
  if (payoutEl) payoutEl.innerText = `₹${totalPayout.toFixed(2)}`;
}

function handleVendorLogMilk(event) {
  event.preventDefault();
  const session = document.getElementById('logSession').value;
  const qty = parseFloat(document.getElementById('logQuantity').value);
  const fat = parseFloat(document.getElementById('logFat').value);
  const snf = parseFloat(document.getElementById('logSnf').value);

  const rate = Math.max(30, 35 + (fat - 3.5) * 6.0 + (snf - 8.5) * 4.0);
  const payout = rate * qty;

  showAlert(`🌾 Logged ${qty} Liters (${session})! Payout of ₹${payout.toFixed(2)} credited to Murugan Dairy Cooperative ledger.`, 'success');
  updateAdminMetrics();
}

function renderVendorCows() {
  const tbody = document.getElementById('vendorCowsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.cows.map(c => `
    <tr>
      <td class="font-mono font-bold text-primary">${c.tag}</td>
      <td><strong>${c.breed}</strong></td>
      <td class="font-mono">${c.avgYield}</td>
      <td><span class="badge badge-success text-xs">${c.health}</span></td>
    </tr>
  `).join('');
}

// Admin Reports
function switchReportPeriod(period, btnEl) {
  appState.currentReportPeriod = period;
  if (btnEl) {
    btnEl.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderAdminReports();
}

function renderAdminReports() {
  const tbody = document.getElementById('adminReportsTableBody');
  if (!tbody) return;

  let reports = [...DEFAULT_REPORTS];
  if (appState.currentReportPeriod === 'Monthly') {
    reports = [
      { period: 'October 2026', inflow: 9800, dispatched: 9400, balance: 400, fat: '4.8%', turnover: 735000 },
      { period: 'September 2026', inflow: 10200, dispatched: 9950, balance: 250, fat: '4.7%', turnover: 765000 },
      { period: 'August 2026', inflow: 9900, dispatched: 9700, balance: 200, fat: '4.8%', turnover: 742500 }
    ];
  } else if (appState.currentReportPeriod === 'Yearly') {
    reports = [
      { period: 'FY 2025 - 2026', inflow: 118000, dispatched: 114500, balance: 3500, fat: '4.8%', turnover: 8850000 },
      { period: 'FY 2024 - 2025', inflow: 104000, dispatched: 101000, balance: 3000, fat: '4.7%', turnover: 7800000 }
    ];
  }

  tbody.innerHTML = reports.map(r => `
    <tr>
      <td><strong>${r.period}</strong></td>
      <td class="font-mono">${r.inflow.toLocaleString()}</td>
      <td class="font-mono">${r.dispatched.toLocaleString()}</td>
      <td class="font-mono font-bold text-success">${r.balance.toLocaleString()}</td>
      <td class="font-mono">${r.fat}</td>
      <td class="font-bold font-mono text-primary">₹${r.turnover.toLocaleString()}</td>
    </tr>
  `).join('');

  // Orders
  const ordersTbody = document.getElementById('adminOrdersTableBody');
  if (ordersTbody) {
    ordersTbody.innerHTML = appState.orders.map(o => `
      <tr>
        <td class="font-mono font-bold text-primary">${o.id}</td>
        <td><strong>${o.customer}</strong></td>
        <td class="text-xs">${o.items}</td>
        <td class="text-xs">${o.slot}</td>
        <td class="font-mono font-bold text-success">₹${o.total}</td>
        <td><span class="badge badge-success">${o.status}</span></td>
      </tr>
    `).join('');
  }
}

function updateAdminMetrics() {
  const totalSales = appState.orders.reduce((sum, o) => sum + o.total, 0) + 25500;
  const disbursal = 18450;

  const elStock = document.getElementById('adminTotalMilkStock');
  const elSales = document.getElementById('adminSalesRevenue');
  const elDisb = document.getElementById('adminVendorDisbursal');

  if (elStock) elStock.innerText = '450 Liters';
  if (elSales) elSales.innerText = `₹${totalSales.toLocaleString()}`;
  if (elDisb) elDisb.innerText = `₹${disbursal.toLocaleString()}`;
}

function showAlert(message, type = 'info') {
  const banner = document.getElementById('alertBanner');
  if (!banner) return;

  banner.className = `alert-banner alert-${type}`;
  banner.innerText = message;
  banner.classList.remove('hidden');

  setTimeout(() => {
    banner.classList.add('hidden');
  }, 4500);
}
