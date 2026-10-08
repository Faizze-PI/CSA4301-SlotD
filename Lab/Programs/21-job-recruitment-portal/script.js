// TalentBridge Job Portal Script

const DEFAULT_VACANCIES = [
  {
    id: 'JOB-101',
    title: 'Senior Frontend Architect (React / TypeScript)',
    company: 'NexaWave Innovations Ltd',
    location: 'Chennai',
    category: 'Engineering & IT',
    salary: '₹18 - 26 LPA',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    desc: 'Architect modern micro-frontend applications, design systems, and responsive enterprise dashboard architectures.',
    postedDate: '2026-10-02',
    status: 'Active'
  },
  {
    id: 'JOB-102',
    title: 'Full Stack Cloud Engineer (Node/AWS)',
    company: 'NexaWave Innovations Ltd',
    location: 'Bengaluru',
    category: 'Engineering & IT',
    salary: '₹14 - 20 LPA',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    desc: 'Develop REST/GraphQL microservices, serverless workflows with AWS Lambda, and PostgreSQL relational schemas.',
    postedDate: '2026-10-04',
    status: 'Active'
  },
  {
    id: 'JOB-103',
    title: 'Machine Learning Research Engineer',
    company: 'CognitiveAI Labs',
    location: 'Hyderabad',
    category: 'Data Science & AI',
    salary: '₹22 - 32 LPA',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100',
    desc: 'Fine-tune large multimodal foundational models, build dense vector retrieval, and benchmark inferencing latency.',
    postedDate: '2026-10-01',
    status: 'Active'
  },
  {
    id: 'JOB-104',
    title: 'Senior Product UI/UX Designer',
    company: 'PixelCraft Studios',
    location: 'Remote',
    category: 'Product & Design',
    salary: '₹12 - 16 LPA',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100',
    desc: 'Craft intuitive SaaS design workflows, design token systems in Figma, and conduct generative user testing.',
    postedDate: '2026-10-05',
    status: 'Active'
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'APP-901',
    jobId: 'JOB-101',
    jobTitle: 'Senior Frontend Architect (React / TypeScript)',
    company: 'NexaWave Innovations Ltd',
    location: 'Chennai',
    applicantName: 'Siddharth Verma',
    applicantEmail: 'siddharth.verma@example.com',
    skills: 'JavaScript, React, Node.js, SQL, REST APIs, Git',
    expYears: 2,
    expectedCtc: '₹18 LPA',
    portfolioUrl: 'https://github.com/siddharth-dev-showcase',
    appliedDate: '2026-10-05',
    status: 'Shortlisted',
    directorNotes: 'Strong frontend architectural fundamentals. Ready for round 1 tech interview.'
  }
];

const DEFAULT_DIRECTORS = [
  {
    id: 'DIR-01',
    name: 'Elena Rostova',
    company: 'NexaWave Innovations Ltd',
    email: 'elena.rostova@nexawave.io',
    status: 'Approved'
  },
  {
    id: 'DIR-02',
    name: 'Vikramaditya Sengupta',
    company: 'CognitiveAI Labs',
    email: 'vikram@cognitiveai.in',
    status: 'Approved'
  },
  {
    id: 'DIR-03',
    name: 'Marcus Brody',
    company: 'CloudSphere Infrastructure Corp',
    email: 'marcus@cloudsphere.net',
    status: 'Pending'
  }
];

// App State
let currentRole = 'applicant';
let currentApplicantTab = 'search';
let currentDirectorTab = 'applicants';
let currentAdminTab = 'directors';
let targetApplyingJob = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderJobs();
  renderApplicantApplications();
  renderSavedJobs();
  renderDirectorApplicants();
  renderDirectorVacancies();
  renderAdminDirectors();
  renderAdminUsers();
  renderAdminReports();
  updateMetrics();
});

function initStorage() {
  if (!labDB.get('job_vacancies')) labDB.set('job_vacancies', DEFAULT_VACANCIES);
  if (!labDB.get('job_applications')) labDB.set('job_applications', DEFAULT_APPLICATIONS);
  if (!labDB.get('job_saved')) labDB.set('job_saved', ['JOB-102']);
  if (!labDB.get('job_directors')) labDB.set('job_directors', DEFAULT_DIRECTORS);
}

