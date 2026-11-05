---
title: Panduan Pengembangan Skill
---

Skill adalah paket ekstensi untuk sistem Agent, terdiri dari **prompt + skrip alat + materi referensi**. Skill memungkinkan Anda menyuntikkan pengetahuan khusus domain dan kemampuan alat kustom ke dalam AI.

## Struktur direktori Skill

```
my-skill/
├── SKILL.cat.md          # Wajib: metadata + prompt (file entri)
├── scripts/              # Opsional: skrip alat SkillScript
│   ├── search.js
│   └── export.js
└── references/           # Opsional: file materi referensi
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` adalah file entri Skill. Saat memasang dari URL, ScriptCat mengambil file ini terlebih dahulu, lalu mengambil file lain berdasarkan jalur relatifnya sesuai `scripts` dan `references` yang dideklarasikan di frontmatter-nya.

## Format SKILL.cat.md

`SKILL.cat.md` menggunakan frontmatter YAML untuk mendeklarasikan metadata, dengan isi Markdown berfungsi sebagai prompt yang diberikan ke AI.

```markdown
---
name: "weather-assistant"
description: "Weather lookup assistant, supports weather queries and forecasts for cities worldwide"
config:
  apiKey:
    title: "OpenWeather API Key"
    type: "text"
    secret: true
    required: true
  unit:
    title: "Temperature unit"
    type: "select"
    values: ["celsius", "fahrenheit"]
    default: "celsius"
  detailed:
    title: "Detailed mode"
    type: "switch"
    default: false
  maxDays:
    title: "Forecast days"
    type: "number"
    default: 7
---

# Weather assistant

You can use the following tools to look up weather information:

## Tool description

- **get_weather**: look up the current weather and forecast for a specified city
  - The `city` parameter is the city name (Chinese and English names both supported)
  - The `days` parameter is the number of forecast days

## Usage rules

1. When the user asks about weather, confirm the city name first
2. By default, return current weather + a 3-day forecast
3. Display temperature according to the configured unit
```

### Bidang metadata

| Bidang | Jenis | Wajib | Deskripsi |
|------|------|------|------|
| `name` | `string` | Ya | Pengidentifikasi Skill unik (Inggris kebab-case disarankan) |
| `description` | `string` | Ya | Deskripsi singkat (ditampilkan di daftar) |
| `version` | `string` | Tidak | Versi (format semver, mis. `1.0.0`), digunakan untuk pemeriksaan pembaruan |
| `scripts` | `string[]` | Tidak | Daftar nama file skrip (mis. `["search.js"]`); diambil otomatis dari direktori `scripts/` saat memasang melalui URL |
| `references` | `string[]` | Tidak | Daftar nama file materi referensi (mis. `["api-docs.md"]`); diambil otomatis dari direktori `references/` saat memasang melalui URL |
| `config` | `object` | Tidak | Definisi bidang konfigurasi |

### Jenis bidang konfigurasi

| type | Deskripsi | Properti khusus jenis |
|------|------|---------|
| `text` | Input teks | `secret`: apakah disembunyikan di UI |
| `number` | Input angka | — |
| `select` | Dropdown | `values`: daftar opsi (`string[]`) |
| `switch` | Sakelar | — |

**Properti umum:**

| Properti | Jenis | Deskripsi |
|------|------|------|
| `title` | `string` | Judul tampilan |
| `required` | `boolean` | Apakah wajib |
| `default` | `unknown` | Nilai bawaan |
| `secret` | `boolean` | Apakah informasi sensitif |

Pengguna mengisi nilai konfigurasi ini di pengaturan Skill di halaman manajemen.

### Isi prompt

Isi Markdown disuntikkan sebagai prompt sistem AI. Tips menulis:

- Jelaskan alat yang disediakan Skill dan kegunaannya
- Jelaskan arti setiap parameter alat dan aturan penggunaannya
- Berikan skenario penggunaan umum dan hal-hal yang perlu diperhatikan
- Jika ada materi referensi, jelaskan cara mengkonsultasikannya

## Skrip alat SkillScript

SkillScript adalah skrip alat yang dapat dipanggil AI. Setiap file SkillScript didaftarkan sebagai satu alat LLM.

