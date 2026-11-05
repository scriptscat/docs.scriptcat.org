---
title: External Access (Manage Scripts from the Command Line and AI)
sidebar_label: External Access
---

**External Access** lets the command line and AI tools on your computer manage the scripts in ScriptCat through
[sctl](/docs/use/sctl/): list, read, search, install, edit, enable, disable and delete them, run background scripts and
read their logs.

```text
AI tools ── sctl mcp / sctl commands ──▶ sctl serve ── WebSocket ──▶ ScriptCat
```

- ScriptCat's policies and confirmation pages always decide whether a source read or a write goes ahead; an external
  program cannot approve its own request.
- ScriptCat is paired once, and the command line and every AI tool share that connection.

Before you start, install sctl and start `sctl serve` as described in [Getting Started with sctl](/docs/use/sctl/).

## 1. Turn it on and pair {#pairing}

1. In ScriptCat, open **Tools → External Access** and turn on the switch. Keep the default **sctl address**,
   `ws://127.0.0.1:8643`.
2. Run `sctl connect` in a terminal and note the 8-character pairing code it shows.
3. In ScriptCat, click **Enroll sctl**, enter the code and click **Enroll**.
4. You are done when the card shows **Connected** and the sctl version; `sctl status` in a terminal confirms it too.

The code is valid for 2 minutes and works once. Do not send it to an AI or paste it anywhere else.

## 2. Permissions and confirmation {#permissions}

| Capability | Default behavior |
|---|---|
| List scripts, read metadata | Returned directly |
| Run a background or scheduled script once, read script logs | Run directly |
| Read or search script source | Follows the **Source read** policy |
| Install, edit, enable, disable or delete scripts | Follows the **Write operations** policy |

Both policies can be set to **Ask each time** (the default) or **Allow directly** on the External Access card.

Under **Ask each time**, a request opens a confirmation page in the browser and the command line or AI waits for your
decision. Installs and edits are confirmed on the script install page, which says at the top that the request came
from External Access and, for an edit, shows the changes. Source reads, enabling, disabling and deleting open a
separate confirmation page:

- **Allow**: allows this one request.
- **Allow this session**: stops asking for the same kind of operation on the same script until the browser restarts,
  the extension reloads or External Access is stopped.
- **Reject**: the requester receives a rejection.

A request with no decision expires after 5 minutes; it is also voided when the requester disconnects or you press
`Ctrl-C` in the terminal.

:::warning Use "Allow directly" with care
"Allow directly" skips the confirmation page for that kind of operation. Script source may contain API keys, cookies
and other secrets, and writes change your scripts immediately. Turn it on only when you understand the risk.
:::

`sctl run` really runs the script: its network requests, notifications and stored data all happen. Neither running nor
reading logs asks for confirmation, so know what a script does before letting an AI run it.

## 3. Command line {#cli}

```bash
sctl get                         # list scripts
sctl get <uuid>                  # read metadata
sctl get <uuid> -o source        # print the full source
sctl get <uuid> -o source --lines 20-80
sctl grep <uuid> "fetch("        # search the source literally; -E for a regular expression
sctl install <url|file>
sctl edit <uuid> --replace OLD --with NEW
sctl enable <uuid>
sctl disable <uuid>
sctl delete <uuid>
sctl run <uuid>                  # run a background or scheduled script once, wait, print this run's logs
sctl logs <uuid> --since 1h      # read a script's logs; filter with --level and --text
```

- `grep` matches literally by default; `-i` ignores case and `-C N` adds context. No match is not an error and still
  exits 0.
- `edit` changes the script by content anchor, not by line number: by default each `--replace` text must occur exactly
  once, and `--replace-all` replaces every match. Only the change is sent to the extension.
- `run` waits up to 60 seconds by default; change it with `--timeout`, or use `--no-wait` to return at once. If the
  timeout passes first, the script is still running and the result says so; that is not a failure. Page scripts cannot
  be run this way.

:::note Version requirement
`run` and `logs` need a ScriptCat **later than v1.5.0** and an sctl **later than v0.3.0** (coming soon).
:::

Commands that need confirmation wait for your decision in the browser, and the exit code tells you the outcome:

| Exit code | Meaning |
|---|---|
| `0` | Approved and succeeded, or a read-only command finished |
| `1` | Rejected in the browser |
| `2` | The request expired, was cancelled with `Ctrl-C`, or the extension disconnected |
| `3` | Any other error: bad arguments, connection failure, script not found |

Add `-o json` for machine-readable output, and run `sctl <command> --help` for every flag. With several ScriptCat
instances paired, pick one with `--scriptcat <name>`; see [Getting Started with sctl](/docs/use/sctl/#instances).

## 4. Use it from AI tools {#ai}

To connect an AI tool (skill or MCP), see [Getting Started with sctl](/docs/use/sctl/#ai). To have an AI write scripts
and verify them, see [Developing Scripts with AI](/docs/dev/ai/).

Over MCP, these are the script tools; each follows the same rules as its command:

| Tool | What it does | Policy |
|---|---|---|
| `scripts_list` | List script summaries | None |
| `scripts_metadata_get` | Read one script's metadata | None |
| `scripts_source_get` | Read source by uuid, with an optional line range | Source read |
| `scripts_source_grep` | Search source and return matching lines | Source read |
| `scripts_install_request` | Request a script install | Write operations |
| `scripts_edit_request` | Request a content-anchored edit | Write operations |
| `scripts_toggle_request` | Request enabling or disabling a script | Write operations |
| `scripts_delete_request` | Request deleting a script | Write operations |
| `scripts_run` | Run a background or scheduled script once | None |
| `scripts_logs` | Read a script's logs | None |

## 5. Audit and revoke {#revoke}

- **View audit log** on the External Access card opens the log page filtered to External Access.
- `sctl status` shows the sctl version, the extension connection and a summary of recent security events; `-o json`
  returns every event.
- **Stop External Access** disconnects, deletes the extension's pairing data and clears session approvals. You need to
  pair again to use it afterwards.
- To cut off a single AI client, remove sctl from that client's MCP configuration. The command line and other clients
  are not affected.

## 6. Troubleshooting {#troubleshooting}

**The External Access card shows "connection failed"**: check that `sctl serve` is running, that the address on the
card matches it, and that security software is not blocking `127.0.0.1:8643`. If you never paired or stopped External
Access, pair again with `sctl connect`.

**A command does not return**: find the confirmation page in the browser and decide; press `Ctrl-C` to void the
request instead.

**`run` or `logs` says to upgrade**: ScriptCat or sctl is too old. Upgrade both and restart `sctl serve`.

**`debug` logs are missing**: the stable ScriptCat release keeps only `info` and higher. Log what you need to see at
`info` or above.

For problems with the daemon, the data directory or AI clients, see
[Getting Started with sctl](/docs/use/sctl/#troubleshooting).
