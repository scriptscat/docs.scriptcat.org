---
title: Посібник з розробки Skill
---

Skill — це пакет розширення для системи Agent, що складається з **підказки + скриптів інструментів + довідкових матеріалів**. Skill дозволяють впроваджувати доменні знання та власні можливості інструментів у AI.

## Структура каталогу Skill

```
my-skill/
├── SKILL.cat.md          # Обов'язково: метадані + підказка (вхідний файл)
├── scripts/              # За бажанням: скрипти інструментів SkillScript
│   ├── search.js
│   └── export.js
└── references/           # За бажанням: файли довідкових матеріалів
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` — це вхідний файл Skill. Під час встановлення з URL ScriptCat спочатку отримує цей файл, потім отримує інші файли за їхніми відносними шляхами на основі `scripts` і `references`, оголошених у frontmatter.

## Формат SKILL.cat.md

`SKILL.cat.md` використовує YAML frontmatter для оголошення метаданих, а тіло Markdown слугує підказкою, що надається AI.

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

### Поля метаданих

| Поле | Тип | Обов'язковий | Опис |
|------|------|------|------|
| `name` | `string` | Так | Унікальний ідентифікатор Skill (рекомендується англійська в kebab-case) |
| `description` | `string` | Так | Короткий опис (показується в списку) |
| `version` | `string` | Ні | Версія (формат semver, напр. `1.0.0`), використовується для перевірки оновлень |
| `scripts` | `string[]` | Ні | Список назв скриптів (напр. `["search.js"]`); автоматично отримується з каталогу `scripts/` під час встановлення за URL |
| `references` | `string[]` | Ні | Список назв довідкових матеріалів (напр. `["api-docs.md"]`); автоматично отримується з каталогу `references/` під час встановлення за URL |
| `config` | `object` | Ні | Визначення полів конфігурації |

### Типи полів конфігурації

| type | Опис | Властивості, специфічні для типу |
|------|------|---------|
| `text` | Текстове введення | `secret`: чи маскується в інтерфейсі |
| `number` | Числове введення | — |
| `select` | Випадаючий список | `values`: список опцій (`string[]`) |
| `switch` | Перемикач | — |

**Загальні властивості:**

| Властивість | Тип | Опис |
|------|------|------|
| `title` | `string` | Відображувана назва |
| `required` | `boolean` | Чи обов'язкове |
| `default` | `unknown` | Значення за замовчуванням |
| `secret` | `boolean` | Чи є чутливою інформацією |

Користувач заповнює ці значення конфігурації в налаштуваннях Skill на сторінці керування.

### Тіло підказки

Тіло Markdown впроваджується як системна підказка AI. Поради щодо написання:

- Опишіть інструменти, які надає Skill, і їхнє призначення
- Поясніть, що означають параметри кожного інструмента та правила їх використання
- Наведіть типові сценарії використання та на що звертати увагу
- Якщо є довідкові матеріали, поясніть, як з ними працювати

## Скрипти інструментів SkillScript

SkillScript — це скрипт інструмента, який може викликати AI. Кожен файл SkillScript реєструється як один інструмент LLM.

### Формат метаданих

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

### Поля метаданих

