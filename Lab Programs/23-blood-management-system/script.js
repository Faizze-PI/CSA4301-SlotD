// RaktSeva Blood Bank Management Script

const DEFAULT_DONORS = [
  {
    id: 'DNR-4029',
    name: 'Kishore Kumar',
    group: 'O-',
    age: 26,
    weight: 68,
    phone: '+91 98401 55921',
    city: 'Chennai Central',
    lastDate: '2026-06-15',
    donations: 6
  },
  {
    id: 'DNR-4030',
    name: 'Sneha Raghuram',
    group: 'A+',
    age: 23,
    weight: 54,
    phone: '+91 98402 11029',
    city: 'Chennai South',
    lastDate: '2026-07-20',
    donations: 3
  },
  {
    id: 'DNR-4031',
    name: 'Vignesh Pandian',
    group: 'B+',
    age: 29,
    weight: 74,
    phone: '+91 94440 88219',
    city: 'Kanchipuram',
    lastDate: '2026-08-10',
    donations: 8
  },
  {
    id: 'DNR-4032',
    name: 'Farzana Begum',
    group: 'AB-',
    age: 31,
    weight: 59,
    phone: '+91 94441 33092',
    city: 'Chennai Central',
    lastDate: '2026-05-18',
    donations: 4
  },
  {
    id: 'DNR-4033',
    name: 'David Solomon',
    group: 'O+',
    age: 24,
    weight: 71,
    phone: '+91 98404 66102',
    city: 'Tambaram',
    lastDate: '2026-09-25',
    donations: 2
  }
];

const DEFAULT_HOSPITAL_STOCK = {
  'A+': 24,
  'A-': 8,
  'B+': 32,
  'B-': 12,
  'AB+': 18,
  'AB-': 4,
  'O+': 40,
  'O-': 10
};

const DEFAULT_BANKS = [
  {
    id: 'HOSP-01',
    name: 'SIMATS Medical College & Hospital Blood Centre',
    city: 'Saveetha Nagar, Thandalam, Chennai',
    phone: '044-2680 1050',
    license: '28B/TN/10492',
    stock: DEFAULT_HOSPITAL_STOCK
  },
  {
    id: 'HOSP-02',
    name: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    city: 'Park Town, Chennai',
    phone: '044-2530 5000',
    license: '28B/TN/00102',
    stock: { 'A+': 45, 'A-': 14, 'B+': 50, 'B-': 18, 'AB+': 25, 'AB-': 7, 'O+': 60, 'O-': 16 }
  },
  {
    id: 'HOSP-03',
    name: 'Kanchipuram District Headquarters Transfusion Center',
    city: 'Railway Station Road, Kanchipuram',
    phone: '044-2722 2333',
    license: '28B/TN/04481',
    stock: { 'A+': 15, 'A-': 4, 'B+': 20, 'B-': 6, 'AB+': 8, 'AB-': 2, 'O+': 22, 'O-': 5 }
  }
];

// App State
let currentRole = 'donor';
let currentDonorTab = 'searchDonors';
let currentHospitalTab = 'inventory';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderDonors();
  renderBloodBanks();
  renderMyDonorCard();
  renderHospitalStockMatrix();
  updateHospitalTotalUnits();
});

function initStorage() {
  if (!labDB.get('blood_donors')) labDB.set('blood_donors', DEFAULT_DONORS);
  if (!labDB.get('blood_banks')) labDB.set('blood_banks', DEFAULT_BANKS);
  if (!labDB.get('blood_hospital_stock')) labDB.set('blood_hospital_stock', DEFAULT_HOSPITAL_STOCK);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('donorSection').classList.toggle('hidden', role !== 'donor');
  document.getElementById('hospitalSection').classList.toggle('hidden', role !== 'hospital');

  if (role === 'donor') {
    renderDonors();
    renderBloodBanks();
    renderMyDonorCard();
  } else {
    renderHospitalStockMatrix();
    updateHospitalTotalUnits();
  }
}

