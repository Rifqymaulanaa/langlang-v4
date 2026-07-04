/*
  marketplace.js - Marketplace product filters and cart systems
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initMarketplace();
});

function initMarketplace() {
  const products = window.LanglangData.getProducts();

  // DOM Elements
  const gridContainer = document.getElementById("marketplace-product-grid");
  const searchInput = document.getElementById("market-search-input");
  const cbCategories = document.querySelectorAll("#market-category-group input");
  const cbEcoOnly = document.getElementById("market-filter-eco-only");
  const matchedCountEl = document.getElementById("market-matched-count");
  const resetFiltersBtn = document.getElementById("market-reset-filters-btn");
  
  // Cart Trigger & Overlays
  const cartFloatBtn = document.getElementById("market-cart-float-btn");
  const cartQtyBadge = document.getElementById("market-cart-qty-badge");
  const cartOverlay = document.getElementById("cart-modal-overlay");
  const cartCloseBtn = document.getElementById("cart-modal-close-btn");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartSubtotalEl = document.getElementById("cart-subtotal-display");
  const cartCheckoutBtn = document.getElementById("cart-checkout-btn");

  // Product Modal
  const prodModal = document.getElementById("product-detail-modal-overlay");
  const prodModalClose = document.getElementById("product-modal-close-btn");
  const modalImg = document.getElementById("modal-prod-image");
  const modalEcoBadge = document.getElementById("modal-prod-eco-badge");
  const modalCategoryBadge = document.getElementById("modal-prod-category");
  const modalName = document.getElementById("modal-prod-name");
  const modalOrigin = document.getElementById("modal-prod-origin");
  const modalTokoFisik = document.getElementById("modal-prod-toko-fisik");
  const modalDesc = document.getElementById("modal-prod-desc");
  const modalPrice = document.getElementById("modal-prod-price");
  const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");

  // AI Recommendation Trigger
  const aiRecomBtn = document.getElementById("ai-recom-view-btn");
  const aiBanner = document.getElementById("ai-recommendations-banner");

  // State
  let cart = JSON.parse(localStorage.getItem("langlang_cart") || "[]");
  let activeProductIdInModal = null;

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // 1. Sync Cart Badges initially
  updateCartBadge();

  // 2. Filter Event Listeners
  searchInput.addEventListener("input", filterAndRender);
  cbCategories.forEach(cb => cb.addEventListener("change", filterAndRender));
  cbEcoOnly.addEventListener("change", filterAndRender);
  
  resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    cbCategories.forEach(cb => cb.checked = true);
    cbEcoOnly.checked = false;
    filterAndRender();
    window.showToast("Filter disetel ulang", "info");
  });

  // 3. AI Recommendation Click
  aiRecomBtn.addEventListener("click", () => {
    // Curug Cikaso products are ID 1 and 2
    searchInput.value = "Cikaso";
    cbEcoOnly.checked = false;
    filterAndRender();
    window.showToast("Menampilkan produk sekitar Cikaso", "success");
    aiBanner.style.borderStyle = "solid";
  });

  // 4. Cart Floating click & Overlay handlers
  cartFloatBtn.addEventListener("click", () => {
    renderCartItems();
    cartOverlay.classList.add("active");
  });

  cartCloseBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
  });

  // 5. Checkout Cart Items
  cartCheckoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      window.showToast("Keranjang belanja kosong!", "error");
      return;
    }

    // Simulate purchasing
    cartCheckoutBtn.disabled = true;
    cartCheckoutBtn.textContent = "Menghubungkan Transaksi...";
    
    setTimeout(() => {
      cartCheckoutBtn.disabled = false;
      cartCheckoutBtn.textContent = "Proses Pembelian UMKM";
      
      // Clear Cart
      cart = [];
      localStorage.setItem("langlang_cart", JSON.stringify(cart));
      updateCartBadge();
      cartOverlay.classList.remove("active");
      
      window.showToast("Pembelian UMKM sukses, barang diproses!", "success");
      
      // Update points gained (e.g. +20 points for supporting local UMKM)
      const profile = window.LanglangData.getUserProfile();
      profile.ecoPoints += 30;
      localStorage.setItem("langlang_userProfile", JSON.stringify(profile));
    }, 1500);
  });

  // 6. Product Detail Modal handlers
  prodModalClose.addEventListener("click", () => {
    prodModal.classList.remove("active");
  });

  modalAddToCartBtn.addEventListener("click", () => {
    if (activeProductIdInModal) {
      addToCart(activeProductIdInModal);
      prodModal.classList.remove("active");
    }
  });

  // 7. Core filter and rendering
  function filterAndRender() {
    const searchVal = searchInput.value.toLowerCase().trim();
    const ecoOnly = cbEcoOnly.checked;
    
    // Checked Categories list
    const checkedCats = Array.from(cbCategories)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const matched = products.filter(p => {
      const matchesSearch = !searchVal || 
        p.name.toLowerCase().includes(searchVal) || 
        p.origin.toLowerCase().includes(searchVal) || 
        p.description.toLowerCase().includes(searchVal);
      
      const matchesCategory = checkedCats.includes(p.category);
      const matchesEco = !ecoOnly || p.ecoFriendly;

      return matchesSearch && matchesCategory && matchesEco;
    });

    matchedCountEl.textContent = matched.length;

    gridContainer.innerHTML = "";
    
    if (matched.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--gray-200);">
          <h3>Produk tidak ditemukan</h3>
          <p>Coba saring dengan kata kunci atau kategori yang berbeda.</p>
        </div>
      `;
      return;
    }

    matched.forEach((prod, index) => {
      const formattedPrice = formatIDR(prod.price);
      
      const card = document.createElement("div");
      card.className = "card animate-slide-up";
      card.style.animationDelay = `${(index % 3) * 100}ms`;
      
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img class="card-img" src="${prod.image}" alt="${prod.name}">
          
          <div class="market-card-badge-container">
            ${prod.ecoFriendly ? '<span class="badge badge-eco">🍃 Eco-Friendly</span>' : ''}
            <span class="badge badge-outline" style="background: rgba(255,255,255,0.95);">${prod.category}</span>
          </div>

        </div>
        
        <div class="card-content">
          <span style="font-size: 0.75rem; color: var(--primary-green); font-weight: 700;">${prod.origin}</span>
          <h3 class="card-title" style="font-size: 1rem; margin-top: 2px;">${prod.name}</h3>
          
          <p class="card-desc" style="-webkit-line-clamp: 2; height: 36px;">${prod.description}</p>
          
          <!-- Physical store mapping info (PRD 4.7) -->
          <div style="font-size: 0.75rem; font-weight: 600; color: var(--gray-500); display: flex; align-items: center; gap: 4px; margin-bottom: var(--space-1);">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Toko Fisik Desa Wisata</span>
          </div>

          <div class="card-footer">
            <div class="card-price" style="font-size: 1rem;">${formattedPrice}</div>
            <button class="btn btn-primary btn-sm add-cart-direct-btn" data-id="${prod.id}">+ Beli</button>
          </div>
        </div>
      `;

      // Direct card click opens details modal
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-cart-direct-btn")) {
          e.stopPropagation();
          const id = parseInt(e.target.getAttribute("data-id"));
          addToCart(id);
        } else {
          openDetailsModal(prod);
        }
      });

      gridContainer.appendChild(card);
    });
  }

  // 8. Open details Modal (P1)
  function openDetailsModal(prod) {
    activeProductIdInModal = prod.id;
    
    modalImg.src = prod.image;
    modalImg.alt = prod.name;
    modalName.textContent = prod.name;
    modalOrigin.textContent = prod.origin;
    modalDesc.textContent = prod.description;
    modalPrice.textContent = formatIDR(prod.price);
    
    modalEcoBadge.style.display = prod.ecoFriendly ? "inline-flex" : "none";
    modalCategoryBadge.textContent = prod.category;

    // Connect to locations text (simulated PRD 4.7)
    let loc = "Desa Cikaso, Sukabumi";
    if (prod.origin.includes("Samosir")) loc = "Desa Samosir, Danau Toba";
    if (prod.origin.includes("Wae Rebo")) loc = "Kampung Adat Wae Rebo, Flores";
    if (prod.origin.includes("Penglipuran")) loc = "Desa Adat Penglipuran, Bali";
    if (prod.origin.includes("Gunungkidul")) loc = "Gua Pindul, Yogyakarta";
    
    modalTokoFisik.innerHTML = `📍 Tersedia di toko fisik mitra Desa Wisata: <strong>${loc}</strong>`;

    prodModal.classList.add("active");
  }

  // 9. Add to Cart Core logic
  function addToCart(productId) {
    const existing = cart.find(c => c.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ productId: productId, qty: 1 });
    }
    
    localStorage.setItem("langlang_cart", JSON.stringify(cart));
    updateCartBadge();
    
    const prod = products.find(p => p.id === productId);
    window.showToast(`${prod.name} ditambah ke keranjang!`, "success");
  }

  function updateCartBadge() {
    let totalItems = 0;
    cart.forEach(c => totalItems += c.qty);
    cartQtyBadge.textContent = totalItems;
  }

  // 10. Render Cart Items List in Slide-over
  function renderCartItems() {
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--gray-400); padding: 30px 0;">Keranjang belanja Anda masih kosong.</p>`;
      cartSubtotalEl.textContent = formatIDR(0);
      return;
    }

    let subtotal = 0;
    
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return;

      const itemCost = prod.price * item.qty;
      subtotal += itemCost;

      const itemRow = document.createElement("div");
      itemRow.className = "flex-between";
      itemRow.style.cssText = "background: var(--gray-50); border: 1px solid var(--gray-200); padding: 8px; border-radius: var(--radius-md); gap: 10px;";
      
      itemRow.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.8rem; font-weight: 700; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${prod.name}</h4>
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary-green);">${formatIDR(prod.price)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-secondary btn-sm cart-dec-qty" data-id="${prod.id}" style="padding: 1px 6px; font-size: 0.75rem; border-radius: 50%;">-</button>
          <span style="font-weight: 700; font-size: 0.85rem;">${item.qty}</span>
          <button class="btn btn-secondary btn-sm cart-inc-qty" data-id="${prod.id}" style="padding: 1px 6px; font-size: 0.75rem; border-radius: 50%;">+</button>
        </div>
        <button class="btn-save cart-remove-item" data-id="${prod.id}" style="border:none; background:transparent; width:auto; height:auto; color: var(--coral-accent);" aria-label="Hapus barang">
          &times;
        </button>
      `;

      // Steppers event bindings
      itemRow.querySelector(".cart-dec-qty").addEventListener("click", () => {
        adjustCartQty(prod.id, -1);
      });
      itemRow.querySelector(".cart-inc-qty").addEventListener("click", () => {
        adjustCartQty(prod.id, 1);
      });
      itemRow.querySelector(".cart-remove-item").addEventListener("click", () => {
        removeCartItem(prod.id);
      });

      cartItemsContainer.appendChild(itemRow);
    });

    cartSubtotalEl.textContent = formatIDR(subtotal);
  }

  function adjustCartQty(productId, delta) {
    const item = cart.find(c => c.productId === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeCartItem(productId);
      return;
    }
    
    localStorage.setItem("langlang_cart", JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
  }

  function removeCartItem(productId) {
    cart = cart.filter(c => c.productId !== productId);
    localStorage.setItem("langlang_cart", JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
    window.showToast("Barang dihapus dari keranjang", "info");
  }

  // 11. Cross-page direct details link mapping (P1)
  const productParamId = parseInt(urlParams.get("id"));
  if (productParamId) {
    const matchedParamProd = products.find(p => p.id === productParamId);
    if (matchedParamProd) {
      openDetailsModal(matchedParamProd);
    }
  }

  // Init grid
  filterAndRender();
}