| Тег | Опис | Приклад |
|------|------|------|
| `@name` | Назва інструмента (використовується, коли AI його викликає) | `get_weather` |
| `@description` | Опис інструмента (AI використовує це, щоб вирішити, коли його викликати) | `Look up city weather` |
| `@param` | Визначення параметра (може з'являтися кілька разів) | див. нижче |
| `@grant` | Необхідний дозвіл GM API | `CAT.agent.opfs` |
| `@require` | URL зовнішньої бібліотеки (завантажується та кешується) | `https://cdn.example.com/lib.js` |
| `@timeout` | Час очікування виконання в секундах | `60` (за замовчуванням `300`) |

### Синтаксис `@param`

```
@param paramName type[enumValues] [required] description
```

**Типи:** `string`, `number`, `boolean`

**Значення enum (за бажанням):** у квадратних дужках, розділені комами

**Позначка обов'язковості:** `[required]` перед описом

```javascript
// Обов'язковий рядковий параметр
// @param city string [required] City name

// Рядковий параметр з enum
// @param unit string [celsius,fahrenheit] Temperature unit

// Необов'язковий числовий параметр
// @param days number Number of forecast days

// Логічний параметр
// @param detailed boolean Whether to return detailed information
```

Визначення параметрів автоматично перетворюються на JSON Schema для використання LLM під час виклику інструмента.

### Написання скрипта

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. Отримати параметри, які AI передав через arguments[0]
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG надає конфігурацію Skill, яку користувач заповнив на сторінці керування
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. Виконати фактичну роботу
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. Повернути результат AI через `return`
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

### Середовище виконання

| Функція | Опис |
|------|------|
| **Місце виконання** | Пісочниця, ізольоване середовище (без доступу до DOM) |
| **Отримання параметрів** | `arguments[0]` — об'єкт параметрів, переданий AI |
| **Отримання конфігурації** | `CAT_CONFIG` — глобальний об'єкт лише для читання, що містить конфігурацію користувача |
| **Значення, що повертається** | Оператор `return` повертає значення, яке можна серіалізувати в JSON |
| **Підтримка асинхронності** | Підтримуються `async/await`, `fetch` і `Promise` |
| **Зовнішні бібліотеки** | Завантажуються через `@require`, кешуються локально |
| **Час очікування** | 300 секунд за замовчуванням, налаштовується через `@timeout` |
| **GM API** | Можна використовувати після оголошення через `@grant` (напр. `CAT.agent.opfs`) |

### Зовнішні бібліотеки `@require`

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// Бібліотеку, завантажену через @require, можна використовувати безпосередньо
const result = _.groupBy(data, "category");
return result;
```

Зовнішні бібліотеки кешуються під час першого завантаження, і наступні виконання використовують кешовану версію безпосередньо.

## Довідкові матеріали

Файли в каталозі `references/` слугують довідковими матеріалами, до яких може звертатися AI. Коли AI потребує їх, він читає їх через вбудований інструмент `read_reference`.

Вміст, який добре підходить для довідкових матеріалів:
- Документація API
- Специфікації форматів даних
- Колекції прикладів використання
- Документи з доменними знаннями

## Приклад репозиторію

Існує офіційно підтримуваний репозиторій прикладів Skill, що містить кілька готових до використання Skill та прикладів скриптових API:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Список Skill:**

| Каталог | Опис | Встановлення |
|------|------|------|
| `browser-automation/` | Аналіз сторінок, операції з DOM, заповнення форм, скріншоти, навігація | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron-заплановані завдання (внутрішній + режим подій) | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Допомагає створювати, тестувати та пакувати нові Skill | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Аналізує поширені формати файлів (Excel, PDF, Word, CSV, PPT) | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | Асистент розробки скриптів ScriptCat/Tampermonkey | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Читання/запис електронних таблиць Synology Office | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | Асистент операцій з офіційним акаунтом WeChat — збір контенту, написання та публікація статей | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Асистент операцій Xiaohongshu (RED) — написання нотаток, генерація зображень та публікація | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Приклад коду:**

| Каталог | Опис |
|------|------|
| `examples/conversation/` | Приклади API розмови — чат, потокова передача, виклики інструментів |
| `examples/dom/` | Приклади DOM API — читання сторінок, заповнення форм, керування вкладками |
| `examples/config/` | Приклади конфігурації Skill — оголошення полів конфігурації та використання `CAT_CONFIG` |
| `examples/page_copilot.user.js` | Повний приклад користувацького скрипта — AI-асистент правої кнопки миші з потоковим інтерфейсом |

Хороша ідея почати вивчати розробку Skill з коду в прикладному репозиторії.

## Методи встановлення

### Встановлення з URL

Відкрийте URL `SKILL.cat.md` безпосередньо в браузері; ScriptCat перехопить його та покаже сторінку встановлення.

Ви також можете зробити це зі сторінки керування → Agent → Керування Skill:

1. Натисніть кнопку встановлення за URL
2. Вставте URL `SKILL.cat.md`
3. Підтвердіть встановлення

ScriptCat спочатку отримує `SKILL.cat.md`, потім отримує інші файли за їхніми відносними шляхами на основі `scripts` і `references`, оголошених у frontmatter. Після встановлення записується `installUrl`, тому пізніше можна перевіряти оновлення за номером версії.

### Встановлення зі скрипта

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

## Як завантажуються Skill

Skill використовують трирівневе поступове завантаження для оптимізації використання контексту:

| Рівень | Коли | Вміст |
|------|------|------|
| **Підсумок** | На початку розмови | Назва Skill + опис + список інструментів (впроваджується в системну підказку) |
| **Підказка** | Коли AI активно викликає `load_skill` | Повне тіло `SKILL.cat.md` |
| **Інструменти** | Після `load_skill` | SkillScript реєструються як викликані інструменти LLM |

AI викликає `load_skill` автоматично, коли йому потрібно завантажити повний вміст та інструменти Skill.

## Повний приклад

### Структура каталогу

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
