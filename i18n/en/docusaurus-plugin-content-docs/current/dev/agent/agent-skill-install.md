---
title: Installing and Using Skills
---

A Skill is an extension package for the Agent that injects domain-specific knowledge and custom tools into the AI. This page covers how to install, configure, and manage Skills.

:::tip Official Skill Repository
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — includes ready-to-use Skills for browser automation, scheduled tasks, file parsing, a script development assistant, and more.
:::

## Installation Methods

### Method 1: Install via URL

Open the `SKILL.cat.md` URL directly in the browser's address bar; ScriptCat automatically intercepts it and shows an install confirmation page.

For example, installing the official browser-automation Skill:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

You can also do this from the dashboard:

1. Open the ScriptCat dashboard → **Agent → Skills**
2. Click the **URL** button in the upper right
3. Paste the `SKILL.cat.md` URL
4. Click Install

ScriptCat automatically fetches `SKILL.cat.md` along with the scripts and reference files it declares.

### Method 2: Install via ZIP

1. Open the ScriptCat dashboard → **Agent → Skills**
2. Click the **+** button in the upper right
3. Choose a Skill package in `.zip` format

The ZIP package's directory structure should follow the standard Skill format (containing `SKILL.cat.md`).

## Official Skill List

You can also right-click `Copy Link` and paste it into the Skill Management URL field to install.

| Skill | Description | Install |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Page analysis, DOM operations, form filling, screenshots, navigation | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron scheduled tasks (LLM auto-execution / script callbacks) | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Helps create, test, and package new Skills | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Parses Excel, PDF, Word, CSV, and PPT files | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat userscript development assistant | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Reads/writes Synology Office spreadsheets | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | WeChat Official Account operations assistant | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Xiaohongshu (RED) operations assistant | [Install](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Configuring a Skill

Some Skills require configuration (like an API Key):

1. Find the installed Skill on the **Agent → Skills** page
2. Click the **settings** icon (gear)
3. Fill in the configuration and save

Fields marked `secret` in the configuration are masked in the UI.

## Enable / Disable

On the Skills management page, use the toggle on a Skill's card to control whether it's enabled. Disabled Skills are not loaded into conversations.

## Checking for Updates

Skills installed via URL support version checking:

1. Click the **Check for Updates** button in the upper right of the Skills page
2. A Skill card with a new version available shows an **Update** button
3. Click it to upgrade with one click

Updates are compared using the `version` field (in semver format) declared in `SKILL.cat.md`.

## Using Skills in a Conversation

Installed Skills are automatically available in Agent conversations. The AI decides when to load and call a Skill's tools based on the conversation content.

You can also specify which Skills to load when creating a conversation:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // automatically load all Skills
  // or specify particular Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## Learn More

- [Skill Management API](./agent-skill.md) — manage Skills programmatically from a script
- [Skill Development Guide](./agent-skill-dev.md) — create your own Skill
