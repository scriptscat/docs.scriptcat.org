---
title: Руководство по разработке Skill
---

Skill — пакет расширения системы Agent, состоящий из **промптов + скриптов инструментов + справочных материалов**. Skills позволяют внедрять в AI предметные знания и пользовательские возможности инструментов.

## Структура каталога Skill

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

> `SKILL.cat.md` — входной файл Skill. При установке по URL ScriptCat сначала загружает этот файл, затем по относительным путям загружает остальные файлы на основе `scripts` и `references`, объявленных во frontmatter.

## Формат SKILL.cat.md

SKILL.cat.md использует YAML frontmatter для объявления метаданных, а Markdown-тело служит промптом для AI.

```markdown
---
name: "weather-assistant"
description: "Weather lookup assistant, supports global city weather queries and forecasts"
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

# Weather Lookup Assistant

You can use the following tools to look up weather information:

## Tool Description

- **get_weather**: looks up the current weather and forecast for a given city
  - the `city` parameter is the city name (Chinese and English both supported)
  - the `days` parameter is the number of forecast days

## Usage Rules

1. When the user asks about the weather, first confirm the city name
2. By default, return the current weather plus a 3-day forecast
3. Display temperature according to the configured unit
```

### Поля метаданных

| Поле | Тип | Обязательно | Описание |
|------|------|------|------|
| `name` | `string` | Да | Уникальный идентификатор Skill (рекомендуется английский kebab-case) |
| `description` | `string` | Да | Краткое описание (показывается в списке) |
| `version` | `string` | Нет | Номер версии (формат semver, например `1.0.0`), используется для проверки обновлений |
| `scripts` | `string[]` | Нет | Список имён файлов скриптов (например, `["search.js"]`); при установке по URL автоматически загружаются из каталога `scripts/` |
| `references` | `string[]` | Нет | Список имён файлов справочных материалов (например, `["api-docs.md"]`); при установке по URL автоматически загружаются из каталога `references/` |
| `config` | `object` | Нет | Определения полей конфигурации |

### Типы полей конфигурации

| type | Описание | Особые свойства |
|------|------|---------|
| `text` | Текстовый ввод | `secret`: маскируется ли в UI |
| `number` | Числовой ввод | — |
| `select` | Выпадающий список | `values`: список вариантов (`string[]`) |
| `switch` | Переключатель | — |

**Общие свойства:**

| Свойство | Тип | Описание |
|------|------|------|
| `title` | `string` | Отображаемый заголовок |
| `required` | `boolean` | Обязательность |
| `default` | `unknown` | Значение по умолчанию |
| `secret` | `boolean` | Конфиденциальная информация |

Пользователь заполняет значения конфигурации в настройках Skill на панели управления.

### Тело промпта

Markdown-тело внедряется как системный промпт AI. Рекомендации по написанию:

- Опишите инструменты, которые предоставляет Skill, и их назначение
- Объясните смысл параметров каждого инструмента и правила использования
- Приведите типичные сценарии и на что обратить внимание
- Если есть справочные материалы, объясните, как к ним обращаться

## Скрипты инструментов SkillScript

SkillScript — скрипт инструмента, который AI может вызывать. Каждый файл SkillScript регистрируется как один инструмент LLM.

### Формат метаданных

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up the weather for a given city
// @param       city string [required] City name, Chinese and English both supported
// @param       days number Number of forecast days, defaults to 3
// @param       format string [json,text] Output format
// @grant       CAT.agent.opfs
// @require     https://cdn.example.com/utils.js
// @timeout     60
// ==SkillScript==
```

### Поля метаданных

| Тег | Описание | Пример |
|------|------|------|
| `@name` | Имя инструмента (используется при вызове AI) | `get_weather` |
| `@description` | Описание инструмента (AI решает, когда его вызывать) | `Look up city weather` |
| `@param` | Определение параметра (можно повторять) | см. ниже |
| `@grant` | Нужное разрешение GM API | `CAT.agent.opfs` |
| `@require` | URL внешней библиотеки (кэшируется после загрузки) | `https://cdn.example.com/lib.js` |
| `@timeout` | Таймаут выполнения в секундах | `60` (по умолчанию 300) |

### Синтаксис `@param`

```
@param paramName type[enumValues] [required] description
```

**Тип:** `string`, `number`, `boolean`

**Значения перечисления (необязательно):** в квадратных скобках, через запятую

**Маркер обязательности:** добавьте `[required]` перед описанием

```javascript
// A required string parameter
// @param city string [required] City name

// A string parameter with an enum
// @param unit string [celsius,fahrenheit] Temperature unit

// An optional number parameter
// @param days number Number of forecast days

// A boolean parameter
// @param detailed boolean Whether to return detailed information
```

Определения параметров автоматически преобразуются в JSON Schema для LLM при вызове инструмента.