// Donor Tabs
function switchDonorTab(tab) {
  currentDonorTab = tab;
  const tabIds = ['searchDonors', 'searchBanks', 'postDonor', 'myInfo'];
  tabIds.forEach(t => {
    const pane = document.getElementById('donorTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#donorSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'searchDonors') renderDonors();
  if (tab === 'searchBanks') renderBloodBanks();
  if (tab === 'myInfo') renderMyDonorCard();
}

// Hospital Tabs
function switchHospitalTab(tab) {
  currentHospitalTab = tab;
  const tabIds = ['inventory', 'bloodCenterInfo'];
  tabIds.forEach(t => {
    const pane = document.getElementById('hospTab' + (t === 'bloodCenterInfo' ? 'Info' : t.charAt(0).toUpperCase() + t.slice(1)));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#hospitalSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'inventory') renderHospitalStockMatrix();
}

// Donor Search & Filter
function filterDonors() {
  renderDonors();
}

function checkEligibility(lastDateStr) {
  if (!lastDateStr) return true;
  const last = new Date(lastDateStr);
  const now = new Date();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  return diffDays >= 90; // Standard 90-day interval between donations
}

function renderDonors() {
  const container = document.getElementById('donorsGrid');
  const group = document.getElementById('searchBloodGroup').value;
  const district = (document.getElementById('searchDistrict') ? document.getElementById('searchDistrict').value : '').toLowerCase();

  const donors = labDB.get('blood_donors') || [];

  const filtered = donors.filter(d => {
    const matchGroup = group === 'All' || d.group === group;
    const matchDistrict = d.city.toLowerCase().includes(district) || d.name.toLowerCase().includes(district);
    return matchGroup && matchDistrict;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-box col-span-3"><p class="muted">No donors found matching this blood group and location.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(d => {
    const isEligible = checkEligibility(d.lastDate);

    return `
      <div class="donor-card">
        <div>
          <div class="donor-header-flex">
            <div>
              <span class="badge ${isEligible ? 'badge-success' : 'badge-warning'}">
                ${isEligible ? '🟢 Eligible to Donate' : '⏳ Cooling Period'}
              </span>
              <div class="donor-name-text">${d.name}</div>
              <div class="muted text-xs">Donor ID: ${d.id}</div>
            </div>
            <div class="blood-drop-badge">${d.group}</div>
          </div>

          <div class="donor-meta-info mt-3">
            <div>📍 <strong>City:</strong> ${d.city}</div>
            <div>🎂 <strong>Age:</strong> ${d.age} yrs | <strong>Weight:</strong> ${d.weight} kg</div>
            <div>🩸 <strong>Total Donations:</strong> ${d.donations} times</div>
            <div class="text-xs muted mt-1">Last Donated: ${d.lastDate || 'First Time Donor'}</div>
          </div>
        </div>

        <div class="mt-2">
          <a href="tel:${d.phone}" class="btn btn-primary btn-block btn-sm">
            📞 Contact: ${d.phone}
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Render Blood Banks
function renderBloodBanks() {
  const container = document.getElementById('bloodBanksList');
  const search = (document.getElementById('bankSearchInput') ? document.getElementById('bankSearchInput').value : '').toLowerCase();
  const banks = labDB.get('blood_banks') || [];

  // Update SIMATS stock with live inventory from labDB
  if (banks[0]) banks[0].stock = labDB.get('blood_hospital_stock') || DEFAULT_HOSPITAL_STOCK;

  const filtered = banks.filter(b => b.name.toLowerCase().includes(search) || b.city.toLowerCase().includes(search));

  container.innerHTML = filtered.map(b => `
    <div class="hospital-bank-card">
      <div class="card-header-flex">
        <div>
          <h4 style="margin: 0 0 0.2rem 0;">${b.name}</h4>
          <span class="muted text-xs">Lic: ${b.license} | 📍 ${b.city}</span>
        </div>
        <span class="badge badge-success">24x7 Active</span>
      </div>

      <div class="stock-chips-row">
        ${Object.entries(b.stock).map(([grp, qty]) => `
          <div class="stock-chip">
            <span class="group-label">${grp}</span>
            <span class="unit-val">${qty} U</span>
          </div>
        `).join('')}
      </div>

      <div class="card-header-flex mt-2">
        <a href="tel:${b.phone}" class="btn btn-secondary btn-sm">📞 Helpline: ${b.phone}</a>
        <button class="btn btn-primary btn-sm" onclick="requestBloodRequisition('${b.name}')">Request Units</button>
      </div>
    </div>
  `).join('');
}

function requestBloodRequisition(bankName) {
  showAlert(`Emergency blood requisition ticket transmitted to ${bankName}. Blood centre duty officer notified.`, 'success');
}

// Post Donor Profile
function handleSaveDonorProfile(e) {
  e.preventDefault();
  const name = document.getElementById('regDonorName').value.trim();
  const group = document.getElementById('regDonorGroup').value;
  const age = parseInt(document.getElementById('regDonorAge').value);
  const weight = parseInt(document.getElementById('regDonorWeight').value);
  const phone = document.getElementById('regDonorPhone').value.trim();
  const city = document.getElementById('regDonorCity').value.trim();
  const lastDate = document.getElementById('regDonorLastDate').value;

  const donors = labDB.get('blood_donors') || [];
  const existingIdx = donors.findIndex(d => d.name === name || d.id === 'DNR-4029');

  const profile = {
    id: existingIdx !== -1 ? donors[existingIdx].id : `DNR-${Math.floor(4000 + Math.random() * 900)}`,
    name,
    group,
    age,
    weight,
    phone,
    city,
    lastDate,
    donations: existingIdx !== -1 ? donors[existingIdx].donations : 1
  };

  if (existingIdx !== -1) {
    donors[existingIdx] = profile;
  } else {
    donors.unshift(profile);
  }

  labDB.set('blood_donors', donors);
  renderDonors();
  renderMyDonorCard();
  showAlert(`Donor profile saved! Thank you for pledging life-saving blood.`, 'success');
  switchDonorTab('myInfo');
}

// Digital Donor Card
function renderMyDonorCard() {
  const container = document.getElementById('myDonorCardDisplay');
  const donors = labDB.get('blood_donors') || [];
  const me = donors[0] || DEFAULT_DONORS[0];
  const isEligible = checkEligibility(me.lastDate);

  container.innerHTML = `
    <div class="card-header-flex">
      <div>
        <h3 style="margin: 0; color: #ef4444;">RAKTSEVA DONOR REGISTRY</h3>
        <p class="muted text-xs">National Voluntary Blood Donor Identity Certificate</p>
      </div>
      <div class="blood-drop-badge" style="width: 60px; height: 60px; font-size: 1.6rem;">${me.group}</div>
    </div>

    <div style="font-size: 1.1rem; font-weight: 700; margin: 1rem 0 0.25rem 0;">${me.name}</div>
    <div class="font-mono text-xs muted mb-3">Donor Registry ID: ${me.id} | ${me.city}</div>

    <div class="grid-2" style="font-size: 0.85rem; line-height: 1.6;">
      <div>
        <div>Age / Weight: <strong>${me.age} yrs / ${me.weight} kg</strong></div>
        <div>Emergency Contact: <strong>${me.phone}</strong></div>
      </div>
      <div>
        <div>Last Donation: <strong>${me.lastDate || 'N/A'}</strong></div>
        <div>Donation Eligibility: <strong style="color: ${isEligible ? '#10b981' : '#f59e0b'};">${isEligible ? 'ELIGIBLE NOW' : 'WAIT FOR COOLING PERIOD'}</strong></div>
      </div>
    </div>

    <div class="card-header-flex mt-4 pt-3" style="border-top: 1px dashed rgba(255,255,255,0.2);">
      <span class="badge badge-success">Certified Voluntary Donor</span>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Donor ID Card</button>
    </div>
  `;
}

// Hospital Stock Matrix
function renderHospitalStockMatrix() {
  const container = document.getElementById('hospitalStockMatrixGrid');
  const stock = labDB.get('blood_hospital_stock') || DEFAULT_HOSPITAL_STOCK;

  container.innerHTML = Object.entries(stock).map(([grp, qty]) => {
    const isLow = qty < 10;

    return `
      <div class="stock-matrix-card ${isLow ? 'low-stock' : ''}">
        <div class="matrix-group-title">${grp}</div>
        <span class="badge ${isLow ? 'badge-danger' : 'badge-neutral'}">${isLow ? 'CRITICAL RESERVE' : 'HEALTHY STOCK'}</span>
        <div class="matrix-unit-counter">${qty} <span class="text-xs muted">Units</span></div>

        <div class="matrix-btn-group">
          <button class="counter-btn" onclick="adjustHospitalStock('${grp}', -1)" title="Issue 1 Unit">-</button>
          <button class="counter-btn" onclick="adjustHospitalStock('${grp}', 1)" title="Add 1 Unit">+</button>
        </div>
      </div>
    `;
  }).join('');
}

function adjustHospitalStock(group, delta) {
  const stock = labDB.get('blood_hospital_stock') || DEFAULT_HOSPITAL_STOCK;
  stock[group] = Math.max(0, (stock[group] || 0) + delta);
  labDB.set('blood_hospital_stock', stock);

  renderHospitalStockMatrix();
  updateHospitalTotalUnits();
  renderBloodBanks();
  showAlert(`${group} stock updated to ${stock[group]} units.`, 'info');
}

function seedHospitalStock() {
  labDB.set('blood_hospital_stock', DEFAULT_HOSPITAL_STOCK);
  renderHospitalStockMatrix();
  updateHospitalTotalUnits();
  renderBloodBanks();
  showAlert('Blood reserves replenished to benchmark baseline levels.', 'success');
}

function updateHospitalTotalUnits() {
  const stock = labDB.get('blood_hospital_stock') || DEFAULT_HOSPITAL_STOCK;
  const total = Object.values(stock).reduce((a, b) => a + b, 0);
  const text = document.getElementById('hospitalTotalUnitsText');
  if (text) text.textContent = `${total} Units`;
}

function handleSaveHospitalInfo(e) {
  e.preventDefault();
  showAlert('Hospital blood centre credentials updated!', 'success');
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
