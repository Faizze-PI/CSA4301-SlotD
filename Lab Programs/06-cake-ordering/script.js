/**
 * Experiment 06: Online Cake Ordering System
 * Customizer (Weight & Message), Cart State, Shipping Address, and Order Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Cake products seed
  const defaultCakes = [
    {
      id: 'ck1',
      name: 'Signature Dark Belgian Truffle',
      flavor: 'Chocolate',
      occasion: 'Birthday',
      basePrice: 550,
      stock: 12,
      desc: 'Rich dark Belgian ganache with layered moist sponge and dark chocolate curls.'
    },
    {
      id: 'ck2',
      name: 'Classic Velvet Crimson Heart',
      flavor: 'Red Velvet',
      occasion: 'Anniversary',
      basePrice: 650,
      stock: 8,
      desc: 'Velvety cocoa crumb layered with tangy cream cheese frosting.'
    },
    {
      id: 'ck3',
      name: 'Bavarian Black Forest Gateau',
      flavor: 'Black Forest',
      occasion: 'Celebration',
      basePrice: 480,
      stock: 15,
      desc: 'Infused with dark cherries, fresh whipped vanilla cream, and chocolate flakes.'
    },
    {
      id: 'ck4',
      name: 'Fresh Alphonso Mango Mousse',
      flavor: 'Mango',
      occasion: 'Celebration',
      basePrice: 590,
      stock: 10,
      desc: 'Made with seasonal Alphonso pulp and light, airy whipped dairy cream.'
    }
  ];

  // Cart seed
  const defaultCart = [];

  // Orders seed
  const defaultOrders = [
    {
      id: 'ORD-9021',
      customerName: 'Faizze A.',
      items: [
        { name: 'Signature Dark Belgian Truffle', size: '1.0 kg', message: 'Happy 21st Birthday Faizze!', price: 1100, qty: 1 }
      ],
      shippingAddress: '42 University Crescent, Block B, Chennai - 600124',
      totalAmount: 1100,
      status: 'Baking in Oven',
      orderDate: '2026-10-06'
    }
  ];

  db.seedIfEmpty('cake_products', defaultCakes);
  db.seedIfEmpty('cake_cart', defaultCart);
  db.seedIfEmpty('cake_orders', defaultOrders);

  // Role Switcher
  const roleSelect = document.getElementById('cakeRoleSelect');
  const userSection = document.getElementById('cakeUserSection');
  const adminSection = document.getElementById('cakeAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminCakeList();
      renderAdminOrders();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderCakeCatalog();
      renderCart();
      renderUserOrders();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#cakeUserSection') || btn.closest('#cakeAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- CUSTOMER CATALOG & CUSTOMIZER ---
  function renderCakeCatalog() {
    const query = document.getElementById('cakeSearchInput').value.toLowerCase().trim();
    const cat = document.getElementById('cakeCategoryFilter').value;
    const flav = document.getElementById('cakeFlavorFilter').value;

    const grid = document.getElementById('cakeCatalogGrid');
    grid.innerHTML = '';

    const cakes = db.get('cake_products').filter(c => {
      const matchCat = cat === 'all' || c.occasion === cat;
      const matchFlav = flav === 'all' || c.flavor === flav;
      const matchSearch = c.name.toLowerCase().includes(query) || c.flavor.toLowerCase().includes(query) || c.occasion.toLowerCase().includes(query);
      return matchCat && matchFlav && matchSearch;
    });

    if (cakes.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No cakes match your selected filters.</p>';
      return;
    }

    cakes.forEach(c => {
      const card = document.createElement('div');
      card.className = 'cake-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-primary">${c.flavor}</span>
            <span class="badge badge-secondary">${c.occasion}</span>
          </div>
          <h3 class="cake-title">${c.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${c.desc}</p>
        </div>
        <div>
          <div class="cake-price">₹${c.basePrice} <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">/ 0.5 kg</span></div>
          <button class="btn btn-primary" style="width: 100%;" onclick="openCustomizeModal('${c.id}')">Customize & Order</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('cakeSearchInput').addEventListener('input', renderCakeCatalog);
  document.getElementById('cakeCategoryFilter').addEventListener('change', renderCakeCatalog);
  document.getElementById('cakeFlavorFilter').addEventListener('change', renderCakeCatalog);

  let activeCustomCake = null;

  window.openCustomizeModal = (cakeId) => {
    const cake = db.findById('cake_products', cakeId);
    if (!cake) return;

    activeCustomCake = cake;
    document.getElementById('customModalCakeTitle').innerText = cake.name;
    document.getElementById('customModalCakeDesc').innerText = `${cake.flavor} Cake for ${cake.occasion} - Starting from ₹${cake.basePrice}`;
    document.getElementById('cakeSizeSelect').value = '0.5';
    document.getElementById('cakeMessageInput').value = '';
    document.getElementById('cakeQtyInput').value = '1';

    updateCustomPrice();
    document.getElementById('customizeModal').style.display = 'flex';
  };

  function updateCustomPrice() {
    if (!activeCustomCake) return;
    const weightMultiplier = parseFloat(document.getElementById('cakeSizeSelect').value) / 0.5;
    const qty = parseInt(document.getElementById('cakeQtyInput').value, 10) || 1;
    const unitPrice = Math.round(activeCustomCake.basePrice * weightMultiplier);
    const total = unitPrice * qty;

    document.getElementById('customPriceTag').innerText = `₹${total}`;
    return { unitPrice, total };
  }

  document.getElementById('cakeSizeSelect').addEventListener('change', updateCustomPrice);
  document.getElementById('cakeQtyInput').addEventListener('input', updateCustomPrice);

  window.closeCustomizeModal = () => {
    document.getElementById('customizeModal').style.display = 'none';
    activeCustomCake = null;
  };

  document.getElementById('cakeCustomForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeCustomCake) return;

    const size = document.getElementById('cakeSizeSelect').value + ' kg';
    const message = document.getElementById('cakeMessageInput').value.trim() || 'Happy Celebration!';
    const qty = parseInt(document.getElementById('cakeQtyInput').value, 10) || 1;
    const { unitPrice, total } = updateCustomPrice();

    db.insert('cake_cart', {
      cakeId: activeCustomCake.id,
      name: activeCustomCake.name,
      size,
      message,
      unitPrice,
      qty,
      subtotal: total
    });

    alert(`Added "${activeCustomCake.name}" (${size}) to your cart!`);
    closeCustomizeModal();
    renderCart();
  });

  // --- CART FUNCTIONS ---
  function renderCart() {
    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = '';
    const cart = db.get('cake_cart');

    document.getElementById('cartCountBadge').innerText = cart.length;

    let grandTotal = 0;

    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Your cart is currently empty. Explore our cakes catalog!</td></tr>';
      document.getElementById('cartGrandTotal').innerText = '₹0';
      return;
    }

    cart.forEach(item => {
      grandTotal += item.subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-primary">${item.size}</span></td>
        <td><em>"${item.message}"</em></td>
        <td>₹${item.unitPrice}</td>
        <td>${item.qty}</td>
        <td><strong>₹${item.subtotal}</strong></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeCartItem('${item.id}')">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('cartGrandTotal').innerText = `₹${grandTotal.toLocaleString()}`;
  }

  window.removeCartItem = (id) => {
    db.remove('cake_cart', id);
    renderCart();
  };

  window.proceedToCakeCheckout = () => {
    const cart = db.get('cake_cart');
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const shipName = document.getElementById('shipFullName').value;
    const shipStreet = document.getElementById('shipStreet').value;
    const shipCity = document.getElementById('shipCity').value;
    const shipPin = document.getElementById('shipPin').value;
    const address = `${shipStreet}, ${shipCity} - ${shipPin}`;

    const grandTotal = cart.reduce((acc, i) => acc + i.subtotal, 0);
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    db.insert('cake_orders', {
      id: orderId,
      customerName: shipName,
      items: [...cart],
      shippingAddress: address,
      totalAmount: grandTotal,
      status: 'Order Placed',
      orderDate: new Date().toISOString().split('T')[0]
    });

    // Clear cart
    db.set('cake_cart', []);

    alert(`Order Placed Successfully!\nOrder ID: ${orderId}\nTotal: ₹${grandTotal}\nDelivery scheduled to: ${address}`);
    renderCart();
    renderUserOrders();

    // Switch to orders tab
    document.querySelector('.tab-btn[data-tab="cakeOrdersTab"]').click();
  };

  // --- ORDERS TRACKER ---
  function renderUserOrders() {
    const tbody = document.getElementById('userOrdersTableBody');
    tbody.innerHTML = '';
    const orders = db.get('cake_orders');

    orders.forEach(o => {
      const itemsSummary = o.items.map(i => `${i.qty}x ${i.name} (${i.size})`).join(', ');
      const messages = o.items.map(i => i.message).filter(m => m).join(' | ');

      let statusBadge = 'badge-primary';
      if (o.status === 'Delivered') statusBadge = 'badge-success';
      if (o.status === 'Out for Delivery') statusBadge = 'badge-warning';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.id}</strong></td>
        <td>${itemsSummary}</td>
        <td><small><em>"${messages}"</em></small></td>
        <td><small>${o.shippingAddress}</small></td>
        <td><strong>₹${o.totalAmount}</strong></td>
        <td><span class="badge ${statusBadge}">${o.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="trackCakeOrder('${o.id}')">Live Tracker</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.trackCakeOrder = (orderId) => {
    const order = db.findById('cake_orders', orderId);
    if (!order) return;
    alert(`Order Tracking for #${order.id}:\nCurrent Status: [ ${order.status.toUpperCase()} ]\nDelivery destination: ${order.shippingAddress}\nEstimated Delivery: Today by 6:00 PM.`);
  };

  // --- BAKERY ADMIN FUNCTIONS ---
  function renderAdminCakeList() {
    const tbody = document.getElementById('adminCakeListBody');
    tbody.innerHTML = '';
    const cakes = db.get('cake_products');

    cakes.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>${c.flavor} (${c.occasion})</td>
        <td>₹${c.basePrice}</td>
        <td>${c.stock}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteCakeAdmin('${c.id}')">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.deleteCakeAdmin = (id) => {
    if (confirm('Delete cake product from store catalog?')) {
      db.remove('cake_products', id);
      renderAdminCakeList();
      renderCakeCatalog();
    }
  };

  document.getElementById('adminNewCakeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newCakeName').value.trim();
    const flavor = document.getElementById('newCakeFlavor').value.trim();
    const occasion = document.getElementById('newCakeOccasion').value.trim();
    const basePrice = parseInt(document.getElementById('newCakePrice').value, 10);
    const stock = parseInt(document.getElementById('newCakeStock').value, 10);
    const desc = document.getElementById('newCakeDesc').value.trim();

    db.insert('cake_products', { name, flavor, occasion, basePrice, stock, desc });
    alert(`Cake "${name}" published to store!`);
    document.getElementById('adminNewCakeForm').reset();
    renderAdminCakeList();
    renderCakeCatalog();
  });

  function renderAdminOrders() {
    const tbody = document.getElementById('adminCakeOrdersTableBody');
    tbody.innerHTML = '';
    const orders = db.get('cake_orders');

    orders.forEach(o => {
      const itemsSummary = o.items.map(i => `${i.qty}x ${i.name} (${i.size}) - "${i.message}"`).join('<br>');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.id}</strong></td>
        <td>${o.customerName}</td>
        <td><small>${itemsSummary}</small></td>
        <td>₹${o.totalAmount}</td>
        <td><span class="badge badge-primary">${o.status}</span></td>
        <td>
          <select class="form-select" style="font-size: 0.85rem; padding: 0.25rem 0.5rem;" onchange="updateOrderStatusAdmin('${o.id}', this.value)">
            <option value="Order Placed" ${o.status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
            <option value="Baking in Oven" ${o.status === 'Baking in Oven' ? 'selected' : ''}>Baking in Oven</option>
            <option value="Decorating & Inscribing" ${o.status === 'Decorating & Inscribing' ? 'selected' : ''}>Decorating & Inscribing</option>
            <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.updateOrderStatusAdmin = (orderId, newStatus) => {
    db.update('cake_orders', orderId, { status: newStatus });
    alert(`Order #${orderId} status transitioned to: ${newStatus}`);
    renderAdminOrders();
    renderUserOrders();
  };

  // Initial runs
  renderCakeCatalog();
  renderCart();
  renderUserOrders();
});
