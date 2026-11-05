---
title: Agent
---

:::caution Етап тестування
Функція Agent наразі все ще перебуває на етапі тестування; наведені нижче API та поведінка можуть змінитися до офіційного випуску.
:::

## Огляд

ScriptCat v1.4 представляє систему Agent, що надає користувацьким скриптам набір можливостей, включаючи AI-розмови, автоматизацію браузера, керування файлами та заплановані завдання.

Скрипти викликають ці можливості через простір імен `CAT.agent.*`, і кожен API вимагає, щоб відповідний дозвіл було оголошено за допомогою `@grant`.

## Модулі функцій

| Модуль | Дозвіл | Опис |
|------|---------|------|
| [Розмова](./agent-conversation) | `@grant CAT.agent.conversation` | Створення AI-розмов, надсилання повідомлень, потокові відповіді, визначення власних інструментів |
| [Операції з DOM](./agent-dom) | `@grant CAT.agent.dom` | Навігація сторінками, скріншоти, кліки, заповнення, прокрутка, моніторинг DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Встановлення/видалення/виклик пакетів Skill |
| [Заплановані завдання](./agent-task) | `@grant CAT.agent.task` | Cron-заплановані завдання, прослуховування подій |
| [Модель](./agent-model) | `@grant CAT.agent.model` | Запит інформації про налаштовані моделі (лише читання) |
| [Файли OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Читання/запис файлів робочого простору Agent |
| [MCP](./agent-mcp) | — | Налаштування підключень до MCP-серверів (лише сторінка керування, без скриптового API) |
| [Розробка Skill](./agent-skill-dev) | — | Посібник з розробки SKILL.cat.md + SkillScript |

## Швидкий старт

Найпростіший скрипт Agent:

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

## Огляд архітектури

Система Agent охоплює кілька ізольованих контекстів у межах браузерного розширення:

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

### Структура зберігання

Agent зберігає дані за допомогою OPFS браузера (Origin Private File System):

```
agents/
├── conversations/       # історія розмов
├── attachments/         # вкладення (зображення, файли)
├── skills/{name}/       # файли пакета Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # конфігурація запланованих завдань та записи виконання
└── workspace/           # файли робочого простору користувача (каталог, з яким працюють інструменти opfs_*)
```

### Підтримувані моделі

| Провайдер | Формат | Особливості |
|----------|------|------|
| Сумісний з OpenAI | OpenAI Chat Completions API | Підтримує GPT-4o, DeepSeek та інші сумісні моделі |
| Anthropic | Anthropic Messages API | Підтримує сімейство Claude, Prompt Caching |
| Zhipu | Zhipu API | Підтримує сімейство моделей GLM |

Додайте Провайдера та API-ключ у розділі "Конфігурація моделей" на панелі керування, щоб використовувати його.

### Екосистема Skill

Skill — це пакет, що поєднує підказки + скрипти інструментів + довідкові матеріали, що дозволяє впроваджувати доменні знання та власні інструменти в Agent.

**Офіційний репозиторій Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Включає готові до використання Skill для автоматизації браузера, запланованих завдань, інструменту створення Skill, прикладів розмов/DOM/конфігурацій тощо.

**Методи встановлення:**

- **Встановлення за URL** — відкрийте URL `SKILL.cat.md` безпосередньо в браузері; ScriptCat автоматично перехопить його та покаже сторінку встановлення. Ви також можете вставити URL у розділі Панель керування → Agent → Керування Skill.
- **Встановлення скриптом** — встановіть програмно через API `CAT.agent.skills.install()`

**Перевірка оновлень:**

Skill, встановлений за URL, записує джерело встановлення; панель керування дозволяє перевіряти оновлення та оновлюватися одним кліком (на основі порівняння semver поля `version`).

Деталі дивіться в [API керування Skill](./agent-skill) та [Посібнику з розробки Skill](./agent-skill-dev).
