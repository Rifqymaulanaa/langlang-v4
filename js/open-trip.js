/*
  open-trip.js - Open Trip package listings and community feed
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initOpenTrip();
});

function initOpenTrip() {
  const trips = window.LanglangData.getOpenTrips();

  // DOM Elements
  const tripsContainer = document.getElementById("open-trips-container");
  const feedContainer = document.getElementById("community-feed-container");
  
  const searchDest = document.getElementById("trip-search-dest");
  const maxBudget = document.getElementById("trip-max-budget");
  const cbTypes = document.querySelectorAll(".trip-filter-type");
  const resetFiltersBtn = document.getElementById("trip-reset-filters-btn");
  
  // Trip Modal
  const tripModal = document.getElementById("trip-detail-modal-overlay");
  const tripModalClose = document.getElementById("trip-modal-close-btn");
  const tripModalCloseFooter = document.getElementById("modal-trip-close-footer-btn");
  const tripModalJoinBtn = document.getElementById("modal-trip-join-btn");
  
  const modalDate = document.getElementById("modal-trip-date");
  const modalTitle = document.getElementById("modal-trip-title");
  const modalImg = document.getElementById("modal-trip-image");
  const modalGuideInitial = document.getElementById("modal-trip-guide-initial");
  const modalGuideName = document.getElementById("modal-trip-guide-name");
  const modalGuideRating = document.getElementById("modal-trip-guide-rating");
  const modalPrice = document.getElementById("modal-trip-price");
  const modalQuota = document.getElementById("modal-trip-quota");
  const modalItinerary = document.getElementById("modal-trip-itinerary");
  const modalIncludes = document.getElementById("modal-trip-includes");

  // State
  let activeTripId = null;
  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Tabs toggle control is in nav.js or common layout, let's make sure it toggles tab panes
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // 1. Filter Event Listeners
  searchDest.addEventListener("input", filterAndRenderTrips);
  maxBudget.addEventListener("change", filterAndRenderTrips);
  cbTypes.forEach(cb => cb.addEventListener("change", filterAndRenderTrips));
  
  resetFiltersBtn.addEventListener("click", () => {
    searchDest.value = "";
    maxBudget.value = "all";
    cbTypes.forEach(cb => cb.checked = true);
    filterAndRenderTrips();
    window.showToast("Filter disetel ulang", "info");
  });

  // 2. Modal Close handlers
  [tripModalClose, tripModalCloseFooter].forEach(btn => {
    btn.addEventListener("click", () => {
      tripModal.classList.remove("active");
    });
  });

  // Join Trip button
  tripModalJoinBtn.addEventListener("click", () => {
    if (!activeTripId) return;
    
    const matchedTrip = trips.find(t => t.id === activeTripId);
    if (matchedTrip && matchedTrip.quotaLeft > 0) {
      // Reduce quota
      matchedTrip.quotaLeft -= 1;
      tripModal.classList.remove("active");
      
      window.showToast("Pendaftaran sukses! Guide akan menghubungi WhatsApp Anda.", "success");
      
      // Update User Eco-Points
      const profile = window.LanglangData.getUserProfile();
      profile.ecoPoints += 100; // Large reward for booking community trip
      localStorage.setItem("langlang_userProfile", JSON.stringify(profile));

      // Refresh list
      filterAndRenderTrips();
    }
  });

  // 3. Filter & Render Open Trips (P1)
  function filterAndRenderTrips() {
    const destVal = searchDest.value.toLowerCase().trim();
    const budgetLimit = maxBudget.value;
    
    // Checked Group Types
    const checkedTypes = Array.from(cbTypes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const matched = trips.filter(trip => {
      const matchesDest = !destVal || 
        trip.destination.toLowerCase().includes(destVal) || 
        trip.title.toLowerCase().includes(destVal);
      
      let matchesBudget = true;
      if (budgetLimit !== "all") {
        matchesBudget = trip.price <= parseInt(budgetLimit);
      }

      // Group types mapping logic (simulated by prices or destinations)
      let type = "grup";
      if (trip.price > 2000000) type = "couple";
      if (trip.price < 500000) type = "solo";
      const matchesType = checkedTypes.includes(type);

      return matchesDest && matchesBudget && matchesType;
    });

    tripsContainer.innerHTML = "";
    
    if (matched.length === 0) {
      tripsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--gray-200);">
          <h3>Paket Open Trip tidak ditemukan</h3>
          <p>Coba saring dengan budget atau tujuan yang berbeda.</p>
        </div>
      `;
      return;
    }

    matched.forEach((trip, index) => {
      const formattedPrice = formatIDR(trip.price);
      
      const card = document.createElement("div");
      card.className = "card animate-slide-up";
      card.style.animationDelay = `${(index % 2) * 150}ms`;
      
      card.innerHTML = `
        <div class="card-img-wrapper" style="aspect-ratio: 16/10;">
          <img class="card-img" src="${trip.image}" alt="${trip.title}">
          <div style="position: absolute; top: var(--space-1); left: var(--space-1);">
            <span class="badge badge-populer">${trip.date}</span>
          </div>
        </div>
        
        <div class="card-content">
          <div class="card-meta">
            <span>${trip.destination}</span>
            <div style="color: var(--gold-reward); font-weight: 700; font-size: 0.8rem;">
              ★ ${trip.guideRating}
            </div>
          </div>
          
          <h3 class="card-title" style="font-size: 1.15rem; margin-top: 2px;">${trip.title}</h3>
          
          <!-- Guide chip -->
          <div class="guide-chip">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: var(--primary-green); color: var(--white); font-size: 0.65rem;" class="flex-center">
              ${trip.guide.charAt(0)}
            </div>
            <span>Guide: ${trip.guide}</span>
          </div>

          <div class="card-footer">
            <div class="card-price" style="font-size: 1.05rem;">${formattedPrice} <span style="font-size: 0.7rem; color:var(--gray-500);">/ org</span></div>
            <button class="btn btn-primary btn-sm view-trip-details-btn" data-id="${trip.id}">Detail Trip</button>
          </div>
          
          <div style="font-size: 0.75rem; text-align: right; color: var(--coral-accent); font-weight: 700; margin-top: 4px;">
            Tersisa ${trip.quotaLeft} Slot Tiket
          </div>
        </div>
      `;

      card.querySelector(".view-trip-details-btn").addEventListener("click", () => {
        openTripDetailsModal(trip);
      });

      tripsContainer.appendChild(card);
    });
  }

  // 4. Open Trip Detail Modal
  function openTripDetailsModal(trip) {
    activeTripId = trip.id;
    
    modalDate.textContent = trip.date;
    modalTitle.textContent = trip.title;
    modalImg.src = trip.image;
    modalImg.alt = trip.title;
    
    modalGuideInitial.textContent = trip.guide.charAt(0);
    modalGuideName.textContent = trip.guide;
    modalGuideRating.textContent = `★ ${trip.guideRating} (Pemandu Adat Bersertifikat)`;
    
    modalPrice.textContent = formatIDR(trip.price);
    modalQuota.textContent = `Sisa kuota: ${trip.quotaLeft} dari ${trip.quotaMax} Slot`;

    // Render Itinerary list
    modalItinerary.innerHTML = "";
    trip.itinerary.forEach(step => {
      modalItinerary.innerHTML += `<li>${step}</li>`;
    });

    // Render Includes
    modalIncludes.innerHTML = "";
    trip.includes.forEach(inc => {
      modalIncludes.innerHTML += `
        <div style="display: flex; align-items: center; gap: 6px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--primary-green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${inc}</span>
        </div>
      `;
    });

    // Disable Join button if quota is full
    if (trip.quotaLeft <= 0) {
      tripModalJoinBtn.disabled = true;
      tripModalJoinBtn.textContent = "Kuota Habis";
      modalQuota.style.color = "var(--coral-accent)";
    } else {
      tripModalJoinBtn.disabled = false;
      tripModalJoinBtn.textContent = "Gabung Open Trip";
      modalQuota.style.color = "var(--gray-600)";
    }

    tripModal.classList.add("active");
  }

  // 5. Render Community Feed UGC (PRD 4.9)
  const mockUgcPosts = [
    {
      user: "Rian F.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      text: "Ora Beach beneran bagaikan Maldives! Airnya jernih banget. Ditambah guide lokalnya Richard ramah & seru abis. Beli tiket di Langlang care-nya ngebantu toilet warga juga. #OraBeach #HiddenGem",
      likes: 142
    },
    {
      user: "Adinda S.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80",
      text: "Desa adat Penglipuran emang pantes dapet predikat desa terbersih. Sepanjang jalan ga ada sampah selembar pun. Seneng banget scan botol plastik di Smart Eco-bin dapet koin poin Langlang. #Penglipuran #SDGs",
      likes: 289
    },
    {
      user: "Fajar K.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80",
      text: "Akhirnya nyampe juga di Wae Rebo setelah trekking 3 jam! Lelah terbayar lunas pas ngeliat kabut turun di antara rumah Mbaru Niang. Indah tiada tara. #WaeRebo #Flores",
      likes: 310
    },
    {
      user: "Budi T.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
      img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80",
      text: "Curug Cikaso Sukabumi, airnya ijo toska seger bgt. Cocok buat kabur dari penatnya JKT. Donasi sanitasi Langlang Care jg keliatan progress toilet barunya. Salut! #Cikaso #GreenTraveler",
      likes: 95
    }
  ];

  function renderCommunityFeed() {
    feedContainer.innerHTML = "";
    mockUgcPosts.forEach((post, index) => {
      feedContainer.innerHTML += `
        <div class="feed-card animate-slide-up" style="animation-delay: ${index * 100}ms;">
          <div class="feed-header">
            <img class="feed-user-img" src="${post.avatar}" alt="${post.user}">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--deep-charcoal);">${post.user}</div>
              <div style="font-size: 0.7rem; color: var(--gray-400);">Anggota Wisatawan Hijau</div>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--gray-600); line-height: 1.4;">${post.text}</p>
          <img class="feed-content-img" src="${post.img}" alt="Foto Ekowisata" loading="lazy">
          
          <div class="flex-between" style="font-size: 0.75rem; font-weight: 700; color: var(--gray-500); padding-top: 4px; border-top: 1px solid var(--gray-100);">
            <div style="display: flex; align-items: center; gap: 4px; cursor: pointer;" onclick="this.querySelector('span').textContent = parseInt(this.querySelector('span').textContent) + 1; window.showToast('Post disukai!', 'info');">
              <span>❤️ ${post.likes}</span> Suka
            </div>
            <span>Bagikan</span>
          </div>
        </div>
      `;
    });
  }

  // Init grid
  filterAndRenderTrips();
  renderCommunityFeed();
}
