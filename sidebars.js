/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  use: [
    "use/use",
    "use/script_installation",
    "use/sync",
    "use/QA",
    {
      type: "category",
      label: "从其它管理器迁移",
      items: [
        "use/from-other/migrate-from-tampermonkey",
        "use/from-other/migrate-from-violentmonkey",
      ],
    },
    "use/open-dev",
    "use/vscode",
    "use/external-access",
    {
      type: "category",
      label: "服务协议",
      items: [
        "use/policy/disclaimer",
        "use/policy/privacy",
        "use/policy/privacy_website",
        "use/policy/privacy_sctl",
      ],
    },
    // use/install_comple and script_installation (top-level) are hidden
    // extension-flow pages, intentionally not listed in any sidebar.
  ],
  dev: [
    "dev/index",
    "dev/background",
    "dev/cloudcat",
    "dev/subscribe",
    "dev/config",
    "dev/api",
    "dev/cat-api",
    {
      type: "category",
      label: "Agent 智能助手",
      link: { type: "doc", id: "dev/agent/index" },
      items: [
        "dev/agent/agent-conversation",
        "dev/agent/agent-dom",
        "dev/agent/agent-skill-install",
        "dev/agent/agent-skill",
        "dev/agent/agent-task",
        "dev/agent/agent-model",
        "dev/agent/agent-opfs",
        "dev/agent/agent-mcp",
        "dev/agent/agent-skill-dev",
        "dev/agent/agent-builtin-tools",
      ],
    },
    "dev/meta",
  ],
  change: [
    "change/index",
    "change/beta-changelog",
    "change/v1.5",
    "change/v1.4",
    "change/v1.3",
    "change/v1.2",
    "change/v1.1",
    "change/v0.17",
    "change/v0.16",
  ],
};

module.exports = sidebars;
