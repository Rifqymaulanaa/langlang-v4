/*
  care.js - Langlang Care campaigns and donations handlers
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initCare();
});

function initCare() {
  const campaignsListEl = document.getElementById("care-campaigns-list");
  const timelineEl = document.getElementById("care-timeline-reports");
  const leaderboardEl = document.getElementById("leaderboard-container");
  const selectCampaign = document.getElementById("donate-select-campaign");
  
  const formDonate = document.getElementById("care-direct-donate-form");
  const customNominal = document.getElementById("donate-custom-nominal");
  const cbAnonymous = document.getElementById("donate-anonymous-checkbox");
  const nominalBtns = document.querySelectorAll(".nominal-btn");
  
  const userTotalDonationsEl = document.getElementById("user-total-donations");
  const userHistoryListEl = document.getElementById("user-donations-history-list");
  const loadingOverlay = document.getElementById("care-loading-overlay");

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // 1. Nominal quick buttons handler
  nominalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      nominalBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const val = btn.getAttribute("data-value");
      customNominal.value = val;
    });
  });

  customNominal.addEventListener("input", () => {
    // Remove active state from quick select buttons if custom input is type-in
    nominalBtns.forEach(b => b.classList.remove("active"));
  });

  // 2. Render Page Panels
  function renderAll() {
    const campaigns = window.LanglangData.getCampaigns();
    const leaderboard = window.LanglangData.getLeaderboard();
    const donations = window.LanglangData.getDonations();

    // A. Render Campaigns List (P1)
    campaignsListEl.innerHTML = "";
    selectCampaign.innerHTML = "";
    
    campaigns.forEach((camp, index) => {
      const pct = Math.min(100, Math.floor((camp.raised / camp.target) * 100));
      
      // Inject to Campaigns list
      campaignsListEl.innerHTML += `
        <div class="campaign-list-card animate-slide-up" style="animation-delay: ${index * 150}ms;">
          <img class="campaign-banner-img" src="${camp.imageAfter}" alt="${camp.title}" loading="lazy">
          
          <div class="campaign-body">
            <span class="badge badge-eco" style="width: fit-content;">Dampak Terjamin</span>
            <h3 class="font-accent" style="font-size: 1.35rem; line-height: 1.2;">${camp.title}</h3>
            <p style="font-size: 0.9rem; color: var(--gray-600);">${camp.description}</p>
            
            <div style="margin-top: 6px;">
              <div class="flex-between" style="font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                <span>Progres Pengumpulan Dana</span>
                <span style="color: var(--primary-green);">${pct}% Terkumpul</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${pct}%;"></div>
              </div>
            </div>

            <div class="campaign-stats-row">
              <div>
                <div style="font-weight: 800; color: var(--deep-charcoal);">${formatIDR(camp.raised)}</div>
                <div style="font-size: 0.75rem; color: var(--gray-400);">Dana Terkumpul</div>
              </div>
              <div>
                <div style="font-weight: 800; color: var(--deep-charcoal);">${formatIDR(camp.target)}</div>
                <div style="font-size: 0.75rem; color: var(--gray-400);">Target Dana</div>
              </div>
              <div>
                <div style="font-weight: 800; color: var(--deep-charcoal);">${camp.donorsCount.toLocaleString('id-ID')}</div>
                <div style="font-size: 0.75rem; color: var(--gray-400);">Donatur</div>
              </div>
            </div>

            <div style="margin-top: 6px;">
              <button class="btn btn-secondary btn-full btn-sm donate-trigger-btn" data-id="${camp.id}">Donasikan Sekarang</button>
            </div>
          </div>
        </div>
      `;

      // Inject to direct donate form select options
      const opt = document.createElement("option");
      opt.value = camp.id;
      opt.textContent = camp.title.substring(camp.title.indexOf(' ') + 1); // Remove emoji from options
      selectCampaign.appendChild(opt);
    });

    // B. Bind triggers on campaign card buttons
    document.querySelectorAll(".donate-trigger-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        selectCampaign.value = id;
        
        // Scroll smoothly to donation form widget
        document.getElementById("direct-donation-widget").scrollIntoView({ behavior: 'smooth' });
        window.showToast("Kampanye dipilih", "info");
      });
    });

    // C. Render Leaderboard Donors (P1)
    leaderboardEl.innerHTML = "";
    leaderboard.forEach((lead, idx) => {
      const displayTotal = formatIDR(lead.total);
      
      leaderboardEl.innerHTML += `
        <div class="leaderboard-item">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="leaderboard-rank">${idx + 1}</div>
            <span style="font-weight: 700; color: var(--deep-charcoal);">${lead.name}</span>
          </div>
          <span style="font-weight: 800; color: var(--primary-green); font-size: 0.85rem;">${displayTotal}</span>
        </div>
      `;
    });

    // D. Render Laporan Timeline Realisasi
    timelineEl.innerHTML = "";
    campaigns.forEach(camp => {
      camp.updates.forEach((upd, idx) => {
        timelineEl.innerHTML += `
          <div class="timeline-node animate-slide-up" style="animation-delay: ${idx * 100}ms;">
            <div class="timeline-date">${upd.date}</div>
            <h4 class="timeline-title">${upd.title}</h4>
            <div style="font-size: 0.75rem; color: var(--primary-green); font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">Kampanye: ${camp.title.substring(2)}</div>
            <p class="timeline-desc">${upd.description}</p>
          </div>
        `;
      });
    });

    // E. Render Personal Impacts
    let totalDonated = 0;
    donations.forEach(don => totalDonated += don.amount);
    
    // Sum donations checked in bookings as well
    const bookings = window.LanglangData.getBookings();
    bookings.forEach(b => totalDonated += b.donationAmount);

    userTotalDonationsEl.textContent = formatIDR(totalDonated);

    userHistoryListEl.innerHTML = "";
    if (donations.length === 0 && bookings.every(b => b.donationAmount === 0)) {
      userHistoryListEl.innerHTML = `<p style="text-align: center; color: var(--gray-400); padding: 10px 0;">Belum ada riwayat donasi langsung.</p>`;
    } else {
      // List combined donations
      let listHTML = `<ul style="padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px;">`;
      
      // Indirect donations from bookings
      bookings.forEach(b => {
        if (b.donationAmount > 0) {
          listHTML += `
            <li class="flex-between" style="border-bottom: 1px dashed var(--gray-100); padding-bottom: 6px;">
              <div>
                <div style="font-weight: 700; font-size: 0.8rem;">Donasi Tiket (${b.destinationName})</div>
                <div style="font-size: 0.7rem; color: var(--gray-400);">Via Checkout</div>
              </div>
              <strong style="color: var(--primary-green); font-size: 0.8rem;">+${formatIDR(b.donationAmount)}</strong>
            </li>
          `;
        }
      });

      // Direct donations
      donations.forEach(don => {
        const matchingCampaign = campaigns.find(c => c.id === don.campaignId);
        const campTitle = matchingCampaign ? matchingCampaign.title.substring(2) : "Pembangunan Fasilitas";
        
        listHTML += `
          <li class="flex-between" style="border-bottom: 1px dashed var(--gray-100); padding-bottom: 6px;">
            <div>
              <div style="font-weight: 700; font-size: 0.8rem;">${campTitle.substring(0, 20)}...</div>
              <div style="font-size: 0.7rem; color: var(--gray-400);">Donasi Langsung</div>
            </div>
            <strong style="color: var(--primary-green); font-size: 0.8rem;">+${formatIDR(don.amount)}</strong>
          </li>
        `;
      });
      
      listHTML += `</ul>`;
      userHistoryListEl.innerHTML = listHTML;
    }
  }

  // 3. Direct Donation Form Submit (P1)
  formDonate.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const campId = selectCampaign.value;
    const nominal = parseInt(customNominal.value);
    const isAnon = cbAnonymous.checked;

    if (!campId || isNaN(nominal) || nominal < 1000) {
      window.showToast("Nominal minimal donasi Rp1.000!", "error");
      return;
    }

    // Trigger loader modal
    loadingOverlay.classList.add("active");

    setTimeout(() => {
      loadingOverlay.classList.remove("active");

      const newDirectDonation = {
        campaignId: campId,
        amount: nominal,
        isAnonymous: isAnon,
        date: "Hari Ini"
      };

      const points = window.LanglangData.addDonation(newDirectDonation);
      
      window.showToast(`Donasi tersalurkan! Anda dapat +${points} Eco-Points`, "success");
      
      // Reset form
      customNominal.value = 5000;
      nominalBtns.forEach(b => b.classList.remove("active"));
      document.querySelector(".nominal-btn[data-value='5000']").classList.add("active");
      cbAnonymous.checked = false;

      // Re-render
      renderAll();
    }, 1800); // 1.8s simulation delay
  });

  // Init
  renderAll();
}