### Написание скрипта

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up the weather for a given city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. Receive the parameters passed in by the AI via arguments[0]
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG provides the Skill config the user filled in on the dashboard
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. Run the business logic
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. Use return to send the result back to the AI
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

### Окружение выполнения

| Особенность | Описание |
|------|------|
| **Где выполняется** | Изолированная среда песочницы (без доступа к DOM) |
| **Получение параметров** | `arguments[0]` — объект параметров, переданный AI |
| **Получение конфигурации** | `CAT_CONFIG` — глобальный объект только для чтения с конфигурацией пользователя |
| **Возвращаемое значение** | Оператор `return` возвращает JSON-сериализуемое значение |
| **Асинхронность** | Поддерживаются `async/await`, `fetch`, `Promise` |
| **Внешние библиотеки** | Загружаются через `@require`, кэшируются локально |
| **Таймаут** | По умолчанию 300 секунд, настраивается через `@timeout` |
| **GM API** | Доступны после объявления через `@grant` (например, `CAT.agent.opfs`) |

### Внешние библиотеки `@require`

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// Libraries loaded via @require can be used directly
const result = _.groupBy(data, "category");
return result;
```

Внешние библиотеки кэшируются при первой загрузке; при последующих выполнениях используется кэш.

## Справочные материалы

Файлы в каталоге `references/` служат справочными материалами, к которым AI может обращаться. При необходимости AI читает эти файлы через встроенный инструмент `read_reference`.

Хорошие кандидаты для справочных материалов:
- Документация API
- Описания форматов данных
- Подборки примеров использования
- Документы предметных знаний

## Репозиторий примеров

Мы поддерживаем официальный репозиторий примеров Skill с несколькими готовыми Skills и примерами script API:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Список Skills:**

| Каталог | Описание | Установка |
|------|------|------|
| `browser-automation/` | Анализ страниц, операции DOM, заполнение форм, скриншоты, навигация | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Задачи по расписанию (внутренний + режим событий) | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Помогает создавать, тестировать и упаковывать новые Skills | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Разбор распространённых форматов файлов (Excel, PDF, Word, CSV, PPT) | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | Помощник разработки скриптов ScriptCat/Tampermonkey | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Чтение/запись таблиц Synology Office | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | Помощник по работе с официальным аккаунтом WeChat — сбор контента, написание и публикация статей | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Помощник по работе с Xiaohongshu (RED) — написание постов, генерация изображений и публикация | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Примеры кода:**

| Каталог | Описание |
|------|------|
| `examples/conversation/` | Примеры Conversation API — чат, потоки, вызовы инструментов |
| `examples/dom/` | Примеры DOM API — чтение страниц, заполнение форм, управление вкладками |
| `examples/config/` | Примеры Skill Config — объявление полей конфигурации и использование `CAT_CONFIG` |
| `examples/page_copilot.user.js` | Полный пример пользовательского скрипта — AI-помощник по правому клику с потоковым UI |

Рекомендуется начинать изучение разработки Skill с кода в репозитории примеров.

## Способы установки

### Установка по URL

Откройте URL `SKILL.cat.md` прямо в браузере; ScriptCat автоматически перехватит его и покажет страницу установки.

Также можно сделать это из панели управления → Agent → Управление Skill:

1. Нажмите кнопку установки по URL
2. Вставьте URL `SKILL.cat.md`
3. Подтвердите установку

ScriptCat сначала загружает `SKILL.cat.md`, затем по относительным путям — остальные файлы на основе `scripts` и `references` во frontmatter. После установки сохраняется `installUrl`, который позже используется для проверки обновлений по номеру версии.

### Установка из скрипта

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

## Механизм загрузки Skill

Skills используют трёхуровневый прогрессивный механизм загрузки для оптимизации использования контекста:

| Уровень | Когда | Содержимое |
|------|------|------|
| **Summary** | В начале диалога | Имя Skill + описание + список инструментов (внедряется в системный промпт) |
| **Prompt** | Когда AI активно вызывает `load_skill` | Полное тело SKILL.cat.md |
| **Tools** | После load_skill | SkillScripts регистрируются как вызываемые инструменты LLM |

AI автоматически вызывает `load_skill`, когда нужно загрузить полное содержимое Skill и инструменты.

## Полный пример

### Структура каталога

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
description: "Multi-language translation tool, supports 100+ languages"
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

# Translation Assistant

Use the `translate` tool to translate text. Consult language-codes.md for the full list of language codes.

## Usage Rules

- If the user hasn't specified a target language, use the default language from the config
- Automatically split long text into chunks for translation
- Preserve the original formatting (Markdown, code blocks, etc.)
```

### scripts/translate.js

```javascript
// ==SkillScript==
// @name        translate
// @description Translate text into a given language
// @param       text string [required] The text to translate
// @param       target string Target language code (defaults to the config value)
// @param       source string Source language code (defaults to auto-detect)
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
# Language Code Reference

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
