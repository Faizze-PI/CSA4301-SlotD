/**
 * Experiment 02: Online Hotel Room Booking Website
 * Logic for 4 Room Types, 3-Day Cancellation Rule, Admin CMS & Pricing
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Initialize Default Rooms (Exactly 4 types required by document)
  const defaultRooms = [
    { id: 'r1', name: 'Standard Deluxe Room', price: 2500, quantity: 10, amenities: ['Queen Bed', 'Free Wi-Fi', 'Air Conditioning', 'Flat TV'] },
    { id: 'r2', name: 'Executive Suite', price: 4200, quantity: 6, amenities: ['King Bed', 'City View', 'Complimentary Breakfast', 'Mini Bar'] },
    { id: 'r3', name: 'Family Garden Suite', price: 5800, quantity: 4, amenities: ['2 Double Beds', 'Garden Access', 'Kitchenette', 'Bathtub'] },
    { id: 'r4', name: 'Presidential Penthouse', price: 12000, quantity: 2, amenities: ['Panoramic Skyline', 'Private Jacuzzi', 'Butler Service', 'Lounge Access'] }
  ];

  // Default Bookings
  const defaultBookings = [
    {
      id: 'HB-101',
      guestName: 'Alex Morgan',
      guestEmail: 'alex.morgan@example.com',
      roomId: 'r2',
      roomName: 'Executive Suite',
      checkIn: '2026-10-15',
      checkOut: '2026-10-18',
      nights: 3,
      totalCost: 12600,
      status: 'Confirmed',
      paymentMode: 'credit'
    },
    {
      id: 'HB-102',
      guestName: 'Alex Morgan',
      guestEmail: 'alex.morgan@example.com',
      roomId: 'r1',
      roomName: 'Standard Deluxe Room',
      checkIn: '2026-10-07', // Due very soon (test 3-day rule)
      checkOut: '2026-10-09',
      nights: 2,
      totalCost: 5000,
      status: 'Confirmed',
      paymentMode: 'upi'
    }
  ];

  // Default CMS Content
  const defaultCms = {
    aboutUs: '<h3>About Grand Vista Hotel</h3><p>Welcome to Grand Vista, offering premier hospitality with world-class dining, luxurious suites, and exceptional service in the heart of the city.</p>',
    roomInfo: '<h3>Room Types & Accommodations</h3><p>We feature four distinctive tiers of rooms engineered for business travelers and vacationing families alike: Standard Deluxe, Executive Suite, Family Garden Suite, and the Presidential Penthouse.</p>',
    contactUs: '<h3>Contact Hotel Front Desk</h3><p><strong>Address:</strong> 104 Grand Boulevard, Central Bay<br><strong>Phone:</strong> +91 (044) 2345-6789<br><strong>Email:</strong> reservations@grandvista.com</p>',
    qaDetails: '<h3>Customer Service Q&A</h3><p><strong>Q: What is check-in time?</strong><br>A: Check-in begins at 2:00 PM and check-out is at 11:00 AM.</p><p><strong>Q: What is the cancellation policy?</strong><br>A: Guests can cancel or reschedule bookings up to 3 full days prior to arrival for a 100% refund.</p>',
    travelGuide: '<h3>Local Travel & Shipping Guide</h3><p>Conveniently located 15 minutes from the airport with shuttle access. Local courier and luggage shipping services available at the concierge counter.</p>',
    privacyPolicy: '<h3>Privacy Policy</h3><p>We respect your privacy. Guest information is securely encrypted and used strictly for reservation management and billing compliance.</p>'
  };

  db.seedIfEmpty('hotel_rooms', defaultRooms);
  db.seedIfEmpty('hotel_bookings', defaultBookings);
  db.seedIfEmpty('hotel_cms', defaultCms);

  // Role Switcher
  const roleSelect = document.getElementById('hotelRoleSelect');
  const userSection = document.getElementById('hotelUserSection');
  const adminSection = document.getElementById('hotelAdminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminRooms();
      renderAdminBookings();
      loadCmsEditor();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderAvailableRooms();
      renderUserBookings();
      renderStaticContent('aboutContent');
    }
  });

  // Tab Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.nav-tabs');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.tab;
      const section = btn.closest('#hotelUserSection') || btn.closest('#hotelAdminSection');
      section.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Helper: check 3-day cancellation rule
  function checkThreeDayEligibility(checkInDateStr) {
    const checkIn = new Date(checkInDateStr);
    const today = new Date();
    // Normalize to date boundary
    today.setHours(0, 0, 0, 0);
    checkIn.setHours(0, 0, 0, 0);

    const diffMs = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      allowed: diffDays >= 3,
      daysRemaining: diffDays
    };
  }

  // --- USER INTERFACE FUNCTIONS ---
  let selectedBookingRoom = null;

  function renderAvailableRooms() {
    const grid = document.getElementById('availableRoomsGrid');
    grid.innerHTML = '';
    const rooms = db.get('hotel_rooms');

    const checkInVal = document.getElementById('searchCheckIn').value || '2026-10-12';
    const checkOutVal = document.getElementById('searchCheckOut').value || '2026-10-14';

    rooms.forEach(room => {
      const card = document.createElement('div');
      card.className = 'room-card';
      card.innerHTML = `
        <div>
          <h3 class="room-title">${room.name}</h3>
          <div class="room-price">₹${room.price.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ night</span></div>
          <div style="margin: 0.75rem 0;">
            ${room.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Available Capacity: <strong>${room.quantity} rooms</strong></p>
        </div>
        <div style="margin-top: 1rem;">
          <button class="btn btn-primary" style="width: 100%;" onclick="openBookingModal('${room.id}', '${checkInVal}', '${checkOutVal}')">Book Now</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  window.openBookingModal = (roomId, checkIn, checkOut) => {
    const room = db.findById('hotel_rooms', roomId);
    if (!room) return;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    let diffDays = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) diffDays = 1;

    const total = room.price * diffDays;
    selectedBookingRoom = { room, checkIn, checkOut, diffDays, total };

    document.getElementById('modalRoomTitle').innerText = `Confirm Reservation: ${room.name}`;
    document.getElementById('modalSummary').innerHTML = `
      <p><strong>Dates:</strong> ${checkIn} to ${checkOut} (${diffDays} night/s)</p>
      <p><strong>Rate:</strong> ₹${room.price} x ${diffDays} = <strong>₹${total.toLocaleString()}</strong></p>
      <p style="color: var(--text-muted); font-size: 0.85rem;">Cancellation allowed up to 3 days before ${checkIn}.</p>
    `;

    document.getElementById('bookingModal').style.display = 'flex';
  };

  window.closeBookingModal = () => {
    document.getElementById('bookingModal').style.display = 'none';
    selectedBookingRoom = null;
  };

  document.getElementById('confirmBookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedBookingRoom) return;

    const newId = 'HB-' + Math.floor(100 + Math.random() * 900);
    const paymentMode = document.getElementById('paymentMode').value;

    db.insert('hotel_bookings', {
      id: newId,
      guestName: document.getElementById('guestName').value,
      guestEmail: document.getElementById('guestEmail').value,
      roomId: selectedBookingRoom.room.id,
      roomName: selectedBookingRoom.room.name,
      checkIn: selectedBookingRoom.checkIn,
      checkOut: selectedBookingRoom.checkOut,
      nights: selectedBookingRoom.diffDays,
      totalCost: selectedBookingRoom.total,
      status: 'Confirmed',
      paymentMode
    });

    alert(`Reservation Confirmed! Booking ID: ${newId}. Confirmation receipt sent.`);
    closeBookingModal();
    renderUserBookings();
    renderAvailableRooms();
  });

  function renderUserBookings() {
    const tbody = document.getElementById('userBookingsTableBody');
    tbody.innerHTML = '';
    const bookings = db.get('hotel_bookings');

    bookings.forEach(b => {
      const eligibility = checkThreeDayEligibility(b.checkIn);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.id}</strong></td>
        <td>${b.roomName}</td>
        <td>${b.checkIn}</td>
        <td>${b.checkOut}</td>
        <td>₹${b.totalCost.toLocaleString()}</td>
        <td><span class="badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${b.status}</span></td>
        <td>
          ${b.status === 'Confirmed' ? `
            <button class="btn btn-secondary btn-sm" onclick="modifyBookingUser('${b.id}')">Reschedule</button>
            <button class="btn btn-danger btn-sm" onclick="cancelBookingUser('${b.id}')">Cancel</button>
            <div style="font-size: 0.72rem; color: ${eligibility.allowed ? 'var(--success)' : 'var(--danger)'}; margin-top: 0.25rem;">
              ${eligibility.allowed ? `Eligible (${eligibility.daysRemaining} days left)` : `Locked (${eligibility.daysRemaining} days left - 3-day rule)`}
            </div>
          ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Cancelled</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.cancelBookingUser = (bookingId) => {
    const booking = db.findById('hotel_bookings', bookingId);
    if (!booking) return;

    const check = checkThreeDayEligibility(booking.checkIn);
    if (!check.allowed) {
      alert(`Cannot cancel reservation! Under hotel policy, cancellations are only permitted at least 3 days before check-in. (Days remaining: ${check.daysRemaining})`);
      return;
    }

    if (confirm(`Are you sure you want to cancel booking ${bookingId}? 100% refund will be issued.`)) {
      db.update('hotel_bookings', bookingId, { status: 'Cancelled by Guest' });
      alert('Booking cancelled successfully.');
      renderUserBookings();
    }
  };

  window.modifyBookingUser = (bookingId) => {
    const booking = db.findById('hotel_bookings', bookingId);
    if (!booking) return;

    const check = checkThreeDayEligibility(booking.checkIn);
    if (!check.allowed) {
      alert(`Cannot reschedule reservation! Under hotel policy, modifications must be made at least 3 days before check-in.`);
      return;
    }

    const newDate = prompt('Enter new Check-In date (YYYY-MM-DD):', booking.checkIn);
    if (newDate) {
      db.update('hotel_bookings', bookingId, { checkIn: newDate });
      alert('Check-in date updated successfully!');
      renderUserBookings();
    }
  };

  // Static CMS View in Guest Tab
  const subTabButtons = document.querySelectorAll('.sub-tab-btn');
  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      subTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStaticContent(btn.dataset.content);
    });
  });

  function renderStaticContent(key) {
    const cms = db.get('hotel_cms') || defaultCms;
    const mapping = {
      aboutContent: cms.aboutUs,
      roomInfoContent: cms.roomInfo,
      contactContent: cms.contactUs,
      qaContent: cms.qaDetails,
      travelContent: cms.travelGuide,
      privacyContent: cms.privacyPolicy
    };
    document.getElementById('staticDisplayArea').innerHTML = mapping[key] || '<p>Content unavailable.</p>';
  }

  // --- ADMINISTRATOR FUNCTIONS ---
  function renderAdminRooms() {
    const tbody = document.getElementById('adminRoomsTableBody');
    tbody.innerHTML = '';
    const rooms = db.get('hotel_rooms');

    rooms.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.name}</strong></td>
        <td><input type="number" id="price_${r.id}" class="form-control" style="width: 120px;" value="${r.price}"></td>
        <td><input type="number" id="qty_${r.id}" class="form-control" style="width: 90px;" value="${r.quantity}"></td>
        <td>${r.amenities.join(', ')}</td>
        <td><button class="btn btn-primary btn-sm" onclick="saveAdminRoom('${r.id}')">Save</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.saveAdminRoom = (roomId) => {
    const newPrice = parseInt(document.getElementById(`price_${roomId}`).value, 10);
    const newQty = parseInt(document.getElementById(`qty_${roomId}`).value, 10);
    db.update('hotel_rooms', roomId, { price: newPrice, quantity: newQty });
    alert('Room price and inventory quantity updated!');
    renderAdminRooms();
  };

  function renderAdminBookings() {
    const tbody = document.getElementById('adminBookingsTableBody');
    tbody.innerHTML = '';
    const bookings = db.get('hotel_bookings');

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.id}</strong></td>
        <td>${b.guestName}</td>
        <td>${b.roomName}</td>
        <td>${b.checkIn} to ${b.checkOut}</td>
        <td>₹${b.totalCost}</td>
        <td><span class="badge ${b.status.includes('Cancelled') ? 'badge-danger' : 'badge-success'}">${b.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="adminEditBookingDates('${b.id}')">Edit Dates</button>
          <button class="btn btn-danger btn-sm" onclick="adminCancelBooking('${b.id}')">Cancel</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.adminCancelBooking = (bookingId) => {
    if (confirm(`Administrator override: Cancel booking ${bookingId}?`)) {
      db.update('hotel_bookings', bookingId, { status: 'Cancelled by Administrator' });
      alert('Booking cancelled by Admin.');
      renderAdminBookings();
    }
  };

  window.adminEditBookingDates = (bookingId) => {
    const b = db.findById('hotel_bookings', bookingId);
    if (!b) return;
    const newIn = prompt('Edit Check-in Date:', b.checkIn);
    const newOut = prompt('Edit Check-out Date:', b.checkOut);
    if (newIn && newOut) {
      db.update('hotel_bookings', bookingId, { checkIn: newIn, checkOut: newOut });
      alert('Dates updated by Administrator.');
      renderAdminBookings();
    }
  };

  function loadCmsEditor() {
    const cms = db.get('hotel_cms') || defaultCms;
    const key = document.getElementById('cmsPageSelect').value;
    document.getElementById('cmsContentText').value = cms[key] || '';
  }

  document.getElementById('cmsPageSelect').addEventListener('change', loadCmsEditor);

  document.getElementById('saveCmsBtn').addEventListener('click', () => {
    const key = document.getElementById('cmsPageSelect').value;
    const content = document.getElementById('cmsContentText').value;
    const cms = db.get('hotel_cms') || defaultCms;
    cms[key] = content;
    db.set('hotel_cms', cms);
    alert('Static page content published successfully!');
  });

  // Initial runs
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  document.getElementById('searchCheckIn').value = todayStr;
  document.getElementById('searchCheckOut').value = nextWeek.toISOString().split('T')[0];

  renderAvailableRooms();
  renderUserBookings();
  renderStaticContent('aboutContent');
});
