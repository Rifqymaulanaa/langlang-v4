/*
  checkout.js - State management, calculations, and simulation checkout payment
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initCheckout();
});

function initCheckout() {
  // 1. Read Query Parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const destId = urlParams.get("id") || "cikaso";
  
  const dest = window.LanglangData.getDestinationById(destId);
  if (!dest) {
    window.location.href = "explore.html";
    return;
  }

  // Pre-fill query values
  let visitDate = urlParams.get("date") || new Date().toISOString().split("T")[0];
  let countAdults = parseInt(urlParams.get("adults")) || 1;
  let countKids = parseInt(urlParams.get("kids")) || 0;
  let isDonateChecked = urlParams.get("donate") !== "false"; // default true

  // DOM Elements
  const inpUserName = document.getElementById("checkout-user-name");
  const inpUserEmail = document.getElementById("checkout-user-email");
  const inpUserPhone = document.getElementById("checkout-user-phone");
  const inpUserNik = document.getElementById("checkout-user-nik");
  
  const textCountAdults = document.getElementById("checkout-count-dewasa");
  const textCountKids = document.getElementById("checkout-count-anak");
  const cbCare = document.getElementById("checkout-care-checkbox");
  const selectCareCategory = document.getElementById("checkout-care-category");
  
  const btnIncAdults = document.getElementById("checkout-inc-dewasa");
  const btnDecAdults = document.getElementById("checkout-dec-dewasa");
  const btnIncKids = document.getElementById("checkout-inc-anak");
  const btnDecKids = document.getElementById("checkout-dec-anak");
  
  // Summary Receipt Elements
  const summaryDestName = document.getElementById("summary-dest-name");
  const summaryDestBadge = document.getElementById("summary-dest-badge");
  const summaryDestLoc = document.getElementById("summary-dest-loc");
  const summaryVisitDate = document.getElementById("summary-visit-date");
  
  const labelPriceAdults = document.getElementById("checkout-price-dewasa-label");
  const labelPriceKids = document.getElementById("checkout-price-anak-label");
  
  const breakAdultsQty = document.getElementById("break-dewasa-qty");
  const breakAdultsCost = document.getElementById("break-dewasa-cost");
  const breakKidsRow = document.getElementById("break-anak-row");
  const breakKidsQty = document.getElementById("break-anak-qty");
  const breakKidsCost = document.getElementById("break-anak-cost");
  const breakDonationRow = document.getElementById("break-donation-row");
  const breakDonationCost = document.getElementById("break-donation-cost");
  const breakPromoRow = document.getElementById("break-promo-row");
  const breakPromoCost = document.getElementById("break-promo-cost");
  
  // Promo Box
  const inpPromoCode = document.getElementById("promo-code-input");
  const btnApplyPromo = document.getElementById("promo-apply-btn");
  const textPromoFeedback = document.getElementById("promo-message-feedback");
  
  const summaryTotalDisplay = document.getElementById("summary-total-display");
  const btnPayNow = document.getElementById("pay-now-btn");
  
  // Modals & Panels
  const loadingOverlay = document.getElementById("payment-loading-modal-overlay");
  const mainFlowPane = document.getElementById("checkout-main-flow-wrapper");
  const successPane = document.getElementById("checkout-success-pane");

  // Add-on Asuransi Elements
  const addInsuranceCheckbox = document.getElementById("checkout-insurance-checkbox");
  const breakInsuranceRow = document.getElementById("break-insurance-row");
  const breakInsuranceCost = document.getElementById("break-insurance-cost");

  // State
  let paymentMethod = "qris";
  let promoDiscountPercent = 0; // 10% if code matched
  
  // Determine pricing with weather discount
  let weatherDiscount = 0;
  if (dest.weather.text.includes("Hujan") || dest.weather.text.includes("Dingin") || dest.weather.text.includes("Kabut")) {
    weatherDiscount = 15;
  }
  let basePrice = dest.price;
  if (weatherDiscount > 0) {
    basePrice = Math.floor(basePrice * (1 - (weatherDiscount / 100)));
  }
  
  const priceAdults = basePrice;
  const priceKids = Math.floor(basePrice * 0.5);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // 2. Pre-populate UI state
  textCountAdults.textContent = countAdults;
  textCountKids.textContent = countKids;
  cbCare.checked = isDonateChecked;
  
  // Sync selected campaign if preset in destinations
  if (dest.id === "cikaso") selectCareCategory.value = "care-toilet";
  if (dest.id === "penglipuran") selectCareCategory.value = "care-recycle";
  if (dest.id === "waerebo") selectCareCategory.value = "care-school";
  
  summaryDestName.textContent = dest.name;
  summaryDestName.innerHTML = `${dest.name} <span style="font-size:0.75rem; color:var(--gray-500); font-weight:normal;">(${dest.type})</span>`;
  summaryDestBadge.textContent = dest.badge;
  summaryDestBadge.className = `badge ${dest.badge === 'Hidden Gem' ? 'badge-hidden-gem' : (dest.badge === 'Eco-Friendly' ? 'badge-eco' : 'badge-populer')}`;
  summaryDestLoc.textContent = dest.location;
  
  labelPriceAdults.textContent = `${formatIDR(priceAdults)} / tiket`;
  labelPriceKids.textContent = `${formatIDR(priceKids)} / tiket`;

  // Format visit date display
  function formatVisitDate(dateStr) {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const d = new Date(dateStr);
    const dayName = days[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${dayName}, ${dateNum} ${monthName} ${year}`;
  }

  summaryVisitDate.textContent = formatVisitDate(visitDate);

  // 3. Calculator Calculations
  function calculateTotal() {
    const subtotalAdults = countAdults * priceAdults;
    const subtotalKids = countKids * priceKids;
    const ticketsSubtotal = subtotalAdults + subtotalKids;
    
    // Promo Discount
    let promoDiscount = 0;
    if (promoDiscountPercent > 0) {
      promoDiscount = Math.floor(ticketsSubtotal * (promoDiscountPercent / 100));
      breakPromoRow.style.display = "flex";
      breakPromoCost.textContent = `-${formatIDR(promoDiscount)}`;
    } else {
      breakPromoRow.style.display = "none";
    }

    // Donation
    let donationAmount = cbCare.checked ? 10000 : 0;
    if (cbCare.checked) {
      breakDonationRow.style.display = "flex";
      breakDonationCost.textContent = formatIDR(10000);
    } else {
      breakDonationRow.style.display = "none";
    }

    // Insurance Add-on (Rp5.000 per person)
    const tixCount = countAdults + countKids;
    let insuranceAmount = 0;
    if (addInsuranceCheckbox && addInsuranceCheckbox.checked) {
      insuranceAmount = tixCount * 5000;
      if (breakInsuranceRow) {
        breakInsuranceRow.style.display = "flex";
        breakInsuranceCost.textContent = formatIDR(insuranceAmount);
      }
    } else {
      if (breakInsuranceRow) {
        breakInsuranceRow.style.display = "none";
      }
    }

    const finalTotal = ticketsSubtotal - promoDiscount + donationAmount + insuranceAmount;

    // Summary receipts sync
    breakAdultsQty.textContent = `Tiket Dewasa x${countAdults}`;
    breakAdultsCost.textContent = formatIDR(subtotalAdults);

    if (countKids > 0) {
      breakKidsRow.style.display = "flex";
      breakKidsQty.textContent = `Tiket Anak x${countKids}`;
      breakKidsCost.textContent = formatIDR(subtotalKids);
    } else {
      breakKidsRow.style.display = "none";
    }

    summaryTotalDisplay.textContent = formatIDR(finalTotal);
    return finalTotal;
  }

  // Stepper incrementors
  btnIncAdults.addEventListener("click", () => {
    countAdults++;
    textCountAdults.textContent = countAdults;
    calculateTotal();
  });

  btnDecAdults.addEventListener("click", () => {
    if (countAdults > 1) {
      countAdults--;
      textCountAdults.textContent = countAdults;
      calculateTotal();
    }
  });

  btnIncKids.addEventListener("click", () => {
    countKids++;
    textCountKids.textContent = countKids;
    calculateTotal();
  });

  btnDecKids.addEventListener("click", () => {
    if (countKids > 0) {
      countKids--;
      textCountKids.textContent = countKids;
      calculateTotal();
    }
  });

  cbCare.addEventListener("change", calculateTotal);
  if (addInsuranceCheckbox) {
    addInsuranceCheckbox.addEventListener("change", calculateTotal);
  }

  // 4. Promo Code Validation (P0)
  btnApplyPromo.addEventListener("click", () => {
    const code = inpPromoCode.value.trim().toUpperCase();
    if (code === "SDGSGREEN" || code === "HEMATHIJAU") {
      promoDiscountPercent = 10;
      textPromoFeedback.textContent = "Kode promo terpasang! Diskon 10% subtotal.";
      textPromoFeedback.style.color = "var(--primary-green)";
      window.showToast("Kode promo berhasil digunakan!", "success");
    } else {
      promoDiscountPercent = 0;
      textPromoFeedback.textContent = "Kode promo tidak valid/kedaluwarsa.";
      textPromoFeedback.style.color = "var(--coral-accent)";
      window.showToast("Kode promo gagal diterapkan", "error");
    }
    calculateTotal();
  });

  // 5. Payment Cards selection
  const paymentCards = document.querySelectorAll(".payment-card");
  paymentCards.forEach(card => {
    card.addEventListener("click", () => {
      paymentCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      paymentMethod = card.getAttribute("data-method");
      
      // Update checkout text simulator feedback on payment instruction
      const payMsg = document.getElementById("payment-instruction-msg");
      if (payMsg) {
        if (paymentMethod === "qris") {
          payMsg.innerHTML = `QRIS dinamis akan ditampilkan otomatis di layar sukses. Scan melalui m-banking/e-wallet Anda.`;
        } else if (paymentMethod === "bank") {
          payMsg.innerHTML = `Transfer ke <strong>BCA Desa Wisata Curug Cikaso: 0392-482-123</strong> a.n Koperasi Unit Desa Cikaso.`;
        } else {
          payMsg.innerHTML = `Metode kilat e-wallet (GoPay, OVO, Dana) dengan OTP instan setelah klik "Bayar".`;
        }
      }
    });
  });

  // 6. Pay Button Action (Simulated Payment P0)
  btnPayNow.addEventListener("click", () => {
    // Validate inputs
    const name = inpUserName.value.trim();
    const email = inpUserEmail.value.trim();
    const phone = inpUserPhone.value.trim();
    const nik = inpUserNik.value.trim();

    if (!name || !email || !phone || !nik) {
      window.showToast("Semua data pemesan wajib diisi!", "error");
      return;
    }

    if (nik.length !== 16 || isNaN(nik)) {
      window.showToast("Format NIK harus 16 digit angka!", "error");
      inpUserNik.focus();
      return;
    }

    // Trigger loader modal backdrop
    loadingOverlay.classList.add("active");

    // Dynamic payment loader steps
    const loadingText = loadingOverlay.querySelector("h3");
    const loadingSubText = loadingOverlay.querySelector("p");
    
    setTimeout(() => {
      loadingText.textContent = "Menghubungkan ke Gerbang Desa Aman...";
      loadingSubText.textContent = "Melakukan tanda tangan digital untuk polis asuransi...";
    }, 800);

    setTimeout(() => {
      loadingText.textContent = "Verifikasi E-Ticket Terdaftar...";
      loadingSubText.textContent = "Menyimpan transaksi ke database lokal pariwisata...";
    }, 1600);

    setTimeout(() => {
      // Hide loader
      loadingOverlay.classList.remove("active");

      // Calculate costs details
      const totalCost = calculateTotal();
      const donationAmount = cbCare.checked ? 10000 : 0;
      const insuranceAmount = (addInsuranceCheckbox && addInsuranceCheckbox.checked) ? ((countAdults + countKids) * 5000) : 0;
      const tixCount = countAdults + countKids;
      const codeSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
      const bookingCode = `LL-${visitDate.replace(/-/g, "")}-${destId.substring(0, 3).toUpperCase()}-${codeSuffix}`;

      // Write Booking to LocalStorage
      const newBooking = {
        bookingCode: bookingCode,
        destinationId: destId,
        destinationName: dest.name,
        destinationImage: dest.image,
        visitDate: visitDate,
        ticketsCount: tixCount,
        qtyAdults: countAdults,
        qtyKids: countKids,
        totalCost: totalCost,
        donationAmount: donationAmount,
        insuranceAmount: insuranceAmount,
        paymentMethod: paymentMethod,
        userName: name,
        userEmail: email,
        userPhone: phone
      };

      const pointsGained = window.LanglangData.addBooking(newBooking);

      // If donation is checked, trigger Campaign donation
      if (donationAmount > 0) {
        const campaignId = selectCareCategory.value;
        const newDonation = {
          campaignId: campaignId,
          amount: donationAmount,
          destinationId: destId,
          destinationName: dest.name,
          date: "Hari Ini",
          isAnonymous: false
        };
        window.LanglangData.addDonation(newDonation);
      }

      // Sync Success page boarding pass elements
      document.getElementById("ticket-dest-name").textContent = dest.name;
      document.getElementById("ticket-user-name").textContent = name;
      document.getElementById("ticket-date").textContent = formatVisitDate(visitDate);
      document.getElementById("ticket-qty").textContent = `${countAdults} Dewasa ${countKids > 0 ? `/ ${countKids} Anak` : ''}`;
      
      const successDonationEl = document.getElementById("ticket-donation");
      if (donationAmount > 0) {
        const campaignTitle = selectCareCategory.options[selectCareCategory.selectedIndex].text;
        successDonationEl.textContent = `${formatIDR(donationAmount)} (${campaignTitle.substring(0, campaignTitle.indexOf('(')).trim()})`;
        successDonationEl.style.display = "block";
      } else {
        successDonationEl.style.display = "none";
      }

      // Sync insurance on ticket success
      const successInsuranceEl = document.getElementById("ticket-insurance-success");
      if (successInsuranceEl) {
        if (insuranceAmount > 0) {
          successInsuranceEl.style.display = "block";
          successInsuranceEl.innerHTML = `<span class="ticket-label-pass">Asuransi Jiwa & Kecelakaan</span><span class="ticket-val-pass" style="color: var(--accent-lime);">AKTIF & Dilindungi (Rp${insuranceAmount.toLocaleString('id-ID')})</span>`;
        } else {
          successInsuranceEl.style.display = "none";
        }
      }

      // Set Ticket Code on Boarding Pass
      const ticketCodeEl = document.getElementById("ticket-code-display");
      if (ticketCodeEl) {
        ticketCodeEl.textContent = `KODE TIKET: ${bookingCode}`;
      }

      // Update Points Gained
      document.getElementById("success-points-gained-label").innerHTML = `Pembayaran Berhasil! Anda mendapatkan <strong>+${pointsGained} Eco-Points</strong> dari pariwisata hijau.`;

      // Hide checkout form and show success ticket
      mainFlowPane.style.display = "none";
      successPane.style.display = "block";
      
      // Simulate sending WhatsApp confirmation (last-mile)
      simulateWhatsAppNotification(phone, name, dest.name, bookingCode, visitDate, tixCount, totalCost);

      window.showToast("Tiket sukses dipesan!", "success");
    }, 2400); // 2.4s payment loading simulation
  });

  // Share Ticket click listener
  document.getElementById("share-ticket-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href);
    window.showToast("Link tiket disalin ke clipboard!", "success");
  });

  // Print ticket boarding pass PDF simulation
  const printBtn = document.getElementById("print-ticket-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Last-mile WhatsApp message simulation
  function simulateWhatsAppNotification(phone, name, destName, code, date, tixCount, cost) {
    console.log(`[WhatsApp Gateway Sync] Mengirim pesan ke ${phone}...`);
    const waModal = document.createElement("div");
    waModal.id = "whatsapp-simulation-toast";
    waModal.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 320px;
      background-color: #128C7E;
      color: #fff;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      padding: 16px;
      z-index: 9999;
      font-family: var(--font-body);
      border: 2px solid #075E54;
      animation: slide-in-right 0.4s ease-out;
    `;
    waModal.innerHTML = `
      <div class="flex-between" style="border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight:700; font-size: 0.8rem; display:flex; align-items:center; gap:6px;">💬 WhatsApp Notifikasi (Simulasi Gateway)</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;">&times;</button>
      </div>
      <p style="font-size:0.8rem; line-height: 1.4;">
        Halo <strong>${name}</strong>, pembayaran tiket masuk <strong>${destName}</strong> Anda sebesar <strong>${formatIDR(cost)}</strong> (${tixCount} Pax) telah terverifikasi.
      </p>
      <div style="background-color: #075E54; padding: 6px; border-radius: 4px; font-size: 0.75rem; margin-top: 8px; font-family: monospace;">
        Kode E-Ticket: ${code}<br>
        Tanggal Kunjungan: ${date}
      </div>
      <p style="font-size:0.7rem; color: #DCF8C6; margin-top: 8px; font-style: italic;">
        Pemandang lokal akan dihubungi untuk memandu perjalanan Anda.
      </p>
    `;
    document.body.appendChild(waModal);
    
    // Auto remove after 10s
    setTimeout(() => {
      if (waModal) waModal.remove();
    }, 10000);
  }

  // Initial Calculation
  calculateTotal();
}
