/*
  data.js - Mock Database & State Management using localStorage
  Langlang App Prototype
*/

(function() {
  // 1. Initial Static Data Definitions
  const initialDestinations = [
    {
      id: "cikaso",
      name: "Curug Cikaso",
      location: "Sukabumi, Jawa Barat",
      province: "Jawa Barat",
      type: "Air Terjun",
      price: 15000,
      rating: 4.8,
      reviewsCount: 184,
      badge: "Hidden Gem",
      weather: {
        temp: 26,
        text: "Berawan",
        icon: "cloud",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 27, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "Lusa", temp: 25, text: "Hujan Ringan", icon: "cloud-rain", discount: 15 },
          { day: "2 Hari Lagi", temp: 28, text: "Cerah", icon: "sun" }
        ]
      },
      quotaTotal: 200,
      quotaBooked: 135,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Curug Cikaso merupakan salah satu air terjun tersembunyi paling eksotis di selatan Sukabumi. Terdiri dari tiga aliran air terjun berdampingan yang mengalir ke sebuah kolam air jernih berwarna hijau toska. Dikelilingi tebing tinggi berlumut dan vegetasi tropis yang rimbun, Curug Cikaso menyajikan petualangan alam yang menenangkan jiwa, jauh dari hiruk-pikuk perkotaan.",
      facilities: ["Area Parkir Luas", "Toilet Sanitasi Bersih", "Warung Kuliner Lokal", "Jalur Tracking Aman", "Smart Eco-Bin Bin", "Gazebo Istirahat"],
      access: "Berjarak sekitar 4-5 jam dari Kota Bandung atau Jakarta. Akses jalan sudah beraspal hingga area parkir utama, dilanjutkan dengan sewa perahu menyusuri sungai jernih selama 10 menit untuk sampai di dekat air terjun.",
      rules: ["Dilarang membuang sampah sembarangan", "Gunakan Smart Eco-Bin untuk membuang botol plastik", "Dilarang berenang tepat di bawah pusaran air terjun", "Patuhi instruksi penjaga lokal setempat"],
      umkmNear: [1, 2],
      coordinates: { x: 38, y: 72 }, // Map pin simulation percentage
      virtualTourScenes: [
        { id: "entrance", name: "Dermaga & Pintu Masuk", bgGradient: "linear-gradient(135deg, #1e3c72, #2a5298)", panoramaImg: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=3000&q=85" },
        { id: "river", name: "Menyusuri Sungai Cikaso", bgGradient: "linear-gradient(135deg, #2b5876, #4e4376)", panoramaImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=3000&q=85" },
        { id: "waterfall", name: "Titik Utama Curug Cikaso", bgGradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", panoramaImg: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=3000&q=85" },
        { id: "picnic", name: "Area Piknik & Gazebo", bgGradient: "linear-gradient(135deg, #134e5e, #71b280)", panoramaImg: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "toba",
      name: "Danau Toba Barat",
      location: "Samosir, Sumatera Utara",
      province: "Sumatera Utara",
      type: "Danau",
      price: 20000,
      rating: 4.9,
      reviewsCount: 320,
      badge: "Populer",
      weather: {
        temp: 22,
        text: "Cerah Berawan",
        icon: "cloud-sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 23, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 22, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "2 Hari Lagi", temp: 21, text: "Berawan", icon: "cloud" }
        ]
      },
      quotaTotal: 500,
      quotaBooked: 240,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Nikmati keindahan magis Danau Toba dari sisi barat Pulau Samosir yang lebih sunyi dan hijau. Tempat ini menawarkan pemandangan tebing-tebing caldera purba yang menjulang tinggi berpadu dengan air danau biru tenang yang menakjubkan.",
      facilities: ["Penyewaan Kano", "Camping Ground", "Restoran Batak Halal", "Eco-Bin", "Local Guide"],
      access: "1 jam berkendara dari Bandara Silangit atau menyeberang kapal feri dari Pelabuhan Ajibata ke Tomok Samosir.",
      rules: ["Dilarang mencemari air danau", "Hormati adat istiadat warga setempat", "Dilarang memancing tanpa izin di area budidaya"],
      umkmNear: [3, 4],
      coordinates: { x: 22, y: 35 },
      virtualTourScenes: [
        { id: "pier", name: "Dermaga Samosir", bgGradient: "linear-gradient(135deg, #114b5f, #1a936f)", panoramaImg: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3000&q=85" },
        { id: "hill", name: "Bukit Pandang Holbung", bgGradient: "linear-gradient(135deg, #028090, #f0f3bd)", panoramaImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3000&q=85" },
        { id: "shore", name: "Tepian Danau", bgGradient: "linear-gradient(135deg, #003049, #d62828)", panoramaImg: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "keraton",
      name: "Tebing Keraton",
      location: "Bandung, Jawa Barat",
      province: "Jawa Barat",
      type: "Hutan",
      price: 15000,
      rating: 4.7,
      reviewsCount: 450,
      badge: "Populer",
      weather: {
        temp: 18,
        text: "Kabut Pagi",
        icon: "cloud-fog",
        warning: "Waspada Kabut Tebal",
        forecast: [
          { day: "Besok", temp: 19, text: "Berawan", icon: "cloud" },
          { day: "Lusa", temp: 20, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "2 Hari Lagi", temp: 18, text: "Hujan Ringan", icon: "cloud-rain", discount: 20 }
        ]
      },
      quotaTotal: 300,
      quotaBooked: 295,
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Menyajikan panorama hamparan hutan pinus hijau Taman Hutan Raya Ir. H. Djuanda dari atas tebing terjal yang menakjubkan. Sangat populer untuk menikmati kabut pagi magis berlatar matahari terbit.",
      facilities: ["Spot Foto Pengaman", "Coffee Shop Lokal", "Toilet", "Pusat Informasi"],
      access: "Hanya 30 menit dari pusat kota Bandung ke arah Dago Pakar. Jalan menanjak terjal, disarankan menggunakan motor atau mobil prima.",
      rules: ["Jangan melewati pagar pengaman tebing", "Dilarang menerbangkan drone tanpa izin pengelola", "Dilarang membuang sampah sembarangan"],
      umkmNear: [2, 5],
      coordinates: { x: 41, y: 74 },
      virtualTourScenes: [
        { id: "platform", name: "Dek Pandang Utama", bgGradient: "linear-gradient(135deg, #141e30, #243b55)", panoramaImg: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=3000&q=85" },
        { id: "forest", name: "Jalur Hutan Pinus", bgGradient: "linear-gradient(135deg, #2c3e50, #bdc3c7)", panoramaImg: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "pelangi",
      name: "Bukit Pelangi",
      location: "Kutai Timur, Kalimantan Timur",
      province: "Kalimantan Timur",
      type: "Hutan",
      price: 10000,
      rating: 4.6,
      reviewsCount: 88,
      badge: "Hidden Gem",
      weather: {
        temp: 31,
        text: "Cerah",
        icon: "sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 31, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 30, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "2 Hari Lagi", temp: 29, text: "Hujan Petir", icon: "cloud-lightning" }
        ]
      },
      quotaTotal: 150,
      quotaBooked: 45,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Bukit hijau subur dengan pemandangan lanskap khatulistiwa yang membentang luas hingga ke pesisir Selat Makassar. Dikenal dengan gradasi warna tanah liat merah berpadu dengan vegetasi unik.",
      facilities: ["Menara Pandang", "Bangku Taman", "Parkiran", "Spot Sunset"],
      access: "2 jam dari Kota Sangatta menggunakan kendaraan roda empat.",
      rules: ["Dilarang merusak vegetasi", "Dilarang menyalakan api unggun sembarangan", "Bawa pulang sampah Anda"],
      umkmNear: [5],
      coordinates: { x: 58, y: 55 },
      virtualTourScenes: [
        { id: "peak", name: "Puncak Menara Pandang", bgGradient: "linear-gradient(135deg, #ff7e5f, #feb47b)", panoramaImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "ora",
      name: "Pantai Ora",
      location: "Seram, Maluku",
      province: "Maluku",
      type: "Pantai",
      price: 25000,
      rating: 4.9,
      reviewsCount: 142,
      badge: "Eco-Friendly",
      weather: {
        temp: 29,
        text: "Cerah",
        icon: "sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 29, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 29, text: "Cerah", icon: "sun" },
          { day: "2 Hari Lagi", temp: 28, text: "Cerah Berawan", icon: "cloud-sun" }
        ]
      },
      quotaTotal: 100,
      quotaBooked: 78,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Pantai Ora sering dijuluki sebagai Maladewa-nya Indonesia Timur. Terkenal dengan cottage terapung di atas air laut super jernih berlatar belakang tebing batu kapur TN Manusela yang megah.",
      facilities: ["Water Cottage", "Pusat Snorkeling", "Restoran Seafood", "Eco-Bin", "Listrik Tenaga Surya"],
      access: "Terbang ke Ambon, dilanjutkan kapal cepat ke Masohi (Pulau Seram), lalu berkendara melintasi pulau menuju Desa Saleman.",
      rules: ["Dilarang menginjak atau merusak terumbu karang", "Dilarang berburu biota laut", "Gunakan sunscreen ramah lingkungan"],
      umkmNear: [6],
      coordinates: { x: 82, y: 62 },
      virtualTourScenes: [
        { id: "cottage", name: "Dek Teras Cottage", bgGradient: "linear-gradient(135deg, #00c6ff, #0072ff)", panoramaImg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3000&q=85" },
        { id: "coral", name: "Spot Snorkeling Terumbu Karang", bgGradient: "linear-gradient(135deg, #4ac1f7, #3b82f6)", panoramaImg: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "sipisopiso",
      name: "Air Terjun Sipiso-piso",
      location: "Karo, Sumatera Utara",
      province: "Sumatera Utara",
      type: "Air Terjun",
      price: 15000,
      rating: 4.8,
      reviewsCount: 290,
      badge: "Populer",
      weather: {
        temp: 21,
        text: "Berawan",
        icon: "cloud",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 22, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "Lusa", temp: 20, text: "Hujan Sedang", icon: "cloud-showers-heavy", discount: 25 },
          { day: "2 Hari Lagi", temp: 21, text: "Hujan Ringan", icon: "cloud-rain", discount: 10 }
        ]
      },
      quotaTotal: 400,
      quotaBooked: 180,
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Air terjun tertinggi di Indonesia yang keluar dari sungai bawah tanah di tepi kaldera Danau Toba, jatuh tegak lurus sejauh 120 meter ke dalam jurang sempit yang hijau subur.",
      facilities: ["Gardu Pandang Utama", "Jalur Tangga Semen", "Kios Cinderamata", "Toilet"],
      access: "Terletak di Desa Tongging, sekitar 2.5 jam berkendara dari Kota Medan.",
      rules: ["Waspada jalan licin saat menuruni tangga", "Jangan membuang puntung rokok sembarangan", "Hormati daerah sakral sekitar air terjun"],
      umkmNear: [3],
      coordinates: { x: 23, y: 31 },
      virtualTourScenes: [
        { id: "viewpoint", name: "Gardu Pandang Atas", bgGradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", panoramaImg: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=3000&q=85" },
        { id: "bottom", name: "Dasar Air Terjun", bgGradient: "linear-gradient(135deg, #3a7bd5, #3a6073)", panoramaImg: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "penglipuran",
      name: "Desa Penglipuran",
      location: "Bangli, Bali",
      province: "Bali",
      type: "Budaya",
      price: 25000,
      rating: 4.9,
      reviewsCount: 610,
      badge: "Eco-Friendly",
      weather: {
        temp: 27,
        text: "Cerah",
        icon: "sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 28, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 27, text: "Cerah", icon: "sun" },
          { day: "2 Hari Lagi", temp: 27, text: "Cerah Berawan", icon: "cloud-sun" }
        ]
      },
      quotaTotal: 600,
      quotaBooked: 380,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Dinobatkan sebagai salah satu desa terbersih di dunia. Penglipuran mempertahankan arsitektur tradisional Bali yang seragam, tata ruang adat Tri Hita Karana, serta pelestarian hutan bambu leluhur seluas 45 hektar.",
      facilities: ["Hutan Bambu Konservasi", "Pemandu Adat", "Kuliner Tradisional Loloh Cemcem", "Homestay Bersih", "Smart Eco-Bin System"],
      access: "Sekitar 1.5 jam berkendara ke utara dari Bandara Ngurah Rai Bali.",
      rules: ["Dilarang membawa masuk kendaraan bermotor ke dalam desa", "Dilarang membuang sampah selain di tempat daur ulang", "Jaga sopan santun dan berpakaian sopan saat masuk pekarangan warga"],
      umkmNear: [7, 8],
      coordinates: { x: 50, y: 79 },
      virtualTourScenes: [
        { id: "gate", name: "Gapura Pintu Masuk Desa", bgGradient: "linear-gradient(135deg, #d3cbb8, #6d604c)", panoramaImg: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=3000&q=85" },
        { id: "street", name: "Jalan Utama Adat", bgGradient: "linear-gradient(135deg, #1c542f, #f16d08)", panoramaImg: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=3000&q=85" },
        { id: "bamboo", name: "Hutan Bambu Lindung", bgGradient: "linear-gradient(135deg, #134e5e, #71b280)", panoramaImg: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "harau",
      name: "Lembah Harau",
      location: "Lima Puluh Kota, Sumatera Barat",
      province: "Sumatera Barat",
      type: "Danau", // Or could be tebing/lembah
      price: 15000,
      rating: 4.8,
      reviewsCount: 195,
      badge: "Populer",
      weather: {
        temp: 24,
        text: "Cerah Berawan",
        icon: "cloud-sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 25, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 24, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "2 Hari Lagi", temp: 23, text: "Hujan Ringan", icon: "cloud-rain", discount: 10 }
        ]
      },
      quotaTotal: 250,
      quotaBooked: 110,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Sebuah ngarai spektakuler yang diapit oleh tebing batu pasir tegak lurus setinggi hingga 300 meter. Di dasar lembah, terbentang hamparan sawah hijau subur dan beberapa air terjun cantik yang jatuh bebas.",
      facilities: ["Penginapan Adat", "Balkon Spot Foto", "Penyewaan Sepeda", "Pemandu Panjat Tebing"],
      access: "Sekitar 1 jam dari Kota Payakumbuh atau 3 jam dari Kota Padang.",
      rules: ["Dilarang mencoret-coret tebing batu", "Dilarang membuang sampah sembarangan", "Hormati privasi petani lokal"],
      umkmNear: [8],
      coordinates: { x: 26, y: 48 },
      virtualTourScenes: [
        { id: "canyon", name: "Pintu Masuk Lembah", bgGradient: "linear-gradient(135deg, #1f4037, #99f2c8)", panoramaImg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=3000&q=85" },
        { id: "ricefield", name: "Tengah Sawah Harau", bgGradient: "linear-gradient(135deg, #a8ff78, #78ffd6)", panoramaImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "tomia",
      name: "Pulau Tomia",
      location: "Wakatobi, Sulawesi Tenggara",
      province: "Sulawesi Tenggara",
      type: "Pantai",
      price: 30000,
      rating: 4.9,
      reviewsCount: 112,
      badge: "Hidden Gem",
      weather: {
        temp: 29,
        text: "Cerah",
        icon: "sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 29, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 30, text: "Cerah", icon: "sun" },
          { day: "2 Hari Lagi", temp: 29, text: "Cerah Berawan", icon: "cloud-sun" }
        ]
      },
      quotaTotal: 100,
      quotaBooked: 32,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Pulau legendaris di kepulauan Wakatobi yang terkenal ke seantero dunia karena memiliki keanekaragaman terumbu karang laut dalam yang menakjubkan dan arus tenang, surga mutlak bagi penyelam.",
      facilities: ["Dive Center Professional", "Homestay", "Sewa Perahu Katamaran", "Eco-Bin"],
      access: "Penerbangan charter lokal dari Kendari atau kapal cepat dari Pulau Wangi-Wangi.",
      rules: ["Dilarang keras menangkap atau menyentuh ikan purba", "Wajib membawa sampah plastik Anda kembali ke pos utama"],
      umkmNear: [6],
      coordinates: { x: 70, y: 70 },
      virtualTourScenes: [
        { id: "beach", name: "Pantai Hundano", bgGradient: "linear-gradient(135deg, #43c6ac, #191654)", panoramaImg: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=3000&q=85" },
        { id: "reef", name: "Roma's Reef Under Water", bgGradient: "linear-gradient(135deg, #000428, #004e92)", panoramaImg: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "ijen",
      name: "Kawah Ijen",
      location: "Banyuwangi, Jawa Timur",
      province: "Jawa Timur",
      type: "Hutan", // Or Gunung/Kawah
      price: 20000,
      rating: 4.8,
      reviewsCount: 520,
      badge: "Populer",
      weather: {
        temp: 14,
        text: "Dingin Berangin",
        icon: "cloud-wind",
        warning: "Aman - Bawa Masker Gas",
        forecast: [
          { day: "Besok", temp: 13, text: "Dingin Cerah", icon: "sun" },
          { day: "Lusa", temp: 15, text: "Berawan", icon: "cloud" },
          { day: "2 Hari Lagi", temp: 12, text: "Hujan Ringan", icon: "cloud-rain", discount: 15 }
        ]
      },
      quotaTotal: 400,
      quotaBooked: 310,
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Danau asam terbesar di dunia dengan warna air hijau toska yang menakjubkan. Terkenal secara global dengan fenomena alam langka 'Api Biru' (Blue Fire) yang menyala di kegelapan malam.",
      facilities: ["Penyewaan Masker Gas", "Troli Penumpang (Taksi Ijen)", "Warung Kopi Puncak", "Pondok Juru Kunci"],
      access: "Dapat dicapai dari Banyuwangi atau Bondowoso ke pos Paltuding, dilanjutkan mendaki jalan tanah terjal sejauh 3 km.",
      rules: ["Wajib memakai masker gas di dekat bibir kawah", "Dilarang memotong jalur pendakian", "Hormati para penambang belerang lokal"],
      umkmNear: [1],
      coordinates: { x: 48, y: 77 },
      virtualTourScenes: [
        { id: "paltuding", name: "Pos Paltuding Mulai Mendaki", bgGradient: "linear-gradient(135deg, #141e30, #243b55)", panoramaImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=3000&q=85" },
        { id: "bluefire", name: "Fenomena Api Biru", bgGradient: "linear-gradient(135deg, #000000, #0c0827, #13175c)", panoramaImg: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=3000&q=85" },
        { id: "crater", name: "Tepi Danau Kawah Asam", bgGradient: "linear-gradient(135deg, #2b5876, #4e4376)", panoramaImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "waerebo",
      name: "Kampung Adat Wae Rebo",
      location: "Manggarai, Nusa Tenggara Timur",
      province: "Nusa Tenggara Timur",
      type: "Budaya",
      price: 30000,
      rating: 4.9,
      reviewsCount: 160,
      badge: "Hidden Gem",
      weather: {
        temp: 20,
        text: "Berawan",
        icon: "cloud",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 21, text: "Kabut Tipis", icon: "cloud" },
          { day: "Lusa", temp: 22, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "2 Hari Lagi", temp: 19, text: "Hujan Sedang", icon: "cloud-showers-heavy", discount: 30 }
        ]
      },
      quotaTotal: 80,
      quotaBooked: 74,
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Kampung adat terpencil di atas pegunungan setinggi 1.200 mdpl yang memiliki 7 rumah adat berbentuk kerucut jerami yang disebut Mbaru Niang. Warisan budaya dunia UNESCO yang memukau.",
      facilities: ["Homestay Adat Mbaru Niang", "Jamuan Kopi Sambutan", "Makanan Tradisional", "Pemandu Lokal"],
      access: "Berkendara dari Labuan Bajo ke Denge, dilanjutkan tracking mendaki jalan setapak sejauh 9 km (sekitar 3-4 jam) menembus hutan tropis basah.",
      rules: ["Wajib membunyikan kentongan kayu di gerbang masuk", "Mintalah izin sebelum mengambil foto warga", "Dilarang membuang sampah modern (plastik) di atas kampung"],
      umkmNear: [4, 7],
      coordinates: { x: 62, y: 80 },
      virtualTourScenes: [
        { id: "jungle", name: "Jalur Trekking Hutan Manggarai", bgGradient: "linear-gradient(135deg, #134e5e, #71b280)", panoramaImg: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=3000&q=85" },
        { id: "village", name: "Kompleks Utama Mbaru Niang", bgGradient: "linear-gradient(135deg, #485563, #29323c)", panoramaImg: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=3000&q=85" }
      ]
    },
    {
      id: "pindul",
      name: "Gua Pindul",
      location: "Gunungkidul, Yogyakarta",
      province: "Yogyakarta",
      type: "Danau", // Or Gua/Sungai
      price: 20000,
      rating: 4.7,
      reviewsCount: 380,
      badge: "Populer",
      weather: {
        temp: 27,
        text: "Cerah",
        icon: "sun",
        warning: "Aman Dikunjungi",
        forecast: [
          { day: "Besok", temp: 28, text: "Cerah", icon: "sun" },
          { day: "Lusa", temp: 27, text: "Cerah Berawan", icon: "cloud-sun" },
          { day: "2 Hari Lagi", temp: 26, text: "Berawan", icon: "cloud" }
        ]
      },
      quotaTotal: 300,
      quotaBooked: 190,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Nikmati sensasi cave tubing, menyusuri sungai bawah tanah yang mengalir lambat di dalam sebuah gua karst yang megah dipenuhi stalaktit purba raksasa menggunakan ban pelampung.",
      facilities: ["Peralatan Safety (Jaket & Ban)", "Instruktur Pendamping", "Kamar Bilas", "Penyewaan Kamera Waterproof"],
      access: "Sekitar 1.5 jam berkendara ke arah timur dari Kota Yogyakarta.",
      rules: ["Wajib memakai jaket pelampung setiap saat", "Dilarang memegang ornamen stalaktit aktif", "Dilarang berteriak histeris di dalam gua"],
      umkmNear: [8],
      coordinates: { x: 44, y: 76 },
      virtualTourScenes: [
        { id: "cave_entrance", name: "Mulut Gua Pindul", bgGradient: "linear-gradient(135deg, #100e17, #322f3d)", panoramaImg: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=3000&q=85" },
        { id: "stalactite", name: "Kamar Stalaktit Raksasa", bgGradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", panoramaImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=3000&q=85" }
      ]
    }
  ];

  const initialProducts = [
    {
      id: 1,
      name: "Kripik Tempe Kecombrang",
      origin: "UMKM Mandiri Desa Wisata Cikaso",
      price: 15000,
      image: "https://images.unsplash.com/photo-1599490659273-e3a728b2136b?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      ecoFriendly: true,
      category: "Kuliner",
      description: "Kripik tempe renyah dengan aroma jeruk khas bunga kecombrang organik. Dikemas menggunakan plastik bio-degradable pati singkong yang hancur dalam 3 bulan."
    },
    {
      id: 2,
      name: "Gula Semut Aren Murni",
      origin: "UMKM Sukabumi Bersinar",
      price: 25000,
      image: "https://images.unsplash.com/photo-1581009137042-c552e4856c7d?auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      ecoFriendly: false,
      category: "Kuliner",
      description: "Gula aren kristal alami yang dipanen langsung oleh petani nira tradisional sekitar kaki bukit Sukabumi. Tanpa pemanis buatan."
    },
    {
      id: 3,
      name: "Kopi Robusta Samosir Arabica",
      origin: "Koperasi Tani Huta Batak",
      price: 45000,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      ecoFriendly: true,
      category: "Kuliner",
      description: "Kopi arabika bersertifikat organic yang ditanam di ketinggian vulkanik pulau Samosir. Memiliki aroma rempah batak alami."
    },
    {
      id: 4,
      name: "Kerajinan Anyaman Serat Pandan",
      origin: "Penenun Desa Wae Rebo",
      price: 120000,
      image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      ecoFriendly: true,
      category: "Kerajinan",
      description: "Tas tangan dan wadah anyaman eksotis yang dibuat dari serat daun pandan duri pegunungan Manggarai oleh para ibu adat Wae Rebo."
    },
    {
      id: 5,
      name: "Madu Hutan Khatulistiwa",
      origin: "Kelompok Tani Bukit Pelangi",
      price: 75000,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      ecoFriendly: true,
      category: "Kuliner",
      description: "Madu liar murni yang diambil berkelanjutan dari pohon sialang tinggi di hutan tropis Kutai Timur."
    },
    {
      id: 6,
      name: "Syal Tenun Pewarna Alami Maluku",
      origin: "Perajin Ora Mandiri",
      price: 150000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      ecoFriendly: true,
      category: "Pakaian Lokal",
      description: "Syal cantik tenunan tangan bermotif karang laut khas Maluku. Benang diwarnai menggunakan getah akar kayu mangrove merah."
    },
    {
      id: 7,
      name: "Minyak Kelapa Virgin Penglipuran",
      origin: "Kelompok Tani Tri Hita Karana",
      price: 35000,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      ecoFriendly: true,
      category: "Souvenir",
      description: "VCO murni berkualitas tinggi yang diproses dingin tanpa pemanasan dari kelapa lokal organik pekarangan Desa Penglipuran."
    },
    {
      id: 8,
      name: "Gantungan Kunci Kayu Ukir",
      origin: "Perajin Bambu Gunungkidul",
      price: 10000,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      ecoFriendly: true,
      category: "Souvenir",
      description: "Gantungan kunci bernuansa stalaktit terbuat dari limbah akar bambu sisa kerajinan meja kursi Gunungkidul."
    }
  ];

  const initialOpenTrips = [
    {
      id: 1,
      title: "Eco-Expedition Wae Rebo",
      destination: "Kampung Adat Wae Rebo",
      date: "15 - 18 Juli 2026",
      price: 1200000,
      quotaMax: 12,
      quotaLeft: 4,
      guide: "Jaka Satria",
      guideRating: 4.9,
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
      itinerary: [
        "Hari 1: Penjemputan di Labuan Bajo, Perjalanan Darat ke Denge, Menginap di Pos Denge.",
        "Hari 2: Trekking mendaki bukit ke Wae Rebo, Upacara adat Wae Lu'u, Menginap di Mbaru Niang.",
        "Hari 3: Aktivitas bersama warga, memanen kopi lokal, tracking turun ke Denge, kembali ke Labuan Bajo."
      ],
      includes: ["Transportasi AC Labuan Bajo PP", "Homestay Adat 2 Malam", "Makan 3x sehari", "Tiket Masuk & Pemandu Adat", "Donasi Reboisasi Rp25.000"]
    },
    {
      id: 2,
      title: "Jelajah Blue Fire Ijen",
      destination: "Kawah Ijen",
      date: "25 - 26 Juli 2026",
      price: 450000,
      quotaMax: 20,
      quotaLeft: 12,
      guide: "Bambang Mulyono",
      guideRating: 4.8,
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
      itinerary: [
        "Hari 1: Kumpul di Stasiun Banyuwangi, Briefing pendakian, Transfer ke Paltuding.",
        "Hari 2: Mulai pendakian jam 02:00 pagi, melihat Api Biru, hunting Sunrise tepi kawah, kembali ke Banyuwangi."
      ],
      includes: ["Transportasi Stasiun-Paltuding PP", "Tiket Masuk & Pemandu Berlisensi", "Masker Gas Medis", "Air Mineral & Snack"]
    },
    {
      id: 3,
      title: "Ora Beach Tropical Paradise",
      destination: "Pantai Ora",
      date: "12 - 15 Agustus 2026",
      price: 2800000,
      quotaMax: 8,
      quotaLeft: 2,
      guide: "Richard Pattinama",
      guideRating: 5.0,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      itinerary: [
        "Hari 1: Penjemputan Bandara Pattimura Ambon, Feri Cepat ke Pulau Seram, Transfer boat ke Ora Beach.",
        "Hari 2: Snorkeling di Tebing Batu Sawai, Mengunjungi Desa Saleman.",
        "Hari 3: Trekking burung paruh bengkok Manusela, Makan malam bakar ikan di pulau tak berpenghuni.",
        "Hari 4: Kepulangan ke Ambon."
      ],
      includes: ["Cottage Atas Air 3 Malam", "Makan & Barbeque Seafood", "Sewa Alat Snorkeling Lengkap", "Donasi Terumbu Karang Rp50.000"]
    },
    {
      id: 4,
      title: "Cultural Immersion Bali Aga",
      destination: "Desa Penglipuran",
      date: "08 - 10 Agustus 2026",
      price: 850000,
      quotaMax: 15,
      quotaLeft: 8,
      guide: "Wayan Sudarta",
      guideRating: 4.9,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      itinerary: [
        "Hari 1: Penjemputan Kuta, Menuju Penglipuran, Check-in homestay adat, membuat loloh cemcem.",
        "Hari 2: Sepedaan keliling desa, tracking Hutan Bambu adat, makan siang prasmanan masakan Bali.",
        "Hari 3: Belajar tari bali kilat atau membuat canang sari, transfer kembali."
      ],
      includes: ["Homestay Adat 2 Malam", "Sewa Sepeda", "Workshop Canang & Kuliner", "Donasi Kebersihan Desa Rp20.000"]
    },
    {
      id: 5,
      title: "Hidden Succulence Toba Samosir",
      destination: "Danau Toba Barat",
      date: "18 - 21 Agustus 2026",
      price: 1500000,
      quotaMax: 10,
      quotaLeft: 5,
      guide: "Tigor Nainggolan",
      guideRating: 4.7,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      itinerary: [
        "Hari 1: Penjemputan Kualanamu / Silangit, Menuju Samosir via Parapat, Check-in Camping Ground.",
        "Hari 2: Trekking Bukit Holbung, Berkano menyusuri tepi tebing Caldera.",
        "Hari 3: Belajar memasak ikan mas arsik kuliner legendaris Batak, malam api unggun dan kecapi batak.",
        "Hari 4: Kepulangan."
      ],
      includes: ["Peralatan Tenda Premium & Kasur", "Kano & Life Jacket", "Bahan Masak Arsik", "Donasi Air Danau Bersih Rp20.000"]
    }
  ];

  const initialCampaigns = [
    {
      id: "care-toilet",
      title: "🚽 Pembangunan Toilet Sanitasi Higienis",
      target: 25000000,
      raised: 18450000,
      donorsCount: 922,
      destinationId: "cikaso",
      description: "Mari bantu mewujudkan 4 bilik toilet umum berstandar higienis internasional dengan sistem bio-septic tank ramah lingkungan untuk wisatawan dan warga lokal di sekitar Curug Cikaso.",
      imageBefore: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      imageAfter: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
      updates: [
        { date: "12 Juni 2026", title: "Pondasi Toilet Selesai", description: "Pondasi dan septic tank ramah lingkungan selesai ditanam oleh warga gotong royong." },
        { date: "24 Juni 2026", title: "Pemasangan Dinding dan Keramik", description: "Dinding hebel sudah dipasang dan keramik anti-slip sedang dikerjakan." }
      ]
    },
    {
      id: "care-recycle",
      title: "🗑️ Smart Eco-Bin & Pengolahan Sampah",
      target: 40000000,
      raised: 35600000,
      donorsCount: 1780,
      destinationId: "penglipuran",
      description: "Pengadaan 10 stasiun Smart Eco-Bin IoT yang bisa otomatis memilah botol plastik dan kaleng bekas, serta membagikan poin digital langsung ke aplikasi wisatawan untuk menjaga kebersihan desa adat.",
      imageBefore: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
      imageAfter: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
      updates: [
        { date: "05 Juni 2026", title: "Fabrikasi Mesin IoT Selesai", description: "10 unit modul pemilah otomatis telah diuji coba di laboratorium ITS." }
      ]
    },
    {
      id: "care-school",
      title: "🤝 Pelatihan Bahasa Inggris & Homestay Desa Wisata",
      target: 30000000,
      raised: 12200000,
      donorsCount: 410,
      destinationId: "waerebo",
      description: "Peningkatan mutu pemandu lokal dan pemilik homestay di Wae Rebo berupa pelatihan intensif Bahasa Inggris Pariwisata serta standarisasi tempat tidur ramah lingkungan untuk menyambut wisatawan mancanegara.",
      imageBefore: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      imageAfter: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
      updates: [
        { date: "01 Juni 2026", title: "Kick-off Pelatihan Angkatan I", description: "15 pemuda pemandu adat memulai kelas dasar percakapan dengan tutor asing relawan." }
      ]
    }
  ];

  const initialUserProfile = {
    name: "Ari Wibowo",
    level: "Eco Explorer",
    ecoPoints: 1240,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    referralCode: "LANGLANG-AR1W",
    ecoBinScans: 14,
    badgeKoleksi: [
      { name: "Pertama Kali ke Hidden Gem", icon: "💎", desc: "Mengunjungi Curug Cikaso sebagai Hidden Gem pertama" },
      { name: "Penyelamat Bumi", icon: "🌱", desc: "Mendonasikan total Rp50.000 ke program Langlang Care" },
      { name: "Eco-Bin Master", icon: "🗑️", desc: "Melakukan scan sampah botol plastik di Smart Eco-Bin sebanyak 10 kali" }
    ]
  };

  const initialLeaderboard = [
    { name: "Siti Rahma", total: 450000, isAnonymous: false },
    { name: "Wisatawan Hijau", total: 350000, isAnonymous: true },
    { name: "Daffa H.", total: 250000, isAnonymous: false },
    { name: "Faline F.", total: 200000, isAnonymous: false },
    { name: "Safira K.", total: 150000, isAnonymous: false },
    { name: "Rifqy M.", total: 120000, isAnonymous: false },
    { name: "Budi Santoso", total: 100000, isAnonymous: false },
    { name: "Anonymous Earth Saver", total: 75000, isAnonymous: true },
    { name: "Ani Wijaya", total: 50000, isAnonymous: false },
    { name: "Donatur Cilik", total: 45000, isAnonymous: false }
  ];

  // 2. LocalStorage Helpers for Persistence
  function loadFromStorage(key, defaultValue) {
    const data = localStorage.getItem("langlang_" + key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Error parsing localStorage key: " + key, e);
      }
    }
    // Initialize if not present
    localStorage.setItem("langlang_" + key, JSON.stringify(defaultValue));
    return defaultValue;
  }

  function saveToStorage(key, value) {
    localStorage.setItem("langlang_" + key, JSON.stringify(value));
  }

  // 3. Expose global DB and dynamic operations API
  window.LanglangData = {
    // Read operations
    getDestinations: () => loadFromStorage("destinations", initialDestinations),
    getDestinationById: (id) => {
      const list = loadFromStorage("destinations", initialDestinations);
      return list.find(d => d.id === id);
    },
    getProducts: () => loadFromStorage("products", initialProducts),
    getOpenTrips: () => loadFromStorage("openTrips", initialOpenTrips),
    getCampaigns: () => loadFromStorage("campaigns", initialCampaigns),
    getUserProfile: () => loadFromStorage("userProfile", initialUserProfile),
    getLeaderboard: () => loadFromStorage("leaderboard", initialLeaderboard),
    getBookings: () => loadFromStorage("bookings", []),
    getDonations: () => loadFromStorage("donations", []),
    
    // Write / State Mutation operations
    updateDestinationQuota: (id, count) => {
      const list = loadFromStorage("destinations", initialDestinations);
      const dest = list.find(d => d.id === id);
      if (dest) {
        dest.quotaBooked = Math.min(dest.quotaTotal, dest.quotaBooked + count);
        saveToStorage("destinations", list);
      }
    },
    
    addBooking: (booking) => {
      const bookings = loadFromStorage("bookings", []);
      bookings.push(booking);
      saveToStorage("bookings", bookings);
      
      // Update destination quota
      window.LanglangData.updateDestinationQuota(booking.destinationId, booking.ticketsCount);
      
      // Update user eco points (e.g. 50 points per booking, plus 20 points if eco-friendly)
      const profile = loadFromStorage("userProfile", initialUserProfile);
      let pointsGained = 50 * booking.ticketsCount;
      if (booking.donationAmount > 0) {
        pointsGained += Math.floor(booking.donationAmount / 200); // 1 point per 200 Rp donation
      }
      profile.ecoPoints += pointsGained;
      
      // Check for level up
      if (profile.ecoPoints >= 2000) {
        profile.level = "Earth Guardian";
      } else if (profile.ecoPoints >= 1000) {
        profile.level = "Eco Explorer";
      }
      
      saveToStorage("userProfile", profile);
      return pointsGained;
    },

    addDonation: (donation) => {
      const donations = loadFromStorage("donations", []);
      donations.push(donation);
      saveToStorage("donations", donations);
      
      // Update campaign raised funds
      const campaigns = loadFromStorage("campaigns", initialCampaigns);
      const campaign = campaigns.find(c => c.id === donation.campaignId);
      if (campaign) {
        campaign.raised += donation.amount;
        campaign.donorsCount += 1;
        saveToStorage("campaigns", campaigns);
      }

      // Update user eco points
      const profile = loadFromStorage("userProfile", initialUserProfile);
      const pointsGained = Math.floor(donation.amount / 100); // 1 point per 100 Rp donation
      profile.ecoPoints += pointsGained;
      saveToStorage("userProfile", profile);

      // Add to leaderboard (if not anonymous)
      const leaderboard = loadFromStorage("leaderboard", initialLeaderboard);
      const name = donation.isAnonymous ? "Wisatawan Hijau" : profile.name;
      const existing = leaderboard.find(l => l.name === name && l.isAnonymous === donation.isAnonymous);
      if (existing) {
        existing.total += donation.amount;
      } else {
        leaderboard.push({ name: name, total: donation.amount, isAnonymous: donation.isAnonymous });
      }
      // Sort leaderboard desc
      leaderboard.sort((a, b) => b.total - a.total);
      saveToStorage("leaderboard", leaderboard.slice(0, 10)); // Top 10 only

      return pointsGained;
    },

    scanEcoBin: () => {
      const profile = loadFromStorage("userProfile", initialUserProfile);
      profile.ecoBinScans += 1;
      const pointsGained = 25; // 25 points per scan
      profile.ecoPoints += pointsGained;
      
      // Check achievements
      if (profile.ecoBinScans >= 10) {
        const hasBadge = profile.badgeKoleksi.some(b => b.name === "Eco-Bin Master");
        if (!hasBadge) {
          profile.badgeKoleksi.push({ name: "Eco-Bin Master", icon: "🗑️", desc: "Melakukan scan sampah botol plastik di Smart Eco-Bin sebanyak 10 kali" });
        }
      }
      
      saveToStorage("userProfile", profile);
      return pointsGained;
    },

    resetDatabase: () => {
      localStorage.removeItem("langlang_destinations");
      localStorage.removeItem("langlang_products");
      localStorage.removeItem("langlang_openTrips");
      localStorage.removeItem("langlang_campaigns");
      localStorage.removeItem("langlang_userProfile");
      localStorage.removeItem("langlang_leaderboard");
      localStorage.removeItem("langlang_bookings");
      localStorage.removeItem("langlang_donations");
      // Reload page to re-initialize
      window.location.reload();
    }
  };
})();
