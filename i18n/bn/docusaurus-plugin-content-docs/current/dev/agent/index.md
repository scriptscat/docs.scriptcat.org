---
title: Agent
---

:::caution পরীক্ষামূলক পর্যায়
Agent ফিচারটি বর্তমানে এখনও পরীক্ষামূলক পর্যায়ে রয়েছে; অফিসিয়াল রিলিজের আগে নিম্নলিখিত API এবং আচরণ পরিবর্তিত হতে পারে।
:::

## ওভারভিউ

ScriptCat v1.4 Agent সিস্টেমটি চালু করে, যা ইউজার স্ক্রিপ্টগুলিকে AI কথোপকথন, ব্রাউজার অটোমেশন, ফাইল ম্যানেজমেন্ট এবং নির্ধারিত কাজ সহ একাধিক ক্ষমতা দেয়।

স্ক্রিপ্টগুলি `CAT.agent.*` নেমস্পেসের মাধ্যমে এই ক্ষমতাগুলি কল করে এবং প্রতিটি API-র জন্য `@grant` দিয়ে সংশ্লিষ্ট অনুমতি ঘোষণা করা প্রয়োজন।

## ফিচার মডিউল

| মডিউল | অনুমতি | বর্ণনা |
|------|---------|------|
| [কথোপকথন](./agent-conversation) | `@grant CAT.agent.conversation` | AI কথোপকথন তৈরি, বার্তা পাঠানো, স্ট্রিমিং প্রতিক্রিয়া, কাস্টম টুল সংজ্ঞায়িত |
| [DOM অপারেশন](./agent-dom) | `@grant CAT.agent.dom` | পৃষ্ঠা নেভিগেশন, স্ক্রিনশট, ক্লিক, পূরণ, স্ক্রল, DOM পর্যবেক্ষণ |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Skill প্যাকেজ ইনস্টল/আনইনস্টল/আমন্ত্রণ |
| [নির্ধারিত কাজ](./agent-task) | `@grant CAT.agent.task` | Cron নির্ধারিত কাজ, ইভেন্ট শোনা |
| [মডেল](./agent-model) | `@grant CAT.agent.model` | কনফিগার করা মডেল তথ্য জিজ্ঞাসা (শুধুমাত্র-পঠন) |
| [OPFS ফাইল](./agent-opfs) | `@grant CAT.agent.opfs` | Agent ওয়ার্কস্পেস ফাইল পড়া/লেখা |
| [MCP](./agent-mcp) | — | MCP সার্ভার সংযোগ কনফিগার করুন (শুধুমাত্র ম্যানেজমেন্ট পেজ, কোনো স্ক্রিপ্ট API নেই) |
| [Skill উন্নয়ন](./agent-skill-dev) | — | SKILL.cat.md + SkillScript উন্নয়ন গাইড |

## দ্রুত শুরু

সবচেয়ে সহজ সম্ভাব্য Agent স্ক্রিপ্ট:

```javascript
// ==UserScript==
// @name        হ্যালো Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("হাই, দয়া করে নিজের পরিচয় দিন");
console.log(reply.content);
```

## আর্কিটেকচার ওভারভিউ

Agent সিস্টেমটি ব্রাউজার এক্সটেনশনের মধ্যে একাধিক বিচ্ছিন্ন প্রসঙ্গ জুড়ে বিস্তৃত:

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

### স্টোরেজ কাঠামো

Agent ব্রাউজারের OPFS (Origin Private File System) ব্যবহার করে ডেটা সঞ্চয় করে:

```
agents/
├── conversations/       # কথোপকথনের ইতিহাস
├── attachments/         # সংযুক্তি (ছবি, ফাইল)
├── skills/{name}/       # Skill প্যাকেজ ফাইল
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # নির্ধারিত কাজের কনফিগ ও নির্বাহ রেকর্ড
└── workspace/           # ব্যবহারকারী ওয়ার্কস্পেস ফাইল (যে ডিরেক্টরিতে opfs_* টুল কাজ করে)
```

### সমর্থিত মডেল

| প্রদানকারী | ফরম্যাট | বৈশিষ্ট্য |
|----------|------|------|
| OpenAI-সামঞ্জস্যপূর্ণ | OpenAI Chat Completions API | GPT-4o, DeepSeek এবং অন্যান্য সামঞ্জস্যপূর্ণ মডেল সমর্থন করে |
| Anthropic | Anthropic Messages API | Claude পরিবার, Prompt Caching সমর্থন করে |
| Zhipu | Zhipu API | GLM মডেল পরিবার সমর্থন করে |

ব্যবহার করতে ড্যাশবোর্ডের "মডেল কনফিগারেশন"-এর অধীনে একটি প্রদানকারী এবং API কী যোগ করুন।

### Skill ইকোসিস্টেম

একটি Skill হল একটি প্যাকেজ যা prompt + টুল স্ক্রিপ্ট + রেফারেন্স উপাদান একত্রিত করে, যা আপনাকে ডোমেইন-নির্দিষ্ট জ্ঞান এবং কাস্টম টুল Agent-এ ইনজেক্ট করতে দেয়।

**অফিসিয়াল Skill রিপোজিটরি: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

ব্রাউজার অটোমেশন, নির্ধারিত কাজ, একটি Skill-নির্মাণ টুল, কথোপকথন/DOM/কনফিগ উদাহরণ এবং আরও অনেক কিছুর জন্য প্রস্তুত-ব্যবহারযোগ্য Skill অন্তর্ভুক্ত।

**ইনস্টলেশন পদ্ধতি:**

- **URL ইনস্টল** — `SKILL.cat.md` URL সরাসরি ব্রাউজারে খুলুন; ScriptCat স্বয়ংক্রিয়ভাবে এটি ইন্টারসেপ্ট করে ইনস্টল পেজ দেখায়। ড্যাশবোর্ডের Agent → Skill ম্যানেজমেন্টের অধীনে URL-টি পেস্টও করতে পারেন।
- **স্ক্রিপ্ট ইনস্টল** — `CAT.agent.skills.install()` API-এর মাধ্যমে প্রোগ্রাম্যাটিকভাবে ইনস্টল করুন

**আপডেট পরীক্ষা:**

URL-এর মাধ্যমে ইনস্টল করা একটি Skill তার ইনস্টল উৎস রেকর্ড করে; ড্যাশবোর্ড আপনাকে এক ক্লিকে আপডেট পরীক্ষা ও আপগ্রেড করতে দেয় (`version` ফিল্ডের semver তুলনার উপর ভিত্তি করে)।

বিস্তারিত জানতে [Skill ম্যানেজমেন্ট API](./agent-skill) এবং [Skill উন্নয়ন গাইড](./agent-skill-dev) দেখুন।
