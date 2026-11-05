---
title: Agent
---

:::caution テスト段階
Agent機能は現在テスト段階にあります。以下のAPIと動作は正式リリース前に変更される場合があります。
:::

## 概要

ScriptCat v1.4はAgentシステムを導入し、ユーザースクリプトにAI会話、ブラウザ自動化、ファイル管理、スケジュールタスクなどの一連の機能を提供します。

スクリプトは `CAT.agent.*` 名前空間を通じてこれらの機能を呼び出し、すべてのAPIには `@grant` で対応する権限を宣言する必要があります。

## 機能モジュール

| モジュール | 権限 | 説明 |
|------|---------|------|
| [会話](./agent-conversation) | `@grant CAT.agent.conversation` | AI会話を作成、メッセージ送信、レスポンスストリーミング、カスタムツール定義 |
| [DOM操作](./agent-dom) | `@grant CAT.agent.dom` | ページナビゲーション、スクリーンショット、クリック、入力、スクロール、DOM監視 |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Skillパッケージのインストール/アンインストール/呼び出し |
| [スケジュールタスク](./agent-task) | `@grant CAT.agent.task` | Cronスケジュールタスク、イベントリスニング |
| [モデル](./agent-model) | `@grant CAT.agent.model` | 設定されたモデル情報のクエリ（読み取り専用） |
| [OPFSファイル](./agent-opfs) | `@grant CAT.agent.opfs` | Agentワークスペースファイルの読み書き |
| [MCP](./agent-mcp) | — | MCPサーバー接続の設定（管理ページのみ、スクリプトAPIなし） |
| [Skill開発](./agent-skill-dev) | — | SKILL.cat.md + SkillScript開発ガイド |

## クイックスタート

最もシンプルなAgentスクリプト：

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("こんにちは、自己紹介してください");
console.log(reply.content);
```

## アーキテクチャ概要

Agentシステムは、ブラウザ拡張機能内の複数の分離されたコンテキストにまたがります：

```
ユーザースクリプト → サンドボックス（分離された実行）
              ↓ WindowMessage
           オフスクリーン（DOMアクセス）
              ↓ ExtensionMessage
           サービスワーカー（コアスケジューリング）
              ├── LLMプロバイダー（OpenAI / Anthropic）
              ├── ToolRegistry（ツール登録と実行）
              ├── SkillScriptExecutor（Skillスクリプト実行）
              ├── MCPClient（MCPプロトコルクライアント）
              └── TaskScheduler（スケジュールタスクスケジューリング）
```

### ストレージ構造

AgentはブラウザのOPFS（Origin Private File System）を使用してデータを保存します：

```
agents/
├── conversations/       # 会話履歴
├── attachments/         # 添付ファイル（画像、ファイル）
├── skills/{name}/       # Skillパッケージファイル
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # スケジュールタスク設定と実行記録
└── workspace/           # ユーザーワークスペースファイル（opfs_*ツールが操作するディレクトリ）
```

### サポートされているモデル

| プロバイダー | フォーマット | 機能 |
|----------|------|------|
| OpenAI互換 | OpenAI Chat Completions API | GPT-4o、DeepSeekなどの互換モデルをサポート |
| Anthropic | Anthropic Messages API | Claudeファミリー、Prompt Cachingをサポート |
| 智譜 | 智譜API | GLMモデルファミリーをサポート |

ダッシュボードの「モデル設定」でプロバイダーとAPIキーを追加して使用してください。

### Skillエコシステム

Skillは、プロンプト + ツールスクリプト + リファレンス資料を組み合わせたパッケージで、ドメイン固有の知識とカスタムツールをAgentに注入できます。

**公式Skillリポジトリ：[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

ブラウザ自動化、スケジュールタスク、Skill作成ツール、会話/DOM/設定の例など、すぐに使えるSkillが含まれています。

**インストール方法：**

- **URLインストール** — ブラウザで `SKILL.cat.md` のURLを直接開きます。ScriptCatが自動的にキャッチし、インストールページを表示します。ダッシュボードのAgent → Skill管理でURLを貼り付けることもできます。
- **スクリプトインストール** — `CAT.agent.skills.install()` APIを介してプログラムでインストール

**更新の確認：**

URLでインストールされたSkillはインストール元を記録します。ダッシュボードでワンクリックで更新を確認し、アップグレードできます（`version` フィールドのsemver比較に基づく）。

詳細は [Skill管理API](./agent-skill) と [Skill開発ガイド](./agent-skill-dev) を参照してください。
