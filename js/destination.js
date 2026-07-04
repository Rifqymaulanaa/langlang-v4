/*
  destination.js - Destination Details page interactions & booking flow
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initDestinationDetails();
});

function initDestinationDetails() {
  // 1. Get Destination ID from URL query
  const urlParams = new URLSearchParams(window.location.search);
  const destId = urlParams.get("id") || "cikaso"; // Default to Curug Cikaso
  
  const dest = window.LanglangData.getDestinationById(destId);
  if (!dest) {
    window.location.href = "explore.html";
    return;
  }

  // Set page title
  document.title = `${dest.name} — Detail Destinasi | Langlang`;

  // 2. Render Page Elements
  document.getElementById("breadcrumb-dest-name").textContent = dest.name;
  document.getElementById("dest-badge-category").textContent = dest.badge;
  
  // Set badge color class
  const badgeEl = document.getElementById("dest-badge-category");
  badgeEl.className = "badge";
  if (dest.badge === "Hidden Gem") badgeEl.classList.add("badge-hidden-gem");
  if (dest.badge === "Populer") badgeEl.classList.add("badge-populer");
  if (dest.badge === "Eco-Friendly") badgeEl.classList.add("badge-eco");

  document.getElementById("dest-type-label").textContent = dest.type;
  document.getElementById("dest-title").textContent = dest.name;
  document.getElementById("dest-rating-value").textContent = dest.rating.toFixed(1);
  document.getElementById("dest-reviews-count").textContent = `(${dest.reviewsCount} ulasan)`;
  document.getElementById("dest-location-text").textContent = dest.location;

  // Render Stars
  renderStars(dest.rating, document.getElementById("dest-rating-stars"));

  // Go to Virtual Tour Button Link
  const goVirtualBtn = document.getElementById("go-virtual-tour-btn");
  goVirtualBtn.href = `virtual-tour.html?id=${dest.id}`;

  // Initialize Carousel
  initCarousel(dest.images);

  // Initialize Weather Widget & Discount Check (PRD 4.3 & 5.5)
  let weatherDiscount = 0;
  // If today's status is rainy or cold, offer a discount
  if (dest.weather.text.includes("Hujan") || dest.weather.text.includes("Dingin") || dest.weather.text.includes("Kabut")) {
    weatherDiscount = 15; // 15% discount for less ideal weather
  }
  initWeatherWidget(dest.weather, weatherDiscount);

  // Initialize Tab Switcher
  initTabs(dest);

  // Initialize UMKM Spotlight
  initUMKMSpotlight(dest.umkmNear);

  // Initialize UGC Review Form & Feed
  initUGCSection(dest.id);

  // Initialize Booking calculations
  initBookingCard(dest, weatherDiscount);
}

// Render rating stars SVG
function renderStars(rating, container) {
  container.innerHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHTML += `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    } else if (i === fullStars + 1 && hasHalf) {
      starsHTML += `
        <svg viewBox="0 0 24 24" style="position: relative;">
          <path class="empty" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" style="stroke: var(--gold-reward); stroke-width: 2; fill: none;"></path>
          <path d="M12 2v15.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" style="fill: var(--gold-reward);"></path>
        </svg>
      `;
    } else {
      starsHTML += `<svg class="empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
  }
  container.innerHTML = starsHTML;
}

// 3. Carousel Logic
function initCarousel(images) {
  const container = document.getElementById("carousel-container");
  const dotsContainer = document.getElementById("carousel-dots-container");
  if (!container || !images || images.length === 0) return;

  // Insert slides
  images.forEach((imgUrl, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
    slide.innerHTML = `<img src="${imgUrl}" alt="Foto Destinasi" loading="lazy">`;
    container.insertBefore(slide, dotsContainer);

    const dot = document.createElement("button");
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute("data-index", index);
    dotsContainer.appendChild(dot);
  });

  let currentSlide = 0;
  const slides = container.querySelectorAll(".carousel-slide");
  const dots = dotsContainer.querySelectorAll(".carousel-dot");

  function goToSlide(n) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  // Dot navigation click
  dots.forEach(dot => {
    dot.addEventListener("click", function() {
      const idx = parseInt(this.getAttribute("data-index"));
      goToSlide(idx);
    });
  });

  // Auto-play carousel every 4s
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 4000);
}

// 4. Weather Widget & Ideal forecast
function initWeatherWidget(weather, discount) {
  const iconBox = document.getElementById("weather-icon-box");
  const tempVal = document.getElementById("weather-temp-value");
  const descVal = document.getElementById("weather-desc-value");
  const warningEl = document.getElementById("weather-warning-badge");
  const discountStrip = document.getElementById("weather-discount-strip");
  const forecastContainer = document.getElementById("weather-forecast-container");

  if (!iconBox) return;

  tempVal.textContent = `${weather.temp}°C`;
  descVal.textContent = weather.text;
  warningEl.textContent = weather.warning;
  
  if (weather.warning.includes("Aman")) {
    warningEl.style.backgroundColor = "var(--accent-lime-light)";
    warningEl.style.color = "var(--primary-green)";
  } else {
    warningEl.style.backgroundColor = "var(--coral-accent-light)";
    warningEl.style.color = "var(--coral-accent)";
  }

  // Get Weather SVGs
  function getWeatherIcon(iconName) {
    if (iconName === "sun") {
      return `<svg xmlns="http://www.w3.org/2000/svg" class="weather-icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else if (iconName.includes("rain")) {
      return `<svg xmlns="http://www.w3.org/2000/svg" class="weather-icon-lg animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" /><path stroke-linecap="round" d="M8 20v2m4-2v2m4-2v2" /></svg>`;
    } else if (iconName.includes("wind") || iconName.includes("fog")) {
      return `<svg xmlns="http://www.w3.org/2000/svg" class="weather-icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else {
      // cloud or cloud-sun
      return `<svg xmlns="http://www.w3.org/2000/svg" class="weather-icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>`;
    }
  }

  iconBox.innerHTML = getWeatherIcon(weather.icon);

  // Weather discount alert
  if (discount > 0) {
    discountStrip.style.display = "block";
    document.getElementById("weather-discount-pct").textContent = `${discount}%`;
  }

  // 3-Day Forecast Injection
  forecastContainer.innerHTML = "";
  weather.forecast.forEach(item => {
    let discBadge = "";
    if (item.discount) {
      discBadge = `<div style="font-size: 0.7rem; color: var(--coral-accent); font-weight: 700; background: var(--coral-accent-light); padding: 1px 4px; border-radius: var(--radius-sm); display:inline-block; margin-top: 2px;">Disc ${item.discount}%</div>`;
    }
    
    forecastContainer.innerHTML += `
      <div class="forecast-day-card">
        <div style="font-weight: 700; color: var(--gray-600);">${item.day}</div>
        <div style="margin: 4px 0;">${getWeatherIcon(item.icon)}</div>
        <div style="font-weight: 700;">${item.temp}°C</div>
        <div style="font-size: 0.75rem; color: var(--gray-500);">${item.text}</div>
        ${discBadge}
      </div>
    `;
  });
}

// 5. Tabs switch
function initTabs(dest) {
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

  // Inject content
  document.getElementById("dest-desc-text").textContent = dest.description;
  
  // Facilities
  const facList = document.getElementById("dest-facilities-list");
  facList.innerHTML = "";
  dest.facilities.forEach(fac => {
    facList.innerHTML += `
      <li style="list-style: none; display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--primary-green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        <span>${fac}</span>
      </li>
    `;
  });

  // Access
  document.getElementById("dest-access-text").textContent = dest.access;

  // Rules
  const rulesList = document.getElementById("dest-rules-list");
  rulesList.innerHTML = "";
  dest.rules.forEach(rule => {
    rulesList.innerHTML += `
      <li style="list-style: none; display: flex; align-items: start; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="margin-top: 4px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${rule}</span>
      </li>
    `;
  });
}

// 6. UMKM Spotlight cards
function initUMKMSpotlight(umkmIds) {
  const container = document.getElementById("umkm-spotlight-container");
  if (!container || !umkmIds) return;

  const products = window.LanglangData.getProducts();
  const matched = products.filter(p => umkmIds.includes(p.id));

  container.innerHTML = "";
  matched.slice(0, 2).forEach(prod => {
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(prod.price);
    
    container.innerHTML += `
      <div class="spotlight-card" onclick="window.location.href='marketplace.html?id=${prod.id}'">
        <img class="spotlight-img" src="${prod.image}" alt="${prod.name}">
        <div style="display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
          <div>
            <h4 style="font-size: 0.85rem; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${prod.name}</h4>
            <span style="font-size: 0.7rem; color: var(--primary-green); font-weight: 700;">${prod.origin}</span>
          </div>
          <div class="flex-between">
            <span style="font-weight: 800; font-size: 0.85rem; color: var(--deep-charcoal);">${formattedPrice}</span>
            <span class="badge badge-eco" style="font-size: 0.6rem; padding: 2px 6px;">Eco</span>
          </div>
        </div>
      </div>
    `;
  });
}

// 7. UGC Reviews & Form submissions
function initUGCSection(destinationId) {
  const reviewsFeed = document.getElementById("ugc-reviews-feed-container");
  const reviewForm = document.getElementById("ugc-review-form");
  const starInputContainer = document.getElementById("input-stars-rating");

  // Local storage cache for added reviews
  const storageKey = `langlang_ugc_${destinationId}`;
  
  // Pre-load default reviews
  const defaultReviews = [
    { name: "Siti Nurhaliza", rating: 5, date: "10 Juni 2026", text: "Curug Cikaso luar biasa indahnya! Air terjunnya jernih banget. Akses sewa perahu seru menyusuri sungai. Saya buang botol plastik di Smart Eco-Bin juga dapat poin langsung di profile. Keren Langlang!" },
    { name: "Dewo Prasetyo", rating: 4, date: "18 Mei 2026", text: "Pemandangan air terjunnya toska mempesona. Fasilitas toilet sanitasi Langlang Care sedang dikerjakan dan sudah lumayan bersih. Sangat terbantu info AI cuaca kemarin, jadi pas cerah maksimal fotonya." }
  ];

  let currentReviews = JSON.parse(localStorage.getItem(storageKey));
  if (!currentReviews) {
    localStorage.setItem(storageKey, JSON.stringify(defaultReviews));
    currentReviews = defaultReviews;
  }

  function renderReviews() {
    reviewsFeed.innerHTML = "";
    currentReviews.forEach(rev => {
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        starsHTML += `<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: ${i <= rev.rating ? 'var(--gold-reward)' : 'var(--gray-200)'}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      }

      reviewsFeed.innerHTML += `
        <div class="ugc-item">
          <div class="flex-between">
            <div class="ugc-user">
              <div style="width: 28px; height: 28px; border-radius: 50%; background-color: var(--primary-green-light); color: var(--primary-green); font-weight: 800; font-size: 0.8rem;" class="flex-center">
                ${rev.name.charAt(0)}
              </div>
              <span>${rev.name}</span>
            </div>
            <span style="font-size: 0.75rem; color: var(--gray-400);">${rev.date}</span>
          </div>
          <div style="display: flex; gap: 2px;">${starsHTML}</div>
          <p style="font-size: 0.9rem; color: var(--gray-600);">${rev.text}</p>
        </div>
      `;
    });
  }

  // Render Stars interactive input selector
  let selectedRating = 5;
  function renderInteractiveStars(rating) {
    starInputContainer.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = `<svg viewBox="0 0 24 24" style="width:20px; height:20px; fill:${i <= rating ? 'var(--gold-reward)' : 'var(--gray-200)'}; transition: transform 0.1s;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      star.style.cursor = "pointer";
      star.addEventListener("click", () => {
        selectedRating = i;
        renderInteractiveStars(selectedRating);
      });
      starInputContainer.appendChild(star);
    }
  }

  // Submit Review form handler
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const commentInput = document.getElementById("review-comment-input");
    const userProfile = window.LanglangData.getUserProfile();
    
    const newRev = {
      name: userProfile.name,
      rating: selectedRating,
      date: "Hari Ini",
      text: commentInput.value.trim()
    };

    currentReviews.unshift(newRev);
    localStorage.setItem(storageKey, JSON.stringify(currentReviews));
    
    // UI update
    renderReviews();
    commentInput.value = "";
    selectedRating = 5;
    renderInteractiveStars(5);

    window.showToast("Ulasan Anda dipublikasikan!", "success");
  });

  // Init
  renderReviews();
  renderInteractiveStars(5);
}

// 8. Booking Stepper, Calculations & Check-out Handlers
function initBookingCard(dest, weatherDiscount) {
  // Booking Card elements
  const basePriceDisplay = document.getElementById("booking-price-display");
  const quotaCountDisplay = document.getElementById("booking-quota-count");
  const quotaProgressBar = document.getElementById("booking-quota-progress-bar");
  const countdownTimer = document.getElementById("booking-countdown-timer");
  const datePicker = document.getElementById("booking-visit-date");
  
  const labelPriceDewasa = document.getElementById("ticket-dewasa-price-label");
  const labelPriceAnak = document.getElementById("ticket-anak-price-label");
  
  const countDewasaText = document.getElementById("count-dewasa");
  const countAnakText = document.getElementById("count-anak");
  const careDonateCheckbox = document.getElementById("booking-care-donate-checkbox");
  const totalDisplay = document.getElementById("booking-total-display");
  const checkoutBtn = document.getElementById("checkout-booking-btn");
  
  // Tickets Count state
  let countDewasa = 1;
  let countAnak = 0;
  
  // Price definitions (Dewasa, Anak 50%)
  let basePrice = dest.price;
  if (weatherDiscount > 0) {
    basePrice = Math.floor(basePrice * (1 - (weatherDiscount / 100)));
  }

  const priceDewasa = basePrice;
  const priceAnak = Math.floor(basePrice * 0.5);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Set prices text
  basePriceDisplay.textContent = formatIDR(basePrice);
  labelPriceDewasa.textContent = formatIDR(priceDewasa);
  labelPriceAnak.textContent = formatIDR(priceAnak);

  // Set Quota Progress Bar
  const sisaQuota = dest.quotaTotal - dest.quotaBooked;
  quotaCountDisplay.textContent = `${sisaQuota} / ${dest.quotaTotal} Slot`;
  const pctUsed = Math.floor((dest.quotaBooked / dest.quotaTotal) * 100);
  quotaProgressBar.style.width = `${pctUsed}%`;

  // Countdown timer target 23:59:59 today
  function updateCountdown() {
    const now = new Date();
    const target = new Date();
    target.setHours(23, 59, 59, 999);
    
    let diff = target - now;
    if (diff < 0) diff = 0;

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const mins = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
    const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

    countdownTimer.textContent = `${hours}:${mins}:${secs}`;
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Set Minimum Visit Date to Today
  const todayStr = new Date().toISOString().split("T")[0];
  datePicker.setAttribute("min", todayStr);
  datePicker.value = todayStr; // Pre-fill with today

  // Recalculate cost
  function recalculateTotal() {
    let ticketsSubtotal = (countDewasa * priceDewasa) + (countAnak * priceAnak);
    let donation = careDonateCheckbox.checked ? 10000 : 0;
    let finalTotal = ticketsSubtotal + donation;

    totalDisplay.textContent = formatIDR(finalTotal);
  }

  // Incrementor event listeners
  document.getElementById("btn-inc-dewasa").addEventListener("click", () => {
    if (countDewasa + countAnak < sisaQuota) {
      countDewasa++;
      countDewasaText.textContent = countDewasa;
      recalculateTotal();
    } else {
      window.showToast("Kuota harian tidak mencukupi!", "error");
    }
  });

  document.getElementById("btn-dec-dewasa").addEventListener("click", () => {
    if (countDewasa > 1) {
      countDewasa--;
      countDewasaText.textContent = countDewasa;
      recalculateTotal();
    }
  });

  document.getElementById("btn-inc-anak").addEventListener("click", () => {
    if (countDewasa + countAnak < sisaQuota) {
      countAnak++;
      countAnakText.textContent = countAnak;
      recalculateTotal();
    } else {
      window.showToast("Kuota harian tidak mencukupi!", "error");
    }
  });

  document.getElementById("btn-dec-anak").addEventListener("click", () => {
    if (countAnak > 0) {
      countAnak--;
      countAnakText.textContent = countAnak;
      recalculateTotal();
    }
  });

  careDonateCheckbox.addEventListener("change", recalculateTotal);

  // Beli Tiket Checkout Trigger
  checkoutBtn.addEventListener("click", () => {
    const selectedDate = datePicker.value;
    if (!selectedDate) {
      window.showToast("Pilih tanggal kunjungan dahulu!", "error");
      datePicker.focus();
      return;
    }

    const donateFlag = careDonateCheckbox.checked;
    
    // Redirect parameters: id, date, adults, kids, donate
    const queryStr = `id=${dest.id}&date=${selectedDate}&adults=${countDewasa}&kids=${countAnak}&donate=${donateFlag}`;
    window.location.href = `checkout.html?${queryStr}`;
  });

  // Init calculation
  recalculateTotal();
}
