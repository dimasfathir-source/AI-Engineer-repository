from buku import cari_berdasarkan_subjek, daftar_buku, saring_berdasarkan_level


def test_filter_level_normalisasi_huruf_dan_spasi():
    hasil = saring_berdasarkan_level(daftar_buku, " MENENGAH ")
    assert len(hasil) == 1
    assert hasil[0]["judul"] == "Machine Learning Praktis"


def test_cari_subjek_tidak_membedakan_huruf_besar_kecil():
    hasil = cari_berdasarkan_subjek(daftar_buku, "pYtHoN")
    assert len(hasil) == 1
    assert hasil[0]["judul"] == "Belajar Python untuk Data Science"
