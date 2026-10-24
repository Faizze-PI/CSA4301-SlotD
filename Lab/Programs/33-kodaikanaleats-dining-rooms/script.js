/**
 * KodaikanalEats Dining & Room Stays Management Platform
 * Experiment 33 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  RESTAURANTS: 'kodai_restaurants_v1',
  SUITES: 'kodai_suites_v1',
  ATTENDANTS: 'kodai_attendants_v1',
  BOOKINGS: 'kodai_bookings_v1',
  IS_PEAK_SEASON: 'kodai_is_peak_season_v1'
};

const DEFAULT_RESTAURANTS = [
  { id: 'REST-01', name: 'The Carlton Silver Oak Dining', cuisine: 'South Indian & Chettinad', area: 'Lake Road', rating: 4.8, price: '₹₹₹', desc: 'Colonial heritage fine dining overlooking Kodaikanal Lake with live piano music.' },
  { id: 'REST-02', name: 'Altaf’s Cafe & Pastry Den', cuisine: 'Continental & Bakeries', area: 'Coaker’s Walk', rating: 4.7, price: '₹₹', desc: 'Perched on cliff edge with panoramic valley views, serving authentic wood-fired pizzas and fresh cinnamon buns.' },
  { id: 'REST-03', name: 'Tibetan Brothers Authentic Kitchen', cuisine: 'Tibetan & Himalayan', area: 'Lake Road', rating: 4.6, price: '₹', desc: 'Traditional steamed vegetable momos, hot thukpa noodle soups, and herbal hill honey teas.' },
  { id: 'REST-04', name: 'Cloud Street Bistro & Artisan Bakery', cuisine: 'Continental & Bakeries', area: 'Upper Shola', rating: 4.9, price: '₹₹₹', desc: 'Cozy fireplace seating, wood-fired pastas, hot chocolate, and famous lemon curd pies.' }
];

const DEFAULT_SUITES = [
  { id: 'SUITE-01', name: 'Single Valley Cozy Room', tier: 'Single Room', basePrice: 2200, capacity: '1 Guest', amenities: ['Valley View', 'King Bed', 'Room Heater', 'Free Wi-Fi', 'Daily Morning Tea'] },
  { id: 'SUITE-02', name: 'Double Lakeview Heritage Room', tier: 'Double Room', basePrice: 3800, capacity: '2-3 Guests', amenities: ['Lake Promenade View', 'Double Beds', 'Fireplace', 'Mini Bar', 'Breakfast Included'] },
  { id: 'SUITE-03', name: 'Deluxe Mountain-View Shola Suite', tier: 'Deluxe Room', basePrice: 6500, capacity: '4 Guests', amenities: ['360° Misty Shola View', 'Private Jacuzzi', 'Living Lounge', 'Fireplace', 'Dedicated Room Attendant'] }
];

const DEFAULT_ATTENDANTS = [
  { id: 'STAFF-01', name: 'Murugesan K.', tier: 'Deluxe Mountain-View Suite', status: 'Available' },
  { id: 'STAFF-02', name: 'David Anthony', tier: 'Double Lakeview Room', status: 'Available' },
  { id: 'STAFF-03', name: 'Anand Kumar', tier: 'Single Valley Room', status: 'On Duty' }
];

const DEFAULT_BOOKINGS = [
  { id: 'VCHR-KD-9011', type: 'Table Reservation', name: 'Siddharth Menon', details: 'The Carlton Silver Oak • Dinner (2 Guests)', staff: 'Captain Ravi', amount: 0, date: '2026-10-12' },
  { id: 'VCHR-KD-9012', type: 'Suite Stay', name: 'Meera Nambiar', details: 'Deluxe Mountain-View Suite (2 Nights)', staff: 'Murugesan K. (Attendant)', amount: 13000, date: '2026-10-14' }
];

let appState = {
  currentRole: 'tourist',
  activeTouristTab: 'dining',
  restaurants: [],
  suites: [],
  attendants: [],
  bookings: [],
  isPeakSeason: false
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedRest = labDB.get(STORAGE_KEYS.RESTAURANTS);
  if (!storedRest || storedRest.length === 0) {
    labDB.set(STORAGE_KEYS.RESTAURANTS, DEFAULT_RESTAURANTS);
    appState.restaurants = [...DEFAULT_RESTAURANTS];
  } else {
    appState.restaurants = storedRest;
  }

  const storedSuites = labDB.get(STORAGE_KEYS.SUITES);
  if (!storedSuites || storedSuites.length === 0) {
    labDB.set(STORAGE_KEYS.SUITES, DEFAULT_SUITES);
    appState.suites = [...DEFAULT_SUITES];
  } else {
    appState.suites = storedSuites;
  }

  const storedStaff = labDB.get(STORAGE_KEYS.ATTENDANTS);
  if (!storedStaff || storedStaff.length === 0) {
    labDB.set(STORAGE_KEYS.ATTENDANTS, DEFAULT_ATTENDANTS);
    appState.attendants = [...DEFAULT_ATTENDANTS];
  } else {
    appState.attendants = storedStaff;
  }

  const storedBookings = labDB.get(STORAGE_KEYS.BOOKINGS);
  if (!storedBookings || storedBookings.length === 0) {
    labDB.set(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    appState.bookings = [...DEFAULT_BOOKINGS];
  } else {
    appState.bookings = storedBookings;
  }

  appState.isPeakSeason = !!labDB.get(STORAGE_KEYS.IS_PEAK_SEASON);
}

function renderApp() {
  renderRestaurantsGrid();
  renderSuitesGrid();
  renderGuestBookings();
  renderAdminStaff();
  renderAdminBookings();
  updateSeasonBanner();
  updateAdminMetrics();
}

function updateSeasonBanner() {
  const badge = document.getElementById('seasonDisplayBadge');
  const btn = document.getElementById('btnToggleSeason');

  if (appState.isPeakSeason) {
    if (badge) {
      badge.className = 'badge badge-warning mb-2';
      badge.innerText = '🔥 Peak Flower Season Active (+40% Surge Tariff)';
    }
    if (btn) {
      btn.innerText = 'Switch to Off-Season Tariff (Normal)';
      btn.className = 'btn btn-secondary btn-sm';
    }
  } else {
    if (badge) {
      badge.className = 'badge badge-success mb-2';
      badge.innerText = '🌸 Non-Seasonal Regular Tariff Active';
    }
    if (btn) {
      btn.innerText = 'Toggle Peak Season Surge (+40%)';
      btn.className = 'btn btn-warning btn-sm';
    }
  }
}

function toggleSeasonalTariff() {
  appState.isPeakSeason = !appState.isPeakSeason;
  labDB.set(STORAGE_KEYS.IS_PEAK_SEASON, appState.isPeakSeason);

  showAlert(`Tariff updated: ${appState.isPeakSeason ? 'Peak Season (+40% surge applied)' : 'Standard Off-Season rate restored'}.`, 'info');
  updateSeasonBanner();
  renderSuitesGrid();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('touristSection').classList.toggle('hidden', role !== 'tourist');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminStaff();
    renderAdminBookings();
    updateAdminMetrics();
  }
}

// Tourist Tabs
function switchTouristTab(tabName) {
  appState.activeTouristTab = tabName;
  const tabs = {
    dining: 'touristTabDining',
    suites: 'touristTabSuites',
    myBookings: 'touristTabBookings'
  };

  document.querySelectorAll('#touristSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

// Restaurants
function filterRestaurants() {
  const cuisine = document.getElementById('cuisineFilterSelect').value;
  const area = document.getElementById('locationFilterSelect').value;
  renderRestaurantsGrid(cuisine, area);
}

function renderRestaurantsGrid(cuisineFilter = 'All', areaFilter = 'All') {
  const grid = document.getElementById('restaurantsGrid');
  if (!grid) return;

  let list = appState.restaurants;
  if (cuisineFilter !== 'All') {
    list = list.filter(r => r.cuisine === cuisineFilter);
  }
  if (areaFilter !== 'All') {
    list = list.filter(r => r.area === areaFilter);
  }

  grid.innerHTML = list.map(r => `
    <div class="restaurant-card">
      <div>
        <div class="restaurant-thumb">
          <span>🍽️</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h4>${r.name}</h4>
          <span class="badge badge-success text-xs">⭐ ${r.rating}</span>
        </div>
        <p class="text-xs muted mt-1">📍 ${r.area} | Cuisine: <strong>${r.cuisine}</strong> (${r.price})</p>
        <p class="text-xs muted my-2">${r.desc}</p>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 1rem;">
        <button class="btn btn-primary btn-sm btn-block" onclick="openTableModal('${r.id}')">
          🪑 Reserve Dining Table
        </button>
      </div>
    </div>
  `).join('');
}

function openTableModal(restId) {
  const r = appState.restaurants.find(x => x.id === restId);
  if (!r) return;

  document.getElementById('bookRestId').value = r.id;
  document.getElementById('bookRestNameDisplay').value = `${r.name} (${r.area})`;
  document.getElementById('tableBookingModal').classList.remove('hidden');
}

function closeTableModal() {
  document.getElementById('tableBookingModal').classList.add('hidden');
}

function handleConfirmTableBooking(event) {
  event.preventDefault();
  const restId = document.getElementById('bookRestId').value;
  const r = appState.restaurants.find(x => x.id === restId);
  if (!r) return;

  const guest = document.getElementById('bookGuestName').value.trim();
  const phone = document.getElementById('bookGuestPhone').value.trim();
  const date = document.getElementById('bookDiningDate').value;
  const slot = document.getElementById('bookDiningSlot').value;
  const count = document.getElementById('bookGuestCount').value;
  const seating = document.getElementById('bookSeatingPref').value;

  const voucher = {
    id: 'VCHR-TBL-' + Math.floor(1000 + Math.random() * 9000),
    type: 'Table Reservation',
    name: guest,
    phone,
    details: `${r.name} • ${slot} (${count} Guests, ${seating})`,
    staff: 'Captain Attendant Allocated',
    amount: 0,
    date
  };

  appState.bookings.unshift(voucher);
  labDB.set(STORAGE_KEYS.BOOKINGS, appState.bookings);

  closeTableModal();
  showAlert(`🎉 Table Reserved! Voucher ${voucher.id} generated for ${guest} at ${r.name}.`, 'success');

  renderGuestBookings();
  switchTouristTab('myBookings');
  renderAdminBookings();
  updateAdminMetrics();
}

// Suites & Stays
function renderSuitesGrid() {
  const grid = document.getElementById('suitesGrid');
  if (!grid) return;

  grid.innerHTML = appState.suites.map(s => {
    const rate = appState.isPeakSeason ? Math.round(s.basePrice * 1.4) : s.basePrice;

    return `
      <div class="suite-card">
        <div>
          <div style="font-size: 3rem; background: rgba(255,255,255,0.03); height: 120px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <span>🏨</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4>${s.name}</h4>
            <span class="badge badge-primary text-xs">${s.capacity}</span>
          </div>

          <div class="amenities-tag-list">
            ${s.amenities.map(a => `<span class="amenity-chip">${a}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 1rem;">
          <div>
            <span class="text-xs muted block">${appState.isPeakSeason ? 'Peak Season Rate' : 'Regular Off-Season Rate'}</span>
            <span class="font-bold text-success font-mono" style="font-size: 1.3rem;">₹${rate.toLocaleString()}/nt</span>
          </div>
          <button class="btn btn-success btn-sm" onclick="openSuiteModal('${s.id}')">
            Book Stay
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openSuiteModal(suiteId) {
  const s = appState.suites.find(x => x.id === suiteId);
  if (!s) return;

  document.getElementById('bookSuiteId').value = s.id;
  document.getElementById('bookSuiteNameDisplay').value = `${s.name} (${s.tier})`;

  // Populate attendants
  const attendantSelect = document.getElementById('suiteAttendantSelect');
  if (attendantSelect) {
    attendantSelect.innerHTML = appState.attendants.map(staff => `
      <option value="${staff.name}">${staff.name} (${staff.tier}) - ${staff.status}</option>
    `).join('');
  }

  calculateSuiteStayTariff();
  document.getElementById('suiteBookingModal').classList.remove('hidden');
}

function closeSuiteModal() {
  document.getElementById('suiteBookingModal').classList.add('hidden');
}

function calculateSuiteStayTariff() {
  const suiteId = document.getElementById('bookSuiteId')?.value;
  const s = appState.suites.find(x => x.id === suiteId);
  if (!s) return;

  const nights = parseInt(document.getElementById('suiteNights')?.value, 10) || 2;
  const baseRate = s.basePrice;
  const multiplier = appState.isPeakSeason ? 1.4 : 1.0;
  const nightlyEffective = Math.round(baseRate * multiplier);
  const total = nightlyEffective * nights;

  document.getElementById('suiteNightlyRateDisplay').innerText = `₹${nightlyEffective.toLocaleString()}.00 / Night`;
  document.getElementById('suiteSeasonMultiplierDisplay').innerText = appState.isPeakSeason ? 'Peak Season (+40% Surge)' : 'Regular Standard (1.0x)';
  document.getElementById('suiteTotalAmountDisplay').innerText = `₹${total.toLocaleString()}.00`;
}

function handleConfirmSuiteBooking(event) {
  event.preventDefault();
  const suiteId = document.getElementById('bookSuiteId').value;
  const s = appState.suites.find(x => x.id === suiteId);
  if (!s) return;

  const guest = document.getElementById('suiteGuestName').value.trim();
  const phone = document.getElementById('suiteGuestPhone').value.trim();
  const date = document.getElementById('suiteCheckInDate').value;
  const nights = parseInt(document.getElementById('suiteNights').value, 10);
  const attendant = document.getElementById('suiteAttendantSelect').value;

  const baseRate = s.basePrice;
  const multiplier = appState.isPeakSeason ? 1.4 : 1.0;
  const total = Math.round(baseRate * multiplier) * nights;

  const voucher = {
    id: 'VCHR-RM-' + Math.floor(1000 + Math.random() * 9000),
    type: 'Suite Stay',
    name: guest,
    phone,
    details: `${s.name} (${nights} Nights from ${date})`,
    staff: `${attendant} (Dedicated Attendant)`,
    amount: total,
    date
  };

  appState.bookings.unshift(voucher);
  labDB.set(STORAGE_KEYS.BOOKINGS, appState.bookings);

  closeSuiteModal();
  showAlert(`🎉 Suite Confirmed! Voucher ${voucher.id} issued. Dedicated attendant assigned: ${attendant}`, 'success');

  renderGuestBookings();
  switchTouristTab('myBookings');
  renderAdminBookings();
  updateAdminMetrics();
}

function renderGuestBookings() {
  const container = document.getElementById('guestBookingsList');
  if (!container) return;

  if (appState.bookings.length === 0) {
    container.innerHTML = `<p class="muted">No confirmed dining or suite reservations found.</p>`;
    return;
  }

  container.innerHTML = appState.bookings.map(b => `
    <div class="voucher-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
        <div>
          <span class="badge ${b.type === 'Suite Stay' ? 'badge-primary' : 'badge-success'} text-xs mb-1">${b.type}</span>
          <h4>Voucher Ref: <span class="font-mono text-danger">${b.id}</span></h4>
          <p class="text-sm">Guest: <strong>${b.name}</strong> | <strong>${b.details}</strong></p>
          <p class="text-xs muted">Assigned Attendant: <strong>${b.staff}</strong> | Date: ${b.date}</p>
        </div>
        <div class="text-right">
          ${b.amount > 0 ? `
            <span class="muted text-xs block">TOTAL STAY TARIFF</span>
            <span class="font-mono font-bold text-success" style="font-size: 1.25rem;">₹${b.amount.toLocaleString()}</span>
          ` : `
            <span class="badge badge-success">Table Cover Confirmed</span>
          `}
          <button class="btn btn-outline btn-xs mt-2" onclick="showAlert('Printing official hospitality voucher ${b.id}', 'info')">🖨️ Print Voucher</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Admin Operations
function renderAdminStaff() {
  const tbody = document.getElementById('adminAttendantsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.attendants.map(a => `
    <tr>
      <td class="font-mono font-bold">${a.id}</td>
      <td><strong>${a.name}</strong></td>
      <td class="text-xs">${a.tier}</td>
      <td><span class="badge ${a.status === 'Available' ? 'badge-success' : 'badge-warning'} text-xs">${a.status}</span></td>
      <td>
        <button class="btn ${a.status === 'Available' ? 'btn-danger' : 'btn-success'} btn-xs" onclick="toggleAttendantDuty('${a.id}')">
          ${a.status === 'Available' ? 'Set Busy' : 'Set Available'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleAttendantDuty(staffId) {
  const staff = appState.attendants.find(x => x.id === staffId);
  if (!staff) return;

  staff.status = staff.status === 'Available' ? 'On Duty' : 'Available';
  labDB.set(STORAGE_KEYS.ATTENDANTS, appState.attendants);

  renderAdminStaff();
  updateAdminMetrics();
}

function renderAdminBookings() {
  const tbody = document.getElementById('adminBookingsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.bookings.map(b => `
    <tr>
      <td class="font-mono font-bold">${b.id}</td>
      <td><span class="badge ${b.type === 'Suite Stay' ? 'badge-primary' : 'badge-success'} text-xs">${b.type}</span></td>
      <td><strong>${b.name}</strong></td>
      <td class="text-xs">${b.details}</td>
      <td class="text-xs font-bold">${b.staff}</td>
      <td class="font-mono font-bold text-success">₹${b.amount}</td>
    </tr>
  `).join('');
}

function updateAdminMetrics() {
  const tableBookings = appState.bookings.filter(b => b.type === 'Table Reservation').length;
  const suiteBookings = appState.bookings.filter(b => b.type === 'Suite Stay').length;
  const availableStaff = appState.attendants.filter(a => a.status === 'Available').length;

  const elT = document.getElementById('adminTotalTableBookings');
  const elR = document.getElementById('adminTotalRoomNights');
  const elS = document.getElementById('adminAvailableAttendants');

  if (elT) elT.innerText = tableBookings;
  if (elR) elR.innerText = suiteBookings;
  if (elS) elS.innerText = availableStaff;
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
