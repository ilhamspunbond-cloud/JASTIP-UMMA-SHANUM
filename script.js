// ==========================================
// JASTIP UMMA SHANUM - CORE SCRIPT
// ==========================================

let userProfile = {
    name: "",
    wa: "",
    role: "buyer"
};

window.onload = function() {
    loadUserData();
    
    // Simulasi hilangnya splash screen setelah 2.5 detik
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 700);
        }
    }, 2500);
};

function loadUserData() {
    const saved = localStorage.getItem('jus_user_profile');
    if(saved) {
        userProfile = JSON.parse(saved);
        updateHeaderUI();
    } else {
        document.getElementById('onboarding-modal').classList.remove('hidden');
    }
}

function submitRegistration() {
    const name = document.getElementById('reg-name').value.trim();
    const wa = document.getElementById('reg-wa').value.trim();
    const role = document.getElementById('reg-role').value;

    if(!name || !wa) {
        alert("Harap isi Nama dan Nomor WhatsApp dengan lengkap!");
        return;
    }

    userProfile = { name, wa, role };
    localStorage.setItem('jus_user_profile', JSON.stringify(userProfile));
    
    document.getElementById('onboarding-modal').classList.add('hidden');
    updateHeaderUI();
    alert(`Pendaftaran berhasil! Selamat datang, ${name} (${role.toUpperCase()}).`);
}

function updateHeaderUI() {
    const info = document.getElementById('user-display-info');
    if(info) {
        info.textContent = `${userProfile.name} | Role: ${userProfile.role.toUpperCase()}`;
    }
}

// Simulasi Cek Tarif Raja Ongkir
function checkRajaOngkirTariff() {
    const city = document.getElementById('destination-city').value;
    const courier = document.getElementById('courier-service').value;
    const resultBox = document.getElementById('tariff-result');

    if(!city) {
        alert("Masukkan kota tujuan terlebih dahulu!");
        return;
    }

    resultBox.innerHTML = "⏳ Menghubungkan ke server Raja Ongkir...";
    
    // Simulasi respons API sukses
    setTimeout(() => {
        resultBox.innerHTML = `✅ Estimasi ke <b>${city}</b> via <b>${courier.toUpperCase()}</b>: Rp 18.000 - Rp 25.000 (Reguler 2-3 Hari).`;
    }, 1000);
}

function openSecretAdminPanel() {
    let pass = prompt("Masukkan Sandi Akses Khusus / Admin:");
    if(pass === "umma123" || userProfile.role === 'admin') {
        alert("Akses Admin Diberikan. Membuka panel kontrol penuh...");
    } else {
        alert("Sandi salah atau akses ditolak.");
    }
}

// ==========================================
// MODUL DASHBOARD MULTI-PERAN & KOMISI
// ==========================================

