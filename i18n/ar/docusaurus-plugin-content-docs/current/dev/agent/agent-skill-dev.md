---
title: دليل تطوير Skills
---

Skill هو حزمة توسعة لنظام Agent، مكونة من **مطالبة + سكرپتات أدوات + مواد مرجعية**. تتيح لك Skills حقن معرفة متخصصة وقدرات أدوات مخصصة في الذكاء الاصطناعي.

## هيكل دليل Skill

```
my-skill/
├── SKILL.cat.md          # إلزامي: البيانات الوصفية + المطالبة (ملف الدخول)
├── scripts/              # اختياري: سكرپتات أدوات SkillScript
│   ├── search.js
│   └── export.js
└── references/           # اختياري: ملفات المواد المرجعية
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` هو ملف دخول Skill. عند التثبيت من رابط، يجلب ScriptCat هذا الملف أولاً، ثم يجلب الملفات الأخرى بمساراتها النسبية بناءً على `scripts` و `references` المُصرح عنهما في frontmatter.

## صيغة SKILL.cat.md

يستخدم `SKILL.cat.md` frontmatter بصيغة YAML لتصريح البيانات الوصفية، مع كون نص Markdown بمثابة المطالبة المعطاة للذكاء الاصطناعي.

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

### حقول البيانات الوصفية

| الحقل | النوع | إلزامي | الوصف |
|------|------|------|------|
| `name` | `string` | نعم | معرف Skill فريد (الإنجليزية بنمط kebab-case موصى بها) |
| `description` | `string` | نعم | وصف قصير (يظهر في القائمة) |
| `version` | `string` | لا | الإصدار (صيغة semver، مثل `1.0.0`)، يستخدم لفحوصات التحديث |
| `scripts` | `string[]` | لا | قائمة أسماء ملفات السكرپتات (مثل `["search.js"]`)؛ تُجلب تلقائياً من دليل `scripts/` عند التثبيت عبر رابط |
| `references` | `string[]` | لا | قائمة أسماء ملفات المواد المرجعية (مثل `["api-docs.md"]`)؛ تُجلب تلقائياً من دليل `references/` عند التثبيت عبر رابط |
| `config` | `object` | لا | تعريفات حقول التكوين |

### أنواع حقول التكوين

| النوع | الوصف | الخصائص الخاصة بالنوع |
|------|------|---------|
| `text` | إدخال نص | `secret`: يحدد ما إذا كان مخفياً في الواجهة |
| `number` | إدخال رقم | — |
| `select` | قائمة منسدلة | `values`: قائمة الخيارات (`string[]`) |
| `switch` | مفتاح تبديل | — |

**الخصائص المشتركة:**

| الخاصية | النوع | الوصف |
|------|------|------|
| `title` | `string` | عنوان العرض |
| `required` | `boolean` | يحدد ما إذا كان إلزامياً |
| `default` | `unknown` | القيمة الافتراضية |
| `secret` | `boolean` | يحدد ما إذا كانت معلومات حساسة |

يملأ المستخدم قيم التكوين هذه في إعدادات Skill على صفحة الإدارة.

### نص المطالبة

يُحقن نص Markdown كمطالبة نظام الذكاء الاصطناعي. نصائح الكتابة:

- صف الأدوات التي يوفرها Skill والغرض منها
- اشرح معنى معلمات كل أداة وقواعد استخدامها
- أعط سيناريوهات الاستخدام النموذجية ونقاط الانتباه
- إذا كانت هناك مواد مرجعية، اشرح كيفية الرجوع إليها

## سكرپتات أدوات SkillScript

SkillScript هو سكرپت أداة يمكن للذكاء الاصطناعي استدعاءه. يُسجل كل ملف SkillScript كأداة LLM واحدة.

### صيغة البيانات الوصفية

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

### حقول البيانات الوصفية

| الوسم | الوصف | مثال |
|------|------|------|
| `@name` | اسم الأداة (يستخدم عندما يستدعيها الذكاء الاصطناعي) | `get_weather` |
| `@description` | وصف الأداة (يستخدمه الذكاء الاصطناعي لتحديد متى يستدعيها) | `Look up city weather` |
| `@param` | تعريف المعامل (يمكن أن يظهر عدة مرات) | انظر أدناه |
| `@grant` | إذن واجهة GM API الذي يحتاجه | `CAT.agent.opfs` |
| `@require` | رابط مكتبة خارجية (تُحمّل وتُخزن مؤقتاً) | `https://cdn.example.com/lib.js` |
| `@timeout` | مهلة التنفيذ بالثواني | `60` (الافتراضي `300`) |

### صيغة `@param`

```
@param paramName type[enumValues] [required] description
```

**الأنواع:** `string`, `number`, `boolean`

**قيم التعداد (اختيارية):** بين قوسين مربعين، مفصولة بفواصل

**علامة الإلزام:** `[required]` قبل الوصف

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

تُحول تعريفات المعاملات تلقائياً إلى JSON Schema ليستخدمها LLM عند استدعاء الأداة.

### كتابة السكرپت

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

### بيئة التنفيذ

