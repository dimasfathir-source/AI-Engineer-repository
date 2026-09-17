"""SIMPLE KALKULATOR PROGRAM"""

def add(a,b):
    """Fungsi untuk menambahkan dua angka"""
    return a + b

def subtract(a,b):
    """Fungsi untuk mengurangi dua angka"""
    return a - b

def multiply(a,b):
    """Fungsi untuk mengalikan dua angka"""
    return a * b

def divide(a,b):
    """Fungsi untuk membagi dua angka"""
    if b == 0:
        raise ValueError("Tidak bisa membagi dengan nol!")
    return a / b

#Program utama
if __name__ == "__main__":
    print("Selamat datang di Kalkulator Sederhana!")
    print("Pilih operasi:")
    print("1. Penjumlahan")
    print("2. Pengurangan")
    print("3. Perkalian")
    print("4. Pembagian")

    choice = input("Masukkan pilihan (1/2/3/4): ")

    num1 = float(input("Masukkan angka pertama: "))
    num2 = float(input("Masukkan angka kedua: "))

    if choice == '1':
        print(f"Hasil: {add(num1, num2)}")
    elif choice == '2':
        print(f"Hasil: {subtract(num1, num2)}")
    elif choice == '3':
        print(f"Hasil: {multiply(num1, num2)}")
    elif choice == '4':
        try:
            print(f"Hasil: {divide(num1, num2)}")
        except ValueError as e:
            print(e)
    else:
        print("Pilihan tidak valid!")
