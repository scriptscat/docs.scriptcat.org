---
title: 用 AI 开发脚本
---

用 Claude Code、Codex 这类 AI 编码代理写脚本时，代理常常按油猴的习惯来写，在脚本猫特有的地方出错，比如后台脚本
没有页面、`@grant none` 下没有 `unsafeWindow`、定时脚本的 `once` 语义。写完之后它也看不到脚本在你的浏览器里到底有没有跑起来。

给代理装上两个 agent skill 就能补上这两块：

| Skill | 作用 | 来源 |
|---|---|---|
| `scriptcat-userscript` | 怎么写：选脚本类型、骨架、易错规则、API 速查，附带静态检查和热重载工具 | 脚本猫仓库 [`skills/scriptcat-userscript`](https://github.com/scriptscat/scriptcat/tree/main/skills/scriptcat-userscript) |
| `sctl` | 怎么操作：通过 [sctl](https://github.com/scriptscat/sctl) 把脚本装进你的脚本猫，在你的真实浏览器里打开页面、看控制台、读日志 | sctl 仓库 [`skills/sctl`](https://github.com/scriptscat/sctl/tree/main/skills/sctl) |

装好之后，代理可以自己走完整个流程：先看目标页面，再写脚本、静态检查、安装，然后在浏览器里验证效果，有问题就改了再试。

:::info 和脚本猫内置的 Agent 不是一回事
本文说的是在你电脑上运行的外部 AI 编码工具。脚本猫扩展里自带的 AI 能力和 `CAT.agent` API 见 [Agent](/docs/dev/agent/)。
:::

## 一、准备

1. **sctl 与外部接入**：按[外部接入](/docs/use/external-access/)安装 sctl、启动 `sctl serve`，并在脚本猫中完成配对。
   `sctl status` 显示扩展已连接即可。
2. **sctl Browser（可选）**：要让代理打开页面、查看控制台、点击和截图来验证页面脚本，还需要安装并配对
   [sctl Browser](/docs/use/sctl-browser/)。只写后台或定时脚本时可以不装。
3. **Node.js 18 或更高版本**：`scriptcat-userscript` 附带的检查工具需要它。

没有 sctl 也能用：`scriptcat-userscript` 照样指导代理写脚本，最后把 `.user.js` 文件交给你，由你自己安装和查看效果。

## 二、安装两个 skill

把两个仓库克隆到本地，再把 skill 目录链接到 AI 工具读取 skill 的位置。以 Claude Code 为例：

```bash
git clone --depth 1 https://github.com/scriptscat/scriptcat.git
git clone --depth 1 https://github.com/scriptscat/sctl.git
mkdir -p ~/.claude/skills
ln -s "$PWD/scriptcat/skills/scriptcat-userscript" ~/.claude/skills/scriptcat-userscript
ln -s "$PWD/sctl/skills/sctl" ~/.claude/skills/sctl
```

Codex 把上面的 `~/.claude/skills` 换成 `~/.codex/skills`。用链接而不是复制，之后在两个仓库里 `git pull` 就能拿到更新。
无法创建符号链接的系统（如未开启开发者模式的 Windows）可以直接复制这两个目录，更新时需要重新复制。

装好后，在对话里提到油猴脚本、后台脚本、定时脚本、`.user.js` 或脚本猫，代理就会自动加载对应的 skill，不需要额外指定。

## 三、使用示例

直接用自然语言描述你要的效果，例如：

> 帮我写一个脚本猫脚本：在 example.com 的文章页右下角加一个「复制正文」按钮。装到我的脚本猫里，并在浏览器里确认按钮能用。

代理接下来通常会这样做：

1. **看目标页面**：用 sctl Browser 打开页面，读取页面结构，找到稳定的选择器；需要数据时查看页面发出的网络请求，
   优先直接调用站点接口，而不是去解析页面。
2. **写脚本并检查**：按 skill 的规则写出元数据和代码，再用附带的检查工具找出常见错误，例如调用了 API 却没有声明
   `@grant`、请求的域名没有写进 `@connect`、cron 表达式写错。
3. **安装**：执行 `sctl install`。浏览器会打开脚本猫的安装页，**需要你确认**。
4. **验证**：重新加载目标页面，查看控制台有没有报错，再检查按钮是否真的出现、点击后是否生效，然后把观察到的结果告诉你。
5. **迭代**：修改后重新安装，或者用 `sctl edit` 改动已安装的脚本，每次都需要你确认。频繁修改页面脚本时，代理可以先装一个
   通过 `@require file:///…` 引用本地文件的「壳脚本」，之后改本地文件、刷新页面就能生效，不用每次都确认。这需要在浏览器的
   扩展详情页为脚本猫打开「允许访问文件网址」。

后台和定时脚本没有页面，验证方式不同：

> 写一个每天运行一次的定时脚本，检查 example.com 的签到接口，失败时 30 秒后重试。装好后运行一次，告诉我结果。

代理会在安装后用 `sctl run` 立即运行一次脚本，拿到「完成 / 出错 / 仍在运行」的结果和本次运行的日志，再用 `sctl logs`
查看完整日志，而不必等到定时触发。

:::note 版本要求
`sctl run` 与 `sctl logs` 需要**脚本猫 v1.5.0 之后**和 **sctl v0.3.0 之后**的版本（即将发布）。版本较旧时，skill 会自动改用
间接的办法验证后台脚本，并提示你升级。
:::

## 四、权限与安全

代理通过 sctl 做的事情，和你自己在命令行执行 sctl 完全相同，权限规则也一样：

| 操作 | 是否需要你确认 |
|---|---|
| 安装、编辑、启用、停用、删除脚本 | 按外部接入的**写操作**策略，默认在浏览器中确认 |
| 读取或搜索脚本源码 | 按**源码读取**策略，默认在浏览器中确认 |
| 运行一次后台或定时脚本（`sctl run`）、读取脚本日志（`sctl logs`） | 不需要确认 |
| 打开页面、读取页面内容、点击、查看控制台与网络请求 | 不需要确认 |

确认页上的「本会话允许」可以让同一脚本的同类操作在本次浏览器会话内不再询问，代理反复修改同一个脚本时会顺畅很多。
策略的完整说明见[外部接入](/docs/use/external-access/)中「权限与确认」一节。

几点建议：

- `sctl run` 会真的执行脚本，脚本里的网络请求、通知、写入的数据都会发生。让代理运行它自己写的脚本即可；要运行你已有的脚本，
  先确认它会做什么。
- 页面相关的操作在你的真实浏览器里进行，可以使用你的登录状态。只让代理访问与任务相关的网站。
- 脚本日志里可能包含脚本处理过的数据。写脚本时不要把 token、密码之类的内容输出到日志。

## 五、常见问题

**代理写出来的脚本装不上或不运行？** 让代理先运行 skill 附带的检查工具，并贴出它的输出。大部分「装上了却不生效」的问题，
都是缺少 `@grant`、`@match` 写错或 `@connect` 漏写。

**为什么看不到 `debug` 级别的日志？** 脚本猫正式版只保存 `info` 及以上级别的日志，`GM_log(…, "debug")` 不会出现在
「日志」页或 `sctl logs` 中。需要查看的内容请用 `info` 或更高级别输出。

**有多个脚本猫同时在线？** 例如两个浏览器都装了脚本猫并完成了配对。这时需要告诉代理用哪一个：在命令里加
`--scriptcat <名称>`，或者设置环境变量 `SCTL_SCRIPTCAT`。名称可以用 `sctl scriptcats` 查看。
