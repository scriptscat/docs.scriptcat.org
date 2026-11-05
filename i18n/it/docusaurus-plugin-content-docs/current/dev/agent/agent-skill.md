---
title: API di gestione delle Skill
---

`@grant CAT.agent.skills`

L'API di gestione delle Skill permette a uno script di interrogare, installare, rimuovere e richiamare pacchetti di estensione Skill.

Per lo sviluppo e il packaging delle Skill, consultare la [Guida allo sviluppo delle Skill](../agent-skill-dev). Esempi ufficiali di Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — elencare le Skill installate

```javascript
const skills = await CAT.agent.skills.list();
```

**Restituisce `SkillSummary[]`:**

| Campo | Tipo | Descrizione |
|------|------|------|
| `name` | `string` | Nome della Skill |
| `description` | `string` | Descrizione della Skill |
| `toolNames` | `string[]` | Nomi degli strumenti SkillScript contenuti |
| `referenceNames` | `string[]` | Nomi dei file di materiale di riferimento contenuti |
| `hasConfig` | `boolean` | Se dichiara campi di configurazione |
| `enabled` | `boolean` | Se è abilitata (predefinito `true`) |
| `installtime` | `number` | Timestamp di installazione |
| `updatetime` | `number` | Timestamp di ultimo aggiornamento |

> Nota: `version` e `installUrl` (usati dalla funzione di verifica aggiornamenti della pagina di gestione) non vengono restituiti attraverso questa API script — sono usati solo internamente dalla logica di verifica aggiornamenti e dall'interfaccia della pagina di gestione.

## get — ottenere i dettagli di una Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Restituisce il `SkillRecord` completo, o `null` se non esiste.

**Struttura di `SkillRecord`:**

Eredita tutti i campi di `SkillSummary`, più:

| Campo | Tipo | Descrizione |
|------|------|------|
| `prompt` | `string` | Il corpo Markdown di `SKILL.cat.md` (il prompt dato all'AI) |
| `config` | `Record<string, SkillConfigField>` | Definizioni dei campi di configurazione (schema) |

**Struttura di `SkillConfigField`:**

| Campo | Tipo | Descrizione |
|------|------|------|
| `title` | `string` | Titolo di visualizzazione |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Tipo di campo |
| `secret` | `boolean` | Se è sensibile (mascherato nell'interfaccia) |
| `required` | `boolean` | Se è obbligatorio |
| `default` | `unknown` | Valore predefinito |
| `values` | `string[]` | Elenco delle opzioni (solo tipo `select`) |

## install — installare una Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|------|------|------|
| `skillMd` | `string` | Contenuto del file `SKILL.cat.md` (obbligatorio) |
| `scripts` | `Array<{ name, code }>` | Elenco dei file SkillScript |
| `references` | `Array<{ name, content }>` | Elenco dei file di materiale di riferimento |

Se esiste già una Skill con lo stesso nome, la aggiorna.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Strumento di ricerca personalizzato
---

Usa lo strumento di ricerca quando l'utente ha bisogno di cercare.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# Documentazione API\n..." }]
);
```

## remove — disinstallare una Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Restituisce `true` se rimossa con successo, `false` se la Skill non esiste.

## call — richiamare un SkillScript direttamente

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Esegue un SkillScript nella Skill specificata direttamente, senza passare attraverso una conversazione AI.

**Parametri:**

| Parametro | Tipo | Descrizione |
|------|------|------|
| `skillName` | `string` | Nome della Skill (obbligatorio) |
| `scriptName` | `string` | Nome dello SkillScript (obbligatorio) |
| `params` | `Record<string, unknown>` | Parametri da passare (corrispondenti alle dichiarazioni `@param`) |

```javascript
// Richiamare lo script di ricerca all'interno di una Skill direttamente
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> L'esecuzione di SkillScript ha un timeout (300 secondi predefiniti, personalizzabile con `@timeout`).
