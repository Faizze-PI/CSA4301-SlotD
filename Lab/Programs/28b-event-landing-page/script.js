/**
 * NexusTech 2026 - Global AI & Cloud Summit Event Landing Page
 * Experiment 28b - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  ATTENDEES: 'nexustech_attendees_v1'
};

const DEFAULT_ATTENDEES = [
  {
    id: 'NEXUS-8801',
    name: 'Abishek Ramanathan',
    email: 'abishek@deepcompute.ai',
    org: 'DeepCompute Labs',
    designation: 'Senior Machine Learning Engineer',
    tier: 'General Professional',
    price: 1999,
    track: 'Agentic AI & LLMs',
    date: '2026-10-04',
    status: 'Confirmed'
  },
  {
    id: 'NEXUS-8802',
    name: 'Priyanka Sundaram',
    email: 'priyanka@saveetha.ac.in',
    org: 'SIMATS School of Engineering',
    designation: 'B.Tech CSE Student Researcher',
    tier: 'Student Pass',
    price: 499,
    track: 'Cloud Kubernetes',
    date: '2026-10-05',
    status: 'Confirmed'
  },
  {
    id: 'NEXUS-8803',
    name: 'Marcus Sterling',
    email: 'm.sterling@vanguard-vc.com',
    org: 'Vanguard Tech Ventures',
    designation: 'Managing Partner',
    tier: 'VIP Executive',
    price: 4999,
    track: 'Post-Quantum Security',
    date: '2026-10-06',
    status: 'Checked-In'
  }
];

let appState = {
  currentRole: 'attendee',
  attendees: []
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const stored = labDB.get(STORAGE_KEYS.ATTENDEES);
  if (!stored || stored.length === 0) {
    labDB.set(STORAGE_KEYS.ATTENDEES, DEFAULT_ATTENDEES);
    appState.attendees = [...DEFAULT_ATTENDEES];
  } else {
    appState.attendees = stored;
  }
}

function renderApp() {
  renderAdminAttendees();
  updateAdminMetrics();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('attendeeSection').classList.toggle('hidden', role !== 'attendee');
  document.getElementById('organizerSection').classList.toggle('hidden', role !== 'organizer');

  if (role === 'organizer') {
    renderAdminAttendees();
    updateAdminMetrics();
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Registration Modal
function openRegisterModal() {
  updatePassTierTariff();
  document.getElementById('registerModal').classList.remove('hidden');
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.add('hidden');
}

function updatePassTierTariff() {
  const select = document.getElementById('regPassTier');
  const option = select.options[select.selectedIndex];
  const price = option.getAttribute('data-price') || 1999;

  document.getElementById('regTariffDisplay').innerText = `₹${parseInt(price).toLocaleString()}.00`;

  const includesEl = document.getElementById('regIncludesText');
  if (select.value === 'Student Pass') {
    includesEl.innerText = 'Valid with College Student ID: Keynote access + workshop certificate.';
  } else if (select.value === 'General Professional') {
    includesEl.innerText = 'All keynote sessions, buffet luncheon, and technical workshops.';
  } else {
    includesEl.innerText = 'All-Access VIP lounge, 1-on-1 speaker dinner, executive gift bag, and priority seating.';
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('regFullName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const org = document.getElementById('regOrg').value.trim();
  const designation = document.getElementById('regDesignation').value.trim();
  const tier = document.getElementById('regPassTier').value;
  const track = document.getElementById('regWorkshopTrack').value;

  const select = document.getElementById('regPassTier');
  const price = parseInt(select.options[select.selectedIndex].getAttribute('data-price'), 10) || 1999;

  const newAttendee = {
    id: 'NEXUS-' + Math.floor(1000 + Math.random() * 9000),
    name,
    email,
    org,
    designation,
    tier,
    price,
    track,
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmed'
  };

  appState.attendees.unshift(newAttendee);
  labDB.set(STORAGE_KEYS.ATTENDEES, appState.attendees);

  closeRegisterModal();
  showAlert(`🎉 Registration Confirmed! Delegate ID: ${newAttendee.id}. Your digital badge is ready.`, 'success');

  renderAdminAttendees();
  updateAdminMetrics();
  openBadgeModal(newAttendee.id);
}

// Digital Badge Modal
function openBadgeModal(regId) {
  const att = appState.attendees.find(a => a.id === regId);
  if (!att) return;

  const container = document.getElementById('badgeContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="badge-header">
      <h2 style="margin: 0; color: #818cf8;">NexusTech 2026</h2>
      <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">GLOBAL AI & CLOUD SUMMIT • CHENNAI</p>
      <span class="badge ${att.tier === 'VIP Executive' ? 'badge-primary' : 'badge-success'} mt-2">${att.tier.toUpperCase()}</span>
    </div>

    <div style="font-size: 3rem; margin: 0.5rem 0;">👤</div>
    <h3 style="margin: 0;">${att.name}</h3>
    <p class="muted text-sm" style="margin: 0.25rem 0;">${att.designation}</p>
    <p class="font-bold text-sm" style="color: #c7d2fe;">${att.org}</p>

    <div class="badge-qr-box">
      <div style="font-family: monospace; font-size: 0.65rem; line-height: 1; font-weight: 900;">
        ███ █ ███<br>
        █ █ █ █ █<br>
        ███ █ ███<br>
        ██ █ ██ █<br>
        ███ █ █ █
      </div>
      <span style="font-family: monospace; font-size: 0.75rem; font-weight: 700; margin-top: 4px;">${att.id}</span>
    </div>

    <div style="font-size: 0.85rem; color: #94a3b8; border-top: 1px dashed rgba(255, 255, 255, 0.2); padding-top: 0.75rem;">
      <strong>Track:</strong> ${att.track}<br>
      <span class="text-xs">Venue: SIMATS Grand Auditorium & Convention Center</span>
    </div>
  `;

  document.getElementById('badgeModal').classList.remove('hidden');
}

function closeBadgeModal() {
  document.getElementById('badgeModal').classList.add('hidden');
}

// Organizer Dashboard
function renderAdminAttendees() {
  const tbody = document.getElementById('adminAttendeesTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.attendees.map(a => `
    <tr>
      <td class="font-mono font-bold text-primary">${a.id}</td>
      <td>
        <strong>${a.name}</strong><br>
        <span class="muted text-xs">${a.email}</span>
      </td>
      <td>
        <strong>${a.org}</strong><br>
        <span class="text-xs muted">${a.designation}</span>
      </td>
      <td>
        <span class="badge ${a.tier === 'VIP Executive' ? 'badge-primary' : (a.tier === 'Student Pass' ? 'badge-success' : 'badge-secondary')} text-xs">
          ${a.tier}
        </span>
      </td>
      <td class="text-xs">${a.track}</td>
      <td class="font-mono text-xs">${a.date}</td>
      <td>
        <button class="btn ${a.status === 'Checked-In' ? 'btn-success' : 'btn-outline'} btn-xs" onclick="toggleCheckIn('${a.id}')">
          ${a.status === 'Checked-In' ? '✅ Checked-In' : 'Gate Check-In'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleCheckIn(regId) {
  const a = appState.attendees.find(x => x.id === regId);
  if (!a) return;

  a.status = a.status === 'Checked-In' ? 'Confirmed' : 'Checked-In';
  labDB.set(STORAGE_KEYS.ATTENDEES, appState.attendees);

  showAlert(`Delegate ${a.name} status updated to: ${a.status}`, 'info');
  renderAdminAttendees();
}

function updateAdminMetrics() {
  const total = appState.attendees.length;
  const students = appState.attendees.filter(a => a.tier === 'Student Pass').length;
  const vips = appState.attendees.filter(a => a.tier === 'VIP Executive').length;

  const elT = document.getElementById('adminTotalAttendees');
  const elS = document.getElementById('adminStudentTickets');
  const elV = document.getElementById('adminVipTickets');

  if (elT) elT.innerText = total;
  if (elS) elS.innerText = students;
  if (elV) elV.innerText = vips;
}

function exportAttendeesSimulated() {
  showAlert(`Exported ${appState.attendees.length} delegate records to CSV format.`, 'info');
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
