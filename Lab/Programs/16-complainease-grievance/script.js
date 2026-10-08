// ComplainEase Grievance Redressal Script

const DEFAULT_OFFICERS = [
  { id: 'OFF-402', name: 'Suresh Babu', dept: 'Roads & Infrastructure', ward: 'Ward 14 & 15', phone: '+91 94441 23402' },
  { id: 'OFF-405', name: 'Arumugam K', dept: 'Electrical & Power', ward: 'Ward 12 & 13', phone: '+91 94441 90283' },
  { id: 'OFF-409', name: 'Dr. Meenakshi V', dept: 'Health & Environment', ward: 'Ward 14', phone: '+91 94442 77190' }
];

const DEFAULT_COMPLAINTS = [
  {
    id: 'GRV-1021',
    citizenName: 'Priya Sundaram',
    phone: '+91 94440 88219',
    category: 'Roads & Potholes',
    urgency: 'Critical',
    title: 'Severe road crater outside Anna University Main Gate',
    description: 'Deep 4-foot pothole causing recurring motorcycle skids during nighttime and rainwater stagnation.',
    coordinates: '13.0125° N, 80.2355° E',
    address: 'Sardar Patel Rd, Guindy, Chennai',
    photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
    status: 'Resolved',
    officerId: 'OFF-402',
    officerName: 'Suresh Babu',
    createdAt: '2026-10-02 09:30 AM',
    proofPhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500',
    proofNotes: 'Bitumen resurfacing and hydraulic compaction completed by Ward 14 road crew. Area cleared.'
  },
  {
    id: 'GRV-1022',
    citizenName: 'Priya Sundaram',
    phone: '+91 94440 88219',
    category: 'Water Supply & Drainage',
    urgency: 'Urgent',
    title: 'Drainage overflow near City Hospital Junction',
    description: 'Manhole backed up after heavy showers, emitting foul odor and obstructing ambulance passage.',
    coordinates: '13.0827° N, 80.2707° E',
    address: 'Gandhi Road, Near City Hospital Junction, Ward 14',
    photo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=500',
    status: 'In Progress',
    officerId: 'OFF-402',
    officerName: 'Suresh Babu',
    createdAt: '2026-10-05 11:15 AM',
    proofPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
    proofNotes: 'Suction tanker unit stationed on site. Blockage cleared; sanitizing spray scheduled.'
  },
  {
    id: 'GRV-1023',
    citizenName: 'Karthik R',
    phone: '+91 98402 11094',
    category: 'Street Lighting & Electrical',
    urgency: 'Normal',
    title: 'Non-functional street lamps along 4th Main Road',
    description: 'Three consecutive high-mast lamps flickered out three nights ago.',
    coordinates: '13.0500° N, 80.2100° E',
    address: '4th Main Road, Anna Nagar West',
    photo: '',
    status: 'Under Investigation',
    officerId: 'OFF-405',
    officerName: 'Arumugam K',
    createdAt: '2026-10-06 08:20 AM',
    proofPhoto: '',
    proofNotes: 'Inspecting feeder pillar line circuit breaker.'
  }
];

const DEFAULT_FEEDBACKS = [
  {
    complaintId: 'GRV-1021',
    rating: 5,
    comment: 'Pothole was repaired within 24 hours of reporting! Great work by Officer Suresh Babu.',
    date: '2026-10-03'
  }
];

const FAQS = [
  {
    q: 'How long does it take for a civic grievance to be resolved?',
    a: 'Normal grievances are addressed within 48 to 72 hours. Urgent public hazards (e.g. open electrical wires, severed water mains) are dispatched under a strict 24-hour SLA.'
  },
  {
    q: 'How does geolocation pin mapping work?',
    a: 'Clicking anywhere on the interactive map generates precise latitude and longitude coordinates which are directly assigned to the field officer\'s dispatch GPS unit.'
  },
  {
    q: 'What is required for an officer to mark a case as Resolved?',
    a: 'The officer must upload cryptographic proof of work including a post-resolution field photograph and detailed inspection notes before the ticket can be closed.'
  },
  {
    q: 'Can I track status updates via SMS?',
    a: 'Yes. Automated SMS notifications are simulated at each key status transition: Registered, Officer Assigned, In Progress, and Resolved.'
  }
];

// App State
let currentRole = 'user';
let currentUserTab = 'lodge';
let currentAdminTab = 'cases';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initMapPicker();
  initStarRating();
  renderFaqs();
  renderUserComplaints();
  populateFeedbackSelect();
  renderOfficerTasks();
  renderAdminComplaints();
  renderAdminOfficers();
  updateMetrics();
});

