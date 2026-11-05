---
title: Developing Scripts with AI
---

You can have an AI coding agent such as Claude Code or Codex write ScriptCat scripts for you. With the two skills below,
it follows ScriptCat's rules, installs the script into your ScriptCat, checks the result in your browser, and fixes and
retries when something is wrong.

| Skill | What it does | Where it lives |
|---|---|---|
| `scriptcat-userscript` | How to write: picking the script type, skeletons, the rules that break scripts, an API reference, plus a static checker and a hot-reload helper | ScriptCat repository, [`skills/scriptcat-userscript`](https://github.com/scriptscat/scriptcat/tree/main/skills/scriptcat-userscript) |
| `sctl` | How to act: through [sctl](https://github.com/scriptscat/sctl), install the script into your ScriptCat and open pages, read the console and read logs in your real browser | sctl repository, [`skills/sctl`](https://github.com/scriptscat/sctl/tree/main/skills/sctl) |

:::tip Let the AI set it up
Send this to your AI agent. It follows the [instructions for AI agents](#for-ai-agents) on this page to check your setup,
install the skills, and tell you which steps you need to do yourself:

> Read https://docs.scriptcat.org/en/docs/dev/ai/ and follow its "For AI agents" section to set me up for writing ScriptCat scripts with AI.
:::

:::info Not ScriptCat's built-in Agent
This page is about external AI coding tools running on your computer. For the AI features built into the ScriptCat
extension and the `CAT.agent` API, see [Agent](/docs/dev/agent/).
:::

## 1. Install the two skills

Install with [`npx skills`](https://skills.sh/), which needs Node.js 18 or later (the checker bundled with
`scriptcat-userscript` needs it too). It installs a skill into several agents at once, such as Claude Code, Codex and
Cursor, and asks which agents to install into:

```bash
npx skills add scriptscat/scriptcat -g
npx skills add scriptscat/sctl -g
```

Run `npx skills check -g` to check for updates and `npx skills update -g` to install them.

You can also install by hand: link or copy `skills/scriptcat-userscript` from the ScriptCat repository and `skills/sctl`
from the sctl repository to where your agent reads skills. You then update them yourself.

Once installed, the agent loads the right skill by itself whenever you mention a userscript, background script,
scheduled script, `.user.js` or ScriptCat — there is nothing else to configure.

## 2. Connect ScriptCat (optional)

The skills alone are enough for the agent to write scripts; you then install the `.user.js` file and check it yourself.
For the agent to install scripts and verify them in your browser, you also need:

1. **sctl and External Access**: follow [External Access](/docs/use/external-access/) to install sctl, start
   `sctl serve` and pair ScriptCat. You are ready when `sctl status` shows the extension connected.
2. **sctl Browser**: for the agent to open pages, read the console, click and take screenshots while verifying a page
   script, also install and pair [sctl Browser](/docs/use/sctl-browser/). It is not needed for background or scheduled
   scripts only.

## 3. Example

Describe what you want in plain language, for example:

> Write a ScriptCat script that adds a "Copy article" button to the bottom-right corner of article pages on
> example.com. Install it into my ScriptCat and confirm in my browser that the button works.

The agent then typically:

1. **Looks at the target page**: opens it through sctl Browser, reads its structure and finds stable selectors. When it
   needs data, it looks at the requests the page makes and calls the site's API directly rather than scraping the page.
2. **Writes and checks the script**: writes the metadata and code following the skill's rules, then runs the bundled
   checker to catch common mistakes — an API used without its `@grant`, a requested host missing from `@connect`, an
   invalid cron expression.
3. **Installs it**: runs `sctl install`. ScriptCat's install page opens in the browser and **asks you to confirm**.
4. **Verifies it**: reloads the target page, checks the console for errors, confirms the button really appears and works,
   and tells you what it observed.
5. **Iterates**: reinstalls after a change, or edits the installed script with `sctl edit` — each asks you to confirm.
   For frequent changes to a page script, the agent can first install a "stub" that loads the local file through
   `@require file:///…`; after that, saving the file and reloading the page runs the new code with no confirmation. This
   needs "Allow access to file URLs" turned on for ScriptCat on the browser's extension details page.

Background and scheduled scripts have no page, so verification works differently:

> Write a scheduled script that runs once a day, calls the check-in API on example.com, and retries after 30 seconds on
> failure. Install it, run it once and tell me the result.

After installing, the agent runs the script immediately with `sctl run`, gets the outcome (complete / error / still
running) together with that run's log, and reads the full log with `sctl logs` — no need to wait for the schedule.

:::note Version requirement
`sctl run` and `sctl logs` need a ScriptCat release **after v1.5.0** and an sctl release **after v0.3.0** (coming soon).
With older versions the skill falls back to indirect ways of verifying background scripts and suggests upgrading.
:::

## 4. Permissions and safety

What the agent does through sctl is exactly what you could do by running sctl yourself, under the same rules:

| Operation | Needs your confirmation? |
|---|---|
| Install, edit, enable, disable or delete a script | Per External Access's **write** policy; by default you confirm in the browser |
| Read or search a script's source | Per the **source-read** policy; by default you confirm in the browser |
| Run a background or scheduled script once (`sctl run`), read a script's logs (`sctl logs`) | No |
| Open pages, read page content, click, read the console and network requests | No |

"Allow this session" on a confirmation page stops repeat prompts for the same kind of operation on the same script
until the browser session ends, which makes an agent iterating on one script much smoother. For the full policy, see the "Permissions and confirmation" section of
[External Access](/docs/use/external-access/).

A few recommendations:

- `sctl run` really executes the script: its requests, notifications and stored data all happen. Let the agent run
  scripts it is writing; check what one of your existing scripts does before having it run.
- Page operations happen in your real browser and can use your signed-in sessions. Only let the agent visit sites
  relevant to the task.
- Script logs can contain data the script processed. Do not write tokens, passwords and the like to the log.

## 5. FAQ

**The agent's script will not install or does not run?** Ask the agent to run the skill's checker and show you the
output. Most "installed but does nothing" problems are a missing `@grant`, a wrong `@match` or a missing `@connect`.

**Why are `debug` logs missing?** Release builds of ScriptCat keep only `info` and above, so `GM_log(…, "debug")` never
shows up on the Logs page or in `sctl logs`. Log anything you need to read at `info` or higher.

**More than one ScriptCat is online?** For example, ScriptCat is installed and paired in two browsers. Tell the agent
which one to use: add `--scriptcat <name>` to the command or set the `SCTL_SCRIPTCAT` environment variable. List the
names with `sctl scriptcats`.

## 6. For AI agents {#for-ai-agents}

This section is for AI coding agents. When the user asks you to set things up from this page, check each step in order
and skip the ones already done:

1. **Install the skills.** If you do not have the `scriptcat-userscript` and `sctl` skills yet, run the commands below
   with `-a` set to your own agent name (such as `claude-code`, `codex` or `cursor`). Do not leave out `-a`: run
   non-interactively without it, the skills only go to `~/.agents/skills`, which Claude Code and some other agents do
   not read.

   ```bash
   npx skills add scriptscat/scriptcat -g -a claude-code
   npx skills add scriptscat/sctl -g -a claude-code
   ```

   If the two skills do not show up in the current session afterwards, ask the user to start a new session.
2. **Check sctl.** Run `sctl status`.
   - `sctl` not found: ask the user to install it by following [External Access](/docs/use/external-access/).
   - Daemon unreachable: ask the user to run `sctl serve`, or `sctl service start` if they installed the background
     service. Do not start the daemon in the background yourself: it exits with your session and can fight the user's
     service for the port.
   - Extension not connected: ask the user to enable External Access in ScriptCat's settings, run `sctl connect`, and
     type the one-time code it shows into ScriptCat.
   - If the user does not want sctl for now, carry on anyway: you only write the script and hand the `.user.js` file to
     the user to install.
3. **Check sctl Browser**, only needed to verify page scripts. If `sctl browsers` shows no online browser, ask the user
   to install and pair [sctl Browser](/docs/use/sctl-browser/).
4. **Report.** Tell the user what is ready and what is left for them. When writing scripts afterwards, follow the
   `scriptcat-userscript` skill. Installing and editing scripts needs the user's approval in the browser: tell them to
   look at the browser, and do not retry in a loop.
