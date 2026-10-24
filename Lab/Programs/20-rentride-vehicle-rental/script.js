// RentRide Vehicle Rental Script

const DEFAULT_FLEET = [
  {
    id: 'VEH-01',
    model: 'Mahindra XUV700 AX7 Luxury',
    category: 'SUV',
    dailyRate: 3400,
    regNo: 'TN 09 BX 9102',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 7,
    hub: 'Chennai Airport Hub (MAA)',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500',
    available: true
  },
  {
    id: 'VEH-02',
    model: 'Toyota Innova Crysta ZX',
    category: 'SUV',
    dailyRate: 3600,
    regNo: 'TN 07 CA 4482',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: 7,
    hub: 'OMR - IT Expressway Hub',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500',
    available: true
  },
  {
    id: 'VEH-03',
    model: 'Honda City ZX i-VTEC',
    category: 'Sedan',
    dailyRate: 2400,
    regNo: 'TN 02 AX 1109',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    hub: 'Koyambedu Central Hub',
    image: 'https://images.unsplash.com/photo-1541348263662-e0c82661cb25?w=500',
    available: true
  },
  {
    id: 'VEH-04',
    model: 'Hyundai i20 Asta Turbo',
    category: 'Hatchback',
    dailyRate: 1600,
    regNo: 'TN 10 CZ 8821',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: 5,
    hub: 'Tambaram Bypass Hub',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500',
    available: true
  },
  {
    id: 'VEH-05',
    model: 'Tata Nexon EV Max',
    category: 'SUV',
    dailyRate: 2200,
    regNo: 'TN 22 EV 1029',
    transmission: 'Automatic',
    fuel: 'Electric (EV)',
    seats: 5,
    hub: 'Chennai Airport Hub (MAA)',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500',
    available: true
  },
  {
    id: 'VEH-06',
    model: 'Mahindra Bolero Camper Pickup',
    category: 'Truck',
    dailyRate: 2100,
    regNo: 'TN 19 TR 5501',
    transmission: 'Manual',
    fuel: 'Diesel',
    seats: 5,
    hub: 'Tambaram Bypass Hub',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500',
    available: true
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: 'RR-BK-1049',
    vehicleId: 'VEH-02',
    vehicleModel: 'Toyota Innova Crysta ZX',
    customerName: 'Deepak Narayanan',
    customerPhone: '+91 98409 33210',
    pickupDate: '2026-10-08',
    returnDate: '2026-10-10',
    days: 2,
    dailyRate: 3600,
    deposit: 3000,
    totalFare: 10200,
    status: 'Approved',
    checkedIn: false,
    keyCode: null
  },
  {
    id: 'RR-BK-1035',
    vehicleId: 'VEH-03',
    vehicleModel: 'Honda City ZX i-VTEC',
    customerName: 'Deepak Narayanan',
    customerPhone: '+91 98409 33210',
    pickupDate: '2026-09-28',
    returnDate: '2026-09-30',
    days: 2,
    dailyRate: 2400,
    deposit: 3000,
    totalFare: 7800,
    status: 'Completed',
    checkedIn: true,
    keyCode: 'KEY-CITY-8910'
  }
];

const DEFAULT_REVIEWS = [
  {
    vehicleModel: 'Toyota Innova Crysta ZX',
    rating: 5,
    comment: 'Immaculate condition for our family trip to Kodaikanal. Automatic cruise control performed flawlessly.',
    author: 'Deepak Narayanan',
    date: '2026-10-01'
  }
];

// App State
let currentRole = 'customer';
let currentCustomerTab = 'browse';
let currentAdminTab = 'reservations';
let activeCategory = 'All';
let selectedBookingVehicle = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  setDefaultDates();
  renderFleet();
  renderCustomerBookings();
  populateCheckInSelect();
  populateReviewVehicleSelect();
  renderAdminBookings();
  renderAdminFleet();
  updateAdminMetrics();
});

