/**
 * Ram Infotech - Laptop Sales, Repair Service Center & Corporate Rentals
 * Experiment 32 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  LAPTOPS: 'ram_laptops_v1',
  TICKETS: 'ram_tickets_v1',
  LEASES: 'ram_leases_v1',
  CART: 'ram_cart_v1'
};

const DEFAULT_LAPTOPS = [
  { id: 'LAP-01', brand: 'Dell', model: 'Dell Latitude 5440 Business Notebook', category: 'Business', specs: ['Intel Core i5 13th Gen', '16GB DDR5', '512GB NVMe SSD', '14" FHD Anti-Glare', 'Intel Iris Xe'], price: 62000, stock: 8 },
  { id: 'LAP-02', brand: 'Lenovo', model: 'Lenovo ThinkPad T14s Gen 4', category: 'Business', specs: ['AMD Ryzen 7 Pro 7840U', '32GB LPDDR5x', '1TB Gen4 SSD', '14" OLED 2.8K 400 nits'], price: 84000, stock: 5 },
  { id: 'LAP-03', brand: 'Apple', model: 'Apple MacBook Air 13" (M3 Chip)', category: 'Student', specs: ['Apple M3 8-Core CPU', '16GB Unified Memory', '512GB SSD', '13.6" Liquid Retina', '18h Battery'], price: 114000, stock: 6 },
  { id: 'LAP-04', brand: 'ASUS', model: 'ASUS ROG Zephyrus G16 High Performance', category: 'Gaming', specs: ['Intel Core i9 14900HX', '32GB DDR5', '1TB SSD', 'NVIDIA RTX 4070 8GB', '240Hz OLED'], price: 155000, stock: 3 },
  { id: 'LAP-05', brand: 'HP', model: 'HP Pavilion 15 Everyday Productivity', category: 'Student', specs: ['Intel Core i5 12th Gen', '16GB RAM', '512GB SSD', '15.6" IPS FHD', 'Fast Charge'], price: 54000, stock: 11 }
];

const DEFAULT_TICKETS = [
  { id: 'REP-1021', customer: 'K. Arvind', phone: '+91 98402 11994', model: 'Dell Latitude 5420', category: 'Broken Screen / Display Flickering', notes: 'Display backlight flickering after accidental drop on edge.', mode: 'Direct Lab Drop-off (T. Nagar Center)', stage: 'Under Repair', estimate: 4500, tech: 'TECH-81', date: '2026-10-04' },
  { id: 'REP-1022', customer: 'Priya S.', phone: '+91 94441 22810', model: 'Lenovo Yoga 7i', category: 'Dead Battery / Fast Drain', notes: 'Battery health drops from 100% to 15% in 30 minutes.', mode: 'Doorstep Courier Pickup', stage: 'Ready for Pickup', estimate: 2800, tech: 'TECH-81', date: '2026-10-05' }
];

const DEFAULT_LEASES = [
  { id: 'LEASE-8801', hirer: 'Apex Cloud Technologies Pvt Ltd', gst: '33AAACA9921B1Z2', tier: 'Core i5 • 16GB RAM • 512GB SSD', qty: 5, duration: '3 Months', deposit: 15000, monthly: 7500, total: 37500, start: '2026-10-10' }
];

let appState = {
  currentRole: 'customer',
  activeCustomerTab: 'store',
  laptops: [],
  tickets: [],
  leases: [],
  cart: []
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedLaptops = labDB.get(STORAGE_KEYS.LAPTOPS);
  if (!storedLaptops || storedLaptops.length === 0) {
    labDB.set(STORAGE_KEYS.LAPTOPS, DEFAULT_LAPTOPS);
    appState.laptops = [...DEFAULT_LAPTOPS];
  } else {
    appState.laptops = storedLaptops;
  }

  const storedTickets = labDB.get(STORAGE_KEYS.TICKETS);
  if (!storedTickets || storedTickets.length === 0) {
    labDB.set(STORAGE_KEYS.TICKETS, DEFAULT_TICKETS);
    appState.tickets = [...DEFAULT_TICKETS];
  } else {
    appState.tickets = storedTickets;
  }

  const storedLeases = labDB.get(STORAGE_KEYS.LEASES);
  if (!storedLeases || storedLeases.length === 0) {
    labDB.set(STORAGE_KEYS.LEASES, DEFAULT_LEASES);
    appState.leases = [...DEFAULT_LEASES];
  } else {
    appState.leases = storedLeases;
  }

  appState.cart = labDB.get(STORAGE_KEYS.CART) || [];
}

function renderApp() {
  renderLaptopsCatalog();
  renderTechnicianTickets();
  renderAdminInventory();
  renderAdminLeases();
  updateCartBadge();
  updateAdminMetrics();
  calculateRentalFees();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('customerSection').classList.toggle('hidden', role !== 'customer');
  document.getElementById('technicianSection').classList.toggle('hidden', role !== 'technician');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminInventory();
    renderAdminLeases();
    updateAdminMetrics();
  } else if (role === 'technician') {
    renderTechnicianTickets();
  } else {
    renderLaptopsCatalog();
  }
}

// Customer Tabs
function switchCustomerTab(tabName) {
  appState.activeCustomerTab = tabName;
  const tabs = {
    store: 'custTabStore',
    bookService: 'custTabService',
    trackService: 'custTabTrack',
    rental: 'custTabRental'
  };

  document.querySelectorAll('#customerSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

// Store & Catalog
function filterLaptops() {
  const brand = document.getElementById('brandFilterSelect').value;
  const usage = document.getElementById('usageFilterSelect').value;
  renderLaptopsCatalog(brand, usage);
}

function renderLaptopsCatalog(brandFilter = 'All', usageFilter = 'All') {
  const grid = document.getElementById('laptopsCatalogGrid');
  if (!grid) return;

  let list = appState.laptops;
  if (brandFilter !== 'All') {
    list = list.filter(l => l.brand === brandFilter);
  }
  if (usageFilter !== 'All') {
    list = list.filter(l => l.category === usageFilter);
  }

  grid.innerHTML = list.map(l => `
    <div class="laptop-card">
      <div>
        <div class="laptop-banner-thumb">
          <span>💻</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h4>${l.model}</h4>
          <span class="badge ${l.stock > 0 ? 'badge-success' : 'badge-danger'} text-xs">
            ${l.stock > 0 ? l.stock + ' in Stock' : 'Sold Out'}
          </span>
        </div>

        <div class="specs-badge-list">
          ${l.specs.map(s => `<span class="spec-chip">${s}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 1rem;">
        <span class="font-bold text-success font-mono" style="font-size: 1.25rem;">₹${l.price.toLocaleString()}</span>
        <button class="btn btn-primary btn-sm" onclick="addToCart('${l.id}')" ${l.stock === 0 ? 'disabled' : ''}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

function addToCart(laptopId) {
  const l = appState.laptops.find(x => x.id === laptopId);
  if (!l || l.stock === 0) return;

  const existing = appState.cart.find(c => c.id === l.id);
  if (existing) {
    if (existing.qty < l.stock) {
      existing.qty += 1;
    } else {
      showAlert('Maximum available stock in cart already.', 'warning');
      return;
    }
  } else {
    appState.cart.push({ ...l, qty: 1 });
  }

  labDB.set(STORAGE_KEYS.CART, appState.cart);
  updateCartBadge();
  showAlert(`Added ${l.model} to cart!`, 'success');
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
    container.innerHTML = `<p class="muted text-center py-3">Your shopping cart is currently empty.</p>`;
    totalEl.innerText = '₹0';
  } else {
    const total = appState.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    totalEl.innerText = `₹${total.toLocaleString()}`;

    container.innerHTML = appState.cart.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
        <div>
          <strong>${item.model}</strong><br>
          <span class="text-xs muted">₹${item.price.toLocaleString()} x ${item.qty}</span>
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

function handleCheckoutLaptops() {
  if (appState.cart.length === 0) {
    showAlert('Your cart is empty.', 'info');
    return;
  }

  // Deduct inventory
  appState.cart.forEach(item => {
    const l = appState.laptops.find(x => x.id === item.id);
    if (l) l.stock = Math.max(0, l.stock - item.qty);
  });
  labDB.set(STORAGE_KEYS.LAPTOPS, appState.laptops);

  appState.cart = [];
  labDB.set(STORAGE_KEYS.CART, appState.cart);
  updateCartBadge();
  closeCartModal();

  showAlert('🎉 Invoice Generated! Laptop purchase order processed successfully.', 'success');
  renderLaptopsCatalog();
  renderAdminInventory();
  updateAdminMetrics();
}

// Repair Service Booking
function handleBookServiceSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('serviceCustName').value.trim();
  const phone = document.getElementById('serviceCustPhone').value.trim();
  const model = document.getElementById('serviceModel').value.trim();
  const category = document.getElementById('serviceCategorySelect').value;
  const notes = document.getElementById('serviceIssueNotes').value.trim();
  const mode = document.getElementById('serviceModeSelect').value;

  const newTicket = {
    id: 'REP-' + Math.floor(1000 + Math.random() * 9000),
    customer: name,
    phone,
    model,
    category,
    notes,
    mode,
    stage: 'Received in Lab',
    estimate: 1500,
    tech: 'TECH-81',
    date: new Date().toISOString().split('T')[0]
  };

  appState.tickets.unshift(newTicket);
  labDB.set(STORAGE_KEYS.TICKETS, appState.tickets);

  showAlert(`🛠️ Service Ticket ${newTicket.id} booked! Our technician has received the job request.`, 'success');

  document.getElementById('trackTicketQuery').value = newTicket.id;
  switchCustomerTab('trackService');
  handleTrackTicketSearch();
  renderTechnicianTickets();
  updateAdminMetrics();
}

function handleTrackTicketSearch() {
  const query = (document.getElementById('trackTicketQuery').value || '').trim().toUpperCase();
  const container = document.getElementById('ticketQueryResultContainer');
  if (!container) return;

  const t = appState.tickets.find(x => x.id.toUpperCase() === query);
  if (!t) {
    container.innerHTML = `
      <div class="empty-state-box text-center py-4">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🔍</span>
        <h4>Ticket Not Found</h4>
        <p class="muted">No service ticket found for ref "${query}". Please check your token receipt.</p>
      </div>
    `;
    return;
  }

  const stages = ['Received in Lab', 'Diagnosed', 'Under Repair', 'Ready for Pickup'];
  const curIdx = stages.indexOf(t.stage);

  container.innerHTML = `
    <div class="ticket-tracker-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge badge-primary">${t.stage}</span>
          <h3 class="mt-1">Ticket: <span class="font-mono text-danger">${t.id}</span></h3>
          <p class="muted">Machine: <strong>${t.model}</strong> | Fault: <strong>${t.category}</strong></p>
          <p class="text-xs muted">Customer: ${t.customer} (${t.phone}) | Mode: ${t.mode}</p>
        </div>
        <div class="text-right">
          <span class="muted text-xs block">ESTIMATED REPAIR BILL</span>
          <span class="font-mono font-bold text-success" style="font-size: 1.4rem;">₹${t.estimate.toLocaleString()}</span>
        </div>
      </div>

      <div class="milestones-stepper">
        ${stages.map((st, i) => `
          <div class="stepper-step ${i <= curIdx ? 'completed' : ''}">
            <span style="font-size: 1.25rem;">${i <= curIdx ? '✅' : '⚪'}</span><br>
            <span>${st}</span>
          </div>
        `).join('')}
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 1rem; font-size: 0.85rem;" class="muted">
        <strong>Bench Notes:</strong> ${t.notes}
      </div>
    </div>
  `;
}

// Corporate Rental Calculator
function calculateRentalFees() {
  const tierSelect = document.getElementById('rentLaptopTier');
  const option = tierSelect.options[tierSelect.selectedIndex];
  const monthlyRatePerUnit = parseFloat(option.getAttribute('data-monthly')) || 1500;
  const depositPerUnit = parseFloat(option.getAttribute('data-deposit')) || 3000;

  const qty = parseInt(document.getElementById('rentQuantity')?.value, 10) || 5;
  const duration = parseInt(document.getElementById('rentDurationMonths')?.value, 10) || 3;

  const monthlyTotal = monthlyRatePerUnit * qty;
  const depositTotal = depositPerUnit * qty;
  const discountMultiplier = duration === 12 ? 0.90 : 1.0;
  const grandPayable = (monthlyTotal * duration * discountMultiplier) + depositTotal;

  const elM = document.getElementById('rentMonthlyTotal');
  const elD = document.getElementById('rentDepositTotal');
  const elG = document.getElementById('rentGrandPayable');

  if (elM) elM.innerText = `₹${monthlyTotal.toLocaleString()}.00`;
  if (elD) elD.innerText = `₹${depositTotal.toLocaleString()}.00`;
  if (elG) elG.innerText = `₹${grandPayable.toLocaleString()}.00`;
}

function handleGenerateRentalAgreement(event) {
  event.preventDefault();
  const hirer = document.getElementById('rentHirerName').value.trim();
  const idProof = document.getElementById('rentIdProof').value.trim();
  const tier = document.getElementById('rentLaptopTier').value;
  const qty = parseInt(document.getElementById('rentQuantity').value, 10);
  const duration = parseInt(document.getElementById('rentDurationMonths').value, 10);
  const start = document.getElementById('rentStartDate').value;

  const tierSelect = document.getElementById('rentLaptopTier');
  const option = tierSelect.options[tierSelect.selectedIndex];
  const monthlyRate = parseFloat(option.getAttribute('data-monthly')) * qty;
  const deposit = parseFloat(option.getAttribute('data-deposit')) * qty;
  const grand = (monthlyRate * duration) + deposit;

  const leaseObj = {
    id: 'LEASE-' + Math.floor(1000 + Math.random() * 9000),
    hirer,
    gst: idProof,
    tier,
    qty,
    duration: `${duration} Months`,
    deposit,
    monthly: monthlyRate,
    total: grand,
    start
  };

  appState.leases.unshift(leaseObj);
  labDB.set(STORAGE_KEYS.LEASES, appState.leases);

  renderAdminLeases();
  updateAdminMetrics();

  // Show legal agreement modal
  const paper = document.getElementById('contractPrintableContent');
  if (paper) {
    paper.innerHTML = `
      <div class="contract-header-seal">
        <h3 style="color: #06b6d4; margin: 0;">RAM INFOTECH LAPTOP RENTAL AGREEMENT</h3>
        <p style="margin: 0; font-size: 0.75rem; color: #94a3b8;">COMMERCIAL ASSET LEASE CONTRACT • LEASE REF: ${leaseObj.id}</p>
      </div>

      <p>This binding agreement is entered between <strong>RAM INFOTECH</strong> (Lessor) and <strong>${hirer}</strong> (Lessee, GST/ID: ${idProof}) on ${start}.</p>
      
      <div class="fee-row"><span>Equipment Leased:</span><strong>${qty} Units of [${tier}]</strong></div>
      <div class="fee-row"><span>Lease Tenure:</span><strong>${duration} Months from ${start}</strong></div>
      <div class="fee-row"><span>Monthly Rental:</span><strong>₹${monthlyRate.toLocaleString()} / Month</strong></div>
      <div class="fee-row"><span>Refundable Security Deposit:</span><strong style="color: #10b981;">₹${deposit.toLocaleString()}</strong></div>
      <div class="fee-row fee-total"><span>Total Advance Commitment:</span><strong style="color: #06b6d4; font-size: 1.15rem;">₹${grand.toLocaleString()}</strong></div>

      <p class="mt-3 text-xs muted">
        Terms: 1. Equipment remains property of Ram Infotech. 2. Any hardware tampering voids deposit. 3. Free chip-level maintenance included during tenure.
      </p>
    `;
  }

  document.getElementById('contractModal').classList.remove('hidden');
}

function closeContractModal() {
  document.getElementById('contractModal').classList.add('hidden');
}

// Technician Workbench
function renderTechnicianTickets() {
  const tbody = document.getElementById('technicianTicketsTableBody');
  if (!tbody) return;

  const stages = ['Received in Lab', 'Diagnosed', 'Under Repair', 'Ready for Pickup'];

  tbody.innerHTML = appState.tickets.map(t => {
    const curIdx = stages.indexOf(t.stage);
    const nextStage = curIdx < stages.length - 1 ? stages[curIdx + 1] : null;

    return `
      <tr>
        <td class="font-mono font-bold">${t.id}</td>
        <td><strong>${t.model}</strong></td>
        <td class="text-xs">${t.category}</td>
        <td>${t.customer}</td>
        <td><span class="badge ${t.stage === 'Ready for Pickup' ? 'badge-success' : 'badge-warning'} text-xs">${t.stage}</span></td>
        <td class="font-bold font-mono text-success">₹${t.estimate}</td>
        <td>
          ${nextStage ? `
            <button class="btn btn-warning btn-xs" onclick="techAdvanceStage('${t.id}', '${nextStage}')">
              Advance to: ${nextStage}
            </button>
          ` : `
            <span class="text-xs text-success font-bold">Ready</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function techAdvanceStage(ticketId, nextStage) {
  const t = appState.tickets.find(x => x.id === ticketId);
  if (!t) return;

  t.stage = nextStage;
  labDB.set(STORAGE_KEYS.TICKETS, appState.tickets);

  showAlert(`Ticket ${t.id} advanced to "${nextStage}".`, 'info');
  renderTechnicianTickets();
  handleTrackTicketSearch();
  updateAdminMetrics();
}

// Admin Operations
function renderAdminInventory() {
  const tbody = document.getElementById('adminInventoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.laptops.map(l => `
    <tr>
      <td><strong>${l.model}</strong></td>
      <td class="text-xs">${l.specs.slice(0, 2).join(' • ')}</td>
      <td class="font-mono font-bold text-success">₹${l.price.toLocaleString()}</td>
      <td class="font-mono font-bold text-center">${l.stock}</td>
      <td>
        <button class="btn btn-outline btn-xs" onclick="adminRestockLaptop('${l.id}')">+ Restock 5</button>
      </td>
    </tr>
  `).join('');
}

function adminRestockLaptop(laptopId) {
  const l = appState.laptops.find(x => x.id === laptopId);
  if (!l) return;

  l.stock += 5;
  labDB.set(STORAGE_KEYS.LAPTOPS, appState.laptops);
  showAlert(`Restocked 5 units for ${l.model}.`, 'success');
  renderAdminInventory();
  renderLaptopsCatalog();
  updateAdminMetrics();
}

function renderAdminLeases() {
  const tbody = document.getElementById('adminLeasesTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.leases.map(l => `
    <tr>
      <td class="font-mono font-bold text-primary">${l.id}</td>
      <td><strong>${l.hirer}</strong></td>
      <td class="font-mono font-bold">${l.qty}</td>
      <td class="font-mono text-success">₹${l.deposit.toLocaleString()}</td>
      <td class="font-mono text-xs">${l.duration}</td>
    </tr>
  `).join('');
}

function updateAdminMetrics() {
  const totalStock = appState.laptops.reduce((sum, l) => sum + l.stock, 0);
  const activeRepairs = appState.tickets.filter(t => t.stage !== 'Ready for Pickup').length;
  const leasesCount = appState.leases.length;

  const elS = document.getElementById('adminTotalInventoryUnits');
  const elR = document.getElementById('adminActiveRepairs');
  const elL = document.getElementById('adminRentalAgreementsCount');

  if (elS) elS.innerText = totalStock;
  if (elR) elR.innerText = activeRepairs;
  if (elL) elL.innerText = leasesCount;
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
