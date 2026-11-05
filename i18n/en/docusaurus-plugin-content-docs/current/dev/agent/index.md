---
title: Agent
---

:::caution Testing Phase
The Agent feature is currently still in a testing phase; the following APIs and behavior may change before the official release.
:::

## Overview

ScriptCat v1.4 introduces the Agent system, giving user scripts a set of capabilities including AI conversation, browser automation, file management, and scheduled tasks.

Scripts call these capabilities through the `CAT.agent.*` namespace, and every API requires the corresponding permission to be declared with `@grant`.

## Feature Modules

| Module | Permission | Description |
|------|---------|------|
| [Conversation](./agent-conversation) | `@grant CAT.agent.conversation` | Create AI conversations, send messages, stream responses, define custom tools |
| [DOM Operations](./agent-dom) | `@grant CAT.agent.dom` | Page navigation, screenshots, clicking, filling, scrolling, DOM monitoring |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Install/uninstall/invoke Skill packages |
| [Scheduled Tasks](./agent-task) | `@grant CAT.agent.task` | Cron scheduled tasks, event listening |
| [Model](./agent-model) | `@grant CAT.agent.model` | Query configured model information (read-only) |
| [OPFS Files](./agent-opfs) | `@grant CAT.agent.opfs` | Read/write Agent workspace files |
| [MCP](./agent-mcp) | `@grant CAT.agent.mcp` | Manage MCP server connections |
| [Skill Development](./agent-skill-dev) | — | SKILL.cat.md + SkillScript development guide |

## Quick Start

The simplest possible Agent script:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Hi, please introduce yourself");
console.log(reply.content);
```

## Architecture Overview

The Agent system spans multiple isolated contexts within the browser extension:

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

### Storage Structure

The Agent stores data using the browser's OPFS (Origin Private File System):

```
agents/
├── conversations/       # conversation history
├── attachments/         # attachments (images, files)
├── skills/{name}/       # Skill package files
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # scheduled task config and execution records
└── workspace/           # user workspace files (the directory opfs_* tools operate on)
```

### Supported Models

| Provider | Format | Features |
|----------|------|------|
| OpenAI-compatible | OpenAI Chat Completions API | Supports GPT-4o, DeepSeek, and other compatible models |
| Anthropic | Anthropic Messages API | Supports the Claude family, Prompt Caching |
| Zhipu | Zhipu API | Supports the GLM model family |

Add a Provider and API Key under "Model Configuration" in the dashboard to use it.

### The Skill Ecosystem

A Skill is a package combining prompts + tool scripts + reference material, letting you inject domain-specific knowledge and custom tools into the Agent.

**Official Skill repository: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Includes ready-to-use Skills for browser automation, scheduled tasks, a Skill-creation tool, conversation/DOM/config examples, and more.

**Installation methods:**

- **URL install** — open the `SKILL.cat.md` URL directly in the browser; ScriptCat automatically intercepts it and shows the install page. You can also paste the URL under the dashboard's Agent → Skill Management.
- **Script install** — install programmatically via the `CAT.agent.skills.install()` API

**Checking for updates:**

A Skill installed via URL records its install source; the dashboard lets you check for updates and upgrade with one click (based on semver comparison of the `version` field).

See [Skill Management API](./agent-skill) and [Skill Development Guide](./agent-skill-dev) for details.
