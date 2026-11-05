---
title: Skill ডেভেলপমেন্ট গাইড
---

একটি Skill হলো Agent সিস্টেমের জন্য একটি এক্সটেনশন প্যাকেজ, যা একটি **প্রম্পট + টুল স্ক্রিপ্ট + রেফারেন্স উপকরণ** নিয়ে গঠিত। Skill-এর মাধ্যমে আপনি AI-তে ডোমেইন-নির্দিষ্ট জ্ঞান এবং কাস্টম টুল ক্ষমতা ইনজেক্ট করতে পারেন।

## Skill ডিরেক্টরি স্ট্রাকচার

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

> `SKILL.cat.md` হলো Skill-এর এন্ট্রি ফাইল। URL থেকে ইনস্টল করার সময়, ScriptCat প্রথমে এই ফাইলটি ফেচ করে, তারপর এর frontmatter-এ ঘোষিত `scripts` এবং `references` অনুযায়ী আপেক্ষিক পথ দিয়ে বাকি ফাইলগুলো ফেচ করে।

## SKILL.cat.md ফরম্যাট

`SKILL.cat.md` মেটাডেটা ঘোষণা করতে YAML frontmatter ব্যবহার করে, এবং Markdown বডি AI-কে দেওয়া প্রম্পট হিসেবে কাজ করে।

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

### মেটাডেটা ফিল্ড

| ফিল্ড | টাইপ | আবশ্যক | বিবরণ |
|------|------|------|------|
| `name` | `string` | হ্যাঁ | অনন্য Skill শনাক্তকারী (kebab-case ইংরেজি সুপারিশকৃত) |
| `description` | `string` | হ্যাঁ | সংক্ষিপ্ত বিবরণ (তালিকায় দেখানো হয়) |
| `version` | `string` | না | সংস্করণ (semver ফরম্যাট, যেমন `1.0.0`), আপডেট চেকের জন্য ব্যবহৃত |
| `scripts` | `string[]` | না | স্ক্রিপ্ট ফাইলের নামের তালিকা (যেমন `["search.js"]`); URL দিয়ে ইনস্টল করার সময় `scripts/` ডিরেক্টরি থেকে স্বয়ংক্রিয়ভাবে ফেচ হয় |
| `references` | `string[]` | না | রেফারেন্স-উপকরণ ফাইলের নামের তালিকা (যেমন `["api-docs.md"]`); URL দিয়ে ইনস্টল করার সময় `references/` ডিরেক্টরি থেকে স্বয়ংক্রিয়ভাবে ফেচ হয় |
| `config` | `object` | না | কনফিগারেশন ফিল্ডের সংজ্ঞা |

### কনফিগারেশন ফিল্ড টাইপ

| type | বিবরণ | টাইপ-নির্দিষ্ট প্রপার্টি |
|------|------|---------|
| `text` | টেক্সট ইনপুট | `secret`: UI-তে এটি মাস্ক করা আছে কিনা |
| `number` | সংখ্যা ইনপুট | — |
| `select` | ড্রপডাউন | `values`: বিকল্প তালিকা (`string[]`) |
| `switch` | টগল | — |

**সাধারণ প্রপার্টি:**

| প্রপার্টি | টাইপ | বিবরণ |
|------|------|------|
| `title` | `string` | ডিসপ্লে শিরোনাম |
| `required` | `boolean` | এটি আবশ্যক কিনা |
| `default` | `unknown` | ডিফল্ট মান |
| `secret` | `boolean` | এটি সংবেদনশীল তথ্য কিনা |

ব্যবহারকারী ম্যানেজমেন্ট পেজে Skill-এর সেটিংসে এই কনফিগ মানগুলো পূরণ করে।

### প্রম্পট বডি

Markdown বডি AI-এর সিস্টেম প্রম্পট হিসেবে ইনজেক্ট হয়। লেখার টিপস:

- Skill যে টুলগুলো প্রদান করে এবং সেগুলো কী কাজে লাগে তা বর্ণনা করুন
- প্রতিটি টুলের প্যারামিটারগুলোর অর্থ এবং ব্যবহারের নিয়ম ব্যাখ্যা করুন
- সাধারণ ব্যবহারের পরিস্থিতি এবং যে বিষয়গুলো খেয়াল রাখতে হবে তা দিন
- রেফারেন্স উপকরণ থাকলে, কীভাবে সেটি পরামর্শ করতে হবে তা ব্যাখ্যা করুন

## SkillScript টুল স্ক্রিপ্ট

