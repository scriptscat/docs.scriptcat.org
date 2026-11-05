---
title: Agent
---

:::caution Testfase
De Agent-functie bevindt zich momenteel nog in een testfase; de volgende API's en het gedrag kunnen vóór de officiële release veranderen.
:::

## Overzicht

ScriptCat v1.4 introduceert het Agent-systeem, dat gebruikersscripts een reeks mogelijkheden biedt, waaronder AI-gesprekken, browserautomatisering, bestandsbeheer en geplande taken.

Scripts roepen deze mogelijkheden aan via de naamruimte `CAT.agent.*`, en elke API vereist dat de bijbehorende machtiging wordt gedeclareerd met `@grant`.

## Functiemodules

| Module | Machtiging | Beschrijving |
|------|---------|------|
| [Gesprek](./agent-conversation) | `@grant CAT.agent.conversation` | AI-gesprekken maken, berichten verzenden, reacties streamen, aangepaste tools definiëren |
| [DOM-bewerkingen](./agent-dom) | `@grant CAT.agent.dom` | Paginanavigatie, schermafbeeldingen, klikken, invullen, scrollen, DOM-bewaking |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Skill-pakketten installeren/verwijderen/aanroepen |
| [Geplande taken](./agent-task) | `@grant CAT.agent.task` | Cron-geplande taken, gebeurtenisluisteren |
| [Model](./agent-model) | `@grant CAT.agent.model` | Geconfigureerde modelinformatie opvragen (alleen-lezen) |
| [OPFS-bestanden](./agent-opfs) | `@grant CAT.agent.opfs` | Agent-werkruimtebestanden lezen/schrijven |
| [MCP](./agent-mcp) | — | MCP-serververbindingen configureren (alleen beheerpagina, geen script-API) |
| [Skill-ontwikkeling](./agent-skill-dev) | — | SKILL.cat.md + SkillScript-ontwikkelgids |

## Snelstart

Het eenvoudigst mogelijke Agent-script:

```javascript
// ==UserScript==
// @name        Hallo Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Hoi, stel jezelf alsjeblieft voor");
console.log(reply.content);
```

## Architectuuroverzicht

Het Agent-systeem omvat meerdere geïsoleerde contexten binnen de browserextensie:

```
User script → Sandbox (isolated execution)
              ↓ WindowMessage
           Offscreen (DOM access)
              ↓ ExtensionMessage
           Service Worker (core scheduling)
              ├── LLM Provider (OpenAI / Anthropic)
              ├── ToolRegistry (tool registration and execution)
              ├── SkillScriptExecutor (Skill script execution)
              ├── MCPClient (MCP protocol client)
              └── TaskScheduler (scheduled task scheduling)
```

### Opslagstructuur

De Agent slaat gegevens op met behulp van de OPFS (Origin Private File System) van de browser:

```
agents/
├── conversations/       # gespreksgeschiedenis
├── attachments/         # bijlagen (afbeeldingen, bestanden)
├── skills/{name}/       # Skill-pakketbestanden
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # configuratie en uitvoeringsrecords van geplande taken
└── workspace/           # gebruikerswerkruimtebestanden (de map waarop opfs_*-tools werken)
```

### Ondersteunde modellen

| Provider | Indeling | Functies |
|----------|------|------|
| OpenAI-compatibel | OpenAI Chat Completions API | Ondersteunt GPT-4o, DeepSeek en andere compatibele modellen |
| Anthropic | Anthropic Messages API | Ondersteunt de Claude-familie, Prompt Caching |
| Zhipu | Zhipu API | Ondersteunt de GLM-modelfamilie |

Voeg een Provider en API-sleutel toe onder "Modelconfiguratie" in het dashboard om het te gebruiken.

### Het Skill-ecosysteem

Een Skill is een pakket dat prompts + toolscripts + referentiemateriaal combineert, waarmee u domeinspecifieke kennis en aangepaste tools aan de Agent kunt toevoegen.

**Officiële Skill-repository: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Bevat kant-en-klare Skills voor browserautomatisering, geplande taken, een Skill-aanmaaktool, gespreks-/DOM-/configuratievoorbeelden en meer.

**Installatiemethoden:**

- **URL-installatie** — open de `SKILL.cat.md`-URL rechtstreeks in de browser; ScriptCat onderschept deze automatisch en toont de installatiepagina. U kunt de URL ook plakken onder het dashboard bij Agent → Skillbeheer.
- **Scriptinstallatie** — programmatisch installeren via de `CAT.agent.skills.install()`-API

**Controleren op updates:**

Een via URL geïnstalleerde Skill registreert de installatiebron; het dashboard maakt het mogelijk om met één klik op updates te controleren en te upgraden (op basis van semver-vergelijking van het veld `version`).

Zie [Skill-beheer-API](./agent-skill) en [Skill-ontwikkelgids](./agent-skill-dev) voor details.
