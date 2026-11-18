# Buku Pembeli — Panduan Pasang

Website untuk simpan nama, alamat, no. telefon dan tarikh beli pembeli, dan cari semula dengan cepat.

Folder ini ada 3 fail:

| Fail | Guna |
|---|---|
| `index.html` | Website itu sendiri. Upload ke hosting anda. |
| `apps-script.gs` | Kod untuk Google Sheets (tempat data disimpan). |
| `PANDUAN.md` | Panduan ini. |

---

## Langkah 1: Sediakan Google Sheet (tempat simpan data)

1. Buka https://sheets.google.com dan buat **spreadsheet kosong** baru. Namakan, contohnya `Buku Pembeli`.
2. Dalam spreadsheet itu, klik menu **Extensions > Apps Script**.
3. Padam semua kod yang ada, kemudian tampal **semua** isi fail `apps-script.gs`.
4. Di baris atas, tukar kata laluan:
   ```js
   const KATA_LALUAN = "tukar-kata-laluan-ini";
   ```
   Ganti dengan kata laluan anda sendiri. Gunakan kata laluan yang susah diteka.
5. Klik ikon **Save** (disket).
6. Klik **Deploy > New deployment**.
   - Klik ikon gear, pilih **Web app**.
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
   - Klik **Deploy**.
7. Google akan minta kebenaran. Klik **Authorize access**, pilih akaun Google anda.
   Jika keluar amaran "Google hasn't verified this app", klik **Advanced > Go to ... (unsafe)**. Ini normal sebab skrip ini milik anda sendiri.
8. Salin **Web app URL** yang diberi. Ia bermula dengan `https://script.google.com/macros/s/.../exec`.

> "Anyone" bermaksud website boleh hubungi skrip ini. Data tetap dilindungi kerana setiap permintaan mesti ada kata laluan yang betul.

## Langkah 2: Masukkan URL ke dalam website

Buka `index.html` dengan Notepad (atau mana-mana editor teks). Cari baris ini berhampiran bahagian atas:

```js
window.BUKU_PEMBELI_API = "";
```

Tampal URL dari Langkah 1 di antara tanda petik:

```js
window.BUKU_PEMBELI_API = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Simpan fail.

## Langkah 3: Upload ke io.interactivelink.site

Pilih cara yang sepadan dengan hosting anda:

- **cPanel / hosting biasa:** Buka **File Manager**, masuk ke folder laman (biasanya `public_html`). Buat folder `pembeli`, kemudian upload `index.html` ke dalamnya.
  Website boleh dibuka di: `https://io.interactivelink.site/pembeli/`
- **GitHub Pages:** Fail ini sudah ada dalam repo di folder `buku-pembeli/`. Gabungkan (merge) ke cawangan yang digunakan oleh GitHub Pages, dan tukar URL dalam `index.html` seperti Langkah 2.
  Website boleh dibuka di: `https://io.interactivelink.site/buku-pembeli/`
- **WordPress:** Paling mudah upload `index.html` ke folder melalui File Manager hosting (seperti cPanel di atas). Jangan tampal ke dalam blok halaman WordPress, kerana WordPress boleh merosakkan kod.

> Jangan tindih (overwrite) `index.html` utama laman anda. Letak fail ini dalam folder sendiri.

## Langkah 4: Kongsi dengan orang lain

Beri mereka:
1. Link website, contohnya `https://io.interactivelink.site/pembeli/`
2. Kata laluan dari Langkah 1.

Semua orang akan nampak senarai pembeli yang sama, dan data juga boleh dilihat terus dalam Google Sheet anda.

---

## Soalan lazim

**Macam mana nak tukar kata laluan?**
Tukar `KATA_LALUAN` dalam Apps Script, klik Save, kemudian **Deploy > Manage deployments**. Pilih deployment anda, klik ikon pensel, pilih **Version: New version**, dan klik **Deploy**. Semua orang perlu masuk semula dengan kata laluan baru.

**Saya ubah kod Apps Script tapi tiada perubahan?**
Setiap kali kod diubah, mesti buat **Manage deployments > Edit > New version > Deploy**. URL kekal sama.

**Bagaimana jika URL tidak dimasukkan?**
Website tetap berfungsi, tetapi data hanya disimpan dalam pelayar peranti itu sahaja. Orang lain tak akan nampak data itu, dan data akan hilang jika cache pelayar dipadam. Website akan tunjuk amaran tentang perkara ini.

**Adakah data selamat?**
Data disimpan dalam Google Sheet milik anda. Sesiapa yang tahu kata laluan boleh lihat, tambah, ubah dan padam pembeli. Jangan kongsi kata laluan dengan orang yang tidak perlu. Halaman ini juga ditanda `noindex` supaya tidak muncul dalam Google Search.
