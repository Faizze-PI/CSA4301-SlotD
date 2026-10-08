// EasyToll Management System Script

const DEFAULT_PLAZAS = [
  { id: 'PLZ-1', name: 'Sriperumbudur Toll Plaza', highway: 'NH-48 (Chennai - Bengaluru)', car: 85, lcv: 135, truck: 280, multi: 435, status: 'Active' },
  { id: 'PLZ-2', name: 'Paranur Toll Plaza', highway: 'GST Road / NH-45 (Chennai - Trichy)', car: 70, lcv: 115, truck: 230, multi: 360, status: 'Active' },
  { id: 'PLZ-3', name: 'Nemili Toll Plaza', highway: 'NH-4 (Walajapet Section)', car: 90, lcv: 145, truck: 295, multi: 455, status: 'Active' },
  { id: 'PLZ-4', name: 'Vanagaram Toll Plaza', highway: 'Chennai Bypass Corridor', car: 55, lcv: 90, truck: 180, multi: 285, status: 'Active' }
];

const DEFAULT_PASSES = [
  {
    id: 'ET-PASS-901',
    applicant: 'Rajesh Kumar',
    phone: '+91 98401 23456',
    vehicleNo: 'TN 09 CB 8472',
    vehicleClass: 'Car',
    plazaId: 'PLZ-1',
    plazaName: 'Sriperumbudur Toll Plaza',
    type: 'monthly_unlimited',
    fee: 1200,
    status: 'Approved',
    appliedDate: '2026-10-01',
    validUntil: '2026-10-31',
    qrCode: 'ET-PASS-901'
  },
  {
    id: 'ET-PASS-902',
    applicant: 'Ananya Ramesh',
    phone: '+91 94440 88219',
    vehicleNo: 'TN 07 AX 4310',
    vehicleClass: 'Car',
    plazaId: 'PLZ-2',
    plazaName: 'Paranur Toll Plaza',
    type: 'local_resident',
    fee: 350,
    status: 'Pending',
    appliedDate: '2026-10-05',
    validUntil: '2026-11-04',
    qrCode: 'ET-PASS-902'
  }
];

const DEFAULT_TICKETS = [
  {
    id: 'ET-TKT-1081',
    vehicleNo: 'TN 09 CB 8472',
    vehicleType: 'Car',
    plazaId: 'PLZ-1',
    plazaName: 'Sriperumbudur Toll Plaza',
    tripType: 'single',
    amount: 85,
    issuedAt: new Date(Date.now() - 3600000).toLocaleString(),
    status: 'Active',
    qrCode: 'ET-TKT-1081'
  }
];

const DEFAULT_CROSSINGS = [
  {
    time: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    vehicleNo: 'TN 22 BZ 5109',
    token: 'ET-TKT-1050',
    classification: 'Car',
    fare: 85,
    decision: 'Cleared',
    plazaName: 'Sriperumbudur Toll Plaza'
  },
  {
    time: new Date(Date.now() - 14400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    vehicleNo: 'TN 09 CB 8472',
    token: 'ET-PASS-901',
    classification: 'Car (Pass)',
    fare: 0,
    decision: 'Cleared (Monthly Pass)',
    plazaName: 'Sriperumbudur Toll Plaza'
  }
];

// App State
let currentRole = 'user';
let currentUserTab = 'buyTicket';
let currentAdminTab = 'passes';
let currentOperatorPlazaId = 'PLZ-1';
let verifiedItem = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderPlazaSelects();
  updateWalletDisplay();
  calculateTicketFare();
  calculatePassFee();
  renderUserPasses();
  renderUserHistory();
  renderOperatorConsole();
  renderAdminDashboard();
});

