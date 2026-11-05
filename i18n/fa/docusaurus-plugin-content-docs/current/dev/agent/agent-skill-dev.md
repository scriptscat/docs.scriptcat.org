---
title: راهنمای توسعه Skill
---

یک Skill یک بسته توسعه برای سیستم Agent است که از یک **prompt + اسکریپت‌های ابزار + مواد مرجع** تشکیل شده است. با Skillها می‌توانید دانش حوزه‌ای و قابلیت‌های ابزار سفارشی را در هوش مصنوعی تزریق کنید.

## ساختار دایرکتوری Skill

```
my-skill/
├── SKILL.cat.md          # الزامی: فراداده + prompt (فایل ورودی)
├── scripts/              # اختیاری: اسکریپت‌های ابزار SkillScript
│   ├── search.js
│   └── export.js
└── references/           # اختیاری: فایل‌های مواد مرجع
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` فایل ورودی Skill است. هنگام نصب از یک URL، ScriptCat ابتدا این فایل را دریافت می‌کند، سپس سایر فایل‌ها را از طریق مسیرهای نسبی آن‌ها بر اساس `scripts` و `references` اعلام‌شده در frontmatter دریافت می‌کند.

## قالب SKILL.cat.md

`SKILL.cat.md` از YAML frontmatter برای اعلام فراداده استفاده می‌کند و بدنه Markdown به عنوان prompt داده‌شده به هوش مصنوعی عمل می‌کند.

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

### فیلدهای فراداده

| فیلد | نوع | الزامی | توضیحات |
|------|------|------|------|
| `name` | `string` | بله | شناسه منحصربه‌فرد Skill (انگلیسی kebab-case توصیه می‌شود) |
| `description` | `string` | بله | توضیحات کوتاه (در فهرست نشان داده می‌شود) |
| `version` | `string` | خیر | نسخه (قالب semver، مثلاً `1.0.0`)، برای بررسی به‌روزرسانی استفاده می‌شود |
| `scripts` | `string[]` | خیر | فهرست نام فایل‌های اسکریپت (مثلاً `["search.js"]`)؛ هنگام نصب از طریق URL به طور خودکار از دایرکتوری `scripts/` دریافت می‌شود |
| `references` | `string[]` | خیر | فهرست نام فایل‌های مواد مرجع (مثلاً `["api-docs.md"]`)؛ هنگام نصب از طریق URL به طور خودکار از دایرکتوری `references/` دریافت می‌شود |
| `config` | `object` | خیر | تعاریف فیلد پیکربندی |

### انواع فیلد پیکربندی

| نوع | توضیحات | ویژگی‌های خاص نوع |
|------|------|---------|
| `text` | ورودی متن | `secret`: آیا در رابط کاربری ماسک می‌شود |
| `number` | ورودی عدد | — |
| `select` | منوی کشویی | `values`: فهرست گزینه‌ها (`string[]`) |
| `switch` | کلید روشن/خاموش | — |

**ویژگی‌های مشترک:**

| ویژگی | نوع | توضیحات |
|------|------|------|
| `title` | `string` | عنوان نمایشی |
| `required` | `boolean` | آیا الزامی است |
| `default` | `unknown` | مقدار پیش‌فرض |
| `secret` | `boolean` | آیا اطلاعات حساس است |

کاربر این مقادیر پیکربندی را در تنظیمات Skill در صفحه مدیریت پر می‌کند.

### بدنه prompt

بدنه Markdown به عنوان prompt سیستم هوش مصنوعی تزریق می‌شود. نکات نوشتن:

- ابزارهایی که Skill ارائه می‌دهد و کاربرد آن‌ها را توصیف کنید
- توضیح دهید هر پارامتر ابزار چه معنایی دارد و قوانین استفاده از آن‌ها چیست
- سناریوهای استفاده معمولی و موارد قابل توجه را ارائه دهید
- اگر مواد مرجع وجود دارد، توضیح دهید چگونه با آن مشورت کنید

## اسکریپت‌های ابزار SkillScript

