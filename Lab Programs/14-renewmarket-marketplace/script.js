/**
 * Experiment 14: ReNewMarket Online Marketplace (Second-Hand Goods)
 * C2C Listing Tool, Price Negotiation, User/Category/Commodity/Order Management
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Categories Seed
  const defaultCategories = ['Electronics', 'Furniture', 'Clothing', 'Collectibles'];

  // Commodities Seed
  const defaultCommodities = [
    {
      id: 'com1',
      title: 'Apple iPad Air 4th Gen (64GB Wi-Fi Sky Blue)',
      category: 'Electronics',
      condition: 'Like New (Mint)',
      price: 28000,
      location: 'Velachery, Chennai',
      seller: 'Karthik Raja',
      desc: 'Used with screen protector and case since day 1. 92% battery health, original box.'
    },
    {
      id: 'com2',
      title: 'Solid Sheesham Wood 6-Seater Dining Table',
      category: 'Furniture',
      condition: 'Gently Used',
      price: 16500,
      location: 'Indiranagar, Bangalore',
      seller: 'Sneha Patel',
      desc: 'Genuine rosewood with glass top cover. Selling due to house relocation.'
    },
    {
      id: 'com3',
      title: 'Vintage Olympus OM-1 35mm SLR Film Camera',
      category: 'Collectibles',
      condition: 'Fair / Working',
      price: 12000,
      location: 'Mylapore, Chennai',
      seller: 'Ramesh Sundar',
      desc: 'Classic mechanical shutter, clean 50mm f/1.8 Zuiko prime lens included.'
    }
  ];

  // Users Seed
  const defaultUsers = [
    { id: 'u1', username: 'faizze_buyer', role: 'Buyer & Seller', status: 'Active' },
    { id: 'u2', username: 'karthik_raja', role: 'Verified Seller', status: 'Active' },
    { id: 'u3', username: 'sneha_patel', role: 'Verified Seller', status: 'Active' }
  ];

  // Orders Seed
  const defaultOrders = [
    {
      orderId: 'RNW-1049',
      itemTitle: 'Apple iPad Air 4th Gen',
      seller: 'Karthik Raja',
      buyer: 'Faizze A.',
      agreedPrice: 26500,
      logisticsStatus: 'Shipped',
      orderDate: '2026-10-05'
    }
  ];

  db.seedIfEmpty('renew_categories', defaultCategories);
  db.seedIfEmpty('renew_commodities', defaultCommodities);
  db.seedIfEmpty('renew_users', defaultUsers);
  db.seedIfEmpty('renew_orders', defaultOrders);

  // Role Switcher
  const roleSelect = document.getElementById('renewRoleSelect');
  const userSection = document.getElementById('renewUserSection');
  const adminSection = document.getElementById('renewAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminUsers();
      renderAdminCategories();
      renderAdminCommodities();
      renderAdminOrders();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderCommodities();
      renderDeals();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#renewUserSection') || btn.closest('#renewAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- BUYER COMMODITY BROWSE & NEGOTIATE ---
  function renderCommodities() {
    const cat = document.getElementById('renewCatFilter').value;
    const query = document.getElementById('renewSearchInput').value.toLowerCase().trim();

    const grid = document.getElementById('renewCommoditiesGrid');
    grid.innerHTML = '';

    const list = db.get('renew_commodities').filter(c => {
      const matchCat = cat === 'all' || c.category === cat;
      const matchQuery = c.title.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query) || c.location.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (list.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No items listed in this category.</p>';
      return;
    }

    list.forEach(c => {
      const card = document.createElement('div');
      card.className = 'commodity-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-primary">${c.category}</span>
            <span class="badge badge-secondary">${c.condition}</span>
          </div>
          <h3 style="font-size: 1.15rem; margin: 0.5rem 0 0.25rem 0;">${c.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Seller: <strong>${c.seller}</strong> (${c.location})</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem; line-height: 1.4;">${c.desc}</p>
        </div>
        <div style="margin-top: 1rem;">
          <div style="font-size: 1.4rem; font-weight: 800; color: #059669; margin-bottom: 0.5rem;">₹${c.price.toLocaleString()}</div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="openNegotiateModal('${c.id}')">💬 Negotiate</button>
            <button class="btn btn-success btn-sm" style="flex: 1;" onclick="buyItemInstantly('${c.id}')">Buy Now</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('renewCatFilter').addEventListener('change', renderCommodities);
  document.getElementById('renewSearchInput').addEventListener('input', renderCommodities);

  // Price Negotiation
  let activeNegotiateItem = null;

  window.openNegotiateModal = (id) => {
    const item = db.findById('renew_commodities', id);
    if (!item) return;

    activeNegotiateItem = item;
    document.getElementById('negItemTitle').innerText = item.title;
    document.getElementById('negItemAsking').innerText = `Asking Price: ₹${item.price.toLocaleString()} | Seller: ${item.seller}`;
    document.getElementById('offerPriceInput').value = Math.round(item.price * 0.9);

    document.getElementById('negotiateModal').style.display = 'flex';
  };

  window.closeNegotiateModal = () => {
    document.getElementById('negotiateModal').style.display = 'none';
    activeNegotiateItem = null;
  };

  document.getElementById('negotiateOfferForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeNegotiateItem) return;

    const offerPrice = parseInt(document.getElementById('offerPriceInput').value, 10);
    const msg = document.getElementById('offerMessageInput').value;

    const orderId = 'RNW-' + Math.floor(1000 + Math.random() * 9000);
    db.insert('renew_orders', {
      orderId,
      itemTitle: activeNegotiateItem.title,
      seller: activeNegotiateItem.seller,
      buyer: 'Faizze A.',
      agreedPrice: offerPrice,
      logisticsStatus: 'Shipped',
      orderDate: new Date().toLocaleDateString()
    });

    alert(`Offer of ₹${offerPrice.toLocaleString()} sent to ${activeNegotiateItem.seller}!\nDeal Confirmed under Order #${orderId}.\nSeller message logged: "${msg}"`);
    closeNegotiateModal();
    renderDeals();
    document.querySelector('.tab-btn[data-tab="renewOrdersTab"]').click();
  });

  window.buyItemInstantly = (id) => {
    const item = db.findById('renew_commodities', id);
    if (!item) return;

    const orderId = 'RNW-' + Math.floor(1000 + Math.random() * 9000);
    db.insert('renew_orders', {
      orderId,
      itemTitle: item.title,
      seller: item.seller,
      buyer: 'Faizze A.',
      agreedPrice: item.price,
      logisticsStatus: 'Shipped',
      orderDate: new Date().toLocaleDateString()
    });

    alert(`Purchased "${item.title}" for ₹${item.price.toLocaleString()}!\nOrder ID: ${orderId}.\nArranging doorstep logistics.`);
    renderDeals();
    document.querySelector('.tab-btn[data-tab="renewOrdersTab"]').click();
  };

  // --- SELLER LISTING TOOL ---
  document.getElementById('sellItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('sellTitle').value.trim();
    const category = document.getElementById('sellCategory').value;
    const condition = document.getElementById('sellCondition').value;
    const price = parseInt(document.getElementById('sellPrice').value, 10);
    const location = document.getElementById('sellLocation').value.trim();
    const desc = document.getElementById('sellDesc').value.trim();

    const newId = 'com' + (db.get('renew_commodities').length + 1);
    db.insert('renew_commodities', {
      id: newId,
      title,
      category,
      condition,
      price,
      location,
      seller: 'Faizze A. (You)',
      desc
    });

    alert(`Listing for "${title}" is now LIVE on ReNewMarket!`);
    document.getElementById('sellItemForm').reset();
    renderCommodities();
    document.querySelector('.tab-btn[data-tab="renewBrowseTab"]').click();
  });

  // --- ORDERS / DEALS TRACKING ---
  function renderDeals() {
    const tbody = document.getElementById('renewDealsTableBody');
    tbody.innerHTML = '';
    const orders = db.get('renew_orders');

    orders.forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${o.itemTitle}</td>
        <td>${o.seller}</td>
        <td><strong>₹${o.agreedPrice.toLocaleString()}</strong></td>
        <td><span class="badge ${o.logisticsStatus === 'Received' ? 'badge-success' : 'badge-primary'}">${o.logisticsStatus}</span></td>
        <td>
          ${o.logisticsStatus === 'Shipped' ? `<button class="btn btn-secondary btn-sm" onclick="markReceivedUser('${o.orderId}')">Confirm Received</button>` : '<span style="font-size: 0.8rem; color: var(--text-muted);">Completed</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.markReceivedUser = (orderId) => {
    const orders = db.get('renew_orders');
    const match = orders.find(o => o.orderId === orderId);
    if (!match) return;

    db.update('renew_orders', match.id, { logisticsStatus: 'Received' });
    alert(`Order #${orderId} marked as Received! Escrow payment released to seller.`);
    renderDeals();
  };

  // --- ADMIN FUNCTIONS ---
  function renderAdminUsers() {
    const tbody = document.getElementById('adminUsersTableBody');
    tbody.innerHTML = '';
    db.get('renew_users').forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${u.id}</strong></td>
        <td>${u.username}</td>
        <td>${u.role}</td>
        <td><span class="badge badge-success">${u.status}</span></td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteUserAdmin('${u.id}')">Delete User</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.deleteUserAdmin = (id) => {
    if (confirm('Delete user account?')) {
      db.remove('renew_users', id);
      renderAdminUsers();
    }
  };

  function renderAdminCategories() {
    const container = document.getElementById('adminCategoriesList');
    container.innerHTML = '';
    const cats = db.get('renew_categories');

    cats.forEach((c, idx) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.style.padding = '0.5rem 1rem';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.innerHTML = `
        <span>${c}</span>
        <button class="btn btn-danger btn-sm" onclick="deleteCategoryAdmin(${idx})">Delete</button>
      `;
      container.appendChild(div);
    });
  }

  window.deleteCategoryAdmin = (idx) => {
    const cats = db.get('renew_categories');
    cats.splice(idx, 1);
    db.set('renew_categories', cats);
    renderAdminCategories();
  };

  document.getElementById('adminNewCatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('adminCatName').value.trim();
    const cats = db.get('renew_categories');
    if (!cats.includes(name)) {
      cats.push(name);
      db.set('renew_categories', cats);
      alert(`Category "${name}" added!`);
      document.getElementById('adminNewCatForm').reset();
      renderAdminCategories();
    }
  });

  function renderAdminCommodities() {
    const tbody = document.getElementById('adminCommodityTableBody');
    tbody.innerHTML = '';
    db.get('renew_commodities').forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.title}</strong></td>
        <td>${c.seller}</td>
        <td>${c.category}</td>
        <td>₹${c.price.toLocaleString()}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteCommodityAdmin('${c.id}')">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.deleteCommodityAdmin = (id) => {
    if (confirm('Remove commodity listing?')) {
      db.remove('renew_commodities', id);
      renderAdminCommodities();
      renderCommodities();
    }
  };

  function renderAdminOrders() {
    const tbody = document.getElementById('adminOrdersTableBody');
    tbody.innerHTML = '';
    db.get('renew_orders').forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${o.itemTitle}</td>
        <td>${o.buyer}</td>
        <td><span class="badge badge-primary">${o.logisticsStatus}</span></td>
        <td>
          <select class="form-select" style="font-size: 0.85rem; padding: 0.2rem 0.5rem;" onchange="changeLogisticsStatusAdmin('${o.id}', this.value)">
            <option value="Shipped" ${o.logisticsStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Received" ${o.logisticsStatus === 'Received' ? 'selected' : ''}>Received</option>
          </select>
        </td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteOrderAdmin('${o.id}')">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.changeLogisticsStatusAdmin = (id, newStatus) => {
    db.update('renew_orders', id, { logisticsStatus: newStatus });
    alert(`Logistics status updated to: ${newStatus}`);
    renderAdminOrders();
    renderDeals();
  };

  window.deleteOrderAdmin = (id) => {
    if (confirm('Delete order record?')) {
      db.remove('renew_orders', id);
      renderAdminOrders();
      renderDeals();
    }
  };

  // Initial runs
  renderCommodities();
  renderDeals();
});
