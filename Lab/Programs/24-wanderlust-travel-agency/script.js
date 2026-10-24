// Wanderlust Travels Agency Script

const DEFAULT_PACKAGES = [
  {
    id: 'PKG-01',
    title: 'Ooty & Coonoor Nilgiri Mountain Railway Tour',
    dest: 'Ooty, Tamil Nadu',
    duration: '3D/2N',
    price: 8500,
    hotelTier: 'Heritage Colonial Bungalow',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=500',
    desc: 'Ride the UNESCO heritage steam train, visit Doddabetta peak, Pykara waterfalls boating, and private tea plantation walks.'
  },
  {
    id: 'PKG-02',
    title: 'Munnar Tea Hills & Eravikulam Mist Expedition',
    dest: 'Munnar, Kerala',
    duration: '4D/3N',
    price: 10800,
    hotelTier: 'Eco Valley Mist Resort',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=500',
    desc: 'Spot Nilgiri Tahr goats at Rajamalai, speedboating at Mattupetty Dam, spice tasting, and treehouse campfires.'
  },
  {
    id: 'PKG-03',
    title: 'Kodaikanal Princess of Hill Stations Getaway',
    dest: 'Kodaikanal, Tamil Nadu',
    duration: '3D/2N',
    price: 7900,
    hotelTier: 'Lakeside Pine Chalet',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500',
    desc: 'Rowing on star-shaped Kodai Lake, scenic Coakers walk cliff-edge views, Pillar Rocks, and pine forest hiking.'
  },
  {
    id: 'PKG-04',
    title: 'Goa Coastal Heritage & Sunset Cruise',
    dest: 'Goa',
    duration: '4D/3N',
    price: 12500,
    hotelTier: 'Beachfront Portuguese Villa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500',
    desc: 'Old Goa Latin Quarter heritage walk, Mandovi river luxury sunset catamaran cruise, and parasailing at Calangute.'
  }
];

const DEFAULT_HOTELS = [
  {
    name: 'Nilgiri Heritage Tea Bungalow',
    location: 'Coonoor, Ooty Hills',
    rating: '4.9 ★',
    tier: '4-Star Heritage',
    amenities: ['Fireplace', 'Estate Tour', 'Heated Bedding', 'Organic Buffet'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
  },
  {
    name: 'Munnar Cloud Nine Eco Resort',
    location: 'Chinnakanal, Munnar',
    rating: '4.8 ★',
    tier: 'Luxury Eco-Stay',
    amenities: ['Infinity Mist Pool', 'Ayurvedic Spa', 'Campfire', 'Balcony Valley View'],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500'
  },
  {
    name: 'Kodai Lakefront Pine Chalet',
    location: 'Lake Road, Kodaikanal',
    rating: '4.7 ★',
    tier: 'Boutique Lodge',
    amenities: ['Bicycle Rental', 'Bonfire & BBQ', 'Garden Restaurant', 'Wi-Fi'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'
  }
];

const DEFAULT_DINING = [
  {
    plan: 'Continental Plan (CP)',
    included: 'Complimentary English & South Indian Artisan Breakfast Buffet',
    style: 'Artisan bakery breads, freshly brewed Nilgiri tea, dosa/idli live counter, fruit bowls.',
    surcharge: 0
  },
  {
    plan: 'Modified American Plan (MAP)',
    included: 'Buffet Breakfast + Chef Curated 4-Course Dinner',
    style: 'Traditional Kerala/Tamil claypot curries, tandoori grills, Continental pasta, and local dessert.',
    surcharge: 600
  },
  {
    plan: 'American Plan (AP - Full Board)',
    included: 'Breakfast + Plantation Picnic Lunch + Candlelight Gourmet Dinner',
    style: 'All meals included during transit, packed organic lunch boxes, and specialty dinner feasts.',
    surcharge: 1200
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: 'WNDR-VCHR-901',
    pkgId: 'PKG-01',
    packageTitle: 'Ooty & Coonoor Nilgiri Mountain Railway Tour',
    customerName: 'Ananya & Travel Group',
    phone: '+91 98401 22910',
    departureDate: '2026-10-18',
    travelers: 2,
    mealPlan: 'MAP',
    roomTier: 'Standard',
    totalFare: 18200,
    status: 'Confirmed'
  }
];

// App State
let currentRole = 'traveler';
let currentTravelerTab = 'packages';
let currentAdminTab = 'managePackages';
let targetBookingPackage = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderPackages();
  populateItineraryDropdown();
  renderItineraryDetails();
  renderHotels();
  renderDining();
  renderTravelerBookings();
  renderAdminPackages();
  renderAdminBookings();
  updateAdminMetrics();
});

