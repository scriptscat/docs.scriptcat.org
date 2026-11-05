---
title: Встановлення та використання Skill
---

Skill — це пакет розширення для Agent, який впроваджує доменні знання та власні інструменти в AI. Ця сторінка охоплює, як встановлювати, налаштовувати та керувати Skill.

:::tip Офіційний репозиторій Skill
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — готові до використання Skill для автоматизації браузера, запланованих завдань, аналізу файлів, допомоги в розробці скриптів тощо.
:::

## Методи встановлення

### Метод 1: встановлення з URL

Відкрийте URL `SKILL.cat.md` безпосередньо в адресному рядку браузера; ScriptCat перехопить його та покаже сторінку підтвердження встановлення.

Наприклад, щоб встановити офіційний Skill автоматизації браузера:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Ви також можете зробити це зі сторінки керування:

1. Відкрийте сторінку керування ScriptCat → **Agent → Skills**
2. Натисніть кнопку **URL** у верхньому правому куті
3. Вставте URL `SKILL.cat.md`
4. Натисніть «Встановити»

ScriptCat автоматично завантажує `SKILL.cat.md` разом із скриптами та довідковими матеріалами, які він оголошує.

### Метод 2: встановлення ZIP

1. Відкрийте сторінку керування ScriptCat → **Agent → Skills**
2. Натисніть кнопку **+** у верхньому правому куті
3. Виберіть пакет Skill у форматі `.zip`

Структура каталогів ZIP має відповідати стандартному формату Skill (він має містити `SKILL.cat.md`).

## Офіційний список Skill

Натисніть правою кнопкою **Копіювати посилання**, потім вставте посилання в поле URL керування Skills, щоб встановити.

| Skill | Опис | Встановлення |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Аналіз сторінок, операції з DOM, заповнення форм, скріншоти, навігація | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron-заплановані завдання (автозапуск через LLM / зворотний виклик скрипта) | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Допомагає створювати, тестувати та пакувати нові Skill | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Аналізує файли Excel, PDF, Word, CSV і PPT | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Асистент розробки скриптів ScriptCat/Tampermonkey | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Читання/запис електронних таблиць Synology Office | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Асистент операцій з офіційним акаунтом WeChat | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Асистент операцій Xiaohongshu (RED) | [Встановити](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Налаштування Skill

Деякі Skill потребують налаштування (наприклад, ключа API):

1. Знайдіть встановлений Skill на сторінці **Agent → Skills**
2. Натисніть іконку **Налаштування** (шестерня)
3. Заповніть поля конфігурації та збережіть

Поля, позначені `secret` у конфігурації, маскуються в інтерфейсі.

## Увімкнення / вимкнення

На сторінці керування Skills використовуйте перемикач на картці Skill, щоб контролювати, чи він увімкнений. Вимкнені Skill не завантажуються в розмовах.

## Перевірка оновлень

Skill, встановлені за URL, підтримують перевірку версій:

1. Натисніть кнопку **Перевірити оновлення** у верхньому правому куті сторінки Skills
2. Картки Skill із доступною новою версією покажуть кнопку **Оновити**
3. Натисніть її для оновлення одним кліком

Оновлення порівнюються за допомогою поля `version` (формат semver), оголошеного в `SKILL.cat.md`.

## Використання Skill у розмові

Встановлені Skill автоматично доступні в розмовах Agent. AI вирішує, коли завантажувати та викликати інструменти Skill, на основі вмісту розмови.

Ви також можете вказати, які Skill завантажувати під час створення розмови:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Автоматично завантажити всі Skill
  // або вказати конкретні Skill
  // skills: ["browser-automation", "file-parser"]
});
```

## Дізнатися більше

- [API керування Skill](./agent-skill.md) — керуйте Skill програмно зі скрипта
- [Посібник з розробки Skill](./agent-skill-dev.md) — створіть власний Skill
