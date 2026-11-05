---
title: 用 AI 开发脚本
---

可以让 Claude Code、Codex 这类 AI 编码代理帮你写脚本猫脚本。给代理装上下面两个 skill 后，它会按脚本猫的规则来写，
还能把脚本装进你的脚本猫、在你的浏览器里查看效果，发现问题自己修改后再试。

| Skill | 作用 | 来源 |
|---|---|---|
| `scriptcat-userscript` | 怎么写：选脚本类型、骨架、易错规则、API 速查，附带静态检查和热重载工具 | 脚本猫仓库 [`skills/scriptcat-userscript`](https://github.com/scriptscat/scriptcat/tree/main/skills/scriptcat-userscript) |
| `sctl` | 怎么操作：通过 [sctl](https://github.com/scriptscat/sctl) 把脚本装进你的脚本猫，在你的真实浏览器里打开页面、看控制台、读日志 | sctl 仓库 [`skills/sctl`](https://github.com/scriptscat/sctl/tree/main/skills/sctl) |

:::tip 让 AI 帮你配置
把下面这句话发给你的 AI 代理。它会按本页[给 AI 代理的说明](#for-ai-agents)检查环境、安装 skill，并告诉你还有哪些步骤需要你自己完成：

> 请阅读 https://docs.scriptcat.org/docs/dev/ai/ ，按其中「给 AI 代理的说明」帮我配置用 AI 开发脚本猫脚本的环境。
:::

:::info 和脚本猫内置的 Agent 不是一回事
本文说的是在你电脑上运行的外部 AI 编码工具。脚本猫扩展里自带的 AI 能力和 `CAT.agent` API 见 [Agent](/docs/dev/agent/)。
:::

## 一、安装两个 skill

用 [`npx skills`](https://skills.sh/) 安装，需要 Node.js 18 或更高版本（`scriptcat-userscript` 附带的检查工具也要用到它）。
它可以把 skill 装进 Claude Code、Codex、Cursor 等多个代理，执行时会让你选择装进哪些代理：

```bash
npx skills add scriptscat/scriptcat -g
npx skills add scriptscat/sctl -g
```

检查更新用 `npx skills check -g`，更新用 `npx skills update -g`。

也可以手动安装：把脚本猫仓库的 `skills/scriptcat-userscript` 和 sctl 仓库的 `skills/sctl` 两个目录链接或复制到代理读取
skill 的位置，这种方式要自己更新。

装好后，在对话里提到用户脚本、后台脚本、定时脚本、`.user.js` 或脚本猫，代理就会自动加载对应的 skill，不需要额外指定。

## 二、连接脚本猫（可选）

只装 skill 就能让代理写脚本，最后由你自己安装 `.user.js` 文件、查看效果。想让代理自己安装脚本并在浏览器里验证，还需要：

1. **sctl**：按 [sctl 入门](/docs/use/sctl/)安装 sctl 并启动 `sctl serve`。
2. **脚本猫**：在脚本猫中开启[外部接入](/docs/use/external-access/)并完成配对，代理才能安装、运行脚本和读取日志。
3. **sctl Browser**：要让代理打开页面、查看控制台、点击和截图来验证页面脚本，还需要安装并配对
   [sctl Browser](/docs/use/sctl-browser/)。只写后台或定时脚本时可以不装。

配好后执行 `sctl status`，能看到在线的脚本猫（和浏览器）即可。

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
策略的完整说明见[外部接入的权限与确认](/docs/use/external-access/#permissions)。

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

## 六、给 AI 代理的说明 {#for-ai-agents}

本节写给 AI 编码代理。用户让你按本页配置环境时，按下面的顺序检查，已经满足的步骤直接跳过：

1. **安装 skill**：还没有 `scriptcat-userscript` 和 `sctl` 这两个 skill 时，执行下面的命令，把 `-a` 的值换成你自己的
   代理名（如 `claude-code`、`codex`、`cursor`）。必须带 `-a`：非交互执行时不带它，skill 只会写进 `~/.agents/skills`，
   Claude Code 等代理读不到。

   ```bash
   npx skills add scriptscat/scriptcat -g -a claude-code
   npx skills add scriptscat/sctl -g -a claude-code
   ```

   装完后如果当前会话里还看不到这两个 skill，请用户新开一个会话。
2. **检查 sctl**：执行 `sctl status`。
   - 找不到 `sctl` 命令：请用户按 [sctl 入门](/docs/use/sctl/#install)安装 sctl。
   - 连不上 daemon：请用户执行 `sctl service install` 注册后台服务（已装过的执行 `sctl service start`），或在一个终端里
     运行 `sctl serve`。不要自己在后台启动 `sctl serve`，它会随你的会话一起退出，还可能和用户的服务抢端口。
   - 扩展未连接：请用户在脚本猫的设置里开启外部接入，执行 `sctl connect`，把显示的一次性配对码输入脚本猫。
   - 用户暂时不想装 sctl 也可以继续：你只负责写脚本，把 `.user.js` 交给用户自己安装。
3. **检查 sctl Browser**：只在要验证页面脚本时需要。`sctl browsers` 没有在线的浏览器时，请用户按
   [sctl Browser](/docs/use/sctl-browser/) 安装并配对。
4. **汇报**：告诉用户哪些已经就绪、哪些还需要他们处理。之后写脚本时按 `scriptcat-userscript` skill 的流程来。安装、编辑
   脚本要用户在浏览器里确认，提醒用户去浏览器点击，不要反复重试。