### Format metadata

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name, Chinese and English names both supported
// @param       days number Number of forecast days, defaults to 3
// @param       format string [json,text] Output format
// @grant       CAT.agent.opfs
// @require     https://cdn.example.com/utils.js
// @timeout     60
// ==SkillScript==
```

### Bidang metadata

| Tag | Deskripsi | Contoh |
|------|------|------|
| `@name` | Nama alat (digunakan saat AI memanggilnya) | `get_weather` |
| `@description` | Deskripsi alat (AI menggunakan ini untuk memutuskan kapan memanggilnya) | `Look up city weather` |
| `@param` | Definisi parameter (dapat muncul beberapa kali) | lihat di bawah |
| `@grant` | Izin API GM yang dibutuhkannya | `CAT.agent.opfs` |
| `@require` | URL pustaka eksternal (dimuat dan di-cache) | `https://cdn.example.com/lib.js` |
| `@timeout` | Batas waktu eksekusi dalam detik | `60` (bawaan `300`) |

### Sintaks `@param`

```
@param paramName type[enumValues] [required] description
```

**Jenis:** `string`, `number`, `boolean`

**Nilai enum (opsional):** dibungkus dalam kurung siku, dipisahkan koma

**Penanda wajib:** `[required]` sebelum deskripsi

```javascript
// Parameter string wajib
// @param city string [required] City name

// Parameter string dengan enum
// @param unit string [celsius,fahrenheit] Temperature unit

// Parameter angka opsional
// @param days number Number of forecast days

// Parameter boolean
// @param detailed boolean Whether to return detailed information
```

Definisi parameter secara otomatis diubah menjadi JSON Schema untuk digunakan LLM saat memanggil alat.

### Menulis skrip

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. Terima parameter yang diteruskan AI melalui arguments[0]
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG menyediakan konfigurasi Skill yang diisi pengguna di halaman manajemen
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. Lakukan pekerjaan sebenarnya
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. Kembalikan hasil ke AI melalui `return`
return {
  city: data.city.name,
  country: data.city.country,
  forecasts: data.list.map(item => ({
    date: item.dt_txt,
    temp: item.main.temp,
    description: item.weather[0].description
  }))
};
```

### Lingkungan eksekusi

| Fitur | Deskripsi |
|------|------|
| **Lokasi eksekusi** | Lingkungan terisolasi bersandbox (tanpa akses DOM) |
| **Mendapatkan parameter** | `arguments[0]` — objek parameter yang diteruskan AI |
| **Mendapatkan konfigurasi** | `CAT_CONFIG` — objek global hanya-baca yang berisi konfigurasi pengguna |
| **Nilai kembali** | Pernyataan `return` mengembalikan nilai yang dapat diserialkan JSON |
| **Dukungan async** | `async/await`, `fetch`, dan `Promise` semuanya didukung |
| **Pustaka eksternal** | Dimuat melalui `@require`, di-cache secara lokal |
| **Batas waktu** | 300 detik secara bawaan, dapat disesuaikan melalui `@timeout` |
| **API GM** | Dapat digunakan setelah dideklarasikan melalui `@grant` (mis. `CAT.agent.opfs`) |

### Pustaka eksternal `@require`

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// Pustaka yang dimuat melalui @require dapat digunakan langsung
const result = _.groupBy(data, "category");
return result;
```

Pustaka eksternal di-cache saat pertama kali dimuat, dan eksekusi berikutnya menggunakan versi cache secara langsung.

## Materi referensi

File di direktori `references/` berfungsi sebagai materi referensi yang dapat dikonsultasikan AI. Saat AI membutuhkannya, AI membacanya melalui alat bawaan `read_reference`.

Konten yang cocok sebagai materi referensi:
- Dokumentasi API
- Spesifikasi format data
- Kumpulan contoh penggunaan
- Dokumen pengetahuan domain

## Repositori contoh

Ada repositori contoh Skill yang dikelola resmi, berisi beberapa Skill siap pakai dan contoh API skrip:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Daftar Skill:**

