---
title: Agent
---

:::caution Fase di test
La funzionalità Agent è attualmente ancora in fase di test; le seguenti API e comportamenti potrebbero cambiare prima del rilascio ufficiale.
:::

## Panoramica

ScriptCat v1.4 introduce il sistema Agent, fornendo agli script utente un insieme di capacità che includono conversazione AI, automazione del browser, gestione dei file e task programmati.

Gli script chiamano queste capacità attraverso il namespace `CAT.agent.*`, e ogni API richiede che venga dichiarato il permesso corrispondente con `@grant`.

## Moduli funzionali

| Modulo | Permesso | Descrizione |
|------|---------|------|
| [Conversazione](./agent-conversation) | `@grant CAT.agent.conversation` | Creare conversazioni AI, inviare messaggi, trasmettere risposte, definire strumenti personalizzati |
| [Operazioni DOM](./agent-dom) | `@grant CAT.agent.dom` | Navigazione pagine, screenshot, clic, compilazione, scroll, monitoraggio DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Installare/disinstallare/invocare pacchetti Skill |
| [Task programmati](./agent-task) | `@grant CAT.agent.task` | Task Cron programmati, ascolto eventi |
| [Modello](./agent-model) | `@grant CAT.agent.model` | Interrogare informazioni sui modelli configurati (sola lettura) |
| [File OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Leggere/scrivere file dell'area di lavoro di Agent |
| [MCP](./agent-mcp) | — | Configurare connessioni server MCP (solo pagina di amministrazione, senza API script) |
| [Sviluppo Skill](./agent-skill-dev) | — | Guida allo sviluppo di SKILL.cat.md + SkillScript |

## Inizio rapido

Lo script Agent più semplice possibile:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Ciao, per favore presentati");
console.log(reply.content);
```

## Panoramica dell'architettura

Il sistema Agent si estende su più contesti isolati all'interno dell'estensione del browser:

```
Script utente → Sandbox (esecuzione isolata)
              ↓ WindowMessage
           Offscreen (accesso DOM)
              ↓ ExtensionMessage
           Service Worker (programmazione centrale)
              ├── Provider LLM (OpenAI / Anthropic)
              ├── ToolRegistry (registrazione e esecuzione strumenti)
              ├── SkillScriptExecutor (esecuzione script Skill)
              ├── MCPClient (client protocollo MCP)
              └── TaskScheduler (programmazione task)
```

### Struttura di archiviazione

Agent memorizza i dati usando l'OPFS (Origin Private File System) del browser:

```
agents/
├── conversations/       # cronologia conversazioni
├── attachments/         # allegati (immagini, file)
├── skills/{name}/       # file pacchetti Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # configurazione e record di esecuzione task programmati
└── workspace/           # file area di lavoro utente (la directory su cui operano gli strumenti opfs_*)
```

### Modelli supportati

| Provider | Formato | Caratteristiche |
|----------|------|------|
| Compatibile OpenAI | API OpenAI Chat Completions | Supporta GPT-4o, DeepSeek e altri modelli compatibili |
| Anthropic | API Anthropic Messages | Supporta la famiglia Claude, Prompt Caching |
| 智譜 | API 智譜 | Supporta la famiglia di modelli GLM |

Aggiungere un Provider e chiave API sotto "Configurazione modello" nella dashboard per utilizzarlo.

### L'ecosistema Skill

Uno Skill è un pacchetto che combina prompt + script strumenti + materiale di riferimento, permettendo di iniettare conoscenza specifica del dominio e strumenti personalizzati nell'Agent.

**Repository ufficiale Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Include Skill pronti all'uso per automazione browser, task programmati, uno strumento di creazione Skill, esempi di conversazione/DOM/configurazione e altro.

**Metodi di installazione:**

- **Installazione URL** — aprire direttamente l'URL di `SKILL.cat.md` nel browser; ScriptCat lo intercetta automaticamente e mostra la pagina di installazione. È anche possibile incollare l'URL sotto Agent → Gestione Skill nella dashboard.
- **Installazione script** — installare programmaticamente tramite l'API `CAT.agent.skills.install()`

**Verifica aggiornamenti:**

Uno Skill installato tramite URL registra la sua fonte di installazione; la dashboard consente di verificare gli aggiornamenti e aggiornare con un clic (basato sul confronto semver del campo `version`).

Consultare [API gestione Skill](./agent-skill) e [Guida allo sviluppo Skill](./agent-skill-dev) per i dettagli.
