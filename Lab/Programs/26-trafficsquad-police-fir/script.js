/**
 * Traffic Squad - E-Challan FIR & Penalty Collection Portal
 * Experiment 26 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  CHALLANS: 'traffic_challans_v1',
  OFFICERS: 'traffic_officers_v1',
  BULLETINS: 'traffic_bulletins_v1'
};

const STATUTORY_RULES = [
  { section: 'Sec 194D', description: 'Riding Two-Wheeler without Protective Headgear (Helmet)', fine: 1000, seizure: 'No (License de-merit)' },
  { section: 'Sec 184', description: 'Jumping Red Light Signal / Stop Line Violation', fine: 1000, seizure: 'No' },
  { section: 'Sec 194C', description: 'Carrying more than one pillion rider (Triple Riding)', fine: 1000, seizure: 'No' },
  { section: 'Sec 183', description: 'Exceeding Lawful Speed Limits (Radar / Laser Detected)', fine: 2000, seizure: 'Vehicle impounded on 2nd offense' },
  { section: 'Sec 184(c)', description: 'Using Handheld Mobile Phone / Headset while Operating Vehicle', fine: 1500, seizure: 'No' },
  { section: 'Sec 194B', description: 'Operating Four-Wheeler without Fastening Safety Seat Belt', fine: 1000, seizure: 'No' },
  { section: 'Sec 185', description: 'Driving by a drunken person / Under Influence (BAC > 30mg/100ml)', fine: 10000, seizure: 'Mandatory Vehicle Seizure & Court FIR' },
  { section: 'Sec 184', description: 'Dangerous / Rash Driving against traffic flow (One-Way)', fine: 5000, seizure: 'Immediate Seizure' }
];

const DEFAULT_OFFICERS = [
  { badge: 'TP-4091', name: 'Sub-Inspector R. Manickam', junction: 'Anna Salai & Kathipara Junction', casesFiled: 8, status: 'Active Patrol' },
  { badge: 'TP-2104', name: 'Inspector V. Sundaram', junction: 'Koyambedu CMBT Corridor', casesFiled: 14, status: 'Active Patrol' },
  { badge: 'TP-5120', name: 'Sub-Inspector P. Revathi', junction: 'OMR Sholinganallur Signal', casesFiled: 11, status: 'HQ Desk' }
];

const DEFAULT_CHALLANS = [
  {
    id: 'CHL-88201',
    vehNo: 'TN 09 BK 4521',
    category: 'Two-Wheeler (Motorcycle/Scooter)',
    owner: 'Ramesh Krishnan',
    mobile: '+91 98401 22334',
    violation: 'Helmet Not Worn',
    section: 'Sec 194D',
    fine: 1000,
    location: 'Kathipara Junction Pillar 12',
    photoProof: 'camera_no_helmet.jpg',
    status: 'Unpaid',
    dateTime: '2026-10-04 10:15 AM',
    badge: 'TP-4091',
    txnId: null,
    paidAt: null
  },
  {
    id: 'CHL-88202',
    vehNo: 'TN 09 BK 4521',
    category: 'Two-Wheeler (Motorcycle/Scooter)',
    owner: 'Ramesh Krishnan',
    mobile: '+91 98401 22334',
    violation: 'Red Light Signal Jumping',
    section: 'Sec 184',
    fine: 1000,
    location: 'Guindy Racecourse Signal',
    photoProof: 'camera_signal_jump.jpg',
    status: 'Unpaid',
    dateTime: '2026-10-05 08:42 AM',
    badge: 'TP-4091',
    txnId: null,
    paidAt: null
  },
  {
    id: 'CHL-88190',
    vehNo: 'TN 01 AB 1234',
    category: 'Four-Wheeler (Car/Sedan/SUV)',
    owner: 'S. Vijayaraghavan',
    mobile: '+91 94440 98711',
    violation: 'Over-Speeding (Radar Detected)',
    section: 'Sec 183',
    fine: 2000,
    location: 'Airport Elevated Flyover (Speed: 94 km/h)',
    photoProof: 'camera_speed_radar.jpg',
    status: 'Paid',
    dateTime: '2026-10-02 04:30 PM',
    badge: 'TP-2104',
    txnId: 'TXN-ECHL-994821',
    paidAt: '2026-10-03 11:20 AM'
  }
];

const DEFAULT_BULLETINS = [
  {
    id: 'BUL-01',
    junction: 'Kathipara Junction Flyover Ramp',
    severity: 'Congestion',
    details: 'Heavy rush-hour traffic towards Airport. Slow moving from Guindy estate. Commuters advised to use Inner Ring Road.',
    time: '10 Mins Ago'
  },
  {
    id: 'BUL-02',
    junction: 'OMR Karapakkam Junction',
    severity: 'Roadwork',
    details: 'Metro rail pillar barricading work in progress. One lane restricted towards Siruseri SIPCOT.',
    time: '25 Mins Ago'
  }
];

let appState = {
  currentRole: 'citizen',
  activePoliceTab: 'filedCases',
  challans: [],
  officers: [],
  bulletins: []
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedChallans = labDB.get(STORAGE_KEYS.CHALLANS);
  if (!storedChallans || storedChallans.length === 0) {
    labDB.set(STORAGE_KEYS.CHALLANS, DEFAULT_CHALLANS);
    appState.challans = [...DEFAULT_CHALLANS];
  } else {
    appState.challans = storedChallans;
  }

  const storedOfficers = labDB.get(STORAGE_KEYS.OFFICERS);
  if (!storedOfficers || storedOfficers.length === 0) {
    labDB.set(STORAGE_KEYS.OFFICERS, DEFAULT_OFFICERS);
    appState.officers = [...DEFAULT_OFFICERS];
  } else {
    appState.officers = storedOfficers;
  }

  const storedBulletins = labDB.get(STORAGE_KEYS.BULLETINS);
  if (!storedBulletins || storedBulletins.length === 0) {
    labDB.set(STORAGE_KEYS.BULLETINS, DEFAULT_BULLETINS);
    appState.bulletins = [...DEFAULT_BULLETINS];
  } else {
    appState.bulletins = storedBulletins;
  }
}

function renderApp() {
  handleCitizenSearch();
  renderPoliceCases();
  renderPenaltyRules();
  renderBulletins();
  renderAdminDashboard();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('citizenSection').classList.toggle('hidden', role !== 'citizen');
  document.getElementById('policeSection').classList.toggle('hidden', role !== 'police');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminDashboard();
  } else if (role === 'police') {
    renderPoliceCases();
  }
}

// Police Tab Switching
function switchPoliceTab(tabName) {
  appState.activePoliceTab = tabName;
  const tabs = {
    filedCases: 'policeTabCases',
    penaltyChart: 'policeTabRules',
    liveTraffic: 'policeTabTraffic'
  };

  document.querySelectorAll('#policeSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

// Citizen Functions
function handleCitizenSearch() {
  const container = document.getElementById('citizenResultsContainer');
  if (!container) return;

  const rawQuery = (document.getElementById('citizenSearchQuery')?.value || '').trim().toUpperCase();

  const results = appState.challans.filter(c => 
    c.vehNo.toUpperCase().includes(rawQuery) || c.id.toUpperCase().includes(rawQuery)
  );

  if (results.length === 0) {
    container.innerHTML = `
      <div class="card text-center py-4">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">✅</span>
        <h4>No Traffic Violations Found</h4>
        <p class="muted">No outstanding e-challan notices or pending penalties found for <strong>${rawQuery || 'this query'}</strong>. Thank you for following road safety regulations!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(c => `
    <div class="challan-card ${c.status === 'Paid' ? 'paid' : 'unpaid'}">
      <div class="challan-header-row">
        <div>
          <span class="badge ${c.status === 'Paid' ? 'badge-success' : 'badge-danger'} mb-1">
            ${c.status === 'Paid' ? '✅ Fine Settled & Paid' : '🚨 Notice Issued - Fine Unpaid'}
          </span>
          <h3>Notice Ref: <span class="font-mono text-danger">${c.id}</span></h3>
          <p class="muted">Vehicle No: <strong class="font-mono uppercase">${c.vehNo}</strong> (${c.category}) | Owner: <strong>${c.owner}</strong></p>
        </div>
        <div class="text-right">
          <span class="muted text-xs block">PENALTY AMOUNT</span>
          <span class="font-mono font-bold text-danger" style="font-size: 1.5rem;">₹${c.fine}.00</span>
        </div>
      </div>

      <div class="evidence-box">
        <div class="evidence-photo-placeholder">
          <span>📷</span>
          <strong>ANPR Proof</strong>
          <span class="text-xs">${c.photoProof}</span>
        </div>
        <div>
          <p><strong>Offense:</strong> ${c.violation} (<span class="font-mono text-warning">${c.section}</span>)</p>
          <p class="muted"><strong>Location:</strong> ${c.location}</p>
          <p class="muted text-xs"><strong>Recorded Time:</strong> ${c.dateTime} | Reporting Officer: Badge #${c.badge}</p>
          ${c.status === 'Paid' ? `
            <p class="text-success text-xs mt-1"><strong>Payment Ref:</strong> ${c.txnId} | Settled on ${c.paidAt}</p>
          ` : ''}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        ${c.status !== 'Paid' ? `
          <button class="btn btn-danger btn-sm" onclick="openPayModal('${c.id}')">💳 Pay Fine Online (₹${c.fine})</button>
        ` : `
          <button class="btn btn-secondary btn-sm" onclick="openReceiptModal('${c.id}')">🖨️ View Payment Receipt</button>
        `}
      </div>
    </div>
  `).join('');
}

// Police Create Case
function openCreateCaseModal() {
  document.getElementById('createCaseModal').classList.remove('hidden');
}

function closeCreateCaseModal() {
  document.getElementById('createCaseModal').classList.add('hidden');
}

function updateChallanFineAmount() {
  const select = document.getElementById('newViolationSelect');
  const option = select.options[select.selectedIndex];
  const fine = option.getAttribute('data-fine') || 1000;
  document.getElementById('newFineAmount').value = fine;
}

function handleCreateChallanSubmit(event) {
  event.preventDefault();

  const vehNo = document.getElementById('newVehNo').value.trim().toUpperCase();
  const category = document.getElementById('newVehCategory').value;
  const owner = document.getElementById('newOwnerName').value.trim();
  const mobile = document.getElementById('newOwnerMobile').value.trim();

  const select = document.getElementById('newViolationSelect');
  const violation = select.value;
  const fine = parseFloat(document.getElementById('newFineAmount').value);
  const location = document.getElementById('newLocation').value.trim();
  const photoProof = document.getElementById('newPhotoProofSelect').value;

  const newChallan = {
    id: 'CHL-' + Math.floor(10000 + Math.random() * 90000),
    vehNo,
    category,
    owner,
    mobile,
    violation,
    section: violation.includes('Helmet') ? 'Sec 194D' : (violation.includes('DUI') ? 'Sec 185' : 'Sec 184'),
    fine,
    location,
    photoProof,
    status: 'Unpaid',
    dateTime: new Date().toLocaleString(),
    badge: 'TP-4091',
    txnId: null,
    paidAt: null
  };

  appState.challans.unshift(newChallan);
  labDB.set(STORAGE_KEYS.CHALLANS, appState.challans);

  // Increment officer counter
  const me = appState.officers.find(o => o.badge === 'TP-4091');
  if (me) {
    me.casesFiled += 1;
    labDB.set(STORAGE_KEYS.OFFICERS, appState.officers);
  }

  closeCreateCaseModal();
  showAlert(`🚨 E-Challan ${newChallan.id} successfully lodged against vehicle ${vehNo}! SMS notice dispatched.`, 'success');

  renderPoliceCases();
  handleCitizenSearch();
  renderAdminDashboard();
}

function renderPoliceCases() {
  const tbody = document.getElementById('policeCasesTableBody');
  const badge = document.getElementById('policeTotalCasesBadge');
  if (!tbody) return;

  if (badge) badge.innerText = `${appState.challans.length} Cases Filed`;

  tbody.innerHTML = appState.challans.map(c => `
    <tr>
      <td class="font-mono font-bold">${c.id}</td>
      <td class="font-mono font-bold">${c.vehNo}</td>
      <td>
        <strong>${c.violation}</strong><br>
        <span class="muted text-xs">${c.section}</span>
      </td>
      <td>${c.location}</td>
      <td class="font-bold text-danger">₹${c.fine}</td>
      <td>
        <span class="badge badge-secondary text-xs">📷 ${c.photoProof}</span>
      </td>
      <td>
        <span class="badge ${c.status === 'Paid' ? 'badge-success' : 'badge-danger'}">
          ${c.status}
        </span>
      </td>
      <td class="text-xs muted">${c.dateTime}</td>
    </tr>
  `).join('');
}

function renderPenaltyRules() {
  const tbody = document.getElementById('penaltyRulesTableBody');
  if (!tbody) return;

  tbody.innerHTML = STATUTORY_RULES.map(r => `
    <tr>
      <td class="font-mono font-bold text-warning">${r.section}</td>
      <td>${r.description}</td>
      <td class="font-bold text-danger">₹${r.fine.toLocaleString()}</td>
      <td class="text-xs">${r.seizure}</td>
    </tr>
  `).join('');
}

// Live Road Bulletins
function handlePostTrafficAlert(event) {
  event.preventDefault();
  const junction = document.getElementById('alertJunction').value.trim();
  const severity = document.getElementById('alertSeverity').value;
  const details = document.getElementById('alertDetails').value.trim();

  const newBulletin = {
    id: 'BUL-' + Date.now().toString().slice(-4),
    junction,
    severity,
    details,
    time: 'Just now'
  };

  appState.bulletins.unshift(newBulletin);
  labDB.set(STORAGE_KEYS.BULLETINS, appState.bulletins);

  document.getElementById('alertJunction').value = '';
  document.getElementById('alertDetails').value = '';
  showAlert('Road traffic advisory bulletin broadcasted to metropolitan navigation feed.', 'info');
  renderBulletins();
}

function renderBulletins() {
  const container = document.getElementById('trafficBulletinsList');
  if (!container) return;

  container.innerHTML = appState.bulletins.map(b => `
    <div class="bulletin-item ${b.severity.toLowerCase()}">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
        <strong>📍 ${b.junction}</strong>
        <span class="badge ${b.severity === 'Accident' ? 'badge-danger' : (b.severity === 'Congestion' ? 'badge-warning' : 'badge-primary')}">
          ${b.severity}
        </span>
      </div>
      <p class="text-sm">${b.details}</p>
      <span class="muted text-xs">Reported: ${b.time}</span>
    </div>
  `).join('');
}

// Payment & Receipt
function openPayModal(challanId) {
  const c = appState.challans.find(x => x.id === challanId);
  if (!c) return;

  document.getElementById('payChallanId').value = c.id;
  document.getElementById('payChallanIdDisplay').value = `${c.id} (${c.vehNo})`;
  document.getElementById('payOffenseDisplay').value = `${c.violation} - ${c.location}`;
  document.getElementById('payAmountDisplay').value = `₹${c.fine}.00`;

  document.getElementById('payModal').classList.remove('hidden');
}

function closePayModal() {
  document.getElementById('payModal').classList.add('hidden');
}

function handleExecutePayment(event) {
  event.preventDefault();
  const challanId = document.getElementById('payChallanId').value;
  const c = appState.challans.find(x => x.id === challanId);
  if (!c) return;

  c.status = 'Paid';
  c.txnId = 'TXN-ECHL-' + Math.floor(100000 + Math.random() * 900000);
  c.paidAt = new Date().toLocaleString();

  labDB.set(STORAGE_KEYS.CHALLANS, appState.challans);

  closePayModal();
  showAlert(`Payment Successful! Transaction ID: ${c.txnId}. Case marked as cleared.`, 'success');

  handleCitizenSearch();
  renderPoliceCases();
  renderAdminDashboard();
  openReceiptModal(c.id);
}

function openReceiptModal(challanId) {
  const c = appState.challans.find(x => x.id === challanId);
  if (!c) return;

  const content = document.getElementById('receiptContent');
  if (!content) return;

  content.innerHTML = `
    <div class="receipt-header-seal">
      <h3 style="margin: 0; color: #3b82f6;">GREATER CHENNAI TRAFFIC POLICE</h3>
      <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;">E-CHALLAN DISPOSAL RECEIPT & TREASURY TAX INVOICE</p>
      <div style="font-size: 0.75rem; color: #10b981; margin-top: 0.25rem;">STATUS: OFFICIAL TREASURY PAID</div>
    </div>

    <div class="receipt-row">
      <span>Challan Ref Number:</span>
      <strong class="font-mono">${c.id}</strong>
    </div>
    <div class="receipt-row">
      <span>Vehicle Registration:</span>
      <strong class="font-mono">${c.vehNo}</strong>
    </div>
    <div class="receipt-row">
      <span>Registered Owner:</span>
      <strong>${c.owner}</strong>
    </div>
    <div class="receipt-row">
      <span>Offense Committed:</span>
      <strong>${c.violation} (${c.section})</strong>
    </div>
    <div class="receipt-row">
      <span>Location / Sector:</span>
      <span>${c.location}</span>
    </div>

    <div class="receipt-divider"></div>

    <div class="receipt-row">
      <span>Statutory Fine Settled:</span>
      <strong style="color: #10b981; font-size: 1.15rem;">₹${c.fine}.00</strong>
    </div>
    <div class="receipt-row">
      <span>Transaction Ref ID:</span>
      <strong class="font-mono">${c.txnId}</strong>
    </div>
    <div class="receipt-row">
      <span>Date & Time Paid:</span>
      <span>${c.paidAt}</span>
    </div>

    <div class="receipt-divider"></div>
    <p style="font-size: 0.75rem; text-align: center; color: #94a3b8; margin: 0;">
      This is a digitally verified receipt generated under the Motor Vehicles (Amendment) Act. Retain for future police verification.
    </p>
  `;

  document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceiptModal() {
  document.getElementById('receiptModal').classList.add('hidden');
}

// Department Admin
function renderAdminDashboard() {
  const totalCases = appState.challans.length;
  const collectedRevenue = appState.challans
    .filter(c => c.status === 'Paid')
    .reduce((sum, c) => sum + c.fine, 0);
  const pendingRevenue = appState.challans
    .filter(c => c.status === 'Unpaid')
    .reduce((sum, c) => sum + c.fine, 0);

  const elTotal = document.getElementById('adminTotalCases');
  const elCol = document.getElementById('adminCollectedRevenue');
  const elPend = document.getElementById('adminPendingRevenue');

  if (elTotal) elTotal.innerText = totalCases;
  if (elCol) elCol.innerText = `₹${collectedRevenue.toLocaleString()}`;
  if (elPend) elPend.innerText = `₹${pendingRevenue.toLocaleString()}`;

  // Officers Table
  const officersTbody = document.getElementById('adminOfficersTableBody');
  if (officersTbody) {
    officersTbody.innerHTML = appState.officers.map(o => `
      <tr>
        <td class="font-mono font-bold">${o.badge}</td>
        <td><strong>${o.name}</strong></td>
        <td>${o.junction}</td>
        <td class="font-bold text-center">${o.casesFiled}</td>
        <td><span class="badge badge-success">${o.status}</span></td>
      </tr>
    `).join('');
  }

  // Violation Analytics
  const analyticsContainer = document.getElementById('adminCategoryReport');
  if (analyticsContainer) {
    const counts = {};
    appState.challans.forEach(c => {
      counts[c.violation] = (counts[c.violation] || 0) + 1;
    });

    analyticsContainer.innerHTML = Object.entries(counts).map(([vType, count]) => {
      const pct = Math.round((count / Math.max(1, totalCases)) * 100);
      return `
        <div class="category-bar-row">
          <div class="category-bar-label text-truncate">${vType}</div>
          <div class="category-bar-bg">
            <div class="category-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span class="font-mono font-bold text-xs">${count} (${pct}%)</span>
        </div>
      `;
    }).join('');
  }
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
