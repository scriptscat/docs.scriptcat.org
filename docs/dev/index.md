---
title: 简介
---

脚本猫支持三种脚本：

| 类型 | 什么时候运行 |
|---|---|
| 页面脚本 | 打开匹配的网页时运行，也就是通常说的用户脚本 |
| [后台脚本](./background.md) | 不依赖网页，浏览器开着就一直在后台运行，脚本猫特有 |
| [定时脚本](./background.md#定时脚本crontab) | 按 cron 表达式定时运行，脚本猫特有 |

## 开发方式

- **扩展自带的编辑器**：在脚本猫的「已安装脚本」页面点击新建脚本，写完保存即可生效。
- **VSCode**：在熟悉的编辑器里写，保存后自动同步到脚本猫，见[使用 VSCode 开发脚本](/docs/use/vscode/)。
- **AI 编码代理**：让 Claude Code、Codex 等代理按脚本猫的规则写脚本，装进脚本猫并在浏览器里验证，见
  [用 AI 开发脚本](./ai.md)。

## 参考

- [API 文档](./api.md)：脚本猫支持的 GM API 与元数据。
- [CatApi 文档](./cat-api.md)：脚本猫扩展的 API。
- [后台脚本](./background.md)、[订阅模式](./subscribe.md)、[用户配置](./config.md)：脚本猫特有的能力。

想系统地学习用户脚本开发，可以看我们维护的[用户脚本开发指南](https://learn.scriptcat.org/)。文档有不完善的地方，
欢迎在 [GitHub](https://github.com/scriptscat/docs.scriptcat.org) 反馈，或提交 PR 帮助我们完善。
