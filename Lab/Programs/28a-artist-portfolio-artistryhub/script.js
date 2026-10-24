/**
 * ArtistryHub - Emily Harris Artist Portfolio & Exhibition Studio
 * Experiment 28a - CSA4301 Internet Programming Lab
 */

const STORAGE_KEYS = {
  ARTWORKS: 'artistry_artworks_v1',
  MESSAGES: 'artistry_messages_v1',
  CART: 'artistry_cart_v1'
};

const DEFAULT_ARTWORKS = [
  {
    id: 'ART-01',
    title: 'Resonances of Solitude No. 4',
    category: 'Oil on Canvas',
    year: 2024,
    dimensions: '200 x 160 cm',
    price: 6500,
    cssClass: 'oil',
    desc: 'Lapis lazuli and iron oxide glazed over Belgian raw linen. Premiered at the 60th Venice International Biennale to critical acclaim.'
  },
  {
    id: 'ART-02',
    title: 'Tidal Frequencies (Cornish Coast)',
    category: 'Modern Abstract',
    year: 2023,
    dimensions: '180 x 140 cm',
    price: 5200,
    cssClass: 'abstract',
    desc: 'Gestural impasto capturing the raw thermodynamic turbulence of the Atlantic shoreline under moonlight.'
  },
  {
    id: 'ART-03',
    title: 'Anatomy of Silence in Sepia',
    category: 'Charcoal & Ink',
    year: 2024,
    dimensions: '120 x 90 cm',
    price: 3400,
    cssClass: 'ink',
    desc: 'Hand-pulled sumi ink and vine charcoal on heavy handmade Japanese washi paper. Explores negative space and breath.'
  },
  {
    id: 'ART-04',
    title: 'Subterranean Hymn (Venice Nocturne)',
    category: 'Oil on Canvas',
    year: 2022,
    dimensions: '190 x 150 cm',
    price: 7000,
    cssClass: 'oil',
    desc: 'Deep prussian blue layered with gold leaf leafing. Permanent collection of the Fondazione Querini Stampalia.'
  },
  {
    id: 'ART-05',
    title: 'Chromatic Pulse: Red Shift',
    category: 'Modern Abstract',
    year: 2024,
    dimensions: '150 x 150 cm',
    price: 4800,
    cssClass: 'abstract',
    desc: 'Vibrant cadmium reds vibrating against deep raw umber. Accompanied by original 432 Hz cello soundscape.'
  },
  {
    id: 'ART-06',
    title: 'Fragments of Memory: Shoreline',
    category: 'Charcoal & Ink',
    year: 2025,
    dimensions: '100 x 80 cm',
    price: 2900,
    cssClass: 'ink',
    desc: 'Intricate dry-brush striations depicting coastal bedrock erosion over glacial time scales.'
  }
];

const DEFAULT_TRACKS = [
  { id: 1, title: 'Whispers of the Atlantic (Rain on Canvas)', album: 'Resonances of Solitude', duration: '04:30' },
  { id: 2, title: 'Nocturne for St Ives Cello & Tide', album: 'Venice Ambient Sessions', duration: '05:12' },
  { id: 3, title: 'Binaural Drift in Ultramarine', album: 'Soundscapes from the Atelier', duration: '03:45' }
];

const DEFAULT_BIBLIOGRAPHY = [
  { type: 'Monograph Book', title: 'Emily Harris: Resonances & Pigments', publisher: 'Thames & Hudson, London', year: '2023', code: 'ISBN 978-0-500-29641-8' },
  { type: 'Exhibition Catalogue', title: 'Echoes in Ochre (Hayward Retrospective)', publisher: 'Hayward Gallery Publishing', year: '2022', code: 'ISBN 978-1-853-32389-1' },
  { type: 'Vinyl Soundscape Album', title: 'Sonic Canvases: Live at Biennale', publisher: 'Erased Tapes Records', year: '2024', code: 'UPC 7-11297-52912-3' },
  { type: 'Critical Essay Anthology', title: 'Tactile Silence: Contemporary British Painters', publisher: 'Routledge Fine Arts', year: '2021', code: 'ISBN 978-0-367-48192-0' }
];

const DEFAULT_EXHIBITIONS = [
  { title: 'Venice Contemporary Biennale', venue: 'Giardini & Arsenale, Venice, Italy', dates: 'May 10 - Nov 24, 2026', status: 'Upcoming Solo Pavilion' },
  { title: 'Echoes of Light & Salt', venue: 'Victoria Miro Gallery, London, UK', dates: 'Dec 05 - Jan 28, 2027', status: 'Winter Showcase' },
  { title: 'Pacific Horizon Triennial', venue: 'Tokyo Metropolitan Art Museum, Japan', dates: 'March 15 - June 20, 2027', status: 'Guest Master Artist' }
];

