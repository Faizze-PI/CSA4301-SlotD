// EduConnect - Online Teaching & Learning Platform Engine
const STORAGE_PREFIX = 'educonnect_';

// Default Seed Data
const DEFAULT_COURSES = [
    {
        id: 'C101',
        title: 'Distributed Systems & Cloud Architecture',
        code: 'CS401',
        category: 'Computer Science',
        instructor: 'Dr. Priya Nair',
        duration: '10 Weeks',
        fee: 0,
        enrolled: 420,
        rating: 4.9,
        description: 'Comprehensive study of distributed consensus, Raft/Paxos, event-driven architectures, and scalable microservices.'
    },
    {
        id: 'C102',
        title: 'Deep Learning & Large Language Models',
        code: 'AI504',
        category: 'Artificial Intelligence',
        instructor: 'Prof. Rajesh Khanna',
        duration: '12 Weeks',
        fee: 1499,
        enrolled: 310,
        rating: 4.8,
        description: 'Hands-on neural networks, backpropagation, transformer architectures, self-attention mechanisms, and fine-tuning.'
    },
    {
        id: 'C103',
        title: 'Modern Full-Stack Web Engineering',
        code: 'IT302',
        category: 'Computer Science',
        instructor: 'Er. S. Meenakshi',
        duration: '8 Weeks',
        fee: 0,
        enrolled: 580,
        rating: 4.7,
        description: 'Building reactive single-page applications, progressive web apps, secure RESTful APIs, and database transactions.'
    },
    {
        id: 'C104',
        title: 'Embedded IoT & Edge AI Systems',
        code: 'EC410',
        category: 'Electronics',
        instructor: 'Dr. K. Venkatesh',
        duration: '6 Weeks',
        fee: 999,
        enrolled: 180,
        rating: 4.6,
        description: 'Sensor interfacing, MQTT telemetry, microcontroller programming on ESP32, and quantized edge inferencing.'
    }
];

const DEFAULT_NOTES = [
    { id: 1, unit: 1, title: 'Unit 1: Distributed System Fundamentals & CAP Theorem', course: 'CS401', date: '2026-09-15', size: '2.8 MB' },
    { id: 2, unit: 2, title: 'Unit 2: RPC, Message Queues & RabbitMQ Implementations', course: 'CS401', date: '2026-09-22', size: '4.1 MB' },
    { id: 3, unit: 3, title: 'Unit 3: Consensus Protocols - Raft State Machine Breakdown', course: 'CS401', date: '2026-09-29', size: '5.2 MB' },
    { id: 4, unit: 1, title: 'Unit 1: Tensors, Matrix Calculus & PyTorch Foundations', course: 'AI504', date: '2026-09-18', size: '3.6 MB' },
    { id: 5, unit: 1, title: 'Unit 1: HTML5 Semantics, Flexbox, Grid & Responsive Layouts', course: 'IT302', date: '2026-09-10', size: '1.9 MB' }
];

const QUIZ_QUESTIONS = [
    {
        q: 'According to Brewer\'s CAP Theorem, which two properties can a distributed partition-tolerant system guarantee simultaneously?',
        options: ['Consistency and Availability', 'Consistency and Fault Tolerance', 'Partition Tolerance and Zero Latency', 'Availability and Speed'],
        correct: 0
    },
    {
        q: 'In the Raft consensus algorithm, which node role initiates heartbeat RPC messages to maintain authority?',
        options: ['Follower', 'Candidate', 'Leader', 'Observer'],
        correct: 2
    },
    {
        q: 'What is the primary role of an API Gateway in a microservices deployment?',
        options: ['Direct Database Storage', 'Request Routing, Rate Limiting & Auth', 'Code Compilation', 'DNS Server Management'],
        correct: 1
    },
    {
        q: 'Which HTTP status code signifies that a server encountered an idempotent condition or successfully completed a deletion without return body?',
        options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
        correct: 2
    },
    {
        q: 'Which attention mechanism allows transformers to process sequential tokens in parallel unlike recurrent neural networks?',
        options: ['Multi-Head Self-Attention', 'Convolutional Pooling', 'Gradient Accumulation', 'Stochastic Dropout'],
        correct: 0
    }
];

