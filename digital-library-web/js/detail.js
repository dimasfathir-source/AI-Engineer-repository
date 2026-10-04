const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function tambahBaris(tabel, label, nilai) {
    if (!nilai) return;

    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = label;
    const td = document.createElement("td");
    td.textContent = nilai;

    tr.append(th, td);
    tabel.appendChild(tr);
}

async function muatDetail() {
    const wadah = document.getElementById("detail-buku");
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        wadah.textContent = "Buku tidak ditemukan.";
        return;
    }

    const { data, error } = await db
        .from("koleksi")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error || !data) {
        wadah.textContent = "Buku tidak ditemukan.";
        return;
    }

    document.title = data.judul + " - Perpustakaan Digital";

    const judul = document.createElement("h2");
    judul.textContent = data.judul;

    const tabel = document.createElement("table");
    tambahBaris(tabel, "Pengarang", data.pengarang);
    tambahBaris(tabel, "Penerbit", data.penerbit);
    tambahBaris(tabel, "Tahun", data.tahun);
    tambahBaris(tabel, "ISBN", data.isbn);
    tambahBaris(tabel, "Bahasa", namaBahasa[data.bahasa] || data.bahasa);
    tambahBaris(tabel, "Subjek", data.subjek);
    tambahBaris(tabel, "DDC", data.ddc_final);

    wadah.append(judul, tabel);

    if (data.deskripsi) {
        const deskripsi = document.createElement("p");
        deskripsi.textContent = data.deskripsi;
        wadah.appendChild(deskripsi);
    }

    if (data.file_url && data.file_url.startsWith("http")) {
        const tombol = document.createElement("a");
        tombol.className = "tombol";
        tombol.href = data.file_url;
        tombol.target = "_blank";
        tombol.textContent = "Baca / Unduh";
        wadah.appendChild(tombol);
    }
}

muatDetail();