---
title: Agent
---

:::caution Фаза тестирования
Функция Agent пока находится в фазе тестирования; перечисленные ниже API и поведение могут измениться до официального релиза.
:::

## Обзор

ScriptCat v1.4 представляет систему Agent, дающую пользовательским скриптам набор возможностей: AI-диалоги, автоматизация браузера, управление файлами и задачи по расписанию.

Скрипты вызывают эти возможности через пространство имён `CAT.agent.*`, и для каждого API нужно объявить соответствующее разрешение через `@grant`.

## Модули функций

| Модуль | Разрешение | Описание |
|------|---------|------|
| [Диалог](./agent-conversation) | `@grant CAT.agent.conversation` | Создание AI-диалогов, отправка сообщений, потоковые ответы, пользовательские инструменты |
| [Операции DOM](./agent-dom) | `@grant CAT.agent.dom` | Навигация по страницам, скриншоты, клики, заполнение, прокрутка, мониторинг DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Установка/удаление/вызов пакетов Skill |
| [Задачи по расписанию](./agent-task) | `@grant CAT.agent.task` | Задачи по расписанию, прослушивание событий |
| [Модель](./agent-model) | `@grant CAT.agent.model` | Запрос информации о настроенных моделях (только чтение) |
| [Файлы OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Чтение/запись файлов рабочего пространства Agent |
| [MCP](./agent-mcp) | `@grant CAT.agent.mcp` | Управление подключениями MCP-серверов |
| [Разработка Skill](./agent-skill-dev) | — | Руководство по разработке SKILL.cat.md + SkillScript |

## Быстрый старт

Простейший возможный скрипт Agent:

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

## Обзор архитектуры

Система Agent охватывает несколько изолированных контекстов внутри расширения браузера:

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

### Структура хранения

Agent хранит данные с помощью OPFS браузера (Origin Private File System):

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

### Поддерживаемые модели

| Провайдер | Формат | Возможности |
|----------|------|------|
| OpenAI-compatible | OpenAI Chat Completions API | Поддержка GPT-4o, DeepSeek и других совместимых моделей |
| Anthropic | Anthropic Messages API | Поддержка семейства Claude, Prompt Caching |
| Zhipu | Zhipu API | Поддержка семейства моделей GLM |

Добавьте Provider и API Key в разделе «Конфигурация моделей» панели управления, чтобы использовать их.

### Экосистема Skill

Skill — пакет, объединяющий промпты + скрипты инструментов + справочные материалы, позволяющий внедрять в Agent предметные знания и пользовательские инструменты.

**Официальный репозиторий Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Включает готовые Skills для автоматизации браузера, задач по расписанию, инструмента создания Skill, примеров conversation/DOM/config и многого другого.

**Способы установки:**

- **Установка по URL** — откройте URL `SKILL.cat.md` прямо в браузере; ScriptCat автоматически перехватит его и покажет страницу установки. Также можно вставить URL в панели управления: Agent → Управление Skill.
- **Установка из скрипта** — программная установка через API `CAT.agent.skills.install()`

**Проверка обновлений:**

Skill, установленный по URL, сохраняет источник установки; панель управления позволяет проверять обновления и обновлять в один клик (на основе semver-сравнения поля `version`).

Подробности: [API управления Skill](./agent-skill) и [Руководство по разработке Skill](./agent-skill-dev).
