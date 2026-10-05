LEVEL_VALID = {"pemula", "menengah", "lanjutan"}

daftar_buku = [
    {
        "judul": "Panduan Belajar AI Engineer",
        "subjek": ["AI", "LLM"],
        "level": "pemula",
    },
    {
        "judul": "Belajar Python untuk Data Science",
        "subjek": ["Python", "Data Science"],
        "level": "pemula",
    },
    {
        "judul": "Machine Learning Praktis",
        "subjek": ["Machine Learning"],
        "level": "menengah",
    },
    {
        "judul": "Deep Learning Lanjutan",
        "subjek": ["Deep Learning"],
        "level": "lanjutan",
    },
]


def saring_berdasarkan_level(daftar, level):
    """Kembalikan buku dengan level tertentu; error jika level tidak dikenal."""
    level_normal = level.strip().casefold()
    if level_normal not in LEVEL_VALID:
        raise ValueError(f"Level tidak dikenal: {level}")
    return [item for item in daftar if item["level"].casefold() == level_normal]


def cari_berdasarkan_subjek(daftar, kata):
    """Cari buku dengan subjek yang memuat kata, tanpa membedakan kapital."""
    kata_normal = kata.strip().casefold()
    return [
        item
        for item in daftar
        if any(kata_normal in subjek.casefold() for subjek in item["subjek"])
    ]


if __name__ == "__main__":
    for item in saring_berdasarkan_level(daftar_buku, "menengah"):
        print(f"- {item['judul']} ({', '.join(item['subjek'])})")
