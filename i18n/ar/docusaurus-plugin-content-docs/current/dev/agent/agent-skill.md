---
title: واجهة برمجة إدارة Skills
---

`@grant CAT.agent.skills`

تتيح واجهة برمجة إدارة Skills للسكرپت الاستعلام عن حزم توسعة Skill وتثبيتها وإزالتها واستدعاءها.

لتطوير وتعبئة Skills، راجع [دليل تطوير Skills](../agent-skill-dev). أمثلة Skills الرسمية: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — سرد Skills المثبتة

```javascript
const skills = await CAT.agent.skills.list();
```

**يرجع `SkillSummary[]`:**

| الحقل | النوع | الوصف |
|------|------|------|
| `name` | `string` | اسم الـ Skill |
| `description` | `string` | وصف الـ Skill |
| `toolNames` | `string[]` | أسماء أدوات SkillScript التي يحتويها |
| `referenceNames` | `string[]` | أسماء ملفات المواد المرجعية التي يحتويها |
| `hasConfig` | `boolean` | يحدد ما إذا كان يصرح عن حقول تكوين |
| `enabled` | `boolean` | يحدد ما إذا كان مفعلاً (الافتراضي: `true`) |
| `installtime` | `number` | طابع وقت التثبيت |
| `updatetime` | `number` | طابع وقت آخر تحديث |

> ملاحظة: `version` و `installUrl` (المستخدمة بواسطة ميزة فحص التحديثات في صفحة الإدارة) لا يتم إرجاعهما عبر واجهة البرمجة هذه — يُستخدمان فقط داخلياً بواسطة منطق فحص التحديثات وواجهة صفحة الإدارة.

## get — الحصول على تفاصيل Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

يرجع `SkillRecord` الكامل، أو `null` إذا لم يكن موجوداً.

**شكل `SkillRecord`:**

يرث جميع الحقول من `SkillSummary`، بالإضافة إلى:

| الحقل | النوع | الوصف |
|------|------|------|
| `prompt` | `string` | نص Markdown لملف `SKILL.cat.md` (المطالبة المعطاة للذكاء الاصطناعي) |
| `config` | `Record<string, SkillConfigField>` | تعريفات حقول التكوين (المخطط) |

**شكل `SkillConfigField`:**

| الحقل | النوع | الوصف |
|------|------|------|
| `title` | `string` | عنوان العرض |
| `type` | `"text" \| "number" \| "select" \| "switch"` | نوع الحقل |
| `secret` | `boolean` | يحدد ما إذا كان حساساً (مخفياً في الواجهة) |
| `required` | `boolean` | يحدد ما إذا كان إلزامياً |
| `default` | `unknown` | القيمة الافتراضية |
| `values` | `string[]` | قائمة الخيارات (نوع `select` فقط) |

## install — تثبيت Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**المعلمات:**

| المعامل | النوع | الوصف |
|------|------|------|
| `skillMd` | `string` | محتوى ملف `SKILL.cat.md` (إلزامي) |
| `scripts` | `Array<{ name, code }>` | قائمة ملفات SkillScript |
| `references` | `Array<{ name, content }>` | قائمة ملفات المواد المرجعية |

إذا كان Skill بنفس الاسم موجوداً بالفعل، يتم تحديثه.

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

## remove — إلغاء تثبيت Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

يرجع `true` إذا نجحت الإزالة، و`false` إذا كان الـ Skill غير موجود.

## call — استدعاء SkillScript مباشرة

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

ينفذ SkillScript في Skill المحدد مباشرة، دون المرور بحوار ذكاء اصطناعي.

**المعلمات:**

| المعامل | النوع | الوصف |
|------|------|------|
| `skillName` | `string` | اسم الـ Skill (إلزامي) |
| `scriptName` | `string` | اسم SkillScript (إلزامي) |
| `params` | `Record<string, unknown>` | المعلمات المطلوب تمريرها (المطابقة لتصريحات `@param`) |

```javascript
// Call the search script inside a Skill directly
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> تنفيذ SkillScript له مهلة زمنية (300 ثانية افتراضياً، قابلة للتخصيص عبر `@timeout`).