// Render tampilan berdasarkan role user yang sedang login
function renderDashboardByRole() {
    const mainContainer = document.querySelector('main');
    if(!mainContainer) return;

    let roleHTML = '';

    if (userProfile.role === 'admin') {
        // Tampilan khusus Admin / Owner (NIB: 0311260134277)
        roleHTML = `
            <div class="bg-slate-800 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h2 class="text-sm font-bold text-amber-400">👑 Panel Kontrol Admin & Owner</h2>
                    <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-semibold">NIB: 0311260134277</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button onclick="adminManageProducts()" class="bg-slate-900 hover:bg-slate-950 p-3 rounded-xl border border-slate-700 text-left transition cursor-pointer">
                        <div class="font-bold text-amber-300">📦 Kelola Produk Jastip</div>
                        <div class="text-[10px] text-slate-400">Tambah, edit, atau hapus katalog barang titipan.</div>
                    </button>
                    <button onclick="adminViewAllTransactions()" class="bg-slate-900 hover:bg-slate-950 p-3 rounded-xl border border-slate-700 text-left transition cursor-pointer">
                        <div class="font-bold text-amber-300">📊 Rekap Transaksi & COD</div>
                        <div class="text-[10px] text-slate-400">Pantau seluruh status pesanan pembeli & sales.</div>
                    </button>
                </div>
            </div>
        `;
    } else if (userProfile.role === 'sales') {
        // Tampilan khusus Sales / Mitra (Komisi 30% & 10%)
        roleHTML = `
            <div class="bg-slate-800 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h2 class="text-sm font-bold text-emerald-400">💼 Dashboard Sales & Mitra</h2>
                    <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-semibold">Aktif</span>
                </div>
                <p class="text-xs text-slate-300">Bagikan link referral Anda untuk mendapatkan komisi langsung 30% dan bonus piramida 10% dari jaringan penjualan.</p>
                <div class="bg-slate-900 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                    <span class="text-slate-400 truncate">Link: https://jastip-umma.app/ref/${userProfile.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <button onclick="copySalesLink()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex-shrink-0">Salin Link</button>
                </div>
            </div>
        `;
    } else {
        // Tampilan Pembeli (Buyer) / Penjual (Seller)
        roleHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-3">
                <h2 class="text-sm font-bold text-amber-300">🛒 Katalog Jastip Pilihan</h2>
                <p class="text-xs text-slate-400">Silakan pilih produk titipan luar negeri atau domestik favorit Anda, cek ongkir via Raja Ongkir, dan selesaikan transaksi dengan aman.</p>
            </div>
        `;
    }

    // Sisipkan ke dalam container utama web
    mainContainer.insertAdjacentHTML('afterbegin', roleHTML);
}

function copySalesLink() {
    alert("Link referral berhasil disalin ke clipboard! Bagikan ke calon pembeli.");
}

function adminManageProducts() {
    alert("Membuka form manajemen produk admin...");
}

function adminViewAllTransactions() {
    alert("Memuat data rekapitulasi transaksi COD dan non-COD...");
}


// ==========================================
// MODUL ASISTEN AI & ANALITIK BISNIS
// ==========================================

// Basis pengetahuan / ingatan AI lokal (bisa diperbarui oleh admin)
let aiKnowledgeBase = [
    { keyword: "jastip luar negeri", reaction: "Halo", answer: "Kami melayani titip beli barang luar negeri dan domestik dengan aman, cepat, dan terpercaya." },
    { keyword: "komisi sales", reaction: "Baik", answer: "Setiap sales mendapatkan komisi langsung 30% serta bonus piramida 10% dari jaringan penjualan Anda." },
    { keyword: "ongkir", reaction: "Tentu", answer: "Pengecekan ongkos kirim dapat dilakukan secara langsung menggunakan sistem Raja Ongkir yang tersedia di halaman utama." }
];

// Fungsi AI merespons pertanyaan pembeli/sales
function askAiAssistant(userQuestion) {
    const q = userQuestion.toLowerCase();
    let found = aiKnowledgeBase.find(item => q.includes(item.keyword));

    if (found) {
        return `${found.reaction} ${userProfile.name}, ${found.answer}`;
    } else {
        // Jika AI tidak mengerti, catat ke unanswered logs (masuk ke dashboard admin)
        logUnansweredQuestion(userQuestion);
        return `Mohon maaf ${userProfile.name}, pertanyaan tersebut belum ada dalam ingatan sistem. Tim admin akan segera meninjaunya.`;
    }
}

// Catat pertanyaan yang belum dimengerti AI
function logUnansweredQuestion(questionText) {
    let logs = JSON.parse(localStorage.getItem('jus_unanswered_logs') || '[]');
    logs.push({ text: questionText, date: new Date().toLocaleString() });
    localStorage.setItem('jus_unanswered_logs', JSON.stringify(logs));
}

// Analisis AI untuk memberikan saran peningkatan omzet (Khusus Admin)
function getAiBusinessAdvice() {
    // Simulasi analisis data omzet & transaksi
    const totalTransactions = 45; // Contoh data rekap
    const estimatedOmzet = 12500000;

    let advice = `📊 **Analisis & Saran AI untuk Jastip Umma Shanum:**\n\n`;
    advice += `- Total Transaksi Tercatat: ${totalTransactions} pesanan\n`;
    advice += `- Perkiraan Omzet: Rp ${estimatedOmzet.toLocaleString('id-ID')}\n\n`;
    advice += `💡 **Saran Peningkatan Income:**\n`;
    advice += `1. Tingkatkan promosi produk jastip luar negeri yang memiliki margin keuntungan lebih tinggi.\n`;
    advice += `2. Berikan insentif tambahan atau bonus target bagi jaringan Sales agar memperluas jangkauan pasar.\n`;
    advice += `3. Maksimalkan fitur sistem COD untuk membangun kepercayaan pembeli baru di area domestik.`;

    return advice;
}

// Fungsi Admin menambahkan ingatan baru ke AI
function adminAddAiKnowledge(keyword, reaction, answer) {
    aiKnowledgeBase.push({ keyword, reaction, answer });
    localStorage.setItem('jus_ai_knowledge', JSON.stringify(aiKnowledgeBase));
    alert("Ingatan AI baru berhasil disimpan dan langsung aktif!");
}

function sendUserMessageToAi() {
    const inputEl = document.getElementById('ai-user-input');
    const chatBox = document.getElementById('ai-chat-box');
    const text = inputEl.value.trim();

    if(!text) return;

    // Tampilkan pesan user
    chatBox.innerHTML += `<div class="text-right"><span class="bg-slate-800 text-white px-2.5 py-1 rounded-lg inline-block">${text}</span></div>`;
    
    // Dapatkan jawaban dari AI
    const aiReply = askAiAssistant(text);

    // Tampilkan jawaban AI
    setTimeout(() => {
        chatBox.innerHTML += `<div class="text-left"><span class="bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 px-2.5 py-1 rounded-lg inline-block">${aiReply}</span></div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    inputEl.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ==========================================
// VALIDASI PENDAFTARAN & LOCALSTORAGE
// ==========================================

function checkFirstTimeUser() {
    const savedProfile = localStorage.getItem('jus_user_profile');
    const onboardingModal = document.getElementById('onboarding-modal');
    
    if(!savedProfile) {
        // Jika belum pernah daftar, tampilkan modal registrasi
        if(onboardingModal) onboardingModal.classList.remove('hidden');
    } else {
        // Jika sudah, muat data profil
        userProfile = JSON.parse(savedProfile);
        updateHeaderUI();
        renderDashboardByRole();
    }
}

// Panggil fungsi ini di dalam window.onload utama
window.addEventListener('DOMContentLoaded', () => {
    // Sembunyikan splash screen setelah video/animasi selesai (2.5 detik)
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.remove();
                checkFirstTimeUser(); // Cek pendaftaran setelah splash selesai
            }, 700);
        }
    }, 2500);
});


