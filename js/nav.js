/*
  nav.js - Global Navbar, Mobile Navigation, Footer, and Common UI Utilities
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initGlobalNavigation();
  initToastContainer();
});

// Toast Manager
window.showToast = function(message, type = "success") {
  const container = document.getElementById("global-toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} animate-slide-up`;
  
  let icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `; // Default success icon

  if (type === "error") {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  } else if (type === "info") {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Auto-dismiss after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 3000);
};

function initToastContainer() {
  let container = document.getElementById("global-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "global-toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

function initGlobalNavigation() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");
  
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  // Load User Profile to display Avatar
  const profile = window.LanglangData ? window.LanglangData.getUserProfile() : { name: "Guest", avatar: "" };

  // 1. Injeksi Desktop & Mobile Navbar
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
      <nav class="navbar" id="global-navbar">
        <div class="container">
          <a href="index.html" class="logo-container">
            <img class="logo-img" src="logo.png" alt="Logo Langlang">
            <span class="logo-text">Lang<span>lang</span></span>
          </a>

          <ul class="nav-links">
            <li><a href="index.html" class="nav-link ${pageName === "index.html" ? "active" : ""}">Beranda</a></li>
            <li><a href="explore.html" class="nav-link ${pageName === "explore.html" ? "active" : ""}">Explore</a></li>
            <li><a href="open-trip.html" class="nav-link ${pageName === "open-trip.html" ? "active" : ""}">Open Trip</a></li>
            <li><a href="marketplace.html" class="nav-link ${pageName === "marketplace.html" ? "active" : ""}">Marketplace</a></li>
            <li><a href="care.html" class="nav-link ${pageName === "care.html" ? "active" : ""}">Langlang Care</a></li>
          </ul>

          <div class="nav-actions">
            <a href="admin.html" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full);">Mitra Desa</a>
            <a href="profile.html" class="flex-center" style="gap: 8px; font-weight: 700; font-size: 0.9rem;">
              <img src="${profile.avatar}" alt="${profile.name}" style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--primary-green); object-fit: cover;">
              <span class="desktop-only" style="color: var(--deep-charcoal);">${profile.name}</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Mobile Bottom Nav (PRD 5.4 Spec) -->
      <nav class="mobile-bottom-nav">
        <ul>
          <li>
            <a href="index.html" class="${pageName === "index.html" ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Beranda</span>
            </a>
          </li>
          <li>
            <a href="explore.html" class="${pageName === "explore.html" || pageName === "destination.html" || pageName === "virtual-tour.html" ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Explore</span>
            </a>
          </li>
          <li>
            <a href="care.html" class="${pageName === "care.html" ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Care</span>
            </a>
          </li>
          <li>
            <a href="marketplace.html" class="${pageName === "marketplace.html" ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Belanja</span>
            </a>
          </li>
          <li>
            <a href="profile.html" class="${pageName === "profile.html" ? "active" : ""}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profil</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }

  // Scroll effect on Navbar
  window.addEventListener("scroll", function() {
    const navbar = document.getElementById("global-navbar");
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // 2. Injeksi Global Footer
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <a href="index.html" class="footer-logo" style="display: flex; align-items: center; gap: 8px;"><img src="logo.png" alt="Logo Langlang" style="height: 36px; border-radius: var(--radius-sm);"><span style="color: var(--white);">Lang</span><span>lang</span></a>
              <p class="footer-desc">
                Platform pariwisata digital terintegrasi untuk mendigitalkan desa wisata, memberdayakan UMKM lokal, dan mendukung pariwisata berkelanjutan (SDGs) di Indonesia.
              </p>
            </div>
            
            <div class="footer-col">
              <h4>Jelajah</h4>
              <ul class="footer-links">
                <li><a href="explore.html" class="footer-link">Destinasi Tersembunyi</a></li>
                <li><a href="open-trip.html" class="footer-link">Open Trip Komunitas</a></li>
                <li><a href="marketplace.html" class="footer-link">Pasar Digital UMKM</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Dampak & Kemitraan</h4>
              <ul class="footer-links">
                <li><a href="care.html" class="footer-link">Langlang Care</a></li>
                <li><a href="admin.html" class="footer-link">Dashboard Pengelola Desa</a></li>
                <li><a href="profile.html" class="footer-link">Eco-Dashboard Traveler</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Hubungi Kami</h4>
              <div class="footer-socials">
                <a href="#" class="social-icon" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" class="social-icon" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" class="social-icon" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
              <p style="font-size: 0.8rem; color: var(--gray-400); margin-top: 8px;">Dukung 17 Tujuan Pembangunan Berkelanjutan (SDGs)</p>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2026 Langlang. Dibuat dengan &hearts; oleh Tim Daffa, Safira, Rifqy, Faline.</p>
            <p>Untuk Demo Investor & Mentor - Kemitraan Bisnis Lokal</p>
          </div>
        </div>
      </footer>
    `;
  }
}
