---
title: Skill-beheer-API
---

`@grant CAT.agent.skills`

Met de Skill-beheer-API kan een script Skill-uitbreidingspakketten opvragen, installeren, verwijderen en aanroepen.

Voor Skill-ontwikkeling en -verpakking, zie de [Skill-ontwikkelgids](../agent-skill-dev). Officiële Skill-voorbeelden: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — geïnstalleerde Skills weergeven

```javascript
const skills = await CAT.agent.skills.list();
```

**Retourneert `SkillSummary[]`:**

| Veld | Type | Beschrijving |
|------|------|------|
| `name` | `string` | Skillnaam |
| `description` | `string` | Skillbeschrijving |
| `toolNames` | `string[]` | Namen van de SkillScript-tools die het bevat |
| `referenceNames` | `string[]` | Namen van de referentiemateriaalbestanden die het bevat |
| `hasConfig` | `boolean` | Of het configuratievelden declareert |
| `enabled` | `boolean` | Of het is ingeschakeld (standaard `true`) |
| `installtime` | `number` | Installatietijdstempel |
| `updatetime` | `number` | Tijdstempel van laatste update |

> Opmerking: `version` en `installUrl` (gebruikt door de updatecontrolefunctie van de beheerpagina) worden niet via deze script-API geretourneerd — ze worden alleen intern gebruikt door de updatecontrolelogica en de interface van de beheerpagina.

## get — Skill-details ophalen

```javascript
const skill = await CAT.agent.skills.get(name);
```

Retourneert de volledige `SkillRecord`, of `null` als deze niet bestaat.

**Vorm van `SkillRecord`:**

Erft alle velden van `SkillSummary`, plus:

| Veld | Type | Beschrijving |
|------|------|------|
| `prompt` | `string` | De Markdown-body van `SKILL.cat.md` (de prompt die aan de AI wordt gegeven) |
| `config` | `Record<string, SkillConfigField>` | Definitie van configuratievelden (schema) |

**Vorm van `SkillConfigField`:**

| Veld | Type | Beschrijving |
|------|------|------|
| `title` | `string` | Weergavetitel |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Veldtype |
| `secret` | `boolean` | Of het gevoelig is (gemaskeerd in de interface) |
| `required` | `boolean` | Of het verplicht is |
| `default` | `unknown` | Standaardwaarde |
| `values` | `string[]` | Optielijst (alleen `select`-type) |

## install — een Skill installeren

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parameters:**

| Parameter | Type | Beschrijving |
|------|------|------|
| `skillMd` | `string` | Inhoud van het `SKILL.cat.md`-bestand (vereist) |
| `scripts` | `Array<{ name, code }>` | Lijst van SkillScript-bestanden |
| `references` | `Array<{ name, content }>` | Lijst van referentiemateriaalbestanden |

Als er al een Skill met dezelfde naam bestaat, wordt deze bijgewerkt.

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

## remove — een Skill verwijderen

```javascript
const success = await CAT.agent.skills.remove(name);
```

Retourneert `true` als deze succesvol is verwijderd, `false` als de Skill niet bestaat.

## call — een SkillScript rechtstreeks aanroepen

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Voert een SkillScript in de opgegeven Skill rechtstreeks uit, zonder een AI-gesprek.

**Parameters:**

| Parameter | Type | Beschrijving |
|------|------|------|
| `skillName` | `string` | Skillnaam (vereist) |
| `scriptName` | `string` | SkillScriptnaam (vereist) |
| `params` | `Record<string, unknown>` | Door te geven parameters (overeenkomend met de `@param`-declaraties) |

```javascript
// Roep het zoekscript binnen een Skill rechtstreeks aan
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript-uitvoering heeft een time-out (standaard 300 seconden, aanpasbaar via `@timeout`).