یک SkillScript یک اسکریپت ابزار است که هوش مصنوعی می‌تواند فراخوانی کند. هر فایل SkillScript به عنوان یک ابزار LLM ثبت می‌شود.

### قالب فراداده

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

### فیلدهای فراداده

| تگ | توضیحات | مثال |
|------|------|------|
| `@name` | نام ابزار (زمانی که هوش مصنوعی آن را فراخوانی می‌کند استفاده می‌شود) | `get_weather` |
| `@description` | توضیحات ابزار (هوش مصنوعی از این برای تصمیم‌گیری زمان فراخوانی استفاده می‌کند) | `آب‌وهوای شهر را جستجو کنید` |
| `@param` | تعریف پارامتر (می‌تواند چند بار ظاهر شود) | به زیر مراجعه کنید |
| `@grant` | مجوز API GM که نیاز دارد | `CAT.agent.opfs` |
| `@require` | URL کتابخانه خارجی (بارگذاری و کش می‌شود) | `https://cdn.example.com/lib.js` |
| `@timeout` | مهلت اجرا در ثانیه | `60` (پیش‌فرض `300`) |

### نحو `@param`

```
@param paramName type[enumValues] [required] description
```

**انواع:** `string`، `number`، `boolean`

**مقادیر enum (اختیاری):** داخل براکت مربع، با کاما جدا می‌شوند

**علامت الزامی:** `[required]` قبل از توضیحات

```javascript
// پارامتر رشته الزامی
// @param city string [required] City name

// پارامتر رشته با enum
// @param unit string [celsius,fahrenheit] Temperature unit

// پارامتر عدد اختیاری
// @param days number Number of forecast days

// پارامتر بولی
// @param detailed boolean Whether to return detailed information
```

تعاریف پارامتر به طور خودکار به JSON Schema برای استفاده LLM هنگام فراخوانی ابزار تبدیل می‌شوند.

### نوشتن اسکریپت

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. پارامترهایی را که هوش مصنوعی از طریق arguments[0] داده است دریافت کنید
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG پیکربندی Skill را که کاربر در صفحه مدیریت پر کرده است فراهم می‌کند
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. کار واقعی را انجام دهید
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. نتیجه را از طریق `return` به هوش مصنوعی برگردانید
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

### محیط اجرا

| ویژگی | توضیحات |
|------|------|
| **مکان اجرا** | یک محیط sandbox ایزوله (بدون دسترسی DOM) |
| **دریافت پارامترها** | `arguments[0]` — شیء پارامتری که هوش مصنوعی داده است |
| **دریافت پیکربندی** | `CAT_CONFIG` — یک شیء سراسری فقط‌خواندنی حاوی پیکربندی کاربر |
| **مقدار بازگشتی** | عبارت `return` یک مقدار قابل سریال‌سازی JSON برمی‌گرداند |
| **پشتیبانی async** | `async/await`، `fetch` و `Promise` همگی پشتیبانی می‌شوند |
| **کتابخانه‌های خارجی** | از طریق `@require` بارگذاری می‌شوند، به صورت محلی کش می‌شوند |
| **مهلت زمانی** | پیش‌فرض ۳۰۰ ثانیه، قابل تنظیم از طریق `@timeout` |
| **API GM** | پس از اعلام از طریق `@grant` قابل استفاده است (مثلاً `CAT.agent.opfs`) |

