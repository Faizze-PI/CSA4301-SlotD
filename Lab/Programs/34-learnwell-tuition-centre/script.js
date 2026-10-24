/**
 * LearnWell Tuition Centre Management & Progress Portal
 * Experiment 34 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  COURSES: 'learnwell_courses_v1',
  STUDENTS: 'learnwell_students_v1',
  ANNOUNCEMENTS: 'learnwell_announcements_v1',
  SCORES: 'learnwell_scores_v1',
  MAINTENANCE: 'learnwell_maintenance_v1'
};

const DEFAULT_COURSES = [
  { id: 'CRS-01', name: 'Class 12 Board PCM+B Intensive', grade: 'Class 12 Science', mode: 'Offline Classroom', duration: '10 Months Academic Year', feeMonthly: 4500, faculty: 'Mrs. Radhika K. & Dr. Sundar', desc: 'Comprehensive coverage of CBSE NCERT theory, weekly unit test series, and board practical lab guidance.' },
  { id: 'CRS-02', name: 'JEE Advanced Mathematics & Physics Masterclass', grade: 'JEE/NEET', mode: 'Offline Classroom', duration: '1 Year Program', feeMonthly: 5500, faculty: 'Er. Anand Narayanan (IIT-M)', desc: 'High-order analytical problem solving, previous 15-year question dissection, and speed mock tests.' },
  { id: 'CRS-03', name: 'Class 10 CBSE Foundation & Board Sprint', grade: 'Class 10 CBSE', mode: 'Online Live Interactive', duration: '8 Months', feeMonthly: 3000, faculty: 'Prof. Geetha Raman', desc: 'Daily live classes, digital whiteboards, doubt clearing rooms, and chapter-wise formula flashcards.' },
  { id: 'CRS-04', name: 'NEET Medical Biology & Organic Chemistry Duo', grade: 'JEE/NEET', mode: 'Online Live Interactive', duration: '6 Months Fast-Track', feeMonthly: 4200, faculty: 'Dr. Kavitha Selvam (MD)', desc: 'NCERT line-by-line decoding, 3D anatomical diagram drills, and full-syllabus timed tests.' }
];

const DEFAULT_ANNOUNCEMENTS = [
  { id: 'NOT-01', title: '📢 Mid-Term Assessment Test Dates Announced', details: 'Term 1 Mid-Term evaluations commence on October 18, 2026 for Class 10 & 12 students. Seating rosters posted in centre lobby.', date: '2026-10-05', by: 'Academic Director' },
  { id: 'NOT-02', title: '🪔 Diwali Festival Break & Special Revision Batches', details: 'Offline centre remains closed from Oct 29 to Nov 02. Optional online revision sessions will stream on Zoom.', date: '2026-10-03', by: 'Centre Admin' }
];

const DEFAULT_TIMETABLE = [
  { day: 'Monday (05:30 - 07:30 PM)', subject: 'Physics (Electromagnetism)', faculty: 'Mrs. Radhika K.', mode: 'Offline Hall 204' },
  { day: 'Wednesday (05:30 - 07:30 PM)', subject: 'Chemistry (Organic Reactions)', faculty: 'Dr. Sundar', mode: 'Offline Hall 204' },
  { day: 'Friday (05:30 - 07:30 PM)', subject: 'Mathematics (Calculus & Vectors)', faculty: 'Er. Anand N.', mode: 'Offline Hall 204' },
  { day: 'Saturday (03:00 - 06:00 PM)', subject: 'JEE / NEET Full Mock Test', faculty: 'Exam Cell', mode: 'Lab Terminal' }
];

const DEFAULT_SCORES = [
  { student: 'R. Karthik (STU-8821)', period: 'September Monthly Test', subject: 'Physics', marks: 92, grade: 'A+', remarks: 'Outstanding mathematical derivations and clean circuit diagrams.' },
  { student: 'R. Karthik (STU-8821)', period: 'September Monthly Test', subject: 'Mathematics', marks: 88, grade: 'A', remarks: 'Good grasp of differential equations. Practice matrix proofs.' },
  { student: 'R. Karthik (STU-8821)', period: 'August Unit Test', subject: 'Chemistry', marks: 95, grade: 'A+', remarks: 'Exceptional reaction mechanisms and stereochemistry accuracy.' }
];

const DEFAULT_STUDENTS = [
  { id: 'STU-8821', name: 'R. Karthik', parentPhone: '+91 94441 88299', course: 'Class 12 Board PCM+B Intensive', mode: 'Offline Classroom', fee: 4500, status: 'Fees Paid (Oct 2026)' },
  { id: 'STU-8822', name: 'Pooja Sundaram', parentPhone: '+91 98402 33412', course: 'Class 10 CBSE Foundation', mode: 'Online Live Interactive', fee: 3000, status: 'Fees Paid (Oct 2026)' },
  { id: 'STU-8823', name: 'M. Vikram', parentPhone: '+91 97910 55431', course: 'JEE Advanced Masterclass', mode: 'Offline Classroom', fee: 5500, status: 'Due on Oct 10' }
];

const DEFAULT_MAINTENANCE = [
  { id: 'MNT-101', category: 'Classroom AC / Projector Hardware', room: 'Hall 204', desc: 'Air conditioning unit 2 making clicking noise; technician required before evening batch.', status: 'Pending Resolution', date: '2026-10-06' }
];

let appState = {
  currentRole: 'student',
  activeStudentTab: 'announcements',
  courses: [],
  announcements: [],
  students: [],
  scores: [],
  maintenance: []
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  appState.courses = labDB.get(STORAGE_KEYS.COURSES) || DEFAULT_COURSES;
  appState.announcements = labDB.get(STORAGE_KEYS.ANNOUNCEMENTS) || DEFAULT_ANNOUNCEMENTS;
  appState.students = labDB.get(STORAGE_KEYS.STUDENTS) || DEFAULT_STUDENTS;
  appState.scores = labDB.get(STORAGE_KEYS.SCORES) || DEFAULT_SCORES;
  appState.maintenance = labDB.get(STORAGE_KEYS.MAINTENANCE) || DEFAULT_MAINTENANCE;
}

function renderApp() {
  renderAnnouncements();
  renderTimetable();
  renderCourses();
  renderProgressScores();
  renderFeesLedger();
  renderAdminStudents();
  renderAdminMaintenance();
  updateAdminMetrics();
  updateEnrollmentFeePreview();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('studentSection').classList.toggle('hidden', role !== 'student');
  document.getElementById('teacherSection').classList.toggle('hidden', role !== 'teacher');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminStudents();
    renderAdminMaintenance();
    updateAdminMetrics();
  }
}

// Student Tabs
function switchStudentTab(tabName) {
  appState.activeStudentTab = tabName;
  const tabs = {
    announcements: 'stuTabAnnouncements',
    courses: 'stuTabCourses',
    enroll: 'stuTabEnroll',
    progress: 'stuTabProgress',
    maintenance: 'stuTabMaintenance'
  };

  document.querySelectorAll('#studentSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  if (!container) return;

  container.innerHTML = appState.announcements.map(a => `
    <div class="announcement-item">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h4>${a.title}</h4>
        <span class="muted text-xs font-mono">${a.date}</span>
      </div>
      <p class="text-sm my-1">${a.details}</p>
      <span class="text-xs muted">Posted by: <strong>${a.by}</strong></span>
    </div>
  `).join('');
}

function renderTimetable() {
  const tbody = document.getElementById('studentTimetableBody');
  if (!tbody) return;

  tbody.innerHTML = DEFAULT_TIMETABLE.map(t => `
    <tr>
      <td class="font-mono text-xs font-bold">${t.day}</td>
      <td><strong>${t.subject}</strong></td>
      <td class="text-xs">${t.faculty}</td>
      <td><span class="badge badge-primary text-xs">${t.mode}</span></td>
    </tr>
  `).join('');
}

// Courses Catalog
function filterCourses() {
  const grade = document.getElementById('courseGradeFilter').value;
  const mode = document.getElementById('courseModeFilter').value;
  renderCourses(grade, mode);
}

function renderCourses(gradeFilter = 'All', modeFilter = 'All') {
  const grid = document.getElementById('coursesCatalogGrid');
  if (!grid) return;

  let list = appState.courses;
  if (gradeFilter !== 'All') {
    list = list.filter(c => c.grade === gradeFilter);
  }
  if (modeFilter !== 'All') {
    list = list.filter(c => c.mode === modeFilter);
  }

  grid.innerHTML = list.map(c => `
    <div class="course-card">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span class="badge badge-primary text-xs">${c.grade}</span>
          <span class="badge ${c.mode.includes('Online') ? 'badge-warning' : 'badge-success'} text-xs">${c.mode}</span>
        </div>
        <h4 class="mt-2">${c.name}</h4>
        <p class="text-xs muted mt-1">Faculty: <strong>${c.faculty}</strong> | Duration: ${c.duration}</p>
        <p class="text-sm muted my-2">${c.desc}</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 1rem;">
        <div>
          <span class="muted text-xs block">Tuition Fee</span>
          <span class="font-bold text-success font-mono" style="font-size: 1.25rem;">₹${c.feeMonthly.toLocaleString()}/mo</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="switchStudentTab('enroll')">Enroll Now</button>
      </div>
    </div>
  `).join('');
}

// Enrollment
function updateEnrollmentFeePreview() {
  const subSelect = document.getElementById('regSubjectChoice');
  if (!subSelect) return;

  const option = subSelect.options[subSelect.selectedIndex];
  const monthly = parseFloat(option.getAttribute('data-fee')) || 4500;
  const regFee = 500;
  const total = monthly + regFee;

  document.getElementById('enrollMonthlyFee').innerText = `₹${monthly.toLocaleString()}.00`;
  document.getElementById('enrollTotalPayable').innerText = `₹${total.toLocaleString()}.00`;
}

function handleEnrollStudentSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('regStudentName').value.trim();
  const phone = document.getElementById('regParentMobile').value.trim();
  const standard = document.getElementById('regStandardSelect').value;
  const mode = document.getElementById('regDeliveryMode').value;
  const subChoice = document.getElementById('regSubjectChoice').value;

  const subSelect = document.getElementById('regSubjectChoice');
  const fee = parseFloat(subSelect.options[subSelect.selectedIndex].getAttribute('data-fee')) || 4500;

  const newStudent = {
    id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
    name,
    parentPhone: phone,
    course: `${standard} - ${subChoice}`,
    mode,
    fee,
    status: 'Enrolled (Fees Paid)'
  };

  appState.students.unshift(newStudent);
  labDB.set(STORAGE_KEYS.STUDENTS, appState.students);

  showAlert(`🎉 Student Registered! Permanent Enrollment ID: ${newStudent.id}`, 'success');
  renderAdminStudents();
  updateAdminMetrics();
  switchStudentTab('progress');
}

// Progress & Fees
function renderProgressScores() {
  const tbody = document.getElementById('progressScoresTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.scores.map(s => `
    <tr>
      <td class="font-mono text-xs">${s.period}</td>
      <td><strong>${s.subject}</strong></td>
      <td class="font-mono font-bold text-success">${s.marks} / 100</td>
      <td><span class="badge ${s.grade === 'A+' ? 'badge-success' : 'badge-primary'}">${s.grade}</span></td>
      <td class="text-xs muted">${s.remarks}</td>
    </tr>
  `).join('');
}

function renderFeesLedger() {
  const container = document.getElementById('feesPaidLedger');
  if (!container) return;

  container.innerHTML = `
    <div class="fee-breakdown-card mb-2">
      <div class="fee-row">
        <span>Receipt Ref: <strong>RCP-LW-9921</strong> (October 2026 Tuition)</span>
        <span class="font-bold text-success font-mono">₹4,500.00 [PAID]</span>
      </div>
      <p class="text-xs muted mt-1">Payment Method: Online UPI • Paid on 02 Oct 2026</p>
    </div>
    <div class="fee-breakdown-card">
      <div class="fee-row">
        <span>Receipt Ref: <strong>RCP-LW-9840</strong> (September 2026 Tuition)</span>
        <span class="font-bold text-success font-mono">₹4,500.00 [PAID]</span>
      </div>
      <p class="text-xs muted mt-1">Payment Method: Net Banking • Paid on 03 Sep 2026</p>
    </div>
  `;
}

// Maintenance Tickets
function handleMaintenanceSubmit(event) {
  event.preventDefault();
  const cat = document.getElementById('maintCategory').value;
  const room = document.getElementById('maintRoom').value.trim();
  const desc = document.getElementById('maintDescription').value.trim();

  const ticket = {
    id: 'MNT-' + Math.floor(100 + Math.random() * 900),
    category: cat,
    room,
    desc,
    status: 'Pending Resolution',
    date: new Date().toISOString().split('T')[0]
  };

  appState.maintenance.unshift(ticket);
  labDB.set(STORAGE_KEYS.MAINTENANCE, appState.maintenance);

  document.getElementById('maintDescription').value = '';
  showAlert(`🛠️ Maintenance Ticket ${ticket.id} lodged with Centre Administration.`, 'success');
  renderAdminMaintenance();
  updateAdminMetrics();
}

// Teacher Actions
function handleRecordTestScore(event) {
  event.preventDefault();
  const student = document.getElementById('teacherStudentSelect').value;
  const subject = document.getElementById('teacherSubjectInput').value.trim();
  const marks = parseInt(document.getElementById('teacherScoreInput').value, 10);
  const period = document.getElementById('teacherPeriodSelect').value;
  const remarks = document.getElementById('teacherRemarksInput').value.trim();

  let grade = 'B';
  if (marks >= 90) grade = 'A+';
  else if (marks >= 80) grade = 'A';
  else if (marks >= 70) grade = 'B+';

  const newScore = { student, period, subject, marks, grade, remarks };

  appState.scores.unshift(newScore);
  labDB.set(STORAGE_KEYS.SCORES, appState.scores);

  document.getElementById('teacherRemarksInput').value = '';
  showAlert(`✅ Assessment Score (${marks}/100 - Grade ${grade}) published to ${student}'s report!`, 'success');
  renderProgressScores();
}

function handleTeacherPostNotice(event) {
  event.preventDefault();
  const title = document.getElementById('noticeTitle').value.trim();
  const details = document.getElementById('noticeDetails').value.trim();

  const notice = {
    id: 'NOT-' + Date.now().toString().slice(-4),
    title: '📢 ' + title,
    details,
    date: new Date().toISOString().split('T')[0],
    by: 'Mrs. Radhika K. (Faculty)'
  };

  appState.announcements.unshift(notice);
  labDB.set(STORAGE_KEYS.ANNOUNCEMENTS, appState.announcements);

  document.getElementById('noticeTitle').value = '';
  document.getElementById('noticeDetails').value = '';
  showAlert('Notice broadcasted to all enrolled students!', 'success');
  renderAnnouncements();
}

// Admin Views
function renderAdminStudents() {
  const tbody = document.getElementById('adminStudentsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.students.map(s => `
    <tr>
      <td class="font-mono font-bold">${s.id}</td>
      <td><strong>${s.name}</strong><br><span class="muted text-xs">${s.parentPhone}</span></td>
      <td class="text-xs">${s.course}</td>
      <td><span class="badge badge-secondary text-xs">${s.mode}</span></td>
      <td class="font-mono font-bold text-success">₹${s.fee}</td>
      <td><span class="badge badge-success text-xs">${s.status}</span></td>
    </tr>
  `).join('');
}

function renderAdminMaintenance() {
  const container = document.getElementById('adminMaintenanceTicketsList');
  if (!container) return;

  container.innerHTML = appState.maintenance.map(m => `
    <div class="maintenance-item-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge ${m.status === 'Resolved' ? 'badge-success' : 'badge-warning'} text-xs mb-1">${m.status}</span>
          <h4 class="mt-1">${m.category} (${m.room})</h4>
          <p class="text-sm muted">${m.desc}</p>
        </div>
        <div>
          ${m.status !== 'Resolved' ? `
            <button class="btn btn-success btn-xs" onclick="adminResolveMaint('${m.id}')">Mark Resolved</button>
          ` : `
            <span class="text-xs muted font-mono">Closed</span>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

function adminResolveMaint(ticketId) {
  const m = appState.maintenance.find(x => x.id === ticketId);
  if (!m) return;

  m.status = 'Resolved';
  labDB.set(STORAGE_KEYS.MAINTENANCE, appState.maintenance);
  showAlert(`Maintenance ticket ${m.id} marked as resolved.`, 'info');
  renderAdminMaintenance();
  updateAdminMetrics();
}

function updateAdminMetrics() {
  const elS = document.getElementById('adminTotalStudents');
  const elF = document.getElementById('adminTotalFeesCollected');
  const elM = document.getElementById('adminPendingMaintTickets');

  if (elS) elS.innerText = appState.students.length;
  if (elF) elF.innerText = `₹${(appState.students.length * 4500).toLocaleString()}`;
  if (elM) elM.innerText = appState.maintenance.filter(m => m.status !== 'Resolved').length;
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
