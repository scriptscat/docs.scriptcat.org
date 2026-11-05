---
title: Skill管理API
---

`@grant CAT.agent.skills`

Skill管理APIにより、スクリプトはSkill拡張パッケージのクエリ、インストール、削除、呼び出しができます。

Skillの開発とパッケージングについては、[Skill開発ガイド](../agent-skill-dev)を参照してください。公式Skill例：[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)。

## list — インストール済みSkillの一覧

```javascript
const skills = await CAT.agent.skills.list();
```

**`SkillSummary[]`を返します：**

| フィールド | 型 | 説明 |
|------|------|------|
| `name` | `string` | Skill名 |
| `description` | `string` | Skillの説明 |
| `toolNames` | `string[]` | 含まれるSkillScriptツールの名前 |
| `referenceNames` | `string[]` | 含まれる参照資料ファイルの名前 |
| `hasConfig` | `boolean` | 設定フィールドを宣言しているかどうか |
| `enabled` | `boolean` | 有効かどうか（デフォルトは`true`） |
| `installtime` | `number` | インストールタイムスタンプ |
| `updatetime` | `number` | 最終更新タイムスタンプ |

> 注意：`version`と`installUrl`（管理ページの更新チェック機能で使用）はこのスクリプトAPIでは返されません — 更新チェックロジックと管理ページUIの内部でのみ使用されます。

## get — Skillの詳細を取得

```javascript
const skill = await CAT.agent.skills.get(name);
```

完全な`SkillRecord`を返します。存在しない場合は`null`を返します。

**`SkillRecord`の構造：**

`SkillSummary`のすべてのフィールドを継承し、追加：

| フィールド | 型 | 説明 |
|------|------|------|
| `prompt` | `string` | `SKILL.cat.md`のMarkdown本文（AIに与えるプロンプト） |
| `config` | `Record<string, SkillConfigField>` | 設定フィールド定義（スキーマ） |

**`SkillConfigField`の構造：**

| フィールド | 型 | 説明 |
|------|------|------|
| `title` | `string` | 表示タイトル |
| `type` | `"text" \| "number" \| "select" \| "switch"` | フィールドタイプ |
| `secret` | `boolean` | 機密かどうか（UIでマスク） |
| `required` | `boolean` | 必須かどうか |
| `default` | `unknown` | デフォルト値 |
| `values` | `string[]` | 選択肢リスト（`select`タイプのみ） |

## install — Skillをインストール

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**パラメータ：**

| パラメータ | 型 | 説明 |
|------|------|------|
| `skillMd` | `string` | `SKILL.cat.md`ファイルの内容（必須） |
| `scripts` | `Array<{ name, code }>` | SkillScriptファイルのリスト |
| `references` | `Array<{ name, content }>` | 参照資料ファイルのリスト |

同じ名前のSkillが既に存在する場合、更新します。

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: カスタム検索ツール
---

ユーザーが検索する必要がある場合に検索ツールを使用します。`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# APIドキュメント\n..." }]
);
```

## remove — Skillをアンインストール

```javascript
const success = await CAT.agent.skills.remove(name);
```

正常に削除された場合は`true`、Skillが存在しない場合は`false`を返します。

## call — SkillScriptを直接呼び出し

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

AI会話を経由せずに、指定されたSkill内のSkillScriptを直接実行します。

**パラメータ：**

| パラメータ | 型 | 説明 |
|------|------|------|
| `skillName` | `string` | Skill名（必須） |
| `scriptName` | `string` | SkillScript名（必須） |
| `params` | `Record<string, unknown>` | 渡すパラメータ（`@param`宣言に一致） |

```javascript
// Skill内の検索スクリプトを直接呼び出し
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScriptの実行にはタイムアウトがあります（デフォルト300秒、`@timeout`でカスタマイズ可能）。