const DEFAULT_TIMETABLE = [
    { day: 'Monday', slots: [{ time: '09:00 - 10:30', course: 'CS401: Distributed Systems', prof: 'Dr. Priya Nair' }, { time: '11:00 - 12:30', course: 'AI504: Deep Learning', prof: 'Prof. Rajesh Khanna' }] },
    { day: 'Tuesday', slots: [{ time: '10:00 - 11:30', course: 'IT302: Web Engineering', prof: 'Er. S. Meenakshi' }, { time: '14:00 - 16:00', course: 'CS401: Distributed Lab Session', prof: 'Dr. Priya Nair' }] },
    { day: 'Wednesday', slots: [{ time: '09:00 - 10:30', course: 'EC410: IoT Edge Systems', prof: 'Dr. K. Venkatesh' }, { time: '11:00 - 12:30', course: 'CS401: Cloud Architecture', prof: 'Dr. Priya Nair' }] },
    { day: 'Thursday', slots: [{ time: '10:00 - 11:30', course: 'AI504: Transformers Lab', prof: 'Prof. Rajesh Khanna' }, { time: '14:00 - 15:30', course: 'IT302: Full-Stack Project', prof: 'Er. S. Meenakshi' }] },
    { day: 'Friday', slots: [{ time: '09:00 - 11:00', course: 'Assessment & Doubt Clearing', prof: 'All Department Faculty' }] }
];

// App State
let currentRole = 'student';
let courses = [];
let notes = [];
let enrolledCourseIds = ['C101', 'C103'];
let userQuizAnswers = {};
let currentQuizIdx = 0;
let quizTimerSecs = 600;
let quizTimerInterval = null;
let isMicMuted = false;
let isCamOff = false;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderCourses();
    renderNotes();
    renderTimetable();
    renderMyLearning();
    populateInstructorCourseDropdown();
    renderAttendees();
    renderTickets();
    initQuiz();
});

function loadData() {
    courses = labDB.get(STORAGE_PREFIX + 'courses', DEFAULT_COURSES);
    notes = labDB.get(STORAGE_PREFIX + 'notes', DEFAULT_NOTES);
    enrolledCourseIds = labDB.get(STORAGE_PREFIX + 'enrolled', ['C101', 'C103']);
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'courses', courses);
    labDB.set(STORAGE_PREFIX + 'notes', notes);
    labDB.set(STORAGE_PREFIX + 'enrolled', enrolledCourseIds);
}

// Role Switcher
function switchRole(role) {
    currentRole = role;
    const userPill = document.getElementById('currentUserName');
    const tabInstructor = document.getElementById('tabInstructor');
    const tabMyLearning = document.getElementById('tabMyLearning');

    if (role === 'student') {
        userPill.textContent = 'Alex Kumar (Student)';
        tabInstructor.style.display = 'none';
        tabMyLearning.style.display = 'inline-flex';
    } else if (role === 'teacher') {
        userPill.textContent = 'Dr. Priya Nair (Instructor)';
        tabInstructor.style.display = 'inline-flex';
        tabMyLearning.style.display = 'inline-flex';
    } else {
        userPill.textContent = 'Academic Office (Administrator)';
        tabInstructor.style.display = 'inline-flex';
        tabMyLearning.style.display = 'inline-flex';
    }
}

// Navigation Tabs
function showTab(tabId) {
    document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.classList.add('active');

    const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
}

