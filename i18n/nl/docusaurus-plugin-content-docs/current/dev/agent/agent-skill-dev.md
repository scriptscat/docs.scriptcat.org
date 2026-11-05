---
title: Skill-ontwikkelgids
---

Een Skill is een uitbreidingspakket voor het Agent-systeem, opgebouwd uit een **prompt + toolscripts + referentiemateriaal**. Met Skills kunt u domeinspecifieke kennis en aangepaste toolmogelijkheden in de AI injecteren.

## Skill-mapstructuur

```
my-skill/
├── SKILL.cat.md          # Vereist: metadata + prompt (ingangsbestand)
├── scripts/              # Optioneel: SkillScript-toolscripts
│   ├── search.js
│   └── export.js
└── references/           # Optioneel: referentiemateriaalbestanden
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` is het ingangsbestand van de Skill. Bij installatie vanaf een URL haalt ScriptCat eerst dit bestand op en vervolgens de andere bestanden via hun relatieve paden op basis van de `scripts` en `references` die in de frontmatter zijn gedeclareerd.

## SKILL.cat.md-indeling

`SKILL.cat.md` gebruikt YAML-frontmatter om metadata te declareren, waarbij de Markdown-body fungeert als de prompt die aan de AI wordt gegeven.

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

### Metadatavelden

| Veld | Type | Vereist | Beschrijving |
|------|------|------|------|
| `name` | `string` | Ja | Unieke Skill-identificatie (kebab-case Engels aanbevolen) |
| `description` | `string` | Ja | Korte beschrijving (weergegeven in de lijst) |
| `version` | `string` | Nee | Versie (semver-indeling, bv. `1.0.0`), gebruikt voor updatecontroles |
| `scripts` | `string[]` | Nee | Lijst van scriptbestandsnamen (bv. `["search.js"]`); automatisch opgehaald uit de map `scripts/` bij installatie via URL |
| `references` | `string[]` | Nee | Lijst van referentiemateriaalbestandsnamen (bv. `["api-docs.md"]`); automatisch opgehaald uit de map `references/` bij installatie via URL |
| `config` | `object` | Nee | Definities van configuratievelden |

### Typen configuratievelden

| type | Beschrijving | Typespecifieke eigenschappen |
|------|------|---------|
| `text` | Tekstinvoer | `secret`: of het in de interface wordt gemaskeerd |
| `number` | Getalinvoer | — |
| `select` | Keuzelijst | `values`: optielijst (`string[]`) |
| `switch` | Schakelaar | — |

**Gemeenschappelijke eigenschappen:**

| Eigenschap | Type | Beschrijving |
|------|------|------|
| `title` | `string` | Weergavetitel |
| `required` | `boolean` | Of het verplicht is |
| `default` | `unknown` | Standaardwaarde |
| `secret` | `boolean` | Of het gevoelige informatie is |

De gebruiker vult deze configuratiewaarden in in de instellingen van de Skill op de beheerpagina.

### De promptbody

De Markdown-body wordt geïnjecteerd als de systeemprompt van de AI. Schrijftips:

- Beschrijf de tools die de Skill biedt en waarvoor ze dienen
- Leg uit wat de parameters van elke tool betekenen en de regels voor het gebruik ervan
- Geef typische gebruiksscenario's en waar u op moet letten
- Als er referentiemateriaal is, leg dan uit hoe u het kunt raadplegen

## SkillScript-toolscripts

Een SkillScript is een toolscript dat de AI kan aanroepen. Elk SkillScript-bestand wordt geregistreerd als één LLM-tool.

### Metadataindeling

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

### Metadatavelden

| Tag | Beschrijving | Voorbeeld |
|------|------|------|
| `@name` | Toolnaam (gebruikt wanneer de AI het aanroept) | `get_weather` |
| `@description` | Toolbeschrijving (de AI gebruikt dit om te beslissen wanneer het aan te roepen) | `Weer van de stad opzoeken` |
| `@param` | Parameterdefinitie (kan meerdere keren voorkomen) | zie hieronder |
| `@grant` | De GM-API-machtiging die het nodig heeft | `CAT.agent.opfs` |
| `@require` | Externe bibliotheek-URL (geladen en in de cache opgeslagen) | `https://cdn.example.com/lib.js` |
| `@timeout` | Uitvoeringstime-out in seconden | `60` (standaard `300`) |

### `@param`-syntaxis

```
@param paramName type[enumValues] [required] description
```

**Typen:** `string`, `number`, `boolean`

**Enum-waarden (optioneel):** tussen vierkante haakjes, door komma's gescheiden

**Vereist-markering:** `[required]` vóór de beschrijving

```javascript
// Vereiste stringparameter
// @param city string [required] City name

// Stringparameter met een enum
// @param unit string [celsius,fahrenheit] Temperature unit

// Optionele getalparameter
// @param days number Number of forecast days

// Booleaanse parameter
// @param detailed boolean Whether to return detailed information
```

Parameterdefinities worden automatisch omgezet naar JSON Schema voor de LLM om te gebruiken bij het aanroepen van de tool.

### Het script schrijven

