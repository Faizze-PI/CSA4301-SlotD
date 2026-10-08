// PlacementPro Online Examination Engine
const STORAGE_PREFIX = 'placement_';

const EXAM_QUESTIONS = [
    {
        id: 1,
        section: 'Quantitative & Reasoning',
        q: 'A train 240 meters long passes a pole in 24 seconds. How long will it take to pass a platform 650 meters long at the same speed?',
        options: ['65 seconds', '89 seconds', '72 seconds', '100 seconds'],
        correct: 1,
        explanation: 'Speed = 240 / 24 = 10 m/s. Time to cross platform = (240 + 650) / 10 = 890 / 10 = 89 seconds.'
    },
    {
        id: 2,
        section: 'Quantitative & Reasoning',
        q: 'In a code language, SYSTEM is written as SYSMET, and NEARER is written as AENRER. How is FRACTION written in that code?',
        options: ['CARFNOIT', 'CARFTION', 'ARFCITNO', 'CRAFITNO'],
        correct: 0,
        explanation: 'The word is divided into two halves; the first half and second half letters are reversed.'
    },
    {
        id: 3,
        section: 'Data Structures & Algorithms',
        q: 'What is the tightest worst-case time complexity of finding a shortest path in a weighted graph using Dijkstra\'s algorithm implemented with a Fibonacci heap?',
        options: ['O(V^2)', 'O(E + V log V)', 'O(E log V)', 'O(V log V)'],
        correct: 1,
        explanation: 'Fibonacci heaps reduce decrease-key operations to amortized O(1), yielding O(E + V log V).'
    },
    {
        id: 4,
        section: 'Data Structures & Algorithms',
        q: 'Which self-balancing binary search tree maintains a height invariant where no leaf node is more than twice as deep as any other leaf node?',
        options: ['AVL Tree', 'Red-Black Tree', 'Splay Tree', 'B-Tree'],
        correct: 1,
        explanation: 'Red-Black trees enforce coloring rules that guarantee the longest root-to-leaf path is at most twice the shortest path.'
    },
    {
        id: 5,
        section: 'Data Structures & Algorithms',
        q: 'What is the recurrence relation and asymptotic bound for the Merge Sort algorithm on n elements?',
        options: ['T(n) = 2T(n/2) + O(n) => O(n log n)', 'T(n) = T(n-1) + O(n) => O(n^2)', 'T(n) = 2T(n/2) + O(1) => O(n)', 'T(n) = T(n/2) + O(1) => O(log n)'],
        correct: 0,
        explanation: 'Merge sort divides the array into 2 halves of size n/2 and merges in linear O(n) time, resulting in O(n log n).'
    },
    {
        id: 6,
        section: 'Systems & Computer Networks',
        q: 'During the TCP three-way handshake, what flags are set by the server when acknowledging a client connection request?',
        options: ['SYN only', 'ACK only', 'SYN and ACK', 'FIN and ACK'],
        correct: 2,
        explanation: 'The server acknowledges the client sequence with ACK and synchronizes its own sequence number with SYN (SYN-ACK).'
    },
    {
        id: 7,
        section: 'Systems & Computer Networks',
        q: 'Which HTTP header is strictly necessary for Cross-Origin Resource Sharing (CORS) preflight validation by the browser?',
        options: ['Access-Control-Allow-Origin', 'Authorization', 'Cache-Control', 'Content-Encoding'],
        correct: 0,
        explanation: 'The server must return Access-Control-Allow-Origin matching the requesting domain to permit cross-origin access.'
    },
    {
        id: 8,
        section: 'Systems & Web Technology',
        q: 'In the JavaScript event loop runtime, which microtask queue has execution priority over standard setTimeout macrotasks?',
        options: ['requestAnimationFrame', 'Promise.then() callbacks', 'DOM Click Handlers', 'setInterval tasks'],
        correct: 1,
        explanation: 'Microtasks (Promises, queueMicrotask) are drained completely before the event loop advances to the next macrotask.'
    },
    {
        id: 9,
        section: 'Systems & Web Technology',
        q: 'What ACID property guarantees that all transactions executed concurrently produce the exact same outcome as if executed sequentially?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct: 2,
        explanation: 'Isolation (specifically Serializable isolation) ensures concurrent transactions behave as if executed serially.'
    },
    {
        id: 10,
        section: 'Systems & Web Technology',
        q: 'Which cryptographic algorithm is most commonly utilized for signing asymmetric JSON Web Tokens (JWT)?',
        options: ['AES-256-CBC', 'RS256 (RSA with SHA-256)', 'MD5', 'DES'],
        correct: 1,
        explanation: 'RS256 uses a private key for token issuance and an asymmetric public key for token signature verification.'
    }
];