### کتابخانه‌های خارجی `@require`

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// یک کتابخانه بارگذاری‌شده از طریق @require می‌تواند مستقیماً استفاده شود
const result = _.groupBy(data, "category");
return result;
```

کتابخانه‌های خارجی اولین بار که بارگذاری می‌شوند کش می‌شوند و اجراهای بعدی مستقیماً از نسخه کش‌شده استفاده می‌کنند.

## مواد مرجع

فایل‌های موجود در دایرکتوری `references/` به عنوان مواد مرجعی عمل می‌کنند که هوش مصنوعی می‌تواند با آن مشورت کند. وقتی هوش مصنوعی به آن‌ها نیاز دارد، از طریق ابزار داخلی `read_reference` آن‌ها را می‌خواند.

محتوایی که برای مواد مرجع مناسب است:
- مستندات API
- مشخصات قالب داده
- مجموعه‌های مثال استفاده
- اسناد دانش حوزه‌ای

## مخزن مثال

یک مخزن نگهداری‌شده رسمی از مثال‌های Skill وجود دارد که شامل چند Skill آماده و مثال‌های API اسکریپت است:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**فهرست Skill:**

| دایرکتوری | توضیحات | نصب |
|------|------|------|
| `browser-automation/` | تحلیل صفحه، دستکاری DOM، پر کردن فرم، اسکرین‌شات، ناوبری | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | کارهای زمان‌بندی‌شده cron (حالت داخلی + رویداد) | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | کمک به ایجاد، تست و بسته‌بندی Skillهای جدید | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | قالب‌های فایل رایج را تجزیه می‌کند (Excel، PDF، Word، CSV، PPT) | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | دستیار توسعه اسکریپت ScriptCat/Tampermonkey | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | خواندن/نوشتن صفحات گسترده Synology Office | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | دستیار عملیات حساب رسمی WeChat — جمع‌آوری محتوا، نوشتن مقاله و انتشار | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | دستیار عملیات Xiaohongshu (RED) — نوشتن یادداشت، تولید تصویر و انتشار | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**کد مثال:**

| دایرکتوری | توضیحات |
|------|------|
| `examples/conversation/` | مثال‌های API گفتگو — چت، جریان، فراخوانی ابزار |
| `examples/dom/` | مثال‌های API DOM — خواندن صفحات، پر کردن فرم، مدیریت تب |
| `examples/config/` | مثال‌های پیکربندی Skill — اعلام فیلدهای پیکربندی و استفاده از `CAT_CONFIG` |
| `examples/page_copilot.user.js` | یک مثال کامل اسکریپت کاربری — دستیار هوش مصنوعی با کلیک راست با رابط جریانی |

ایده خوبی است که یادگیری توسعه Skill را از کد مخزن مثال شروع کنید.

## روش‌های نصب

### نصب از یک URL

یک URL `SKILL.cat.md` را مستقیماً در مرورگر خود باز کنید؛ ScriptCat آن را رهگیری می‌کند و یک صفحه نصب نشان می‌دهد.

همچنین می‌توانید این کار را از صفحه مدیریت → Agent → مدیریت Skill انجام دهید:

1. روی دکمه نصب URL کلیک کنید
2. URL `SKILL.cat.md` را جای‌گذاری کنید
3. نصب را تأیید کنید

ScriptCat ابتدا `SKILL.cat.md` را دریافت می‌کند، سپس سایر فایل‌ها را از طریق مسیرهای نسبی آن‌ها بر اساس `scripts` و `references` اعلام‌شده در frontmatter دریافت می‌کند. پس از نصب، `installUrl` ثبت می‌شود، بنابراین به‌روزرسانی‌ها را می‌توان بعداً با شماره نسخه بررسی کرد.

### نصب از یک اسکریپت

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

## نحوه بارگذاری Skillها

Skillها از بارگذاری تدریجی سه‌لایه برای بهینه‌سازی استفاده از زمینه استفاده می‌کنند:

| لایه | زمان | محتوا |
|------|------|------|
| **خلاصه** | در شروع یک گفتگو | نام Skill + توضیحات + فهرست ابزار (در prompt سیستم تزریق می‌شود) |
| **Prompt** | وقتی هوش مصنوعی به طور فعال `load_skill` را فراخوانی می‌کند | بدنه کامل `SKILL.cat.md` |
| **ابزارها** | پس از `load_skill` | SkillScriptها به عنوان ابزارهای LLM قابل فراخوانی ثبت می‌شوند |

هوش مصنوعی به طور خودکار `load_skill` را فراخوانی می‌کند وقتی نیاز به بارگذاری محتوای کامل و ابزارهای یک Skill دارد.

## مثال کامل

### ساختار دایرکتوری

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
