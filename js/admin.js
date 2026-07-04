/*
  admin.js - Mitra Desa B2B admin dashboard handlers
  Langlang App Prototype
*/

document.addEventListener("DOMContentLoaded", function() {
  initAdminDashboard();
});

function initAdminDashboard() {
  // DOM Elements
  const textVisitors = document.getElementById("admin-stat-visitors");
  const textRevenue = document.getElementById("admin-stat-revenue");
  const textQuota = document.getElementById("admin-stat-quota");
  const textCare = document.getElementById("admin-stat-care");
  
  const bookingsContainer = document.getElementById("admin-bookings-log-container");
  
  const btnToggleQuota = document.getElementById("admin-toggle-quota-btn");
  const inpScan = document.getElementById("admin-scan-input");
  const btnScan = document.getElementById("admin-scan-btn");

  // Webcam elements
  const btnWebcamToggle = document.getElementById("admin-webcam-toggle-btn");
  const videoStream = document.getElementById("admin-webcam-stream");
  const scannerStatus = document.getElementById("scanner-status-text");
  
  const textBinVolume = document.getElementById("ecobin-volume-pct");
  const barBinVolume = document.getElementById("ecobin-volume-bar");
  const textBinBottles = document.getElementById("ecobin-bottles-count");
  const textBinCoins = document.getElementById("ecobin-coins-count");
  
  const btnResetDb = document.getElementById("admin-reset-db-btn");

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // State
  let isBookingOpen = true;
  let isWebcamOn = false;
  let localStream = null;

  // 1. Quota toggle open/close (PRD 4.10)
  btnToggleQuota.addEventListener("click", () => {
    isBookingOpen = !isBookingOpen;
    if (isBookingOpen) {
      btnToggleQuota.textContent = "Booking Buka";
      btnToggleQuota.className = "btn btn-primary btn-sm";
      btnToggleQuota.style.backgroundColor = "var(--primary-green)";
      window.showToast("Tiket masuk Curug Cikaso dibuka kembali", "success");
    } else {
      btnToggleQuota.textContent = "Booking Tutup";
      btnToggleQuota.className = "btn btn-danger btn-sm";
      btnToggleQuota.style.backgroundColor = "var(--coral-accent)";
      window.showToast("Pemesanan tiket masuk Curug Cikaso ditutup!", "error");
    }
  });

  // 2. Ticket Scanner Simulation (PRD 4.10)
  function verifyBookingTicket(code) {
    const bookings = window.LanglangData.getBookings();
    const matched = bookings.find(b => b.bookingCode === code);

    if (matched) {
      window.showToast(`TIKET VALID! Wisatawan: ${matched.userName} (${matched.ticketsCount} Orang)`, "success");
      
      // Highlight row if currently rendered in logs
      const row = document.getElementById(`log-${code}`);
      if (row) {
        row.style.backgroundColor = "var(--accent-lime-light)";
        row.style.borderColor = "var(--primary-green)";
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return true;
    } else {
      // Allow fallback if starting prefix is LL- to show a successful simulation for manual demo typing
      if (code.startsWith("LL-")) {
        window.showToast(`TIKET VALID! Tiket terverifikasi desa adil.`, "success");
        return true;
      } else {
        window.showToast("KODE TIKET TIDAK VALID / EXPIRED!", "error");
        return false;
      }
    }
  }

  btnScan.addEventListener("click", () => {
    const code = inpScan.value.trim().toUpperCase();
    if (!code) {
      window.showToast("Ketik kode tiket pemesanan!", "error");
      return;
    }
    const success = verifyBookingTicket(code);
    if (success) {
      inpScan.value = "";
    }
  });

  // Handle Scan enter key
  inpScan.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnScan.click();
    }
  });

  // Webcam Scanner Stream Simulation
  if (btnWebcamToggle) {
    btnWebcamToggle.addEventListener("click", async () => {
      if (!isWebcamOn) {
        try {
          scannerStatus.textContent = "Mengakses Kamera Webcam...";
          localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          videoStream.srcObject = localStream;
          videoStream.style.display = "block";
          isWebcamOn = true;
          btnWebcamToggle.textContent = "🛑 Nonaktifkan Kamera Scanner";
          btnWebcamToggle.className = "btn btn-danger btn-sm";
          scannerStatus.textContent = "Kamera Aktif! Memindai QR Code tiket...";

          // Simulate QR Code auto-detection after 4.5 seconds for prototyping show-and-tell
          setTimeout(() => {
            if (isWebcamOn) {
              const bookings = window.LanglangData.getBookings();
              if (bookings.length > 0) {
                const latestCode = bookings[bookings.length - 1].bookingCode;
                scannerStatus.textContent = `QR Code terdeteksi: ${latestCode}!`;
                verifyBookingTicket(latestCode);
              } else {
                scannerStatus.textContent = "QR Code terdeteksi: LL-20260715-CIK-MOCK!";
                verifyBookingTicket("LL-20260715-CIK-MOCK");
              }
              // Turn off webcam automatically after mock scan
              setTimeout(() => {
                stopWebcam();
              }, 1500);
            }
          }, 4500);

        } catch (err) {
          console.error("Webcam error:", err);
          window.showToast("Kamera tidak ditemukan / izin ditolak. Menggunakan simulasi sensor.", "error");
          // Fake camera activation overlay
          videoStream.style.display = "block";
          videoStream.style.backgroundColor = "#222";
          isWebcamOn = true;
          btnWebcamToggle.textContent = "🛑 Nonaktifkan Kamera Scanner (Simulasi)";
          btnWebcamToggle.className = "btn btn-danger btn-sm";
          scannerStatus.textContent = "Kamera Aktif (Simulasi)! Memindai QR Code...";
          
          setTimeout(() => {
            if (isWebcamOn) {
              scannerStatus.textContent = "QR Code terdeteksi (Simulasi): LL-20260625-CIK-F8K2!";
              verifyBookingTicket("LL-20260625-CIK-F8K2");
              setTimeout(() => stopWebcam(), 1500);
            }
          }, 4000);
        }
      } else {
        stopWebcam();
      }
    });
  }

  function stopWebcam() {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    videoStream.srcObject = null;
    videoStream.style.display = "none";
    isWebcamOn = false;
    btnWebcamToggle.textContent = "📹 Aktifkan Kamera Scanner";
    btnWebcamToggle.className = "btn btn-secondary btn-sm";
    scannerStatus.textContent = "Arahkan kamera ke QR Code Tiket digital.";
  }

  // 3. Reset Demo Database button
  btnResetDb.addEventListener("click", () => {
    if (confirm("Atur ulang seluruh database pariwisata? Semua data booking dan koin daur ulang akan direset.")) {
      window.LanglangData.resetDatabase();
    }
  });

  // 4. Render Admin Panels
  function renderAdmin() {
    const destinations = window.LanglangData.getDestinations();
    const cikaso = destinations.find(d => d.id === "cikaso");
    const campaigns = window.LanglangData.getCampaigns();
    const toiletCampaign = campaigns.find(c => c.id === "care-toilet");
    const bookings = window.LanglangData.getBookings();
    
    // Filter bookings belonging to Cikaso
    const cikasoBookings = bookings.filter(b => b.destinationId === "cikaso");

    // A. visitors counts (Base offset 135)
    let totalCikasoBookingsCount = 0;
    let totalCikasoRevenue = 135 * 15000; // Base revenue offset
    
    cikasoBookings.forEach(b => {
      totalCikasoBookingsCount += b.ticketsCount;
      totalCikasoRevenue += (b.totalCost - b.donationAmount);
    });

    const finalVisitors = 135 + totalCikasoBookingsCount;
    textVisitors.textContent = `${finalVisitors} Orang`;
    textRevenue.textContent = formatIDR(totalCikasoRevenue);

    // B. Sisa Quota
    const sisaQuota = cikaso.quotaTotal - cikaso.quotaBooked;
    textQuota.textContent = `${sisaQuota} Slot`;

    // C. Care Donations raised
    if (toiletCampaign) {
      textCare.textContent = formatIDR(toiletCampaign.raised);
    }

    // D. Render Bookings Logs (P2)
    bookingsContainer.innerHTML = "";
    
    if (cikasoBookings.length === 0) {
      // Mock log items if no new bookings yet to make dashboard look populated
      const mockLogs = [
        { userName: "Siti Rahma", visitDate: "Hari Ini", ticketsCount: 2, totalCost: 30000, bookingCode: "LL-20260625-CIK-A7D9", paymentMethod: "qris" },
        { userName: "Budi Santoso", visitDate: "Hari Ini", ticketsCount: 4, totalCost: 60000, bookingCode: "LL-20260625-CIK-F8K2", paymentMethod: "bank" }
      ];

      mockLogs.forEach(log => {
        bookingsContainer.appendChild(createLogElement(log, formatIDR));
      });
    } else {
      // Display newest bookings first
      const reversedBookings = [...cikasoBookings].reverse();
      reversedBookings.forEach(log => {
        bookingsContainer.appendChild(createLogElement(log, formatIDR));
      });
    }

    // E. Smart Eco-Bin IoT statistics sync (PRD 4.10)
    // Gather scans count from user profile
    const profile = window.LanglangData.getUserProfile();
    // Default values: scans 14 (78% full). Increment per scan.
    const newScans = profile.ecoBinScans - 14;
    const additionalBottles = newScans > 0 ? newScans : 0;
    
    const baseBottles = 1452;
    const baseCoins = 36300;
    const totalBottles = baseBottles + additionalBottles;
    const totalCoins = baseCoins + (additionalBottles * 25);
    
    // Volume percentage (max 100%)
    const volumePct = Math.min(100, 78 + (additionalBottles * 1.5));

    textBinVolume.textContent = `${volumePct.toFixed(0)}% Penuh`;
    barBinVolume.style.width = `${volumePct}%`;
    textBinBottles.textContent = `${totalBottles.toLocaleString('id-ID')} Botol`;
    textBinCoins.textContent = `${totalCoins.toLocaleString('id-ID')} Koin`;
    
    // Set color warning on bin volume
    if (volumePct >= 90) {
      textBinVolume.style.color = "var(--coral-accent)";
      barBinVolume.style.backgroundColor = "var(--coral-accent)";
    } else if (volumePct >= 70) {
      textBinVolume.style.color = "var(--gold-reward)";
      barBinVolume.style.backgroundColor = "var(--gold-reward)";
    } else {
      textBinVolume.style.color = "var(--primary-green)";
      barBinVolume.style.backgroundColor = "var(--primary-green)";
    }
  }

  function createLogElement(log, formatIDR) {
    const row = document.createElement("div");
    row.className = "log-row";
    row.id = `log-${log.bookingCode}`;
    row.style.cssText = "border-bottom:1px dashed var(--gray-200); padding: 8px 0; transition: background 0.3s, border-color 0.3s; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;";
    
    row.innerHTML = `
      <div style="flex-grow: 1;">
        <div class="flex-between">
          <strong style="color: var(--deep-charcoal);">${log.userName}</strong>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-green); text-transform: uppercase;">${log.paymentMethod}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 2px;">
          Tgl: ${log.visitDate} &bull; Jumlah: ${log.ticketsCount} Orang &bull; Code: <strong>${log.bookingCode}</strong>
        </div>
      </div>
      <div style="text-align: right; margin-left: 12px;">
        <strong style="color: var(--primary-green); font-size: 0.9rem;">${formatIDR(log.totalCost)}</strong>
      </div>
    `;

    return row;
  }

  // Init
  renderAdmin();
}
