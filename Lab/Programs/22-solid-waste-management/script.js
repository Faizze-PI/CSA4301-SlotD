// EcoClean Solid Waste Management Script

const DEFAULT_BINS = [
  {
    id: 'BIN-W14-01',
    location: 'Usman Road Junction (Near T. Nagar Bus Depot)',
    type: 'Biodegradable (Wet)',
    capacity: 1100,
    fill: 92,
    status: 'Critical',
    latLng: '13.0418° N, 80.2337° E'
  },
  {
    id: 'BIN-W14-02',
    location: 'Pondy Bazaar Pedestrian Plaza',
    type: 'Recyclable (Dry)',
    capacity: 1100,
    fill: 45,
    status: 'Normal',
    latLng: '13.0405° N, 80.2401° E'
  },
  {
    id: 'BIN-W14-03',
    location: 'Ranganathan Street Commercial Market',
    type: 'Biodegradable (Wet)',
    capacity: 1500,
    fill: 84,
    status: 'Critical',
    latLng: '13.0378° N, 80.2312° E'
  },
  {
    id: 'BIN-W14-04',
    location: 'Panagal Park South Pavilion',
    type: 'Recyclable (Dry)',
    capacity: 1100,
    fill: 20,
    status: 'Normal',
    latLng: '13.0432° N, 80.2355° E'
  },
  {
    id: 'BIN-W14-05',
    location: 'Venkatnarayana Road Residential Sector',
    type: 'Hazardous / E-Waste',
    capacity: 600,
    fill: 60,
    status: 'Moderate',
    latLng: '13.0350° N, 80.2380° E'
  },
  {
    id: 'BIN-W14-06',
    location: 'Habibullah Road School Zone',
    type: 'Biodegradable (Wet)',
    capacity: 1100,
    fill: 15,
    status: 'Normal',
    latLng: '13.0470° N, 80.2410° E'
  }
];

const DEFAULT_COMPLAINTS = [
  {
    id: 'WST-801',
    category: 'Overflowing Municipal Dustbin',
    severity: 'Critical',
    location: 'Usman Road Junction (Near T. Nagar Bus Depot)',
    reporter: 'R. Vasanthi',
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500',
    remarks: 'Commercial waste overflowing onto roadway causing extreme stench and vehicle obstruction.',
    status: 'Assigned to Truck #04',
    date: '2026-10-06 08:30 AM'
  },
  {
    id: 'WST-802',
    category: 'Illegal Street Dumping / Debris',
    severity: 'High',
    location: '3rd Cross Street, Near North Usman Road',
    reporter: 'R. Vasanthi',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500',
    remarks: 'Construction debris dumped overnight on pedestrian sidewalk.',
    status: 'Logged',
    date: '2026-10-06 09:15 AM'
  }
];

// App State
let currentRole = 'public';
let currentPublicTab = 'report';
let currentAdminTab = 'bins';
let driverCurrentLoad = 2.8;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderDustbinsGrid();
  renderPublicComplaints();
  populateDriverBinSelect();
  renderAdminBins();
  renderAdminComplaints();
  renderAdminDrivers();
  updateMetrics();
});

function initStorage() {
  if (!labDB.get('waste_bins')) labDB.set('waste_bins', DEFAULT_BINS);
  if (!labDB.get('waste_complaints')) labDB.set('waste_complaints', DEFAULT_COMPLAINTS);
  if (labDB.get('waste_driver_load') === null) labDB.set('waste_driver_load', 2.8);
  driverCurrentLoad = parseFloat(labDB.get('waste_driver_load') || 2.8);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('publicSection').classList.toggle('hidden', role !== 'public');
  document.getElementById('driverSection').classList.toggle('hidden', role !== 'driver');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'public') {
    renderDustbinsGrid();
    renderPublicComplaints();
  } else if (role === 'driver') {
    populateDriverBinSelect();
    updateDriverLoadDisplay();
  } else if (role === 'admin') {
    renderAdminBins();
    renderAdminComplaints();
    renderAdminDrivers();
    updateMetrics();
  }
}

