/**
 * Experiment 12: InsureEasy Online Insurance Management Platform
 * Policy Comparisons, Claims Filing, Agent Commission Engine & SMS Due Alerts
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Comparison Policies Seed
  const defaultAvailablePlans = [
    {
      id: 'pl1',
      name: 'Comprehensive Health Shield',
      category: 'Health Insurance',
      coverage: '₹15,00,000 Sum Insured',
      premium: 15000,
      benefits: 'Cashless in 10,000+ hospitals, No co-pay, Daycare procedures covered.'
    },
    {
      id: 'pl2',
      name: 'Zero-Dep Bumper Motor Protector',
      category: 'Auto Insurance',
      coverage: 'IDV ₹8,50,000',
      premium: 9500,
      benefits: 'Zero depreciation, 24/7 roadside engine assist, Consumables cover.'
    },
    {
      id: 'pl3',
      name: 'Home & Structural Safeguard',
      category: 'Home Insurance',
      coverage: '₹75,00,000 Fire & Earthquake',
      premium: 6200,
      benefits: 'Full structural replacement, Burglary protection, Appliance surge cover.'
    }
  ];

  // User Enrolled Policies Seed
  const defaultUserPolicies = [
    {
      policyNo: 'POL-HLT-9182',
      planName: 'Comprehensive Health Shield',
      category: 'Health Insurance',
      sumInsured: 1500000,
      premium: 15000,
      customerName: 'Faizze A.',
      customerPhone: '9876543210',
      dueDate: '2026-10-18',
      agent: 'Agent Varun Nair',
      status: 'Active'
    }
  ];

  // Agent Roster Seed
  const defaultAgents = [
    { id: 'ag1', name: 'Varun Nair', license: 'IRDAI-AG-49012', clientsCount: 8, approved: true },
    { id: 'ag2', name: 'Deepika Sen', license: 'IRDAI-AG-82190', clientsCount: 3, approved: false }
  ];

  // SMS Alerts Seed
  const defaultSmsAlerts = [
    {
      id: 'sms1',
      recipient: 'Faizze A.',
      text: 'Dear Faizze, your health policy POL-HLT-9182 premium of ₹15,000 is due on 2026-10-18. Pay now on InsureEasy to maintain continuity benefits.',
      sentAt: '2026-10-06 10:00 AM'
    }
  ];

  db.seedIfEmpty('ins_plans', defaultAvailablePlans);
  db.seedIfEmpty('ins_policies', defaultUserPolicies);
  db.seedIfEmpty('ins_agents', defaultAgents);
  db.seedIfEmpty('ins_sms', defaultSmsAlerts);

  // Role Switcher
  const roleSelect = document.getElementById('insRoleSelect');
  const holderSection = document.getElementById('insHolderSection');
  const agentSection = document.getElementById('insAgentSection');
  const adminSection = document.getElementById('insAdminSection');

  roleSelect.addEventListener('change', (e) => {
    holderSection.style.display = 'none';
    agentSection.style.display = 'none';
    adminSection.style.display = 'none';

    if (e.target.value === 'admin') {
      adminSection.style.display = 'block';
      renderAdminAgents();
    } else if (e.target.value === 'agent') {
      agentSection.style.display = 'block';
      renderAgentClients();
      populateSmsRecipients();
    } else {
      holderSection.style.display = 'block';
      renderComparePolicies();
      renderUserPolicies();
      populateClaimPolicies();
      renderUserSms();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#insHolderSection') || btn.closest('#insAgentSection') || btn.closest('#insAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- POLICYHOLDER FUNCTIONS ---
  function renderComparePolicies() {
    const tbody = document.getElementById('comparePoliciesTableBody');
    tbody.innerHTML = '';
    const plans = db.get('ins_plans');

    plans.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.name}</strong></td>
        <td><span class="badge badge-primary">${p.category}</span></td>
        <td>${p.coverage}</td>
        <td><strong>₹${p.premium.toLocaleString()}</strong> / year</td>
        <td><small>${p.benefits}</small></td>
        <td><button class="btn btn-primary btn-sm" onclick="enrollInPlan('${p.id}')">Buy Online</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.enrollInPlan = (planId) => {
    const plan = db.findById('ins_plans', planId);
    if (!plan) return;

    const policyNo = 'POL-' + plan.category.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    db.insert('ins_policies', {
      policyNo,
      planName: plan.name,
      category: plan.category,
      sumInsured: plan.coverage,
      premium: plan.premium,
      customerName: 'Faizze A.',
      customerPhone: '9876543210',
      dueDate: nextYear.toISOString().split('T')[0],
      agent: 'Agent Varun Nair',
      status: 'Active'
    });

    alert(`Congratulations!\nEnrolled in "${plan.name}".\nGenerated Policy #: ${policyNo}.\nInstant digital policy certificate issued.`);
    renderUserPolicies();
    populateClaimPolicies();
    document.querySelector('.tab-btn[data-tab="myPoliciesTab"]').click();
  };

  function renderUserPolicies() {
    const tbody = document.getElementById('userPoliciesTableBody');
    tbody.innerHTML = '';
    const policies = db.get('ins_policies');

    policies.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.policyNo}</strong></td>
        <td>${p.planName}</td>
        <td>${p.category}</td>
        <td>${p.sumInsured}</td>
        <td>${p.dueDate}</td>
        <td><span class="badge badge-success">${p.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="alert('Renewing policy ${p.policyNo} via payment gateway...')">Renew Policy</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function populateClaimPolicies() {
    const sel = document.getElementById('claimPolicySelect');
    sel.innerHTML = '';
    db.get('ins_policies').forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.policyNo;
      opt.innerText = `${p.policyNo} - ${p.planName}`;
      sel.appendChild(opt);
    });
  }

  document.getElementById('fileClaimForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const policyNo = document.getElementById('claimPolicySelect').value;
    const amount = document.getElementById('claimAmount').value;
    const claimId = 'CLM-' + Math.floor(10000 + Math.random() * 90000);

    alert(`Claim Filed Successfully!\nClaim Tracking #: ${claimId}\nPolicy #: ${policyNo}\nEstimated Amount: ₹${amount}\nAssigned agent will contact you for bill verifications.`);
    document.getElementById('fileClaimForm').reset();
  });

  function renderUserSms() {
    const container = document.getElementById('userSmsList');
    container.innerHTML = '';
    const alerts = db.get('ins_sms');

    document.getElementById('userSmsBadge').innerText = alerts.length;

    alerts.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '0.75rem';
      card.style.marginBottom = '0.5rem';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: var(--primary);">📲 SMS Alert</strong>
          <small style="color: var(--text-muted);">${s.sentAt}</small>
        </div>
        <p style="font-size: 0.85rem; margin: 0.35rem 0 0 0;">${s.text}</p>
      `;
      container.appendChild(card);
    });
  }

  // --- AGENT FUNCTIONS ---
  function renderAgentClients() {
    const tbody = document.getElementById('agentClientsTableBody');
    tbody.innerHTML = '';
    const policies = db.get('ins_policies');

    policies.forEach(p => {
      const commission = Math.round(p.premium * 0.10);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.policyNo}</strong></td>
        <td>${p.customerName}<br><small>${p.customerPhone}</small></td>
        <td>${p.planName}</td>
        <td>₹${p.premium.toLocaleString()}</td>
        <td>${p.dueDate}</td>
        <td style="color: var(--success); font-weight: 700;">₹${commission.toLocaleString()}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="quickSendReminder('${p.customerName}', '${p.policyNo}')">Send Alert</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function populateSmsRecipients() {
    const sel = document.getElementById('smsRecipientSelect');
    sel.innerHTML = '';
    db.get('ins_policies').forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.customerName;
      opt.innerText = `${p.customerName} (${p.policyNo} - Due: ${p.dueDate})`;
      sel.appendChild(opt);
    });

    updateSmsTextTemplate();
  }

  function updateSmsTextTemplate() {
    const recipient = document.getElementById('smsRecipientSelect').value;
    const type = document.getElementById('smsTemplateSelect').value;

    let text = `Dear ${recipient}, this is a reminder regarding your upcoming insurance premium due date. Please login to InsureEasy to pay securely.`;
    if (type === 'overdue') {
      text = `URGENT: Dear ${recipient}, your policy premium is past due. To prevent policy lapse, pay immediately.`;
    } else if (type === 'congratulations') {
      text = `Thank you ${recipient}! Your insurance policy renewal has been processed successfully.`;
    }
    document.getElementById('smsCustomText').value = text;
  }

  document.getElementById('smsRecipientSelect').addEventListener('change', updateSmsTextTemplate);
  document.getElementById('smsTemplateSelect').addEventListener('change', updateSmsTextTemplate);

  document.getElementById('dispatchSmsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const recipient = document.getElementById('smsRecipientSelect').value;
    const text = document.getElementById('smsCustomText').value;

    db.insert('ins_sms', {
      recipient,
      text,
      sentAt: new Date().toLocaleString()
    });

    alert(`SMS alert successfully transmitted to ${recipient}!`);
    renderUserSms();
  });

  window.quickSendReminder = (name, polNo) => {
    document.querySelector('.tab-btn[data-tab="agentSmsDispatcherTab"]').click();
    document.getElementById('smsRecipientSelect').value = name;
    updateSmsTextTemplate();
  };

  document.getElementById('enrollClientForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newCustName').value.trim();
    const phone = document.getElementById('newCustPhone').value.trim();
    const planName = document.getElementById('newCustPlan').value;

    const polNo = 'POL-AGT-' + Math.floor(1000 + Math.random() * 9000);
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 11);

    db.insert('ins_policies', {
      policyNo: polNo,
      planName,
      category: 'General Insurance',
      sumInsured: 'Standard Coverage',
      premium: 10000,
      customerName: name,
      customerPhone: phone,
      dueDate: dueDate.toISOString().split('T')[0],
      agent: 'Agent Varun Nair',
      status: 'Active'
    });

    alert(`Client ${name} enrolled with Policy #${polNo}!`);
    document.getElementById('enrollClientForm').reset();
    renderAgentClients();
  });

  // --- ADMIN FUNCTIONS ---
  function renderAdminAgents() {
    const tbody = document.getElementById('adminAgentsTableBody');
    tbody.innerHTML = '';
    const agents = db.get('ins_agents');

    agents.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.id}</strong></td>
        <td>${a.name}</td>
        <td>${a.license}</td>
        <td>${a.clientsCount} Clients</td>
        <td><span class="badge ${a.approved ? 'badge-success' : 'badge-warning'}">${a.approved ? 'Authorized' : 'Pending Approval'}</span></td>
        <td>
          ${!a.approved ? `<button class="btn btn-success btn-sm" onclick="approveAgent('${a.id}')">Approve License</button>` : `<button class="btn btn-secondary btn-sm" onclick="revokeAgent('${a.id}')">Revoke</button>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.approveAgent = (id) => {
    db.update('ins_agents', id, { approved: true });
    alert('Agent credentials verified and approved!');
    renderAdminAgents();
  };

  window.revokeAgent = (id) => {
    db.update('ins_agents', id, { approved: false });
    alert('Agent access revoked.');
    renderAdminAgents();
  };

  // Initial runs
  renderComparePolicies();
  renderUserPolicies();
  populateClaimPolicies();
  renderUserSms();
});
