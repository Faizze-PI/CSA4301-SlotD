/**
 * Experiment 08: MedCare Hospital Online Appointment System
 * Doctor Specialties, Digital Check-in Triage, Multi-Branch Maps, and Admin Stats
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Doctors Seed
  const defaultDoctors = [
    { id: 'd1', name: 'Dr. Rajesh Sundaram, MD, DM', specialty: 'Cardiology', branch: 'Chennai Central', fee: 900, rating: 4.9, slots: 15 },
    { id: 'd2', name: 'Dr. Shalini Venkat, MD, DNB', specialty: 'Neurology', branch: 'OMR Campus', fee: 1000, rating: 4.8, slots: 12 },
    { id: 'd3', name: 'Dr. Arunachalam Pillai, MS (Ortho)', specialty: 'Orthopedics', branch: 'Anna Nagar', fee: 850, rating: 4.9, slots: 18 },
    { id: 'd4', name: 'Dr. Meenakshi Sundaram, MD', specialty: 'Pediatrics', branch: 'Chennai Central', fee: 750, rating: 4.9, slots: 20 },
    { id: 'd5', name: 'Dr. K. Balaji, MBBS, MD', specialty: 'General Medicine', branch: 'Chennai Central', fee: 600, rating: 4.7, slots: 25 }
  ];

  // Appointments Seed
  const defaultAppointments = [
    {
      token: 'MC-7021',
      patientName: 'Faizze A.',
      doctor: 'Dr. Rajesh Sundaram, MD, DM',
      specialty: 'Cardiology',
      branch: 'Chennai Central',
      date: '2026-10-15',
      timeSlot: '11:00 AM',
      fee: 900,
      checkedIn: true,
      status: 'Confirmed'
    }
  ];

  // Check-In Submissions Seed
  const defaultCheckIns = [
    {
      id: 'CI-101',
      name: 'Faizze A.',
      symptoms: 'Mild chest tightness after jogging',
      duration: '3 days',
      allergies: 'None',
      submittedAt: '2026-10-06'
    }
  ];

  // Branches Seed
  const defaultBranches = [
    { name: 'MedCare Central Hospital', address: 'No. 12, Poonamallee High Rd, Chennai - 600003', coords: '13.0827° N, 80.2707° E', phone: '044-25367000' },
    { name: 'MedCare OMR Health City', address: 'Plot 4, IT Corridor, Sholinganallur, Chennai - 600119', coords: '12.9010° N, 80.2279° E', phone: '044-49008000' },
    { name: 'MedCare Anna Nagar Hospital', address: '2nd Avenue, Roundtana, Anna Nagar, Chennai - 600040', coords: '13.0850° N, 80.2101° E', phone: '044-26219000' }
  ];

  db.seedIfEmpty('med_doctors', defaultDoctors);
  db.seedIfEmpty('med_appointments', defaultAppointments);
  db.seedIfEmpty('med_checkins', defaultCheckIns);
  db.seedIfEmpty('med_branches', defaultBranches);

  // Role Switcher
  const roleSelect = document.getElementById('medRoleSelect');
  const patientSection = document.getElementById('medPatientSection');
  const branchSection = document.getElementById('medBranchSection');
  const adminSection = document.getElementById('medAdminSection');

  roleSelect.addEventListener('change', (e) => {
    patientSection.style.display = 'none';
    branchSection.style.display = 'none';
    adminSection.style.display = 'none';

    if (e.target.value === 'admin') {
      adminSection.style.display = 'block';
      renderAdminDoctors();
      renderAdminStats();
    } else if (e.target.value === 'hospital') {
      branchSection.style.display = 'block';
    } else {
      patientSection.style.display = 'block';
      renderDoctors();
      renderPatientAppointments();
      renderHospitalBranches();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#medPatientSection') || btn.closest('#medAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- PATIENT VIEW FUNCTIONS ---
  function renderDoctors() {
    const spec = document.getElementById('specialtyFilter').value;
    const branch = document.getElementById('hospitalLocationFilter').value;
    const query = document.getElementById('doctorSearchInput').value.toLowerCase().trim();

    const grid = document.getElementById('doctorsGrid');
    grid.innerHTML = '';

    const list = db.get('med_doctors').filter(d => {
      const matchSpec = spec === 'all' || d.specialty === spec;
      const matchBranch = branch === 'all' || d.branch === branch;
      const matchQuery = d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query);
      return matchSpec && matchBranch && matchQuery;
    });

    if (list.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No doctors matching your filter criteria.</p>';
      return;
    }

    list.forEach(d => {
      const card = document.createElement('div');
      card.className = 'doctor-card';
      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between;">
            <span class="badge badge-primary">${d.specialty}</span>
            <span style="color: #f59e0b; font-weight: 700;">★ ${d.rating}</span>
          </div>
          <h3 style="margin: 0.5rem 0 0.2rem 0; font-size: 1.1rem;">${d.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Branch: <strong>${d.branch}</strong></p>
          <p style="font-size: 0.8rem; color: var(--success); margin-top: 0.25rem;">Daily Quota: ${d.slots} consultation slots</p>
        </div>
        <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">₹${d.fee}</div>
          <button class="btn btn-primary btn-sm" onclick="openDoctorModal('${d.id}')">Book Appointment</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('specialtyFilter').addEventListener('change', renderDoctors);
  document.getElementById('hospitalLocationFilter').addEventListener('change', renderDoctors);
  document.getElementById('doctorSearchInput').addEventListener('input', renderDoctors);

  let activeBookingDoctor = null;

  window.openDoctorModal = (docId) => {
    const doc = db.findById('med_doctors', docId);
    if (!doc) return;

    activeBookingDoctor = doc;
    document.getElementById('docModalTitle').innerText = `Consultation with ${doc.name}`;
    document.getElementById('docModalSubtitle').innerText = `${doc.specialty} | Branch: ${doc.branch}`;
    document.getElementById('docModalFee').innerText = `₹${doc.fee}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('docApptDate').value = tomorrow.toISOString().split('T')[0];

    document.getElementById('doctorBookingModal').style.display = 'flex';
  };

  window.closeDoctorModal = () => {
    document.getElementById('doctorBookingModal').style.display = 'none';
    activeBookingDoctor = null;
  };

  document.getElementById('docApptForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeBookingDoctor) return;

    const date = document.getElementById('docApptDate').value;
    const timeSlot = document.getElementById('docApptSlot').value;
    const patientName = document.getElementById('docPatientName').value.trim();
    const phone = document.getElementById('docPatientPhone').value.trim();

    const token = 'MC-' + Math.floor(1000 + Math.random() * 9000);

    db.insert('med_appointments', {
      token,
      patientName,
      doctor: activeBookingDoctor.name,
      specialty: activeBookingDoctor.specialty,
      branch: activeBookingDoctor.branch,
      date,
      timeSlot,
      fee: activeBookingDoctor.fee,
      checkedIn: false,
      status: 'Confirmed'
    });

    alert(`Consultation Confirmed!\nToken #: ${token}\nDoctor: ${activeBookingDoctor.name}\nSchedule: ${date} at ${timeSlot}\nSMS confirmation sent to ${phone}.`);
    closeDoctorModal();
    renderPatientAppointments();
    document.querySelector('.tab-btn[data-tab="myHospitalBookingsTab"]').click();
  });

  // Digital Check-in
  document.getElementById('patientCheckInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ciName').value.trim();
    const symptoms = document.getElementById('ciSymptoms').value.trim();
    const duration = document.getElementById('ciDuration').value.trim();
    const allergies = document.getElementById('ciAllergies').value.trim();

    const newCi = 'CI-' + Math.floor(100 + Math.random() * 900);
    db.insert('med_checkins', {
      id: newCi,
      name,
      symptoms,
      duration,
      allergies,
      submittedAt: new Date().toISOString().split('T')[0]
    });

    // Mark active appointment checked-in
    const appts = db.get('med_appointments');
    const myAppt = appts.find(a => a.patientName.toLowerCase() === name.toLowerCase());
    if (myAppt) {
      db.update('med_appointments', myAppt.id, { checkedIn: true });
    }

    alert(`Digital Pre-Check-In Received (#${newCi})!\nYour triage summary has been sent directly to the consulting doctor's electronic health record.`);
    document.getElementById('patientCheckInForm').reset();
    renderPatientAppointments();
    document.querySelector('.tab-btn[data-tab="myHospitalBookingsTab"]').click();
  });

  function renderPatientAppointments() {
    const tbody = document.getElementById('patientAppointmentsTableBody');
    tbody.innerHTML = '';
    const list = db.get('med_appointments');

    list.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.token}</strong></td>
        <td>${a.doctor}</td>
        <td>${a.specialty}</td>
        <td>${a.branch}</td>
        <td>${a.date} (${a.timeSlot})</td>
        <td><span class="badge ${a.checkedIn ? 'badge-success' : 'badge-warning'}">${a.checkedIn ? 'Pre-Checked In' : 'Pending Check-In'}</span></td>
        <td><span class="badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
        <td>
          ${a.status === 'Confirmed' ? `<button class="btn btn-danger btn-sm" onclick="cancelHospitalAppt('${a.token}')">Cancel</button>` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Cancelled</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.cancelHospitalAppt = (token) => {
    const a = db.get('med_appointments').find(item => item.token === token);
    if (!a) return;
    if (confirm(`Cancel consultation appointment #${token}?`)) {
      db.update('med_appointments', a.id, { status: 'Cancelled' });
      alert('Appointment cancelled.');
      renderPatientAppointments();
    }
  };

  function renderHospitalBranches() {
    const container = document.getElementById('hospitalBranchList');
    container.innerHTML = '';
    const branches = db.get('med_branches');

    branches.forEach((b, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '0.75rem';
      card.style.marginBottom = '0.5rem';
      card.style.cursor = 'pointer';
      card.onclick = () => {
        document.getElementById('activeMapLocationTitle').innerText = b.name;
        document.getElementById('activeMapLocationCoords').innerText = `GPS Coordinates: ${b.coords} | Helpline: ${b.phone}`;
      };
      card.innerHTML = `
        <h4 style="margin: 0; color: var(--primary);">${b.name}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0;">${b.address}</p>
        <small style="color: #059669;">📞 ${b.phone}</small>
      `;
      container.appendChild(card);
    });
  }

  // --- ADMIN FUNCTIONS ---
  function renderAdminDoctors() {
    const tbody = document.getElementById('adminDoctorsTableBody');
    tbody.innerHTML = '';
    db.get('med_doctors').forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${d.name}</strong></td>
        <td>${d.specialty}</td>
        <td>${d.branch}</td>
        <td>₹${d.fee}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeDoctorAdmin('${d.id}')">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.removeDoctorAdmin = (id) => {
    if (confirm('De-list doctor from hospital panel?')) {
      db.remove('med_doctors', id);
      renderAdminDoctors();
    }
  };

  document.getElementById('adminDoctorForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('docName').value.trim();
    const specialty = document.getElementById('docSpecialty').value;
    const branch = document.getElementById('docBranch').value;
    const fee = parseInt(document.getElementById('docFee').value, 10);
    const slots = parseInt(document.getElementById('docQuota').value, 10);

    db.insert('med_doctors', { name, specialty, branch, fee, rating: 5.0, slots });
    alert(`Doctor ${name} enrolled successfully!`);
    document.getElementById('adminDoctorForm').reset();
    renderAdminDoctors();
  });

  function renderAdminStats() {
    const appts = db.get('med_appointments');
    const checkedInCount = appts.filter(a => a.checkedIn).length;

    document.getElementById('statTotalAppts').innerText = appts.length;
    document.getElementById('statPreCheckedIn').innerText = checkedInCount;

    const tbody = document.getElementById('adminApptsListBody');
    tbody.innerHTML = '';
    appts.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.token}</strong></td>
        <td>${a.patientName}</td>
        <td>${a.doctor} (${a.specialty})</td>
        <td>${a.date} @ ${a.timeSlot}</td>
        <td><span class="badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial runs
  renderDoctors();
  renderPatientAppointments();
  renderHospitalBranches();
});