```javascript
// ==SkillScript==
// @name        get_weather
// @description Look up weather information for a specified city
// @param       city string [required] City name
// @param       days number Number of forecast days
// @timeout     30
// ==SkillScript==

// 1. Ontvang de parameters die de AI heeft doorgegeven via arguments[0]
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG biedt de Skill-configuratie die de gebruiker op de beheerpagina heeft ingevuld
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. Doe het eigenlijke werk
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();

// 4. Retourneer het resultaat aan de AI via `return`
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

### Uitvoeringsomgeving

| Functie | Beschrijving |
|------|------|
| **Uitvoeringslocatie** | Een sandbox, geïsoleerde omgeving (geen DOM-toegang) |
| **Parameters ophalen** | `arguments[0]` — het parameterobject dat de AI heeft doorgegeven |
| **Configuratie ophalen** | `CAT_CONFIG` — een globaal, alleen-lezen object met de configuratie van de gebruiker |
| **Retourwaarde** | De `return`-instructie retourneert een JSON-serialiseerbare waarde |
| **Async-ondersteuning** | `async/await`, `fetch` en `Promise` worden allemaal ondersteund |
| **Externe bibliotheken** | Geladen via `@require`, lokaal in de cache opgeslagen |
| **Time-out** | Standaard 300 seconden, aanpasbaar via `@timeout` |
| **GM-API** | Bruikbaar zodra gedeclareerd via `@grant` (bv. `CAT.agent.opfs`) |

### Externe bibliotheken via `@require`

```javascript
// ==SkillScript==
// @name        analyze
// @description Data analysis
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// Een bibliotheek die via @require is geladen, kan direct worden gebruikt
const result = _.groupBy(data, "category");
return result;
```

Externe bibliotheken worden de eerste keer dat ze worden geladen in de cache opgeslagen en latere uitvoeringen gebruiken direct de gecachte versie.

## Referentiemateriaal

Bestanden in de map `references/` dienen als referentiemateriaal dat de AI kan raadplegen. Wanneer de AI ze nodig heeft, leest het ze via de ingebouwde `read_reference`-tool.

Inhoud die goed geschikt is als referentiemateriaal:
- API-documentatie
- Gegevensindelingsspecificaties
- Verzamelingen van gebruiksvoorbeelden
- Domeinkennisdocumenten

## Voorbeeldrepository

Er is een officieel onderhouden repository met Skill-voorbeelden, die verschillende kant-en-klare Skills en script-API-voorbeelden bevat:

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill-lijst:**

| Directory | Beschrijving | Installeren |
|------|------|------|
| `browser-automation/` | Pagina-analyse, DOM-manipulatie, formulieren invullen, schermafbeeldingen, navigatie | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron-geplande taken (interne + gebeurtenismodus) | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Helpt bij het maken, testen en verpakken van nieuwe Skills | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Parseert gangbare bestandsindelingen (Excel, PDF, Word, CSV, PPT) | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | ScriptCat/Tampermonkey-scriptontwikkelingsassistent | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Synology Office-spreadsheets lezen/schrijven | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | Assistent voor WeChat Official Account-bewerkingen — contentverzameling, artikel schrijven en publiceren | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Xiaohongshu (RED)-bewerkingenassistent — notities schrijven, afbeeldingen genereren en publiceren | [Installeren](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Voorbeeldcode:**

| Directory | Beschrijving |
|------|------|
| `examples/conversation/` | Gespreks-API-voorbeelden — chat, streaming, toolaanroepen |
| `examples/dom/` | DOM-API-voorbeelden — pagina's lezen, formulieren invullen, tabbladbeheer |
| `examples/config/` | Skill-configuratievoorbeelden — configuratievelden declareren en `CAT_CONFIG` gebruiken |
| `examples/page_copilot.user.js` | Een compleet gebruikersscriptvoorbeeld — een AI-assistent via rechtsklik met een streaming-interface |

Het is een goed idee om te beginnen met het leren van Skill-ontwikkeling aan de hand van de code in de voorbeeldrepository.

## Installatiemethoden

### Installeren vanaf een URL

Open een `SKILL.cat.md`-URL rechtstreeks in uw browser; ScriptCat onderschept deze en toont een installatiepagina.

U kunt dit ook doen vanaf de beheerpagina → Agent → Skillbeheer:

1. Klik op de URL-installatieknop
2. Plak de `SKILL.cat.md`-URL
3. Bevestig de installatie

ScriptCat haalt eerst `SKILL.cat.md` op en vervolgens de andere bestanden via hun relatieve paden op basis van de `scripts` en `references` die in de frontmatter zijn gedeclareerd. Na installatie wordt `installUrl` geregistreerd, zodat updates later per versienummer kunnen worden gecontroleerd.

### Installeren vanuit een script

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

## Hoe Skills worden geladen

Skills gebruiken drielaags progressief laden om het contextgebruik te optimaliseren:

| Laag | Wanneer | Inhoud |
|------|------|------|
| **Samenvatting** | Aan het begin van een gesprek | Skillnaam + beschrijving + toollijst (geïnjecteerd in de systeemprompt) |
| **Prompt** | Wanneer de AI actief `load_skill` aanroept | De volledige body van `SKILL.cat.md` |
| **Tools** | Na `load_skill` | SkillScripts worden geregistreerd als aanroepbare LLM-tools |

De AI roept `load_skill` automatisch aan wanneer het de volledige inhoud en tools van een Skill moet laden.

## Volledig voorbeeld

### Mapstructuur

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
