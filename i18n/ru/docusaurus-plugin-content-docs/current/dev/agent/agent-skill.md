---
title: API управления Skill
---

`@grant CAT.agent.skills`

API управления Skill позволяет скрипту запрашивать, устанавливать, удалять и вызывать пакеты Skill.

О разработке и упаковке Skill см. [Руководство по разработке Skill](../agent-skill-dev). Официальный репозиторий примеров Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — список установленных Skills

```javascript
const skills = await CAT.agent.skills.list();
```

**Возвращаемое значение, SkillSummary[]:**

| Поле | Тип | Описание |
|------|------|------|
| `name` | `string` | Имя Skill |
| `description` | `string` | Описание Skill |
| `version` | `string` | Номер версии (semver) |
| `toolNames` | `string[]` | Список имён инструментов SkillScript |
| `referenceNames` | `string[]` | Список имён файлов справочных материалов |
| `hasConfig` | `boolean` | Объявлены ли поля конфигурации |
| `enabled` | `boolean` | Включён ли (по умолчанию `true`) |
| `installUrl` | `string` | URL источника установки (для проверки обновлений) |
| `installtime` | `number` | Временная метка установки |
| `updatetime` | `number` | Временная метка обновления |

## get — детали Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Возвращает полный `SkillRecord` или `null`, если не существует.

**Структура SkillRecord:**

Наследует все поля `SkillSummary`, плюс:

| Поле | Тип | Описание |
|------|------|------|
| `prompt` | `string` | Markdown-тело SKILL.cat.md (промпт для AI) |
| `config` | `Record<string, SkillConfigField>` | Определения полей конфигурации (schema) |

**Структура SkillConfigField:**

| Поле | Тип | Описание |
|------|------|------|
| `title` | `string` | Отображаемый заголовок |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Тип поля |
| `secret` | `boolean` | Конфиденциальная информация (маскируется в UI) |
| `required` | `boolean` | Обязательность |
| `default` | `unknown` | Значение по умолчанию |
| `values` | `string[]` | Список вариантов (только для типа `select`) |

## install — установить Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Параметры:**

| Параметр | Тип | Описание |
|------|------|------|
| `skillMd` | `string` | Содержимое файла SKILL.cat.md (обязательно) |
| `scripts` | `Array<{ name, code }>` | Список файлов SkillScript |
| `references` | `Array<{ name, content }>` | Список файлов справочных материалов |

Если Skill с таким именем уже существует, выполняется обновление.

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

## remove — удалить Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Возвращает `true` при успешном удалении, `false`, если Skill не существует.

## call — прямой вызов SkillScript

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Напрямую выполняет SkillScript из указанного Skill, минуя AI-диалог.

**Параметры:**

| Параметр | Тип | Описание |
|------|------|------|
| `skillName` | `string` | Имя Skill (обязательно) |
| `scriptName` | `string` | Имя SkillScript (обязательно) |
| `params` | `Record<string, unknown>` | Передаваемые параметры (соответствуют объявлениям `@param`) |

```javascript
// Directly call a search script from a Skill
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> Выполнение SkillScript ограничено таймаутом (по умолчанию 300 секунд, настраивается через `@timeout`).
