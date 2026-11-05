---
title: Skill 管理 API
---

`@grant CAT.agent.skills`

Skill 管理 API 讓腳本可以查詢、安裝、移除和呼叫 Skill 擴充套件包。

有關 Skill 的開發和打包，請參閱 [Skill 開發指南](../agent-skill-dev)。官方 Skill 範例：[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)。

## list — 列出已安裝的 Skills

```javascript
const skills = await CAT.agent.skills.list();
```

**回傳 `SkillSummary[]`：**

| 欄位 | 型別 | 說明 |
|------|------|------|
| `name` | `string` | Skill 名稱 |
| `description` | `string` | Skill 描述 |
| `toolNames` | `string[]` | 包含的 SkillScript 工具名稱 |
| `referenceNames` | `string[]` | 包含的參考資料檔案名稱 |
| `hasConfig` | `boolean` | 是否宣告了設定欄位 |
| `enabled` | `boolean` | 是否啟用（預設為 `true`） |
| `installtime` | `number` | 安裝時間戳 |
| `updatetime` | `number` | 最後更新時間戳 |

> 注意：`version` 和 `installUrl`（管理頁面的更新檢查功能使用）不會透過此腳本 API 回傳 — 它們僅供更新檢查邏輯和管理頁面 UI 內部使用。

## get — 取得 Skill 詳情

```javascript
const skill = await CAT.agent.skills.get(name);
```

回傳完整的 `SkillRecord`，如果不存在則回傳 `null`。

**`SkillRecord` 結構：**

繼承 `SkillSummary` 的所有欄位，加上：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `prompt` | `string` | `SKILL.cat.md` 的 Markdown 內文（給 AI 的提示） |
| `config` | `Record<string, SkillConfigField>` | 設定欄位定義（Schema） |

**`SkillConfigField` 結構：**

| 欄位 | 型別 | 說明 |
|------|------|------|
| `title` | `string` | 顯示標題 |
| `type` | `"text" \| "number" \| "select" \| "switch"` | 欄位類型 |
| `secret` | `boolean` | 是否為敏感資料（在 UI 中遮蔽） |
| `required` | `boolean` | 是否為必填 |
| `default` | `unknown` | 預設值 |
| `values` | `string[]` | 選項清單（僅 `select` 類型） |

## install — 安裝 Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**參數：**

| 參數 | 型別 | 說明 |
|------|------|------|
| `skillMd` | `string` | `SKILL.cat.md` 檔案的內容（必填） |
| `scripts` | `Array<{ name, code }>` | SkillScript 檔案清單 |
| `references` | `Array<{ name, content }>` | 參考資料檔案清單 |

如果已存在同名的 Skill，則會更新它。

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: 自訂搜尋工具
---

當使用者需要搜尋時使用搜尋工具。`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API 文件\n..." }]
);
```

## remove — 移除 Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

成功移除回傳 `true`，Skill 不存在回傳 `false`。

## call — 直接呼叫 SkillScript

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

直接在指定的 Skill 中執行 SkillScript，無需經過 AI 對話。

**參數：**

| 參數 | 型別 | 說明 |
|------|------|------|
| `skillName` | `string` | Skill 名稱（必填） |
| `scriptName` | `string` | SkillScript 名稱（必填） |
| `params` | `Record<string, unknown>` | 傳入的參數（與 `@param` 宣告相符） |

```javascript
// 直接呼叫 Skill 內的搜尋腳本
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript 執行有逾時限制（預設 300 秒，可透過 `@timeout` 自訂）。
