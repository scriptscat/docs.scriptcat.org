---
title: Memasang dan Menggunakan Skill
---

Skill adalah paket ekstensi untuk Agent yang menyuntikkan pengetahuan khusus domain dan alat kustom ke dalam AI. Halaman ini mencakup cara memasang, mengonfigurasi, dan mengelola Skill.

:::tip Repositori Skill resmi
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Skill siap pakai untuk otomatisasi browser, tugas terjadwal, penguraian file, bantuan pengembangan skrip, dan lainnya.
:::

## Metode pemasangan

### Metode 1: pasang dari URL

Buka URL `SKILL.cat.md` langsung di bilah alamat browser Anda; ScriptCat akan menyadapnya dan memunculkan halaman konfirmasi pemasangan.

Misalnya, untuk memasang Skill otomatisasi browser resmi:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Anda juga dapat melakukannya dari halaman manajemen:

1. Buka halaman manajemen ScriptCat → **Agent → Skills**
2. Klik tombol **URL** di pojok kanan atas
3. Tempel URL `SKILL.cat.md`
4. Klik Pasang

ScriptCat secara otomatis mengambil `SKILL.cat.md` beserta file skrip dan materi referensi yang dideklarasikannya.

### Metode 2: pasang ZIP

1. Buka halaman manajemen ScriptCat → **Agent → Skills**
2. Klik tombol **+** di pojok kanan atas
3. Pilih paket Skill dalam format `.zip`

Struktur direktori ZIP harus mengikuti format Skill standar (harus berisi `SKILL.cat.md`).

## Daftar Skill resmi

Klik kanan **Salin tautan**, lalu tempel tautan ke bidang URL Manajemen Skills untuk memasang.

| Skill | Deskripsi | Pasang |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Analisis halaman, manipulasi DOM, pengisian formulir, tangkapan layar, navigasi | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Tugas terjadwal cron (dijalankan otomatis oleh LLM / panggilan balik skrip) | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Membantu membuat, menguji, dan mengemas Skill baru | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Mengurai file Excel, PDF, Word, CSV, dan PPT | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Asisten pengembangan skrip ScriptCat/Tampermonkey | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Membaca/menulis spreadsheet Synology Office | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Asisten operasi Akun Resmi WeChat | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Asisten operasi Xiaohongshu (RED) | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Mengonfigurasi Skill

Beberapa Skill memerlukan konfigurasi (seperti kunci API):

1. Temukan Skill yang terpasang di halaman **Agent → Skills**
2. Klik ikon **Pengaturan** (gear)
3. Isi bidang konfigurasi dan simpan

Bidang yang ditandai `secret` dalam konfigurasi disembunyikan di UI.

## Aktifkan / nonaktifkan

Di halaman manajemen Skills, gunakan sakelar di kartu Skill untuk mengontrol apakah Skill aktif. Skill yang dinonaktifkan tidak dimuat dalam percakapan.

## Memeriksa pembaruan

Skill yang dipasang melalui URL mendukung pemeriksaan versi:

1. Klik tombol **Periksa pembaruan** di pojok kanan atas halaman Skills
2. Kartu Skill dengan versi baru yang tersedia akan menampilkan tombol **Perbarui**
3. Klik untuk meningkatkan dengan satu klik

Pembaruan dibandingkan menggunakan bidang `version` (format semver) yang dideklarasikan dalam `SKILL.cat.md`.

## Menggunakan Skill dalam percakapan

Skill yang terpasang secara otomatis tersedia dalam percakapan Agent. AI memutuskan kapan memuat dan memanggil alat Skill berdasarkan konten percakapan.

Anda juga dapat menentukan Skill mana yang akan dimuat saat membuat percakapan:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Memuat semua Skill secara otomatis
  // atau tentukan Skill tertentu
  // skills: ["browser-automation", "file-parser"]
});
```

## Pelajari lebih lanjut

- [API Manajemen Skill](./agent-skill.md) — kelola Skill secara terprogram dari skrip
- [Panduan Pengembangan Skill](./agent-skill-dev.md) — buat Skill Anda sendiri