// ==========================================
// MODUL KATALOG PRODUK & KERANJANG JASTIP
// ==========================================

// Contoh data produk titipan (bisa diperbarui oleh admin atau database cloud)
let jastipProducts = [
    { id: 1, name: "Coklat Dubai Viral Premium", price: 150000, category: "Makanan", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Tas Brand Original Bangkok", price: 450000, category: "Fashion", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Skincare Import Exclusive", price: 275000, category: "Kecantikan", image: "https://via.placeholder.com/150" }
];

let shoppingCart = [];

// Render daftar produk ke halaman utama
function renderJastipCatalog() {
    const catalogContainer = document.getElementById('jastip-catalog-container');
    if(!catalogContainer) return;

    catalogContainer.innerHTML = '';
    jastipProducts.forEach(prod => {
        catalogContainer.innerHTML += `
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-3 flex flex-col justify-between space-y-2">
                <div>
                    <img src="${prod.image}" class="w-full h-28 object-cover rounded-lg mb-2" alt="${prod.name}">
                    <h3 class="font-bold text-xs text-amber-300 truncate">${prod.name}</h3>
                    <p class="text-[10px] text-slate-400">Kategori: ${prod.category}</p>
                    <p class="text-xs font-extrabold text-emerald-400 mt-1">Rp ${prod.price.toLocaleString('id-ID')}</p>
                </div>
                <button onclick="addToCart(${prod.id})" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] py-1.5 rounded-lg transition cursor-pointer">+ Tambah ke Keranjang</button>
            </div>
        `;
    });
}

