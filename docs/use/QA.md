---
title: 常见问题
---

## 开发者模式 / 用户脚本权限

#### Q: 脚本猫提示"未启用开发者模式"，脚本无法运行？

从 Chrome 120+ / Edge 新版本开始，浏览器要求用户手动开启权限，脚本才能正常运行。请参考 [开启浏览器 User Scripts 支持](/docs/use/open-dev/) 进行设置。

如果确认已开启但仍提示，尝试重启浏览器或重新加载扩展。

## 脚本不生效

#### Q: 安装了脚本但没有生效？

1. **未开启"允许用户脚本"** — 请参考 [开启浏览器 User Scripts 支持](/docs/use/open-dev/)
2. **冷启动** — 浏览器刚打开时脚本可能未及时加载，刷新页面重试
3. **与其他扩展冲突** — 广告拦截扩展（如 uBlock Origin）可能导致脚本报错

#### Q: 脚本在 Tampermonkey 上正常，但在脚本猫上不行？

脚本猫与 Tampermonkey 在部分 API 实现上存在差异。建议更新到最新版本，如问题仍存在可在 [GitHub](https://github.com/scriptscat/scriptcat/issues) 提交 Issue。

## CSP / Trusted Types 限制 {#csp-trusted-types}

#### Q: 网站的 CSP 限制导致脚本无法正常运行，怎么办？

在 ScriptCat 的 **Network Rules（网络规则）** 页面中依次选择「工具 → 网络规则 → 新建规则 → 移除 CSP」，并在「应用范围」中只填写实际出现问题的网站，例如 `example.com`。保存规则后，刷新已经打开的页面即可应用。

「移除 CSP」模板会针对主框架和子框架的文档请求移除 CSP 响应头，也可以选择同时移除 `X-Frame-Options`。

#### Q: 遇到 `This document requires 'TrustedHTML' assignment.` 怎么办？

这通常表示浏览器因 Trusted Types 限制拒绝了某项 DOM 操作。网站可以通过 CSP 指令 `require-trusted-types-for 'script'` 启用 Trusted Types；userscript 执行不符合要求的操作时可能出现此错误。这是浏览器执行的网站安全策略，单凭错误信息不能断定是 ScriptCat 的问题。

如果限制由文档响应中的 CSP 响应头启用，可以尝试为该网站建立上述「移除 CSP」规则。规则可能移除这项限制，但如果错误不是由可移除的 CSP 响应头引起，就不一定能解决。

#### Q: 为什么不默认对所有网站移除 CSP？

CSP 和 Trusted Types 有助于降低跨站脚本（XSS）等攻击的风险。移除 CSP 会削弱匹配网站原有的安全保护。建议只为确实需要的网站建立规则；ScriptCat 支持「所有网站」范围，但保存前会显示风险确认。

:::warning 安全提示

除非理解并接受相关风险，否则不要将范围设为「所有网站」。

:::

:::info 关于 ScriptCat 自身的 Trusted Types 兼容性问题

[ScriptCat #1239](https://github.com/scriptscat/scriptcat/issues/1239) 还涉及 `GM_xmlhttpRequest` 的兼容性问题，后来由 [ScriptCat #1242](https://github.com/scriptscat/scriptcat/pull/1242) 修复。该修复没有停用或绕过 Trusted Types，也不会修改网站的 CSP。如果仍在使用旧版 ScriptCat，请更新到当前版本。

:::

## 云同步问题

> 云同步的基本使用请参考 [同步与备份](/docs/use/sync/)。

#### Q: 使用 OneDrive / Google Drive / WebDAV 同步异常？

1. **删除的脚本被同步回来** — 确保所有设备都开启了"同步删除"选项

## 脚本安装问题

> 脚本安装方式请参考 [安装脚本](/docs/use/script_installation/)。

## Cookie 授权问题

#### Q: GM_cookie 无法获取 Cookie？

1. **授权弹窗不出现** — 确保脚本的 `@grant` 中正确声明了 `GM_cookie`，并且需要在脚本中使用`@connect`声明需要访问的域名

## 脚本数据丢失

#### Q: 打开浏览器后脚本全部消失了？

1. **初始化延迟** — 浏览器刚启动时脚本猫可能还在加载数据，等待几秒或重启浏览器即可恢复
2. **清理软件导致** — 360 安全卫士、CCleaner 等清理工具可能清除扩展数据，建议在清理工具中排除浏览器扩展数据
3. **建议定期备份** — 使用导出功能或 [云同步](/docs/use/sync/) 定期备份脚本和配置
