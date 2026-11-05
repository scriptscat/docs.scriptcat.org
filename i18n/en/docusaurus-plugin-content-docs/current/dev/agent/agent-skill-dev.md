---
title: Skill Development Guide
---

A Skill is an extension package for the Agent system, made up of **prompts + tool scripts + reference material**. Skills let you inject domain-specific knowledge and custom tool capabilities into the AI.

## Skill Directory Structure

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

> `SKILL.cat.md` is the Skill's entry file. When installing via URL, ScriptCat first fetches this file, then fetches the other files by relative path based on the `scripts` and `references` declared in its frontmatter.

## SKILL.cat.md Format

SKILL.cat.md uses YAML frontmatter to declare metadata, with the Markdown body serving as the prompt given to the AI.

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

### Metadata Fields

| Field | Type | Required | Description |
|------|------|------|------|
| `name` | `string` | Yes | The Skill's unique identifier (English kebab-case recommended) |
| `description` | `string` | Yes | A short description (shown in the list) |
| `version` | `string` | No | Version number (semver format, e.g. `1.0.0`), used for update checks |
| `scripts` | `string[]` | No | A list of script file names (e.g. `["search.js"]`); fetched automatically from the `scripts/` directory when installing via URL |
| `references` | `string[]` | No | A list of reference-material file names (e.g. `["api-docs.md"]`); fetched automatically from the `references/` directory when installing via URL |
| `config` | `object` | No | The config field definitions |

### Config Field Types

| type | Description | Special properties |
|------|------|---------|
| `text` | A text input | `secret`: whether it's masked in the UI |
| `number` | A number input | — |
| `select` | A dropdown select | `values`: the option list (`string[]`) |
| `switch` | A toggle | — |

**Common properties:**

| Property | Type | Description |
|------|------|------|
| `title` | `string` | Display title |
| `required` | `boolean` | Whether it's required |
| `default` | `unknown` | Default value |
| `secret` | `boolean` | Whether it's sensitive information |

The user fills in config values in the Skill settings on the dashboard.

### The Prompt Body

The Markdown body is injected as the AI's system prompt. Suggestions for writing it:

- Describe the tools the Skill provides and what they're for
- Explain the meaning of each tool's parameters and how they should be used
- Give typical use cases and things to watch out for
- If there's reference material, explain how to consult it

## SkillScript Tool Scripts

A SkillScript is a tool script the AI can call. Each SkillScript file is registered as one LLM tool.

### Metadata Format

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

### Metadata Fields

| Tag | Description | Example |
|------|------|------|
| `@name` | The tool's name (used when the AI calls it) | `get_weather` |
| `@description` | The tool's description (the AI uses this to decide when to call it) | `Look up city weather` |
| `@param` | Parameter definition (can repeat) | see below |
| `@grant` | The GM API permission needed | `CAT.agent.opfs` |
| `@require` | An external library URL (cached after loading) | `https://cdn.example.com/lib.js` |
| `@timeout` | Execution timeout in seconds | `60` (default 300) |

### `@param` Syntax

```
@param paramName type[enumValues] [required] description
```

**Type:** `string`, `number`, `boolean`

**Enum values (optional):** wrapped in square brackets, comma-separated

**Required marker:** add `[required]` before the description

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

Parameter definitions are automatically converted into a JSON Schema for the LLM to use when calling the tool.

### Writing the Script

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

### Execution Environment

| Feature | Description |
|------|------|
| **Where it runs** | The sandbox's isolated environment (no DOM access) |
| **Getting parameters** | `arguments[0]` — the parameter object passed in by the AI |
| **Getting config** | `CAT_CONFIG` — a global read-only object containing the user's config |
| **Return value** | The `return` statement returns a JSON-serializable value |
| **Async support** | Supports `async/await`, `fetch`, `Promise` |
| **External libraries** | Loaded via `@require`, cached locally |
| **Timeout** | 300 seconds by default, customizable via `@timeout` |
| **GM API** | Available once declared via `@grant` (e.g. `CAT.agent.opfs`) |

### `@require` External Libraries

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

External libraries are cached the first time they're loaded, and the cached version is used directly on subsequent executions.

## Reference Material

Files in the `references/` directory serve as reference material the AI can consult. When needed, the AI reads these files via the built-in `read_reference` tool.

Good candidates for reference material:
- API documentation
- Data format descriptions
- Collections of usage examples
- Domain knowledge documents

## Example Repository

We maintain an official Skill example repository with several ready-to-use Skills and script API examples:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill list:**

| Directory | Description | Install |
|------|------|------|
| `browser-automation/` | Page analysis, DOM operations, form filling, screenshots, navigation | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron scheduled tasks (internal + event mode) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Helps create, test, and package new Skills | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Parses common file formats (Excel, PDF, Word, CSV, PPT) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat userscript development assistant | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Reads/writes Synology Office spreadsheets | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | WeChat Official Account operations assistant — content collection, article writing, and publishing | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu (RED) operations assistant — post writing, image generation, and publishing | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Example code:**

| Directory | Description |
|------|------|
| `examples/conversation/` | Conversation API examples — chat, streaming, tool calls |
| `examples/dom/` | DOM API examples — reading pages, filling forms, tab management |
| `examples/config/` | Skill Config examples — config field declarations and using `CAT_CONFIG` |
| `examples/page_copilot.user.js` | A complete user script example — a right-click AI assistant with a streaming UI |

It's recommended to start learning Skill development from the code in the example repository.

## Installation Methods

### Install via URL

Open the `SKILL.cat.md` URL directly in the browser; ScriptCat automatically intercepts it and shows the install page.

You can also do this from the dashboard → Agent → Skill Management:

1. Click the URL install button
2. Paste the `SKILL.cat.md` URL
3. Confirm the install

ScriptCat first fetches `SKILL.cat.md`, then fetches the other files by relative path based on the `scripts` and `references` declared in its frontmatter. After installing, it records the `installUrl`, which is later used to check for updates by version number.

### Installing from a Script

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

## The Skill Loading Mechanism

Skills use a three-tier progressive loading mechanism to optimize context usage:

| Tier | When | Content |
|------|------|------|
| **Summary** | At the start of a conversation | Skill name + description + tool list (injected into the system prompt) |
| **Prompt** | When the AI actively calls `load_skill` | The full body of SKILL.cat.md |
| **Tools** | After load_skill | SkillScripts are registered as callable LLM tools |

The AI automatically calls `load_skill` when it needs to load the full Skill content and tools.

## Full Example

### Directory Structure

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