// Tambah produk ke keranjang
function addToCart(productId) {
    const item = jastipProducts.find(p => p.id === productId);
    if(!item) return;

    const existing = shoppingCart.find(c => c.id === productId);
    if(existing) {
        existing.qty += 1;
    } else {



// ==========================================
// MODUL TRANSAKSI & PANEL ADMIN JASTIP
// ==========================================

// Simulasi database transaksi lokal / cloud
let transactionHistory = [
    { id: "TRX-1001", buyer: "Siti Aminah", items: "Coklat Dubai (2x)", total: 300000, status: "Menunggu Konfirmasi", payment: "COD" },
    { id: "TRX-1002", buyer: "Budi Santoso", items: "Tas Bangkok (1x)", total: 450000, status: "Lunas / Diproses", payment: "Transfer" }
];

// Render daftar transaksi ke dashboard Admin
function renderAdminTransactions() {
    const container = document.getElementById('admin-transaction-list');
    if(!container) return;

    container.innerHTML = '';
    if(transactionHistory.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 italic">Belum ada transaksi masuk.</p>';
        return;
    }

    transactionHistory.forEach((trx) => {
        let badgeColor = trx.status.includes('Lunas') ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' : 'bg-amber-950 text-amber-300 border-amber-500/30';
        
        container.innerHTML += `
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs space-y-2">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-amber-400">${trx.id} - ${trx.buyer}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full border ${badgeColor}">${trx.status}</span>
                </div>
                <div class="text-slate-300 text-[11px]">
                    📦 Item: ${trx.items}<br>
                    💰 Total: <b>Rp ${trx.total.toLocaleString('id-ID')}</b> (${trx.payment})
                </div>
                <div class="flex gap-2 pt-1">
                    <button onclick="updateTransactionStatus('${trx.id}', 'Lunas / Diproses')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[10px] transition cursor-pointer">✅ Set Lunas</button>
                    <button onclick="deleteTransaction('${trx.id}')" class="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[10px] transition cursor-pointer">🗑️ Hapus</button>
                </div>
            </div>
        `;
    });
}

// Ubah status transaksi
function updateTransactionStatus(trxId, newStatus) {
    const trx = transactionHistory.find(t => t.id === trxId);
    if(trx) {
        trx.status = newStatus;
        renderAdminTransactions();
        alert(`Status transaksi ${trxId} berhasil diperbarui menjadi: ${newStatus}`);
    }
}

// Hapus transaksi
function deleteTransaction(trxId) {
    if(confirm(`Yakin ingin menghapus data transaksi ${trxId}?`)) {
        transactionHistory = transactionHistory.filter(t => t.id !== trxId);
        renderAdminTransactions();
    }
}


// ==========================================
// MODUL RAJA ONGKIR API INTEGRATION
// ==========================================

// Masukkan API Key Raja Ongkir Anda di sini (atau ambil dari pengaturan admin)
let rajaOngkirApiKey = "MASUKKAN_API_KEY_RAJAONGKIR_DISINI";
let originCityId = "501"; // Contoh ID Kota Asal (misal: Tangerang / Jakarta)

async function fetchRajaOngkirCost(destinationCityId, weightInGrams, courierCode) {
    const resultBox = document.getElementById('tariff-result');
    if(!resultBox) return;

    resultBox.innerHTML = "⏳ Menghitung ongkos kirim via Raja Ongkir...";

    try {
        // Catatan: Pada implementasi server production, fetch sebaiknya melalui backend/proxy 
        // untuk menghindari CORS error dari browser langsung ke endpoint Raja Ongkir.
        const response = await fetch('https://api.rajaongkir.com/starter/cost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'key': rajaOngkirApiKey
            },
            body: `origin=${originCityId}&destination=${destinationCityId}&weight=${weightInGrams}&courier=${courierCode}`
        });

        const data = await response.json();
        
        if(data && data.rajaongkir && data.rajaongkir.results && data.rajaongkir.results.length > 0) {
            const costs = data.rajaongkir.results[0].costs;
            let htmlOutput = `<div class="font-bold text-amber-300 mb-1">📦 Pilihan Layanan ${data.rajaongkir.results[0].name.toUpperCase()}:</div><ul class="space-y-1">`;
            
            costs.forEach(c => {
                const serviceName = c.service;
                const costDetail = c.cost[0];
                htmlOutput += `<li class="bg-slate-900 p-2 rounded border border-slate-700 flex justify-between">
                    <span><b>${serviceName}</b> (${costDetail.etd} Hari)</span>
                    <span class="text-emerald-400 font-bold">Rp ${costDetail.value.toLocaleString('id-ID')}</span>
                </li>`;
            });
            htmlOutput += `</ul>`;
            resultBox.innerHTML = htmlOutput;
        } else {
            resultBox.innerHTML = `<span class="text-rose-400">⚠️ Gagal memuat tarif. Periksa kembali Kota Tujuan atau API Key Anda.</span>`;
        }
    } catch (error) {
        console.error("Raja Ongkir Error:", error);
        // Fallback Simulasi jika koneksi/CORS terbatas di sisi client
        resultBox.innerHTML = `
            <div class="bg-slate-900 p-2.5 rounded border border-slate-700 space-y-1">
                <span class="text-amber-400 font-bold">🚚 Estimasi Tarif Standar Raja Ongkir:</span>
                <div class="flex justify-between text-slate-300">
                    <span>Reguler (2-3 Hari)</span>
                    <span class="text-emerald-400 font-bold">Rp 19.000</span>
                </div>
                <div class="flex justify-between text-slate-300">
                    <span>Express (1-2 Hari)</span>
                    <span class="text-emerald-400 font-bold">Rp 28.000</span>
                </div>
            </div>`;
    }
}


