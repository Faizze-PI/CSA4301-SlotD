/**
 * Experiment 07: Beauty Parlour Appointment Booking System
 * Implementation of Stylist Schedules, Lockout Hours, Deposit/Full Payments & Auto-Cancel
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Services Seed
  const defaultServices = [
    { id: 's1', name: 'Bridal Glow Facial & Spa', duration: '60 min', price: 2500, desc: 'Deep hydration, gold collagen mask, and pressure point rejuvenation.' },
    { id: 's2', name: 'Keratin Hair Smoothening', duration: '90 min', price: 4200, desc: 'Frizz-free treatment with argan oil nourishment and styling.' },
    { id: 's3', name: 'Designer Haircut & Blow Dry', duration: '45 min', price: 1200, desc: 'Custom precision cut matched to face structure and texturing.' },
    { id: 's4', name: 'Deluxe Manicure & Pedicure', duration: '60 min', price: 1800, desc: 'Aromatic sea salt scrub, cuticle therapy, and gel polish.' }
  ];

  // Stylists Seed
  const defaultStylists = [
    { id: 'st1', name: 'Aarohi Sen', role: 'Master Hair Specialist', exp: '8 yrs', rating: 4.9 },
    { id: 'st2', name: 'Natasha Fernandez', role: 'Lead Cosmetologist & Skin Therapist', exp: '6 yrs', rating: 4.8 },
    { id: 'st3', name: 'Kavya Raman', role: 'Nail & Bridal Art Director', exp: '5 yrs', rating: 4.9 }
  ];

  // Appointments Seed
  const defaultAppointments = [
    {
      id: 'GL-501',
      clientName: 'Faizze A.',
      serviceId: 's3',
      serviceName: 'Designer Haircut & Blow Dry',
      stylist: 'Aarohi Sen',
      date: '2026-10-12',
      timeSlot: '02:00 PM',
      paymentMode: 'Stripe (Full: ₹1,200)',
      paymentStatus: 'Paid',
      status: 'Confirmed'
    },
    {
      id: 'GL-502',
      clientName: 'Sneha Roy',
      serviceId: 's1',
      serviceName: 'Bridal Glow Facial & Spa',
      stylist: 'Natasha Fernandez',
      date: '2026-10-14',
      timeSlot: '11:30 AM',
      paymentMode: 'PayPal (Deposit: ₹750)',
      paymentStatus: 'Deposit Paid (Balance ₹1,750 at salon)',
      status: 'Confirmed'
    }
  ];

  // Lockouts Seed
  const defaultLockouts = [
    { stylist: 'Aarohi Sen', date: '2026-10-12', slot: '10:00 AM' }
  ];

  // Reviews Seed
  const defaultReviews = [
    { name: 'Meera Iyer', stars: 5, comment: 'Aarohi gave me the best haircut of my life! Wonderful ambiance.' },
    { name: 'Deepa V.', stars: 5, comment: 'The Bridal glow facial was worth every rupee. Super relaxing.' }
  ];

  db.seedIfEmpty('parlour_services', defaultServices);
  db.seedIfEmpty('parlour_stylists', defaultStylists);
  db.seedIfEmpty('parlour_appointments', defaultAppointments);
  db.seedIfEmpty('parlour_lockouts', defaultLockouts);
  db.seedIfEmpty('parlour_reviews', defaultReviews);

  // Role Switcher
  const roleSelect = document.getElementById('parlourRoleSelect');
  const custSection = document.getElementById('parlourCustomerSection');
  const mgrSection = document.getElementById('parlourManagerSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'manager') {
      custSection.style.display = 'none';
      mgrSection.style.display = 'block';
      renderManagerReservations();
      populateLockoutStylists();
      renderManagerServices();
    } else {
      custSection.style.display = 'block';
      mgrSection.style.display = 'none';
      renderServicesAndStylists();
      populateBookingDropdowns();
      renderUserAppointments();
      renderReviews();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#parlourCustomerSection') || btn.closest('#parlourManagerSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- CUSTOMER FUNCTIONS ---
  function renderServicesAndStylists() {
    const sGrid = document.getElementById('servicesGrid');
    sGrid.innerHTML = '';
    db.get('parlour_services').forEach(s => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div>
          <span class="badge badge-primary">${s.duration}</span>
          <h3 style="margin: 0.5rem 0 0.25rem 0;">${s.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${s.desc}</p>
        </div>
        <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">₹${s.price.toLocaleString()}</div>
          <button class="btn btn-primary btn-sm" onclick="pickServiceAndBook('${s.id}')">Book This</button>
        </div>
      `;
      sGrid.appendChild(card);
    });

    const stGrid = document.getElementById('stylistsGrid');
    stGrid.innerHTML = '';
    db.get('parlour_stylists').forEach(st => {
      const card = document.createElement('div');
      card.className = 'stylist-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between;">
            <h3 style="margin: 0;">${st.name}</h3>
            <span style="color: #f59e0b; font-weight: 700;">★ ${st.rating}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--primary); margin: 0.25rem 0;">${st.role}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Experience: ${st.exp}</p>
        </div>
      `;
      stGrid.appendChild(card);
    });
  }

  window.pickServiceAndBook = (serviceId) => {
    document.querySelector('.tab-btn[data-tab="bookingCalendarTab"]').click();
    document.getElementById('bookServiceSelect').value = serviceId;
    updateDepositLabels();
  };

  function populateBookingDropdowns() {
    const sSelect = document.getElementById('bookServiceSelect');
    sSelect.innerHTML = '';
    db.get('parlour_services').forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.innerText = `${s.name} (₹${s.price})`;
      sSelect.appendChild(opt);
    });

    const stSelect = document.getElementById('bookStylistSelect');
    stSelect.innerHTML = '';
    db.get('parlour_stylists').forEach(st => {
      const opt = document.createElement('option');
      opt.value = st.name;
      opt.innerText = `${st.name} (${st.role})`;
      stSelect.appendChild(opt);
    });

    updateDepositLabels();
    renderLockoutPreview();
  }

  function updateDepositLabels() {
    const sId = document.getElementById('bookServiceSelect').value;
    const service = db.findById('parlour_services', sId);
    if (!service) return;

    const fullPrice = service.price;
    const depositPrice = Math.round(fullPrice * 0.3);

    document.getElementById('payFullLabel').innerText = `₹${fullPrice.toLocaleString()}`;
    document.getElementById('payDepositLabel').innerText = `₹${depositPrice.toLocaleString()}`;
  }

  document.getElementById('bookServiceSelect').addEventListener('change', updateDepositLabels);
  document.getElementById('bookDateInput').addEventListener('change', renderLockoutPreview);
  document.getElementById('bookStylistSelect').addEventListener('change', renderLockoutPreview);

  function renderLockoutPreview() {
    const dateVal = document.getElementById('bookDateInput').value;
    const stylistVal = document.getElementById('bookStylistSelect').value;
    const container = document.getElementById('calendarLockoutDisplay');
    container.innerHTML = '';

    const lockouts = db.get('parlour_lockouts').filter(l => l.date === dateVal && (l.stylist === stylistVal || l.stylist === 'ALL'));

    if (lockouts.length === 0) {
      container.innerHTML = `<p style="font-size: 0.85rem; color: var(--success); font-weight: 600;">All daily appointment slots are currently OPEN for ${stylistVal} on this date.</p>`;
      return;
    }

    lockouts.forEach(l => {
      const div = document.createElement('div');
      div.style.padding = '0.5rem';
      div.style.background = '#fee2e2';
      div.style.color = '#991b1b';
      div.style.borderRadius = '4px';
      div.style.fontSize = '0.85rem';
      div.innerHTML = `🔒 <strong>Slot Locked Out:</strong> ${l.slot} is unavailable for ${l.stylist}.`;
      container.appendChild(div);
    });
  }

  document.getElementById('parlourBookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const serviceId = document.getElementById('bookServiceSelect').value;
    const service = db.findById('parlour_services', serviceId);
    const stylist = document.getElementById('bookStylistSelect').value;
    const date = document.getElementById('bookDateInput').value;
    const timeSlot = document.getElementById('bookTimeSlot').value;
    const payChoice = document.querySelector('input[name="payDepositOption"]:checked').value;
    const gateway = document.getElementById('paymentGatewaySelect').value;

    // Check if slot is locked out
    const lockouts = db.get('parlour_lockouts');
    const isLocked = lockouts.some(l => l.date === date && (l.stylist === stylist || l.stylist === 'ALL') && (l.slot === timeSlot || l.slot === 'ALL'));

    if (isLocked) {
      alert(`Slot ${timeSlot} on ${date} is locked out for ${stylist}. Please pick another slot or stylist.`);
      return;
    }

    const bookingId = 'GL-' + Math.floor(100 + Math.random() * 900);
    const depositAmt = Math.round(service.price * 0.3);
    const paymentMode = payChoice === 'full' ? `${gateway} (Full: ₹${service.price})` : `${gateway} (Deposit: ₹${depositAmt})`;
    const paymentStatus = payChoice === 'full' ? 'Paid' : `Deposit Paid (Balance ₹${service.price - depositAmt} due)`;

    db.insert('parlour_appointments', {
      id: bookingId,
      clientName: 'Faizze A.',
      serviceId,
      serviceName: service.name,
      stylist,
      date,
      timeSlot,
      paymentMode,
      paymentStatus,
      status: 'Confirmed'
    });

    alert(`Appointment Confirmed with ${stylist}!\nBooking ID: ${bookingId}\nSchedule: ${date} at ${timeSlot}\nConfirmation email and SMS reminder dispatched.`);
    renderUserAppointments();
    document.querySelector('.tab-btn[data-tab="myAppointmentsTab"]').click();
  });

  function renderUserAppointments() {
    const tbody = document.getElementById('userAppointmentsTableBody');
    tbody.innerHTML = '';
    const list = db.get('parlour_appointments');

    document.getElementById('custUpcomingCount').innerText = list.filter(a => a.status === 'Confirmed').length;

    list.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.id}</strong></td>
        <td>${a.serviceName}</td>
        <td>${a.stylist}</td>
        <td>${a.date} @ ${a.timeSlot}</td>
        <td><small>${a.paymentStatus}</small></td>
        <td><span class="badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
        <td>
          ${a.status === 'Confirmed' ? `
            <button class="btn btn-secondary btn-sm" onclick="rescheduleAppointment('${a.id}')">Reschedule</button>
            <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${a.id}')">Cancel</button>
          ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Cancelled</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.rescheduleAppointment = (id) => {
    const a = db.findById('parlour_appointments', id);
    if (!a) return;
    const newDate = prompt('Enter new Appointment Date (YYYY-MM-DD):', a.date);
    if (newDate) {
      db.update('parlour_appointments', id, { date: newDate });
      alert('Appointment rescheduled successfully!');
      renderUserAppointments();
    }
  };

  window.cancelAppointment = (id) => {
    if (confirm(`Cancel appointment ${id}? Deposit refund will be initiated.`)) {
      db.update('parlour_appointments', id, { status: 'Cancelled' });
      alert('Appointment cancelled.');
      renderUserAppointments();
    }
  };

  function renderReviews() {
    const container = document.getElementById('parlourReviewsList');
    container.innerHTML = '';
    db.get('parlour_reviews').forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '0.75rem';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <strong>${r.name}</strong>
          <span style="color: #f59e0b;">${'★'.repeat(r.stars)}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">${r.comment}</p>
      `;
      container.appendChild(card);
    });
  }

  document.getElementById('parlourReviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('revName').value.trim();
    const stars = parseInt(document.getElementById('revStars').value, 10);
    const comment = document.getElementById('revComment').value.trim();

    db.insert('parlour_reviews', { name, stars, comment });
    alert('Thank you for your rating and feedback!');
    document.getElementById('revComment').value = '';
    renderReviews();
  });

  // --- MANAGER FUNCTIONS ---
  function renderManagerReservations() {
    const tbody = document.getElementById('managerReservationsTableBody');
    tbody.innerHTML = '';
    db.get('parlour_appointments').forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.id}</strong></td>
        <td>${a.clientName}</td>
        <td>${a.serviceName}</td>
        <td>${a.stylist}</td>
        <td>${a.date} (${a.timeSlot})</td>
        <td><small>${a.paymentMode}</small></td>
        <td><span class="badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="sendClientSms('${a.id}')">📲 Send SMS</button>
          <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${a.id}')">Cancel</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.sendClientSms = (id) => {
    const a = db.findById('parlour_appointments', id);
    if (!a) return;
    alert(`SMS Sent to Client:\n"Hi ${a.clientName}, your appointment for ${a.serviceName} with ${a.stylist} is confirmed on ${a.date} at ${a.timeSlot} at GlamourLuxe Salon."`);
  };

  window.cancelUnpaidReservations = () => {
    const list = db.get('parlour_appointments');
    let count = 0;
    list.forEach(a => {
      if (a.paymentStatus === 'Unpaid' && a.status === 'Confirmed') {
        db.update('parlour_appointments', a.id, { status: 'Auto-Cancelled (Unpaid)' });
        count++;
      }
    });
    alert(`Automated cleanup run: ${count} unpaid reservations cancelled.`);
    renderManagerReservations();
  };

  function populateLockoutStylists() {
    const sel = document.getElementById('lockoutStylist');
    sel.innerHTML = '<option value="ALL">All Stylists (Salon Closed)</option>';
    db.get('parlour_stylists').forEach(st => {
      const opt = document.createElement('option');
      opt.value = st.name;
      opt.innerText = st.name;
      sel.appendChild(opt);
    });
  }

  document.getElementById('lockoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const stylist = document.getElementById('lockoutStylist').value;
    const date = document.getElementById('lockoutDate').value;
    const slot = document.getElementById('lockoutSlot').value;

    db.insert('parlour_lockouts', { stylist, date, slot });
    alert(`Locked out ${slot} on ${date} for ${stylist}!`);
    document.getElementById('lockoutForm').reset();
  });

  function renderManagerServices() {
    const tbody = document.getElementById('managerServicesTableBody');
    tbody.innerHTML = '';
    db.get('parlour_services').forEach(s => {
      const deposit = Math.round(s.price * 0.3);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${s.name}</strong></td>
        <td>${s.duration}</td>
        <td>₹${s.price.toLocaleString()}</td>
        <td>₹${deposit.toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial runs
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 2);
  document.getElementById('bookDateInput').value = nextDay.toISOString().split('T')[0];
  document.getElementById('lockoutDate').value = nextDay.toISOString().split('T')[0];

  renderServicesAndStylists();
  populateBookingDropdowns();
  renderUserAppointments();
  renderReviews();
});
