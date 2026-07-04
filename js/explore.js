/*
  explore.js - Explore Page Filter and Map view logic
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initExplore();
});

function initExplore() {
  const destinations = window.LanglangData.getDestinations();
  
  // DOM Elements
  const gridContainer = document.getElementById("explore-destinations-grid");
  const mapView = document.getElementById("explore-map-view");
  const mapCanvas = document.getElementById("map-canvas");
  const searchInput = document.getElementById("live-search-input");
  const sortSelect = document.getElementById("sort-select-option");
  
  const btnViewGrid = document.getElementById("btn-view-grid");
  const btnViewMap = document.getElementById("btn-view-map");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const loadMoreContainer = document.getElementById("load-more-container");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  
  // Map Popup Elements
  const mapPopup = document.getElementById("map-pin-popup");
  const mapPopupClose = document.getElementById("map-popup-close-btn");
  const popupImg = document.getElementById("popup-dest-img");
  const popupName = document.getElementById("popup-dest-name");
  const popupLoc = document.getElementById("popup-dest-loc");
  const popupPrice = document.getElementById("popup-dest-price");
  const popupLink = document.getElementById("popup-dest-link");

  // State
  let currentView = "grid"; // 'grid' or 'map'
  let displayedLimit = 6;
  let filteredData = [...destinations];

  // 1. Parse URL parameters for pre-applied queries
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("query");
  const initialType = urlParams.get("type");

  if (initialQuery) {
    searchInput.value = initialQuery;
  }
  
  if (initialType) {
    // Check corresponding type checkbox
    const checkbox = document.querySelector(`#filter-type-group input[value="${initialType}"]`);
    if (checkbox) checkbox.checked = true;
  }

  // 2. View Toggle Handler
  btnViewGrid.addEventListener("click", () => {
    currentView = "grid";
    btnViewGrid.classList.add("active");
    btnViewMap.classList.remove("active");
    gridContainer.style.display = "grid";
    mapView.style.display = "none";
    updateViewDisplay();
  });

  btnViewMap.addEventListener("click", () => {
    currentView = "map";
    btnViewMap.classList.add("active");
    btnViewGrid.classList.remove("active");
    gridContainer.style.display = "none";
    mapView.style.display = "block";
    updateViewDisplay();
  });

  // Close map popup
  mapPopupClose.addEventListener("click", () => {
    mapPopup.classList.remove("active");
    // deactivate active pins
    document.querySelectorAll(".map-pin").forEach(p => p.classList.remove("active"));
  });

  // 3. Filter Event Listeners
  const filterCheckboxes = document.querySelectorAll(".filter-sidebar input[type='checkbox']");
  filterCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      displayedLimit = 6; // Reset display limit
      applyFiltersAndRender();
    });
  });

  searchInput.addEventListener("input", () => {
    displayedLimit = 6;
    applyFiltersAndRender();
  });

  sortSelect.addEventListener("change", () => {
    applyFiltersAndRender();
  });

  resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterCheckboxes.forEach(cb => cb.checked = false);
    sortSelect.value = "terpopuler";
    displayedLimit = 6;
    window.showToast("Filter dibersihkan", "info");
    applyFiltersAndRender();
  });

  // Infinite scroll click handler
  loadMoreBtn.addEventListener("click", () => {
    displayedLimit += 6;
    renderGrid();
  });

  // 4. Main filter logic
  function applyFiltersAndRender() {
    // Gather filter criteria
    const searchVal = searchInput.value.trim().toLowerCase();
    
    // Checked values arrays
    const selectedProvinces = getCheckedValues("filter-province-group");
    const selectedTypes = getCheckedValues("filter-type-group");
    const selectedBadges = getCheckedValues("filter-badge-group");
    const selectedWeather = getCheckedValues("filter-weather-group");

    filteredData = destinations.filter(dest => {
      // 1. Search Query
      const matchesSearch = !searchVal || 
        dest.name.toLowerCase().includes(searchVal) || 
        dest.location.toLowerCase().includes(searchVal) || 
        dest.type.toLowerCase().includes(searchVal);

      // 2. Province Filter
      let matchesProvince = selectedProvinces.length === 0;
      if (selectedProvinces.length > 0) {
        // Handle maluku/sulawesi grouping
        matchesProvince = selectedProvinces.some(prov => {
          if (prov === "Maluku") {
            return dest.province.includes("Maluku") || dest.province.includes("Sulawesi") || dest.province.includes("Kalimantan");
          }
          return dest.province === prov;
        });
      }

      // 3. Type Filter
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(dest.type);

      // 4. Badge Filter
      const matchesBadge = selectedBadges.length === 0 || selectedBadges.includes(dest.badge);

      // 5. Weather Filter
      let matchesWeather = selectedWeather.length === 0;
      if (selectedWeather.length > 0) {
        matchesWeather = selectedWeather.some(cond => {
          if (cond === "Cerah") return dest.weather.text.includes("Cerah");
          if (cond === "Berawan") return dest.weather.text.includes("Berawan") || dest.weather.text.includes("Kabut") || dest.weather.text.includes("Dingin");
          if (cond === "Hujan") return dest.weather.text.includes("Hujan");
          return false;
        });
      }

      return matchesSearch && matchesProvince && matchesType && matchesBadge && matchesWeather;
    });

    // Apply Sorting
    const sortVal = sortSelect.value;
    if (sortVal === "termurah") {
      filteredData.sort((a, b) => a.price - b.price);
    } else if (sortVal === "termahal") {
      filteredData.sort((a, b) => b.price - a.price);
    } else if (sortVal === "rating") {
      filteredData.sort((a, b) => b.rating - a.rating);
    } else {
      // terpopuler
      filteredData.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    updateViewDisplay();
  }

  // Get selected checkboxes in a group
  function getCheckedValues(groupId) {
    const parent = document.getElementById(groupId);
    if (!parent) return [];
    const checked = parent.querySelectorAll("input:checked");
    return Array.from(checked).map(cb => cb.value);
  }

  // Render current view
  function updateViewDisplay() {
    if (currentView === "grid") {
      renderGrid();
    } else {
      renderMap();
    }
  }

  // Render Grid
  function renderGrid() {
    gridContainer.innerHTML = "";
    
    if (filteredData.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--gray-200);">
          <svg style="width: 48px; height: 48px; color: var(--gray-400); margin-bottom: var(--space-2);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3>Tidak ada destinasi cocok</h3>
          <p>Coba bersihkan atau ganti filter pencarian Anda.</p>
        </div>
      `;
      loadMoreContainer.style.display = "none";
      return;
    }

    const itemsToRender = filteredData.slice(0, displayedLimit);
    
    itemsToRender.forEach((dest, index) => {
      let badgeClass = "badge-hidden-gem";
      if (dest.badge === "Populer") badgeClass = "badge-populer";
      if (dest.badge === "Eco-Friendly") badgeClass = "badge-eco";

      const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(dest.price);

      // Simple localStorage bookmarks check
      const savedList = JSON.parse(localStorage.getItem("langlang_saved_destinations") || "[]");
      const isSaved = savedList.includes(dest.id);

      const card = document.createElement("div");
      card.className = "card animate-slide-up";
      card.style.animationDelay = `${(index % 3) * 100}ms`;
      
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img class="card-img" src="${dest.image}" alt="${dest.name}" onclick="window.location.href='destination.html?id=${dest.id}'">
          <div style="position: absolute; top: var(--space-1); left: var(--space-1);">
            <span class="badge ${badgeClass}">${dest.badge}</span>
          </div>
          <div style="position: absolute; top: var(--space-1); right: var(--space-1);">
            <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${dest.id}" aria-label="Simpan destinasi">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="${isSaved ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
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
          
          <h3 class="card-title" onclick="window.location.href='destination.html?id=${dest.id}'">${dest.name}</h3>
          
          <div style="display: flex; align-items: center; gap: 4px; color: var(--gray-500); font-size: 0.85rem;" onclick="window.location.href='destination.html?id=${dest.id}'">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>${dest.location}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--sky-blue); margin-top: 4px;">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
            <span>Cuaca: ${dest.weather.text} (${dest.weather.temp}°C)</span>
          </div>
          
          <div class="card-footer">
            <div class="card-price">${formattedPrice} <span>/ orang</span></div>
            <a href="destination.html?id=${dest.id}" class="btn btn-primary btn-sm">Detail</a>
          </div>
        </div>
      `;

      // Save bookmark click interaction
      const saveBtn = card.querySelector(".btn-save");
      saveBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        const id = this.getAttribute("data-id");
        toggleSaveDestination(id, this);
      });

      gridContainer.appendChild(card);
    });

    // Control visibility of "Load More" button
    if (filteredData.length > displayedLimit) {
      loadMoreContainer.style.display = "flex";
    } else {
      loadMoreContainer.style.display = "none";
    }
  }

  // Toggle Saved Destinations
  function toggleSaveDestination(id, element) {
    let savedList = JSON.parse(localStorage.getItem("langlang_saved_destinations") || "[]");
    const index = savedList.indexOf(id);
    
    if (index > -1) {
      savedList.splice(index, 1);
      element.classList.remove("saved");
      element.querySelector("svg").setAttribute("fill", "none");
      window.showToast("Destinasi dihapus dari favorit", "info");
    } else {
      savedList.push(id);
      element.classList.add("saved");
      element.querySelector("svg").setAttribute("fill", "currentColor");
      window.showToast("Destinasi disimpan ke favorit!", "success");
    }
    
    localStorage.setItem("langlang_saved_destinations", JSON.stringify(savedList));
  }

  // Render Map Pin simulation
  function renderMap() {
    // Remove existing pins
    document.querySelectorAll(".map-pin").forEach(p => p.remove());
    mapPopup.classList.remove("active");

    if (filteredData.length === 0) {
      return;
    }

    filteredData.forEach(dest => {
      const pin = document.createElement("div");
      pin.className = "map-pin";
      // Position the pin on our simulated map
      pin.style.left = `${dest.coordinates.x}%`;
      pin.style.top = `${dest.coordinates.y}%`;
      pin.setAttribute("title", dest.name);

      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Deactivate other pins
        document.querySelectorAll(".map-pin").forEach(p => p.classList.remove("active"));
        pin.classList.add("active");

        // Set popup data
        popupImg.src = dest.image;
        popupImg.alt = dest.name;
        popupName.textContent = dest.name;
        popupLoc.textContent = dest.location;
        
        const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(dest.price);
        popupPrice.textContent = formattedPrice;
        popupLink.href = `destination.html?id=${dest.id}`;

        // Show popup
        mapPopup.classList.add("active");
      });

      mapCanvas.appendChild(pin);
    });
  }

  // Close popup if clicking on map background
  mapCanvas.addEventListener("click", (e) => {
    if (e.target === mapCanvas || e.target.classList.contains("indonesia-island-outline")) {
      mapPopup.classList.remove("active");
      document.querySelectorAll(".map-pin").forEach(p => p.classList.remove("active"));
    }
  });

  // Initial Filter Execution
  applyFiltersAndRender();
}
