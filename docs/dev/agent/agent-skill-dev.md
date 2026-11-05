---
title: Skill 开发指南
---

Skill 是 Agent 系统的扩展包，由**提示词 + 工具脚本 + 参考资料**组合而成。通过 Skill，可以为 AI 注入专业领域知识和自定义工具能力。

## Skill 目录结构

```
my-skill/
├── SKILL.cat.md          # 必须：元数据 + 提示词（入口文件）
├── scripts/              # 可选：SkillScript 工具脚本
│   ├── search.js
│   └── export.js
└── references/           # 可选：参考资料文件
    ├── api-docs.md
    └── examples.json
```

> `SKILL.cat.md` 是 Skill 的入口文件。通过 URL 安装时，ScriptCat 会先获取此文件，再根据 frontmatter 中声明的 `scripts` 和 `references` 按相对路径获取其他文件。

## SKILL.cat.md 格式

SKILL.cat.md 使用 YAML frontmatter 声明元数据，Markdown 正文作为给 AI 的提示词。

```markdown
---
name: "weather-assistant"
description: "天气查询助手，支持全球城市天气查询和预报"
config:
  apiKey:
    title: "OpenWeather API Key"
    type: "text"
    secret: true
    required: true
  unit:
    title: "温度单位"
    type: "select"
    values: ["celsius", "fahrenheit"]
    default: "celsius"
  detailed:
    title: "详细模式"
    type: "switch"
    default: false
  maxDays:
    title: "预报天数"
    type: "number"
    default: 7
---

# 天气查询助手

你可以使用以下工具查询天气信息：

## 工具说明

- **get_weather**: 查询指定城市的当前天气和未来预报
  - 参数 `city` 为城市名称（支持中英文）
  - 参数 `days` 为预报天数

## 使用规则

1. 用户询问天气时，先确认城市名称
2. 默认返回当前天气 + 3 天预报
3. 温度根据配置的单位显示
```

### 元数据字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | Skill 唯一标识名（建议英文 kebab-case） |
| `description` | `string` | 是 | 简短描述（显示在列表中） |
| `version` | `string` | 否 | 版本号（semver 格式，如 `1.0.0`），用于更新检查 |
| `scripts` | `string[]` | 否 | 脚本文件名列表（如 `["search.js"]`），URL 安装时自动从 `scripts/` 目录获取 |
| `references` | `string[]` | 否 | 参考资料文件名列表（如 `["api-docs.md"]`），URL 安装时自动从 `references/` 目录获取 |
| `config` | `object` | 否 | 配置字段定义 |

### 配置字段类型

| type | 说明 | 特有属性 |
|------|------|---------|
| `text` | 文本输入框 | `secret`: 是否遮盖显示 |
| `number` | 数字输入框 | — |
| `select` | 下拉选择 | `values`: 选项列表（`string[]`） |
| `switch` | 开关 | — |

**通用属性：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 显示标题 |
| `required` | `boolean` | 是否必填 |
| `default` | `unknown` | 默认值 |
| `secret` | `boolean` | 是否为敏感信息 |

用户在管理页面的 Skill 设置中填写配置值。

### 提示词正文

Markdown 正文部分会作为 AI 的系统提示词注入。编写建议：

- 描述 Skill 提供的工具及其用途
- 说明工具参数的含义和使用规则
- 给出典型使用场景和注意事项
- 如果有参考资料，说明如何查阅

## SkillScript 工具脚本

SkillScript 是可被 AI 调用的工具脚本。每个 SkillScript 文件会被注册为一个 LLM tool。

### 元数据格式

```javascript
// ==SkillScript==
// @name        get_weather
// @description 查询指定城市的天气信息
// @param       city string [required] 城市名称，支持中英文
// @param       days number 预报天数，默认3天
// @param       format string [json,text] 输出格式
// @grant       CAT.agent.opfs
// @require     https://cdn.example.com/utils.js
// @timeout     60
// ==SkillScript==
```

### 元数据字段

