---
title: Agent
---

:::caution Fase Pengujian
Fitur Agent saat ini masih dalam fase pengujian; API dan perilaku berikut dapat berubah sebelum rilis resmi.
:::

## Ringkasan

ScriptCat v1.4 memperkenalkan sistem Agent, memberikan skrip pengguna serangkaian kemampuan termasuk percakapan AI, otomatisasi browser, manajemen file, dan tugas terjadwal.

Skrip memanggil kemampuan ini melalui namespace `CAT.agent.*`, dan setiap API memerlukan izin terkait untuk dideklarasikan dengan `@grant`.

## Modul Fitur

| Modul | Izin | Deskripsi |
|------|---------|------|
| [Percakapan](./agent-conversation) | `@grant CAT.agent.conversation` | Membuat percakapan AI, mengirim pesan, streaming respons, mendefinisikan alat kustom |
| [Operasi DOM](./agent-dom) | `@grant CAT.agent.dom` | Navigasi halaman, tangkapan layar, klik, pengisian, pengguliran, pemantauan DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Memasang/mencopot/memanggil paket Skill |
| [Tugas Terjadwal](./agent-task) | `@grant CAT.agent.task` | Tugas terjadwal cron, mendengarkan peristiwa |
| [Model](./agent-model) | `@grant CAT.agent.model` | Mengkueri informasi model yang dikonfigurasi (hanya baca) |
| [File OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Membaca/menulis file ruang kerja Agent |
| [MCP](./agent-mcp) | — | Mengonfigurasi koneksi server MCP (halaman manajemen saja, tanpa API skrip) |
| [Pengembangan Skill](./agent-skill-dev) | — | Panduan pengembangan SKILL.cat.md + SkillScript |

## Mulai Cepat

Skrip Agent paling sederhana yang mungkin:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Hi, please introduce yourself");
console.log(reply.content);
```

## Ringkasan Arsitektur

Sistem Agent mencakup beberapa konteks terisolasi dalam ekstensi browser:

```
User script → Sandbox (isolated execution)
              ↓ WindowMessage
           Offscreen (DOM access)
              ↓ ExtensionMessage
           Service Worker (core scheduling)
              ├── LLM Provider (OpenAI / Anthropic)
              ├── ToolRegistry (tool registration and execution)
              ├── SkillScriptExecutor (Skill script execution)
              ├── MCPClient (MCP protocol client)
              └── TaskScheduler (scheduled task scheduling)
```

### Struktur Penyimpanan

Agent menyimpan data menggunakan OPFS browser (Origin Private File System):

```
agents/
├── conversations/       # riwayat percakapan
├── attachments/         # lampiran (gambar, file)
├── skills/{name}/       # file paket Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # konfigurasi tugas terjadwal dan catatan eksekusi
└── workspace/           # file ruang kerja pengguna (direktori tempat alat opfs_* beroperasi)
```

### Model yang Didukung

| Penyedia | Format | Fitur |
|----------|------|------|
| Kompatibel OpenAI | OpenAI Chat Completions API | Mendukung GPT-4o, DeepSeek, dan model kompatibel lainnya |
| Anthropic | Anthropic Messages API | Mendukung keluarga Claude, Prompt Caching |
| Zhipu | Zhipu API | Mendukung keluarga model GLM |

Tambahkan Penyedia dan Kunci API di bawah "Konfigurasi Model" di dasbor untuk menggunakannya.

### Ekosistem Skill

Skill adalah paket yang menggabungkan prompt + skrip alat + materi referensi, memungkinkan Anda menyuntikkan pengetahuan khusus domain dan alat kustom ke dalam Agent.

**Repositori Skill resmi: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Termasuk Skill siap pakai untuk otomatisasi browser, tugas terjadwal, alat pembuat Skill, contoh percakapan/DOM/config, dan lainnya.

**Metode pemasangan:**

- **Pemasangan URL** — buka URL `SKILL.cat.md` langsung di browser; ScriptCat secara otomatis menyadapnya dan menampilkan halaman pemasangan. Anda juga dapat menempelkan URL di bawah dasbor Agent → Manajemen Skill.
- **Pemasangan skrip** — pasang secara terprogram melalui API `CAT.agent.skills.install()`

**Memeriksa pembaruan:**

Skill yang dipasang melalui URL mencatat sumber pemasangannya; dasbor memungkinkan Anda memeriksa pembaruan dan meningkatkan dengan satu klik (berdasarkan perbandingan semver bidang `version`).

Lihat [API Manajemen Skill](./agent-skill) dan [Panduan Pengembangan Skill](./agent-skill-dev) untuk detailnya.
