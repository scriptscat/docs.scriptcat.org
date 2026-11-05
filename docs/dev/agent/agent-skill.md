---
title: Skill 管理 API
---

`@grant CAT.agent.skills`

Skill 管理 API 允许脚本查询、安装、卸载和调用 Skill 扩展包。

关于 Skill 的开发和打包，请参阅 [Skill 开发指南](../agent-skill-dev)。官方 Skill 示例仓库：[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)。

## list — 列出已安装 Skill

```javascript
const skills = await CAT.agent.skills.list();
```

**返回值 SkillSummary[]：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | `string` | Skill 名称 |
| `description` | `string` | Skill 描述 |
| `version` | `string` | 版本号（semver） |
| `toolNames` | `string[]` | 包含的 SkillScript 工具名列表 |
| `referenceNames` | `string[]` | 包含的参考资料文件名列表 |
| `hasConfig` | `boolean` | 是否有配置字段声明 |
| `enabled` | `boolean` | 是否启用（默认 `true`） |
| `installUrl` | `string` | 安装来源 URL（用于检查更新） |
| `installtime` | `number` | 安装时间戳 |
| `updatetime` | `number` | 更新时间戳 |

## get — 获取 Skill 详情

```javascript
const skill = await CAT.agent.skills.get(name);
```

返回完整的 `SkillRecord`，如果不存在返回 `null`。

**SkillRecord 结构：**

继承 `SkillSummary` 的所有字段，额外包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `prompt` | `string` | SKILL.cat.md 中 Markdown 正文部分（给 AI 的提示词） |
| `config` | `Record<string, SkillConfigField>` | 配置字段定义（schema） |

**SkillConfigField 结构：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 显示标题 |
| `type` | `"text" \| "number" \| "select" \| "switch"` | 字段类型 |
| `secret` | `boolean` | 是否为敏感信息（UI 中遮盖显示） |
| `required` | `boolean` | 是否必填 |
| `default` | `unknown` | 默认值 |
| `values` | `string[]` | 选项列表（仅 `select` 类型） |

## install — 安装 Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `skillMd` | `string` | SKILL.cat.md 文件内容（必填） |
| `scripts` | `Array<{ name, code }>` | SkillScript 文件列表 |
| `references` | `Array<{ name, content }>` | 参考资料文件列表 |

如果同名 Skill 已存在，会执行更新操作。

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: 自定义搜索工具
---

当用户需要搜索时，使用 search 工具。`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API 文档\n..." }]
);
```

## remove — 卸载 Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

返回 `true` 表示卸载成功，`false` 表示 Skill 不存在。

## call — 直接调用 SkillScript

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

不经过 AI 对话，直接执行指定 Skill 中的 SkillScript。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `skillName` | `string` | Skill 名称（必填） |
| `scriptName` | `string` | SkillScript 名称（必填） |
| `params` | `Record<string, unknown>` | 传入参数（与 `@param` 声明对应） |

```javascript
// 直接调用 Skill 中的搜索脚本
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript 的执行有超时限制（默认 300 秒，可通过 `@timeout` 自定义）。