একটি SkillScript হলো একটি টুল স্ক্রিপ্ট যা AI কল করতে পারে। প্রতিটি SkillScript ফাইল একটি LLM টুল হিসেবে নিবন্ধিত হয়।

### মেটাডেটা ফরম্যাট

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

### মেটাডেটা ফিল্ড

| ট্যাগ | বিবরণ | উদাহরণ |
|------|------|------|
| `@name` | টুলের নাম (AI যখন কল করে তখন ব্যবহৃত হয়) | `get_weather` |
| `@description` | টুলের বিবরণ (AI এটি কখন কল করবে তা ঠিক করতে ব্যবহার করে) | `Look up city weather` |
| `@param` | প্যারামিটার সংজ্ঞা (একাধিকবার থাকতে পারে) | নিচে দেখুন |
| `@grant` | প্রয়োজনীয় GM API অনুমতি | `CAT.agent.opfs` |
| `@require` | বাহ্যিক লাইব্রেরি URL (লোড ও ক্যাশ করা হয়) | `https://cdn.example.com/lib.js` |
| `@timeout` | সেকেন্ডে এক্সিকিউশন টাইমআউট | `60` (ডিফল্ট `300`) |

### `@param` সিনট্যাক্স

```
@param paramName type[enumValues] [required] description
```

**টাইপ:** `string`, `number`, `boolean`

**এনাম ভ্যালু (ঐচ্ছিক):** বর্গ brackets-এ আবদ্ধ, কমা দিয়ে আলাদা

**আবশ্যক মার্কার:** বিবরণের আগে `[required]`

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

প্যারামিটার সংজ্ঞাগুলো টুল কলের সময় LLM ব্যবহারের জন্য স্বয়ংক্রিয়ভাবে JSON Schema-তে রূপান্তরিত হয়।

### স্ক্রিপ্ট লেখা

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

### এক্সিকিউশন পরিবেশ

| বৈশিষ্ট্য | বিবরণ |
|------|------|
| **এক্সিকিউশন অবস্থান** | একটি স্যান্ডবক্সড, বিচ্ছিন্ন পরিবেশ (DOM অ্যাক্সেস নেই) |
| **প্যারামিটার পাওয়া** | `arguments[0]` — AI যে প্যারামিটার অবজেক্ট পাঠিয়েছে |
| **কনফিগ পাওয়া** | `CAT_CONFIG` — একটি গ্লোবাল, শুধু-পঠন অবজেক্ট যা ব্যবহারকারীর কনফিগারেশন ধারণ করে |
| **রিটার্ন ভ্যালু** | `return` স্টেটমেন্ট একটি JSON-সিরিয়ালাইজেবল ভ্যালু ফেরত দেয় |
| **অ্যাসিঙ্ক সাপোর্ট** | `async/await`, `fetch`, এবং `Promise` সব সমর্থিত |
| **বাহ্যিক লাইব্রেরি** | `@require` দিয়ে লোড হয়, স্থানীয়ভাবে ক্যাশ হয় |
| **টাইমআউট** | ডিফল্ট ৩০০ সেকেন্ড, `@timeout` দিয়ে কাস্টমাইজযোগ্য |
| **GM API** | `@grant` দিয়ে ঘোষণা করলে ব্যবহারযোগ্য (যেমন `CAT.agent.opfs`) |

### `@require` বাহ্যিক লাইব্রেরি

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

বাহ্যিক লাইব্রেরিগুলো প্রথম লোডের সময় ক্যাশ হয়, এবং পরবর্তী এক্সিকিউশনগুলো সরাসরি ক্যাশ করা সংস্করণ ব্যবহার করে।

## রেফারেন্স উপকরণ

`references/` ডিরেক্টরির ফাইলগুলো AI পরামর্শ করতে পারে এমন রেফারেন্স উপকরণ হিসেবে কাজ করে। AI যখন প্রয়োজন হয়, তখন বিল্ট-ইন `read_reference` টুলের মাধ্যমে সেগুলো পড়ে।

রেফারেন্স উপকরণের জন্য উপযুক্ত কনটেন্ট:
- API ডকুমেন্টেশন
- ডেটা ফরম্যাট স্পেসিফিকেশন
- ব্যবহারের উদাহরণের সংগ্রহ
- ডোমেইন জ্ঞানের নথি

## উদাহরণ রিপোজিটরি

Skill উদাহরণের একটি আনুষ্ঠানিকভাবে রক্ষণাবেক্ষণ করা রিপোজিটরি আছে, যেখানে বেশ কয়েকটি রেডি-টু-ব্যবহার Skill এবং স্ক্রিপ্ট API উদাহরণ রয়েছে:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill তালিকা:**

