---
title: Beta 更新日志
---

import GithubStar from '@site/src/components/GithubStar';
import BetaTheme from '@site/src/components/BetaTheme';
import Showcase from '@site/src/components/Showcase';

<BetaTheme />

<Showcase />

<GithubStar variant="bar" scene="beta-changelog" />

脚本猫的版本发布主要分为两条分支: 正式版本与预发布版本，正式版本更新日志请看：[更新日志](./index.md)

预发布版本是在正式发布之前的版本.它们通常用于测试新功能,预发布版本的版本号包含一个预发布标识符,例如:
`1.0.0-beta.1`.

你可以从[Release](https://github.com/scriptscat/scriptcat/releases)页或者下面的扩展商店页中获取预发布版本

- [Chrome](https://chromewebstore.google.com/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/jaehimmlecjmebpekkipmpmbpfhdacom?authuser=0&hl=zh-CN)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/nimmbghgpcjmeniofmpdfkofcedcjpfi)
- [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/scriptcat-pre/)

另外除了预发布以外,脚本猫每次代码提交合并到主分支后都会在[Github Action](https://github.com/scriptscat/scriptcat/actions/workflows/build.yaml)上打包构建一次扩展,如果你想体验最新或者修复的内容可以前往[Github Action](https://github.com/scriptscat/scriptcat/actions/workflows/build.yaml)页进行下载.

<a name="1.5.0-beta.4"></a>

## 1.5.0-beta.4 (2026-09-18)

本次预发布重做了安装页：装脚本前就能看出哪些指令与 GM 能力在脚本猫里不会生效，更新时只突出变化了的权限，代码还能全屏查看；新建脚本的模板支持按类型自定义；同时解除了大脚本与大资源的消息大小限制，并修复 Firefox 沙盒相容性、脚本资源分类与一批安装 / 更新链路问题。

### 🚀 主要新功能

- ✨ 安装页标出写了但不会生效的指令、取值与 GM 能力，并注明脚本猫独有的能力 [#1713](https://github.com/scriptscat/scriptcat/issues/1713) ([#1742](https://github.com/scriptscat/scriptcat/pull/1742)) (by @CodFrm)
- ✨ 更新脚本时按与已安装版本的差异呈现权限，未变动项收起；同时移除常驻的安全警示条 [#1716](https://github.com/scriptscat/scriptcat/issues/1716) ([#1732](https://github.com/scriptscat/scriptcat/pull/1732)) (by @CodFrm)
- ✨ 新建脚本模板可在「设置 → 开发工具 → 脚本模板」按普通 / 后台 / 定时分别自定义，支持 `{{name}}`、`{{match}}`、`{{date:YYYY-MM-DD}}` 等变量 [#1722](https://github.com/scriptscat/scriptcat/issues/1722) ([#1731](https://github.com/scriptscat/scriptcat/pull/1731)) (by @CodFrm)
- ✨ 安装页支持全屏查看脚本代码 ([#1743](https://github.com/scriptscat/scriptcat/pull/1743)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修复大脚本与大资源受消息大小限制导致安装或读取失败 ([#1745](https://github.com/scriptscat/scriptcat/pull/1745)) (by @cyfung1031)
- 🐛 修正 Firefox 下 `@inject-into content` 脚本的分离 realm 沙盒相容性 [#1701](https://github.com/scriptscat/scriptcat/issues/1701) ([#1706](https://github.com/scriptscat/scriptcat/pull/1706)) (by @cyfung1031)
- 🐛 修正脚本资源分类与页面资源权限边界，`@resource` / `@require-css` / `@require` 不再互相串用 ([#1686](https://github.com/scriptscat/scriptcat/pull/1686)) (by @cyfung1031)
- 🐛 修复 `@run-at context-menu`：设置面板覆写的运行时机在重新注册后失效、菜单项注册不上、脚本体自己的 `GM_registerMenuCommand` 被屏蔽 [#1649](https://github.com/scriptscat/scriptcat/issues/1649) ([#1718](https://github.com/scriptscat/scriptcat/pull/1718)) (by @CodFrm)
- 🐛 修复 Edge Dev 下脚本注入静默失效 [#1724](https://github.com/scriptscat/scriptcat/issues/1724) ([#1725](https://github.com/scriptscat/scriptcat/pull/1725)) (by @mikemikimike)
- 🐛 批量更新页不再倒计时自动关闭；检查记录失效改为自动重新检查并接着做完剩余条目 [#1715](https://github.com/scriptscat/scriptcat/issues/1715) ([#1720](https://github.com/scriptscat/scriptcat/pull/1720)) (by @CodFrm)
- 🐛 批量更新页点击脚本名打开更新详情时复用检查缓存，不再重复请求，并挡住连点 ([#1719](https://github.com/scriptscat/scriptcat/pull/1719)) (by @CodFrm)
- 🐛 修复带路径前缀的 S3 端点（如 Supabase）同步失败 [#1723](https://github.com/scriptscat/scriptcat/issues/1723) ([#1729](https://github.com/scriptscat/scriptcat/pull/1729)) (by @CodFrm)
- 🐛 修正脚本 MIME 类型兼容性，以 `application/x-javascript` 提供的 `.user.js` 也能进入安装页 [#1730](https://github.com/scriptscat/scriptcat/issues/1730) ([#1736](https://github.com/scriptscat/scriptcat/pull/1736)) (by @cyfung1031)

### ⚡️ 性能优化

- ⚡️ 压缩用户网络规则的 DNR 编译输出，同类响应头合并为单条规则 ([#1733](https://github.com/scriptscat/scriptcat/pull/1733)) (by @cyfung1031)

### 🎨 UI 改进

- 💄 修正错误的 `overflow-hidden` 样式 ([#1746](https://github.com/scriptscat/scriptcat/pull/1746)) (by @cyfung1031)

<a name="1.5.0-beta.3"></a>

## 1.5.0-beta.3 (2026-09-01)

本次预发布带来「网络规则管理（DNR）」，可按域名移除 CSP 等响应头、改写请求/响应头、屏蔽或重定向请求；Popup 站点范围快捷操作改为常驻且可逆；并修复 Firefox 脚本沙盒、Popup 脚本列表与多设备同步排序等问题。

### 🚀 主要新功能

- ✨ 新增网络规则管理（DNR）：按域名移除 CSP / X-Frame-Options 等响应头、改写请求头与响应头、屏蔽或重定向请求，支持场景模板、规则排序、批量操作、配额提示与匹配测试 ([#1598](https://github.com/scriptscat/scriptcat/pull/1598)) (by @cyfung1031)
- ✨ Popup 站点范围快捷操作改为常驻，「排除在 X 上执行」优先移出 `@match` 而非写死 `@exclude` ([#1696](https://github.com/scriptscat/scriptcat/pull/1696)) (by @CodFrm)

### 🔒 安全性改进

- 🔒 限制 Agent OPFS 写操作至 workspace 目录，并支持重命名与移动 [#1572](https://github.com/scriptscat/scriptcat/issues/1572) ([#1578](https://github.com/scriptscat/scriptcat/pull/1578)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修复 Firefox 下 `@inject-into content` 脚本沙盒缺失 EventTarget 方法、自引用逃逸与接口物件被剥空 ([#1692](https://github.com/scriptscat/scriptcat/pull/1692)) ([#1697](https://github.com/scriptscat/scriptcat/pull/1697)) (by @CodFrm)
- 🐛 修复 Popup 全局关闭提示时有时无、且当前页脚本列表为空 ([#1694](https://github.com/scriptscat/scriptcat/pull/1694)) (by @CodFrm)
- 🐛 修复 Popup「当前页运行脚本」误报：过滤不可运行页面并恢复 iframe 脚本显示 [#1687](https://github.com/scriptscat/scriptcat/issues/1687) ([#1689](https://github.com/scriptscat/scriptcat/pull/1689)) (by @CodFrm)
- 🐛 修复多设备同步脚本排序错乱 [#1682](https://github.com/scriptscat/scriptcat/issues/1682) ([#1690](https://github.com/scriptscat/scriptcat/pull/1690)) (by @CodFrm)
- 🐛 修复新建脚本按钮点击被 hover 菜单吞掉，改为直接新建用户脚本 [#1699](https://github.com/scriptscat/scriptcat/issues/1699) ([#1704](https://github.com/scriptscat/scriptcat/pull/1704)) (by @CodFrm)

### 🎨 UI 改进

- 💄 桌面与移动三页列表统一为自适应列表行，修复窄窗口下脚本名被挤没 [#1698](https://github.com/scriptscat/scriptcat/issues/1698) ([#1709](https://github.com/scriptscat/scriptcat/pull/1709)) (by @CodFrm)
- 💄 菜单展开数量为 0 时，Popup 展开的菜单排在编辑 / 脚本设置之前 ([#1688](https://github.com/scriptscat/scriptcat/pull/1688)) (by @CodFrm)

### 其它

- 🔧 检查更新失败的日志附带具体 URL，便于定位问题 ([#1693](https://github.com/scriptscat/scriptcat/pull/1693)) (by @cyfung1031)

<a name="1.5.0-beta.2"></a>

## 1.5.0-beta.2 (2026-08-21)

本次预发布重点增强内置 Agent 的对话、工具循环、持久化与 MCP 可靠性，重构 Popup 站点范围操作为可逆状态机，并修复云同步、更新页等多个问题。

### 🚀 主要新功能

- ♻️ Agent 对话、工具循环、持久化与 MCP 可靠性增强 [#1545](https://github.com/scriptscat/scriptcat/issues/1545) ([#1549](https://github.com/scriptscat/scriptcat/pull/1549)) (by @cyfung1031)
- ✨ Popup 站点范围操作：S1–S4 可逆状态机 [#1590](https://github.com/scriptscat/scriptcat/issues/1590) ([#1666](https://github.com/scriptscat/scriptcat/pull/1666)) (by @CodFrm)

### 🧩 GM API 变更

- 🐛 修复 GM_download 传入空 url 时未触发 onerror 的兼容性问题 ([#1619](https://github.com/scriptscat/scriptcat/pull/1619)) (by @cyfung1031)

### 🎨 UI 改进

- 💄 更新页/安装页/编辑器体验修复，并修正被过期检查快照覆盖的更新记录 [#1650](https://github.com/scriptscat/scriptcat/issues/1650) [#1648](https://github.com/scriptscat/scriptcat/issues/1648) [#1651](https://github.com/scriptscat/scriptcat/issues/1651) ([#1677](https://github.com/scriptscat/scriptcat/pull/1677)) (by @CodFrm)

### 🐛 Bug 修复

- 🐛 云同步不再随 SW 冷启动触发，闹钟周期改为 30 分钟 [#1670](https://github.com/scriptscat/scriptcat/issues/1670) ([#1678](https://github.com/scriptscat/scriptcat/pull/1678)) (by @CodFrm)
- 🐛 修复安装更新页关闭 [#1669](https://github.com/scriptscat/scriptcat/issues/1669) ([#1675](https://github.com/scriptscat/scriptcat/pull/1675)) (by @CodFrm)

<a name="1.5.0-beta.1"></a>

## 1.5.0-beta.1 (2026-08-06)

本次预发布重点带来「外部接入（MCP 桥接）」与「脚本回收站」两大特性，正式支持 Firefox MV3，新增韩语、土耳其语、巴西葡萄牙语三种语言，并修复多项 GM API、云同步与编辑器问题。

### 🚀 主要新功能

- 💥 新增「外部接入（MCP 桥接）」：通过本地 `sctl` 守护进程统一接入 CLI 与 MCP 客户端，脚本读写均经分级授权与人工确认页面把关，支持「拒绝 / 允许 / 本会话允许」三档控制并留存审计 ([#1573](https://github.com/scriptscat/scriptcat/pull/1573)) (by @cyfung1031)
- 💥 新增脚本回收站：删除的脚本先入回收站，支持还原（保留原数据与权限）、彻底删除与到期自动清理，保留期可配置（默认 30 天，可设为永不） ([#1585](https://github.com/scriptscat/scriptcat/pull/1585)) (by @CodFrm)
- 💥 正式支持 Firefox MV3，完善 sandbox/offscreen 通信 ([#1561](https://github.com/scriptscat/scriptcat/pull/1561)) (by @cyfung1031)
- ✨ 增加 Popup 站点范围快捷操作 ([#1646](https://github.com/scriptscat/scriptcat/pull/1646)) (by @CodFrm)
- ✨ Popup 脚本列表展开数量改为可配置，与菜单展开数量分开 ([#1645](https://github.com/scriptscat/scriptcat/pull/1645)) (by @CodFrm)
- ✨ 图标服务新增「禁用」档，可彻底关闭 favicon 获取 ([#1637](https://github.com/scriptscat/scriptcat/pull/1637)) (by @CodFrm)
- ✨ 未定义的元数据标签在编辑器中显示警告 ([#1608](https://github.com/scriptscat/scriptcat/pull/1608)) (by @cyfung1031)
- ✨ 完善备份/还原/导入完整性：ScriptCat/Tampermonkey/Violentmonkey 自定义配置 + 设置备份 + 资源修复 ([#1554](https://github.com/scriptscat/scriptcat/pull/1554)) (by @CodFrm)

### ♻️ 重构与兼容性

- ♻️ 使用官方 MCP SDK 重构客户端 ([#1643](https://github.com/scriptscat/scriptcat/pull/1643)) (by @CodFrm)

### 🐛 Bug 修复

- 🐛 修复 GM_xmlhttpRequest 自定义 cookie 会追加而非覆盖同名 cookie 的问题 ([#1604](https://github.com/scriptscat/scriptcat/pull/1604)) (by @cyfung1031)
- 🐛 修复脚本同步状态一致性与云端冲突处理 ([#1504](https://github.com/scriptscat/scriptcat/pull/1504)) (by @cyfung1031)
- 🐛 修复日志定时清理失效 ([#1599](https://github.com/scriptscat/scriptcat/pull/1599)) (by @CodFrm)
- 🐛 修复脚本设置缺少 context-menu 运行时机 ([#1652](https://github.com/scriptscat/scriptcat/pull/1652)) (by @CodFrm)
- 🐛 修复安装页回退/关闭标签逻辑 ([#1594](https://github.com/scriptscat/scriptcat/pull/1594)) (by @cyfung1031)
- 🐛 修复保存脚本改名后浏览器标签页标题未同步更新 ([#1607](https://github.com/scriptscat/scriptcat/pull/1607)) (by @cyfung1031)
- 🐛 修复 window.focus 窗口聚焦并加强 windowId 校验 ([#1577](https://github.com/scriptscat/scriptcat/pull/1577)) (by @cyfung1031)
- 🐛 修复编辑器激活标签页关闭按钮被隐藏 [#1556](https://github.com/scriptscat/scriptcat/issues/1556) (by @CodFrm)
- 🐛 修复编辑器未保存时的导航保护 ([#1656](https://github.com/scriptscat/scriptcat/pull/1656)) (by @CodFrm)
- 🐛 修正回收站同名脚本保存确认文案 ([#1622](https://github.com/scriptscat/scriptcat/pull/1622)) (by @CodFrm)
- 🐛 selfMetadata 支持空覆盖：修复匹配/排除/标签/运行时机「删除即复活」 ([#1579](https://github.com/scriptscat/scriptcat/pull/1579)) (by @CodFrm)

### 🎨 UI 改进

- 💄 修复安卓端界面适配：动态视口高度 + 窄屏表格/设置行/日志统计条重排 ([#1636](https://github.com/scriptscat/scriptcat/pull/1636)) (by @RenjiYuusei)
- 💄 增加 Popup 紧凑布局选项 ([#1551](https://github.com/scriptscat/scriptcat/pull/1551)) (by @cyfung1031)

### 🌐 国际化

- 🌐 新增韩语（ko-KR）翻译 ([#1568](https://github.com/scriptscat/scriptcat/pull/1568)) (by @moduvoice)
- 🌐 新增土耳其语（tr-TR）翻译 ([#1557](https://github.com/scriptscat/scriptcat/pull/1557)) (by @azizaktas)
- 🌐 新增巴西葡萄牙语（pt-BR）翻译 ([#1587](https://github.com/scriptscat/scriptcat/pull/1587)) (by @Lucas559-noob)
- 🌐 补齐 pt-BR / tr-TR 的 chrome.i18n messages.json 与 Monaco 编辑器语言 ([#1605](https://github.com/scriptscat/scriptcat/pull/1605)) (by @CodFrm)

### 其它

- ⬆️ 升级依赖（含 TypeScript 6.0）并修复 pnpm audit 安全告警 ([#1576](https://github.com/scriptscat/scriptcat/pull/1576), [#1567](https://github.com/scriptscat/scriptcat/pull/1567)) (by @cyfung1031)
- 脚本同步设置改为即时保存 ([#1615](https://github.com/scriptscat/scriptcat/pull/1615)) (by @CodFrm)
- 📝 优化商店描述与 README 标语，提升「用户脚本」可发现性 ([#1553](https://github.com/scriptscat/scriptcat/pull/1553)) (by @CodFrm)

<a name="1.5.0-beta"></a>

## 1.5.0-beta (2026-07-08)

本次预发布带来**全新 UI**，界面更清爽、更一致，操作体验更顺手；并针对移动端进行了专门的设计优化，让移动端用户也能获得良好的使用体验。此外还新增了编辑器新建脚本类型选择、本地备份手动下载等功能，并修复了定时任务无效时区、原生 GM_download 跨域等问题。如果你对新的 UI/UX 有任何建议，欢迎前往 [GitHub 讨论区](https://github.com/scriptscat/scriptcat/discussions) 参与讨论。

### 🎨 UI 改进

- ♻️ 全新 UI：全面重构界面，优化移动端适配，为桌面与移动端都带来更好的使用体验 ([#1514](https://github.com/scriptscat/scriptcat/pull/1514)) (by @CodFrm)

### 🚀 主要新功能

- ✨ 编辑器标签栏「＋」支持选择新建脚本类型 ([#1544](https://github.com/scriptscat/scriptcat/pull/1544)) (by @cyfung1031)
- ✨ 为本地备份添加手动下载链接 ([#1543](https://github.com/scriptscat/scriptcat/pull/1543)) (by @cyfung1031)
- ✨ Chromium 148+ 扩展消息启用 structured_clone 序列化 ([#1534](https://github.com/scriptscat/scriptcat/pull/1534)) (by @cyfung1031)
- ✨ 预发布（beta）版本更新后自动打开更新日志页 (by @CodFrm)

### 🧩 GM API 变更

- 🐛 让原生 GM_download 遵循 @connect（与 GM_xmlhttpRequest 一致） ([#1506](https://github.com/scriptscat/scriptcat/pull/1506)) (by @DudeAint)

### ⚡️ 性能优化

- ⚡️ 优化脚本加载缓存，并修复 Popup 菜单残留 ([#1511](https://github.com/scriptscat/scriptcat/pull/1511)) (by @cyfung1031)

### 🧑‍💻 编辑器

- ♻️ 调整 `eslint-plugin-userscripts` 规则 ([#1510](https://github.com/scriptscat/scriptcat/pull/1510)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 避免 cron 自动侦测无效时区导致定时任务相关异常 ([#1531](https://github.com/scriptscat/scriptcat/pull/1531)) (by @cyfung1031)
- 🐛 修复 crontab 示例中不可用的演示 API ([#1542](https://github.com/scriptscat/scriptcat/pull/1542)) (by @cyfung1031)

### 🌐 国际化

- 🌐 新增土耳其语 (by @azizaktas)

<a name="1.4.0-beta.4"></a>

## 1.4.0-beta.4 (2026-06-13)

本次更新修复 Edge Android 移动端 popup 适配、初始加载白屏、缺少站点权限时跨域请求异常等多项问题，修补了通过不可信 YAML user-config 键触发的原型链污染漏洞，重构脚本资源更新与 ZIP 处理（JSZipp 替换 jszip），并继续完善 Firefox MV3 兼容与多语言翻译。

### 🧑‍💻 编辑器

- ✨ 优化 Monaco quick fix 与用户脚本元数据提示 ([#1461](https://github.com/scriptscat/scriptcat/pull/1461)) (by @cyfung1031)
- 🐛 修正编辑器的 CSS 布局问题 ([#1460](https://github.com/scriptscat/scriptcat/pull/1460)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修复 Edge Android 移动端 popup 适配问题 ([#686](https://github.com/scriptscat/scriptcat/issues/686)) ([#1507](https://github.com/scriptscat/scriptcat/pull/1507)) (by @CodFrm)
- 🐛 修复初始加载时出现白屏背景的问题 ([#1497](https://github.com/scriptscat/scriptcat/issues/1497)) ([#1498](https://github.com/scriptscat/scriptcat/pull/1498)) (by @cyfung1031)
- 🐛 修复缺少站点访问权限时跨域请求异常的问题 ([#1477](https://github.com/scriptscat/scriptcat/pull/1477)) (by @cyfung1031)
- 🐛 修复消息连接（GM API / 端口）未正确清理的问题 ([#1474](https://github.com/scriptscat/scriptcat/pull/1474)) (by @cyfung1031)
- 🐛 修正缺少 search 时 @match template 不匹配的问题 ([#1466](https://github.com/scriptscat/scriptcat/pull/1466)) (by @cyfung1031)
- 🐛 新增 `protoBaseDescs` 修正 Tampermonkey 半沙盒的祖先类继承 ([#1463](https://github.com/scriptscat/scriptcat/pull/1463)) (by @cyfung1031)

### 🔒 安全性改进

- 🔒 修复通过不可信 YAML user-config 键导致的原型链污染漏洞 ([#1494](https://github.com/scriptscat/scriptcat/pull/1494)) (by @qdzsh)

### ♻️ 重构与兼容性

- ♻️ 重构脚本资源更新逻辑（updateResource）与并发控制，并恢复资源缓存兼容性 ([#1193](https://github.com/scriptscat/scriptcat/pull/1193)) (by @cyfung1031)
- ♻️ 使用 JSZipp 替换 jszip 处理 ZIP（备份导入/导出），并移除未使用的 jszip 依赖 ([#1479](https://github.com/scriptscat/scriptcat/pull/1479)) (by @cyfung1031)
- ♻️ 兼容 Firefox MV3 规格 ([#1457](https://github.com/scriptscat/scriptcat/pull/1457), [#1480](https://github.com/scriptscat/scriptcat/pull/1480)) (by @cyfung1031)

### 🌐 国际化

- 🌐 修正多语言术语翻译（重点完善繁体中文）并新增翻译术语规范 ([#1468](https://github.com/scriptscat/scriptcat/pull/1468)) (by @cyfung1031)

<a name="1.4.0-beta.3"></a>

## 1.4.0-beta.3 (2026-05-19)

本次更新延续 beta.2 方向，继续加固云存储同步可靠性（OneDrive/Google Drive/WebDAV 错误处理与上传流程），修复多项 ScriptEditor 与 GM xhr 异常处理问题，并新增 Ctrl+Shift+F 格式化、`@run-at context-menu` 恢复支持。

### 🚀 主要新功能

- ✨ 编辑器支持 Ctrl+Shift+F 格式化 ([#1415](https://github.com/scriptscat/scriptcat/pull/1415)) (by @cyfung1031)
- ✨ 恢复 `@run-at context-menu` 支持 ([#1442](https://github.com/scriptscat/scriptcat/pull/1442)) (by @cyfung1031)

### ⚡️ 性能优化

- ⚡️ 优化 pushValue 处理 ([#1403](https://github.com/scriptscat/scriptcat/pull/1403)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修正云存储同步多项问题：OneDrive 零字节上传、Google Drive/OneDrive 错误规范化、S3 自定义元数据补充 modifiedDate ([#1405](https://github.com/scriptscat/scriptcat/pull/1405)) ([#1406](https://github.com/scriptscat/scriptcat/pull/1406)) ([#1408](https://github.com/scriptscat/scriptcat/pull/1408)) (by @cyfung1031)
- 🐛 WebDAV verify 移除写探针，避免坚果云等根目录不可写服务被误杀 ([#1445](https://github.com/scriptscat/scriptcat/pull/1445)) (by @CodFrm)
- 🐛 修复 GM_xmlhttpRequest msgConn 的 null 处理缺失 ([#1433](https://github.com/scriptscat/scriptcat/pull/1433)) (by @cyfung1031)
- 🐛 修复 GM xhr 不正确处理异常 onloadend 的问题 ([#1412](https://github.com/scriptscat/scriptcat/pull/1412)) (by @cyfung1031)
- 🐛 修复 ScriptEditor 列表动态更新与显示问题 ([#1414](https://github.com/scriptscat/scriptcat/pull/1414)) (by @cyfung1031)
- 🐛 修复 ScriptEditor toolbar 中编辑相关操作的交互问题 ([#1417](https://github.com/scriptscat/scriptcat/pull/1417)) (by @cyfung1031)
- 🐛 修复 chrome.downloads.download 代码及 Mock ([#1410](https://github.com/scriptscat/scriptcat/pull/1410)) (by @cyfung1031)
- 🐛 修正 src/pages/install/App.tsx closeWindow ([#1435](https://github.com/scriptscat/scriptcat/pull/1435)) (by @cyfung1031)
- 🐛 在根布局建立滚轮事件边界，避免内部滚动触发浏览器 swipe 跳页 ([#1431](https://github.com/scriptscat/scriptcat/pull/1431)) (by @cyfung1031)
- 🐛 去重并发的初始 auth 请求 ([#1437](https://github.com/scriptscat/scriptcat/pull/1437)) (by @cyfung1031)
- 🐛 重构 encoding.ts 以整合并改进检测机制 ([#1426](https://github.com/scriptscat/scriptcat/pull/1426)) (by @cyfung1031)
- 🐛 加 Tooltip 否则看不到菜单 ([#1429](https://github.com/scriptscat/scriptcat/pull/1429)) (by @cyfung1031)
- 🐛 overscroll-behavior 修正 ([#1413](https://github.com/scriptscat/scriptcat/pull/1413)) (by @cyfung1031)
- 🐛 不支持更新的脚本不再显示更新按钮 ([#1418](https://github.com/scriptscat/scriptcat/pull/1418)) (by @cyfung1031)
- 🐛 修复 i18n 缺失键引用 ([#1422](https://github.com/scriptscat/scriptcat/pull/1422)) (by @cyfung1031)
- 🐛 sandbox createContext 添加 frames 修复 [#1427](https://github.com/scriptscat/scriptcat/issues/1427) ([#1428](https://github.com/scriptscat/scriptcat/pull/1428)) (by @cyfung1031)
- 🐛 修复 SkillScript 编译时缺失 isContextMenu 字段导致的类型错误 (5fdc8e39) (by @CodFrm)

### ♻️ 重构与兼容性

- ♻️ 安装资源转移至 chrome.storage.local 的 tempStorage，代码部分放在 OPFS/temp_install_codes ([#1318](https://github.com/scriptscat/scriptcat/pull/1318)) (by @cyfung1031)
- ♻️ 修复路径拼接逻辑产生的双斜杠问题 ([#1432](https://github.com/scriptscat/scriptcat/pull/1432)) (by @tomaioo)

### 🌐 国际化

- 🌐 改进日语界面翻译并联动优化其他语言翻译 ([#1419](https://github.com/scriptscat/scriptcat/pull/1419)) ([#1421](https://github.com/scriptscat/scriptcat/pull/1421)) (by @GoodLight999, @cyfung1031)

<a name="1.4.0-beta.2"></a>

## 1.4.0-beta.2 (2026-05-06)

本次更新主要聚焦于**云存储同步可靠性的全面加固**（Dropbox/WebDAV/Google Drive/OneDrive 等多个后端的认证、路径处理与重试逻辑修复）、**Agent 工具调用稳定性改进**，以及大量 UI 与脚本运行时 bug 修复，包括长时间运行的内存泄漏问题。

### ⚡️ 性能优化

- ⚡️ 移除 Baidu filesystem 对全局 DNR 规则的依赖，改为请求级禁用 cookie ([#1377](https://github.com/scriptscat/scriptcat/pull/1377)) (by @cyfung1031)
- ⚡️ 优化获取脚本的多平台搜索引擎选择 ([#1379](https://github.com/scriptscat/scriptcat/pull/1379)) (by @cyfung1031)
- ⚡️ 优化安装页 loadingStatus 改用 monospace 避免跳动 ([#1381](https://github.com/scriptscat/scriptcat/pull/1381)) (by @cyfung1031)
- ⚡️ 强化 Agent prompt 可靠性——结果验证、budget 语义、安全边界 ([#1354](https://github.com/scriptscat/scriptcat/pull/1354)) (by @cyfung1031)

### 🐛 Bug 修复

- 🚑 修复 ScriptCat 长时间运行时可能出现的内存泄漏问题 ([#1401](https://github.com/scriptscat/scriptcat/pull/1401)) (by @cyfung1031)
- 🐛 加固云存储同步可靠性（Dropbox/WebDAV/Google Drive/OneDrive 认证、路径处理与重试逻辑）([#1374](https://github.com/scriptscat/scriptcat/pull/1374)) ([#1375](https://github.com/scriptscat/scriptcat/pull/1375)) ([#1376](https://github.com/scriptscat/scriptcat/pull/1376)) ([#1390](https://github.com/scriptscat/scriptcat/pull/1390)) ([#1391](https://github.com/scriptscat/scriptcat/pull/1391)) ([#1392](https://github.com/scriptscat/scriptcat/pull/1392)) ([#1393](https://github.com/scriptscat/scriptcat/pull/1393)) ([#1394](https://github.com/scriptscat/scriptcat/pull/1394)) ([#1395](https://github.com/scriptscat/scriptcat/pull/1395)) (by @cyfung1031)
- 🐛 新增 extensionEnv 处理 isIncognito (early-start & bgScript)、userAgent 与 run-in (bgScript) ([#1368](https://github.com/scriptscat/scriptcat/pull/1368)) (by @cyfung1031)
- 🐛 修复新手指引按钮显示不全 [#1396](https://github.com/scriptscat/scriptcat/issues/1396) ([#1398](https://github.com/scriptscat/scriptcat/pull/1398)) (by @cyfung1031)
- 🐛 修复脚本管理页面的 tooltip 提示被遮挡问题 [#1386](https://github.com/scriptscat/scriptcat/issues/1386) ([#1387](https://github.com/scriptscat/scriptcat/pull/1387)) (by @Xdy1579883916)
- 🐛 修复 Sidebar 导致卡片模式下的尺寸调整异常 [#1179](https://github.com/scriptscat/scriptcat/issues/1179) ([#1373](https://github.com/scriptscat/scriptcat/pull/1373)) (by @cyfung1031)
- 🐛 修正本机文件拖拉安装时错误设置 origin 问题 ([#1371](https://github.com/scriptscat/scriptcat/pull/1371)) (by @cyfung1031)
- 🐛 修正语言切换信息 ([#1380](https://github.com/scriptscat/scriptcat/pull/1380)) (by @cyfung1031)
- 🐛 优化日志显示 UI ([#1372](https://github.com/scriptscat/scriptcat/pull/1372)) (by @cyfung1031)
- 🐛 解决并发 xhr 的 session rule 数量问题 ([#1353](https://github.com/scriptscat/scriptcat/pull/1353)) (by @cyfung1031)
- 🐛 修复 UserConfigPanel CSS ([#1361](https://github.com/scriptscat/scriptcat/pull/1361)) (by @cyfung1031)
- 🐛 create_context 的空对象改为 Object.create(null) ([#1397](https://github.com/scriptscat/scriptcat/pull/1397)) (by @cyfung1031)
- 🐛 修复 Agent 流式 tool_call arguments 拼接错误及并行工具调用串扰问题 ([#1355](https://github.com/scriptscat/scriptcat/pull/1355)) (by @cyfung1031)
- 🐛 修复 Agent 兼容 reasoning model ([#1357](https://github.com/scriptscat/scriptcat/pull/1357)) (by @cyfung1031)
- 🐛 修复 Agent web_fetch/web_search 合约不一致 (7bbd6d18) (by @CodFrm)
- 🐛 修复 Agent skill script runtime 缺失 extension env (e143c4a7) (by @CodFrm)

### 🔒 安全性改进

- 🔒 修复所有 npm vulnerability ([#1350](https://github.com/scriptscat/scriptcat/pull/1350)) ([#1364](https://github.com/scriptscat/scriptcat/pull/1364)) ([#1365](https://github.com/scriptscat/scriptcat/pull/1365)) (by @cyfung1031)

### 其它

- 🔥 移除 Crowdin 与 ach-UG 伪语言相关内容 ([#1385](https://github.com/scriptscat/scriptcat/pull/1385)) (by @CodFrm)

<a name="1.4.0-beta.1"></a>

## 1.4.0-beta.1 (2026-04-07)

本次更新的最大亮点是**脚本猫 AI Agent**，一个内置的 AI 智能代理系统，可以通过对话调用油猴脚本生态中的工具完成各种任务。此外还新增了 `@unwrap` 标签支持、`window.onurlchange` 事件、编辑器菜单改进，以及大量 Bug 修复。

### 🚀 主要新功能

- 💥 脚本猫 AI Agent — AI 驱动的智能代理系统，支持对话式交互、工具调用、Skill 系统、MCP 协议等 ([#1324](https://github.com/scriptscat/scriptcat/pull/1324)) (by @CodFrm)
- ✨ 支持 `@unwrap` 元数据标签 ([#1213](https://github.com/scriptscat/scriptcat/pull/1213)) (by @cyfung1031)
- ✨ 以 Navigation API 实现 TM 的 `window.onurlchange` ([#1315](https://github.com/scriptscat/scriptcat/pull/1315)) (by @cyfung1031)

### 🧑‍💻 编辑器

- ✨ 编辑器添加编辑菜单（查找、替换、撤销等）([#1303](https://github.com/scriptscat/scriptcat/pull/1303)) (by @CodFrm)
- 🐛 修正 Ctrl-F / Ctrl-H 快捷键 ([#1312](https://github.com/scriptscat/scriptcat/pull/1312)) (by @cyfung1031)
- 🐛 修复 ESLint 修复功能失效的问题 [#1079](https://github.com/scriptscat/scriptcat/issues/1079) ([#1184](https://github.com/scriptscat/scriptcat/pull/1184)) (by @cyfung1031)
- 🐛 正确显示格式化错误 ([#1310](https://github.com/scriptscat/scriptcat/pull/1310)) (by @cyfung1031)
- 🐛 修复代码编辑框提示问题 ([#1301](https://github.com/scriptscat/scriptcat/pull/1301)) (by @cyfung1031)

### ✨ 功能改进

- ✨ 获取脚本支持多平台搜索引擎选择 ([#1295](https://github.com/scriptscat/scriptcat/pull/1295)) (by @CodFrm)
- ✨ 新增更多图标服务供应商 ([#1333](https://github.com/scriptscat/scriptcat/pull/1333)) (by @cyfung1031)
- ✨ 脚本列表最后更新列添加检查更新图标 ([#1304](https://github.com/scriptscat/scriptcat/pull/1304)) (by @CodFrm)
- ✨ 优化编辑冲突与脚本名称冲突处理 ([#1223](https://github.com/scriptscat/scriptcat/pull/1223)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修复 cron 表达式错误导致整个页面崩溃 ([#1327](https://github.com/scriptscat/scriptcat/pull/1327)) (by @cyfung1031)
- 🐛 修复安装脚本触发 Error 406 的问题 ([#1306](https://github.com/scriptscat/scriptcat/pull/1306)) (by @cyfung1031)
- 🐛 修复 WebDAV cookies 认证冲突及 authType 支持 ([#1308](https://github.com/scriptscat/scriptcat/pull/1308)) (by @CodFrm)
- 🐛 设备相关配置改用 chrome.storage.local，避免跨设备同步 ([#1309](https://github.com/scriptscat/scriptcat/pull/1309)) (by @CodFrm)
- 🐛 修正订阅脚本的静默更新与 connect 权限逻辑 ([#1201](https://github.com/scriptscat/scriptcat/pull/1201)) (by @cyfung1031)
- 🐛 修复批次检查脚本时单个超时导致全部失败 ([#1265](https://github.com/scriptscat/scriptcat/pull/1265)) (by @cyfung1031)
- 🐛 修复运行日志页面查询按钮不刷新时间 ([#1294](https://github.com/scriptscat/scriptcat/pull/1294)) (by @CodFrm)
- 🐛 修复运行日志页面日期选择弹出框被裁剪 ([#1292](https://github.com/scriptscat/scriptcat/pull/1292)) (by @cyfung1031)
- 🐛 修复未绑定网盘时仍显示解绑按钮 ([#1291](https://github.com/scriptscat/scriptcat/pull/1291)) (by @CodFrm)
- 🐛 修复 ScriptEditor 脚本列表亮色显示问题 ([#1288](https://github.com/scriptscat/scriptcat/pull/1288)) (by @CodFrm)
- 🐛 修复弹出框被遮挡的问题 ([#1290](https://github.com/scriptscat/scriptcat/pull/1290)) (by @cyfung1031)

## 1.4.0-beta (2026-03-13)

### 🐛 Bug 修复

- 🚑 修复其他扩展注入 chrome.runtime 导致环境误判的问题 [#1280](https://github.com/scriptscat/scriptcat/issues/1280) ([#1281](https://github.com/scriptscat/scriptcat/pull/1281)) (by @CodFrm)
- 🐛 修复和优化 ScriptEditor 问题 ([#1258](https://github.com/scriptscat/scriptcat/pull/1258)) (by @cyfung1031)
- 🐛 修复与隐身窗口检查权限冲突导致反复重启的问题 (6c308f60) (by @CodFrm)
- 🐛 修复 confirm 页面问题 ([#1275](https://github.com/scriptscat/scriptcat/pull/1275)) (by @cyfung1031)
- 🐛 修复 include *?* 表达式处理问题 [#1271](https://github.com/scriptscat/scriptcat/issues/1271) ([#1272](https://github.com/scriptscat/scriptcat/pull/1272)) (by @CodFrm)
- 🐛 修复 脚本设置-授权管理 控制无效的问题 ([#1267](https://github.com/scriptscat/scriptcat/pull/1267)) (by @CodFrm)

### 🔒 安全性改进

- 🔒 使用 DOMPurify 清理公告通知 HTML 内容 ([#1274](https://github.com/scriptscat/scriptcat/pull/1274)) (by @CodFrm)

### 其它

- ✅ 添加 Playwright E2E 测试及 GM API 功能测试 ([#1283](https://github.com/scriptscat/scriptcat/pull/1283)) (by @CodFrm)
- 📄 docs: update Chrome Web Store URLs to new domain ([#1279](https://github.com/scriptscat/scriptcat/pull/1279)) (by @theluckystrike)

## 1.3.0-beta.4 (2026-02-19)

### Added

- ✨ 增加 Amazon S3 存储 [#1146](https://github.com/scriptscat/scriptcat/issues/1146) ([#1189](https://github.com/scriptscat/scriptcat/pull/1189)) (by @CodFrm)
- ✨ 调整隐藏编辑框侧边栏位置 [#1185](https://github.com/scriptscat/scriptcat/issues/1185) ([#1254](https://github.com/scriptscat/scriptcat/pull/1254)) (by @CodFrm)
- ✨ 接受 `@version` 没有或空值 ([#1216](https://github.com/scriptscat/scriptcat/pull/1216)) (by @cyfung1031)

### Fixed

- 🐛 修复点击更新日志通知打开页面问题 ([#1266](https://github.com/scriptscat/scriptcat/pull/1266)) (by @CodFrm)
- 🐛 修正反注册未正确执行 ([#1231](https://github.com/scriptscat/scriptcat/pull/1231)) (by @cyfung1031)
- 🐛 修复 GM_addElement 问题，将操作放到content环境 ([#1233](https://github.com/scriptscat/scriptcat/pull/1233)) (by @cyfung1031)
- 🐛 重构 DraggableEntry 、修正卡片高度对齐 ([#1245](https://github.com/scriptscat/scriptcat/pull/1245)) (by @cyfung1031)
- 🐛 修复弹出内容跟随屏幕滚动的问题 ([#1263](https://github.com/scriptscat/scriptcat/pull/1263)) (by @cyfung1031) ([#1259](https://github.com/scriptscat/scriptcat/pull/1259)) (by @cyfung1031)
- 🐛 修复内存泄漏和对象属性暴露及 TTP XML 解析退回至 null ([#1242](https://github.com/scriptscat/scriptcat/pull/1242)) (by @cyfung1031) ([#1260](https://github.com/scriptscat/scriptcat/pull/1260)) (by @cyfung1031)
- 🐛 `GM_download` 添加 `conflictAction` 参数 ([#1250](https://github.com/scriptscat/scriptcat/pull/1250)) (by @cyfung1031)
- 🐛 修复安装链接解析失败问题 [#1235](https://github.com/scriptscat/scriptcat/issues/1235) ([#1238](https://github.com/scriptscat/scriptcat/pull/1238)) (by @cyfung1031)
- 🐛 修复拖拽组件导致触发focusin / focusout卡顿 [#1224](https://github.com/scriptscat/scriptcat/issues/1224) ([#1243](https://github.com/scriptscat/scriptcat/pull/1243)) (by @CodFrm)
- 🐛 修正 installScript 中 subscribeUrl origin 关连部份 ([#1218](https://github.com/scriptscat/scriptcat/pull/1218)) (by @cyfung1031)
- 🐛 修正 ScriptCard 动画问题 ([#1234](https://github.com/scriptscat/scriptcat/pull/1234)) (by @cyfung1031)
- 🐛 修正 hide_sidebar 至 show_main_sidebar & hide_main_sidebar ([#1225](https://github.com/scriptscat/scriptcat/pull/1225)) (by @cyfung1031)
- 🐛 修复外部扩展API无效的问题 ([#1217](https://github.com/scriptscat/scriptcat/pull/1217)) (by @cyfung1031)
- 🐛 修复download文件名不支持文件夹的问题 ([#1203](https://github.com/scriptscat/scriptcat/pull/1203)) (by @cyfung1031)

<a name="1.3.0-beta.3"></a>

## 1.3.0-beta.3 (2026-02-07)

### Added

- ✨ Cron 相关修改：bug 修补、i18n、once 表达式增强、升级 cron 库 ([#1126](https://github.com/scriptscat/scriptcat/issues/1126)) (by @cyfung1031)

### Changed

- ♻️ 重构通讯机制：采用 storage.local 广播 + 符合 Firefox MV3 scripting 规范 + 不可追踪的动态同步 MessageFlag ([#1067](https://github.com/scriptscat/scriptcat/issues/1067)) (by @cyfung1031)
- ⚡ 增强文本解码 ([#1166](https://github.com/scriptscat/scriptcat/issues/1166)) (by @cyfung1031)
- 🎨 代码调整（少量） - `isContent` 变量位置 ([#1171](https://github.com/scriptscat/scriptcat/issues/1171)) (by @cyfung1031)
- 🎨 代码调整 - Value相关的 类 & 变量名 ([#1175](https://github.com/scriptscat/scriptcat/issues/1175)) (by @cyfung1031)
- 🎨 代码调整（少量） - ScriptClient ([#1172](https://github.com/scriptscat/scriptcat/issues/1172)) (by @cyfung1031)
- 🎨 (TypeScript) 自订类名修订：File -> FileInfo ([#1174](https://github.com/scriptscat/scriptcat/issues/1174)) (by @cyfung1031)
- ⬆️ 修正 rspack 的 `jsc.target` 为 es2020 / 提升内核版本 ([#1186](https://github.com/scriptscat/scriptcat/issues/1186)) (by @cyfung1031)
- 🎨 改善charset detection ([#1140](https://github.com/scriptscat/scriptcat/issues/1140)) (by @cyfung1031)
- 🎨 弹出的更新窗口显示时间 ([#1155](https://github.com/scriptscat/scriptcat/issues/1155)) (by @cyfung1031)
- 🎨 locales.ts 小修正 ([#1154](https://github.com/scriptscat/scriptcat/issues/1154)) (by @cyfung1031)
- 🎨 logo 128x128 ([#1176](https://github.com/scriptscat/scriptcat/issues/1176)) (by @cyfung1031)
- 🎨 图像处理 ([#1177](https://github.com/scriptscat/scriptcat/issues/1177)) (by @cyfung1031)

### Removed

- 🔥 package.json: drop pako ([#1188](https://github.com/scriptscat/scriptcat/issues/1188)) (by @cyfung1031)

### Fixed

- 🐛 处理脚本编码问题 [#1115](https://github.com/scriptscat/scriptcat/issues/1115) ([#1138](https://github.com/scriptscat/scriptcat/issues/1138)) (by @CodFrm)
- 🐛 处理value引用问题 [#1141](https://github.com/scriptscat/scriptcat/issues/1141) ([#1147](https://github.com/scriptscat/scriptcat/issues/1147)) (by @CodFrm)
- 🐛 修复按钮渲染逻辑，避免 render 阶段副作用，改用 JSX 条件渲染 & named slot ([#1153](https://github.com/scriptscat/scriptcat/issues/1153)) (by @cyfung1031)
- 🐛 修正 FileSystemObserver 未能持续监听问题 ([#1160](https://github.com/scriptscat/scriptcat/issues/1160)) (by @cyfung1031)
- 🐛 fix: 兼容 TM `@match www.website.com/*` ([#1165](https://github.com/scriptscat/scriptcat/issues/1165)) (by @cyfung1031)
- 🐛 修正 GM API 异步声明，正确返回 Promise ([#1169](https://github.com/scriptscat/scriptcat/issues/1169)) (by @cyfung1031)
- 🐛 修正 content.js 没有 UserAgentData 问题 ([#1183](https://github.com/scriptscat/scriptcat/issues/1183)) (by @cyfung1031)
- 🐛 修复 1.2.5 structuredClone错误 ([#1192](https://github.com/scriptscat/scriptcat/issues/1192)) (by @cyfung1031)
- 🐛 修改 9343f2d6e49aec78d208d0e3ba3d96ec2a4d5a1c ([#1195](https://github.com/scriptscat/scriptcat/issues/1195)) (by @cyfung1031)
- 🐛 修复grant问题 ([#1199](https://github.com/scriptscat/scriptcat/issues/1199)) (by @CodFrm)

<a name="1.3.0-beta.2"></a>

## 1.3.0-beta.2 (2026-01-07)

### Added

- ✨ 同步删除默认设置为关闭 ([#958](https://github.com/scriptscat/scriptcat/issues/958)) [[9c4c7dc](https://github.com/scriptscat/scriptcat/commit/9c4c7dc411357746db43a306d97ac41a71f2b49c)] (by @cyfung1031)
- ✨ 编辑器支持 GM.\* ([#1129](https://github.com/scriptscat/scriptcat/issues/1129)) [[bea0192](https://github.com/scriptscat/scriptcat/commit/bea0192c6cc50eff2ed4e1cc5dcc25f36bbe10e7)] (by @cyfung1031)

### Changed

- ♻️ 优化更新日志页面打开逻辑 [#1110](https://github.com/scriptscat/scriptcat/issues/1110) [[d3ffedc](https://github.com/scriptscat/scriptcat/commit/d3ffedcffe752ca548f87f1640072fcd871b8604)] (by @CodFrm)

### Fixed

- 🐛 修复脚本图标展示 [#1052](https://github.com/scriptscat/scriptcat/issues/1052) ([#1104](https://github.com/scriptscat/scriptcat/issues/1104)) [[2e5c601](https://github.com/scriptscat/scriptcat/commit/2e5c601274fa27aa67b49ef9d352e3a1c3975979)] (by @CodFrm)
- 🐛 scriptcat.d.tpl &amp; type 修正 ([#1130](https://github.com/scriptscat/scriptcat/issues/1130)) [[dd22ef5](https://github.com/scriptscat/scriptcat/commit/dd22ef544684d69e24a7aae098cb05cbab03daa8)] (by @cyfung1031)
- 🐛 修复云同步问题 ([#1133](https://github.com/scriptscat/scriptcat/issues/1133)) [[a9383d2](https://github.com/scriptscat/scriptcat/commit/a9383d2012eb3953dc33c8886ce3891f404fa100)] (by @CodFrm)
- 🐛 修正 &#x60;GM_addElement(&quot;tagName&quot;)&#x60; 错误 ([#1120](https://github.com/scriptscat/scriptcat/issues/1120)) [[ad19de5](https://github.com/scriptscat/scriptcat/commit/ad19de5c1793c8c079bedbf1b11c7c2ae27a469e)] (by @cyfung1031)
- 🐛 删除清理逻辑和优化 checkuserscript 逻辑 ([#1113](https://github.com/scriptscat/scriptcat/issues/1113)) [[e635911](https://github.com/scriptscat/scriptcat/commit/e635911a3c11c3cb8acd1cfd507cb777e5ee7236)] (by @CodFrm)

### Miscellaneous

- 🏷️ typescript 修订 ([#1127](https://github.com/scriptscat/scriptcat/issues/1127)) [[b455724](https://github.com/scriptscat/scriptcat/commit/b4557244191018c18d5ce8ea8e8627bcfb7f7cdd)] (by @cyfung1031)
- 📝 example 注释补充 ([#1131](https://github.com/scriptscat/scriptcat/issues/1131)) [[292549e](https://github.com/scriptscat/scriptcat/commit/292549ed0f65952fe9f269aace23eefc7d6a3a0f)] (by @cyfung1031)

<a name="1.3.0-beta.1"></a>

## 1.3.0-beta.1 (2025-12-21)

### Added

- ✨ 优化 Monaco Editor 设定，加 &#x60;/_ global xxx _/&#x60; 修正 ([#1012](https://github.com/scriptscat/scriptcat/issues/1012)) [[b1a738d](https://github.com/scriptscat/scriptcat/commit/b1a738d98b5e852993da322d56dbfa20f68d20e3)] (by @cyfung1031)

### Changed

- ⚡ 把 metadata 从 chrome.storage.session 抽走 ([#1027](https://github.com/scriptscat/scriptcat/issues/1027)) [[9c81f6c](https://github.com/scriptscat/scriptcat/commit/9c81f6c42b087411669adef35df30714e184ee93)] (by @cyfung1031)
- ⚡ 优化下一次运行时间显示 [#1093](https://github.com/scriptscat/scriptcat/issues/1093) [[324ce51](https://github.com/scriptscat/scriptcat/commit/324ce515c84699ca8d3bf1ee447fc6ef0656ae0d)] (by @CodFrm)

### Fixed

- 🐛 处理 popup 页面的问题 ([#1100](https://github.com/scriptscat/scriptcat/issues/1100)) [[9c67e4a](https://github.com/scriptscat/scriptcat/commit/9c67e4a2c609f8c1ef82c493bb1ed68da6396d2e)] (by @CodFrm)
- 🐛 处理 type error [[f5a73c7](https://github.com/scriptscat/scriptcat/commit/f5a73c71649621e519b32630ae7717411732aa50)] (by @CodFrm)
- 🐛 修正英文 log 含有全形字符问题 ([#1095](https://github.com/scriptscat/scriptcat/issues/1095)) [[a68b100](https://github.com/scriptscat/scriptcat/commit/a68b10048cb01a8e26fe8d524102bfb23ed4e179)] (by @cyfung1031)
- 🐛 UnoCSS 加 prefix 解决 CSS 冲突、CSS 布局修正 ([#1013](https://github.com/scriptscat/scriptcat/issues/1013)) [[723e64c](https://github.com/scriptscat/scriptcat/commit/723e64cc0c23763dfed322e907c0a960c4f9060e)] (by @cyfung1031)
- 🐛 early 脚本处理 url 匹配问题 ([#1096](https://github.com/scriptscat/scriptcat/issues/1096)) [[a77effb](https://github.com/scriptscat/scriptcat/commit/a77effbab5ab4d1752065ef943d9c050ff99c066)] (by @CodFrm)
- 🐛 处理弹出的更新窗口显示时间过短的问题 ([#1088](https://github.com/scriptscat/scriptcat/issues/1088)) [[b2b2d5c](https://github.com/scriptscat/scriptcat/commit/b2b2d5c41ff70ee5430f7d8d156f480ac8fc3a1a)] (by @cyfung1031)
- 🐛 修复开启用户脚本通知显示异常的问题 ([#1086](https://github.com/scriptscat/scriptcat/issues/1086)) ([959c4db](https://github.com/scriptscat/scriptcat/commit/959c4dbed92f7bfe22a2f8ebb775c4189b5ff076))
- 🐛 responseHeaders: &#x60;TM 兼容: \r\n&#x60; ([#1085](https://github.com/scriptscat/scriptcat/issues/1085)) [[15232c8](https://github.com/scriptscat/scriptcat/commit/15232c8543d93abfdafa1353d39d8a15d1dc385f)] (by @cyfung1031)
- 🐛 处理 GM xhr 的问题 ([#1082](https://github.com/scriptscat/scriptcat/issues/1082)) [[3d987c3](https://github.com/scriptscat/scriptcat/commit/3d987c300242a3c765146359c35ecd6d998f792c)] (by @CodFrm)
- 🐛 修复后台频繁同步的问题 ([#1076](https://github.com/scriptscat/scriptcat/issues/1076)) [[45dc39b](https://github.com/scriptscat/scriptcat/commit/45dc39baa0f3326cf12e97312ab632dc46ba40f2)] (by @CodFrm)
- 🐛 修复特殊 tab 处理的问题 [#1066](https://github.com/scriptscat/scriptcat/issues/1066) ([50904fb](https://github.com/scriptscat/scriptcat/commit/50904fb46efdea10fd57677bc2d28c770b47e861))
- 🐛 修复无 匹配规则 的脚本处理 [#1071](https://github.com/scriptscat/scriptcat/issues/1071) ([560cdc0](https://github.com/scriptscat/scriptcat/commit/560cdc01fc0fc27fb7d0e3b877c63ba431206668))
- 🐛 修复 ci 打包删除掉了 background 的可选权限问题 [[1f002f0](https://github.com/scriptscat/scriptcat/commit/1f002f0edf9892f023ae93b8522ff7c5e4a96559)] (by @CodFrm)
- 🐛 fix ignore discarded tab ([#1058](https://github.com/scriptscat/scriptcat/issues/1058)) [[6165bf4](https://github.com/scriptscat/scriptcat/commit/6165bf48eb1d53ede0561c85c30135446c2ff882)] (by @cyfung1031)

<a name="1.3.0-beta"></a>

## 1.3.0-beta (2025-12-13)

### Added

- ✨ 新的脚本安装逻辑 ([#842](https://github.com/scriptscat/scriptcat/issues/842)) ([80d342e](https://github.com/scriptscat/scriptcat/commit/80d342e80c9c1b36f88b7dcd4c65c663bb1d9185))
- ✨ monaco editor hints 多国语言化 及 增加 &#x60;@require-css&#x60; 提示 ([#960](https://github.com/scriptscat/scriptcat/issues/960)) [[51a6f94](https://github.com/scriptscat/scriptcat/commit/51a6f94be3a430691f73057eae61a3814560a5b3)] (by @cyfung1031)
- ✨ &#x60;@grant&#x60; 冲突校验 修正，增加 meta 重复声明 错误提示 ([#902](https://github.com/scriptscat/scriptcat/issues/902)) [[8fbd0f1](https://github.com/scriptscat/scriptcat/commit/8fbd0f1041f5c5dcdb5a515348a5f54934acfdc7)] (by @cyfung1031)
- ✨ 范本预设&#x60;@noframes&#x60; 避免新手踩坑 ([#900](https://github.com/scriptscat/scriptcat/issues/900)) [[c9d5840](https://github.com/scriptscat/scriptcat/commit/c9d584066ff2395112b9a930aaa409cda764a5e6)] (by @cyfung1031)
- ✨ 防止脚本安装链结因脚本名字改了而被误判为安装而非更新 ([#824](https://github.com/scriptscat/scriptcat/issues/824)) [[5c7a5dd](https://github.com/scriptscat/scriptcat/commit/5c7a5ddc81e3bd1dd0a71cc80460a5239178c1de)] (by @cyfung1031)
- ✨ 脚本运行时期选项 ([#895](https://github.com/scriptscat/scriptcat/issues/895)) [[b0ea187](https://github.com/scriptscat/scriptcat/commit/b0ea187c2e6d69b60c981aa9b4d068fed7c2c2a2)] (by @CodFrm)
- ✨ 关闭脚本功能后展示灰色图标 [#897](https://github.com/scriptscat/scriptcat/issues/897) ([3e406dc](https://github.com/scriptscat/scriptcat/commit/3e406dc4562adf7d7f3b79b52623b87e87ef1ad3))
- ✨ 优化菜单展开项为 0 时的交互逻辑 [#868](https://github.com/scriptscat/scriptcat/issues/868) ([da24ac2](https://github.com/scriptscat/scriptcat/commit/da24ac234f0eeae0159dce6c2b346d06fb72eaa5))

### Changed

- 🎨 修正 Typography 引用 ([#984](https://github.com/scriptscat/scriptcat/issues/984)) [[a70400c](https://github.com/scriptscat/scriptcat/commit/a70400cdca8a5b64cffaca85017513d4e5e7171c)] (by @cyfung1031)
- ♻️ 兼容 FF: GM_setClipboard ([#928](https://github.com/scriptscat/scriptcat/issues/928)) [[d1a5cb1](https://github.com/scriptscat/scriptcat/commit/d1a5cb19dc4e05fac838258d15c48cc6f876d416)] (by @cyfung1031)
- ♻️ userScripts / scripting API 调整，增强兼容性 ( 重做 [#704](https://github.com/scriptscat/scriptcat/issues/704) ) ([#925](https://github.com/scriptscat/scriptcat/issues/925)) [[43bc40f](https://github.com/scriptscat/scriptcat/commit/43bc40ff5da5ef36a13564504293f1928138cf12)] (by @cyfung1031)
- ♻️ 重构优化脚本图标加载 ([#893](https://github.com/scriptscat/scriptcat/issues/893)) ([ab36c86](https://github.com/scriptscat/scriptcat/commit/ab36c86b5d031b88e71fbf9151696a42acba86fa))
- ⚡ parseMetadata 代码优化 ([#903](https://github.com/scriptscat/scriptcat/issues/903)) [[0efc648](https://github.com/scriptscat/scriptcat/commit/0efc648257f74591765869dedee5d98f8a1dc610)] (by @cyfung1031)
- 🎨 扩展图标显示数字默认修改为脚本数量 [#989](https://github.com/scriptscat/scriptcat/issues/989) [[70f67b6](https://github.com/scriptscat/scriptcat/commit/70f67b6bd8cf803d7a18bf26fdccdfa6f8a92893)] (by @CodFrm)
- 🐛 导入 &amp; 导出 - 修正不依照脚本最后修改日期时间问题 ([#951](https://github.com/scriptscat/scriptcat/issues/951)) ([6e7272f](https://github.com/scriptscat/scriptcat/commit/6e7272f52ef2d49d9fceb3e30babfee1cbd72e75))
- 🎨 sourceURL 调整，方便 debug ([#987](https://github.com/scriptscat/scriptcat/issues/987)) [[ed741e7](https://github.com/scriptscat/scriptcat/commit/ed741e7d0188fa5e95eae87bcd3a28e82ee008e1)] (by @cyfung1031)
- ⬆️ package 版本更新 ([#922](https://github.com/scriptscat/scriptcat/issues/922)) [[9b1df8d](https://github.com/scriptscat/scriptcat/commit/9b1df8dda794e5e95ecc12cef37ed66712ae561e)] (by @cyfung1031)
- ⚡ Values 相关共通调整 ([#949](https://github.com/scriptscat/scriptcat/issues/949)) [[b258fb2](https://github.com/scriptscat/scriptcat/commit/b258fb2c73d790f7f277a9a31d07e2931a7d680d)] (by @cyfung1031)
- ⚡ URL.createObjectURL 共通化、兼容 FF ([#929](https://github.com/scriptscat/scriptcat/issues/929)) [[54ad4de](https://github.com/scriptscat/scriptcat/commit/54ad4de48b81170b90283fb6ce3b4d6e7c908cdf)] (by @cyfung1031)
- ⚡ 把 icon 根据 url 而储存，避免多个脚本储存同一 icon 造成浪费 ([#909](https://github.com/scriptscat/scriptcat/issues/909)) [[c6e8efb](https://github.com/scriptscat/scriptcat/commit/c6e8efbe8d11719034a9aaa3fd871519025671ff)] (by @cyfung1031)
- ♻️ 调整 updateIcon 代码 ([#908](https://github.com/scriptscat/scriptcat/issues/908)) [[642e3b9](https://github.com/scriptscat/scriptcat/commit/642e3b9e57f01f2b008990cc7cb1461f5dccd256)] (by @cyfung1031)

### Fixed

- 🐛 选择不定期检查脚本更新时，清除现有 Alarm ([#996](https://github.com/scriptscat/scriptcat/issues/996)) [[8bb9a2d](https://github.com/scriptscat/scriptcat/commit/8bb9a2d5741acb7d547e743c7bef8a2139f1401a)] (by @cyfung1031)
- 🐛 移除备份页面顶部多余空白 ([#995](https://github.com/scriptscat/scriptcat/issues/995)) ([9c149ce](https://github.com/scriptscat/scriptcat/commit/9c149ce5999b7a70375a41c6604c8e8dbd19e9df))
- ✨ 不依赖外部网站访问进行安装 ＋ 安装页版面调整 ([#842](https://github.com/scriptscat/scriptcat/issues/842)) ([80d342e](https://github.com/scriptscat/scriptcat/commit/80d342e80c9c1b36f88b7dcd4c65c663bb1d9185))
- 🐛 UnoCSS 加 prefix 解决 CSS 冲突、CSS 布局修正 ([#1013](https://github.com/scriptscat/scriptcat/issues/1013)) [[723e64c](https://github.com/scriptscat/scriptcat/commit/723e64cc0c23763dfed322e907c0a960c4f9060e)] (by @cyfung1031)
- 🐛 优化 systemconfig 和修复 SW 中的 i18n 问题 ([#976](https://github.com/scriptscat/scriptcat/issues/976)) [[c50fcf7](https://github.com/scriptscat/scriptcat/commit/c50fcf7770df633462c2f25f8cf22d302002ec57)] (by @CodFrm)
- 🐛 修复类型错误 ([#975](https://github.com/scriptscat/scriptcat/issues/975)) [[7d85856](https://github.com/scriptscat/scriptcat/commit/7d8585687c71cde1c2793d742abb7c22d9d358f0)] (by @cyfung1031)

<a name="1.2.0-beta.5"></a>

## 1.2.0-beta.5 (2025-11-17)

### Added

- ✨ 在 popup 显示脚本数量 ([#973](https://github.com/scriptscat/scriptcat/issues/973)) [[1134586](https://github.com/scriptscat/scriptcat/commit/1134586ff040ffc0cdddd3538e9ec493950c948a)] (by @cyfung1031)

### Changed

- ⚡ 处理 `check_script_update_cycle` ([#906](https://github.com/scriptscat/scriptcat/issues/906)) [[760562f](https://github.com/scriptscat/scriptcat/commit/760562f92ad64bc538873b2ca61dfafe067c3f6e)] (by @cyfung1031)
- ♻️ 整理 inject & content，修改 pageLoad 资讯量传递 ([#952](https://github.com/scriptscat/scriptcat/issues/952)) [[0554159](https://github.com/scriptscat/scriptcat/commit/0554159c105606192d48e1153194e09314d43bc9)] (by @cyfung1031)
- 🎨 简化 messageFlag，按照事件名称命名标准修订 ([#926](https://github.com/scriptscat/scriptcat/issues/926)) [[d725d85](https://github.com/scriptscat/scriptcat/commit/d725d85a2f4917c08f6d3daa035a45fd15d12451)] (by @cyfung1031)
- ♻️ 重构 `GM_xmlhttpRequest` 及相关代码 ([#901](https://github.com/scriptscat/scriptcat/issues/901)) [[fabd2e9](https://github.com/scriptscat/scriptcat/commit/fabd2e944235b460bc73df346b79d23ee4540af7)] (by @cyfung1031)
- ⚡ toCamelCase 微优化 ([#930](https://github.com/scriptscat/scriptcat/issues/930)) [[88d8bdf](https://github.com/scriptscat/scriptcat/commit/88d8bdfc726f1a4ed63bd3cf81ebad88426273e8)] (by @cyfung1031)

### Fixed

- 🐛 修正被破坏的沙盒 Fix Corrupted Sandbox ([#966](https://github.com/scriptscat/scriptcat/issues/966)) [[dd80386](https://github.com/scriptscat/scriptcat/commit/dd8038666481d1319dd0f8ab80f79f1b13c1730d)] (by @cyfung1031)
- 🐛 修正 setInvalidContext 里 `valueChangeListener.clear` 未定义 ([#970](https://github.com/scriptscat/scriptcat/issues/970)) [[2a399e9](https://github.com/scriptscat/scriptcat/commit/2a399e96a1e848f2f569566479b48dcee280f543)] (by @cyfung1031)
- 🐛 调整 `@connect` 逻辑 ([#969](https://github.com/scriptscat/scriptcat/issues/969)) [[67914d2](https://github.com/scriptscat/scriptcat/commit/67914d2b7d57fa9c69706ae57ee5d3400c2643f9)] (by @cyfung1031)
- 🐛 修复 service worker 的 i18n 处理 [#956](https://github.com/scriptscat/scriptcat/issues/956) [[843e618](https://github.com/scriptscat/scriptcat/commit/843e618daf13ec659cc16759c5de13dacf23c534)] (by @CodFrm)
- 🐛 修正 deleteValue/deleteValues 无法执行问题 ([#943](https://github.com/scriptscat/scriptcat/issues/943)) [[3d92bfb](https://github.com/scriptscat/scriptcat/commit/3d92bfb4a0334ffd2c279a1e6d33e98eed0a1a81)] (by @cyfung1031)
- 🐛 修复 无法通过 GitHub 链接安装脚本 ([#877](https://github.com/scriptscat/scriptcat/issues/877)) [[b9268e7](https://github.com/scriptscat/scriptcat/commit/b9268e7207081fcaa4591c9e1385f98446ade04a)] (by @cyfung1031)
- 🐛 修正 `@connect *` 没有生效 ([#967](https://github.com/scriptscat/scriptcat/issues/967)) [[6bcb93c](https://github.com/scriptscat/scriptcat/commit/6bcb93c20c9690a2ce4f50d0978948e20ba407b8)] (by @cyfung1031)

### Miscellaneous

- 🌐 翻译更新 ([#920](https://github.com/scriptscat/scriptcat/issues/920)) [[ede013b](https://github.com/scriptscat/scriptcat/commit/ede013b8e725ddefa626e3e432cbaee756535259)] (by @cyfung1031)

<a name="1.2.0-beta.4"></a>

## 1.2.0-beta.4 (2025-11-07)

### Added

- ✨ 卡片模式引导 ([#894](https://github.com/scriptscat/scriptcat/issues/894)) [[0627a0f](https://github.com/scriptscat/scriptcat/commit/0627a0faacf3a41645e985ec6f6960568427d5a4)] (by @CodFrm)

### Changed

- ♻️ 重构 EarlyStart 实现 ([#882](https://github.com/scriptscat/scriptcat/issues/882)) [[cca11e0](https://github.com/scriptscat/scriptcat/commit/cca11e02b98de285423b04ec0d95eab995cee378)] (by @CodFrm)
- 💄 微调卡片视图布局 ([#872](https://github.com/scriptscat/scriptcat/issues/872)) [[5aa21b8](https://github.com/scriptscat/scriptcat/commit/5aa21b88bf423d5d03f7df70b654249bac4b7a88)] (by @Coxxs)

### Fixed

- 🐛 修复两个`@require` 没分号导致的错误 [#917](https://github.com/scriptscat/scriptcat/issues/917) ([#921](https://github.com/scriptscat/scriptcat/issues/921)) [[2769a24](https://github.com/scriptscat/scriptcat/commit/2769a24e129da79926816886fe42bbc4d9a97875)] (by @cyfung1031)
- 🐛 修复 Check Update 页面异常问题 ([#912](https://github.com/scriptscat/scriptcat/issues/912)) [[12272e1](https://github.com/scriptscat/scriptcat/commit/12272e1ad4787cc6768f2f157d272faff5782f37)] (by @cyfung1031)
- 🐛 修复后台脚本中无法使用 GM_openInTab 的问题 [#873](https://github.com/scriptscat/scriptcat/issues/873) [[a526664](https://github.com/scriptscat/scriptcat/commit/a52666429710e150d81cac33af5511401b697355)] (by @CodFrm)
- 🐛 修复表格列表 loading 状态问题 [#874](https://github.com/scriptscat/scriptcat/issues/874) [[0b53cb0](https://github.com/scriptscat/scriptcat/commit/0b53cb07cf1ca1d3e42b15fd9c104c83031502d5)] (by @CodFrm)
- 🐛 修复 &#x60;@early-start&#x60; 移除后脚本注入失败的问题 ([#871](https://github.com/scriptscat/scriptcat/issues/871)) [[426e878](https://github.com/scriptscat/scriptcat/commit/426e8788d9b934ee96cf5ec22b432a08681a9e8c)] (by @cyfung1031)

<a name="1.2.0-beta.3"></a>

## 1.2.0-beta.3 (2025-10-23)

### Added

- ✨ 卡片视图 ([#860](https://github.com/scriptscat/scriptcat/issues/860)) [[c9f2350](https://github.com/scriptscat/scriptcat/commit/c9f23509648a41b06f82e79da2bc1fc05a783e06)] (by @CodFrm)

### Changed

- ♻️ null 代码调整 ([#852](https://github.com/scriptscat/scriptcat/issues/852)) [[fa1031d](https://github.com/scriptscat/scriptcat/commit/fa1031df9c3e8bc2550f429e7cf8d1c3869a1ea3)] (by @cyfung1031)
- ♻️ GMApiRequest 代码调整，GM_log 代码修正，@connect 判断修正 ([#849](https://github.com/scriptscat/scriptcat/issues/849)) [[ee4a8b2](https://github.com/scriptscat/scriptcat/commit/ee4a8b28715fb48fa627f5231c8dc30e55c006ed)] (by @cyfung1031)

### Removed

- 🔥 弃掉 `GM_openInTab({ useOpen: true })` ([#867](https://github.com/scriptscat/scriptcat/issues/867)) [[aa61335](https://github.com/scriptscat/scriptcat/commit/aa613354c7b7c84d461000ed0362cf9916c8aa39)] (by @cyfung1031)

### Fixed

- 🐛 checkUserScriptsAvailable 兼容 Vivaldi ([#859](https://github.com/scriptscat/scriptcat/issues/859)) [[014d62d](https://github.com/scriptscat/scriptcat/commit/014d62de6b731bfda82babf5db5aa5ae909908f1)] (by @cyfung1031)
- 🚑 紧急修正: GM.delete/setValue Promise 不 fulfill ([#865](https://github.com/scriptscat/scriptcat/issues/865)) [[43572a3](https://github.com/scriptscat/scriptcat/commit/43572a3110b8b083f840b472a231400223da7751)] (by @cyfung1031)
- 🐛 修复 GM xhr fetch 问题 [#847](https://github.com/scriptscat/scriptcat/issues/847) [[c6e95c2](https://github.com/scriptscat/scriptcat/commit/c6e95c210748d091ff9f610f3801eaa055d9d6de)]

### Miscellaneous

- 📝 monaco-editor 加 &#x60;@compatible&#x60; 注釋 ([#853](https://github.com/scriptscat/scriptcat/issues/853)) [[752b951](https://github.com/scriptscat/scriptcat/commit/752b95122ab324df358e45ec468194cc8466f8bb)] (by @cyfung1031)
- 🌐 添加 subscribe_source_tooltip 翻译 [#850](https://github.com/scriptscat/scriptcat/issues/850) [[8d675bd](https://github.com/scriptscat/scriptcat/commit/8d675bd5398d403dfc8e7ee2016fbaffd821da64)]

<a name="1.2.0-beta.2"></a>

## 1.2.0-beta.2 (2025-10-15)

优化了脚本更新逻辑，新增了脚本列表侧边栏，增强了 GM_registerMenuCommand 和 GM_openInTab 的功能，修复了很多 bug

### Added

- ✨ 统合更新提醒机制 ([#755](https://github.com/scriptscat/scriptcat/issues/755)) ([741b0bd](https://github.com/scriptscat/scriptcat/commit/741b0bd2ec2f75a7e84c62fbe02654ce6bc41543))
- ✨ GM_registerMenuCommand 二级菜单 &amp; 分隔线 ([#831](https://github.com/scriptscat/scriptcat/issues/831)) [[bd08959](https://github.com/scriptscat/scriptcat/commit/bd089595c922aa63af0fb6d41fa9f6dc2587e096)] (by @cyfung1031)
- ✨ 增加 GM_openInTab 的参数 ([#788](https://github.com/scriptscat/scriptcat/issues/788)) [[eb33d61](https://github.com/scriptscat/scriptcat/commit/eb33d613473815b12017e34f46ed9eb292a9dcba)] (by @cyfung1031)
- ✨ 增加 SC 版本检查按钮 ([#795](https://github.com/scriptscat/scriptcat/issues/795)) [[1680c66](https://github.com/scriptscat/scriptcat/commit/1680c66099120c0e497c1a1f5321f38fe0160ea0)] (by @cyfung1031)
- ✨ 新增脚本列表侧边栏筛选与标签功能 ([#794](https://github.com/scriptscat/scriptcat/issues/794)) [[6aabf59](https://github.com/scriptscat/scriptcat/commit/6aabf594cd62fa7358ba34c1c69060dc9e24919c)]
- ✨ 使用 window.showOpenFilePicker 打开文件实现可以监听本地文件 [#749](https://github.com/scriptscat/scriptcat/issues/749) [[7dcfbf1](https://github.com/scriptscat/scriptcat/commit/7dcfbf1309fff28c3d806d4ccb36bd0ef51050f5)]

### Changed

- ♻️ 分离 indexeddb 和 chrome.storage 迁移逻辑 ([#844](https://github.com/scriptscat/scriptcat/issues/844)) [[b8389fb](https://github.com/scriptscat/scriptcat/commit/b8389fbc21932dbbe9394b576fbd8605a3b820c8)]
- ♻️ registerMenuCommand &amp; unregisterMenuCommand 修正 ([#826](https://github.com/scriptscat/scriptcat/issues/826)) [[3ecde9e](https://github.com/scriptscat/scriptcat/commit/3ecde9e0125089744c2d81f759b043deb5440be6)] (by @cyfung1031)
- ⚡ 优化 Runtime 启动载入 ([#775](https://github.com/scriptscat/scriptcat/issues/775)) [[3e69401](https://github.com/scriptscat/scriptcat/commit/3e69401feb98bd789a85dbda7d9e690f71bae696)] (by @cyfung1031)

### Fixed

- 🐛 重新修订 &#x60;GM_registerMenuCommand&#x60; 相关代码设计 ([#790](https://github.com/scriptscat/scriptcat/issues/790)) ([a71cfe4](https://github.com/scriptscat/scriptcat/commit/a71cfe496fcb2457109dd97742a795585860a6d7))
- 🐛 处理 popup 数据清理 [#784](https://github.com/scriptscat/scriptcat/issues/784) [[7bd9b16](https://github.com/scriptscat/scriptcat/commit/7bd9b162b178a534a8be31aca210af2106f110b7)]
- 🐛 修复 CAT_fileStorage download 问题 [#829](https://github.com/scriptscat/scriptcat/issues/829) [[81d4e49](https://github.com/scriptscat/scriptcat/commit/81d4e496df8abd3715348fe979758a63311b54c3)]
- 🐛 修复 userconfig group 顺序问题 [#818](https://github.com/scriptscat/scriptcat/issues/818) [[74881c0](https://github.com/scriptscat/scriptcat/commit/74881c0a05d599ad13300c3c69b33b01a5a7b552)]
- 🐛 修复安装来源数据兼容性与处理问题 [[574b3c6](https://github.com/scriptscat/scriptcat/commit/574b3c6506a21e1b8ebd891fd91fcd8b19774b96)]
- 🐛 修复弹出页面中后台脚本状态同步问题 [#838](https://github.com/scriptscat/scriptcat/issues/838) ([edd13c6](https://github.com/scriptscat/scriptcat/commit/edd13c65c9643dece7c38665f58146c9e59c802c))
- 🐛 修复右键菜单与脚本菜单不一致的问题 [#768](https://github.com/scriptscat/scriptcat/issues/768) ([191ffcd](https://github.com/scriptscat/scriptcat/commit/191ffcd1e55d842acabbc44fdf1f1098f0b0093d))
- 🐛 修复手动导入本地文件错误的问题 [#745](https://github.com/scriptscat/scriptcat/issues/745) ([fe14991](https://github.com/scriptscat/scriptcat/commit/fe149914e6eef99761ca44681abd95919613adb3))
- 🐛 修复手动导入本地文件错误的问题 [#745](https://github.com/scriptscat/scriptcat/issues/745) ([52950a2](https://github.com/scriptscat/scriptcat/commit/52950a2ad04c79aecaa530a6eb615e9c54bba884))
- 🐛 支持本地\*.user.js 识别 [#812](https://github.com/scriptscat/scriptcat/issues/812) [[cec8ffc](https://github.com/scriptscat/scriptcat/commit/cec8ffc5f6947a54b7a59365928a1ccf47b336a2)]
- 🐛 修复早期启动脚本无法使用 GM_addElement 的问题 [#801](https://github.com/scriptscat/scriptcat/issues/801) [[4d17645](https://github.com/scriptscat/scriptcat/commit/4d17645c0659d8ecd283473cbdd88b6eda065758)]
- 🐛 修复 early 脚本 GM_info.scriptMetaStr 问题 [#801](https://github.com/scriptscat/scriptcat/issues/801) [[a9a4333](https://github.com/scriptscat/scriptcat/commit/a9a433393ceb259aecc4fe9c1d32a0c9a8333160)]
- 🐛 metadata block 文档及小量代码修正 ([#832](https://github.com/scriptscat/scriptcat/issues/832)) [[c40822b](https://github.com/scriptscat/scriptcat/commit/c40822b293f1283d420797a0cbe549153541f3c8)] (by @cyfung1031)
- 🐛 避免 menuCommand 更新在 Tab 移除后触发 ([#828](https://github.com/scriptscat/scriptcat/issues/828)) [[c64f6d9](https://github.com/scriptscat/scriptcat/commit/c64f6d9a4e087f7788f5b160b91c2b808161e58e)] (by @cyfung1031)
- 🐛 修复 Modali18n 问题 ([#825](https://github.com/scriptscat/scriptcat/issues/825)) [[03da1ba](https://github.com/scriptscat/scriptcat/commit/03da1ba07c0fd212627bf3c18dbb3afa6affed78)] (by @cyfung1031)
- 🐛 修复 Modal.confirm i18n 问题 [#821](https://github.com/scriptscat/scriptcat/issues/821) [[b3c30f5](https://github.com/scriptscat/scriptcat/commit/b3c30f55db8b37ccbfa7278b83af21159c72f2cb)]
- ✏️ 参数类型中的&quot;minetype&quot;应该是&quot;mimetype&quot; ([#823](https://github.com/scriptscat/scriptcat/issues/823)) [[fb3d132](https://github.com/scriptscat/scriptcat/commit/fb3d132ece659cb18082e383dfb925a5cc242c4c)] (by @cyfung1031)
- 🐛 无效 Extension Context 错误发生时，中止操作&amp;释放资源 ([#800](https://github.com/scriptscat/scriptcat/issues/800)) [[c110e74](https://github.com/scriptscat/scriptcat/commit/c110e746336e63fc1266bb4cacc056e126d919e0)] (by @cyfung1031)
- 🐛 修正 batchUpdate 页弹出时再取一次更新的问题 + 安裝後沒更新的问题 ([#803](https://github.com/scriptscat/scriptcat/issues/803)) [[73f1f32](https://github.com/scriptscat/scriptcat/commit/73f1f329388c07588f2a532b71e5318bf3a92392)] (by @cyfung1031)
- 🐛 调整默认的 jsconfig [#813](https://github.com/scriptscat/scriptcat/issues/813) [[06f0e1c](https://github.com/scriptscat/scriptcat/commit/06f0e1c7f0974b954d7ab546ce86f22f830dc28f)]
- 🐛 ui render issue ([#806](https://github.com/scriptscat/scriptcat/issues/806)) [[5c75c8b](https://github.com/scriptscat/scriptcat/commit/5c75c8b8e8fc92fcd830db094b34a7ad16fb4c9f)] (by @cyfung1031)
- 🐛 屏蔽 ambiguous unicode 提示 [#747](https://github.com/scriptscat/scriptcat/issues/747) [[5e7c077](https://github.com/scriptscat/scriptcat/commit/5e7c077ef250e1b8eef5662bc416b82d62927b52)]
- 🐛 语言切换后 ScriptList 列表栏名与内容未更新 ([#792](https://github.com/scriptscat/scriptcat/issues/792)) [[3ad58b8](https://github.com/scriptscat/scriptcat/commit/3ad58b82bf1d4955cddd3e50b570c601f7e90143)] (by @cyfung1031)
- 🐛 修正 chrome.tabs.query ([#786](https://github.com/scriptscat/scriptcat/issues/786)) [[de607fd](https://github.com/scriptscat/scriptcat/commit/de607fd8eca841748a3e422fe5e84f84f84619d5)] (by @cyfung1031)
- 🐛 【UI 修正】解决 useCallback 问题 ([#769](https://github.com/scriptscat/scriptcat/issues/769)) [[511de96](https://github.com/scriptscat/scriptcat/commit/511de96d2b271142244f9874f87bb23ec75f626a)] (by @cyfung1031)
- 🐛 添加 background 权限解决无法在后台运行的问题 [#762](https://github.com/scriptscat/scriptcat/issues/762) [[4205837](https://github.com/scriptscat/scriptcat/commit/42058379ab6d0e29003cc1f63d5df48dbe601f4e)]
- 🐛 修复 GM_download 无法下载 filename 为非法字符的文件 ([#758](https://github.com/scriptscat/scriptcat/issues/758)) [[2518722](https://github.com/scriptscat/scriptcat/commit/2518722c8bc14b9f52e8720624dd835b1fbdfb1b)] (by @WhiteSevs)
- 🐛 修复沙盒 toString 问题 [#737](https://github.com/scriptscat/scriptcat/issues/737) [[6ca24c9](https://github.com/scriptscat/scriptcat/commit/6ca24c9b171792035803ac4e1c69e473629f9d18)]
- 🐛 修复徽章显示 0 的问题 [[026c1d2](https://github.com/scriptscat/scriptcat/commit/026c1d2071dd4cfb6291f005d36717bcdf0a51c3)]
- 🐛 修复脚本注入 CSP 问题 [#739](https://github.com/scriptscat/scriptcat/issues/739) [#728](https://github.com/scriptscat/scriptcat/issues/728) [[5da21b5](https://github.com/scriptscat/scriptcat/commit/5da21b5e3d0e7e86a1fd5dff57ba03ea641c19fa)]

### Miscellaneous

- 📝 ts 注释修正 ([#839](https://github.com/scriptscat/scriptcat/issues/839)) [[6b575ca](https://github.com/scriptscat/scriptcat/commit/6b575cac4841bdf86de70e4b0e702e342a00ca76)] (by @cyfung1031)
- 🌐 处理一些通知、错误的翻译问题，并新增 `@grant` 冲突校验 ([#819](https://github.com/scriptscat/scriptcat/issues/819)) [[ef3482d](https://github.com/scriptscat/scriptcat/commit/ef3482d2c6406927a72835067f66a28cdb0f3b79)] (by @cyfung1031)
- 🌐 &quot;无消息内容&quot; i18n 处理 ([#811](https://github.com/scriptscat/scriptcat/issues/811)) [[f9486d6](https://github.com/scriptscat/scriptcat/commit/f9486d6e53d68c085625ac370dc717daf8af232e)] (by @cyfung1031)
- 🌐 UI 修改来源格显示 ([#783](https://github.com/scriptscat/scriptcat/issues/783)) [[9242b95](https://github.com/scriptscat/scriptcat/commit/9242b957cf5f90f6d186a0b1f07bfce8d6ed1cd7)] (by @cyfung1031)
- 🌐 updatepage translation ([#777](https://github.com/scriptscat/scriptcat/issues/777)) [[757c954](https://github.com/scriptscat/scriptcat/commit/757c954768be8fc94e05200822a23efef5e6bc01)] (by @cyfung1031)
- 🌐 Update translation.json ([#746](https://github.com/scriptscat/scriptcat/issues/746)) [[85b48e2](https://github.com/scriptscat/scriptcat/commit/85b48e2982e0c81f82622528a3aa600c3c88ce8d)] (by @cyfung1031)

<a name="1.2.0-beta.1"></a>

## 1.2.0-beta.1 (2025-09-18)

### Added

- ✨ 增加布局菜单隐藏侧边栏 [#689](https://github.com/scriptscat/scriptcat/issues/689) [[dd64da7](https://github.com/scriptscat/scriptcat/commit/dd64da719c081acbf21645e2b1e1f38653ffae8c)]
- ✨ 实现 inject into ([#711](https://github.com/scriptscat/scriptcat/issues/711)) [[4c708c2](https://github.com/scriptscat/scriptcat/commit/4c708c2c5a0f7cea6daa2f32f51e182a4f83c50c)]
- ✨ : add a shortcut to activate the toolbar button for Firefox mv3 ([#718](https://github.com/scriptscat/scriptcat/issues/718)) [[06a9040](https://github.com/scriptscat/scriptcat/commit/06a904046034aad59564ea07d8ec441f4def5278)] (by @xymoryn)

### Changed

- ⚡ 优化弹出页面重新渲染导致点击后台脚本运行按钮后折叠的问题 [[d83ad0d](https://github.com/scriptscat/scriptcat/commit/d83ad0dda600db59adf70f9db2304381db7ab80f)]
- ⚡ 优化脚本列表，减少 re-render [[610fba0](https://github.com/scriptscat/scriptcat/commit/610fba08bbac5c01791aac756eed60a75bc1d483)]
- ♻️ 增强后台脚本任务检查，减少错误 [#714](https://github.com/scriptscat/scriptcat/issues/714) [[3850af2](https://github.com/scriptscat/scriptcat/commit/3850af22abefced1f2ec6c773c92599a18bb0f8a)]
- 🐛 修复弹出页面中后台脚本不展开的问题 ([66ab70f](https://github.com/scriptscat/scriptcat/commit/66ab70fb10c28aaf0c9260a9591aab7e1ae35615))
- ✨ 弹出页在排除网站后不自动关闭 [#725](https://github.com/scriptscat/scriptcat/issues/725) ([e432210](https://github.com/scriptscat/scriptcat/commit/e43221051d52d7394a579442519e99d258df872a))
- ♻️ 优化 ReduxStore 与广播机制 ([#729](https://github.com/scriptscat/scriptcat/issues/729)) [[b62781e](https://github.com/scriptscat/scriptcat/commit/b62781e11f0f4771094e42cb3479a70b8134cdf6)] (by @cyfung1031)
- ⚡ React.forwardRef 代码优化 ([#734](https://github.com/scriptscat/scriptcat/issues/734)) [[a7faa48](https://github.com/scriptscat/scriptcat/commit/a7faa48f9a4615318104fa5d501184a4faec73cd)] (by @cyfung1031)
- ♻️ 重构优化 systemConfig [[3acd3f3](https://github.com/scriptscat/scriptcat/commit/3acd3f3890031a7e90bd57eb63320007164ed4ff)]

### Fixed

- 🐛 修复状态更新错误的问题 [[94fd65b](https://github.com/scriptscat/scriptcat/commit/94fd65bfb765a9511e0efb2dc6fb2bfd216e570f)]
- ✏️ 修复拼写错误 ([#738](https://github.com/scriptscat/scriptcat/issues/738)) ([4e55c06](https://github.com/scriptscat/scriptcat/commit/4e55c06212336bd3356e6d1ead3b75cf97f3b9d8))
- 🐛 修复徽章显示 0 的问题 ([6edad14](https://github.com/scriptscat/scriptcat/commit/6edad1491820665fad8cd6ee5c85e93c57aa0d42))
- 🐛 增强消息类型判断 [#676](https://github.com/scriptscat/scriptcat/issues/676) ([5073795](https://github.com/scriptscat/scriptcat/commit/50737957507ff9af3aa9ba9a6b7d444b643d1ff2))
- 🐛 修复沙盒 toString 问题 [#737](https://github.com/scriptscat/scriptcat/issues/737) [[a4cefbc](https://github.com/scriptscat/scriptcat/commit/a4cefbc791fc2c2e53f3e934e0e4725023f49f72)]
- ✏️ 修复拼写错误 [[35b6f58](https://github.com/scriptscat/scriptcat/commit/35b6f581c6421a6db001eebadaa8ae216f5b8575)]
- 🐛 修复 GM xhr document 问题 [#716](https://github.com/scriptscat/scriptcat/issues/716) [[1c46546](https://github.com/scriptscat/scriptcat/commit/1c465462f4e14ae461d54358710f5caf74208af3)]

<a name="1.2.0-beta"></a>

## 1.2.0-beta (2025-09-07)

### Added

- ✨ 增加自定义编辑器配置和编辑器类型定义 ([#708](https://github.com/scriptscat/scriptcat/issues/708)) [[49eb379](https://github.com/scriptscat/scriptcat/commit/49eb3794774790d61c3ef787c865a9ba6fe82841)]
- ✨ 添加卸载扩展后的调查页面 [[6404c8f](https://github.com/scriptscat/scriptcat/commit/6404c8f74aff09b15725a92f8afdfc0d71ac188f)]
- 📝 修改安装打开的页面和命名空间 ([6f2f000](https://github.com/scriptscat/scriptcat/commit/6f2f000612908b7a88f6b70c2831092805c63bc7))
- ✨ 添加移动端安装二维码 ([348237c](https://github.com/scriptscat/scriptcat/commit/348237c7ce9771c69025386926b1f73710cf6f42))

### Fixed

- 🐛 修复低版本浏览器的兼容性问题 [#715](https://github.com/scriptscat/scriptcat/issues/715) [[4da8068](https://github.com/scriptscat/scriptcat/commit/4da806879c2b170672814d02e6f8ed98c9fae35b)]
- 💄 优化弹出窗口过小时弹出菜单显示问题 ([288650e](https://github.com/scriptscat/scriptcat/commit/288650e5e4cbdc3fa8658f0754ce427a1b3dec5a))
- 🐛 修复 N 个问题 ([#710](https://github.com/scriptscat/scriptcat/issues/710)) [[6a2027a](https://github.com/scriptscat/scriptcat/commit/6a2027ac0bb5e0ed625df570240d068a98a34b31)] (by @WhiteSevs)
- 🐛 修复 GM XHR 重定向丢失 header 的问题 [#664](https://github.com/scriptscat/scriptcat/issues/664) close [#664](https://github.com/scriptscat/scriptcat/issues/664) [[1f29e69](https://github.com/scriptscat/scriptcat/commit/1f29e699ded25ec5270844c1fb54001b5bbf5038)]

### Miscellaneous

- 🌐 处理 i18n 问题 [[2adf69d](https://github.com/scriptscat/scriptcat/commit/2adf69d6ec3c30186f2c2ef89f97e3cba9e15a66)]
- 🌐 处理翻译问题 [[55223dd](https://github.com/scriptscat/scriptcat/commit/55223dde8c545e974d19dd8126756aaae407e1fd)]

<a name="1.1.0-beta.2"></a>

## 1.1.0-beta.2 (2025-09-03)

支持了 Dropbox，做了一些兼容性处理，新增 @early-start 支持比页面更快加载

### Added

- ✨ 添加脚本运行环境设置 [#628](https://github.com/scriptscat/scriptcat/issues/628) [[0d4a89e](https://github.com/scriptscat/scriptcat/commit/0d4a89efaecf0331dcc7fbb6df006b93a1525846)]
- ✨ 当没有后台脚本时默认收起 [#626](https://github.com/scriptscat/scriptcat/issues/626) ([9d0aac6](https://github.com/scriptscat/scriptcat/commit/9d0aac6aae11b96707ca1f7c024a24e9d55f217b))
- ✨ 支持 Dropbox [#575](https://github.com/scriptscat/scriptcat/issues/575) [[2c66f21](https://github.com/scriptscat/scriptcat/commit/2c66f21f5118bd83a0eaa0f1baa3a31f2233e5b2)]
- ✨ 优化 external.Tampermonkey 当 TM 和 SC 同时启动时，如 TM 没有安装，则查 SC 的安装状态 ([#703](https://github.com/scriptscat/scriptcat/issues/703)) [[d0115c3](https://github.com/scriptscat/scriptcat/commit/d0115c33657260d803b6091139601b1b20407d4e)] (by @cyfung1031)
- ✨ 新增 @early-start 实现比页面更快加载 ([#649](https://github.com/scriptscat/scriptcat/issues/649)) [[eb097dd](https://github.com/scriptscat/scriptcat/commit/eb097dd146dcd6f8ca712ed883571dbfb3d09f20)]

### Changed

- ♻️ 兼容 FF: &#x60;chrome.scripting.registerContentScripts&#x60; ([#704](https://github.com/scriptscat/scriptcat/issues/704)) [[a9ad0ea](https://github.com/scriptscat/scriptcat/commit/a9ad0ea2b34744dbd4488bda0a16d73bd6a1cc2b)] (by @cyfung1031)
- ♻️ url_matcher 代码优化 ([#702](https://github.com/scriptscat/scriptcat/issues/702)) [[27b8baa](https://github.com/scriptscat/scriptcat/commit/27b8baa90372f75cbf428dd32ef02d842688cf33)] (by @cyfung1031)
- ⚡ const now &#x3D; Date.now(); ([#695](https://github.com/scriptscat/scriptcat/issues/695)) [[400b45c](https://github.com/scriptscat/scriptcat/commit/400b45cc487da4cc8a7b866916855acdc18a8023)] (by @cyfung1031)
- ⚡ forEach -&gt; for of ([#694](https://github.com/scriptscat/scriptcat/issues/694)) [[70927b6](https://github.com/scriptscat/scriptcat/commit/70927b6f0ddcf4a60d5838597d1df5acaaa7ca94)] (by @cyfung1031)
- ⚡ 共通代码优化 ([#692](https://github.com/scriptscat/scriptcat/issues/692)) [[cf05973](https://github.com/scriptscat/scriptcat/commit/cf0597305a158fd8ba8489f30906d7bbbd7a4b0b)] (by @cyfung1031)
- ⚡ 代码优化：Global Search ([#697](https://github.com/scriptscat/scriptcat/issues/697)) [[a5c12bd](https://github.com/scriptscat/scriptcat/commit/a5c12bd94f249ea194bececf2ecb39a0dea3c7dc)] (by @cyfung1031)
- ♻️ 使用中间件处理 initReady [[758e926](https://github.com/scriptscat/scriptcat/commit/758e92690194462982282dca25041c825d0b05e2)]
- ♻️ 优化 Server 和 MessageQueue 组件 [[0932edc](https://github.com/scriptscat/scriptcat/commit/0932edc49722226cac97403dcd14dbaef01b5528)]
- ♻️ 兼容性调整：optional_permission 处理 ([#679](https://github.com/scriptscat/scriptcat/issues/679)) [[bfc558a](https://github.com/scriptscat/scriptcat/commit/bfc558a0dfd167234100d95b9180ee6db4ab4c04)] (by @cyfung1031)
- ♻️ 兼容性调整：没有 &#x60;chrome.runtime.onMessage&#x60;的话 &#x60;content.js&#x60; 要报错 ([#675](https://github.com/scriptscat/scriptcat/issues/675)) [[4e9adc0](https://github.com/scriptscat/scriptcat/commit/4e9adc00562981aa9d930d8a3f199e9418bdff30)] (by @cyfung1031)
- ♻️ 兼容性调整（offscreen）及代码优化 ([#674](https://github.com/scriptscat/scriptcat/issues/674)) [[a3e56dd](https://github.com/scriptscat/scriptcat/commit/a3e56dd9d76cad73c8c8ec75c71fdbcfb9ca40e0)] (by @cyfung1031)
- 🎨 兼容性调整：notificationsUpdate ([#673](https://github.com/scriptscat/scriptcat/issues/673)) [[a345d93](https://github.com/scriptscat/scriptcat/commit/a345d93187e26efe99cc331072ffc854b3fe7b4d)] (by @cyfung1031)
- 🎨 增强 chrome.tabs.create 兼容性 ([#639](https://github.com/scriptscat/scriptcat/issues/639)) [[ac0d7de](https://github.com/scriptscat/scriptcat/commit/ac0d7deb5957ea71579ef7a44594a75300e1cca6)] (by @cyfung1031)

### Fixed

- 🐛 修复网络无法访问安装中间页时无法触发安装的问题 [#705](https://github.com/scriptscat/scriptcat/issues/705) [[5f1e292](https://github.com/scriptscat/scriptcat/commit/5f1e2929d79c470ba4427c3cce01f5cd184a839b)]
- 🐛 处理`@match *://*domain/*`的表达式 [[039b445](https://github.com/scriptscat/scriptcat/commit/039b4454148947cd3c74de82b87804ee9815e60c)]
- 🐛 修复扩展环境沙盒穿透问题 [#700](https://github.com/scriptscat/scriptcat/issues/700) [[a1a868d](https://github.com/scriptscat/scriptcat/commit/a1a868dfe3199e666fe2bcb65cfb2ad0ad3d699b)]
- ✏️ backgroud -&gt; background ([#698](https://github.com/scriptscat/scriptcat/issues/698)) [[2594075](https://github.com/scriptscat/scriptcat/commit/2594075c4a50f4c79fa46bcda08d7b0cbcfe723c)] (by @cyfung1031)
- ✏️ CrhomeStorage -&gt; ChromeStorage ([#693](https://github.com/scriptscat/scriptcat/issues/693)) [[64c536d](https://github.com/scriptscat/scriptcat/commit/64c536dbd5fcb4c29eebc1109202bab69aaa3ee2)] (by @cyfung1031)
- 🐛 修复 GM.getTab、GM.getTabs ([#683](https://github.com/scriptscat/scriptcat/issues/683)) [[31de256](https://github.com/scriptscat/scriptcat/commit/31de256f02b5b61e27f0eec9ea673248ba8faa32)] (by @WhiteSevs)
- 🐛 修正 finalUrl 缺失域名 ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[545d7c8](https://github.com/scriptscat/scriptcat/commit/545d7c8c0dd69c83bd2f0353518aafe6af81c0f4)] (by @cyfung1031)
- 🐛 兼容较低的浏览器内核 [#647](https://github.com/scriptscat/scriptcat/issues/647) ([bba12d2](https://github.com/scriptscat/scriptcat/commit/bba12d23f04759cb9b7fdb63f0d95ae515ee94a9))

### Miscellaneous

- 📝 Create README_RU.md and CONTRIBUTING_RU.md ([#678](https://github.com/scriptscat/scriptcat/issues/678)) [[597ab03](https://github.com/scriptscat/scriptcat/commit/597ab0378fe5ced01637cf411326ef7845b8ce2b)] (by @Ioann)
- 👷 兼容性调整（pack.js 兼容性） ([#669](https://github.com/scriptscat/scriptcat/issues/669)) [[fec45e6](https://github.com/scriptscat/scriptcat/commit/fec45e6606a609b10b79c58d2fcba02c2ce71e16)] (by @cyfung1031)

**Full Changelog**: https://github.com/scriptscat/scriptcat/compare/v1.1.0-beta.1...v1.1.0-beta.2

<a name="1.1.0-beta.1"></a>

## 1.1.0-beta.1 (2025-08-29)

### Added

- ✅ 修改单元测试 ([#690](https://github.com/scriptscat/scriptcat/issues/690)) [[71f9d70](https://github.com/scriptscat/scriptcat/commit/71f9d709868b96352494889ea864c22c0b2ce197)] (by @cyfung1031)
- 🎨 异步代码优化 ([#651](https://github.com/scriptscat/scriptcat/issues/651)) ([55440e7](https://github.com/scriptscat/scriptcat/commit/55440e725a706e4358f08bc430ebea77bcb25335))
- ✨ 全局代码搜索 ([#662](https://github.com/scriptscat/scriptcat/issues/662)) [[f8eafb7](https://github.com/scriptscat/scriptcat/commit/f8eafb7f955dad62c1b41ac477e929bf00c65982)] (by @RenjiYuusei)
- ✅ 调整 nextTime 单元测试 [[0a6ed8c](https://github.com/scriptscat/scriptcat/commit/0a6ed8c72b8ee6dc15b66f8053ae3bf3ee95584d)]

### Changed

- ♻️ ScriptMatchInfo 相关代码优化 ([#653](https://github.com/scriptscat/scriptcat/issues/653)) [[556c493](https://github.com/scriptscat/scriptcat/commit/556c493f027fbfa7299ee68c3a9d927de6f41f08)] (by @cyfung1031)
- 🎨 优化窗口打开逻辑 [[0de44bf](https://github.com/scriptscat/scriptcat/commit/0de44bfc90eeee003d9708ba0678e6c23f859579)]
- 🌐 处理翻译问题 ([cbe880e](https://github.com/scriptscat/scriptcat/commit/cbe880efcf3a148301dce4ffa90aa29a14407a26))
- 🎨 &#x60;@scriptURL&#x60; ([#654](https://github.com/scriptscat/scriptcat/issues/654)) [[4b1a5de](https://github.com/scriptscat/scriptcat/commit/4b1a5de9ed3b328091f582925b8a442535953a9e)] (by @cyfung1031)
- ♻️ 重写 UrlMatch ([#637](https://github.com/scriptscat/scriptcat/issues/637)) [[5b01c10](https://github.com/scriptscat/scriptcat/commit/5b01c10859b80890456a44a66d78204b42040870)] (by @cyfung1031)
- 🎨 getEnableScript 优化 ([#645](https://github.com/scriptscat/scriptcat/issues/645)) [[04910cf](https://github.com/scriptscat/scriptcat/commit/04910cf6213fe90fc8cbca28f2826414855dd7b1)] (by @cyfung1031)
- ⚡ runtime.ts 代码优化 ([#642](https://github.com/scriptscat/scriptcat/issues/642)) [[641cc1d](https://github.com/scriptscat/scriptcat/commit/641cc1d1ec0ec2dff5d32689ba46d27d30f7b45f)] (by @cyfung1031)
- 🎨 增强 chrome.tabs.create 兼容性 ([#639](https://github.com/scriptscat/scriptcat/issues/639)) [[601b933](https://github.com/scriptscat/scriptcat/commit/601b933bd5cec1405ac6169a6160a57dfe0dbcfc)] (by @cyfung1031)
- 🎨 修正新脚本 &#x60;@match&#x60; &#x60;@icon&#x60; ([#636](https://github.com/scriptscat/scriptcat/issues/636)) [[aec08a3](https://github.com/scriptscat/scriptcat/commit/aec08a331f868defee6279eb420f6b90aba39cfe)] (by @cyfung1031)

### Removed

- 🔥 删除脚本站的 crowdin 说明 [[695f4d1](https://github.com/scriptscat/scriptcat/commit/695f4d1ba2d039508415235dd8e606d238be8035)]

### Fixed

- 🐛 修正 finalUrl 缺失域名 ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[3ed018a](https://github.com/scriptscat/scriptcat/commit/3ed018a7a54803fcf2e1791316e0166ed0b52007)] (by @cyfung1031)
- 💚 修复 react/jsx-no-literals lint 问题 [[017b608](https://github.com/scriptscat/scriptcat/commit/017b60886be601e3e0e1719cf249da32d5686c30)]
- 🐛 兼容较低的浏览器内核 [#647](https://github.com/scriptscat/scriptcat/issues/647) [[0e2f817](https://github.com/scriptscat/scriptcat/commit/0e2f8173c8b44bd6ad44bdffc73fa302a96a058e)]
- 🐛 优化 window.external 注入 ([#646](https://github.com/scriptscat/scriptcat/issues/646)) [[0b2668a](https://github.com/scriptscat/scriptcat/commit/0b2668aadcab35a33ff9abc4bd030dffb87ea168)] (by @cyfung1031)
- 🐛 修复网盘鉴权打开页面无法自动关闭的问题 [[7748088](https://github.com/scriptscat/scriptcat/commit/7748088e63c1fc660b6a6ae5613cf04f9da99b8c)]

### Miscellaneous

- 🌐 Refines and expands Vietnamese locale ([#661](https://github.com/scriptscat/scriptcat/issues/661)) [[6847a59](https://github.com/scriptscat/scriptcat/commit/6847a596c4b06c75e13594ef60e4b9dfa5718cf3)] (by @RenjiYuusei)
- 🌐 翻译修正 ([#635](https://github.com/scriptscat/scriptcat/issues/635)) [[19296de](https://github.com/scriptscat/scriptcat/commit/19296de6a3815e5965eb33401a55da9b2bd22bb4)] (by @cyfung1031)
- 🌐 修复新手引导 i18n 问题 [#627](https://github.com/scriptscat/scriptcat/issues/627) [[9683f96](https://github.com/scriptscat/scriptcat/commit/9683f965400ab6a2bac15349aca4335911766eac)]

<a name="1.1.0-beta"></a>

## 1.1.0-beta (2025-08-18)

### Changed

- ⚡ 不要 .reduce 写法 ([#619](https://github.com/scriptscat/scriptcat/issues/619)) [[71e97d5](https://github.com/scriptscat/scriptcat/commit/71e97d53fe152d5a8e479378366d077589df3d27)] (by @cyfung1031)
- ⚡ 优化脚本资源加载问题 [#612](https://github.com/scriptscat/scriptcat/issues/612) [[e206562](https://github.com/scriptscat/scriptcat/commit/e2065622c2a544579bc84f25f178d118d902ccba)]
- 🎨 优化脚本安装页面 ([#611](https://github.com/scriptscat/scriptcat/issues/611)) ([bbc76b1](https://github.com/scriptscat/scriptcat/commit/bbc76b1110d417a445b3cc065488fe11b7f2ddc2))
- 🐛 修改在当前窗口打开方式 ([70be8a3](https://github.com/scriptscat/scriptcat/commit/70be8a303b98b73885dac950dc1b24aa8cbbe773))
- 🎨 优化 utils.ts ([#608](https://github.com/scriptscat/scriptcat/issues/608)) [[37bb763](https://github.com/scriptscat/scriptcat/commit/37bb763306c7e06df085022c2cb2fa9cc2788204)] (by @cyfung1031)
- 🎨 doThrow 及 TypeScript 整理 ([#606](https://github.com/scriptscat/scriptcat/issues/606)) [[4362802](https://github.com/scriptscat/scriptcat/commit/4362802fe3ba4482a283996cae9a424b23c69407)] (by @cyfung1031)
- ⚡ 改善 popup.ts 及 runtime.ts （代码优化） ([#607](https://github.com/scriptscat/scriptcat/issues/607)) [[e48ca66](https://github.com/scriptscat/scriptcat/commit/e48ca66cc4f56ef981543c1f56b5e7eb0c2fa14a)] (by @cyfung1031)
- 🎨 getCurrentTab 相關更新 ([#604](https://github.com/scriptscat/scriptcat/issues/604)) [[b4a9f2e](https://github.com/scriptscat/scriptcat/commit/b4a9f2efd48ee8cbacac6872ddb25c7d630bfd8a)] (by @cyfung1031)
- 🎨 TMessage TS 定義 ([#596](https://github.com/scriptscat/scriptcat/issues/596)) [[6aeb61d](https://github.com/scriptscat/scriptcat/commit/6aeb61da8ae7efdd718facacf90e4ed40ddb4caf)] (by @cyfung1031)
- 🎨 使用 Service Worker 取得 favicon ([#594](https://github.com/scriptscat/scriptcat/issues/594)) [[727872d](https://github.com/scriptscat/scriptcat/commit/727872d47552e4c53b09be33b526f7f69baad4ec)] (by @cyfung1031)
- 🎨 message 标準化 ([#595](https://github.com/scriptscat/scriptcat/issues/595)) [[791608b](https://github.com/scriptscat/scriptcat/commit/791608b31855b1415f9ad496ef6c52fe1809984d)] (by @cyfung1031)
- 🎨 优化 SystemConfigChange 代码 ([#593](https://github.com/scriptscat/scriptcat/issues/593)) [[041d985](https://github.com/scriptscat/scriptcat/commit/041d98523902319c88efdee3fa2ae40eab80aba8)] (by @cyfung1031)
- 🎨 优化 EventEmitter 代码 ([#592](https://github.com/scriptscat/scriptcat/issues/592)) [[67543c4](https://github.com/scriptscat/scriptcat/commit/67543c473b303a1708ea83ca00e49d5d687d6a34)] (by @cyfung1031)
- 🎨 优化 Cache 代码 ([#591](https://github.com/scriptscat/scriptcat/issues/591)) [[34e42ac](https://github.com/scriptscat/scriptcat/commit/34e42ac5f9ee504a90636d32c53def356c7d4495)] (by @cyfung1031)
- 🎨 新脚本范本跟 TM 一样预设&#x60;@grant none&#x60; ([#589](https://github.com/scriptscat/scriptcat/issues/589)) [[e5a2d5d](https://github.com/scriptscat/scriptcat/commit/e5a2d5d3adafdcac2cf95b865550e395ba8443c7)] (by @cyfung1031)
- ⚡ new Date().getTime() → Date.now() ([#587](https://github.com/scriptscat/scriptcat/issues/587)) [[245ecbf](https://github.com/scriptscat/scriptcat/commit/245ecbfc23f1811aeee5671e48151e94b0ebc128)] (by @cyfung1031)

### Fixed

- 🐛 修复`@connect` \*不生效的问题 [#623](https://github.com/scriptscat/scriptcat/issues/623) [[76481c8](https://github.com/scriptscat/scriptcat/commit/76481c845b34414a7f15ed18ec61f7dff7eef091)]
- 🐛 添加单元测试和修复`@exclude` 问题 ([#618](https://github.com/scriptscat/scriptcat/issues/618)) [[0046bb7](https://github.com/scriptscat/scriptcat/commit/0046bb78800a2c46edaac785b8e9592327772a3b)] (by @cyfung1031)
- 🐛 修复某些.user.js 链接无法安装脚本的问题 [#599](https://github.com/scriptscat/scriptcat/issues/599) [[ccd2639](https://github.com/scriptscat/scriptcat/commit/ccd2639858f0f3cde28f284376fe8ed998d935ae)]
- 🐛 修复新建脚本失败 [[d42d6e7](https://github.com/scriptscat/scriptcat/commit/d42d6e7d408a84674facf9ab0da6eac0e384502f)]
- 🐛 metadata 修正 ([#610](https://github.com/scriptscat/scriptcat/issues/610)) [[4d98cce](https://github.com/scriptscat/scriptcat/commit/4d98cce0ca1281cc58f551ea4e6700e340780d3f)] (by @cyfung1031)
- 🐛 Popup Badge 修正 ([#605](https://github.com/scriptscat/scriptcat/issues/605)) [[eff9230](https://github.com/scriptscat/scriptcat/commit/eff92309de99abb0cf48ef4727afaa113bc2fbb6)] (by @cyfung1031)
- 🐛 ScriptEditor.tsx 修正 ([#603](https://github.com/scriptscat/scriptcat/issues/603)) [[a9aadba](https://github.com/scriptscat/scriptcat/commit/a9aadba372b813c16bdc5f0aeb07c68981f48c63)] (by @cyfung1031)
- 🐛 代码檢視器&amp;编辑器 CSS 修正 ([#602](https://github.com/scriptscat/scriptcat/issues/602)) [[2e86785](https://github.com/scriptscat/scriptcat/commit/2e8678513efaccd42c8dc2aa89f8b76679aa8420)] (by @cyfung1031)
- 🐛 修复 getFaviconFromDomain 的并发问题 ([#597](https://github.com/scriptscat/scriptcat/issues/597)) [[1872fe1](https://github.com/scriptscat/scriptcat/commit/1872fe165ab204b155a56f037c111d2d7776c2b9)] (by @cyfung1031)
- 🐛 修复多窗口时打开 tab 出错的问题 [#586](https://github.com/scriptscat/scriptcat/issues/586) [[54c1da2](https://github.com/scriptscat/scriptcat/commit/54c1da29c2bd8bd8f5ef2d85b7aed8b334de296f)]
- 🐛 修复 openerTabId 兼容问题 ([#586](https://github.com/scriptscat/scriptcat/issues/586)) [[b861fc8](https://github.com/scriptscat/scriptcat/commit/b861fc8620e53b885cad98db03f1dd10ec9d296c)] (by @cyfung1031)

### Miscellaneous

- 👷 pack.js 代码优化 ([#615](https://github.com/scriptscat/scriptcat/issues/615)) [[870dd9b](https://github.com/scriptscat/scriptcat/commit/870dd9bc6b7eff3eceefa915452e773ec0565180)] (by @cyfung1031)

<a name="1.0.0-beta.2"></a>

## 1.0.0-beta.2 (2025-07-29)

### Added

- ✨ 增加徽标和菜单设置并调整设置页面 [#573](https://github.com/scriptscat/scriptcat/issues/573) [[23e9b19](https://github.com/scriptscat/scriptcat/commit/23e9b19912c64ed2dafeabd66513519e1465b00e)]
- ⚡ 优化资源加载, 并行加载异步资源 ([#574](https://github.com/scriptscat/scriptcat/issues/574)) ([5910c0b](https://github.com/scriptscat/scriptcat/commit/5910c0b3baf540aeb1f12fed5a4796eef3dec71c)) by @zhangenming
- ✨ 开启开关单独控制隐身模式与主窗口 [#571](https://github.com/scriptscat/scriptcat/issues/571) ([38a33b1](https://github.com/scriptscat/scriptcat/commit/38a33b107275be0e1b2aa31eaa2055939c5356f0))
- ✨ Ctrl+Enter 确定导入 [#537](https://github.com/scriptscat/scriptcat/issues/537) [[06a7a01](https://github.com/scriptscat/scriptcat/commit/06a7a01f0ff82b5d99b558fdff29bc45524b7501)]
- ✨ 优化安装、权限等的打开窗口交互 ([0d9ba53](https://github.com/scriptscat/scriptcat/commit/0d9ba53ba3b42f948eb82b34a7257eb46b973055))
- ✨ 安装本地脚本时可以进行监听 [#275](https://github.com/scriptscat/scriptcat/issues/275) ([d9b0eee](https://github.com/scriptscat/scriptcat/commit/d9b0eeede1a8b114f79a43fade99d825323c63f6))

### Changed

- 🎨 调整菜单选项 [#573](https://github.com/scriptscat/scriptcat/issues/573) [[3677278](https://github.com/scriptscat/scriptcat/commit/367727851faf7ec73b9d751fab5787219d77fe9a)]

### Fixed

- 🐛 修复 GM cookie list 获取不全的问题 [[3046200](https://github.com/scriptscat/scriptcat/commit/3046200562e7f92e307cb4a52e32723f67490f2d)]
- 🐛 修复并发创建菜单的报错 [#580](https://github.com/scriptscat/scriptcat/issues/580) [[4855fec](https://github.com/scriptscat/scriptcat/commit/4855fec67a89bb36ab0f1855bc679926a0e74dc3)]
- 🐛 处理一些特殊的沙盒关键字 ([9ced958](https://github.com/scriptscat/scriptcat/commit/9ced958144f2d883c9044e6e4ad4f9dd53951ece))
- 🐛 修复脚本设置网站匹配更新不断累积 include 的问题 [#581](https://github.com/scriptscat/scriptcat/issues/581) [[9d31872](https://github.com/scriptscat/scriptcat/commit/9d31872775116d60e093f7ca31d62449963f059d)]

<a name="1.0.0-beta.1"></a>

## 1.0.0-beta.1 (2025-07-22)

🎉 准备向 v1.0.0 进发，非常感谢哥哥们的支持！

### Added

- ✨ 增加 UserConfig 顺序 [[1874a35](https://github.com/scriptscat/scriptcat/commit/1874a3520668edc6ba947f8deb12148b5c5befa9)]
- ✨ 关闭时的不再检查更新 [#562](https://github.com/scriptscat/scriptcat/issues/562) [[25cec66](https://github.com/scriptscat/scriptcat/commit/25cec66ee81192c6898b20ff133c78ad15039a84)]
- ✨ 最后更新增加 Tooltip ([#564](https://github.com/scriptscat/scriptcat/issues/564)) [[39ede21](https://github.com/scriptscat/scriptcat/commit/39ede219157840d2de5b4a846ab339612db8fb94)] (by @cyfung1031)

### Changed

- ♻️ 调整打开更新页面代码 [[9ea0708](https://github.com/scriptscat/scriptcat/commit/9ea0708a4d6c793caf4cbfe9b760db1fbdc1b453)]
- ⚡ TimeoutError 判斷 ([#565](https://github.com/scriptscat/scriptcat/issues/565)) [[6a9a830](https://github.com/scriptscat/scriptcat/commit/6a9a8309379f5406a29aa8bee6ad8de106c85f57)] (by @cyfung1031)
- ⚡ 修正 ScriptList 重绘、图标显示等问题 + 其他视觉元素修改 ([#559](https://github.com/scriptscat/scriptcat/issues/559)) [[f9e6c44](https://github.com/scriptscat/scriptcat/commit/f9e6c44358757e904d58df4e91f67215fc9278ad)] (by @cyfung1031)
- ⚡ 修改 messageFlag 格式避免与其他页面代码衝突 ([#561](https://github.com/scriptscat/scriptcat/issues/561)) [[182a631](https://github.com/scriptscat/scriptcat/commit/182a631788b779a61aa126776b3edad4434a898e)] (by @cyfung1031)
- ♻️ xhr 原生 response 只取一次 ([#550](https://github.com/scriptscat/scriptcat/issues/550)) [3a8a464]

### Removed

- 🔥 未支持&#x60;window.onurlchange&#x60; ([#568](https://github.com/scriptscat/scriptcat/issues/568)) [[678af19](https://github.com/scriptscat/scriptcat/commit/678af19f0f793caf8f3c32adfc7732da7386824b)] (by @cyfung1031)

### Fixed

- 🐛 修复 GM.xmlHttpRequest 的 onload 事件 [#570](https://github.com/scriptscat/scriptcat/issues/570) [[553b944](https://github.com/scriptscat/scriptcat/commit/553b9442bf21340ce32871d01309919295b946fd)]
- 🐛 修复导出文件中的特殊字符 [#558](https://github.com/scriptscat/scriptcat/issues/558) [[17505f0](https://github.com/scriptscat/scriptcat/commit/17505f076e46249467a90a32f51b10ed3170205a)]
- 🐛 修复编辑器在 development 模式下的问题与编辑改动问题 [[340d3cc](https://github.com/scriptscat/scriptcat/commit/340d3cca28cbef16e5a6678753d3676899760703)]
- 🐛 优化授权管理与 GM XHR 错误处理 [#556](https://github.com/scriptscat/scriptcat/issues/556) close [#556](https://github.com/scriptscat/scriptcat/issues/556) [[21e20d3](https://github.com/scriptscat/scriptcat/commit/21e20d35bee04cbad512cdd43ae38f82f08a612f)]
- 🐛 修复资源校验问题 [#563](https://github.com/scriptscat/scriptcat/issues/563) fixed [#563](https://github.com/scriptscat/scriptcat/issues/563) [[110a772](https://github.com/scriptscat/scriptcat/commit/110a77273648f6e8fda3b1e7e9015fb885f67dec)]
- 🐛 修复 GM_xmlhttpRequest 不支持特殊 method 的问题 [#555](https://github.com/scriptscat/scriptcat/issues/555) [[3bf4300](https://github.com/scriptscat/scriptcat/commit/3bf4300844e79963da52d278c4c90708b83d7904)]
- 🐛 修复订阅列表显示空页面的问题 [#553](https://github.com/scriptscat/scriptcat/issues/553) [[be65405](https://github.com/scriptscat/scriptcat/commit/be65405b02c72d2b00a833bc3aa4d478279ec851)]
- 🐛 修复下拉列表选项显示不全的问题 ([#552](https://github.com/scriptscat/scriptcat/issues/552)) ([73564d7](https://github.com/scriptscat/scriptcat/commit/73564d7dfbee2e0168c658e9b7a6802d2bab04b0))
- 🐛 修复 GM_xmlhttpRequest 的事件问题 [#549](https://github.com/scriptscat/scriptcat/issues/549) [[d25a707](https://github.com/scriptscat/scriptcat/commit/d25a707609911ff589121b18421e87edd66d255d)]
- 🐛 处理 beta 版本打开的更新日志 [[cf699a9](https://github.com/scriptscat/scriptcat/commit/cf699a9bcdceac732f1e82a031056e1a44a73120)]

### Miscellaneous

- 👷 增加.codecov.yml [[ee297d5](https://github.com/scriptscat/scriptcat/commit/ee297d520802ead748fd3969e065fb19b42ca87f)]
- 🌐 更新翻译 [[82214d0](https://github.com/scriptscat/scriptcat/commit/82214d09fa0696fe3366277ca21ae80164dea676)]
- 🌐 处理默认翻译问题 英语以中文为基础，其它语言以英文为基础 ([70a739c](https://github.com/scriptscat/scriptcat/commit/70a739ce25f89286f9289e70d5183278f1893572))

<a name="1.0.0-beta"></a>

## 1.0.0-beta (2025-07-14)

🎉 准备向 v1.0.0 进发，非常感谢哥哥们的支持！

### Added

- ✨ 优化日志打印 [[8693b93](https://github.com/scriptscat/scriptcat/commit/8693b9338bdd916ffad58572949e67d14cc2c109)]
- ✨ 实现异步 GM 函数 ([8caebe9](https://github.com/scriptscat/scriptcat/commit/8caebe9ae4f6f6b304b54cbb870a4cebd6341704))
- ✨ 链接导入脚本时可以按回车键确定 ([#537](https://github.com/scriptscat/scriptcat/issues/537)) [[45a17df](https://github.com/scriptscat/scriptcat/commit/45a17df8f35a943a489c0f5980ac3f65fb0e8e5f)] (by @TC999)
- ✨ 增加 Prettier 的 ESLint 统一代码格式化风格 [[0f84a19](https://github.com/scriptscat/scriptcat/commit/0f84a19c42823baab60f2b379d187073be7879f9)]
- ✨ 安装/更新脚本时增加下拉框 [#508](https://github.com/scriptscat/scriptcat/issues/508) [[790584d](https://github.com/scriptscat/scriptcat/commit/790584d078eb4bbf2179aec5297c5574d7b30167)]
- ✨ 增加脚本单独的检查更新选项 [#508](https://github.com/scriptscat/scriptcat/issues/508) ([41ac880](https://github.com/scriptscat/scriptcat/commit/41ac880855fafe3a4e7a87cc05169f77d8a8f59c))
- 🎉 准备跨入 v1.0.0 [[4aa4eef](https://github.com/scriptscat/scriptcat/commit/4aa4eefc05caa8477a1399734fd4f3f4dd758bc9)]
- ✨ 实现异步 GM 函数 ([#492](https://github.com/scriptscat/scriptcat/issues/492)) [[cb8edf7](https://github.com/scriptscat/scriptcat/commit/cb8edf7809667068f4a2682afba82bc24302d717)] (by @cyfung1031)
- ✨ 支持 GoogleDrive ([#490](https://github.com/scriptscat/scriptcat/issues/490)) [[dc38f7f](https://github.com/scriptscat/scriptcat/commit/dc38f7f38fca13febe197a3ced4e817cacec5920)]

### Changed

- ⚡ 优化脚本资源加载 ([4651ae4](https://github.com/scriptscat/scriptcat/commit/4651ae4964a94af83a5cc23c02be4b351db7dce9))
- ⚡ 强化错误检查，加入自定义 esline-rules ([#542](https://github.com/scriptscat/scriptcat/issues/542)) [[c5ac3e3](https://github.com/scriptscat/scriptcat/commit/c5ac3e34176b10ab5f52e705da3d0764aae5519d)] (by @cyfung1031)
- ⚡ React 優化 ([#530](https://github.com/scriptscat/scriptcat/issues/530)) [[45f73b7](https://github.com/scriptscat/scriptcat/commit/45f73b72b2a907d7e74929a571b24160982edbbb)] (by @cyfung1031)
- ♻️ 重构 MainWorld 沙盒 proxyContext（效能优化，保持 TM 沙盒行为） ([#524](https://github.com/scriptscat/scriptcat/issues/524)) [[331087c](https://github.com/scriptscat/scriptcat/commit/331087c2e86580fc514fe5ffb4c2b1e665d4da71)] (by @cyfung1031)
- ⚡ React 元件 key ([#526](https://github.com/scriptscat/scriptcat/issues/526)) [[df995ed](https://github.com/scriptscat/scriptcat/commit/df995ed2e63800cf523e8ba868bed991829894ef)] (by @cyfung1031)
- 💄 调整 UI ([#523](https://github.com/scriptscat/scriptcat/issues/523)) [[ec1fcd2](https://github.com/scriptscat/scriptcat/commit/ec1fcd27083dce2b988e9aecade215f097978c8e)] (by @rkscv)
- ⚡ GM 优化 及其他更新 ([#519](https://github.com/scriptscat/scriptcat/issues/519)) [[3d3be2c](https://github.com/scriptscat/scriptcat/commit/3d3be2ccae3a5218ecca91605f6b483a8d9aa2e4)] (by @cyfung1031)
- ⚡ GM 注入优化 ([#517](https://github.com/scriptscat/scriptcat/issues/517)) [[1d6d52a](https://github.com/scriptscat/scriptcat/commit/1d6d52af3ff75cf547216284e0e837f3a44e7639)] (by @cyfung1031)
- ⚡ 輕微調整 ([#512](https://github.com/scriptscat/scriptcat/issues/512)) [[b3ceea3](https://github.com/scriptscat/scriptcat/commit/b3ceea35edb29bf735cb75f216c041d18cf901d3)] (by @cyfung1031)
- 📝 更新文档 ([#488](https://github.com/scriptscat/scriptcat/issues/488)) ([89b9848](https://github.com/scriptscat/scriptcat/commit/89b984866e90f0fd610da973b0952d801fe07a27))
- ⚡ TreeShaking ([#509](https://github.com/scriptscat/scriptcat/issues/509)) [[4e70591](https://github.com/scriptscat/scriptcat/commit/4e705916a406d13eb09ee1aa2839b6ffeb484222)] (by @cyfung1031)
- ⚡ Tree Shaking ([#505](https://github.com/scriptscat/scriptcat/issues/505)) [[05a71f0](https://github.com/scriptscat/scriptcat/commit/05a71f0afe7087f90c7be9c3a694986b8f0f65f8)] (by @cyfung1031)
- 🎨 修改.d.ts [#475](https://github.com/scriptscat/scriptcat/issues/475) [[a3adc00](https://github.com/scriptscat/scriptcat/commit/a3adc00708232835463d8f2ac6c49d7de259cb4f)]
- ⚡ 加快 Render ([#491](https://github.com/scriptscat/scriptcat/issues/491)) [[1b266be](https://github.com/scriptscat/scriptcat/commit/1b266bec9b17053ea046f25ce0aab2f32afb6e9c)] (by @cyfung1031)
- 🎨 修复 eslint 问题 ([f49e20f](https://github.com/scriptscat/scriptcat/commit/f49e20faa78ca377f3404323cd13a5a7a5c27dca))

### Fixed

- 🐛 修复脚本列表打勾时筛选会失效的问题 [#507](https://github.com/scriptscat/scriptcat/issues/507) ([8830490](https://github.com/scriptscat/scriptcat/commit/8830490007102d91df1f7dd4647f9fdf3de1417b))
- 🐛 脚本名宽度设置为固定宽度 [#495](https://github.com/scriptscat/scriptcat/issues/495) ([33edabd](https://github.com/scriptscat/scriptcat/commit/33edabdb7bbde618f6a88237f15fd6e87d4ee4ab))
- 🐛 调整 init ([#543](https://github.com/scriptscat/scriptcat/issues/543)) [[0341d3c](https://github.com/scriptscat/scriptcat/commit/0341d3cf0442fc2e9c4c6dba4fbfb3a89dc522f1)] (by @cyfung1031)
- 🐛 favicon 超时 ([#540](https://github.com/scriptscat/scriptcat/issues/540)) [[4484f01](https://github.com/scriptscat/scriptcat/commit/4484f0180895fd53c3f03045c758de8fdad49679)] (by @cyfung1031)
- 🐛 修复 GM download done 属性丢失的问题 [[ed465e8](https://github.com/scriptscat/scriptcat/commit/ed465e8622277643286b9d32ccb62947230f5706)]
- 🐛 MV3 兼容 Opera 以及 Firefox 调整 ([#534](https://github.com/scriptscat/scriptcat/issues/534)) [[645a58f](https://github.com/scriptscat/scriptcat/commit/645a58f67af9f2d6b69ffbbb5e0d008dc726d80b)] (by @cyfung1031)
- 🐛 React 代码格式 lint ([#536](https://github.com/scriptscat/scriptcat/issues/536)) [[9ab4b22](https://github.com/scriptscat/scriptcat/commit/9ab4b225e803c337bf9c86f77fc2c64200ee4635)] (by @cyfung1031)
- 🐛 修复 textarea 占位符换行问题 ([#538](https://github.com/scriptscat/scriptcat/issues/538)) [[9de4bb6](https://github.com/scriptscat/scriptcat/commit/9de4bb6cc02ca15363a2491eee2c9b387ebf5c4b)] (by @rkscv)
- 💚 修复 lint 问题 [[8cf0ce8](https://github.com/scriptscat/scriptcat/commit/8cf0ce8ebd172aec86b9f250711e4375fc00aa81)]
- 🐛 修复 GM_cookie.set 操作 [#520](https://github.com/scriptscat/scriptcat/issues/520) [[3d49376](https://github.com/scriptscat/scriptcat/commit/3d493768678b86c0a0f48040e7670a69bd714547)]
- 🐛 修复 finalUrl 的问题 [[93fe904](https://github.com/scriptscat/scriptcat/commit/93fe904ed3cd4e819ca4549e77d288884022e0f2)]
- 🐛 修复脚本名称中有特殊字符导致脚本加载失败的问题 [#516](https://github.com/scriptscat/scriptcat/issues/516) [[07631ef](https://github.com/scriptscat/scriptcat/commit/07631ef972b456574b2a0ed4e9ce4298b084c5e7)]
- 🐛 修复 sandbox 关键字导致后台脚本无法正常运行的问题 ([e11dd11](https://github.com/scriptscat/scriptcat/commit/e11dd113cadcb0216448b4019d4f8cfba8522129))
- 🐛 修复 GM API 加载问题 [[9f6bffc](https://github.com/scriptscat/scriptcat/commit/9f6bffc323cf524d767a0aa66b8e09411d6476c7)]
- 🐛 修复 Google Drive 授权提示问题 [[b08187a](https://github.com/scriptscat/scriptcat/commit/b08187a9f580ebe8fca4f313315028e8895d09a7)]
- 🐛 兼容 TM 的 GM_info [#478](https://github.com/scriptscat/scriptcat/issues/478) [[de49c50](https://github.com/scriptscat/scriptcat/commit/de49c50f1835acdaec7c47782deb55811e676f88)]
- 🐛 处理窄屏显示问题 [#495](https://github.com/scriptscat/scriptcat/issues/495) [[a23f6d1](https://github.com/scriptscat/scriptcat/commit/a23f6d1e12863149e026dfe1691861a17deaeed8)]
- 🐛 处理 GM_setValue 的返回值 [#493](https://github.com/scriptscat/scriptcat/issues/493) [[dfc24a5](https://github.com/scriptscat/scriptcat/commit/dfc24a50bc71f4cb65d1e81f520ce4c350696d19)]
- 🐛 addStyle 代碼修正 ([#500](https://github.com/scriptscat/scriptcat/issues/500)) [[1f346cc](https://github.com/scriptscat/scriptcat/commit/1f346cc64e26b148b402756731e5d22a6260ccca)] (by @cyfung1031)

### Miscellaneous

- 🌐 添加俄语翻译 ([ea056b0](https://github.com/scriptscat/scriptcat/commit/ea056b088c4404df860f151ce67aadcc48257765))
- 🌐 删除语言映射 ([ab66fb5](https://github.com/scriptscat/scriptcat/commit/ab66fb5eb01762299164379d151c29b8139135ad))
- 🌐 根据前缀去匹配 ([505e112](https://github.com/scriptscat/scriptcat/commit/505e112d3ccb3365da2bb403f37bc6482a59051b))
- ⬆️ 升级 vitest [[bbc2550](https://github.com/scriptscat/scriptcat/commit/bbc2550fe2ed5105a1d27666ec68ca484e424ac3)]
- 🌐 增加 i18n 翻译 ([#525](https://github.com/scriptscat/scriptcat/issues/525)) [[8f677ce](https://github.com/scriptscat/scriptcat/commit/8f677cea06cc3f31902276b18112d353f4f3730e)] (by @cyfung1031)
- 📝 修复文档 pnpm 错误 ([#527](https://github.com/scriptscat/scriptcat/issues/527)) [[324301a](https://github.com/scriptscat/scriptcat/commit/324301ab1b448e778c50bed47d40a18d9db76786)] (by @cyfung1031)
- 🌐 修复 i18n 路径 [[4fc50cd](https://github.com/scriptscat/scriptcat/commit/4fc50cd15ed871f675ad3cdcb48fc91c0e3abd91)]
- 🧪 添加 GM.\*的单元测试 [[4e91b36](https://github.com/scriptscat/scriptcat/commit/4e91b36b64220153fefe8b3a91575e0c302bf757)]
- ⚡ 更快导入腳本 ([#498](https://github.com/scriptscat/scriptcat/issues/498)) ([6b7ee3d](https://github.com/scriptscat/scriptcat/commit/6b7ee3d177b7d48e59e1e31053d9007265a4d5cc))
- ♻️ 庫引用整理 ([#494](https://github.com/scriptscat/scriptcat/issues/494)) ([55e2ecd](https://github.com/scriptscat/scriptcat/commit/55e2ecd35ffbf41a8e07eadf2da89f0afbc3685e))
- 🔨 添加更新日志生成脚本 ([a4f5dd4](https://github.com/scriptscat/scriptcat/commit/a4f5dd4c096a593c23a33d72a04352ceb016f50a))
- 📝 Update README [[b1d64f0](https://github.com/scriptscat/scriptcat/commit/b1d64f011e81ebd6a07ac2cd6ee62ecb23ec1c2a)]
- 📝 Update README ([b20e36e](https://github.com/scriptscat/scriptcat/commit/b20e36ef889bae990c765d9c361434c5261fcbd1))
- Merge branch 'release/mv3' [[eead31f](https://github.com/scriptscat/scriptcat/commit/eead31fa67a06c47bde214427b9860b3a1c98a3d)]
- 🌐 处理 arco i18n 问题 [#507](https://github.com/scriptscat/scriptcat/issues/507) [[79ad287](https://github.com/scriptscat/scriptcat/commit/79ad287553e0bb679c2ab811dc924b9e18059c4c)]
- 👷 调整 eslint 规则 [[ee54ff6](https://github.com/scriptscat/scriptcat/commit/ee54ff676db7b5761abc48be0d2b1cef465fb40f)]
- 🔨 修改 changlog 生成脚本 [[924d4f8](https://github.com/scriptscat/scriptcat/commit/924d4f8d28e3764301112993ebb8e7f96a7a96fd)]
- 📝 Release v0.19.0-beta [[25fcffc](https://github.com/scriptscat/scriptcat/commit/25fcffcd43d5c08d77ebe32cfa6ea8eb70186038)]
- 🌐 issue 模板提供英文版本 [[37217d4](https://github.com/scriptscat/scriptcat/commit/37217d423d7e410893c68ef74963a6c14c38fafe)]
- 📝 调整 readme [[acb5731](https://github.com/scriptscat/scriptcat/commit/acb5731df5141052312251073e1408426242b2e4)]
- 🌐 Update i18n README.md ([#487](https://github.com/scriptscat/scriptcat/issues/487)) [[a0d6417](https://github.com/scriptscat/scriptcat/commit/a0d641782666315eed4937d6e62bff6944d65e9d)] (by @MaxZhang)

<a name="0.16.11-beta"></a>

## 0.16.11-beta (2025-08-25)

### Added

- ✨ 优化安装的打开窗口交互 [#548](https://github.com/scriptscat/scriptcat/issues/548) [[3348f26](https://github.com/scriptscat/scriptcat/commit/3348f269de04f4d1cb6583c4b83d5cf20f6a6cc7)]

### Changed

- 🎨 (MV2) 增强 chrome.tabs.create 兼容性 ([#640](https://github.com/scriptscat/scriptcat/issues/640)) [[eb4d1ab](https://github.com/scriptscat/scriptcat/commit/eb4d1ab1dd3e298e733bb07235b1c8b2858131d1)] (by @cyfung1031)
- ⚡ 基於 MV3 版修正小量共通功能代码 ([#614](https://github.com/scriptscat/scriptcat/issues/614)) [[51f3d0c](https://github.com/scriptscat/scriptcat/commit/51f3d0c15129444b1cdabf0a936e1f01473e03f5)] (by @cyfung1031)

### Fixed

- 🐛 修复 SRI 资源校验 [[d24d9ad](https://github.com/scriptscat/scriptcat/commit/d24d9ad3f924d3ec9c677f937c711e9b32f691e5)]
- 💚 修复 lint 问题 [[2b33a70](https://github.com/scriptscat/scriptcat/commit/2b33a706a1bf80b1cc4c7b26449a371f2dc0ab99)]
- 🐛 修复 firefox service worker csp 的问题 [#533](https://github.com/scriptscat/scriptcat/issues/533) [[a1cb2e0](https://github.com/scriptscat/scriptcat/commit/a1cb2e0318f64a7362ed7b25e29218bfb35fcde5)]
- 🐛 修复下拉列表选项显示不全的问题 ([#552](https://github.com/scriptscat/scriptcat/issues/552)) [[73d6c65](https://github.com/scriptscat/scriptcat/commit/73d6c65bea67ce4ab382ab8619df2859738421c3)]
- 🐛 设置 monaco 为英文 [[77c872d](https://github.com/scriptscat/scriptcat/commit/77c872d233c371ead9e152477cfce9c690ec2fb1)]

### Miscellaneous

- 🌐 处理翻译问题 [[d0ab618](https://github.com/scriptscat/scriptcat/commit/d0ab61816ffe085beb5244180f0ada4b557dd5de)]
