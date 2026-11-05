---
title: تثبيت واستخدام Skills
---

Skill هو حزمة توسعة لـ Agent تحقن معرفة متخصصة وأدوات مخصصة في الذكاء الاصطناعي. تغطي هذه الصفحة كيفية تثبيت Skills وتكوينها وإدارتها.

:::tip مستودع Skills الرسمي
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Skills جاهزة للاستخدام لأتمتة المتصفح والمهام المجدولة وتحليل الملفات والمساعدة في تطوير السكرپتات والمزيد.
:::

## طرق التثبيت

### الطريقة 1: التثبيت من رابط

افتح رابط `SKILL.cat.md` مباشرة في شريط عنوان المتصفح؛ سيعترضه ScriptCat ويعرض صفحة تأكيد التثبيت.

على سبيل المثال، لتثبيت Skill أتمتة المتصفح الرسمي:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

يمكنك أيضاً القيام بذلك من صفحة الإدارة:

1. افتح صفحة إدارة ScriptCat → **Agent → Skills**
2. انقر على زر **URL** في أعلى اليمين
3. الصق رابط `SKILL.cat.md`
4. انقر على تثبيت

يجلب ScriptCat تلقائياً `SKILL.cat.md` مع السكرپتات وملفات المواد المرجعية التي يصرح عنها.

### الطريقة 2: تثبيت ملف ZIP

1. افتح صفحة إدارة ScriptCat → **Agent → Skills**
2. انقر على زر **+** في أعلى اليمين
3. حدد حزمة Skill بصيغة `.zip`

يجب أن تتبع بنية مجلدات ZIP صيغة Skill القياسية (يجب أن تحتوي على `SKILL.cat.md`).

## قائمة Skills الرسمية

انقر بزر الماوس الأيمن على **نسخ الرابط**، ثم الصق الرابط في حقل URL الخاص بإدارة Skills للتثبيت.

| Skill | الوصف | التثبيت |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | تحليل الصفحات، معالجة الـ DOM، تعبئة النماذج، لقطات الشاشة، التنقل | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | مهام Cron المجدولة (تشغيل تلقائي بواسطة LLM / استدعاء سكرپت) | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | يساعد في إنشاء واختبار وتعبئة Skills جديدة | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | يحلل ملفات Excel وPDF وWord وCSV وPPT | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | مساعد تطوير سكرپتات ScriptCat/Tampermonkey | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | قراءة/كتابة جداول بيانات Synology Office | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | مساعد عمليات الحساب الرسمي WeChat | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | مساعد عمليات Xiaohongshu (RED) | [تثبيت](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## تكوين Skill

تتطلب بعض Skills تكويناً (مثل مفتاح API):

1. ابحث عن Skill المثبت على صفحة **Agent → Skills**
2. انقر على أيقونة **الإعدادات** (الترس)
3. املأ حقول التكوين واحفظ

الحقول المميزة بـ `secret` في التكوين تكون مخفية في الواجهة.

## التفعيل / التعطيل

في صفحة إدارة Skills، استخدم المفتاح على بطاقة Skill للتحكم في ما إذا كان مفعلاً. لا يتم تحميل Skills المعطلة في الحوارات.

## التحقق من التحديثات

تدعم Skills المثبتة عبر رابط فحص الإصدار:

1. انقر على زر **التحقق من التحديثات** في أعلى يمين صفحة Skills
2. ستظهر بطاقات Skills التي لديها إصدار جديد متاح زر **تحديث**
3. انقر عليه للترقية بنقرة واحدة

تُقارن التحديثات باستخدام حقل `version` (صيغة semver) المُصرح عنه في `SKILL.cat.md`.

## استخدام Skills في حوار

تتوفر Skills المثبتة تلقائياً في حوارات Agent. يقرر الذكاء الاصطناعي متى يقوم بتحميل واستدعاء أدوات Skill بناءً على محتوى الحوار.

يمكنك أيضاً تحديد Skills التي سيتم تحميلها عند إنشاء حوار:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Automatically load all Skills
  // or specify particular Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## معرفة المزيد

- [واجهة برمجة إدارة Skills](./agent-skill.md) — إدارة Skills برمجياً من سكرپت
- [دليل تطوير Skills](./agent-skill-dev.md) — إنشاء Skill خاص بك