function initStorage() {
  if (!labDB.get('easytoll_plazas')) labDB.set('easytoll_plazas', DEFAULT_PLAZAS);
  if (!labDB.get('easytoll_passes')) labDB.set('easytoll_passes', DEFAULT_PASSES);
  if (!labDB.get('easytoll_tickets')) labDB.set('easytoll_tickets', DEFAULT_TICKETS);
  if (!labDB.get('easytoll_crossings')) labDB.set('easytoll_crossings', DEFAULT_CROSSINGS);
  if (labDB.get('easytoll_wallet') === null) labDB.set('easytoll_wallet', 1450);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('userSection').classList.toggle('hidden', role !== 'user');
  document.getElementById('operatorSection').classList.toggle('hidden', role !== 'operator');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'user') {
    updateWalletDisplay();
    renderUserPasses();
    renderUserHistory();
  } else if (role === 'operator') {
    renderOperatorConsole();
  } else if (role === 'admin') {
    renderAdminDashboard();
  }
}

// User Tabs
function switchUserTab(tab) {
  currentUserTab = tab;
  const tabIds = ['buyTicket', 'tollPasses', 'applyPass', 'history'];
  tabIds.forEach(t => {
    const pane = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#userSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });
}

// Admin Tabs
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['passes', 'plazas', 'audit'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });
}

// Wallet Operations
function updateWalletDisplay() {
  const bal = parseFloat(labDB.get('easytoll_wallet') || 0);
  const el = document.getElementById('userWalletBalance');
  if (el) el.textContent = `₹${bal.toFixed(2)}`;
}

function openTopUpModal() {
  document.getElementById('topUpModal').classList.remove('hidden');
}

function closeTopUpModal() {
  document.getElementById('topUpModal').classList.add('hidden');
}

function setTopUpAmount(val) {
  document.getElementById('topUpAmountInput').value = val;
}

function handleTopUpWallet(e) {
  e.preventDefault();
  const amt = parseFloat(document.getElementById('topUpAmountInput').value);
  if (amt <= 0 || isNaN(amt)) return;
  const current = parseFloat(labDB.get('easytoll_wallet') || 0);
  labDB.set('easytoll_wallet', current + amt);
  updateWalletDisplay();
  closeTopUpModal();
  showAlert(`e-Wallet successfully credited with ₹${amt.toFixed(2)}! New Balance: ₹${(current + amt).toFixed(2)}`, 'success');
}

// Plazas Population
function renderPlazaSelects() {
  const plazas = labDB.get('easytoll_plazas') || [];
  const ticketSelect = document.getElementById('ticketPlaza');
  const passSelect = document.getElementById('passPlaza');
  const opSelect = document.getElementById('operatorPlazaSelector');

  const optionsHtml = plazas.map(p => `<option value="${p.id}">${p.name} (${p.highway})</option>`).join('');
  if (ticketSelect) ticketSelect.innerHTML = optionsHtml;
  if (passSelect) passSelect.innerHTML = optionsHtml;
  if (opSelect) opSelect.innerHTML = optionsHtml;
}

// Fare Calculation
function calculateTicketFare() {
  const plazaId = document.getElementById('ticketPlaza').value;
  const vType = document.getElementById('ticketVehicleType').value;
  const trip = document.getElementById('ticketTripType').value;

  const plazas = labDB.get('easytoll_plazas') || [];
  const plaza = plazas.find(p => p.id === plazaId) || plazas[0];

  let baseRate = 80;
  if (plaza) {
    if (vType === 'Car') baseRate = plaza.car;
    else if (vType === 'LCV') baseRate = plaza.lcv;
    else if (vType === 'Truck') baseRate = plaza.truck;
    else if (vType === 'MultiAxle') baseRate = plaza.multi;
  }

  let total = baseRate;
  let discount = 0;
  if (trip === 'return') {
    // Return journey standard concession is 1.5x single fare
    total = Math.round(baseRate * 1.5);
    discount = (baseRate * 2) - total;
  }

  document.getElementById('previewBaseFare').textContent = `₹${(trip === 'return' ? baseRate * 2 : baseRate).toFixed(2)}`;
  document.getElementById('previewDiscount').textContent = `₹${discount.toFixed(2)}`;
  document.getElementById('previewTotalFare').textContent = `₹${total.toFixed(2)}`;
  return total;
}

