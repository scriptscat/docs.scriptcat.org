---
title: Introduction
---

ScriptCat supports three types of scripts:

| Type | When it runs |
|---|---|
| Page scripts | When you open a matching web page; these are what people usually call userscripts |
| [Background scripts](./background.md) | Without any page, for as long as the browser is open; specific to ScriptCat |
| [Scheduled scripts](./background.md#scheduled-script-crontab) | On a cron schedule; specific to ScriptCat |

## Ways to develop

- **The built-in editor**: create a script on ScriptCat's "Installed Scripts" page; it takes effect when you save.
- **VSCode**: write in a familiar editor and have each save synced to ScriptCat; see
  [Develop Scripts with VSCode](/docs/use/vscode/).
- **An AI coding agent**: have Claude Code, Codex or another agent write the script following ScriptCat's rules, install
  it into ScriptCat and verify it in your browser; see [Developing Scripts with AI](./ai.md).

## Reference

- [API](./api.md): the GM APIs and metadata ScriptCat supports.
- [CatApi](./cat-api.md): ScriptCat's own extension APIs.
- [Background scripts](./background.md), [subscriptions](./subscribe.md) and [user config](./config.md): what only
  ScriptCat offers.

To learn userscript development step by step, see our [Userscript Development Guide](https://learn.scriptcat.org/).
If you find gaps in the documentation, let us know on [GitHub](https://github.com/scriptscat/docs.scriptcat.org), or send
a PR to help improve it.
