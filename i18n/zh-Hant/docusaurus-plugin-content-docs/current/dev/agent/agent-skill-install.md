---
title: 安裝和使用 Skills
---

Skill 是 Agent 的擴充套件包，用於向 AI 注入特定領域的知識和自訂工具。本頁面介紹如何安裝、設定和管理 Skills。

:::tip 官方 Skill 儲存庫
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — 即用型 Skills，適用於瀏覽器自動化、排程任務、檔案解析、腳本開發輔助等。
:::

## 安裝方法

### 方法 1：從 URL 安裝

直接在瀏覽器的網址列中開啟 `SKILL.cat.md` URL；ScriptCat 會攔截並彈出安裝確認頁面。

例如，安裝官方瀏覽器自動化 Skill：

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

您也可以從管理頁面進行：

1. 開啟 ScriptCat 管理頁面 → **Agent → Skills**
2. 點選右上角的 **URL** 按鈕
3. 貼上 `SKILL.cat.md` URL
4. 點選安裝

ScriptCat 會自動獲取 `SKILL.cat.md` 以及它宣告的腳本和參考資料檔案。

### 方法 2：安裝 ZIP

1. 開啟 ScriptCat 管理頁面 → **Agent → Skills**
2. 點選右上角的 **+** 按鈕
3. 選擇 `.zip` 格式的 Skill 套件

ZIP 的目錄結構應遵循標準 Skill 格式（必須包含 `SKILL.cat.md`）。

## 官方 Skill 列表

右鍵點選**複製連結**，然後將連結貼到 Skills 管理的 URL 欄位中以安裝。

| Skill | 說明 | 安裝 |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | 頁面分析、DOM 操作、表單填寫、截圖、導航 | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron 排程任務（由 LLM/腳本回調自動執行） | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | 協助建立、測試和打包新的 Skills | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | 解析 Excel、PDF、Word、CSV 和 PPT 檔案 | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkey 腳本開發助手 | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | 讀寫 Synology Office 試算表 | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | 微信公眾號運營助手 | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | 小紅書（RED）運營助手 | [安裝](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## 設定 Skill

部分 Skills 需要設定（如 API 金鑰）：

1. 在 **Agent → Skills** 頁面上找到已安裝的 Skill
2. 點選**設定**圖示（齒輪）
3. 填寫設定欄位並儲存

設定中标記為 `secret` 的欄位會在介面中被遮蔽。

## 啟用 / 停用

在 Skills 管理頁面上，使用 Skill 卡片上的開關來控制是否啟用。停用的 Skills 不會在對話中載入。

## 檢查更新

透過 URL 安裝的 Skills 支援版本檢查：

1. 點選 Skills 頁面右上角的**檢查更新**按鈕
2. 有新版本可用的 Skill 卡片會顯示**更新**按鈕
3. 點選即可一鍵升級

更新使用 `SKILL.cat.md` 中宣告的 `version` 欄位（semver 格式）進行比較。

## 在對話中使用 Skills

已安裝的 Skills 在 Agent 對話中自動可用。AI 會根據對話內容決定何時載入和呼叫 Skill 的工具。

您也可以在建立對話時指定要載入哪些 Skills：

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // 自動載入所有 Skills
  // 或指定特定的 Skills
  // skills: ["browser-automation", "file-parser"]
});
```

## 了解更多

- [Skill 管理 API](./agent-skill.md) — 從腳本以程式方式管理 Skills
- [Skill 開發指南](./agent-skill-dev.md) — 建立您自己的 Skill
