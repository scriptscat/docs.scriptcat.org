---
slug: /use/use
title: 快速开始
---

脚本猫是一个可以执行用户脚本的浏览器扩展，兼容 Tampermonkey 的用户脚本，并提供更多功能。如果您发现 BUG 或者建议可以前往[GitHub Repo](https://github.com/scriptscat/scriptcat)进行反馈。

## 安装扩展

你可以从下列扩展商店中安装扩展

| 浏览器          | 商店链接                                                                                                                                                                                                                                     | 状态         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Chrome          | [正式版本](https://chrome.google.com/webstore/detail/scriptcat/ndcooeababalnlpkfedmmbbbgkljhpjf) [Beta 版本](https://chromewebstore.google.com/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/jaehimmlecjmebpekkipmpmbpfhdacom?authuser=0&hl=zh-CN) | ✅ 可用      |
| Edge            | [正式版本](https://microsoftedge.microsoft.com/addons/detail/scriptcat/liilgpjgabokdklappibcjfablkpcekh) [Beta 版本](https://microsoftedge.microsoft.com/addons/detail/scriptcat-beta/nimmbghgpcjmeniofmpdfkofcedcjpfi)                      | ✅ 可用      |
| Firefox         | [正式版本 (MV2)](https://addons.mozilla.org/zh-CN/firefox/addon/scriptcat/) [Beta 版本 (MV3)](https://addons.mozilla.org/zh-CN/firefox/addon/scriptcat-pre/)                                                                                             | ✅ 可用 |

> Firefox 正式版本目前仍使用 Manifest V2；Beta 版本（v1.5+）已支持 Manifest V3。

### 其他浏览器

如果上述列表中没有你的浏览器,可以从[Github Release](https://github.com/scriptscat/scriptcat/releases)页面中,下载`zip`/`crx`文件手动进行安装

### 加载解压缩方式安装扩展

① 先从[Github Release](https://github.com/scriptscat/scriptcat/releases)或者[社区下载](https://bbs.tampermonkey.net.cn/thread-3068-1-1.html)页面中,下载`zip`文件,如果是`crx`文件将其后缀改为`zip`

② 准备一个文件夹用于存放插件，将上面的 zip 解压到该文件夹。解压后如下（**注意：此文件夹不可删除或移动，否则扩展将无法正常运行**） ![download-zip](./use.assets/download-zip.webp)

③ 打开浏览器的扩展管理界面加载解压缩的扩展 (参考 [开启开发者模式支持 manifest v3 版脚本猫](/docs/use/open-dev/) 先打开开发者模式)

- 1. **Edge** ![edge-load-unpacked](./use.assets/edge-load-unpacked.webp)
- 2. **Chrome** ![chrome-load-unpacked](./use.assets/chrome-load-unpacked.webp)

④ 选择加载步骤 ② 中新建的文件夹（加载完成后扩展管理界面的扩展列表中会显示脚本猫图标，浏览器的地址栏的右上角点击扩展按钮也可看见）

- 1. **Edge** ![edge-load-unpacked-img](./use.assets/edge-load-unpacked-img.webp)
- 2. **Chrome** ![chrome-load-unpacked-img](./use.assets/chrome-load-unpacked-img.webp)

⑤ 点击右上角脚本猫图标，在出现的界面右上角点击`┆`>获取脚本，即可前往脚本站搜索安装脚本

注意：以此方式安装扩展无法自动更新，如需更新请重复以上步骤以更新扩展（替换文件，重新加载一次即可）

## 获取脚本

> 除了脚本外你也可以在[油猴中文网](https://bbs.tampermonkey.net.cn/)与[脚本开发指南](https://learn.scriptcat.org/)获取一些脚本的资讯和教程.

### ScriptCat 脚本猫脚本站

[脚本猫脚本站](https://scriptcat.org/)是本扩展的脚本站点,可发布你编写的脚本.

- 新晋脚本站点
- 后台脚本/定时脚本
- 界面友好

### Userscript.Zone Search

[Userscript.Zone Search](https://www.userscript.zone/?utm_source=tm.net&utm_medium=scripts) 是一个新网站，允许通过输入合适的 URL 或域来搜索用户脚本。

- 大量的脚本资源
- 很容易找到合适的用户脚本
- 仅显示受审核的用户脚本页面或至少具有注释功能的页面中的用户脚本

### GreasyFork

[GreasyFork](https://greasyfork.org/) 是一个广泛使用的用户脚本（userscript）分享与托管平台，提供开发者发布和用户安装各类浏览器脚本。该网站由 Jason Barnabe 创建，并以注重安全性与开源透明为特点，收录了大量可用于扩展网站功能或改善浏览体验的脚本资源。

Jason Barnabe 同时也是 Stylish 浏览器扩展的原作者。不过，[Stylish](https://userstyles.org/) 已于 2016 年转手并由其他公司运营，之后的发展与 Jason Barnabe 已无直接关联。

- 大量的脚本资源
- 拥有可以从 Github 中进行脚本同步的功能
- 非常活跃的[开放源代码发展模式](https://github.com/JasonBarnabe/greasyfork)

### GitHub/Gist

你可以[在 Github 和 Gist 中 搜索脚本资源。](https://gist.github.com/search?l=JavaScript&o=desc&q="%3D%3DUserScript%3D%3D"&s=updated)

## 新手引导

安装脚本猫后，打开管理面板会自动开始新手引导（也可随时从左侧「帮助中心」重新打开）。引导覆盖：

- [安装脚本](/docs/use/script_installation/)：从脚本市场安装，支持[后台脚本](/docs/dev/background/)。
- 管理与操作：编辑、运行/停止、[UserConfig](/docs/dev/config/)。
- [备份](/docs/use/sync/)与[从其它管理器迁移](/docs/use/from-other/migrate-from-tampermonkey/)。
- [脚本同步](/docs/use/sync/)。
- [订阅](/docs/dev/subscribe/)。
