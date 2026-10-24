/**
 * Experiment 10: StyleHub Online Fashion Retailer
 * Apparel Catalog, Size Selection, Wishlist, Bag, Returns & Admin Auditing
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Fashion Inventory Seed
  const defaultFashionItems = [
    {
      id: 'f1',
      name: 'Tailored Italian Wool Slim Blazer',
      gender: 'Men',
      category: 'Formal Attire',
      price: 4999,
      stock: 15,
      desc: 'Breathable virgin wool blend with structured shoulders and horn buttons.'
    },
    {
      id: 'f2',
      name: 'Handcrafted Chanderi Silk Anarkali',
      gender: 'Women',
      category: 'Formal Attire',
      price: 3899,
      stock: 12,
      desc: 'Zari embroidered neckline with pure chiffon dupatta and cotton silk lining.'
    },
    {
      id: 'f3',
      name: 'Relaxed Fit Heavyweight Cotton Tee',
      gender: 'Men',
      category: 'Casual Wear',
      price: 899,
      stock: 30,
      desc: '240 GSM organic combed cotton, drop shoulder silhouette.'
    },
    {
      id: 'f4',
      name: 'High-Rise Vintage Straight Leg Denim',
      gender: 'Women',
      category: 'Casual Wear',
      price: 2199,
      stock: 18,
      desc: '100% rigid indigo denim with authentic washed fading.'
    },
    {
      id: 'f5',
      name: 'Classic Leather Brogue Dress Shoes',
      gender: 'Men',
      category: 'Footwear',
      price: 3499,
      stock: 10,
      desc: 'Full-grain burnished tan leather with cushioned memory foam insole.'
    }
  ];

  // Bag Seed
  const defaultBag = [];

  // Wishlist Seed
  const defaultWishlist = ['f2'];

  // Orders Seed
  const defaultOrders = [
    {
      orderId: 'SH-5021',
      customerName: 'Faizze A.',
      customerEmail: 'faizze@simats.edu',
      items: [
        { name: 'Tailored Italian Wool Slim Blazer', size: 'L', qty: 1, price: 4999 }
      ],
      totalSpent: 4999,
      status: 'Delivered',
      orderDate: '2026-10-02'
    }
  ];

  db.seedIfEmpty('fashion_inventory', defaultFashionItems);
  db.seedIfEmpty('fashion_bag', defaultBag);
  db.seedIfEmpty('fashion_wishlist', defaultWishlist);
  db.seedIfEmpty('fashion_orders', defaultOrders);

  // Role Switcher
  const roleSelect = document.getElementById('fashionRoleSelect');
  const custSection = document.getElementById('fashionCustomerSection');
  const adminSection = document.getElementById('fashionAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      custSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminFashionInventory();
      renderAdminFashionCustomers();
    } else {
      custSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderFashionCatalog();
      renderFashionBag();
      renderWishlist();
      renderFashionOrders();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#fashionCustomerSection') || btn.closest('#fashionAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- CUSTOMER CATALOG ---
  function renderFashionCatalog() {
    const gender = document.getElementById('fashionGenderFilter').value;
    const cat = document.getElementById('fashionCategoryFilter').value;
    const query = document.getElementById('fashionSearchInput').value.toLowerCase().trim();

    const grid = document.getElementById('fashionCatalogGrid');
    grid.innerHTML = '';

    const items = db.get('fashion_inventory').filter(item => {
      const matchGender = gender === 'all' || item.gender === gender;
      const matchCat = cat === 'all' || item.category === cat;
      const matchQuery = item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      return matchGender && matchCat && matchQuery;
    });

    if (items.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No fashion items matching criteria.</p>';
      return;
    }

    const wishlist = db.get('fashion_wishlist');

    items.forEach(item => {
      const isWishlisted = wishlist.includes(item.id);
      const card = document.createElement('div');
      card.className = 'fashion-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="badge badge-primary">${item.gender} &bull; ${item.category}</span>
            <button class="btn btn-secondary btn-sm" onclick="toggleWishlist('${item.id}')" style="padding: 0.2rem 0.5rem;">
              ${isWishlisted ? '❤️ Saved' : '🤍 Wishlist'}
            </button>
          </div>
          <h3 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.15rem;">${item.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${item.desc}</p>
        </div>
        <div style="margin-top: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 1.35rem; font-weight: 800; color: #ec4899;">₹${item.price.toLocaleString()}</span>
            <select id="size_${item.id}" class="form-select" style="width: auto; padding: 0.2rem 0.5rem; font-size: 0.85rem;">
              <option value="S">Size S</option>
              <option value="M" selected>Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
            </select>
          </div>
          <button class="btn btn-primary" style="width: 100%; background: #ec4899; border-color: #ec4899;" onclick="addFashionToBag('${item.id}')">Add to Bag</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('fashionGenderFilter').addEventListener('change', renderFashionCatalog);
  document.getElementById('fashionCategoryFilter').addEventListener('change', renderFashionCatalog);
  document.getElementById('fashionSearchInput').addEventListener('input', renderFashionCatalog);

  window.toggleWishlist = (id) => {
    let wishlist = db.get('fashion_wishlist');
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(x => x !== id);
    } else {
      wishlist.push(id);
    }
    db.set('fashion_wishlist', wishlist);
    renderFashionCatalog();
    renderWishlist();
  };

  function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');
    grid.innerHTML = '';
    const wishlist = db.get('fashion_wishlist');
    const items = db.get('fashion_inventory').filter(i => wishlist.includes(i.id));

    if (items.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No items saved to your wishlist yet.</p>';
      return;
    }

    items.forEach(i => {
      const card = document.createElement('div');
      card.className = 'fashion-card';
      card.innerHTML = `
        <h3>${i.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${i.gender} - ${i.category}</p>
        <div style="font-size: 1.25rem; font-weight: 800; color: #ec4899; margin: 0.5rem 0;">₹${i.price.toLocaleString()}</div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="toggleWishlist('${i.id}')">Remove</button>
          <button class="btn btn-primary btn-sm" onclick="addFashionToBag('${i.id}')">Move to Bag</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // --- BAG FUNCTIONS ---
  window.addFashionToBag = (id) => {
    const item = db.findById('fashion_inventory', id);
    if (!item) return;

    const sizeEl = document.getElementById(`size_${id}`);
    const size = sizeEl ? sizeEl.value : 'M';

    const bag = db.get('fashion_bag');
    const existing = bag.find(b => b.itemId === item.id && b.size === size);

    if (existing) {
      existing.qty += 1;
      existing.subtotal = existing.qty * item.price;
      db.set('fashion_bag', bag);
    } else {
      db.insert('fashion_bag', {
        itemId: item.id,
        name: item.name,
        gender: item.gender,
        size,
        price: item.price,
        qty: 1,
        subtotal: item.price
      });
    }

    alert(`Added "${item.name}" (Size: ${size}) to your bag!`);
    renderFashionBag();
  };

  function renderFashionBag() {
    const tbody = document.getElementById('fashionCartBody');
    tbody.innerHTML = '';
    const bag = db.get('fashion_bag');

    document.getElementById('bagCountBadge').innerText = bag.length;

    let total = 0;
    if (bag.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Your shopping bag is empty. Explore latest fashion!</td></tr>';
      document.getElementById('fashionBagTotalDisplay').innerText = '₹0';
      return;
    }

    bag.forEach(item => {
      total += item.subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.gender}</td>
        <td><span class="badge badge-primary">${item.size}</span></td>
        <td>₹${item.price.toLocaleString()}</td>
        <td>${item.qty}</td>
        <td><strong>₹${item.subtotal.toLocaleString()}</strong></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeBagItem('${item.id}')">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('fashionBagTotalDisplay').innerText = `₹${total.toLocaleString()}`;
  }

  window.removeBagItem = (id) => {
    db.remove('fashion_bag', id);
    renderFashionBag();
  };

  window.checkoutFashionCart = () => {
    const bag = db.get('fashion_bag');
    if (bag.length === 0) {
      alert('Your bag is empty.');
      return;
    }

    const name = prompt('Customer Name for Order:', 'Faizze A.');
    const email = prompt('Customer Email for Order Receipt:', 'faizze@simats.edu');
    if (!name || !email) return;

    const totalSpent = bag.reduce((acc, i) => acc + i.subtotal, 0);
    const orderId = 'SH-' + Math.floor(1000 + Math.random() * 9000);

    db.insert('fashion_orders', {
      orderId,
      customerName: name,
      customerEmail: email,
      items: [...bag],
      totalSpent,
      status: 'Shipped (Express 2-Day Air)',
      orderDate: new Date().toLocaleDateString()
    });

    db.set('fashion_bag', []);

    alert(`Order Placed!\nOrder ID: ${orderId}\nTotal: ₹${totalSpent.toLocaleString()}.\n30-Day Easy Return & Exchange window active.`);
    renderFashionBag();
    renderFashionOrders();
    document.querySelector('.tab-btn[data-tab="fashionOrdersTab"]').click();
  };

  // --- ORDERS & EASY RETURN POLICY ---
  function renderFashionOrders() {
    const tbody = document.getElementById('fashionOrdersTableBody');
    tbody.innerHTML = '';
    const orders = db.get('fashion_orders');

    orders.forEach(o => {
      const itemsStr = o.items.map(i => `${i.qty}x ${i.name} (Size: ${i.size})`).join(', ');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${itemsStr}</td>
        <td>₹${o.totalSpent.toLocaleString()}</td>
        <td>${o.orderDate}</td>
        <td><span class="badge ${o.status.includes('Delivered') ? 'badge-success' : 'badge-primary'}">${o.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="initiateReturnExchange('${o.orderId}')">Return / Exchange</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.initiateReturnExchange = (orderId) => {
    const reason = prompt(`Enter reason for Return/Exchange for Order #${orderId}:\n(e.g., Size too large, Fabric color, Exchange for different size):`);
    if (reason) {
      alert(`Return/Exchange request registered for #${orderId}!\nReason: "${reason}". Free doorstep pickup scheduled within 48 hours.`);
    }
  };

  // --- ADMIN FUNCTIONS ---
  function renderAdminFashionInventory() {
    const tbody = document.getElementById('adminFashionInventoryBody');
    tbody.innerHTML = '';
    const items = db.get('fashion_inventory');

    items.forEach(i => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${i.name}</strong><br><small>${i.gender} - ${i.category}</small></td>
        <td>₹${i.price.toLocaleString()}</td>
        <td>${i.stock}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editAdminFashion('${i.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="removeAdminFashion('${i.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.editAdminFashion = (id) => {
    const item = db.findById('fashion_inventory', id);
    if (!item) return;

    document.getElementById('editFashionId').value = item.id;
    document.getElementById('fItemName').value = item.name;
    document.getElementById('fItemGender').value = item.gender;
    document.getElementById('fItemCategory').value = item.category;
    document.getElementById('fItemPrice').value = item.price;
    document.getElementById('fItemStock').value = item.stock;
    document.getElementById('fItemDesc').value = item.desc;

    document.getElementById('adminFashionFormTitle').innerText = 'Modify Fashion Item Details';
    document.getElementById('saveFashionBtn').innerText = 'Update Product';
    document.getElementById('cancelFashionEditBtn').style.display = 'inline-block';
  };

  document.getElementById('cancelFashionEditBtn').addEventListener('click', () => {
    document.getElementById('adminFashionItemForm').reset();
    document.getElementById('editFashionId').value = '';
    document.getElementById('adminFashionFormTitle').innerText = 'Add New Fashion Item';
    document.getElementById('saveFashionBtn').innerText = 'Save Product';
    document.getElementById('cancelFashionEditBtn').style.display = 'none';
  });

  window.removeAdminFashion = (id) => {
    if (confirm('Delete fashion item from catalog?')) {
      db.remove('fashion_inventory', id);
      renderAdminFashionInventory();
      renderFashionCatalog();
    }
  };

  document.getElementById('adminFashionItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('editFashionId').value;
    const name = document.getElementById('fItemName').value.trim();
    const gender = document.getElementById('fItemGender').value;
    const category = document.getElementById('fItemCategory').value;
    const price = parseInt(document.getElementById('fItemPrice').value, 10);
    const stock = parseInt(document.getElementById('fItemStock').value, 10);
    const desc = document.getElementById('fItemDesc').value.trim();

    if (editId) {
      db.update('fashion_inventory', editId, { name, gender, category, price, stock, desc });
      alert('Fashion product updated!');
    } else {
      db.insert('fashion_inventory', { name, gender, category, price, stock, desc });
      alert(`Product "${name}" added to catalog!`);
    }

    document.getElementById('adminFashionItemForm').reset();
    document.getElementById('editFashionId').value = '';
    document.getElementById('adminFashionFormTitle').innerText = 'Add New Fashion Item';
    document.getElementById('saveFashionBtn').innerText = 'Save Product';
    document.getElementById('cancelFashionEditBtn').style.display = 'none';

    renderAdminFashionInventory();
    renderFashionCatalog();
  });

  function renderAdminFashionCustomers() {
    const tbody = document.getElementById('adminFashionCustomersBody');
    tbody.innerHTML = '';
    const orders = db.get('fashion_orders');

    orders.forEach(o => {
      const itemsList = o.items.map(i => `${i.qty}x ${i.name} (${i.size}) - ₹${i.price}`).join('<br>');
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
  renderFashionCatalog();
  renderFashionBag();
  renderWishlist();
  renderFashionOrders();
});
