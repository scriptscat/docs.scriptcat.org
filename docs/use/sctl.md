---
title: sctl 入门（命令行与 AI 接入）
sidebar_label: sctl 入门
---

[sctl](https://github.com/scriptscat/sctl) 是脚本猫配套的本地命令行工具。它在你的电脑上运行一个常驻进程
`sctl serve`，命令行、AI 客户端和 AI 编码代理都通过它，去操作你配对过的脚本猫和浏览器。

sctl 能连接两种扩展，各自配对、互不依赖，按需要选择：

| 你想做的事 | 需要配对 | 接着看 |
|---|---|---|
| 用命令行或 AI 列出、安装、编辑、运行脚本猫里的脚本 | 脚本猫（外部接入） | [外部接入](/docs/use/external-access/) |
| 用命令行或 AI 控制浏览器：标签页、页面自动化、控制台与网络请求、Playwright | sctl Browser 扩展 | [sctl Browser](/docs/use/sctl-browser/) |
| 让 Claude Code、Codex 等 AI 编码代理写脚本，并在浏览器里验证 | 两个都配对 | [用 AI 开发脚本](/docs/dev/ai/) |

本页介绍它们共用的部分：安装、启动、配对、接入 AI 和排查。

## 一、安装 {#install}

macOS / Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/scriptscat/sctl/main/scripts/install.sh | sh
```

Homebrew：

```bash
brew install scriptscat/tap/sctl
```

Windows（PowerShell）：

```powershell
irm https://raw.githubusercontent.com/scriptscat/sctl/main/scripts/install.ps1 | iex
```

安装脚本会校验发布包的 sha256，把 `sctl` 装到 `~/.local/bin`（macOS / Linux）或 `%LOCALAPPDATA%\sctl\bin`
（Windows）。这个目录不在 `PATH` 中时会打印提示，但不会替你修改 shell 配置。也可以从
[GitHub Releases](https://github.com/scriptscat/sctl/releases) 下载对应平台的发布包，解压后放进 `PATH`。

装好后确认版本：

```bash
sctl version
```

## 二、启动 sctl serve {#daemon}

其他命令都要通过 `sctl serve` 工作，但不会自动启动它。有两种方式：

**作为后台服务（推荐）**：登录后自动启动，不用一直开着终端，也不需要管理员权限。

```bash
sctl service install   # 注册并立即启动
sctl service status    # 查看是否在运行
```

macOS 用 launchd，Linux 用 systemd 用户服务，Windows 用任务计划程序。以后不想要了，执行 `sctl service uninstall`。
在 macOS 上，不要把 `sctl` 程序或数据目录放在「文稿」「桌面」「下载」里，后台服务没有权限读取这些文件夹。

**临时在前台运行**：在一个终端里执行并保持它不退出，关闭终端就会停止。

```bash
sctl serve
```

两种方式选一种即可，它们使用同一个端口。`sctl serve` 默认只监听本机的 `ws://127.0.0.1:8643`。

## 三、配对 {#pairing}

脚本猫和 sctl Browser 都通过一次性配对码接入，每个扩展单独配对一次：

1. 保持 `sctl serve` 运行，在终端执行：

   ```bash
   sctl connect
   ```

   终端会显示一个 8 位配对码，形如 `A1B2-C3D4`。

2. 把配对码输入扩展：
   - 脚本猫：在**工具 → 外部接入**中开启并点击**接入 sctl**，详见[外部接入](/docs/use/external-access/#pairing)。
   - sctl Browser：点击浏览器工具栏中的 sctl Browser 图标，在弹窗中输入，详见
     [sctl Browser](/docs/use/sctl-browser/#pairing)。

3. 执行 `sctl status`，列出所有已配对的脚本猫和浏览器，以及它们是否在线。

配对得到的密钥长期有效，浏览器重启后会自动重连，不用重新配对。

:::warning 配对码只在终端显示
配对码 2 分钟后过期，只能使用一次，不会经网络发送给扩展。不要把它粘贴到 AI 对话、Issue、日志或 MCP 配置中，
过期后重新执行 `sctl connect` 即可。
:::

## 四、接入 AI {#ai}

AI 工具有两种接入方式，按你用的工具选一种。

### Claude Code、Codex 等编码代理：安装 skill

编码代理本身能执行命令，装上 sctl 的 skill 后，它就知道怎样用 `sctl` 命令操作你的脚本猫和浏览器：

```bash
npx skills add scriptscat/sctl -g
```

需要 Node.js。用 `npx skills check -g` 检查更新，`npx skills update -g` 更新。想让代理帮你写脚本，再装上脚本猫的
skill，完整流程见[用 AI 开发脚本](/docs/dev/ai/)。

### Claude Desktop、Cursor 等 AI 客户端：配置 MCP

在 AI 客户端的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "scriptcat": {
      "command": "/absolute/path/to/sctl",
      "args": ["mcp", "--name", "my-ai-client"]
    }
  }
}
```

命令行里也可以直接添加，例如 Claude Code 与 Codex：

```bash
claude mcp add scriptcat -- /absolute/path/to/sctl mcp --name claude-code
codex mcp add scriptcat -- /absolute/path/to/sctl mcp --name codex
```

- `command` 填 sctl 的**绝对路径**（可用 `command -v sctl` 查看）。很多桌面应用的 `PATH` 比终端少，也不会展开
  `~`、`$HOME`。
- `--name` 只是写进审计日志的标签，便于区分不同客户端，不是身份认证或权限边界。
- AI 客户端会自己启动 `sctl mcp`，但 `sctl serve` 仍要先运行。
- 不要用会向标准输出打印内容的脚本包装 sctl，标准输出专用于 MCP 通信。

修改配置后重启或重新加载 AI 客户端，再让它「列出我安装的脚本」或「列出我打开的标签页」验证。同一个 `sctl mcp`
同时提供脚本猫和 sctl Browser 的工具，没配对的那一侧调用时会返回错误。工具列表见
[外部接入](/docs/use/external-access/#ai)和 [sctl Browser](/docs/use/sctl-browser/#ai)。

### 权限

两种方式能做的事和你自己执行 sctl 命令完全相同：脚本猫的读源码和写操作按[外部接入的确认策略](/docs/use/external-access/#permissions)
在浏览器中等你确认；sctl Browser 的大部分操作会立即执行，见 [sctl Browser](/docs/use/sctl-browser/#approval)。
只把 sctl 交给你信任的 AI 工具。

## 五、多个脚本猫或浏览器 {#instances}

可以配对多个脚本猫（例如两个浏览器各装一个）和多个浏览器，每个都单独执行一次 `sctl connect`。用
`sctl scriptcats` 和 `sctl browsers` 查看名称与在线状态，用 `forget` 子命令解除配对。

只有一个在线时命令会自动选中它；有多个在线时，用 `--scriptcat <名称>` / `--browser <名称>`，或环境变量
`SCTL_SCRIPTCAT` / `SCTL_BROWSER` 指定目标。

## 六、进阶设置 {#advanced}

### 数据目录 {#data-dir}

sctl 的所有进程必须使用同一个数据目录，其中保存配对密钥、本机控制令牌和日志：

| 平台 | 默认数据目录 |
|---|---|
| macOS | `~/Library/Application Support/sctl/` |
| Windows | `%LOCALAPPDATA%\sctl\` |
| Linux | `~/.config/sctl/` |

所有进程都以同一个用户运行时，保持默认即可。需要自定义时，为**每个** sctl 进程（包括后台服务和 MCP 配置）设置
同一个绝对路径：

```bash
export SCTL_DATA_DIR=/absolute/path/to/sctl-data   # 或使用 --data-dir，命令行参数优先
```

```json
"env": { "SCTL_DATA_DIR": "/absolute/path/to/sctl-data" }
```

不要把数据目录放进代码仓库或多人共享的同步目录，也不要把其中的文件交给 AI。

### 监听其他地址 {#listen-address}

如需让其他设备上的浏览器连接，可以显式指定监听地址：

```bash
sctl --listen-address 0.0.0.0:8643 serve
```

此时同一台机器上的其他 sctl 命令、`sctl service install` 和 `sctl mcp` 也要传入相同的 `--listen-address`。扩展中
填写浏览器实际能访问到的地址，例如 `ws://192.168.1.10:8643`，不要填 `0.0.0.0`。

:::warning 只在可信网络中使用
`ws://` 不加密传输内容。扩展与 sctl 之间仍通过配对密钥双向认证，但请只在可信网络中使用非默认地址。
:::

## 七、排查 {#troubleshooting}

**提示 daemon 不可达**：`sctl serve` 没有运行。执行 `sctl service start`（装了后台服务时）或 `sctl serve`。改过
监听地址的话，确认所有命令都传入了相同的 `--listen-address`。

**提示控制通道鉴权失败**：不同的 sctl 进程用了不同的数据目录。检查 `SCTL_DATA_DIR` 和 `--data-dir`，让它们指向同一个
绝对路径，然后重启 AI 客户端。

**AI 客户端里看不到工具**：确认 `command` 是 sctl 的绝对路径、配置文件语法正确，然后重新加载客户端。

**查看日志**：日志在数据目录下的 `logs/`，例如 macOS 默认是 `~/Library/Application Support/sctl/logs/`。

扩展侧的问题见[外部接入](/docs/use/external-access/#troubleshooting)和 [sctl Browser](/docs/use/sctl-browser/) 各自的说明。
