/**
 * SmartBus Pass v2 - Intelligent Transit Concession & Conductor Scanner
 * Experiment 35 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  PASSES: 'smartbus_passes_v2',
  ROUTES: 'smartbus_routes_v2',
  TICKETS: 'smartbus_tickets_v2',
  WALLET: 'smartbus_wallet_v2'
};

const DEFAULT_ROUTES = [
  {
    id: 'ROUTE-19B',
    routeNo: '19B',
    endpoints: 'Saidapet ➔ Kelambakkam (OMR Express)',
    fare: 28,
    stops: ['Saidapet Terminus', 'Guindy Estate', 'Velachery MRTS', 'SRP Tools OMR', 'Perungudi', 'Thoraipakkam', 'Sholinganallur', 'Siruseri IT Park', 'Kelambakkam'],
    currentStop: 'SRP Tools OMR',
    busNo: 'TN 01 N 8412'
  },
  {
    id: 'ROUTE-102',
    routeNo: '102',
    endpoints: 'Broadway ➔ Kelambakkam Coastal',
    fare: 32,
    stops: ['Broadway', 'Chennai Central', 'Marina Beach', 'Santhome', 'Adyar Signal', 'Thiruvanmiyur', 'Palavakkam', 'Sholinganallur', 'Kelambakkam'],
    currentStop: 'Adyar Signal',
    busNo: 'TN 01 N 9120'
  }
];

const DEFAULT_PASSES = [
  {
    id: 'PASS-v2-101',
    name: 'Divya Ramesh',
    dob: '2005-08-22',
    category: 'Govt Student',
    org: 'Govt Arts & Science College, Nandanam',
    routeNo: '19B',
    durationMonths: 1,
    validUntil: '2026-11-30',
    amountPaid: 0,
    status: 'Approved',
    qrCode: 'SMARTPASS-V2-101-GOVT-FREE'
  },
  {
    id: 'PASS-v2-102',
    name: 'Praveen Kumar',
    dob: '2004-11-14',
    category: 'Private College Student',
    org: 'Saveetha School of Engineering, SIMATS',
    routeNo: '19B',
    durationMonths: 3,
    validUntil: '2026-12-31',
    amountPaid: 1275,
    status: 'Approved',
    qrCode: 'SMARTPASS-V2-102-CLG-SUBSIDY'
  }
];

let appState = {
  currentRole: 'commuter',
  activeCommuterTab: 'myPass',
  passes: [],
  routes: [],
  tickets: [],
  walletBalance: 620
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  appState.passes = labDB.get(STORAGE_KEYS.PASSES) || DEFAULT_PASSES;
  appState.routes = labDB.get(STORAGE_KEYS.ROUTES) || DEFAULT_ROUTES;
  appState.tickets = labDB.get(STORAGE_KEYS.TICKETS) || [];

  const storedWallet = labDB.get(STORAGE_KEYS.WALLET);
  if (storedWallet !== null && storedWallet !== undefined) {
    appState.walletBalance = parseFloat(storedWallet);
  } else {
    labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  }
}

function renderApp() {
  updateWalletUI();
  populateRouteDropdowns();
  renderCommuterPasses();
  renderEtaTimeline();
  renderAdminTable();
  updateAdminMetrics();
  calculatePassTariffPreview();
}

function updateWalletUI() {
  const el = document.getElementById('commuterWalletBalance');
  if (el) el.innerText = `₹${appState.walletBalance.toFixed(2)}`;
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('commuterSection').classList.toggle('hidden', role !== 'commuter');
  document.getElementById('conductorSection').classList.toggle('hidden', role !== 'conductor');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminTable();
    updateAdminMetrics();
  } else if (role === 'conductor') {
    populateConductorStops();
  }
}

// Commuter Tabs
function switchCommuterTab(tabName) {
  appState.activeCommuterTab = tabName;
  const tabs = {
    myPass: 'comTabPass',
    apply: 'comTabApply',
    eTicket: 'comTabTicket',
    eta: 'comTabEta'
  };

  document.querySelectorAll('#commuterSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });

  if (tabName === 'apply') {
    calculatePassTariffPreview();
  } else if (tabName === 'eTicket') {
    updateETicketFare();
  } else if (tabName === 'eta') {
    renderEtaTimeline();
  }
}

function populateRouteDropdowns() {
  const passSelect = document.getElementById('passRouteChoice');
  const ticketSelect = document.getElementById('ticketRouteChoice');
  const etaSelect = document.getElementById('etaRouteChoice');

  const optionsHtml = appState.routes.map(r => `
    <option value="${r.routeNo}">${r.routeNo}: ${r.endpoints}</option>
  `).join('');

  if (passSelect) passSelect.innerHTML = optionsHtml;
  if (ticketSelect) ticketSelect.innerHTML = optionsHtml;
  if (etaSelect) etaSelect.innerHTML = optionsHtml;
}

// Commuter Passes
function renderCommuterPasses() {
  const grid = document.getElementById('commuterPassesGrid');
  if (!grid) return;

  grid.innerHTML = appState.passes.map(p => `
    <div class="pass-card-v2">
      <div class="pass-header">
        <div>
          <span class="badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}">
            ${p.status === 'Approved' ? '🟢 Valid Pass v2' : '🟡 Approval Pending'}
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
          <p><strong>Category:</strong> <span class="badge badge-secondary text-xs">${p.category}</span></p>
          <p class="text-xs muted"><strong>Org:</strong> ${p.org}</p>
          <p class="text-xs"><strong>Valid Until:</strong> <span class="font-mono font-bold text-success">${p.validUntil}</span></p>
          <p class="text-xs muted"><strong>Paid:</strong> ₹${p.amountPaid} (Duration: ${p.durationMonths} Mo)</p>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
        <button class="btn btn-outline btn-xs" onclick="downloadPassSimulated('${p.id}')">📥 Cache Pass Offline</button>
        <button class="btn btn-primary btn-xs" onclick="handleRenewPass('${p.id}')">🔄 Monthly Renew</button>
      </div>
    </div>
  `).join('');
}

function calculatePassTariffPreview() {
  const category = document.getElementById('passUserCategory')?.value || 'Govt Student';
  const duration = parseInt(document.getElementById('passDurationMonths')?.value, 10) || 1;

  const baseRatePerMonth = 850;
  const totalBase = baseRatePerMonth * duration;

  let concession = 0;
  let payable = 0;

  if (category === 'Govt Student') {
    concession = totalBase;
    payable = 0;
  } else if (category === 'Private College Student') {
    concession = totalBase * 0.5;
    payable = totalBase - concession;
  } else {
    concession = 0;
    payable = totalBase;
  }

  const baseEl = document.getElementById('passBaseTariffDisplay');
  const concEl = document.getElementById('passConcessionDisplay');
  const netEl = document.getElementById('passNetPayableDisplay');

  if (baseEl) baseEl.innerText = `₹${totalBase.toFixed(2)}`;
  if (concEl) concEl.innerText = `- ₹${concession.toFixed(2)} (${category === 'Govt Student' ? '100% Free' : (category.includes('College') ? '50% Subsidy' : '0%')})`;
  if (netEl) netEl.innerText = `₹${payable.toFixed(2)}`;
}

function handleApplyNewPass(event) {
  event.preventDefault();
  const name = document.getElementById('passApplicantName').value.trim();
  const dob = document.getElementById('passDob').value;
  const category = document.getElementById('passUserCategory').value;
  const org = document.getElementById('passOrgName').value.trim();
  const routeNo = document.getElementById('passRouteChoice').value;
  const duration = parseInt(document.getElementById('passDurationMonths').value, 10);

  const baseRate = 850 * duration;
  const payable = category === 'Govt Student' ? 0 : (category.includes('College') ? baseRate * 0.5 : baseRate);

  if (payable > appState.walletBalance) {
    showAlert(`Insufficient e-Wallet Funds! Required: ₹${payable}, Available: ₹${appState.walletBalance}`, 'danger');
    return;
  }

  appState.walletBalance -= payable;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + duration);

  const newPass = {
    id: 'PASS-v2-' + Math.floor(100 + Math.random() * 900),
    name,
    dob,
    category,
    org,
    routeNo,
    durationMonths: duration,
    validUntil: expiry.toISOString().split('T')[0],
    amountPaid: payable,
    status: 'Approved',
    qrCode: `SMARTPASS-V2-${Date.now().toString().slice(-6)}`
  };

  appState.passes.unshift(newPass);
  labDB.set(STORAGE_KEYS.PASSES, appState.passes);

  showAlert(`🎉 Smart Bus Pass Issued! Pass ID: ${newPass.id}`, 'success');
  renderCommuterPasses();
  switchCommuterTab('myPass');
  renderAdminTable();
  updateAdminMetrics();
}

function handleRenewPass(passId) {
  const p = appState.passes.find(x => x.id === passId);
  if (!p) return;

  const renewalFee = p.category === 'Govt Student' ? 0 : (p.category.includes('College') ? 425 : 850);
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
  showAlert(`Bus Pass ${p.id} renewed! New Expiry: ${p.validUntil}`, 'success');
  renderCommuterPasses();
}

function downloadPassSimulated(passId) {
  showAlert(`Pass ${passId} cached into browser storage for offline QR validation.`, 'info');
}

// Single Journey Ticket
function updateETicketFare() {
  const routeNo = document.getElementById('ticketRouteChoice').value;
  const pax = parseInt(document.getElementById('ticketPassengerCount').value, 10) || 1;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  const fare = r ? r.fare : 28;

  document.getElementById('ticketStageFareDisplay').innerText = `₹${fare.toFixed(2)}`;
  document.getElementById('ticketTotalFareDisplay').innerText = `₹${(fare * pax).toFixed(2)}`;
}

function handleBuyETicket(event) {
  event.preventDefault();
  const routeNo = document.getElementById('ticketRouteChoice').value;
  const pax = parseInt(document.getElementById('ticketPassengerCount').value, 10) || 1;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  const total = (r ? r.fare : 28) * pax;

  if (total > appState.walletBalance) {
    showAlert(`Insufficient Wallet Balance! Required ₹${total}, Available ₹${appState.walletBalance}`, 'danger');
    return;
  }

  appState.walletBalance -= total;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  const ticketObj = {
    pnr: 'TKT-v2-' + Math.floor(100 + Math.random() * 900),
    routeNo,
    pax,
    total,
    dateTime: new Date().toLocaleTimeString(),
    date: new Date().toISOString().split('T')[0]
  };

  appState.tickets.unshift(ticketObj);
  labDB.set(STORAGE_KEYS.TICKETS, appState.tickets);

  const container = document.getElementById('generatedTicketPreview');
  if (container) {
    container.innerHTML = `
      <div class="card" style="border: 2px dashed #0ea5e9; background: rgba(14, 165, 233, 0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span class="badge badge-success mb-1">✅ Confirmed v2 e-Ticket</span>
            <h3>PNR: <span class="font-mono text-primary">${ticketObj.pnr}</span></h3>
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

  showAlert(`🎟️ Transit e-Ticket issued! PNR: ${ticketObj.pnr}. Show QR to Conductor.`, 'success');
}

// ETA Telemetry
function renderEtaTimeline() {
  const routeNo = document.getElementById('etaRouteChoice').value;
  const r = appState.routes.find(x => x.routeNo === routeNo);
  if (!r) return;

  const targetSelect = document.getElementById('etaTargetStopChoice');
  if (targetSelect) {
    targetSelect.innerHTML = r.stops.map(s => `<option value="${s}">${s}</option>`).join('');
  }

  const container = document.getElementById('etaTimelineContainer');
  if (container) {
    container.innerHTML = r.stops.map((stop, idx) => `
      <div class="route-step-row ${stop === r.currentStop ? 'current-bus-spot' : ''}">
        <span class="font-mono text-xs font-bold">${idx + 1}.</span>
        <div style="flex: 1;">
          <strong>${stop}</strong>
          ${stop === r.currentStop ? '<span class="badge badge-primary text-xs ml-2">📍 Live GPS Waypoint</span>' : ''}
        </div>
        <span class="text-xs muted">${idx * 4} Mins from Terminus</span>
      </div>
    `).join('');
  }

  recalculateTargetStopEta();
}

function recalculateTargetStopEta() {
  const routeNo = document.getElementById('etaRouteChoice').value;
  const targetStop = document.getElementById('etaTargetStopChoice').value;
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

  document.getElementById('etaMinutesDisplay').innerText = typeof etaMins === 'number' ? `${etaMins} Mins` : etaMins;
  document.getElementById('etaBusHeadingText').innerText = `Bus #${r.routeNo} (${r.endpoints})`;
  document.getElementById('etaSubTextDetail').innerText = `Current Stop: ${r.currentStop} | Target Stop: ${targetStop}`;
}

// Conductor
function populateConductorStops() {
  const r = appState.routes[0];
  const select = document.getElementById('conductorStopChoice');
  if (!select || !r) return;

  select.innerHTML = r.stops.map(s => `
    <option value="${s}" ${s === r.currentStop ? 'selected' : ''}>${s}</option>
  `).join('');
}

function handleConductorVerifyCode() {
  const code = (document.getElementById('conductorInputCode').value || '').trim().toUpperCase();
  const resCard = document.getElementById('conductorResultCard');
  if (!resCard) return;

  resCard.classList.remove('hidden');

  const foundPass = appState.passes.find(p => p.id.toUpperCase() === code || p.qrCode.toUpperCase().includes(code));
  if (foundPass) {
    resCard.className = 'verification-card-result valid';
    resCard.innerHTML = `
      <div>
        <span class="badge badge-success">✅ VALID PASS - AUTHORIZED</span>
        <h4 class="mt-1">${foundPass.name} (${foundPass.category})</h4>
        <p class="text-sm">Pass Ref: <strong>${foundPass.id}</strong> | Allowed Route: <strong>${foundPass.routeNo}</strong></p>
        <p class="text-xs muted">Expiry: ${foundPass.validUntil} | Status: ${foundPass.status}</p>
      </div>
    `;
    return;
  }

  const foundTkt = appState.tickets.find(t => t.pnr.toUpperCase() === code);
  if (foundTkt) {
    resCard.className = 'verification-card-result valid';
    resCard.innerHTML = `
      <div>
        <span class="badge badge-success">✅ VALID TRANSIT TICKET</span>
        <h4 class="mt-1">PNR: ${foundTkt.pnr} (Pax: ${foundTkt.pax})</h4>
        <p class="text-sm">Route: <strong>${foundTkt.routeNo}</strong> | Fare: <strong>₹${foundTkt.total}</strong></p>
        <p class="text-xs muted">Purchased Today at ${foundTkt.dateTime}</p>
      </div>
    `;
    return;
  }

  resCard.className = 'verification-card-result invalid';
  resCard.innerHTML = `
    <div>
      <span class="badge badge-danger">❌ INVALID TOKEN</span>
      <h4 class="mt-1">No Active Record for: ${code}</h4>
      <p class="text-sm">Pass ID or Ticket PNR not found in transport authority registry.</p>
    </div>
  `;
}

function handleConductorBroadcastStop(event) {
  event.preventDefault();
  const stop = document.getElementById('conductorStopChoice').value;
  const occ = document.getElementById('conductorPassengerLoad').value;
  const r = appState.routes[0];

  r.currentStop = stop;
  labDB.set(STORAGE_KEYS.ROUTES, appState.routes);

  showAlert(`Bus #${r.routeNo} waypoint broadcasted: ${stop} (${occ})`, 'success');
  renderEtaTimeline();
}

// Admin Operations
function handleAdminCreateRoute(event) {
  event.preventDefault();
  const no = document.getElementById('adminRouteNo').value.trim().toUpperCase();
  const endpoints = document.getElementById('adminRouteEndpoints').value.trim();
  const fare = parseFloat(document.getElementById('adminRouteFare').value);
  const stops = document.getElementById('adminRouteStops').value.split(',').map(s => s.trim());

  const newRoute = {
    id: 'ROUTE-' + no,
    routeNo: no,
    endpoints,
    fare,
    stops,
    currentStop: stops[0],
    busNo: 'TN 01 N ' + Math.floor(1000 + Math.random() * 9000)
  };

  appState.routes.push(newRoute);
  labDB.set(STORAGE_KEYS.ROUTES, appState.routes);

  showAlert(`Metropolitan Route #${no} successfully registered into transit fleet!`, 'success');
  populateRouteDropdowns();
  renderEtaTimeline();
}

function renderAdminTable() {
  const tbody = document.getElementById('adminPassesTableBody');
  if (!tbody) return;

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
          <button class="btn btn-success btn-xs" onclick="adminApprovePassV2('${p.id}')">Approve</button>
        ` : `
          <span class="text-xs muted">Verified</span>
        `}
      </td>
    </tr>
  `).join('');
}

function adminApprovePassV2(passId) {
  const p = appState.passes.find(x => x.id === passId);
  if (!p) return;

  p.status = 'Approved';
  labDB.set(STORAGE_KEYS.PASSES, appState.passes);
  showAlert(`Pass ${p.id} approved.`, 'info');
  renderAdminTable();
  renderCommuterPasses();
  updateAdminMetrics();
}

function updateAdminMetrics() {
  const total = appState.passes.length;
  const free = appState.passes.filter(p => p.category === 'Govt Student').length;
  const rev = appState.passes.reduce((sum, p) => sum + p.amountPaid, 0);

  const elT = document.getElementById('adminTotalPassesCount');
  const elF = document.getElementById('adminFreePassesCount');
  const elR = document.getElementById('adminTotalWalletRevenue');

  if (elT) elT.innerText = total;
  if (elF) elF.innerText = free;
  if (elR) elR.innerText = `₹${rev.toLocaleString()}`;
}

// Top Up Modal
function openWalletTopUpModal() {
  document.getElementById('walletTopUpModal').classList.remove('hidden');
}

function closeWalletTopUpModal() {
  document.getElementById('walletTopUpModal').classList.add('hidden');
}

function handleWalletTopUpSubmit(event) {
  event.preventDefault();
  const amt = parseFloat(document.getElementById('walletAmountInput').value) || 0;
  if (amt <= 0) return;

  appState.walletBalance += amt;
  labDB.set(STORAGE_KEYS.WALLET, appState.walletBalance);
  updateWalletUI();

  closeWalletTopUpModal();
  showAlert(`Added ₹${amt.toFixed(2)} to SmartBus e-Wallet!`, 'success');
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