| 标签 | 说明 | 示例 |
|------|------|------|
| `@name` | 工具名称（AI 调用时使用） | `get_weather` |
| `@description` | 工具描述（AI 据此判断何时调用） | `查询城市天气` |
| `@param` | 参数定义（可多个） | 见下方 |
| `@grant` | 需要的 GM API 权限 | `CAT.agent.opfs` |
| `@require` | 外部库 URL（会被缓存加载） | `https://cdn.example.com/lib.js` |
| `@timeout` | 执行超时秒数 | `60`（默认 300） |

### @param 语法

```
@param 参数名 类型[枚举值] [required] 描述
```

**类型：** `string`、`number`、`boolean`

**枚举值（可选）：** 用方括号包裹，逗号分隔

**必填标记：** 描述前加 `[required]`

```javascript
// 必填字符串参数
// @param city string [required] 城市名称

// 带枚举的字符串参数
// @param unit string [celsius,fahrenheit] 温度单位

// 可选数字参数
// @param days number 预报天数

// 布尔参数
// @param detailed boolean 是否返回详细信息
```

参数定义会自动转换为 JSON Schema，供 LLM 调用时使用。

### 脚本编写

```javascript
// ==SkillScript==
// @name        get_weather
// @description 查询指定城市的天气信息
// @param       city string [required] 城市名称
// @param       days number 预报天数
// @timeout     30
// ==SkillScript==

// 1. 通过 arguments[0] 接收 AI 传入的参数
const { city, days = 3 } = arguments[0];

// 2. CAT_CONFIG 提供用户在管理页面填写的 Skill 配置
const apiKey = CAT_CONFIG.apiKey;
const unit = CAT_CONFIG.unit || "celsius";

// 3. 执行业务逻辑
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${days}&units=${unit === "celsius" ? "metric" : "imperial"}&appid=${apiKey}`;
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`API 请求失败: ${response.status}`);
}

const data = await response.json();

// 4. 通过 return 将结果返回给 AI
return {
  city: data.city.name,
  country: data.city.country,
  forecasts: data.list.map(item => ({
    date: item.dt_txt,
    temp: item.main.temp,
    description: item.weather[0].description
  }))
};
```

### 执行环境

| 特性 | 说明 |
|------|------|
| **执行位置** | Sandbox 隔离环境（无 DOM 访问） |
| **参数获取** | `arguments[0]` — AI 传入的参数对象 |
| **配置获取** | `CAT_CONFIG` — 全局只读对象，包含用户配置 |
| **返回值** | `return` 语句返回 JSON 可序列化的值 |
| **异步支持** | 支持 `async/await`、`fetch`、`Promise` |
| **外部库** | 通过 `@require` 加载，缓存到本地 |
| **超时** | 默认 300 秒，可通过 `@timeout` 自定义 |
| **GM API** | 通过 `@grant` 声明后可使用（如 `CAT.agent.opfs`） |

### @require 外部库

```javascript
// ==SkillScript==
// @name        analyze
// @description 数据分析
// @require     https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js
// ==SkillScript==

