---
title: Skill ম্যানেজমেন্ট API
---

`@grant CAT.agent.skills`

Skill ম্যানেজমেন্ট API একটি স্ক্রিপ্টকে Skill এক্সটেনশন প্যাকেজ জিজ্ঞাসা, ইনস্টল, অপসারণ এবং কল করতে দেয়।

Skill উন্নয়ন এবং প্যাকেজিংয়ের জন্য, [Skill উন্নয়ন গাইড](../agent-skill-dev) দেখুন। অফিসিয়াল Skill উদাহরণ: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)।

## list — ইনস্টল করা Skill তালিকা করুন

```javascript
const skills = await CAT.agent.skills.list();
```

**`SkillSummary[]` ফিরিয়ে দেয়:**

| ফিল্ড | ধরন | বর্ণনা |
|------|------|------|
| `name` | `string` | Skill নাম |
| `description` | `string` | Skill বর্ণনা |
| `toolNames` | `string[]` | এতে থাকা SkillScript টুলের নাম |
| `referenceNames` | `string[]` | এতে থাকা রেফারেন্স-উপাদান ফাইলের নাম |
| `hasConfig` | `boolean` | এটি কনফিগারেশন ফিল্ড ঘোষণা করে কিনা |
| `enabled` | `boolean` | এটি সক্রিয় কিনা (ডিফল্ট `true`) |
| `installtime` | `number` | ইনস্টল টাইমস্ট্যাম্প |
| `updatetime` | `number` | শেষ-আপডেট টাইমস্ট্যাম্প |

> নোট: `version` এবং `installUrl` (ম্যানেজমেন্ট পেজের আপডেট-পরীক্ষা ফিচার দ্বারা ব্যবহৃত) এই স্ক্রিপ্ট API-এর মাধ্যমে ফিরিয়ে দেওয়া হয় না — এগুলি শুধুমাত্র আপডেট-পরীক্ষা লজিক এবং ম্যানেজমেন্ট পেজ UI-তে অভ্যন্তরীণভাবে ব্যবহৃত হয়।

## get — Skill বিবরণ পান

```javascript
const skill = await CAT.agent.skills.get(name);
```

সম্পূর্ণ `SkillRecord` ফিরিয়ে দেয়, বা এটি না থাকলে `null`।

**`SkillRecord` আকৃতি:**

`SkillSummary`-এর সমস্ত ফিল্ড উত্তরাধিকার করে, প্লাস:

| ফিল্ড | ধরন | বর্ণনা |
|------|------|------|
| `prompt` | `string` | `SKILL.cat.md`-এর Markdown বডি (AI-কে দেওয়া prompt) |
| `config` | `Record<string, SkillConfigField>` | কনফিগারেশন ফিল্ড সংজ্ঞা (স্কিমা) |

**`SkillConfigField` আকৃতি:**

| ফিল্ড | ধরন | বর্ণনা |
|------|------|------|
| `title` | `string` | প্রদর্শন শিরোনাম |
| `type` | `"text" \| "number" \| "select" \| "switch"` | ফিল্ডের ধরন |
| `secret` | `boolean` | এটি সংবেদনশীল কিনা (UI-তে মাস্ক করা হয়) |
| `required` | `boolean` | এটি প্রয়োজনীয় কিনা |
| `default` | `unknown` | ডিফল্ট মান |
| `values` | `string[]` | বিকল্প তালিকা (শুধুমাত্র `select` ধরন) |

## install — একটি Skill ইনস্টল করুন

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**প্যারামিটার:**

| প্যারামিটার | ধরন | বর্ণনা |
|------|------|------|
| `skillMd` | `string` | `SKILL.cat.md` ফাইলের বিষয়বস্তু (প্রয়োজনীয়) |
| `scripts` | `Array<{ name, code }>` | SkillScript ফাইলের তালিকা |
| `references` | `Array<{ name, content }>` | রেফারেন্স-উপাদান ফাইলের তালিকা |

একই নামের একটি Skill ইতিমধ্যে থাকলে, এটি আপডেট করে।

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

## remove — একটি Skill আনইনস্টল করুন

```javascript
const success = await CAT.agent.skills.remove(name);
```

সফলভাবে অপসারিত হলে `true` ফিরিয়ে দেয়, Skill না থাকলে `false`।

## call — সরাসরি একটি SkillScript কল করুন

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

নির্দিষ্ট Skill-এ একটি SkillScript সরাসরি নির্বাহ করে, কোনো AI কথোপকথনের মধ্য দিয়ে না গিয়ে।

**প্যারামিটার:**

| প্যারামিটার | ধরন | বর্ণনা |
|------|------|------|
| `skillName` | `string` | Skill নাম (প্রয়োজনীয়) |
| `scriptName` | `string` | SkillScript নাম (প্রয়োজনীয়) |
| `params` | `Record<string, unknown>` | পাস করার প্যারামিটার (`@param` ঘোষণার সাথে মিলে) |

```javascript
// একটি Skill-এর ভিতরে সার্চ স্ক্রিপ্ট সরাসরি কল করুন
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript নির্বাহের একটি টাইমআউট আছে (ডিফল্ট ৩০০ সেকেন্ড, `@timeout`-এর মাধ্যমে কাস্টমাইজযোগ্য)।
