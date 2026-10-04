const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let idSedangDiedit = null;

async function cekAdmin() {
    const { data: { session } } = await db.auth.getSession();

    if (!session) {
        window.location.href = "pages/login.html";
        return;
    }

    const { data: profil } = await db
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

    if (!profil || profil.role !== "admin") {
        await db.auth.signOut();
        window.location.href = "pages/login.html";
        return;
    }

    document.getElementById("sapaan").textContent =
        `Login sebagai ${session.user.email}`;

    muatDaftar();
}

document.getElementById("keluar").addEventListener("click", async () => {
    await db.auth.signOut();
    window.location.href = "pages/login.html";
});

// Isi pilihan bahasa dari config.js
const pilihBahasa = document.getElementById("bahasa");
Object.entries(namaBahasa).forEach(([kode, nama]) => {
    const opsi = document.createElement("option");
    opsi.value = kode;
    opsi.textContent = nama;
    pilihBahasa.appendChild(opsi);
});

// Ambil isi kolom; kosong dianggap null
function nilai(id) {
    const teks = document.getElementById(id).value.trim();
    return teks === "" ? null : teks;
}

document.getElementById("form-buku").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pesan = document.getElementById("pesan-form");
    pesan.className = "";
    pesan.textContent = "Menyimpan...";

    const dataBuku = {
        judul: nilai("judul"),
        pengarang: nilai("pengarang"),
        penerbit: nilai("penerbit"),
        tahun: nilai("tahun") ? Number(nilai("tahun")) : null,
        isbn: nilai("isbn"),
        bahasa: document.getElementById("bahasa").value,
        subjek: nilai("subjek"),
        ddc_final: nilai("ddc"),
        deskripsi: nilai("deskripsi"),
        file_url: nilai("file-url"),
        status: document.getElementById("status").value
    };

    let error = null;

    if (idSedangDiedit === null) {
        const hasil = await db.from("koleksi").insert(dataBuku);
        error = hasil.error;
    } else {
        const hasil = await db
            .from("koleksi")
            .update(dataBuku)
            .eq("id", idSedangDiedit)
            .select();
        error = hasil.error;

        if (!error && hasil.data.length === 0) {
            error = { message: "Tidak ada baris yang berubah." };
        }
    }

    if (error) {
        pesan.className = "galat";
        pesan.textContent = "Gagal menyimpan: " + error.message;
        return;
    }

    const sedangEdit = idSedangDiedit !== null;
    keluarModeEdit();

    pesan.className = "sukses";
    pesan.textContent = sedangEdit
        ? "Perubahan berhasil disimpan."
        : "Buku berhasil disimpan.";
    muatDaftar();
});

function isi(id, nilaiBaru) {
    document.getElementById(id).value = nilaiBaru ?? "";
}

function mulaiEdit(buku) {
    idSedangDiedit = buku.id;

    isi("judul", buku.judul);
    isi("pengarang", buku.pengarang);
    isi("penerbit", buku.penerbit);
    isi("tahun", buku.tahun);
    isi("isbn", buku.isbn);
    isi("bahasa", buku.bahasa ?? "id");
    isi("subjek", buku.subjek);
    isi("ddc", buku.ddc_final);
    isi("deskripsi", buku.deskripsi);
    isi("file-url", buku.file_url);
    isi("status", buku.status);

    document.getElementById("judul-form").textContent = "Edit Buku";
    document.getElementById("tombol-simpan").textContent = "Simpan Perubahan";
    document.getElementById("batal-edit").hidden = false;
    document.getElementById("pesan-form").textContent = "";
    document.getElementById("judul-form").scrollIntoView({ behavior: "smooth" });
}

function keluarModeEdit() {
    idSedangDiedit = null;
    document.getElementById("form-buku").reset();
    document.getElementById("judul-form").textContent = "Tambah Buku";
    document.getElementById("tombol-simpan").textContent = "Simpan Buku";
    document.getElementById("batal-edit").hidden = true;
}

document.getElementById("batal-edit").addEventListener("click", () => {
    keluarModeEdit();
    document.getElementById("pesan-form").textContent = "";
});

async function muatDaftar() {
    const wadah = document.getElementById("daftar-admin");

    const { data, error } = await db
        .from("koleksi")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        wadah.textContent = "Gagal memuat koleksi.";
        return;
    }

    wadah.innerHTML = "";

    const tabel = document.createElement("table");
    tabel.className = "tabel-admin";

    const kepala = document.createElement("tr");
    ["ID", "Judul", "Status", "Aksi"].forEach(teks => {
        const th = document.createElement("th");
        th.textContent = teks;
        kepala.appendChild(th);
    });
    tabel.appendChild(kepala);

    data.forEach(buku => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = buku.id;

        const tdJudul = document.createElement("td");
        tdJudul.textContent = buku.judul;

        const tdStatus = document.createElement("td");
        tdStatus.textContent = buku.status;
        tdStatus.className = "status-" + buku.status;

        const tdAksi = document.createElement("td");

        const statusBaru = buku.status === "terbit" ? "draft" : "terbit";

        const tombolEdit = document.createElement("button");
        tombolEdit.className = "tombol-kecil";
        tombolEdit.textContent = "Edit";
        tombolEdit.addEventListener("click", () => mulaiEdit(buku));

        const tombolStatus = document.createElement("button");
        tombolStatus.className = "tombol-kecil";
        tombolStatus.textContent =
            buku.status === "terbit" ? "Jadikan draft" : "Terbitkan";
        tombolStatus.addEventListener("click", () =>
            ubahStatus(buku.id, statusBaru)
        );

        const tombolHapus = document.createElement("button");
        tombolHapus.className = "tombol-kecil bahaya";
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", () =>
            hapusBuku(buku.id, buku.judul)
        );

        tdAksi.append(tombolEdit, tombolStatus, tombolHapus);
        tr.append(tdId, tdJudul, tdStatus, tdAksi);
        tabel.appendChild(tr);
    });

    wadah.appendChild(tabel);
}

async function ubahStatus(id, statusBaru) {
    const { data, error } = await db
        .from("koleksi")
        .update({ status: statusBaru })
        .eq("id", id)
        .select();

    if (error || data.length === 0) {
        alert("Gagal mengubah status.");
        return;
    }

    muatDaftar();
}

async function hapusBuku(id, judul) {
    if (!confirm(`Hapus buku "${judul}"?\nTindakan ini tidak bisa dibatalkan.`)) {
        return;
    }

    const { data, error } = await db
        .from("koleksi")
        .delete()
        .eq("id", id)
        .select();

    if (error || data.length === 0) {
        alert("Gagal menghapus buku.");
        return;
    }

    if (id === idSedangDiedit) keluarModeEdit();

    muatDaftar();
}

cekAdmin();