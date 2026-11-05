---
title: Skill Geliştirme Rehberi
---

Skill, Agent sistemi için bir uzantı paketidir; bir **istem + araç betikleri + referans materyalden** oluşur. Skill'ler, AI'ya alana özgü bilgi ve özel araç yetenekleri enjekte etmenizi sağlar.

## Skill dizin yapısı

```
my-skill/
├── SKILL.cat.md          # Zorunlu: meta veriler + istem (giriş dosyası)
├── scripts/              # İsteğe bağlı: SkillScript araç betikleri
│   ├── search.js
│   └── export.js
└── references/           # İsteğe bağlı: referans materyal dosyaları
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md`, Skill'in giriş dosyasıdır. Bir URL'den kurulum yapılırken ScriptCat önce bu dosyayı getirir, ardından ön yapısında bildirilen `scripts` ve `references` değerlerine göre diğer dosyaları göreli yollarından getirir.

## SKILL.cat.md biçimi

`SKILL.cat.md`, meta verileri bildirmek için YAML ön yapısını kullanır; Markdown gövdesi ise AI'ya verilen istem olarak hizmet eder.

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

### Meta veri alanları

| Alan | Tür | Zorunlu | Açıklama |
|------|------|------|------|
| `name` | `string` | Evet | Benzersiz Skill tanımlayıcısı (kebab-case İngilizce önerilir) |
| `description` | `string` | Evet | Kısa açıklama (listede gösterilir) |
| `version` | `string` | Hayır | Sürüm (semver biçimi, örn. `1.0.0`), güncelleme kontrolleri için kullanılır |
| `scripts` | `string[]` | Hayır | Betik dosya adlarının listesi (örn. `["search.js"]`); URL ile kurulumda `scripts/` dizininden otomatik getirilir |
| `references` | `string[]` | Hayır | Referans materyal dosya adlarının listesi (örn. `["api-docs.md"]`); URL ile kurulumda `references/` dizininden otomatik getirilir |
| `config` | `object` | Hayır | Yapılandırma alanı tanımları |

### Yapılandırma alanı türleri

| type | Açıklama | Türe özgü özellikler |
|------|------|---------|
| `text` | Metin girişi | `secret`: arayüzde maskelenip maskelenmediği |
| `number` | Sayı girişi | — |
| `select` | Açılır menü | `values`: seçenek listesi (`string[]`) |
| `switch` | Açma/kapama | — |

**Ortak özellikler:**

| Özellik | Tür | Açıklama |
|------|------|------|
| `title` | `string` | Görünen başlık |
| `required` | `boolean` | Zorunlu olup olmadığı |
| `default` | `unknown` | Varsayılan değer |
| `secret` | `boolean` | Hassas bilgi olup olmadığı |

Kullanıcı bu yapılandırma değerlerini yönetim sayfasındaki Skill ayarlarında doldurur.

### İstem gövdesi

Markdown gövdesi, AI'ın sistem istemi olarak enjekte edilir. Yazma ipuçları:

- Skill'in sağladığı araçları ve ne işe yaradıklarını açıklayın
- Her aracın parametrelerinin ne anlama geldiğini ve kullanım kurallarını açıklayın
- Tipik kullanım senaryoları ve dikkat edilmesi gerekenler verin
- Referans materyal varsa, ona nasıl danışılacağını açıklayın

## SkillScript araç betikleri

SkillScript, AI'ın çağırabileceği bir araç betiğidir. Her SkillScript dosyası bir LLM aracı olarak kaydedilir.

### Meta veri biçimi

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

### Meta veri alanları

| Etiket | Açıklama | Örnek |
|------|------|------|
| `@name` | Araç adı (AI onu çağırırken kullanır) | `get_weather` |
| `@description` | Araç açıklaması (AI bunu ne zaman çağıracağına karar vermek için kullanır) | `Look up city weather` |
| `@param` | Parametre tanımı (birden çok kez görünebilir) | aşağıya bakın |
| `@grant` | İhtiyaç duyduğu GM API izni | `CAT.agent.opfs` |
| `@require` | Harici kitaplık URL'si (yüklenir ve önbelleğe alınır) | `https://cdn.example.com/lib.js` |
| `@timeout` | Saniye cinsinden yürütme zaman aşımı | `60` (varsayılan `300`) |

### `@param` sözdizimi

```
@param paramName type[enumValues] [required] description
```

**Türler:** `string`, `number`, `boolean`

**Enum değerleri (isteğe bağlı):** köşeli parantez içinde, virgülle ayrılmış

**Zorunlu işareti:** açıklamadan önce `[required]`

```javascript
// Zorunlu dize parametresi
// @param city string [required] City name

// Enum'lu dize parametresi
// @param unit string [celsius,fahrenheit] Temperature unit

// İsteğe bağlı sayı parametresi
// @param days number Number of forecast days

// Boolean parametresi
// @param detailed boolean Whether to return detailed information
```

Parametre tanımları, LLM'nin aracı çağırırken kullanması için otomatik olarak JSON Schema'ya dönüştürülür.

### Betiği yazma

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. AI'ın arguments[0] ile ilettiği parametreleri al
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG, kullanıcının yönetim sayfasında doldurduğu Skill yapılandırmasını sağlar
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. Asıl işi yap
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. Sonucu `return` ile AI'a döndür
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