// Course Catalog
function renderCourses(list = courses) {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;

    grid.innerHTML = list.map(c => {
        const isEnrolled = enrolledCourseIds.includes(c.id);
        return `
            <div class="course-card">
                <div class="course-banner">
                    <span class="course-badge"><i class="fas fa-tag"></i> ${c.category}</span>
                    <i class="fas fa-laptop-code fa-3x" style="color: rgba(255,255,255,0.4)"></i>
                </div>
                <div class="course-body">
                    <span class="course-code">${c.code}</span>
                    <h3 class="course-title">${c.title}</h3>
                    <p class="course-desc">${c.description}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-chalkboard-teacher"></i> ${c.instructor}</span>
                        <span><i class="fas fa-star" style="color:#f59e0b"></i> ${c.rating} (${c.enrolled})</span>
                    </div>
                    <div class="course-footer">
                        <span class="course-price">${c.fee === 0 ? 'FREE' : '₹' + c.fee}</span>
                        ${isEnrolled 
                            ? `<button class="btn btn-secondary btn-sm" onclick="showTab('classroom')"><i class="fas fa-play"></i> Go to Class</button>`
                            : `<button class="btn btn-primary btn-sm" onclick="enrollCourse('${c.id}')"><i class="fas fa-user-plus"></i> Enroll Now</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterCourses() {
    const query = document.getElementById('catalogSearch').value.toLowerCase();
    const cat = document.getElementById('categoryFilter').value;

    const filtered = courses.filter(c => {
        const matchesQuery = c.title.toLowerCase().includes(query) || 
                             c.code.toLowerCase().includes(query) || 
                             c.instructor.toLowerCase().includes(query);
        const matchesCat = (cat === 'All') || (c.category === cat);
        return matchesQuery && matchesCat;
    });

    renderCourses(filtered);
}

function enrollCourse(courseId) {
    if (!enrolledCourseIds.includes(courseId)) {
        enrolledCourseIds.push(courseId);
        saveData();
        renderCourses();
        renderMyLearning();
        alert('🎉 Congratulations! You have successfully enrolled in this course.');
    }
}

// Classroom & Live Video Deck
function toggleMute() {
    isMicMuted = !isMicMuted;
    const micIcon = document.getElementById('micIcon');
    if (isMicMuted) {
        micIcon.className = 'fas fa-microphone-slash';
        alert('Microphone muted');
    } else {
        micIcon.className = 'fas fa-microphone';
        alert('Microphone unmuted');
    }
}

function toggleCam() {
    isCamOff = !isCamOff;
    const camIcon = document.getElementById('camIcon');
    if (isCamOff) {
        camIcon.className = 'fas fa-video-slash';
        alert('Camera turned off');
    } else {
        camIcon.className = 'fas fa-video';
        alert('Camera active');
    }
}

function raiseHand() {
    alert('✋ Hand raised! The instructor has been notified that you wish to speak.');
    addChatMessage('System', '✋ Alex Kumar raised their hand.');
}

function toggleWhiteboard() {
    alert('🎨 Interactive Whiteboard opened in side overlay. You can view professor diagrams in real time.');
}

function leaveSession() {
    if (confirm('Are you sure you want to exit the live classroom session?')) {
        showTab('catalog');
    }
}

function downloadLectureDeck() {
    alert('📥 Downloading CS401_Lecture_Consensus_Algorithms.pdf (5.2 MB)...');
}

function switchLecture(lectureNum) {
    document.querySelectorAll('.recording-chips .chip').forEach((c, idx) => {
        if (idx + 1 === lectureNum) c.classList.add('active');
        else c.classList.remove('active');
    });

    const titles = [
        'Lec 01: Distributed Foundations & Fallacies of Networking',
        'Lec 02: RESTful Microservices & GraphQL Gateway Aggregations',
        'Lec 03: Distributed Key-Value Stores & Dynamo Partitioning',
        'Lec 04: Raft State Consensus & Paxos Proof-of-Concept'
    ];

    document.getElementById('activeClassTitle').textContent = titles[lectureNum - 1];
    document.getElementById('currentLectureTitle').textContent = titles[lectureNum - 1];
}

function switchSideTab(tab) {
    document.querySelectorAll('.side-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-pane').forEach(p => p.classList.remove('active'));

    if (tab === 'chat') {
        document.querySelectorAll('.side-tab')[0].classList.add('active');
        document.getElementById('sideContentChat').classList.add('active');
    } else {
        document.querySelectorAll('.side-tab')[1].classList.add('active');
        document.getElementById('sideContentAttendees').classList.add('active');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    addChatMessage('Alex Kumar (You)', msg);
    input.value = '';

    // Simulated instructor reply
    setTimeout(() => {
        if (msg.toLowerCase().includes('doubt') || msg.toLowerCase().includes('question') || msg.toLowerCase().includes('why')) {
            addChatMessage('Dr. Priya Nair', 'Great question! Let\'s analyze that in the upcoming slide.');
        }
    }, 1200);
}

function addChatMessage(sender, text) {
    const chatBox = document.getElementById('chatBox');
    const msgDiv = document.createElement('div');
    msgDiv.className = sender.includes('Dr.') ? 'chat-msg teacher' : (sender === 'System' ? 'chat-msg system' : 'chat-msg');
    msgDiv.innerHTML = `
        <span class="chat-sender">${sender}:</span>
        <p>${text}</p>
    `;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function renderAttendees() {
    const list = document.getElementById('attendeeList');
    const names = [
        { name: 'Dr. Priya Nair (Host)', role: 'Instructor' },
        { name: 'Alex Kumar (You)', role: 'Student' },
        { name: 'Karthik Ramanathan', role: 'Student' },
        { name: 'Sneha Venkatesh', role: 'Student' },
        { name: 'Ananya Sharma', role: 'Student' },
        { name: 'Divya Prakash', role: 'Student' },
        { name: 'Rahul Varma', role: 'Student' }
    ];

    list.innerHTML = names.map(a => `
        <li class="attendee-item">
            <span><i class="fas fa-user-circle"></i> ${a.name}</span>
            <span class="badge" style="background:rgba(255,255,255,0.08); font-size:0.75rem">${a.role}</span>
        </li>
    `).join('');
}

// Study Notes
function renderNotes() {
    const tbody = document.getElementById('notesTableBody');
    if (!tbody) return;

    tbody.innerHTML = notes.map(n => `
        <tr>
            <td><strong>Unit ${n.unit}</strong></td>
            <td><i class="fas fa-file-pdf" style="color:#ef4444; margin-right:6px"></i> ${n.title}</td>
            <td><span class="badge" style="background:rgba(79,70,229,0.2); color:#818cf8">${n.course}</span></td>
            <td>${n.date}</td>
            <td>${n.size}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="downloadNote('${n.title}')"><i class="fas fa-download"></i> Download</button>
            </td>
        </tr>
    `).join('');
}

function downloadNote(title) {
    alert(`📥 Downloading academic material: "${title}" in PDF format.`);
}

// Quizzes
function initQuiz() {
    currentQuizIdx = 0;
    userQuizAnswers = {};
    renderQuizQuestion();
    startQuizTimer();
}

function renderQuizQuestion() {
    const q = QUIZ_QUESTIONS[currentQuizIdx];
    document.getElementById('quizCounter').textContent = `Question ${currentQuizIdx + 1} of ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quizQuestionText').textContent = `${currentQuizIdx + 1}. ${q.q}`;

    const optsContainer = document.getElementById('quizOptionsContainer');
    optsContainer.innerHTML = q.options.map((opt, i) => {
        const isSelected = userQuizAnswers[currentQuizIdx] === i;
        return `
            <div class="quiz-opt ${isSelected ? 'selected' : ''}" onclick="selectQuizOption(${i})">
                <input type="radio" name="quizOpt" ${isSelected ? 'checked' : ''} style="cursor:pointer">
                <span>${opt}</span>
            </div>
        `;
    }).join('');

    document.getElementById('btnPrevQuiz').disabled = (currentQuizIdx === 0);

    if (currentQuizIdx === QUIZ_QUESTIONS.length - 1) {
        document.getElementById('btnNextQuiz').style.display = 'none';
        document.getElementById('btnSubmitQuiz').style.display = 'inline-flex';
    } else {
        document.getElementById('btnNextQuiz').style.display = 'inline-flex';
        document.getElementById('btnSubmitQuiz').style.display = 'none';
    }
}

function selectQuizOption(idx) {
    userQuizAnswers[currentQuizIdx] = idx;
    renderQuizQuestion();
}

function nextQuestion() {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
        currentQuizIdx++;
        renderQuizQuestion();
    }
}

function prevQuestion() {
    if (currentQuizIdx > 0) {
        currentQuizIdx--;
        renderQuizQuestion();
    }
}

function startQuizTimer() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizTimerSecs = 600;
    const timerEl = document.getElementById('quizTimer');

    quizTimerInterval = setInterval(() => {
        quizTimerSecs--;
        const mins = Math.floor(quizTimerSecs / 60);
        const secs = quizTimerSecs % 60;
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (quizTimerSecs <= 0) {
            clearInterval(quizTimerInterval);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);

    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
        if (userQuizAnswers[idx] === q.correct) score++;
    });

    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('quizResultModal').style.display = 'block';
    document.getElementById('quizScoreSummary').textContent = `You scored ${score} out of ${QUIZ_QUESTIONS.length} (${pct}%)`;

    document.getElementById('quizScoreBreakdown').innerHTML = `
        <div style="margin: 16px 0; color: #94a3b8; font-size: 0.9rem;">
            ${pct >= 60 ? '✅ Status: Passed (Certificate of Achievement Eligible)' : '❌ Status: Needs Improvement. Minimum 60% required to pass.'}
        </div>
    `;

    // Save student assessment score
    labDB.set(STORAGE_PREFIX + 'lastQuizScore', { score, total: QUIZ_QUESTIONS.length, pct, date: new Date().toLocaleDateString() });
    renderMyLearning();
}

function restartQuiz() {
    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('quizResultModal').style.display = 'none';
    initQuiz();
}

// Timetable
function renderTimetable() {
    const grid = document.getElementById('timetableGrid');
    if (!grid) return;

    grid.innerHTML = DEFAULT_TIMETABLE.map(d => `
        <div class="timetable-day-card">
            <div class="day-header"><i class="fas fa-calendar-day"></i> ${d.day}</div>
            <div class="day-slots">
                ${d.slots.map(s => `
                    <div class="slot-item">
                        <div class="slot-time"><i class="fas fa-clock"></i> ${s.time}</div>
                        <div class="slot-subject">${s.course}</div>
                        <div class="slot-prof">${s.prof}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// My Learning
function renderMyLearning() {
    const list = document.getElementById('enrolledCoursesList');
    if (!list) return;

    document.getElementById('statEnrolledCount').textContent = enrolledCourseIds.length;
    const enrolledObjs = courses.filter(c => enrolledCourseIds.includes(c.id));

    list.innerHTML = enrolledObjs.map(c => `
        <div class="course-card" style="margin-bottom: 16px;">
            <div class="course-body">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <span class="course-code">${c.code}</span>
                        <h3 class="course-title">${c.title}</h3>
                        <p class="text-muted"><i class="fas fa-user-tie"></i> ${c.instructor}</p>
                    </div>
                    <span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; padding:6px 12px; border-radius:20px;">Active</span>
                </div>
                <div style="margin: 16px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                        <span>Course Progress</span>
                        <span>75%</span>
                    </div>
                    <div style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                        <div style="width:75%; height:100%; background:var(--primary);"></div>
                    </div>
                </div>
                <div style="display:flex; gap:12px;">
                    <button class="btn btn-primary btn-sm" onclick="showTab('classroom')"><i class="fas fa-play"></i> Resume Classroom</button>
                    <button class="btn btn-secondary btn-sm" onclick="downloadCertificate('${c.title}')"><i class="fas fa-award"></i> Certificate</button>
                </div>
            </div>
        </div>
    `).join('');
}

function downloadCertificate(courseTitle) {
    alert(`🎓 Generating Verified Certificate of Completion for "${courseTitle}". Issued by EduConnect Academic Registrar.`);
}

// Instructor Studio
function populateInstructorCourseDropdown() {
    const sel = document.getElementById('notesCourseSelect');
    if (!sel) return;
    sel.innerHTML = courses.map(c => `<option value="${c.code}">${c.code} - ${c.title}</option>`).join('');
}

function handleCreateCourse(e) {
    e.preventDefault();
    const newC = {
        id: 'C' + (courses.length + 101),
        title: document.getElementById('newCourseTitle').value.trim(),
        code: document.getElementById('newCourseCode').value.trim(),
        category: document.getElementById('newCourseCategory').value,
        duration: document.getElementById('newCourseDuration').value + ' Weeks',
        fee: parseInt(document.getElementById('newCourseFee').value) || 0,
        description: document.getElementById('newCourseDesc').value.trim(),
        instructor: 'Dr. Priya Nair',
        enrolled: 1,
        rating: 5.0
    };

    courses.push(newC);
    saveData();
    renderCourses();
    populateInstructorCourseDropdown();
    e.target.reset();
    alert('✅ Course published successfully to EduConnect catalog!');
}

function handleUploadNotes(e) {
    e.preventDefault();
    const newNote = {
        id: notes.length + 1,
        course: document.getElementById('notesCourseSelect').value,
        title: document.getElementById('notesTitle').value.trim(),
        unit: parseInt(document.getElementById('notesUnit').value) || 1,
        size: document.getElementById('notesSize').value.trim(),
        date: new Date().toISOString().split('T')[0]
    };

    notes.push(newNote);
    saveData();
    renderNotes();
    e.target.reset();
    alert('✅ Notes uploaded and linked to syllabus units!');
}

// Support Desk
function handleCreateTicket(e) {
    e.preventDefault();
    const tickets = labDB.get(STORAGE_PREFIX + 'tickets', []);
    const newTicket = {
        id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
        subject: document.getElementById('ticketSubject').value.trim(),
        category: document.getElementById('ticketCategory').value,
        details: document.getElementById('ticketBody').value.trim(),
        status: 'Open',
        date: new Date().toLocaleDateString()
    };

    tickets.unshift(newTicket);
    labDB.set(STORAGE_PREFIX + 'tickets', tickets);
    renderTickets();
    e.target.reset();
    alert(`✅ Support ticket #${newTicket.id} registered! Academic advisors will respond shortly.`);
}

function renderTickets() {
    const container = document.getElementById('ticketsListContainer');
    if (!container) return;
    const tickets = labDB.get(STORAGE_PREFIX + 'tickets', [
        { id: 'TKT-1084', subject: 'Lab 4 Raft Consensus simulation notes missing', category: 'Academic Inquiry', status: 'Resolved', date: '2026-10-02' },
        { id: 'TKT-2041', subject: 'Webcam permissions error in Chrome on macOS', category: 'Technical Issue', status: 'Closed', date: '2026-09-28' }
    ]);

    container.innerHTML = tickets.map(t => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:12px; border-radius:8px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="font-weight:600; color:var(--secondary); font-size:0.85rem;">#${t.id} - ${t.category}</span>
                <span class="badge" style="background:${t.status === 'Resolved' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color:${t.status === 'Resolved' ? '#10b981' : '#f59e0b'}; font-size:0.75rem; padding:2px 8px; border-radius:10px;">${t.status}</span>
            </div>
            <p style="font-size:0.9rem; margin-bottom:6px;">${t.subject}</p>
            <small style="color:var(--text-muted);">${t.date}</small>
        </div>
    `).join('');
}