const DEFAULT_MESSAGES = [
  { id: 'MSG-01', from: 'Dr. Clara Beauchamp', email: 'curator@centrepompidou.fr', purpose: 'Museum Loan', message: 'Inquiring regarding the availability of Resonances of Solitude No. 4 for our 2027 European Abstraction retrospective in Paris.', date: '2026-10-02' },
  { id: 'MSG-02', from: 'Jonathan Vance', email: 'jvance@collection-sf.com', purpose: 'Private Art Commission', message: 'Would love to discuss a bespoke 3-meter diptych for our contemporary residence overlooking Monterey Bay.', date: '2026-10-05' }
];

let appState = {
  currentRole: 'fan',
  activeFanTab: 'portfolio',
  artworks: [],
  cart: [],
  messages: [],
  isPlayingAudio: false,
  audioTimer: null,
  currentTrackIndex: 0
};

document.addEventListener('DOMContentLoaded', () => {
  initializeDatabase();
  renderApp();
});

function initializeDatabase() {
  const storedArtworks = labDB.get(STORAGE_KEYS.ARTWORKS);
  if (!storedArtworks || storedArtworks.length === 0) {
    labDB.set(STORAGE_KEYS.ARTWORKS, DEFAULT_ARTWORKS);
    appState.artworks = [...DEFAULT_ARTWORKS];
  } else {
    appState.artworks = storedArtworks;
  }

  const storedMessages = labDB.get(STORAGE_KEYS.MESSAGES);
  if (!storedMessages || storedMessages.length === 0) {
    labDB.set(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    appState.messages = [...DEFAULT_MESSAGES];
  } else {
    appState.messages = storedMessages;
  }

  appState.cart = labDB.get(STORAGE_KEYS.CART) || [];
}

function renderApp() {
  renderArtworksGrid();
  renderTracklist();
  renderBibliography();
  renderExhibitions();
  renderStoreProducts();
  renderAdminMessages();
  updateCartBadge();
  updateAdminMetrics();
}

// Role Switching
function switchRole(role) {
  appState.currentRole = role;
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  document.getElementById('fanSection').classList.toggle('hidden', role !== 'fan');
  document.getElementById('artistSection').classList.toggle('hidden', role !== 'artist');

  if (role === 'artist') {
    renderAdminMessages();
    updateAdminMetrics();
  }
}

// Tab Switching
function switchFanTab(tabName) {
  appState.activeFanTab = tabName;
  const tabs = {
    portfolio: 'fanTabPortfolio',
    bio: 'fanTabBio',
    audio: 'fanTabAudio',
    bibliography: 'fanTabBibliography',
    exhibitions: 'fanTabExhibitions',
    store: 'fanTabStore',
    contact: 'fanTabContact'
  };

  document.querySelectorAll('#fanSection .tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', Object.keys(tabs)[idx] === tabName);
  });

  Object.values(tabs).forEach(paneId => {
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.toggle('active', paneId === tabs[tabName]);
  });
}

function scrollSectionTo(tabName) {
  switchFanTab(tabName);
  window.scrollTo({ top: 380, behavior: 'smooth' });
}

// Gallery & Portfolio
function filterArtworks(cat, buttonEl) {
  if (buttonEl) {
    buttonEl.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    buttonEl.classList.add('active');
  }
  renderArtworksGrid(cat);
}

