---
title: Getting Started with sctl (Command Line and AI)
sidebar_label: Getting started with sctl
---

[sctl](https://github.com/scriptscat/sctl) is ScriptCat's companion command-line tool. It runs a long-lived process,
`sctl serve`, on your computer; the command line, AI clients and AI coding agents all go through it to reach the
ScriptCat and browsers you have paired.

sctl connects to two extensions. Each is paired on its own and neither needs the other, so pick what you need:

| You want to | Pair | Then read |
|---|---|---|
| List, install, edit and run the scripts in ScriptCat from the command line or AI | ScriptCat (External Access) | [External Access](/docs/use/external-access/) |
| Control the browser from the command line or AI: tabs, page automation, console and network, Playwright | the sctl Browser extension | [sctl Browser](/docs/use/sctl-browser/) |
| Have an AI coding agent such as Claude Code or Codex write scripts and verify them in your browser | both | [Developing Scripts with AI](/docs/dev/ai/) |

This page covers what they share: installing, starting, pairing, connecting AI and troubleshooting.

## 1. Install {#install}

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/scriptscat/sctl/main/scripts/install.sh | sh
```

Homebrew:

```bash
brew install scriptscat/tap/sctl
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/scriptscat/sctl/main/scripts/install.ps1 | iex
```

The install script verifies the release archive's sha256 and installs `sctl` to `~/.local/bin` (macOS / Linux) or
`%LOCALAPPDATA%\sctl\bin` (Windows). If that directory is not on your `PATH`, it says so but does not change your shell
configuration. You can also download the archive for your platform from
[GitHub Releases](https://github.com/scriptscat/sctl/releases) and put the binary on your `PATH`.

Then check the version:

```bash
sctl version
```

## 2. Start sctl serve {#daemon}

Every other command works through `sctl serve`, but none of them starts it. There are two ways to run it:

**As a background service (recommended)**: it starts when you log in, needs no open terminal and no administrator
rights.

```bash
sctl service install   # register it and start it now
sctl service status    # check that it is running
```

It uses launchd on macOS, a systemd user service on Linux and Task Scheduler on Windows. To remove it later, run
`sctl service uninstall`. On macOS, keep the `sctl` binary and the data directory out of Documents, Desktop and
Downloads: the background service is not allowed to read those folders.

**In the foreground, for now**: run it in a terminal and leave it open; closing the terminal stops it.

```bash
sctl serve
```

Use one or the other; both take the same port. By default `sctl serve` listens only on this computer, at
`ws://127.0.0.1:8643`.

## 3. Pair {#pairing}

ScriptCat and sctl Browser each join with a one-time pairing code, and each is paired once:

1. With `sctl serve` running, run in a terminal:

   ```bash
   sctl connect
   ```

   The terminal shows an 8-character pairing code such as `A1B2-C3D4`.

2. Enter the code in the extension:
   - ScriptCat: under **Tools → External Access**, turn it on and click **Enroll sctl**; see
     [External Access](/docs/use/external-access/#pairing).
   - sctl Browser: click the sctl Browser icon in the browser toolbar and enter it in the popup; see
     [sctl Browser](/docs/use/sctl-browser/#pairing).

3. Run `sctl status` to list every paired ScriptCat and browser and whether each is online.

The key that pairing creates does not expire, and the extensions reconnect on their own after the browser restarts,
so you do not pair again.

:::warning The pairing code is shown only in the terminal
The code expires after 2 minutes, works once, and is never sent over the network to the extension. Do not paste it
into an AI chat, an issue, a log or an MCP configuration; if it expires, run `sctl connect` again.
:::

## 4. Connect AI {#ai}

There are two ways to connect an AI tool. Pick the one that fits the tool you use.

### Coding agents such as Claude Code and Codex: install the skill

A coding agent can already run commands. With sctl's skill installed, it knows how to use `sctl` to work with your
ScriptCat and browser:

```bash
npx skills add scriptscat/sctl -g
```

This needs Node.js. Run `npx skills check -g` to check for updates and `npx skills update -g` to install them. To have
the agent write scripts for you, also install ScriptCat's skill; see [Developing Scripts with AI](/docs/dev/ai/) for the
whole workflow.

### AI clients such as Claude Desktop and Cursor: configure MCP

Add this to the AI client's MCP configuration:

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

Some clients can add it from the command line, for example Claude Code and Codex:

```bash
claude mcp add scriptcat -- /absolute/path/to/sctl mcp --name claude-code
codex mcp add scriptcat -- /absolute/path/to/sctl mcp --name codex
```

- Set `command` to the **absolute path** of sctl (`command -v sctl` shows it). Many desktop apps have a shorter `PATH`
  than your terminal and do not expand `~` or `$HOME`.
- `--name` is only a label written to the audit log so you can tell clients apart. It is not authentication or a
  permission boundary.
- The AI client starts `sctl mcp` itself, but `sctl serve` must already be running.
- Do not wrap sctl in a script that prints to standard output: standard output carries the MCP traffic.

Restart or reload the AI client after changing its configuration, then ask it to "list my installed scripts" or "list
my open tabs" to check. One `sctl mcp` provides both the ScriptCat and the sctl Browser tools; tools for a side you have
not paired return an error. See [External Access](/docs/use/external-access/#ai) and
[sctl Browser](/docs/use/sctl-browser/#ai) for the tool lists.

### Permissions

Either way, the AI can do exactly what you can do with sctl commands. ScriptCat source reads and writes wait for your
confirmation in the browser under [External Access's policies](/docs/use/external-access/#permissions); most sctl
Browser operations run immediately, see [sctl Browser](/docs/use/sctl-browser/#approval). Give sctl only to AI tools you
trust.

## 5. Several ScriptCat instances or browsers {#instances}

You can pair several ScriptCat instances (for example one in each of two browsers) and several browsers; run
`sctl connect` once for each. `sctl scriptcats` and `sctl browsers` show their names and whether they are online, and
their `forget` subcommands remove a pairing.

With exactly one online, commands pick it automatically. With several online, choose one with `--scriptcat <name>` /
`--browser <name>`, or the environment variables `SCTL_SCRIPTCAT` / `SCTL_BROWSER`.

## 6. Advanced settings {#advanced}

### Data directory {#data-dir}

Every sctl process must use the same data directory, which holds the pairing keys, the local control token and the
logs:

| Platform | Default data directory |
|---|---|
| macOS | `~/Library/Application Support/sctl/` |
| Windows | `%LOCALAPPDATA%\sctl\` |
| Linux | `~/.config/sctl/` |

When every process runs as the same user, keep the default. To use another one, give **every** sctl process —
including the background service and the MCP configuration — the same absolute path:

```bash
export SCTL_DATA_DIR=/absolute/path/to/sctl-data   # or --data-dir; the flag wins
```

```json
"env": { "SCTL_DATA_DIR": "/absolute/path/to/sctl-data" }
```

Do not put the data directory in a code repository or a shared sync folder, and do not hand its files to an AI.

### Listening on another address {#listen-address}

To let a browser on another device connect, set the listen address explicitly:

```bash
sctl --listen-address 0.0.0.0:8643 serve
```

The other sctl commands on that machine, `sctl service install` and `sctl mcp` then need the same `--listen-address`.
In the extensions, enter the address the browser can actually reach, such as `ws://192.168.1.10:8643`, not `0.0.0.0`.

:::warning Only on a trusted network
`ws://` does not encrypt the traffic. The extensions and sctl still authenticate each other with the pairing key, but
use a non-default address only on a trusted network.
:::

## 7. Troubleshooting {#troubleshooting}

**"daemon unreachable"**: `sctl serve` is not running. Run `sctl service start` (if you installed the service) or
`sctl serve`. If you changed the listen address, make sure every command passes the same `--listen-address`.

**Control channel authentication fails**: different sctl processes use different data directories. Point
`SCTL_DATA_DIR` and `--data-dir` at the same absolute path, then restart the AI client.

**The AI client shows no tools**: check that `command` is the absolute path of sctl and that the configuration file is
valid, then reload the client.

**Logs**: they are in `logs/` under the data directory, for example `~/Library/Application Support/sctl/logs/` on macOS
by default.

For problems on the extension side, see [External Access](/docs/use/external-access/#troubleshooting) and
[sctl Browser](/docs/use/sctl-browser/).
