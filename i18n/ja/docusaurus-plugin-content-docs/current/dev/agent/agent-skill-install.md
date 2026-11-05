---
title: スキルのインストールと使用方法
---

Skillは、AIにドメイン固有の知識とカスタムツールを注入するためのAgent拡張パッケージです。このページでは、Skillのインストール、設定、管理方法を説明します。

:::tip 公式Skillリポジトリ
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — ブラウザ自動化、スケジュールタスク、ファイル解析、スクリプト開発支援など、すぐに使用できるSkillです。
:::

## インストール方法

### 方法1: URLからインストール

ブラウザのアドレスバーに直接`SKILL.cat.md`のURLを開きます。ScriptCatがそれをキャッチし、インストール確認ページを表示します。

例えば、公式のブラウザ自動化Skillをインストールする場合：

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

管理ページから也可以行えます：

1. ScriptCat管理ページを開く → **Agent → Skills**
2. 右上の**URL**ボタンをクリック
3. `SKILL.cat.md`のURLを貼り付け
4. インストールをクリック

ScriptCatは`SKILL.cat.md`と、それが宣言するスクリプトや参照資料ファイルを自動的に取得します。

### 方法2: ZIPをインストール

1. ScriptCat管理ページを開く → **Agent → Skills**
2. 右上の**+**ボタンをクリック
3. `.zip`形式のSkillパッケージを選択

ZIPのディレクトリ構造は標準のSkill形式に従う必要があります（`SKILL.cat.md`を含む必要があります）。

## 公式Skill一覧

右クリックで**リンクをコピー**し、Skills管理のURLフィールドに貼り付けてインストールします。

| Skill | 説明 | インストール |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | ページ分析、DOM操作、フォーム入力、スクリーンショット、ナビゲーション | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cronスケジュールタスク（LLM/スクリプトコールバックによる自動実行） | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | 新しいSkillの作成、テスト、パッケージングを支援 | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Excel、PDF、Word、CSV、PPTファイルの解析 | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkeyスクリプト開発アシスタント | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Synology Officeスプレッドシートの読み書き | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | WeChat公式アカウント運用アシスタント | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | 小紅書（RED）運用アシスタント | [インストール](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Skillの設定

一部のSkillには設定が必要です（APIキーなど）：

1. **Agent → Skills**ページでインストール済みのSkillを見つける
2. **設定**アイコン（歯車）をクリック
3. 設定フィールドに入力して保存

設定で`secret`とマークされたフィールドはUIでマスクされます。

## 有効/無効の切り替え

Skills管理ページで、Skillカードのトグルを使用して有効/無効を制御します。無効なSkillは会話で読み込まれません。

## アップデートの確認

URLでインストールされたSkillはバージョンチェックをサポートしています：

1. Skillsページの右上の**アップデートを確認**ボタンをクリック
2. 新しいバージョンが利用可能なSkillカードには**更新**ボタンが表示される
3. クリックするとワンクリックでアップデート

アップデートは`SKILL.cat.md`で宣言された`version`フィールド（semver形式）を使用して比較されます。

## 会話でSkillを使用する

インストールされたSkillはAgent会話で自動的に利用可能になります。AIは会話の内容に基づいて、Skillのツールをいつ読み込み、呼び出すかを判断します。

会話を作成する際にどのSkillを読み込むかを指定することもできます：

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // すべてのSkillを自動的に読み込む
  // または特定のSkillを指定
  // skills: ["browser-automation", "file-parser"]
});
```

## 詳細情報

- [Skill管理API](./agent-skill.md) — スクリプトからSkillをプログラムで管理
- [Skill開発ガイド](./agent-skill-dev.md) — 独自のSkillを作成