| Direktori | Deskripsi | Pasang |
|------|------|------|
| `browser-automation/` | Analisis halaman, manipulasi DOM, pengisian formulir, tangkapan layar, navigasi | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Tugas terjadwal cron (mode internal + peristiwa) | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Membantu membuat, menguji, dan mengemas Skill baru | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Mengurai format file umum (Excel, PDF, Word, CSV, PPT) | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | Asisten pengembangan skrip ScriptCat/Tampermonkey | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Membaca/menulis spreadsheet Synology Office | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | Asisten operasi Akun Resmi WeChat — pengumpulan konten, penulisan artikel, dan publikasi | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Asisten operasi Xiaohongshu (RED) — penulisan catatan, pembuatan gambar, dan publikasi | [Pasang](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Contoh kode:**

| Direktori | Deskripsi |
|------|------|
| `examples/conversation/` | Contoh API Percakapan — chat, streaming, pemanggilan alat |
| `examples/dom/` | Contoh API DOM — membaca halaman, mengisi formulir, manajemen tab |
| `examples/config/` | Contoh konfigurasi Skill — mendeklarasikan bidang konfigurasi dan menggunakan `CAT_CONFIG` |
| `examples/page_copilot.user.js` | Contoh skrip pengguna lengkap — asisten AI klik kanan dengan UI streaming |

Sebaiknya mulai belajar pengembangan Skill dari kode di repositori contoh.

## Metode pemasangan

### Pasang dari URL

Buka URL `SKILL.cat.md` langsung di browser Anda; ScriptCat akan menyadapnya dan memunculkan halaman pemasangan.

Anda juga dapat melakukannya dari halaman manajemen → Agent → Manajemen Skill:

1. Klik tombol pasang-URL
2. Tempel URL `SKILL.cat.md`
3. Konfirmasi pemasangan

ScriptCat mengambil `SKILL.cat.md` terlebih dahulu, lalu mengambil file lain berdasarkan jalur relatifnya sesuai `scripts` dan `references` yang dideklarasikan di frontmatter-nya. Setelah memasang, `installUrl` dicatat, sehingga pembaruan nanti dapat diperiksa berdasarkan nomor versi.

### Pasang dari skrip

```javascript
// ==UserScript==
// @grant CAT.agent.skills
// ==/UserScript==

await CAT.agent.skills.install(
  skillMdContent,
  [{ name: "search.js", code: scriptCode }],
  [{ name: "docs.md", content: docsContent }]
);
```

## Cara Skill dimuat

Skill menggunakan pemuatan progresif tiga tingkat untuk mengoptimalkan penggunaan konteks:

| Tingkat | Kapan | Konten |
|------|------|------|
| **Ringkasan** | Di awal percakapan | Nama Skill + deskripsi + daftar alat (disuntikkan ke prompt sistem) |
| **Prompt** | Saat AI secara aktif memanggil `load_skill` | Isi lengkap `SKILL.cat.md` |
| **Alat** | Setelah `load_skill` | SkillScript didaftarkan sebagai alat LLM yang dapat dipanggil |

AI memanggil `load_skill` secara otomatis saat perlu memuat konten dan alat lengkap Skill.

## Contoh lengkap

### Struktur direktori

```
translator-skill/
├── SKILL.cat.md
├── scripts/
│   └── translate.js
└── references/
    └── language-codes.md
```

### SKILL.cat.md

```markdown
---
name: "translator"
description: "Multilingual translation tool, supports 100+ languages"
version: "1.0.0"
scripts:
  - translate.js
references:
  - language-codes.md
config:
  apiKey:
    title: "Translation API Key"
    type: "text"
    secret: true
    required: true
  defaultTarget:
    title: "Default target language"
    type: "select"
    values: ["zh", "en", "ja", "ko", "fr", "de", "es"]
    default: "zh"
---

# Translation assistant

Use the `translate` tool to translate text. Refer to language-codes.md for the full list of language codes.

## Usage rules

- If the user hasn't specified a target language, use the default language from the configuration
- Long text is automatically translated in chunks
- Preserve the original formatting (Markdown, code blocks, etc.)
```

### scripts/translate.js

```javascript
// ==SkillScript==
// @name        translate
// @description Translate text into a specified language
// @param       text string [required] The text to translate
// @param       target string Target language code (uses the config value by default)
// @param       source string Source language code (auto-detected by default)
// @timeout     60
// ==SkillScript==

const { text, target, source } = arguments[0];
const apiKey = CAT_CONFIG.apiKey;
const targetLang = target || CAT_CONFIG.defaultTarget || "zh";

const response = await fetch("https://api.example.com/translate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    text,
    target_language: targetLang,
    source_language: source || "auto"
  })
});

if (!response.ok) {
  throw new Error(`Translation failed: ${response.statusText}`);
}

const result = await response.json();
return {
  original: text,
  translated: result.translated_text,
  source_language: result.detected_language,
  target_language: targetLang
};
```

### references/language-codes.md

```markdown
# Language code reference

| Code | Language |
|------|------|
| zh | Chinese |
| en | English |
| ja | Japanese |
| ko | Korean |
| fr | French |
| de | German |
| es | Spanish |
| ...  | ... |
```
