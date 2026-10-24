/**
 * Experiment 03: Online Bus Ticket Booking System
 * Implementation of Bus Categories, Live Seat Matrix, Ticket PNRs, Comments & Reports
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Categories seed
  const defaultCategories = [
    { id: 'c1', name: 'Volvo Multi-Axle AC', desc: 'Ultra-luxurious semi-sleeper with personal screens and AC.' },
    { id: 'c2', name: 'AC Sleeper Coach', desc: 'Spacious upper and lower berths with charging and curtains.' },
    { id: 'c3', name: 'Non-AC Executive Seater', desc: 'Economical 2+2 push-back reclining seats.' }
  ];

  // Bus fleet seed
  const defaultBuses = [
    { id: 'BUS-101', name: 'CityExpress Gold 101', category: 'Volvo Multi-Axle AC', from: 'Chennai', to: 'Bangalore', time: '21:30', fare: 850, capacity: 24, bookedSeats: ['1', '2', '5'] },
    { id: 'BUS-102', name: 'CityExpress NightStar', category: 'AC Sleeper Coach', from: 'Chennai', to: 'Bangalore', time: '22:45', fare: 1100, capacity: 20, bookedSeats: ['3', '4'] },
    { id: 'BUS-103', name: 'Kongu Royal Express', category: 'Volvo Multi-Axle AC', from: 'Chennai', to: 'Coimbatore', time: '20:15', fare: 920, capacity: 24, bookedSeats: ['7'] },
    { id: 'BUS-104', name: 'Southern Hill Rider', category: 'AC Sleeper Coach', from: 'Chennai', to: 'Kodaikanal', time: '19:30', fare: 1250, capacity: 20, bookedSeats: ['1', '8'] }
  ];

  // Tickets seed
  const defaultTickets = [
    {
      pnr: 'CE-82910',
      busId: 'BUS-101',
      busName: 'CityExpress Gold 101',
      category: 'Volvo Multi-Axle AC',
      route: 'Chennai to Bangalore',
      date: '2026-10-10',
      time: '21:30',
      seats: ['1', '2'],
      passengerName: 'Faizze A.',
      phone: '9876543210',
      totalFare: 1700,
      status: 'Confirmed'
    }
  ];

  // Comments seed
  const defaultComments = [
    { id: 'cm1', busName: 'CityExpress Gold 101', commenter: 'Rohan Sharma', rating: 5, text: 'Extremely clean bus, arrived 10 minutes ahead of time. Very comfortable seats.' },
    { id: 'cm2', busName: 'CityExpress NightStar', commenter: 'Priya K.', rating: 4, text: 'Great sleeper coach, charging ports were working well.' }
  ];

  db.seedIfEmpty('bus_categories', defaultCategories);
  db.seedIfEmpty('bus_fleet', defaultBuses);
  db.seedIfEmpty('bus_tickets', defaultTickets);
  db.seedIfEmpty('bus_comments', defaultComments);

  // Role Switcher
  const roleSelect = document.getElementById('busRoleSelect');
  const userSection = document.getElementById('busUserSection');
  const adminSection = document.getElementById('busAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminFleet();
      renderAdminCategories();
      populateAdminCategorySelect();
      renderAdminReports();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderBusesList();
      renderUserTickets();
      renderBusComments();
      populateCommentBusSelect();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#busUserSection') || btn.closest('#busAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- PASSENGER / USER VIEW ---
  function renderBusesList() {
    const list = document.getElementById('busResultsList');
    list.innerHTML = '';

    const fromVal = document.getElementById('originCity').value;
    const toVal = document.getElementById('destCity').value;

    const buses = db.get('bus_fleet').filter(b => b.from.toLowerCase() === fromVal.toLowerCase() && b.to.toLowerCase() === toVal.toLowerCase());

    if (buses.length === 0) {
      list.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted);">No direct buses found for ${fromVal} to ${toVal}. Try another route or add a bus via Admin view.</div>`;
      return;
    }

    buses.forEach(b => {
      const bookedCount = b.bookedSeats ? b.bookedSeats.length : 0;
      const availableSeats = b.capacity - bookedCount;

      const card = document.createElement('div');
      card.className = 'bus-item-card';
      card.innerHTML = `
        <div>
          <span class="badge badge-primary">${b.category}</span>
          <h3 style="margin: 0.25rem 0; font-size: 1.15rem;">${b.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
            Route: <strong>${b.from} &rarr; ${b.to}</strong> | Departure: <strong>${b.time}</strong>
          </p>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">
            Seats: <strong style="color: ${availableSeats > 5 ? 'var(--success)' : 'var(--danger)'};">${availableSeats} available</strong> / ${b.capacity}
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary);">₹${b.fare}</div>
          <button class="btn btn-primary btn-sm" style="margin-top: 0.5rem;" onclick="openSeatModal('${b.id}')">Select Seats</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  document.getElementById('busSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    renderBusesList();
  });

  // Seat Selection Interactive Matrix
  let currentBookingBus = null;
  let currentlySelectedSeats = [];

  window.openSeatModal = (busId) => {
    const bus = db.findById('bus_fleet', busId);
    if (!bus) return;

    currentBookingBus = bus;
    currentlySelectedSeats = [];

    document.getElementById('seatModalTitle').innerText = `${bus.name} - Seat Layout`;
    document.getElementById('seatModalSubtitle').innerText = `${bus.from} to ${bus.to} | Fare: ₹${bus.fare}/seat | ${bus.category}`;
    document.getElementById('selectedSeatsLabel').innerText = 'None';
    document.getElementById('selectedFareLabel').innerText = '₹0';

    const matrix = document.getElementById('seatMatrix');
    matrix.innerHTML = '';

    const bookedSeats = bus.bookedSeats || [];

    for (let i = 1; i <= bus.capacity; i++) {
      const seatBtn = document.createElement('div');
      const seatNumStr = i.toString();
      const isBooked = bookedSeats.includes(seatNumStr);

      seatBtn.className = `seat ${isBooked ? 'booked' : 'available'}`;
      seatBtn.innerText = i;

      if (!isBooked) {
        seatBtn.addEventListener('click', () => {
          if (currentlySelectedSeats.includes(seatNumStr)) {
            currentlySelectedSeats = currentlySelectedSeats.filter(s => s !== seatNumStr);
            seatBtn.classList.remove('selected');
            seatBtn.classList.add('available');
          } else {
            currentlySelectedSeats.push(seatNumStr);
            seatBtn.classList.add('selected');
            seatBtn.classList.remove('available');
          }

          document.getElementById('selectedSeatsLabel').innerText = currentlySelectedSeats.length > 0 ? currentlySelectedSeats.join(', ') : 'None';
          const totalFare = currentlySelectedSeats.length * bus.fare;
          document.getElementById('selectedFareLabel').innerText = `₹${totalFare}`;
        });
      }

      matrix.appendChild(seatBtn);
    }

    document.getElementById('seatModal').style.display = 'flex';
  };

  window.closeSeatModal = () => {
    document.getElementById('seatModal').style.display = 'none';
    currentBookingBus = null;
    currentlySelectedSeats = [];
  };

  document.getElementById('confirmSeatBookingBtn').addEventListener('click', () => {
    if (!currentBookingBus || currentlySelectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    const passengerName = document.getElementById('passengerNameInput').value.trim();
    const phone = document.getElementById('passengerPhoneInput').value.trim();

    if (!passengerName || !phone) {
      alert('Please fill out all passenger contact information.');
      return;
    }

    const pnr = 'CE-' + Math.floor(10000 + Math.random() * 90000);
    const dateOfJourney = document.getElementById('journeyDate').value || new Date().toISOString().split('T')[0];
    const totalFare = currentlySelectedSeats.length * currentBookingBus.fare;

    // Save ticket
    db.insert('bus_tickets', {
      pnr,
      busId: currentBookingBus.id,
      busName: currentBookingBus.name,
      category: currentBookingBus.category,
      route: `${currentBookingBus.from} to ${currentBookingBus.to}`,
      date: dateOfJourney,
      time: currentBookingBus.time,
      seats: [...currentlySelectedSeats],
      passengerName,
      phone,
      totalFare,
      status: 'Confirmed'
    });

    // Update booked seats on bus
    const updatedBooked = [...(currentBookingBus.bookedSeats || []), ...currentlySelectedSeats];
    db.update('bus_fleet', currentBookingBus.id, { bookedSeats: updatedBooked });

    alert(`Ticket Confirmed!\nPNR: ${pnr}\nSeats: ${currentlySelectedSeats.join(', ')}\nTotal: ₹${totalFare}\nConfirmation SMS sent to ${phone}.`);
    closeSeatModal();
    renderBusesList();
    renderUserTickets();
  });

  function renderUserTickets() {
    const tbody = document.getElementById('userTicketsTableBody');
    tbody.innerHTML = '';
    const tickets = db.get('bus_tickets');

    tickets.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.pnr}</strong></td>
        <td>${t.route}</td>
        <td>${t.category}</td>
        <td><span class="badge badge-primary">${t.seats.join(', ')}</span></td>
        <td>${t.date} @ ${t.time}</td>
        <td>₹${t.totalFare}</td>
        <td><span class="badge ${t.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${t.status}</span></td>
        <td>
          ${t.status === 'Confirmed' ? `<button class="btn btn-danger btn-sm" onclick="cancelBusTicket('${t.pnr}')">Cancel Ticket</button>` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Cancelled</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.cancelBusTicket = (pnr) => {
    const ticket = db.get('bus_tickets').find(t => t.pnr === pnr);
    if (!ticket) return;

    if (confirm(`Cancel ticket ${pnr}? Seats ${ticket.seats.join(', ')} will be freed.`)) {
      db.update('bus_tickets', ticket.id, { status: 'Cancelled' });

      // Free seats in fleet
      const bus = db.findById('bus_fleet', ticket.busId);
      if (bus && bus.bookedSeats) {
        const remainingBooked = bus.bookedSeats.filter(s => !ticket.seats.includes(s));
        db.update('bus_fleet', bus.id, { bookedSeats: remainingBooked });
      }

      alert('Ticket cancelled successfully. Refund processed to original payment method.');
      renderUserTickets();
      renderBusesList();
    }
  };

  function renderBusComments() {
    const list = document.getElementById('busCommentsList');
    list.innerHTML = '';
    const comments = db.get('bus_comments');

    comments.forEach(c => {
      const div = document.createElement('div');
      div.className = 'card';
      div.style.padding = '0.85rem';
      div.style.marginBottom = '0.5rem';
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>${c.commenter}</strong>
          <span style="color: #f59e0b;">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--primary); margin: 0.2rem 0;">${c.busName}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${c.text}</p>
      `;
      list.appendChild(div);
    });
  }

  function populateCommentBusSelect() {
    const sel = document.getElementById('commentBusSelect');
    sel.innerHTML = '';
    db.get('bus_fleet').forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.name;
      opt.innerText = `${b.name} (${b.category})`;
      sel.appendChild(opt);
    });
  }

  document.getElementById('postCommentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const busName = document.getElementById('commentBusSelect').value;
    const commenter = document.getElementById('commenterName').value.trim();
    const rating = parseInt(document.getElementById('commentRating').value, 10);
    const text = document.getElementById('commentText').value.trim();

    db.insert('bus_comments', { busName, commenter, rating, text });
    alert('Thank you! Your feedback has been published.');
    document.getElementById('commentText').value = '';
    renderBusComments();
  });

  // --- ADMINISTRATOR FUNCTIONS ---
  function renderAdminFleet() {
    const tbody = document.getElementById('adminFleetTableBody');
    tbody.innerHTML = '';
    const fleet = db.get('bus_fleet');

    fleet.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.name}</strong></td>
        <td><span class="badge badge-primary">${b.category}</span></td>
        <td>${b.from} &rarr; ${b.to} (${b.time})</td>
        <td>₹${b.fare}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeAdminBus('${b.id}')">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.removeAdminBus = (busId) => {
    if (confirm('Delete this bus service from fleet?')) {
      db.remove('bus_fleet', busId);
      renderAdminFleet();
    }
  };

  function populateAdminCategorySelect() {
    const sel = document.getElementById('busCategorySelect');
    sel.innerHTML = '';
    db.get('bus_categories').forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.innerText = c.name;
      sel.appendChild(opt);
    });
  }

  document.getElementById('adminBusForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('busServiceName').value.trim();
    const category = document.getElementById('busCategorySelect').value;
    const from = document.getElementById('busFrom').value.trim();
    const to = document.getElementById('busTo').value.trim();
    const time = document.getElementById('busTime').value;
    const fare = parseInt(document.getElementById('busFare').value, 10);
    const capacity = parseInt(document.getElementById('busCapacity').value, 10);

    const newId = 'BUS-' + Math.floor(100 + Math.random() * 900);
    db.insert('bus_fleet', { id: newId, name, category, from, to, time, fare, capacity, bookedSeats: [] });

    alert(`Bus ${name} added successfully!`);
    document.getElementById('adminBusForm').reset();
    renderAdminFleet();
  });

  function renderAdminCategories() {
    const container = document.getElementById('adminCategoriesList');
    container.innerHTML = '';
    const cats = db.get('bus_categories');

    cats.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '0.85rem';
      card.style.marginBottom = '0.5rem';
      card.innerHTML = `
        <h4 style="margin: 0;">${c.name}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">${c.desc}</p>
      `;
      container.appendChild(card);
    });
  }

  document.getElementById('adminCategoryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newCategoryName').value.trim();
    const desc = document.getElementById('newCategoryDesc').value.trim();

    db.insert('bus_categories', { name, desc });
    alert(`Category "${name}" created!`);
    document.getElementById('adminCategoryForm').reset();
    renderAdminCategories();
    populateAdminCategorySelect();
  });

  function renderAdminReports() {
    const tickets = db.get('bus_tickets');
    const fleet = db.get('bus_fleet');

    const confirmed = tickets.filter(t => t.status === 'Confirmed');
    const grossRevenue = confirmed.reduce((acc, t) => acc + (t.totalFare || 0), 0);

    document.getElementById('statTotalBookings').innerText = confirmed.length;
    document.getElementById('statGrossRevenue').innerText = `₹${grossRevenue.toLocaleString()}`;
    document.getElementById('statFleetSize').innerText = fleet.length;

    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';

    tickets.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.pnr}</strong></td>
        <td>${t.passengerName}</td>
        <td>${t.route}</td>
        <td>${t.busName}</td>
        <td>${t.seats.join(', ')}</td>
        <td>₹${t.totalFare}</td>
        <td><span class="badge ${t.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${t.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial runs
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('journeyDate').value = tomorrow.toISOString().split('T')[0];

  renderBusesList();
  renderUserTickets();
  renderBusComments();
  populateCommentBusSelect();
});
