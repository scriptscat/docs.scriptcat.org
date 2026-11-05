---
title: Agent
---

:::caution Test Aşaması
Agent özelliği şu anda hâlâ bir test aşamasındadır; aşağıdaki API'ler ve davranışlar resmi sürümden önce değişebilir.
:::

## Genel Bakış

ScriptCat v1.4, kullanıcı betiklerine AI sohbeti, tarayıcı otomasyonu, dosya yönetimi ve zamanlanmış görevler dahil bir dizi yetenek kazandıran Agent sistemini tanıtır.

Betikler bu yeteneklere `CAT.agent.*` ad alanı üzerinden çağrı yapar ve her API, karşılık gelen iznin `@grant` ile bildirilmesini gerektirir.

## Özellik Modülleri

| Modül | İzin | Açıklama |
|------|---------|------|
| [Sohbet](./agent-conversation) | `@grant CAT.agent.conversation` | AI sohbetleri oluşturma, mesaj gönderme, akış yanıtları, özel araçlar tanımlama |
| [DOM İşlemleri](./agent-dom) | `@grant CAT.agent.dom` | Sayfa gezinme, ekran görüntüleri, tıklama, doldurma, kaydırma, DOM izleme |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Skill paketlerini kurma/kaldırma/çağırma |
| [Zamanlanmış Görevler](./agent-task) | `@grant CAT.agent.task` | Cron zamanlanmış görevler, olay dinleme |
| [Model](./agent-model) | `@grant CAT.agent.model` | Yapılandırılmış model bilgilerini sorgulama (salt okunur) |
| [OPFS Dosyaları](./agent-opfs) | `@grant CAT.agent.opfs` | Agent çalışma alanı dosyalarını okuma/yazma |
| [MCP](./agent-mcp) | — | MCP sunucu bağlantılarını yapılandırma (yalnızca yönetim sayfası, betik API'si yok) |
| [Skill Geliştirme](./agent-skill-dev) | — | SKILL.cat.md + SkillScript geliştirme rehberi |

## Hızlı Başlangıç

Mümkün olan en basit Agent betiği:

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

## Mimari Genel Bakış

Agent sistemi, tarayıcı eklentisi içinde birden çok izole bağlamı kapsar:

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

### Depolama Yapısı

Agent, verileri tarayıcının OPFS (Origin Private File System) özelliğini kullanarak saklar:

```
agents/
├── conversations/       # sohbet geçmişi
├── attachments/         # ekler (görseller, dosyalar)
├── skills/{name}/       # Skill paketi dosyaları
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # zamanlanmış görev yapılandırması ve çalıştırma kayıtları
└── workspace/           # kullanıcı çalışma alanı dosyaları (opfs_* araçlarının işlediği dizin)
```

### Desteklenen Modeller

| Sağlayıcı | Biçim | Özellikler |
|----------|------|------|
| OpenAI uyumlu | OpenAI Chat Completions API | GPT-4o, DeepSeek ve diğer uyumlu modelleri destekler |
| Anthropic | Anthropic Messages API | Claude ailesini, Prompt Caching'i destekler |
| Zhipu | Zhipu API | GLM model ailesini destekler |

Kullanmak için paneldeki "Model Yapılandırması" altında bir Sağlayıcı ve API Anahtarı ekleyin.

### Skill Ekosistemi

Skill, istemler + araç betikleri + referans materyalini birleştiren bir pakettir ve Agent'a alana özgü bilgi ve özel araçlar enjekte etmenizi sağlar.

**Resmi Skill deposu: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Tarayıcı otomasyonu, zamanlanmış görevler, bir Skill oluşturma aracı, sohbet/DOM/yapılandırma örnekleri ve daha fazlası için kullanıma hazır Skill'ler içerir.

**Kurulum yöntemleri:**

- **URL kurulumu** — `SKILL.cat.md` URL'sini doğrudan tarayıcıda açın; ScriptCat otomatik olarak yakalar ve kurulum sayfasını gösterir. URL'yi panelin Agent → Skill Yönetimi bölümüne de yapıştırabilirsiniz.
- **Betik kurulumu** — `CAT.agent.skills.install()` API'siyle programatik olarak kurun

**Güncellemeleri kontrol etme:**

URL ile kurulan bir Skill, kurulum kaynağını kaydeder; panel, güncellemeleri kontrol etmenize ve tek tıkla yükseltmenize olanak tanır (`version` alanının semver karşılaştırmasına dayalı).

Ayrıntılar için [Skill Yönetim API'si](./agent-skill) ve [Skill Geliştirme Rehberi](./agent-skill-dev) bölümlerine bakın.
