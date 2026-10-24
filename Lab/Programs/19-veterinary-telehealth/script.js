// Veterinary Telehealth & Disease Analytics Script

const DEFAULT_DOCTORS = [
  {
    id: 'DOC-01',
    name: 'Dr. K. Swaminathan (BVSc & AH)',
    hospital: 'Civil Veterinary Hospital (Govt. CVH), Kanchipuram',
    type: 'Govt. CVH',
    fee: 0,
    phone: '+91 94441 90283',
    bank: 'State Bank of India (SBIN0001048)',
    accNo: '984210492819',
    easyPaisa: '+91 94441 90283',
    rating: 4.9,
    experience: '18 Years Experience'
  },
  {
    id: 'DOC-02',
    name: 'Dr. Anjali Menon (MVSc - Small & Large Animal Medicine)',
    hospital: 'Menon Advanced Private Veterinary Hospital, Chengalpattu',
    type: 'Private Specialist',
    fee: 400,
    phone: '+91 98403 11829',
    bank: 'HDFC Bank (HDFC0001824)',
    accNo: '501002948192',
    easyPaisa: '+91 98403 11829',
    rating: 4.8,
    experience: '12 Years Clinical Practice'
  },
  {
    id: 'DOC-03',
    name: 'Dr. R. Parthiban (MVSc - Veterinary Surgery)',
    hospital: 'State Central Veterinary Polyclinic, Saidapet, Chennai',
    type: 'Govt. CVH',
    fee: 0,
    phone: '+91 94442 88291',
    bank: 'Indian Bank (IDIB000S012)',
    accNo: '62019481920',
    easyPaisa: '+91 94442 88291',
    rating: 4.7,
    experience: '15 Years Experience'
  }
];

const DEFAULT_VETCURE = [
  {
    id: 'VC-01',
    name: 'Foot and Mouth Disease (FMD)',
    species: 'Cattle & Sheep',
    severity: 'High Contagion',
    symptoms: 'High pyrexia (104-106°F), severe salivation with smacking sound, vesicular eruptions on tongue and interdigital cleft.',
    prescription: 'Clean oral lesions with 1% Potassium Permanganate. Feed soft boiled rice/ragi porridge. Mandatory ring vaccination.',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500'
  },
  {
    id: 'VC-02',
    name: 'Lumpy Skin Disease (LSD)',
    species: 'Cows & Buffaloes',
    severity: 'Epidemic Hazard',
    symptoms: 'Firm, circumscribed skin nodules (2-5cm) over head, neck, and udder. Edema in dewlap and limbs, high fever.',
    prescription: 'Isolate animal in mosquito-netted shelter. Topical neem oil + turmeric on burst lesions. Antihistamines & paracetamol.',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500'
  },
  {
    id: 'VC-03',
    name: 'Bovine Mastitis (Udder Inflammation)',
    species: 'Dairy Cattle',
    severity: 'Milk Loss Risk',
    symptoms: 'Swollen, hard, painful quarters of the udder. Watery or clotted milk with flakes and blood traces.',
    prescription: 'Complete milk strippings followed by intramammary antibiotic infusions (Cephalosporin/Amoxicillin). Strict teat dipping.',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500'
  },
  {
    id: 'VC-04',
    name: 'Canine Parvovirus Enteritis (CPV)',
    species: 'Pet Dogs / Puppies',
    severity: 'Critical Emergency',
    symptoms: 'Foul-smelling hemorrhagic diarrhea, intractable projectile vomiting, extreme hypothermia and dehydration.',
    prescription: 'Intravenous Ringer Lactate fluid therapy, antiemetics (Ondansetron), broad spectrum antibiotic cover. Zero oral intake initially.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'
  },
  {
    id: 'VC-05',
    name: 'Babesiosis / Tick Borne Fever',
    species: 'Livestock & Dogs',
    severity: 'Moderate - High',
    symptoms: 'Hemoglobinuria (coffee-colored dark urine), jaundice in eyes and gums, high swinging fever, tick infestation.',
    prescription: 'Specific babesiacide injection (Diminazene aceturate @ 3.5mg/kg deep IM). Iron tonic & liver extract supplementation.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'
  }
];

