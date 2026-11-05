---
title: Skill մշակման ուղեցույց
---

Skill-ը Agent համակարգի ընդլայնման փաթեթ է՝ կազմված **պրոմպտ + գործիքի սկրիպտներ + հղման նյութ**-ից: Skills-ը թույլ է տալիս դոմեն-հատուկ գիտելիքներ և կաստոմ գործիքային կարողություններ ներարկել AI-ի մեջ:

## Skill դիրեկտորիայի կառուցվածքը

```
my-skill/
├── SKILL.cat.md          # Required: metadata + prompt (entry file)
├── scripts/              # Optional: SkillScript tool scripts
│   ├── search.js
│   └── export.js
└── references/           # Optional: reference material files
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md`-ը Skill-ի մուտքային ֆայլն է: URL-ից տեղադրելիս ScriptCat-ը սկզբում ֆեչում է այս ֆայլը, ապա ֆեչում է մյուս ֆայլերը՝ դրանց հարաբերական ուղիներով՝ հիմնվելով դրա frontmatter-ում հայտարարված `scripts` և `references` վրա:

## SKILL.cat.md ձևաչափ

`SKILL.cat.md`-ը օգտագործում է YAML frontmatter՝ մետատվյալներ հայտարարելու համար, իսկ Markdown մարմինը ծառայում է որպես AI-ին տրվող պրոմպտ:

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

### Մետատվյալների դաշտեր

| Դաշտ | Տիպ | Պարտադիր | Նկարագրություն |
|------|------|------|------|
| `name` | `string` | Այո | Եզակի Skill նույնականացուցիչ (kebab-case անգլերեն՝ խորհուրդ տրված) |
| `description` | `string` | Այո | Համառոտ նկարագրություն (ցուցադրվում է ցուցակում) |
| `version` | `string` | Ոչ | Տարբերակ (semver ձևաչափ, օր.՝ `1.0.0`), օգտագործվում է թարմացումների ստուգման համար |
| `scripts` | `string[]` | Ոչ | Սկրիպտ ֆայլերի անունների ցուցակ (օր.՝ `["search.js"]`); ավտոմատ կերպով ֆեչվում են `scripts/` դիրեկտորիայից URL-ով տեղադրելիս |
| `references` | `string[]` | Ոչ | Հղման-նյութ ֆայլերի անունների ցուցակ (օր.՝ `["api-docs.md"]`); ավտոմատ կերպով ֆեչվում են `references/` դիրեկտորիայից URL-ով տեղադրելիս |
| `config` | `object` | Ոչ | Կոնֆիգուրացիոն դաշտերի սահմանումներ |

### Կոնֆիգուրացիոն դաշտերի տիպեր

| type | Նկարագրություն | Տիպ-հատուկ հատկություններ |
|------|------|---------|
| `text` | Տեքստային մուտքագրում | `secret`. արդյոք այն քողարկված է UI-ում |
| `number` | Թվային մուտքագրում | — |
| `select` | Բացվող ցուցակ | `values`. տարբերակների ցուցակ (`string[]`) |
| `switch` | Անջատիչ | — |

**Ընդհանուր հատկություններ՝**

| Հատկություն | Տիպ | Նկարագրություն |
|------|------|------|
| `title` | `string` | Ցուցադրվող վերնագիր |
| `required` | `boolean` | Արդյոք պարտադիր է |
| `default` | `unknown` | Լռելյայն արժեք |
| `secret` | `boolean` | Արդյոք այն զգայուն տեղեկատվություն է |

Օգտագործողը լրացնում է այս կոնֆիգ արժեքները Skill-ի կարգավորումներում՝ կառավարման էջում:

### Պրոմպտի մարմինը

Markdown մարմինը ներարկվում է որպես AI-ի համակարգային պրոմպտ: Գրելու խորհուրդներ՝

- Նկարագրեք Skill-ի տրամադրած գործիքները և դրանց նպատակը
- Բացատրեք յուրաքանչյուր գործիքի պարամետրերի իմաստը և դրանց օգտագործման կանոնները
- Տվեք բնորոշ օգտագործման սցենարներ և ուշադրության արժանի բաներ
- Եթե հղման նյութ կա, բացատրեք, թե ինչպես խորհրդակցել այն