function initStorage() {
  if (!labDB.get('complain_officers')) labDB.set('complain_officers', DEFAULT_OFFICERS);
  if (!labDB.get('complain_registry')) labDB.set('complain_registry', DEFAULT_COMPLAINTS);
  if (!labDB.get('complain_feedbacks')) labDB.set('complain_feedbacks', DEFAULT_FEEDBACKS);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('userSection').classList.toggle('hidden', role !== 'user');
  document.getElementById('officerSection').classList.toggle('hidden', role !== 'officer');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'user') {
    renderUserComplaints();
    populateFeedbackSelect();
  } else if (role === 'officer') {
    renderOfficerTasks();
  } else if (role === 'admin') {
    renderAdminComplaints();
    renderAdminOfficers();
    updateMetrics();
  }
}

// User Tab Switcher
function switchUserTab(tab) {
  currentUserTab = tab;
  const tabIds = ['lodge', 'track', 'faq', 'feedback'];
  tabIds.forEach(t => {
    const pane = document.getElementById('userTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#userSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });
}

// Admin Tab Switcher
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['cases', 'officers', 'controls'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });
}

// Interactive Map Click Handler
function initMapPicker() {
  const mapGrid = document.querySelector('.map-grid-bg');
  const pin = document.getElementById('draggablePin');
  if (!mapGrid || !pin) return;

  mapGrid.addEventListener('click', (e) => {
    const rect = mapGrid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = Math.round((x / rect.width) * 100);
    const yPct = Math.round((y / rect.height) * 100);

    pin.style.left = `${xPct}%`;
    pin.style.top = `${yPct}%`;

    // Calculate approximate coordinates for Chennai (12.98 - 13.15 N, 80.18 - 80.30 E)
    const lat = (13.0000 + (100 - yPct) * 0.0012).toFixed(4);
    const lng = (80.2000 + xPct * 0.0010).toFixed(4);

    document.getElementById('compCoordinates').value = `${lat}° N, ${lng}° E`;
    document.getElementById('compAddress').value = `Ward 14 Grid Sector (${xPct}, ${yPct}), Near Chennai Metro Corridor`;
  });
}

// Handle Lodge Complaint
function handleLodgeComplaint(e) {
  e.preventDefault();
  const category = document.getElementById('compCategory').value;
  const urgency = document.getElementById('compUrgency').value;
  const title = document.getElementById('compTitle').value.trim();
  const description = document.getElementById('compDescription').value.trim();
  const photo = document.getElementById('compPhoto').value.trim();
  const phone = document.getElementById('compPhone').value.trim();
  const coordinates = document.getElementById('compCoordinates').value;
  const address = document.getElementById('compAddress').value.trim();

  const ticketId = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;

  // Auto assign officer by department
  const officers = labDB.get('complain_officers') || [];
  let assignedOfficer = officers[0];
  if (category.includes('Electrical')) assignedOfficer = officers.find(o => o.dept.includes('Electrical')) || officers[0];
  else if (category.includes('Health') || category.includes('Garbage')) assignedOfficer = officers.find(o => o.dept.includes('Health')) || officers[0];

  const newComplaint = {
    id: ticketId,
    citizenName: 'Priya Sundaram',
    phone,
    category,
    urgency,
    title,
    description,
    coordinates,
    address,
    photo: photo || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500',
    status: 'Pending',
    officerId: assignedOfficer.id,
    officerName: assignedOfficer.name,
    createdAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    proofPhoto: '',
    proofNotes: 'Awaiting field crew dispatch.'
  };

  const registry = labDB.get('complain_registry') || [];
  registry.unshift(newComplaint);
  labDB.set('complain_registry', registry);

  renderLatestComplaint(newComplaint);
  renderUserComplaints();
  populateFeedbackSelect();
  renderOfficerTasks();
  renderAdminComplaints();
  updateMetrics();

  showAlert(`Grievance ${ticketId} registered! Dispatch notification sent to ${assignedOfficer.name}.`, 'success');
  document.getElementById('complaintForm').reset();
}

function renderLatestComplaint(c) {
  const box = document.getElementById('latestComplaintCard');
  box.innerHTML = `
    <div class="complaint-card" style="border: 2px solid #3b82f6;">
      <div class="complaint-header-flex">
        <div>
          <span class="badge badge-warning">${c.status}</span>
          <span class="badge badge-neutral ml-1">${c.urgency}</span>
          <h4 style="margin: 0.5rem 0 0.25rem 0;">${c.title}</h4>
          <span class="font-mono text-xs muted">Ticket ID: ${c.id}</span>
        </div>
        <div class="text-right text-xs muted">${c.createdAt}</div>
      </div>

      <p style="font-size: 0.9rem; margin: 0.75rem 0;" class="muted">${c.description}</p>

      <div style="font-size: 0.85rem; line-height: 1.6;">
        <div>📍 <strong>Location:</strong> ${c.address} (${c.coordinates})</div>
        <div>👮 <strong>Assigned Officer:</strong> ${c.officerName} (${c.officerId})</div>
      </div>

      <div class="status-stepper mt-3">
        <div class="step-item active">● Registered</div>
        <div class="step-item">○ Under Investigation</div>
        <div class="step-item">○ In Progress</div>
        <div class="step-item">○ Resolved</div>
      </div>

      <button class="btn btn-secondary btn-sm btn-block mt-3" onclick="switchUserTab('track')">View in My Complaints List</button>
    </div>
  `;
}

// Render User Complaints
function renderUserComplaints() {
  const container = document.getElementById('userComplaintsList');
  const search = (document.getElementById('searchMyComp') ? document.getElementById('searchMyComp').value : '').toLowerCase();
  const list = labDB.get('complain_registry') || [];

  const filtered = list.filter(c => c.citizenName.includes('Priya') && (c.id.toLowerCase().includes(search) || c.title.toLowerCase().includes(search)));

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-box"><p class="muted">No matching grievances found.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(c => {
    const isSubmitted = true;
    const isInvestigating = ['Under Investigation', 'In Progress', 'Resolved'].includes(c.status);
    const isInProgress = ['In Progress', 'Resolved'].includes(c.status);
    const isResolved = c.status === 'Resolved';

    return `
      <div class="complaint-card">
        <div class="complaint-header-flex">
          <div>
            <span class="badge ${c.status === 'Resolved' ? 'badge-success' : c.status === 'In Progress' ? 'badge-info' : 'badge-warning'}">${c.status}</span>
            <span class="badge badge-neutral ml-1">${c.category}</span>
            <h4 style="margin: 0.5rem 0 0.25rem 0;">${c.title}</h4>
            <span class="font-mono text-xs muted">Token: ${c.id} | Logged: ${c.createdAt}</span>
          </div>
          <div class="text-right">
            <span class="badge ${c.urgency === 'Critical' ? 'badge-danger' : 'badge-neutral'}">${c.urgency}</span>
          </div>
        </div>

        <p style="font-size: 0.9rem; margin: 0.5rem 0;" class="muted">${c.description}</p>
        <div style="font-size: 0.85rem;" class="muted">📍 ${c.address} (${c.coordinates}) | Officer: <strong>${c.officerName}</strong></div>

        <!-- Stepper -->
        <div class="status-stepper">
          <div class="step-item ${isSubmitted ? 'completed' : ''}">✓ Submitted</div>
          <div class="step-item ${isInvestigating ? (c.status === 'Under Investigation' ? 'active' : 'completed') : ''}">
            ${isInvestigating ? '✓' : '○'} Investigation
          </div>
          <div class="step-item ${isInProgress ? (c.status === 'In Progress' ? 'active' : 'completed') : ''}">
            ${isInProgress ? '✓' : '○'} In Progress
          </div>
          <div class="step-item ${isResolved ? 'completed' : ''}">
            ${isResolved ? '✓ Resolved' : '○ Resolved'}
          </div>
        </div>

        <!-- Evidence & Proof -->
        ${(c.photo || c.proofPhoto) ? `
          <div class="evidence-preview-grid">
            ${c.photo ? `
              <div class="evidence-box">
                <img src="${c.photo}" alt="Citizen Evidence" onerror="this.src='https://placehold.co/400x200/1e293b/white?text=Incident+Photo'">
                <div class="evidence-label">📷 Initial Citizen Proof</div>
              </div>
            ` : ''}
            ${c.proofPhoto ? `
              <div class="evidence-box">
                <img src="${c.proofPhoto}" alt="Officer Proof of Work" onerror="this.src='https://placehold.co/400x200/10b981/white?text=Work+Done'">
                <div class="evidence-label" style="color: #10b981;">✅ Field Officer Resolution Proof</div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${c.proofNotes ? `
          <div class="alert-banner alert-info text-xs mt-3" style="padding: 0.6rem;">
            <strong>Officer Remark:</strong> ${c.proofNotes}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Render Officer Tasks
function renderOfficerTasks() {
  const container = document.getElementById('officerTaskList');
  const filter = document.getElementById('officerFilterStatus').value;
  const list = labDB.get('complain_registry') || [];

  const officerTasks = list.filter(c => {
    const isForMe = c.officerId === 'OFF-402';
    if (filter === 'all') return isForMe;
    return isForMe && c.status === filter;
  });

  const pendingCount = list.filter(c => c.officerId === 'OFF-402' && c.status !== 'Resolved').length;
  document.getElementById('officerPendingCount').textContent = `${pendingCount} Assigned Action Required`;

  if (officerTasks.length === 0) {
    container.innerHTML = `<div class="empty-state-box col-span-2"><p class="muted">No grievances currently in this status queue.</p></div>`;
    return;
  }

  container.innerHTML = officerTasks.map(t => `
    <div class="officer-task-card">
      <div>
        <div class="complaint-header-flex">
          <span class="badge ${t.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${t.status}</span>
          <span class="badge ${t.urgency === 'Critical' ? 'badge-danger' : 'badge-neutral'}">${t.urgency}</span>
        </div>
        <h4 style="margin: 0.5rem 0 0.25rem 0;">${t.title}</h4>
        <div class="font-mono text-xs muted mb-2">Ticket: ${t.id} | Citizen: ${t.citizenName} (${t.phone})</div>
        <p class="muted text-sm">${t.description}</p>
        <div class="text-xs muted mt-2">📍 ${t.address}</div>
        <div class="text-xs font-mono muted">GPS: ${t.coordinates}</div>
      </div>

      <div class="mt-4">
        <button class="btn btn-primary btn-block btn-sm" onclick="openProofModal('${t.id}')">
          📷 Update Status & Proof of Work
        </button>
      </div>
    </div>
  `).join('');
}

// Officer Proof Modal
function openProofModal(taskId) {
  const list = labDB.get('complain_registry') || [];
  const task = list.find(t => t.id === taskId);
  if (!task) return;

  document.getElementById('proofTaskId').value = task.id;
  document.getElementById('proofTaskTicketDisplay').value = `${task.id} - ${task.title}`;
  document.getElementById('proofStatusSelect').value = task.status === 'Pending' ? 'In Progress' : task.status;
  document.getElementById('proofNotesInput').value = task.proofNotes || '';
  document.getElementById('officerProofModal').classList.remove('hidden');
}

function closeProofModal() {
  document.getElementById('officerProofModal').classList.add('hidden');
}

function handleOfficerSubmitProof(e) {
  e.preventDefault();
  const taskId = document.getElementById('proofTaskId').value;
  const newStatus = document.getElementById('proofStatusSelect').value;
  const photo = document.getElementById('proofPhotoInput').value.trim();
  const notes = document.getElementById('proofNotesInput').value.trim();

  const list = labDB.get('complain_registry') || [];
  const idx = list.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    list[idx].status = newStatus;
    list[idx].proofPhoto = photo;
    list[idx].proofNotes = notes;
    labDB.set('complain_registry', list);

    closeProofModal();
    renderOfficerTasks();
    renderUserComplaints();
    populateFeedbackSelect();
    renderAdminComplaints();
    updateMetrics();

    showAlert(`Ticket ${taskId} updated to "${newStatus}" and proof saved.`, 'success');
  }
}

// FAQs
function renderFaqs() {
  const container = document.getElementById('faqAccordion');
  container.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item">
      <div class="faq-question" onclick="toggleFaq(${i})">
        <span>${f.q}</span>
        <span>▼</span>
      </div>
      <div class="faq-answer" id="faqAns-${i}">${f.a}</div>
    </div>
  `).join('');
}

function toggleFaq(index) {
  const ans = document.getElementById(`faqAns-${index}`);
  if (ans.style.display === 'none') {
    ans.style.display = 'block';
  } else {
    ans.style.display = 'none';
  }
}

// Star Rating Picker
function initStarRating() {
  const container = document.getElementById('starRatingContainer');
  if (!container) return;
  const stars = container.querySelectorAll('.star');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val);
      document.getElementById('selectedStarValue').value = val;
      stars.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.val) <= val);
      });
    });
  });
}

function populateFeedbackSelect() {
  const sel = document.getElementById('feedbackCompSelect');
  if (!sel) return;
  const list = labDB.get('complain_registry') || [];
  const resolved = list.filter(c => c.status === 'Resolved');

  if (resolved.length === 0) {
    sel.innerHTML = `<option value="">No resolved complaints currently available for rating</option>`;
  } else {
    sel.innerHTML = resolved.map(c => `
      <option value="${c.id}">${c.id}: ${c.title} (Handled by ${c.officerName})</option>
    `).join('');
  }
}

function handleCitizenFeedback(e) {
  e.preventDefault();
  const compId = document.getElementById('feedbackCompSelect').value;
  const rating = parseInt(document.getElementById('selectedStarValue').value);
  const comment = document.getElementById('feedbackComment').value.trim();

  if (!compId) {
    showAlert('Please select a resolved complaint to rate.', 'danger');
    return;
  }

  const feedbacks = labDB.get('complain_feedbacks') || [];
  feedbacks.unshift({
    complaintId: compId,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0]
  });
  labDB.set('complain_feedbacks', feedbacks);

  document.getElementById('feedbackComment').value = '';
  showAlert(`Feedback submitted! Thank you for rating the municipal field resolution.`, 'success');
}

// Admin Operations
function renderAdminComplaints() {
  const tbody = document.getElementById('adminComplaintsTable');
  const list = labDB.get('complain_registry') || [];

  tbody.innerHTML = list.map(c => `
    <tr>
      <td class="font-mono font-bold">${c.id}</td>
      <td class="text-xs muted">${c.createdAt}</td>
      <td>${c.citizenName}</td>
      <td>${c.category}</td>
      <td class="text-xs">${c.address.substring(0, 24)}...</td>
      <td><span class="badge ${c.status === 'Resolved' ? 'badge-success' : c.status === 'In Progress' ? 'badge-info' : 'badge-warning'}">${c.status}</span></td>
      <td>${c.officerName}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="adminDeleteComplaint('${c.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function adminDeleteComplaint(id) {
  if (!confirm(`Confirm deletion of complaint ${id}?`)) return;
  let list = labDB.get('complain_registry') || [];
  list = list.filter(c => c.id !== id);
  labDB.set('complain_registry', list);

  renderAdminComplaints();
  renderUserComplaints();
  renderOfficerTasks();
  updateMetrics();
  showAlert(`Grievance record ${id} removed by administrator.`, 'info');
}

function renderAdminOfficers() {
  const tbody = document.getElementById('adminOfficersTable');
  const officers = labDB.get('complain_officers') || [];

  tbody.innerHTML = officers.map(o => `
    <tr>
      <td class="font-mono font-bold">${o.id}</td>
      <td>${o.name}</td>
      <td>${o.dept}</td>
      <td class="text-xs">${o.ward}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="adminRemoveOfficer('${o.id}')">Revoke</button>
      </td>
    </tr>
  `).join('');
}

function handleCreateOfficer(e) {
  e.preventDefault();
  const name = document.getElementById('newOfficerName').value.trim();
  const dept = document.getElementById('newOfficerDept').value;
  const ward = document.getElementById('newOfficerWard').value.trim();
  const mobile = document.getElementById('newOfficerMobile').value.trim();

  const officers = labDB.get('complain_officers') || [];
  const newId = `OFF-${Math.floor(410 + Math.random() * 80)}`;

  officers.push({
    id: newId,
    name,
    dept,
    ward,
    phone: mobile
  });
  labDB.set('complain_officers', officers);

  document.getElementById('createOfficerForm').reset();
  renderAdminOfficers();
  showAlert(`Officer credentials issued for ${name} (${newId})! Password: Grievance@2026`, 'success');
}

function adminRemoveOfficer(id) {
  let officers = labDB.get('complain_officers') || [];
  officers = officers.filter(o => o.id !== id);
  labDB.set('complain_officers', officers);
  renderAdminOfficers();
  showAlert(`Officer ${id} account revoked.`, 'info');
}

function updateMetrics() {
  const list = labDB.get('complain_registry') || [];
  document.getElementById('adminTotalComplaints').textContent = list.length;
  const pending = list.filter(c => c.status !== 'Resolved').length;
  document.getElementById('adminPendingCount').textContent = pending;
  const resolved = list.filter(c => c.status === 'Resolved').length;
  document.getElementById('adminResolvedCount').textContent = resolved;
}

function exportComplaintReport() {
  const list = labDB.get('complain_registry') || [];
  let csv = 'Ticket ID,Citizen,Category,Urgency,Status,Officer,Address\n';
  list.forEach(c => {
    csv += `"${c.id}","${c.citizenName}","${c.category}","${c.urgency}","${c.status}","${c.officerName}","${c.address}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ComplainEase_Registry_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

// Emergency Admin Contact Modal
function openAdminContactModal() {
  document.getElementById('adminContactModal').classList.remove('hidden');
}

function closeAdminContactModal() {
  document.getElementById('adminContactModal').classList.add('hidden');
}

function saveSystemSettings() {
  showAlert('System feature toggles updated successfully!', 'success');
}

// Alert Banner
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
