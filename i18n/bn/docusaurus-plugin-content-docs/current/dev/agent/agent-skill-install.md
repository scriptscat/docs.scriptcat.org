---
title: Skill ইনস্টল এবং ব্যবহার
---

একটি Skill হল Agent-এর জন্য একটি এক্সটেনশন প্যাকেজ যা ডোমেইন-নির্দিষ্ট জ্ঞান এবং কাস্টম টুল AI-তে ইনজেক্ট করে। এই পৃষ্ঠাটি কীভাবে Skill ইনস্টল, কনফিগার এবং পরিচালনা করতে হয় তা কভার করে।

:::tip অফিসিয়াল Skill রিপোজিটরি
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — ব্রাউজার অটোমেশন, নির্ধারিত কাজ, ফাইল পার্সিং, স্ক্রিপ্ট-উন্নয়ন সহায়তা এবং আরও অনেক কিছুর জন্য প্রস্তুত-ব্যবহারযোগ্য Skill।
:::

## ইনস্টলেশন পদ্ধতি

### পদ্ধতি ১: একটি URL থেকে ইনস্টল

আপনার ব্রাউজারের অ্যাড্রেস বারে সরাসরি একটি `SKILL.cat.md` URL খুলুন; ScriptCat এটি ইন্টারসেপ্ট করবে এবং একটি ইনস্টল-নিশ্চিতকরণ পৃষ্ঠা পপআপ করবে।

উদাহরণস্বরূপ, অফিসিয়াল ব্রাউজার-অটোমেশন Skill ইনস্টল করতে:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

আপনি এটি ম্যানেজমেন্ট পেজ থেকেও করতে পারেন:

1. ScriptCat ম্যানেজমেন্ট পেজ খুলুন → **Agent → Skills**
2. উপরের ডানদিকে **URL** বাটনে ক্লিক করুন
3. `SKILL.cat.md` URL পেস্ট করুন
4. ইনস্টল-এ ক্লিক করুন

ScriptCat স্বয়ংক্রিয়ভাবে `SKILL.cat.md`-এর সাথে সাথে এটি যে স্ক্রিপ্ট এবং রেফারেন্স উপাদান ফাইল ঘোষণা করে সেগুলি আনয়ন করে।

### পদ্ধতি ২: একটি ZIP ইনস্টল

1. ScriptCat ম্যানেজমেন্ট পেজ খুলুন → **Agent → Skills**
2. উপরের ডানদিকে **+** বাটনে ক্লিক করুন
3. `.zip` ফরম্যাটে একটি Skill প্যাকেজ নির্বাচন করুন

ZIP-এর ডিরেক্টরি কাঠামোটি স্ট্যান্ডার্ড Skill ফরম্যাট অনুসরণ করা উচিত (এতে অবশ্যই `SKILL.cat.md` থাকতে হবে)।

## অফিসিয়াল Skill তালিকা

**লিংক কপি** করতে ডান-ক্লিক করুন, তারপর ইনস্টল করতে Skills ম্যানেজমেন্ট URL ফিল্ডে লিংকটি পেস্ট করুন।

| Skill | বর্ণনা | ইনস্টল |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | পৃষ্ঠা বিশ্লেষণ, DOM ম্যানিপুলেশন, ফর্ম পূরণ, স্ক্রিনশট, নেভিগেশন | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron নির্ধারিত কাজ (LLM / স্ক্রিপ্ট কলব্যাক দ্বারা অটো-রান) | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | নতুন Skill তৈরি, পরীক্ষা এবং প্যাকেজ করতে সাহায্য করে | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Excel, PDF, Word, CSV এবং PPT ফাইল পার্স করে | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkey স্ক্রিপ্ট উন্নয়ন সহায়ক | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Synology Office স্প্রেডশিট পড়া/লেখা | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | WeChat অফিসিয়াল অ্যাকাউন্ট অপারেশন সহায়ক | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Xiaohongshu (RED) অপারেশন সহায়ক | [ইনস্টল](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## একটি Skill কনফিগার করা

কিছু Skill-এর কনফিগারেশন প্রয়োজন (যেমন একটি API কী):

1. **Agent → Skills** পৃষ্ঠায় ইনস্টল করা Skill খুঁজুন
2. **সেটিংস** আইকনে (গিয়ার) ক্লিক করুন
3. কনফিগারেশন ফিল্ড পূরণ করুন এবং সংরক্ষণ করুন

কনফিগারেশনে `secret` হিসাবে চিহ্নিত ফিল্ডগুলি UI-তে মাস্ক করা হয়।

## সক্রিয় / নিষ্ক্রিয়

Skills ম্যানেজমেন্ট পৃষ্ঠায়, একটি Skill-এর কার্ডে টগল ব্যবহার করে এটি সক্রিয় কিনা তা নিয়ন্ত্রণ করুন। নিষ্ক্রিয় Skill কথোপকথনে লোড হয় না।

## আপডেট পরীক্ষা

URL-এর মাধ্যমে ইনস্টল করা Skill সংস্করণ পরীক্ষা সমর্থন করে:

1. Skills পৃষ্ঠার উপরের ডানদিকে **আপডেট পরীক্ষা** বাটনে ক্লিক করুন
2. নতুন সংস্করণ উপলব্ধ Skill কার্ডগুলিতে একটি **আপডেট** বাটন দেখাবে
3. এক ক্লিকে আপগ্রেড করতে এটিতে ক্লিক করুন

আপডেটগুলি `SKILL.cat.md`-এ ঘোষিত `version` ফিল্ড (semver ফরম্যাট) ব্যবহার করে তুলনা করা হয়।

## কথোপকথনে Skill ব্যবহার

ইনস্টল করা Skill স্বয়ংক্রিয়ভাবে Agent কথোপকথনে উপলব্ধ। AI কথোপকথনের বিষয়বস্তুর ভিত্তিতে কখন একটি Skill-এর টুল লোড ও কল করবে তা সিদ্ধান্ত নেয়।

একটি কথোপকথন তৈরি করার সময় কোন Skill লোড করতে হবে তা নির্দিষ্টও করতে পারেন:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // স্বয়ংক্রিয়ভাবে সমস্ত Skill লোড করে
  // অথবা নির্দিষ্ট Skill উল্লেখ করুন
  // skills: ["browser-automation", "file-parser"]
});
```

## আরও জানুন

- [Skill ম্যানেজমেন্ট API](./agent-skill.md) — একটি স্ক্রিপ্ট থেকে প্রোগ্রাম্যাটিকভাবে Skill পরিচালনা করুন
- [Skill উন্নয়ন গাইড](./agent-skill-dev.md) — আপনার নিজের Skill তৈরি করুন