function initStorage() {
  if (!labDB.get('tour_packages')) labDB.set('tour_packages', DEFAULT_PACKAGES);
  if (!labDB.get('tour_hotels')) labDB.set('tour_hotels', DEFAULT_HOTELS);
  if (!labDB.get('tour_dining')) labDB.set('tour_dining', DEFAULT_DINING);
  if (!labDB.get('tour_bookings')) labDB.set('tour_bookings', DEFAULT_BOOKINGS);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('travelerSection').classList.toggle('hidden', role !== 'traveler');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'traveler') {
    renderPackages();
    renderTravelerBookings();
  } else {
    renderAdminPackages();
    renderAdminBookings();
    updateAdminMetrics();
  }
}

// Traveler Tabs
function switchTravelerTab(tab) {
  currentTravelerTab = tab;
  const tabIds = ['packages', 'itinerary', 'hotels', 'dining', 'bookings'];
  tabIds.forEach(t => {
    const pane = document.getElementById('travTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#travelerSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'bookings') renderTravelerBookings();
}

// Admin Tabs
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['managePackages', 'newPackage', 'agencyBookings'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'managePackages') renderAdminPackages();
  if (tab === 'agencyBookings') renderAdminBookings();
}

// Packages Filter
function filterPackages() {
  renderPackages();
}

function renderPackages() {
  const container = document.getElementById('packagesGrid');
  const search = (document.getElementById('destSearchInput') ? document.getElementById('destSearchInput').value : '').toLowerCase();
  const durFilter = document.getElementById('durationFilter').value;
  const packages = labDB.get('tour_packages') || [];

  const filtered = packages.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search) || p.dest.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    const matchDur = durFilter === 'All' || p.duration === durFilter;
    return matchSearch && matchDur;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-box col-span-3"><p class="muted">No tour packages match your holiday query.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="package-card">
      <div class="package-img-wrapper">
        <img src="${p.image}" alt="${p.title}" onerror="this.src='https://placehold.co/400x250/0f172a/white?text=Holiday'">
        <span class="package-duration-tag">⏱️ ${p.duration}</span>
      </div>

      <div class="package-card-body">
        <div class="package-title-text">${p.title}</div>
        <div class="muted text-xs mb-2">📍 ${p.dest} | 🏨 ${p.hotelTier}</div>
        <p class="package-desc-text">${p.desc}</p>

        <div class="package-footer-flex">
          <div class="package-price">₹${p.price.toLocaleString('en-IN')} <span>/ person</span></div>
          <button class="btn btn-primary btn-sm" onclick="openBookingModal('${p.id}')">Book Package</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Booking Modal
function openBookingModal(pkgId) {
  const packages = labDB.get('tour_packages') || [];
  const p = packages.find(item => item.id === pkgId);
  if (!p) return;

  targetBookingPackage = p;
  document.getElementById('bookPkgId').value = p.id;
  document.getElementById('bookPkgTitleDisplay').value = `${p.title} (${p.duration})`;

  // Default departure date: 10 days ahead
  const d = new Date();
  d.setDate(d.getDate() + 10);
  document.getElementById('bookDepartureDate').value = d.toISOString().split('T')[0];

  calculateTourFare();
  document.getElementById('bookPackageModal').classList.remove('hidden');
}

function closeBookPackageModal() {
  document.getElementById('bookPackageModal').classList.add('hidden');
}

function calculateTourFare() {
  if (!targetBookingPackage) return;

  const pax = parseInt(document.getElementById('bookTravelersCount').value) || 1;
  const mealPlan = document.getElementById('bookMealPlan').value;
  const roomTier = document.getElementById('bookRoomTier').value;

  const basePrice = targetBookingPackage.price * pax;
  const mealSurchargePerPax = mealPlan === 'MAP' ? 600 : mealPlan === 'AP' ? 1200 : 0;
  const roomSurchargePerPax = roomTier === 'Luxury' ? 2000 : 0;

  const totalMealAndRoom = (mealSurchargePerPax + roomSurchargePerPax) * pax;
  const grandTotal = basePrice + totalMealAndRoom;

  document.getElementById('bookFareCalcPax').textContent = pax;
  document.getElementById('bookBaseFareText').textContent = `₹${basePrice.toLocaleString('en-IN')}.00`;
  document.getElementById('bookMealSurchargeText').textContent = `₹${totalMealAndRoom.toLocaleString('en-IN')}.00`;
  document.getElementById('bookGrandTotalText').textContent = `₹${grandTotal.toLocaleString('en-IN')}.00`;

  return { pax, basePrice, totalMealAndRoom, grandTotal };
}

function handleConfirmBooking(e) {
  e.preventDefault();
  if (!targetBookingPackage) return;

  const calc = calculateTourFare();
  const depDate = document.getElementById('bookDepartureDate').value;
  const mealPlan = document.getElementById('bookMealPlan').value;
  const roomTier = document.getElementById('bookRoomTier').value;

  const voucherId = `WNDR-VCHR-${Math.floor(900 + Math.random() * 99)}`;
  const newBooking = {
    id: voucherId,
    pkgId: targetBookingPackage.id,
    packageTitle: targetBookingPackage.title,
    customerName: 'Ananya & Travel Group',
    phone: '+91 98401 22910',
    departureDate: depDate,
    travelers: calc.pax,
    mealPlan,
    roomTier,
    totalFare: calc.grandTotal,
    status: 'Confirmed'
  };

  const bookings = labDB.get('tour_bookings') || [];
  bookings.unshift(newBooking);
  labDB.set('tour_bookings', bookings);

  closeBookPackageModal();
  renderTravelerBookings();
  renderAdminBookings();
  updateAdminMetrics();

  showAlert(`Holiday package booked! Voucher issued: ${voucherId}`, 'success');
  switchTravelerTab('bookings');
}

// Render Traveler Bookings
function renderTravelerBookings() {
  const container = document.getElementById('travelerBookingsList');
  const bookings = labDB.get('tour_bookings') || [];

  document.getElementById('myTripsCount').textContent = bookings.length;

  if (bookings.length === 0) {
    container.innerHTML = `<p class="muted">No vacation bookings found.</p>`;
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div class="booking-voucher-card">
      <div class="card-header-flex">
        <div>
          <span class="badge badge-success">✓ Booking Confirmed</span>
          <h3 style="margin: 0.5rem 0 0.2rem 0; color: #38bdf8;">${b.packageTitle}</h3>
          <span class="font-mono text-xs muted">Voucher PNR: ${b.id}</span>
        </div>
        <div class="text-right">
          <strong style="color: #10b981; font-size: 1.4rem;">₹${b.totalFare.toLocaleString('en-IN')}.00</strong>
          <div class="muted text-xs">${b.travelers} Guest(s)</div>
        </div>
      </div>

      <div class="grid-2 mt-3" style="font-size: 0.85rem; line-height: 1.6;">
        <div>
          <div>📅 <strong>Departure Date:</strong> ${b.departureDate}</div>
          <div>🍽️ <strong>Meal Plan:</strong> ${b.mealPlan} Package</div>
        </div>
        <div>
          <div>🏨 <strong>Accommodation:</strong> ${b.roomTier} Suite</div>
          <div>📞 <strong>Guest Contact:</strong> ${b.customerName} (${b.phone})</div>
        </div>
      </div>

      <div class="mt-4 text-right">
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Holiday Voucher</button>
      </div>
    </div>
  `).join('');
}

// Itinerary Dropdown & Steps
function populateItineraryDropdown() {
  const select = document.getElementById('itineraryPackageSelect');
  if (!select) return;
  const packages = labDB.get('tour_packages') || [];

  select.innerHTML = packages.map(p => `
    <option value="${p.id}">${p.title}</option>
  `).join('');
}

function renderItineraryDetails() {
  const select = document.getElementById('itineraryPackageSelect');
  const pkgId = select ? select.value : 'PKG-01';
  const container = document.getElementById('itineraryContentBox');

  container.innerHTML = `
    <div class="itinerary-day-card">
      <div class="day-badge">Day 1: Arrival, Scenic Ghats & Nilgiri Toy Train Experience</div>
      <p class="muted text-sm">Morning pickup from Coimbatore Junction. Ascend the Kallar scenic hairpin bends to Coonoor. Board the historic UNESCO Mountain Toy Train through tunnels and tea valleys into Ooty. Evening botanical garden walk.</p>
      <div class="text-xs muted">🚗 <strong>Travel Leg:</strong> 85 km (Approx 3h 15m) | 🍽️ <strong>Included:</strong> High Tea & Welcome Dinner</div>
    </div>

    <div class="itinerary-day-card">
      <div class="day-badge">Day 2: Doddabetta Summit, Pine Forests & Pykara Speedboating</div>
      <p class="muted text-sm">Sunrise excursion to Doddabetta Peak (highest Nilgiri summit). Drive to Pykara scenic waterfalls followed by peaceful lake boating. Afternoon visit to the Glenmorgan tea factory for tea tasting.</p>
      <div class="text-xs muted">🚗 <strong>Travel Leg:</strong> 42 km Local Sightseeing | 🍽️ <strong>Included:</strong> Breakfast & Buffet Dinner</div>
    </div>

    <div class="itinerary-day-card">
      <div class="day-badge">Day 3: Homemade Chocolate Trail, Souvenir Shopping & Departure</div>
      <p class="muted text-sm">Morning visit to Ooty market for artisan handmade chocolates, eucalyptus essential oils, and heritage spices. Scenic downhill descent back to Coimbatore airport for onward flight.</p>
      <div class="text-xs muted">🚗 <strong>Travel Leg:</strong> 88 km Return Transfer | 🍽️ <strong>Included:</strong> Artisan Breakfast</div>
    </div>
  `;
}

// Hotels & Dining
function renderHotels() {
  const container = document.getElementById('hotelsGrid');
  const hotels = labDB.get('tour_hotels') || [];

  container.innerHTML = hotels.map(h => `
    <div class="hotel-card">
      <div class="package-img-wrapper" style="height: 150px; border-radius: var(--radius-md);">
        <img src="${h.image}" alt="${h.name}" onerror="this.src='https://placehold.co/400x200/0f172a/white?text=Resort'">
      </div>
      <h4 style="margin: 0.75rem 0 0.2rem 0;">${h.name}</h4>
      <div class="muted text-xs">📍 ${h.location} | <strong style="color: #f59e0b;">${h.rating}</strong></div>
      <div class="amenities-chips">
        ${h.amenities.map(a => `<span class="amenity-chip">${a}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderDining() {
  const container = document.getElementById('diningOptionsGrid');
  const dining = labDB.get('tour_dining') || [];

  container.innerHTML = dining.map(d => `
    <div class="dining-card">
      <h4 style="margin: 0 0 0.35rem 0; color: #38bdf8;">${d.plan}</h4>
      <p class="font-bold text-sm" style="color: #10b981;">${d.included}</p>
      <p class="muted text-xs mt-2">${d.style}</p>
      <div class="text-xs muted mt-3">Surcharge: <strong>${d.surcharge === 0 ? 'Complimentary' : '+₹' + d.surcharge + '/pax'}</strong></div>
    </div>
  `).join('');
}

// Admin Operations
function renderAdminPackages() {
  const tbody = document.getElementById('adminPackagesTable');
  const packages = labDB.get('tour_packages') || [];

  tbody.innerHTML = packages.map(p => `
    <tr>
      <td><strong>${p.title}</strong></td>
      <td>${p.dest}</td>
      <td>${p.duration}</td>
      <td class="font-bold">₹${p.price.toLocaleString('en-IN')}</td>
      <td class="text-xs">${p.hotelTier}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="adminRemovePackage('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function adminRemovePackage(pkgId) {
  if (!confirm('Confirm deletion of holiday package?')) return;
  let packages = labDB.get('tour_packages') || [];
  packages = packages.filter(p => p.id !== pkgId);
  labDB.set('tour_packages', packages);

  renderAdminPackages();
  renderPackages();
  populateItineraryDropdown();
  updateAdminMetrics();
  showAlert('Holiday package removed from catalog.', 'info');
}

function handleAdminCreatePackage(e) {
  e.preventDefault();
  const title = document.getElementById('newPkgTitle').value.trim();
  const dest = document.getElementById('newPkgDest').value.trim();
  const duration = document.getElementById('newPkgDuration').value;
  const price = parseFloat(document.getElementById('newPkgPrice').value);
  const image = document.getElementById('newPkgImage').value.trim();
  const desc = document.getElementById('newPkgDesc').value.trim();

  const packages = labDB.get('tour_packages') || [];
  const newPkg = {
    id: `PKG-${packages.length + 1 < 10 ? '0' : ''}${packages.length + 1}`,
    title,
    dest,
    duration,
    price,
    hotelTier: 'Premium Hillside Retreat',
    image: image || 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=500',
    desc
  };

  packages.push(newPkg);
  labDB.set('tour_packages', packages);

  e.target.reset();
  renderAdminPackages();
  renderPackages();
  populateItineraryDropdown();
  updateAdminMetrics();
  showAlert(`Tour package "${title}" published live!`, 'success');
  switchAdminTab('managePackages');
}

function renderAdminBookings() {
  const tbody = document.getElementById('adminBookingsTable');
  const bookings = labDB.get('tour_bookings') || [];

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td class="font-mono font-bold">${b.id}</td>
      <td>${b.customerName}</td>
      <td>${b.packageTitle}</td>
      <td class="text-xs">${b.departureDate}</td>
      <td>${b.travelers} Pax</td>
      <td class="font-bold">₹${b.totalFare.toLocaleString('en-IN')}</td>
      <td><span class="badge badge-success">${b.status}</span></td>
    </tr>
  `).join('');
}

function updateAdminMetrics() {
  const packages = labDB.get('tour_packages') || [];
  const bookings = labDB.get('tour_bookings') || [];

  document.getElementById('adminTotalPackages').textContent = packages.length;
  document.getElementById('adminTotalBookings').textContent = bookings.length;
  const rev = bookings.reduce((acc, b) => acc + (b.totalFare || 0), 0);
  document.getElementById('adminTotalRevenue').textContent = `₹${rev.toLocaleString('en-IN')}`;
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
