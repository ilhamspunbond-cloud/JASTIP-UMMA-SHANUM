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