function triggerRajaOngkirCheck() {
    const destId = document.getElementById('dest-city-id').value.trim();
    const weight = document.getElementById('package-weight').value.trim() || 1000;
    const courier = document.getElementById('courier-code').value;

    if(!destId) {
        alert("Masukkan ID atau Kota Tujuan terlebih dahulu!");
        return;
    }

    fetchRajaOngkirCost(destId, weight, courier);
}


// ==========================================
// JASTIP UMMA SHANUM - FULL INTEGRATED SCRIPT
// NIB: 0311260134277
// ==========================================

let userProfile = {
    name: "",
    wa: "",
    role: "buyer"
};

let shoppingCart = [];

let jastipProducts = [
    { id: 1, name: "Coklat Dubai Viral Premium", price: 150000, category: "Makanan", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Tas Brand Original Bangkok", price: 450000, category: "Fashion", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Skincare Import Exclusive", price: 275000, category: "Kecantikan", image: "https://via.placeholder.com/150" }
];

let transactionHistory = [
    { id: "TRX-1001", buyer: "Siti Aminah", items: "Coklat Dubai (2x)", total: 300000, status: "Menunggu Konfirmasi", payment: "COD" },
    { id: "TRX-1002", buyer: "Budi Santoso", items: "Tas Bangkok (1x)", total: 450000, status: "Lunas / Diproses", payment: "Transfer" }
];

// Inisialisasi saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    // Sembunyikan splash screen setelah 2.5 detik
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.remove();
                checkFirstTimeUser();
            }, 700);
        }
    }, 2500);
});

// Pengecekan pendaftaran pertama kali
function checkFirstTimeUser() {
    const saved = localStorage.getItem('jus_user_profile');
    const modal = document.getElementById('onboarding-modal');
    
    if(!saved) {
        if(modal) modal.classList.remove('hidden');
    } else {
        userProfile = JSON.parse(saved);
        updateHeaderUI();
        renderDashboardByRole();
        renderJastipCatalog();
    }
}

// Simpan data pendaftaran
function submitRegistration() {
    const name = document.getElementById('reg-name').value.trim();
    const wa = document.getElementById('reg-wa').value.trim();
    const role = document.getElementById('reg-role').value;

    if(!name || !wa) {
        alert("Harap isi Nama dan Nomor WhatsApp dengan lengkap!");
        return;
    }

    userProfile = { name, wa, role };
    localStorage.setItem('jus_user_profile', JSON.stringify(userProfile));
    
    document.getElementById('onboarding-modal').classList.add('hidden');
    updateHeaderUI();
    renderDashboardByRole();
    renderJastipCatalog();
    alert(`Pendaftaran berhasil! Selamat datang, ${name} (${role.toUpperCase()}).`);
}

function updateHeaderUI() {
    const info = document.getElementById('user-display-info');
    if(info) {
        info.textContent = `${userProfile.name} | Role: ${userProfile.role.toUpperCase()}`;
    }
}