function renderArtworksGrid(filterCategory = 'All') {
  const grid = document.getElementById('artworksGrid');
  if (!grid) return;

  let list = appState.artworks;
  if (filterCategory !== 'All') {
    list = list.filter(a => a.category === filterCategory);
  }

  grid.innerHTML = list.map(a => `
    <div class="artwork-card">
      <div class="art-canvas-preview ${a.cssClass || 'oil'}">
        <span class="art-badge-tag badge badge-primary text-xs">${a.category}</span>
        <span style="font-size: 3.5rem;">🖼️</span>
        <span class="text-xs muted" style="position: absolute; bottom: 8px; left: 12px;">${a.dimensions} (${a.year})</span>
      </div>
      <div class="art-info-body">
        <div>
          <h4>${a.title}</h4>
          <p class="text-xs muted my-1">${a.desc}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem;">
          <span class="font-bold text-success">Print: ₹${a.price}</span>
          <button class="btn btn-outline btn-xs" onclick="addToCart('${a.id}')">🛒 Buy Limited Print</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Audio Player
function renderTracklist() {
  const container = document.getElementById('tracklistContainer');
  if (!container) return;

  container.innerHTML = DEFAULT_TRACKS.map((t, idx) => `
    <div class="track-item-row ${idx === appState.currentTrackIndex ? 'active-track' : ''}" onclick="selectAudioTrack(${idx})">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="font-mono text-xs">${idx + 1}.</span>
        <strong>${t.title}</strong>
      </div>
      <span class="font-mono text-xs muted">${t.duration}</span>
    </div>
  `).join('');
}

function selectAudioTrack(idx) {
  appState.currentTrackIndex = idx;
  const t = DEFAULT_TRACKS[idx];

  document.getElementById('audioTrackTitle').innerText = `Track 0${t.id}: ${t.title}`;
  document.getElementById('audioTrackAlbum').innerText = `Album: ${t.album}`;
  renderTracklist();

  if (!appState.isPlayingAudio) {
    toggleAudioPlay();
  }
}

function toggleAudioPlay() {
  appState.isPlayingAudio = !appState.isPlayingAudio;
  const btn = document.getElementById('btnAudioPlay');
  const fill = document.getElementById('audioProgressFill');

  if (appState.isPlayingAudio) {
    if (btn) btn.innerText = '⏸ Pause Track';
    showAlert('Now Playing ambient soundscape: ' + DEFAULT_TRACKS[appState.currentTrackIndex].title, 'info');

    let pct = 30;
    appState.audioTimer = setInterval(() => {
      pct = (pct + 1) % 100;
      if (fill) fill.style.width = pct + '%';
    }, 1000);
  } else {
    if (btn) btn.innerText = '▶ Play Track';
    if (appState.audioTimer) clearInterval(appState.audioTimer);
  }
}

// Bibliography & Exhibitions
function renderBibliography() {
  const tbody = document.getElementById('bibliographyTableBody');
  if (!tbody) return;

  tbody.innerHTML = DEFAULT_BIBLIOGRAPHY.map(b => `
    <tr>
      <td><span class="badge badge-secondary text-xs">${b.type}</span></td>
      <td><strong>${b.title}</strong></td>
      <td>${b.publisher}</td>
      <td class="font-mono">${b.year}</td>
      <td class="font-mono text-xs text-primary">${b.code}</td>
    </tr>
  `).join('');
}

function renderExhibitions() {
  const container = document.getElementById('exhibitionsList');
  if (!container) return;

  container.innerHTML = DEFAULT_EXHIBITIONS.map(e => `
    <div class="timeline-event-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="margin: 0;">${e.title}</h4>
        <span class="badge badge-success text-xs">${e.status}</span>
      </div>
      <p class="text-sm muted my-1">📍 ${e.venue}</p>
      <span class="font-mono text-xs text-primary font-bold">📅 ${e.dates}</span>
    </div>
  `).join('');
}

// Store & Cart
function renderStoreProducts() {
  const grid = document.getElementById('storeProductsGrid');
  if (!grid) return;

  grid.innerHTML = appState.artworks.map(a => `
    <div class="store-product-card">
      <div>
        <div class="art-canvas-preview ${a.cssClass || 'oil'}" style="height: 140px; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
          <span style="font-size: 2rem;">🖼️</span>
        </div>
        <h4>${a.title}</h4>
        <p class="text-xs muted">Museum Archival Giclée Print (Signed & Numbered)</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
        <span class="font-bold text-success font-mono" style="font-size: 1.15rem;">₹${a.price}</span>
        <button class="btn btn-primary btn-xs" onclick="addToCart('${a.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function addToCart(artId) {
  const art = appState.artworks.find(a => a.id === artId);
  if (!art) return;

  const existing = appState.cart.find(c => c.id === art.id);
  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({ ...art, qty: 1 });
  }

  labDB.set(STORAGE_KEYS.CART, appState.cart);
  updateCartBadge();
  showAlert(`Added "${art.title}" fine art print to your cart!`, 'success');
}

function updateCartBadge() {
  const totalQty = appState.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = appState.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const countBadge = document.getElementById('cartCountBadge');
  const totalBadge = document.getElementById('cartTotalBadge');

  if (countBadge) countBadge.innerText = totalQty;
  if (totalBadge) totalBadge.innerText = `₹${totalPrice.toLocaleString()}`;
}

