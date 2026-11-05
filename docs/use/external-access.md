---
title: 外部接入（用命令行和 AI 管理脚本）
sidebar_label: 外部接入
---

**外部接入**让本机的命令行和 AI 工具通过 [sctl](/docs/use/sctl/) 管理脚本猫中的脚本：列出、读取、搜索、安装、编辑、
启用、停用、删除，运行后台脚本并读取日志。

![外部接入架构：命令行与 AI 客户端连接本机的 sctl serve，sctl serve 通过 WebSocket 连接脚本猫](./external-access.assets/architecture.svg)

- 读取源码和写操作是否放行，始终由脚本猫的策略和确认页决定，外部程序不能批准自己的请求。
- 脚本猫只需配对一次，之后命令行和所有 AI 工具共用这条连接。

开始之前，先按 [sctl 入门](/docs/use/sctl/)安装 sctl 并启动 `sctl serve`。

## 一、开启并配对 {#pairing}

1. 打开脚本猫的**工具 → 外部接入**，开启右上角开关。**sctl 地址**保持默认的 `ws://127.0.0.1:8643`。
2. 在终端执行 `sctl connect`，记下显示的 8 位配对码。
3. 在脚本猫中点击**接入 sctl**，输入配对码，点击**接入**：

   <img src={require("./external-access.assets/enroll-dialog.webp").default} alt="接入 sctl 对话框：输入终端显示的配对码" width="512" />

4. 卡片显示**已接入**和 sctl 版本即表示完成，也可以在终端执行 `sctl status` 确认：

   <img src={require("./external-access.assets/card-connected.webp").default} alt="外部接入卡片：已接入状态与权限策略" width="716" />

配对码 2 分钟内有效且只能用一次，不要把它发给 AI 或贴到别处。

## 二、权限与确认 {#permissions}

| 能力 | 默认行为 |
|---|---|
| 列出脚本、读取元数据 | 直接返回 |
| 运行一次后台或定时脚本、读取脚本日志 | 直接执行 |
| 读取或搜索脚本源码 | 按**源码读取**策略 |
| 安装、编辑、启用、停用、删除脚本 | 按**写操作**策略 |

两项策略都可以在外部接入卡片中切换为「需人工审批」（默认）或「直接允许」。

在「需人工审批」下，请求会在浏览器中打开确认页，命令行或 AI 会一直等待你的决定。安装和编辑在脚本安装页中确认，
页面顶部会标明请求来自外部接入，编辑时会显示改动内容：

![通过外部接入请求安装脚本：安装页顶部显示外部接入提示](./external-access.assets/install-page.webp)

读取源码、启用、停用和删除则打开单独的确认页：

<img src={require("./external-access.assets/confirm-source.webp").default} alt="读取脚本源码的确认页：拒绝、本会话允许、允许" width="584" />

- **允许**：只放行这一次。
- **本会话允许**：同一脚本的同类操作在本次浏览器会话内不再询问。浏览器重启、扩展重载或停止外部接入后自动清除。
- **拒绝**：请求方收到拒绝。

请求 5 分钟内没有决定会自动过期；请求方断开或在终端按 `Ctrl-C` 也会作废请求。

:::warning 谨慎使用「直接允许」
「直接允许」会跳过该类操作的确认页。脚本源码中可能包含 API Key、Cookie 等敏感信息，写操作会直接改变脚本，
请只在理解风险后开启。
:::

`sctl run` 会真的执行脚本，脚本里的网络请求、通知、写入的数据都会发生；它和读取日志都不需要确认，让 AI 运行脚本前
先确认它会做什么。

## 三、命令行用法 {#cli}

```bash
sctl get                         # 列出脚本
sctl get <uuid>                  # 读取元数据
sctl get <uuid> -o source        # 输出完整源码
sctl get <uuid> -o source --lines 20-80
sctl grep <uuid> "fetch("        # 按字面量搜索源码，-E 用正则
sctl install <url|文件>
sctl edit <uuid> --replace OLD --with NEW
sctl enable <uuid>
sctl disable <uuid>
sctl delete <uuid>
sctl run <uuid>                  # 运行一次后台或定时脚本，等待结束并输出本次日志
sctl logs <uuid> --since 1h      # 读取脚本日志，可按 --level、--text 过滤
```