// Render Dashboard Berdasarkan Peran (Role)
function renderDashboardByRole() {
    const container = document.getElementById('dynamic-role-container');
    if(!container) return;

    if (userProfile.role === 'admin') {
        container.innerHTML = `
            <div class="bg-slate-800 border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-xl">
                <div class="flex justify-between items-center border-b border-slate-700 pb-2">
                    <h2 class="text-xs font-bold text-amber-400">👑 Panel Kontrol Admin & Owner</h2>
                    <span class="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">NIB: 0311260134277</span>
                </div>
                <p class="text-[11px] text-slate-300">Kelola transaksi masuk, atur produk jastip, dan pantau omzet bisnis secara real-time.</p>
            </div>
        `;
    } else if (userProfile.role === 'sales') {
        container.innerHTML = `
            <div class="bg-slate-800 border border-emerald-500/40 rounded-2xl p-4 space-y-3 shadow-xl">
                <h2 class="text-xs font-bold text-emerald-400">💼 Dashboard Sales & Komisi</h2>
                <p class="text-[11px] text-slate-300">Dapatkan komisi langsung 30% dan bonus piramida 10% dari jaringan referral Anda.</p>
            </div>
        `;
    } else {
        container.innerHTML = '';
    }
}

// Render Katalog Produk
function renderJastipCatalog() {
    const catalogContainer = document.getElementById('jastip-catalog-container');
    if(!catalogContainer) return;

    catalogContainer.innerHTML = '';
    jastipProducts.forEach(prod => {
        catalogContainer.innerHTML += `
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-3 flex flex-col justify-between space-y-2">
                <div>
                    <img src="${prod.image}" class="w-full h-24 object-cover rounded-lg mb-2" alt="${prod.name}">
                    <h3 class="font-bold text-xs text-amber-300 truncate">${prod.name}</h3>
                    <p class="text-[10px] text-slate-400">Kategori: ${prod.category}</p>
                    <p class="text-xs font-extrabold text-emerald-400 mt-1">Rp ${prod.price.toLocaleString('id-ID')}</p>
                </div>
                <button onclick="addToCart(${prod.id})" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] py-1.5 rounded-lg transition cursor-pointer">+ Tambah</button>
            </div>
        `;
    });
}

function addToCart(productId) {
    const item = jastipProducts.find(p => p.id === productId);
    if(!item) return;

    const existing = shoppingCart.find(c => c.id === productId);
    if(existing) {
        existing.qty += 1;
    } else {
        shoppingCart.push({ ...item, qty: 1 });
    }

    updateCartUI();
    alert(`Berhasil menambahkan ${item.name} ke keranjang!`);
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-item-count');
    if(cartCountEl) {
        const totalQty = shoppingCart.reduce((sum, item) => sum + item.qty, 0);
        cartCountEl.textContent = totalQty;
    }
}

// Checkout ke WhatsApp
function checkoutToWhatsApp() {
    if(shoppingCart.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
    }

    let message = `Halo Admin *Jastip Umma Shanum*, saya *${userProfile.name}* (${userProfile.wa}) ingin memesan:\n\n`;
    let grandTotal = 0;
    
    shoppingCart.forEach((item, idx) => {
        let subtotal = item.price * item.qty;
        grandTotal += subtotal;
        message += `${idx + 1}. *${item.name}* (${item.qty}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n💰 *Total:* Rp ${grandTotal.toLocaleString('id-ID')}\n📍 *Pemesan:* ${userProfile.name} (${userProfile.wa})\n\nMohon diproses ya, terima kasih!`;

    const ownerWhatsApp = "6289630539563";
    window.open(`https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`);
}

// Cek Tarif Raja Ongkir
function triggerRajaOngkirCheck() {
    const dest = document.getElementById('dest-city-id').value.trim();
    const resultBox = document.getElementById('tariff-result');

    if(!dest) {
        alert("Masukkan Kota Tujuan terlebih dahulu!");
        return;
    }

    resultBox.innerHTML = "⏳ Menghitung tarif via Raja Ongkir...";
    
    setTimeout(() => {
        resultBox.innerHTML = `
            <div class="bg-slate-900 p-2.5 rounded border border-slate-700 space-y-1">
                <span class="text-amber-400 font-bold">🚚 Estimasi Tarif ke ${dest}:</span>
                <div class="flex justify-between text-slate-300">
                    <span>JNE Reguler (2-3 Hari)</span>
                    <span class="text-emerald-400 font-bold">Rp 19.000</span>
                </div>
                <div class="flex justify-between text-slate-300">
                    <span>J&T Express (1-2 Hari)</span>
                    <span class="text-emerald-400 font-bold">Rp 26.000</span>
                </div>
            </div>`;
    }, 1000);
}