// @require 加载的库可直接使用
const result = _.groupBy(data, "category");
return result;
```

外部库会在首次加载时缓存，后续执行直接使用缓存版本。

## 参考资料

`references/` 目录中的文件作为 AI 可查阅的参考资料。当 AI 需要时，会通过内置的 `read_reference` 工具读取这些文件。

适合放入参考资料的内容：
- API 文档
- 数据格式说明
- 使用示例集合
- 领域知识文档

## 示例仓库

官方维护了一个 Skill 示例仓库，包含多个开箱即用的 Skill 和脚本 API 示例：

**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

**Skill 列表：**

| 目录 | 说明 | 安装 |
|------|------|------|
| `browser-automation/` | 页面分析、DOM 操作、表单填写、截图、导航 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| `scheduled-tasks/` | Cron 定时任务（internal + event 模式） | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| `skill-creator/` | 辅助创建、测试和打包新 Skill | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| `file-parser/` | 解析常见文件格式（Excel、PDF、Word、CSV、PPT） | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| `scriptcat-dev/` | 脚本猫/油猴脚本开发助手 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| `synology-office-sheet/` | 读写群晖 Synology Office 电子表格 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| `wechat-publisher/` | 微信公众号运营助手 — 素材收集、文章编写与发布 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| `xiaohongshu-publisher/` | 小红书运营助手 — 笔记编写、配图生成与发布 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

**示例代码：**

| 目录 | 说明 |
|------|------|
| `examples/conversation/` | 对话 API 示例 — 聊天、流式、工具调用 |
| `examples/dom/` | DOM API 示例 — 页面读取、表单填写、标签管理 |
| `examples/config/` | Skill Config 示例 — 配置字段声明和 `CAT_CONFIG` 使用 |
| `examples/page_copilot.user.js` | 完整用户脚本示例 — 右键 AI 助手 + 流式 UI |

建议从示例仓库中的代码开始学习 Skill 开发。

## 安装方式

### URL 安装

在浏览器中直接打开 `SKILL.cat.md` 的 URL，ScriptCat 会自动拦截并弹出安装页面。

也可以在管理页面 → Agent → Skill 管理中：

1. 点击 URL 安装按钮
2. 粘贴 `SKILL.cat.md` 的 URL
3. 确认安装

ScriptCat 会先获取 `SKILL.cat.md`，然后根据 frontmatter 中的 `scripts` 和 `references` 声明，按相对路径获取其他文件。安装后会记录 `installUrl`，后续可通过版本号检查更新。

### 通过脚本安装

```javascript
// ==UserScript==
// @grant CAT.agent.skills
// ==/UserScript==

await CAT.agent.skills.install(
  skillMdContent,
  [{ name: "search.js", code: scriptCode }],
  [{ name: "docs.md", content: docsContent }]
);
```

## Skill 加载机制

Skill 采用三层渐进加载，优化上下文使用：

| 层级 | 时机 | 内容 |
|------|------|------|
| **摘要** | 对话开始时 | Skill 名称 + 描述 + 工具列表（注入系统提示词） |
| **提示词** | AI 主动 `load_skill` 时 | SKILL.cat.md 完整正文 |
| **工具** | load_skill 后 | SkillScript 注册为可调用的 LLM tool |

AI 在需要时会自动调用 `load_skill` 加载完整的 Skill 内容和工具。

## 完整示例

### 目录结构

```
translator-skill/
├── SKILL.cat.md
├── scripts/
│   └── translate.js
└── references/
    └── language-codes.md
```

### SKILL.cat.md

```markdown
---
name: "translator"
description: "多语言翻译工具，支持 100+ 种语言"
version: "1.0.0"
scripts:
  - translate.js
references:
  - language-codes.md
config:
  apiKey:
    title: "翻译 API Key"
    type: "text"
    secret: true
    required: true
  defaultTarget:
    title: "默认目标语言"
    type: "select"
    values: ["zh", "en", "ja", "ko", "fr", "de", "es"]
    default: "zh"
---

# 翻译助手

使用 `translate` 工具进行翻译。参考 language-codes.md 获取完整的语言代码列表。

## 使用规则

- 如果用户没有指定目标语言，使用配置中的默认语言
- 长文本自动分段翻译
- 保留原文格式（Markdown、代码块等）
```

### scripts/translate.js

```javascript
// ==SkillScript==
// @name        translate
// @description 翻译文本到指定语言
// @param       text string [required] 要翻译的文本
// @param       target string 目标语言代码（默认使用配置值）
// @param       source string 源语言代码（默认自动检测）
// @timeout     60
// ==SkillScript==

const { text, target, source } = arguments[0];
const apiKey = CAT_CONFIG.apiKey;
const targetLang = target || CAT_CONFIG.defaultTarget || "zh";

const response = await fetch("https://api.example.com/translate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    text,
    target_language: targetLang,
    source_language: source || "auto"
  })
});

if (!response.ok) {
  throw new Error(`翻译失败: ${response.statusText}`);
}

const result = await response.json();
return {
  original: text,
  translated: result.translated_text,
  source_language: result.detected_language,
  target_language: targetLang
};
```

### references/language-codes.md

```markdown
# 语言代码参考

| 代码 | 语言 |
|------|------|
| zh | 中文 |
| en | 英语 |
| ja | 日语 |
| ko | 韩语 |
| fr | 法语 |
| de | 德语 |
| es | 西班牙语 |
| ...  | ... |
```
