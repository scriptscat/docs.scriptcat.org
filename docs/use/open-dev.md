---
title: 开启浏览器 User Scripts 支持
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Icon } from "@site/src/components/Icon";
import BrowserGuide from '@site/src/components/BrowserGuide';
import GithubStar from '@site/src/components/GithubStar';
import Showcase from '@site/src/components/Showcase';

<Showcase />

<GithubStar variant="bar" scene="install" />

<BrowserGuide texts={{
  allowUserScripts: {
    title: "你的浏览器支持「允许用户脚本」功能",
    description: "请按照下方步骤开启「允许用户脚本」选项即可正常使用脚本猫。",
    button: "查看操作步骤",
    anchor: "#允许用户脚本",
  },
  devMode: {
    title: "你的浏览器需要开启「开发者模式」",
    description: "请按照下方步骤开启「开发者模式」即可正常使用脚本猫。",
    button: "查看操作步骤",
    anchor: "#开启开发者模式",
  },
  legacy: {
    title: "你的浏览器版本过低",
    description: "你的浏览器版本不支持 Manifest V3，需要手动安装旧版脚本猫 (v0.16.x)，请参考下方说明。",
  },
  nonChromium: {
    title: "未检测到 Chromium 内核浏览器",
    description: "本页的「允许用户脚本」和「开发者模式」设置仅适用于 Chromium 内核浏览器（如 Chrome、Edge 等）。Firefox 已在 Beta 版本（v1.5+）中支持 Manifest V3，不需要这些 Chromium 专用设置。",
  },
}} />

## 允许用户脚本

[允许用户脚本](https://developer.chrome.com/docs/extensions/reference/api/userScripts?hl=zh-cn#chrome_versions_138_and_newer_allow_user_scripts_toggle)是 Manifest V3 的一个新特性，允许用户脚本在浏览器中运行。

<Tabs groupId="browser" queryString>
  <TabItem value="edge" label={<div className="flex items-center gap-1"><Icon height={16} width={16} icon="logos:microsoft-edge" />Edge</div>} default>

① 打开浏览器的扩展列表然后点击扩展右边的三个点

![edge-open-settings](./open-dev.assets/edge-open-settings.webp)

或者右键单击扩展图标，选择`管理扩展`

② 在菜单中点击扩展管理

![alt text](./open-dev.assets/QQ_1787725815876.png)

③ 在脚本猫扩展的详情页中，找到`允许用户脚本`选项，开启它，然后关闭扩展再开启扩展，或者重启浏览器，使脚本功能生效。

> ⚠️⚠️⚠️ 低版本 Edge 浏览器(\<=143 版本)或者没有该选项的用户，请参考[开启开发者模式](#开启开发者模式)

![image-20260130233818464](open-dev.assets/image-20260130233818464.png)

  </TabItem>
  <TabItem value="chrome" label={<div className="flex items-center gap-1"><Icon height={16} width={16} icon="logos:chrome" />Chrome</div>}>

① 打开浏览器的扩展管理界面，或者访问 [chrome://extensions/](chrome://extensions/)

![chrome-open-settings](./open-dev.assets/chrome-open-settings.webp)

② 在扩展管理界面中，找到脚本猫扩展，点击`详情`

![image-20250623140940401](open-dev.assets/image-20250623140940401.webp)

③ 在脚本猫扩展的详情页中，找到`允许用户脚本`选项，开启它，然后关闭扩展再开启扩展，或者重启浏览器，使脚本功能生效。

![image-20250623141002831](open-dev.assets/image-20250623141002831.webp)
</TabItem>
<TabItem value="edge-mobile" label={<div className="flex items-center gap-1"><Icon height={16} width={16} icon="logos:microsoft-edge" />Edge Mobile</div>}>

Edge Mobile 内核版本 ≥ 138 时，不需要开启开发者模式，只需要在扩展设置中启用「允许用户脚本」。

① 打开 Edge Mobile 的扩展列表，找到脚本猫扩展，点击右侧的`⋮`按钮

② 在弹出的扩展设置中，开启`允许用户脚本`

③ 关闭扩展再开启扩展，或者重启浏览器，使脚本功能生效。

> ⚠️⚠️⚠️ 内核版本低于 138 或没有该选项的用户，请参考[开启开发者模式](#开启开发者模式)

![edge-mobile-allow-user-scripts](./open-dev.assets/edge%20mobile%20138.png)

  </TabItem>
</Tabs>

## 开启开发者模式

<Tabs groupId="browser" queryString>
  <TabItem value="edge" label={<div className="flex items-center gap-1"><Icon height={16} width={16} icon="logos:microsoft-edge" /><span>Edge</span></div>} default>

① 打开浏览器的扩展管理界面，或者访问 [edge://extensions/](edge://extensions/)

![edge-open-settings](./open-dev.assets/edge-open-settings.webp)

② 打开`开发人员模式`（某些浏览器该模式可能会存在其他选项中 如 360 浏览器: 高级管理>开发者模式）

![edge-open-dev](./open-dev.assets/edge-open-dev.webp)

③ 开启开发者模式后，关闭扩展再开启扩展，或者重启浏览器，使脚本功能生效。

  </TabItem>
  <TabItem value="chrome" label={<div className="flex items-center gap-1"><Icon height={16} width={16} icon="logos:chrome" /><span>Chrome</span></div>}>

① 打开浏览器的扩展管理界面，或者访问 [chrome://extensions/](chrome://extensions/)

![chrome-open-settings](./open-dev.assets/chrome-open-settings.webp)

② 打开`开发人员模式`（某些浏览器该模式可能会存在其他选项中 如 360 浏览器: 高级管理>开发者模式）

![chrome-open-dev](./open-dev.assets/chrome-open-dev.webp)

③ 开启开发者模式后，关闭扩展再开启扩展，或者重启浏览器，使脚本功能生效。

  </TabItem>

<TabItem value="edge-mobile" label={<div className="flex items-center gap-1"><Icon height={16} width={16} icon="logos:microsoft-edge" /><span>Edge Mobile</span></div>}>

Edge Mobile 内核版本低于 138 或没有「允许用户脚本」选项时，点击扩展页上方的设置按钮开启开发者模式。

![edge-mobile-open-dev](./open-dev.assets/edge%20mobile.png)
</TabItem>

</Tabs>

:::warning 低版本提示

如果你使用的是 Windows 8/7/XP 系统，或者浏览器内核版本低于 120，需要自行手动安装[旧版脚本猫](https://bbs.tampermonkey.net.cn/thread-3068-1-1.html)，v0.16.x 是最后一个支持 Manifest V2 的版本，安装步骤可以参考：[加载解压缩方式安装扩展](/docs/use/use/#%E5%8A%A0%E8%BD%BD%E8%A7%A3%E5%8E%8B%E7%BC%A9%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95)。

:::

<details>
<summary>技术背景：Manifest V3</summary>

由于浏览器限制，强制扩展升级 Manifest V3，在 2025 年 6 月后将全面停止 Manifest V2 版本的扩展；在 Manifest V3 的限制下，必须开启开发者模式/用户脚本功能才能正常使用脚本猫扩展。

参考内容：[面向扩展程序用户的开发者模式](https://developer.chrome.com/docs/extensions/reference/api/userScripts?hl=zh-cn#developer_mode_for_extension_users)、[Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3?hl=zh-cn)

在浏览器内核版本 ≥ 138 时，需要打开「允许用户脚本」；低版本则需要「开启开发者模式」。

</details>
