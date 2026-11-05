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