const DEFAULT_CASES = [
  {
    id: 'VET-CASE-801',
    farmerName: 'Murugan Dairy Farm',
    phone: '+91 94432 99012',
    district: 'Chengalpattu Agro Zone',
    species: 'Cattle / Cow',
    doctorId: 'DOC-01',
    doctorName: 'Dr. K. Swaminathan (Govt. CVH)',
    title: 'Severe milk reduction with hard left udder quarter',
    desc: 'Animal developed painful swelling in left rear teat yesterday. Milk contains white flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500',
    mediaUrl: 'AUDIO-REC-RUMINATION-CLICK.mp3',
    paymentType: 'Govt. Free CVH',
    paymentRef: 'FREE-CVH-GOVT',
    status: 'Prescribed',
    createdAt: '2026-10-05 09:30 AM',
    diagnosis: 'Bovine Mastitis (Udder Infection)',
    prescription: '1. Intramammary Infusion (Cloxacillin) after total stripping twice daily for 3 days.\n2. Inj. Meloxicam 15ml for swelling reduction.\n3. Disinfect teat with 0.5% Povidone iodine post-milking.',
    careNotes: 'Keep stall bedding completely dry with lime dusting.'
  },
  {
    id: 'VET-CASE-802',
    farmerName: 'Murugan Dairy Farm',
    phone: '+91 94432 99012',
    district: 'Chengalpattu Agro Zone',
    species: 'Cattle / Cow',
    doctorId: 'DOC-01',
    doctorName: 'Dr. K. Swaminathan (Govt. CVH)',
    title: 'Nasal discharge, high fever and blisters on tongue',
    desc: 'Cow running 105F temperature, salivating profusely, limping slightly in right front leg.',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500',
    mediaUrl: 'AUDIO-LIMP-OBSERVATION.mp3',
    paymentType: 'Govt. Free CVH',
    paymentRef: 'FREE-CVH-GOVT',
    status: 'Under Review',
    createdAt: '2026-10-06 10:15 AM',
    diagnosis: '',
    prescription: '',
    careNotes: ''
  }
];

const DEFAULT_NEWS = [
  {
    id: 'NEWS-01',
    title: 'Urgent Alert: Pre-Monsoon Foot & Mouth Disease (FMD) Vaccination Drive',
    species: 'All Livestock',
    urgency: 'Warning',
    body: 'The Animal Husbandry Department has dispatched veterinary mobile squads across Chengalpattu and Kanchipuram. Farmers must present all cattle above 4 months for free booster shots.',
    date: '2026-10-04'
  },
  {
    id: 'NEWS-02',
    title: 'Advisory on Vector Control: Eradication of Stable Flies & Ticks',
    species: 'Cattle / Bovine',
    urgency: 'Advisory',
    body: 'Recent intermittent showers have sparked a surge in Stomoxys stable flies transmitting haemoprotozoan parasites. Spray cattle pens with diluted Cypermethrin or herbal neem decoction.',
    date: '2026-10-01'
  }
];

// App State
let currentRole = 'farmer';
let currentFarmerTab = 'consult';
let currentDoctorTab = 'cases';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  populateDoctorChoices();
  renderVetcureEncyclopedia();
  renderDoctorsList();
  renderFarmerCases();
  renderDoctorQueue();
  renderNewsAdvisories();
  renderAnalytics();
});

function initStorage() {
  if (!labDB.get('vet_doctors')) labDB.set('vet_doctors', DEFAULT_DOCTORS);
  if (!labDB.get('vet_diseases')) labDB.set('vet_diseases', DEFAULT_VETCURE);
  if (!labDB.get('vet_cases')) labDB.set('vet_cases', DEFAULT_CASES);
  if (!labDB.get('vet_news')) labDB.set('vet_news', DEFAULT_NEWS);
}

