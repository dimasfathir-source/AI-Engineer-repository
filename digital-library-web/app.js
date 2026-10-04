const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function muatBuku() {
    const { data, error } = await db.from("koleksi").select("*");

    if (error) {
        console.error(error);
        return;
    }

    const daftar = document.getElementById("daftar-buku");

    data.forEach(buku => {
        const kartu = document.createElement("div");
        kartu.className = "kartu";

        const judul = document.createElement("h2");
        judul.textContent = buku.judul;

        const pengarang = document.createElement("p");
        pengarang.className = "pengarang";
        pengarang.textContent = `${buku.pengarang} (${buku.tahun})`;

        const bahasa = document.createElement("span");
        bahasa.className = "label";
        bahasa.textContent = buku.bahasa;

        kartu.append(judul, pengarang, bahasa);

        if (buku.ddc_final) {
            const ddc = document.createElement("span");
            ddc.className = "label";
            ddc.textContent = "DDC " + buku.ddc_final;
            kartu.append(ddc);
        }

        daftar.appendChild(kartu);
    });
}

muatBuku();