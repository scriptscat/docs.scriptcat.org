---
title: Установка и использование Skills
---

Skill — пакет расширения для Agent, который внедряет предметные знания и пользовательские инструменты в AI. На этой странице описано, как устанавливать, настраивать и управлять Skills.

:::tip Официальный репозиторий Skill
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — готовые Skills для автоматизации браузера, задач по расписанию, разбора файлов, помощника разработки скриптов и многого другого.
:::

## Способы установки

### Способ 1: установка по URL

Откройте URL `SKILL.cat.md` прямо в адресной строке браузера; ScriptCat автоматически перехватит его и покажет страницу подтверждения установки.

Например, установка официального Skill browser-automation:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Также можно сделать это из панели управления:

1. Откройте панель ScriptCat → **Agent → Skills**
2. Нажмите кнопку **URL** в правом верхнем углу
3. Вставьте URL `SKILL.cat.md`
4. Нажмите «Установить»

ScriptCat автоматически загрузит `SKILL.cat.md` вместе с объявленными в нём скриптами и справочными файлами.

### Способ 2: установка через ZIP

1. Откройте панель ScriptCat → **Agent → Skills**
2. Нажмите кнопку **+** в правом верхнем углу
3. Выберите пакет Skill в формате `.zip`

Структура каталогов ZIP-пакета должна соответствовать стандартному формату Skill (содержать `SKILL.cat.md`).

## Список официальных Skills

Также можно щёлкнуть правой кнопкой `Copy Link` и вставить ссылку в поле URL управления Skill для установки.

| Skill | Описание | Установка |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Анализ страниц, операции DOM, заполнение форм, скриншоты, навигация | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Задачи по расписанию (автовыполнение LLM / колбэки скриптов) | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Помогает создавать, тестировать и упаковывать новые Skills | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Разбор файлов Excel, PDF, Word, CSV и PPT | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Помощник разработки скриптов ScriptCat/Tampermonkey | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Чтение/запись таблиц Synology Office | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Помощник по работе с официальным аккаунтом WeChat | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Помощник по работе с Xiaohongshu (RED) | [Установить](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Настройка Skill

Некоторым Skills нужна конфигурация (например, API Key):

1. Найдите установленный Skill на странице **Agent → Skills**
2. Нажмите значок **настроек** (шестерёнка)
3. Заполните конфигурацию и сохраните

Поля с меткой `secret` в конфигурации маскируются в UI.

## Включение / отключение

На странице управления Skills используйте переключатель на карточке Skill, чтобы управлять включением. Отключённые Skills не загружаются в диалоги.

## Проверка обновлений

Skills, установленные по URL, поддерживают проверку версий:

1. Нажмите кнопку **Проверить обновления** в правом верхнем углу страницы Skills
2. На карточке Skill с доступной новой версией появится кнопка **Обновить**
3. Нажмите, чтобы обновить в один клик

Обновления сравниваются по полю `version` (формат semver), объявленному в `SKILL.cat.md`.

## Использование Skills в диалоге

Установленные Skills автоматически доступны в диалогах Agent. AI сам решает, когда загружать и вызывать инструменты Skill, исходя из содержимого диалога.

Также можно указать, какие Skills загружать, при создании диалога:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // automatically load all Skills
  // or specify particular Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## Узнать больше

- [API управления Skill](./agent-skill.md) — управление Skills программно из скрипта
- [Руководство по разработке Skill](./agent-skill-dev.md) — создание собственного Skill
