---
title: Skill կառավարման API
---

`@grant CAT.agent.skills`

Skill կառավարման API-ն թույլ է տալիս սկրիպտին հարցում կատարել, տեղադրել, հեռացնել և կանչել Skill ընդլայնման փաթեթներ:

Skill-ի մշակման և փաթեթավորման համար տեսեք [Skill մշակման ուղեցույցը](../agent-skill-dev): Պաշտոնական Skill օրինակներ. [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills):

## list — ցուցակագրել տեղադրված Skills-ը

```javascript
const skills = await CAT.agent.skills.list();
```

**Վերադարձնում է `SkillSummary[]`՝**

| Դաշտ | Տիպ | Նկարագրություն |
|------|------|------|
| `name` | `string` | Skill անուն |
| `description` | `string` | Skill նկարագրություն |
| `toolNames` | `string[]` | Դրա պարունակած SkillScript գործիքների անունները |
| `referenceNames` | `string[]` | Դրա պարունակած հղման նյութերի ֆայլերի անունները |
| `hasConfig` | `boolean` | Արդյոք հայտարարում է կոնֆիգուրացիայի դաշտեր |
| `enabled` | `boolean` | Արդյոք միացված է (լռելյայն՝ `true`) |
| `installtime` | `number` | Տեղադրման ժամանակի դրոշմ |
| `updatetime` | `number` | Վերջին թարմացման ժամանակի դրոշմ |

> Նշում. `version`-ը և `installUrl`-ը (որոնք օգտագործվում են կառավարման էջի թարմացման ստուգման հնարավորության կողմից) չեն վերադարձվում այս սկրիպտ API-ի միջոցով — դրանք ներքին օգտագործվում են միայն թարմացման ստուգման տրամաբանության և կառավարման էջի UI-ի կողմից:

## get — ստանալ Skill մանրամասներ

```javascript
const skill = await CAT.agent.skills.get(name);
```

Վերադարձնում է ամբողջական `SkillRecord`-ը, կամ `null`, եթե այն գոյություն չունի:

**`SkillRecord` կառուցվածքը՝**

Ժառանգում է բոլոր դաշտերը `SkillSummary`-ից, գումարած՝

| Դաշտ | Տիպ | Նկարագրություն |
|------|------|------|
| `prompt` | `string` | `SKILL.cat.md`-ի Markdown մարմինը (AI-ին տրված պրոմպտը) |
| `config` | `Record<string, SkillConfigField>` | Կոնֆիգուրացիայի դաշտերի սահմանումներ (սխեմա) |

**`SkillConfigField` կառուցվածքը՝**

| Դաշտ | Տիպ | Նկարագրություն |
|------|------|------|
| `title` | `string` | Ցուցադրվող վերնագիր |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Դաշտի տիպ |
| `secret` | `boolean` | Արդյոք զգայուն է (UI-ում քողարկված) |
| `required` | `boolean` | Արդյոք պարտադիր է |
| `default` | `unknown` | Լռելյայն արժեք |
| `values` | `string[]` | Տարբերակների ցուցակ (միայն `select` տիպ) |

## install — Skill-ի տեղադրում

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Պարամետրեր՝**

| Պարամետր | Տիպ | Նկարագրություն |
|------|------|------|
| `skillMd` | `string` | `SKILL.cat.md` ֆայլի բովանդակությունը (պարտադիր) |
| `scripts` | `Array<{ name, code }>` | SkillScript ֆայլերի ցուցակ |
| `references` | `Array<{ name, content }>` | Հղման նյութերի ֆայլերի ցուցակ |

Եթե նույն անունով Skill արդեն գոյություն ունի, սա թարմացնում է այն:

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Custom search tool
---

Use the search tool when the user needs to search.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API Docs\n..." }]
);
```

## remove — Skill-ի հեռացում

```javascript
const success = await CAT.agent.skills.remove(name);
```

Վերադարձնում է `true`, եթե հաջողությամբ հեռացվել է, `false`, եթե Skill-ը գոյություն չունի:

## call — SkillScript-ի ուղղակի կանչ

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Կատարում է SkillScript-ը նշված Skill-ում ուղղակիորեն՝ առանց AI զրույցի միջով անցնելու:

**Պարամետրեր՝**

| Պարամետր | Տիպ | Նկարագրություն |
|------|------|------|
| `skillName` | `string` | Skill անուն (պարտադիր) |
| `scriptName` | `string` | SkillScript անուն (պարտադիր) |
| `params` | `Record<string, unknown>` | Ներփոխանցվող պարամետրերը (`@param` հայտարարություններին համապատասխան) |

```javascript
// Call the search script inside a Skill directly
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript-ի կատարումն ունի թայմաութ (լռելյայն 300 վայրկյան, կաստոմիզացվող է `@timeout`-ի միջոցով):
