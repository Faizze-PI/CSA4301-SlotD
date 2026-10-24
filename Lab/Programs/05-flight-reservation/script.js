/**
 * Experiment 05: Online Flight Reservation System
 * GDS Airline Aggregation, Seat Allocation, Boarding Pass E-Tickets, and Revenue Reports
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Flight inventory seed data
  const defaultFlights = [
    {
      id: 'FL-402',
      airline: 'IndiGo Airlines',
      flightNo: '6E-402',
      from: 'MAA',
      fromCity: 'Chennai',
      to: 'DEL',
      toCity: 'New Delhi',
      depTime: '06:15',
      arrTime: '09:05',
      duration: '2h 50m',
      baseFare: 4850,
      seatsAvailable: 34
    },
    {
      id: 'FL-811',
      airline: 'Air India',
      flightNo: 'AI-811',
      from: 'MAA',
      fromCity: 'Chennai',
      to: 'DEL',
      toCity: 'New Delhi',
      depTime: '17:30',
      arrTime: '20:20',
      duration: '2h 50m',
      baseFare: 5400,
      seatsAvailable: 18
    },
    {
      id: 'FL-204',
      airline: 'Vistara',
      flightNo: 'UK-824',
      from: 'MAA',
      fromCity: 'Chennai',
      to: 'BOM',
      toCity: 'Mumbai',
      depTime: '09:40',
      arrTime: '11:35',
      duration: '1h 55m',
      baseFare: 4200,
      seatsAvailable: 22
    },
    {
      id: 'FL-991',
      airline: 'Emirates',
      flightNo: 'EK-545',
      from: 'MAA',
      fromCity: 'Chennai',
      to: 'DXB',
      toCity: 'Dubai',
      depTime: '04:15',
      arrTime: '07:05',
      duration: '4h 20m',
      baseFare: 18500,
      seatsAvailable: 14
    }
  ];

  // Bookings seed
  const defaultBookings = [
    {
      id: 'fb1',
      pnr: '6X9K2L',
      flightNo: '6E-402',
      airline: 'IndiGo Airlines',
      route: 'MAA to DEL',
      flightDate: '2026-10-20',
      passengerName: 'Faizze A.',
      seat: '12A (Window)',
      cabinClass: 'Economy',
      totalFare: 4850,
      status: 'Confirmed'
    }
  ];

  // Reviews seed
  const defaultFeedback = [
    { id: 'f1', passenger: 'Faizze A.', flightNo: '6E-402', rating: 5, comments: 'On-time departure, very smooth landing and courteous ground staff.' },
    { id: 'f2', passenger: 'Ananya S.', flightNo: 'AI-811', rating: 4, comments: 'Good hot meals served, comfortable legroom.' }
  ];

  db.seedIfEmpty('flight_inventory', defaultFlights);
  db.seedIfEmpty('flight_bookings', defaultBookings);
  db.seedIfEmpty('flight_feedback', defaultFeedback);

  // Role Switcher
  const roleSelect = document.getElementById('flightRoleSelect');
  const userSection = document.getElementById('flightUserSection');
  const adminSection = document.getElementById('flightAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminNetwork();
      renderAdminReports();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      searchFlights();
      renderUserFlights();
      renderFeedbackList();
    }
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#flightUserSection') || btn.closest('#flightAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- PASSENGER FUNCTIONS ---
  window.searchFlights = () => {
    const from = document.getElementById('flightFrom').value;
    const to = document.getElementById('flightTo').value;
    const cabin = document.getElementById('cabinClassSelect').value;
    const date = document.getElementById('flightDepartDate').value || '2026-10-20';

    const list = document.getElementById('flightsResultsList');
    list.innerHTML = '';

    const flights = db.get('flight_inventory').filter(f => f.from === from && f.to === to);

    if (flights.length === 0) {
      list.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted);">No direct flights available between ${from} and ${to}.</div>`;
      return;
    }

    // Cabin class multiplier
    let multiplier = 1;
    if (cabin === 'Premium Economy') multiplier = 1.4;
    if (cabin === 'Business') multiplier = 2.5;

    flights.forEach(f => {
      const adjustedFare = Math.round(f.baseFare * multiplier);
      const card = document.createElement('div');
      card.className = 'flight-card';
      card.innerHTML = `
        <div>
          <span class="badge badge-primary">${f.airline}</span>
          <span style="font-weight: 700; margin-left: 0.5rem;">${f.flightNo}</span>
          <div class="flight-route-time" style="margin: 0.5rem 0;">
            ${f.depTime} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-muted);">&rarr; (${f.duration}) &rarr;</span> ${f.arrTime}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
            ${f.fromCity} (${f.from}) &rarr; ${f.toCity} (${f.to}) | Non-stop
          </p>
          <p style="font-size: 0.8rem; color: var(--success); font-weight: 600; margin-top: 0.25rem;">
            ${f.seatsAvailable} seats remaining
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">₹${adjustedFare.toLocaleString()}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${cabin} Class</span>
          <div style="margin-top: 0.5rem;">
            <button class="btn btn-primary btn-sm" onclick="openFlightModal('${f.id}', ${adjustedFare}, '${cabin}')">Select Flight</button>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  };

  let activeBookingFlight = null;
  let activeFare = 0;
  let activeCabin = 'Economy';

  window.openFlightModal = (flightId, fare, cabin) => {
    const flight = db.findById('flight_inventory', flightId);
    if (!flight) return;

    activeBookingFlight = flight;
    activeFare = fare;
    activeCabin = cabin;

    document.getElementById('flightModalTitle').innerText = `${flight.airline} (${flight.flightNo}) - Booking`;
    document.getElementById('flightModalSubtitle').innerText = `${flight.fromCity} &rarr; ${flight.toCity} | ${cabin} Class`;
    updateFlightTotal();

    document.getElementById('flightModal').style.display = 'flex';
  };

  function updateFlightTotal() {
    const baggageExtra = parseInt(document.getElementById('baggageChoice').value, 10);
    let extraFee = 0;
    if (baggageExtra === 25) extraFee = 1200;
    if (baggageExtra === 35) extraFee = 2400;

    const total = activeFare + extraFee;
    document.getElementById('flightTotalDisplay').innerText = `₹${total.toLocaleString()}`;
    return total;
  }

  document.getElementById('baggageChoice').addEventListener('change', updateFlightTotal);

  window.closeFlightModal = () => {
    document.getElementById('flightModal').style.display = 'none';
    activeBookingFlight = null;
  };

  document.getElementById('flightBookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeBookingFlight) return;

    const passengerName = document.getElementById('passName').value.trim();
    const seat = document.getElementById('seatChoice').value;
    const finalFare = updateFlightTotal();
    const flightDate = document.getElementById('flightDepartDate').value || '2026-10-20';

    // Generate 6-character airline PNR
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    db.insert('flight_bookings', {
      pnr,
      flightNo: activeBookingFlight.flightNo,
      airline: activeBookingFlight.airline,
      route: `${activeBookingFlight.from} to ${activeBookingFlight.to}`,
      flightDate,
      passengerName,
      seat,
      cabinClass: activeCabin,
      totalFare: finalFare,
      status: 'Confirmed'
    });

    // Decrement available seats
    db.update('flight_inventory', activeBookingFlight.id, {
      seatsAvailable: Math.max(0, activeBookingFlight.seatsAvailable - 1)
    });

    alert(`Flight Booked Successfully!\nPNR: ${pnr}\nPassenger: ${passengerName}\nSeat: ${seat}\nBoarding pass issued.`);
    closeFlightModal();
    renderUserFlights();
    searchFlights();
  });

  function renderUserFlights() {
    const tbody = document.getElementById('userFlightsTableBody');
    tbody.innerHTML = '';
    const bookings = db.get('flight_bookings');

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.pnr}</strong></td>
        <td>${b.airline} (${b.flightNo})</td>
        <td>${b.route}</td>
        <td>${b.flightDate}</td>
        <td><span class="badge badge-primary">${b.seat}</span></td>
        <td>${b.cabinClass}</td>
        <td><span class="badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${b.status}</span></td>
        <td>
          ${b.status === 'Confirmed' ? `
            <button class="btn btn-secondary btn-sm" onclick="printBoardingPass('${b.pnr}')">Boarding Pass</button>
            <button class="btn btn-danger btn-sm" onclick="cancelFlightTicket('${b.pnr}')">Cancel</button>
          ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Cancelled</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.printBoardingPass = (pnr) => {
    const booking = db.get('flight_bookings').find(b => b.pnr === pnr);
    if (!booking) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Boarding Pass - ${booking.pnr}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .pass { border: 2px dashed #2563eb; padding: 1.5rem; max-width: 550px; margin: 0 auto; border-radius: 8px; }
        .title { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; margin-bottom: 1rem; }
      </style></head>
      <body>
        <div class="pass">
          <div class="title">
            <h2>${booking.airline}</h2>
            <h3>BOARDING PASS</h3>
          </div>
          <p><strong>PASSENGER:</strong> ${booking.passengerName}</p>
          <p><strong>PNR / BOOKING REF:</strong> <span style="font-size: 1.2rem; color: #2563eb; font-weight: bold;">${booking.pnr}</span></p>
          <p><strong>FLIGHT:</strong> ${booking.flightNo} | <strong>CLASS:</strong> ${booking.cabinClass}</p>
          <p><strong>ROUTE:</strong> ${booking.route} | <strong>DATE:</strong> ${booking.flightDate}</p>
          <p><strong>SEAT:</strong> <span style="font-size: 1.3rem; font-weight: bold;">${booking.seat}</span></p>
          <p><strong>GATE:</strong> 04B | <strong>BOARDING TIME:</strong> 45 min prior</p>
          <p style="text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: #64748b;">Please arrive at the security checkpoint with valid government photo identification.</p>
        </div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  window.cancelFlightTicket = (pnr) => {
    const booking = db.get('flight_bookings').find(b => b.pnr === pnr);
    if (!booking) return;

    if (confirm(`Cancel flight booking ${pnr}? Cancellation fee applies as per airline rules.`)) {
      db.update('flight_bookings', booking.id, { status: 'Cancelled' });
      alert(`Flight reservation ${pnr} has been cancelled.`);
      renderUserFlights();
      searchFlights();
    }
  };

  function renderFeedbackList() {
    const list = document.getElementById('flightReviewsList');
    list.innerHTML = '';
    const reviews = db.get('flight_feedback');

    reviews.forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '0.75rem';
      card.style.marginBottom = '0.5rem';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
          <strong>${r.passenger}</strong>
          <span style="color: #f59e0b;">${'★'.repeat(r.rating)}</span>
        </div>
        <small style="color: var(--primary);">Flight: ${r.flightNo}</small>
        <p style="font-size: 0.85rem; margin: 0.25rem 0 0 0; color: var(--text-muted);">${r.comments}</p>
      `;
      list.appendChild(card);
    });
  }

  document.getElementById('flightFeedbackForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const passenger = document.getElementById('fbPassengerName').value.trim();
    const flightNo = document.getElementById('fbFlightNo').value.trim();
    const rating = parseInt(document.getElementById('fbRating').value, 10);
    const comments = document.getElementById('fbComments').value.trim();

    db.insert('flight_feedback', { passenger, flightNo, rating, comments });
    alert('Thank you for your airline feedback!');
    document.getElementById('fbComments').value = '';
    renderFeedbackList();
  });

  // --- AIRLINE ADMIN FUNCTIONS ---
  function renderAdminNetwork() {
    const tbody = document.getElementById('adminFlightNetworkBody');
    tbody.innerHTML = '';
    const flights = db.get('flight_inventory');

    flights.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${f.flightNo}</strong> (${f.airline})</td>
        <td>${f.from} &rarr; ${f.to}</td>
        <td>${f.depTime} - ${f.arrTime}</td>
        <td>₹${f.baseFare}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFlightSchedule('${f.id}')">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.removeFlightSchedule = (id) => {
    if (confirm('Delete flight schedule from GDS network?')) {
      db.remove('flight_inventory', id);
      renderAdminNetwork();
    }
  };

  document.getElementById('adminScheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const flightNo = document.getElementById('adminFlightNo').value.trim();
    const from = document.getElementById('adminFlightFrom').value.trim().toUpperCase();
    const to = document.getElementById('adminFlightTo').value.trim().toUpperCase();
    const depTime = document.getElementById('adminDepTime').value;
    const arrTime = document.getElementById('adminArrTime').value;
    const baseFare = parseInt(document.getElementById('adminEconFare').value, 10);
    const seatsAvailable = parseInt(document.getElementById('adminSeatCount').value, 10);

    const newId = 'FL-' + Math.floor(100 + Math.random() * 900);
    db.insert('flight_inventory', {
      id: newId,
      airline: 'AeroGlobal',
      flightNo,
      from,
      fromCity: from,
      to,
      toCity: to,
      depTime,
      arrTime,
      duration: '2h 30m',
      baseFare,
      seatsAvailable
    });

    alert(`Flight ${flightNo} scheduled and published to GDS!`);
    document.getElementById('adminScheduleForm').reset();
    renderAdminNetwork();
  });

  function renderAdminReports() {
    const bookings = db.get('flight_bookings');
    const flights = db.get('flight_inventory');

    const confirmed = bookings.filter(b => b.status === 'Confirmed');
    const grossRevenue = confirmed.reduce((acc, b) => acc + (b.totalFare || 0), 0);

    document.getElementById('statFlightBookings').innerText = confirmed.length;
    document.getElementById('statFlightRevenue').innerText = `₹${grossRevenue.toLocaleString()}`;
    document.getElementById('statFlightsInAir').innerText = flights.length;

    const tbody = document.getElementById('adminGdsReportTableBody');
    tbody.innerHTML = '';

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.pnr}</strong></td>
        <td>${b.passengerName}</td>
        <td>${b.flightNo}</td>
        <td>${b.seat}</td>
        <td>₹${b.totalFare.toLocaleString()}</td>
        <td><span class="badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${b.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial runs
  const flightTomorrow = new Date();
  flightTomorrow.setDate(flightTomorrow.getDate() + 4);
  document.getElementById('flightDepartDate').value = flightTomorrow.toISOString().split('T')[0];

  searchFlights();
  renderUserFlights();
  renderFeedbackList();
});