function openCartModal() {
  const container = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartModalTotal');
  if (!container || !totalEl) return;

  if (appState.cart.length === 0) {
    container.innerHTML = `<p class="muted text-center py-3">Your studio cart is currently empty.</p>`;
    totalEl.innerText = '₹0';
  } else {
    const totalPrice = appState.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalEl.innerText = `₹${totalPrice.toLocaleString()}`;

    container.innerHTML = appState.cart.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
        <div>
          <strong>${item.title}</strong><br>
          <span class="text-xs muted">₹${item.price} x ${item.qty}</span>
        </div>
        <div class="font-mono font-bold text-success">
          ₹${(item.price * item.qty).toLocaleString()}
        </div>
      </div>
    `).join('');
  }

  document.getElementById('cartModal').classList.remove('hidden');
}

function closeCartModal() {
  document.getElementById('cartModal').classList.add('hidden');
}

function handleCheckoutCart() {
  if (appState.cart.length === 0) {
    showAlert('Your cart is empty.', 'info');
    return;
  }

  appState.cart = [];
  labDB.set(STORAGE_KEYS.CART, appState.cart);
  updateCartBadge();
  closeCartModal();
  showAlert('🎉 Purchase Confirmed! Emily Harris studio receipt dispatched to your email.', 'success');
}

// Inquiries & Newsletters
function handleSendFanMessage(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const purpose = document.getElementById('contactPurpose').value;
  const message = document.getElementById('contactMessage').value.trim();

  const msgObj = {
    id: 'MSG-' + Date.now().toString().slice(-4),
    from: name,
    email,
    purpose,
    message,
    date: new Date().toISOString().split('T')[0]
  };

  appState.messages.unshift(msgObj);
  labDB.set(STORAGE_KEYS.MESSAGES, appState.messages);

  document.getElementById('contactMessage').value = '';
  showAlert('Your inquiry dispatch has been transmitted to Emily Harris Studio!', 'success');
  renderAdminMessages();
  updateAdminMetrics();
}

function handleSubscribeNewsletter(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  showAlert(`Thank you! ${email} has been inducted into the Emily Harris Collector Circle.`, 'success');
  document.getElementById('newsletterEmail').value = '';
}

// Artist Admin Functions
function openAddArtworkModal() {
  document.getElementById('addArtworkModal').classList.remove('hidden');
}

function closeAddArtworkModal() {
  document.getElementById('addArtworkModal').classList.add('hidden');
}

function handleAddArtworkSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('newArtTitle').value.trim();
  const category = document.getElementById('newArtCategory').value;
  const year = parseInt(document.getElementById('newArtYear').value, 10);
  const dimensions = document.getElementById('newArtDimensions').value.trim();
  const price = parseFloat(document.getElementById('newArtPrice').value);
  const desc = document.getElementById('newArtDescription').value.trim();

  const newArt = {
    id: 'ART-' + Math.floor(10 + Math.random() * 90),
    title,
    category,
    year,
    dimensions,
    price,
    cssClass: category === 'Oil on Canvas' ? 'oil' : (category === 'Modern Abstract' ? 'abstract' : 'ink'),
    desc
  };

  appState.artworks.unshift(newArt);
  labDB.set(STORAGE_KEYS.ARTWORKS, appState.artworks);

  closeAddArtworkModal();
  showAlert(`🎉 New artwork "${title}" archived to portfolio!`, 'success');
  renderArtworksGrid();
  renderStoreProducts();
  updateAdminMetrics();
}

function renderAdminMessages() {
  const container = document.getElementById('adminMessagesList');
  if (!container) return;

  container.innerHTML = appState.messages.map(m => `
    <div class="feedback-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <strong>${m.from}</strong> (${m.email})<br>
          <span class="badge badge-primary text-xs mt-1">${m.purpose}</span>
        </div>
        <span class="muted text-xs font-mono">${m.date}</span>
      </div>
      <p class="text-sm mt-2">${m.message}</p>
    </div>
  `).join('');
}

function updateAdminMetrics() {
  const artCount = appState.artworks.length;
  const msgCount = appState.messages.length;

  const elA = document.getElementById('artistTotalArtworks');
  const elM = document.getElementById('artistTotalMessages');

  if (elA) elA.innerText = artCount;
  if (elM) elM.innerText = msgCount;
}

function showAlert(message, type = 'info') {
  const banner = document.getElementById('alertBanner');
  if (!banner) return;

  banner.className = `alert-banner alert-${type}`;
  banner.innerText = message;
  banner.classList.remove('hidden');

  setTimeout(() => {
    banner.classList.add('hidden');
  }, 4500);
}
