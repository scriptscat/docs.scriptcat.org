---
title: API de gestion des Skills
---

`@grant CAT.agent.skills`

L'API de gestion des Skills permet à un script d'interroger, installer, supprimer et appeler des packs d'extension Skill.

Pour le développement et l'empaquetage de Skills, voir le [Guide de développement des Skills](../agent-skill-dev). Exemples de Skills officiels : [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — lister les Skills installés

```javascript
const skills = await CAT.agent.skills.list();
```

**Retourne `SkillSummary[]` :**

| Champ | Type | Description |
|------|------|------|
| `name` | `string` | Nom du Skill |
| `description` | `string` | Description du Skill |
| `toolNames` | `string[]` | Noms des outils SkillScript qu'il contient |
| `referenceNames` | `string[]` | Noms des fichiers de matériel de référence qu'il contient |
| `hasConfig` | `boolean` | Indique s'il déclare des champs de configuration |
| `enabled` | `boolean` | Indique s'il est activé (défaut : `true`) |
| `installtime` | `number` | Horodatage d'installation |
| `updatetime` | `number` | Horodatage de dernière mise à jour |

> Remarque : `version` et `installUrl` (utilisés par la fonction de vérification des mises à jour de la page de gestion) ne sont pas retournés via cette API de script — ils ne sont utilisés qu'en interne par la logique de vérification des mises à jour et par l'interface de la page de gestion.

## get — obtenir les détails d'un Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Retourne le `SkillRecord` complet, ou `null` s'il n'existe pas.

**Forme de `SkillRecord` :**

Hérite de tous les champs de `SkillSummary`, plus :

| Champ | Type | Description |
|------|------|------|
| `prompt` | `string` | Le corps Markdown de `SKILL.cat.md` (l'invite donnée à l'IA) |
| `config` | `Record<string, SkillConfigField>` | Définitions des champs de configuration (schéma) |

**Forme de `SkillConfigField` :**

| Champ | Type | Description |
|------|------|------|
| `title` | `string` | Titre d'affichage |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Type de champ |
| `secret` | `boolean` | Indique s'il est sensible (masqué dans l'interface) |
| `required` | `boolean` | Indique s'il est obligatoire |
| `default` | `unknown` | Valeur par défaut |
| `values` | `string[]` | Liste d'options (type `select` uniquement) |

## install — installer un Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Paramètres :**

| Paramètre | Type | Description |
|------|------|------|
| `skillMd` | `string` | Contenu du fichier `SKILL.cat.md` (obligatoire) |
| `scripts` | `Array<{ name, code }>` | Liste des fichiers SkillScript |
| `references` | `Array<{ name, content }>` | Liste des fichiers de matériel de référence |

Si un Skill portant le même nom existe déjà, celui-ci est mis à jour.

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

## remove — désinstaller un Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Retourne `true` si la suppression a réussi, `false` si le Skill n'existe pas.

## call — appeler un SkillScript directement

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Exécute un SkillScript du Skill spécifié directement, sans passer par une conversation IA.

**Paramètres :**

| Paramètre | Type | Description |
|------|------|------|
| `skillName` | `string` | Nom du Skill (obligatoire) |
| `scriptName` | `string` | Nom du SkillScript (obligatoire) |
| `params` | `Record<string, unknown>` | Paramètres à transmettre (correspondant aux déclarations `@param`) |

```javascript
// Call the search script inside a Skill directly
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> L'exécution d'un SkillScript a un délai d'expiration (300 secondes par défaut, personnalisable via `@timeout`).
