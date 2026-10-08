/**
 * Experiment 04: Online Train Reservation System
 * Implementation of PNR engine (Confirmed, RAC, WL), via-stops, and Refund calculations
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Trains seed data
  const defaultTrains = [
    {
      id: 'TR-12639',
      number: '12639',
      name: 'Brindavan Express',
      origin: 'MAS',
      originName: 'Chennai Central',
      dest: 'SBC',
      destName: 'Bangalore City',
      viaStops: 'Arakkonam, Katpadi, Jolarpettai, Bangarapet',
      depTime: '07:40',
      arrTime: '13:40',
      classes: {
        '1A': { fare: 1350, available: 4, rac: 2, wl: 0 },
        '2A': { fare: 890, available: 12, rac: 4, wl: 0 },
        '3A': { fare: 620, available: 25, rac: 6, wl: 0 },
        'SL': { fare: 245, available: 0, rac: 3, wl: 5 } // Demonstrating RAC / WL states
      }
    },
    {
      id: 'TR-12007',
      number: '12007',
      name: 'Mysore Shatabdi Express',
      origin: 'MAS',
      originName: 'Chennai Central',
      dest: 'SBC',
      destName: 'Bangalore City',
      viaStops: 'Katpadi, Jolarpettai',
      depTime: '06:00',
      arrTime: '10:45',
      classes: {
        '1A': { fare: 1850, available: 8, rac: 0, wl: 0 },
        '2A': { fare: 1150, available: 18, rac: 2, wl: 0 },
        '3A': { fare: 780, available: 40, rac: 5, wl: 0 }
      }
    },
    {
      id: 'TR-12675',
      number: '12675',
      name: 'Kovai Superfast Express',
      origin: 'MAS',
      originName: 'Chennai Central',
      dest: 'CBE',
      destName: 'Coimbatore Jn',
      viaStops: 'Arakkonam, Salem, Erode, Tiruppur',
      depTime: '06:10',
      arrTime: '14:05',
      classes: {
        '2A': { fare: 950, available: 15, rac: 3, wl: 0 },
        '3A': { fare: 680, available: 32, rac: 4, wl: 0 },
        'SL': { fare: 260, available: 48, rac: 10, wl: 0 }
      }
    }
  ];

  // Default Bookings seed
  const defaultBookings = [
    {
      id: 'rb1',
      pnr: '4210984712',
      trainNo: '12639',
      trainName: 'Brindavan Express',
      route: 'MAS to SBC',
      journeyDate: '2026-10-18',
      classType: '3A',
      passengers: ['Faizze A. (21)'],
      berthPref: 'Lower',
      totalFare: 620,
      pnrStatus: 'Confirmed (CNF - B2, Berth 35)',
      paymentMode: 'online',
      status: 'Confirmed'
    },
    {
      id: 'rb2',
      pnr: '8371920491',
      trainNo: '12639',
      trainName: 'Brindavan Express',
      route: 'MAS to SBC',
      journeyDate: '2026-10-12',
      classType: 'SL',
      passengers: ['Ramesh K. (28)'],
      berthPref: 'Side Lower',
      totalFare: 245,
      pnrStatus: 'RAC (RAC-4)',
      paymentMode: 'offline',
      status: 'Confirmed'
    }
  ];

  db.seedIfEmpty('rail_trains', defaultTrains);
  db.seedIfEmpty('rail_bookings', defaultBookings);

  // Role Switcher
  const roleSelect = document.getElementById('railRoleSelect');
  const userSection = document.getElementById('railUserSection');
  const adminSection = document.getElementById('railAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminTrains();
      renderAdminFares();
      renderAdminRefunds();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      searchTrains();
      renderUserBookings();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#railUserSection') || btn.closest('#railAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- PASSENGER VIEW FUNCTIONS ---
  window.searchTrains = () => {
    const from = document.getElementById('originStation').value;
    const to = document.getElementById('destStation').value;
    const preferredClass = document.getElementById('preferredClass').value;
    const date = document.getElementById('trainJourneyDate').value || '2026-10-15';

    const resultsDiv = document.getElementById('trainResultsList');
    resultsDiv.innerHTML = '';

    const trains = db.get('rail_trains').filter(t => t.origin === from && t.dest === to);

    if (trains.length === 0) {
      resultsDiv.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted);">No direct trains found between ${from} and ${to}.</div>`;
      return;
    }

    trains.forEach(t => {
      const card = document.createElement('div');
      card.className = 'train-card';

      let classBoxesHtml = '';
      for (const [cls, data] of Object.entries(t.classes)) {
        if (preferredClass !== 'ALL' && preferredClass !== cls) continue;

        let statusText = '';
        let statusClass = '';
        if (data.available > 0) {
          statusText = `AVL ${data.available}`;
          statusClass = 'avail-confirmed';
        } else if (data.rac > 0) {
          statusText = `RAC ${data.rac}`;
          statusClass = 'avail-rac';
        } else {
          statusText = `WL ${data.wl + 1}`;
          statusClass = 'avail-wl';
        }

        classBoxesHtml += `
          <div class="class-box" onclick="openTrainBookingModal('${t.id}', '${cls}')">
            <div style="font-weight: 700;">${cls}</div>
            <div style="font-size: 0.85rem; color: var(--primary);">₹${data.fare}</div>
            <div class="${statusClass}" style="font-size: 0.8rem; margin-top: 0.2rem;">${statusText}</div>
          </div>
        `;
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem;">${t.number} - ${t.name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0;">
              <strong>${t.originName} (${t.origin})</strong> &rarr; <strong>${t.destName} (${t.dest})</strong>
            </p>
            <p style="font-size: 0.8rem; color: #475569; margin: 0;">Via intermediate stops: <em>${t.viaStops}</em></p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.15rem; font-weight: 700;">${t.depTime} &rarr; ${t.arrTime}</div>
            <span class="badge badge-primary">Daily Express</span>
          </div>
        </div>
        <div class="class-avail-strip">
          ${classBoxesHtml}
        </div>
      `;
      resultsDiv.appendChild(card);
    });
  };

  let activeBookingTrain = null;
  let activeBookingClass = null;

  window.openTrainBookingModal = (trainId, classCode) => {
    const train = db.findById('rail_trains', trainId);
    if (!train) return;

    activeBookingTrain = train;
    activeBookingClass = classCode;

    document.getElementById('bookingModalTrainTitle').innerText = `${train.number} ${train.name} - Reservation`;
    document.getElementById('bookingModalTrainSubtitle').innerText = `${train.origin} &rarr; ${train.dest} | Journey Date: ${document.getElementById('trainJourneyDate').value || '2026-10-15'}`;

    const classSel = document.getElementById('modalClassSelect');
    classSel.innerHTML = '';
    for (const [cls, data] of Object.entries(train.classes)) {
      const opt = document.createElement('option');
      opt.value = cls;
      opt.innerText = `${cls} - ₹${data.fare}`;
      if (cls === classCode) opt.selected = true;
      classSel.appendChild(opt);
    }

    updateModalFare();
    document.getElementById('trainBookingModal').style.display = 'flex';
  };

  function updateModalFare() {
    if (!activeBookingTrain) return;
    const cls = document.getElementById('modalClassSelect').value;
    const passengers = document.getElementById('passengerListInput').value.split(',').filter(p => p.trim().length > 0);
    const count = passengers.length || 1;
    const baseFare = activeBookingTrain.classes[cls]?.fare || 500;
    document.getElementById('modalFareDisplay').innerText = `₹${(baseFare * count).toLocaleString()}`;
  }

  document.getElementById('modalClassSelect').addEventListener('change', updateModalFare);
  document.getElementById('passengerListInput').addEventListener('input', updateModalFare);

  window.closeTrainModal = () => {
    document.getElementById('trainBookingModal').style.display = 'none';
    activeBookingTrain = null;
    activeBookingClass = null;
  };

  document.getElementById('trainReservationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeBookingTrain) return;

    const chosenClass = document.getElementById('modalClassSelect').value;
    const passengerInput = document.getElementById('passengerListInput').value.trim();
    const passengers = passengerInput.split(',').map(p => p.trim());
    const berthPref = document.getElementById('berthPref').value;
    const paymentMode = document.getElementById('trainPaymentMode').value;
    const journeyDate = document.getElementById('trainJourneyDate').value || '2026-10-15';

    const classData = activeBookingTrain.classes[chosenClass];
    let pnrStatus = '';

    if (classData.available >= passengers.length) {
      classData.available -= passengers.length;
      pnrStatus = `Confirmed (CNF - Coach ${chosenClass}1, Berths ${Math.floor(10 + Math.random() * 50)})`;
    } else if (classData.rac >= passengers.length) {
      classData.rac -= passengers.length;
      pnrStatus = `RAC (RAC-${Math.floor(1 + Math.random() * 8)})`;
    } else {
      classData.wl += passengers.length;
      pnrStatus = `Waiting List (WL-${classData.wl})`;
    }

    // Generate unique 10-digit PNR
    const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const totalFare = classData.fare * passengers.length;

    db.insert('rail_bookings', {
      pnr,
      trainNo: activeBookingTrain.number,
      trainName: activeBookingTrain.name,
      route: `${activeBookingTrain.origin} to ${activeBookingTrain.dest}`,
      journeyDate,
      classType: chosenClass,
      passengers,
      berthPref,
      totalFare,
      pnrStatus,
      paymentMode,
      status: 'Confirmed'
    });

    db.update('rail_trains', activeBookingTrain.id, { classes: activeBookingTrain.classes });

    alert(`Ticket Reserved Successfully!\nGenerated PNR: ${pnr}\nStatus: ${pnrStatus}\nTotal Fare: ₹${totalFare}`);
    closeTrainModal();
    searchTrains();
    renderUserBookings();
  });

  // PNR Status Search
  window.checkPnrStatus = () => {
    const pnr = document.getElementById('pnrSearchInput').value.trim();
    const resultCard = document.getElementById('pnrResultCard');

    if (!pnr) {
      alert('Please enter a 10-digit PNR.');
      return;
    }

    const booking = db.get('rail_bookings').find(b => b.pnr === pnr);

    if (!booking) {
      resultCard.style.display = 'block';
      resultCard.innerHTML = `<p style="color: var(--danger); font-weight: 600;">PNR ${pnr} not found in the reservation system.</p>`;
      return;
    }

    resultCard.style.display = 'block';
    resultCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <h3 style="margin: 0;">PNR: ${booking.pnr}</h3>
        <span class="badge ${booking.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${booking.status}</span>
      </div>
      <p style="margin: 0.25rem 0;"><strong>Train:</strong> ${booking.trainNo} - ${booking.trainName}</p>
      <p style="margin: 0.25rem 0;"><strong>Journey Date:</strong> ${booking.journeyDate} | <strong>Class:</strong> ${booking.classType}</p>
      <p style="margin: 0.25rem 0;"><strong>Passengers:</strong> ${booking.passengers.join(', ')}</p>
      <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; margin-top: 0.75rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Current Booking Status:</span>
        <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">${booking.pnrStatus}</div>
      </div>
    `;
  };

  // User Bookings Table
  function renderUserBookings() {
    const tbody = document.getElementById('userTrainBookingsTableBody');
    tbody.innerHTML = '';
    const bookings = db.get('rail_bookings');

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.pnr}</strong></td>
        <td>${b.trainNo} - ${b.trainName}</td>
        <td>${b.journeyDate}</td>
        <td><span class="badge badge-primary">${b.classType}</span></td>
        <td>${b.passengers.join(', ')}</td>
        <td>₹${b.totalFare}</td>
        <td><span class="badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${b.status}</span></td>
        <td>
          ${b.status === 'Confirmed' ? `
            <button class="btn btn-secondary btn-sm" onclick="printTrainTicket('${b.pnr}')">Print Ticket</button>
            <button class="btn btn-danger btn-sm" onclick="cancelTrainTicket('${b.pnr}')">Cancel</button>
          ` : `<span style="font-size: 0.8rem; color: var(--text-muted);">${b.status}</span>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.printTrainTicket = (pnr) => {
    const booking = db.get('rail_bookings').find(b => b.pnr === pnr);
    if (!booking) return;
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html><head><title>Electronic Reservation Slip (ERS) - PNR ${booking.pnr}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .ticket-box { border: 2px solid #000; padding: 1.5rem; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1rem; }
      </style></head>
      <body>
        <div class="ticket-box">
          <div class="header">
            <h2>INDIAN RAILWAY RESERVATION E-TICKET</h2>
            <p><strong>PNR NUMBER: ${booking.pnr}</strong></p>
          </div>
          <p><strong>Train:</strong> ${booking.trainNo} - ${booking.trainName}</p>
          <p><strong>Route:</strong> ${booking.route} | <strong>Class:</strong> ${booking.classType}</p>
          <p><strong>Date of Journey:</strong> ${booking.journeyDate}</p>
          <p><strong>Passenger(s):</strong> ${booking.passengers.join(', ')}</p>
          <p><strong>Status:</strong> ${booking.pnrStatus}</p>
          <p><strong>Fare Collected:</strong> ₹${booking.totalFare} (${booking.paymentMode})</p>
          <p style="text-align: center; margin-top: 1.5rem;"><em>Valid with original Photo Identity Card during journey.</em></p>
        </div>
      </body></html>
    `);
    printWin.document.close();
    printWin.print();
  };

  window.cancelTrainTicket = (pnr) => {
    const booking = db.get('rail_bookings').find(b => b.pnr === pnr);
    if (!booking) return;

    // Refund rules:
    // > 48 hours: 75% refund (25% deduction)
    // 12 - 48 hours: 50% refund
    // < 12 hours: 25% refund
    const refundPercent = 75; // Standard advance cancellation
    const refundAmount = Math.round((booking.totalFare * refundPercent) / 100);

    if (confirm(`Cancel reservation for PNR ${pnr}?\nFare: ₹${booking.totalFare}\nRefundable: ${refundPercent}% (₹${refundAmount})\nCancellation will be queued for Admin approval.`)) {
      db.update('rail_bookings', booking.id, {
        status: 'Cancellation Pending',
        refundPercent,
        refundAmount
      });
      alert(`Cancellation request submitted for PNR ${pnr}. Refund of ₹${refundAmount} will be processed.`);
      renderUserBookings();
    }
  };

  window.showRefundRules = () => {
    alert(`Railway Cancellation Refund Rules:\n1. Cancellation > 48 Hours before departure: 75% refund.\n2. Cancellation between 12 to 48 Hours before: 50% refund.\n3. Cancellation < 12 Hours before departure: 25% refund.\n4. Admin processes refund credits back to passenger.`);
  };

  // --- RAILWAY ADMIN FUNCTIONS ---
  function renderAdminTrains() {
    const tbody = document.getElementById('adminTrainsTableBody');
    tbody.innerHTML = '';
    const trains = db.get('rail_trains');

    trains.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.number}</strong> ${t.name}</td>
        <td>${t.origin} &rarr; ${t.dest}</td>
        <td><small>${t.viaStops}</small></td>
        <td><button class="btn btn-danger btn-sm" onclick="removeTrain('${t.id}')">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.removeTrain = (id) => {
    if (confirm('Delete train schedule?')) {
      db.remove('rail_trains', id);
      renderAdminTrains();
    }
  };

  document.getElementById('adminTrainForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('adminTrainName').value.trim();
    const origin = document.getElementById('adminOrigin').value.trim();
    const dest = document.getElementById('adminDest').value.trim();
    const viaStops = document.getElementById('adminViaStops').value.trim();
    const depTime = document.getElementById('adminDepTime').value;
    const arrTime = document.getElementById('adminArrTime').value;

    const newId = 'TR-' + Math.floor(10000 + Math.random() * 90000);
    db.insert('rail_trains', {
      id: newId,
      number: newId.replace('TR-', ''),
      name,
      origin,
      originName: origin,
      dest,
      destName: dest,
      viaStops,
      depTime,
      arrTime,
      classes: {
        '2A': { fare: 900, available: 10, rac: 4, wl: 0 },
        '3A': { fare: 650, available: 20, rac: 5, wl: 0 },
        'SL': { fare: 250, available: 40, rac: 8, wl: 0 }
      }
    });

    alert('Train schedule added successfully!');
    document.getElementById('adminTrainForm').reset();
    renderAdminTrains();
  });

  function renderAdminFares() {
    const tbody = document.getElementById('adminFaresTableBody');
    tbody.innerHTML = `
      <tr><td><strong>1A</strong></td><td>AC First Class</td><td>₹1,350</td><td>10 berths</td><td>2 berths</td></tr>
      <tr><td><strong>2A</strong></td><td>AC 2-Tier Sleeper</td><td>₹890</td><td>24 berths</td><td>4 berths</td></tr>
      <tr><td><strong>3A</strong></td><td>AC 3-Tier Sleeper</td><td>₹620</td><td>48 berths</td><td>6 berths</td></tr>
      <tr><td><strong>SL</strong></td><td>Sleeper Class</td><td>₹245</td><td>72 berths</td><td>12 berths</td></tr>
    `;
  }

  function renderAdminRefunds() {
    const tbody = document.getElementById('adminRefundsTableBody');
    tbody.innerHTML = '';
    const bookings = db.get('rail_bookings').filter(b => b.status === 'Cancellation Pending');

    if (bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No pending cancellation refunds.</td></tr>';
      return;
    }

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.pnr}</strong></td>
        <td>${b.passengers.join(', ')}</td>
        <td>₹${b.totalFare}</td>
        <td>${b.refundPercent}%</td>
        <td><strong>₹${b.refundAmount}</strong></td>
        <td><button class="btn btn-success btn-sm" onclick="approveRefund('${b.id}')">Approve & Disburse</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.approveRefund = (id) => {
    const booking = db.findById('rail_bookings', id);
    if (!booking) return;

    db.update('rail_bookings', id, { status: `Cancelled (Refunded ₹${booking.refundAmount})` });
    alert(`Refund of ₹${booking.refundAmount} approved and disbursed to passenger for PNR ${booking.pnr}.`);
    renderAdminRefunds();
    renderUserBookings();
  };

  // Initial runs
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  document.getElementById('trainJourneyDate').value = tomorrow.toISOString().split('T')[0];

  searchTrains();
  renderUserBookings();
});
