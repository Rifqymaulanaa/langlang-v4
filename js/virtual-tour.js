/*
  virtual-tour.js - Panoramic dragging & hotspot interaction
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initVirtualTour();
});

function initVirtualTour() {
  const urlParams = new URLSearchParams(window.location.search);
  const destId = urlParams.get("id") || "cikaso";
  
  const dest = window.LanglangData.getDestinationById(destId);
  if (!dest) {
    window.location.href = "explore.html";
    return;
  }

  // Populate Panel Info
  document.getElementById("vt-dest-name").textContent = dest.name;
  document.getElementById("vt-dest-loc").querySelector("span").textContent = dest.location;
  document.getElementById("vt-panel-temp").textContent = `${dest.weather.temp}°C`;
  document.getElementById("vt-order-ticket-btn").href = `destination.html?id=${dest.id}`;

  // DOM Elements
  const dragArea = document.getElementById("vt-drag-area");
  const canvas = document.getElementById("vt-canvas");
  const bgLayer = document.getElementById("vt-bg-layer");
  const thumbsContainer = document.getElementById("vt-scenes-thumbs");
  const tutorial = document.getElementById("vt-tutorial");
  
  // Tooltip
  const tooltip = document.getElementById("vt-tooltip");
  const tooltipTitle = document.getElementById("vt-tooltip-title");
  const tooltipDesc = document.getElementById("vt-tooltip-desc");
  const tooltipClose = document.getElementById("vt-tooltip-close");

  // Scene Definitions & Hotspots Mock Data (specific to scene types)
  const sceneHotspots = {
    // 1. Entrance scene
    entrance: [
      { left: 25, top: 40, icon: "📋", title: "Papan Informasi Tiket", desc: "Harga tiket resmi masuk Curug Cikaso adalah Rp15.000 per orang. Tercatat digital bebas calo!" },
      { left: 55, top: 55, icon: "⛵", title: "Dermaga Sampan", desc: "Titik sewa perahu tradisional menyusuri Sungai Cikaso. Biaya perahu Rp65.000 pulang-pergi untuk maksimal 10 orang." },
      { left: 80, top: 45, icon: "🌳", title: "Pohon Kiara Purba", desc: "Pohon Kiara raksasa berusia ratusan tahun yang menaungi dermaga masuk, habitat burung pipit lokal." }
    ],
    // 2. River scene
    river: [
      { left: 30, top: 60, icon: "🛶", title: "Sewa Perahu Tradisional", desc: "Sampan kayu bertenaga mesin tempel dikemudikan oleh nelayan lokal bersertifikat keamanan Langlang." },
      { left: 65, top: 30, icon: "🦅", title: "Elang Bondol Jawa", desc: "Elang Bondol (Haliastur indus) terlihat terbang rendah berburu ikan sungai. Dilindungi ketat oleh peraturan desa." },
      { left: 85, top: 50, icon: "🌿", title: "Tanaman Pakis Hias", desc: "Vegetasi liar tebing sungai didominasi tumbuhan paku purba yang menjaga kelembapan tanah tebing." }
    ],
    // 3. Waterfall scene (Curug Cikaso Main)
    waterfall: [
      { left: 20, top: 65, icon: "🏊", title: "Batas Berenang Aman", desc: "Kolam toska dangkal di pinggir tebing aman untuk bermain air. Dilarang berenang mendekati pancuran utama!" },
      { left: 50, top: 35, icon: "💦", title: "Tiga Curug Sejajar", desc: "Aliran Curug Asepan (kiri), Curug Meong (tengah), dan Curug Cikaso (kanan) menjulang setinggi 80 meter." },
      { left: 75, top: 58, icon: "🗑️", title: "Smart Eco-Bin", desc: "Tempat sampah IoT Langlang. Scan botol plastik Anda di sini untuk ditukar dengan 25 Koin Poin Traveler!" }
    ],
    // 4. Picnic scene
    picnic: [
      { left: 35, top: 62, icon: "⛺", title: "Camping Area", desc: "Lahan datar berumput hijau untuk mendirikan tenda dome kapasitas 4 orang. Lokasi terbaik mendengar gemuruh air terjun malam hari." },
      { left: 70, top: 50, icon: "🥥", title: "Warung Es Kelapa Muda", desc: "Dikelola oleh Ibu Minah, menyajikan kelapa muda segar langsung dari pohon kelapa kebun desa Cikaso seharga Rp10.000." },
      { left: 88, top: 48, icon: "🚽", title: "Fasilitas Toilet Langlang Care", desc: "Pembangunan bilik sanitasi higienis baru yang didanai dari program donasi Langlang Care." }
    ],
    // Fallback/Generic Scenes
    pier: [
      { left: 30, top: 50, icon: "📍", title: "Dermaga Samosir", desc: "Pintu masuk utama Samosir sisi Barat. Melayani penyeberangan kano wisata." }
    ],
    hill: [
      { left: 50, top: 40, icon: "⛰️", title: "Puncak Holbung", desc: "Garis sabuk perbukitan hijau menghadap langsung ke kaldera raksasa." }
    ],
    shore: [
      { left: 45, top: 60, icon: "🐠", title: "Biota Danau Toba", desc: "Habitat ikan mas pora lokal khas danau vulkanik." }
    ],
    platform: [
      { left: 50, top: 45, icon: "🌲", title: "Hutan Pinus Djuanda", desc: "Paru-paru kota Bandung memproduksi oksigen bersih dan meredam kebisingan." }
    ],
    forest: [
      { left: 35, top: 50, icon: "🐦", title: "Burung Kutilang Hutan", desc: "Suara kicauannya menemani pendakian sepanjang tebing pagi hari." }
    ],
    peak: [
      { left: 50, top: 35, icon: "🌅", title: "Puncak Khatulistiwa", desc: "Pemandangan matahari terbit dengan sudut pandang 360 derajat." }
    ],
    cottage: [
      { left: 40, top: 55, icon: "🏡", title: "Water Cottage", desc: "Cottage terapung ramah lingkungan menggunakan struktur kayu besi Maluku." }
    ],
    coral: [
      { left: 50, top: 65, icon: "🪸", title: "Sarang Karang Sawai", desc: "Terumbu karang lunak jenis Acropora yang tumbuh sehat bebas polusi kapal." }
    ],
    viewpoint: [
      { left: 50, top: 40, icon: "💧", title: "Sipiso-piso Vertikal", desc: "Air terjun jatuh bebas setinggi 120 meter menembus lapisan bebatuan andesit purba." }
    ],
    bottom: [
      { left: 45, top: 65, icon: "⚠️", title: "Zona Angin Kencang", desc: "Hembusan angin kencang membawa uap air dingin tebal, pastikan kamera terlindung." }
    ],
    gate: [
      { left: 50, top: 45, icon: "⛩️", title: "Angkul-angkul Adat", desc: "Pintu gerbang tradisional khas arsitektur Bali seragam terbuat dari tanah liat." }
    ],
    street: [
      { left: 40, top: 55, icon: "🧹", title: "Sistem Pengolahan Sampah", desc: "Setiap hari warga menyapu area pekarangan secara sukarela demi melestarikan status desa terbersih." }
    ],
    bamboo: [
      { left: 50, top: 40, icon: "🎋", title: "Konservasi Bambu", desc: "Lahan bambu seluas 45 hektar yang disakralkan untuk menjaga resapan mata air bawah tanah." }
    ],
    canyon: [
      { left: 45, top: 50, icon: "🧗", title: "Tebing Harau", desc: "Tebing vertikal raksasa favorit pemanjat tebing pemula maupun profesional dari mancanegara." }
    ],
    ricefield: [
      { left: 50, top: 60, icon: "🌾", title: "Pertanian Organik", desc: "Sawah lembah yang memanfaatkan irigasi alami limpahan air terjun tebing." }
    ],
    beach: [
      { left: 35, top: 55, icon: "🥥", title: "Pantai Hundano", desc: "Pantai berpasir putih bersih dengan lambaian nyiur kelapa yang teduh." }
    ],
    reef: [
      { left: 50, top: 60, icon: "🐢", title: "Penyu Hijau", desc: "Lokasi konservasi sarang penyu hijau bertelur secara alami." }
    ],
    paltuding: [
      { left: 50, top: 50, icon: "⛺", title: "Pos Kehutanan Paltuding", desc: "Gerbang tiket pendakian dan tempat menyewa pemandu lokal Kawah Ijen." }
    ],
    bluefire: [
      { left: 48, top: 40, icon: "🔥", title: "Reaksi Gas Belerang", desc: "Gas belerang bersuhu 600°C terbakar saat bersentuhan dengan udara, menghasilkan lidah api biru." }
    ],
    crater: [
      { left: 50, top: 55, icon: "🧪", title: "Danau Asam Pekat", desc: "Air kawah bersuhu hangat dengan keasaman mendekati pH 0, mampu melarutkan logam secara cepat." }
    ],
    jungle: [
      { left: 40, top: 50, icon: "🎒", title: "Tracking Hutan Lembab", desc: "Jalur setapak berbatu menembus hutan tropis pegunungan NTT." }
    ],
    village: [
      { left: 50, top: 45, icon: "🛖", title: "Rumah Mbaru Niang", desc: "Struktur atap rumbia melingkar 5 tingkat. Tiap tingkat memiliki fungsi adat sakral yang berbeda." }
    ],
    cave_entrance: [
      { left: 50, top: 55, icon: "🦇", title: "Koloni Kelelawar Gua", desc: "Ratusan kelelawar pemakan serangga bergelantungan di atap gua masuk." }
    ],
    stalactite: [
      { left: 48, top: 38, icon: "💎", title: "Stalaktit Soko Guru", desc: "Stalaktit terbesar di Gua Pindul yang menyatukan atap dengan dasar gua, berusia ribuan tahun." }
    ]
  };

  // 1. Render Scene Selector Thumbnails
  let currentSceneIndex = 0;
  const scenes = dest.virtualTourScenes || [
    { id: "waterfall", name: "Titik Utama", bgGradient: "linear-gradient(135deg, #1c542f, #f16d08)" }
  ];

  function renderThumbnails() {
    thumbsContainer.innerHTML = "";
    scenes.forEach((sc, index) => {
      const btn = document.createElement("button");
      btn.className = `scene-thumb ${index === 0 ? 'active' : ''}`;
      btn.setAttribute("data-scene-id", sc.id);
      btn.textContent = sc.name;
      
      btn.addEventListener("click", () => {
        if (currentSceneIndex === index) return;
        
        // Remove active class
        thumbsContainer.querySelectorAll(".scene-thumb").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        currentSceneIndex = index;
        loadScene(sc);
      });

      thumbsContainer.appendChild(btn);
    });
  }

  // Position reset logic (centered in pixels)
  function resetToCenter() {
    const viewerWidth = dragArea.clientWidth;
    const canvasWidth = canvas.clientWidth || (viewerWidth * 3);
    currentTranslateX = (viewerWidth - canvasWidth) / 2;
    updateCanvasTransform();
    velocity = 0;
  }

  function updateCanvasTransform() {
    canvas.style.transform = `translateX(${currentTranslateX}px)`;
    // Parallax: shift background-position based on how far we've dragged
    // This makes the panorama image scroll at a different rate than the canvas
    if (bgLayer) {
      const viewerWidth = dragArea.clientWidth;
      const canvasWidth = canvas.clientWidth || (viewerWidth * 3);
      const minTranslate = viewerWidth - canvasWidth;
      const range = Math.abs(minTranslate);
      // Normalize 0-100 from minTranslate to 0
      const pct = range > 0 ? ((currentTranslateX - minTranslate) / range) * 100 : 50;
      bgLayer.style.backgroundPosition = `${pct}% center`;
    }
  }

  let isInitialLoad = true;

  // 2. Load Scene Canvas & Hotspots
  function loadScene(scene) {
    // Hide tooltip on transition
    tooltip.style.display = "none";

    // Cancel easing animation if running
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const performLoad = () => {
      bgLayer.innerHTML = ""; // Clear old elements

      // Use panorama image if available, otherwise gradient
      if (scene.panoramaImg) {
        bgLayer.style.background = `url('${scene.panoramaImg}') center center / cover no-repeat`;
        bgLayer.style.backgroundSize = "cover";
        // For the wide canvas, tile the image
        canvas.style.backgroundImage = `url('${scene.panoramaImg}')`;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "center center";
        canvas.style.backgroundRepeat = "no-repeat";
        // Also set on bgLayer for consistent look
        bgLayer.style.backgroundImage = `url('${scene.panoramaImg}')`;
        bgLayer.style.backgroundSize = "200% 100%";
        bgLayer.style.backgroundPosition = "center center";
        bgLayer.style.backgroundRepeat = "repeat-x";
      } else {
        bgLayer.style.background = scene.bgGradient;
        bgLayer.style.backgroundImage = "";
        canvas.style.backgroundImage = "";
      }

      // Add a subtle scene name watermark
      const titleSpan = document.createElement("div");
      titleSpan.style.cssText = "font-family: var(--font-accent); font-size: 4rem; color: rgba(255,255,255,0.06); text-align: center; user-select: none; pointer-events: none; position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); white-space: nowrap;";
      titleSpan.textContent = scene.name;
      bgLayer.appendChild(titleSpan);

      // Inject Hotspots
      const spots = sceneHotspots[scene.id] || [];
      spots.forEach(sp => {
        const spot = document.createElement("div");
        spot.className = "vt-hotspot";
        spot.style.left = `${sp.left}%`;
        spot.style.top = `${sp.top}%`;
        spot.innerHTML = `
          <div class="pulse-ring-element"></div>
          <span style="font-size: 1.15rem; z-index: 2; line-height: 1;">${sp.icon}</span>
        `;

        // Prevent dragging background when clicking hotspots
        spot.addEventListener("mousedown", (e) => e.stopPropagation());
        spot.addEventListener("touchstart", (e) => e.stopPropagation());

        // Click on hotspot show tooltip
        spot.addEventListener("click", (e) => {
          e.stopPropagation(); // Stop drag trigger
          showTooltip(sp, spot);
        });

        bgLayer.appendChild(spot);
      });

      // Reset panorama position to default center
      resetToCenter();
    };

    if (isInitialLoad) {
      performLoad();
      isInitialLoad = false;
    } else {
      // Fade out canvas background
      canvas.style.opacity = "0";
      
      setTimeout(() => {
        performLoad();
        // Fade canvas back in
        canvas.style.opacity = "1";
      }, 300); // Wait for transition duration
    }
  }

  // Show dynamic tooltip helper
  function showTooltip(sp, spotElement) {
    tooltipTitle.textContent = sp.title;
    tooltipDesc.textContent = sp.desc;

    const viewerRect = dragArea.getBoundingClientRect();
    const spotRect = spotElement.getBoundingClientRect();

    // Calculate center positioning relative to drag area container
    const spotLeft = spotRect.left - viewerRect.left;
    const spotTop = spotRect.top - viewerRect.top;
    const spotWidth = spotRect.width;
    const spotHeight = spotRect.height;

    tooltip.style.display = "block";
    const tooltipWidth = tooltip.offsetWidth || 240;
    const tooltipHeight = tooltip.offsetHeight || 120;

    let targetLeft = spotLeft + (spotWidth / 2) - (tooltipWidth / 2);
    let targetTop = spotTop - tooltipHeight - 10; // Position above by default

    // Bound check: Horizontal constraints
    if (targetLeft < 10) {
      targetLeft = 10;
    }
    if (targetLeft + tooltipWidth > viewerRect.width - 10) {
      targetLeft = viewerRect.width - tooltipWidth - 10;
    }

    // Bound check: Vertical constraints. If it flows off top of dragArea, display it below the hotspot
    if (targetTop < 10) {
      targetTop = spotTop + spotHeight + 10;
    }
    if (targetTop + tooltipHeight > viewerRect.height - 10) {
      targetTop = viewerRect.height - tooltipHeight - 10;
    }

    tooltip.style.left = `${targetLeft}px`;
    tooltip.style.top = `${targetTop}px`;

    window.showToast(`Info dibuka: ${sp.title}`, "info");
  }

  // Close Tooltip
  tooltipClose.addEventListener("click", (e) => {
    e.stopPropagation();
    tooltip.style.display = "none";
  });

  // Prevent drag interaction on the tooltip box itself
  tooltip.addEventListener("mousedown", (e) => e.stopPropagation());
  tooltip.addEventListener("touchstart", (e) => e.stopPropagation());

  // Close tooltip if clicking the background canvas or empty space in the viewer
  dragArea.addEventListener("click", (e) => {
    if (e.target === dragArea || e.target === canvas || e.target.classList.contains("panorama-bg-art")) {
      tooltip.style.display = "none";
    }
  });

  // 3. Drag Viewport Interaction
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0; // in pixels
  let initialTranslateX = 0; // in pixels

  // Velocity-based easing
  let lastX = 0;
  let velocity = 0;
  let animationFrameId = null;
  const friction = 0.95; // decelerating coefficient

  function handleStart(e) {
    isDragging = true;
    
    // Stop any active inertia animation instantly on touch down
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startX = clientX;
    lastX = clientX;
    initialTranslateX = currentTranslateX;
    velocity = 0;
    
    tooltip.style.display = "none"; // Hide tooltip on drag start
    
    // Fade out tutorial overlay on interaction
    if (tutorial && tutorial.style.opacity !== "0") {
      tutorial.style.opacity = "0";
      setTimeout(() => {
        tutorial.style.display = "none";
      }, 800);
    }
  }

  function handleMove(e) {
    if (!isDragging) return;

    // Prevent default scroll behaviors on touch
    if (e.cancelable) {
      e.preventDefault();
    }

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    
    // Track swipe velocity
    velocity = clientX - lastX;
    lastX = clientX;
    
    let newTranslate = initialTranslateX + deltaX;
    
    // Boundary Clamping
    const viewerWidth = dragArea.clientWidth;
    const canvasWidth = canvas.clientWidth || (viewerWidth * 3);
    const minTranslate = viewerWidth - canvasWidth; // e.g. -2 * viewerWidth
    const maxTranslate = 0;

    if (newTranslate > maxTranslate) newTranslate = maxTranslate;
    if (newTranslate < minTranslate) newTranslate = minTranslate;

    currentTranslateX = newTranslate;
    updateCanvasTransform();
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;

    // Apply deceleration if there is speed
    if (Math.abs(velocity) > 0.5) {
      startEasing();
    }
  }

  function startEasing() {
    const viewerWidth = dragArea.clientWidth;
    const canvasWidth = canvas.clientWidth || (viewerWidth * 3);
    const minTranslate = viewerWidth - canvasWidth;
    const maxTranslate = 0;

    function ease() {
      currentTranslateX += velocity;
      
      // Boundaries check
      if (currentTranslateX > maxTranslate) {
        currentTranslateX = maxTranslate;
        velocity = 0;
      } else if (currentTranslateX < minTranslate) {
        currentTranslateX = minTranslate;
        velocity = 0;
      }

      updateCanvasTransform();
      
      // Decelerate
      velocity *= friction;

      if (Math.abs(velocity) > 0.1) {
        animationFrameId = requestAnimationFrame(ease);
      } else {
        animationFrameId = null;
      }
    }

    animationFrameId = requestAnimationFrame(ease);
  }

  // Handle window resizing to keep the translation in bounds
  window.addEventListener("resize", () => {
    const viewerWidth = dragArea.clientWidth;
    const canvasWidth = canvas.clientWidth || (viewerWidth * 3);
    const minTranslate = viewerWidth - canvasWidth;
    const maxTranslate = 0;

    if (currentTranslateX > maxTranslate) currentTranslateX = maxTranslate;
    if (currentTranslateX < minTranslate) currentTranslateX = minTranslate;

    updateCanvasTransform();
  });

  // Mouse Listeners
  dragArea.addEventListener("mousedown", handleStart);
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleEnd);

  // Touch Listeners
  dragArea.addEventListener("touchstart", handleStart, { passive: true });
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", handleEnd);

  // Auto-fade tutorial after 4 seconds if no interaction
  setTimeout(() => {
    if (tutorial && tutorial.style.opacity !== "0") {
      tutorial.style.opacity = "0";
      setTimeout(() => {
        tutorial.style.display = "none";
      }, 800);
    }
  }, 4000);

  // Init Actions
  renderThumbnails();
  // Wait brief moment for layout render so clientWidth calculations succeed
  setTimeout(() => {
    resetToCenter();
    loadScene(scenes[0]);
  }, 50);
}
