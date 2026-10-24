/**
 * Experiment 46: Online Phone Bill Payment Website
 * Monthly Telecom Cycle, ₹10/day Late Fine, Partial/Full Payment, and Invoices
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Default Billing Cycle Seed
  const defaultPhoneCycle = {
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    dueDate: '2026-10-02', // Overdue to demonstrate ₹10/day late fine
    fineRatePerDay: 10
  };

  // Default Subscriber Bill Seed
  const defaultSubscriberBill = {
    mobile: '+91 98765 43210',
    planName: 'Infinity 5G Unlimited Postpaid',
    monthlyRental: 499.00,
    vasRoaming: 89.00,
    gstTax: 105.84, // 18% of (499 + 89)
    baseBill: 693.84
  };

  // Default Invoices Seed
  const defaultInvoices = [
    {
      invoiceNo: 'TC-INV-84192',
      month: 'August 2026',
      baseBill: 693.84,
      fine: 0,
      totalPaid: 693.84,
      paidDate: '2026-09-01',
      mode: 'UPI'
    }
  ];

  db.seedIfEmpty('phone_cycle', defaultPhoneCycle);
  db.seedIfEmpty('phone_subscriber', defaultSubscriberBill);
  db.seedIfEmpty('phone_invoices', defaultInvoices);

  // Role Switcher
  const roleSelect = document.getElementById('phoneRoleSelect');
  const custSection = document.getElementById('phoneCustomerSection');
  const adminSection = document.getElementById('phoneAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      custSection.style.display = 'none';
      adminSection.style.display = 'block';
      loadAdminPhoneCycle();
    } else {
      custSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderPhoneBill();
      renderPhoneInvoices();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#phoneCustomerSection') || btn.closest('#phoneAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Compute late fine
  function getLateFine() {
    const cycle = db.get('phone_cycle') || defaultPhoneCycle;
    const dueDate = new Date(cycle.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diff = today.getTime() - dueDate.getTime();
    if (diff > 0) {
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const fine = days * (cycle.fineRatePerDay || 10);
      return { days, fine };
    }
    return { days: 0, fine: 0 };
  }

  function renderPhoneBill() {
    const cycle = db.get('phone_cycle') || defaultPhoneCycle;
    const sub = db.get('phone_subscriber') || defaultSubscriberBill;

    document.getElementById('telecomCycleText').innerText = `${cycle.startDate} to ${cycle.endDate}`;
    document.getElementById('telecomDueDateText').innerText = cycle.dueDate;
    document.getElementById('baseBillAmountDisplay').innerText = `₹${sub.baseBill.toFixed(2)}`;

    const { days, fine } = getLateFine();
    const totalDue = sub.baseBill + fine;

    document.getElementById('phoneFineDisplay').innerText = `₹${fine.toFixed(2)}`;
    document.getElementById('phoneTotalDueDisplay').innerText = `₹${totalDue.toFixed(2)}`;
    document.getElementById('radioFullAmtLabel').innerText = `₹${totalDue.toFixed(2)}`;

    const noticeBox = document.getElementById('phoneLateNotice');
    if (days > 0) {
      noticeBox.style.display = 'block';
      noticeBox.innerHTML = `
        <strong style="color: #991b1b;">⚠️ Payment Overdue by ${days} Day(s):</strong>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #7f1d1d;">
          Due date was <strong>${cycle.dueDate}</strong>. Late payment surcharge of ₹${cycle.fineRatePerDay}/day has been added (+₹${fine.toFixed(2)}).
        </p>
      `;
    } else {
      noticeBox.style.display = 'none';
    }
  }

  window.toggleCustomAmount = (isCustom) => {
    const customInput = document.getElementById('customPayAmt');
    customInput.style.display = isCustom ? 'block' : 'none';
  };

  window.processPhoneBillPayment = () => {
    const sub = db.get('phone_subscriber') || defaultSubscriberBill;
    const { fine } = getLateFine();
    const totalDue = sub.baseBill + fine;

    const isCustom = document.querySelector('input[name="amtChoice"]:checked').value === 'custom';
    let payAmount = totalDue;

    if (isCustom) {
      const entered = parseFloat(document.getElementById('customPayAmt').value);
      if (!entered || entered <= 0) {
        alert('Please enter a valid payment amount.');
        return;
      }
      payAmount = entered;
    }

    const gateway = document.getElementById('telecomPaymentGateway').value;
    const invoiceNo = 'TC-INV-' + Math.floor(10000 + Math.random() * 90000);
    const paidDate = new Date().toISOString().split('T')[0];

    db.insert('phone_invoices', {
      invoiceNo,
      month: 'September 2026',
      baseBill: sub.baseBill,
      fine,
      totalPaid: payAmount,
      paidDate,
      mode: gateway
    });

    alert(`Payment of ₹${payAmount.toFixed(2)} Successful via ${gateway}!\nInvoice Number: ${invoiceNo}\nConfirmation SMS and e-receipt sent to registered number.`);
    renderPhoneInvoices();
    printTelecomInvoice(invoiceNo);
  };

  function renderPhoneInvoices() {
    const tbody = document.getElementById('telecomHistoryTableBody');
    tbody.innerHTML = '';
    const invoices = db.get('phone_invoices');

    invoices.forEach(inv => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${inv.invoiceNo}</strong></td>
        <td>${inv.month}</td>
        <td>₹${inv.baseBill.toFixed(2)}</td>
        <td style="color: ${inv.fine > 0 ? 'var(--danger)' : 'inherit'};">₹${inv.fine.toFixed(2)}</td>
        <td><strong>₹${inv.totalPaid.toFixed(2)}</strong></td>
        <td>${inv.paidDate}</td>
        <td><span class="badge badge-primary">${inv.mode}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="printTelecomInvoice('${inv.invoiceNo}')">Print</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.printTelecomInvoice = (invoiceNo) => {
    const inv = db.get('phone_invoices').find(i => i.invoiceNo === invoiceNo);
    if (!inv) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Telecom Tax Invoice - ${inv.invoiceNo}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .invoice { border: 2px solid #2563eb; padding: 1.5rem; max-width: 550px; margin: 0 auto; border-radius: 8px; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 1rem; margin-bottom: 1rem; }
      </style></head>
      <body>
        <div class="invoice">
          <div class="header">
            <h2>TELECONNECT POSTPAID TELECOM</h2>
            <h3>GST TAX INVOICE & RECEIPT</h3>
            <p><strong>Invoice #: ${inv.invoiceNo}</strong></p>
          </div>
          <p><strong>Mobile Number:</strong> +91 98765 43210</p>
          <p><strong>Billing Month:</strong> ${inv.month}</p>
          <p><strong>Base Charges & GST:</strong> ₹${inv.baseBill.toFixed(2)}</p>
          <p><strong>Late Payment Fee:</strong> ₹${inv.fine.toFixed(2)}</p>
          <div style="border-top: 1px solid #ccc; margin: 0.5rem 0; padding-top: 0.5rem;">
            <h3>Total Paid: ₹${inv.totalPaid.toFixed(2)} (${inv.mode})</h3>
          </div>
          <p><strong>Date of Payment:</strong> ${inv.paidDate}</p>
          <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">PAID & CLEARED</span></p>
          <p style="text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #64748b;">Thank you for being a valued TeleConnect subscriber.</p>
        </div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  // --- ADMIN FUNCTIONS ---
  function loadAdminPhoneCycle() {
    const cycle = db.get('phone_cycle') || defaultPhoneCycle;
    document.getElementById('adminPhoneStart').value = cycle.startDate;
    document.getElementById('adminPhoneEnd').value = cycle.endDate;
    document.getElementById('adminPhoneDue').value = cycle.dueDate;
    document.getElementById('adminPhoneFineRate').value = cycle.fineRatePerDay;
  }

  document.getElementById('adminPhoneCycleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newCycle = {
      startDate: document.getElementById('adminPhoneStart').value,
      endDate: document.getElementById('adminPhoneEnd').value,
      dueDate: document.getElementById('adminPhoneDue').value,
      fineRatePerDay: parseFloat(document.getElementById('adminPhoneFineRate').value)
    };

    db.set('phone_cycle', newCycle);
    alert('Telecom billing cycle dates and late fee surcharge published!');
    renderPhoneBill();
  });

  // Initial runs
  renderPhoneBill();
  renderPhoneInvoices();
});
