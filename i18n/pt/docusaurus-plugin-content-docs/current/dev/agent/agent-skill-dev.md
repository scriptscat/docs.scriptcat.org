---
title: Skill Development Guide
---

A Skill is an extension package for the Agent system, made up of a **prompt + tool scripts + reference material**. Skills let you inject domain-specific knowledge and custom tool capabilities into the AI.

## Skill directory structure

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

> `SKILL.cat.md` is the Skill's entry file. When installing from a URL, ScriptCat fetches this file first, then fetches the other files by their relative paths based on the `scripts` and `references` declared in its frontmatter.

## SKILL.cat.md format

`SKILL.cat.md` uses YAML frontmatter to declare metadata, with the Markdown body serving as the prompt given to the AI.

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

### Metadata fields

| Field | Type | Required | Description |
|------|------|------|------|
| `name` | `string` | Yes | Unique Skill identifier (kebab-case English recommended) |
| `description` | `string` | Yes | Short description (shown in the list) |
| `version` | `string` | No | Version (semver format, e.g. `1.0.0`), used for update checks |
| `scripts` | `string[]` | No | List of script filenames (e.g. `["search.js"]`); fetched automatically from the `scripts/` directory when installing via URL |
| `references` | `string[]` | No | List of reference-material filenames (e.g. `["api-docs.md"]`); fetched automatically from the `references/` directory when installing via URL |
| `config` | `object` | No | Configuration field definitions |

### Configuration field types

| type | Description | Type-specific properties |
|------|------|---------|
| `text` | Text input | `secret`: whether it's masked in the UI |
| `number` | Number input | — |
| `select` | Dropdown | `values`: option list (`string[]`) |
| `switch` | Toggle | — |

**Common properties:**

| Property | Type | Description |
|------|------|------|
| `title` | `string` | Display title |
| `required` | `boolean` | Whether it's required |
| `default` | `unknown` | Default value |
| `secret` | `boolean` | Whether it's sensitive information |

The user fills in these config values in the Skill's settings on the management page.

### The prompt body

The Markdown body is injected as the AI's system prompt. Writing tips:

- Describe the tools the Skill provides and what they're for
- Explain what each tool's parameters mean and the rules for using them
- Give typical usage scenarios and things to watch out for
- If there's reference material, explain how to consult it

## SkillScript tool scripts

A SkillScript is a tool script the AI can call. Each SkillScript file gets registered as one LLM tool.

### Metadata format

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

### Metadata fields

| Tag | Description | Example |
|------|------|------|
| `@name` | Tool name (used when the AI calls it) | `get_weather` |
| `@description` | Tool description (the AI uses this to decide when to call it) | `Look up city weather` |
| `@param` | Parameter definition (can appear multiple times) | see below |
| `@grant` | The GM API permission it needs | `CAT.agent.opfs` |
| `@require` | External library URL (loaded and cached) | `https://cdn.example.com/lib.js` |
| `@timeout` | Execution timeout in seconds | `60` (default `300`) |

### `@param` syntax

```
@param paramName type[enumValues] [required] description
```

**Types:** `string`, `number`, `boolean`

**Enum values (optional):** wrapped in square brackets, comma-separated

**Required marker:** `[required]` before the description

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

Parameter definitions are automatically converted to JSON Schema for the LLM to use when calling the tool.

### Writing the script

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

### Execution environment

| Feature | Description |
|------|------|
| **Execution location** | A sandboxed, isolated environment (no DOM access) |
| **Getting parameters** | `arguments[0]` — the parameter object the AI passed in |
| **Getting config** | `CAT_CONFIG` — a global, read-only object containing the user's configuration |
| **Return value** | The `return` statement returns a JSON-serializable value |
| **Async support** | `async/await`, `fetch`, and `Promise` are all supported |
| **External libraries** | Loaded via `@require`, cached locally |
| **Timeout** | 300 seconds by default, customizable via `@timeout` |
| **GM API** | Usable once declared via `@grant` (e.g. `CAT.agent.opfs`) |

### `@require` external libraries

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

External libraries are cached the first time they're loaded, and subsequent executions use the cached version directly.

## Reference material

Files in the `references/` directory serve as reference material the AI can consult. When the AI needs them, it reads them via the built-in `read_reference` tool.

Content that's a good fit for reference material:
- API documentation
- Data format specifications
- Collections of usage examples
- Domain knowledge documents

## Example repository

There's an officially maintained repository of Skill examples, containing several ready-to-use Skills and script API examples:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill list:**

| Directory | Description | Install |
|------|------|------|
| `browser-automation/` | Page analysis, DOM manipulation, form filling, screenshots, navigation | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron scheduled tasks (internal + event mode) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Helps create, test, and package new Skills | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Parses common file formats (Excel, PDF, Word, CSV, PPT) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat/Tampermonkey script development assistant | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Read/write Synology Office spreadsheets | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | WeChat Official Account operations assistant — content gathering, article writing, and publishing | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu (RED) operations assistant — note writing, image generation, and publishing | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Example code:**

| Directory | Description |
|------|------|
| `examples/conversation/` | Conversation API examples — chat, streaming, tool calls |
| `examples/dom/` | DOM API examples — reading pages, filling forms, tab management |
| `examples/config/` | Skill config examples — declaring config fields and using `CAT_CONFIG` |
| `examples/page_copilot.user.js` | A complete user script example — a right-click AI assistant with a streaming UI |

It's a good idea to start learning Skill development from the code in the example repository.

## Installation methods

### Install from a URL

Open a `SKILL.cat.md` URL directly in your browser; ScriptCat will intercept it and pop up an install page.

You can also do this from the management page → Agent → Skill management:

1. Click the URL-install button
2. Paste the `SKILL.cat.md` URL
3. Confirm the install

ScriptCat fetches `SKILL.cat.md` first, then fetches the other files by their relative paths based on the `scripts` and `references` declared in its frontmatter. After installing, `installUrl` is recorded, so updates can later be checked by version number.

### Install from a script

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

## How Skills are loaded

Skills use three-tier progressive loading to optimize context usage:

| Tier | When | Content |
|------|------|------|
| **Summary** | At the start of a conversation | Skill name + description + tool list (injected into the system prompt) |
| **Prompt** | When the AI actively calls `load_skill` | The full body of `SKILL.cat.md` |
| **Tools** | After `load_skill` | SkillScripts are registered as callable LLM tools |

The AI calls `load_skill` automatically when it needs to load a Skill's full content and tools.

## Full example

### Directory structure

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