| ডিরেক্টরি | বিবরণ | ইনস্টল |
|------|------|------|
| `browser-automation/` | পেজ বিশ্লেষণ, DOM ম্যানিপুলেশন, ফর্ম পূরণ, স্ক্রিনশট, নেভিগেশন | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | ক্রন নির্ধারিত কাজ (ইন্টারনাল + ইভেন্ট মোড) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | নতুন Skill তৈরি, পরীক্ষা এবং প্যাকেজ করতে সাহায্য করে | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | সাধারণ ফাইল ফরম্যাট পার্স করে (Excel, PDF, Word, CSV, PPT) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat/Tampermonkey স্ক্রিপ্ট ডেভেলপমেন্ট সহকারী | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Synology Office স্প্রেডশিট পড়া/লেখা | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | WeChat অফিসিয়াল অ্যাকাউন্ট অপারেশন সহকারী — কনটেন্ট সংগ্রহ, নিবন্ধ লেখা এবং প্রকাশনা | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu (RED) অপারেশন সহকারী — নোট লেখা, ইমেজ জেনারেশন এবং প্রকাশনা | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**উদাহরণ কোড:**

| ডিরেক্টরি | বিবরণ |
|------|------|
| `examples/conversation/` | Conversation API উদাহরণ — চ্যাট, স্ট্রিমিং, টুল কল |
| `examples/dom/` | DOM API উদাহরণ — পেজ পড়া, ফর্ম পূরণ, ট্যাব ম্যানেজমেন্ট |
| `examples/config/` | Skill কনফিগ উদাহরণ — কনফিগ ফিল্ড ঘোষণা এবং `CAT_CONFIG` ব্যবহার |
| `examples/page_copilot.user.js` | একটি সম্পূর্ণ ব্যবহারকারী স্ক্রিপ্ট উদাহরণ — স্ট্রিমিং UI সহ রাইট-ক্লিক AI সহকারী |

উদাহরণ রিপোজিটরির কোড থেকে Skill ডেভেলপমেন্ট শেখা শুরু করা একটি ভালো ধারণা।

## ইনস্টলেশন পদ্ধতি

### URL থেকে ইনস্টল

ব্রাউজারে সরাসরি একটি `SKILL.cat.md` URL খুলুন; ScriptCat এটি আটকাবে এবং একটি ইনস্টল পেজ পপ আপ করবে।

আপনি ম্যানেজমেন্ট পেজ → Agent → Skill ম্যানেজমেন্ট থেকেও এটি করতে পারেন:

1. URL-ইনস্টল বাটনে ক্লিক করুন
2. `SKILL.cat.md` URL পেস্ট করুন
3. ইনস্টল নিশ্চিত করুন

ScriptCat প্রথমে `SKILL.cat.md` ফেচ করে, তারপর এর frontmatter-এ ঘোষিত `scripts` এবং `references` অনুযায়ী আপেক্ষিক পথ দিয়ে বাকি ফাইলগুলো ফেচ করে। ইনস্টল করার পরে, `installUrl` রেকর্ড করা হয়, তাই পরবর্তীতে সংস্করণ নম্বর দিয়ে আপডেট চেক করা যায়।

### একটি স্ক্রিপ্ট থেকে ইনস্টল

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

## Skill কীভাবে লোড হয়

Skill কনটেক্সট ব্যবহার অপ্টিমাইজ করতে তিন-স্তরের প্রগতিশীল লোডিং ব্যবহার করে:

| স্তর | কখন | কনটেন্ট |
|------|------|------|
| **সারাংশ** | কথোপকথনের শুরুতে | Skill নাম + বিবরণ + টুল তালিকা (সিস্টেম প্রম্পটে ইনজেক্ট হয়) |
| **প্রম্পট** | AI সক্রিয়ভাবে `load_skill` কল করলে | `SKILL.cat.md`-এর সম্পূর্ণ বডি |
| **টুল** | `load_skill`-এর পরে | SkillScript-গুলো কলযোগ্য LLM টুল হিসেবে নিবন্ধিত হয় |

AI যখন একটি Skill-এর সম্পূর্ণ কনটেন্ট এবং টুল লোড করার প্রয়োজন হয় তখন স্বয়ংক্রিয়ভাবে `load_skill` কল করে।

## সম্পূর্ণ উদাহরণ

### ডিরেক্টরি স্ট্রাকচার

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
