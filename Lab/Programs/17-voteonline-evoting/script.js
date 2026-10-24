// VoteOnline E-Voting Platform Script

const DEFAULT_VOTERS = [
  { id: 'TN-CHE-10492', name: 'Dr. Aravind Swamy', phone: '+91 98401 22910', ward: 'Ward 14', hasVoted: false, votedCandidateId: null },
  { id: 'TN-CHE-10493', name: 'Kavitha Ramachandran', phone: '+91 98402 33811', ward: 'Ward 14', hasVoted: true, votedCandidateId: 'CAND-01' },
  { id: 'TN-CHE-10494', name: 'V. Sundaresan', phone: '+91 98403 44712', ward: 'Ward 14', hasVoted: true, votedCandidateId: 'CAND-01' },
  { id: 'TN-CHE-10495', name: 'Deepa Krishnan', phone: '+91 98404 55613', ward: 'Ward 14', hasVoted: true, votedCandidateId: 'CAND-02' },
  { id: 'TN-CHE-10496', name: 'M. Prabhakar', phone: '+91 98405 66514', ward: 'Ward 14', hasVoted: true, votedCandidateId: 'CAND-01' },
  { id: 'TN-CHE-10497', name: 'Geetha Raman', phone: '+91 98406 77415', ward: 'Ward 14', hasVoted: true, votedCandidateId: 'CAND-02' },
  { id: 'TN-CHE-10498', name: 'Mohamed Riyaz', phone: '+91 98407 88316', ward: 'Ward 14', hasVoted: true, votedCandidateId: 'CAND-02' },
  { id: 'TN-CHE-20815', name: 'S. Jayaraman', phone: '+91 94440 99201', ward: 'Ward 18', hasVoted: true, votedCandidateId: 'CAND-04' },
  { id: 'TN-CHE-20816', name: 'Nalini Chandran', phone: '+91 94441 11202', ward: 'Ward 18', hasVoted: true, votedCandidateId: 'CAND-04' },
  { id: 'TN-CHE-20817', name: 'R. Vignesh', phone: '+91 94442 22303', ward: 'Ward 18', hasVoted: false, votedCandidateId: null }
];

const DEFAULT_CANDIDATES = [
  {
    id: 'CAND-01',
    name: 'Shalini Natarajan',
    party: 'Civic Progress Union',
    symbol: '🌳',
    ward: 'Ward 14',
    manifesto: 'Clean solar powered LED streetlights, automated rainwater harvesting drains, and civic tech response.',
    votes: 3
  },
  {
    id: 'CAND-02',
    name: 'M. Thangavel',
    party: "Democratic People's Front",
    symbol: '☀️',
    ward: 'Ward 14',
    manifesto: 'Revitalization of municipal primary clinics, daily waste collection segregation, and youth sports parks.',
    votes: 3
  },
  {
    id: 'CAND-03',
    name: 'Farooq Abdullah',
    party: 'Clean Energy Alliance',
    symbol: '⚡',
    ward: 'Ward 14',
    manifesto: 'Electric bus corridors, subsidized rooftop solar grids, and digital governance transparency.',
    votes: 0
  },
  {
    id: 'CAND-04',
    name: 'K. Senthil Kumar',
    party: 'United Citizens Forum',
    symbol: '🕊️',
    ward: 'Ward 18',
    manifesto: 'Pedestrian safety footpaths, stormwater flood prevention, and 24x7 municipal water supply.',
    votes: 2
  },
  {
    id: 'CAND-05',
    name: 'Anitha Balan',
    party: 'Tech & Innovation Party',
    symbol: '⚙️',
    ward: 'Ward 18',
    manifesto: 'Public Wi-Fi corridors, automated library digitization, and startup incubation grants.',
    votes: 0
  }
];

// App State
let currentRole = 'voter';
let currentVoterTab = 'ballot';
let currentAdminTab = 'candidates';
let loggedInVoter = null;
let pendingLoginVoter = null;
let currentSelectedCandidate = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  renderAdminCandidates();
  renderAdminVoters();
  renderCertifiedResults();
  updateAdminMetrics();
});