function initStorage() {
  if (!labDB.get('rent_fleet')) labDB.set('rent_fleet', DEFAULT_FLEET);
  if (!labDB.get('rent_bookings')) labDB.set('rent_bookings', DEFAULT_BOOKINGS);
  if (!labDB.get('rent_reviews')) labDB.set('rent_reviews', DEFAULT_REVIEWS);
}

function setDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 3);

  const pickupInput = document.getElementById('searchPickupDate');
  const returnInput = document.getElementById('searchReturnDate');
  if (pickupInput) pickupInput.value = tomorrow.toISOString().split('T')[0];
  if (returnInput) returnInput.value = dayAfter.toISOString().split('T')[0];
}

// Role Switcher
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('customerSection').classList.toggle('hidden', role !== 'customer');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'customer') {
    renderFleet();
    renderCustomerBookings();
    populateCheckInSelect();
  } else {
    renderAdminBookings();
    renderAdminFleet();
    updateAdminMetrics();
  }
}

// Customer Tabs
function switchCustomerTab(tab) {
  currentCustomerTab = tab;
  const tabIds = ['browse', 'bookings', 'checkin', 'reviews'];
  tabIds.forEach(t => {
    const pane = document.getElementById('custTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#customerSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'bookings') renderCustomerBookings();
  if (tab === 'checkin') populateCheckInSelect();
}

// Admin Tabs
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['reservations', 'fleet', 'addVehicle'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'reservations') renderAdminBookings();
  if (tab === 'fleet') renderAdminFleet();
}

// Fleet Filtering
function selectFleetCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderFleet();
}

function filterFleet() {
  renderFleet();
}

function renderFleet() {
  const container = document.getElementById('fleetCardsGrid');
  const hubFilter = document.getElementById('searchLocation').value;
  const fleet = labDB.get('rent_fleet') || [];

  const filtered = fleet.filter(v => {
    const matchCat = activeCategory === 'All' || v.category === activeCategory;
    const matchHub = hubFilter === 'All' || v.hub === hubFilter;
    return matchCat && matchHub;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-box col-span-3"><p class="muted">No rental vehicles available for the selected filters.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(v => `
    <div class="vehicle-card">
      <div class="vehicle-img-wrapper">
        <img src="${v.image}" alt="${v.model}" onerror="this.src='https://placehold.co/400x250/1e293b/white?text=RentRide'">
        <span class="vehicle-tag">${v.category}</span>
      </div>

      <div class="vehicle-card-body">
        <div class="vehicle-title">${v.model}</div>
        <div class="muted text-xs font-mono mb-2">${v.regNo} | ${v.hub}</div>

        <div class="vehicle-meta-specs">
          <span class="spec-badge">⚙️ ${v.transmission}</span>
          <span class="spec-badge">⛽ ${v.fuel}</span>
          <span class="spec-badge">💺 ${v.seats} Seats</span>
        </div>

        <div class="vehicle-pricing-row">
          <div>
            <div class="daily-price">₹${v.dailyRate} <span>/ day</span></div>
            <div class="text-xs muted">${v.available ? '🟢 Ready for Booking' : '🔴 Currently Rented'}</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openBookingModal('${v.id}')" ${!v.available ? 'disabled' : ''}>
            Book Vehicle
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Booking Modal
function openBookingModal(vehId) {
  const fleet = labDB.get('rent_fleet') || [];
  const v = fleet.find(item => item.id === vehId);
  if (!v) return;

  selectedBookingVehicle = v;
  document.getElementById('bookVehId').value = v.id;
  document.getElementById('bookVehNameDisplay').value = `${v.model} (${v.regNo}) - ₹${v.dailyRate}/day`;

  // Set default dates from search filter or tomorrow
  const pickup = document.getElementById('searchPickupDate').value || new Date().toISOString().split('T')[0];
  const retDate = document.getElementById('searchReturnDate').value || new Date().toISOString().split('T')[0];
  document.getElementById('bookStartDate').value = pickup;
  document.getElementById('bookEndDate').value = retDate;

  calculateRentalFare();
  document.getElementById('bookingModal').classList.remove('hidden');
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.add('hidden');
}

function calculateRentalFare() {
  if (!selectedBookingVehicle) return;

  const startVal = document.getElementById('bookStartDate').value;
  const endVal = document.getElementById('bookEndDate').value;

  if (!startVal || !endVal) return;

  const d1 = new Date(startVal);
  const d2 = new Date(endVal);
  const diffTime = d2 - d1;
  let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (days <= 0) days = 1;

  const rate = selectedBookingVehicle.dailyRate;
  const deposit = 3000;
  const total = (days * rate) + deposit;

  document.getElementById('bookDaysText').textContent = `${days} Day${days > 1 ? 's' : ''}`;
  document.getElementById('bookDailyRateText').textContent = `₹${rate.toFixed(2)}`;
  document.getElementById('bookTotalFareText').textContent = `₹${total.toFixed(2)}`;

  return { days, rate, deposit, total };
}

function handleConfirmBooking(e) {
  e.preventDefault();
  if (!selectedBookingVehicle) return;

  const calc = calculateRentalFare();
  const startVal = document.getElementById('bookStartDate').value;
  const endVal = document.getElementById('bookEndDate').value;
  const custName = document.getElementById('bookCustName').value.trim();
  const custPhone = document.getElementById('bookCustPhone').value.trim();

  const bookingId = `RR-BK-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    id: bookingId,
    vehicleId: selectedBookingVehicle.id,
    vehicleModel: selectedBookingVehicle.model,
    customerName: custName,
    customerPhone: custPhone,
    pickupDate: startVal,
    returnDate: endVal,
    days: calc.days,
    dailyRate: calc.rate,
    deposit: calc.deposit,
    totalFare: calc.total,
    status: 'Pending Approval',
    checkedIn: false,
    keyCode: null
  };

  const bookings = labDB.get('rent_bookings') || [];
  bookings.unshift(newBooking);
  labDB.set('rent_bookings', bookings);

  closeBookingModal();
  renderCustomerBookings();
  populateCheckInSelect();
  renderAdminBookings();
  updateAdminMetrics();

  showAlert(`Reservation ${bookingId} submitted! Waiting for Fleet Manager approval.`, 'info');
  switchCustomerTab('bookings');
}

// Render Customer Bookings
function renderCustomerBookings() {
  const container = document.getElementById('customerBookingsList');
  const bookings = labDB.get('rent_bookings') || [];

  if (bookings.length === 0) {
    container.innerHTML = `<p class="muted">No vehicle reservations found.</p>`;
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div class="booking-card">
      <div class="card-header-flex">
        <div>
          <span class="badge ${b.status === 'Approved' ? 'badge-success' : b.status === 'Pending Approval' ? 'badge-warning' : 'badge-neutral'}">${b.status}</span>
          ${b.checkedIn ? '<span class="badge badge-info ml-1">✓ Digital Check-In Done</span>' : ''}
          <h4 style="margin: 0.5rem 0 0.2rem 0;">${b.vehicleModel}</h4>
          <span class="font-mono text-xs muted">Reservation ID: ${b.id}</span>
        </div>
        <div class="text-right">
          <strong style="color: #60a5fa; font-size: 1.25rem;">₹${b.totalFare.toFixed(2)}</strong>
          <div class="muted text-xs">${b.days} Days (${b.pickupDate} to ${b.returnDate})</div>
        </div>
      </div>

      <div style="font-size: 0.85rem; margin-top: 0.75rem;" class="muted">
        <div>Customer: <strong>${b.customerName}</strong> (${b.customerPhone})</div>
        <div>Fare breakdown: ₹${b.dailyRate}/day × ${b.days} days + ₹${b.deposit} refundable deposit</div>
      </div>

      ${b.keyCode ? `
        <div class="alert-banner alert-success text-xs mt-3" style="padding: 0.6rem;">
          🔑 <strong>Smart Keybox Passcode:</strong> <span class="font-mono font-bold" style="letter-spacing: 0.1em;">${b.keyCode}</span> (Present at Hub Gate)
        </div>
      ` : ''}

      ${b.status === 'Approved' && !b.checkedIn ? `
        <div class="mt-3 text-right">
          <button class="btn btn-primary btn-sm" onclick="switchCustomerTab('checkin')">
            📋 Proceed to Digital Check-In
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Check-In Handling
function populateCheckInSelect() {
  const select = document.getElementById('checkInBookingSelect');
  if (!select) return;
  const bookings = labDB.get('rent_bookings') || [];
  const approved = bookings.filter(b => b.status === 'Approved' && !b.checkedIn);

  if (approved.length === 0) {
    select.innerHTML = `<option value="">No approved bookings pending check-in</option>`;
  } else {
    select.innerHTML = approved.map(b => `
      <option value="${b.id}">${b.id}: ${b.vehicleModel} (${b.pickupDate} to ${b.returnDate})</option>
    `).join('');
  }
}

function handleCustomerCheckIn(e) {
  e.preventDefault();
  const bookingId = document.getElementById('checkInBookingSelect').value;
  if (!bookingId) {
    showAlert('Please select an approved booking to check in.', 'danger');
    return;
  }

  const bookings = labDB.get('rent_bookings') || [];
  const idx = bookings.findIndex(b => b.id === bookingId);

  if (idx !== -1) {
    const keyCode = `KEY-${Math.floor(1000 + Math.random() * 9000)}`;
    bookings[idx].checkedIn = true;
    bookings[idx].keyCode = keyCode;
    labDB.set('rent_bookings', bookings);

    populateCheckInSelect();
    renderCustomerBookings();
    showAlert(`Digital check-in completed! Vehicle Key Code: ${keyCode}`, 'success');
    switchCustomerTab('bookings');
  }
}

// Reviews
function populateReviewVehicleSelect() {
  const select = document.getElementById('reviewVehicleSelect');
  if (!select) return;
  const fleet = labDB.get('rent_fleet') || [];

  select.innerHTML = fleet.map(v => `
    <option value="${v.model}">${v.model} (${v.category})</option>
  `).join('');
}

function handleCustomerSubmitReview(e) {
  e.preventDefault();
  const model = document.getElementById('reviewVehicleSelect').value;
  const rating = parseInt(document.getElementById('reviewRatingSelect').value);
  const comment = document.getElementById('reviewCommentInput').value.trim();

  const reviews = labDB.get('rent_reviews') || [];
  reviews.unshift({
    vehicleModel: model,
    rating,
    comment,
    author: 'Deepak Narayanan',
    date: new Date().toISOString().split('T')[0]
  });
  labDB.set('rent_reviews', reviews);

  document.getElementById('reviewCommentInput').value = '';
  showAlert(`Review published for ${model}!`, 'success');
}

// Admin Operations
function renderAdminBookings() {
  const tbody = document.getElementById('adminBookingsTable');
  const bookings = labDB.get('rent_bookings') || [];

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td class="font-mono font-bold">${b.id}</td>
      <td>
        <div><strong>${b.customerName}</strong></div>
        <div class="muted text-xs">${b.customerPhone}</div>
      </td>
      <td>${b.vehicleModel}</td>
      <td class="text-xs">${b.pickupDate} to ${b.returnDate} (${b.days}d)</td>
      <td class="font-bold">₹${b.totalFare.toFixed(2)}</td>
      <td><span class="badge ${b.status === 'Approved' ? 'badge-success' : b.status === 'Pending Approval' ? 'badge-warning' : 'badge-neutral'}">${b.status}</span></td>
      <td>
        ${b.status === 'Pending Approval' ? `
          <button class="btn btn-success btn-sm mr-1" onclick="adminApproveBooking('${b.id}', true)">Approve</button>
          <button class="btn btn-danger btn-sm" onclick="adminApproveBooking('${b.id}', false)">Reject</button>
        ` : `
          <span class="text-xs muted">Processed</span>
        `}
      </td>
    </tr>
  `).join('');
}

function adminApproveBooking(bookingId, isApproved) {
  const bookings = labDB.get('rent_bookings') || [];
  const idx = bookings.findIndex(b => b.id === bookingId);

  if (idx !== -1) {
    bookings[idx].status = isApproved ? 'Approved' : 'Rejected';
    labDB.set('rent_bookings', bookings);

    renderAdminBookings();
    renderCustomerBookings();
    populateCheckInSelect();
    updateAdminMetrics();
    showAlert(`Booking ${bookingId} ${isApproved ? 'Approved' : 'Rejected'}.`, isApproved ? 'success' : 'danger');
  }
}

function renderAdminFleet() {
  const tbody = document.getElementById('adminFleetTable');
  const fleet = labDB.get('rent_fleet') || [];

  tbody.innerHTML = fleet.map(v => `
    <tr>
      <td><strong>${v.model}</strong></td>
      <td class="font-mono uppercase">${v.regNo}</td>
      <td>${v.category}</td>
      <td class="font-bold">₹${v.dailyRate}</td>
      <td class="text-xs">${v.transmission} / ${v.fuel}</td>
      <td><span class="badge ${v.available ? 'badge-success' : 'badge-danger'}">${v.available ? 'Available' : 'Rented'}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="adminToggleFleetAvailability('${v.id}')">
          ${v.available ? 'Mark Rented' : 'Mark Available'}
        </button>
      </td>
    </tr>
  `).join('');
}

function adminToggleFleetAvailability(vehId) {
  const fleet = labDB.get('rent_fleet') || [];
  const v = fleet.find(item => item.id === vehId);
  if (v) {
    v.available = !v.available;
    labDB.set('rent_fleet', fleet);
    renderAdminFleet();
    renderFleet();
    showAlert(`Availability toggled for ${v.model}.`, 'info');
  }
}

function handleAdminAddVehicle(e) {
  e.preventDefault();
  const model = document.getElementById('newVehModel').value.trim();
  const category = document.getElementById('newVehCategory').value;
  const regNo = document.getElementById('newVehReg').value.trim().toUpperCase();
  const dailyRate = parseFloat(document.getElementById('newVehPrice').value);
  const fuel = document.getElementById('newVehFuel').value;
  const transmission = document.getElementById('newVehTransmission').value;
  const hub = document.getElementById('newVehLocation').value;
  const photo = document.getElementById('newVehPhoto').value.trim();

  const fleet = labDB.get('rent_fleet') || [];
  const newVeh = {
    id: `VEH-${fleet.length + 1 < 10 ? '0' : ''}${fleet.length + 1}`,
    model,
    category,
    dailyRate,
    regNo,
    transmission,
    fuel,
    seats: category === 'SUV' ? 7 : 5,
    hub,
    image: photo || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500',
    available: true
  };

  fleet.push(newVeh);
  labDB.set('rent_fleet', fleet);

  document.getElementById('addVehicleForm').reset();
  renderAdminFleet();
  renderFleet();
  populateReviewVehicleSelect();
  updateAdminMetrics();
  showAlert(`"${model}" added to rental fleet registry!`, 'success');
  switchAdminTab('fleet');
}

function updateAdminMetrics() {
  const fleet = labDB.get('rent_fleet') || [];
  const bookings = labDB.get('rent_bookings') || [];

  document.getElementById('adminTotalVehicles').textContent = fleet.length;
  document.getElementById('adminActiveBookings').textContent = bookings.filter(b => b.status === 'Approved').length;
  const revenue = bookings.filter(b => b.status === 'Approved' || b.status === 'Completed').reduce((acc, b) => acc + (b.totalFare || 0), 0);
  document.getElementById('adminRentalRevenue').textContent = `₹${revenue.toLocaleString('en-IN')}`;
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
