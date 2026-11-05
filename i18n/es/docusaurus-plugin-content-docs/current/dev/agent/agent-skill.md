---
title: API de gestión de Skills
---

`@grant CAT.agent.skills`

La API de gestión de Skills permite a un script consultar, instalar, eliminar y llamar paquetes de extensión Skill.

Para el desarrollo y empaquetado de Skills, consulte la [Guía de desarrollo de Skills](../agent-skill-dev). Ejemplos oficiales de Skills: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — listar Skills instaladas

```javascript
const skills = await CAT.agent.skills.list();
```

**Devuelve `SkillSummary[]`:**

| Campo | Tipo | Descripción |
|------|------|------|
| `name` | `string` | Nombre de la Skill |
| `description` | `string` | Descripción de la Skill |
| `toolNames` | `string[]` | Nombres de las herramientas SkillScript que contiene |
| `referenceNames` | `string[]` | Nombres de los archivos de material de referencia que contiene |
| `hasConfig` | `boolean` | Si declara campos de configuración |
| `enabled` | `boolean` | Si está habilitada (por defecto `true`) |
| `installtime` | `number` | Marca de tiempo de instalación |
| `updatetime` | `number` | Marca de tiempo de última actualización |

> Nota: `version` e `installUrl` (usados por la función de verificación de actualizaciones de la página de gestión) no se devuelven a través de esta API de script — solo se usan internamente por la lógica de verificación de actualizaciones y la interfaz de la página de gestión.

## get — obtener detalles de una Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Devuelve el `SkillRecord` completo, o `null` si no existe.

**Estructura de `SkillRecord`:**

Hereda todos los campos de `SkillSummary`, más:

| Campo | Tipo | Descripción |
|------|------|------|
| `prompt` | `string` | El cuerpo Markdown de `SKILL.cat.md` (el prompt dado a la IA) |
| `config` | `Record<string, SkillConfigField>` | Definiciones de campos de configuración (esquema) |

**Estructura de `SkillConfigField`:**

| Campo | Tipo | Descripción |
|------|------|------|
| `title` | `string` | Título de visualización |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Tipo de campo |
| `secret` | `boolean` | Si es sensible (enmascarado en la interfaz) |
| `required` | `boolean` | Si es obligatorio |
| `default` | `unknown` | Valor por defecto |
| `values` | `string[]` | Lista de opciones (solo tipo `select`) |

## install — instalar una Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parámetros:**

| Parámetro | Tipo | Descripción |
|------|------|------|
| `skillMd` | `string` | Contenido del archivo `SKILL.cat.md` (obligatorio) |
| `scripts` | `Array<{ name, code }>` | Lista de archivos SkillScript |
| `references` | `Array<{ name, content }>` | Lista de archivos de material de referencia |

Si ya existe una Skill con el mismo nombre, la actualiza.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Herramienta de búsqueda personalizada
---

Usa la herramienta de búsqueda cuando el usuario necesite buscar.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# Documentación API\n..." }]
);
```

## remove — desinstalar una Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Devuelve `true` si se eliminó correctamente, `false` si la Skill no existe.

## call — llamar un SkillScript directamente

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Ejecuta un SkillScript en la Skill especificada directamente, sin pasar por una conversación con IA.

**Parámetros:**

| Parámetro | Tipo | Descripción |
|------|------|------|
| `skillName` | `string` | Nombre de la Skill (obligatorio) |
| `scriptName` | `string` | Nombre del SkillScript (obligatorio) |
| `params` | `Record<string, unknown>` | Parámetros a pasar (coincidentes con las declaraciones `@param`) |

```javascript
// Llamar el script de búsqueda dentro de una Skill directamente
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> La ejecución de SkillScript tiene un tiempo de espera (300 segundos por defecto, personalizable con `@timeout`).
