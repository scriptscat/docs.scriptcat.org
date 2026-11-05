---
title: Skill Management API
---

`@grant CAT.agent.skills`

The Skill Management API lets a script query, install, uninstall, and invoke Skill packages.

For Skill development and packaging, see the [Skill Development Guide](../agent-skill-dev). Official Skill example repository: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — List Installed Skills

```javascript
const skills = await CAT.agent.skills.list();
```

**Return value, SkillSummary[]:**

| Field | Type | Description |
|------|------|------|
| `name` | `string` | Skill name |
| `description` | `string` | Skill description |
| `version` | `string` | Version number (semver) |
| `toolNames` | `string[]` | List of included SkillScript tool names |
| `referenceNames` | `string[]` | List of included reference-material file names |
| `hasConfig` | `boolean` | Whether config fields are declared |
| `enabled` | `boolean` | Whether it's enabled (defaults to `true`) |
| `installUrl` | `string` | The install source URL (used for update checks) |
| `installtime` | `number` | Install timestamp |
| `updatetime` | `number` | Update timestamp |

## get — Get Skill Details

```javascript
const skill = await CAT.agent.skills.get(name);
```

Returns the full `SkillRecord`, or `null` if it doesn't exist.

**SkillRecord structure:**

Inherits all fields from `SkillSummary`, plus:

| Field | Type | Description |
|------|------|------|
| `prompt` | `string` | The Markdown body of SKILL.cat.md (the prompt given to the AI) |
| `config` | `Record<string, SkillConfigField>` | The config field definitions (schema) |

**SkillConfigField structure:**

| Field | Type | Description |
|------|------|------|
| `title` | `string` | Display title |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Field type |
| `secret` | `boolean` | Whether it's sensitive information (masked in the UI) |
| `required` | `boolean` | Whether it's required |
| `default` | `unknown` | Default value |
| `values` | `string[]` | The option list (only for the `select` type) |

## install — Install a Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parameters:**

| Parameter | Type | Description |
|------|------|------|
| `skillMd` | `string` | The content of the SKILL.cat.md file (required) |
| `scripts` | `Array<{ name, code }>` | The list of SkillScript files |
| `references` | `Array<{ name, content }>` | The list of reference-material files |

If a Skill with the same name already exists, this performs an update instead.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Custom search tool
---

When the user needs to search, use the search tool.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API Documentation\n..." }]
);
```

## remove — Uninstall a Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Returns `true` if the uninstall succeeded, `false` if the Skill doesn't exist.

## call — Directly Invoke a SkillScript

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Directly executes a SkillScript from the given Skill, bypassing the AI conversation.

**Parameters:**

| Parameter | Type | Description |
|------|------|------|
| `skillName` | `string` | Skill name (required) |
| `scriptName` | `string` | SkillScript name (required) |
| `params` | `Record<string, unknown>` | The parameters to pass in (matching the `@param` declarations) |

```javascript
// Directly call a search script from a Skill
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript execution has a timeout limit (300 seconds by default, customizable via `@timeout`).