function initStorage() {
  if (!labDB.get('vote_voters')) labDB.set('vote_voters', DEFAULT_VOTERS);
  if (!labDB.get('vote_candidates')) labDB.set('vote_candidates', DEFAULT_CANDIDATES);
  if (!labDB.get('vote_receipts')) labDB.set('vote_receipts', []);
}

// Role Switcher
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('voterSection').classList.toggle('hidden', role !== 'voter');
  document.getElementById('adminSection').classList.toggle('hidden', role !== 'admin');

  if (role === 'admin') {
    renderAdminCandidates();
    renderAdminVoters();
    renderCertifiedResults();
    updateAdminMetrics();
  } else {
    if (loggedInVoter) {
      refreshVoterState();
    }
  }
}

// Voter Tabs
function switchVoterTab(tab) {
  currentVoterTab = tab;
  const tabIds = ['ballot', 'receipt', 'progress'];
  tabIds.forEach(t => {
    const pane = document.getElementById('tabVoter' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#voterBallotRoom .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });

  if (tab === 'progress') renderLiveTally();
  if (tab === 'receipt') renderVoterReceipt();
}

// Admin Tabs
function switchAdminTab(tab) {
  currentAdminTab = tab;
  const tabIds = ['candidates', 'voterList', 'results'];
  tabIds.forEach(t => {
    const pane = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (pane) pane.classList.toggle('active', t === tab);
  });

  const buttons = document.querySelectorAll('#adminSection .tab-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', tabIds[idx] === tab);
  });
}

// Helper to fill demo credentials
function fillVoter(id, phone) {
  document.getElementById('inputVoterId').value = id;
  document.getElementById('inputVoterPhone').value = phone;
}

// Voter Authentication - Step 1: Login Form
function handleVoterLogin(e) {
  e.preventDefault();
  const voterId = document.getElementById('inputVoterId').value.trim().toUpperCase();
  const phone = document.getElementById('inputVoterPhone').value.trim();

  const voters = labDB.get('vote_voters') || [];
  const found = voters.find(v => v.id === voterId);

  if (!found) {
    showAlert(`Voter ID "${voterId}" not found in electoral roll. Please verify your ID.`, 'danger');
    return;
  }

  // Generate random 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  pendingLoginVoter = { voter: found, otp: generatedOtp };

  document.getElementById('simulatedLoginOtp').textContent = generatedOtp;
  document.getElementById('inputLoginOtp').value = generatedOtp;

  document.getElementById('voterLoginCard').classList.add('hidden');
  document.getElementById('voterOtpCard').classList.remove('hidden');

  showAlert(`Authentication OTP sent to registered mobile number ${phone}!`, 'info');
}

function cancelVoterLogin() {
  pendingLoginVoter = null;
  document.getElementById('voterOtpCard').classList.add('hidden');
  document.getElementById('voterLoginCard').classList.remove('hidden');
}

// Voter Authentication - Step 2: Verify Login OTP
function handleVerifyLoginOtp(e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('inputLoginOtp').value.trim();

  if (!pendingLoginVoter || enteredOtp !== pendingLoginVoter.otp) {
    showAlert('Invalid one-time passcode. Please try again.', 'danger');
    return;
  }

  loggedInVoter = pendingLoginVoter.voter;
  pendingLoginVoter = null;

  document.getElementById('voterAuthContainer').classList.add('hidden');
  document.getElementById('voterBallotRoom').classList.remove('hidden');

  refreshVoterState();
  showAlert(`Welcome, ${loggedInVoter.name}. Electronic ballot successfully unlocked.`, 'success');
}

function logoutVoter() {
  loggedInVoter = null;
  currentSelectedCandidate = null;
  document.getElementById('voterBallotRoom').classList.add('hidden');
  document.getElementById('voterAuthContainer').classList.remove('hidden');
  document.getElementById('voterOtpCard').classList.add('hidden');
  document.getElementById('voterLoginCard').classList.remove('hidden');
  showAlert('Voter session closed safely.', 'info');
}

// Refresh Voter Screen
function refreshVoterState() {
  // Pull latest voter object from DB
  const voters = labDB.get('vote_voters') || [];
  loggedInVoter = voters.find(v => v.id === loggedInVoter.id) || loggedInVoter;

  document.getElementById('ballotVoterName').textContent = loggedInVoter.name;
  document.getElementById('ballotVoterMeta').textContent = `Voter ID: ${loggedInVoter.id} | ${loggedInVoter.ward} | Status: ${loggedInVoter.hasVoted ? 'Ballot Cast' : 'Verified'}`;
  document.getElementById('ballotWardTitle').textContent = `${loggedInVoter.ward} Constituency`;

  const alreadyBanner = document.getElementById('alreadyVotedBanner');
  const submitPanel = document.getElementById('voteSubmissionContainer');

  if (loggedInVoter.hasVoted) {
    alreadyBanner.classList.remove('hidden');
    submitPanel.classList.add('hidden');
  } else {
    alreadyBanner.classList.add('hidden');
  }

  renderBallotCandidates();
}

// Render Ballot Candidates for Current Ward
function renderBallotCandidates() {
  const container = document.getElementById('candidatesGrid');
  const candidates = labDB.get('vote_candidates') || [];
  const wardCandidates = candidates.filter(c => c.ward === loggedInVoter.ward);

  if (wardCandidates.length === 0) {
    container.innerHTML = `<p class="muted">No candidates contesting in ${loggedInVoter.ward}.</p>`;
    return;
  }

  container.innerHTML = wardCandidates.map(c => {
    const isSelected = currentSelectedCandidate && currentSelectedCandidate.id === c.id;
    const isVotedThis = loggedInVoter.hasVoted && loggedInVoter.votedCandidateId === c.id;

    return `
      <div class="candidate-card ${isSelected ? 'selected' : ''}" onclick="selectCandidate('${c.id}')">
        <div>
          <div class="candidate-symbol">${c.symbol}</div>
          <div class="candidate-name">${c.name}</div>
          <div class="candidate-party">${c.party}</div>
          <div class="candidate-manifesto">${c.manifesto}</div>
        </div>

        <div>
          ${loggedInVoter.hasVoted ? `
            <button class="btn ${isVotedThis ? 'btn-success' : 'btn-secondary'} btn-block btn-sm" disabled>
              ${isVotedThis ? '✓ Casted Ballot' : 'Voting Closed'}
            </button>
          ` : `
            <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-block btn-sm">
              ${isSelected ? '● Selected for Vote' : '○ Choose Candidate'}
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function selectCandidate(candidateId) {
  if (loggedInVoter.hasVoted) return;

  const candidates = labDB.get('vote_candidates') || [];
  currentSelectedCandidate = candidates.find(c => c.id === candidateId);

  renderBallotCandidates();

  if (currentSelectedCandidate) {
    const panel = document.getElementById('voteSubmissionContainer');
    document.getElementById('selectedCandidateName').textContent = `${currentSelectedCandidate.name} (${currentSelectedCandidate.party} - ${currentSelectedCandidate.symbol})`;
    
    // Generate new vote OTP
    const voteOtp = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('simulatedVoteOtp').textContent = voteOtp;
    document.getElementById('finalVoteOtpInput').value = voteOtp;

    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth' });
  }
}

// Final Submit Vote with OTP
function handleFinalSubmitVote(e) {
  e.preventDefault();
  if (!currentSelectedCandidate || loggedInVoter.hasVoted) return;

  const enteredOtp = document.getElementById('finalVoteOtpInput').value.trim();
  const simulatedOtp = document.getElementById('simulatedVoteOtp').textContent.trim();

  if (enteredOtp !== simulatedOtp) {
    showAlert('Incorrect vote verification OTP. Vote was not submitted.', 'danger');
    return;
  }

  // Increment candidate count
  const candidates = labDB.get('vote_candidates') || [];
  const cIdx = candidates.findIndex(c => c.id === currentSelectedCandidate.id);
  if (cIdx !== -1) {
    candidates[cIdx].votes = (candidates[cIdx].votes || 0) + 1;
    labDB.set('vote_candidates', candidates);
  }

  // Update voter state
  const voters = labDB.get('vote_voters') || [];
  const vIdx = voters.findIndex(v => v.id === loggedInVoter.id);
  const receiptId = `VVPAT-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toLocaleString();

  if (vIdx !== -1) {
    voters[vIdx].hasVoted = true;
    voters[vIdx].votedCandidateId = currentSelectedCandidate.id;
    voters[vIdx].voteReceiptId = receiptId;
    voters[vIdx].votedAt = timestamp;
    labDB.set('vote_voters', voters);
    loggedInVoter = voters[vIdx];
  }

  // Record VVPAT receipt
  const receipts = labDB.get('vote_receipts') || [];
  const cryptHash = generateVoteHash(loggedInVoter.id, currentSelectedCandidate.id, timestamp);
  receipts.unshift({
    receiptId,
    voterId: loggedInVoter.id,
    ward: loggedInVoter.ward,
    candidateName: currentSelectedCandidate.name,
    party: currentSelectedCandidate.party,
    symbol: currentSelectedCandidate.symbol,
    timestamp,
    hash: cryptHash
  });
  labDB.set('vote_receipts', receipts);

  showAlert('Democratic vote cast successfully! Generating your official VVPAT digital audit slip...', 'success');
  refreshVoterState();
  renderLiveTally();
  renderAdminCandidates();
  renderAdminVoters();
  renderCertifiedResults();
  updateAdminMetrics();

  switchVoterTab('receipt');
}

// Generate deterministic hash string
function generateVoteHash(voterId, candId, time) {
  let str = `${voterId}::${candId}::${time}::SECRET_KEY_ELECTION_2026`;
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return '0x' + (h >>> 0).toString(16).padStart(8, '0').toUpperCase() + 'f9a2c074b1e3';
}

// Render VVPAT Receipt
function renderVoterReceipt() {
  const box = document.getElementById('voterReceiptDisplay');
  const receipts = labDB.get('vote_receipts') || [];
  const myReceipt = receipts.find(r => r.voterId === loggedInVoter.id);

  if (!myReceipt) {
    box.innerHTML = `<p class="muted text-center py-4">No verified vote record found for ${loggedInVoter.id}.</p>`;
    return;
  }

  box.innerHTML = `
    <div class="receipt-header">
      <h3 style="margin: 0; color: #0f172a;">GOVERNMENT ELECTION COMMISSION</h3>
      <p style="margin: 0.25rem 0 0; font-size: 0.8rem; color: #64748b;">OFFICIAL ELECTRONIC VVPAT AUDIT RECEIPT</p>
    </div>

    <div class="receipt-row">
      <span>Audit Slip Number:</span>
      <strong class="font-mono">${myReceipt.receiptId}</strong>
    </div>
    <div class="receipt-row">
      <span>Electoral Ward:</span>
      <strong>${myReceipt.ward}</strong>
    </div>
    <div class="receipt-row">
      <span>Timestamp:</span>
      <span>${myReceipt.timestamp}</span>
    </div>
    <div class="receipt-row">
      <span>Candidate Chosen:</span>
      <strong>${myReceipt.candidateName} (${myReceipt.symbol})</strong>
    </div>
    <div class="receipt-row">
      <span>Political Affiliation:</span>
      <span>${myReceipt.party}</span>
    </div>

    <div class="receipt-hash">
      <div style="font-size: 0.7rem; color: #64748b; margin-bottom: 0.2rem;">BLOCKCHAIN CRYPTOGRAPHIC INTEGRITY HASH:</div>
      <strong>${myReceipt.hash}</strong>
    </div>

    <div class="text-center mt-3">
      <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print VVPAT Paper Trail</button>
    </div>
  `;
}

// Live Tally
function renderLiveTally() {
  const candidates = labDB.get('vote_candidates') || [];
  const voters = labDB.get('vote_voters') || [];

  const totalVoters = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const turnoutPct = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0;

  document.getElementById('turnoutPercentCircle').textContent = `${turnoutPct}%`;
  document.getElementById('tallyTotalVoters').textContent = totalVoters;
  document.getElementById('tallyCastVoters').textContent = votedCount;
  document.getElementById('tallyPercentText').textContent = `${turnoutPct}%`;

  const container = document.getElementById('liveTallyBars');
  const maxVotes = Math.max(...candidates.map(c => c.votes || 0), 1);

  container.innerHTML = candidates.map(c => {
    const votes = c.votes || 0;
    const pct = votedCount > 0 ? ((votes / votedCount) * 100).toFixed(1) : 0;
    const isLeading = votes === maxVotes && votes > 0;

    return `
      <div class="tally-bar-item">
        <div class="tally-meta-flex">
          <div>
            <strong>${c.symbol} ${c.name}</strong>
            <span class="muted text-xs"> (${c.party} - ${c.ward})</span>
          </div>
          <div>
            <strong>${votes} votes</strong>
            <span class="muted text-xs">(${pct}%)</span>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${isLeading ? 'winner' : ''}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Admin Operations
function renderAdminCandidates() {
  const tbody = document.getElementById('adminCandidatesTable');
  const candidates = labDB.get('vote_candidates') || [];

  tbody.innerHTML = candidates.map(c => `
    <tr>
      <td style="font-size: 1.5rem;">${c.symbol}</td>
      <td><strong>${c.name}</strong></td>
      <td>${c.party}</td>
      <td>${c.ward}</td>
      <td><span class="badge badge-success">Contesting (${c.votes || 0} votes)</span></td>
    </tr>
  `).join('');
}

function handleCreateCandidate(e) {
  e.preventDefault();
  const name = document.getElementById('candName').value.trim();
  const ward = document.getElementById('candWard').value;
  const party = document.getElementById('candParty').value.trim();
  const symbol = document.getElementById('candSymbol').value;
  const manifesto = document.getElementById('candManifesto').value.trim();

  const candidates = labDB.get('vote_candidates') || [];
  const newCandidate = {
    id: `CAND-${candidates.length + 1 < 10 ? '0' : ''}${candidates.length + 1}`,
    name,
    party,
    symbol,
    ward,
    manifesto,
    votes: 0
  };

  candidates.push(newCandidate);
  labDB.set('vote_candidates', candidates);

  document.getElementById('createCandidateForm').reset();
  renderAdminCandidates();
  renderCertifiedResults();
  updateAdminMetrics();
  showAlert(`Candidate ${name} nominated for ${ward}!`, 'success');
}

function renderAdminVoters() {
  const tbody = document.getElementById('adminVoterRollTable');
  const voters = labDB.get('vote_voters') || [];

  tbody.innerHTML = voters.map(v => `
    <tr>
      <td class="font-mono font-bold">${v.id}</td>
      <td>${v.name}</td>
      <td>${v.ward}</td>
      <td class="font-mono text-xs">${v.phone}</td>
      <td><span class="badge ${v.hasVoted ? 'badge-success' : 'badge-warning'}">${v.hasVoted ? '✓ Voted' : 'Pending'}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="adminRemoveVoter('${v.id}')">Remove</button>
      </td>
    </tr>
  `).join('');
}

function openAddVoterModal() {
  document.getElementById('addVoterModal').classList.remove('hidden');
}

function closeAddVoterModal() {
  document.getElementById('addVoterModal').classList.add('hidden');
}

function handleAdminAddVoter(e) {
  e.preventDefault();
  const name = document.getElementById('newVoterName').value.trim();
  const id = document.getElementById('newVoterId').value.trim().toUpperCase();
  const ward = document.getElementById('newVoterWard').value;
  const phone = document.getElementById('newVoterPhone').value.trim();

  const voters = labDB.get('vote_voters') || [];
  if (voters.some(v => v.id === id)) {
    showAlert(`Voter ID ${id} is already enrolled in the registry.`, 'danger');
    return;
  }

  voters.push({
    id,
    name,
    phone,
    ward,
    hasVoted: false,
    votedCandidateId: null
  });
  labDB.set('vote_voters', voters);

  closeAddVoterModal();
  renderAdminVoters();
  updateAdminMetrics();
  showAlert(`Elector ${name} enrolled in ${ward}!`, 'success');
}

function adminRemoveVoter(id) {
  let voters = labDB.get('vote_voters') || [];
  voters = voters.filter(v => v.id !== id);
  labDB.set('vote_voters', voters);
  renderAdminVoters();
  updateAdminMetrics();
  showAlert(`Voter ${id} removed from electoral roll.`, 'info');
}

function seedDefaultVoters() {
  labDB.set('vote_voters', DEFAULT_VOTERS);
  labDB.set('vote_candidates', DEFAULT_CANDIDATES);
  renderAdminVoters();
  renderAdminCandidates();
  renderCertifiedResults();
  updateAdminMetrics();
  showAlert('Electoral roll restored to default demo values.', 'info');
}

function renderCertifiedResults() {
  const container = document.getElementById('adminCertifiedResultsBox');
  const candidates = labDB.get('vote_candidates') || [];
  const voters = labDB.get('vote_voters') || [];

  // Group candidates by ward
  const wards = [...new Set(candidates.map(c => c.ward))];

  container.innerHTML = wards.map(ward => {
    const wardCands = candidates.filter(c => c.ward === ward);
    const wardVoters = voters.filter(v => v.ward === ward);
    const votesInWard = wardVoters.filter(v => v.hasVoted).length;

    // Sort by votes
    wardCands.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const winner = wardCands[0];
    const isTie = wardCands.length > 1 && wardCands[0].votes === wardCands[1].votes && wardCands[0].votes > 0;

    return `
      <div class="winner-card">
        <div class="card-header-flex">
          <div>
            <h3>${ward} Certified Declaration</h3>
            <p class="muted text-xs">Total Turnout: ${votesInWard} of ${wardVoters.length} electors (${wardVoters.length > 0 ? ((votesInWard / wardVoters.length) * 100).toFixed(1) : 0}%)</p>
          </div>
          <span class="badge ${isTie ? 'badge-warning' : 'badge-success'}">${isTie ? 'Tie Declared' : 'Official Winner'}</span>
        </div>

        <div style="font-size: 1.1rem; margin: 1rem 0;">
          ${isTie ? `
            <div style="color: #f59e0b;">
              ⚠️ <strong>Tied Outcome:</strong> ${wardCands[0].name} and ${wardCands[1].name} tied with ${wardCands[0].votes} votes each!
            </div>
          ` : `
            <div>
              🏆 <strong>Leading Candidate:</strong> ${winner.symbol} ${winner.name} (${winner.party})
            </div>
            <div class="muted text-sm mt-1">Total Votes Secured: <strong>${winner.votes || 0} votes</strong></div>
          `}
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Party</th>
                <th>Votes</th>
                <th>Vote Share</th>
              </tr>
            </thead>
            <tbody>
              ${wardCands.map((c, i) => `
                <tr>
                  <td>#${i + 1}</td>
                  <td>${c.symbol} ${c.name}</td>
                  <td>${c.party}</td>
                  <td class="font-bold">${c.votes || 0}</td>
                  <td>${votesInWard > 0 ? (((c.votes || 0) / votesInWard) * 100).toFixed(1) : 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

function updateAdminMetrics() {
  const voters = labDB.get('vote_voters') || [];
  const candidates = labDB.get('vote_candidates') || [];

  document.getElementById('adminTotalRegisteredVoters').textContent = voters.length;
  document.getElementById('adminTotalVotesCast').textContent = voters.filter(v => v.hasVoted).length;
  document.getElementById('adminTotalCandidates').textContent = candidates.length;
}

// Banner Utility
function showAlert(msg, type = 'info') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert-banner alert-${type}`;
  banner.textContent = msg;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 4000);
}
