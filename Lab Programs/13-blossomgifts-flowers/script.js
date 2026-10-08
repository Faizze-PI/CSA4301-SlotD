/**
 * Experiment 13: BlossomGifts Online Platform
 * Flowers, Curated Gift Hampers, Scheduled Delivery Slots, and Email Inquiries
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Gifts Seed
  const defaultGifts = [
    {
      id: 'g1',
      name: 'Royal Crimson Red Roses (24 Stems)',
      occasion: 'Anniversary',
      recipient: 'For Her',
      price: 1499,
      stock: 20,
      desc: 'Fresh premium long-stem Dutch roses arranged in a luxurious signature box.'
    },
    {
      id: 'g2',
      name: 'Exotic Orchid & Carnation Delight',
      occasion: 'Birthday',
      recipient: 'For Her',
      price: 1899,
      stock: 15,
      desc: 'Purple dendrobium orchids paired with pink carnations and gypsophila.'
    },
    {
      id: 'g3',
      name: 'Gourmet Artisanal Chocolate & Nut Hamper',
      occasion: 'Congratulations',
      recipient: 'For Him',
      price: 2499,
      stock: 12,
      desc: 'Imported Swiss pralines, roasted California almonds, and roasted cashews.'
    },
    {
      id: 'g4',
      name: 'Serene White Lily & Baby Breath Basket',
      occasion: 'Sympathy',
      recipient: 'For Family',
      price: 1699,
      stock: 18,
      desc: 'Elegant oriental white lilies expressing heartfelt warmth and peaceful wishes.'
    }
  ];

  // Cart Seed
  const defaultCart = [];

  // Orders Seed
  const defaultOrders = [
    {
      orderId: 'BG-8402',
      customerName: 'Faizze A.',
      items: [
        { name: 'Royal Crimson Red Roses (24 Stems)', delivDate: '2026-10-14', slot: 'Midnight Surprise (11:30 PM - 12:00 AM)', qty: 1, price: 1499 }
      ],
      totalPaid: 1499,
      status: 'Floral Design Arranged',
      orderDate: '2026-10-06'
    }
  ];

  db.seedIfEmpty('gift_catalog', defaultGifts);
  db.seedIfEmpty('gift_cart', defaultCart);
  db.seedIfEmpty('gift_orders', defaultOrders);

  // Role Switcher
  const roleSelect = document.getElementById('giftRoleSelect');
  const custSection = document.getElementById('giftCustomerSection');
  const adminSection = document.getElementById('giftAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      custSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminGiftInventory();
      renderAdminGiftOrders();
    } else {
      custSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderGiftCatalog();
      renderGiftCart();
      renderGiftOrders();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#giftCustomerSection') || btn.closest('#giftAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- CATALOG & DELIVERY SLOT PICKER ---
  function renderGiftCatalog() {
    const occ = document.getElementById('giftOccasionFilter').value;
    const rec = document.getElementById('giftRecipientFilter').value;
    const query = document.getElementById('giftSearchInput').value.toLowerCase().trim();

    const grid = document.getElementById('giftCatalogGrid');
    grid.innerHTML = '';

    const list = db.get('gift_catalog').filter(g => {
      const matchOcc = occ === 'all' || g.occasion === occ;
      const matchRec = rec === 'all' || g.recipient === rec;
      const matchQuery = g.name.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query);
      return matchOcc && matchRec && matchQuery;
    });

    if (list.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No gifts matching filters.</p>';
      return;
    }

    list.forEach(g => {
      const card = document.createElement('div');
      card.className = 'gift-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-primary">${g.occasion}</span>
            <span class="badge badge-secondary">${g.recipient}</span>
          </div>
          <h3 style="font-size: 1.15rem; margin: 0.5rem 0 0.25rem 0;">${g.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${g.desc}</p>
        </div>
        <div style="margin-top: 1rem;">
          <div style="font-size: 1.35rem; font-weight: 800; color: #f43f5e; margin-bottom: 0.5rem;">₹${g.price.toLocaleString()}</div>
          <button class="btn btn-primary btn-sm" style="width: 100%; background: #f43f5e; border-color: #f43f5e;" onclick="openGiftScheduleModal('${g.id}')">Select Delivery & Add</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('giftOccasionFilter').addEventListener('change', renderGiftCatalog);
  document.getElementById('giftRecipientFilter').addEventListener('change', renderGiftCatalog);
  document.getElementById('giftSearchInput').addEventListener('input', renderGiftCatalog);

  let activeSchedulingGift = null;

  window.openGiftScheduleModal = (id) => {
    const gift = db.findById('gift_catalog', id);
    if (!gift) return;

    activeSchedulingGift = gift;
    document.getElementById('modalGiftTitle').innerText = gift.name;
    document.getElementById('modalGiftPrice').innerText = `Price: ₹${gift.price.toLocaleString()} | ${gift.occasion} (${gift.recipient})`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('delivDateInput').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('delivQtyInput').value = '1';

    document.getElementById('giftScheduleModal').style.display = 'flex';
  };

  window.closeGiftScheduleModal = () => {
    document.getElementById('giftScheduleModal').style.display = 'none';
    activeSchedulingGift = null;
  };

  document.getElementById('giftScheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeSchedulingGift) return;

    const delivDate = document.getElementById('delivDateInput').value;
    const delivSlot = document.getElementById('delivSlotInput').value;
    const qty = parseInt(document.getElementById('delivQtyInput').value, 10) || 1;

    db.insert('gift_cart', {
      giftId: activeSchedulingGift.id,
      name: activeSchedulingGift.name,
      occasion: activeSchedulingGift.occasion,
      delivDate,
      delivSlot,
      price: activeSchedulingGift.price,
      qty,
      subtotal: activeSchedulingGift.price * qty
    });

    alert(`Added "${activeSchedulingGift.name}" to cart!\nScheduled Delivery: ${delivDate} (${delivSlot})`);
    closeGiftScheduleModal();
    renderGiftCart();
  });

  // --- CART FUNCTIONS ---
  function renderGiftCart() {
    const tbody = document.getElementById('giftCartTableBody');
    tbody.innerHTML = '';
    const cart = db.get('gift_cart');

    document.getElementById('giftCartBadge').innerText = cart.length;

    let total = 0;
    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Basket is empty.</td></tr>';
      document.getElementById('giftCartTotalDisplay').innerText = '₹0';
      return;
    }

    cart.forEach(item => {
      total += item.subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.occasion}</td>
        <td><small>${item.delivDate}<br><em>${item.delivSlot}</em></small></td>
        <td>₹${item.price.toLocaleString()}</td>
        <td>${item.qty}</td>
        <td><strong>₹${item.subtotal.toLocaleString()}</strong></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeGiftCartItem('${item.id}')">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('giftCartTotalDisplay').innerText = `₹${total.toLocaleString()}`;
  }

  window.removeGiftCartItem = (id) => {
    db.remove('gift_cart', id);
    renderGiftCart();
  };

  window.checkoutGiftCart = () => {
    const cart = db.get('gift_cart');
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const recipientName = prompt('Enter Recipient Name:', 'Priya Sharma');
    const deliveryAddress = prompt('Enter Delivery Address:', 'No. 8, Palm Avenue, Chennai - 600028');
    if (!recipientName || !deliveryAddress) return;

    const totalPaid = cart.reduce((acc, i) => acc + i.subtotal, 0);
    const orderId = 'BG-' + Math.floor(1000 + Math.random() * 9000);

    db.insert('gift_orders', {
      orderId,
      customerName: recipientName,
      deliveryAddress,
      items: [...cart],
      totalPaid,
      status: 'Floral Design Arranged',
      orderDate: new Date().toLocaleDateString()
    });

    db.set('gift_cart', []);

    alert(`Order #${orderId} Placed!\nTotal: ₹${totalPaid.toLocaleString()}.\nFlowers scheduled for delivery to ${recipientName}.`);
    renderGiftCart();
    renderGiftOrders();
    document.querySelector('.tab-btn[data-tab="giftOrdersTab"]').click();
  };

  function renderGiftOrders() {
    const tbody = document.getElementById('giftOrdersTableBody');
    tbody.innerHTML = '';
    const orders = db.get('gift_orders');

    orders.forEach(o => {
      const itemsStr = o.items.map(i => `${i.qty}x ${i.name}`).join(', ');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${itemsStr}</td>
        <td><small>To: <strong>${o.customerName}</strong><br>${o.items[0]?.delivDate} (${o.items[0]?.delivSlot})</small></td>
        <td>₹${o.totalPaid.toLocaleString()}</td>
        <td><span class="badge badge-primary">${o.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="alert('Tracking order #${o.orderId}: ${o.status}. Florist has freshly bundled stems.')">Track</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- EMAIL INQUIRY FORM ---
  document.getElementById('emailInquiryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inqName').value.trim();
    const email = document.getElementById('inqEmail').value.trim();
    const subject = document.getElementById('inqSubject').value.trim();

    alert(`Email Inquiry Sent Successfully!\nTo: florist@blossomgifts.com\nFrom: ${name} (${email})\nSubject: ${subject}\nOur head floral designer will contact you within 2 business hours.`);
    document.getElementById('emailInquiryForm').reset();
  });

  // --- FLORIST ADMIN FUNCTIONS ---
  function renderAdminGiftInventory() {
    const tbody = document.getElementById('adminGiftInventoryBody');
    tbody.innerHTML = '';
    const gifts = db.get('gift_catalog');

    gifts.forEach(g => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${g.name}</strong><br><small>${g.occasion}</small></td>
        <td>₹${g.price.toLocaleString()}</td>
        <td>${g.stock}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editAdminGift('${g.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAdminGift('${g.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.editAdminGift = (id) => {
    const g = db.findById('gift_catalog', id);
    if (!g) return;

    document.getElementById('editGiftId').value = g.id;
    document.getElementById('gName').value = g.name;
    document.getElementById('gOccasion').value = g.occasion;
    document.getElementById('gRecipient').value = g.recipient;
    document.getElementById('gPrice').value = g.price;
    document.getElementById('gStock').value = g.stock;
    document.getElementById('gDesc').value = g.desc;

    document.getElementById('giftFormTitle').innerText = 'Modify Floral Product Details';
    document.getElementById('saveGiftBtn').innerText = 'Update Product';
    document.getElementById('cancelGiftEditBtn').style.display = 'inline-block';
  };

  document.getElementById('cancelGiftEditBtn').addEventListener('click', () => {
    document.getElementById('adminGiftForm').reset();
    document.getElementById('editGiftId').value = '';
    document.getElementById('giftFormTitle').innerText = 'Add Floral Arrangement / Gift';
    document.getElementById('saveGiftBtn').innerText = 'Save Product';
    document.getElementById('cancelGiftEditBtn').style.display = 'none';
  });

  window.deleteAdminGift = (id) => {
    if (confirm('Delete floral product?')) {
      db.remove('gift_catalog', id);
      renderAdminGiftInventory();
      renderGiftCatalog();
    }
  };

  document.getElementById('adminGiftForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('editGiftId').value;
    const name = document.getElementById('gName').value.trim();
    const occasion = document.getElementById('gOccasion').value;
    const recipient = document.getElementById('gRecipient').value;
    const price = parseInt(document.getElementById('gPrice').value, 10);
    const stock = parseInt(document.getElementById('gStock').value, 10);
    const desc = document.getElementById('gDesc').value.trim();

    if (editId) {
      db.update('gift_catalog', editId, { name, occasion, recipient, price, stock, desc });
      alert('Product updated successfully!');
    } else {
      db.insert('gift_catalog', { name, occasion, recipient, price, stock, desc });
      alert(`Gift "${name}" posted to catalog!`);
    }

    document.getElementById('adminGiftForm').reset();
    document.getElementById('editGiftId').value = '';
    document.getElementById('giftFormTitle').innerText = 'Add Floral Arrangement / Gift';
    document.getElementById('saveGiftBtn').innerText = 'Save Product';
    document.getElementById('cancelGiftEditBtn').style.display = 'none';

    renderAdminGiftInventory();
    renderGiftCatalog();
  });

  function renderAdminGiftOrders() {
    const tbody = document.getElementById('adminGiftOrdersBody');
    tbody.innerHTML = '';
    const orders = db.get('gift_orders');

    orders.forEach(o => {
      const itemsStr = o.items.map(i => `${i.qty}x ${i.name} (${i.delivDate})`).join('<br>');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${o.orderId}</strong></td>
        <td>${o.customerName}<br><small>${o.deliveryAddress}</small></td>
        <td><small>${itemsStr}</small></td>
        <td>₹${o.totalPaid.toLocaleString()}</td>
        <td><span class="badge badge-primary">${o.status}</span></td>
        <td>
          <select class="form-select" style="font-size: 0.85rem; padding: 0.2rem 0.5rem;" onchange="updateGiftStatus('${o.id}', this.value)">
            <option value="Floral Design Arranged" ${o.status === 'Floral Design Arranged' ? 'selected' : ''}>Design Arranged</option>
            <option value="Out for Courier Dispatch" ${o.status === 'Out for Courier Dispatch' ? 'selected' : ''}>Out for Dispatch</option>
            <option value="Hand-Delivered to Recipient" ${o.status === 'Hand-Delivered to Recipient' ? 'selected' : ''}>Hand-Delivered</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.updateGiftStatus = (orderId, newStatus) => {
    db.update('gift_orders', orderId, { status: newStatus });
    alert(`Order #${orderId} status updated to: ${newStatus}`);
    renderAdminGiftOrders();
    renderGiftOrders();
  };

  // Initial runs
  renderGiftCatalog();
  renderGiftCart();
  renderGiftOrders();
});
