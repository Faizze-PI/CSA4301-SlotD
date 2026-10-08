/**
 * IJSSE - International Journal of Scientific and Social Excellence (Scopus-Indexed)
 * Experiment 30 - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  MANUSCRIPTS: 'ijsse_manuscripts_v1'
};

const DEFAULT_MANUSCRIPTS = [
  {
    id: 'IJSSE-2026-041',
    title: 'Federated Graph Neural Networks for Privacy-Preserving Health Analytics',
    domain: 'Computer Science & AI',
    author: 'Dr. K. Vigneshwaran',
    affiliation: 'Saveetha School of Engineering, SIMATS',
    email: 'vignesh@saveetha.ac.in',
    abstract: 'We present a novel decentralized federated learning scheme over non-IID graph-structured electronic health records. Empirical validation across 14 tertiary hospitals demonstrates a 28% communication reduction while maintaining 94.6% AUC.',
    keywords: 'Federated Learning, Graph Neural Networks, Privacy, Healthcare AI',
    status: 'Published',
    reviewer: 'Dr. N. Balakrishnan',
    rigorScore: 9,
    noveltyScore: 9,
    reviewerScore: '9.0 / 10',
    reviewerNotes: 'Outstanding mathematical foundation with reproducible hospital benchmarks.',
    submissionDate: '2026-09-12',
    doi: '10.5281/ijsse.2026.041',
    volume: 'Vol 12, Issue 4'
  },
  {
    id: 'IJSSE-2026-042',
    title: 'Zero-Trust Resilient Microsegmentation in Multi-Cloud Financial Fabrics',
    domain: 'Cloud & Cyber Systems',
    author: 'Ananya Sundaram',
    affiliation: 'Department of Computing, Anna University',
    email: 'ananya@annauniv.edu',
    abstract: 'This paper examines dynamic eBPF-driven network policy enforcement across hybrid Amazon AWS and Microsoft Azure topologies, mitigating side-channel lateral movements with sub-millisecond overhead.',
    keywords: 'Zero Trust, eBPF, Multi-Cloud, Cyber Security',
    status: 'Under Review',
    reviewer: 'Dr. N. Balakrishnan',
    rigorScore: null,
    noveltyScore: null,
    reviewerScore: 'Pending Evaluation',
    reviewerNotes: null,
    submissionDate: '2026-10-02',
    doi: null,
    volume: null
  },
  {
    id: 'IJSSE-2026-043',
    title: 'Deep Generative Protein Folding Prediction using AlphaEvolution Models',
    domain: 'Biomedical Informatics',
    author: 'Dr. Marcus Vance',
    affiliation: 'Biocomputational Institute of Geneva',
    email: 'm.vance@bcig.ch',
    abstract: 'Introducing transformer attention heads over evolutionary co-variation matrices to resolve orphan peptide conformers without homologue templates.',
    keywords: 'Protein Folding, Transformers, Structural Biology',
    status: 'Revision Required',
    reviewer: 'Dr. Evelyn Thorne',
    rigorScore: 7,
    noveltyScore: 8,
    reviewerScore: '7.5 / 10',
    reviewerNotes: 'Novel idea, but ablation study on disordered loop regions requires additional validation.',
    submissionDate: '2026-09-28',
    doi: null,
    volume: null
  },
  {
    id: 'IJSSE-2026-039',
    title: 'Socio-Economic Impacts of High-Speed Rail Corridors on Peri-Urban Mobility',
    domain: 'Social Sciences & Economics',
    author: 'Prof. S. Jayaraman',
    affiliation: 'Institute of Infrastructure Studies',
    email: 'jayaraman@infrastructure.org',
    abstract: 'Econometric regression assessing wage equalization and spatial urban sprawl surrounding transit-oriented development hubs across Southern India.',
    keywords: 'Econometrics, High-Speed Rail, Peri-Urban Development',
    status: 'Published',
    reviewer: 'Dr. Satoshi Tanaka',
    rigorScore: 8,
    noveltyScore: 9,
    reviewerScore: '8.5 / 10',
    reviewerNotes: 'Rigorous empirical census dataset analysis with impactful urban policy recommendations.',
    submissionDate: '2026-08-15',
    doi: '10.5281/ijsse.2026.039',
    volume: 'Vol 12, Issue 3'
  }
];

let appState = {
  currentRole: 'author',
  activeAuthorTab: 'myPapers',
  manuscripts: []
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const stored = labDB.get(STORAGE_KEYS.MANUSCRIPTS);
  if (!stored || stored.length === 0) {
    labDB.set(STORAGE_KEYS.MANUSCRIPTS, DEFAULT_MANUSCRIPTS);
    appState.manuscripts = [...DEFAULT_MANUSCRIPTS];
  } else {
    appState.manuscripts = stored;
  }
}

function renderApp() {
  renderAuthorPapers();
  renderPublishedArticles();
  renderReviewerQueue();
  renderEditorSubmissions();
  updateEditorMetrics();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('authorSection').classList.toggle('hidden', role !== 'author');
  document.getElementById('reviewerSection').classList.toggle('hidden', role !== 'reviewer');
  document.getElementById('editorSection').classList.toggle('hidden', role !== 'editor');

  if (role === 'editor') {
    renderEditorSubmissions();
    updateEditorMetrics();
  } else if (role === 'reviewer') {
    renderReviewerQueue();
  } else {
    renderAuthorPapers();
  }
}

// Author Tabs
function switchAuthorTab(tabName) {
  appState.activeAuthorTab = tabName;
  const tabs = {
    myPapers: 'authorTabPapers',
    currentIssue: 'authorTabIssue',
    guidelines: 'authorTabGuidelines',
    about: 'authorTabAbout'
  };

  document.querySelectorAll('#authorSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

// Author Views
function renderAuthorPapers() {
  const container = document.getElementById('authorPapersList');
  if (!container) return;

  container.innerHTML = appState.manuscripts.map(p => `
    <div class="paper-card ${p.status === 'Published' ? 'published' : 'under-review'}">
      <div class="paper-card-header">
        <div>
          <span class="badge ${p.status === 'Published' ? 'badge-success' : (p.status === 'Under Review' ? 'badge-warning' : 'badge-danger')}">
            ${p.status}
          </span>
          <h4 class="mt-1">${p.title}</h4>
          <span class="text-xs muted">Manuscript Ref: <strong>${p.id}</strong> | Track: <strong>${p.domain}</strong></span>
        </div>
        <div class="text-right">
          <span class="muted text-xs block">Submitted On</span>
          <span class="font-mono text-sm">${p.submissionDate}</span>
        </div>
      </div>

      <p class="paper-abstract-snippet">${p.abstract}</p>

      <div class="paper-meta-row">
        <div>
          <strong>Primary Author:</strong> ${p.author} (${p.affiliation})<br>
          <span class="text-xs muted">Assigned Reviewer: ${p.reviewer || 'Assigning...'} | Score: <strong>${p.reviewerScore}</strong></span>
        </div>
        <div>
          ${p.status === 'Published' ? `
            <a href="#" class="article-doi-link" onclick="showAlert('Permanent DOI URL resolved: https://doi.org/${p.doi}', 'info'); return false;">
              🔗 DOI: ${p.doi} (${p.volume})
            </a>
          ` : `
            <span class="badge badge-secondary text-xs">Awaiting Final Editorial Decision</span>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

function renderPublishedArticles() {
  const container = document.getElementById('publishedArticlesList');
  if (!container) return;

  const published = appState.manuscripts.filter(p => p.status === 'Published');
  if (published.length === 0) {
    container.innerHTML = `<p class="muted">No published articles yet in this issue.</p>`;
    return;
  }

  container.innerHTML = published.map(p => `
    <div class="article-row-item">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge badge-primary text-xs mb-1">${p.domain}</span>
          <h4>${p.title}</h4>
          <p class="text-xs muted">Authors: <strong>${p.author}</strong> | ${p.affiliation}</p>
        </div>
        <span class="badge badge-success text-xs">Open Access</span>
      </div>
      <p class="text-sm muted my-2">${p.abstract}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem;">
        <span class="article-doi-link">🔗 https://doi.org/${p.doi}</span>
        <button class="btn btn-outline btn-xs" onclick="showAlert('Downloading full-text PDF for: ${p.title}', 'info')">📥 Download Full-Text PDF</button>
      </div>
    </div>
  `).join('');
}

// Submission Handling
function openSubmitManuscriptModal() {
  document.getElementById('submitManuscriptModal').classList.remove('hidden');
}

function closeSubmitManuscriptModal() {
  document.getElementById('submitManuscriptModal').classList.add('hidden');
}

function handleSubmitManuscript(event) {
  event.preventDefault();

  const title = document.getElementById('paperTitleInput').value.trim();
  const domain = document.getElementById('paperDomainSelect').value;
  const author = document.getElementById('paperAuthorInput').value.trim();
  const affiliation = document.getElementById('paperAffiliationInput').value.trim();
  const email = document.getElementById('paperEmailInput').value.trim();
  const abstract = document.getElementById('paperAbstractInput').value.trim();
  const keywords = document.getElementById('paperKeywordsInput').value.trim();

  const newPaper = {
    id: 'IJSSE-2026-0' + Math.floor(45 + Math.random() * 50),
    title,
    domain,
    author,
    affiliation,
    email,
    abstract,
    keywords,
    status: 'Under Review',
    reviewer: 'Dr. N. Balakrishnan',
    rigorScore: null,
    noveltyScore: null,
    reviewerScore: 'Pending Evaluation',
    reviewerNotes: null,
    submissionDate: new Date().toISOString().split('T')[0],
    doi: null,
    volume: null
  };

  appState.manuscripts.unshift(newPaper);
  labDB.set(STORAGE_KEYS.MANUSCRIPTS, appState.manuscripts);

  closeSubmitManuscriptModal();
  showAlert(`🎉 Manuscript "${newPaper.id}" submitted to IJSSE editorial board! Confirmation sent to ${email}.`, 'success');

  renderAuthorPapers();
  renderReviewerQueue();
  renderEditorSubmissions();
  updateEditorMetrics();
}

function downloadTemplateSimulated(fileName) {
  showAlert(`Downloading official template: ${fileName}`, 'info');
}

// Reviewer Operations
function renderReviewerQueue() {
  const container = document.getElementById('reviewerAssignmentsList');
  if (!container) return;

  // Papers assigned to Dr. Balakrishnan
  const assigned = appState.manuscripts.filter(p => p.reviewer === 'Dr. N. Balakrishnan');

  if (assigned.length === 0) {
    container.innerHTML = `<p class="muted">No pending review assignments in your queue.</p>`;
    return;
  }

  container.innerHTML = assigned.map(p => `
    <div class="assigned-card">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span class="badge ${p.status === 'Published' ? 'badge-success' : 'badge-warning'} text-xs">${p.status}</span>
          <span class="font-mono text-xs text-primary font-bold">${p.id}</span>
        </div>
        <h4 class="mt-2">${p.title}</h4>
        <p class="text-xs muted">Track: <strong>${p.domain}</strong></p>
        <p class="text-sm muted my-2">${p.abstract}</p>
        ${p.reviewerNotes ? `
          <div style="background: rgba(15, 23, 42, 0.6); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.8rem;">
            <strong>Your Submitted Evaluation:</strong> ${p.reviewerScore} (${p.reviewerNotes})
          </div>
        ` : ''}
      </div>

      <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
        <button class="btn btn-warning btn-sm btn-block" onclick="openReviewModal('${p.id}')">
          📝 ${p.rigorScore ? 'Update Peer Review Score' : 'Submit Peer Review Score'}
        </button>
      </div>
    </div>
  `).join('');
}

function openReviewModal(paperId) {
  const p = appState.manuscripts.find(x => x.id === paperId);
  if (!p) return;

  document.getElementById('reviewPaperId').value = p.id;
  document.getElementById('reviewPaperTitleDisplay').value = `${p.id}: ${p.title}`;
  document.getElementById('reviewModal').classList.remove('hidden');
}

function closeReviewModal() {
  document.getElementById('reviewModal').classList.add('hidden');
}

function handleSubmitReviewScore(event) {
  event.preventDefault();
  const paperId = document.getElementById('reviewPaperId').value;
  const p = appState.manuscripts.find(x => x.id === paperId);
  if (!p) return;

  const rigor = parseInt(document.getElementById('reviewScoreRigor').value, 10);
  const novelty = parseInt(document.getElementById('reviewScoreNovelty').value, 10);
  const rec = document.getElementById('reviewRecommendation').value;
  const notes = document.getElementById('reviewComments').value.trim();

  const avg = ((rigor + novelty) / 2).toFixed(1);

  p.rigorScore = rigor;
  p.noveltyScore = novelty;
  p.reviewerScore = `${avg} / 10`;
  p.reviewerNotes = `${rec}: ${notes}`;

  if (rec === 'Accept as Published') {
    p.status = 'Under Review'; // Ready for Editor decision
  } else if (rec.includes('Revision')) {
    p.status = 'Revision Required';
  } else {
    p.status = 'Revision Required';
  }

  labDB.set(STORAGE_KEYS.MANUSCRIPTS, appState.manuscripts);
  closeReviewModal();
  showAlert(`Peer evaluation recorded for manuscript ${p.id}. Score: ${avg}/10 forwarded to Chief Editor.`, 'success');

  renderReviewerQueue();
  renderAuthorPapers();
  renderEditorSubmissions();
}

// Chief Editor
function renderEditorSubmissions() {
  const tbody = document.getElementById('editorSubmissionsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.manuscripts.map(p => `
    <tr>
      <td class="font-mono font-bold">${p.id}</td>
      <td>
        <strong>${p.title}</strong><br>
        <span class="muted text-xs">${p.domain}</span>
      </td>
      <td>
        <strong>${p.author}</strong><br>
        <span class="text-xs muted">${p.affiliation}</span>
      </td>
      <td class="text-xs">${p.reviewer}</td>
      <td class="font-bold font-mono ${p.reviewerScore.includes('Pending') ? 'muted' : 'text-success'}">${p.reviewerScore}</td>
      <td>
        <span class="badge ${p.status === 'Published' ? 'badge-success' : (p.status === 'Under Review' ? 'badge-warning' : 'badge-danger')}">
          ${p.status}
        </span>
      </td>
      <td>
        ${p.status !== 'Published' ? `
          <button class="btn btn-success btn-xs mr-1" onclick="editorMakeDecision('${p.id}', 'Accept')">Accept & Publish</button>
          <button class="btn btn-danger btn-xs" onclick="editorMakeDecision('${p.id}', 'Reject')">Reject</button>
        ` : `
          <span class="text-xs font-mono text-primary font-bold">DOI Assigned</span>
        `}
      </td>
    </tr>
  `).join('');
}

function editorMakeDecision(paperId, decision) {
  const p = appState.manuscripts.find(x => x.id === paperId);
  if (!p) return;

  if (decision === 'Accept') {
    p.status = 'Published';
    p.doi = `10.5281/ijsse.2026.${p.id.slice(-3)}`;
    p.volume = 'Vol 12, Issue 4';
    showAlert(`Manuscript ${p.id} accepted! Published into Scopus Volume 12, Issue 4 with DOI ${p.doi}`, 'success');
  } else {
    p.status = 'Rejected';
    showAlert(`Manuscript ${p.id} rejected by Editorial Board.`, 'info');
  }

  labDB.set(STORAGE_KEYS.MANUSCRIPTS, appState.manuscripts);
  renderEditorSubmissions();
  renderAuthorPapers();
  renderPublishedArticles();
  updateEditorMetrics();
}

function updateEditorMetrics() {
  const total = appState.manuscripts.length;
  const underReview = appState.manuscripts.filter(p => p.status === 'Under Review').length;
  const published = appState.manuscripts.filter(p => p.status === 'Published').length;

  const elT = document.getElementById('editorTotalManuscripts');
  const elU = document.getElementById('editorPendingReviews');
  const elP = document.getElementById('editorPublishedCount');

  if (elT) elT.innerText = total;
  if (elU) elU.innerText = underReview;
  if (elP) elP.innerText = published;
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
