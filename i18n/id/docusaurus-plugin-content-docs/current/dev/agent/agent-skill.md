---
title: API Manajemen Skill
---

`@grant CAT.agent.skills`

API manajemen Skill memungkinkan skrip untuk mengkueri, memasang, menghapus, dan memanggil paket ekstensi Skill.

Untuk pengembangan dan pengemasan Skill, lihat [Panduan Pengembangan Skill](../agent-skill-dev). Contoh Skill resmi: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — daftar Skill yang terpasang

```javascript
const skills = await CAT.agent.skills.list();
```

**Mengembalikan `SkillSummary[]`:**

| Bidang | Jenis | Deskripsi |
|------|------|------|
| `name` | `string` | Nama Skill |
| `description` | `string` | Deskripsi Skill |
| `toolNames` | `string[]` | Nama alat SkillScript yang dikandungnya |
| `referenceNames` | `string[]` | Nama file materi referensi yang dikandungnya |
| `hasConfig` | `boolean` | Apakah ia mendeklarasikan bidang konfigurasi |
| `enabled` | `boolean` | Apakah ia aktif (bawaan `true`) |
| `installtime` | `number` | Stempel waktu pemasangan |
| `updatetime` | `number` | Stempel waktu pembaruan terakhir |

> Catatan: `version` dan `installUrl` (digunakan oleh fitur pemeriksaan pembaruan halaman manajemen) tidak dikembalikan melalui API skrip ini — keduanya hanya digunakan secara internal oleh logika pemeriksaan pembaruan dan UI halaman manajemen.

## get — dapatkan detail Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Mengembalikan `SkillRecord` lengkap, atau `null` jika tidak ada.

**Bentuk `SkillRecord`:**

Mewarisi semua bidang dari `SkillSummary`, ditambah:

| Bidang | Jenis | Deskripsi |
|------|------|------|
| `prompt` | `string` | Isi Markdown dari `SKILL.cat.md` (prompt yang diberikan ke AI) |
| `config` | `Record<string, SkillConfigField>` | Definisi bidang konfigurasi (skema) |

**Bentuk `SkillConfigField`:**

| Bidang | Jenis | Deskripsi |
|------|------|------|
| `title` | `string` | Judul tampilan |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Jenis bidang |
| `secret` | `boolean` | Apakah sensitif (disembunyikan di UI) |
| `required` | `boolean` | Apakah wajib |
| `default` | `unknown` | Nilai bawaan |
| `values` | `string[]` | Daftar opsi (hanya tipe `select`) |

## install — pasang Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parameter:**

| Parameter | Jenis | Deskripsi |
|------|------|------|
| `skillMd` | `string` | Isi file `SKILL.cat.md` (wajib) |
| `scripts` | `Array<{ name, code }>` | Daftar file SkillScript |
| `references` | `Array<{ name, content }>` | Daftar file materi referensi |

Jika Skill dengan nama yang sama sudah ada, ini akan memperbaruinya.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Custom search tool
---

Use the search tool when the user needs to search.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API Docs\n..." }]
);
```

## remove — copot pemasangan Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Mengembalikan `true` jika berhasil dihapus, `false` jika Skill tidak ada.

## call — panggil SkillScript secara langsung

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Menjalankan SkillScript di Skill yang ditentukan secara langsung, tanpa melalui percakapan AI.

**Parameter:**

| Parameter | Jenis | Deskripsi |
|------|------|------|
| `skillName` | `string` | Nama Skill (wajib) |
| `scriptName` | `string` | Nama SkillScript (wajib) |
| `params` | `Record<string, unknown>` | Parameter yang diteruskan (sesuai dengan deklarasi `@param`) |

```javascript
// Panggil skrip pencarian di dalam Skill secara langsung
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> Eksekusi SkillScript memiliki batas waktu (300 detik secara bawaan, dapat disesuaikan melalui `@timeout`).
