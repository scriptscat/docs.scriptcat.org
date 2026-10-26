---
title: sctl Browser（用命令行和 AI 控制浏览器）
sidebar_label: sctl Browser
---

**sctl Browser** 是 [sctl](https://github.com/scriptscat/sctl) 配套的浏览器扩展。配对后，命令行和支持
[MCP](https://modelcontextprotocol.io/) 的 AI 客户端可以通过 sctl 控制这个浏览器：

- 管理标签页、窗口和标签组；
- 管理书签、阅读清单、历史记录、最近关闭、下载、Cookie、浏览数据和已安装的扩展；
- 在后台标签页里做页面自动化：无障碍快照、点击、填写、截图、执行 JavaScript，不会切走你正在看的标签页；
- 查看页面的控制台消息、未捕获的异常和网络请求；
- 开一个 CDP 端点，让现有的 Playwright / Puppeteer 脚本直接使用你已登录的浏览器。

sctl Browser 与[外部接入](/docs/use/external-access/)共用同一个 `sctl serve`，但两者各自配对、互不依赖：只想控制浏览器时，
不装脚本猫也可以使用。

:::danger 大部分操作不需要你确认
与脚本猫的外部接入不同，sctl Browser 的操作默认**立即执行**，不会弹出确认页。任何能运行 sctl 命令的程序，包括你
接入的 AI 客户端，都可以读写这个浏览器的标签页、Cookie 和历史记录，读取页面内容以及网络请求的请求头和内容（不打码）。

只有删除书签和卸载扩展需要在浏览器中批准，清除历史、Cookie 等破坏性命令需要显式加 `--yes`。请只让你信任的程序
使用 sctl，必要时用一个单独的浏览器配置文件来配对。
:::

## 一、准备 sctl

按[外部接入](/docs/use/external-access/)中「安装 sctl」和「启动 daemon」两步安装 sctl，并保持 `sctl serve` 运行。
已经接入过脚本猫的话，这一步已经完成。

## 二、安装扩展

sctl Browser 需要 **Chrome 125 或更高版本**，或同等版本的 Chromium 内核浏览器（如 Edge）。从扩展商店安装：

| 浏览器 | 安装地址 |
| ------ | -------- |
| Chrome | [Chrome 应用商店](https://chromewebstore.google.com/detail/sctl-browser/biafbcaobbmcodfinffakgpdgaiodbgk) |
| Edge   | [Microsoft Edge 加载项](https://microsoftedge.microsoft.com/addons/detail/sctl-browser/nbmnkdfbjdhbdjjffgkocfdkemockepa) |

其他 Chromium 内核浏览器一般也可以从 Chrome 应用商店安装。商店版本会自动更新。

### 手动安装

无法访问扩展商店时，也可以手动安装：

1. 从 [GitHub Releases](https://github.com/scriptscat/sctl/releases) 下载
   `sctl-browser-extension-<版本>.zip`（版本号与 sctl 一致），解压到一个不会被删除或移动的文件夹。
2. 打开浏览器的扩展管理页（Chrome 为 `chrome://extensions`，Edge 为 `edge://extensions`），开启**开发者模式**。
3. 点击**加载已解压的扩展程序**，选择解压后的文件夹。操作方式与[手动安装脚本猫](/docs/use/use/)相同。

手动安装的版本不会自动更新，更新时下载新版本解压覆盖，再在扩展管理页中点击重新加载。

## 三、配对

1. 保持 `sctl serve` 运行，在另一个终端执行：

   ```bash
   sctl connect
   ```

2. 点击浏览器工具栏中的 sctl Browser 图标，在弹窗中输入终端显示的配对码，点击**配对**：

   <img src={require("./sctl-browser.assets/popup-pairing.webp").default} alt="sctl Browser 弹窗：输入配对码" width="360" />

3. 弹窗显示**已连接**即完成。弹窗里可以重命名这个浏览器实例，并复制在命令中指定它的写法：

   <img src={require("./sctl-browser.assets/popup-connected.webp").default} alt="sctl Browser 弹窗：已连接状态与实例信息" width="360" />

4. 在终端确认，列表中这个浏览器的状态为 `online` 即可：

   ```bash
   sctl browsers
   ```

一个配对码只能配对一个扩展。脚本猫和 sctl Browser 都要配对时，分别运行一次 `sctl connect`。daemon 改过监听地址时，
在弹窗右上角的设置中修改 daemon 地址。

## 四、常用命令

```bash
sctl tabs list                              # 列出标签页
sctl tabs open https://example.com          # 打开新标签页并输出它的 ID
sctl page snapshot --tab <id>               # 无障碍快照，元素带 e5 这样的引用
sctl page click e5 --tab <id>               # 点击快照里的元素
sctl page fill e7 "hello" --tab <id>        # 填写输入框
sctl page screenshot --tab <id> -f page.png # 截图
sctl debug console --tab <id> --level error # 控制台错误
sctl debug network --tab <id> --failed      # 失败的网络请求
sctl history search github                  # 搜索历史记录
sctl cookies list --url https://example.com # 查看 Cookie
```

| 命令组 | 用途 |
|---|---|
| `sctl browsers` | 列出已配对的浏览器实例，或忘记其中一个 |
| `sctl tabs` / `windows` / `groups` | 标签页、窗口和标签组 |
| `sctl bookmarks` / `reading-list` | 书签和阅读清单 |
| `sctl history` / `recent` / `downloads` | 历史记录、最近关闭的标签页和窗口、下载 |
| `sctl cookies` / `browsing-data` / `extensions` | Cookie、浏览数据、已安装的扩展 |
| `sctl page` | 页面自动化：快照、点击、填写、导航、等待、截图、执行脚本 |
| `sctl debug` | 记录并读取标签页的控制台和网络请求 |
| `sctl cdp` | 发送原始 CDP 命令，或为 Playwright / Puppeteer 开端点 |

不写 `--tab` 时，`page` 和 `debug` 命令作用于最近聚焦窗口中的活动标签页。加 `-o json` 输出机器可读的结果；
运行 `sctl <命令> --help` 查看完整参数，行为细节见 sctl 仓库的
[命令行参考](https://github.com/scriptscat/sctl/blob/main/docs/cli.md)（英文）。

### 调试提示条

`page`、`debug` 和 `cdp` 命令需要把浏览器调试器附加到标签页上，此时浏览器顶部会显示提示条（“sctl Browser”已开始
调试此浏览器）。这是浏览器自身的安全提示，扩展无法隐藏。

- 标签页空闲 5 分钟后调试器自动断开，也可以运行 `sctl page detach` 立即断开。
- 手动关闭提示条也会断开调试器，正在执行的命令以退出码 `2` 结束。
- 不想看到提示条，可以用 `--silent-debugger-extension-api` 参数启动浏览器。

### 多个浏览器

可以配对多个浏览器（或同一浏览器的多个配置文件），每个都单独运行一次 `sctl connect`。有多个实例在线时，用
`--browser <名称>` 或环境变量 `SCTL_BROWSER` 指定目标；`tabs list` 和 `windows list` 不指定时会汇总所有在线实例。

## 五、需要确认的操作

| 操作 | 方式 |
|---|---|
| 删除书签（`bookmarks rm`）、卸载扩展（`extensions uninstall`） | 浏览器弹出审批窗口，批准后才执行 |
| 删除阅读清单条目、删除或清除历史、清除浏览数据、删除或清除 Cookie、取消下载、清除下载记录或删除下载的文件、停用扩展 | 必须加 `--yes`，否则不执行并以退出码 `3` 结束 |
| 其他操作 | 立即执行 |

<img src={require("./sctl-browser.assets/approval-bookmark.webp").default} alt="删除书签的审批窗口：拒绝或删除" width="480" />

审批窗口中点击**拒绝**或直接关闭窗口，命令以退出码 `1` 结束；5 分钟内没有决定或在终端按 `Ctrl-C`，以退出码 `2` 结束。

## 六、在 AI 客户端中使用

MCP 配置与[外部接入](/docs/use/external-access/)中「接入 AI 客户端」一节完全相同，同一个 `sctl mcp` 同时提供脚本猫和 sctl Browser 的工具，
例如 `tabs_list`、`page_snapshot`、`page_click`、`debug_console`、`cdp_endpoint`。完整工具列表见 sctl 仓库的
[MCP 文档](https://github.com/scriptscat/sctl/blob/main/docs/mcp.md#7-tool-reference)（英文）。

如果你的 AI 工具更适合直接调用命令行，可以安装 sctl 仓库中的
[agent skill](https://github.com/scriptscat/sctl/tree/main/skills/sctl)。

## 七、连接 Playwright / Puppeteer

```bash
sctl cdp endpoint
```

命令会输出两个地址：`http://127.0.0.1:8643/cdp/<secret>` 供 Playwright 使用，`ws://…/devtools/browser/<id>` 供
Puppeteer 使用。用 Playwright 时直接使用浏览器自己的上下文，就能带上你的登录状态：

```js
const { chromium } = require("playwright");

const browser = await chromium.connectOverCDP("http://127.0.0.1:8643/cdp/<secret>");
const context = browser.contexts()[0];
const page = await context.newPage();
await page.goto("https://example.com");
await browser.close(); // 只断开连接，浏览器和标签页都保留
```

- 端点地址本身就是凭据，拿到它就能完全控制这个浏览器，请像密码一样对待。
- 同一时间只能有一个客户端连接；连接期间 `sctl page`、`sctl debug`、`sctl cdp send` 暂时不可用。
- 用完运行 `sctl cdp close` 关闭端点；没有客户端连接 60 分钟后也会自动失效。

## 八、断开与移除

- 在弹窗中点击**断开并忘记**，或在终端运行 `sctl browsers forget <名称>`，都会解除配对。
- 移除扩展也会解除扩展一侧的配对。之后想再使用，重新运行 `sctl connect` 配对即可。

## 隐私

sctl Browser 不收集、不上传任何数据，所有内容只在浏览器和你自己运行的 sctl 之间传输。详见
[sctl Browser 隐私政策](/docs/use/policy/privacy_sctl/)。
