/**
 * Experiment 42: Online Electricity Bill Payment Website
 * Implementation of Domestic/Commercial Tiered Tariff Slabs & ₹10/day Late Fine
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Default Tariff Rules Seed
  const defaultTariffs = {
    domestic: [
      { max: 100, rate: 1.00 },
      { max: 200, rate: 2.50 },
      { max: 500, rate: 4.00 },
      { max: Infinity, rate: 6.00 }
    ],
    commercial: [
      { max: 100, rate: 2.00 },
      { max: 200, rate: 4.50 },
      { max: 500, rate: 6.00 },
      { max: Infinity, rate: 7.00 }
    ]
  };

  // Default Cycle Seed
  const defaultCycle = {
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    dueDate: '2026-10-01', // Demonstrating overdue status with ₹10/day fine
    fineRatePerDay: 10
  };

  // Consumer Account Seed
  const defaultConsumer = {
    serviceNo: '04-102-9481',
    name: 'Faizze A.',
    type: 'domestic',
    unitsConsumed: 340,
    isPaid: false
  };

  // Payment Receipts Seed
  const defaultReceipts = [
    {
      receiptNo: 'EB-REC-49021',
      cycle: '01-Jun-2026 to 31-Jul-2026',
      units: 280,
      baseCharge: 670,
      fine: 0,
      totalPaid: 670,
      paidDate: '2026-08-10'
    }
  ];

  db.seedIfEmpty('eb_tariffs', defaultTariffs);
  db.seedIfEmpty('eb_cycle', defaultCycle);
  db.seedIfEmpty('eb_consumer', defaultConsumer);
  db.seedIfEmpty('eb_receipts', defaultReceipts);

  // Role Switcher
  const roleSelect = document.getElementById('ebRoleSelect');
  const customerSection = document.getElementById('ebCustomerSection');
  const adminSection = document.getElementById('ebAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      customerSection.style.display = 'none';
      adminSection.style.display = 'block';
      loadAdminTariffValues();
    } else {
      customerSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderConsumerBill();
      renderPaymentHistory();
      simulateTariffCalculator();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#ebCustomerSection') || btn.closest('#ebAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Core Tariff Calculation Engine
  function computeTariff(type, units) {
    const tariffs = db.get('eb_tariffs') || defaultTariffs;
    const slabs = tariffs[type] || defaultTariffs.domestic;
    let remainingUnits = units;
    let total = 0;
    const breakdown = [];

    // Slab 1: 0 - 100
    const slab1Units = Math.min(remainingUnits, 100);
    if (slab1Units > 0) {
      const cost1 = slab1Units * slabs[0].rate;
      total += cost1;
      breakdown.push({ label: `First ${slab1Units} units @ ₹${slabs[0].rate.toFixed(2)}`, cost: cost1 });
      remainingUnits -= slab1Units;
    }

    // Slab 2: 101 - 200 (next 100)
    if (remainingUnits > 0) {
      const slab2Units = Math.min(remainingUnits, 100);
      const cost2 = slab2Units * slabs[1].rate;
      total += cost2;
      breakdown.push({ label: `Next ${slab2Units} units (101-200) @ ₹${slabs[1].rate.toFixed(2)}`, cost: cost2 });
      remainingUnits -= slab2Units;
    }

    // Slab 3: 201 - 500 (next 300)
    if (remainingUnits > 0) {
      const slab3Units = Math.min(remainingUnits, 300);
      const cost3 = slab3Units * slabs[2].rate;
      total += cost3;
      breakdown.push({ label: `Next ${slab3Units} units (201-500) @ ₹${slabs[2].rate.toFixed(2)}`, cost: cost3 });
      remainingUnits -= slab3Units;
    }

    // Slab 4: 501+
    if (remainingUnits > 0) {
      const cost4 = remainingUnits * slabs[3].rate;
      total += cost4;
      breakdown.push({ label: `Remaining ${remainingUnits} units (501+) @ ₹${slabs[3].rate.toFixed(2)}`, cost: cost4 });
    }

    return { total, breakdown };
  }

  // Late Fine Calculator (₹10 added for each day past due date)
  function computeLateFine(dueDateStr) {
    const cycle = db.get('eb_cycle') || defaultCycle;
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - dueDate.getTime();
    if (diffTime > 0) {
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const fineAmount = overdueDays * (cycle.fineRatePerDay || 10);
      return { overdueDays, fineAmount };
    }
    return { overdueDays: 0, fineAmount: 0 };
  }

  // Render Consumer Current Bill
  function renderConsumerBill() {
    const consumer = db.get('eb_consumer') || defaultConsumer;
    const cycle = db.get('eb_cycle') || defaultCycle;

    document.getElementById('consumerNoLabel').innerText = consumer.serviceNo;
    document.getElementById('consumerNameLabel').innerText = consumer.name;
    document.getElementById('consumerTypeLabel').innerText = consumer.type.toUpperCase();
    document.getElementById('cycleLabel').innerText = `${cycle.startDate} to ${cycle.endDate} (Bi-Monthly)`;
    document.getElementById('dueDateLabel').innerText = cycle.dueDate;
    document.getElementById('unitsConsumedLabel').innerText = `${consumer.unitsConsumed} Units`;

    const tariffResult = computeTariff(consumer.type, consumer.unitsConsumed);
    const fineResult = computeLateFine(cycle.dueDate);
    const netPayable = tariffResult.total + fineResult.fineAmount;

    document.getElementById('baseChargeLabel').innerText = `₹${tariffResult.total.toFixed(2)}`;
    document.getElementById('fineChargeLabel').innerText = `₹${fineResult.fineAmount.toFixed(2)}`;
    document.getElementById('totalPayableLabel').innerText = `₹${netPayable.toFixed(2)}`;

    const alertBox = document.getElementById('overdueAlertBox');
    if (fineResult.overdueDays > 0) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `
        <strong style="color: #991b1b;">⚠️ Payment Overdue:</strong>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #7f1d1d;">
          The last date of payment was <strong>${cycle.dueDate}</strong> (${fineResult.overdueDays} days ago).
          A late penalty fine of ₹${cycle.fineRatePerDay}/day has been added (+₹${fineResult.fineAmount}).
        </p>
      `;
    } else {
      alertBox.style.display = 'none';
    }
  }

  // Pay Electricity Bill
  window.payElectricityBill = () => {
    const consumer = db.get('eb_consumer') || defaultConsumer;
    const cycle = db.get('eb_cycle') || defaultCycle;
    const selectedMethod = document.querySelector('input[name="payMethod"]:checked').value;

    const tariffResult = computeTariff(consumer.type, consumer.unitsConsumed);
    const fineResult = computeLateFine(cycle.dueDate);
    const netPayable = tariffResult.total + fineResult.fineAmount;

    const receiptNo = 'EB-REC-' + Math.floor(10000 + Math.random() * 90000);
    const paidDate = new Date().toISOString().split('T')[0];

    db.insert('eb_receipts', {
      receiptNo,
      cycle: `${cycle.startDate} to ${cycle.endDate}`,
      units: consumer.unitsConsumed,
      baseCharge: tariffResult.total,
      fine: fineResult.fineAmount,
      totalPaid: netPayable,
      paidDate
    });

    alert(`Payment Successful via ${selectedMethod}!\nReceipt No: ${receiptNo}\nAmount Paid: ₹${netPayable.toFixed(2)}\nThank you for paying your TNEB electricity bill.`);
    renderPaymentHistory();
    downloadReceipt(receiptNo);
  };

  function renderPaymentHistory() {
    const tbody = document.getElementById('paymentHistoryBody');
    tbody.innerHTML = '';
    const receipts = db.get('eb_receipts');

    receipts.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.receiptNo}</strong></td>
        <td>${r.cycle}</td>
        <td>${r.units}</td>
        <td>₹${r.baseCharge.toFixed(2)}</td>
        <td style="color: ${r.fine > 0 ? 'var(--danger)' : 'inherit'};">₹${r.fine.toFixed(2)}</td>
        <td><strong>₹${r.totalPaid.toFixed(2)}</strong></td>
        <td>${r.paidDate}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="downloadReceipt('${r.receiptNo}')">Download</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.downloadReceipt = (receiptNo) => {
    const r = db.get('eb_receipts').find(item => item.receiptNo === receiptNo);
    if (!r) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Electricity Bill Payment Receipt - ${r.receiptNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .receipt { border: 2px solid #2563eb; padding: 1.5rem; max-width: 550px; margin: 0 auto; border-radius: 8px; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 1rem; margin-bottom: 1rem; }
      </style></head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>TAMIL NADU ELECTRICITY BOARD (TNEB)</h2>
            <h3>ONLINE PAYMENT RECEIPT</h3>
            <p><strong>Receipt #: ${r.receiptNo}</strong></p>
          </div>
          <p><strong>Billing Cycle:</strong> ${r.cycle}</p>
          <p><strong>Units Billed:</strong> ${r.units} Units</p>
          <p><strong>Energy Charges:</strong> ₹${r.baseCharge.toFixed(2)}</p>
          <p><strong>Late Payment Fine:</strong> ₹${r.fine.toFixed(2)}</p>
          <div style="border-top: 1px solid #ccc; margin: 0.5rem 0; padding-top: 0.5rem;">
            <h3>Total Paid: ₹${r.totalPaid.toFixed(2)}</h3>
          </div>
          <p><strong>Date of Payment:</strong> ${r.paidDate}</p>
          <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">PAID & CLEARED</span></p>
          <p style="text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #64748b;">This is a computer-generated tax invoice. No physical signature required.</p>
        </div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  // Tariff Slab Calculator Simulator
  function simulateTariffCalculator() {
    const type = document.getElementById('calcConnType').value;
    const units = parseFloat(document.getElementById('calcUnitsInput').value) || 0;

    const result = computeTariff(type, units);
    const container = document.getElementById('calcBreakdownDetails');
    container.innerHTML = '';

    result.breakdown.forEach(b => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.innerHTML = `<span>${b.label}</span><strong>₹${b.cost.toFixed(2)}</strong>`;
      container.appendChild(div);
    });

    document.getElementById('calcTotalResult').innerText = `₹${result.total.toFixed(2)}`;
  }

  document.getElementById('calcConnType').addEventListener('change', simulateTariffCalculator);
  document.getElementById('calcUnitsInput').addEventListener('input', simulateTariffCalculator);

  // --- ADMIN FUNCTIONS ---
  function loadAdminTariffValues() {
    const tariffs = db.get('eb_tariffs') || defaultTariffs;
    document.getElementById('dom_slab1').value = tariffs.domestic[0].rate;
    document.getElementById('dom_slab2').value = tariffs.domestic[1].rate;
    document.getElementById('dom_slab3').value = tariffs.domestic[2].rate;
    document.getElementById('dom_slab4').value = tariffs.domestic[3].rate;

    document.getElementById('comm_slab1').value = tariffs.commercial[0].rate;
    document.getElementById('comm_slab2').value = tariffs.commercial[1].rate;
    document.getElementById('comm_slab3').value = tariffs.commercial[2].rate;
    document.getElementById('comm_slab4').value = tariffs.commercial[3].rate;

    const cycle = db.get('eb_cycle') || defaultCycle;
    document.getElementById('cycleStartDate').value = cycle.startDate;
    document.getElementById('cycleEndDate').value = cycle.endDate;
    document.getElementById('cycleDueDate').value = cycle.dueDate;
    document.getElementById('dailyFineAmount').value = cycle.fineRatePerDay;
  }

  window.saveAdminTariffRules = () => {
    const newTariffs = {
      domestic: [
        { max: 100, rate: parseFloat(document.getElementById('dom_slab1').value) },
        { max: 200, rate: parseFloat(document.getElementById('dom_slab2').value) },
        { max: 500, rate: parseFloat(document.getElementById('dom_slab3').value) },
        { max: Infinity, rate: parseFloat(document.getElementById('dom_slab4').value) }
      ],
      commercial: [
        { max: 100, rate: parseFloat(document.getElementById('comm_slab1').value) },
        { max: 200, rate: parseFloat(document.getElementById('comm_slab2').value) },
        { max: 500, rate: parseFloat(document.getElementById('comm_slab3').value) },
        { max: Infinity, rate: parseFloat(document.getElementById('comm_slab4').value) }
      ]
    };

    db.set('eb_tariffs', newTariffs);
    alert('Tariff slabs updated successfully!');
    renderConsumerBill();
    simulateTariffCalculator();
  };

  document.getElementById('adminCycleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newCycle = {
      startDate: document.getElementById('cycleStartDate').value,
      endDate: document.getElementById('cycleEndDate').value,
      dueDate: document.getElementById('cycleDueDate').value,
      fineRatePerDay: parseFloat(document.getElementById('dailyFineAmount').value)
    };

    db.set('eb_cycle', newCycle);
    alert('Billing cycle & daily fine parameters published!');
    renderConsumerBill();
  });

  // Initial runs
  renderConsumerBill();
  renderPaymentHistory();
  simulateTariffCalculator();
});
