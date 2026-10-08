/**
 * Experiment 09: TechSavvy Electronics Shopping Platform
 * Full Implementation of the 13 UML Use Cases & Admin Customer Audit Logging
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Categories & Subcategories Seed
  const defaultCategories = [
    { name: 'Smartphones', subcategories: ['Flagship 5G', 'Foldables', 'Budget Android'] },
    { name: 'Laptops', subcategories: ['Ultrabooks', 'Gaming Rigs', 'Student Workstations'] },
    { name: 'Tablets', subcategories: ['Pro Tablets', 'e-Readers'] },
    { name: 'Accessories', subcategories: ['Noise-Cancelling Audio', 'Smartwatches', 'Fast Chargers'] }
  ];

  // Electronics Products Seed
  const defaultGadgets = [
    {
      id: 'g1',
      title: 'Titan Pro 5G Ultra Smartphone',
      category: 'Smartphones',
      subcategory: 'Flagship 5G',
      price: 79999,
      stock: 14,
      desc: 'Snapdragon 8 Gen 3, 200MP Quad Camera, 120Hz LTPO AMOLED, 5000mAh.'
    },
    {
      id: 'g2',
      title: 'ZenBook Aero 16 Ultrabook',
      category: 'Laptops',
      subcategory: 'Ultrabooks',
      price: 94999,
      stock: 8,
      desc: 'Intel Core Ultra 7, 32GB LPDDR5X RAM, 1TB NVMe Gen4 SSD, 3.2K OLED 120Hz.'
    },
    {
      id: 'g3',
      title: 'Nexus Pad Pro 13-inch',
      category: 'Tablets',
      subcategory: 'Pro Tablets',
      price: 54999,
      stock: 12,
      desc: 'M-series architecture with Magnetic Stylus support and quad-speaker spatial audio.'
    },
    {
      id: 'g4',
      title: 'AcousticMax Pro Active Noise Cancelling Headphones',
      category: 'Accessories',
      subcategory: 'Noise-Cancelling Audio',
      price: 19999,
      stock: 25,
      desc: 'Industry-leading 45dB noise suppression, Hi-Res LDAC audio, 50hr battery.'
    }
  ];

  // Shopping Cart Seed
  const defaultCart = [];

  // Customer Orders & Checkout Audit Seed
  const defaultOrders = [
    {
      orderId: 'TS-9410',
      customerName: 'Faizze A.',
      customerEmail: 'faizze@simats.edu',
      items: [
        { title: 'AcousticMax Pro Active Noise Cancelling Headphones', qty: 1, price: 19999 }
      ],
      totalSpent: 19999,
      status: 'Shipped (Tracking: BLR-MAA-928)',
      orderDate: '2026-10-06 11:20 AM'
    }
  ];

  db.seedIfEmpty('tech_categories', defaultCategories);
  db.seedIfEmpty('tech_gadgets', defaultGadgets);
  db.seedIfEmpty('tech_cart', defaultCart);
  db.seedIfEmpty('tech_orders', defaultOrders);

  // Role Switcher (Use Case 12: Logout / Role Switch)
  const roleSelect = document.getElementById('techRoleSelect');
  const custSection = document.getElementById('techCustomerSection');
  const adminSection = document.getElementById('techAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      custSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminInventory();
      renderAdminAudit();
    } else {
      custSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderCategoryPills();
      renderGadgets();
      renderCart();
      renderOrders();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#techCustomerSection') || btn.closest('#techAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- USE CASE 1 & 3: VISIT SITE, CATEGORIES & SEARCH ---
  let selectedCategory = 'all';

  function renderCategoryPills() {
    const container = document.getElementById('catPillsContainer');
    container.innerHTML = '<button class="cat-pill active" data-cat="all">All Products</button>';
    const categories = db.get('tech_categories');

    categories.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'cat-pill';
      btn.dataset.cat = c.name;
      btn.innerText = c.name;
      btn.onclick = () => {
        container.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = c.name;
        updateSubcategoryFilterOptions(c.name);
        renderGadgets();
      };
      container.appendChild(btn);
    });

    // Populate subcategories filter for "All"
    updateSubcategoryFilterOptions('all');
  }

  function updateSubcategoryFilterOptions(categoryName) {
    const subSelect = document.getElementById('subCategoryFilter');
    subSelect.innerHTML = '<option value="all">All Subcategories</option>';
    const categories = db.get('tech_categories');

    if (categoryName === 'all') {
      categories.forEach(c => {
        c.subcategories.forEach(sub => {
          const opt = document.createElement('option');
          opt.value = sub;
          opt.innerText = `${c.name}: ${sub}`;
          subSelect.appendChild(opt);
        });
      });
    } else {
      const match = categories.find(c => c.name === categoryName);
      if (match) {
        match.subcategories.forEach(sub => {
          const opt = document.createElement('option');
          opt.value = sub;
          opt.innerText = sub;
          subSelect.appendChild(opt);
        });
      }
    }
  }

  // --- USE CASE 3, 4, 11: SEARCH, CHECK AVAILABILITY, DISPLAY DETAILS ---
  function renderGadgets() {
    const query = document.getElementById('gadgetSearchInput').value.toLowerCase().trim();
    const subFilter = document.getElementById('subCategoryFilter').value;
    const sort = document.getElementById('priceSortSelect').value;

    const grid = document.getElementById('gadgetsGrid');
    grid.innerHTML = '';

    let items = db.get('tech_gadgets').filter(g => {
      const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
      const matchSub = subFilter === 'all' || g.subcategory === subFilter;
      const matchQuery = g.title.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query);
      return matchCat && matchSub && matchQuery;
    });

    if (sort === 'low-high') items.sort((a, b) => a.price - b.price);
    if (sort === 'high-low') items.sort((a, b) => b.price - a.price);

    if (items.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No gadgets found matching filters.</p>';
      return;
    }

    items.forEach(g => {
      const card = document.createElement('div');
      card.className = 'gadget-card';
      const inStock = g.stock > 0;

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-primary">${g.category}</span>
            <span class="badge ${inStock ? 'badge-success' : 'badge-danger'}">${inStock ? `${g.stock} In Stock` : 'Out of Stock'}</span>
          </div>
          <h3 style="font-size: 1.15rem; margin: 0.5rem 0 0.25rem 0;">${g.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${g.subcategory}</p>
        </div>
        <div style="margin-top: 1rem;">
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">₹${g.price.toLocaleString()}</div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="openItemDetailsModal('${g.id}')">View Specs</button>
            <button class="btn btn-primary btn-sm" style="flex: 1;" ${!inStock ? 'disabled' : ''} onclick="addToCart('${g.id}')">Add to Cart</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('gadgetSearchInput').addEventListener('input', renderGadgets);
  document.getElementById('subCategoryFilter').addEventListener('change', renderGadgets);
  document.getElementById('priceSortSelect').addEventListener('change', renderGadgets);

  // --- USE CASE 11: DISPLAY ITEM DETAILS MODAL ---
  window.openItemDetailsModal = (id) => {
    const item = db.findById('tech_gadgets', id);
    if (!item) return;

    document.getElementById('modalItemTitle').innerText = item.title;
    document.getElementById('modalItemDetailsBody').innerHTML = `
      <p><strong>Category:</strong> ${item.category} &rarr; ${item.subcategory}</p>
      <p><strong>Technical Specifications:</strong> ${item.desc}</p>
      <p><strong>Inventory Stock:</strong> <span style="color: ${item.stock > 0 ? 'green' : 'red'}; font-weight: bold;">${item.stock} Units Available</span></p>
      <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary); margin-top: 0.5rem;">₹${item.price.toLocaleString()}</div>
    `;

    const addBtn = document.getElementById('modalAddToCartBtn');
    addBtn.onclick = () => {
      addToCart(item.id);
      closeItemModal();
    };

    document.getElementById('itemDetailModal').style.display = 'flex';
  };

  window.closeItemModal = () => {
    document.getElementById('itemDetailModal').style.display = 'none';
  };

  // --- USE CASE 5, 6, 7: CART ACTIONS (ADD, EDIT, REMOVE) ---
  window.addToCart = (id) => {
    const item = db.findById('tech_gadgets', id);
    if (!item || item.stock <= 0) {
      alert('Item is currently out of stock.');
      return;
    }

    const cart = db.get('tech_cart');
    const existing = cart.find(c => c.gadgetId === item.id);

    if (existing) {
      existing.qty += 1;
      existing.subtotal = existing.qty * item.price;
      db.set('tech_cart', cart);
    } else {
      db.insert('tech_cart', {
        gadgetId: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        qty: 1,
        subtotal: item.price
      });
    }

    alert(`Added "${item.title}" to cart!`);
    renderCart();
  };

  function renderCart() {
    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = '';
    const cart = db.get('tech_cart');

    document.getElementById('cartCountBadge').innerText = cart.length;

    let total = 0;
    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">Cart is empty. Browse gadget catalog!</td></tr>';
      document.getElementById('cartTotalDisplay').innerText = '₹0';
      return;
    }

    cart.forEach(c => {
      total += c.subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.title}</strong></td>
        <td>${c.category}</td>
        <td>₹${c.price.toLocaleString()}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="editCartQty('${c.id}', -1)">-</button>
            <span style="font-weight: 700;">${c.qty}</span>
            <button class="btn btn-secondary btn-sm" onclick="editCartQty('${c.id}', 1)">+</button>
          </div>
        </td>
        <td><strong>₹${c.subtotal.toLocaleString()}</strong></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeCartItem('${c.id}')">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('cartTotalDisplay').innerText = `₹${total.toLocaleString()}`;
  }

  // Use Case 6: Edit Cart
  window.editCartQty = (id, delta) => {
    const cart = db.get('tech_cart');
    const item = cart.find(c => c.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeCartItem(id);
      return;
    }

    item.subtotal = item.qty * item.price;
    db.set('tech_cart', cart);
    renderCart();
  };

  // Use Case 7: Remove from Cart
  window.removeCartItem = (id) => {
    db.remove('tech_cart', id);
    renderCart();
  };

  // --- USE CASE 8: CHECK OUT SHOPPING CART & AUDIT LOGGING ---
  window.checkoutTechCart = () => {
    const cart = db.get('tech_cart');
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }

    const customerName = prompt('Enter Customer Full Name for Order Receipt:', 'Faizze A.');
    const customerEmail = prompt('Enter Customer Email Address:', 'faizze@simats.edu');

    if (!customerName || !customerEmail) return;

    const totalSpent = cart.reduce((acc, c) => acc + c.subtotal, 0);
    const orderId = 'TS-' + Math.floor(1000 + Math.random() * 9000);

    // Record order for Customer and Admin Audit
    db.insert('tech_orders', {
      orderId,
      customerName,
      customerEmail,
      items: [...cart],
      totalSpent,
      status: 'Order Placed (Packaging at Central Hub)',
      orderDate: new Date().toLocaleString()
    });

    // Clear cart
    db.set('tech_cart', []);

    alert(`Checkout Complete!\nOrder #${orderId} confirmed.\nTotal: ₹${totalSpent.toLocaleString()}.\nConfirmation email dispatched to ${customerEmail}.`);
    renderCart();
    renderOrders();
    document.querySelector('.tab-btn[data-tab="ordersTab"]').click();
  };

  // --- USE CASE 9 & 10: CHECK ORDER STATUS & BROWSE ORDER HISTORY ---
  function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    const orders = db.get('tech_orders');

    orders.forEach(o => {
      const itemsList = o.items.map(i => `${i.qty}x ${i.title}`).join(', ');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${itemsList}</td>
        <td>₹${o.totalSpent.toLocaleString()}</td>
        <td>${o.orderDate}</td>
        <td><span class="badge badge-primary">${o.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="alert('Tracking status for ${o.orderId}: ${o.status}')">Check Status</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- STORE ADMIN FUNCTIONS (Add, Remove, Modify Price/Desc, View Checkout Customers) ---
  function renderAdminInventory() {
    const tbody = document.getElementById('adminInventoryTableBody');
    tbody.innerHTML = '';
    const gadgets = db.get('tech_gadgets');

    gadgets.forEach(g => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${g.title}</strong><br><small>${g.category}</small></td>
        <td>₹${g.price.toLocaleString()}</td>
        <td>${g.stock}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editAdminItem('${g.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="removeAdminItem('${g.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.editAdminItem = (id) => {
    const g = db.findById('tech_gadgets', id);
    if (!g) return;

    document.getElementById('editItemId').value = g.id;
    document.getElementById('itemTitle').value = g.title;
    document.getElementById('itemCategory').value = g.category;
    document.getElementById('itemSubcategory').value = g.subcategory;
    document.getElementById('itemPrice').value = g.price;
    document.getElementById('itemStock').value = g.stock;
    document.getElementById('itemDesc').value = g.desc;

    document.getElementById('adminFormTitle').innerText = 'Modify Item Price & Description';
    document.getElementById('saveItemBtn').innerText = 'Update Item';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
  };

  document.getElementById('cancelEditBtn').addEventListener('click', () => {
    document.getElementById('adminItemForm').reset();
    document.getElementById('editItemId').value = '';
    document.getElementById('adminFormTitle').innerText = 'Add New Electronic Gadget';
    document.getElementById('saveItemBtn').innerText = 'Save Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
  });

  window.removeAdminItem = (id) => {
    if (confirm('Delete this gadget from the store catalog?')) {
      db.remove('tech_gadgets', id);
      renderAdminInventory();
      renderGadgets();
    }
  };

  document.getElementById('adminItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('editItemId').value;
    const title = document.getElementById('itemTitle').value.trim();
    const category = document.getElementById('itemCategory').value.trim();
    const subcategory = document.getElementById('itemSubcategory').value.trim();
    const price = parseInt(document.getElementById('itemPrice').value, 10);
    const stock = parseInt(document.getElementById('itemStock').value, 10);
    const desc = document.getElementById('itemDesc').value.trim();

    if (editId) {
      db.update('tech_gadgets', editId, { title, category, subcategory, price, stock, desc });
      alert('Product price & specifications updated successfully!');
    } else {
      db.insert('tech_gadgets', { title, category, subcategory, price, stock, desc });
      alert(`Gadget "${title}" added to store!`);
    }

    document.getElementById('adminItemForm').reset();
    document.getElementById('editItemId').value = '';
    document.getElementById('adminFormTitle').innerText = 'Add New Electronic Gadget';
    document.getElementById('saveItemBtn').innerText = 'Save Product';
    document.getElementById('cancelEditBtn').style.display = 'none';

    renderAdminInventory();
    renderGadgets();
  });

  // Admin Audit Log: Information about each customer who checkouts items
  function renderAdminAudit() {
    const tbody = document.getElementById('adminAuditTableBody');
    tbody.innerHTML = '';
    const orders = db.get('tech_orders');

    orders.forEach(o => {
      const itemsList = o.items.map(i => `${i.qty}x ${i.title} (₹${i.price})`).join('<br>');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${o.customerName}</td>
        <td>${o.customerEmail}</td>
        <td><small>${itemsList}</small></td>
        <td><strong>₹${o.totalSpent.toLocaleString()}</strong></td>
        <td>${o.orderDate}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial runs
  renderCategoryPills();
  renderGadgets();
  renderCart();
  renderOrders();
});
