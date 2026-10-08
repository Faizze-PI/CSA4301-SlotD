// AgriMart Marketplace Script

const DEFAULT_PRODUCTS = [
  {
    id: 'AGRI-P1',
    name: 'IR-64 High Yield Certified Paddy Seeds (10kg)',
    category: 'Seeds',
    price: 650,
    stock: 45,
    farmer: 'Velu Agro',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500',
    desc: 'Short-duration 120-day certified seed lot. High tillering capacity and blast disease resistant.'
  },
  {
    id: 'AGRI-P2',
    name: 'Vermicompost Organic Soil Enricher (25kg)',
    category: 'Fertilizers',
    price: 480,
    stock: 100,
    farmer: 'Velu Agro',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500',
    desc: '100% pure decomposed cow-dung manure enriched with beneficial microbial consortia.'
  },
  {
    id: 'AGRI-P3',
    name: 'NeemAzal Bio-Neem Pest Repellent (1L)',
    category: 'Pesticides',
    price: 750,
    stock: 28,
    farmer: 'Velu Agro',
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500',
    desc: 'Certified organic botanical insect growth regulator with 10,000 ppm active Azadirachtin.'
  },
  {
    id: 'AGRI-P4',
    name: 'Solar Powered Micro-Drip Irrigation Kit (1 Acre)',
    category: 'Equipment',
    price: 12500,
    stock: 12,
    farmer: 'Velu Agro',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500',
    desc: 'Complete inline emitter pipes, venturi fertilizer mixer, filtration disc, and connector tees.'
  },
  {
    id: 'AGRI-P5',
    name: 'Heavy Duty Forged Steel Weed Hoe & Cultivator',
    category: 'Tools',
    price: 390,
    stock: 60,
    farmer: 'Velu Agro',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500',
    desc: 'Carbon steel hardened cutting edge with ergonomic seasoned teakwood handle for easy tilling.'
  },
  {
    id: 'AGRI-P6',
    name: 'Trichoderma Viride Bio-Fungicide (1kg)',
    category: 'Fertilizers',
    price: 320,
    stock: 35,
    farmer: 'Velu Agro',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=500',
    desc: 'Biological antagonist safeguarding seedlings against damping-off, collar rot, and soil fungi.'
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'AGRI-ORD-9102',
    date: '2026-10-04',
    customerName: 'Kandasamy Organic Farms',
    items: [
      { name: 'IR-64 High Yield Certified Paddy Seeds (10kg)', qty: 2, price: 650 },
      { name: 'Vermicompost Organic Soil Enricher (25kg)', qty: 3, price: 480 }
    ],
    subtotal: 2740,
    subsidy: 274,
    freight: 120,
    grandTotal: 2586,
    shippingAddress: 'Plot 18, Green Meadows Agro Colony, Walajabad, Kanchipuram - 631605',
    paymentMethod: 'AgriPay Wallet',
    shippingStatus: 'In Transit',
    carrierNotes: 'Dispatched via Rural Agri Express'
  }
];

// App State
let currentRole = 'public';
let currentBuyerTab = 'catalog';
let currentFarmerTab = 'orders';
let activeCategory = 'All';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  updateWalletDisplay();
  renderCatalog();
  renderCart();
  renderBuyerOrders();
  renderFarmerOrders();
  renderFarmerInventory();
  updateFarmerMetrics();
});

function initStorage() {
  if (!labDB.get('agri_products')) labDB.set('agri_products', DEFAULT_PRODUCTS);
  if (!labDB.get('agri_orders')) labDB.set('agri_orders', DEFAULT_ORDERS);
  if (!labDB.get('agri_cart')) labDB.set('agri_cart', []);
  if (labDB.get('agri_wallet') === null) labDB.set('agri_wallet', 4850);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('publicSection').classList.toggle('hidden', role !== 'public');
  document.getElementById('farmerSection').classList.toggle('hidden', role !== 'farmer');

  if (role === 'public') {
    updateWalletDisplay();
    renderCatalog();
    renderCart();
    renderBuyerOrders();
  } else {
    renderFarmerOrders();
    renderFarmerInventory();
    updateFarmerMetrics();
  }
}