## SkillScript գործիքի սկրիպտներ

SkillScript-ը գործիքի սկրիպտ է, որը AI-ն կարող է կանչել: Յուրաքանչյուր SkillScript ֆայլ գրանցվում է որպես մեկ LLM գործիք:

### Մետատվյալների ձևաչափ

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

### Մետատվյալների դաշտեր

| Պիտակ | Նկարագրություն | Օրինակ |
|------|------|------|
| `@name` | Գործիքի անուն (օգտագործվում է, երբ AI-ն կանչում է) | `get_weather` |
| `@description` | Գործիքի նկարագրություն (AI-ն սա օգտագործում է՝ որոշելու համար, թե երբ կանչել) | `Look up city weather` |
| `@param` | Պարամետրի սահմանում (կարող է հանդիպել մի քանի անգամ) | տես ստորև |
| `@grant` | Պահանջվող GM API թույլտվությունը | `CAT.agent.opfs` |
| `@require` | Արտաքին գրադարանի URL (բեռնվում և քեշավորվում է) | `https://cdn.example.com/lib.js` |
| `@timeout` | Կատարման թայմաութ վայրկյաններով | `60` (լռելյայն `300`) |

### `@param` շարահյուսություն

```
@param paramName type[enumValues] [required] description
```

**Տիպեր.** `string`, `number`, `boolean`

**Էնում արժեքներ (ըստ ցանկության).** փակագծերում, ստորակետերով առանձնացված

**Պարտադիր նշան.** `[required]` նկարագրությունից առաջ

```javascript
// Required string parameter
// @param city string [required] City name

// String parameter with an enum
// @param unit string [celsius,fahrenheit] Temperature unit

// Optional number parameter
// @param days number Number of forecast days

// Boolean parameter
// @param detailed boolean Whether to return detailed information
```

Պարամետրերի սահմանումները ավտոմատ կերպով վերածվում են JSON Schema-ի՝ LLM-ի կողմից գործիքը կանչելիս օգտագործելու համար:

### Սկրիպտ գրելը

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. Receive the parameters the AI passed in via arguments[0]
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG provides the Skill configuration the user filled in on the management page
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. Do the actual work
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. Return the result to the AI via `return`
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

### Կատարման միջավայր

| Հատկանիշ | Նկարագրություն |
|------|------|
| **Կատարման վայրը** | Սանդբոքսված, մեկուսացված միջավայր (առանց DOM մուտքի) |
| **Պարամետրերի ստացում** | `arguments[0]` — AI-ի փոխանցած պարամետրերի օբյեկտը |
| **Կոնֆիգի ստացում** | `CAT_CONFIG` — գլոբալ, միայն կարդալու օբյեկտ, որը պարունակում է օգտագործողի կոնֆիգուրացիան |
| **Վերադարձի արժեք** | `return` հայտարարությունը վերադարձնում է JSON-սերիալիզացվող արժեք |
| **Ասինխրոն աջակցություն** | `async/await`, `fetch` և `Promise` բոլորը աջակցվում են |
| **Արտաքին գրադարաններ** | Բեռնվում են `@require`-ի միջոցով, քեշավորվում տեղական |
| **Թայմաութ** | Լռելյայն 300 վայրկյան, կարգավորվում է `@timeout`-ի միջոցով |
| **GM API** | Օգտագործելի է `@grant`-ով հայտարարելուց հետո (օր.՝ `CAT.agent.opfs`) |

