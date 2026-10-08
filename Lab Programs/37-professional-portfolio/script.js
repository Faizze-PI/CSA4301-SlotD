// MyProfessionalShowcase Portfolio Engine
const STORAGE_PREFIX = 'portfolio_';

const DEFAULT_PROJECTS = [
    {
        id: 'P101',
        title: 'Chronos: Distributed Raft Key-Value Store',
        category: 'Distributed',
        stack: ['Go', 'Raft Consensus', 'gRPC', 'RocksDB', 'Docker'],
        desc: 'A linearizable, partition-tolerant key-value store implementing the Raft state machine replication protocol with automatic snapshotting and log compaction.',
        metrics: 'Benchmarked at 85,000 writes/sec with sub-5ms commit latency across 5 geographically distributed nodes.',
        demoUrl: 'https://demo.chronos-kv.internal'
    },
    {
        id: 'P102',
        title: 'PulseStream: Real-Time Collaborative Canvas',
        category: 'Full-Stack',
        stack: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'Canvas API'],
        desc: 'Zero-latency vector drawing canvas supporting simultaneous multi-cursor editing, differential operational transforms, and peer-to-peer audio broadcasting.',
        metrics: 'Sustains 500 simultaneous active editors per canvas room with under 15ms broadcast propagation.',
        demoUrl: 'https://demo.pulsestream.internal'
    },
    {
        id: 'P103',
        title: 'CloudGuard: Zero-Trust Service Mesh Controller',
        category: 'Cloud',
        stack: ['Kubernetes', 'Envoy Proxy', 'mTLS', 'eBPF', 'Prometheus'],
        desc: 'Automated policy enforcement agent that intercepts microservice network packets, validates cryptographic SPIFFE IDs, and blocks lateral unauthorized queries.',
        metrics: 'Reduced security perimeter breach surface by 99% while adding less than 1.2ms network egress overhead.',
        demoUrl: 'https://demo.cloudguard.internal'
    },
    {
        id: 'P104',
        title: 'NexusCommerce: Headless Microservices Platform',
        category: 'Full-Stack',
        stack: ['Next.js', 'PostgreSQL', 'Redis', 'Kafka', 'TailwindCSS'],
        desc: 'Enterprise headless retail infrastructure with asynchronous inventory saga pattern orchestration, stripe checkout webhooks, and elastic search indexing.',
        metrics: 'Processes 25,000 checkout transactions per minute with guaranteed exactly-once processing semantics.',
        demoUrl: 'https://demo.nexuscommerce.internal'
    }
];

const DEFAULT_BLOGS = [
    {
        id: 1,
        title: 'Designing Fault-Tolerant Consensus: Raft vs. Paxos in Production',
        date: 'October 1, 2026',
        readTime: '8 min read',
        summary: 'A deep comparative analysis of leader election edge cases, split-vote recovery strategies, and disk fsync bottlenecks under heavy network partition strain.'
    },
    {
        id: 2,
        title: 'Mitigating WebSocket Socket Desynchronization at Scale',
        date: 'September 20, 2026',
        readTime: '6 min read',
        summary: 'How we restructured Redis pub/sub backplanes to maintain zero message drops and sub-20ms broadcast fanout during sudden 100k client reconnect bursts.'
    },
    {
        id: 3,
        title: 'The Evolution of Cloud Compute: From Containers to WebAssembly Workers',
        date: 'September 5, 2026',
        readTime: '10 min read',
        summary: 'Why WebAssembly sandboxing at the CDN edge provides 100x faster startup times than Docker containers for stateless micro-functions.'
    }
];

// App State
let projects = [];
let activeFilter = 'All';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderProjects();
    renderBlogs();
});

function loadData() {
    projects = labDB.get(STORAGE_PREFIX + 'projects', DEFAULT_PROJECTS);
}

function saveData() {
    labDB.set(STORAGE_PREFIX + 'projects', projects);
}

// Role Switcher
function switchRole(role) {
    const tabAdmin = document.getElementById('tabAdmin');
    if (role === 'owner') {
        tabAdmin.style.display = 'inline-flex';
    } else {
        tabAdmin.style.display = 'none';
        if (document.getElementById('tab-admin').classList.contains('active')) {
            showTab('home');
        }
    }
}

