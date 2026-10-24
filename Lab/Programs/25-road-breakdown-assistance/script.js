/**
 * ResQDrive - On-Road Breakdown Assistance & Licensed Mechanic Dispatch
 * Experiment 25 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  MECHANICS: 'resq_mechanics_v1',
  DISPATCHES: 'resq_dispatches_v1',
  FEEDBACK: 'resq_feedback_v1',
  ACTIVE_DISPATCH: 'resq_active_dispatch_v1'
};

const DEFAULT_MECHANICS = [
  {
    id: 'MECH-101',
    name: 'Kumar Tech',
    garage: 'Express Mobile Auto Repair & Battery Hub',
    zone: 'Tambaram / GST Road',
    phone: '+91 94441 22891',
    baseFee: 350,
    services: ['Flat Tyre', 'Battery Jumpstart', 'Engine Overheating', 'Flatbed Towing'],
    status: 'Approved',
    availability: 'Available',
    rating: 4.8,
    reviewsCount: 34,
    distanceKm: 2.4
  },
  {
    id: 'MECH-102',
    name: 'Selvam QuickFix',
    garage: 'OMR 24x7 Roadside Rescue & Recovery',
    zone: 'OMR / IT Corridor',
    phone: '+91 98402 77123',
    baseFee: 400,
    services: ['Flat Tyre', 'Battery Jumpstart', 'Emergency Fuel'],
    status: 'Approved',
    availability: 'Available',
    rating: 4.7,
    reviewsCount: 28,
    distanceKm: 4.1
  },
  {
    id: 'MECH-103',
    name: 'Rajesh Motors',
    garage: 'NH-48 Heavy Towing & Radiator Clinic',
    zone: 'Sriperumbudur / NH-48',
    phone: '+91 97910 44556',
    baseFee: 500,
    services: ['Flat Tyre', 'Engine Overheating', 'Flatbed Towing'],
    status: 'Approved',
    availability: 'Busy',
    rating: 4.6,
    reviewsCount: 19,
    distanceKm: 8.5
  },
  {
    id: 'MECH-104',
    name: 'Vicky Auto Works',
    garage: 'Kathipara Junction Emergency Tyre & Fuel',
    zone: 'Guindy / Kathipara',
    phone: '+91 98845 11234',
    baseFee: 300,
    services: ['Flat Tyre', 'Emergency Fuel', 'Battery Jumpstart'],
    status: 'Pending',
    availability: 'Available',
    rating: 4.2,
    reviewsCount: 6,
    distanceKm: 3.8
  }
];

const DEFAULT_FEEDBACK = [
  {
    id: 'FB-01',
    mechId: 'MECH-101',
    mechName: 'Kumar Tech',
    rating: 5,
    user: 'Arvind S.',
    comment: 'Punctured rear tyre near Tambaram flyover at 11 PM. Kumar reached within 14 minutes with air compressor and heavy jack. Truly a lifesaver!',
    date: '2026-10-04'
  },
  {
    id: 'FB-02',
    mechId: 'MECH-101',
    mechName: 'Kumar Tech',
    rating: 5,
    user: 'Kavitha R.',
    comment: 'Battery drained in heavy traffic. Quick jumpstart kit used. Polite and honest callout charges.',
    date: '2026-10-05'
  }
];

let appState = {
  currentRole: 'user',
  activeUserTab: 'searchMechanics',
  activeMechTab: 'business',
  mechanics: [],
  dispatches: [],
  feedback: [],
  activeDispatch: null,
  trackingInterval: null
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedMechanics = labDB.get(STORAGE_KEYS.MECHANICS);
  if (!storedMechanics || storedMechanics.length === 0) {
    labDB.set(STORAGE_KEYS.MECHANICS, DEFAULT_MECHANICS);
    appState.mechanics = [...DEFAULT_MECHANICS];
  } else {
    appState.mechanics = storedMechanics;
  }

  const storedFeedback = labDB.get(STORAGE_KEYS.FEEDBACK);
  if (!storedFeedback || storedFeedback.length === 0) {
    labDB.set(STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);
    appState.feedback = [...DEFAULT_FEEDBACK];
  } else {
    appState.feedback = storedFeedback;
  }

  appState.dispatches = labDB.get(STORAGE_KEYS.DISPATCHES) || [];
  appState.activeDispatch = labDB.get(STORAGE_KEYS.ACTIVE_DISPATCH) || null;
}

function renderApp() {
  renderMechanicsGrid();
  renderActiveDispatchTelemetry();
  populateFeedbackMechanicDropdown();
  renderMechanicReviews();
  renderAdminTable();
  updateAdminMetrics();
}

// Role switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('userSection').classList.toggle('hidden', role !== 'user');
  document.getElementById('mechanicSection').classList.toggle('hidden', role !== 'mechanic');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminTable();
    updateAdminMetrics();
  } else if (role === 'mechanic') {
    renderMechanicReviews();
  }
}

// Tab Switching
function switchUserTab(tabName) {
  appState.activeUserTab = tabName;
  const tabs = {
    searchMechanics: 'userTabSearch',
    activeDispatch: 'userTabTracker',
    userFeedback: 'userTabFeedback'
  };

  document.querySelectorAll('#userSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

function switchMechanicTab(tabName) {
  appState.activeMechTab = tabName;
  const tabs = {
    business: 'mechTabBusiness',
    reviews: 'mechTabReviews'
  };

  document.querySelectorAll('#mechanicSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

// Public Mechanics Filter & Grid
function filterMechanics() {
  const issue = document.getElementById('breakdownIssueSelect').value;
  const location = document.getElementById('breakdownLocationSelect').value;

  renderMechanicsGrid(issue, location);
}

function renderMechanicsGrid(filterIssue = 'All', filterLocation = 'All') {
  const grid = document.getElementById('mechanicsListGrid');
  if (!grid) return;

  // Public motorist view ONLY shows Approved mechanics
  let list = appState.mechanics.filter(m => m.status === 'Approved');

  if (filterIssue !== 'All') {
    list = list.filter(m => m.services.includes(filterIssue));
  }
  if (filterLocation !== 'All') {
    list = list.filter(m => m.zone.includes(filterLocation));
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1;">
        <span class="empty-icon">🔍</span>
        <p class="muted">No certified mobile mechanics found matching the selected filters. Please expand your highway corridor search or use 1-Click SOS.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(m => `
    <div class="mechanic-card">
      <div>
        <div class="mechanic-card-header">
          <div style="display: flex; align-items: center;">
            <span class="mech-icon-badge">🛠️</span>
            <div class="mech-title-group">
              <h4>${m.name}</h4>
              <div class="mech-garage">${m.garage}</div>
            </div>
          </div>
          <span class="badge ${m.availability === 'Available' ? 'badge-success' : 'badge-danger'}">
            ${m.availability === 'Available' ? '🟢 Available' : '🔴 ' + m.availability}
          </span>
        </div>

        <div class="mech-stats-row">
          <span>📍 ${m.zone} (~${m.distanceKm} km away)</span>
          <span>⭐ ${m.rating} (${m.reviewsCount} reviews)</span>
        </div>

        <div class="services-tag-list">
          ${m.services.map(s => `<span class="service-chip">${s}</span>`).join('')}
        </div>
      </div>

      <div class="mechanic-card-footer">
        <div>
          <span class="text-xs muted block">Base Callout Fee</span>
          <span class="fee-display">₹${m.baseFee}</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openDispatchModal('${m.id}')" ${m.availability !== 'Available' ? 'disabled' : ''}>
          ${m.availability === 'Available' ? '🚨 Request Dispatch' : 'Occupied'}
        </button>
      </div>
    </div>
  `).join('');
}

// 1-Click Highway SOS
function triggerSosDispatch() {
  const availableMechanics = appState.mechanics.filter(m => m.status === 'Approved' && m.availability === 'Available');
  if (availableMechanics.length === 0) {
    showAlert('All highway patrol mechanics are currently engaged. Contact State Police Highway Helpline: 1033 / 112', 'danger');
    return;
  }

  // Sort by closest distance
  availableMechanics.sort((a, b) => a.distanceKm - b.distanceKm);
  const bestMatch = availableMechanics[0];

  openDispatchModal(bestMatch.id, true);
}

// Dispatch Modal Handling
function openDispatchModal(mechId, isSos = false) {
  const mech = appState.mechanics.find(m => m.id === mechId);
  if (!mech) return;

  document.getElementById('dispatchMechId').value = mech.id;
  document.getElementById('dispatchMechNameDisplay').value = `${mech.name} (${mech.garage}) - ${mech.phone}`;
  document.getElementById('dispatchCalloutFee').innerText = `₹${mech.baseFee}.00`;

  if (isSos) {
    document.getElementById('dispatchProblemDisplay').value = 'CRITICAL SOS - Immediate Vehicle Immobilization';
  } else {
    const selectedProblem = document.getElementById('breakdownIssueSelect').value;
    document.getElementById('dispatchProblemDisplay').value = selectedProblem !== 'All' ? selectedProblem : 'Flat Tyre / Wheel Puncture';
  }

  document.getElementById('dispatchModal').classList.remove('hidden');
}

function closeDispatchModal() {
  document.getElementById('dispatchModal').classList.add('hidden');
}

function handleConfirmDispatch(event) {
  event.preventDefault();
  const mechId = document.getElementById('dispatchMechId').value;
  const vehicleNo = document.getElementById('dispatchVehicleNo').value.trim();
  const problem = document.getElementById('dispatchProblemDisplay').value;
  const location = document.getElementById('dispatchExactLocation').value.trim();

  const mech = appState.mechanics.find(m => m.id === mechId);
  if (!mech) return;

  const dispatchObj = {
    dispatchId: 'DISP-' + Date.now().toString().slice(-6),
    mechId: mech.id,
    mechName: mech.name,
    garage: mech.garage,
    mechPhone: mech.phone,
    vehicleNo,
    problem,
    location,
    baseFee: mech.baseFee,
    startTime: Date.now(),
    etaMinutes: 15,
    status: 'En-Route',
    progress: 25
  };

  appState.activeDispatch = dispatchObj;
  labDB.set(STORAGE_KEYS.ACTIVE_DISPATCH, dispatchObj);

  // Mark mechanic as En-Route
  mech.availability = 'En-Route';
  saveMechanics();

  // Add to historical dispatches
  appState.dispatches.push(dispatchObj);
  labDB.set(STORAGE_KEYS.DISPATCHES, appState.dispatches);

  closeDispatchModal();
  showAlert(`🚨 Rescue Van Dispatched! ${mech.name} is heading to ${location}. Estimated Arrival: 15 mins.`, 'success');

  switchUserTab('activeDispatch');
  renderActiveDispatchTelemetry();
  startLiveTelemetrySimulation();
}

function renderActiveDispatchTelemetry() {
  const container = document.getElementById('activeDispatchCard');
  const badge = document.getElementById('dispatchStatusBadge');
  if (!container || !badge) return;

  const d = appState.activeDispatch;
  if (!d) {
    badge.innerText = 'Standby';
    badge.className = 'badge badge-success';
    container.innerHTML = `
      <div class="empty-state-box">
        <span class="empty-icon">📍</span>
        <p class="muted">No active roadside dispatch in progress. Select a certified mechanic on the search tab to call assistance.</p>
      </div>
    `;
    return;
  }

  badge.innerText = d.status;
  badge.className = d.status === 'Completed' ? 'badge badge-success' : 'badge badge-warning';

  container.innerHTML = `
    <div class="tracking-active-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h4>Dispatch Reference: <span class="font-mono text-danger">${d.dispatchId}</span></h4>
          <p class="muted">Assigned Tech: <strong>${d.mechName}</strong> (${d.garage})</p>
          <p class="muted">Direct Emergency Line: <strong class="font-mono text-primary">${d.mechPhone}</strong></p>
          <p class="muted">Motorist Vehicle: <strong>${d.vehicleNo}</strong> | Issue: <strong>${d.problem}</strong></p>
          <p class="muted">Breakdown Spot: <em>${d.location}</em></p>
        </div>
        <div class="text-right">
          <div class="text-xs muted">ESTIMATED ARRIVAL IN</div>
          <div class="eta-countdown" id="liveEtaDisplay">${Math.max(1, Math.round(d.etaMinutes * (1 - d.progress / 100)))} Mins</div>
          <span class="badge badge-primary">GPS Van Active</span>
        </div>
      </div>

      <div class="telemetry-progress-track">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" id="telemetryFill" style="width: ${d.progress}%;"></div>
        </div>
        <div class="milestone-points">
          <span class="milestone-step ${d.progress >= 20 ? 'active' : ''}">🚨 Dispatched</span>
          <span class="milestone-step ${d.progress >= 50 ? 'active' : ''}">🛣️ On Highway</span>
          <span class="milestone-step ${d.progress >= 80 ? 'active' : ''}">📍 Arrived at Spot</span>
          <span class="milestone-step ${d.progress >= 100 ? 'active' : ''}">✅ Repaired</span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <div>
          <span class="muted text-xs">Callout Payable: </span>
          <strong class="text-success font-mono font-bold">₹${d.baseFee}.00</strong>
        </div>
        <div>
          ${d.status !== 'Completed' ? `
            <button class="btn btn-secondary btn-sm mr-2" onclick="cancelActiveDispatch()">Cancel Request</button>
            <button class="btn btn-success btn-sm" onclick="markDispatchCompleted()">Simulate Arrived & Fixed</button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="switchUserTab('userFeedback')">Write Review</button>
          `}
        </div>
      </div>
    </div>
  `;
}

function startLiveTelemetrySimulation() {
  if (appState.trackingInterval) clearInterval(appState.trackingInterval);

  appState.trackingInterval = setInterval(() => {
    if (!appState.activeDispatch || appState.activeDispatch.status === 'Completed') {
      clearInterval(appState.trackingInterval);
      return;
    }

    let p = appState.activeDispatch.progress + 15;
    if (p >= 100) {
      p = 100;
      appState.activeDispatch.status = 'Completed';
      appState.activeDispatch.progress = 100;
      clearInterval(appState.trackingInterval);

      // Restore mechanic availability
      const m = appState.mechanics.find(x => x.id === appState.activeDispatch.mechId);
      if (m) {
        m.availability = 'Available';
        saveMechanics();
      }
      showAlert(`🎉 Assistance Complete! Mechanic ${appState.activeDispatch.mechName} has repaired your vehicle.`, 'success');
    } else {
      appState.activeDispatch.progress = p;
    }

    labDB.set(STORAGE_KEYS.ACTIVE_DISPATCH, appState.activeDispatch);
    renderActiveDispatchTelemetry();
  }, 4000);
}

function markDispatchCompleted() {
  if (!appState.activeDispatch) return;
  appState.activeDispatch.progress = 100;
  appState.activeDispatch.status = 'Completed';
  labDB.set(STORAGE_KEYS.ACTIVE_DISPATCH, appState.activeDispatch);

  const m = appState.mechanics.find(x => x.id === appState.activeDispatch.mechId);
  if (m) {
    m.availability = 'Available';
    saveMechanics();
  }

  showAlert('Assistance marked as completed. Please post a review of your experience.', 'success');
  renderActiveDispatchTelemetry();
  renderMechanicsGrid();
}

function cancelActiveDispatch() {
  if (!confirm('Are you sure you want to cancel the roadside assistance dispatch?')) return;
  if (appState.activeDispatch) {
    const m = appState.mechanics.find(x => x.id === appState.activeDispatch.mechId);
    if (m) {
      m.availability = 'Available';
      saveMechanics();
    }
  }

  appState.activeDispatch = null;
  labDB.remove(STORAGE_KEYS.ACTIVE_DISPATCH);
  if (appState.trackingInterval) clearInterval(appState.trackingInterval);

  showAlert('Assistance dispatch request cancelled.', 'info');
  renderActiveDispatchTelemetry();
  renderMechanicsGrid();
}

// User Feedback
function populateFeedbackMechanicDropdown() {
  const select = document.getElementById('feedbackMechanicSelect');
  if (!select) return;

  select.innerHTML = appState.mechanics.map(m => `
    <option value="${m.id}">${m.name} - ${m.garage}</option>
  `).join('');
}

function handleUserSubmitFeedback(event) {
  event.preventDefault();
  const mechId = document.getElementById('feedbackMechanicSelect').value;
  const rating = parseInt(document.getElementById('feedbackRatingScore').value, 10);
  const comment = document.getElementById('feedbackCommentText').value.trim();

  const mech = appState.mechanics.find(m => m.id === mechId);
  if (!mech) return;

  const fb = {
    id: 'FB-' + Date.now().toString().slice(-4),
    mechId: mech.id,
    mechName: mech.name,
    rating,
    user: 'Arvind S. (Motorist)',
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  appState.feedback.unshift(fb);
  labDB.set(STORAGE_KEYS.FEEDBACK, appState.feedback);

  // Recalculate mechanic rating
  mech.reviewsCount += 1;
  mech.rating = Number(((mech.rating * (mech.reviewsCount - 1) + rating) / mech.reviewsCount).toFixed(1));
  saveMechanics();

  document.getElementById('feedbackCommentText').value = '';
  showAlert('Thank you! Your verified review has been published to the mechanics ledger.', 'success');
  renderMechanicsGrid();
  renderMechanicReviews();
  switchUserTab('searchMechanics');
}

// Mechanic Dashboard Functions
function toggleMechanicDutyStatus() {
  const kumar = appState.mechanics.find(m => m.id === 'MECH-101');
  if (!kumar) return;

  kumar.availability = kumar.availability === 'Available' ? 'Busy' : 'Available';
  saveMechanics();

  const btn = document.getElementById('btnMechAvail');
  if (btn) {
    if (kumar.availability === 'Available') {
      btn.className = 'btn btn-success btn-sm';
      btn.innerText = '🟢 Available for Duty';
    } else {
      btn.className = 'btn btn-danger btn-sm';
      btn.innerText = '🔴 Off-Duty / Busy';
    }
  }

  showAlert(`Mechanic availability updated to: ${kumar.availability}`, 'info');
  renderMechanicsGrid();
}

function handleSaveMechanicProfile(event) {
  event.preventDefault();
  const kumar = appState.mechanics.find(m => m.id === 'MECH-101');
  if (!kumar) return;

  kumar.garage = document.getElementById('mechGarageName').value.trim();
  kumar.zone = document.getElementById('mechOperatingZone').value;
  kumar.phone = document.getElementById('mechPhoneInput').value.trim();
  kumar.baseFee = parseFloat(document.getElementById('mechBaseRateInput').value);
  kumar.services = document.getElementById('mechSpecialization').value.split(',').map(s => s.trim());

  saveMechanics();
  showAlert('Workshop credentials and callout pricing updated successfully!', 'success');
  renderMechanicsGrid();
}

function renderMechanicReviews() {
  const container = document.getElementById('mechanicFeedbackList');
  if (!container) return;

  const reviews = appState.feedback.filter(fb => fb.mechId === 'MECH-101');
  if (reviews.length === 0) {
    container.innerHTML = `<p class="muted">No customer ratings received yet.</p>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="feedback-card">
      <div class="feedback-card-header">
        <strong>${r.user}</strong>
        <div>
          <span class="feedback-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
          <span class="muted text-xs ml-2">${r.date}</span>
        </div>
      </div>
      <p class="text-sm">${r.comment}</p>
    </div>
  `).join('');
}

// Admin Functions
function updateAdminMetrics() {
  const total = appState.mechanics.length;
  const approved = appState.mechanics.filter(m => m.status === 'Approved').length;
  const totalDispatches = (appState.dispatches ? appState.dispatches.length : 0) + 14;

  const elTotal = document.getElementById('adminTotalMechanics');
  const elApproved = document.getElementById('adminApprovedMechanics');
  const elDispatches = document.getElementById('adminTotalSosDispatches');

  if (elTotal) elTotal.innerText = total;
  if (elApproved) elApproved.innerText = approved;
  if (elDispatches) elDispatches.innerText = totalDispatches;
}

function renderAdminTable() {
  const tbody = document.getElementById('adminMechanicsTable');
  if (!tbody) return;

  tbody.innerHTML = appState.mechanics.map(m => `
    <tr>
      <td class="font-mono font-bold">${m.id}</td>
      <td>
        <strong>${m.name}</strong><br>
        <span class="muted text-xs">${m.garage}</span>
      </td>
      <td>${m.zone}</td>
      <td class="font-mono text-sm">${m.phone}</td>
      <td class="font-bold text-success">₹${m.baseFee}</td>
      <td>
        <span class="badge ${m.status === 'Approved' ? 'badge-success' : (m.status === 'Pending' ? 'badge-warning' : 'badge-danger')}">
          ${m.status}
        </span>
      </td>
      <td>
        ${m.status !== 'Approved' ? `
          <button class="btn btn-success btn-xs" onclick="adminSetStatus('${m.id}', 'Approved')">Approve License</button>
        ` : `
          <button class="btn btn-danger btn-xs" onclick="adminSetStatus('${m.id}', 'Suspended')">Suspend</button>
        `}
      </td>
    </tr>
  `).join('');
}

function adminSetStatus(mechId, newStatus) {
  const m = appState.mechanics.find(x => x.id === mechId);
  if (!m) return;

  m.status = newStatus;
  saveMechanics();
  showAlert(`Mechanic ${m.name} licensing status changed to ${newStatus}.`, 'info');
  renderAdminTable();
  updateAdminMetrics();
  renderMechanicsGrid();
}

function saveMechanics() {
  labDB.set(STORAGE_KEYS.MECHANICS, appState.mechanics);
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
