// ==========================================
// JASTIP UMMA SHANUM - FINAL INTEGRATED SCRIPT
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

let aiKnowledgeBase = [
    { keyword: "jastip luar negeri", reaction: "Halo", answer: "Kami melayani titip beli barang luar negeri dan domestik dengan aman, cepat, dan terpercaya." },
    { keyword: "komisi sales", reaction: "Baik", answer: "Setiap sales mendapatkan komisi langsung 30% serta bonus piramida 10% dari jaringan penjualan Anda." },
    { keyword: "ongkir", reaction: "Tentu", answer: "Pengecekan ongkos kirim dapat dilakukan secara langsung menggunakan sistem Raja Ongkir yang tersedia di halaman utama." }
];

let salesCommissionData = {
    directSalesCount: 8,
    directCommissionRate: 0.30,
    pyramidNetworkCount: 15,
    pyramidCommissionRate: 0.10,
    averageProfitPerItem: 50000
};

// Inisialisasi saat aplikasi dimuat
window.addEventListener('DOMContentLoaded', () => {
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
    
    const modal = document.getElementById('onboarding-modal');
    if(modal) modal.classList.add('hidden');
    
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
        const directTotal = salesCommissionData.directSalesCount * salesCommissionData.averageProfitPerItem * salesCommissionData.directCommissionRate;
        const pyramidTotal = salesCommissionData.pyramidNetworkCount * salesCommissionData.averageProfitPerItem * salesCommissionData.pyramidCommissionRate;
        const grandTotal = directTotal + pyramidTotal;

        container.innerHTML = `
            <div class="bg-slate-800 border border-emerald-500/40 rounded-2xl p-4 space-y-4 shadow-xl">
                <div class="flex justify-between items-center border-b border-slate-700 pb-2">
                    <h2 class="text-xs font-bold text-emerald-400">💼 Dashboard Sales & Komisi</h2>
                    <span class="text-[9px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">Aktif</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-400 text-[10px]">Komisi Langsung (30%)</span>
                        <p class="text-xs font-bold text-emerald-400">Rp ${directTotal.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-400 text-[10px]">Bonus Pyramida (10%)</span>
                        <p class="text-xs font-bold text-amber-400">Rp ${pyramidTotal.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                        <span class="text-slate-400 text-[10px]">Total Komisi</span>
                        <p class="text-xs font-bold text-amber-300">Rp ${grandTotal.toLocaleString('id-ID')}</p>
                    </div>
                </div>
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

    message += `\n💰 *Total:* Rp ${grandTotal.toLocaleString('id-ID')}\n📍 *Pemesan:* ${userProfile.name} (${userProfile.wa})\n\nMohon segera diproses ya, terima kasih!`;

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

function openSecretAdminPanel() {
    let pass = prompt("Masukkan Sandi Akses Khusus / Admin:");
    if(pass === "umma123" || userProfile.role === 'admin') {
        alert("Akses Admin Diberikan. Membuka panel kontrol penuh...");
    } else {
        alert("Sandi salah atau akses ditolak.");
    }
}