// Buyer Tabs
function switchBuyerTab(tab) {
  currentBuyerTab = tab;
  const tabIds = ['catalog', 'cart', 'orders', 'account'];
  tabIds.forEach(t => {
    const pane = document.getElementById('buyerTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#publicSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'cart') renderCart();
  if (tab === 'orders') renderBuyerOrders();
}

// Farmer Tabs
function switchFarmerTab(tab) {
  currentFarmerTab = tab;
  const tabIds = ['orders', 'inventory', 'addProduct'];
  tabIds.forEach(t => {
    const pane = document.getElementById('farmerTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#farmerSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'inventory') renderFarmerInventory();
  if (tab === 'orders') renderFarmerOrders();
}

// Buyer Wallet
function updateWalletDisplay() {
  const bal = parseFloat(labDB.get('agri_wallet') || 0);
  const el = document.getElementById('buyerWalletBalance');
  if (el) el.textContent = `₹${bal.toFixed(2)}`;
}

function openBuyerTopUpModal() {
  document.getElementById('buyerTopUpModal').classList.remove('hidden');
}

function closeBuyerTopUpModal() {
  document.getElementById('buyerTopUpModal').classList.add('hidden');
}

function setBuyerTopUp(amt) {
  document.getElementById('buyerTopUpInput').value = amt;
}

function handleBuyerTopUp(e) {
  e.preventDefault();
  const amt = parseFloat(document.getElementById('buyerTopUpInput').value);
  if (amt <= 0 || isNaN(amt)) return;
  const cur = parseFloat(labDB.get('agri_wallet') || 0);
  labDB.set('agri_wallet', cur + amt);
  updateWalletDisplay();
  closeBuyerTopUpModal();
  showAlert(`AgriPay e-Wallet credited with ₹${amt.toFixed(2)}! New balance: ₹${(cur + amt).toFixed(2)}`, 'success');
}

// Catalog Filtering
function selectCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function filterCatalog() {
  renderCatalog();
}

function renderCatalog() {
  const container = document.getElementById('productsGrid');
  const search = (document.getElementById('productSearchInput') ? document.getElementById('productSearchInput').value : '').toLowerCase();
  const products = labDB.get('agri_products') || [];

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-box col-span-3"><p class="muted">No agricultural supplies match your search criteria.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/400x250/1e293b/white?text=AgriSupply'">
        <span class="product-cat-tag">${p.category}</span>
      </div>

      <div class="product-content">
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        
        <div class="product-pricing-flex">
          <div>
            <div class="product-price">₹${p.price.toFixed(2)}</div>
            <div class="stock-indicator">${p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock'}</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>
            + Add to Basket
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Cart Management
function addToCart(prodId) {
  const products = labDB.get('agri_products') || [];
  const prod = products.find(p => p.id === prodId);
  if (!prod || prod.stock <= 0) return;

  let cart = labDB.get('agri_cart') || [];
  const existing = cart.find(item => item.id === prodId);

  if (existing) {
    if (existing.qty < prod.stock) {
      existing.qty += 1;
    } else {
      showAlert(`Cannot add more than ${prod.stock} units in stock.`, 'warning');
      return;
    }
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      qty: 1,
      image: prod.image,
      stock: prod.stock
    });
  }

  labDB.set('agri_cart', cart);
  updateCartBadge();
  showAlert(`Added "${prod.name}" to cart!`, 'success');
}

function updateCartBadge() {
  const cart = labDB.get('agri_cart') || [];
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById('cartCountBadge');
  if (badge) badge.textContent = count;
}

function renderCart() {
  updateCartBadge();
  const container = document.getElementById('cartItemsList');
  const cart = labDB.get('agri_cart') || [];

  if (cart.length === 0) {
    container.innerHTML = `<p class="muted text-center py-4">Your agricultural shopping basket is empty.</p>`;
    updateCartTotals(0);
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <div class="muted text-xs">₹${item.price.toFixed(2)} each</div>
        </div>

        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="font-bold">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>

        <div class="font-bold">₹${itemTotal.toFixed(2)}</div>
        <button class="btn btn-secondary btn-sm" onclick="removeCartItem('${item.id}')">✕</button>
      </div>
    `;
  }).join('');

  updateCartTotals(subtotal);
}

function updateCartQty(id, delta) {
  let cart = labDB.get('agri_cart') || [];
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  labDB.set('agri_cart', cart);
  renderCart();
}

function removeCartItem(id) {
  let cart = labDB.get('agri_cart') || [];
  cart = cart.filter(i => i.id !== id);
  labDB.set('agri_cart', cart);
  renderCart();
}

function clearCart() {
  labDB.set('agri_cart', []);
  renderCart();
}

function updateCartTotals(subtotal) {
  const subsidy = Math.round(subtotal * 0.10); // 10% direct government farmer subsidy
  const freight = subtotal > 0 ? 120 : 0;
  const grandTotal = subtotal > 0 ? (subtotal - subsidy + freight) : 0;

  document.getElementById('cartSubtotalText').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('cartSubsidyText').textContent = `- ₹${subsidy.toFixed(2)}`;
  document.getElementById('cartFreightText').textContent = `₹${freight.toFixed(2)}`;
  document.getElementById('cartGrandTotalText').textContent = `₹${grandTotal.toFixed(2)}`;

  return { subtotal, subsidy, freight, grandTotal };
}

// Place Order
function handlePlaceOrder(e) {
  e.preventDefault();
  const cart = labDB.get('agri_cart') || [];
  if (cart.length === 0) {
    showAlert('Cannot place order: Cart is empty!', 'danger');
    return;
  }

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const { subsidy, freight, grandTotal } = updateCartTotals(subtotal);
  const address = document.getElementById('orderShippingAddress').value.trim();
  const payMethod = document.getElementById('orderPaymentMethod').value;

  if (payMethod === 'wallet') {
    const bal = parseFloat(labDB.get('agri_wallet') || 0);
    if (bal < grandTotal) {
      showAlert(`Insufficient AgriPay balance (₹${bal.toFixed(2)}). Need ₹${grandTotal.toFixed(2)}. Please top up.`, 'danger');
      return;
    }
    labDB.set('agri_wallet', bal - grandTotal);
    updateWalletDisplay();
  }

  const orderId = `AGRI-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: orderId,
    date: new Date().toISOString().split('T')[0],
    customerName: 'Kandasamy Organic Farms',
    items: cart,
    subtotal,
    subsidy,
    freight,
    grandTotal,
    shippingAddress: address,
    paymentMethod: payMethod === 'wallet' ? 'AgriPay Wallet' : payMethod === 'cod' ? 'Cash on Delivery' : 'Kisan Credit Card',
    shippingStatus: 'Placed',
    carrierNotes: 'Order received at farmer dispatch warehouse'
  };

  const orders = labDB.get('agri_orders') || [];
  orders.unshift(newOrder);
  labDB.set('agri_orders', orders);

  // Deduct stock from products
  const products = labDB.get('agri_products') || [];
  cart.forEach(cItem => {
    const pIdx = products.findIndex(p => p.id === cItem.id);
    if (pIdx !== -1) {
      products[pIdx].stock = Math.max(0, products[pIdx].stock - cItem.qty);
    }
  });
  labDB.set('agri_products', products);

  // Clear cart
  labDB.set('agri_cart', []);
  renderCart();
  renderCatalog();
  renderBuyerOrders();
  renderFarmerOrders();
  renderFarmerInventory();
  updateFarmerMetrics();

  showAlert(`Order ${orderId} confirmed! Forwarded to Velu Agro Co-operative for dispatch.`, 'success');
  switchBuyerTab('orders');
}

// Render Orders
function renderBuyerOrders() {
  const container = document.getElementById('buyerOrdersList');
  const orders = labDB.get('agri_orders') || [];

  if (orders.length === 0) {
    container.innerHTML = `<p class="muted">No orders found.</p>`;
    return;
  }

  container.innerHTML = orders.map(o => renderOrderCardHtml(o, false)).join('');
}

function renderFarmerOrders() {
  const container = document.getElementById('farmerOrdersList');
  const filter = document.getElementById('farmerOrderFilter').value;
  const orders = labDB.get('agri_orders') || [];

  const filtered = orders.filter(o => filter === 'all' || o.shippingStatus === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="muted">No orders matching this status filter.</p>`;
    return;
  }

  container.innerHTML = filtered.map(o => renderOrderCardHtml(o, true)).join('');
}

function renderOrderCardHtml(order, isFarmerView) {
  const isPlaced = true;
  const isDispatched = ['Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'].includes(order.shippingStatus);
  const isInTransit = ['In Transit', 'Out for Delivery', 'Delivered'].includes(order.shippingStatus);
  const isDelivered = order.shippingStatus === 'Delivered';

  return `
    <div class="order-card">
      <div class="card-header-flex">
        <div>
          <span class="badge ${order.shippingStatus === 'Delivered' ? 'badge-success' : 'badge-warning'}">${order.shippingStatus}</span>
          <h4 style="margin: 0.4rem 0 0.2rem 0;">Order #${order.id}</h4>
          <span class="muted text-xs">Date: ${order.date} | Payment: ${order.paymentMethod}</span>
        </div>
        <div class="text-right">
          <strong style="color: #22c55e; font-size: 1.15rem;">₹${order.grandTotal.toFixed(2)}</strong>
          <div class="muted text-xs">${order.items.length} Product(s)</div>
        </div>
      </div>

      <!-- Shipping Stepper -->
      <div class="order-stepper">
        <div class="stepper-node ${isPlaced ? 'completed' : ''}">✓ Placed</div>
        <div class="stepper-node ${isDispatched ? (order.shippingStatus === 'Dispatched' ? 'active' : 'completed') : ''}">
          ${isDispatched ? '✓' : '○'} Dispatched
        </div>
        <div class="stepper-node ${isInTransit ? (order.shippingStatus === 'In Transit' ? 'active' : 'completed') : ''}">
          ${isInTransit ? '✓' : '○'} In Transit
        </div>
        <div class="stepper-node ${isDelivered ? 'completed' : ''}">
          ${isDelivered ? '✓ Delivered' : '○ Delivered'}
        </div>
      </div>

      <div style="font-size: 0.85rem; line-height: 1.5; margin-top: 0.5rem;">
        <div><strong>Items:</strong> ${order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</div>
        <div class="muted">📍 <strong>Deliver To:</strong> ${order.shippingAddress}</div>
        <div class="muted">🚚 <strong>Milestone Update:</strong> ${order.carrierNotes}</div>
      </div>

      ${isFarmerView ? `
        <div class="mt-3 text-right">
          <button class="btn btn-primary btn-sm" onclick="openShippingModal('${order.id}')">
            🚚 Update Shipping Status
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// Shipping Status Modal
function openShippingModal(orderId) {
  const orders = labDB.get('agri_orders') || [];
  const o = orders.find(ord => ord.id === orderId);
  if (!o) return;

  document.getElementById('shippingOrderId').value = o.id;
  document.getElementById('shippingOrderDisplay').value = `${o.id} (${o.customerName})`;
  document.getElementById('shippingStatusSelect').value = o.shippingStatus;
  document.getElementById('shippingCarrierNotes').value = o.carrierNotes || '';
  document.getElementById('shippingModal').classList.remove('hidden');
}

function closeShippingModal() {
  document.getElementById('shippingModal').classList.add('hidden');
}

function handleSaveShippingStatus(e) {
  e.preventDefault();
  const orderId = document.getElementById('shippingOrderId').value;
  const status = document.getElementById('shippingStatusSelect').value;
  const notes = document.getElementById('shippingCarrierNotes').value.trim();

  const orders = labDB.get('agri_orders') || [];
  const idx = orders.findIndex(o => o.id === orderId);

  if (idx !== -1) {
    orders[idx].shippingStatus = status;
    orders[idx].carrierNotes = notes;
    labDB.set('agri_orders', orders);

    closeShippingModal();
    renderFarmerOrders();
    renderBuyerOrders();
    showAlert(`Order ${orderId} shipping updated to "${status}".`, 'success');
  }
}

// Farmer Inventory
function renderFarmerInventory() {
  const tbody = document.getElementById('farmerInventoryTable');
  const products = labDB.get('agri_products') || [];

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <strong>${p.name}</strong>
      </td>
      <td>${p.category}</td>
      <td class="font-bold">₹${p.price.toFixed(2)}</td>
      <td>${p.stock} units</td>
      <td><span class="badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}">${p.stock > 0 ? 'Active' : 'Stock Out'}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm mr-1" onclick="farmerRestockProduct('${p.id}')">+ Restock</button>
        <button class="btn btn-danger btn-sm" onclick="farmerDeleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function farmerRestockProduct(id) {
  const products = labDB.get('agri_products') || [];
  const p = products.find(prod => prod.id === id);
  if (p) {
    p.stock += 25;
    labDB.set('agri_products', products);
    renderFarmerInventory();
    renderCatalog();
    showAlert(`Added 25 units to stock for "${p.name}".`, 'success');
  }
}

function farmerDeleteProduct(id) {
  if (!confirm('Are you sure you want to remove this product?')) return;
  let products = labDB.get('agri_products') || [];
  products = products.filter(p => p.id !== id);
  labDB.set('agri_products', products);
  renderFarmerInventory();
  renderCatalog();
  updateFarmerMetrics();
  showAlert('Product removed from catalog.', 'info');
}

function handleFarmerAddProduct(e) {
  e.preventDefault();
  const name = document.getElementById('newProdName').value.trim();
  const category = document.getElementById('newProdCategory').value;
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const stock = parseInt(document.getElementById('newProdStock').value);
  const image = document.getElementById('newProdImage').value.trim();
  const desc = document.getElementById('newProdDesc').value.trim();

  const products = labDB.get('agri_products') || [];
  const newProduct = {
    id: `AGRI-P${products.length + 1}`,
    name,
    category,
    price,
    stock,
    farmer: 'Velu Agro',
    image: image || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500',
    desc
  };

  products.push(newProduct);
  labDB.set('agri_products', products);

  document.getElementById('addProductForm').reset();
  renderFarmerInventory();
  renderCatalog();
  updateFarmerMetrics();
  showAlert(`"${name}" listed successfully on AgriMart!`, 'success');
  switchFarmerTab('inventory');
}

function updateFarmerMetrics() {
  const orders = labDB.get('agri_orders') || [];
  const products = labDB.get('agri_products') || [];

  const totalSales = orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  document.getElementById('farmerTotalSales').textContent = `₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  document.getElementById('farmerActiveProducts').textContent = `${products.length} Items`;
}

function handleSaveProfile(e) {
  e.preventDefault();
  showAlert('Farmer buyer profile & address updated!', 'success');
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
