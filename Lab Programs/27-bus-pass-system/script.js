/**
 * SmartPass - Metropolitan Bus Pass & Concession Management System
 * Experiment 27 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  PASSES: 'buspass_passes_v1',
  ROUTES: 'buspass_routes_v1',
  TICKETS: 'buspass_tickets_v1',
  WALLET: 'buspass_wallet_v1'
};

const DEFAULT_ROUTES = [
  {
    id: 'ROUTE-21G',
    routeNo: '21G',
    origin: 'Broadway Terminus',
    destination: 'Tambaram West',
    timings: '05:00 AM - 11:15 PM',
    stageFare: 25,
    stops: ['Broadway', 'Chennai Central', 'LIC Anna Salai', 'DMS Teynampet', 'Saidapet', 'Guindy', 'Kathipara Junction', 'Chennai Airport', 'Chromepet', 'Tambaram West'],
    currentStop: 'Kathipara Junction',
    busNo: 'TN 01 N 9410'
  },
  {
    id: 'ROUTE-570',
    routeNo: '570',
    origin: 'CMBT Koyambedu',
    destination: 'Kelambakkam (OMR)',
    timings: '05:30 AM - 10:45 PM',
    stageFare: 30,
    stops: ['CMBT Koyambedu', 'Vadapalani', 'Guindy Estate', 'Velachery MRTS', 'SRP Tools OMR', 'Thoraipakkam', 'Sholinganallur', 'Siruseri SIPCOT', 'Kelambakkam'],
    currentStop: 'SRP Tools OMR',
    busNo: 'TN 01 N 6120'
  },
  {
    id: 'ROUTE-70V',
    routeNo: '70V',
    origin: 'Koyambedu CMBT',
    destination: 'Vandalur Zoo (GST Road)',
    timings: '06:00 AM - 10:00 PM',
    stageFare: 20,
    stops: ['Koyambedu', 'Ashok Nagar', 'Guindy', 'Kathipara', 'Chromepet', 'Tambaram', 'Perungalathur', 'Vandalur Zoo'],
    currentStop: 'Guindy',
    busNo: 'TN 01 N 7855'
  }
];

const DEFAULT_PASSES = [
  {
    id: 'PASS-8812',
    name: 'K. Vignesh',
    dob: '2008-04-12',
    category: 'Govt Student',
    org: 'Govt Higher Secondary School, Tambaram',
    routeNo: '21G',
    durationMonths: 1,
    validUntil: '2026-11-30',
    amountPaid: 0,
    status: 'Approved',
    qrCode: 'SMARTPASS-TN-8812-GOVT-FREE'
  },
  {
    id: 'PASS-9021',
    name: 'Ananya S.',
    dob: '2004-09-18',
    category: 'College Student',
    org: 'Anna University, Guindy',
    routeNo: '570',
    durationMonths: 3,
    validUntil: '2026-12-31',
    amountPaid: 450,
    status: 'Approved',
    qrCode: 'SMARTPASS-TN-9021-CLG-SUBSIDY'
  },
  {
    id: 'PASS-9104',
    name: 'G. Karthikeyan',
    dob: '1996-02-14',
    category: 'Route Employee',
    org: 'TCS Siruseri OMR',
    routeNo: '570',
    durationMonths: 1,
    validUntil: '2026-10-31',
    amountPaid: 900,
    status: 'Pending',
    qrCode: 'SMARTPASS-TN-9104-EMP-ROUTE'
  }
];

let appState = {
  currentRole: 'user',
  activeUserTab: 'myPasses',
  passes: [],
  routes: [],
  tickets: [],
  walletBalance: 450
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedPasses = labDB.get(STORAGE_KEYS.PASSES);
  if (!storedPasses || storedPasses.length === 0) {
    labDB.set(STORAGE_KEYS.PASSES, DEFAULT_PASSES);
    appState.passes = [...DEFAULT_PASSES];
  } else {
    appState.passes = storedPasses;
  }

  const storedRoutes = labDB.get(STORAGE_KEYS.ROUTES);
  if (!storedRoutes || storedRoutes.length === 0) {
    labDB.set(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);
    appState.routes = [...DEFAULT_ROUTES];
  } else {
    appState.routes = storedRoutes;
  }

  const storedWallet = labDB.get(STORAGE_KEYS.WALLET);
  if (storedWallet !== null && storedWallet !== undefined) {
    appState.walletBalance = parseFloat(storedWallet);
  } else {
    labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  }

  appState.tickets = labDB.get(STORAGE_KEYS.TICKETS) || [];
}

function renderApp() {
  updateWalletUI();
  populateRouteDropdowns();
  renderUserPasses();
  renderRouteTimeline();
  renderAdminTable();
  updateAdminMetrics();
}

function updateWalletUI() {
  const el = document.getElementById('userWalletBalance');
  if (el) el.innerText = `₹${appState.walletBalance.toFixed(2)}`;
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('userSection').classList.toggle('hidden', role !== 'user');
  document.getElementById('conductorSection').classList.toggle('hidden', role !== 'conductor');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminTable();
    updateAdminMetrics();
  } else if (role === 'conductor') {
    populateConductorStops();
  }
}

// User Tab Switching
function switchUserTab(tabName) {
  appState.activeUserTab = tabName;
  const tabs = {
    myPasses: 'userTabPasses',
    applyPass: 'userTabApply',
    buyTicket: 'userTabTicket',
    liveEta: 'userTabEta'
  };

  document.querySelectorAll('#userSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });

  if (tabName === 'applyPass') {
    calculatePassTariff();
  } else if (tabName === 'buyTicket') {
    updateTicketFare();
  } else if (tabName === 'liveEta') {
    renderRouteTimeline();
  }
}

function populateRouteDropdowns() {
  const applySelect = document.getElementById('applyRouteSelect');
  const ticketSelect = document.getElementById('ticketRouteSelect');
  const etaSelect = document.getElementById('etaRouteSelect');

  const optionsHtml = appState.routes.map(r => `
    <option value="${r.routeNo}">${r.routeNo}: ${r.origin} ➔ ${r.destination}</option>
  `).join('');

  if (applySelect) applySelect.innerHTML = optionsHtml;
  if (ticketSelect) ticketSelect.innerHTML = optionsHtml;
  if (etaSelect) etaSelect.innerHTML = optionsHtml;
}

// Commuter Passes
function renderUserPasses() {
  const grid = document.getElementById('userPassesGrid');
  if (!grid) return;

  grid.innerHTML = appState.passes.map(p => `
    <div class="pass-card ${p.status === 'Approved' ? 'active-pass' : 'pending-pass'}">
      <div class="pass-header">
        <div>
          <span class="badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}">
            ${p.status === 'Approved' ? '🟢 Valid Pass' : '🟡 Approval Pending'}
          </span>
          <h4 class="font-mono mt-1">${p.id}</h4>
        </div>
        <div class="text-right">
          <span class="muted text-xs block">ROUTE</span>
          <span class="font-bold text-primary font-mono">${p.routeNo}</span>
        </div>
      </div>

      <div class="pass-body">
        <div class="pass-qr-box">
          <div class="qr-code-art">
            ███ █ ███<br>
            █ █ █ █ █<br>
            ███ █ ███<br>
            ██ █ ██ █<br>
            ███ █ █ █
          </div>
          <span class="font-mono text-xs font-bold mt-1">${p.id}</span>
        </div>

        <div class="pass-details-col">
          <p><strong>Candidate:</strong> ${p.name}</p>
          <p><strong>Type:</strong> <span class="badge badge-secondary text-xs">${p.category}</span></p>
          <p class="text-xs muted"><strong>Org:</strong> ${p.org}</p>
          <p class="text-xs"><strong>Valid Until:</strong> <span class="font-mono font-bold text-success">${p.validUntil}</span></p>
          <p class="text-xs muted"><strong>Paid:</strong> ₹${p.amountPaid} (Duration: ${p.durationMonths} Mo)</p>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
        <button class="btn btn-outline btn-xs" onclick="downloadPassSimulated('${p.id}')">📥 Save Digital Pass</button>
        <button class="btn btn-primary btn-xs" onclick="handleRenewPass('${p.id}')">🔄 Monthly Renew</button>
      </div>
    </div>
  `).join('');
}

function calculatePassTariff() {
  const type = document.getElementById('applyPassType').value;
  const duration = parseInt(document.getElementById('applyDuration').value, 10);

  const baseRatePerMonth = 800;
  const totalBase = baseRatePerMonth * duration;

  let concession = 0;
  let payable = 0;

  if (type === 'Govt Student') {
    concession = totalBase;
    payable = 0;
  } else if (type === 'College Student') {
    concession = totalBase * 0.5;
    payable = totalBase - concession;
  } else {
    concession = 0;
    payable = totalBase;
  }

  document.getElementById('applyBaseTariff').innerText = `₹${totalBase.toFixed(2)}`;
  document.getElementById('applyConcessionAmount').innerText = `- ₹${concession.toFixed(2)} (${type === 'Govt Student' ? '100% Free' : (type === 'College Student' ? '50% Subsidy' : '0%')})`;
  document.getElementById('applyNetPayable').innerText = `₹${payable.toFixed(2)}`;
}

function handleApplyBusPass(event) {
  event.preventDefault();

  const name = document.getElementById('applyFullName').value.trim();
  const dob = document.getElementById('applyDob').value;
  const category = document.getElementById('applyPassType').value;
  const org = document.getElementById('applyOrgName').value.trim();
  const routeNo = document.getElementById('applyRouteSelect').value;
  const duration = parseInt(document.getElementById('applyDuration').value, 10);

  const baseRatePerMonth = 800;
  const totalBase = baseRatePerMonth * duration;
  let payable = category === 'Govt Student' ? 0 : (category === 'College Student' ? totalBase * 0.5 : totalBase);

  if (payable > appState.walletBalance) {
    showAlert(`Insufficient Wallet Balance! Required: ₹${payable}, Available: ₹${appState.walletBalance}. Please add money.`, 'danger');
    return;
  }

  // Deduct from wallet
  appState.walletBalance -= payable;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  // Expiry calculation
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + duration);

  const newPass = {
    id: 'PASS-' + Math.floor(1000 + Math.random() * 9000),
    name,
    dob,
    category,
    org,
    routeNo,
    durationMonths: duration,
    validUntil: expiry.toISOString().split('T')[0],
    amountPaid: payable,
    status: category === 'Govt Student' ? 'Approved' : 'Approved',
    qrCode: `SMARTPASS-TN-${Date.now().toString().slice(-6)}`
  };

  appState.passes.unshift(newPass);
  labDB.set(STORAGE_KEYS.PASSES, appState.passes);

  showAlert(`🎉 Bus Pass Applied Successfully! Issued Pass ID: ${newPass.id}`, 'success');
  renderUserPasses();
  switchUserTab('myPasses');
  renderAdminTable();
  updateAdminMetrics();
}

function handleRenewPass(passId) {
  const p = appState.passes.find(x => x.id === passId);
  if (!p) return;

  const renewalFee = p.category === 'Govt Student' ? 0 : (p.category === 'College Student' ? 400 : 800);
  if (renewalFee > appState.walletBalance) {
    showAlert(`Insufficient wallet funds for renewal. Required: ₹${renewalFee}`, 'danger');
    return;
  }

  appState.walletBalance -= renewalFee;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  const curDate = new Date(p.validUntil);
  curDate.setMonth(curDate.getMonth() + 1);
  p.validUntil = curDate.toISOString().split('T')[0];
  p.status = 'Approved';

  labDB.set(STORAGE_KEYS.PASSES, appState.passes);
  showAlert(`Bus Pass ${p.id} renewed for 1 Month! New Expiry: ${p.validUntil}`, 'success');
  renderUserPasses();
}

function downloadPassSimulated(passId) {
  showAlert(`Digital Bus Pass ${passId} with QR code saved to offline cache.`, 'info');
}

// Single-Journey e-Ticket
function updateTicketFare() {
  const routeNo = document.getElementById('ticketRouteSelect').value;
  const pax = parseInt(document.getElementById('ticketPax').value, 10) || 1;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  const fare = r ? r.stageFare : 25;

  document.getElementById('ticketSingleFare').innerText = `₹${fare.toFixed(2)}`;
  document.getElementById('ticketTotalFare').innerText = `₹${(fare * pax).toFixed(2)}`;
}

function handleBuyTicket(event) {
  event.preventDefault();
  const routeNo = document.getElementById('ticketRouteSelect').value;
  const pax = parseInt(document.getElementById('ticketPax').value, 10) || 1;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  const total = (r ? r.stageFare : 25) * pax;

  if (total > appState.walletBalance) {
    showAlert(`Insufficient Wallet Balance! Required ₹${total}, Available ₹${appState.walletBalance}`, 'danger');
    return;
  }

  appState.walletBalance -= total;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  const ticketObj = {
    pnr: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
    routeNo,
    pax,
    total,
    dateTime: new Date().toLocaleTimeString(),
    date: new Date().toISOString().split('T')[0]
  };

  appState.tickets.unshift(ticketObj);
  labDB.set(STORAGE_KEYS.TICKETS, appState.tickets);

  const container = document.getElementById('issuedTicketContainer');
  if (container) {
    container.innerHTML = `
      <div class="card" style="border: 2px dashed #10b981; background: rgba(16, 185, 129, 0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span class="badge badge-success mb-1">✅ Confirmed e-Ticket</span>
            <h3>PNR: <span class="font-mono">${ticketObj.pnr}</span></h3>
            <p class="muted">Route: <strong>${ticketObj.routeNo}</strong> | Passengers: <strong>${ticketObj.pax}</strong></p>
            <p class="text-xs muted">Issued: ${ticketObj.dateTime} | Valid for 2 Hours</p>
          </div>
          <div class="pass-qr-box">
            <div class="qr-code-art">
              ███ █ ███<br>
              █ █ █ █ █<br>
              ███ █ ███
            </div>
            <span class="font-mono text-xs font-bold mt-1">${ticketObj.pnr}</span>
          </div>
        </div>
      </div>
    `;
  }

  showAlert(`🎟️ e-Ticket issued! PNR: ${ticketObj.pnr}. Show QR to Conductor.`, 'success');
}

// ETA Calculation
function renderRouteTimeline() {
  const routeNo = document.getElementById('etaRouteSelect').value;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  if (!r) return;

  const targetSelect = document.getElementById('etaTargetStopSelect');
  if (targetSelect) {
    targetSelect.innerHTML = r.stops.map(s => `<option value="${s}">${s}</option>`).join('');
  }

  const container = document.getElementById('routeTimelineContainer');
  if (container) {
    container.innerHTML = r.stops.map((stop, idx) => `
      <div class="route-step-row ${stop === r.currentStop ? 'current-bus-spot' : ''}">
        <span class="font-mono text-xs font-bold">${idx + 1}.</span>
        <div style="flex: 1;">
          <strong>${stop}</strong>
          ${stop === r.currentStop ? '<span class="badge badge-success text-xs ml-2">📍 Bus Current Waypoint</span>' : ''}
        </div>
        <span class="text-xs muted">${idx * 4} Mins from Terminus</span>
      </div>
    `).join('');
  }

  calculateTargetStopEta();
}

function calculateTargetStopEta() {
  const routeNo = document.getElementById('etaRouteSelect').value;
  const targetStop = document.getElementById('etaTargetStopSelect').value;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  if (!r) return;

  const curIdx = r.stops.indexOf(r.currentStop);
  const targetIdx = r.stops.indexOf(targetStop);

  let etaMins = 0;
  if (targetIdx >= curIdx) {
    etaMins = Math.max(2, (targetIdx - curIdx) * 4);
  } else {
    etaMins = 'Bus Passed Stop';
  }

  document.getElementById('etaEstimatedMinutes').innerText = typeof etaMins === 'number' ? `${etaMins} Mins` : etaMins;
  document.getElementById('etaBusHeading').innerText = `Bus #${r.routeNo} (${r.origin} ➔ ${r.destination})`;
  document.getElementById('etaSubText').innerText = `Current Waypoint: ${r.currentStop} | Target Stop: ${targetStop}`;
}

// Conductor Functions
function populateConductorStops() {
  const r = appState.routes[0];
  const select = document.getElementById('conductorStopSelect');
  if (!select || !r) return;

  select.innerHTML = r.stops.map(s => `
    <option value="${s}" ${s === r.currentStop ? 'selected' : ''}>${s}</option>
  `).join('');
}

function handleConductorVerify() {
  const code = (document.getElementById('conductorInputCode').value || '').trim().toUpperCase();
  const resBox = document.getElementById('conductorVerificationResult');
  if (!resBox) return;

  resBox.classList.remove('hidden');

  // Check in Passes
  const foundPass = appState.passes.find(p => p.id.toUpperCase() === code || p.qrCode.toUpperCase().includes(code));
  if (foundPass) {
    resBox.className = 'verification-card-result valid';
    resBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span class="badge badge-success">✅ VALID PASS - AUTHORIZED</span>
          <h4 class="mt-1">${foundPass.name} (${foundPass.category})</h4>
          <p class="text-sm">Pass Ref: <strong>${foundPass.id}</strong> | Allowed Route: <strong>${foundPass.routeNo}</strong></p>
          <p class="text-xs muted">Expiry: ${foundPass.validUntil} | Status: ${foundPass.status}</p>
        </div>
        <div style="font-size: 2.5rem;">👨‍🎓</div>
      </div>
    `;
    return;
  }

  // Check in Tickets
  const foundTkt = appState.tickets.find(t => t.pnr.toUpperCase() === code);
  if (foundTkt) {
    resBox.className = 'verification-card-result valid';
    resBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span class="badge badge-success">✅ VALID SINGLE TICKET</span>
          <h4 class="mt-1">PNR: ${foundTkt.pnr} (Pax: ${foundTkt.pax})</h4>
          <p class="text-sm">Route: <strong>${foundTkt.routeNo}</strong> | Fare Paid: <strong>₹${foundTkt.total}</strong></p>
          <p class="text-xs muted">Purchased Today at ${foundTkt.dateTime}</p>
        </div>
        <div style="font-size: 2.5rem;">🎟️</div>
      </div>
    `;
    return;
  }

  // Invalid
  resBox.className = 'verification-card-result invalid';
  resBox.innerHTML = `
    <div>
      <span class="badge badge-danger">❌ INVALID / EXPIRED CREDENTIAL</span>
      <h4 class="mt-1">No Active Record for: ${code}</h4>
      <p class="text-sm">Pass ID or Ticket PNR not found in transport authority registry. Issue standard spot penalty.</p>
    </div>
  `;
}

function handleConductorUpdateStop(event) {
  event.preventDefault();
  const stop = document.getElementById('conductorStopSelect').value;
  const occ = document.getElementById('conductorOccupancy').value;
  const r = appState.routes[0];

  r.currentStop = stop;
  labDB.set(STORAGE_KEYS.ROUTES, appState.routes);

  showAlert(`Bus #${r.routeNo} location updated to: ${stop} (${occ})`, 'success');
  renderRouteTimeline();
}

// Admin Functions
function updateAdminMetrics() {
  const total = appState.passes.length;
  const free = appState.passes.filter(p => p.category === 'Govt Student').length;
  const totalRevenue = appState.passes.reduce((sum, p) => sum + p.amountPaid, 0);

  const elT = document.getElementById('adminTotalPasses');
  const elF = document.getElementById('adminFreePasses');
  const elR = document.getElementById('adminTotalRevenue');

  if (elT) elT.innerText = total;
  if (elF) elF.innerText = free;
  if (elR) elR.innerText = `₹${totalRevenue.toLocaleString()}`;
}

function renderAdminTable() {
  const tbody = document.getElementById('adminPassesTableBody');
  if (tbody) {
    tbody.innerHTML = appState.passes.map(p => `
      <tr>
        <td class="font-mono font-bold">${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge badge-secondary text-xs">${p.category}</span></td>
        <td class="text-xs">${p.org}</td>
        <td class="font-mono font-bold">${p.routeNo}</td>
        <td class="font-mono text-xs">${p.validUntil}</td>
        <td><span class="badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
        <td>
          ${p.status !== 'Approved' ? `
            <button class="btn btn-success btn-xs" onclick="adminApprovePass('${p.id}')">Approve</button>
          ` : `
            <span class="text-xs muted">Verified</span>
          `}
        </td>
      </tr>
    `).join('');
  }

  const routesTbody = document.getElementById('adminRoutesTableBody');
  if (routesTbody) {
    routesTbody.innerHTML = appState.routes.map(r => `
      <tr>
        <td class="font-mono font-bold text-primary">${r.routeNo}</td>
        <td><strong>${r.origin}</strong> ➔ <strong>${r.destination}</strong></td>
        <td class="text-xs">${r.timings}</td>
        <td class="text-xs">${r.stops.join(' ➔ ')}</td>
        <td class="font-mono font-bold text-success">₹${r.stageFare}</td>
      </tr>
    `).join('');
  }
}

function adminApprovePass(passId) {
  const p = appState.passes.find(x => x.id === passId);
  if (!p) return;

  p.status = 'Approved';
  labDB.set(STORAGE_KEYS.PASSES, appState.passes);

  showAlert(`Pass ${p.id} approved by transport directorate.`, 'info');
  renderAdminTable();
  renderUserPasses();
  updateAdminMetrics();
}

// Wallet Modal
function openAddMoneyModal() {
  document.getElementById('addMoneyModal').classList.remove('hidden');
}

function closeAddMoneyModal() {
  document.getElementById('addMoneyModal').classList.add('hidden');
}

function handleAddMoneySubmit(event) {
  event.preventDefault();
  const amt = parseFloat(document.getElementById('walletTopUpInput').value) || 0;
  if (amt <= 0) return;

  appState.walletBalance += amt;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  closeAddMoneyModal();
  showAlert(`Added ₹${amt.toFixed(2)} to SmartPass e-Wallet!`, 'success');
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
