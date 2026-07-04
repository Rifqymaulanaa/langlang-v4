/*
  profile.js - Personal Eco-Dashboard state managers & tree growth simulations
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initProfile();
});

function initProfile() {
  // DOM Elements
  const imgAvatar = document.getElementById("user-profile-avatar");
  const textLevel = document.getElementById("user-profile-level");
  const textName = document.getElementById("user-profile-name");
  const textReferral = document.getElementById("user-referral-code");
  const btnCopyReferral = document.getElementById("copy-referral-btn");
  
  const textPointsTotal = document.getElementById("user-points-total");
  const textScansTotal = document.getElementById("user-scans-total");
  const textTripsTotal = document.getElementById("user-trips-total");
  
  const treeSvg = document.getElementById("virtual-tree-svg");
  const treeStageLabel = document.getElementById("tree-stage-label");
  const treeProgressPct = document.getElementById("tree-progress-pct");
  const treeProgressBar = document.getElementById("tree-progress-bar");
  
  const travelHistoryList = document.getElementById("travel-history-list");
  const badgesGrid = document.getElementById("achievements-badges-grid");
  const btnScanEco = document.getElementById("scan-ecobin-trigger-btn");

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Tabs navigation
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

  // 1. Copy Referral Code
  btnCopyReferral.addEventListener("click", () => {
    navigator.clipboard.writeText(textReferral.textContent);
    window.showToast("Kode referral disalin ke clipboard!", "success");
  });

  // 2. Scan Eco-Bin Trigger (P1 Gamification)
  btnScanEco.addEventListener("click", () => {
    // Add points in DB
    const pointsGained = window.LanglangData.scanEcoBin();
    
    // Animate Tree container scale pulse effect
    const treeContainer = document.querySelector(".tree-simulator-container");
    treeContainer.style.transform = "scale(1.02)";
    setTimeout(() => {
      treeContainer.style.transform = "none";
    }, 200);

    window.showToast(`Daur ulang sukses! +${pointsGained} Eco-Points & +1 Scan`, "success");
    
    // Refresh all rendering elements
    renderProfileDetails();
    
    // In case header navbar displays name, re-run nav init
    const profile = window.LanglangData.getUserProfile();
    const desktopName = document.querySelector(".desktop-only");
    if (desktopName) desktopName.textContent = profile.name;
  });

  // 3. Render Profile details
  function renderProfileDetails() {
    const profile = window.LanglangData.getUserProfile();
    const bookings = window.LanglangData.getBookings();

    // Set header profile details
    imgAvatar.src = profile.avatar;
    imgAvatar.alt = profile.name;
    textLevel.textContent = profile.level;
    textName.textContent = profile.name;
    textReferral.textContent = profile.referralCode;

    // Set stats counters
    textPointsTotal.textContent = `${profile.ecoPoints.toLocaleString('id-ID')} Poin`;
    textScansTotal.textContent = `${profile.ecoBinScans} Kali`;
    textTripsTotal.textContent = `${bookings.length} Tiket`;

    // Render Virtual Tree State
    renderVirtualTree(profile.ecoPoints);

    // Render Travel History list
    renderTravelHistory(bookings);

    // Render Achievements grid
    renderAchievements(profile.badgeKoleksi);
  }

  // Virtual Tree SVGs rendering depending on stages (PRD 4.8)
  function renderVirtualTree(points) {
    let stage = "Seedling";
    let pct = 0;
    let svgContent = "";

    if (points < 500) {
      stage = "Seedling";
      pct = Math.floor((points / 500) * 100);
      // Small shoot on brown ground
      svgContent = `
        <!-- Ground -->
        <path d="M10 90 Q50 80 90 90 L90 100 L10 100 Z" fill="#8B4513" />
        <!-- Small stem -->
        <path d="M50 90 Q48 70 50 65" stroke="#4CAF50" stroke-width="4" stroke-linecap="round"/>
        <!-- Small Leaf -->
        <path d="M50 65 Q58 60 55 55 Q48 58 50 65" fill="#4CAF50" />
      `;
    } else if (points < 1000) {
      stage = "Sprout";
      pct = Math.floor(((points - 500) / 500) * 100);
      // Sprout with two leaves
      svgContent = `
        <!-- Ground -->
        <path d="M10 90 Q50 80 90 90 L90 100 L10 100 Z" fill="#8B4513" />
        <!-- Stem -->
        <path d="M50 90 Q47 60 50 50" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/>
        <path d="M50 50 Q48 40 50 35" stroke="#4CAF50" stroke-width="4" stroke-linecap="round"/>
        <!-- Leaf 1 -->
        <path d="M50 50 Q35 40 38 35 Q48 40 50 50" fill="#4CAF50" />
        <!-- Leaf 2 -->
        <path d="M50 42 Q65 35 62 30 Q52 35 50 42" fill="#4CAF50" />
      `;
    } else if (points < 2000) {
      stage = "Sapling";
      pct = Math.floor(((points - 1000) / 1000) * 100);
      // Young Tree with branches
      svgContent = `
        <!-- Ground -->
        <path d="M10 90 Q50 80 90 90 L90 100 L10 100 Z" fill="#8B4513" />
        <!-- Trunk -->
        <path d="M50 90 L50 45" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round"/>
        <!-- Branches -->
        <path d="M50 65 Q35 50 30 45" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>
        <path d="M50 55 Q65 45 70 40" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>
        <!-- Leaf clusters -->
        <circle cx="30" cy="42" r="12" fill="#2E7D32" />
        <circle cx="70" cy="38" r="14" fill="#2E7D32" />
        <circle cx="50" cy="35" r="16" fill="#4CAF50" />
      `;
    } else {
      stage = "Mature Tree";
      pct = 100;
      // Grand Oak Tree
      svgContent = `
        <!-- Ground -->
        <path d="M10 90 Q50 80 90 90 L90 100 L10 100 Z" fill="#5c3a21" />
        <!-- Big Trunk -->
        <path d="M46 90 L48 40 L52 40 L54 90 Z" fill="#5c3a21" />
        <path d="M48 40 Q30 25 25 20" stroke="#5c3a21" stroke-width="8" stroke-linecap="round"/>
        <path d="M52 40 Q70 25 75 20" stroke="#5c3a21" stroke-width="8" stroke-linecap="round"/>
        <!-- Huge Foliage -->
        <circle cx="50" cy="35" r="22" fill="#1c542f" />
        <circle cx="30" cy="25" r="18" fill="#1c542f" />
        <circle cx="70" cy="25" r="20" fill="#2e7d32" />
        <circle cx="50" cy="18" r="20" fill="#f16d08" opacity="0.9"/>
      `;
    }

    // Update Virtual Tree display
    treeSvg.innerHTML = svgContent;
    treeStageLabel.textContent = `Status: ${stage}`;
    treeProgressPct.textContent = `${pct}% ke Level Berikutnya`;
    treeProgressBar.style.width = `${pct}%`;
  }

  // Render Travel History Booking Cards
  function renderTravelHistory(bookings) {
    travelHistoryList.innerHTML = "";
    
    if (bookings.length === 0) {
      travelHistoryList.innerHTML = `
        <div style="text-align: center; padding: 30px; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--gray-300);">
          <p style="color: var(--gray-400); font-weight: 600;">Belum ada riwayat pemesanan tiket digital.</p>
          <a href="explore.html" class="btn btn-secondary btn-sm" style="margin-top: 10px;">Cari Destinasi Sekarang</a>
        </div>
      `;
      return;
    }

    // Render bookings desc order (latest first)
    const reversed = [...bookings].reverse();
    
    reversed.forEach(book => {
      const formattedTotal = formatIDR(book.totalCost);
      const isPast = new Date(book.visitDate) < new Date();
      
      travelHistoryList.innerHTML += `
        <div class="card" style="padding: var(--space-2); flex-direction: row; gap: 16px; align-items: center; border-radius: var(--radius-md); border-color: var(--gray-200);">
          <img src="${book.destinationImage}" alt="${book.destinationName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-md);">
          
          <div style="flex-grow: 1;">
            <div class="flex-between">
              <h4 style="font-size: 1.05rem;">${book.destinationName}</h4>
              <span class="badge ${isPast ? 'badge-outline' : 'badge-eco'}" style="font-size: 0.65rem;">
                ${isPast ? 'Selesai' : 'Aktif'}
              </span>
            </div>
            
            <div style="font-size: 0.8rem; color: var(--gray-500); margin: 2px 0;">
              Kunjungan: <strong>${book.visitDate}</strong> &bull; Jumlah: <strong>${book.ticketsCount} Orang</strong>
            </div>
            
            <div class="flex-between" style="margin-top: 4px;">
              <span style="font-family: var(--font-display); font-size: 0.75rem; color: var(--gray-400); font-weight: 700;">KODE: ${book.bookingCode}</span>
              <strong style="color: var(--primary-green); font-size: 0.9rem;">${formattedTotal}</strong>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Render Achievements grid
  function renderAchievements(badges) {
    badgesGrid.innerHTML = "";
    
    badges.forEach(badge => {
      badgesGrid.innerHTML += `
        <div class="achievement-badge-card animate-slide-up">
          <div class="achievement-icon">${badge.icon}</div>
          <h4 style="font-size: 0.85rem; line-height: 1.2;">${badge.name}</h4>
          <p style="font-size: 0.75rem; color: var(--gray-500); line-height: 1.3;">${badge.desc}</p>
        </div>
      `;
    });
  }

  // Init Actions
  renderProfileDetails();
}