// Role Switching
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('applicantSection').classList.toggle('hidden', role !== 'applicant');
  document.getElementById('directorSection').classList.toggle('hidden', role !== 'director');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'applicant') {
    renderJobs();
    renderApplicantApplications();
    renderSavedJobs();
  } else if (role === 'director') {
    renderDirectorApplicants();
    renderDirectorVacancies();
  } else if (role === 'admin') {
    renderAdminDirectors();
    renderAdminUsers();
    renderAdminReports();
    updateMetrics();
  }
}

// Applicant Tabs
function switchApplicantTab(tab) {
  currentApplicantTab = tab;
  const tabIds = ['search', 'applied', 'saved', 'profile'];
  tabIds.forEach(t => {
    const pane = document.getElementById('appTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#applicantSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'applied') renderApplicantApplications();
  if (tab === 'saved') renderSavedJobs();
}

// Director Tabs
function switchDirectorTab(tab) {
  currentDirectorTab = tab;
  const tabIds = ['applicants', 'myVacancies', 'postJob'];
  tabIds.forEach(t => {
    const pane = document.getElementById('dirTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#directorSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'applicants') renderDirectorApplicants();
  if (tab === 'myVacancies') renderDirectorVacancies();
}

// Admin Tabs
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['directors', 'allUsers', 'reports'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'directors') renderAdminDirectors();
  if (tab === 'allUsers') renderAdminUsers();
  if (tab === 'reports') renderAdminReports();
}

// Job Filtering
function filterJobs() {
  renderJobs();
}

function renderJobs() {
  const container = document.getElementById('jobListingsGrid');
  const keyword = (document.getElementById('jobSearchKeyword') ? document.getElementById('jobSearchKeyword').value : '').toLowerCase();
  const location = document.getElementById('jobLocationFilter').value;
  const category = document.getElementById('jobCategoryFilter').value;

  const vacancies = labDB.get('job_vacancies') || [];
  const saved = labDB.get('job_saved') || [];
  const myApps = labDB.get('job_applications') || [];

  const filtered = vacancies.filter(j => {
    const matchKeyword = j.title.toLowerCase().includes(keyword) || j.desc.toLowerCase().includes(keyword) || j.company.toLowerCase().includes(keyword);
    const matchLoc = location === 'All' || j.location === location;
    const matchCat = category === 'All' || j.category === category;
    return matchKeyword && matchLoc && matchCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-box col-span-3"><p class="muted">No vacancies match your search preferences.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(j => {
    const isSaved = saved.includes(j.id);
    const hasApplied = myApps.some(a => a.jobId === j.id && a.applicantName.includes('Siddharth'));

    return `
      <div class="job-card">
        <div>
          <div class="job-header-flex">
            <div class="job-company-badge">
              <img src="${j.logo}" class="company-logo-img" alt="${j.company}" onerror="this.src='https://placehold.co/80x80/0f172a/white?text=Corp'">
              <div>
                <strong>${j.company}</strong>
                <div class="muted text-xs">Posted: ${j.postedDate}</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="toggleSaveJob('${j.id}')" title="Save Job">
              ${isSaved ? '★ Saved' : '☆ Save'}
            </button>
          </div>

          <div class="job-title-text">${j.title}</div>

          <div class="job-tags-row">
            <span class="job-tag">📍 ${j.location}</span>
            <span class="job-tag">💼 ${j.category}</span>
          </div>

          <div class="job-desc-snippet">${j.desc}</div>
        </div>

        <div class="job-card-footer">
          <div class="job-salary-text">${j.salary}</div>
          <div>
            ${hasApplied ? `
              <span class="badge badge-success">✓ Applied</span>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="openApplyJobModal('${j.id}')">Apply Now</button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Toggle Save Job
function toggleSaveJob(jobId) {
  let saved = labDB.get('job_saved') || [];
  if (saved.includes(jobId)) {
    saved = saved.filter(id => id !== jobId);
    showAlert('Vacancy removed from saved list.', 'info');
  } else {
    saved.push(jobId);
    showAlert('Vacancy bookmarked successfully!', 'success');
  }
  labDB.set('job_saved', saved);
  renderJobs();
  renderSavedJobs();
}

function renderSavedJobs() {
  const container = document.getElementById('savedJobsGrid');
  const saved = labDB.get('job_saved') || [];
  const vacancies = labDB.get('job_vacancies') || [];

  const savedList = vacancies.filter(v => saved.includes(v.id));

  if (savedList.length === 0) {
    container.innerHTML = `<p class="muted">No saved vacancies yet.</p>`;
    return;
  }

  container.innerHTML = savedList.map(j => `
    <div class="job-card">
      <div>
        <div class="job-title-text" style="margin-top: 0;">${j.title}</div>
        <div class="muted text-xs mb-2"><strong>${j.company}</strong> | ${j.location}</div>
        <p class="job-desc-snippet">${j.desc}</p>
      </div>
      <div class="job-card-footer">
        <span class="job-salary-text">${j.salary}</span>
        <button class="btn btn-primary btn-sm" onclick="openApplyJobModal('${j.id}')">Apply</button>
      </div>
    </div>
  `).join('');
}

// Apply Modal
function openApplyJobModal(jobId) {
  const vacancies = labDB.get('job_vacancies') || [];
  const j = vacancies.find(v => v.id === jobId);
  if (!j) return;

  targetApplyingJob = j;
  document.getElementById('applyJobId').value = j.id;
  document.getElementById('applyJobTitleDisplay').value = `${j.title} @ ${j.company}`;
  document.getElementById('applyJobModal').classList.remove('hidden');
}

function closeApplyJobModal() {
  document.getElementById('applyJobModal').classList.add('hidden');
}

function handleConfirmJobApplication(e) {
  e.preventDefault();
  if (!targetApplyingJob) return;

  const expYears = parseInt(document.getElementById('applyExpYears').value);
  const expectedCtc = document.getElementById('applyExpectedCtc').value.trim();
  const portfolioUrl = document.getElementById('applyPortfolioLink').value.trim();

  const appId = `APP-${Math.floor(900 + Math.random() * 99)}`;
  const newApp = {
    id: appId,
    jobId: targetApplyingJob.id,
    jobTitle: targetApplyingJob.title,
    company: targetApplyingJob.company,
    location: targetApplyingJob.location,
    applicantName: 'Siddharth Verma',
    applicantEmail: 'siddharth.verma@example.com',
    skills: 'JavaScript, React, Node.js, SQL, REST APIs, Git',
    expYears,
    expectedCtc,
    portfolioUrl,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    directorNotes: 'Application under preliminary recruiter review.'
  };

  const applications = labDB.get('job_applications') || [];
  applications.unshift(newApp);
  labDB.set('job_applications', applications);

  closeApplyJobModal();
  renderJobs();
  renderApplicantApplications();
  renderDirectorApplicants();
  updateMetrics();

  showAlert(`Application ${appId} submitted to ${targetApplyingJob.company}!`, 'success');
  switchApplicantTab('applied');
}

// Render Applicant Applications
function renderApplicantApplications() {
  const tbody = document.getElementById('applicantApplicationsTable');
  const applications = labDB.get('job_applications') || [];
  const myApps = applications.filter(a => a.applicantName.includes('Siddharth'));

  document.getElementById('myAppsCount').textContent = myApps.length;

  if (myApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No applications submitted yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = myApps.map(a => `
    <tr>
      <td>
        <strong>${a.jobTitle}</strong>
        <div class="muted text-xs">${a.company}</div>
      </td>
      <td>${a.location}</td>
      <td class="text-xs">${a.appliedDate}</td>
      <td>${a.expectedCtc}</td>
      <td>
        <span class="badge ${a.status === 'Shortlisted' ? 'badge-success' : a.status === 'Interview Scheduled' ? 'badge-info' : a.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}">
          ${a.status}
        </span>
      </td>
      <td class="text-xs muted">${a.directorNotes}</td>
    </tr>
  `).join('');
}

// Director Queue
function renderDirectorApplicants() {
  const tbody = document.getElementById('directorApplicantsTable');
  const filter = document.getElementById('dirFilterAppStatus').value;
  const applications = labDB.get('job_applications') || [];

  const filtered = applications.filter(a => filter === 'all' || a.status === filter);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center muted">No applicants found in this pipeline stage.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td>
        <strong>${a.applicantName}</strong>
        <div class="muted text-xs">${a.applicantEmail} | Exp: ${a.expYears} yrs</div>
      </td>
      <td>${a.jobTitle}</td>
      <td class="text-xs">${a.skills}</td>
      <td>
        <a href="${a.portfolioUrl}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.75rem;">View Profile</a>
      </td>
      <td>
        <span class="badge ${a.status === 'Shortlisted' ? 'badge-success' : a.status === 'Interview Scheduled' ? 'badge-info' : a.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}">
          ${a.status}
        </span>
      </td>
      <td>
        <select class="input input-sm" onchange="directorUpdateApplicantStatus('${a.id}', this.value)">
          <option value="Applied" ${a.status === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Shortlisted" ${a.status === 'Shortlisted' ? 'selected' : ''}>Shortlist</option>
          <option value="Interview Scheduled" ${a.status === 'Interview Scheduled' ? 'selected' : ''}>Schedule Interview</option>
          <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Reject</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function directorUpdateApplicantStatus(appId, newStatus) {
  const applications = labDB.get('job_applications') || [];
  const idx = applications.findIndex(a => a.id === appId);
  if (idx !== -1) {
    applications[idx].status = newStatus;
    applications[idx].directorNotes = newStatus === 'Shortlisted' ? 'Shortlisted for technical evaluation.' :
                                     newStatus === 'Interview Scheduled' ? 'Invited to panel interview.' :
                                     newStatus === 'Rejected' ? 'Candidate skillset does not match current vacancy.' : 'Under review.';
    labDB.set('job_applications', applications);
    renderDirectorApplicants();
    renderApplicantApplications();
    showAlert(`Candidate status updated to "${newStatus}".`, 'success');
  }
}

// Director Vacancies
function renderDirectorVacancies() {
  const tbody = document.getElementById('directorVacanciesTable');
  const vacancies = labDB.get('job_vacancies') || [];

  tbody.innerHTML = vacancies.map(v => `
    <tr>
      <td><strong>${v.title}</strong></td>
      <td>${v.category}</td>
      <td>${v.location}</td>
      <td class="font-bold">${v.salary}</td>
      <td><span class="badge ${v.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${v.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="directorToggleVacancy('${v.id}')">
          ${v.status === 'Active' ? 'Pause' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

function directorToggleVacancy(id) {
  const vacancies = labDB.get('job_vacancies') || [];
  const v = vacancies.find(item => item.id === id);
  if (v) {
    v.status = v.status === 'Active' ? 'Closed' : 'Active';
    labDB.set('job_vacancies', vacancies);
    renderDirectorVacancies();
    renderJobs();
    showAlert(`Vacancy status toggled for ${v.title}.`, 'info');
  }
}

function handleDirectorPostJob(e) {
  e.preventDefault();
  const title = document.getElementById('newJobTitle').value.trim();
  const category = document.getElementById('newJobCategory').value;
  const location = document.getElementById('newJobLocation').value;
  const salary = document.getElementById('newJobSalary').value.trim();
  const logo = document.getElementById('newJobLogo').value.trim();
  const desc = document.getElementById('newJobDesc').value.trim();

  const vacancies = labDB.get('job_vacancies') || [];
  const newJob = {
    id: `JOB-${vacancies.length + 101}`,
    title,
    company: 'NexaWave Innovations Ltd',
    location,
    category,
    salary,
    logo: logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    desc,
    postedDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  vacancies.unshift(newJob);
  labDB.set('job_vacancies', vacancies);

  document.getElementById('postJobForm').reset();
  renderDirectorVacancies();
  renderJobs();
  updateMetrics();
  showAlert(`Vacancy "${title}" published live!`, 'success');
  switchDirectorTab('myVacancies');
}

// Admin Operations
function renderAdminDirectors() {
  const tbody = document.getElementById('adminDirectorsTable');
  const directors = labDB.get('job_directors') || [];

  tbody.innerHTML = directors.map(d => `
    <tr>
      <td><strong>${d.name}</strong></td>
      <td>${d.company}</td>
      <td class="font-mono text-xs">${d.email}</td>
      <td><span class="badge ${d.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${d.status}</span></td>
      <td>
        ${d.status === 'Pending' ? `
          <button class="btn btn-success btn-sm mr-1" onclick="adminApproveDirector('${d.id}', true)">Approve</button>
          <button class="btn btn-danger btn-sm" onclick="adminApproveDirector('${d.id}', false)">Reject</button>
        ` : `
          <span class="text-xs muted">Verified</span>
        `}
      </td>
    </tr>
  `).join('');
}

function adminApproveDirector(id, isApproved) {
  const directors = labDB.get('job_directors') || [];
  const d = directors.find(item => item.id === id);
  if (d) {
    d.status = isApproved ? 'Approved' : 'Rejected';
    labDB.set('job_directors', directors);
    renderAdminDirectors();
    showAlert(`Director ${d.name} ${isApproved ? 'Approved' : 'Rejected'}!`, isApproved ? 'success' : 'danger');
  }
}

function renderAdminUsers() {
  const tbody = document.getElementById('adminUsersTable');
  const candidates = [
    { name: 'Siddharth Verma', email: 'siddharth.verma@example.com', skills: 'React, Node, SQL', privacy: 'Public', apps: 1 },
    { name: 'Meera Nambiar', email: 'meera.nambiar@example.com', skills: 'Python, PyTorch, LangChain', privacy: 'Restricted', apps: 2 },
    { name: 'Harish Kalyan', email: 'harish.kalyan@example.com', skills: 'Figma, Design Systems', privacy: 'Public', apps: 1 },
    { name: 'Tanvi Shinde', email: 'tanvi.shinde@example.com', skills: 'DevOps, Docker, K8s', privacy: 'Confidential', apps: 0 }
  ];

  tbody.innerHTML = candidates.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td class="font-mono text-xs">${c.email}</td>
      <td>${c.skills}</td>
      <td><span class="badge badge-neutral">${c.privacy}</span></td>
      <td class="font-bold">${c.apps}</td>
    </tr>
  `).join('');
}

function renderAdminReports() {
  const box = document.getElementById('adminReportMetricsBox');
  const vacancies = labDB.get('job_vacancies') || [];
  const applications = labDB.get('job_applications') || [];

  const shortlisted = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length;
  const rate = applications.length > 0 ? ((shortlisted / applications.length) * 100).toFixed(1) : 0;

  box.innerHTML = `
    <div class="grid-3">
      <div>
        <div class="muted text-xs">Total Active Vacancies</div>
        <h3 style="color: #3b82f6;">${vacancies.filter(v => v.status === 'Active').length} Postings</h3>
      </div>
      <div>
        <div class="muted text-xs">Candidate Resumes Received</div>
        <h3 style="color: #10b981;">${applications.length} Total</h3>
      </div>
      <div>
        <div class="muted text-xs">ATS Candidate Shortlist Rate</div>
        <h3 style="color: #a855f7;">${rate}%</h3>
      </div>
    </div>
  `;
}

function updateMetrics() {
  const directors = labDB.get('job_directors') || [];
  const vacancies = labDB.get('job_vacancies') || [];
  const applications = labDB.get('job_applications') || [];

  document.getElementById('adminTotalDirectors').textContent = directors.length;
  document.getElementById('adminTotalJobs').textContent = vacancies.length;
  document.getElementById('adminTotalCandidates').textContent = 12;

  document.getElementById('dirActivePostings').textContent = `${vacancies.length} Jobs`;
  document.getElementById('dirTotalResumes').textContent = `${applications.length} Applicants`;
}

function handleSaveApplicantProfile(e) {
  e.preventDefault();
  showAlert('Applicant profile and recruiter privacy settings updated!', 'success');
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