function calculatePassFee() {
  const vType = document.getElementById('passVehicleClass').value;
  const passType = document.getElementById('passType').value;

  let fee = 1200;
  if (passType === 'monthly_unlimited') {
    fee = vType === 'Car' ? 1200 : vType === 'LCV' ? 1900 : 3400;
  } else if (passType === 'trips_50') {
    fee = vType === 'Car' ? 1600 : vType === 'LCV' ? 2400 : 4500;
  } else if (passType === 'local_resident') {
    fee = 350; // Flat local resident rate
  }

  document.getElementById('passCalculatedFee').value = `₹${fee.toFixed(2)}`;
  return fee;
}

// Handle Buy Ticket
function handleBuyTicket(e) {
  e.preventDefault();
  const plazaId = document.getElementById('ticketPlaza').value;
  const vNo = document.getElementById('ticketVehicleNo').value.trim().toUpperCase();
  const vType = document.getElementById('ticketVehicleType').value;
  const tripType = document.getElementById('ticketTripType').value;
  const payMethod = document.getElementById('ticketPayMethod').value;
  const fare = calculateTicketFare();

  const plazas = labDB.get('easytoll_plazas') || [];
  const plaza = plazas.find(p => p.id === plazaId);

  // Check wallet balance if wallet payment
  if (payMethod === 'wallet') {
    const bal = parseFloat(labDB.get('easytoll_wallet') || 0);
    if (bal < fare) {
      showAlert(`Insufficient e-Wallet balance (₹${bal.toFixed(2)}). Need ₹${fare.toFixed(2)}. Please top up.`, 'danger');
      return;
    }
    labDB.set('easytoll_wallet', bal - fare);
    updateWalletDisplay();
  }

  const tktId = `ET-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: tktId,
    vehicleNo: vNo,
    vehicleType: vType,
    plazaId: plazaId,
    plazaName: plaza ? plaza.name : 'Highway Plaza',
    tripType: tripType,
    amount: fare,
    issuedAt: new Date().toLocaleString(),
    status: 'Active',
    qrCode: tktId
  };

  const tickets = labDB.get('easytoll_tickets') || [];
  tickets.unshift(newTicket);
  labDB.set('easytoll_tickets', tickets);

  // Render in Latest Ticket Display
  renderLatestTicket(newTicket);
  renderUserHistory();
  renderOperatorConsole();
  renderAdminDashboard();
  showAlert(`e-Ticket generated successfully! Token: ${tktId}`, 'success');
}

function renderLatestTicket(tkt) {
  const container = document.getElementById('latestTicketDisplay');
  const qrSvg = generateDeterministicQR(tkt.id);

  container.innerHTML = `
    <div class="ticket-card">
      <div class="ticket-header">
        <div>
          <strong style="color: #60a5fa;">EASYTOLL EXPRESS TICKET</strong>
          <div class="muted text-xs">Token: ${tkt.id}</div>
        </div>
        <span class="badge badge-success">VALID</span>
      </div>

      <div class="qr-wrapper">
        ${qrSvg}
      </div>
      <p class="text-center font-mono font-bold my-1" style="color: #3b82f6;">${tkt.id}</p>

      <div class="ticket-detail-grid mt-3">
        <div>
          <span class="label">Vehicle No:</span>
          <span class="value">${tkt.vehicleNo} (${tkt.vehicleType})</span>
        </div>
        <div>
          <span class="label">Plaza:</span>
          <span class="value">${tkt.plazaName}</span>
        </div>
        <div>
          <span class="label">Journey Type:</span>
          <span class="value">${tkt.tripType === 'return' ? 'Return Journey' : 'Single Way'}</span>
        </div>
        <div>
          <span class="label">Fare Paid:</span>
          <span class="value">₹${tkt.amount.toFixed(2)}</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm btn-block mt-3" onclick="window.print()">🖨️ Print / Save PDF Receipt</button>
    </div>
  `;
}

// Handle Pass Application
function handleApplyPass(e) {
  e.preventDefault();
  const applicant = document.getElementById('passApplicant').value.trim();
  const phone = document.getElementById('passPhone').value.trim();
  const vNo = document.getElementById('passVehicleNo').value.trim().toUpperCase();
  const vClass = document.getElementById('passVehicleClass').value;
  const plazaId = document.getElementById('passPlaza').value;
  const passType = document.getElementById('passType').value;
  const fee = calculatePassFee();

  const plazas = labDB.get('easytoll_plazas') || [];
  const plaza = plazas.find(p => p.id === plazaId);

  const passId = `ET-PASS-${Math.floor(100 + Math.random() * 900)}`;
  const validDate = new Date();
  validDate.setDate(validDate.getDate() + (passType === 'trips_50' ? 60 : 30));

  const newPass = {
    id: passId,
    applicant,
    phone,
    vehicleNo: vNo,
    vehicleClass: vClass,
    plazaId,
    plazaName: plaza ? plaza.name : 'Toll Plaza',
    type: passType,
    fee: fee,
    status: 'Pending', // Pending admin approval
    appliedDate: new Date().toISOString().split('T')[0],
    validUntil: validDate.toISOString().split('T')[0],
    qrCode: passId
  };

  const passes = labDB.get('easytoll_passes') || [];
  passes.push(newPass);
  labDB.set('easytoll_passes', passes);

  showAlert(`Pass application ${passId} submitted! Waiting for Admin verification and approval.`, 'info');
  switchUserTab('tollPasses');
  renderUserPasses();
  renderAdminDashboard();
}

// Render User Passes
function renderUserPasses() {
  const container = document.getElementById('userPassesGrid');
  const passes = labDB.get('easytoll_passes') || [];

  if (passes.length === 0) {
    container.innerHTML = `<p class="muted">No toll passes found. Apply for one to get instant highway access.</p>`;
    return;
  }

  container.innerHTML = passes.map(p => {
    const isApproved = p.status === 'Approved';
    const qrSvg = isApproved ? generateDeterministicQR(p.qrCode) : '';
    const passTypeName = p.type === 'monthly_unlimited' ? 'Monthly Unlimited Pass' : p.type === 'trips_50' ? '50-Trips FastPass' : 'Local Resident Pass';

    return `
      <div class="pass-card ${isApproved ? 'active' : ''}">
        <div class="pass-header">
          <div>
            <h4 style="margin: 0;">${passTypeName}</h4>
            <span class="muted text-xs font-mono">${p.id}</span>
          </div>
          <span class="badge ${isApproved ? 'badge-success' : p.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">${p.status}</span>
        </div>

        <div style="font-size: 0.85rem; line-height: 1.6;">
          <div><strong>Vehicle:</strong> ${p.vehicleNo} (${p.vehicleClass})</div>
          <div><strong>Plaza:</strong> ${p.plazaName}</div>
          <div><strong>Valid Until:</strong> ${p.validUntil}</div>
        </div>

        ${isApproved ? `
          <div class="qr-wrapper" style="width: 120px; height: 120px; margin: 0.75rem auto 0.25rem;">
            ${qrSvg}
          </div>
          <div class="text-center font-mono text-xs muted">${p.id}</div>
        ` : `
          <div class="alert-banner alert-warning mt-3 text-xs" style="padding: 0.5rem;">
            ⏳ Pass under administrative document verification. QR will unlock upon approval.
          </div>
        `}
      </div>
    `;
  }).join('');
}

// User History
function renderUserHistory() {
  const tbody = document.getElementById('userHistoryTableBody');
  const tickets = labDB.get('easytoll_tickets') || [];

  if (tickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center muted">No transaction records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = tickets.map(t => `
    <tr>
      <td>${t.issuedAt}</td>
      <td class="font-mono">${t.id}</td>
      <td>${t.plazaName}</td>
      <td>${t.tripType === 'return' ? 'Return Journey' : 'Single Journey'}</td>
      <td class="font-bold">₹${t.amount.toFixed(2)}</td>
      <td><span class="badge ${t.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${t.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick='renderLatestTicket(${JSON.stringify(t)})'>View QR</button>
      </td>
    </tr>
  `).join('');
}

// Operator Console
function renderOperatorConsole() {
  const plazas = labDB.get('easytoll_plazas') || [];
  const curPlaza = plazas.find(p => p.id === currentOperatorPlazaId) || plazas[0];
  if (curPlaza) {
    document.getElementById('operatorPlazaName').textContent = `${curPlaza.name} (${curPlaza.highway})`;
  }

  // Populate quick test tokens from existing tickets & passes
  const tickets = labDB.get('easytoll_tickets') || [];
  const passes = labDB.get('easytoll_passes') || [];
  const quickContainer = document.getElementById('quickTokensContainer');

  let chips = [];
  tickets.slice(0, 3).forEach(t => {
    chips.push(`<span class="token-chip" onclick="fillScanCode('${t.id}')">🎫 ${t.id} (${t.status})</span>`);
  });
  passes.filter(p => p.status === 'Approved').slice(0, 2).forEach(p => {
    chips.push(`<span class="token-chip" onclick="fillScanCode('${p.id}')">🪪 ${p.id} (Pass)</span>`);
  });

  quickContainer.innerHTML = chips.join('') || '<span class="muted text-xs">No tokens generated yet.</span>';
  renderCrossingLog();
}

function changeOperatorPlaza() {
  currentOperatorPlazaId = document.getElementById('operatorPlazaSelector').value;
  renderOperatorConsole();
}

function fillScanCode(code) {
  document.getElementById('scanInputCode').value = code;
  handleOperatorVerify(new Event('submit'));
}

function handleOperatorVerify(e) {
  if (e && e.preventDefault) e.preventDefault();
  const rawCode = document.getElementById('scanInputCode').value.trim().toUpperCase();
  const resultBox = document.getElementById('operatorResultBox');
  const gateAction = document.getElementById('gateBarrierAction');

  if (!rawCode) return;

  const tickets = labDB.get('easytoll_tickets') || [];
  const passes = labDB.get('easytoll_passes') || [];

  const foundTicket = tickets.find(t => t.id === rawCode);
  const foundPass = passes.find(p => p.id === rawCode);

  verifiedItem = null;

  if (foundTicket) {
    if (foundTicket.status === 'Redeemed' || foundTicket.status === 'Used') {
      resultBox.className = 'result-box invalid';
      resultBox.innerHTML = `
        <h3 style="color: #ef4444;">❌ TICKET ALREADY REDEEMED</h3>
        <p class="muted">Token ${foundTicket.id} was already cleared through toll lane.</p>
        <div>Vehicle: <strong>${foundTicket.vehicleNo}</strong></div>
      `;
      gateAction.classList.add('hidden');
    } else {
      verifiedItem = { type: 'ticket', item: foundTicket };
      resultBox.className = 'result-box valid';
      resultBox.innerHTML = `
        <h3 style="color: #10b981;">✅ VALID TOLL e-TICKET</h3>
        <p class="muted">Authorized for Lane Clearance</p>
        <div style="font-size: 0.95rem; line-height: 1.6; text-align: left;" class="mt-2">
          <div><strong>Vehicle No:</strong> ${foundTicket.vehicleNo} (${foundTicket.vehicleType})</div>
          <div><strong>Plaza:</strong> ${foundTicket.plazaName}</div>
          <div><strong>Fare Paid:</strong> ₹${foundTicket.amount.toFixed(2)} (${foundTicket.tripType})</div>
        </div>
      `;
      gateAction.classList.remove('hidden');
    }
  } else if (foundPass) {
    if (foundPass.status !== 'Approved') {
      resultBox.className = 'result-box invalid';
      resultBox.innerHTML = `
        <h3 style="color: #ef4444;">❌ PASS NOT APPROVED / EXPIRED</h3>
        <p class="muted">Pass ID ${foundPass.id} status: ${foundPass.status}</p>
      `;
      gateAction.classList.add('hidden');
    } else {
      verifiedItem = { type: 'pass', item: foundPass };
      resultBox.className = 'result-box valid';
      resultBox.innerHTML = `
        <h3 style="color: #10b981;">✅ ACTIVE COMMUTER TOLL PASS</h3>
        <p class="muted">Pass Valid Until: ${foundPass.validUntil}</p>
        <div style="font-size: 0.95rem; line-height: 1.6; text-align: left;" class="mt-2">
          <div><strong>Applicant:</strong> ${foundPass.applicant}</div>
          <div><strong>Vehicle No:</strong> ${foundPass.vehicleNo} (${foundPass.vehicleClass})</div>
          <div><strong>Pass Plan:</strong> ${foundPass.type}</div>
        </div>
      `;
      gateAction.classList.remove('hidden');
    }
  } else {
    resultBox.className = 'result-box invalid';
    resultBox.innerHTML = `
      <h3 style="color: #ef4444;">❌ UNRECOGNIZED TOKEN</h3>
      <p class="muted">No matching toll ticket or pass found for '${rawCode}' in registry.</p>
    `;
    gateAction.classList.add('hidden');
  }
}

function raiseBarrier() {
  if (!verifiedItem) return;

  const plazas = labDB.get('easytoll_plazas') || [];
  const curPlaza = plazas.find(p => p.id === currentOperatorPlazaId) || plazas[0];

  const crossings = labDB.get('easytoll_crossings') || [];
  const newCrossing = {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    vehicleNo: verifiedItem.item.vehicleNo,
    token: verifiedItem.item.id,
    classification: verifiedItem.type === 'ticket' ? `${verifiedItem.item.vehicleType} (Ticket)` : `${verifiedItem.item.vehicleClass} (Pass)`,
    fare: verifiedItem.type === 'ticket' ? verifiedItem.item.amount : 0,
    decision: 'Cleared & Gate Raised',
    plazaName: curPlaza.name
  };

  crossings.unshift(newCrossing);
  labDB.set('easytoll_crossings', crossings);

  // If ticket is single journey, mark it used
  if (verifiedItem.type === 'ticket') {
    const tickets = labDB.get('easytoll_tickets') || [];
    const tIdx = tickets.findIndex(t => t.id === verifiedItem.item.id);
    if (tIdx !== -1) {
      tickets[tIdx].status = 'Redeemed';
      labDB.set('easytoll_tickets', tickets);
    }
  }

  showAlert(`Boom Barrier Raised! Vehicle ${verifiedItem.item.vehicleNo} cleared successfully.`, 'success');

  // Reset operator screen
  document.getElementById('gateBarrierAction').classList.add('hidden');
  document.getElementById('operatorResultBox').className = 'result-box waiting';
  document.getElementById('operatorResultBox').innerHTML = `
    <div class="result-placeholder">
      <span class="placeholder-icon">🚗💨</span>
      <p>Vehicle cleared. Barrier returned to closed position.</p>
    </div>
  `;
  document.getElementById('scanInputCode').value = '';
  verifiedItem = null;

  renderCrossingLog();
  renderAdminDashboard();
}

function renderCrossingLog() {
  const tbody = document.getElementById('boothCrossingTable');
  const crossings = labDB.get('easytoll_crossings') || [];

  if (crossings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No crossings logged yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = crossings.slice(0, 10).map(c => `
    <tr>
      <td>${c.time}</td>
      <td class="font-bold">${c.vehicleNo}</td>
      <td class="font-mono text-sm">${c.token}</td>
      <td>${c.classification}</td>
      <td>₹${c.fare.toFixed(2)}</td>
      <td><span class="badge badge-success">${c.decision}</span></td>
    </tr>
  `).join('');
}

// Admin Dashboard
function renderAdminDashboard() {
  const passes = labDB.get('easytoll_passes') || [];
  const tickets = labDB.get('easytoll_tickets') || [];
  const crossings = labDB.get('easytoll_crossings') || [];
  const plazas = labDB.get('easytoll_plazas') || [];

  // Metrics
  const ticketRevenue = tickets.reduce((acc, t) => acc + (t.amount || 0), 0);
  const passRevenue = passes.filter(p => p.status === 'Approved').reduce((acc, p) => acc + (p.fee || 0), 0);
  const totalRev = ticketRevenue + passRevenue;

  document.getElementById('adminTotalRevenue').textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  document.getElementById('adminTotalCrossings').textContent = crossings.length.toLocaleString('en-IN');
  const pendingCount = passes.filter(p => p.status === 'Pending').length;
  document.getElementById('adminPendingPassesCount').textContent = pendingCount;

  // Passes Table
  const passesTable = document.getElementById('adminPassesTable');
  passesTable.innerHTML = passes.map(p => `
    <tr>
      <td class="font-mono font-bold">${p.id}</td>
      <td>
        <div><strong>${p.applicant}</strong></div>
        <div class="muted text-xs">${p.phone}</div>
      </td>
      <td>${p.vehicleNo}</td>
      <td>${p.plazaName}</td>
      <td>${p.type} (₹${p.fee})</td>
      <td><span class="badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">${p.status}</span></td>
      <td>
        ${p.status === 'Pending' ? `
          <button class="btn btn-success btn-sm mr-1" onclick="adminApprovePass('${p.id}', true)">Approve</button>
          <button class="btn btn-danger btn-sm" onclick="adminApprovePass('${p.id}', false)">Reject</button>
        ` : `
          <span class="text-xs muted">Processed</span>
        `}
      </td>
    </tr>
  `).join('');

  // Plazas Table
  const plazasTable = document.getElementById('adminPlazasTable');
  plazasTable.innerHTML = plazas.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td class="muted">${p.highway}</td>
      <td>₹${p.car.toFixed(2)}</td>
      <td><span class="badge badge-success">${p.status}</span></td>
    </tr>
  `).join('');

  // Audit Table
  const auditTable = document.getElementById('adminAuditTable');
  auditTable.innerHTML = crossings.map(c => `
    <tr>
      <td>${c.time}</td>
      <td>${c.plazaName || 'Sriperumbudur'}</td>
      <td class="font-bold">${c.vehicleNo}</td>
      <td class="font-mono">${c.token}</td>
      <td>₹${c.fare.toFixed(2)}</td>
      <td>Fast Lane QR</td>
      <td><span class="badge badge-success">Audit Cleared</span></td>
    </tr>
  `).join('');
}

