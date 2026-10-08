/**
 * Experiment 11: Home Finder Real Estate Platform
 * Saved Buyer Criteria, Mortgage EMI Calculator, Viewing Scheduler & Visitor Audit
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Properties Seed
  const defaultProperties = [
    {
      id: 'p1',
      title: 'Prestige Waterfront 3BHK Luxury Residence',
      location: 'OMR, Chennai',
      type: 'Residential Apartment',
      price: 8800000,
      area: 1720,
      amenities: 'Lake view, Clubhouse, Covered Car Park, EV Charging',
      agent: 'Vikram Sethi (Prestige Realty)'
    },
    {
      id: 'p2',
      title: 'Emerald Palms Independent Duplex Villa',
      location: 'Adyar, Chennai',
      type: 'Independent Villa',
      price: 24500000,
      area: 3200,
      amenities: 'Private Garden, Solar Roof, 24/7 Security, Home Theatre',
      agent: 'Vikram Sethi (Prestige Realty)'
    },
    {
      id: 'p3',
      title: 'TechHub Executive Commercial Suite',
      location: 'Whitefield, Bangalore',
      type: 'Commercial Office',
      price: 14500000,
      area: 2100,
      amenities: 'Fiber Internet, Central AC, 100% Power Backup, Cafeteria',
      agent: 'Siddharth Rao (UrbanSpaces Ltd)'
    },
    {
      id: 'p4',
      title: 'Green Acres Residential Villa Plot',
      location: 'Koramangala, Bangalore',
      type: 'Residential Plot / Land',
      price: 4800000,
      area: 2400,
      amenities: 'Gated Layout, Blacktop Roads, Underground Drainage',
      agent: 'Siddharth Rao (UrbanSpaces Ltd)'
    }
  ];

  // Saved Search Criteria Seed (Required specifically in doc)
  const defaultCriteria = [
    { id: 'sc1', name: 'Chennai Luxury 3BHKs', location: 'OMR, Chennai', type: 'Residential Apartment', budget: '50to100' },
    { id: 'sc2', name: 'Bangalore Commercial Offices', location: 'Whitefield, Bangalore', type: 'Commercial Office', budget: 'above100' }
  ];

  // Scheduled Viewings Seed
  const defaultViewings = [
    {
      id: 'VISIT-401',
      propId: 'p1',
      propTitle: 'Prestige Waterfront 3BHK Luxury Residence',
      location: 'OMR, Chennai',
      agent: 'Vikram Sethi',
      date: '2026-10-14',
      slot: '02:30 PM - 04:00 PM',
      visitorName: 'Faizze A.',
      status: 'Confirmed'
    }
  ];

  // Certified Agents Seed
  const defaultAgents = [
    { name: 'Vikram Sethi', agency: 'Prestige Elite Properties', rating: 4.9, activeListings: 12, phone: '+91 98400 12345' },
    { name: 'Siddharth Rao', agency: 'UrbanSpaces Bangalore', rating: 4.8, activeListings: 9, phone: '+91 98800 54321' },
    { name: 'Pooja Hegde', agency: 'Capital Horizon Realty', rating: 4.9, activeListings: 15, phone: '+91 99400 67890' }
  ];

  // Visitor Tracking Logs Seed
  const defaultVisitorLogs = [
    { session: 'SESS-8291', client: 'Faizze A.', ipBrowser: '192.168.1.42 (Chrome on Windows 11)', viewed: 'Prestige Waterfront 3BHK', time: '2026-10-06 12:45 PM' }
  ];

  db.seedIfEmpty('re_properties', defaultProperties);
  db.seedIfEmpty('re_criteria', defaultCriteria);
  db.seedIfEmpty('re_viewings', defaultViewings);
  db.seedIfEmpty('re_agents', defaultAgents);
  db.seedIfEmpty('re_visitors', defaultVisitorLogs);

  // Role Switcher
  const roleSelect = document.getElementById('reRoleSelect');
  const buyerView = document.getElementById('reBuyerView');
  const agentView = document.getElementById('reAgentView');
  const adminView = document.getElementById('reAdminView');

  roleSelect.addEventListener('change', (e) => {
    buyerView.style.display = 'none';
    agentView.style.display = 'none';
    adminView.style.display = 'none';

    if (e.target.value === 'admin') {
      adminView.style.display = 'block';
      renderVisitorLogs();
    } else if (e.target.value === 'agent') {
      agentView.style.display = 'block';
    } else {
      buyerView.style.display = 'block';
      renderProperties();
      renderSavedCriteria();
      renderScheduledViewings();
      renderAgents();
      calculateMortgageEmi();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      document.querySelectorAll('#reBuyerView .tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- BUYER PROPERTY SEARCH ---
  function renderProperties() {
    const loc = document.getElementById('propLocationFilter').value;
    const type = document.getElementById('propTypeFilter').value;
    const budget = document.getElementById('propBudgetFilter').value;

    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';

    const list = db.get('re_properties').filter(p => {
      const matchLoc = loc === 'all' || p.location === loc;
      const matchType = type === 'all' || p.type === type;

      let matchBudget = true;
      if (budget === 'under50') matchBudget = p.price < 5000000;
      if (budget === '50to100') matchBudget = p.price >= 5000000 && p.price <= 10000000;
      if (budget === 'above100') matchBudget = p.price > 10000000;

      return matchLoc && matchType && matchBudget;
    });

    if (list.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No properties found for selected filters.</p>';
      return;
    }

    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <div>
          <span class="badge badge-primary">${p.type}</span>
          <h3 style="font-size: 1.15rem; margin: 0.5rem 0 0.25rem 0;">${p.title}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">📍 ${p.location}</p>
          <p style="font-size: 0.85rem; margin: 0.35rem 0 0 0;">Area: <strong>${p.area} sq.ft</strong></p>
          <small style="color: #475569; display: block; margin-top: 0.25rem;">Amenities: ${p.amenities}</small>
        </div>
        <div style="margin-top: 1rem;">
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">₹${(p.price / 100000).toFixed(2)} Lakhs</div>
          <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="openViewingModal('${p.id}')">📅 Schedule Site Visit</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.getElementById('propLocationFilter').addEventListener('change', renderProperties);
  document.getElementById('propTypeFilter').addEventListener('change', renderProperties);
  document.getElementById('propBudgetFilter').addEventListener('change', renderProperties);

  // Save Active Criteria
  window.saveActiveSearchCriteria = () => {
    const loc = document.getElementById('propLocationFilter').value;
    const type = document.getElementById('propTypeFilter').value;
    const budget = document.getElementById('propBudgetFilter').value;

    const name = prompt('Enter a label for this saved search preset:', `${loc} - ${type}`);
    if (!name) return;

    db.insert('re_criteria', { name, location: loc, type, budget });
    alert('Search criteria preset saved! You can reload it anytime under "Saved Criteria".');
    renderSavedCriteria();
  };

  function renderSavedCriteria() {
    const list = document.getElementById('savedCriteriaList');
    list.innerHTML = '';
    const criteria = db.get('re_criteria');

    criteria.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '0.85rem';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0; color: var(--primary);">${c.name}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
              Location: <strong>${c.location}</strong> | Type: <strong>${c.type}</strong> | Budget: <strong>${c.budget}</strong>
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="applySavedCriteria('${c.id}')">Apply Preset</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  window.applySavedCriteria = (id) => {
    const c = db.findById('re_criteria', id);
    if (!c) return;

    document.getElementById('propLocationFilter').value = c.location;
    document.getElementById('propTypeFilter').value = c.type;
    document.getElementById('propBudgetFilter').value = c.budget;

    document.querySelector('.tab-btn[data-tab="propertySearchTab"]').click();
    renderProperties();
    alert(`Applied preset: ${c.name}`);
  };

  // --- MORTGAGE & EMI CALCULATOR ---
  function calculateMortgageEmi() {
    const P = parseFloat(document.getElementById('loanPrincipal').value) || 0;
    const annualRate = parseFloat(document.getElementById('loanRate').value) || 0;
    const years = parseFloat(document.getElementById('loanTenure').value) || 0;

    const r = (annualRate / 12) / 100; // Monthly interest rate
    const n = years * 12; // Total installments

    if (P <= 0 || r <= 0 || n <= 0) return;

    // Standard EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    document.getElementById('calcEmiDisplay').innerText = `₹${Math.round(emi).toLocaleString()} / mo`;
    document.getElementById('calcTotalInterestDisplay').innerText = `₹${Math.round(totalInterest).toLocaleString()}`;
    document.getElementById('calcTotalPaymentDisplay').innerText = `₹${Math.round(totalPayment).toLocaleString()}`;
  }

  document.getElementById('loanPrincipal').addEventListener('input', calculateMortgageEmi);
  document.getElementById('loanRate').addEventListener('input', calculateMortgageEmi);
  document.getElementById('loanTenure').addEventListener('input', calculateMortgageEmi);

  // --- SCHEDULE PROPERTY VIEWING MODAL ---
  let activeViewingProp = null;

  window.openViewingModal = (propId) => {
    const prop = db.findById('re_properties', propId);
    if (!prop) return;

    activeViewingProp = prop;
    document.getElementById('viewingModalTitle').innerText = `Visit: ${prop.title}`;
    document.getElementById('viewingModalLocation').innerText = `${prop.location} | Listed by: ${prop.agent}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    document.getElementById('visitDate').value = tomorrow.toISOString().split('T')[0];

    document.getElementById('viewingModal').style.display = 'flex';
  };

  window.closeViewingModal = () => {
    document.getElementById('viewingModal').style.display = 'none';
    activeViewingProp = null;
  };

  document.getElementById('scheduleVisitForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeViewingProp) return;

    const date = document.getElementById('visitDate').value;
    const slot = document.getElementById('visitSlot').value;
    const visitorName = document.getElementById('visitorName').value.trim();
    const visitorPhone = document.getElementById('visitorPhone').value.trim();

    const visitId = 'VISIT-' + Math.floor(100 + Math.random() * 900);

    db.insert('re_viewings', {
      id: visitId,
      propId: activeViewingProp.id,
      propTitle: activeViewingProp.title,
      location: activeViewingProp.location,
      agent: activeViewingProp.agent,
      date,
      slot,
      visitorName,
      status: 'Confirmed'
    });

    // Log lead in Admin visitor tracking
    db.insert('re_visitors', {
      session: 'LEAD-' + Math.floor(1000 + Math.random() * 9000),
      client: `${visitorName} (${visitorPhone})`,
      ipBrowser: 'Verified Mobile Lead',
      viewed: activeViewingProp.title,
      time: new Date().toLocaleString()
    });

    alert(`Site Visit Scheduled!\nBooking Reference: ${visitId}\nDate: ${date} (${slot})\nAssigned Agent: ${activeViewingProp.agent} will meet you at the property.`);
    closeViewingModal();
    renderScheduledViewings();
    document.querySelector('.tab-btn[data-tab="scheduledViewingsTab"]').click();
  });

  function renderScheduledViewings() {
    const tbody = document.getElementById('viewingsTableBody');
    tbody.innerHTML = '';
    const viewings = db.get('re_viewings');

    viewings.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${v.id}</strong></td>
        <td>${v.propTitle}</td>
        <td>${v.location}</td>
        <td>${v.agent}</td>
        <td>${v.date} (${v.slot})</td>
        <td><span class="badge badge-success">${v.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAgents() {
    const grid = document.getElementById('agentsGrid');
    grid.innerHTML = '';
    const agents = db.get('re_agents');

    agents.forEach(a => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <h3 style="margin: 0;">${a.name}</h3>
          <span style="color: #f59e0b; font-weight: 700;">★ ${a.rating}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--primary); margin: 0.25rem 0;">${a.agency}</p>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Portfolio: ${a.activeListings} Active Listings</p>
        <div style="margin-top: 0.75rem;">
          <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="alert('Calling Agent ${a.name} at ${a.phone}...')">📞 Contact Agent</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // --- AGENT FORM ---
  document.getElementById('agentListingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('pTitle').value.trim();
    const location = document.getElementById('pLocation').value.trim();
    const type = document.getElementById('pType').value;
    const price = parseInt(document.getElementById('pPrice').value, 10);
    const area = parseInt(document.getElementById('pArea').value, 10);
    const amenities = document.getElementById('pAmenities').value.trim();

    const newId = 'p' + (db.get('re_properties').length + 1);
    db.insert('re_properties', {
      id: newId,
      title,
      location,
      type,
      price,
      area,
      amenities,
      agent: 'Self (Licensed Agent)'
    });

    alert(`Listing "${title}" published to HomeFinder marketplace!`);
    document.getElementById('agentListingForm').reset();
  });

  // --- ADMIN VISITOR & LEAD AUDIT LOGS ---
  function renderVisitorLogs() {
    const tbody = document.getElementById('visitorLogsBody');
    tbody.innerHTML = '';
    const logs = db.get('re_visitors');

    logs.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${l.session}</strong></td>
        <td>${l.client}</td>
        <td><small>${l.ipBrowser}</small></td>
        <td>${l.viewed}</td>
        <td>${l.time}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial runs
  renderProperties();
  renderSavedCriteria();
  renderScheduledViewings();
  renderAgents();
  calculateMortgageEmi();
});
