---
title: API керування Skill
---

`@grant CAT.agent.skills`

API керування Skill дозволяє скрипту запитувати, встановлювати, видаляти та викликати пакети розширень Skill.

Для розробки та пакування Skill дивіться [Посібник з розробки Skill](../agent-skill-dev). Офіційні приклади Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — список встановлених Skill

```javascript
const skills = await CAT.agent.skills.list();
```

**Повертає `SkillSummary[]`:**

| Поле | Тип | Опис |
|------|------|------|
| `name` | `string` | Назва Skill |
| `description` | `string` | Опис Skill |
| `toolNames` | `string[]` | Назви інструментів SkillScript, які він містить |
| `referenceNames` | `string[]` | Назви файлів довідкових матеріалів, які він містить |
| `hasConfig` | `boolean` | Чи оголошує поля конфігурації |
| `enabled` | `boolean` | Чи ввімкнений (за замовчуванням `true`) |
| `installtime` | `number` | Час встановлення |
| `updatetime` | `number` | Час останнього оновлення |

> Примітка: `version` та `installUrl` (використовуються функцією перевірки оновлень сторінки керування) не повертаються через цей скриптовий API — вони використовуються лише внутрішньо логікою перевірки оновлень та інтерфейсом сторінки керування.

## get — отримати деталі Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Повертає повний `SkillRecord` або `null`, якщо його не існує.

**Форма `SkillRecord`:**

Успадковує всі поля з `SkillSummary`, плюс:

| Поле | Тип | Опис |
|------|------|------|
| `prompt` | `string` | Тіло Markdown файлу `SKILL.cat.md` (підказка, що надається AI) |
| `config` | `Record<string, SkillConfigField>` | Визначення полів конфігурації (схема) |

**Форма `SkillConfigField`:**

| Поле | Тип | Опис |
|------|------|------|
| `title` | `string` | Відображувана назва |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Тип поля |
| `secret` | `boolean` | Чи чутливе (маскується в інтерфейсі) |
| `required` | `boolean` | Чи обов'язкове |
| `default` | `unknown` | Значення за замовчуванням |
| `values` | `string[]` | Список опцій (лише для типу `select`) |

## install — встановити Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Параметри:**

| Параметр | Тип | Опис |
|------|------|------|
| `skillMd` | `string` | Вміст файлу `SKILL.cat.md` (обов'язково) |
| `scripts` | `Array<{ name, code }>` | Список файлів SkillScript |
| `references` | `Array<{ name, content }>` | Список файлів довідкових матеріалів |

Якщо Skill із такою самою назвою вже існує, цей виклик оновлює його.

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

## remove — видалити Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Повертає `true`, якщо видалено успішно, `false`, якщо Skill не існує.

## call — викликати SkillScript безпосередньо

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Виконує SkillScript у вказаному Skill безпосередньо, без AI-розмови.

**Параметри:**

| Параметр | Тип | Опис |
|------|------|------|
| `skillName` | `string` | Назва Skill (обов'язково) |
| `scriptName` | `string` | Назва SkillScript (обов'язково) |
| `params` | `Record<string, unknown>` | Параметри для передачі (відповідають оголошенням `@param`) |

```javascript
// Викликати скрипт пошуку всередині Skill безпосередньо
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> Виконання SkillScript має таймаут (300 секунд за замовчуванням, налаштовується через `@timeout`).
