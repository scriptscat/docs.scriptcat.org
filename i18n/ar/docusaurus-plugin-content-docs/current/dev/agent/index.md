---
title: المساعد الذكي Agent
---

:::caution مرحلة الاختبار
ميزة الـ Agent لا تزال في مرحلة الاختبار التجريبي (Beta). قد يتم تعديل واجهات البرمجة (APIs) والسلوكيات التالية قبل الإصدار الرسمي.
:::

## نظرة عامة

يقدم ScriptCat v1.4 نظام المساعد الذكي Agent، والذي يوفر لسكرپتات المستخدم مجموعة من القدرات مثل حوارات الذكاء الاصطناعي، وأتمتة المتصفح، وإدارة الملفات، والمهام المجدولة.

يتم استدعاء هذه القدرات عبر مساحة الاسم `CAT.agent.*`. تتطلب جميع واجهات البرمجة (APIs) التصريح عن الأذونات المقابلة عبر `@grant`.

## الوحدات الوظيفية

| الوحدة | إعلان الإذن | الوصف |
|------|---------|------|
| [الحوار](./agent-conversation) | `@grant CAT.agent.conversation` | إنشاء حوارات ذكاء اصطناعي، إرسال رسائل، استقبال متدفق (streaming)، وأدوات مخصصة |
| [عمليات DOM](./agent-dom) | `@grant CAT.agent.dom` | التنقل في الصفحات، لقطات الشاشة، النقر، التعبئة، التمرير، ومراقبة الـ DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | تثبيت/إزالة/استدعاء حزم توسعة الـ Skill |
| [المهام المجدولة](./agent-task) | `@grant CAT.agent.task` | مهام Cron المجدولة، والاستماع للأحداث |
| [النموذج](./agent-model) | `@grant CAT.agent.model` | الاستعلام عن معلومات النماذج المكونة (للقراءة فقط) |
| [ملفات OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | قراءة وكتابة الملفات في مساحة عمل الـ Agent |
| [MCP](./agent-mcp) | — | إعداد اتصالات خادم MCP (من صفحة الإدارة فقط، لا توجد واجهة برمجية للبرامج النصية) |
| [تطوير Skill](./agent-skill-dev) | — | دليل تطوير SKILL.cat.md + SkillScript |

## البداية السريعة

سكرپت Agent بسيط للغاية:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("مرحباً، يرجى تعريف نفسك");
console.log(reply.content);
```

## نظرة موجزة على البنية

يعمل نظام الـ Agent عبر عدة سياقات معزولة في إضافة المتصفح:

```
سكرپت المستخدم ← Sandbox (تنفيذ معزول)
              ↓ WindowMessage
           Offscreen (الوصول إلى الـ DOM)
              ↓ ExtensionMessage
           Service Worker (المجدول المركزي)
              ├── LLM Provider (OpenAI / Anthropic)
              ├── ToolRegistry (تسجيل وتنفيذ الأدوات)
              ├── SkillScriptExecutor (تنفيذ سكرپتات الـ Skill)
              ├── MCPClient (عميل بروتوكول MCP)
              └── TaskScheduler (جدولة المهام المجدولة)
```

### هيكل التخزين

يستخدم الـ Agent نظام ملفات OPFS (Origin Private File System) في المتصفح لتخزين البيانات:

```
agents/
├── conversations/       # سجل الحوارات
├── attachments/         # المرفقات (صور، ملفات)
├── skills/{name}/       # ملفات حزم الـ Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # تكوينات المهام وسجلات التنفيذ
└── workspace/           # ملفات مساحة عمل المستخدم (الدليل الخاص بأدوات opfs_*)
```

### النماذج المدعومة

| المزود | التنسيق | المميزات |
|----------|------|------|
| متوافق مع OpenAI | OpenAI Chat Completions API | يدعم GPT-4o و DeepSeek والنماذج المتوافقة الأخرى |
| Anthropic | Anthropic Messages API | يدعم سلسلة Claude، وتخزين المطالبات (Prompt Caching) |
| Zhipu | Zhipu API | يدعم نماذج سلسلة GLM |

يمكنك إضافة المزود ومفتاح واجهة البرمجة (API Key) في "تكوين النموذج" بصفحة الإدارة للبدء.

### بيئة الـ Skill

الـ Skill هي حزمة توسعة تحتوي على مطالبات + سكرپتات أدوات + مواد مرجعية، يمكنها تزويد الـ Agent بمعرفة متخصصة وأدوات مخصصة.

**المستودع الرسمي للـ Skills: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

يحتوي على Skills جاهزة للاستخدام لأتمتة المتصفح، المهام المجدولة، أدوات إنشاء الـ Skill، وأمثلة للحوار/DOM/التكوين.

**طرق التثبيت:**

- **التثبيت عبر رابط (URL)** — افتح رابط ملف `SKILL.cat.md` مباشرة في المتصفح، وسيقوم ScriptCat باعتراضه تلقائياً وإظهار صفحة التثبيت؛ كما يمكنك لصق الرابط في صفحة الإدارة ← Agent ← إدارة الـ Skill.
- **التثبيت عبر سكرپت** — التثبيت برمجياً عبر واجهة البرمجة `CAT.agent.skills.install()`.

**التحقق من التحديثات:**

الـ Skills المثبتة عبر رابط تسجل مصدر التثبيت، ويمكنك التحقق من التحديثات والترقية بضغطة زر (بناءً على مقارنة semver لحقل `version`) في صفحة الإدارة.

راجع [واجهة برمجة إدارة الـ Skill](./agent-skill) و [دليل تطوير الـ Skill](./agent-skill-dev).