| الميزة | الوصف |
|------|------|
| **موقع التنفيذ** | بيئة معزولة (بدون وصول إلى الـ DOM) |
| **الحصول على المعاملات** | `arguments[0]` — كائن المعاملات الذي مرره الذكاء الاصطناعي |
| **الحصول على التكوين** | `CAT_CONFIG` — كائن عام للقراءة فقط يحتوي تكوين المستخدم |
| **قيمة الإرجاع** | تعيد عبارة `return` قيمة قابلة للتسلسل JSON |
| **دعم async** | `async/await` و `fetch` و `Promise` مدعومة جميعاً |
| **المكتبات الخارجية** | تُحمّل عبر `@require`، وتُخزن مؤقتاً محلياً |
| **المهلة** | 300 ثانية افتراضياً، قابلة للتخصيص عبر `@timeout` |
| **واجهة GM API** | قابلة للاستخدام بمجرد التصريح عنها عبر `@grant` (مثل `CAT.agent.opfs`) |

### المكتبات الخارجية `@require`

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

تُخزن المكتبات الخارجية مؤقتاً عند التحميل الأول، وتستخدم عمليات التنفيذ اللاحقة النسخة المخزنة مباشرة.

## المواد المرجعية

تعمل الملفات الموجودة في دليل `references/` كمواد مرجعية يمكن للذكاء الاصطناعي الرجوع إليها. عندما يحتاجها الذكاء الاصطناعي، يقرأها عبر الأداة المدمجة `read_reference`.

محتوى مناسب للمواد المرجعية:
- وثائق واجهات البرمجة
- مواصفات صيغ البيانات
- مجموعات أمثلة الاستخدام
- وثائق المعرفة المتخصصة

## مستودع الأمثلة

يوجد مستودع أمثلة Skills تتم صيانته رسمياً، يحتوي على عدة Skills جاهزة للاستخدام وأمثلة لواجهات برمجة السكرپتات:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**قائمة Skills:**

| الدليل | الوصف | التثبيت |
|------|------|------|
| `browser-automation/` | تحليل الصفحات، معالجة الـ DOM، تعبئة النماذج، لقطات الشاشة، التنقل | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | مهام Cron المجدولة (وضع داخلي + حدث) | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | يساعد في إنشاء واختبار وتعبئة Skills جديدة | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | يحلل صيغ الملفات الشائعة (Excel, PDF, Word, CSV, PPT) | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | مساعد تطوير سكرپتات ScriptCat/Tampermonkey | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | قراءة/كتابة جداول بيانات Synology Office | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | مساعد عمليات الحساب الرسمي WeChat — جمع المحتوى وكتابة المقالات والنشر | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | مساعد عمليات Xiaohongshu (RED) — كتابة الملاحظات وتوليد الصور والنشر | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**أمثلة الأكواد:**

| الدليل | الوصف |
|------|------|
| `examples/conversation/` | أمثلة واجهة برمجة الحوار — chat, streaming, استدعاءات الأدوات |
| `examples/dom/` | أمثلة واجهة برمجة DOM — قراءة الصفحات، تعبئة النماذج، إدارة التبويبات |
| `examples/config/` | أمثلة تكوين Skill — تصريح حقول التكوين واستخدام `CAT_CONFIG` |
| `examples/page_copilot.user.js` | مثال كامل لسكرپت مستخدم — مساعد ذكاء اصطناعي بزر الفأرة الأيمن مع واجهة متدفقة |

فكرة جيدة أن تبدأ تعلم تطوير Skills من الكود في مستودع الأمثلة.

## طرق التثبيت

### التثبيت من رابط

افتح رابط `SKILL.cat.md` مباشرة في المتصفح؛ سيعترضه ScriptCat ويعرض صفحة تثبيت.

يمكنك أيضاً القيام بذلك من صفحة الإدارة ← Agent ← إدارة Skills:

1. انقر على زر التثبيت عبر الرابط
2. الصق رابط `SKILL.cat.md`
3. أكد التثبيت

يجلب ScriptCat `SKILL.cat.md` أولاً، ثم يجلب الملفات الأخرى بمساراتها النسبية بناءً على `scripts` و `references` المُصرح عنهما في frontmatter. بعد التثبيت، يُسجل `installUrl`، بحيث يمكن لاحقاً التحقق من التحديثات حسب رقم الإصدار.

### التثبيت من سكرپت

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

## كيف يتم تحميل Skills

تستخدم Skills تحميلاً تدريجياً ثلاثي المستويات لتحسين استخدام السياق:

| المستوى | متى | المحتوى |
|------|------|------|
| **الملخص** | في بداية حوار | اسم Skill + الوصف + قائمة الأدوات (محقونة في المطالبة النظامية) |
| **المطالبة** | عندما يستدعي الذكاء الاصطناعي `load_skill` بنشاط | النص الكامل لملف `SKILL.cat.md` |
| **الأدوات** | بعد `load_skill` | تُسجل SkillScripts كأدوات LLM قابلة للاستدعاء |

يستدعي الذكاء الاصطناعي `load_skill` تلقائياً عندما يحتاج إلى تحميل المحتوى الكامل والأدوات الخاصة بـ Skill.

## مثال كامل

### هيكل الدليل

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
