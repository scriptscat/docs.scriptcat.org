---
title: Agent
---

:::caution فاز آزمایشی
قابلیت Agent در حال حاضر هنوز در فاز آزمایشی است؛ APIها و رفتارهای زیر ممکن است قبل از انتشار رسمی تغییر کنند.
:::

## نمای کلی

ScriptCat v1.4 سیستم Agent را معرفی می‌کند و به اسکریپت‌های کاربری مجموعه‌ای از قابلیت‌ها از جمله گفتگوی هوش مصنوعی، اتوماسیون مرورگر، مدیریت فایل و کارهای زمان‌بندی‌شده می‌دهد.

اسکریپت‌ها این قابلیت‌ها را از طریق فضای نام `CAT.agent.*` فراخوانی می‌کنند و هر API مستلزم اعلام مجوز مربوطه با `@grant` است.

## ماژول‌های ویژگی

| ماژول | مجوز | توضیحات |
|------|---------|------|
| [گفتگو](./agent-conversation) | `@grant CAT.agent.conversation` | ایجاد گفتگوهای هوش مصنوعی، ارسال پیام، پخش پاسخ‌ها، تعریف ابزارهای سفارشی |
| [عملیات DOM](./agent-dom) | `@grant CAT.agent.dom` | ناوبری صفحه، اسکرین‌شات، کلیک، پر کردن، اسکرول، نظارت DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | نصب/حذف/فراخوانی بسته‌های Skill |
| [کارهای زمان‌بندی‌شده](./agent-task) | `@grant CAT.agent.task` | کارهای زمان‌بندی‌شده cron، گوش دادن به رویداد |
| [مدل](./agent-model) | `@grant CAT.agent.model` | پرس‌وجوی اطلاعات مدل پیکربندی‌شده (فقط‌خواندنی) |
| [فایل‌های OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | خواندن/نوشتن فایل‌های فضای کار Agent |
| [MCP](./agent-mcp) | — | پیکربندی اتصالات سرور MCP (فقط صفحه مدیریت، بدون API اسکریپت) |
| [توسعه Skill](./agent-skill-dev) | — | راهنمای توسعه SKILL.cat.md + SkillScript |

## شروع سریع

ساده‌ترین اسکریپت Agent ممکن:

```javascript
// ==UserScript==
// @name        سلام Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("سلام، لطفاً خودتان را معرفی کنید");
console.log(reply.content);
```

## نمای کلی معماری

سیستم Agent چندین زمینه ایزوله درون افزونه مرورگر را در بر می‌گیرد:

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

### ساختار ذخیره‌سازی

Agent داده‌ها را با استفاده از OPFS مرورگر (سیستم فایل خصوصی مبدأ) ذخیره می‌کند:

```
agents/
├── conversations/       # تاریخچه گفتگو
├── attachments/         # پیوست‌ها (تصاویر، فایل‌ها)
├── skills/{name}/       # فایل‌های بسته Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # پیکربندی و سوابق اجرای کارهای زمان‌بندی‌شده
└── workspace/           # فایل‌های فضای کار کاربر (دایرکتوری که ابزارهای opfs_* روی آن کار می‌کنند)
```

### مدل‌های پشتیبانی‌شده

| ارائه‌دهنده | قالب | ویژگی‌ها |
|----------|------|------|
| سازگار با OpenAI | OpenAI Chat Completions API | از GPT-4o، DeepSeek و سایر مدل‌های سازگار پشتیبانی می‌کند |
| Anthropic | Anthropic Messages API | از خانواده Claude، Prompt Caching پشتیبانی می‌کند |
| Zhipu | Zhipu API | از خانواده مدل‌های GLM پشتیبانی می‌کند |

برای استفاده، یک ارائه‌دهنده و کلید API را تحت «پیکربندی مدل» در داشبورد اضافه کنید.

### اکوسیستم Skill

یک Skill بسته‌ای است که prompt + اسکریپت‌های ابزار + مواد مرجع را ترکیب می‌کند و به شما امکان می‌دهد دانش حوزه‌ای و ابزارهای سفارشی را به Agent تزریق کنید.

**مخزن رسمی Skill: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

شامل Skillهای آماده برای اتوماسیون مرورگر، کارهای زمان‌بندی‌شده، ابزار ایجاد Skill، نمونه‌های گفتگو/DOM/پیکربندی و موارد دیگر است.

**روش‌های نصب:**

- **نصب URL** — URL `SKILL.cat.md` را مستقیماً در مرورگر باز کنید؛ ScriptCat به طور خودکار آن را رهگیری می‌کند و صفحه نصب را نشان می‌دهد. همچنین می‌توانید URL را زیر Agent → مدیریت Skill در داشبورد قرار دهید.
- **نصب اسکریپت** — به صورت برنامه‌نویسی از طریق API `CAT.agent.skills.install()` نصب کنید

**بررسی به‌روزرسانی‌ها:**

یک Skill نصب‌شده از طریق URL منبع نصب خود را ثبت می‌کند؛ داشبورد به شما امکان می‌دهد با یک کلیک به‌روزرسانی‌ها را بررسی و ارتقا دهید (بر اساس مقایسه semver فیلد `version`).

برای جزئیات به [API مدیریت Skill](./agent-skill) و [راهنمای توسعه Skill](./agent-skill-dev) مراجعه کنید.
