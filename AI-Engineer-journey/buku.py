buku = {
        "judul":"Panduan belajar AI Engineer",
        "subjek":["AI","LLM","OOP","ML"],
        "level":"pemula"
    }
def cocok_pemula(b):
        return b["level"]=="pemula"

print(cocok_pemula(buku))


daftar_buku = [
    {"judul":"Panduan belajar AI Engineer", "subjek":["AI","LLM","OOP","ML"], "level":"pemula"},
    {"judul":"Belajar Python untuk Data Science", "subjek":["Python","Data Science"], "level":"pemula"},
    {"judul":"Deep Learning Lanjutan", "subjek":["Deep Learning","Neural Networks"], "level":"lanjutan"},
    {"judul":"Machine Learning Praktis", "subjek":["Machine Learning","Praktik"], "level":"menengah"}
]


def saring_berdasarkan_level(daftar_buku, level):
    return [buku for buku in daftar_buku if buku["level"] == level]

print(saring_berdasarkan_level(daftar_buku, "pemula"))
print(saring_berdasarkan_level(daftar_buku, "menengah"))
print(saring_berdasarkan_level(daftar_buku, "lanjutan"))
