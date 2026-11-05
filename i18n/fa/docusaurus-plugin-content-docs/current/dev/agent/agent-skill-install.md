---
title: نصب و استفاده از Skillها
---

یک Skill یک بسته توسعه برای Agent است که دانش حوزه‌ای و ابزارهای سفارشی را در هوش مصنوعی تزریق می‌کند. این صفحه نحوه نصب، پیکربندی و مدیریت Skillها را پوشش می‌دهد.

:::tip مخزن رسمی Skill
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Skillهای آماده برای اتوماسیون مرورگر، کارهای زمان‌بندی‌شده، تجزیه فایل، کمک به توسعه اسکریپت و موارد دیگر.
:::

## روش‌های نصب

### روش ۱: نصب از یک URL

یک URL `SKILL.cat.md` را مستقیماً در نوار آدرس مرورگر خود باز کنید؛ ScriptCat آن را رهگیری می‌کند و یک صفحه تأیید نصب نشان می‌دهد.

به عنوان مثال، برای نصب Skill رسمی اتوماسیون مرورگر:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

همچنین می‌توانید این کار را از صفحه مدیریت انجام دهید:

1. صفحه مدیریت ScriptCat را باز کنید → **Agent → Skills**
2. روی دکمه **URL** در بالا سمت راست کلیک کنید
3. URL `SKILL.cat.md` را جای‌گذاری کنید
4. روی نصب کلیک کنید

ScriptCat به طور خودکار `SKILL.cat.md` را به همراه اسکریپت‌ها و فایل‌های مواد مرجع که اعلام می‌کند دریافت می‌کند.

### روش ۲: نصب یک ZIP

1. صفحه مدیریت ScriptCat را باز کنید → **Agent → Skills**
2. روی دکمه **+** در بالا سمت راست کلیک کنید
3. یک بسته Skill در قالب `.zip` انتخاب کنید

ساختار دایرکتوری ZIP باید از قالب استاندارد Skill پیروی کند (باید شامل `SKILL.cat.md` باشد).

## فهرست Skillهای رسمی

روی **کپی لینک** کلیک راست کنید، سپس لینک را در فیلد URL مدیریت Skill قرار دهید تا نصب شود.

| Skill | توضیحات | نصب |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | تحلیل صفحه، دستکاری DOM، پر کردن فرم، اسکرین‌شات، ناوبری | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | کارهای زمان‌بندی‌شده cron (اجرای خودکار توسط LLM / بازخوانی اسکریپت) | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | کمک به ایجاد، تست و بسته‌بندی Skillهای جدید | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | فایل‌های Excel، PDF، Word، CSV و PPT را تجزیه می‌کند | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | دستیار توسعه اسکریپت ScriptCat/Tampermonkey | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | خواندن/نوشتن صفحات گسترده Synology Office | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | دستیار عملیات حساب رسمی WeChat | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | دستیار عملیات Xiaohongshu (RED) | [نصب](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## پیکربندی یک Skill

برخی Skillها به پیکربندی نیاز دارند (مانند کلید API):

1. Skill نصب‌شده را در صفحه **Agent → Skills** پیدا کنید
2. روی آیکون **تنظیمات** (چرخ‌دنده) کلیک کنید
3. فیلدهای پیکربندی را پر کنید و ذخیره کنید

فیلدهایی که در پیکربندی به عنوان `secret` علامت‌گذاری شده‌اند در رابط کاربری ماسک می‌شوند.

## فعال / غیرفعال

در صفحه مدیریت Skill، از کلید روی کارت یک Skill برای کنترل فعال بودن آن استفاده کنید. Skillهای غیرفعال در گفتگوها بارگذاری نمی‌شوند.

## بررسی به‌روزرسانی‌ها

Skillهای نصب‌شده از طریق URL از بررسی نسخه پشتیبانی می‌کنند:

1. روی دکمه **بررسی به‌روزرسانی‌ها** در بالا سمت راست صفحه Skill کلیک کنید
2. کارت‌های Skill با نسخه جدید موجود، دکمه **به‌روزرسانی** را نشان می‌دهند
3. روی آن کلیک کنید تا با یک کلیک ارتقا دهید

به‌روزرسانی‌ها با استفاده از فیلد `version` (قالب semver) اعلام‌شده در `SKILL.cat.md` مقایسه می‌شوند.

## استفاده از Skillها در یک گفتگو

Skillهای نصب‌شده به طور خودکار در گفتگوهای Agent در دسترس هستند. هوش مصنوعی بر اساس محتوای گفتگو تصمیم می‌گیرد چه زمانی ابزارهای یک Skill را بارگذاری و فراخوانی کند.

همچنین می‌توانید مشخص کنید کدام Skillها هنگام ایجاد یک گفتگو بارگذاری شوند:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // به طور خودکار همه Skillها را بارگذاری می‌کند
  // یا Skillهای خاصی را مشخص کنید
  // skills: ["browser-automation", "file-parser"]
});
```

## بیشتر بیاموزید

- [API مدیریت Skill](./agent-skill.md) — مدیریت برنامه‌نویسی Skillها از یک اسکریپت
- [راهنمای توسعه Skill](./agent-skill-dev.md) — Skill خود را ایجاد کنید