// Public Tabs
function switchPublicTab(tab) {
  currentPublicTab = tab;
  const tabIds = ['report', 'track', 'bins'];
  tabIds.forEach(t => {
    const pane = document.getElementById('pubTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#publicSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'bins') renderDustbinsGrid();
  if (tab === 'track') renderPublicComplaints();
}

// Admin Tabs
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['bins', 'complaints', 'drivers'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'bins') renderAdminBins();
  if (tab === 'complaints') renderAdminComplaints();
  if (tab === 'drivers') renderAdminDrivers();
}

// Public Complaint Submission
function handlePublicSubmitComplaint(e) {
  e.preventDefault();
  const category = document.getElementById('wasteCategory').value;
  const severity = document.getElementById('wasteSeverity').value;
  const location = document.getElementById('wasteLocation').value.trim();
  const photo = document.getElementById('wastePhotoUrl').value.trim();
  const remarks = document.getElementById('wasteRemarks').value.trim();

  const ticketId = `WST-${Math.floor(800 + Math.random() * 200)}`;
  const newComplaint = {
    id: ticketId,
    category,
    severity,
    location,
    reporter: 'R. Vasanthi',
    photoUrl: photo || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500',
    remarks,
    status: 'Assigned to Truck #04',
    date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
  };

  const list = labDB.get('waste_complaints') || [];
  list.unshift(newComplaint);
  labDB.set('waste_complaints', list);

  renderLatestTicket(newComplaint);
  renderPublicComplaints();
  renderAdminComplaints();
  updateMetrics();

  showAlert(`Waste grievance ${ticketId} registered! Compactor Truck #04 route updated.`, 'success');
  document.getElementById('publicComplaintForm').reset();
}

function renderLatestTicket(c) {
  const box = document.getElementById('latestWasteTicketDisplay');
  box.innerHTML = `
    <div class="complaint-card" style="border: 2px solid #22c55e;">
      <div class="card-header-flex">
        <div>
          <span class="badge ${c.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}">${c.severity} Severity</span>
          <h4 style="margin: 0.5rem 0 0.2rem 0;">${c.category}</h4>
          <span class="font-mono text-xs muted">Token: ${c.id}</span>
        </div>
        <div class="text-right text-xs muted">${c.date}</div>
      </div>

      <div class="complaint-card-grid mt-3">
        <div class="complaint-photo-box">
          <img src="${c.photoUrl}" alt="Waste Evidence" onerror="this.src='https://placehold.co/140x100/0f172a/white?text=Waste'">
        </div>
        <div class="complaint-body">
          <p class="muted text-sm">${c.remarks}</p>
          <div class="text-xs muted mt-1">📍 <strong>Location:</strong> ${c.location}</div>
          <div class="text-xs mt-2"><span class="badge badge-info">✓ ${c.status}</span></div>
        </div>
      </div>

      <button class="btn btn-secondary btn-sm btn-block mt-3" onclick="switchPublicTab('track')">Track in Complaints History</button>
    </div>
  `;
}

function renderPublicComplaints() {
  const container = document.getElementById('publicComplaintsList');
  const list = labDB.get('waste_complaints') || [];

  if (list.length === 0) {
    container.innerHTML = `<p class="muted">No grievances filed.</p>`;
    return;
  }

  container.innerHTML = list.map(c => `
    <div class="complaint-card">
      <div class="card-header-flex">
        <div>
          <span class="badge ${c.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}">${c.severity}</span>
          <h4 style="margin: 0.4rem 0 0.2rem 0;">${c.category}</h4>
          <span class="font-mono text-xs muted">Token: ${c.id} | Logged: ${c.date}</span>
        </div>
        <span class="badge ${c.status.includes('Resolved') ? 'badge-success' : 'badge-info'}">${c.status}</span>
      </div>

      <div class="complaint-card-grid mt-3">
        <div class="complaint-photo-box">
          <img src="${c.photoUrl}" alt="Evidence" onerror="this.src='https://placehold.co/140x100/0f172a/white?text=Waste'">
        </div>
        <div class="complaint-body">
          <p class="muted text-sm">${c.remarks}</p>
          <div class="text-xs muted mt-1">📍 <strong>Location:</strong> ${c.location}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Dustbins Grid
function renderDustbinsGrid() {
  const container = document.getElementById('publicBinsGrid');
  const bins = labDB.get('waste_bins') || [];

  container.innerHTML = bins.map(b => {
    const isCritical = b.fill >= 80;
    const barColorClass = b.fill >= 80 ? 'red' : b.fill >= 50 ? 'amber' : 'green';

    return `
      <div class="bin-card ${isCritical ? 'critical' : ''}">
        <div>
          <div class="bin-card-header">
            <div>
              <strong class="font-mono" style="font-size: 1.1rem;">${b.id}</strong>
              <div class="muted text-xs">${b.type}</div>
            </div>
            <span class="badge ${isCritical ? 'badge-danger' : b.fill >= 50 ? 'badge-warning' : 'badge-success'}">
              ${b.fill >= 80 ? 'OVERFLOWING' : b.fill >= 50 ? 'MODERATE' : 'EMPTY'}
            </span>
          </div>

          <div class="text-xs muted" style="min-height: 34px;">📍 ${b.location}</div>

          <div class="fill-gauge-container">
            <div class="fill-gauge-track">
              <div class="fill-gauge-bar ${barColorClass}" style="width: ${b.fill}%;"></div>
            </div>
            <div class="fill-meta">
              <span>Sensor: Ultrasonic IoT</span>
              <strong>${b.fill}% Filled</strong>
            </div>
          </div>
        </div>

        <div class="text-xs muted font-mono text-right mt-2">
          Capacity: ${b.capacity}L
        </div>
      </div>
    `;
  }).join('');
}

// Driver Console
function populateDriverBinSelect() {
  const select = document.getElementById('driverTargetBinSelect');
  if (!select) return;
  const bins = labDB.get('waste_bins') || [];

  // Sort descending by fill level
  const sorted = [...bins].sort((a, b) => b.fill - a.fill);

  select.innerHTML = sorted.map(b => `
    <option value="${b.id}">${b.id}: ${b.location} (${b.fill}% Full - ${b.type})</option>
  `).join('');

  updateDriverBinPreview();
  renderDriverWaypoints();
}

function updateDriverBinPreview() {
  const selId = document.getElementById('driverTargetBinSelect').value;
  const bins = labDB.get('waste_bins') || [];
  const b = bins.find(item => item.id === selId);
  const box = document.getElementById('driverBinPreviewBox');

  if (!b) return;

  box.innerHTML = `
    <div style="font-size: 0.9rem;">
      <div><strong>Target Bin:</strong> ${b.id} (${b.type})</div>
      <div class="muted text-xs">Location: ${b.location}</div>
      <div class="mt-2">Current Fill Status: <strong style="color: ${b.fill >= 80 ? '#ef4444' : '#10b981'};">${b.fill}%</strong></div>
    </div>
  `;
}

function renderDriverWaypoints() {
  const container = document.getElementById('waypointStepsContainer');
  if (!container) return;
  const bins = labDB.get('waste_bins') || [];
  const critical = bins.filter(b => b.fill >= 80);

  container.innerHTML = `
    <div class="waypoint-item completed">
      <span>1. Sanitation Depot (Start Departure)</span>
      <span class="badge badge-neutral">08:00 AM</span>
    </div>
    ${critical.map((b, i) => `
      <div class="waypoint-item active">
        <span>${i + 2}. Collect ${b.id} (${b.location.split('(')[0]})</span>
        <span class="badge badge-danger">${b.fill}% Full</span>
      </div>
    `).join('')}
    <div class="waypoint-item">
      <span>${critical.length + 2}. Kodungaiyur / Perungudi Landfill Dumping Site</span>
      <span class="badge badge-success">Final Offload</span>
    </div>
  `;
}

function updateDriverLoadDisplay() {
  const text = document.getElementById('driverCurrentLoadText');
  if (text) text.textContent = `${driverCurrentLoad.toFixed(2)} Tons`;
}

function handleDriverClearBin(e) {
  e.preventDefault();
  const binId = document.getElementById('driverTargetBinSelect').value;
  const weight = parseFloat(document.getElementById('driverCollectedWeight').value);

  const bins = labDB.get('waste_bins') || [];
  const bIdx = bins.findIndex(b => b.id === binId);

  if (bIdx !== -1) {
    bins[bIdx].fill = 0; // Cleared to 0%
    bins[bIdx].status = 'Normal';
    labDB.set('waste_bins', bins);

    driverCurrentLoad += weight;
    labDB.set('waste_driver_load', driverCurrentLoad);

    // Update complaints in this area to resolved
    const complaints = labDB.get('waste_complaints') || [];
    complaints.forEach(c => {
      if (c.location.includes(bins[bIdx].id) || bins[bIdx].location.includes(c.location)) {
        c.status = 'Resolved & Cleared by Truck #04';
      }
    });
    labDB.set('waste_complaints', complaints);

    populateDriverBinSelect();
    updateDriverLoadDisplay();
    renderDustbinsGrid();
    renderPublicComplaints();
    renderAdminBins();
    updateMetrics();

    showAlert(`Compactor arm cleared ${binId}! Fill level reset to 0%. ${weight} tons added to truck.`, 'success');
  }
}

function dumpAtLandfill() {
  if (driverCurrentLoad === 0) {
    showAlert('Compactor truck is already empty.', 'info');
    return;
  }

  showAlert(`Offloaded ${driverCurrentLoad.toFixed(2)} tons of compacted municipal waste at Kodungaiyur Landfill! Truck capacity restored.`, 'success');
  driverCurrentLoad = 0;
  labDB.set('waste_driver_load', 0);
  updateDriverLoadDisplay();
}

// Admin Operations
function renderAdminBins() {
  const tbody = document.getElementById('adminBinsTable');
  const bins = labDB.get('waste_bins') || [];

  tbody.innerHTML = bins.map(b => `
    <tr>
      <td class="font-mono font-bold">${b.id}</td>
      <td class="text-xs">${b.location}</td>
      <td>${b.type}</td>
      <td>
        <span class="badge ${b.fill >= 80 ? 'badge-danger' : b.fill >= 50 ? 'badge-warning' : 'badge-success'}">
          ${b.fill}% Full
        </span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="adminResetBinFill('${b.id}')">Reset 0%</button>
      </td>
    </tr>
  `).join('');
}

function adminResetBinFill(binId) {
  const bins = labDB.get('waste_bins') || [];
  const b = bins.find(item => item.id === binId);
  if (b) {
    b.fill = 0;
    b.status = 'Normal';
    labDB.set('waste_bins', bins);
    renderAdminBins();
    renderDustbinsGrid();
    populateDriverBinSelect();
    updateMetrics();
    showAlert(`Sensor fill reset for ${binId}.`, 'info');
  }
}

function handleAdminCreateBin(e) {
  e.preventDefault();
  const id = document.getElementById('newBinId').value.trim().toUpperCase();
  const loc = document.getElementById('newBinLocation').value.trim();
  const type = document.getElementById('newBinType').value;
  const capacity = parseInt(document.getElementById('newBinCapacity').value);
  const fill = parseInt(document.getElementById('newBinInitialFill').value);

  const bins = labDB.get('waste_bins') || [];
  if (bins.some(b => b.id === id)) {
    showAlert(`Bin ID ${id} already exists.`, 'danger');
    return;
  }

  bins.push({
    id,
    location: loc,
    type,
    capacity,
    fill,
    status: fill >= 80 ? 'Critical' : fill >= 50 ? 'Moderate' : 'Normal',
    latLng: '13.0400° N, 80.2350° E'
  });
  labDB.set('waste_bins', bins);

  e.target.reset();
  renderAdminBins();
  renderDustbinsGrid();
  populateDriverBinSelect();
  updateMetrics();
  showAlert(`Smart Dustbin ${id} deployed to Ward 14!`, 'success');
}

function renderAdminComplaints() {
  const tbody = document.getElementById('adminComplaintsTable');
  const list = labDB.get('waste_complaints') || [];

  tbody.innerHTML = list.map(c => `
    <tr>
      <td class="font-mono font-bold">${c.id}</td>
      <td>${c.category}</td>
      <td class="text-xs">${c.location}</td>
      <td>${c.reporter}</td>
      <td><span class="badge badge-info">${c.status}</span></td>
      <td>
        <button class="btn btn-success btn-sm" onclick="adminResolveComplaint('${c.id}')">Mark Resolved</button>
      </td>
    </tr>
  `).join('');
}

function adminResolveComplaint(id) {
  const list = labDB.get('waste_complaints') || [];
  const c = list.find(item => item.id === id);
  if (c) {
    c.status = 'Resolved & Cleared by Municipal Admin';
    labDB.set('waste_complaints', list);
    renderAdminComplaints();
    renderPublicComplaints();
    showAlert(`Complaint ${id} marked as resolved.`, 'success');
  }
}

function renderAdminDrivers() {
  const tbody = document.getElementById('adminDriversTable');
  tbody.innerHTML = `
    <tr>
      <td><strong>K. Murugesan</strong></td>
      <td class="font-mono">TN-01-G-4491</td>
      <td>Ward 14 (T. Nagar West)</td>
      <td>${driverCurrentLoad.toFixed(2)} / 5.0 Tons</td>
      <td><span class="badge badge-success">4 Cleared Today</span></td>
    </tr>
    <tr>
      <td><strong>S. Palanivel</strong></td>
      <td class="font-mono">TN-01-G-4492</td>
      <td>Ward 15 (Mambalam South)</td>
      <td>1.9 / 5.0 Tons</td>
      <td><span class="badge badge-success">3 Cleared Today</span></td>
    </tr>
  `;
}

function updateMetrics() {
  const bins = labDB.get('waste_bins') || [];
  document.getElementById('adminTotalBinsCount').textContent = bins.length;
  const critical = bins.filter(b => b.fill >= 80).length;
  document.getElementById('adminCriticalBinsCount').textContent = critical;
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