const DEFAULT_COHORT_MERIT = [
    { rank: 1, regNo: '2026-CS-004', name: 'Priya Sundaram', dept: 'CSE', score: 10, percentile: '99.8%' },
    { rank: 2, regNo: '2026-CS-018', name: 'Karthik N.', dept: 'CSE', score: 9, percentile: '96.5%' },
    { rank: 3, regNo: '2026-IT-009', name: 'Sneha Rao', dept: 'IT', score: 8, percentile: '89.2%' },
    { rank: 4, regNo: '2026-CS-042', name: 'Alex Kumar', dept: 'CSE', score: 8, percentile: '89.2%' },
    { rank: 5, regNo: '2026-AI-012', name: 'Vignesh M.', dept: 'AI & DS', score: 7, percentile: '78.4%' },
    { rank: 6, regNo: '2026-EC-031', name: 'Ananya Sharma', dept: 'ECE', score: 5, percentile: '54.0%' },
    { rank: 7, regNo: '2026-CS-088', name: 'Rohan Varma', dept: 'CSE', score: 4, percentile: '38.2%' }
];

// App State
let currentQIdx = 0;
let userAnswers = {}; // { qIdx: optIdx }
let reviewFlags = []; // array of qIdx
let visitedFlags = [0];
let examTimeSecs = 900; // 15 mins
let examTimerInterval = null;
let examSubmitted = false;
let cutoffScore = 6;
let currentRole = 'student';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderQuestionPalette();
    renderMeritList();
    renderReevalHistory();
});

function loadData() {
    cutoffScore = labDB.get(STORAGE_PREFIX + 'cutoff', 6);
    userAnswers = labDB.get(STORAGE_PREFIX + 'userAnswers', {});
    examSubmitted = labDB.get(STORAGE_PREFIX + 'examSubmitted', false);

    if (examSubmitted) {
        showTab('scorecard');
        calculateAndDisplayResults();
    }
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'userAnswers', userAnswers);
    labDB.set(STORAGE_PREFIX + 'examSubmitted', examSubmitted);
    labDB.set(STORAGE_PREFIX + 'cutoff', cutoffScore);
}

// Role Switcher
function switchRole(role) {
    currentRole = role;
    const tabAdmin = document.getElementById('tabAdmin');
    if (role === 'admin') {
        tabAdmin.style.display = 'inline-flex';
    } else {
        tabAdmin.style.display = 'none';
        if (document.getElementById('tab-admin').classList.contains('active')) {
            showTab('instructions');
        }
    }
}

// Tabs
function showTab(tabId) {
    document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active');

    const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
}

// Exam Controls
function startExamination() {
    showTab('console');
    currentQIdx = 0;
    renderCurrentQuestion();
    renderQuestionPalette();
    startExamTimer();
}

function renderCurrentQuestion() {
    const q = EXAM_QUESTIONS[currentQIdx];
    document.getElementById('currentSectionName').textContent = `Section: ${q.section}`;
    document.getElementById('qNumberBadge').textContent = `Question ${currentQIdx + 1} of ${EXAM_QUESTIONS.length}`;
    document.getElementById('qTitleText').textContent = q.q;

    const optsContainer = document.getElementById('optionsGroupContainer');
    optsContainer.innerHTML = q.options.map((opt, i) => {
        const isSelected = (userAnswers[currentQIdx] === i);
        return `
            <div class="option-choice-box ${isSelected ? 'selected' : ''}" onclick="selectExamOption(${i})">
                <input type="radio" name="examOpt" ${isSelected ? 'checked' : ''} style="cursor:pointer; accent-color:var(--primary);">
                <span>${opt}</span>
            </div>
        `;
    }).join('');

    document.getElementById('btnPrevQ').disabled = (currentQIdx === 0);
    renderQuestionPalette();
}

function selectExamOption(optIdx) {
    userAnswers[currentQIdx] = optIdx;
    if (!visitedFlags.includes(currentQIdx)) visitedFlags.push(currentQIdx);
    renderCurrentQuestion();
}

