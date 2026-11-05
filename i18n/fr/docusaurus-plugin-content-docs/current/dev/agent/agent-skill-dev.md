---
title: Guide de développement de Skills
---

Un Skill est un pack d'extension pour le système Agent, composé d'une **invite + de scripts d'outils + de matériel de référence**. Les Skills vous permettent d'injecter des connaissances spécialisées et des capacités d'outils personnalisées dans l'IA.

## Structure de répertoire d'un Skill

```
my-skill/
├── SKILL.cat.md          # Obligatoire : métadonnées + invite (fichier d'entrée)
├── scripts/              # Facultatif : scripts d'outils SkillScript
│   ├── search.js
│   └── export.js
└── references/           # Facultatif : fichiers de matériel de référence
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` est le fichier d'entrée du Skill. Lors de l'installation depuis une URL, ScriptCat récupère d'abord ce fichier, puis récupère les autres fichiers par leurs chemins relatifs en fonction des `scripts` et `references` déclarés dans son frontmatter.

## Format de SKILL.cat.md

`SKILL.cat.md` utilise le frontmatter YAML pour déclarer les métadonnées, le corps Markdown servant d'invite donnée à l'IA.

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

### Champs de métadonnées

| Champ | Type | Obligatoire | Description |
|------|------|------|------|
| `name` | `string` | Oui | Identifiant unique du Skill (anglais en kebab-case recommandé) |
| `description` | `string` | Oui | Courte description (affichée dans la liste) |
| `version` | `string` | Non | Version (format semver, ex. `1.0.0`), utilisée pour les vérifications de mise à jour |
| `scripts` | `string[]` | Non | Liste des noms de fichiers de scripts (ex. `["search.js"]`) ; récupérés automatiquement depuis le répertoire `scripts/` lors de l'installation par URL |
| `references` | `string[]` | Non | Liste des noms de fichiers de matériel de référence (ex. `["api-docs.md"]`) ; récupérés automatiquement depuis le répertoire `references/` lors de l'installation par URL |
| `config` | `object` | Non | Définitions des champs de configuration |

### Types de champs de configuration

| type | Description | Propriétés spécifiques au type |
|------|------|---------|
| `text` | Saisie de texte | `secret` : indique s'il est masqué dans l'interface |
| `number` | Saisie numérique | — |
| `select` | Liste déroulante | `values` : liste d'options (`string[]`) |
| `switch` | Interrupteur | — |

**Propriétés communes :**

| Propriété | Type | Description |
|------|------|------|
| `title` | `string` | Titre d'affichage |
| `required` | `boolean` | Indique s'il est obligatoire |
| `default` | `unknown` | Valeur par défaut |
| `secret` | `boolean` | Indique s'il s'agit d'informations sensibles |

L'utilisateur renseigne ces valeurs de configuration dans les paramètres du Skill sur la page de gestion.

### Le corps de l'invite

Le corps Markdown est injecté comme invite système de l'IA. Conseils de rédaction :

- Décrivez les outils fournis par le Skill et leur utilité
- Expliquez la signification des paramètres de chaque outil et les règles d'utilisation
- Donnez des scénarios d'utilisation typiques et les points d'attention
- S'il y a du matériel de référence, expliquez comment le consulter

## Scripts d'outils SkillScript

Un SkillScript est un script d'outil que l'IA peut appeler. Chaque fichier SkillScript est enregistré comme un outil LLM.

### Format des métadonnées

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

### Champs de métadonnées

| Balise | Description | Exemple |
|------|------|------|
| `@name` | Nom de l'outil (utilisé lorsque l'IA l'appelle) | `get_weather` |
| `@description` | Description de l'outil (l'IA l'utilise pour décider quand l'appeler) | `Look up city weather` |
| `@param` | Définition de paramètre (peut apparaître plusieurs fois) | voir ci-dessous |
| `@grant` | La permission d'API GM dont il a besoin | `CAT.agent.opfs` |
| `@require` | URL de bibliothèque externe (chargée et mise en cache) | `https://cdn.example.com/lib.js` |
| `@timeout` | Délai d'expiration d'exécution en secondes | `60` (défaut `300`) |

### Syntaxe de `@param`

```
@param paramName type[enumValues] [required] description
```

**Types :** `string`, `number`, `boolean`

**Valeurs d'énumération (facultatives) :** entre crochets, séparées par des virgules

**Marqueur obligatoire :** `[required]` avant la description

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

Les définitions de paramètres sont automatiquement converties en JSON Schema pour que le LLM les utilise lors de l'appel de l'outil.

