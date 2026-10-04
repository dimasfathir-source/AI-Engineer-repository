const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("form-login");
const pesan = document.getElementById("pesan");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    pesan.textContent = "Memproses...";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
        pesan.textContent = "Email atau password salah.";
        return;
    }

    window.location.href = "pages/admin.html";
}); 