/*
  home.js - Home/Landing Page Interactions & Animations
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initWeatherMarquee();
  initAutocompleteSearch();
  initFeaturedDestinations();
  initStatsCounter();
});

// 1. Render AI Cuaca Pintar Marquee Strip
function initWeatherMarquee() {
  const marquee = document.getElementById("weather-marquee-content");
  if (!marquee) return;

  const destinations = window.LanglangData.getDestinations();
  
  // Create double items list for infinite scrolling effect
  let marqueeHTML = "";
  
  // Render twice for continuous loop
  for (let loop = 0; loop < 2; loop++) {
    destinations.forEach(dest => {
      let statusClass = "weather-status-sky";
      let alertIcon = `
        <svg class="weather-icon-inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;

      if (dest.weather.text.includes("Hujan") || dest.weather.text.includes("Dingin")) {
        statusClass = "weather-status-orange";
        alertIcon = `
          <svg class="weather-icon-inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        `;
      } else if (dest.weather.text.includes("Cerah")) {
        statusClass = "weather-status-green";
      }

      marqueeHTML += `
        <div class="weather-item">
          <span>${dest.name}</span>
          <span style="color: var(--gray-400);">|</span>
          <span>${dest.weather.temp}°C</span>
          <span style="color: var(--gray-400);">|</span>
          <span class="${statusClass}">${dest.weather.text} (${dest.weather.warning})</span>
          ${alertIcon}
        </div>
        <div style="color: var(--gray-600); margin: 0 16px;">&bull;</div>
      `;
    });
  }

  marquee.innerHTML = marqueeHTML;
}

// 2. Autocomplete Search Bar logic
function initAutocompleteSearch() {
  const searchInput = document.getElementById("destination-search-input");
  const autocompleteList = document.getElementById("search-autocomplete-list");
  const searchBtn = document.getElementById("search-cta-btn");
  
  if (!searchInput || !autocompleteList) return;

  const destinations = window.LanglangData.getDestinations();

  searchInput.addEventListener("input", function() {
    const val = this.value.trim().toLowerCase();
    autocompleteList.innerHTML = "";
    
    if (!val) {
      autocompleteList.style.display = "none";
      return;
    }

    const matches = destinations.filter(dest => 
      dest.name.toLowerCase().includes(val) || 
      dest.location.toLowerCase().includes(val) ||
      dest.province.toLowerCase().includes(val) ||
      dest.type.toLowerCase().includes(val)
    );

    if (matches.length === 0) {
      autocompleteList.innerHTML = `
        <div class="autocomplete-item" style="color: var(--gray-500); cursor: default;">
          <span>Destinasi tidak ditemukan</span>
        </div>
      `;
    } else {
      matches.slice(0, 5).forEach(dest => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.innerHTML = `
          <div>
            <div class="autocomplete-name">${dest.name}</div>
            <div class="autocomplete-loc">${dest.location}</div>
          </div>
          <span class="badge ${dest.badge === 'Hidden Gem' ? 'badge-hidden-gem' : (dest.badge === 'Eco-Friendly' ? 'badge-eco' : 'badge-populer')}">${dest.badge}</span>
        `;
        
        item.addEventListener("click", () => {
          window.location.href = `destination.html?id=${dest.id}`;
        });
        
        autocompleteList.appendChild(item);
      });
    }

    autocompleteList.style.display = "block";
  });

  // Close suggestions when clicking outside
  document.addEventListener("click", function(e) {
    if (e.target !== searchInput && e.target !== autocompleteList) {
      autocompleteList.style.display = "none";
    }
  });

  // Handle Search Button Click
  searchBtn.addEventListener("click", () => {
    const val = searchInput.value.trim();
    if (val) {
      window.location.href = `explore.html?query=${encodeURIComponent(val)}`;
    } else {
      window.location.href = `explore.html`;
    }
  });

  // Handle Enter keypress
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
}

// 3. Render 6 Featured Destinations
function initFeaturedDestinations() {
  const grid = document.getElementById("featured-destinations-grid");
  if (!grid) return;

  const destinations = window.LanglangData.getDestinations();
  
  // Get first 6 items for Landing Page
  const featured = destinations.slice(0, 6);
  
  let gridHTML = "";
  
  featured.forEach((dest, index) => {
    let badgeClass = "badge-hidden-gem";
    if (dest.badge === "Populer") badgeClass = "badge-populer";
    if (dest.badge === "Eco-Friendly") badgeClass = "badge-eco";

    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(dest.price);

    gridHTML += `
      <div class="card animate-slide-up delay-${(index % 3) + 1}" onclick="window.location.href='destination.html?id=${dest.id}'">
        <div class="card-img-wrapper">
          <img class="card-img" src="${dest.image}" alt="${dest.name}" loading="lazy">
          <div style="position: absolute; top: var(--space-1); left: var(--space-1);">
            <span class="badge ${badgeClass}">${dest.badge}</span>
          </div>
          <div style="position: absolute; top: var(--space-1); right: var(--space-1);">
            <span class="badge badge-cuaca" style="background: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.5);">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right: 2px;"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
              ${dest.weather.temp}°C
            </span>
          </div>
        </div>
        
        <div class="card-content">
          <div class="card-meta">
            <span>${dest.type}</span>
            <div class="rating-stars" style="font-size: 0.85rem; font-weight: 700;">
              <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <span>${dest.rating}</span>
              <span style="color: var(--gray-400); font-weight: 400; margin-left: 2px;">(${dest.reviewsCount})</span>
            </div>
          </div>
          
          <h3 class="card-title">${dest.name}</h3>
          
          <div style="display: flex; align-items: center; gap: 4px; color: var(--gray-500); font-size: 0.85rem;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>${dest.location}</span>
          </div>
          
          <div class="card-footer">
            <div class="card-price">${formattedPrice} <span>/ orang</span></div>
            <div style="font-size: 0.75rem; color: var(--coral-accent); font-weight: 700; background: var(--coral-accent-light); padding: 2px 8px; border-radius: var(--radius-sm);">
              Sisa ${dest.quotaTotal - dest.quotaBooked} Slot
            </div>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = gridHTML;
}

// 4. Statistics Scroll Trigger Counter Animation (P0)
function initStatsCounter() {
  const statsSection = document.getElementById("statistics-counter-section");
  if (!statsSection) return;

  const countItems = [
    { id: "stat-desa-wisata", target: 6189, duration: 2000, suffix: "" },
    { id: "stat-perjalanan", target: 102, duration: 1500, suffix: " Juta" },
    { id: "stat-digital", target: 78.2, duration: 1800, suffix: "%" }
  ];

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      countItems.forEach(item => {
        animateNumber(item.id, item.target, item.duration, item.suffix);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

function animateNumber(id, target, duration, suffix = "") {
  const el = document.getElementById(id);
  if (!el) return;

  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = easeProgress * target;

    if (isFloat) {
      el.textContent = currentValue.toFixed(1) + suffix;
    } else {
      el.textContent = Math.floor(currentValue).toLocaleString('id-ID') + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (isFloat) {
        el.textContent = target.toFixed(1) + suffix;
      } else {
        el.textContent = target.toLocaleString('id-ID') + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}