// Role Switcher
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('farmerSection').classList.toggle('hidden', role !== 'farmer');
  document.getElementById('doctorSection').classList.toggle('hidden', role !== 'doctor');
  document.getElementById('analyticsSection').classList.toggle('hidden', role !== 'analytics');

  if (role === 'farmer') {
    renderFarmerCases();
    renderVetcureEncyclopedia();
    renderDoctorsList();
    renderNewsAdvisories();
  } else if (role === 'doctor') {
    renderDoctorQueue();
  } else if (role === 'analytics') {
    renderAnalytics();
  }
}

// Farmer Tabs
function switchFarmerTab(tab) {
  currentFarmerTab = tab;
  const tabIds = ['consult', 'history', 'vetcure', 'doctors', 'advisories'];
  tabIds.forEach(t => {
    const pane = document.getElementById('farmerTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#farmerSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'history') renderFarmerCases();
  if (tab === 'vetcure') renderVetcureEncyclopedia();
  if (tab === 'doctors') renderDoctorsList();
  if (tab === 'advisories') renderNewsAdvisories();
}

// Doctor Tabs
function switchDoctorTab(tab) {
  currentDoctorTab = tab;
  const tabIds = ['cases', 'news', 'profile'];
  tabIds.forEach(t => {
    const pane = document.getElementById('doctorTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#doctorSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'cases') renderDoctorQueue();
}

// Populate Doctor Choices in Consult Form
function populateDoctorChoices() {
  const select = document.getElementById('consultDoctorChoice');
  if (!select) return;
  const doctors = labDB.get('vet_doctors') || [];

  select.innerHTML = doctors.map(d => `
    <option value="${d.id}">${d.name} (${d.type} - ${d.fee === 0 ? 'FREE' : '₹' + d.fee})</option>
  `).join('');

  handleDoctorChoiceChange();
}

function handleDoctorChoiceChange() {
  const docId = document.getElementById('consultDoctorChoice').value;
  const doctors = labDB.get('vet_doctors') || [];
  const doc = doctors.find(d => d.id === docId);
  const payBox = document.getElementById('privateDoctorPaymentBox');

  if (doc && doc.fee > 0) {
    payBox.classList.remove('hidden');
  } else {
    payBox.classList.add('hidden');
  }
}

// Farmer Submit Consult
function handleFarmerSubmitConsult(e) {
  e.preventDefault();
  const species = document.getElementById('consultSpecies').value;
  const docId = document.getElementById('consultDoctorChoice').value;
  const title = document.getElementById('consultSymptomTitle').value.trim();
  const desc = document.getElementById('consultDetailedDesc').value.trim();
  const imgUrl = document.getElementById('consultImgUrl').value.trim();
  const mediaUrl = document.getElementById('consultMediaUrl').value.trim();

  const doctors = labDB.get('vet_doctors') || [];
  const doc = doctors.find(d => d.id === docId);

  let paymentType = 'Govt. Free CVH';
  let paymentRef = 'FREE-CVH-GOVT';

  if (doc && doc.fee > 0) {
    paymentType = document.getElementById('paymentGatewaySelect').value === 'easypaisa' ? 'EasyPaisa Mobile Wallet' : 'Bank Transfer';
    paymentRef = document.getElementById('consultPaymentRef').value.trim() || 'TXN-PAID';
  }

  const caseId = `VET-CASE-${Math.floor(800 + Math.random() * 200)}`;
  const newCase = {
    id: caseId,
    farmerName: 'Murugan Dairy Farm',
    phone: '+91 94432 99012',
    district: 'Chengalpattu Agro Zone',
    species,
    doctorId: doc.id,
    doctorName: `${doc.name} (${doc.type})`,
    title,
    desc,
    imageUrl: imgUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500',
    mediaUrl: mediaUrl || 'AUDIO-SIGNS.mp3',
    paymentType,
    paymentRef,
    status: 'Under Review',
    createdAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    diagnosis: '',
    prescription: '',
    careNotes: ''
  };

  const cases = labDB.get('vet_cases') || [];
  cases.unshift(newCase);
  labDB.set('vet_cases', cases);

  renderLatestCaseSummary(newCase);
  renderFarmerCases();
  renderDoctorQueue();
  renderAnalytics();

  showAlert(`Consultation ${caseId} submitted! Diagnostic package transmitted to ${doc.name}.`, 'success');
  document.getElementById('consultForm').reset();
  populateDoctorChoices();
}

function renderLatestCaseSummary(c) {
  const box = document.getElementById('latestConsultSummary');
  box.innerHTML = `
    <div class="consult-case-card" style="border: 2px solid #06b6d4;">
      <div class="card-header-flex">
        <div>
          <span class="badge badge-warning">${c.status}</span>
          <span class="badge badge-neutral ml-1">${c.species}</span>
          <h4 style="margin: 0.5rem 0 0.2rem 0;">${c.title}</h4>
          <span class="font-mono text-xs muted">Token: ${c.id}</span>
        </div>
        <div class="text-right text-xs muted">${c.createdAt}</div>
      </div>

      <p class="muted text-sm mt-2">${c.desc}</p>

      <div class="consult-media-preview-box">
        <img src="${c.imageUrl}" alt="Symptom Photo" onerror="this.src='https://placehold.co/100x80/0f172a/white?text=Animal'">
        <div>
          <div class="font-bold text-xs" style="color: #38bdf8;">🎥 Attached Media: ${c.mediaUrl}</div>
          <div class="text-xs muted mt-1">👨‍⚕️ Attending: <strong>${c.doctorName}</strong></div>
          <div class="text-xs muted">💳 Payment: <strong>${c.paymentType} (${c.paymentRef})</strong></div>
        </div>
      </div>

      <button class="btn btn-secondary btn-sm btn-block mt-2" onclick="switchFarmerTab('history')">View in Consultation History</button>
    </div>
  `;
}

// Render Farmer Past Cases
function renderFarmerCases() {
  const container = document.getElementById('farmerCasesList');
  const cases = labDB.get('vet_cases') || [];

  if (cases.length === 0) {
    container.innerHTML = `<p class="muted">No prior consultation records found.</p>`;
    return;
  }

  container.innerHTML = cases.map(c => `
    <div class="consult-case-card">
      <div class="card-header-flex">
        <div>
          <span class="badge ${c.status === 'Prescribed' ? 'badge-success' : 'badge-warning'}">${c.status}</span>
          <span class="badge badge-neutral ml-1">${c.species}</span>
          <h4 style="margin: 0.4rem 0 0.2rem 0;">${c.title}</h4>
          <span class="font-mono text-xs muted">Case: ${c.id} | Logged: ${c.createdAt}</span>
        </div>
        <div class="text-right">
          <span class="badge badge-info">${c.paymentType}</span>
        </div>
      </div>

      <p class="muted text-sm mt-2">${c.desc}</p>
      
      <div class="consult-media-preview-box">
        <img src="${c.imageUrl}" alt="Symptom Photo" onerror="this.src='https://placehold.co/100x80/0f172a/white?text=Animal'">
        <div>
          <div class="text-xs muted">Audio/Video: <strong>${c.mediaUrl}</strong></div>
          <div class="text-xs muted">Attending Doctor: <strong>${c.doctorName}</strong></div>
        </div>
      </div>

      ${c.prescription ? `
        <div class="rx-display-card">
          <div class="font-bold" style="color: #10b981;">📋 Official Diagnosis: ${c.diagnosis}</div>
          <div class="mt-2 text-sm" style="white-space: pre-line; line-height: 1.6;">${c.prescription}</div>
          <div class="text-xs muted mt-2"><strong>Diet & Stall Hygiene:</strong> ${c.careNotes}</div>
          <button class="btn btn-secondary btn-sm mt-3" onclick="window.print()">🖨️ Print Prescription</button>
        </div>
      ` : `
        <div class="alert-banner alert-warning text-xs mt-3" style="padding: 0.6rem;">
          ⏳ Doctor is reviewing the diagnostic signs and symptoms. Prescription will appear here once formulated.
        </div>
      `}
    </div>
  `).join('');
}

// Vetcure Encyclopedia
function renderVetcureEncyclopedia() {
  const container = document.getElementById('vetcureGrid');
  const search = (document.getElementById('vetcureSearch') ? document.getElementById('vetcureSearch').value : '').toLowerCase();
  const list = labDB.get('vet_diseases') || [];

  const filtered = list.filter(d => d.name.toLowerCase().includes(search) || d.symptoms.toLowerCase().includes(search) || d.species.toLowerCase().includes(search));

  if (filtered.length === 0) {
    container.innerHTML = `<p class="muted col-span-2">No matching animal disease found.</p>`;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="vetcure-card">
      <div class="vetcure-img-wrapper">
        <img src="${d.image}" alt="${d.name}" onerror="this.src='https://placehold.co/400x200/0f172a/white?text=Animal'">
        <span class="vetcure-tag">${d.species}</span>
      </div>
      <div class="vetcure-content">
        <div class="card-header-flex">
          <div class="vetcure-title">${d.name}</div>
          <span class="badge ${d.severity.includes('Critical') || d.severity.includes('Epidemic') ? 'badge-danger' : 'badge-warning'}">${d.severity}</span>
        </div>
        <p class="muted text-xs mt-1" style="line-height: 1.5;">${d.symptoms}</p>
        
        <div class="prescription-guideline-box mt-3">
          <strong>First Aid & Protocol:</strong>
          <div>${d.prescription}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Doctors List
function renderDoctorsList() {
  const container = document.getElementById('doctorsListGrid');
  const doctors = labDB.get('vet_doctors') || [];

  container.innerHTML = doctors.map(d => `
    <div class="doctor-item-card">
      <div>
        <div class="card-header-flex">
          <span class="badge ${d.fee === 0 ? 'badge-success' : 'badge-warning'}">${d.type}</span>
          <span class="text-sm font-bold" style="color: #f59e0b;">★ ${d.rating}</span>
        </div>
        <h4 style="margin: 0.5rem 0 0.2rem 0;">${d.name}</h4>
        <div class="muted text-xs">${d.hospital}</div>
        <div class="text-xs muted mt-1">${d.experience}</div>
        
        <div class="mt-3 text-xs" style="background: rgba(0,0,0,0.25); padding: 0.6rem; border-radius: var(--radius-sm);">
          <div>📞 <strong>Contact:</strong> ${d.phone}</div>
          <div>💰 <strong>Fee:</strong> ${d.fee === 0 ? 'FREE (Govt CVH Scheme)' : '₹' + d.fee + ' per consult'}</div>
          ${d.easyPaisa ? `<div>📲 <strong>EasyPaisa:</strong> ${d.easyPaisa}</div>` : ''}
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary btn-block btn-sm" onclick="chooseDoctorForConsult('${d.id}')">
          Book Telehealth Consult
        </button>
      </div>
    </div>
  `).join('');
}

function chooseDoctorForConsult(docId) {
  switchFarmerTab('consult');
  document.getElementById('consultDoctorChoice').value = docId;
  handleDoctorChoiceChange();
}

// Doctor Queue
function renderDoctorQueue() {
  const container = document.getElementById('doctorCasesQueue');
  const cases = labDB.get('vet_cases') || [];

  const pendingCount = cases.filter(c => c.status !== 'Prescribed').length;
  document.getElementById('docPendingCount').textContent = `${pendingCount} Cases Awaiting Response`;

  if (cases.length === 0) {
    container.innerHTML = `<p class="muted">No incoming farmer diagnostic consultations.</p>`;
    return;
  }

  container.innerHTML = cases.map(c => `
    <div class="consult-case-card">
      <div class="card-header-flex">
        <div>
          <span class="badge ${c.status === 'Prescribed' ? 'badge-success' : 'badge-warning'}">${c.status}</span>
          <span class="badge badge-neutral ml-1">${c.species}</span>
          <h4 style="margin: 0.4rem 0 0.2rem 0;">${c.title}</h4>
          <span class="font-mono text-xs muted">Case: ${c.id} | Farmer: ${c.farmerName} (${c.phone})</span>
        </div>
        <div class="text-right">
          <span class="badge badge-info">${c.paymentType}</span>
          <div class="text-xs muted mt-1 font-mono">${c.paymentRef}</div>
        </div>
      </div>

      <p class="muted text-sm mt-2">${c.desc}</p>

      <div class="consult-media-preview-box">
        <img src="${c.imageUrl}" alt="Symptom Photo" onerror="this.src='https://placehold.co/100x80/0f172a/white?text=Animal'">
        <div>
          <div class="text-xs" style="color: #38bdf8;">🎥 Attached Media: ${c.mediaUrl}</div>
          <div class="text-xs muted">District Origin: <strong>${c.district}</strong></div>
        </div>
      </div>

      ${c.prescription ? `
        <div class="rx-display-card">
          <div class="font-bold" style="color: #10b981;">✓ Transmitted Diagnosis: ${c.diagnosis}</div>
          <div class="mt-1 text-xs" style="white-space: pre-line;">${c.prescription}</div>
        </div>
      ` : `
        <div class="mt-3">
          <button class="btn btn-primary btn-block btn-sm" onclick="openDoctorPrescriptionModal('${c.id}')">
            ✍️ Review Diagnostics & Issue Clinical Prescription
          </button>
        </div>
      `}
    </div>
  `).join('');
}

// Doctor Prescription Modal
function openDoctorPrescriptionModal(caseId) {
  const cases = labDB.get('vet_cases') || [];
  const c = cases.find(cs => cs.id === caseId);
  if (!c) return;

  document.getElementById('modalCaseId').value = c.id;
  document.getElementById('modalCaseTitleDisplay').value = `${c.id} - ${c.species} (${c.title})`;
  document.getElementById('doctorPrescriptionModal').classList.remove('hidden');
}

function closeDoctorPrescriptionModal() {
  document.getElementById('doctorPrescriptionModal').classList.add('hidden');
}

function handleDoctorSubmitPrescription(e) {
  e.preventDefault();
  const caseId = document.getElementById('modalCaseId').value;
  const diag = document.getElementById('modalPrescriptionDiagnosis').value;
  const meds = document.getElementById('modalPrescriptionMedication').value.trim();
  const care = document.getElementById('modalPrescriptionCare').value.trim();

  const cases = labDB.get('vet_cases') || [];
  const idx = cases.findIndex(c => c.id === caseId);

  if (idx !== -1) {
    cases[idx].diagnosis = diag;
    cases[idx].prescription = meds;
    cases[idx].careNotes = care;
    cases[idx].status = 'Prescribed';
    labDB.set('vet_cases', cases);

    closeDoctorPrescriptionModal();
    renderDoctorQueue();
    renderFarmerCases();
    renderAnalytics();
    showAlert(`Official prescription dispatched to farmer for Case ${caseId}!`, 'success');
  }
}

// News & Bulletins
function renderNewsAdvisories() {
  const container = document.getElementById('newsAdvisoriesList');
  const news = labDB.get('vet_news') || [];

  container.innerHTML = news.map(n => `
    <div class="news-card ${n.urgency === 'Warning' ? 'warning' : ''}">
      <div class="card-header-flex">
        <h4 style="margin: 0;">${n.title}</h4>
        <span class="badge ${n.urgency === 'Warning' ? 'badge-danger' : 'badge-info'}">${n.urgency}</span>
      </div>
      <p class="muted text-sm mt-2">${n.body}</p>
      <div class="text-xs muted mt-2">Target: <strong>${n.species}</strong> | Broadcast Date: ${n.date}</div>
    </div>
  `).join('');
}

function handleDoctorPublishNews(e) {
  e.preventDefault();
  const title = document.getElementById('newBulletinTitle').value.trim();
  const species = document.getElementById('newBulletinSpecies').value;
  const urgency = document.getElementById('newBulletinUrgency').value;
  const body = document.getElementById('newBulletinBody').value.trim();

  const news = labDB.get('vet_news') || [];
  news.unshift({
    id: `NEWS-${news.length + 1}`,
    title,
    species,
    urgency,
    body,
    date: new Date().toISOString().split('T')[0]
  });
  labDB.set('vet_news', news);

  renderNewsAdvisories();
  showAlert('Health advisory broadcasted successfully across the farmer network!', 'success');
  e.target.reset();
  switchDoctorTab('cases');
}

function handleDoctorSavePaymentProfile(e) {
  e.preventDefault();
  showAlert('Doctor settlement bank and EasyPaisa credentials updated!', 'success');
}

// Regional Disease Outbreak Analytics
function renderAnalytics() {
  const cases = labDB.get('vet_cases') || [];

  // Disease tally
  const counts = {
    'Bovine Mastitis': 4,
    'Foot & Mouth Disease (FMD)': 3,
    'Lumpy Skin Disease (LSD)': 2,
    'Canine Parvovirus': 2,
    'Tick Fever': 1
  };

  // Factor in dynamic cases
  cases.forEach(c => {
    if (c.diagnosis) {
      if (c.diagnosis.includes('Mastitis')) counts['Bovine Mastitis']++;
      else if (c.diagnosis.includes('Foot')) counts['Foot & Mouth Disease (FMD)']++;
      else if (c.diagnosis.includes('Lumpy')) counts['Lumpy Skin Disease (LSD)']++;
      else if (c.diagnosis.includes('Parvo')) counts['Canine Parvovirus']++;
    }
  });

  const totalCases = Object.values(counts).reduce((a, b) => a + b, 0);
  const barsContainer = document.getElementById('analyticsDiseaseBars');

  barsContainer.innerHTML = Object.entries(counts).map(([disease, count]) => {
    const pct = totalCases > 0 ? ((count / totalCases) * 100).toFixed(1) : 0;
    const color = pct > 25 ? '#ef4444' : pct > 15 ? '#f59e0b' : '#38bdf8';

    return `
      <div class="analytics-bar-item">
        <div class="bar-meta-flex">
          <strong>${disease}</strong>
          <span>${count} Reported (${pct}%)</span>
        </div>
        <div class="analytics-track">
          <div class="analytics-fill" style="width: ${pct}%; background: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  // Regional Clustering Table
  const clustersTable = document.getElementById('regionalClustersTable');
  clustersTable.innerHTML = `
    <tr>
      <td><strong>Chengalpattu Agro Cluster</strong></td>
      <td>Bovine Mastitis & FMD</td>
      <td>6 Cases / 7 Days</td>
      <td><span class="badge badge-warning">High Surveillance</span></td>
    </tr>
    <tr>
      <td><strong>Kanchipuram Silk & Rural Zone</strong></td>
      <td>Lumpy Skin Disease (LSD)</td>
      <td>4 Cases / 7 Days</td>
      <td><span class="badge badge-danger">Ring Vaccination Active</span></td>
    </tr>
    <tr>
      <td><strong>Chennai Suburban South</strong></td>
      <td>Canine Parvovirus (CPV)</td>
      <td>3 Cases / 7 Days</td>
      <td><span class="badge badge-info">Routine Alert</span></td>
    </tr>
    <tr>
      <td><strong>Tiruvallur Dairy Belt</strong></td>
      <td>Subclinical Mastitis</td>
      <td>2 Cases / 7 Days</td>
      <td><span class="badge badge-success">Controlled</span></td>
    </tr>
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
