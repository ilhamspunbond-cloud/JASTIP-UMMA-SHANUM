 <!-- Script JavaScript untuk Logika Pengguna Pertama / Lama -->
    <script>
        const video = document.getElementById('intro-video');
        const splashScreen = document.getElementById('splash-screen');
        const authButtons = document.getElementById('auth-buttons');

        // Cek apakah pengguna sudah pernah buka aplikasi sebelumnya
        const sudahPernahBuka = localStorage.getItem('jastip_sudah_buka');

        video.onended = function() {
            if (!sudahPernahBuka) {
                // KALO PERTAMA KALI: Rekam status & tampilkan tombol daftar/masuk
                localStorage.setItem('jastip_sudah_buka', 'true');
                authButtons.style.display = 'flex'; // Tampilkan tombol
            } else {
                // KALO BUKAN PERTAMA KALI: Langsung lempar ke dashboard
                window.location.href = 'dashboard.html'; 
            }
        };
    </script>
</body>
</html>
