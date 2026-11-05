---
title: Agent
---

:::caution 測試階段
Agent 功能目前仍處於測試階段；以下 API 和行為可能在正式發布前發生變化。
:::

## 概述

ScriptCat v1.4 引入了 Agent 系統，為使用者腳本提供了一組功能，包括 AI 對話、瀏覽器自動化、檔案管理和排程任務。

腳本透過 `CAT.agent.*` 命名空間呼叫這些功能，每個 API 都需要使用 `@grant` 宣告對應的權限。

## 功能模組

| 模組 | 權限 | 描述 |
|------|---------|------|
| [對話](./agent-conversation) | `@grant CAT.agent.conversation` | 建立 AI 對話、傳送訊息、串流回應、定義自訂工具 |
| [DOM 操作](./agent-dom) | `@grant CAT.agent.dom` | 頁面導航、截圖、點擊、填寫、捲動、DOM 監控 |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | 安裝/解除安裝/呼叫 Skill 套件 |
| [排程任務](./agent-task) | `@grant CAT.agent.task` | Cron 排程任務、事件監聽 |
| [模型](./agent-model) | `@grant CAT.agent.model` | 查詢已配置的模型資訊（唯讀） |
| [OPFS 檔案](./agent-opfs) | `@grant CAT.agent.opfs` | 讀寫 Agent 工作區檔案 |
| [MCP](./agent-mcp) | — | 配置 MCP 伺服器連接（僅管理頁面，無腳本 API） |
| [Skill 開發](./agent-skill-dev) | — | SKILL.cat.md + SkillScript 開發指南 |

## 快速開始

最簡單的 Agent 腳本：

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("你好，請自我介紹");
console.log(reply.content);
```

## 架構概述

Agent 系統橫跨瀏覽器擴充套件內的多個隔離上下文：

```
使用者腳本 → 沙箱（隔離執行）
              ↓ WindowMessage
           離屏（DOM 存取）
              ↓ ExtensionMessage
           服務工作者（核心排程）
              ├── LLM 供應商（OpenAI / Anthropic）
              ├── ToolRegistry（工具註冊和執行）
              ├── SkillScriptExecutor（Skill 腳本執行）
              ├── MCPClient（MCP 協定客戶端）
              └── TaskScheduler（排程任務排程器）
```

### 儲存結構

Agent 使用瀏覽器的 OPFS（Origin Private File System）儲存資料：

```
agents/
├── conversations/       # 對話歷史
├── attachments/         # 附件（圖片、檔案）
├── skills/{name}/       # Skill 套件檔案
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # 排程任務配置和執行記錄
└── workspace/           # 使用者工作區檔案（opfs_* 工具操作的目錄）
```

### 支援的模型

| 供應商 | 格式 | 功能 |
|----------|------|------|
| OpenAI 相容 | OpenAI Chat Completions API | 支援 GPT-4o、DeepSeek 和其他相容模型 |
| Anthropic | Anthropic Messages API | 支援 Claude 系列、Prompt Caching |
| 智譜 | 智譜 API | 支援 GLM 模型系列 |

在控制面板的「模型配置」中新增供應商和 API 金鑰即可使用。

### Skill 生態系統

Skill 是結合提示 + 工具腳本 + 參考資料的套件，讓您能夠將領域特定知識和自訂工具注入 Agent。

**官方 Skill 儲存庫：[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

包含適用於瀏覽器自動化、排程任務、Skill 建立工具、對話/DOM/配置範例等的現成 Skill。

**安裝方法：**

- **URL 安裝** — 在瀏覽器中直接開啟 `SKILL.cat.md` 的 URL；ScriptCat 會自動攔截並顯示安裝頁面。您也可以在控制面板的 Agent → Skill 管理下貼上 URL。
- **腳本安裝** — 透過 `CAT.agent.skills.install()` API 以程式方式安裝

**檢查更新：**

透過 URL 安裝的 Skill 會記錄其安裝來源；控制面板讓您一鍵檢查更新和升級（基於 `version` 欄位的 semver 比較）。

詳情請參閱 [Skill 管理 API](./agent-skill) 和 [Skill 開發指南](./agent-skill-dev)。
