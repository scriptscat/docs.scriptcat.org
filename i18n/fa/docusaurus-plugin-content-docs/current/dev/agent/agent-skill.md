---
title: API مدیریت Skill
---

`@grant CAT.agent.skills`

API مدیریت Skill به یک اسکریپت اجازه می‌دهد بسته‌های توسعه Skill را پرس‌وجو، نصب، حذف و فراخوانی کند.

برای توسعه و بسته‌بندی Skill، به [راهنمای توسعه Skill](../agent-skill-dev) مراجعه کنید. نمونه‌های رسمی Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — فهرست Skillهای نصب‌شده

```javascript
const skills = await CAT.agent.skills.list();
```

**بازگشت `SkillSummary[]`:**

| فیلد | نوع | توضیحات |
|------|------|------|
| `name` | `string` | نام Skill |
| `description` | `string` | توضیحات Skill |
| `toolNames` | `string[]` | نام ابزارهای SkillScript که شامل می‌شود |
| `referenceNames` | `string[]` | نام فایل‌های مواد مرجع که شامل می‌شود |
| `hasConfig` | `boolean` | آیا فیلدهای پیکربندی اعلام می‌کند |
| `enabled` | `boolean` | آیا فعال است (پیش‌فرض `true`) |
| `installtime` | `number` | زمان‌سنج نصب |
| `updatetime` | `number` | زمان‌سنج آخرین به‌روزرسانی |

> توجه: `version` و `installUrl` (مورد استفاده ویژگی بررسی به‌روزرسانی صفحه مدیریت) از طریق این API اسکریپت بازگردانده نمی‌شوند — آن‌ها فقط به صورت داخلی توسط منطق بررسی به‌روزرسانی و رابط کاربری صفحه مدیریت استفاده می‌شوند.

## get — دریافت جزئیات Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

`SkillRecord` کامل را برمی‌گرداند، یا اگر وجود نداشته باشد `null`.

**شکل `SkillRecord`:**

همه فیلدهای `SkillSummary` را به ارث می‌برد، به علاوه:

| فیلد | نوع | توضیحات |
|------|------|------|
| `prompt` | `string` | بدنه Markdown `SKILL.cat.md` (prompt داده‌شده به هوش مصنوعی) |
| `config` | `Record<string, SkillConfigField>` | تعاریف فیلدهای پیکربندی (طرح) |

**شکل `SkillConfigField`:**

| فیلد | نوع | توضیحات |
|------|------|------|
| `title` | `string` | عنوان نمایشی |
| `type` | `"text" \| "number" \| "select" \| "switch"` | نوع فیلد |
| `secret` | `boolean` | آیا حساس است (در رابط کاربری ماسک می‌شود) |
| `required` | `boolean` | آیا الزامی است |
| `default` | `unknown` | مقدار پیش‌فرض |
| `values` | `string[]` | فهرست گزینه‌ها (فقط نوع `select`) |

## install — نصب یک Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|------|------|------|
| `skillMd` | `string` | محتویات فایل `SKILL.cat.md` (الزامی) |
| `scripts` | `Array<{ name, code }>` | فهرست فایل‌های SkillScript |
| `references` | `Array<{ name, content }>` | فهرست فایل‌های مواد مرجع |

اگر Skill با همان نام از قبل وجود داشته باشد، این آن را به‌روزرسانی می‌کند.

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

## remove — حذف یک Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

اگر با موفقیت حذف شود `true` برمی‌گرداند، اگر Skill وجود نداشته باشد `false`.

## call — فراخوانی مستقیم یک SkillScript

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

یک SkillScript را در Skill مشخص‌شده مستقیماً اجرا می‌کند، بدون گذر از یک گفتگوی هوش مصنوعی.

**پارامترها:**

| پارامتر | نوع | توضیحات |
|------|------|------|
| `skillName` | `string` | نام Skill (الزامی) |
| `scriptName` | `string` | نام SkillScript (الزامی) |
| `params` | `Record<string, unknown>` | پارامترهای ورودی (مطابق با اعلام‌های `@param`) |

```javascript
// اسکریپت جستجو را در داخل یک Skill مستقیماً فراخوانی کنید
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> اجرای SkillScript دارای مهلت زمانی است (پیش‌فرض ۳۰۰ ثانیه، قابل تنظیم از طریق `@timeout`).
