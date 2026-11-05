---
title: Agent 智能助手
---

:::caution 测试阶段
Agent 功能目前仍处于测试阶段，以下 API 和行为可能会在正式发布前进行调整。
:::

## 概述

ScriptCat v1.4 引入了 Agent 智能助手系统，它为用户脚本提供了 AI 对话、浏览器自动化、文件管理、定时任务等一系列能力。

脚本通过 `CAT.agent.*` 命名空间调用这些能力，所有 API 均需要通过 `@grant` 声明对应权限。

## 功能模块

| 模块 | 权限声明 | 说明 |
|------|---------|------|
| [对话](./agent-conversation) | `@grant CAT.agent.conversation` | 创建 AI 对话、发送消息、流式接收、自定义工具 |
| [DOM 操作](./agent-dom) | `@grant CAT.agent.dom` | 页面导航、截图、点击、填充、滚动、DOM 监控 |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | 安装/卸载/调用 Skill 扩展包 |
| [定时任务](./agent-task) | `@grant CAT.agent.task` | Cron 定时任务、事件监听 |
| [模型](./agent-model) | `@grant CAT.agent.model` | 查询已配置的模型信息（只读） |
| [OPFS 文件](./agent-opfs) | `@grant CAT.agent.opfs` | 读写 Agent 工作区文件 |
| [MCP](./agent-mcp) | `@grant CAT.agent.mcp` | 管理 MCP 服务器连接 |
| [Skill 开发](./agent-skill-dev) | — | SKILL.cat.md + SkillScript 开发指南 |

## 快速上手

一个最简单的 Agent 脚本：

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("你好，请介绍一下你自己");
console.log(reply.content);
```

## 架构简述

Agent 系统跨越浏览器扩展的多个隔离上下文：

```
用户脚本 → Sandbox（隔离执行）
              ↓ WindowMessage
           Offscreen（DOM 访问）
              ↓ ExtensionMessage
           Service Worker（核心调度）
              ├── LLM Provider（OpenAI / Anthropic）
              ├── ToolRegistry（工具注册与执行）
              ├── SkillScriptExecutor（Skill 脚本执行）
              ├── MCPClient（MCP 协议客户端）
              └── TaskScheduler（定时任务调度）
```

### 存储结构

Agent 使用浏览器 OPFS（Origin Private File System）存储数据：

```
agents/
├── conversations/       # 对话历史
├── attachments/         # 附件（图片、文件）
├── skills/{name}/       # Skill 包文件
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # 定时任务配置和执行记录
└── workspace/           # 用户工作区文件（opfs_* 工具操作的目录）
```

### 支持的模型

| Provider | 格式 | 特性 |
|----------|------|------|
| OpenAI 兼容 | OpenAI Chat Completions API | 支持 GPT-4o、DeepSeek 等兼容模型 |
| Anthropic | Anthropic Messages API | 支持 Claude 系列，Prompt Caching |
| 智谱 | 智谱 API | 支持 GLM 系列模型 |

在管理页面的「模型配置」中添加 Provider 和 API Key 即可使用。

### Skill 生态

Skill 是提示词 + 工具脚本 + 参考资料的扩展包，可以为 Agent 注入专业领域知识和自定义工具。

**官方 Skill 仓库：[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

包含浏览器自动化、定时任务、Skill 创建工具、对话/DOM/配置示例等开箱即用的 Skill。

**安装方式：**

- **URL 安装** — 在浏览器中直接打开 `SKILL.cat.md` 的 URL，ScriptCat 自动拦截并弹出安装页面；也可在管理页面 → Agent → Skill 管理中粘贴 URL 安装
- **脚本安装** — 通过 `CAT.agent.skills.install()` API 编程式安装

**检查更新：**

通过 URL 安装的 Skill 会记录安装来源，管理页面中可检查更新并一键升级（基于 `version` 字段的 semver 比较）。

详见 [Skill 管理 API](./agent-skill) 和 [Skill 开发指南](./agent-skill-dev)。