function nextQuestion() {
    if (currentQIdx < EXAM_QUESTIONS.length - 1) {
        currentQIdx++;
        if (!visitedFlags.includes(currentQIdx)) visitedFlags.push(currentQIdx);
        renderCurrentQuestion();
    }
}

function prevQuestion() {
    if (currentQIdx > 0) {
        currentQIdx--;
        renderCurrentQuestion();
    }
}

function markForReview() {
    if (!reviewFlags.includes(currentQIdx)) {
        reviewFlags.push(currentQIdx);
    } else {
        reviewFlags = reviewFlags.filter(i => i !== currentQIdx);
    }
    renderQuestionPalette();
}

function clearResponse() {
    delete userAnswers[currentQIdx];
    renderCurrentQuestion();
}

function renderQuestionPalette() {
    const grid = document.getElementById('paletteGrid');
    if (!grid) return;

    let ansCount = 0;
    let revCount = 0;
    let unvCount = 0;

    grid.innerHTML = EXAM_QUESTIONS.map((q, idx) => {
        let statusClass = 'unvisited';
        const isAns = (userAnswers[idx] !== undefined);
        const isRev = reviewFlags.includes(idx);
        const isCur = (idx === currentQIdx);

        if (isRev) {
            statusClass = 'review';
            revCount++;
        } else if (isAns) {
            statusClass = 'answered';
            ansCount++;
        } else if (!visitedFlags.includes(idx)) {
            statusClass = 'unvisited';
            unvCount++;
        } else {
            statusClass = 'unvisited';
            unvCount++;
        }

        return `
            <button class="pal-btn ${statusClass} ${isCur ? 'current' : ''}" onclick="jumpToQuestion(${idx})">
                ${idx + 1}
            </button>
        `;
    }).join('');

    document.getElementById('statAnswered').textContent = ansCount;
    document.getElementById('statReview').textContent = revCount;
    document.getElementById('statUnvisited').textContent = unvCount;
}

function jumpToQuestion(idx) {
    currentQIdx = idx;
    if (!visitedFlags.includes(idx)) visitedFlags.push(idx);
    renderCurrentQuestion();
}

// Timer
function startExamTimer() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    const clock = document.getElementById('examClock');

    examTimerInterval = setInterval(() => {
        examTimeSecs--;
        const mins = Math.floor(examTimeSecs / 60);
        const secs = examTimeSecs % 60;
        clock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (examTimeSecs <= 0) {
            clearInterval(examTimerInterval);
            alert('⏰ Time Expired! The test is submitting automatically.');
            finalizeSubmission();
        }
    }, 1000);
}

function confirmSubmitExam() {
    const answeredCount = Object.keys(userAnswers).length;
    if (confirm(`You have answered ${answeredCount} of ${EXAM_QUESTIONS.length} questions. Are you sure you wish to finalize your submission?`)) {
        finalizeSubmission();
    }
}

function finalizeSubmission() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    examSubmitted = true;
    saveData();
    showTab('scorecard');
    calculateAndDisplayResults();
}

// Scoring & Evaluation
function calculateAndDisplayResults() {
    let rawScore = 0;
    const sections = {};

    EXAM_QUESTIONS.forEach((q, idx) => {
        const sName = q.section;
        if (!sections[sName]) sections[sName] = { total: 0, correct: 0 };
        sections[sName].total++;

        if (userAnswers[idx] === q.correct) {
            rawScore++;
            sections[sName].correct++;
        }
    });

    const pct = Math.round((rawScore / EXAM_QUESTIONS.length) * 100);
    const isPass = (rawScore >= cutoffScore);

    document.getElementById('finalScoreRaw').textContent = `${rawScore} / ${EXAM_QUESTIONS.length}`;
    document.getElementById('finalScorePct').textContent = `${pct}%`;

    const statusEl = document.getElementById('finalStatusDisplay');
    statusEl.textContent = isPass ? 'QUALIFIED FOR CORPORATE INTERVIEWS' : 'NEEDS IMPROVEMENT';
    statusEl.className = isPass ? 'status-pass' : 'status-fail';

    // Section Breakdown Table
    const tbody = document.getElementById('sectionBreakdownTable');
    if (tbody) {
        tbody.innerHTML = Object.keys(sections).map(sec => {
            const data = sections[sec];
            const acc = Math.round((data.correct / data.total) * 100);
            return `
                <tr>
                    <td><strong>${sec}</strong></td>
                    <td>${data.total}</td>
                    <td>${data.correct}</td>
                    <td><span style="color:${acc >= 60 ? '#10b981' : '#f59e0b'}; font-weight:600;">${acc}%</span></td>
                </tr>
            `;
        }).join('');
    }

    // Update candidate in merit list
    const candidateRecord = DEFAULT_COHORT_MERIT.find(c => c.regNo === '2026-CS-042');
    if (candidateRecord) {
        candidateRecord.score = rawScore;
        candidateRecord.percentile = pct >= 80 ? '89.2%' : '65.0%';
    }
    renderMeritList();
}

