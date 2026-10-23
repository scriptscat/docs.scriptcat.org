# 贡献指南 / Contributing Guide

> EN summary: file path = doc ID = published URL, no `id:`/`sidebar_position:` frontmatter, no number-prefixed filenames, `title:` is the only page-title source (no body `# H1`), images live in a sibling `<doc-name>.assets/` folder, and every `docs/**/*.md` needs a mirror in each locale docs tree unless an explicit single-source fallback is configured. Run `pnpm run check` before opening a PR — it enforces all of this. For locale-aware code conventions see [agents/i18n.md](./agents/i18n.md).

本文档记录本仓库的**文档结构**约定，帮助人类贡献者和 AI Agent 在不读遍全部历史讨论的情况下，正确地新增/修改文档。

改动 `src/` 下的 React 代码或 `docusaurus.config.js` 之前，另见 [agents/i18n.md](./agents/i18n.md)——那里记录了多语言相关的代码约定（不要写死语言名、原生 `<a>` 要补 baseUrl、文案一律走 `<Translate>` 等），每条都对应一个真实踩过的坑。

## 核心约定

| 关注点 | 唯一来源 |
|---|---|
| URL / doc ID | 文件路径本身（不使用 `id:`、不使用数字前缀） |
| 页面标题 / 侧边栏文字 / `<title>` | frontmatter `title:`（可选 `sidebar_label:` 用于侧边栏简称） |
| 侧边栏排序 | `sidebars.js`，三个 sidebar（`use`/`dev`/`change`）均为显式列表 |
| 图片 | `<文档名>.assets/` 同级目录 |
| 内部链接 | 指向 `.md` 文件的相对路径（构建时会校验） |
| URL 不变契约 | 提交的 `scripts/url-inventory.txt`，每次 PR 由 CI 校验 |

**为什么这样做**：过去 `id:`/`sidebar_position:`/数字前缀/`README.md` 四种机制同时存在，导致侧边栏文字和页面标题可能不一致（例如"VSCode 扩展开发脚本" vs 页面实际标题"使用 VSCode 开发脚本"），且文件名与 URL 无法直接对应。现在文件路径就是 URL，看文件名就知道页面在哪。

## 新增一篇文档

1. 在 `docs/<section>/` 下创建 `xxx.md`（不要加数字前缀，不要用 `README.md`——除非确实是该目录的落地页，此时用 `index.md`）。
2. frontmatter 只写 `title:`（必需）和可选的 `sidebar_label:`；不要写 `id:` 或 `sidebar_position:`。
3. 正文**不要**再写一个 `# 标题` 作为 H1——`title:` 会自动渲染为页面标题。
4. 在 `sidebars.js` 对应的数组里加一行 `"section/xxx"`（除非这是一个故意不出现在侧边栏的隐藏页面，如 `use/install_comple`）。
5. 在 `i18n/<locale>/docusaurus-plugin-content-docs/current/<section>/xxx.md` 为各非默认 locale 创建镜像，路径和文件名必须完全一致；`scripts/check-config.json` 中声明的单一来源 fallback 路径除外。
6. 图片放在规范源文档的 `<文档名>.assets/` 下。纯 UI 截图等语言无关的图片不要复制：复用中文图片时写 `@site/docs/<section>/xxx.assets/foo.png`，复用英文图片时写 `@site/i18n/en/docusaurus-plugin-content-docs/current/<section>/xxx.assets/foo.png`。只有图片中的可见内容确实完成本地化时，才在该 locale 下保留独立二进制。
7. 跑一次 `pnpm run build && pnpm run check`，确认全部检查通过。

## 新增一条更新日志

`change/` 下的版本文件（`v1.x.md`）不使用数字前缀排序；在 `sidebars.js` 的 `change` 数组里手动插入新版本号（数组顺序即侧边栏顺序，新版本插在最前面）。`change/beta-changelog.md` 是 Beta 版本的单独更新日志。更新日志只维护中文源 `docs/change/` 和英文源 `i18n/en/.../change/`：`zh-Hant` 路由复用中文源，其他翻译 locale 复用英文源。fallback 关系以 `scripts/check-config.json` 为准，不要恢复会漂移的 locale 副本。`use/policy/privacy_sctl.md`（sctl Browser 商店隐私政策）同样只维护中文和英文两套源，回退方式与更新日志相同。

## 加载不变的 URL（改动前必须确认不受影响）

以下 URL 被扩展程序硬编码调用，**任何重构都不能改变它们**：

- `/docs/script_installation/`
- `/docs/use/install_comple/`（`install_comple` 是历史拼写，故意保留，不是笔误）
- `/uninstall/`

`scripts/check-url-inventory.mjs` 会在每次 `pnpm run build` 后对比 `scripts/url-inventory.txt`；如果你的改动导致路由变化，CI 会失败并列出具体差异。**新增**路由是允许的（比如加一个 redirect），但需要在同一个 PR 里用 `node scripts/check-url-inventory.mjs --write` 更新这个文件，让 review 能看到你有意添加了什么。

## 翻译术语

完整的 20-locale 术语对照集中维护在 [agents/i18n-terminology.md](./agents/i18n-terminology.md)，不要在多个文件中复制会漂移的大型术语表。品牌名、API 名称和代码标识符保持不翻译。

英文标题结构应尽量与中文一一对应（标题层级、顺序一致），这样跨语言的锚点链接更容易对齐；注意 Docusaurus 生成的锚点是基于**渲染后的英文标题文本**，不是中文锚点的直接翻译（例如 `## Scheduled Script (\`@crontab\`)` 生成的锚点是 `#scheduled-script-crontab`，需要用构建产物核实，不要凭感觉猜。

## 本地检查命令

```bash
pnpm run build          # 构建 docusaurus.config.js 中声明的全部 locale，断链/断锚点均为 throw
pnpm run check           # 依次跑 URL / fallback 产物 / i18n 覆盖率 / frontmatter 检查
pnpm run check:urls       # 单独跑 URL 不变契约检查
pnpm run check:fallbacks  # 单独检查 production build 中的 locale 单一来源 fallback
pnpm run check:i18n       # 单独跑所有 locale 的文档配对及 fallback 例外检查
pnpm run check:i18n-ui    # 检查非默认 code.json 键集合和术语表列结构
pnpm run check:frontmatter # 单独跑 title/id/sidebar_position/H1 规范检查
```