- `grep` 默认按字面量匹配，`-i` 忽略大小写，`-C N` 返回上下文。没有匹配不算错误，退出码仍为 0。
- `edit` 按内容锚点修改，不按行号：每个 `--replace` 的文本默认必须在脚本中只出现一次，`--replace-all` 替换全部匹配。
  只有改动部分会发送给扩展。
- `run` 默认最多等 60 秒，`--timeout` 可调整，`--no-wait` 不等待直接返回。超时时脚本仍在运行，输出「仍在运行」，
  不算失败。页面脚本不能用 `run`。

:::note 版本要求
`run` 与 `logs` 需要**脚本猫 v1.5.0 之后**和 **sctl v0.3.0 之后**的版本（即将发布）。
:::

需要确认的命令会等待浏览器中的决定，退出码表示结果：

| 退出码 | 含义 |
|---|---|
| `0` | 已批准并成功，或只读命令正常完成 |
| `1` | 在浏览器中被拒绝 |
| `2` | 请求过期、被 `Ctrl-C` 取消或扩展断开 |
| `3` | 参数错误、连接失败、脚本不存在等其他错误 |

加 `-o json` 输出机器可读的结果，运行 `sctl <命令> --help` 查看完整参数。配对了多个脚本猫时用
`--scriptcat <名称>` 指定目标，见 [sctl 入门](/docs/use/sctl/#instances)。

## 四、在 AI 工具中使用 {#ai}

AI 工具的接入方式（skill 或 MCP）见 [sctl 入门](/docs/use/sctl/#ai)。想让 AI 帮你写脚本并验证，见
[用 AI 开发脚本](/docs/dev/ai/)。

通过 MCP 接入时，脚本相关的工具如下，权限与对应的命令相同：

| 工具 | 作用 | 确认策略 |
|---|---|---|
| `scripts_list` | 列出脚本摘要 | 无 |
| `scripts_metadata_get` | 读取单个脚本元数据 | 无 |
| `scripts_source_get` | 按 uuid 和可选行范围读取源码 | 源码读取策略 |
| `scripts_source_grep` | 搜索源码并返回匹配行 | 源码读取策略 |
| `scripts_install_request` | 请求安装脚本 | 写操作策略 |
| `scripts_edit_request` | 请求基于内容锚点编辑脚本 | 写操作策略 |
| `scripts_toggle_request` | 请求启用或停用脚本 | 写操作策略 |
| `scripts_delete_request` | 请求删除脚本 | 写操作策略 |
| `scripts_run` | 运行一次后台或定时脚本 | 无 |
| `scripts_logs` | 读取脚本日志 | 无 |

## 五、审计与撤销 {#revoke}

- 外部接入卡片中的**查看审计日志**会打开按外部接入来源过滤的日志页。
- `sctl status` 显示 sctl 版本、扩展连接状态和近期安全事件摘要，加 `-o json` 返回完整事件。
- **停止外部接入**会断开连接、删除扩展侧的配对信息并清除会话授权，再次使用需要重新配对。
- 只想停用某个 AI 客户端时，从它的 MCP 配置中删除 sctl 即可，不影响命令行和其他客户端。

## 六、排查 {#troubleshooting}

**外部接入卡片显示「连接失败」**：确认 `sctl serve` 正在运行、卡片中的地址与它一致，并检查安全软件是否拦截了
`127.0.0.1:8643`。从未配对或已停止外部接入时，重新执行 `sctl connect` 配对。

**命令长时间不返回**：去浏览器中找确认页并做出决定，不想继续可按 `Ctrl-C` 作废请求。

**`run` 或 `logs` 提示需要升级**：脚本猫或 sctl 版本太旧，升级两者并重启 `sctl serve`。

**看不到 `debug` 级别的日志**：脚本猫正式版只保存 `info` 及以上级别的日志，需要查看的内容请用 `info` 或更高级别输出。

daemon、数据目录和 AI 客户端相关的问题见 [sctl 入门](/docs/use/sctl/#troubleshooting)。