function adminApprovePass(passId, isApproved) {
  const passes = labDB.get('easytoll_passes') || [];
  const pIdx = passes.findIndex(p => p.id === passId);
  if (pIdx !== -1) {
    passes[pIdx].status = isApproved ? 'Approved' : 'Rejected';
    labDB.set('easytoll_passes', passes);
    showAlert(`Pass ${passId} ${isApproved ? 'Approved & QR Issued' : 'Rejected'}!`, isApproved ? 'success' : 'danger');
    renderAdminDashboard();
    renderUserPasses();
    renderOperatorConsole();
  }
}

function handleCreatePlaza(e) {
  e.preventDefault();
  const name = document.getElementById('newPlazaName').value.trim();
  const route = document.getElementById('newPlazaRoute').value.trim();
  const car = parseFloat(document.getElementById('newPlazaCarRate').value);
  const lcv = parseFloat(document.getElementById('newPlazaLcvRate').value);
  const truck = parseFloat(document.getElementById('newPlazaTruckRate').value);
  const multi = parseFloat(document.getElementById('newPlazaMultiRate').value);

  const plazas = labDB.get('easytoll_plazas') || [];
  const newPlaza = {
    id: `PLZ-${plazas.length + 1}`,
    name,
    highway: route,
    car,
    lcv,
    truck,
    multi,
    status: 'Active'
  };

  plazas.push(newPlaza);
  labDB.set('easytoll_plazas', plazas);

  document.getElementById('createPlazaForm').reset();
  renderPlazaSelects();
  renderAdminDashboard();
  showAlert(`Toll Plaza "${name}" registered successfully!`, 'success');
}

// Deterministic SVG QR Code Generator
function generateDeterministicQR(dataString) {
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    hash = ((hash << 5) - hash) + dataString.charCodeAt(i);
    hash |= 0;
  }

  const size = 11;
  let rects = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Corner alignment marks
      const isCorner = (r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3);
      const isBlack = isCorner || Math.abs((hash ^ (r * 31 + c * 17))) % 3 === 0;
      if (isBlack) {
        rects += `<rect x="${c * 10}" y="${r * 10}" width="10" height="10" fill="#0f172a" />`;
      }
    }
  }

  return `
    <svg class="qr-code-svg" viewBox="0 0 ${size * 10} ${size * 10}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff" />
      ${rects}
    </svg>
  `;
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
