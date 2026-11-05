---
title: Agent
---

:::caution Թեստավորման փուլ
Agent հնարավորությունը ներկայումս դեռ թեստավորման փուլում է. հետևյալ API-ները և վարքագիծը կարող են փոխվել պաշտոնական թողարկումից առաջ:
:::

## Ուսումնասիրություն

ScriptCat v1.4-ը ներկայացնում է Agent համակարգը՝ օգտագործողի սկրիպտներին տալով մի շարք կարողություններ՝ ներառյալ AI զրույցը, զննարկչի ավտոմատացումը, ֆայլերի կառավարումը և պլանավորված առաջադրանքները:

Սկրիպտները կանչում են այս կարողությունները `CAT.agent.*` անվանատարածքի միջոցով, և յուրաքանչյուր API պահանջում է համապատասխան թույլտվության հայտարարում `@grant`-ով:

## Հնարավորությունների մոդուլներ

| Մոդուլ | Թույլտվություն | Նկարագրություն |
|------|---------|------|
| [Զրույց](./agent-conversation) | `@grant CAT.agent.conversation` | AI զրույցների ստեղծում, հաղորդագրությունների ուղարկում, հոսքային պատասխաններ, կաստոմ գործիքների սահմանում |
| [DOM գործողություններ](./agent-dom) | `@grant CAT.agent.dom` | Էջի նավիգացիա, սքրինշոթներ, սեղմում, լրացում, ոլորում, DOM մոնիտորինգ |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Skill փաթեթների տեղադրում/հեռացում/կանչում |
| [Պլանավորված առաջադրանքներ](./agent-task) | `@grant CAT.agent.task` | Cron պլանավորված առաջադրանքներ, իրադարձությունների լսում |
| [Մոդել](./agent-model) | `@grant CAT.agent.model` | Կարգավորված մոդելի տեղեկատվության հարցում (միայն կարդալու) |
| [OPFS ֆայլեր](./agent-opfs) | `@grant CAT.agent.opfs` | Agent աշխատանքային տարածքի ֆայլերի ընթերցում/գրառում |
| [MCP](./agent-mcp) | — | MCP սերվերի կապերի կարգավորում (միայն կառավարման էջ, առանց սկրիպտ API) |
| [Skill մշակում](./agent-skill-dev) | — | SKILL.cat.md + SkillScript մշակման ուղեցույց |

## Արագ մեկնարկ

Ամենապարզ հնարավոր Agent սկրիպտը՝

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Hi, please introduce yourself");
console.log(reply.content);
```

## Ճարտարապետության ուսումնասիրություն

Agent համակարգը տարածվում է զննարկչի ընդլայնման ներսում բազմաթիվ մեկուսացված կոնտեքստերի վրայով՝

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

### Պահեստավորման կառուցվածք

Agent-ը տվյալները պահում է զննարկչի OPFS (Origin Private File System) միջոցով՝

```
agents/
├── conversations/       # conversation history
├── attachments/         # attachments (images, files)
├── skills/{name}/       # Skill package files
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # scheduled task config and execution records
└── workspace/           # user workspace files (the directory opfs_* tools operate on)
```

### Աջակցվող մոդելներ

| Մատակարար | Ձևաչափ | Հնարավորություններ |
|----------|------|------|
| OpenAI-համատեղելի | OpenAI Chat Completions API | Աջակցում է GPT-4o, DeepSeek և այլ համատեղելի մոդելներին |
| Anthropic | Anthropic Messages API | Աջակցում է Claude ընտանիքին, Prompt Caching |
| Zhipu | Zhipu API | Աջակցում է GLM մոդելների ընտանիքին |

Կառավարման վահանակում «Մոդելի կարգավորում» բաժնում ավելացրեք Մատակարար և API Բանալի՝ այն օգտագործելու համար:

### Skill էկոհամակարգը

Skill-ը փաթեթ է, որը համատեղում է պրոմպտները + գործիքի սկրիպտները + հղման նյութը՝ թույլ տալով ձեզ դոմեն-հատուկ գիտելիքներ և կաստոմ գործիքներ ներարկել Agent-ի մեջ:

**Պաշտոնական Skill պահեստ. [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Ներառում է պատրաստի օգտագործման Skills զննարկչի ավտոմատացման, պլանավորված առաջադրանքների, Skill ստեղծման գործիքի, զրույցի/DOM/կոնֆիգ օրինակների և այլնի համար:

**Տեղադրման մեթոդներ՝**

- **URL տեղադրում** — բացեք `SKILL.cat.md` URL-ը ուղղակիորեն զննարկչում. ScriptCat-ը ավտոմատ կերպով այն կընդհատի և կցուցադրի տեղադրման էջը: Կարող եք նաև տեղադրել URL-ը կառավարման վահանակի Agent → Skill Կառավարում բաժնում:
- **Սկրիպտի տեղադրում** — ծրագրային կերպով տեղադրեք `CAT.agent.skills.install()` API-ի միջոցով

**Թարմացումների ստուգում՝**

URL-ի միջոցով տեղադրված Skill-ը գրանցում է իր տեղադրման աղբյուրը. կառավարման վահանակը թույլ է տալիս ստուգել թարմացումները և մեկ սեղմումով թարմացնել (հիմնված `version` դաշտի semver համեմատության վրա):

Մանրամասների համար տեսեք [Skill կառավարման API](./agent-skill) և [Skill մշակման ուղեցույց](./agent-skill-dev):