### Çalıştırma ortamı

| Özellik | Açıklama |
|------|------|
| **Çalıştırma konumu** | Korumalı, izole bir ortam (DOM erişimi yok) |
| **Parametre alma** | `arguments[0]` — AI'ın ilettiği parametre nesnesi |
| **Yapılandırma alma** | `CAT_CONFIG` — kullanıcının yapılandırmasını içeren genel, salt okunur bir nesne |
| **Dönüş değeri** | `return` ifadesi JSON ile serileştirilebilir bir değer döndürür |
| **Zaman uyumsuz desteği** | `async/await`, `fetch` ve `Promise` desteklenir |
| **Harici kitaplıklar** | `@require` ile yüklenir, yerel olarak önbelleğe alınır |
| **Zaman aşımı** | Varsayılan 300 saniye, `@timeout` ile özelleştirilebilir |
| **GM API** | `@grant` ile bildirildikten sonra kullanılabilir (örn. `CAT.agent.opfs`) |

### `@require` harici kitaplıklar

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// @require ile yüklenen bir kitaplık doğrudan kullanılabilir
const result = _.groupBy(data, "category");
return result;
```

Harici kitaplıklar ilk yüklendiklerinde önbelleğe alınır ve sonraki çalıştırmalar önbelleğe alınmış sürümü doğrudan kullanır.

## Referans materyal

`references/` dizinindeki dosyalar, AI'ın danışabileceği referans materyal olarak hizmet eder. AI ihtiyaç duyduğunda bunları yerleşik `read_reference` aracıyla okur.

Referans materyal için uygun içerikler:
- API belgeleri
- Veri biçimi spesifikasyonları
- Kullanım örnekleri koleksiyonları
- Alan bilgisi belgeleri

## Örnek deposu

Birkaç kullanıma hazır Skill ve betik API örneği içeren, resmi olarak bakımı yapılan bir Skill örnekleri deposu vardır:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill listesi:**

| Dizin | Açıklama | Kurulum |
|------|------|------|
| `browser-automation/` | Sayfa analizi, DOM işlemleri, form doldurma, ekran görüntüleri, gezinme | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron zamanlanmış görevler (dahili + olay modu) | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Yeni Skill'ler oluşturmaya, test etmeye ve paketlemeye yardımcı olur | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Yaygın dosya biçimlerini ayrıştırır (Excel, PDF, Word, CSV, PPT) | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat/Tampermonkey betik geliştirme asistanı | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Synology Office elektronik tablolarını okuma/yazma | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | WeChat Resmi Hesap işlemleri asistanı — içerik toplama, makale yazma ve yayınlama | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu (RED) işlemleri asistanı — not yazma, görsel oluşturma ve yayınlama | [Kur](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Örnek kod:**

| Dizin | Açıklama |
|------|------|
| `examples/conversation/` | Sohbet API'si örnekleri — sohbet, akış, araç çağrıları |
| `examples/dom/` | DOM API'si örnekleri — sayfa okuma, form doldurma, sekme yönetimi |
| `examples/config/` | Skill yapılandırma örnekleri — yapılandırma alanları bildirme ve `CAT_CONFIG` kullanma |
| `examples/page_copilot.user.js` | Eksiksiz bir kullanıcı betiği örneği — akışlı arayüze sahip sağ tıklama AI asistanı |

Skill geliştirmeyi örnek depodaki koddan öğrenmeye başlamak iyi bir fikirdir.

## Kurulum yöntemleri

### URL'den kurma

Tarayıcınızda bir `SKILL.cat.md` URL'sini doğrudan açın; ScriptCat onu yakalar ve bir kurulum sayfası açar.

Bunu yönetim sayfasından → Agent → Skill yönetimi bölümünden de yapabilirsiniz:

1. URL kurulum düğmesine tıklayın
2. `SKILL.cat.md` URL'sini yapıştırın
3. Kurulumu onaylayın

ScriptCat önce `SKILL.cat.md` dosyasını getirir, ardından ön yapısında bildirilen `scripts` ve `references` değerlerine göre diğer dosyaları göreli yollarından getirir. Kurulumdan sonra `installUrl` kaydedilir, böylece güncellemeler daha sonra sürüm numarasına göre kontrol edilebilir.

### Bir betikten kurma

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

## Skill'ler nasıl yüklenir

Skill'ler, bağlam kullanımını optimize etmek için üç katmanlı aşamalı yükleme kullanır:

| Katman | Ne zaman | İçerik |
|------|------|------|
| **Özet** | Bir sohbetin başında | Skill adı + açıklama + araç listesi (sistem istemine enjekte edilir) |
| **İstem** | AI `load_skill` çağrısı yaptığında | `SKILL.cat.md` dosyasının tam gövdesi |
| **Araçlar** | `load_skill` sonrasında | SkillScript'ler çağrılabilir LLM araçları olarak kaydedilir |

AI, bir Skill'in tam içeriğini ve araçlarını yüklemesi gerektiğinde `load_skill` çağrısını otomatik olarak yapar.

## Tam örnek

### Dizin yapısı

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
