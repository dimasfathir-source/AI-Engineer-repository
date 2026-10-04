const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let semuaBuku = [];


async function ambilBuku() {
    const { data, error } = await db
        .from("koleksi")
        .select("*")
        .eq("status", "terbit");

    if (error) {
        console.error(error);
        const daftar = document.getElementById("daftar-buku");
        daftar.textContent = "Katalog tidak dapat dimuat. Silakan coba lagi nanti.";
        return;
    }

    semuaBuku = data;
    isiDropdown();
    tampilkanBuku(semuaBuku);
}

function isiDropdown() {
    isiOpsi("filter-bahasa", semuaBuku.map(b => b.bahasa), kode => namaBahasa[kode] || kode);
    isiOpsi("filter-subjek", semuaBuku.map(b => b.subjek), teks => teks);
}

function isiOpsi(idSelect, nilaiNilai, ubahTeks) {
    const select = document.getElementById(idSelect);
    const unik = [...new Set(nilaiNilai.filter(Boolean))].sort();

    unik.forEach(nilai => {
        const opsi = document.createElement("option");
        opsi.value = nilai;
        opsi.textContent = ubahTeks(nilai);
        select.appendChild(opsi);
    });
}

function tampilkanBuku(daftarBuku) {
    const daftar = document.getElementById("daftar-buku");
    daftar.innerHTML = "";

    if (daftarBuku.length === 0) {
        const pesan = document.createElement("p");
        pesan.className = "kosong";
        pesan.textContent = "Buku tidak ditemukan.";
        daftar.appendChild(pesan);
        return;
    }

    daftarBuku.forEach(buku => {
        const kartu = document.createElement("div");
        kartu.className = "kartu";

        const judul = document.createElement("h2");
        const tautan = document.createElement("a");
        tautan.href = `pages/detail.html?id=${buku.id}`;
        tautan.textContent = buku.judul;
        judul.appendChild(tautan);

        const pengarang = document.createElement("p");
        pengarang.className = "pengarang";
        pengarang.textContent = [
            buku.pengarang,
            buku.tahun ? `(${buku.tahun})` : null
        ].filter(Boolean).join(" ");

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

function terapkanFilter() {
    const kata = document.getElementById("kotak-cari").value.toLowerCase();
    const bahasa = document.getElementById("filter-bahasa").value;
    const subjek = document.getElementById("filter-subjek").value;

    const hasil = semuaBuku.filter(buku => {
        const cocokKata =
            (buku.judul || "").toLowerCase().includes(kata) ||
            (buku.pengarang || "").toLowerCase().includes(kata);
        const cocokBahasa = bahasa === "" || buku.bahasa === bahasa;
        const cocokSubjek = subjek === "" || buku.subjek === subjek;

        return cocokKata && cocokBahasa && cocokSubjek;
    });

    tampilkanBuku(hasil);
}

document.getElementById("kotak-cari").addEventListener("input", terapkanFilter);
document.getElementById("filter-bahasa").addEventListener("change", terapkanFilter);
document.getElementById("filter-subjek").addEventListener("change", terapkanFilter);

ambilBuku();