// Navigation Tabs
function showTab(tabId) {
    document.querySelectorAll('.content-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.add('active');

    const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
}

// Projects
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const filtered = (activeFilter === 'All') 
        ? projects 
        : projects.filter(p => p.category === activeFilter);

    grid.innerHTML = filtered.map(p => `
        <div class="proj-card">
            <div class="proj-header">
                <i class="fas ${getProjectIcon(p.category)} fa-3x" style="color:rgba(255,255,255,0.4)"></i>
            </div>
            <div class="proj-body">
                <span class="proj-category">${p.category}</span>
                <h3 class="proj-title">${p.title}</h3>
                <p class="proj-desc">${p.desc}</p>
                <div class="proj-stack-tags">
                    ${p.stack.map(s => `<span class="stack-tag">${s}</span>`).join('')}
                </div>
                <div class="proj-actions">
                    <button class="btn btn-primary btn-sm" onclick="openProjModal('${p.id}')"><i class="fas fa-play"></i> Live Demo</button>
                    <button class="btn btn-secondary btn-sm" onclick="inspectCode('${p.id}')"><i class="fab fa-github"></i> Source Code</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getProjectIcon(cat) {
    if (cat === 'Distributed') return 'fa-network-wired';
    if (cat === 'Full-Stack') return 'fa-laptop-code';
    return 'fa-cloud';
}

function filterProjects(cat, btn) {
    activeFilter = cat;
    document.querySelectorAll('.project-filters .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects();
}

// Project Modal
function openProjModal(projId) {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;

    const modal = document.getElementById('projModal');
    const content = document.getElementById('modalProjContent');

    content.innerHTML = `
        <span class="badge" style="background:rgba(99,102,241,0.2); color:#818cf8; padding:4px 10px; border-radius:12px; font-size:0.75rem;">${proj.category}</span>
        <h2 style="margin: 10px 0 6px 0; font-size:1.4rem;">${proj.title}</h2>
        <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.6; margin-bottom:16px;">${proj.desc}</p>

        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:8px; margin-bottom:16px;">
            <h4 style="color:var(--secondary); font-size:0.9rem; margin-bottom:4px;"><i class="fas fa-tachometer-alt"></i> Benchmark Metrics & Verified Impact:</h4>
            <p style="font-size:0.88rem; color:#cbd5e1;">${proj.metrics}</p>
        </div>

        <div style="margin-bottom:20px;">
            <h4 style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;">TECHNOLOGY DEPLOYMENT:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
                ${proj.stack.map(s => `<span class="stack-tag" style="padding:4px 10px; font-size:0.8rem;">${s}</span>`).join('')}
            </div>
        </div>

        <div style="background:#090d16; border:1px solid var(--border-color); border-radius:8px; padding:16px; font-family:monospace; font-size:0.8rem; color:#38bdf8; margin-bottom:20px;">
            $ curl -X GET ${proj.demoUrl}/healthz<br>
            HTTP/2 200 OK<br>
            {"status":"HEALTHY", "active_nodes": 5, "consensus_term": 142, "p99_latency_ms": 3.4}
        </div>

        <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" onclick="alert('🚀 Launching simulated production sandbox for ${proj.title}...')"><i class="fas fa-external-link-alt"></i> Open Sandbox</button>
            <button class="btn btn-secondary" onclick="closeProjModal()"><i class="fas fa-times"></i> Close</button>
        </div>
    `;

    modal.classList.add('active');
}

function closeProjModal() {
    document.getElementById('projModal').classList.remove('active');
}

function inspectCode(projId) {
    const proj = projects.find(p => p.id === projId);
    alert(`📦 Navigating to GitHub repository: github.com/alex-kumar/${proj ? proj.id.toLowerCase() : 'repo'}\nMIT Licensed Open Source Architecture.`);
}

// Resume
function downloadResume() {
    window.print();
}

// Blog
function renderBlogs() {
    const grid = document.getElementById('portfolioBlogGrid');
    if (!grid) return;

    grid.innerHTML = DEFAULT_BLOGS.map(b => `
        <div class="blog-card">
            <small><i class="fas fa-calendar-alt"></i> ${b.date} • ${b.readTime}</small>
            <h3>${b.title}</h3>
            <p>${b.summary}</p>
            <button class="btn btn-secondary btn-sm" onclick="alert('📖 Opening technical essay: ${b.title}')">Read Full Article <i class="fas fa-arrow-right"></i></button>
        </div>
    `).join('');
}

// Contact
function handleInquirySubmit(e) {
    e.preventDefault();
    const inq = {
        name: document.getElementById('inqName').value.trim(),
        email: document.getElementById('inqEmail').value.trim(),
        type: document.getElementById('inqType').value,
        msg: document.getElementById('inqMsg').value.trim(),
        date: new Date().toLocaleDateString()
    };

    const inquiries = labDB.get(STORAGE_PREFIX + 'inquiries', []);
    inquiries.unshift(inq);
    labDB.set(STORAGE_PREFIX + 'inquiries', inquiries);

    alert(`🎉 Thank you, ${inq.name}! Your message regarding "${inq.type}" has been received. I will review it and reply via ${inq.email} within 24 hours.`);
    e.target.reset();
}

// CMS Studio (Owner Mode)
function handleCreatePortfolioProject(e) {
    e.preventDefault();
    const stackStr = document.getElementById('newProjStack').value.trim();
    const stackArr = stackStr.split(',').map(s => s.trim()).filter(Boolean);

    const newP = {
        id: 'P' + (projects.length + 101),
        title: document.getElementById('newProjTitle').value.trim(),
        category: document.getElementById('newProjCategory').value,
        desc: document.getElementById('newProjDesc').value.trim(),
        stack: stackArr,
        metrics: 'Successfully launched to production with automated continuous deployment.',
        demoUrl: document.getElementById('newProjUrl').value.trim()
    };

    projects.push(newP);
    saveData();
    renderProjects();
    e.target.reset();
    alert(`✅ Project "${newP.title}" added to your live showcase portfolio!`);
}
