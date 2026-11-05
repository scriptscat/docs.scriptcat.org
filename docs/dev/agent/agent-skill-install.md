---
title: Skill 安装与使用
---

Skill 是 Agent 的扩展能力包，为 AI 注入专业领域知识和自定义工具。本页介绍如何安装、配置和管理 Skill。

:::tip 官方 Skill 仓库
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — 包含浏览器自动化、定时任务、文件解析、脚本开发助手等开箱即用的 Skill。
:::

## 安装方式

### 方式一：URL 安装

在浏览器地址栏直接打开 `SKILL.cat.md` 的 URL，ScriptCat 会自动拦截并弹出安装确认页面。

例如安装官方的 browser-automation Skill：

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

也可以在管理页面操作：

1. 打开 ScriptCat 管理页面 → **Agent → Skills**
2. 点击右上角 **URL** 按钮
3. 粘贴 `SKILL.cat.md` 的 URL
4. 点击安装

ScriptCat 会自动获取 `SKILL.cat.md` 及其声明的脚本和参考资料文件。

### 方式二：ZIP 安装

1. 打开 ScriptCat 管理页面 → **Agent → Skills**
2. 点击右上角 **+** 按钮
3. 选择 `.zip` 格式的 Skill 包

ZIP 包的目录结构应符合标准 Skill 格式（包含 `SKILL.cat.md`）。

## 官方 Skill 列表

右键`复制链接`，在SKILL管理 URL 粘贴链接也可安装

| Skill | 说明 | 安装 |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | 页面分析、DOM 操作、表单填写、截图、导航 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron 定时任务（LLM 自动执行 / 脚本回调） | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | 辅助创建、测试和打包新 Skill | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | 解析 Excel、PDF、Word、CSV、PPT 文件 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | 脚本猫/油猴脚本开发助手 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | 读写群晖 Synology Office 电子表格 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | 微信公众号运营助手 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | 小红书运营助手 | [安装](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## 配置 Skill

部分 Skill 需要填写配置（如 API Key）：

1. 在 **Agent → Skills** 页面找到已安装的 Skill
2. 点击 **设置** 图标（齿轮）
3. 填写配置项并保存

配置中标记为 `secret` 的字段会在 UI 中遮盖显示。

## 启用 / 禁用

在 Skills 管理页面，通过 Skill 卡片上的开关控制启用状态。禁用的 Skill 不会在对话中加载。

## 检查更新

通过 URL 安装的 Skill 支持版本检查：

1. 点击 Skills 页面右上角的 **检查更新** 按钮
2. 有新版本的 Skill 卡片上会出现 **更新** 按钮
3. 点击即可一键升级

更新基于 `SKILL.cat.md` 中声明的 `version` 字段（semver 格式）进行比较。

## 在对话中使用

安装的 Skill 会自动在 Agent 对话中可用。AI 会根据对话内容判断何时加载和调用 Skill 的工具。

你也可以在创建对话时指定加载哪些 Skill：

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // 自动加载所有 Skill
  // 或指定特定 Skill
  // skills: ["browser-automation", "file-parser"]
});
```

## 了解更多

- [Skill 管理 API](./agent-skill.md) — 通过脚本编程式管理 Skill
- [Skill 开发指南](./agent-skill-dev.md) — 创建自己的 Skill