// Merit List
function renderMeritList() {
    const tbody = document.getElementById('meritTableBody');
    if (!tbody) return;

    const filter = document.getElementById('meritStatusFilter').value;
    const sorted = [...DEFAULT_COHORT_MERIT].sort((a, b) => b.score - a.score);

    const filtered = sorted.filter(c => {
        const isShortlisted = c.score >= cutoffScore;
        if (filter === 'Shortlisted') return isShortlisted;
        if (filter === 'Needs Improvement') return !isShortlisted;
        return true;
    });

    tbody.innerHTML = filtered.map((c, idx) => {
        const isShortlisted = c.score >= cutoffScore;
        return `
            <tr style="${c.regNo === '2026-CS-042' ? 'background:rgba(37,99,235,0.15);' : ''}">
                <td><strong>#${idx + 1}</strong></td>
                <td><code>${c.regNo}</code></td>
                <td>${c.name}</td>
                <td>${c.dept}</td>
                <td><strong>${c.score} / 10</strong></td>
                <td>${c.percentile}</td>
                <td>
                    <span class="badge" style="background:${isShortlisted ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${isShortlisted ? '#10b981' : '#ef4444'}; padding:3px 8px; border-radius:10px;">
                        ${isShortlisted ? 'Shortlisted' : 'Unqualified'}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function filterMeritList() {
    renderMeritList();
}

// Re-Evaluation Desk
function handleReevaluationSubmit(e) {
    e.preventDefault();
    const item = {
        id: 'REV-' + Math.floor(1000 + Math.random() * 9000),
        qChallenge: document.getElementById('reevalQSelect').value,
        type: document.getElementById('reevalType').value,
        reason: document.getElementById('reevalJustification').value.trim(),
        date: new Date().toLocaleDateString(),
        status: 'Under Technical Committee Review'
    };

    const reevals = labDB.get(STORAGE_PREFIX + 'reevals', []);
    reevals.unshift(item);
    labDB.set(STORAGE_PREFIX + 'reevals', reevals);

    renderReevalHistory();
    e.target.reset();
    alert(`✅ Re-Evaluation Petition #${item.id} registered! Examination controller response within 3 business days.`);
}

function renderReevalHistory() {
    const container = document.getElementById('reevalHistoryContainer');
    if (!container) return;

    const reevals = labDB.get(STORAGE_PREFIX + 'reevals', [
        { id: 'REV-1049', qChallenge: 'Question 3: Dijkstra Algorithm Complexity', type: 'Disputed Official Answer Key', date: '2026-10-04', status: 'Approved (+1 Mark Awarded)' }
    ]);

    container.innerHTML = reevals.map(r => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:8px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong style="color:var(--secondary); font-size:0.85rem;">#${r.id} - ${r.type}</strong>
                <span class="badge" style="background:rgba(245,158,11,0.2); color:#f59e0b; font-size:0.75rem; padding:2px 8px; border-radius:10px;">${r.status}</span>
            </div>
            <p style="font-size:0.88rem; margin-bottom:4px;">${r.qChallenge}</p>
            <small style="color:var(--text-muted);">${r.date}</small>
        </div>
    `).join('');
}

// Admin Panel
function updateCutoff() {
    const val = parseInt(document.getElementById('adminCutoffInput').value) || 6;
    cutoffScore = val;
    labDB.set(STORAGE_PREFIX + 'cutoff', cutoffScore);
    renderMeritList();
    if (examSubmitted) calculateAndDisplayResults();
    alert(`✅ Minimum qualifying cutoff updated to ${cutoffScore}/10!`);
}

function exportMeritCSV() {
    alert('📥 Exporting NCRT_2026_Corporate_Shortlist.csv containing student test percentiles and resume links.');
}