### `@require` արտաքին գրադարաններ

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// A library loaded via @require can be used directly
const result = _.groupBy(data, "category");
return result;
```

Արտաքին գրադարանները քեշավորվում են առաջին բեռնման ժամանակ, և հետագա կատարումները ուղղակիորեն օգտագործում են քեշավորված տարբերակը:

## Հղման նյութ

`references/` դիրեկտորիայի ֆայլերը ծառայում են որպես հղման նյութ, որը AI-ն կարող է խորհրդակցել: Երբ AI-ին անհրաժեշտ է, այն կարդում է դրանք ներկառուցված `read_reference` գործիքի միջոցով:

Հղման նյութի համար լավ համապատասխանող բովանդակություն՝
- API փաստաթղթեր
- Տվյալների ձևաչափի բնութագրեր
- Օգտագործման օրինակների հավաքածուներ
- Դոմենի գիտելիքի փաստաթղթեր

## Օրինակի պահեստ

Գոյություն ունի Skill օրինակների պաշտոնապես պահպանվող պահեստ, որը պարունակում է մի քանի պատրաստի օգտագործման Skills և սկրիպտ API օրինակներ՝

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill ցուցակ.**

| Դիրեկտորիա | Նկարագրություն | Տեղադրում |
|------|------|------|
| `browser-automation/` | Էջի վերլուծություն, DOM մանիպուլյացիա, ձևերի լրացում, սքրինշոթներ, նավիգացիա | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron պլանավորված առաջադրանքներ (ներքին + իրադարձությունների ռեժիմ) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Օգնում է ստեղծել, փորձարկել և փաթեթավորել նոր Skills | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Վերլուծում է ընդհանուր ֆայլերի ձևաչափերը (Excel, PDF, Word, CSV, PPT) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat/Tampermonkey սկրիպտի մշակման օգնական | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Synology Office աղյուսակների ընթերցում/գրառում | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | WeChat պաշտոնական հաշվի գործառնական օգնական — բովանդակության հավաքում, հոդված գրել և հրապարակում | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu (RED) գործառնական օգնական — նշումներ գրել, պատկերներ ստեղծել և հրապարակել | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Օրինակի կոդ.**

| Դիրեկտորիա | Նկարագրություն |
|------|------|
| `examples/conversation/` | Conversation API օրինակներ — չաթ, սթրիմինգ, գործիքի կանչեր |
| `examples/dom/` | DOM API օրինակներ — էջեր կարդալ, ձևեր լրացնել, ներդիրների կառավարում |
| `examples/config/` | Skill կոնֆիգ օրինակներ — կոնֆիգ դաշտեր հայտարարել և `CAT_CONFIG` օգտագործել |
| `examples/page_copilot.user.js` | Ամբողջական օգտագործողի սկրիպտ օրինակ — աջ սեղմման AI օգնական՝ սթրիմինգ UI-ով |

Լավ գաղափար է Skill մշակումը սովորել սկսել օրինակի պահեստի կոդից:

## Տեղադրման մեթոդներ

### Տեղադրում URL-ից

Բացեք `SKILL.cat.md` URL-ը ուղղակիորեն ձեր զննարկչում. ScriptCat-ը այն կընդհատի և կցուցադրի տեղադրման էջ:

Կարող եք նաև դա անել կառավարման էջից → Agent → Skill կառավարում.

1. Սեղմեք URL-տեղադրման կոճակը
2. Տեղադրեք `SKILL.cat.md` URL-ը
3. Հաստատեք տեղադրումը

ScriptCat-ը սկզբում ֆեչում է `SKILL.cat.md`-ը, ապա ֆեչում է մյուս ֆայլերը՝ դրանց հարաբերական ուղիներով՝ հիմնվելով դրա frontmatter-ում հայտարարված `scripts` և `references` վրա: Տեղադրելուց հետո `installUrl`-ը գրանցվում է, որպեսզի հետագայում թարմացումները ստուգվեն տարբերակի համարով:

### Տեղադրում սկրիպտից

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

## Ինչպե՞ս են բեռնվում Skills-ը

Skills-ը օգտագործում են եռաստիճան պրոգրեսիվ բեռնում՝ կոնտեքստի օգտագործումը օպտիմիզացնելու համար.

| Աստիճան | Երբ | Բովանդակություն |
|------|------|------|
| **Ամփոփում** | Զրույցի սկզբում | Skill անուն + նկարագրություն + գործիքների ցուցակ (ներարկվում է համակարգային պրոմպտում) |
| **Պրոմպտ** | Երբ AI-ն ակտիվորեն կանչում է `load_skill` | `SKILL.cat.md`-ի ամբողջական մարմինը |
| **Գործիքներ** | `load_skill`-ից հետո | SkillScript-ները գրանցվում են որպես կանչվող LLM գործիքներ |

AI-ն ավտոմատ կերպով կանչում է `load_skill`, երբ անհրաժեշտ է բեռնել Skill-ի ամբողջական բովանդակությունը և գործիքները:

## Ամբողջական օրինակ

### Դիրեկտորիայի կառուցվածքը

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