### Écrire le script

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

### Environnement d'exécution

| Fonctionnalité | Description |
|------|------|
| **Lieu d'exécution** | Un environnement isolé en bac à sable (pas d'accès au DOM) |
| **Obtention des paramètres** | `arguments[0]` — l'objet de paramètres transmis par l'IA |
| **Obtention de la configuration** | `CAT_CONFIG` — un objet global en lecture seule contenant la configuration de l'utilisateur |
| **Valeur de retour** | L'instruction `return` retourne une valeur sérialisable en JSON |
| **Prise en charge async** | `async/await`, `fetch` et `Promise` sont tous pris en charge |
| **Bibliothèques externes** | Chargées via `@require`, mises en cache localement |
| **Délai d'expiration** | 300 secondes par défaut, personnalisable via `@timeout` |
| **API GM** | Utilisable une fois déclarée via `@grant` (ex. `CAT.agent.opfs`) |

### Bibliothèques externes `@require`

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

Les bibliothèques externes sont mises en cache au premier chargement, et les exécutions suivantes utilisent directement la version mise en cache.

## Matériel de référence

Les fichiers du répertoire `references/` servent de matériel de référence que l'IA peut consulter. Lorsque l'IA en a besoin, elle les lit via l'outil intégré `read_reference`.

Contenu adapté au matériel de référence :
- Documentation d'API
- Spécifications de formats de données
- Collections d'exemples d'utilisation
- Documents de connaissances spécialisées

## Dépôt d'exemples

Il existe un dépôt d'exemples de Skills maintenu officiellement, contenant plusieurs Skills prêts à l'emploi et des exemples d'API de scripts :

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Liste des Skills :**

| Répertoire | Description | Installation |
|------|------|------|
| `browser-automation/` | Analyse de page, manipulation du DOM, remplissage de formulaires, captures d'écran, navigation | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Tâches planifiées Cron (mode interne + événement) | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | Aide à créer, tester et empaqueter de nouveaux Skills | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | Analyse les formats de fichiers courants (Excel, PDF, Word, CSV, PPT) | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | Assistant de développement de scripts ScriptCat/Tampermonkey | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | Lecture/écriture de feuilles de calcul Synology Office | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | Assistant de gestion de compte officiel WeChat — collecte de contenu, rédaction d'articles et publication | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | Assistant de gestion Xiaohongshu (RED) — rédaction de notes, génération d'images et publication | [Installer](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**Exemples de code :**

| Répertoire | Description |
|------|------|
| `examples/conversation/` | Exemples d'API de dialogue — chat, streaming, appels d'outils |
| `examples/dom/` | Exemples d'API DOM — lecture de pages, remplissage de formulaires, gestion des onglets |
| `examples/config/` | Exemples de configuration de Skill — déclaration des champs de config et utilisation de `CAT_CONFIG` |
| `examples/page_copilot.user.js` | Un exemple complet de script utilisateur — assistant IA clic droit avec interface en streaming |

C'est une bonne idée de commencer à apprendre le développement de Skills à partir du code du dépôt d'exemples.

## Méthodes d'installation

### Installer depuis une URL

Ouvrez une URL `SKILL.cat.md` directement dans votre navigateur ; ScriptCat l'interceptera et affichera une page d'installation.

Vous pouvez aussi procéder depuis la page de gestion → Agent → Gestion des Skills :

1. Cliquez sur le bouton d'installation par URL
2. Collez l'URL du fichier `SKILL.cat.md`
3. Confirmez l'installation

ScriptCat récupère d'abord `SKILL.cat.md`, puis récupère les autres fichiers par leurs chemins relatifs en fonction des `scripts` et `references` déclarés dans son frontmatter. Après l'installation, `installUrl` est enregistré, de sorte que les mises à jour peuvent ensuite être vérifiées par numéro de version.

### Installer depuis un script

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

## Comment les Skills sont chargés

Les Skills utilisent un chargement progressif à trois niveaux pour optimiser l'utilisation du contexte :

| Niveau | Quand | Contenu |
|------|------|------|
| **Résumé** | Au début d'une conversation | Nom du Skill + description + liste d'outils (injectés dans l'invite système) |
| **Invite** | Lorsque l'IA appelle activement `load_skill` | Le corps complet de `SKILL.cat.md` |
| **Outils** | Après `load_skill` | Les SkillScripts sont enregistrés comme outils LLM appelables |

L'IA appelle `load_skill` automatiquement lorsqu'elle doit charger le contenu complet et les outils d'un Skill.

## Exemple complet

### Structure de répertoire

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
