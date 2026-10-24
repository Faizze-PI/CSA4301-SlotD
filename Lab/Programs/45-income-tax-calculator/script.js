/**
 * Experiment 45: Income Tax Calculation Webpage
 * Implementation of Strict Indian Income Tax Slabs, 80C/80D Rules, and Standard Deductions
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Default Gov Norms Seed
  const defaultGovNorms = {
    standardDeduction: 50000,
    maxPensionCap: 150000,
    zeroTaxThreshold: 500000
  };

  // Default Saved Returns Seed
  const defaultReturns = [
    {
      id: 'ITR-2025-01',
      ay: '2025-26',
      gross: 1020000,
      deductions: 374000,
      taxableIncome: 646000,
      taxPaid: 41700,
      date: '2026-07-28'
    }
  ];

  db.seedIfEmpty('tax_gov_norms', defaultGovNorms);
  db.seedIfEmpty('tax_saved_returns', defaultReturns);

  // Role Switcher
  const roleSelect = document.getElementById('taxRoleSelect');
  const empSection = document.getElementById('taxEmployeeSection');
  const adminSection = document.getElementById('taxAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      empSection.style.display = 'none';
      adminSection.style.display = 'block';
      loadAdminGovNorms();
    } else {
      empSection.style.display = 'block';
      adminSection.style.display = 'none';
      computeTaxAssessment();
      renderSavedReturns();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#taxEmployeeSection') || btn.closest('#taxAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Tax Assessment Engine
  let lastComputedTax = null;

  window.computeTaxAssessment = () => {
    const norms = db.get('tax_gov_norms') || defaultGovNorms;

    const monthlyGross = parseFloat(document.getElementById('monthlyGross').value) || 0;
    const monthlyHra = parseFloat(document.getElementById('monthlyHra').value) || 0;
    const monthlyPension = parseFloat(document.getElementById('monthlyPension').value) || 0;
    const monthlyInsurance = parseFloat(document.getElementById('monthlyInsurance').value) || 0;

    // Annual conversions
    const annGross = monthlyGross * 12;
    const annHra = monthlyHra * 12;
    const stdDeduction = norms.standardDeduction;
    const pensionCapped = Math.min(monthlyPension * 12, norms.maxPensionCap);
    const annInsurance = monthlyInsurance * 12;

    // Net Taxable Income calculation:
    // Net Taxable Income = (Gross pay * 12) - (House Rent Allowance * 12) - (Standard Deduction = 50,000) - min(Pension * 12, 150,000) - (Health Insurance * 12)
    const netTaxableIncome = Math.max(0, annGross - annHra - stdDeduction - pensionCapped - annInsurance);

    // Update DOM summary
    document.getElementById('annGrossDisplay').innerText = `₹${annGross.toLocaleString()}`;
    document.getElementById('annHraDisplay').innerText = `- ₹${annHra.toLocaleString()}`;
    document.getElementById('stdDedDisplay').innerText = `- ₹${stdDeduction.toLocaleString()}`;
    document.getElementById('annPensionDisplay').innerText = `- ₹${pensionCapped.toLocaleString()}`;
    document.getElementById('annInsuranceDisplay').innerText = `- ₹${annInsurance.toLocaleString()}`;
    document.getElementById('ntiDisplay').innerText = `₹${netTaxableIncome.toLocaleString()}`;

    // Slab Calculation:
    let taxLiability = 0;
    const slabBreakdown = [];
    const rebateNotice = document.getElementById('rebateNotice');

    if (netTaxableIncome <= norms.zeroTaxThreshold) {
      taxLiability = 0;
      rebateNotice.style.display = 'block';
      slabBreakdown.push('0 to 2,50,000: ₹0 (Nil)');
      slabBreakdown.push(`${netTaxableIncome.toLocaleString()} &le; ₹5,00,000 &rarr; Sec 87A Full Rebate: Tax is ₹0`);
    } else {
      rebateNotice.style.display = 'none';

      // Slab 1: 0 to 250,000 -> 0
      slabBreakdown.push('Slab 1 (₹0 to ₹2,50,000 @ 0%): ₹0');

      // Slab 2: 250,001 to 500,000 -> 5%
      const slab2Tax = 250000 * 0.05; // 12,500
      slabBreakdown.push(`Slab 2 (₹2,50,001 to ₹5,00,000 @ 5%): ₹${slab2Tax.toLocaleString()}`);

      if (netTaxableIncome <= 1000000) {
        // Slab 3: 500,001 to 1,000,000 -> 12,500 + 20% of (nti - 500,000)
        const slab3Tax = (netTaxableIncome - 500000) * 0.20;
        taxLiability = 12500 + slab3Tax;
        slabBreakdown.push(`Slab 3 (₹5,00,001 to ₹${netTaxableIncome.toLocaleString()} @ 20%): ₹${slab3Tax.toLocaleString()}`);
      } else {
        // Full Slab 3: 500,000 @ 20% = 100,000
        const slab3Tax = 100000;
        slabBreakdown.push('Slab 3 (₹5,00,001 to ₹10,00,000 @ 20%): ₹1,00,000');

        // Slab 4: > 1,000,000 -> 112,500 + 30% of (nti - 1,000,000)
        const slab4Tax = (netTaxableIncome - 1000000) * 0.30;
        taxLiability = 112500 + slab4Tax;
        slabBreakdown.push(`Slab 4 (> ₹10,00,000 @ 30% of ₹${(netTaxableIncome - 1000000).toLocaleString()}): ₹${slab4Tax.toLocaleString()}`);
      }
    }

    const netTakeHome = annGross - taxLiability;

    document.getElementById('totalTaxLiabilityDisplay').innerText = `₹${Math.round(taxLiability).toLocaleString()}`;
    document.getElementById('netTakeHomeDisplay').innerText = `₹${Math.round(netTakeHome).toLocaleString()}`;

    const mathContainer = document.getElementById('slabMathDisplay');
    mathContainer.innerHTML = slabBreakdown.map(s => `<div>• ${s}</div>`).join('');

    lastComputedTax = {
      name: document.getElementById('empName').value,
      pan: document.getElementById('empPan').value,
      annGross,
      annHra,
      stdDeduction,
      pensionCapped,
      annInsurance,
      netTaxableIncome,
      taxLiability: Math.round(taxLiability),
      netTakeHome: Math.round(netTakeHome)
    };
  };

  window.printTaxSummaryReport = () => {
    if (!lastComputedTax) computeTaxAssessment();
    const data = lastComputedTax;

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Income Tax Assessment Summary - ${data.pan}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .tax-doc { border: 2px solid #1e3a8a; padding: 2rem; max-width: 650px; margin: 0 auto; border-radius: 8px; }
        .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        td, th { padding: 8px; border-bottom: 1px solid #ddd; }
      </style></head>
      <body>
        <div class="tax-doc">
          <div class="header">
            <h2>INCOME TAX DEPARTMENT - GOVT OF INDIA</h2>
            <h3>ANNUAL TAX ASSESSMENT SUMMARY (FORM 16 SUMMARY)</h3>
          </div>
          <p><strong>Employee Name:</strong> ${data.name}</p>
          <p><strong>Permanent Account Number (PAN):</strong> ${data.pan}</p>
          <p><strong>Assessment Year:</strong> 2026-27 (Financial Year 2025-26)</p>
          <table>
            <tr><th>Particulars</th><th style="text-align: right;">Amount (₹)</th></tr>
            <tr><td>Annual Gross Salary</td><td style="text-align: right;">₹${data.annGross.toLocaleString()}</td></tr>
            <tr><td>House Rent Allowance Exemption (Sec 10)</td><td style="text-align: right;">- ₹${data.annHra.toLocaleString()}</td></tr>
            <tr><td>Standard Deduction (Sec 16ia)</td><td style="text-align: right;">- ₹${data.stdDeduction.toLocaleString()}</td></tr>
            <tr><td>Deductions under Section 80C (Pension/PF)</td><td style="text-align: right;">- ₹${data.pensionCapped.toLocaleString()}</td></tr>
            <tr><td>Medical Insurance Premium (Sec 80D)</td><td style="text-align: right;">- ₹${data.annInsurance.toLocaleString()}</td></tr>
            <tr style="font-weight: bold; background: #f1f5f9;"><td>Net Taxable Income (NTI)</td><td style="text-align: right;">₹${data.netTaxableIncome.toLocaleString()}</td></tr>
            <tr style="font-weight: bold; color: #dc2626; font-size: 1.1rem;"><td>Total Tax Payable</td><td style="text-align: right;">₹${data.taxLiability.toLocaleString()}</td></tr>
            <tr style="font-weight: bold; color: #059669;"><td>Net Annual Take-Home Pay</td><td style="text-align: right;">₹${data.netTakeHome.toLocaleString()}</td></tr>
          </table>
          <p style="text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #64748b;">Generated via SIMATS CSA4301 Assessment Simulator. System verified.</p>
        </div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  window.saveTaxReturnRecord = () => {
    if (!lastComputedTax) computeTaxAssessment();
    const data = lastComputedTax;
    const totalDeductions = data.annHra + data.stdDeduction + data.pensionCapped + data.annInsurance;
    const newId = 'ITR-2026-' + Math.floor(10 + Math.random() * 90);

    db.insert('tax_saved_returns', {
      id: newId,
      ay: '2026-27',
      gross: data.annGross,
      deductions: totalDeductions,
      taxableIncome: data.netTaxableIncome,
      taxPaid: data.taxLiability,
      date: new Date().toISOString().split('T')[0]
    });

    alert(`Tax assessment saved under Record #${newId}!`);
    renderSavedReturns();
  };

  function renderSavedReturns() {
    const tbody = document.getElementById('savedTaxReturnsBody');
    tbody.innerHTML = '';
    const records = db.get('tax_saved_returns');

    records.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.id}</strong></td>
        <td>${r.ay}</td>
        <td>₹${r.gross.toLocaleString()}</td>
        <td>₹${r.deductions.toLocaleString()}</td>
        <td><strong>₹${r.taxableIncome.toLocaleString()}</strong></td>
        <td style="color: #dc2626; font-weight: 700;">₹${r.taxPaid.toLocaleString()}</td>
        <td>${r.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- ADMIN FUNCTIONS ---
  function loadAdminGovNorms() {
    const norms = db.get('tax_gov_norms') || defaultGovNorms;
    document.getElementById('govStdDed').value = norms.standardDeduction;
    document.getElementById('govPensionCap').value = norms.maxPensionCap;
    document.getElementById('govRebateLimit').value = norms.zeroTaxThreshold;
  }

  document.getElementById('adminGovNormsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const standardDeduction = parseFloat(document.getElementById('govStdDed').value);
    const maxPensionCap = parseFloat(document.getElementById('govPensionCap').value);
    const zeroTaxThreshold = parseFloat(document.getElementById('govRebateLimit').value);

    db.set('tax_gov_norms', { standardDeduction, maxPensionCap, zeroTaxThreshold });
    alert('Government tax norms and exemption limits updated!');
    computeTaxAssessment();
  });

  // Initial load
  computeTaxAssessment();
  renderSavedReturns();
});
