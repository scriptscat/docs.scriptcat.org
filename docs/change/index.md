---
title: 更新日志
---

import GithubStar from '@site/src/components/GithubStar';
import Showcase from '@site/src/components/Showcase';

<Showcase />

<GithubStar variant="bar" scene="changelog" />

Beta 版本更新日志请查看 [Beta 更新日志](./beta-changelog.md)

⚠️ 请注意，如果你使用的 Windows 8/7/XP 系统，或者浏览器内核版本低于\<120，需要自行手动安装[旧版脚本猫](https://bbs.tampermonkey.net.cn/thread-3068-1-1.html)，v0.16.x 是最后一个支持 Manifest V2 的版本，安装步骤可以参考：[加载解压缩方式安装扩展](/docs/use/use/#%E5%8A%A0%E8%BD%BD%E8%A7%A3%E5%8E%8B%E7%BC%A9%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95)。

<a name="1.4.0"></a>

## 1.4.0 (2026-06-26)

本次更新为 Firefox MV3 适配进行了底层重构准备，并带来编辑器体验提升（编辑菜单、Ctrl+Shift+F 格式化、Monaco quick fix）、获取脚本多平台搜索引擎选择、`@unwrap` / `window.onurlchange` / `@run-at context-menu` 等新能力，全面加固云存储同步可靠性，并修复大量 GM API、UI 与稳定性问题（含长时间运行内存泄漏、原型链污染等安全漏洞）。脚本猫 AI Agent 作为预览功能在开发版 / Beta 版中提供，正式版暂未开放。

### 🚀 主要新功能

- 🧪 脚本猫 AI Agent（**预览功能，仅开发版 / Beta 版提供，正式版暂未开放**）— AI 驱动的智能代理系统，支持对话式交互、工具调用、Skill 系统、MCP 协议等 ([#1324](https://github.com/scriptscat/scriptcat/pull/1324)) (by @CodFrm)
- ✨ 支持 `@unwrap` 元数据标签 ([#1213](https://github.com/scriptscat/scriptcat/pull/1213)) (by @cyfung1031)
- ✨ 以 Navigation API 实现 TM 的 `window.onurlchange` ([#1315](https://github.com/scriptscat/scriptcat/pull/1315)) (by @cyfung1031)
- ✨ 恢复 `@run-at context-menu` 支持 ([#1442](https://github.com/scriptscat/scriptcat/pull/1442)) (by @cyfung1031)
- ✨ 获取脚本支持多平台搜索引擎选择 ([#1295](https://github.com/scriptscat/scriptcat/pull/1295)) (by @CodFrm)
- ✨ 新增更多图标服务供应商 ([#1333](https://github.com/scriptscat/scriptcat/pull/1333)) (by @cyfung1031)
- ✨ 脚本列表最后更新列添加检查更新图标 ([#1304](https://github.com/scriptscat/scriptcat/pull/1304)) (by @CodFrm)
- ✨ 优化编辑冲突与脚本名称冲突处理 ([#1223](https://github.com/scriptscat/scriptcat/pull/1223)) (by @cyfung1031)

### 🧑‍💻 编辑器

- ✨ 编辑器添加编辑菜单（查找、替换、撤销等）([#1303](https://github.com/scriptscat/scriptcat/pull/1303)) (by @CodFrm)
- ✨ 编辑器支持 Ctrl+Shift+F 格式化 ([#1415](https://github.com/scriptscat/scriptcat/pull/1415)) (by @cyfung1031)
- ✨ 优化 Monaco quick fix 与用户脚本元数据提示 ([#1461](https://github.com/scriptscat/scriptcat/pull/1461)) (by @cyfung1031)
- 🐛 修复 Ctrl-F / Ctrl-H 快捷键 ([#1312](https://github.com/scriptscat/scriptcat/pull/1312)) (by @cyfung1031)
- 🐛 修复 ESLint 修复功能失效的问题 [#1079](https://github.com/scriptscat/scriptcat/issues/1079) ([#1184](https://github.com/scriptscat/scriptcat/pull/1184)) (by @cyfung1031)
- 🐛 修复编辑器的 CSS 布局问题 ([#1460](https://github.com/scriptscat/scriptcat/pull/1460)) (by @cyfung1031)
- 🐛 修复 ScriptEditor 脚本列表亮色显示问题 ([#1288](https://github.com/scriptscat/scriptcat/pull/1288)) (by @CodFrm)
- 🐛 修复并优化 ScriptEditor 相关问题 ([#1258](https://github.com/scriptscat/scriptcat/pull/1258)) (by @cyfung1031)

### ⚡️ 性能优化

- 🚑 修复脚本猫长时间运行时可能出现的内存泄漏问题 ([#1401](https://github.com/scriptscat/scriptcat/pull/1401)) (by @cyfung1031)
- ⚡️ 移除 Baidu filesystem 对全局 DNR 规则的依赖，改为请求级禁用 cookie ([#1377](https://github.com/scriptscat/scriptcat/pull/1377)) (by @cyfung1031)
- ⚡️ 优化获取脚本的多平台搜索引擎选择 ([#1379](https://github.com/scriptscat/scriptcat/pull/1379)) (by @cyfung1031)
- ⚡️ 优化安装页 loadingStatus 改用等宽字体避免跳动 ([#1381](https://github.com/scriptscat/scriptcat/pull/1381)) (by @cyfung1031)
- ⚡️ 优化 pushValue 处理 ([#1403](https://github.com/scriptscat/scriptcat/pull/1403)) (by @cyfung1031)
- ⚡️ 更完整的 permission 检查，更好的 userScript 权限提示 ([#1251](https://github.com/scriptscat/scriptcat/pull/1251)) (by @cyfung1031)
- ⚡️ 优化 MessageConnect 的内存管理及清理机制 ([#1248](https://github.com/scriptscat/scriptcat/pull/1248)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 加固云存储同步可靠性（Dropbox / WebDAV / Google Drive / OneDrive 认证、路径处理与重试逻辑）([#1374](https://github.com/scriptscat/scriptcat/pull/1374) ~ [#1395](https://github.com/scriptscat/scriptcat/pull/1395)) (by @cyfung1031)
- 🐛 修复云存储同步多项问题：OneDrive 零字节上传、Google Drive / OneDrive 错误规范化、S3 自定义元数据补充 modifiedDate ([#1405](https://github.com/scriptscat/scriptcat/pull/1405)) ([#1406](https://github.com/scriptscat/scriptcat/pull/1406)) ([#1408](https://github.com/scriptscat/scriptcat/pull/1408)) (by @cyfung1031)
- 🐛 WebDAV verify 移除写探针，避免坚果云等根目录不可写服务被误判 ([#1445](https://github.com/scriptscat/scriptcat/pull/1445)) (by @CodFrm)
- 🐛 修复缺少站点访问权限时跨域请求异常的问题 ([#1477](https://github.com/scriptscat/scriptcat/pull/1477)) (by @cyfung1031)
- 🐛 修复 Edge Android 移动端 popup 适配问题 [#686](https://github.com/scriptscat/scriptcat/issues/686) ([#1507](https://github.com/scriptscat/scriptcat/pull/1507)) (by @CodFrm)
- 🐛 修复初始加载时出现白屏背景的问题 [#1497](https://github.com/scriptscat/scriptcat/issues/1497) ([#1498](https://github.com/scriptscat/scriptcat/pull/1498)) (by @cyfung1031)
- 🐛 修复消息连接（GM API / 端口）未正确清理的问题 ([#1474](https://github.com/scriptscat/scriptcat/pull/1474)) (by @cyfung1031)
- 🐛 修复缺少 search 时 `@match` template 不匹配的问题 ([#1466](https://github.com/scriptscat/scriptcat/pull/1466)) (by @cyfung1031)
- 🐛 新增 `protoBaseDescs` 修正 Tampermonkey 半沙盒的祖先类继承 ([#1463](https://github.com/scriptscat/scriptcat/pull/1463)) (by @cyfung1031)
- 🐛 修复 `GM_xmlhttpRequest` msgConn 的 null 处理缺失 ([#1433](https://github.com/scriptscat/scriptcat/pull/1433)) (by @cyfung1031)
- 🐛 修复 GM xhr 不正确处理异常 onloadend 的问题 ([#1412](https://github.com/scriptscat/scriptcat/pull/1412)) (by @cyfung1031)
- 🐛 修复 ScriptEditor 列表动态更新与显示问题 ([#1414](https://github.com/scriptscat/scriptcat/pull/1414)) (by @cyfung1031)
- 🐛 解决并发 xhr 的 session rule 数量问题 ([#1353](https://github.com/scriptscat/scriptcat/pull/1353)) (by @cyfung1031)
- 🐛 修复 cron 表达式错误导致整个页面崩溃 ([#1327](https://github.com/scriptscat/scriptcat/pull/1327)) (by @cyfung1031)
- 🐛 修复批量检查脚本时单个超时导致全部失败 ([#1265](https://github.com/scriptscat/scriptcat/pull/1265)) (by @cyfung1031)
- 🐛 新增 extensionEnv 处理 isIncognito、userAgent 与 run-in ([#1368](https://github.com/scriptscat/scriptcat/pull/1368)) (by @cyfung1031)
- 🐛 修复新手指引按钮显示不全 [#1396](https://github.com/scriptscat/scriptcat/issues/1396) ([#1398](https://github.com/scriptscat/scriptcat/pull/1398)) (by @cyfung1031)
- 🐛 修复脚本管理页面的 tooltip 提示被遮挡问题 [#1386](https://github.com/scriptscat/scriptcat/issues/1386) ([#1387](https://github.com/scriptscat/scriptcat/pull/1387)) (by @Xdy1579883916)
- 🐛 修复 Sidebar 导致卡片模式下的尺寸调整异常 [#1179](https://github.com/scriptscat/scriptcat/issues/1179) ([#1373](https://github.com/scriptscat/scriptcat/pull/1373)) (by @cyfung1031)
- 🐛 修复本地文件拖拽安装时错误设置 origin 的问题 ([#1371](https://github.com/scriptscat/scriptcat/pull/1371)) (by @cyfung1031)
- 🐛 修复语言切换提示信息 ([#1380](https://github.com/scriptscat/scriptcat/pull/1380)) (by @cyfung1031)
- 🐛 优化日志显示 UI ([#1372](https://github.com/scriptscat/scriptcat/pull/1372)) (by @cyfung1031)
- 🐛 修复 UserConfigPanel CSS ([#1361](https://github.com/scriptscat/scriptcat/pull/1361)) (by @cyfung1031)
- 🐛 create_context 的空对象改为 `Object.create(null)` ([#1397](https://github.com/scriptscat/scriptcat/pull/1397)) (by @cyfung1031)
- 🐛 修复订阅脚本的静默更新与 connect 权限逻辑 ([#1201](https://github.com/scriptscat/scriptcat/pull/1201)) (by @cyfung1031)
- 🐛 修复运行日志页面查询按钮不刷新时间 ([#1294](https://github.com/scriptscat/scriptcat/pull/1294)) (by @CodFrm)

### 🔒 安全性改进

- 🔒 修复通过不可信 YAML user-config 键导致的原型链污染漏洞 ([#1494](https://github.com/scriptscat/scriptcat/pull/1494)) (by @qdzsh)
- 🔒 修复所有 npm 依赖安全漏洞 ([#1350](https://github.com/scriptscat/scriptcat/pull/1350)) ([#1364](https://github.com/scriptscat/scriptcat/pull/1364)) ([#1365](https://github.com/scriptscat/scriptcat/pull/1365)) (by @cyfung1031)

### ♻️ 重构与兼容性

- ♻️ 为 Firefox MV3 适配进行底层重构 ([#1457](https://github.com/scriptscat/scriptcat/pull/1457)) ([#1480](https://github.com/scriptscat/scriptcat/pull/1480)) (by @cyfung1031)
- ♻️ 重构脚本资源更新逻辑（updateResource）与并发控制，并恢复资源缓存兼容性 ([#1193](https://github.com/scriptscat/scriptcat/pull/1193)) (by @cyfung1031)
- ♻️ 使用 JSZipp 替换 jszip 处理 ZIP（备份导入 / 导出），并移除未使用的 jszip 依赖 ([#1479](https://github.com/scriptscat/scriptcat/pull/1479)) (by @cyfung1031)
- ♻️ Offscreen 与 ServiceWorker 通信统一走 postMessage 通道 ([#1299](https://github.com/scriptscat/scriptcat/pull/1299)) (by @CodFrm)
- ♻️ 重构 VSCodeConnect 代码 ([#1170](https://github.com/scriptscat/scriptcat/pull/1170)) (by @cyfung1031)
- ⚡️ 压缩 ts.worker.js 至 4MB 以通过 AMO 验证，修复 MV3 background permission 错误 ([#1221](https://github.com/scriptscat/scriptcat/pull/1221)) (by @cyfung1031)

### 🌐 国际化

- 🌐 修正多语言术语翻译（重点完善繁体中文）并新增翻译术语规范 ([#1468](https://github.com/scriptscat/scriptcat/pull/1468)) (by @cyfung1031)

### 其它

- ✨ 将 fetchIconByDomain 图标服务改为 scriptcat.org ([#1268](https://github.com/scriptscat/scriptcat/pull/1268)) (by @cyfung1031)
- 🔥 移除 Crowdin 与 ach-UG 伪语言相关内容 ([#1385](https://github.com/scriptscat/scriptcat/pull/1385)) (by @CodFrm)

<a name="0.16.15"></a>

## 0.16.15 (2026-05-19)

### 🐛 Bug 修复

- 🐛 修复 MV2 打包脚本构建命令 [#1423](https://github.com/scriptscat/scriptcat/issues/1423) (by @CodFrm)
- 🐛 针对 WebExtensions API Changes (Firefox 149-152) 做修正（含 CSP 调整）([#1448](https://github.com/scriptscat/scriptcat/pull/1448)) (by @cyfung1031)

<a name="0.16.14"></a>

## 0.16.14 (2026-04-26)

### ✨ 主要新功能

- ✨ FirefoxMV2 同步 MV3 主要项目：升级 TypeScript 至 4.9、tsconfig 至 es2022；脚本范本（normal/crontab/background）对齐 MV3 版本；cron 升级支持 `once(...)` 表达式；Monaco Editor 多国语言支持 ([#1331](https://github.com/scriptscat/scriptcat/pull/1331)) (by @cyfung1031)

### ♻️ 重构与兼容性

- 🔥 跟随 MV3 移除 axios 依赖 ([#1339](https://github.com/scriptscat/scriptcat/pull/1339)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修复 window.parent 嵌套 iframe 接收不到 postMessage 消息的问题 ([#1335](https://github.com/scriptscat/scriptcat/pull/1335)) (by @cyfung1031)

<a name="1.3.2"></a>

## 1.3.2 (2026-03-28)

### 🐛 Bug 修复

- 🐛 删除 fetchScriptBody 的 Accept，避免触发 Error 406 ([#1306](https://github.com/scriptscat/scriptcat/pull/1306)) (by @cyfung1031)
- 🐛 针对 WebDAV 修复 cookies 认证冲突 及 authType 支持 ([#1308](https://github.com/scriptscat/scriptcat/pull/1308)) (by @CodFrm)
- 🐛 正确显示格式化错误 ([#1310](https://github.com/scriptscat/scriptcat/pull/1310)) (by @cyfung1031)
- 🐛 设备相关配置改用 chrome.storage.local，避免跨设备同步 ([#1309](https://github.com/scriptscat/scriptcat/pull/1309)) (by @CodFrm)
- 🐛 修复代码编辑框提示问题 ([#1301](https://github.com/scriptscat/scriptcat/pull/1301)) (by @cyfung1031)
- 🐛 修复运行日志页面日期选择弹出框被容器裁剪的问题 ([#1292](https://github.com/scriptscat/scriptcat/pull/1292)) (by @cyfung1031)
- 🐛 修复未绑定网盘时仍显示解绑按钮的问题 ([#1291](https://github.com/scriptscat/scriptcat/pull/1291)) (by @CodFrm)
- 🐛 修复弹出框被遮挡的问题 ([#1290](https://github.com/scriptscat/scriptcat/pull/1290)) (by @cyfung1031)

<a name="1.3.1"></a>

## 1.3.1 (2026-03-13)

### 🐛 Bug 修复

- 🚑 修复其他扩展注入 chrome.runtime 导致环境误判的问题 [#1280](https://github.com/scriptscat/scriptcat/issues/1280) ([#1281](https://github.com/scriptscat/scriptcat/pull/1281)) (by @CodFrm)

### 其它

- ✅ 添加 Playwright E2E 测试及 GM API 功能测试 ([#1283](https://github.com/scriptscat/scriptcat/pull/1283)) (by @CodFrm)

<a name="1.3.0"></a>

## 1.3.0 (2026-03-10)

本次更新带来了 Amazon S3 存储、脚本运行时期选项、不依赖外部网站安装等新功能，大幅优化了通讯机制和 React 性能，修复了大量 GM API、UI 和稳定性问题，并进行了广泛的代码质量改良。

### 🚀 主要新功能

- ✨ 增加 Amazon S3 存储 [#1146](https://github.com/scriptscat/scriptcat/issues/1146) ([#1189](https://github.com/scriptscat/scriptcat/pull/1189)) (by @CodFrm)
- ✨ 脚本运行时期选项 ([#895](https://github.com/scriptscat/scriptcat/pull/895)) (by @CodFrm)
- ✨ 不依赖外部网站访问进行安装 ＋ 安装页版面调整 ([#842](https://github.com/scriptscat/scriptcat/pull/842)) (by @cyfung1031)
- ✨ 关闭脚本功能后展示灰色图标 [#897](https://github.com/scriptscat/scriptcat/issues/897) (by @CodFrm)
- ✨ 优化菜单展开项为0时的交互逻辑 [#868](https://github.com/scriptscat/scriptcat/issues/868) (by @CodFrm)
- ✨ 范本预设 `@noframes` 避免新手踩坑 ([#900](https://github.com/scriptscat/scriptcat/pull/900)) (by @cyfung1031)
- ✨ 防止脚本安装链结因脚本名字改了而被误判为安装而非更新 ([#824](https://github.com/scriptscat/scriptcat/pull/824)) (by @cyfung1031)
- ✨ `@grant` 冲突校验修正，增加 meta 重复声明错误提示 ([#902](https://github.com/scriptscat/scriptcat/pull/902)) (by @cyfung1031)
- ✨ 接受 `@version` 没有或空值 ([#1216](https://github.com/scriptscat/scriptcat/pull/1216)) (by @cyfung1031)
- ✨ 调整隐藏编辑框侧边栏位置 [#1185](https://github.com/scriptscat/scriptcat/issues/1185) ([#1254](https://github.com/scriptscat/scriptcat/pull/1254)) (by @CodFrm)

### 🧩 GM API 变更

- 🐛 修复 GM_addElement 问题，将操作放到 content 环境 ([#1233](https://github.com/scriptscat/scriptcat/pull/1233)) (by @cyfung1031)
- 🐛 `GM_download` 添加 `conflictAction` 参数 ([#1250](https://github.com/scriptscat/scriptcat/pull/1250)) (by @cyfung1031)
- 🐛 修正 GM API 异步声明，正确返回 Promise ([#1169](https://github.com/scriptscat/scriptcat/pull/1169)) (by @cyfung1031)
- ♻️ 兼容 FF: GM_setClipboard ([#928](https://github.com/scriptscat/scriptcat/pull/928)) (by @cyfung1031)
- 🐛 修复 GM_value 问题 [#1192](https://github.com/scriptscat/scriptcat/issues/1192) (by @CodFrm)
- 🐛 修复 download 文件名不支持文件夹的问题 ([#1203](https://github.com/scriptscat/scriptcat/pull/1203)) (by @cyfung1031)

### ⚡️ 性能优化

- ♻️ 重构通讯机制：采用 storage.local 广播 + 符合 Firefox MV3 scripting 规范 + 不可追踪的动态同步 MessageFlag ([#1067](https://github.com/scriptscat/scriptcat/pull/1067)) (by @cyfung1031)
- ⚡️ 修正 React 重绘问题（ScriptCard & ScriptTable）([#1182](https://github.com/scriptscat/scriptcat/pull/1182)) (by @cyfung1031)
- ⚡️ 修正 React 重绘问题（Popup）([#1181](https://github.com/scriptscat/scriptcat/pull/1181)) (by @cyfung1031)
- ⚡️ 优化 Repo 性能 ([#1232](https://github.com/scriptscat/scriptcat/pull/1232)) (by @CodFrm)
- ⚡️ 把 metadata 从 chrome.storage.session 抽走 ([#1027](https://github.com/scriptscat/scriptcat/pull/1027)) (by @cyfung1031)
- ⚡️ 改善 charset detection ([#1140](https://github.com/scriptscat/scriptcat/pull/1140)) (by @cyfung1031)
- ⚡️ 把 icon 根据 url 储存，避免多个脚本储存同一 icon 造成浪费 ([#909](https://github.com/scriptscat/scriptcat/pull/909)) (by @cyfung1031)
- ⚡️ parseMetadata 代码优化 ([#903](https://github.com/scriptscat/scriptcat/pull/903)) (by @cyfung1031)
- 🐛 修复内存泄漏和对象属性暴露 ([#1242](https://github.com/scriptscat/scriptcat/pull/1242)) (by @cyfung1031)
- ♻️ 移除 Redux，简化状态管理 ([#1206](https://github.com/scriptscat/scriptcat/pull/1206)) (by @cyfung1031)

### 🧑‍💻 编辑器

- ✨ 优化 Monaco Editor 设定，加 `/* global xxx */` 修正 ([#1012](https://github.com/scriptscat/scriptcat/pull/1012)) (by @cyfung1031)
- ✨ Monaco Editor hints 多国语言化 及 增加 `@require-css` 提示 ([#960](https://github.com/scriptscat/scriptcat/pull/960)) (by @cyfung1031)

### 🐛 Bug 修复

- 🐛 修复与隐身窗口检查权限冲突导致反复重启的问题 (by @CodFrm)
- 🐛 修复 include `*?*` 表达式处理问题 [#1271](https://github.com/scriptscat/scriptcat/issues/1271) ([#1272](https://github.com/scriptscat/scriptcat/pull/1272)) (by @CodFrm)
- 🔒 使用 DOMPurify 清理公告通知 HTML 内容 ([#1274](https://github.com/scriptscat/scriptcat/pull/1274)) (by @CodFrm)
- 🐛 修复脚本设置-授权管理控制无效的问题 ([#1267](https://github.com/scriptscat/scriptcat/pull/1267)) (by @CodFrm)
- 🐛 修复弹出内容跟随屏幕滚动的问题 [#1256](https://github.com/scriptscat/scriptcat/issues/1256) ([#1263](https://github.com/scriptscat/scriptcat/pull/1263)) (by @cyfung1031)
- 🐛 修复安装链接解析失败问题 [#1235](https://github.com/scriptscat/scriptcat/issues/1235) ([#1260](https://github.com/scriptscat/scriptcat/pull/1260)) (by @cyfung1031)
- 🐛 修复拖拽组件导致触发 focusin/focusout 卡顿 [#1224](https://github.com/scriptscat/scriptcat/issues/1224) ([#1243](https://github.com/scriptscat/scriptcat/pull/1243)) (by @CodFrm)
- 🐛 修复外部扩展 API 无效的问题 ([#1217](https://github.com/scriptscat/scriptcat/pull/1217)) (by @cyfung1031)
- 🐛 修复 grant 问题 ([#1199](https://github.com/scriptscat/scriptcat/pull/1199)) (by @CodFrm)
- 🐛 修正 content.js 没有 UserAgentData 问题 ([#1183](https://github.com/scriptscat/scriptcat/pull/1183)) (by @cyfung1031)
- 🐛 处理脚本编码问题 [#1115](https://github.com/scriptscat/scriptcat/issues/1115) ([#1138](https://github.com/scriptscat/scriptcat/pull/1138)) (by @CodFrm)
- 🐛 修复脚本图标展示 [#1052](https://github.com/scriptscat/scriptcat/issues/1052) ([#1104](https://github.com/scriptscat/scriptcat/pull/1104)) (by @CodFrm)
- 🐛 UnoCSS 加 prefix 解决 CSS 冲突、CSS 布局修正 ([#1013](https://github.com/scriptscat/scriptcat/pull/1013)) (by @cyfung1031)
- 🐛 选择不定期检查脚本更新时，清除现有 Alarm ([#996](https://github.com/scriptscat/scriptcat/pull/996)) (by @cyfung1031)
- 🐛 导入 & 导出 - 修正不依照脚本最后修改日期时间问题 ([#951](https://github.com/scriptscat/scriptcat/pull/951)) (by @cyfung1031)
- 🐛 修复 i18n 前缀语言脚本名和描述展示 [#1123](https://github.com/scriptscat/scriptcat/issues/1123) (by @CodFrm)
- 🐛 修正反注册未正确执行 ([#1231](https://github.com/scriptscat/scriptcat/pull/1231)) (by @cyfung1031)

### ♻️ 重构与兼容性

- ♻️ userScripts / scripting API 调整，增强兼容性（重做 #704）([#925](https://github.com/scriptscat/scriptcat/pull/925)) (by @cyfung1031)
- ♻️ Cron 相关修改：bug 修补、i18n、once 表达式增强、升级 cron 库 ([#1126](https://github.com/scriptscat/scriptcat/pull/1126)) (by @cyfung1031)
- ♻️ 重构优化脚本图标加载 ([#893](https://github.com/scriptscat/scriptcat/pull/893)) (by @CodFrm)
- ♻️ 增强文本解码 ([#1166](https://github.com/scriptscat/scriptcat/pull/1166)) (by @cyfung1031)
- ⬆️ 提升 swc 兼容内核版本 ([#1186](https://github.com/scriptscat/scriptcat/pull/1186)) (by @cyfung1031)

### 🎨 UI 改进

- 🎨 扩展图标显示数字默认修改为脚本数量 [#989](https://github.com/scriptscat/scriptcat/issues/989) (by @CodFrm)
- 🎨 让安装页面 URL 好看一点 ([#993](https://github.com/scriptscat/scriptcat/pull/993)) (by @cyfung1031)
- 🐛 重构 DraggableEntry、修正卡片高度对齐 ([#1245](https://github.com/scriptscat/scriptcat/pull/1245)) (by @cyfung1031)

### 其它

- 🔒 安全性改进（DOMPurify、npm 依赖漏洞修复）
- 👷 rspack 打包优化、打包工具链修复
- ⬆️ 依赖版本更新

**Full changelog:** [Compare v1.2.6...v1.3.0](https://github.com/scriptscat/scriptcat/compare/v1.2.6...v1.3.0)

<a name="1.2.6"></a>

## 1.2.6 (2026-02-03)

### Fixed

- 🐛 修复 structuredClone 错误 ([#1192](https://github.com/scriptscat/scriptcat/issues/1192)) [[265e122](https://github.com/scriptscat/scriptcat/commit/265e122342366b166d3122cc8da485cb1295b924)] (by @cyfung1031)

<a name="1.2.5"></a>

## 1.2.5 (2026-02-02)

### Fixed

- 🐛 修复脚本同步删除问题 [#1158](https://github.com/scriptscat/scriptcat/issues/1158) [[5e91a31](https://github.com/scriptscat/scriptcat/commit/5e91a31e02761ba8061e3de1f4d15fc1d964346c)] (by @CodFrm)
- 🐛 兼容 TM &#x60;@match www.website.com/*&#x60; ([#1165](https://github.com/scriptscat/scriptcat/issues/1165)) [[da66ff7](https://github.com/scriptscat/scriptcat/commit/da66ff70d25c3087cb8405289dc8b14df9c15f05)] (by @cyfung1031)
- 🐛 Edge最新144版本新增允许用户脚本 [#1157](https://github.com/scriptscat/scriptcat/issues/1157) [[f7c1c73](https://github.com/scriptscat/scriptcat/commit/f7c1c730cf39cae02a9e6f815e3113ea9d2a8a05)] (by @CodFrm)
- 🐛 修正 FileSystemObserver 未能持续监听问题 ([#1160](https://github.com/scriptscat/scriptcat/issues/1160)) [[9556769](https://github.com/scriptscat/scriptcat/commit/95567690d1bf77bfe8bedfd6a94c88949a77e115)] (by @cyfung1031)
- 🐛 locales.ts 小修正 ([#1154](https://github.com/scriptscat/scriptcat/issues/1154)) [[1c44b68](https://github.com/scriptscat/scriptcat/commit/1c44b680dab3a95a51eb73cf92531efd0a192dc9)] (by @cyfung1031)
- 🐛 修复弹出的更新窗口时间问题 ([#1155](https://github.com/scriptscat/scriptcat/issues/1155)) [[c17f761](https://github.com/scriptscat/scriptcat/commit/c17f761807fb9b14aff09b9b08d19e4cbe72b8a5)] (by @cyfung1031)
- 🐛 修复i18n前缀语言脚本名和描述展示 [#1123](https://github.com/scriptscat/scriptcat/issues/1123) [[7ef7355](https://github.com/scriptscat/scriptcat/commit/7ef7355632fc989fa1cad44fd2069ff840bbd8df)] (by @CodFrm)
- 🐛 处理value引用问题 [#1141](https://github.com/scriptscat/scriptcat/issues/1141) ([#1147](https://github.com/scriptscat/scriptcat/issues/1147)) [[0892fcd](https://github.com/scriptscat/scriptcat/commit/0892fcd452758030553c33ddf14f1ce4bc6d3efc)] (by @CodFrm)

<a name="1.2.4"></a>

## 1.2.4 (2026-01-07)

修复了同步功能的bug，修复版本更新不会再主动打开更新日志页面

### Added

- ✨ 同步删除默认设置为关闭 ([#958](https://github.com/scriptscat/scriptcat/issues/958)) [[9c4c7dc](https://github.com/scriptscat/scriptcat/commit/9c4c7dc411357746db43a306d97ac41a71f2b49c)] (by @cyfung1031)
- ✨ 编辑器支持 GM.\* ([#1129](https://github.com/scriptscat/scriptcat/issues/1129)) [[bea0192](https://github.com/scriptscat/scriptcat/commit/bea0192c6cc50eff2ed4e1cc5dcc25f36bbe10e7)] (by @cyfung1031)

### Changed

- ♻️ 优化更新日志页面打开逻辑 [#1110](https://github.com/scriptscat/scriptcat/issues/1110) [[d3ffedc](https://github.com/scriptscat/scriptcat/commit/d3ffedcffe752ca548f87f1640072fcd871b8604)] (by @CodFrm)

### Fixed

- 🐛 scriptcat.d.tpl &amp; type 修正 ([#1130](https://github.com/scriptscat/scriptcat/issues/1130)) [[dd22ef5](https://github.com/scriptscat/scriptcat/commit/dd22ef544684d69e24a7aae098cb05cbab03daa8)] (by @cyfung1031)
- 🐛 修复云同步问题 ([#1133](https://github.com/scriptscat/scriptcat/issues/1133)) [[a9383d2](https://github.com/scriptscat/scriptcat/commit/a9383d2012eb3953dc33c8886ce3891f404fa100)] (by @CodFrm)
- 🐛 修正 &#x60;GM_addElement(&quot;tagName&quot;)&#x60; 错误 ([#1120](https://github.com/scriptscat/scriptcat/issues/1120)) [[ad19de5](https://github.com/scriptscat/scriptcat/commit/ad19de5c1793c8c079bedbf1b11c7c2ae27a469e)] (by @cyfung1031)
- 🐛 删除清理逻辑和优化 checkuserscript 逻辑 ([#1113](https://github.com/scriptscat/scriptcat/issues/1113)) [[e635911](https://github.com/scriptscat/scriptcat/commit/e635911a3c11c3cb8acd1cfd507cb777e5ee7236)] (by @CodFrm)

### Miscellaneous

- 🏷️ typescript 修订 ([#1127](https://github.com/scriptscat/scriptcat/issues/1127)) [[b455724](https://github.com/scriptscat/scriptcat/commit/b4557244191018c18d5ce8ea8e8627bcfb7f7cdd)] (by @cyfung1031)
- 📝 example 注释补充 ([#1131](https://github.com/scriptscat/scriptcat/issues/1131)) [[292549e](https://github.com/scriptscat/scriptcat/commit/292549ed0f65952fe9f269aace23eefc7d6a3a0f)] (by @cyfung1031)

<a name="1.2.3"></a>

## 1.2.3 (2025-12-20)

一些 bug 修复

### Changed

- ⚡ 优化下一次运行时间显示 [#1093](https://github.com/scriptscat/scriptcat/issues/1093) [[324ce51](https://github.com/scriptscat/scriptcat/commit/324ce515c84699ca8d3bf1ee447fc6ef0656ae0d)] (by @CodFrm)

### Fixed

- 🐛 early 脚本处理 url 匹配问题 ([#1096](https://github.com/scriptscat/scriptcat/issues/1096)) [[a77effb](https://github.com/scriptscat/scriptcat/commit/a77effbab5ab4d1752065ef943d9c050ff99c066)] (by @CodFrm)
- 🐛 处理弹出的更新窗口显示时间过短的问题 ([#1088](https://github.com/scriptscat/scriptcat/issues/1088)) [[b2b2d5c](https://github.com/scriptscat/scriptcat/commit/b2b2d5c41ff70ee5430f7d8d156f480ac8fc3a1a)] (by @cyfung1031)
- 🐛 修复开启用户脚本通知显示异常的问题 ([#1086](https://github.com/scriptscat/scriptcat/issues/1086)) ([959c4db](https://github.com/scriptscat/scriptcat/commit/959c4dbed92f7bfe22a2f8ebb775c4189b5ff076))
- 🐛 responseHeaders: &#x60;TM 兼容: \r\n&#x60; ([#1085](https://github.com/scriptscat/scriptcat/issues/1085)) [[15232c8](https://github.com/scriptscat/scriptcat/commit/15232c8543d93abfdafa1353d39d8a15d1dc385f)] (by @cyfung1031)
- 🐛 处理 GM xhr 的问题 ([#1082](https://github.com/scriptscat/scriptcat/issues/1082)) [[3d987c3](https://github.com/scriptscat/scriptcat/commit/3d987c300242a3c765146359c35ecd6d998f792c)] (by @CodFrm)

### Miscellaneous

- 🌐 Handling i18n issues on popup pages [#1081](https://github.com/scriptscat/scriptcat/issues/1081) [[6b17d71](https://github.com/scriptscat/scriptcat/commit/6b17d7100e8572d72b3b7aaf8ea38be9cdf33f5f)] (by @CodFrm)

<a name="1.2.2"></a>

## 1.2.2 (2025-12-13)

一些 bug 修复

### Fixed

- 🐛 修复后台频繁同步的问题 ([#1076](https://github.com/scriptscat/scriptcat/issues/1076)) [[45dc39b](https://github.com/scriptscat/scriptcat/commit/45dc39baa0f3326cf12e97312ab632dc46ba40f2)] (by @CodFrm)
- 🐛 修复特殊 tab 处理的问题 [#1066](https://github.com/scriptscat/scriptcat/issues/1066) ([50904fb](https://github.com/scriptscat/scriptcat/commit/50904fb46efdea10fd57677bc2d28c770b47e861))
- 🐛 修复无 匹配规则 的脚本处理 [#1071](https://github.com/scriptscat/scriptcat/issues/1071) ([560cdc0](https://github.com/scriptscat/scriptcat/commit/560cdc01fc0fc27fb7d0e3b877c63ba431206668))
- 🐛 修复 ci 打包删除掉了 background 的可选权限问题 [[1f002f0](https://github.com/scriptscat/scriptcat/commit/1f002f0edf9892f023ae93b8522ff7c5e4a96559)] (by @CodFrm)
- 🐛 fix ignore discarded tab ([#1058](https://github.com/scriptscat/scriptcat/issues/1058)) [[6165bf4](https://github.com/scriptscat/scriptcat/commit/6165bf48eb1d53ede0561c85c30135446c2ff882)] (by @cyfung1031)

<a name="1.2.1"></a>

## 1.2.1 (2025-12-06)

进行了一些 BUG 修复，处理了后台运行选项

### Added

- ✨ 添加后台运行选项 ([#1048](https://github.com/scriptscat/scriptcat/issues/1048)) [[626e84d](https://github.com/scriptscat/scriptcat/commit/626e84dbd4dda0731e0a5ffdbdf71ae10e884489)] (by @CodFrm)

### Fixed

- 🐛 修复 document.write 导致消息监听重置的问题 ([#1055](https://github.com/scriptscat/scriptcat/issues/1055)) [[1f3a3ec](https://github.com/scriptscat/scriptcat/commit/1f3a3ec335ed4b519599e9aa3036c66b6f0d10b2)] (by @CodFrm)
- 🐛 修复列表视图筛选功能 [[e272dc6](https://github.com/scriptscat/scriptcat/commit/e272dc6ed151c15a1ef785b70ae100cb9e74a5dd)] (by @CodFrm)
- 🐛 处理 early 中的 UserAgentData ([#1045](https://github.com/scriptscat/scriptcat/issues/1045)) [[b4e08a8](https://github.com/scriptscat/scriptcat/commit/b4e08a812a08f42037837bbee54610ebc565063f)] (by @CodFrm)
- 🐛 恢复 GM_openInTab 的 useOpen 选项 [#1043](https://github.com/scriptscat/scriptcat/issues/1043) ([#1044](https://github.com/scriptscat/scriptcat/issues/1044)) [[7f30198](https://github.com/scriptscat/scriptcat/commit/7f30198909824871e694d5ffbe7088e44a6d0b45)] (by @cyfung1031)
- 🐛 修复 userScripts 未定义的问题 ([#1041](https://github.com/scriptscat/scriptcat/issues/1041)) [[4f2deda](https://github.com/scriptscat/scriptcat/commit/4f2deda69aa6aae7f6e791be1cd965a440b80e33)] (by @cyfung1031)
- 🐛 修正&#x60;AppContext&#x60;错误引用&#x60;&quot;monaco-editor&quot;&#x60; ([#983](https://github.com/scriptscat/scriptcat/issues/983)) [[4b8dae1](https://github.com/scriptscat/scriptcat/commit/4b8dae1f49208d13c4d19c4c627762fc1b04ea5e)] (by @cyfung1031)

**Full changelog:** [Compare v1.2.0...v1.2.1](https://github.com/scriptscat/scriptcat/compare/v1.2.0...v1.2.1)

<a name="1.2.0"></a>

## 1.2.0 (2025-11-29)

本次更新带来了脚本列表侧边栏、卡片视图、更友好的检查更新逻辑和编辑器配置等功能，注入与运行稳定性大幅提升，并修复 CSP、沙盒、GM API 等问题，同时带来性能与结构优化。

更多详细内容请看 v1.2.0-beta.x 的更新日志 和 [v1.2](https://docs.scriptcat.org/docs/change/v1.2/) 文档。

### 🚀 主要新功能

- ✨ 脚本列表侧边栏 [#794](https://github.com/scriptscat/scriptcat/issues/794) (by @CodFrm)
- ✨ 卡片视图 [#860](https://github.com/scriptscat/scriptcat/issues/860) (by @CodFrm)
- ✨ 更友好的检查更新逻辑 [#755](https://github.com/scriptscat/scriptcat/issues/755) (by @cyfung1031)
- ✨ 增加编辑器配置和编辑器类型定义 [#708](https://github.com/scriptscat/scriptcat/pull/708) (by @CodFrm)
- ✨ 在 popup 显示脚本数量 ([#973](https://github.com/scriptscat/scriptcat/issues/973)) [[1134586](https://github.com/scriptscat/scriptcat/commit/1134586ff040ffc0cdddd3538e9ec493950c948a)] (by @cyfung1031)
- ✨ 增加布局菜单隐藏代码侧边栏 [#689](https://github.com/scriptscat/scriptcat/issues/689) [[dd64da7](https://github.com/scriptscat/scriptcat/commit/dd64da719c081acbf21645e2b1e1f38653ffae8c)]
- ✨ 增加 SC 版本检查按钮 ([#795](https://github.com/scriptscat/scriptcat/issues/795)) [[1680c66](https://github.com/scriptscat/scriptcat/commit/1680c66099120c0e497c1a1f5321f38fe0160ea0)] (by @cyfung1031)
- ✨ 添加卸载扩展后的调查页面 [[6404c8f](https://github.com/scriptscat/scriptcat/commit/6404c8f74aff09b15725a92f8afdfc0d71ac188f)]

### 🧩 GM API 变更

- ✨ 支持 inject into，现在可以将脚本注入到 content 环境中了 [#711](https://github.com/scriptscat/scriptcat/issues/711)
- ✨ GM_openInTab 支持置顶窗口、在隐身窗口打开等参数 [#788](https://github.com/scriptscat/scriptcat/pull/788) (by @cyfung1031)
- ✨ GM_registerMenuCommand 支持二级菜单和分隔线 [#831](https://github.com/scriptscat/scriptcat/pull/831) (by @cyfung1031)
- 🗑 删除 GM_openInTab 的 useOpen 选项 [#867](https://github.com/scriptscat/scriptcat/pull/867)
- ♻️ 调整 `@connect` 逻辑 ([#969](https://github.com/scriptscat/scriptcat/issues/969)) [[67914d2](https://github.com/scriptscat/scriptcat/commit/67914d2b7d57fa9c69706ae57ee5d3400c2643f9)] (by @cyfung1031)
- ♻️ 重构 `GM_xmlhttpRequest` 及相关代码 ([#901](https://github.com/scriptscat/scriptcat/issues/901)) [[fabd2e9](https://github.com/scriptscat/scriptcat/commit/fabd2e944235b460bc73df346b79d23ee4540af7)] (by @cyfung1031)

### 其它

- ⚡️ 稳定性和性能优化
- 🐛 修复若干问题
- ♻️ 代码结构优化
- 🌐 i18n 问题处理

**Full changelog:** [Compare v1.1.2...v1.2.0](https://github.com/scriptscat/scriptcat/compare/v1.1.2...v1.2.0)

<a name="1.1.2"></a>

## 1.1.2 (2025-09-18)

一些 bug 修复

### Fixed

- 🐛 修复沙盒 toString 问题 [#737](https://github.com/scriptscat/scriptcat/issues/737) [[6ca24c9](https://github.com/scriptscat/scriptcat/commit/6ca24c9b171792035803ac4e1c69e473629f9d18)]
- 🐛 修复徽章显示 0 的问题 [[026c1d2](https://github.com/scriptscat/scriptcat/commit/026c1d2071dd4cfb6291f005d36717bcdf0a51c3)]
- 🐛 修复脚本注入 CSP 问题 [#739](https://github.com/scriptscat/scriptcat/issues/739) [#728](https://github.com/scriptscat/scriptcat/issues/728) [[5da21b5](https://github.com/scriptscat/scriptcat/commit/5da21b5e3d0e7e86a1fd5dff57ba03ea641c19fa)]
- 🐛 修复弹出页面中后台脚本不展开的问题 [[66ab70f](https://github.com/scriptscat/scriptcat/commit/66ab70fb10c28aaf0c9260a9591aab7e1ae35615)]
- 🐛 增强消息类型判断 [#676](https://github.com/scriptscat/scriptcat/issues/676) [[5073795](https://github.com/scriptscat/scriptcat/commit/50737957507ff9af3aa9ba9a6b7d444b643d1ff2)]
- 🐛 修复 GM xhr document 问题 [#716](https://github.com/scriptscat/scriptcat/issues/716) [[1c46546](https://github.com/scriptscat/scriptcat/commit/1c465462f4e14ae461d54358710f5caf74208af3)]

<a name="1.1.1"></a>

## 1.1.1 (2025-09-07)

### Added

- ✨ 增加自定义编辑器配置和编辑器类型定义 ([#708](https://github.com/scriptscat/scriptcat/issues/708)) [[49eb379](https://github.com/scriptscat/scriptcat/commit/49eb3794774790d61c3ef787c865a9ba6fe82841)]

### Fixed

- 🐛 修复低版本浏览器的兼容性问题 [#715](https://github.com/scriptscat/scriptcat/issues/715) [[4da8068](https://github.com/scriptscat/scriptcat/commit/4da806879c2b170672814d02e6f8ed98c9fae35b)]
- 💄 优化弹出窗口过小时弹出菜单显示问题 ([288650e](https://github.com/scriptscat/scriptcat/commit/288650e5e4cbdc3fa8658f0754ce427a1b3dec5a))
- 🐛 修复 N 个问题 ([#710](https://github.com/scriptscat/scriptcat/issues/710)) [[6a2027a](https://github.com/scriptscat/scriptcat/commit/6a2027ac0bb5e0ed625df570240d068a98a34b31)] (by @WhiteSevs)

### Miscellaneous

- 🌐 处理 i18n 问题 [[2adf69d](https://github.com/scriptscat/scriptcat/commit/2adf69d6ec3c30186f2c2ef89f97e3cba9e15a66)]

<a name="1.1.0"></a>

## 1.1.0 (2025-09-07)

众多 bug 修复，和兼容性问题处理，支持了 Dropbox，新增 @early-start 支持比页面更快加载，更多详细内容请看 v1.1.0-beta.x 的更新日志

### Added

- ✨ 添加脚本运行环境设置 [#628](https://github.com/scriptscat/scriptcat/issues/628) [[0d4a89e](https://github.com/scriptscat/scriptcat/commit/0d4a89efaecf0331dcc7fbb6df006b93a1525846)]
- ✨ 当没有后台脚本时默认收起 [#626](https://github.com/scriptscat/scriptcat/issues/626) ([9d0aac6](https://github.com/scriptscat/scriptcat/commit/9d0aac6aae11b96707ca1f7c024a24e9d55f217b))
- ✨ 支持 Dropbox [#575](https://github.com/scriptscat/scriptcat/issues/575) [[2c66f21](https://github.com/scriptscat/scriptcat/commit/2c66f21f5118bd83a0eaa0f1baa3a31f2233e5b2)]
- ✨ 优化 external.Tampermonkey 当 TM 和 SC 同时启动时，如 TM 没有安装，则查 SC 的安装状态 ([#703](https://github.com/scriptscat/scriptcat/issues/703)) [[d0115c3](https://github.com/scriptscat/scriptcat/commit/d0115c33657260d803b6091139601b1b20407d4e)] (by @cyfung1031)
- ✨ 新增 @early-start 实现比页面更快加载 ([#649](https://github.com/scriptscat/scriptcat/issues/649)) [[eb097dd](https://github.com/scriptscat/scriptcat/commit/eb097dd146dcd6f8ca712ed883571dbfb3d09f20)]
- ✨ 全局代码搜索 ([#662](https://github.com/scriptscat/scriptcat/issues/662)) [[f8eafb7](https://github.com/scriptscat/scriptcat/commit/f8eafb7f955dad62c1b41ac477e929bf00c65982)] (by @RenjiYuusei)
- ✨ 添加卸载扩展后的调查页面 [[6404c8f](https://github.com/scriptscat/scriptcat/commit/6404c8f74aff09b15725a92f8afdfc0d71ac188f)]
- 📝 修改安装打开的页面和命名空间 ([6f2f000](https://github.com/scriptscat/scriptcat/commit/6f2f000612908b7a88f6b70c2831092805c63bc7))
- ✨ 添加移动端安装二维码 ([348237c](https://github.com/scriptscat/scriptcat/commit/348237c7ce9771c69025386926b1f73710cf6f42))

### Fined

- 🐛 修复网络无法访问安装中间页时无法触发安装的问题 [#705](https://github.com/scriptscat/scriptcat/issues/705) [[5f1e292](https://github.com/scriptscat/scriptcat/commit/5f1e2929d79c470ba4427c3cce01f5cd184a839b)]
- 🐛 处理`@match *://*domain/*`的表达式 [[039b445](https://github.com/scriptscat/scriptcat/commit/039b4454148947cd3c74de82b87804ee9815e60c)]
- 🐛 修复扩展环境沙盒穿透问题 [#700](https://github.com/scriptscat/scriptcat/issues/700) [[a1a868d](https://github.com/scriptscat/scriptcat/commit/a1a868dfe3199e666fe2bcb65cfb2ad0ad3d699b)]
- ✏️ backgroud -&gt; background ([#698](https://github.com/scriptscat/scriptcat/issues/698)) [[2594075](https://github.com/scriptscat/scriptcat/commit/2594075c4a50f4c79fa46bcda08d7b0cbcfe723c)] (by @cyfung1031)
- ✏️ CrhomeStorage -&gt; ChromeStorage ([#693](https://github.com/scriptscat/scriptcat/issues/693)) [[64c536d](https://github.com/scriptscat/scriptcat/commit/64c536dbd5fcb4c29eebc1109202bab69aaa3ee2)] (by @cyfung1031)
- 🐛 修复 GM.getTab、GM.getTabs ([#683](https://github.com/scriptscat/scriptcat/issues/683)) [[31de256](https://github.com/scriptscat/scriptcat/commit/31de256f02b5b61e27f0eec9ea673248ba8faa32)] (by @WhiteSevs)
- 🐛 修正 finalUrl 缺失域名 ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[545d7c8](https://github.com/scriptscat/scriptcat/commit/545d7c8c0dd69c83bd2f0353518aafe6af81c0f4)] (by @cyfung1031)
- 🐛 兼容较低的浏览器内核 [#647](https://github.com/scriptscat/scriptcat/issues/647) ([bba12d2](https://github.com/scriptscat/scriptcat/commit/bba12d23f04759cb9b7fdb63f0d95ae515ee94a9))
- 🐛 修正 finalUrl 缺失域名 ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[3ed018a](https://github.com/scriptscat/scriptcat/commit/3ed018a7a54803fcf2e1791316e0166ed0b52007)] (by @cyfung1031)
- 💚 修复 react/jsx-no-literals lint 问题 [[017b608](https://github.com/scriptscat/scriptcat/commit/017b60886be601e3e0e1719cf249da32d5686c30)]
- 🐛 兼容较低的浏览器内核 [#647](https://github.com/scriptscat/scriptcat/issues/647) [[0e2f817](https://github.com/scriptscat/scriptcat/commit/0e2f8173c8b44bd6ad44bdffc73fa302a96a058e)]
- 🐛 优化 window.external 注入 ([#646](https://github.com/scriptscat/scriptcat/issues/646)) [[0b2668a](https://github.com/scriptscat/scriptcat/commit/0b2668aadcab35a33ff9abc4bd030dffb87ea168)] (by @cyfung1031)
- 🐛 修复网盘鉴权打开页面无法自动关闭的问题 [[7748088](https://github.com/scriptscat/scriptcat/commit/7748088e63c1fc660b6a6ae5613cf04f9da99b8c)]
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

- 📝 Create README_RU.md and CONTRIBUTING_RU.md ([#678](https://github.com/scriptscat/scriptcat/issues/678)) [[597ab03](https://github.com/scriptscat/scriptcat/commit/597ab0378fe5ced01637cf411326ef7845b8ce2b)] (by @Ioann)
- 👷 兼容性调整（pack.js 兼容性） ([#669](https://github.com/scriptscat/scriptcat/issues/669)) [[fec45e6](https://github.com/scriptscat/scriptcat/commit/fec45e6606a609b10b79c58d2fcba02c2ce71e16)] (by @cyfung1031)
- 🌐 Refines and expands Vietnamese locale ([#661](https://github.com/scriptscat/scriptcat/issues/661)) [[6847a59](https://github.com/scriptscat/scriptcat/commit/6847a596c4b06c75e13594ef60e4b9dfa5718cf3)] (by @RenjiYuusei)
- 🌐 翻译修正 ([#635](https://github.com/scriptscat/scriptcat/issues/635)) [[19296de](https://github.com/scriptscat/scriptcat/commit/19296de6a3815e5965eb33401a55da9b2bd22bb4)] (by @cyfung1031)
- 🌐 修复新手引导 i18n 问题 [#627](https://github.com/scriptscat/scriptcat/issues/627) [[9683f96](https://github.com/scriptscat/scriptcat/commit/9683f965400ab6a2bac15349aca4335911766eac)]
- 👷 pack.js 代码优化 ([#615](https://github.com/scriptscat/scriptcat/issues/615)) [[870dd9b](https://github.com/scriptscat/scriptcat/commit/870dd9bc6b7eff3eceefa915452e773ec0565180)] (by @cyfung1031)

## 1.0.2 (2025-08-25)

影响较大问题修复

### Changed

- 🎨 优化窗口打开逻辑 [[87ba23a](https://github.com/scriptscat/scriptcat/commit/87ba23a0f1a1829fbddcec2d4ad21e28787ddf2a)] (by 王一之)
- 🎨 增强 chrome.tabs.create 兼容性 ([#639](https://github.com/scriptscat/scriptcat/issues/639)) [[ac0d7de](https://github.com/scriptscat/scriptcat/commit/ac0d7deb5957ea71579ef7a44594a75300e1cca6)] (by @cyfung1031)

### Fixed

- 🐛 兼容较低的浏览器内核 [#647](https://github.com/scriptscat/scriptcat/issues/647) [[bba12d2](https://github.com/scriptscat/scriptcat/commit/bba12d23f04759cb9b7fdb63f0d95ae515ee94a9)] (by 王一之)
- 🐛 修正 finalUrl 缺失域名 ([#656](https://github.com/scriptscat/scriptcat/issues/656)) [[545d7c8](https://github.com/scriptscat/scriptcat/commit/545d7c8c0dd69c83bd2f0353518aafe6af81c0f4)] (by @cyfung1031)

## 1.0.1 (2025-08-16)

尽快修复一些影响较大的问题

### Fixed

- 🐛 修复某些匹配情况 [#629](https://github.com/scriptscat/scriptcat/issues/629) [[3334b0c](https://github.com/scriptscat/scriptcat/commit/3334b0cb40138ddaad30b54f516df83316b8bb64)]
- 🐛 修复资源哈希校验 [[db7d6c7](https://github.com/scriptscat/scriptcat/commit/db7d6c7351a88f35709163b610e0f5b1fda79a33)]
- 🐛 修复某些.user.js 链接无法安装脚本的问题 [#599](https://github.com/scriptscat/scriptcat/issues/599) [[61f7ad1](https://github.com/scriptscat/scriptcat/commit/61f7ad111b40ba0bbd2f04bb2c3e72713116237f)]
- 🐛 修复@connect \*不生效的问题 [#623](https://github.com/scriptscat/scriptcat/issues/623) [[744c182](https://github.com/scriptscat/scriptcat/commit/744c18227d8f89ce6f65d6ae70d7f002aec410dd)]

<a name="1.0.0"></a>

## 1.0.0 (2025-08-12)

🎉 v1.0.0 发布，非常感谢哥哥们的支持！

### Added

- ✨ 优化日志打印 [[8693b93](https://github.com/scriptscat/scriptcat/commit/8693b9338bdd916ffad58572949e67d14cc2c109)]
- ✨ 实现异步 GM 函数 ([8caebe9](https://github.com/scriptscat/scriptcat/commit/8caebe9ae4f6f6b304b54cbb870a4cebd6341704))
- ✨ 链接导入脚本时可以按回车键确定 ([#537](https://github.com/scriptscat/scriptcat/issues/537)) [[45a17df](https://github.com/scriptscat/scriptcat/commit/45a17df8f35a943a489c0f5980ac3f65fb0e8e5f)] (by @TC999)
- ✨ 增加 Prettier 的 ESLint 统一代码格式化风格 [[0f84a19](https://github.com/scriptscat/scriptcat/commit/0f84a19c42823baab60f2b379d187073be7879f9)]
- ✨ 安装/更新脚本时增加下拉框 [#508](https://github.com/scriptscat/scriptcat/issues/508) [[790584d](https://github.com/scriptscat/scriptcat/commit/790584d078eb4bbf2179aec5297c5574d7b30167)]
- ✨ 增加脚本单独的检查更新选项 [#508](https://github.com/scriptscat/scriptcat/issues/508) ([41ac880](https://github.com/scriptscat/scriptcat/commit/41ac880855fafe3a4e7a87cc05169f77d8a8f59c))
- ✨ 实现异步 GM 函数 ([#492](https://github.com/scriptscat/scriptcat/issues/492)) [[cb8edf7](https://github.com/scriptscat/scriptcat/commit/cb8edf7809667068f4a2682afba82bc24302d717)] (by @cyfung1031)
- ✨ 支持 GoogleDrive ([#490](https://github.com/scriptscat/scriptcat/issues/490)) [[dc38f7f](https://github.com/scriptscat/scriptcat/commit/dc38f7f38fca13febe197a3ced4e817cacec5920)] (by @wangyizhi)
- ✨ 增加 UserConfig 顺序 [[1874a35](https://github.com/scriptscat/scriptcat/commit/1874a3520668edc6ba947f8deb12148b5c5befa9)]
- ✨ 关闭时的不再检查更新 [#562](https://github.com/scriptscat/scriptcat/issues/562) [[25cec66](https://github.com/scriptscat/scriptcat/commit/25cec66ee81192c6898b20ff133c78ad15039a84)]
- ✨ 最后更新增加 Tooltip ([#564](https://github.com/scriptscat/scriptcat/issues/564)) [[39ede21](https://github.com/scriptscat/scriptcat/commit/39ede219157840d2de5b4a846ab339612db8fb94)] (by @cyfung1031)
- ✨ 增加徽标和菜单设置并调整设置页面 [#573](https://github.com/scriptscat/scriptcat/issues/573) [[23e9b19](https://github.com/scriptscat/scriptcat/commit/23e9b19912c64ed2dafeabd66513519e1465b00e)]
- ⚡ 优化资源加载, 并行加载异步资源 ([#574](https://github.com/scriptscat/scriptcat/issues/574)) ([5910c0b](https://github.com/scriptscat/scriptcat/commit/5910c0b3baf540aeb1f12fed5a4796eef3dec71c)) by @zhangenming
- ✨ 开启开关单独控制隐身模式与主窗口 [#571](https://github.com/scriptscat/scriptcat/issues/571) ([38a33b1](https://github.com/scriptscat/scriptcat/commit/38a33b107275be0e1b2aa31eaa2055939c5356f0))
- ✨ Ctrl+Enter 确定导入 [#537](https://github.com/scriptscat/scriptcat/issues/537) [[06a7a01](https://github.com/scriptscat/scriptcat/commit/06a7a01f0ff82b5d99b558fdff29bc45524b7501)]
- ✨ 优化安装、权限等的打开窗口交互 ([0d9ba53](https://github.com/scriptscat/scriptcat/commit/0d9ba53ba3b42f948eb82b34a7257eb46b973055))
- ✨ 安装本地脚本时可以进行监听 [#275](https://github.com/scriptscat/scriptcat/issues/275) ([d9b0eee](https://github.com/scriptscat/scriptcat/commit/d9b0eeede1a8b114f79a43fade99d825323c63f6))

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
- ♻️ 调整打开更新页面代码 [[9ea0708](https://github.com/scriptscat/scriptcat/commit/9ea0708a4d6c793caf4cbfe9b760db1fbdc1b453)]
- ⚡ TimeoutError 判斷 ([#565](https://github.com/scriptscat/scriptcat/issues/565)) [[6a9a830](https://github.com/scriptscat/scriptcat/commit/6a9a8309379f5406a29aa8bee6ad8de106c85f57)] (by @cyfung1031)
- ⚡ 修正 ScriptList 重绘、图标显示等问题 + 其他视觉元素修改 ([#559](https://github.com/scriptscat/scriptcat/issues/559)) [[f9e6c44](https://github.com/scriptscat/scriptcat/commit/f9e6c44358757e904d58df4e91f67215fc9278ad)] (by @cyfung1031)
- ⚡ 修改 messageFlag 格式避免与其他页面代码衝突 ([#561](https://github.com/scriptscat/scriptcat/issues/561)) [[182a631](https://github.com/scriptscat/scriptcat/commit/182a631788b779a61aa126776b3edad4434a898e)] (by @cyfung1031)
- ♻️ xhr 原生 response 只取一次 ([#550](https://github.com/scriptscat/scriptcat/issues/550)) [3a8a464]
- 🎨 调整菜单选项 [#573](https://github.com/scriptscat/scriptcat/issues/573) [[3677278](https://github.com/scriptscat/scriptcat/commit/367727851faf7ec73b9d751fab5787219d77fe9a)]

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
- 🐛 修复 GM cookie list 获取不全的问题 [[3046200](https://github.com/scriptscat/scriptcat/commit/3046200562e7f92e307cb4a52e32723f67490f2d)]
- 🐛 修复并发创建菜单的报错 [#580](https://github.com/scriptscat/scriptcat/issues/580) [[4855fec](https://github.com/scriptscat/scriptcat/commit/4855fec67a89bb36ab0f1855bc679926a0e74dc3)]
- 🐛 处理一些特殊的沙盒关键字 ([9ced958](https://github.com/scriptscat/scriptcat/commit/9ced958144f2d883c9044e6e4ad4f9dd53951ece))
- 🐛 修复脚本设置网站匹配更新不断累积 include 的问题 [#581](https://github.com/scriptscat/scriptcat/issues/581) [[9d31872](https://github.com/scriptscat/scriptcat/commit/9d31872775116d60e093f7ca31d62449963f059d)]

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
- 👷 增加.codecov.yml [[ee297d5](https://github.com/scriptscat/scriptcat/commit/ee297d520802ead748fd3969e065fb19b42ca87f)]
- 🌐 更新翻译 [[82214d0](https://github.com/scriptscat/scriptcat/commit/82214d09fa0696fe3366277ca21ae80164dea676)]
- 🌐 处理默认翻译问题 英语以中文为基础，其它语言以英文为基础 ([70a739c](https://github.com/scriptscat/scriptcat/commit/70a739ce25f89286f9289e70d5183278f1893572))

**Full Changelog**: https://github.com/scriptscat/scriptcat/compare/v0.18.2...v1.0.0

<a name="0.18.2"></a>
<a name="0.18.2-beta"></a>

## 0.18.2 (2025-07-08)

> v0.18.2-beta 版本内容与此版本一致

### Added

- ✨ 脚本编辑列表增加脚本搜索与批量置顶 [#462](https://github.com/scriptscat/scriptcat/issues/462) [[7c6ba17](https://github.com/scriptscat/scriptcat/commit/7c6ba1783275fbdd60c74170d5374826100e183d)]
- ✨ 根据浏览器内核版本显示对应的提示 [[b0cb2b9](https://github.com/scriptscat/scriptcat/commit/b0cb2b9c76019059beb6eb7f73eeeccd1097adfc)]
- ✨ 脚本编辑列表中新增删除脚本按钮 [#466](https://github.com/scriptscat/scriptcat/issues/466) [[4042845](https://github.com/scriptscat/scriptcat/commit/40428457a75d5879d99e6b0e5438993404c61ad6)]
- ✨ 新增脚本储存面板支持批量编辑 ([#458](https://github.com/scriptscat/scriptcat/issues/458)) [[1d7800a](https://github.com/scriptscat/scriptcat/commit/1d7800a8e9576638a746c0cbafb3e3a663cd37d0)] (by @DreamNya)
- ✨ 实现手动调整脚本执行顺序 ([#452](https://github.com/scriptscat/scriptcat/issues/452)) [[c6728c3](https://github.com/scriptscat/scriptcat/commit/c6728c33296683a42b8b7388b885edefb3422a02)] (by @DreamNya)

### Changed

- ⚡ 优化站点图标加载问题 [#474](https://github.com/scriptscat/scriptcat/issues/474) [[09e2a1b](https://github.com/scriptscat/scriptcat/commit/09e2a1b26b8289496ab211b4ebeb6ff4a4bb9049)]
- 💄 优化 popup 页面展示 [#456](https://github.com/scriptscat/scriptcat/issues/456) [[5bfd9b2](https://github.com/scriptscat/scriptcat/commit/5bfd9b22c804438a0cfc9a2c491340afe7fcf7e2)]
- ⚡ 优化站点 icon 加载速度 [[2841878](https://github.com/scriptscat/scriptcat/commit/28418789e617b903f8f5d9dbef4c8a8fcab5dc7c)]

### Fixed

- 🐛 修复 i18n 在没有支持语言下无法保存的问题 [#485](https://github.com/scriptscat/scriptcat/issues/485) Fixed the issue that i18n cannot be saved without supporting languages [[5c012a3](https://github.com/scriptscat/scriptcat/commit/5c012a3ce3c679c323983340ac2dad6ab3188fd2)]
- 🐛 修复错误的 UserConfig 会导致脚本无法加载的问题 [#483](https://github.com/scriptscat/scriptcat/issues/483) fixed [#483](https://github.com/scriptscat/scriptcat/issues/483) [[bdc681b](https://github.com/scriptscat/scriptcat/commit/bdc681bc9ead6e37063b41edf880e0c82cbbb888)]
- 🐛 固定 downloadMode 在 GM_info 總是 &quot;native&quot; ([#476](https://github.com/scriptscat/scriptcat/issues/476)) [[9c016db](https://github.com/scriptscat/scriptcat/commit/9c016db35beb763f00e45fdd5ce280edd48254bf)] (by @cyfung1031)
- 🐛 修复列项高度不一致的问题 [#459](https://github.com/scriptscat/scriptcat/issues/459) fixed [#459](https://github.com/scriptscat/scriptcat/issues/459) [[2a1d3eb](https://github.com/scriptscat/scriptcat/commit/2a1d3eb1cc861e846a1ec11e1c6fb85dc07ff0b9)]
- 🐛 修正 GM_addElement 中 textContent 的處理 ([#463](https://github.com/scriptscat/scriptcat/issues/463)) [[aba6caa](https://github.com/scriptscat/scriptcat/commit/aba6caa3c895e21071eddca6182ed69b6b3de07e)] (by @cyfung1031)
- 🐛 GM_addStyle 文檔及類型補充 ([#465](https://github.com/scriptscat/scriptcat/issues/465)) [[0977759](https://github.com/scriptscat/scriptcat/commit/09777599feed3fa59ec55122f4f3ecfd107b6b58)] (by @cyfung1031)
- 🐛 修复 notification icon 问题 [#454](https://github.com/scriptscat/scriptcat/issues/454) [[64fe88e](https://github.com/scriptscat/scriptcat/commit/64fe88eefb7f1d0843dc505a19652d162502c3ed)]
- 🐛 修复 popup 新版本提示样式 ([#453](https://github.com/scriptscat/scriptcat/issues/453)) [[068ebc5](https://github.com/scriptscat/scriptcat/commit/068ebc52e1c471a805416acebd96ee79db6c1383)] (by @DreamNya)

### Miscellaneous

- 🌐 添加英文的贡献指南 [[e311746](https://github.com/scriptscat/scriptcat/commit/e311746260fa5c814158a82d2586beb58f3e821b)]
- 🌐 恢复低版本浏览器提示 [[e624bfc](https://github.com/scriptscat/scriptcat/commit/e624bfcdcc18ee182273d0fbe50a8f07976610b0)]
- 🌐 增加日语、德语翻译并设置默认语言为 English [#485](https://github.com/scriptscat/scriptcat/issues/485) Add Japanese and German translations and set the default language to English [[6a7f3a8](https://github.com/scriptscat/scriptcat/commit/6a7f3a8c7c1b7fb25248018184ace526b5e56765)]
- 📄 添加低版本浏览器提示 [[679b38c](https://github.com/scriptscat/scriptcat/commit/679b38c3db3b5332e1c4c0b68f78c177a9df7e00)]
- ⚡ 修正雙重 Promise (double-wrapped) ([#482](https://github.com/scriptscat/scriptcat/issues/482)) [[c0e76ca](https://github.com/scriptscat/scriptcat/commit/c0e76ca79667cfb6732ea377569dbd5a169903eb)] (by @cyfung1031)
- ⚡ loadScriptFavicons 可異步更新不用 await ([#479](https://github.com/scriptscat/scriptcat/issues/479)) [[c1164ce](https://github.com/scriptscat/scriptcat/commit/c1164ce4f5723f8a5a95e208047e89d039cd618a)] (by @cyfung1031)
- 🌐 翻譯修正 ([#477](https://github.com/scriptscat/scriptcat/issues/477)) [[948e113](https://github.com/scriptscat/scriptcat/commit/948e113d8e57f1c27817240063df9f4f88dfdc8e)] (by @cyfung1031)
- 🌐 en translation improvements ([#469](https://github.com/scriptscat/scriptcat/issues/469)) [[976020b](https://github.com/scriptscat/scriptcat/commit/976020bde5bbae50735e4403190e85b3817c8529)] (by @Yay295)
- ⚡ 优化 GM_download 实现方式 ([#455](https://github.com/scriptscat/scriptcat/issues/455)) [[a345e97](https://github.com/scriptscat/scriptcat/commit/a345e97a613fdda31a464f72c3deb4b13a6a5e31)] (by @DreamNya)
- 🌐 添加繁体中文翻译 [[510f228](https://github.com/scriptscat/scriptcat/commit/510f22824b593d65f7cd45ba9577812dfca63c3b)]
- 🌐 处理 i18n 问题 [#456](https://github.com/scriptscat/scriptcat/issues/456) [[c70ca42](https://github.com/scriptscat/scriptcat/commit/c70ca42fbed6a162c9dfb100584cc86b0201a3ee)]

<a name="0.18.1"></a>

## 0.18.1 (2025-06-26)

修复一些 bug，v0.18.1-beta 版本内容与此版本一致

⚠️ 请注意，如果你使用的 Windows 8/7/XP 系统，或者浏览器内核版本低于\<120，需要自行手动安装[旧版脚本猫](https://bbs.tampermonkey.net.cn/thread-3068-1-1.html)，v0.16.6 是最后一个支持 Manifest V2 的版本，安装步骤可以参考：[加载解压缩方式安装扩展](/docs/use/use/#%E5%8A%A0%E8%BD%BD%E8%A7%A3%E5%8E%8B%E7%BC%A9%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95)。

### Changed

- 🎨 优化报告问题流程 [[5f2f792](https://github.com/scriptscat/scriptcat/commit/5f2f79290d96e0bcda87b96aef57b5ebdd552a42)]
- 💄 调整默认 eslint 规则 [[9525627](https://github.com/scriptscat/scriptcat/commit/9525627fdff6c9eabfadd0805b11dbd132958c61)]

### Fixed

- 🐛 修复后台脚本几率性加载失败 [[b9e4c86](https://github.com/scriptscat/scriptcat/commit/b9e4c869b59e7357ebcda4f86c2d49f1a4ca2aac)]
- 🐛 修复几率性无法加载脚本的问题 [#447](https://github.com/scriptscat/scriptcat/issues/447) [[06c21b6](https://github.com/scriptscat/scriptcat/commit/06c21b647abde4a7e4ae194ad1be9ae1c51ac927)]
- 🐛 修复运行日志跳转条件问题 [#445](https://github.com/scriptscat/scriptcat/issues/445) [[007c3f7](https://github.com/scriptscat/scriptcat/commit/007c3f72bf1df8a70e04374b14120e5ab9828010)]
- 🐛 修复日志记录问题与暂时移除 Firefox 包 [#449](https://github.com/scriptscat/scriptcat/issues/449) [[7cb20d5](https://github.com/scriptscat/scriptcat/commit/7cb20d5fe4e2fac5d9318f93fce07a7c6b2e08a1)]
- 🐛 处理 tld 域名 [[93ce67a](https://github.com/scriptscat/scriptcat/commit/93ce67a6bc3213264d7582a0335eb28ee38a0cb0)]
- 🐛 修复 GM XHR 重定向 unsafeHeader 处理问题 [#444](https://github.com/scriptscat/scriptcat/issues/444) [[c0da6a0](https://github.com/scriptscat/scriptcat/commit/c0da6a06dc4d193f212caeca3050205d0df80316)]
- 🐛 修复 GM cookie 与 GM xhr 问题 [#444](https://github.com/scriptscat/scriptcat/issues/444) [[d384f37](https://github.com/scriptscat/scriptcat/commit/d384f3776c2685909a2908a5d3bae6007c21caaa)]
- 🐛 支持一些正则表达式 [[fa81e77](https://github.com/scriptscat/scriptcat/commit/fa81e771bb61215cc434f9aa6b74485fd8495a80)]
- 🐛 处理一些正则匹配的情况 [[ccd4085](https://github.com/scriptscat/scriptcat/commit/ccd4085cfe7640212bde072bed30fe79c1658755)]
- 🐛 修复某些不符合规范的 match 影响整体加载的问题 [#444](https://github.com/scriptscat/scriptcat/issues/444) [[d32793e](https://github.com/scriptscat/scriptcat/commit/d32793e4bf5b79cfa7e35648b198865ca45272f6)]
- 🐛 修复定时器问题 [[96abce7](https://github.com/scriptscat/scriptcat/commit/96abce7bfd76a35f101be5437893934e8af88808)]

### Miscellaneous

- 🌐 添加 en 翻译 [[32bfa21](https://github.com/scriptscat/scriptcat/commit/32bfa214283ceb5706afc702bb76e1d1080df09f)]
- 🌐 处理 i18n [[c707094](https://github.com/scriptscat/scriptcat/commit/c70709499809766d800813d21f141fca1ea23e70)]

<a name="0.18.0"></a>

## 0.18.0 (2025-06-24)

此版本修复了一些比较严重的兼容性问题，尽快发版解决，另外由于 chrome 商店正式版版本号命名存在问题，从 v0.17 直接升至 v0.18，v0.18.0-beta 版本内容与此版本一致

⚠️ 请注意，如果你使用的 Windows 8/7/XP 系统，或者浏览器内核版本低于\<120，需要自行手动安装[旧版脚本猫](https://bbs.tampermonkey.net.cn/thread-3068-1-1.html)，v0.16.6 是最后一个支持 Manifest V2 的版本，安装步骤可以参考：[加载解压缩方式安装扩展](https://docs.scriptcat.org/docs/use/use/#%E5%8A%A0%E8%BD%BD%E8%A7%A3%E5%8E%8B%E7%BC%A9%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95)。

### Added

- ✨ 优化更新日志打开逻辑 [[859a516](https://github.com/scriptscat/scriptcat/commit/859a516a3d6cf56c26c55099a60e15a52b031845)]
- ✨ GM_notification 适配参数 tag、url 及 onclick 的回调函数的参数 ([#431](https://github.com/scriptscat/scriptcat/issues/431)) by @WhiteSevs [[ba044de](https://github.com/scriptscat/scriptcat/commit/ba044deba28265e96b20b7862755d9e9ccd286dd)]

### Fixed

- 🐛 修复一些特殊匹配 [#441](https://github.com/scriptscat/scriptcat/issues/441) [[1b4830e](https://github.com/scriptscat/scriptcat/commit/1b4830e618728881c74aa94d2bd9f452124cffe6)]
- 🐛 修复一些特殊匹配 [[dc024af](https://github.com/scriptscat/scriptcat/commit/dc024af4b0461f925b28fa04f7e1da79099d589a)]
- 🐛 修复沙盒 window 问题 [[e19d6f3](https://github.com/scriptscat/scriptcat/commit/e19d6f3d1b66b97482dad0ffbba37401d83ba6d3)]
- 🐛 处理特殊的 match [#440](https://github.com/scriptscat/scriptcat/issues/440) [[00d83ca](https://github.com/scriptscat/scriptcat/commit/00d83ca59cb04b389ada53b73e1d8038a8639397)]
- 🐛 删除注入代码中的 await [[6b7878b](https://github.com/scriptscat/scriptcat/commit/6b7878bd0804b725a67c37edddefd1f7fde98498)]
- 🐛 修复脚本排序问题 [#425](https://github.com/scriptscat/scriptcat/issues/425) [[c2ca896](https://github.com/scriptscat/scriptcat/commit/c2ca8963030cc9aa8efc439ce388df7450ecc6ae)]
- 🐛 重新支持 document-body [[5762b3b](https://github.com/scriptscat/scriptcat/commit/5762b3b52a9c5acea3ba7eb4b72e6454a46e6a06)]
- 🐛 修复带 search 的匹配问题 [[a1a13ca](https://github.com/scriptscat/scriptcat/commit/a1a13caea08751b76ff68aa3fc5b4403d62e05c2)]

### Miscellaneous

- 👷 增加单元测试流程 [[231c667](https://github.com/scriptscat/scriptcat/commit/231c667e1bfc9444b7c27c6646e67271c6b63da7)]

<a name="0.17.0"></a>

## 0.17.0 (2025-06-23)

🎉 第一个 Manifest V3 的正式版本，含有多重大变化，如有问题，请反馈给我们：[BUG 反馈](https://github.com/scriptscat/scriptcat/issues/new?template=bug_report.yaml)。

⚠️ 请注意，如果你使用的 Windows 8/7/XP 系统，或者浏览器内核版本低于\<120，需要自行手动安装[旧版脚本猫](https://bbs.tampermonkey.net.cn/thread-3068-1-1.html)，v0.16.6 是最后一个支持 Manifest V2 的版本，安装步骤可以参考：[加载解压缩方式安装扩展](https://docs.scriptcat.org/docs/use/use/#%E5%8A%A0%E8%BD%BD%E8%A7%A3%E5%8E%8B%E7%BC%A9%E6%96%B9%E5%BC%8F%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95)。

- 💥 Manifest V2 迁移至 Manifest V3
- 💥 储存引擎切换
- 💥 [新功能](https://docs.scriptcat.org/docs/change/v0.17/)
- 🐛 BUG 问题修复
- 🐛 兼容性问题修复

更多更新内容请看：[0.17.0-alpha.3](https://docs.scriptcat.org/docs/change/#0170-alpha3-2025-04-25)

<a name="0.17.0-beta.4"></a>

## 0.17.0-beta.4 (2025-06-20)

### Added

- ✨ 弹出页面增加快速检查脚本更新 [#375](https://github.com/scriptscat/scriptcat/issues/375) [[4807f76](https://github.com/scriptscat/scriptcat/commit/4807f760aa559d02d480589c27113ab6fa623e19)]
- ✨ 站点匹配在列表里可以展示并支持点击 [#419](https://github.com/scriptscat/scriptcat/issues/419) [[661b7b0](https://github.com/scriptscat/scriptcat/commit/661b7b02a594e7a1a18cb17847582c4e5e4e5944)]
- ✨ 云同步同步脚本顺序与是否开启 [#253](https://github.com/scriptscat/scriptcat/issues/253) [#381](https://github.com/scriptscat/scriptcat/issues/381) ([#421](https://github.com/scriptscat/scriptcat/issues/421)) [[fb7e7fc](https://github.com/scriptscat/scriptcat/commit/fb7e7fc94447b2360027a4c22a34f5fb0b9d8e96)]
- ✨ 显示当前正在编辑的脚本名字 [#105](https://github.com/scriptscat/scriptcat/issues/105) [[1316e98](https://github.com/scriptscat/scriptcat/commit/1316e9850f7ab8197682372fd821725a5ea196d3)]
- ✨ 增加黑名单页面提示 [[8ffd017](https://github.com/scriptscat/scriptcat/commit/8ffd017eba5be5605c2fea0298f25aee3a5c6572)]
- ✨ 实现网站黑名单功能 [#230](https://github.com/scriptscat/scriptcat/issues/230) [[aec3d4b](https://github.com/scriptscat/scriptcat/commit/aec3d4b7659cd7a73d23d2506770af51bdb295c2)]
- ✨ UserConfig 增加一个保存提示 [#344](https://github.com/scriptscat/scriptcat/issues/344) [[d509e1c](https://github.com/scriptscat/scriptcat/commit/d509e1c95db703cf9360a4467ee669aecbf5521b)]
- ✨ UserConfig 添加 switch 类型 [#340](https://github.com/scriptscat/scriptcat/issues/340) [[6fc98f3](https://github.com/scriptscat/scriptcat/commit/6fc98f3e0d96b1e46532e9dc15ca193a97820922)]

### Fixed

- 🐛 修复备份导入顺序问题 [[b8941af](https://github.com/scriptscat/scriptcat/commit/b8941afd9e4097bdebe06af99249e30850d92d5d)]
- 🐛 修复 gm xhr 携带 origin 的问题 [#420](https://github.com/scriptscat/scriptcat/issues/420) [[e5ff4e2](https://github.com/scriptscat/scriptcat/commit/e5ff4e2f0d63306dc0b9b26566f1c1b608a416dc)]
- 🐛 处理 v138+版本的 userScript 检测 [#418](https://github.com/scriptscat/scriptcat/issues/418) [[365f2f8](https://github.com/scriptscat/scriptcat/commit/365f2f891055cea955c4cc5f8c66b70cede1d0dd)]
- 🐛 修复 onxxx 处理 [#418](https://github.com/scriptscat/scriptcat/issues/418) [[7aa50e7](https://github.com/scriptscat/scriptcat/commit/7aa50e7cca10376c86094b8f7eb66705abdbc6cb)]
- 🐛 修复静默更新问题 [[1769af0](https://github.com/scriptscat/scriptcat/commit/1769af0313acc85c4e513192753c2e8658bee5b6)]
- 🐛 修复定时脚本中配置无效的问题 [#315](https://github.com/scriptscat/scriptcat/issues/315) [[d360391](https://github.com/scriptscat/scriptcat/commit/d3603914988d578f36932b358c6d6a7ab7f857cb)]
- 🐛 修复 service worker 与 offscreen 消息通信问题 [[8207fcc](https://github.com/scriptscat/scriptcat/commit/8207fcc6d5c5bbe4536dc68e8a2f731720c99788)]
- 🐛 处理只定义了 GM\_*但 GM.*不生效的问题 [#323](https://github.com/scriptscat/scriptcat/issues/323) [[2232fed](https://github.com/scriptscat/scriptcat/commit/2232fedccd1fef54f719f8e751ca9b4d976a8626)]
- 🐛 修复 GM.cookie 问题 [[ec44068](https://github.com/scriptscat/scriptcat/commit/ec440680f1b73eca42aff6c9533ccb39913cc79b)]

<a name="0.17.0-beta.3"></a>

## 0.17.0-beta.3 (2025-06-14)

增加了一个新 API: `CAT_registerMenuInput` 可以尝鲜，后续还会进行修改和优化

### Added

- ✨ 实现 CAT_registerMenuInput 支持快捷输入交互 ([#411](https://github.com/scriptscat/scriptcat/issues/411)) by @DreamNya [[79cb27c](https://github.com/scriptscat/scriptcat/commit/79cb27ca08804b3b818cb8bdc3c8682c425d1cc0)]
- ✨ GM_xmlhttpRequest 新增 cookiePartition 参数 by @WhiteSevs
  [[3774aa3](https://github.com/scriptscat/scriptcat/commit/3774aa3acebeadb6b08162625a9af29a9599fa96)]
- ✨ feat: 适配 GM_deleteValue、GM_setValues 和 GM_deleteValues 单独的权限请求 by @WhiteSevs [[15b4b16](https://github.com/scriptscat/scriptcat/commit/15b4b16bfa2578985ff8281d5a0f69a16aa7f36c)]

### Fixed

- 🐛 修复权限通配符设置问题 [#416](https://github.com/scriptscat/scriptcat/issues/416) [[1994cc8](https://github.com/scriptscat/scriptcat/commit/1994cc896f383d8132ca324ae89a686588e9dc13)]
- 🐛 修复自动切换主题与 tsconfig types 问题 [[1083dd0](https://github.com/scriptscat/scriptcat/commit/1083dd0d048c70b1afd250915fb74c24b42efe48)]
- 🐛 修复界面模式切换 [[165c46c](https://github.com/scriptscat/scriptcat/commit/165c46c700019b4742ffcae20f24f5f67fd2aab3)]
- 🐛 处理 node v23 无法构建的问题 [#415](https://github.com/scriptscat/scriptcat/issues/415) [[5274edf](https://github.com/scriptscat/scriptcat/commit/5274edf857b841ba65988048e12bd850940de37d)]
- 🐛 修复删除脚本 resource 数据未删除的问题 [[c93e39e](https://github.com/scriptscat/scriptcat/commit/c93e39e5a57ff9fff9fc868b477a710f27fe4808)]
- 🐛 修复 vscode 连接问题 [[e3b6604](https://github.com/scriptscat/scriptcat/commit/e3b6604d1640f64a964b6a7d3a4badbcca578eba)]

<a name="0.17.0-beta.2"></a>

## 0.17.0-beta.2 (2025-06-04)

### Added

- ✨ 增加按钮可以重试数据迁移 [#409](https://github.com/scriptscat/scriptcat/issues/409) [[85a7404](https://github.com/scriptscat/scriptcat/commit/85a740497050d6347bd07ff4177b656963bba363)]
- ✨ feat: 新增对 file://协议的文件的动态加载更新 by @WhiteSevs [[6eb5bd8](https://github.com/scriptscat/scriptcat/commit/6eb5bd83a2ebf2e083603c3e7fa6b336fc08490c)]
- ✨ feat: 新增对 file 协议的资源或引用自动更新 by @WhiteSevs [[7a5cc21](https://github.com/scriptscat/scriptcat/commit/7a5cc21fc2d7e4270906f346d5aa61295cac52b4)]
- ✨ feat: 适配部分 GM_info 的属性 by @WhiteSevs [[51f0ea0](https://github.com/scriptscat/scriptcat/commit/51f0ea0dc7254242c7059acf69e4479b09bd605f)]
- ✨ feat: GM_setClipboard 支持 cb 回调函数 by @WhiteSevs [[a8373f5](https://github.com/scriptscat/scriptcat/commit/a8373f5d9798506dc5d883374b059843fd0c7a15)]
- ✨ feat: 新增 Api 支持 GM_setValues、GM_getValues、GM_deleteValues by @WhiteSevs [[d363e42](https://github.com/scriptscat/scriptcat/commit/d363e4289306f547236c90652e514c0b9c86a2fb)]
- ✨ feat: GM_cookie 新增配置 partitionKey.topLevelSite by @WhiteSevs [[131b31f](https://github.com/scriptscat/scriptcat/commit/131b31f325531d4f0cdc30d4bc97242f1502abed)]
- ✨ 兼容 GM_registerMenuCommand [#358](https://github.com/scriptscat/scriptcat/issues/358) [[70c59e6](https://github.com/scriptscat/scriptcat/commit/70c59e6104749f028b1bfa5cba9f65f2ad7c5be2)]

### Fixed

- 🐛 修复 userConfig 默认值问题 [#409](https://github.com/scriptscat/scriptcat/issues/409) [[f1ee723](https://github.com/scriptscat/scriptcat/commit/f1ee7236ba1b568fd724e48341b687badd43e44e)]
- 🐛 修复 eslint 配置无法重置的问题 [[d0c2f3b](https://github.com/scriptscat/scriptcat/commit/d0c2f3b51a25d35c4dafc733eb121d38c77a4c66)]
- 🐛 修复 vscode 连接问题 [#412](https://github.com/scriptscat/scriptcat/issues/412) [#400](https://github.com/scriptscat/scriptcat/issues/400) [[6ff24e3](https://github.com/scriptscat/scriptcat/commit/6ff24e30dacfaf489f0992604008acd129ebddcf)]
- 🐛 修复重复监听问题 [#388](https://github.com/scriptscat/scriptcat/issues/388) [[b8735d8](https://github.com/scriptscat/scriptcat/commit/b8735d8c463341204423611465eb54312d43f067)]
- 🐛 修复 GM_notification 无法触发 onclick [#406](https://github.com/scriptscat/scriptcat/issues/406) [[c5e766f](https://github.com/scriptscat/scriptcat/commit/c5e766fde35ae4346d249df744ccc1973f054667)]
- 🐛 修复后台脚本读取 userConfig 的问题 [[2240a62](https://github.com/scriptscat/scriptcat/commit/2240a6294cf495fed771dfdfe9497bed86b967b3)]
- 🐛 修复 GM_getValue 与 GM_info 问题 [#393](https://github.com/scriptscat/scriptcat/issues/393) by @WhiteSevs [[e765476](https://github.com/scriptscat/scriptcat/commit/e76547617f358cbac8be1b99eff68a44968050b9)]
- 🐛 修复 message 不输出错误信息 by @WhiteSevs [[04bf703](https://github.com/scriptscat/scriptcat/commit/04bf7038cff1161c8242b1b93edd7f3ba5964520)]
- 🐛 修复 GM_getTab 回调函数入参为空时的值 by @WhiteSevs [[3f3cac5](https://github.com/scriptscat/scriptcat/commit/3f3cac5feb90fcc2893824a4bc920fbeacd367de)]
- 🐛 修复 GM_openInTab 的返回值 by @WhiteSevs [[2fa5b33](https://github.com/scriptscat/scriptcat/commit/2fa5b337df12d777479c7d896da6a98baa9b1ad2)]
- 🐛 修复 GM.cookie 不存在 by @WhiteSevs [8889f64]

### Miscellaneous

- 👷 improve github actions ([#407](https://github.com/scriptscat/scriptcat/issues/407)) by @Mikachu2333 [[3970658](https://github.com/scriptscat/scriptcat/commit/3970658c67e58349c86e5e5a36a973168fbd2cce)]

<a name="0.17.0-beta.1"></a>

## 0.17.0-beta.1 (2025-05-28)

优先修复几个严重的问题并发布

### Added

- ✨ 实现批量脚本拖拽导入 / 批量脚本本地导入 ([#396](https://github.com/scriptscat/scriptcat/issues/396)) by @DreamNya [[178e77d](https://github.com/scriptscat/scriptcat/commit/178e77d6a779fdacb5e8d0d24b6b852f50e09f2c)]
- ✨ 批量脚本链接导入 ([#395](https://github.com/scriptscat/scriptcat/issues/395)) by @DreamNya [[7a0f77e](https://github.com/scriptscat/scriptcat/commit/7a0f77ee9b627d007db861bebad6f656d1452453)]

### Fixed

- 🐛 修复 GM_addValueChangeListener 问题 [#404](https://github.com/scriptscat/scriptcat/issues/404) [[f698722](https://github.com/scriptscat/scriptcat/commit/f6987220805892ef5a85fd99bd8b12dacbb7e979)]
- 🐛 修复脚本 match 和 include 问题 https://github.com/scriptscat/scriptcat/issues/398#issuecomment-2892698500 [[6c9cbf1](https://github.com/scriptscat/scriptcat/commit/6c9cbf173b5e74dbe20d8630443b125742829f58)]
- 🐛 修复端口导致注册 userScript 失败的问题 [#390](https://github.com/scriptscat/scriptcat/issues/390) [[3f57e8f](https://github.com/scriptscat/scriptcat/commit/3f57e8f5000da299e959899ec9dc785c239e2c11)]

<a name="0.17.0-beta"></a>

## 0.17.0-beta (2025-05-13)

由于 Chrome 政策原因，Manifest V2 被自动禁用，提前将本版本将更新至 Chrome 的正式版，如有问题请及时反馈，感谢理解。

### Added

- ✨ 本地/链接导入 [[70554c7](https://github.com/scriptscat/scriptcat/commit/70554c7c8e90a8c81b280cb003b4be353fa45b68)]
- ✨ 实现 @run-in / 分离隐身模式 ([#384](https://github.com/scriptscat/scriptcat/issues/384)) by @DreamNya [[865e5f6](https://github.com/scriptscat/scriptcat/commit/865e5f6717dfb4e13ce529332f1080c28b9ee005)]
- ✨ 实现 window.close / window.focus ([#383](https://github.com/scriptscat/scriptcat/issues/383)) by @DreamNya [[bcc2a5b](https://github.com/scriptscat/scriptcat/commit/bcc2a5b17db02cf28b451a79c1f747322e6afd30)]

### Changed

- ⬆️ 更新 ESLint 依赖及规则 ([#385](https://github.com/scriptscat/scriptcat/issues/385)) by @DreamNya [[e2c860d](https://github.com/scriptscat/scriptcat/commit/e2c860df414b3415353fc84bae3d87e02417ad35)]

### Fixed

- 🐛 修复 ESLint 支持 CATApi / Headers 问题 ([#386](https://github.com/scriptscat/scriptcat/issues/386)) by @DreamNya [[7cd1dcd](https://github.com/scriptscat/scriptcat/commit/7cd1dcd3dec97233df8631d02d6e5a1116074e53)]

<a name="0.17.0-alpha.4"></a>

## 0.17.0-alpha.4 (2025-05-03)

### Added

- ✨ 添加 GM_info 中的 downloadMode 标识 [#348](https://github.com/scriptscat/scriptcat/issues/348) [[28f3d86](https://github.com/scriptscat/scriptcat/commit/28f3d86d5721c66850b27388028b99ec3ebb5a2c)]

### Changed

- ⚡ 性能优化 [[20eba92](https://github.com/scriptscat/scriptcat/commit/20eba92c997a3874214bfcdd271f9a24e6283b70)]
- ⚡ 优化打包文件大小 [#376](https://github.com/scriptscat/scriptcat/issues/376) [[324e27a](https://github.com/scriptscat/scriptcat/commit/324e27aa76f2bdbe1059683c18618d7faae3b64c)]
- ♻️ 优化引导与脚本站外部调用等功能 [[223da30](https://github.com/scriptscat/scriptcat/commit/223da30904844134caac303727b709a84a808803)]
- 🔥 移除了`@require-css`

### Fixed

- 🐛 修复从 GitHub 安装脚本卡住的问题 [#378](https://github.com/scriptscat/scriptcat/issues/378) [[c299df0](https://github.com/scriptscat/scriptcat/commit/c299df0d1b6f1ff32cac86d865d7cb379bc518c3)]
- 🐛 处理 GM_xmlhttpRequest redirect 问题 [#330](https://github.com/scriptscat/scriptcat/issues/330) [[47d7cec](https://github.com/scriptscat/scriptcat/commit/47d7cec7bd8f6cd50a95a97cb96ca88551ff5855)]
- 🐛 更换交互 element 方式 [#334](https://github.com/scriptscat/scriptcat/issues/334) [[e04795a](https://github.com/scriptscat/scriptcat/commit/e04795a51c30c16f3e4ad9daa364d57254a556a4)]
- 🐛 修复 GM.\* API 问题 [#363](https://github.com/scriptscat/scriptcat/issues/363) [[ca6324d](https://github.com/scriptscat/scriptcat/commit/ca6324d2f728c02534c9cccaaf555ef72dc991c0)]
- 🐛 修复脚本匹配、隐藏排序、首次打开浏览器加载脚本等问题 [#317](https://github.com/scriptscat/scriptcat/issues/317) [[2988176](https://github.com/scriptscat/scriptcat/commit/29881765fc6b32061a521cd933b069f44ed2c778)]
- 🐛 修复首次打开浏览器加载脚本的问题 [[2254fd1](https://github.com/scriptscat/scriptcat/commit/2254fd10867ca4a2ac02fd19e71b99cf5eea30d2)]

<a name="0.17.0-alpha.3"></a>

## 0.17.0-alpha.3 (2025-04-25)

从 v0.17.0 开始，脚本猫升级为 manifest v3，并且切换储存引擎`indexedDB`为`chrome.storage.local`，如果发现数据出现问题，请前往[Github](https://github.com/scriptscat/scriptcat/issues)给我们反馈。

你可以在[Chrome](https://chromewebstore.google.com/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/jaehimmlecjmebpekkipmpmbpfhdacom?authuser=0&hl=zh-CN)与[Edge](https://microsoftedge.microsoft.com/addons/detail/%E8%84%9A%E6%9C%AC%E7%8C%AB-beta/nimmbghgpcjmeniofmpdfkofcedcjpfi)安装 Beta 版本

重构为 manifest v3，更换储存引擎，修改部分特性

### Changed

- ♻️ 新储存引擎数据迁移 [[deace16](https://github.com/scriptscat/scriptcat/commit/deace1633e1f46db4b4dcc5cb1d3c63a4d273244)]
- ♻️ 重构代码，升级为 manifest v3 [[fcb4cc4](https://github.com/scriptscat/scriptcat/commit/fcb4cc48afcb12106eec8d39a5d902504e2553fc)]
- 为了与 tm 保持一致移除`GM_xmlhttpRequest`的`maxRedirects`使用`redirect`替代
- 移除`GM_cookie`的`store`方法与`storeId`、`tabId`，现在获取 cookie 会直接取当前页面的`store`（例如隐身窗口与普通窗口的 store 是不同的）

### Fixed

- 🐛 修复重构 mv3 之后的一些细节问题 [[416442c](https://github.com/scriptscat/scriptcat/commit/416442c9494cacf8e3d0f1028e5856819811e4c6)]
- 🐛 修复 OneDrive 上传文件问题 [#366](https://github.com/scriptscat/scriptcat/issues/366) [[ad5a711](https://github.com/scriptscat/scriptcat/commit/ad5a7116c9d54b4e4a4ab53420d0e1d185612f98)]

**Full Changelog**: https://github.com/scriptscat/scriptcat/compare/v0.16.6...v0.17.0-alpha.3

<a name="0.16.11"></a>

## 0.16.11 (2025-08-26)

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

<a name="0.16.9"></a>

## 0.16.9 (2025-07-09)

误操作导致 v0.16.8 在 firefox 被占，所以跳过了 v0.16.8

### Fixed

- 🐛 修复 Firefox 兼容问题 ([#510](https://github.com/scriptscat/scriptcat/issues/510)) [[beb385d](https://github.com/scriptscat/scriptcat/commit/beb385d69faa29493887fef5089a03344cb0d9dc)] (by @cyfung1031)

### Changed

- ⚡ TreeShaking ([#510](https://github.com/scriptscat/scriptcat/issues/510)) [[beb385d](https://github.com/scriptscat/scriptcat/commit/beb385d69faa29493887fef5089a03344cb0d9dc)] (by @cyfung1031)

### Miscellaneous

- 👷 处理 firefox 打包 [[814c9c3](https://github.com/scriptscat/scriptcat/commit/814c9c3ff26815f72a59ab160bb74689451aa158)]

<a name="0.16.7"></a>

## 0.16.7 (2025-07-08)

这是 Manifest v2 的修复版本，后续只会处理一些非严重与功能性 bug，推荐更新你的浏览器到最新版本并安装最新版本的 ScriptCat(v0.17.0+)。

Firefox 的 Manifest V3 版本还在筹备中。

### Fixed

- 🐛 修复 onxxxx 问题 [[9cf59a3](https://github.com/scriptscat/scriptcat/commit/9cf59a3e26360a47feb3b95136721b56820503ca)]
- 🐛 处理扩展降级问题 [#503](https://github.com/scriptscat/scriptcat/issues/503) [[faae3b8](https://github.com/scriptscat/scriptcat/commit/faae3b83c6bdfacc56bc7335545cb397e97dfa69)]
- 🐛 修正垃圾打包問題 ([#501](https://github.com/scriptscat/scriptcat/issues/501)) [[3091ec0](https://github.com/scriptscat/scriptcat/commit/3091ec02e9199b9c42949b32411f641f15cda8f7)] (by @cyfung1031)
- 🐛 修复 OneDrive 上传文件问题 [#366](https://github.com/scriptscat/scriptcat/issues/366) [[ad5a711](https://github.com/scriptscat/scriptcat/commit/ad5a7116c9d54b4e4a4ab53420d0e1d185612f98)]

### Miscellaneous

- 🌐 添加翻译文件 [[92c1951](https://github.com/scriptscat/scriptcat/commit/92c195167ef050f1725b29767697f47f3405421f)]

<a name="0.16.6"></a>

## 0.16.6 (2024-10-24)

> Manifest V3 重构计划筹备中，非严重与功能性 bug 暂时不会处理。受限于[Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/checklist?hl=zh-cn)平台，升级后可能需要你开启扩展的开发者模式才可以继续使用前台脚本(Userscript)

### Changed

- 🎨 优化 WebDAV 密码输入，修改为密码框 ([#311](https://github.com/scriptscat/scriptcat/issues/311)) by @Przeblysk [[9f1003c](https://github.com/scriptscat/scriptcat/commit/9f1003ca18925b1c3ef8de6cd4c393d0d0f97dc3)]

### Fixed

- 🐛 修复 GM.xmlHttpRequest 实现 [#308](https://github.com/scriptscat/scriptcat/issues/308) [[f0c3a67](https://github.com/scriptscat/scriptcat/commit/f0c3a6739e290426548d50209c241215ec005480)]

### Miscellaneous

- 🌐 添加越南语 ([#314](https://github.com/scriptscat/scriptcat/issues/314)) by @RenjiYuusei [[50c7a36](https://github.com/scriptscat/scriptcat/commit/50c7a3643400141e568d6bdc35506b93f7804635)]

<a name="0.16.5"></a>

## 0.16.5 (2024-07-12)

### Fixed

- 🐛 修复 chrome v127 下 GM_addElement 相关问题 [#299](https://github.com/scriptscat/scriptcat/issues/299) [[cd749af](https://github.com/scriptscat/scriptcat/commit/cd749afbe98a92016a22c5f7fee2a9d40fd8f815)]

<a name="0.16.4"></a>

## 0.16.4 (2024-07-10)

### Added

- ✨ 脚本列表页显示脚本 icon [#292](https://github.com/scriptscat/scriptcat/issues/292) [[1e82fe4](https://github.com/scriptscat/scriptcat/commit/1e82fe4e1e9f71bf202622dedf9adc2d3dcbf13b)]
- ✨ 新建脚本支持导入本地文件 [#294](https://github.com/scriptscat/scriptcat/issues/294) [[faeb30c](https://github.com/scriptscat/scriptcat/commit/faeb30c2803db8873cc186a28008c5cc9c6b5393)]

### Fixed

- 🐛 修复 English 下列宽问题 [#297](https://github.com/scriptscat/scriptcat/issues/297) [[fcfb3ac](https://github.com/scriptscat/scriptcat/commit/fcfb3ac0e3378b9607ee29593000e660edc4b955)]
- 🐛 修复删除 Userconfig 后主页还是会显示的问题 [#285](https://github.com/scriptscat/scriptcat/issues/285) [[dd3b1b4](https://github.com/scriptscat/scriptcat/commit/dd3b1b4f9012eecd52f5f27d8f6f4fb24c9888c4)]
- 🐛 修复 firefox 环境下 GM_addElement 的问题 [#291](https://github.com/scriptscat/scriptcat/issues/291) [[013a4f6](https://github.com/scriptscat/scriptcat/commit/013a4f614e62beeab6e0696fd09c11dcea9e0607)]
- 🐛 修复排序后点击错乱的问题 [#283](https://github.com/scriptscat/scriptcat/issues/283) [[8a05f00](https://github.com/scriptscat/scriptcat/commit/8a05f00c2922c2382bae9c46a3d49a08223b4de5)]
- 🐛 处理页面回退 [#277](https://github.com/scriptscat/scriptcat/issues/277) [[f6f0a80](https://github.com/scriptscat/scriptcat/commit/f6f0a80d10ccc0597fb7128fdf125bbd16aa1c56)]
- 🐛 修复 RegExp 内容被覆盖的问题 [#293](https://github.com/scriptscat/scriptcat/issues/293) [#289](https://github.com/scriptscat/scriptcat/issues/289) [[3ef9fbc](https://github.com/scriptscat/scriptcat/commit/3ef9fbcaf3d7b261792476f2486dc4b4a002bead)]

<a name="0.16.3"></a>

## 0.16.3 (2024-05-01)

### Fixed

- 🐛 修复 GM.\*兼容问题 [#274](https://github.com/scriptscat/scriptcat/issues/274) [[389e6d2](https://github.com/scriptscat/scriptcat/commit/389e6d27ff697312a716a2a152de9492b23d4f3a)]
- 🐛 处理 on 事件的移除 [[c69c208](https://github.com/scriptscat/scriptcat/commit/c69c2085c410f1a2e65c221917353f13c4f1bc71)]
- 🐛 修复 header 设置导致的请求失败 [[b5c2910](https://github.com/scriptscat/scriptcat/commit/b5c2910a526dbf785e481681956a8aa9efe2a20c)]
- 🐛 处理全局属性 [[ff3b721](https://github.com/scriptscat/scriptcat/commit/ff3b72192efbe8712479d9460a4f1c0bf45a6e0e)]
- 🐛 修复 window 穿透问题 [#273](https://github.com/scriptscat/scriptcat/issues/273) [[577f7e5](https://github.com/scriptscat/scriptcat/commit/577f7e523b525f38bb9d9d3dddae5921b88c3e9a)]
- 🐛 修复 hasOwnProperty 返回 undefined 的问题 [#272](https://github.com/scriptscat/scriptcat/issues/272) [[b93be76](https://github.com/scriptscat/scriptcat/commit/b93be76c684ba0a9820deff65cf9d2baaa007e18)]

### Miscellaneous

- 🌐 扩展名和描述 i18n [[03987b0](https://github.com/scriptscat/scriptcat/commit/03987b0604daef7168b73ad80337af0e8c8c5549)]
- 👷 修复 firefox 扩展包构建 [[328f84f](https://github.com/scriptscat/scriptcat/commit/328f84f2a0b3523a2cb40d16b72d4110e3cd255d)]

<a name="0.16.2"></a>

## 0.16.2 (2024-04-22)

> 后续主要精力将放在`Manifest V3`的支持上，本次版本主要是一些小的改进与修复，详细功能演示请看：[v0.16.2](./v0.16#v0162)

### Added

- ✨ 菜单自动隐藏配置 [#269](https://github.com/scriptscat/scriptcat/issues/269) [[3e8f2ce](https://github.com/scriptscat/scriptcat/commit/3e8f2cee095ce25395f49d2bfce3ccf199c1d880)]
- ✨ 脚本列表添加列调整隐藏操作 [#269](https://github.com/scriptscat/scriptcat/issues/269) [[b8f679d](https://github.com/scriptscat/scriptcat/commit/b8f679df134448e0f3fca7f43795917f225c8b05)]
- ✅ 修复测试问题 [[04dbdb2](https://github.com/scriptscat/scriptcat/commit/04dbdb2d8030c035972ab077d63f8ef79b3d0621)]

### Fixed

- ✏️ 修复引导拼写错误 [#268](https://github.com/scriptscat/scriptcat/issues/268) [[ca742c3](https://github.com/scriptscat/scriptcat/commit/ca742c3189c709011797e681b9aa1740fa1aedb8)]
- 🐛 修复百度网盘删除文件失败的问题 [[e516058](https://github.com/scriptscat/scriptcat/commit/e516058b8f7e5e0dd4bda39c0ea6d332a679bbdd)]
- 🐛 修复同步功能删除会恢复的问题 [[75c4522](https://github.com/scriptscat/scriptcat/commit/75c452284d4e8676a42291e2b04d4a9f7785db3d)]

### Miscellaneous

- 👷 处理 edge 商店发布不能包含压缩文件的问题 [[e5b2e3b](https://github.com/scriptscat/scriptcat/commit/e5b2e3b2df73cfb51a2a45ee44a0e5e1928a8a29)]

**Full Changelog**: [v0.16.1...v0.16.2](https://github.com/scriptscat/scriptcat/compare/v0.16.1...v0.16.2)

<a name="0.16.1"></a>

## 0.16.1 (2024-02-26)

### Added

- ✨ 最后更新添加排序功能 [#250](https://github.com/scriptscat/scriptcat/issues/250) [[ded11ca](https://github.com/scriptscat/scriptcat/commit/ded11cafaa31e7f5ec43d4f96f6db41cfa8c7ff9)]

### Changed

- ⚡ 优化名称搜索 [#262](https://github.com/scriptscat/scriptcat/issues/262) [[08778ed](https://github.com/scriptscat/scriptcat/commit/08778ed945a5887c93ba24c816f4d8febdf3ac1e)]

### Fixed

- 🐛 修复脚本删除同步失败的问题 [#254](https://github.com/scriptscat/scriptcat/issues/254) [[bf68abb](https://github.com/scriptscat/scriptcat/commit/bf68abb9b7bffe3c8658d361c92e850b0c555953)]
- 🐛 修复订阅脚本重复安装的问题 [#257](https://github.com/scriptscat/scriptcat/issues/257) [[57bc6f9](https://github.com/scriptscat/scriptcat/commit/57bc6f9390a33400730eb7c261cf7c23c5f3532a)]
- 🐛 修复 toString.call(window)返回内容不正确 [#260](https://github.com/scriptscat/scriptcat/issues/260) [[2288dae](https://github.com/scriptscat/scriptcat/commit/2288dae8d5589c97a8d2b1983fb9b97df05df04e)]
- 🐛 修复并发 setValue 导致的数据错误 [#249](https://github.com/scriptscat/scriptcat/issues/249) [[0b4d241](https://github.com/scriptscat/scriptcat/commit/0b4d2413382d0b8c5671eb6685808c77deaf9117)]
- 🐛 修复 vscode 同步时文件路径变更导致重复同步 [#247](https://github.com/scriptscat/scriptcat/issues/247) [[a6efaa7](https://github.com/scriptscat/scriptcat/commit/a6efaa77fe34d5f1b836e9e56e7e6c358af7e85d)]
- 🐛 新增脚本支持顶级 await by @DreamNya [#258](https://github.com/scriptscat/scriptcat/issues/258) [[3a37af2](https://github.com/scriptscat/scriptcat/commit/3a37af2d885dc133d4ae3f82b7f9ca49d0279a5f)]

**Full Changelog**: [v0.16.0...v0.16.1](https://github.com/scriptscat/scriptcat/compare/v0.16.0...v0.16.1)

<a name="0.16.0"></a>

## 0.16.0 (2023-12-21)

### Added

- ✨ 新增 GM_info 元数据 connects [#245](https://github.com/scriptscat/scriptcat/issues/245) [[c04a829](https://github.com/scriptscat/scriptcat/commit/c04a82906192ba29580e51d90b112435d44d2418)]

### Fixed

- 🐛 修复语言切换&quot;最后更新&quot;字段翻译不同步的问题 [#241](https://github.com/scriptscat/scriptcat/issues/241) [[2d178ac](https://github.com/scriptscat/scriptcat/commit/2d178acd29054f1064063f7b58eef6dfadb3ba5c)]
- 🐛 修复@grant GM.\*声明问题 [#243](https://github.com/scriptscat/scriptcat/issues/243) [[6d7efa6](https://github.com/scriptscat/scriptcat/commit/6d7efa6b5051dcc947ffb40727febd1b585ca428)]
- 🐛 修复@match 端口匹配错误 [#244](https://github.com/scriptscat/scriptcat/issues/244) [[2e378c3](https://github.com/scriptscat/scriptcat/commit/2e378c35b5d20280a3e26a540a61b31629d358ac)]
- 🐛 修复往 global 写入 Symbol 属性问题 [[d8bb2f1](https://github.com/scriptscat/scriptcat/commit/d8bb2f1c93c9689dd4d6458a3f4564d4acb67be4)]
- 🐛 修复引入的 lodash 与页面冲突问题 [[96280a2](https://github.com/scriptscat/scriptcat/commit/96280a24e284ed62654097573c14e574996e2a5a)]

<a name="0.16.0-beta"></a>

## 0.16.0-beta (2023-11-28)

### Added

- ✨ 添加 i18n 所见即所得模式 [[460088a](https://github.com/scriptscat/scriptcat/commit/460088a27ee20036aad27d5eccabb3311fc71863)]
- ✨ 优化语言选择 [[5807a2a](https://github.com/scriptscat/scriptcat/commit/5807a2af0aa62a945e273a677597f7c607dcd9d9)]
- ✨ 使用 crowdin 管理翻译 [[c62a559](https://github.com/scriptscat/scriptcat/commit/c62a5593c5d57feb8239e50ee90aaa3f3fc309b4)]

### Changed

- 💄 调整 Badge 颜色为灰色 [[97c06f5](https://github.com/scriptscat/scriptcat/commit/97c06f552133b4fba3b2d6f27cf5b39f3d1c3323)]

### Fixed

- 🐛 修复 onedrive 空间问题 [#224](https://github.com/scriptscat/scriptcat/issues/224) [[0d10588](https://github.com/scriptscat/scriptcat/commit/0d1058818538a0764e9c55b3842480a202230231)]
- 🐛 处理 onedrive e5 账号文件同步文件 [#224](https://github.com/scriptscat/scriptcat/issues/224) [[dc56ec6](https://github.com/scriptscat/scriptcat/commit/dc56ec623ad8b00976aef71df81fffdd41863180)]
- 🐛 修复 gf logo 问题 [[092517e](https://github.com/scriptscat/scriptcat/commit/092517ebb84e9309c7577fac05ce84f6cb334d9c)]
- 🐛 修复不同语言下 table 的宽度问题 ([#236](https://github.com/scriptscat/scriptcat/issues/236)) [[3eb84b5](https://github.com/scriptscat/scriptcat/commit/3eb84b51ad69ed5ed74181774b6a356b30fa8c36)] by [@duoluodexiaoxiaoyuan](https://github.com/duoluodexiaoxiaoyuan)
- 🐛 修复新的注入方式导致 dev 模式无法正常运行的问题 [[a96ab94](https://github.com/scriptscat/scriptcat/commit/a96ab947cfa1321adb7a560f922a1b5f85ffb21e)]
- 🐛 优化脚本运行框架注入速度 [#232](https://github.com/scriptscat/scriptcat/issues/232) [[4cf6450](https://github.com/scriptscat/scriptcat/commit/4cf6450debe4b3a6b773459559da486f1863298f)]
- 🐛 默认不传 origin header [#233](https://github.com/scriptscat/scriptcat/issues/233) [[9d4ebcc](https://github.com/scriptscat/scriptcat/commit/9d4ebcc7711475696613b1ed7b42256046371198)]

<a name="0.15.1"></a>

## 0.15.1 (2023-08-30)

### Added

- ✨ 优化授权管理 [[5eb7c5a](https://github.com/scriptscat/scriptcat/commit/5eb7c5aa3b67c9dba20712b8c69f83cd0b3ab302)]

### Changed

- ⬆️ 升级 cron 包 fixed: [#152](https://github.com/scriptscat/scriptcat/issues/152) [[0c43741](https://github.com/scriptscat/scriptcat/commit/0c4374196ebe8b29ae1a9c61353f6ff48d0d8843)]

### Fixed

- 🐛 修复重定向后的携带#号的 finalUrl 问题 [[715639e](https://github.com/scriptscat/scriptcat/commit/715639e81ecc318b1432cd15b70cc0f89d99a007)]
- 🐛 修复 CAT_fileStorage 网络错误也会导致配置实现的问题 fixed [#224](https://github.com/scriptscat/scriptcat/issues/224) [[c309832](https://github.com/scriptscat/scriptcat/commit/c309832a7da4b110b43537ef53518df1ca1e12b2)]
- 🐛 忽略 webdav 创建目录错误 [#213](https://github.com/scriptscat/scriptcat/issues/213) [[890076a](https://github.com/scriptscat/scriptcat/commit/890076a7416513c867f1f2aef7c9929aa899894e)]

<a name="0.15.0"></a>

## 0.15.0 (2023-08-15)

> 添加了新手引导

### Added

- ✨ 首次进入时打开引导与更新时打开更新日志 [[f400658](https://github.com/scriptscat/scriptcat/commit/f40065815c75a046e752168d15e1718ba91bceff)]
- ✨ 新手引导 [[f355efb](https://github.com/scriptscat/scriptcat/commit/f355efbc7a5f36d7a6c0352e7477cd1a14c781e1)]

### Fixed

- 🐛 优化同步错误处理 [[cc5e22d](https://github.com/scriptscat/scriptcat/commit/cc5e22d1186395d10651e2d3a37bc44659cfd559)]

<a name="0.15.0-beta"></a>

## 0.15.0-beta (2023-07-31)

> 优化为主的一个版本

### Added

- ✨ 脚本名支持 i18n ([#221](https://github.com/scriptscat/scriptcat/issues/221)) [[968122d](https://github.com/scriptscat/scriptcat/commit/968122df58592fd29b4a82b665104dd26eb8d319)] ([@LiWeny16](https://github.com/LiWeny16))
- ✨ 脚本批量更新 ([#219](https://github.com/scriptscat/scriptcat/issues/219)) [[8d442ac](https://github.com/scriptscat/scriptcat/commit/8d442ac5c9de2ab7d6694d4b15afdf572291d75d)] ([@LiWeny16](https://github.com/LiWeny16))

### Fixed

- 🐛 优化同步报错问题 [#222](https://github.com/scriptscat/scriptcat/issues/222) [[dd05752](https://github.com/scriptscat/scriptcat/commit/dd0575268638e4009d3fb6c5d389ce836ad761a2)]
- 🐛 修复常量值被改变的问题 [#214](https://github.com/scriptscat/scriptcat/issues/214) [[63d3061](https://github.com/scriptscat/scriptcat/commit/63d3061a755d625dca853a776b7f10507cba8eda)]
- 🐛 修复 GM_addElement 父节点参数为 shadowDom 错误的问题 [#214](https://github.com/scriptscat/scriptcat/issues/214) [[0bbe7ce](https://github.com/scriptscat/scriptcat/commit/0bbe7ce4e4745a21aefb05f5a8633382aaf3ffa0)]
- 🐛 修复列表排序问题 [[f1527b0](https://github.com/scriptscat/scriptcat/commit/f1527b0e814201d31c4b06b93a2ab613b46379bd)]
- 🐛 修复 GM_openInTab loadInBackground 参数问题 [[1f29bfc](https://github.com/scriptscat/scriptcat/commit/1f29bfc24dd00b418acb2d52691f847fddec5f27)]
- 🐛 修复 xml 文档无法加载脚本的问题 [#211](https://github.com/scriptscat/scriptcat/issues/211) [[ef7efbd](https://github.com/scriptscat/scriptcat/commit/ef7efbdd1da3011054edc7ff6e39693033a538b1)]
- 🐛 修复网盘同步脚本覆盖问题 [[e4bd5d4](https://github.com/scriptscat/scriptcat/commit/e4bd5d441c37f2a32b6854c63a7ebcd6cd719abe)]
- 🐛 修复后台脚本无法控制 setInterval 停止的问题 [#207](https://github.com/scriptscat/scriptcat/issues/207) [[d059ef7](https://github.com/scriptscat/scriptcat/commit/d059ef7ef9fa4b097b4a3682f36dc973e82cf61e)]
- 🐛 修复网盘登录掉了之后无法重新登录的问题 [#210](https://github.com/scriptscat/scriptcat/issues/210) [[963a6d2](https://github.com/scriptscat/scriptcat/commit/963a6d289afa84c43b43301e1764bc10cd4ccaa7)]
- 🐛 修复脚本列表页一些警告问题 [[fc6d14d](https://github.com/scriptscat/scriptcat/commit/fc6d14d07eb74f6008a8b2bee3be4d79cf85e610)]
- 🐛 修复 vscode 重连问题与某些情况下停止脚本无效的问题 [[bb7d4d5](https://github.com/scriptscat/scriptcat/commit/bb7d4d501e18730fe359fa6bc01550be68849043)]
- 🐛 修复 GM_openInTab active 参数始终为 true 的问题 [[274ef59](https://github.com/scriptscat/scriptcat/commit/274ef59fb7bafe951e120c63536ba7b94aea30e7)]
- 🐛 修复更新日志通知不自动关闭 [[7a7e221](https://github.com/scriptscat/scriptcat/commit/7a7e2212789d219f64b394860cf462b48b81f341)]

<a name="0.14.1"></a>

## 0.14.1 (2023-06-26)

> 修复几个比较严重的问题，且影响版本广
> 反复储存 oldScript 对象，数据量过大时可能导致脚本加载失败

### Added

- ✨ 将 UserConfig 暴露至 GM_info 对象中 ([#206](https://github.com/scriptscat/scriptcat/issues/206)) [[3de39e7](https://github.com/scriptscat/scriptcat/commit/3de39e78fefefafefdd4efb3e03917cb55f4e4cc)] ([@DreamNya](https://github.com/DreamNya))

### Fixed

- 🐛 修复 vscode 连接问题与同步问题 [[06c3ef7](https://github.com/scriptscat/scriptcat/commit/06c3ef79d5b59df4268dd8388bf798ef8284c42a)]
- 🐛 修复 GM_openInTab 默认在后台打开页面的问题 [[7d2a5b2](https://github.com/scriptscat/scriptcat/commit/7d2a5b2a4ffb6d3023ee85ce1b9e7e629ac9d774)]
- 🐛 修复反复储存 oldScript 对象问题 [[4832a80](https://github.com/scriptscat/scriptcat/commit/4832a80b5a3c553563367892adcdf85e9832fc98)]

<a name="0.14.0"></a>

## 0.14.0 (2023-06-20)

> 🎉🎉🎉 脚本猫开始支持多国语言，向国际化脚本管理器迈出第一步！ 💥💥💥

### Fixed

- 🐛 修复更新时间 i18n 问题 [[40bc8da](https://github.com/scriptscat/scriptcat/commit/40bc8dacb732343a0df7440ad51012dd5bed6b28)]
- 🐛 修复 RegExp 需要全局对象的问题 fixes [#203](https://github.com/scriptscat/scriptcat/issues/203) [[705641b](https://github.com/scriptscat/scriptcat/commit/705641b363d8623ae55f6b4d81cf7dcbc5f0945d)]

### Miscellaneous

- 🌐 add english readme ([#204](https://github.com/scriptscat/scriptcat/issues/204)) [[e56d4fc](https://github.com/scriptscat/scriptcat/commit/e56d4fc6bf44cd59162e5adf9926459ec33f9217)]
- 🌐 调整无数据的文案与 WebDAV 账号密码文案 [[9a82eac](https://github.com/scriptscat/scriptcat/commit/9a82eac94f921cc361cc9bb97431d5225599af0a)]

<a name="0.14.0-beta.1"></a>

## 0.14.0-beta.1 (2023-06-16)

> 🎉🎉🎉 脚本猫开始支持多国语言，向国际化脚本管理器迈出第一步！ 💥💥💥

### Added

- ✨ userconfig textarea 支持 rows 参数 [[a2003a0](https://github.com/scriptscat/scriptcat/commit/a2003a0ca7c9bd00b582ddecbff4cbf37eef5337)]

### Fixed

- 🐛 修复后台脚本状态显示错误的问题 [[d997dc7](https://github.com/scriptscat/scriptcat/commit/d997dc713026a40147503eda1220b5bae0979542)]

### Miscellaneous

- 🌐 i18n 国际化 [#188](https://github.com/scriptscat/scriptcat/issues/188) ([#202](https://github.com/scriptscat/scriptcat/issues/202)) [[d0e6ef0](https://github.com/scriptscat/scriptcat/commit/d0e6ef07b33fe24416212079dfa51ed8a2cb6827)]

<a name="0.14.0-beta"></a>

## 0.14.0-beta (2023-06-14)

### Added

- ✨ 后台脚本增加重试逻辑 [[16551df](https://github.com/scriptscat/scriptcat/commit/16551df926f5e39e8b9071d106b86b6499d4b090)]
- ✨ UserConfig 支持 TextArea [[fc2134b](https://github.com/scriptscat/scriptcat/commit/fc2134bf981b69765cdc32afbf76a9909d1c6ebf)]
- ✨ 支持暴力猴的导入格式 [[1398e59](https://github.com/scriptscat/scriptcat/commit/1398e5954c00db79c44ea5413dec9b05078971a3)]
- ✨ match 和更新 URL 管理 [[a805dde](https://github.com/scriptscat/scriptcat/commit/a805ddebbee761ebcf21550b787ec68c737fc9fa)]
- ✨ fileStorage API 改进 [#138](https://github.com/scriptscat/scriptcat/issues/138) ([#199](https://github.com/scriptscat/scriptcat/issues/199)) [[707d391](https://github.com/scriptscat/scriptcat/commit/707d3910a3b85d846dbcc5b27ffcec0bb117acc2)]
- ✨ 脚本列表批量操作 [#164](https://github.com/scriptscat/scriptcat/issues/164) [#175](https://github.com/scriptscat/scriptcat/issues/175) [[af0ba88](https://github.com/scriptscat/scriptcat/commit/af0ba8878355d55bd1a1d4d83d9d7e2b23352fcc)]

### Fixed

- 🐛 修复 tools 页面滚动条问题 ([#201](https://github.com/scriptscat/scriptcat/issues/201)) [[f3493ae](https://github.com/scriptscat/scriptcat/commit/f3493aed46166b6d0e541c7145fb6d8576968150)]
- 🐛 修复 GM_log 打印对象时报错 [[4a6516d](https://github.com/scriptscat/scriptcat/commit/4a6516df950caf024a624dea740c4595d0a93e4a)]
- 🐛 修复 FormItem 错误导致的用户配置、储存管理等功能无法编辑的问题 [[243f90a](https://github.com/scriptscat/scriptcat/commit/243f90ac9b922183325dda0aa8b0c7df63fb8353)]
- 🐛 修复某些.user.js url 加载错误 [[2596617](https://github.com/scriptscat/scriptcat/commit/2596617e34261e05aaa888e928c1a0f5bb0e3b12)]

<a name="0.13.1"></a>

## 0.13.1 (2023-06-02)

### Fixed

- 🐛 优化 options 页 header， 新增外部链接 [[951833e](https://github.com/scriptscat/scriptcat/commit/951833eab5368fc179a0192f4513a8edc39fdf86)]
- 🐛 修复沙盒加载问题 [#195](https://github.com/scriptscat/scriptcat/issues/195) [[4e1c904](https://github.com/scriptscat/scriptcat/commit/4e1c904be1595ff48ca8ba414d8478caaf67079c)]
- 🐛 修复沙盒默认函数没有 bind 的问题 [[81e46b1](https://github.com/scriptscat/scriptcat/commit/81e46b1f147b7e98120cd53ecdaa0528c65cc6bf)]
- 🐛 修复 firefox csp 策略问题 [#170](https://github.com/scriptscat/scriptcat/issues/170) [[d310275](https://github.com/scriptscat/scriptcat/commit/d3102754bed50b1d1e79d63eaa1f78d1c9345fc4)]

<a name="0.13.0"></a>

## 0.13.0 (2023-05-27)

### Fixed

- 🐛 修复数据导入 tm 问题 [#187](https://github.com/scriptscat/scriptcat/issues/187) [[5546cc1](https://github.com/scriptscat/scriptcat/commit/5546cc1e4aae8ee7f831901431a120bcd7933e6d)]
- 🐛 修复特殊属性导致的问题 [#190](https://github.com/scriptscat/scriptcat/issues/190) [[c453d21](https://github.com/scriptscat/scriptcat/commit/c453d21e409963e85e607acaa46aaef02e0d2362)]
- 🐛 修复 object 类型的值变更会通知的问题 [[146c9ed](https://github.com/scriptscat/scriptcat/commit/146c9ed6cae8fd18c285a806dceed0f20553617d)]
- 🐛 修复支持无 namespace [[e0a9446](https://github.com/scriptscat/scriptcat/commit/e0a944639c26d5fb7a86f35ab5f5eeb050e4133b)]

<a name="0.13.0-beta"></a>

## 0.13.0-beta (2023-05-21)

### Added

- ✨ 授权管理 [#184](https://github.com/scriptscat/scriptcat/issues/184) [[002e443](https://github.com/scriptscat/scriptcat/commit/002e443d4aa42385fbfa57865b9bf0af60cc95d6)]
- ✨ 打开备份目录 [#182](https://github.com/scriptscat/scriptcat/issues/182) [[7274e40](https://github.com/scriptscat/scriptcat/commit/7274e40893619249d9a775e63eecae4a8c971852)]
- ✨ 一键关闭所有脚本按钮 [#130](https://github.com/scriptscat/scriptcat/issues/130) [[27187a6](https://github.com/scriptscat/scriptcat/commit/27187a677115b15f762e9e98a20a8d6432fd1058)]
- ✨ 优化加载逻辑 [#135](https://github.com/scriptscat/scriptcat/issues/135) [[5b9c37d](https://github.com/scriptscat/scriptcat/commit/5b9c37dfa488895978f79653eb3496cbd6b90511)]
- ✨ 新增 iframe 运行计次 [#167](https://github.com/scriptscat/scriptcat/issues/167) [[0a3ae5a](https://github.com/scriptscat/scriptcat/commit/0a3ae5ae042294e5274c964466569c379ac6d181)]
- ✨ 日志定时清理逻辑 [[81587a0](https://github.com/scriptscat/scriptcat/commit/81587a05c65b03c45ebd837c0ba5249a192259f8)]
- ✨ 新增脚本编辑器菜单快捷键显示 [[f9e92b8](https://github.com/scriptscat/scriptcat/commit/f9e92b860980d40c91840e88233b6c1209a0c1dc)]
- ✨ 新增脚本编辑器脚本另存为功能 [[7790137](https://github.com/scriptscat/scriptcat/commit/77901379235482e07a40de543119631d4b57bf99)]
- ✨ 添加 GM_openInTab 新可选功能 [[f2b6722](https://github.com/scriptscat/scriptcat/commit/f2b67222b1179095db0ac04d8c7a1db78ce4e951)]
- ✨ 增加 crontab 悬浮提示 [[8d6ba52](https://github.com/scriptscat/scriptcat/commit/8d6ba52f4515beb25ed4440f00d977e2ccb3ae7f)]
- ✨ eslint quickfix [[b0e9abe](https://github.com/scriptscat/scriptcat/commit/b0e9abee7fe0d92f138e7ff5fb6f0ab608ee89e3)]

### Fixed

- 🐛 修复 debug 值问题 [#163](https://github.com/scriptscat/scriptcat/issues/163) [[826d164](https://github.com/scriptscat/scriptcat/commit/826d164f44ee0d5e45cd71cca97bc8594d0a8318)]
- 🐛 修复同步删除问题 [#143](https://github.com/scriptscat/scriptcat/issues/143) [[021e6db](https://github.com/scriptscat/scriptcat/commit/021e6db15eda2b6276fc18372eb4ac7a2b965bb9)]
- 🐛 修复特殊 function 判断 [[43ee0de](https://github.com/scriptscat/scriptcat/commit/43ee0de9f3d18304a667d01f5601fcd2fb68cc8d)]
- 🐛 修复沙盒隔离问题 [#189](https://github.com/scriptscat/scriptcat/issues/189) [[647de2e](https://github.com/scriptscat/scriptcat/commit/647de2ebc63162204a4bad164938e14e332d77a4)]
- 🐛 添加数据校验 [#161](https://github.com/scriptscat/scriptcat/issues/161) [[2a02ecb](https://github.com/scriptscat/scriptcat/commit/2a02ecb0dd8497c637c5c85af7c7f9c3e9ce7ac3)]
- 🐛 修复排序逻辑问题 [#164](https://github.com/scriptscat/scriptcat/issues/164) [[97c0ac0](https://github.com/scriptscat/scriptcat/commit/97c0ac03561dedd2893fb6d41aefce922df7f832)]
- 🐛 修复脚本更新会导致自定义配置失效的问题 [#174](https://github.com/scriptscat/scriptcat/issues/174) [[aa2ace1](https://github.com/scriptscat/scriptcat/commit/aa2ace198e06199f9a59fe16c467bb6c9b6f0ff9)]
- 🐛 修复 vscode 正常断开后不重新连接的问题 [#176](https://github.com/scriptscat/scriptcat/issues/176) [[f2df2d4](https://github.com/scriptscat/scriptcat/commit/f2df2d40a08289ce0c0fe52c4f3e8fb2c947257a)]
- 🐛 修复 chrome.downloads.download 错误捕获 [[7d4ad2d](https://github.com/scriptscat/scriptcat/commit/7d4ad2d6307ec8d67f310c6e73c1259934f738b1)]

### Miscellaneous

- 优化 useOpen 标签关闭监听方式 [[4ab0d58](https://github.com/scriptscat/scriptcat/commit/4ab0d58a21569d0d9e790e4a3b2ebaa237f2f5ea)]
- 优化 ESLint [[e927f2c](https://github.com/scriptscat/scriptcat/commit/e927f2cbfc2b0b643170aa8b7a13cc6eb28d6d36)]
- 更新monaco@0.37.1，修复多编辑器快捷键冲突 [[348fd67](https://github.com/scriptscat/scriptcat/commit/348fd67c861ece3e658e6f6720d9bc63312276fe)]
- 更新依赖修复 Windows 本地编译错误 [[392e4e6](https://github.com/scriptscat/scriptcat/commit/392e4e682769423f4446dd4a5138a1db89a1c37a)]

<a name="0.12.0"></a>

## 0.12.0 (2023-03-27)

### Added

- ✨ 添加安装脚本成功后的提示与资源过期机制 [#158](https://github.com/scriptscat/scriptcat/issues/158) [[0794cd3](https://github.com/scriptscat/scriptcat/commit/0794cd3be1a54e02529ddfc722a4cf457883952c)]

### Fixed

- 🐛 修复某些以.user.js 为后缀的网页识别成安装脚本 [[f094d80](https://github.com/scriptscat/scriptcat/commit/f094d80dd616995c8ffdbc42f9be52b8fe25b493)]
- 🐛 修复没有菜单时不显示主菜单 [#159](https://github.com/scriptscat/scriptcat/issues/159) [[4c4b15f](https://github.com/scriptscat/scriptcat/commit/4c4b15f46586e5e3b71e16fa337d4bdb6c9eda10)]
- 🐛 修复代码编辑框不跟随暗夜模式变化的问题与优化 id 列为 sort 列 [[df26bdf](https://github.com/scriptscat/scriptcat/commit/df26bdfa734796719b7190e75ad2d1038abc2dfd)]

<a name="0.12.0-beta"></a>

## 0.12.0-beta (2023-03-19)

### Added

- ✨ 根据安装 url 生成安装主页按钮 [#134](https://github.com/scriptscat/scriptcat/issues/134) [[789bda2](https://github.com/scriptscat/scriptcat/commit/789bda2d97b0b02b9ccb886d5c73e0530447bdc6)]
- ✨ 排除指定网址执行 [#144](https://github.com/scriptscat/scriptcat/issues/144) [[2d5573f](https://github.com/scriptscat/scriptcat/commit/2d5573ffeb76ae479f3cfd62d3766c00532f93b1)]

### Changed

- ⚡ 优化获取脚本逻辑 [#134](https://github.com/scriptscat/scriptcat/issues/134) [[81a589e](https://github.com/scriptscat/scriptcat/commit/81a589ea2c4ac46e88cc029b02add095623738e6)]
- ⚡ 优化脚本储存数据过大导致的卡顿问题 [[dbdbec1](https://github.com/scriptscat/scriptcat/commit/dbdbec191aaa6e3f9bda8609feb0e637f160946f)]

### Fixed

- 🐛 修复菜单多次注册的问题 [#129](https://github.com/scriptscat/scriptcat/issues/129) [[9515269](https://github.com/scriptscat/scriptcat/commit/951526918c03dab2e18f37520e6d58b3503979c0)]
- 🐛 修复数据清除错误 [[e3fbaf5](https://github.com/scriptscat/scriptcat/commit/e3fbaf585bf2e845ccee5f3273afb195cc26a356)]
- 🐛 修复 iframe 中运行不在 popup 页显示的问题与添加脚本运行次数 [#154](https://github.com/scriptscat/scriptcat/issues/154) [[b5670c9](https://github.com/scriptscat/scriptcat/commit/b5670c96991a8a2256f577a063f9b0c6e0186823)]
- 🐛 修复 GM_menu 问题 [#153](https://github.com/scriptscat/scriptcat/issues/153) [[4d6eafe](https://github.com/scriptscat/scriptcat/commit/4d6eafe531ca57799e288812df8c96130c112365)]

<a name="0.11.3"></a>

## 0.11.3 (2023-03-03)

### Fixed

- 🐛 修复沙盒 context 关键字能访问的问题 [[dbd9ad4](https://github.com/scriptscat/scriptcat/commit/dbd9ad405cea50eefe4614fea5c46426c3a9abe0)]
- 🐛 修复沙盒 context 作用域问题 [[3d15519](https://github.com/scriptscat/scriptcat/commit/3d1551926b3b6954906467297ca4a9a5905cf945)]
- 🐛 修复沙盒变量 undefined 问题 [[2dcf9c2](https://github.com/scriptscat/scriptcat/commit/2dcf9c299faa90304dc87d736d94f4196fd522a9)]
- 🐛 修复定时脚本计时器停止错误 [#147](https://github.com/scriptscat/scriptcat/issues/147) [#149](https://github.com/scriptscat/scriptcat/issues/149) [[f9cb6dc](https://github.com/scriptscat/scriptcat/commit/f9cb6dc63da799943fb302540a1e42a53e328ede)]
- 🐛 修复用户动态配置 [[e67883e](https://github.com/scriptscat/scriptcat/commit/e67883edebe937bf56a064e7d568a0530621b484)]

<a name="0.11.2"></a>

## 0.11.2 (2023-02-07)

### Added

- ✨ 支持安装本地脚本 [[eb82fa9](https://github.com/scriptscat/scriptcat/commit/eb82fa9b154dbc49d40e00d7cfcabf9c7c7898be)]

### Fixed

- 🐛 修复 uuid 导致的同步问题 [#141](https://github.com/scriptscat/scriptcat/issues/141) [#133](https://github.com/scriptscat/scriptcat/issues/133) [[9b70673](https://github.com/scriptscat/scriptcat/commit/9b70673032650284d551429d232a11654654ad7f)]
- 🐛 优化系统弹出更新逻辑延长至 60s 并添加停止逻辑 [#137](https://github.com/scriptscat/scriptcat/issues/137) [[38921da](https://github.com/scriptscat/scriptcat/commit/38921da3555b78f65f42d16aeb6174ca0543e0af)]
- 🐛 修复 user.js?\*链接无法触发安装与优化点击脚本名即进入编辑 [#142](https://github.com/scriptscat/scriptcat/issues/142) [[4576795](https://github.com/scriptscat/scriptcat/commit/4576795a3320c75eea87fa83ec271de7329f5bad)]
- 🐛 GM_info 添加更多属性以兼容其他管理器 [#139](https://github.com/scriptscat/scriptcat/issues/139) [[184cfaf](https://github.com/scriptscat/scriptcat/commit/184cfaf97ec0e9276f22eee4edd5c359411c3992)]

<a name="0.11.1"></a>

## 0.11.1 (2023-01-15)

> 由于 firefox 商店限制，暂时移除掉 firefox 的 CSP 策略，此项移除将会导致 firefox 版本的扩展无法使用代码提示，后续再寻找解决方案。

### Fixed

- 🐛 修复值未发生改变时的报错 [[a97981c](https://github.com/scriptscat/scriptcat/commit/a97981cd0b96acfa7778df9debc33a2697cab400)]
- 🐛 修复 http\* match 问题 [#132](https://github.com/scriptscat/scriptcat/issues/132) [[b17581b](https://github.com/scriptscat/scriptcat/commit/b17581b264fe5a1160f41bf6d8a7200017d0583a)]
- 🐛 修复 vscode 连接问题 [[f0c3853](https://github.com/scriptscat/scriptcat/commit/f0c3853565eaac845aa98c7358a324a0df74c04c)]

<a name="0.11.0"></a>

## 0.11.0 (2022-12-20)

### Fixed

- 🐛 修复 OneDrive 创建多余目录的 bug [[3e326d7](https://github.com/scriptscat/scriptcat/commit/3e326d7aa0921c08817e844367cf361c99de51c5)]
- 🐛 修复 onedrive 查看备份文件 [[e79a5fb](https://github.com/scriptscat/scriptcat/commit/e79a5fb94857a717541da4f3307271321fb8d4f2)]

<a name="0.11.0-beta.3"></a>

## 0.11.0-beta.3 (2022-12-18)

> 支持 OneDriver、CAT_fileStorage 等多个重磅功能

### Added

- ✨ 支持 onedrive [#80](https://github.com/scriptscat/scriptcat/issues/80) [[7a71700](https://github.com/scriptscat/scriptcat/commit/7a717007e0ad486a43fab548a5c06b0286238264)]
- ✨ 支持 CAT_fileStorage [#127](https://github.com/scriptscat/scriptcat/issues/127) [[d566afb](https://github.com/scriptscat/scriptcat/commit/d566afb1417ea55c73aa19b5d205af5318c72ed5)]
- ✨ GM_xhr 支持 document 和 stream [[eedf0c1](https://github.com/scriptscat/scriptcat/commit/eedf0c11c831e1518f89748383a0058e623f8315)]
- ✨ tab 栏点击右键可以关闭当前，关闭其他，关闭左侧，关闭右侧脚本 [[1b8d84e](https://github.com/scriptscat/scriptcat/commit/1b8d84eb7af0c821622fb8fab91fb073c78f3bc2)]

### Fixed

- 🐛 修复文件系统斜杠问题 [[3a66818](https://github.com/scriptscat/scriptcat/commit/3a66818b9be48a6b1149fa5dd2d277724ed5aa89)]
- 🐛 修复沙盒模式无法从 window 读取 GM_info 的问题 [#126](https://github.com/scriptscat/scriptcat/issues/126) [[f23ccde](https://github.com/scriptscat/scriptcat/commit/f23ccdead4429a39d8478851e0405a7e3e6a4257)]
- 🐛 修复脚本储存管理过高与 object 类型编辑问题 [[e0a0d64](https://github.com/scriptscat/scriptcat/commit/e0a0d64f0616230e48b67a58ee0030a04156a7b4)]
- 🐛 修复列表名称排序错误 [[8e678da](https://github.com/scriptscat/scriptcat/commit/8e678dae738facad73b9875d92d6d0cead5dd4b2)]
- 🐛 修复导入重复的问题 [[0ec4cc6](https://github.com/scriptscat/scriptcat/commit/0ec4cc619caaa79a7cc3c82d3d906aef42756495)]
- 🐛 处理\*开头的特殊情况 [#123](https://github.com/scriptscat/scriptcat/issues/123) [[9569736](https://github.com/scriptscat/scriptcat/commit/9569736846f886b64118af1ab14fbf920bf58955)]
- 🐛 修复了点击编辑以后进入指定脚本可以左侧也选中对应的脚步名字,点击保存 tab 脚本名称和左侧脚本名称同步修改以后的内容 [[5335869](https://github.com/scriptscat/scriptcat/commit/53358694a02c0822335048e0f659f40ebd393a9e)]

<a name="0.11.0-beta.2"></a>

## 0.11.0-beta.2 (2022-12-04)

### Fixed

- 🐛 修复 install 页错误 [[fda9de8](https://github.com/scriptscat/scriptcat/commit/fda9de80e87259618757df907fa0ff5c94b0a188)]

<a name="0.11.0-beta.1"></a>

## 0.11.0-beta.1 (2022-12-04)

### Added

- ✨ GM_getResourceURL 支持获取 blob url [#84](https://github.com/scriptscat/scriptcat/issues/84) [[22925cb](https://github.com/scriptscat/scriptcat/commit/22925cb009c38d414210fd7d529b96bc32a69fb8)]
- ✨ 支持 GM_addElement [#102](https://github.com/scriptscat/scriptcat/issues/102) [[0d0f4db](https://github.com/scriptscat/scriptcat/commit/0d0f4dba48b35198239156ec344d509d65eede31)]
- ✨ 支持自定义 eslint [[0ff6ddd](https://github.com/scriptscat/scriptcat/commit/0ff6dddeb2f5152a718ab7587d4e61c62178ff5a)]
- ✨ 添加 CAT_userConfig 打开用户配置页 [[025db33](https://github.com/scriptscat/scriptcat/commit/025db3391bfca7d0477ba05d7680e8a0ca5af961)]

<a name="0.10.4"></a>

## 0.10.4 (2022-12-04)

### Added

- ✨ 兼容 tm 的储存导入导出 [[2eed348](https://github.com/scriptscat/scriptcat/commit/2eed3486aefe9fcd8bb7f9df08da040b9a280ea3)]

### Fixed

- 🐛 .prettierrc 添加 endOfLine 兼容 windows [[ee34161](https://github.com/scriptscat/scriptcat/commit/ee34161163ad7e18b16b39b492bb56b709bd9266)]
- 🐛 修复了点击左侧脚本 tab 没有选择对应的内容,以及点击左侧脚本没有选中的效果 [[9ad2b53](https://github.com/scriptscat/scriptcat/commit/9ad2b533bd624ffea2c7e786318b35d1f589bae5)]
- 🐛 兼容 GM_cookie.list 的调用方式和菜单展示问题 [#117](https://github.com/scriptscat/scriptcat/issues/117) [[a54d0c6](https://github.com/scriptscat/scriptcat/commit/a54d0c62ad327adaae6d183d5b5aa4468026c888)]
- 🐛 修复更新间隔设置从不失效 [#115](https://github.com/scriptscat/scriptcat/issues/115) [[50d8264](https://github.com/scriptscat/scriptcat/commit/50d8264bc3e91126e56d6688b8dec5b1e1f42908)]
- 🐛 修复 document-body 与优化资源识别 text [#116](https://github.com/scriptscat/scriptcat/issues/116) [[1b87ffc](https://github.com/scriptscat/scriptcat/commit/1b87ffc99e9eb67c9878e7909f2b349b42e59681)]

<a name="0.10.3"></a>

## 0.10.3 (2022-11-23)

> 此版本无严重 bug 将会发布到 edge

### Fixed

- 🐛 修复删除脚本依旧在运行的 bug [[e7a5f20](https://github.com/scriptscat/scriptcat/commit/e7a5f20199aac246a22aff9f8e7142a8134a11f3)]
- 🐛 修复备份文件操作错误 [#113](https://github.com/scriptscat/scriptcat/issues/113) [[af09645](https://github.com/scriptscat/scriptcat/commit/af09645d5bd5fea604c5729235b38577cb1e88d6)]

### Miscellaneous

- 📝 Update README.md [[3f768c7](https://github.com/scriptscat/scriptcat/commit/3f768c7021d43bca725809dd22cb14f38c80ebfa)]

<a name="0.10.2"></a>

## 0.10.2 (2022-11-21)

### Fixed

- 🐛 修复某些情况 export 表唯一性导致数据库升级失败 [[10a5c19](https://github.com/scriptscat/scriptcat/commit/10a5c1973b7f2dbcbe3f1720f6a1f33b23b93949)]

<a name="0.11.0-beta"></a>

## 0.11.0-beta (2022-11-19)

### Added

- ✨ 添加 CAT_userConfig 打开用户配置页 [[025db33](https://github.com/scriptscat/scriptcat/commit/025db3391bfca7d0477ba05d7680e8a0ca5af961)]

### Changed

- 🎨 统一更新日志地址 [[8e48400](https://github.com/scriptscat/scriptcat/commit/8e4840027719089f2a1a800f991714d4652fd231)]

<a name="0.10.1"></a>

## 0.10.1 (2022-11-19)

### Added

- ✨ 资源管理和火狐兼容性处理
  [[26ab1c5](https://github.com/scriptscat/scriptcat/commit/26ab1c578ba449a0c9810f8b52aaf3c4bf95ae4a)]

### Fixed

- 🐛 修复 userconfig 选择框问题与二次打开不显示的问题
  [[3504d8d](https://github.com/scriptscat/scriptcat/commit/3504d8d4348897d192645b1a54ed79d26306c41e)]
- 💚 修复 ci 构建报错问题
  [[eb0031f](https://github.com/scriptscat/scriptcat/commit/eb0031f8f62f5545a0dc5cb35290ee1aed7bc34e)]
- 🐛 修复 getResourceResource key 问题
  [[df22c6f](https://github.com/scriptscat/scriptcat/commit/df22c6f809da53d46814bbb948d3471555645cce)]
- 🐛 修复百度网盘鉴权缓存问题
  [[88e7d3b](https://github.com/scriptscat/scriptcat/commit/88e7d3b6a0886b6468cf083ce559f18aecab45bb)]
- 🐛 修复 firefox 下编辑器不兼容的问题
  [[c88c192](https://github.com/scriptscat/scriptcat/commit/c88c192a55504caf09a27675778eb14aaf21c3ed)]

## 0.10.0 (2022-11-17)

### Changed

- ⚡ 优化百度网盘鉴权
  [[222c2d7](https://github.com/scriptscat/scriptcat/commit/222c2d76b7eb309247ce46b0c0159608bfd7356f)]

### Fixed

- 🐛 修复打包版本问题
  [[f73c543](https://github.com/scriptscat/scriptcat/commit/f73c54352ba0ba09248f72842d80bc08ac335ae8)]

## 0.10.0-beta.2 (2022-11-16)

### Added

- ✨ 支持百度网盘备份、恢复和同步
  [[2cac37f](https://github.com/scriptscat/scriptcat/commit/2cac37f5223aed65dc68156d8b57ccb0a6f51f7e)]
- ✨ 支持百度网盘备份鉴权
  [[18178d5](https://github.com/scriptscat/scriptcat/commit/18178d579e019f6b374c51bcd18298244a33c1f2)]

### Changed

- ♻️ 重构 vscode 功能
  [[f5ec7a4](https://github.com/scriptscat/scriptcat/commit/f5ec7a4b44b902a6c519c0fffaeea56e7750dac0)]

### Removed

- 🔥 移除 document-body 和 document-menu
  [[06dfc18](https://github.com/scriptscat/scriptcat/commit/06dfc18a537c9a1c600bd1707107cd7b6b7a0230)]

### Fixed

- 🐛 修复后台脚本无法使用 responseType 的问题
  [#108](https://github.com/scriptscat/scriptcat/issues/108)
  [[43b407a](https://github.com/scriptscat/scriptcat/commit/43b407a7c056aa7e4cb0f075eee4927923a629a8)]
- 🐛 修复在 sandbox 页执行 BroadcastChannel 某些浏览器会报错
  [#107](https://github.com/scriptscat/scriptcat/issues/107)
  [[c4d4de4](https://github.com/scriptscat/scriptcat/commit/c4d4de4c0d3b441d07962ec3e44052f0080ecb3c)]
- 🐛 修复后台脚本内存溢出问题 [#71](https://github.com/scriptscat/scriptcat/issues/71)
  [[62c2f47](https://github.com/scriptscat/scriptcat/commit/62c2f479b674d8caca19408ee8f4dd33ff1f1d2e)]
- 🐛 修复列表宽度问题和储存清空 bug
  [[e00669a](https://github.com/scriptscat/scriptcat/commit/e00669ae49e6e2bdfc9fb03750e0ee706bf0a6ca)]

## 0.10.0-beta.1 (2022-11-09)

### Fixed

- 🐛 修复打包引起的错误
  [[ee034bc](https://github.com/scriptscat/scriptcat/commit/ee034bc7c491d48d7aec8d353cbbe496f7649add)]

## 0.10.0-beta (2022-11-08)

### Added

- ✨ 支持 eslint
  [[e55d23f](https://github.com/scriptscat/scriptcat/commit/e55d23f4a15ff3831de94ea7a1c0d72d0c0c071f)]

### Changed

- ♻️ 重构脚本订阅
  [[8b1a73c](https://github.com/scriptscat/scriptcat/commit/8b1a73cdc2428048267c83c79742d25397d71f37)]
- ♻️ 重构导出云脚本
  [[844d424](https://github.com/scriptscat/scriptcat/commit/844d424bcb755592f19a4d11ad749941792ce27d)]

### Fixed

- 🐛 修复 eslint 对后台脚本的支持与兼容火狐
  [[2343339](https://github.com/scriptscat/scriptcat/commit/23433391d1e54bdda3d0e61642e3768d3dfb91fe)]
- 🐛 修复 GM xhr header 为空时发送默认值与 UserConfig 默认值的问题
  [[e3a04db](https://github.com/scriptscat/scriptcat/commit/e3a04db58d0c15935ba642240a4869a20049ab2a)]
- 🐛 修复火狐兼容问题
  [[88a6d4a](https://github.com/scriptscat/scriptcat/commit/88a6d4a3ad24bef64ba37035b02a50ad8ece8c38)]
- 🐛 修复 GM_xhr unsafeHeader 发送错误、popup 支持运行
  [[02d1a45](https://github.com/scriptscat/scriptcat/commit/02d1a45a27f871b237ecce63c2cb22e7436ee726)]

## 0.10.0-alpha.1 (2022-10-31)

### Added

- ✨ webdav 云同步
  [[b419c91](https://github.com/scriptscat/scriptcat/commit/b419c91d1e7047390aa4c601a3a6ed3d54a165ba)]

### Changed

- ♻️ 储存管理
  [[1067285](https://github.com/scriptscat/scriptcat/commit/106728515d162e3b8d90d49d31f472cb4a10ca25)]
- ♻️ 重构 userconfig
  [[43a332d](https://github.com/scriptscat/scriptcat/commit/43a332db99b0b075762f1e06d3e2569b7a7f949c)]

### Fixed

- 🐛 修复 include、GM.\*和 ExternalMessage 问题
  [[fe96990](https://github.com/scriptscat/scriptcat/commit/fe969903d855ed385dc91214f6d46cff1963deeb)]
- 🐛 修复文档链接
  [[33041e4](https://github.com/scriptscat/scriptcat/commit/33041e45a947e99a8478e3ea53f4eb422df9a65e)]

### In Process

- 🚧 订阅脚本
- 🚧 VSCode 连接
- 🚧 导出云端脚本

### Miscellaneous

- 👷 CI 打包时加上 commit id
  [[313e44e](https://github.com/scriptscat/scriptcat/commit/313e44e3f7a55077d6b273e7483f1fc08d2c36da)]
- 👷 优化打包产物
  [[7ca5c13](https://github.com/scriptscat/scriptcat/commit/7ca5c139ffc97c6f48f6457c117ded2cb591b21e)]
- 👷 优化 ci 构建与同步目录
  [[217fa99](https://github.com/scriptscat/scriptcat/commit/217fa991b78b6e8232e8b03bfee5da6cf5894a8b)]

## 0.10.0-alpha(2022-10-27)

> 非常不稳定且功能不完善的一个版本 本版本为 alpha 测试，功能并未全部完成，欢迎体验，建议备份后升级或者共存的形式安装
>
> 全新的架构、全新的 UI，凤凰涅槃、王者归来、大器晚成

### Added

- ✨ webdav 备份
- ✨ 后台脚本支持 GM_menu
- ✨ GM_menu 支持浏览器右键菜单

### Changed

- ♻️ 全新架构、全新 UI
- ♻️ 重构日志系统
- ♻️ 重构代码编辑

### In Process

- 🚧 webdav 云同步
- 🚧 设置页面各个选项
- 🚧 订阅脚本
- 🚧 UserConfig
- 🚧 脚本储存管理
- 🚧 VSCode 连接
- 🚧 导出云端脚本

### Removed

- 🔥 移除原版本云同步，新增其它云平台同步
- 🔥 由于没有相关用户操作，移除用户登录
- 🔥 鉴于腾讯云函数收费，可能将移除导出腾讯云函数，后续版本再加入

## 0.9.4 (2022-10-11)

> 时隔半年的更新，本次更新只做了兼容性的修复。。。。（连续新写了几个 bug。。。。）
>
> 近期开始重构脚本猫了（架子已合并到 main 分支），在 v0.10.x 将做出大改变，这是向 v1.0.0 过渡的第一步，预计 11 月左右完成，绝对不
> 🐦，另外 v0.10.0 将会有以下不兼容的变动：
>
> - [v0.10.0 将取消云同步](https://github.com/scriptscat/scriptcat/issues/99)，但会新增网盘同步

### Fixed

- 🐛 修复某些 run-at 因为 GM_info 注入的问题导致脚本报错
  [[e91371d](https://github.com/scriptscat/scriptcat/commit/e91371dd441668458fd2689afd5efe2cf55b78cc)]

## 0.9.3 (2022-10-11)

### Removed

- 🔥 移除扩展 debugger 权限
  [[75bc958](https://github.com/scriptscat/scriptcat/commit/75bc958f6257a25408fcb47b6546096ffdeb0d1d)]

### Fixed

- 🚑 紧急修复 GM 沙盒问题
  [[fbe6e05](https://github.com/scriptscat/scriptcat/commit/fbe6e057f30b9455a0bbbd10743a9752d3f8ca49)]
- 🐛 修复 GM_info 的兼容问题
  [[7d030b0](https://github.com/scriptscat/scriptcat/commit/7d030b0f28c4ae1cd3e84df8144dc97ccb649ce2)]

## 0.9.1 (2022-04-30)

> 一些功能修复和代码优化

### Added

- ✨ 优化跨域资源确定逻辑 [#56](https://github.com/scriptscat/scriptcat/issues/56)
  [[9144e3b](https://github.com/scriptscat/scriptcat/commit/9144e3bc209c23c494a475234ea62e93c28885a1)]

### Changed

- ⚡ 优化日志组件
  [[8a8fef2](https://github.com/scriptscat/scriptcat/commit/8a8fef2c1fc0a7e11d43b6c261f4326cbbd77123)]

### Removed

- 🔥 废弃 proxy 功能 [#60](https://github.com/scriptscat/scriptcat/issues/60)
  [[1ee42ad](https://github.com/scriptscat/scriptcat/commit/1ee42ad9f0927af9a5942e2a205755d15c07b0e5)]

### Fixed

- 🐛 修复脚本/订阅检查更新间隔无法设置的问题
  [[998c9f9](https://github.com/scriptscat/scriptcat/commit/998c9f909efc6dc7fc0ee6effd23153ae6efd493)]
- 🐛 修复调试脚本时 getValue 获取旧值
  [[75215e3](https://github.com/scriptscat/scriptcat/commit/75215e3b43b846faee1b0a80d29d6c892a828047)]

## 0.9.0 (2022-02-14)

> 支持一键上云啦！！！两个参考的脚本:
> [bilibili 自动签到](https://scriptcat.org/script-show-page/48),[掘金签到和自动抽奖](https://scriptcat.org/script-show-page/303)

### Added

- 💥 支持腾讯云函数执行
  [[20ead08](https://github.com/scriptscat/scriptcat/commit/20ead086e78c6866be58939874c47a9159e12ca5)]
- 💥 导出可执行的 nodejs 包
  [[7b8466f](https://github.com/scriptscat/scriptcat/commit/7b8466f1b88fd7937b745b1d4594d723543614bb)]
- ✨ 脚本列表页浮动按钮隐藏按钮 [#37](https://github.com/scriptscat/scriptcat/issues/37)
  [[a16efb0](https://github.com/scriptscat/scriptcat/commit/a16efb0d3b6139e257b5d5f58219c39572d961f7)]
- ✨ 腾讯云触发器
  [[a706827](https://github.com/scriptscat/scriptcat/commit/a706827c693831e411b678f2b09297192213c41e)]

### Changed

- ⚡ 优化部署模板
  [[9f2595a](https://github.com/scriptscat/scriptcat/commit/9f2595af18f1c15af20a6a07309d66442eec00d1)]
- ⬆️ 升级依赖、处理 babel
  [[ab7bc9b](https://github.com/scriptscat/scriptcat/commit/ab7bc9bc8bf213aa17964facf7369642df6455e7)]

### Fixed

- 🐛 修复在同 tab 上切换 url 不会清空掉老脚本导致错误加载的问题
  [[37b88fb](https://github.com/scriptscat/scriptcat/commit/37b88fba5f546f893234b4934bf84809557f9f05)]
- 🐛 修复 match 兼容问题
  [[d919e8a](https://github.com/scriptscat/scriptcat/commit/d919e8a943552dd5bdff9de4ec2befd5c57f96f1)]
- 🐛 修复后台脚本无法处理 blob 的问题 [#34](https://github.com/scriptscat/scriptcat/issues/34)
  [[7b81677](https://github.com/scriptscat/scriptcat/commit/7b816773a811abb7933db244c35bda60031001b5)]

### Miscellaneous

- 📄 修改 License 为 GPLv3
  [[dfa0231](https://github.com/scriptscat/scriptcat/commit/dfa0231f2826b910f4e855509f99a97c6a2f7cdd)]

## 0.8.2 (2022-01-22)

> 2021 年的最后一个版本,提前祝大家新年快乐！🎇

### Added

- ✨ GM_xhr 支持 maxRedirects
  [[4d29cae](https://github.com/scriptscat/scriptcat/commit/4d29caeb78d9e3f7d94f31a2d3fd3e1d56279ab9)]

### Fixed

- 🐛 修复订阅@connect 错误的问题
  [[247db9c](https://github.com/scriptscat/scriptcat/commit/247db9ce06e584c4962094a70bcc094f5028adab)]
- 🐛 修复端口通配的问题 [#30](https://github.com/scriptscat/scriptcat/issues/30)
  [[f5183bd](https://github.com/scriptscat/scriptcat/commit/f5183bd4d6ce7866fececa9aeed8146730d980bd)]
- 🐛 修复 GM_xhr 返回值和 GM_delValue 删除错误
  [[45fb304](https://github.com/scriptscat/scriptcat/commit/45fb30410caedccf82ea0298d612c3a015adbaea)]
- 🐛 修复沙盒兼容
  [[82ceea9](https://github.com/scriptscat/scriptcat/commit/82ceea9407103f05c67a0ae60b46cde6ea25429d)]
- 🐛 修复某些时候超时才打开权限确认窗口的问题
  [[b861869](https://github.com/scriptscat/scriptcat/commit/b8618697bf50bed8840e0f0199162d399b8702c9)]
- 🐛 修复火狐 url 获取错误的问题
  [[854dd26](https://github.com/scriptscat/scriptcat/commit/854dd26272526f674341e7c119d93a8fce7a271c)]
- 💚 修复 ci 打包版本号错误
  [[b218cf4](https://github.com/scriptscat/scriptcat/commit/b218cf487828273d033f4bdb0a5bc6f146c31e87)]

## 0.8.1 (2022-01-14)

### Added

- ✨ 脚本静默更新
  [[aeeda0f](https://github.com/scriptscat/scriptcat/commit/aeeda0f710c9c22d1507d3edfb2b5e08a1bdc1e8)]
- ✨ 兼容暴力猴导出脚本包
  [[b477640](https://github.com/scriptscat/scriptcat/commit/b47764025d069b33733f4051cb910882df3c83f3)]
- ✨ 新建脚本页面 URL 识别
  [[429dd55](https://github.com/scriptscat/scriptcat/commit/429dd55657ef50f20231c9e414f1b24c2cad1d80)]
- ✨ GM_xmlhttpRequest 支持 blob 数据
  [#29](https://github.com/scriptscat/scriptcat/issues/29)
  [[71a039f](https://github.com/scriptscat/scriptcat/commit/71a039f53e2212d80c32932493bc3cca186d05cd)]

### Fixed

- 🐛 修复 Firefox unsafeHeader 拦截问题
  [#20](https://github.com/scriptscat/scriptcat/issues/20)
  [[757fe2c](https://github.com/scriptscat/scriptcat/commit/757fe2c12a30b45f3094119266ed3962ae51c3dc)]

## 0.8.0 (2022-01-10)

### Added

- ✨ GM_download 可以下载 blob 文件
  [[2096137](https://github.com/scriptscat/scriptcat/commit/2096137bc77a3a2094d26e470c596667af651f4d)]
- ✨ 实现 GM_download 函数
  [[a06113c](https://github.com/scriptscat/scriptcat/commit/a06113ce07a964342e62462b5380e463b7247b1a)]
- ✨ 支持 zip 格式导入导出
  [[48d197c](https://github.com/scriptscat/scriptcat/commit/48d197c826504018e093e745377c2eb8bba5bf40)]
- ✨ 实现 GM_get/saveTab
  [[3f5085f](https://github.com/scriptscat/scriptcat/commit/3f5085fbf67bd315588bc7261ce2c14d02a3a81a)]

### Changed

- 🎨 修改 eslint 错误
  [[5bdcbf9](https://github.com/scriptscat/scriptcat/commit/5bdcbf9afa9df31c4d0cc31ba4e359d8c87b04a2)]
- ♻️ 重构导入导出
  [[6cd369e](https://github.com/scriptscat/scriptcat/commit/6cd369e6d30a8b5938b3cd717356439ad2c8aa75)]
- 🎨 修改 GM_menu 注册同名菜单只使第一个生效
  [[bd16121](https://github.com/scriptscat/scriptcat/commit/bd1612105d4fd13af48c5152e379270dbfc60932)]
- 🎨 修改 eslint 代码
  [[d9b9af0](https://github.com/scriptscat/scriptcat/commit/d9b9af06f7a71629be8cdc6de98aa6d8b67f24e3)]
- ⚡ 删除 GM_getCookieStore 使用 GM_Cookie(&#x27;store&#x27;)操作
  [[1ae5096](https://github.com/scriptscat/scriptcat/commit/1ae5096c903d6c984597ff46d4f41d4a03fb1b3b)]

### Fixed

- 🐛 修复对 GM.\*函数的支持
  [[d9ee5c6](https://github.com/scriptscat/scriptcat/commit/d9ee5c6643cc3f2146c99703b58d786ca7e708da)]
- 🐛 修复 GM.xmlHttpRequest h 大写的问题
  [#26](https://github.com/scriptscat/scriptcat/issues/26)
  [[5ebf3aa](https://github.com/scriptscat/scriptcat/commit/5ebf3aa3057be8f8280dfee69784edff421651c7)]
- 🐛 修复编辑页菜单栏样式错误
  [[42b9a91](https://github.com/scriptscat/scriptcat/commit/42b9a91511f9dc1a225bea5568f6774123942ddf)]
- 🐛 修复后台脚本调试时 unsafeHeader 发送错误
  [[328ca18](https://github.com/scriptscat/scriptcat/commit/328ca1864a87dafa0b4e022cdd0dd7a52883a5ba)]
- 🐛 修复沙盒内 self、top、parent 逃逸
  [[eba7144](https://github.com/scriptscat/scriptcat/commit/eba71446e4b2206473284567a1cc6bac5ca5e045)]
- 🐛 修复 GM 函数 this 问题
  [[9eb92cc](https://github.com/scriptscat/scriptcat/commit/9eb92cca14df9d48a7b5800c49bc903a8b480de5)]

### Miscellaneous

- 👔 兼容油猴 match http\*
  [[9ebdeb9](https://github.com/scriptscat/scriptcat/commit/9ebdeb96d9988843de35f0ddad73b179bdfbf863)]

## 0.7.7 (2021-12-17)

### Fixed

- 🐛 修复 GM_setValue 设置 object 实例时的错误
  [[fa9dcbc](https://github.com/scriptscat/scriptcat/commit/fa9dcbcb39abb1de70eb0bee9fc72314958d44a8)]

### Miscellaneous

- 👔 只有中版本更新时才打开更新日志页面
  [[74981dc](https://github.com/scriptscat/scriptcat/commit/74981dcbb3cd1e1cc31c3d88ababcabfc33529c5)]

## 0.7.6 (2021-12-13)

> 新增 GM 储存管理,开始尝试使用 emoji 来写 changelog

### Added

- ✨ 储存增加重新加载与清空选项
  [[db0559e](https://github.com/scriptscat/scriptcat/commit/db0559e32462d391136d455c64fd425413723484)]
- ✨ GM 储存管理([#15](https://github.com/scriptscat/scriptcat/issues/15))
  [[6a13ff2](https://github.com/scriptscat/scriptcat/commit/6a13ff2c75222809cfd4696a8ed89de12b93cd87)]

### Fixed

- 🐛 修复 gm_xhr 的 response 为空的问题
  [[8ae251a](https://github.com/scriptscat/scriptcat/commit/8ae251a81cf4e3167b70bdb71e2711de07e1f314)]
- 🐛 修复同步时脚本错乱
  [[606ac06](https://github.com/scriptscat/scriptcat/commit/606ac0652f1172ba0dd27c64b15437a51b0fca03)]
- 🐛 修复框架组件 icon 不显示
  [[72376db](https://github.com/scriptscat/scriptcat/commit/72376db39b02466951e7c4305a30e0ab1db21fb0)]

## v0.7.5 (2021-12-08)

### Bugs fixed:

- `GM_registerMenuCommand`某些情况注册不上([`70399b3`](https://github.com/scriptscat/scriptcat/commit/70399b3b137051e378a36d4ca33b07ea4cf68b1a))
  (@CodFrm)
- gm_xhr 默认不带上
  origin([`70399b3`](https://github.com/scriptscat/scriptcat/commit/70399b3b137051e378a36d4ca33b07ea4cf68b1a))
  (@CodFrm)
- 沙盒中 globalThis 指向沙盒
  global([`c15913c`](https://github.com/scriptscat/scriptcat/commit/c15913c3fe6531d48c2b1a1f42702ee3dc11a966))
  (@CodFrm)
- 右侧悬浮按钮固定可能遮挡的问题([`84ed9a1`](https://github.com/scriptscat/scriptcat/commit/84ed9a105ab92cb5a057c3d15d9240bbc1ffbec7))
  (@CodFrm)
- unsafe header
  覆盖失败([`8a28a9c`](https://github.com/scriptscat/scriptcat/commit/8a28a9cadf49852a25d8c58b216489c70b3ddc18))
  (@CodFrm)
- GM_addStyle 与 tm
  管理器插入地方一致([`0375282`](https://github.com/scriptscat/scriptcat/commit/03752823d0a6f12d8dfefdf35bc19625719d066b))
  (@CodFrm)

### Perf

- 图标加载速度优化([`5a74b19`](https://github.com/scriptscat/scriptcat/commit/5a74b193ac769e0af9481dff44577553449a3937))
  (@CodFrm)

## v0.7.4 (2021-11-24)

### Bugs fixed:

- eval 问题 & GM_deleteValue
  调用错误([`d668452`](https://github.com/scriptscat/scriptcat/commit/d668452b318174c985263f0a3ccca7d5afaa2239))
  (@CodFrm)
- FormData 火狐无法 clone
  导致错误([`e5190e3`](https://github.com/scriptscat/scriptcat/commit/e5190e3680e36e638f08085306ae05d9e5e44e2a))
  (@CodFrm)

## v0.7.3 (2021-11-22)

### New feature:

- vscode
  自动连接([`dac2cc6`](https://github.com/scriptscat/scriptcat/commit/dac2cc6fed1de44a7e546989107892507b388837))
  (@CodFrm)
- 用户配置支持动态多选([`6bf5b29`](https://github.com/scriptscat/scriptcat/commit/6bf5b29f75ae2b2adeb35216c7bdd3393cdb7ec0))
  (@CodFrm)
- gm.xhr 支持发送 FormData
  数据([`693c410`](https://github.com/scriptscat/scriptcat/commit/693c410a7e7e0f96a947fef7c58ddd41f93cd8d4))
  (@CodFrm)
- 添加\*.user.bg.js
  后台脚本后缀监听([`05021c1`](https://github.com/scriptscat/scriptcat/commit/05021c124899514db4a82bf262e89992b52f1f4f))
  (@CodFrm)

### Bugs fixed:

- 兼容油猴的 responseType json
  处理([`0d75d86`](https://github.com/scriptscat/scriptcat/commit/0d75d86f55b3c6439c89ca28cd5712dbc125ba0c))
  (@CodFrm)
- responseType 问题和 gm_xhr url
  的相对位置处理([`288d751`](https://github.com/scriptscat/scriptcat/commit/288d75133c1b575c89365422cf6f8e23ee0cba9f))
  (@CodFrm)
- eval
  执行脚本内方法([`4d0e056`](https://github.com/scriptscat/scriptcat/commit/4d0e0569eeb13cad852b52149bb0ca7ec32b89bb))
  (@CodFrm)
- gm_xhr
  获取重定向后地址([`4906c79`](https://github.com/scriptscat/scriptcat/commit/4906c7950e5a4902f3d7262e431fac0034a5267b))
  (@CodFrm)
- 沙盒兼容问题&某些情况下 sourceUrl
  不显示的问题([`85cb130`](https://github.com/scriptscat/scriptcat/commit/85cb130b016c41b71c58b81e9f422acdd694278a))
  (@CodFrm)
- 拉取数量显示错误([`106de02`](https://github.com/scriptscat/scriptcat/commit/106de02583ae08299ddd4d02fbfdd2140c9a7847))
  (@CodFrm)
- 某些情况下菜单注册后不显示([`aff0bb4`](https://github.com/scriptscat/scriptcat/commit/aff0bb4bf595b8fb63bf8827f53e3f5e84e11b95))
  (@CodFrm)
- 沙盒内可访问 window
  上对象([`49a276c`](https://github.com/scriptscat/scriptcat/commit/49a276c00bb56e30186c70ee300b4ea58673aa50))
  (@CodFrm)

## v0.7.2 (2021-11-07)

> 在此之前的脚本猫对 GM_XHR 的返回 contentType 做了判断,如果是 json 类型会自动转换成 json
> 给脚本,现在兼容油猴的做法,不对此进行自动的转化,需要手动转化,或者加上 responseType.可能会导致某些脚本出现兼容性问题.

### New feature:

- GM_XHR 支持返回 set-cookie 和处理 xhr.response
  兼容问题([`53bac0b`](https://github.com/scriptscat/scriptcat/commit/53bac0b82ff1e5da4cf4d9bed67f6cac74b46675))
  (@CodFrm)
- 脚本 header
  悬停提示([`a0eabad`](https://github.com/scriptscat/scriptcat/commit/a0eabade47b775719c779b6ca63e4a86451338f7))
  (@CodFrm)

### Bugs fixed:

- 安装脚本时代码对比反向问题([`bd769a0`](https://github.com/scriptscat/scriptcat/commit/bd769a01aa3e037d1b279ae958934565b2a7ac9b))
  (@CodFrm)

## v0.7.1 (2021-10-26)

> 修复一个比较严重的 bug,编辑本地脚本 uuid 每次发生改变导致同步多次的问题.
>
> 支持 vscode 扩展开发和脚本市场支持,具体可以看此视频:
> [脚本猫配合 vscode 开发（demo，想看看大家有啥意见）](https://www.bilibili.com/video/BV16q4y157CP)

### Bugs fixed:

- 编辑本地脚本 uuid
  每次发生改变导致同步多次的问题([`7175c6f`](https://github.com/scriptscat/scriptcat/commit/7175c6f36122d88fceb7b44be94e603eb7dd6129))
  (@CodFrm)

## v0.7.0 (2021-10-26)

> 支持 vscode 扩展开发和脚本市场支持,具体可以看此视频:
> [脚本猫配合 vscode 开发（demo，想看看大家有啥意见）](https://www.bilibili.com/video/BV16q4y157CP)

### New feature:

- vscode
  代码同步([`5750fb6`](https://github.com/scriptscat/scriptcat/commit/5750fb6daa3317a3d793df5d8e68da4f44a520b1))
  (@CodFrm)
- 外部 api
  用于脚本市场获取脚本状态([`8ce9ae9`](https://github.com/scriptscat/scriptcat/commit/8ce9ae990a735e17d4d1711cd17adcc299c39225))
  (@CodFrm)
- 脚本列表拖动排序([`d3aa7ab`](https://github.com/scriptscat/scriptcat/commit/d3aa7abc64fc09818b16221e36fe2fe3781da6c8))
  (@CodFrm)
- 通过链接安装([`00e4622`](https://github.com/scriptscat/scriptcat/commit/00e46227d42768b3e1d91abb8cc1f44948aca05b))
  (@CodFrm)

### Bugs fixed:

- 面板脚本日志顺序错乱和非运行状态日志显示等待([`2c1fd8a`](https://github.com/scriptscat/scriptcat/commit/2c1fd8a1b975cd3c6c1729b16893597bf46b6ead))
  (@CodFrm)
- 控制面板无法复制([`bcb3960`](https://github.com/scriptscat/scriptcat/commit/bcb39607001e83ac5f70021230f14840537cb87f))
  (@CodFrm)

## v0.6.4

> 导入导出功能(兼容 tampermonkey)和修复 bug

- 优化新建脚本的 origin
- 开启`GM_cookie`给前端脚本,并兼容 tm 的使用方法
- 导入导出 json 备份文件(兼容 tampermonkey)
- 修复沙盒中无法使用 eval 的问题
- 修复 match 错误会影响其它脚本的问题

## v0.6.3

> 修复 bug

- 优化权限批量确认问题
- 修复云同步有 delete 的情况下错误的问题
- 修复同步的订阅与脚本无关联的 bug
- 修复订阅更新不同步的 bug
- 修复`match`结尾`*`问题

## v0.6.2

> 支持某些油猴特性和修复 bug

- 支持`document-body`
- 添加`GM_getResourceText`和`GM_getResourceURL`
- 添加`include/match`的 tld 顶域匹配支持
- 修复沙盒 set 属性问题
- 修复`GM_registerMenuCommand`重复注册显示的问题
- 修复更新页面脚本开启状态不一致的问题
- 沙盒处理只读的属性
- 处理`require`顺序
- 处理`match`,以`*.`开头的情况下也会匹配`xxx.com`

## v0.6.1

> 一些 bug 修复

- 用户信息管理页
- 油猴 window.onxxxx 兼容
- 优化安装页面显示
- 优化登录登出
- 修复弹出页新建脚本 bug
- 修复老版本安装的脚本新版本无法正常执行的问题

## v0.6.0

> 两个大功能,订阅功能与云同步.(导入导出到本地在下两个小版本中发布,导入导出到云盘等其它存储计划中)
>
> 云同步暂时只支持脚本与脚本订阅同步,用户配置同步后续会支持.不会支持 value 同步,开发者需要注意.
>
> 新设备同步安装的脚本会根据: 前台脚本默认开启,后台脚本默认关闭的方式进行安装,脚本开启状态不会同步,需要用户重新开启或者关闭.
>
> 关于这方面有什么意见可以提[issue](https://github.com/scriptscat/scriptcat/issues)反馈

- 增加[脚本订阅](/dev/subscribe.md)功能
- 增加脚本云同步功能
- 优化脚本更新确认界面使用静默方式打开
- 优化脚本新建
- 修改脚本列表页`特性`栏为`来源`
- 修复油猴兼容性 bug
- 修复无`namespace`的脚本会导致安装错误的问题
- 修复`resource`资源加载和释放问题
- 修复两位版本号对比失败的问题

## v0.5.3

> 修复 bug

- 修复面板基本设置编辑不生效的问题
- 修复更新脚本选择脚本状态无效的问题
- 修复脚本更新运行状态显示错误

## v0.5.2

> cookie 操作增强

- 支持对隐身窗口的 cookie 操作
- 增强`GM_cookie`函数,支持`delete/set/store`操作
- `GM_addValueChangeListener`支持返回 tabid(后台脚本中)
- 增加`GM_getCookieStore`通过 tabid,获取 cookie store
- 增加`storageName`来规定 value 共享,移除原来的`namespace`共享
- 修复浏览器打开时脚本加载问题

## v0.5.1

> 优化界面 UI,优化调试模式

- 更新界面 UI,优化页面逻辑
- 优化后台脚本[调试模式](/dev/background.md#脚本调试)
- 修复 cron 表达式错误的时候,脚本列表不显示
- 移除`@console`

## v0.5.0

> **重大更新**,开始支持[CloudCat](/dev/cloudcat.md)

- 支持[CloudCat](/dev/cloudcat.md)
- 编辑操作增加导出/导入功能
- 添加通知信息
- 优化列表状态栏
- 沙盒优化
- 修复油猴 API 兼容问题
- 修复`match`问题

## v0.4.4

> v0.4.3 兼容 Firefox 处理以过审核.

- 处理 Firefox sandbox 逻辑
- 优化安装/权限确认页面 UI
- 优化编辑器快捷键和工具条
- 修复某些情况下安装或更新时不显示脚本名的 bug
- 修复`GM_xmlhttpRequest`的`arraybuffer,blob`支持
- 修复若干兼容油猴的 bug

## v0.4.2

> 优化代码,UI 调整

- 界面 UI 调整
- 增加`GM_xmlhttpRequest`所支持的`unsafe header`和支持`arraybuffer`,`nocache`,`user`,`password`,`overrideMimeType`,功能
- 增加运行日志查看功能,点击面板`运行状态`栏即可查看最后一次运行日志.具体请看:[console](/dev/background.md#日志)功能
- 修复`GM_notification`的`done`回调
- 优化调整代码列表排序逻辑
- 优化最后更新栏点击可进行脚本的手动检查更新

## v0.4.1

> 重大 bug 修复

- 修复 split 导致的前台脚本无法执行的问题
- 增加`GM_xmlhttpRequest`所支持的`unsafe header`

## v0.4.0

> 做了一些界面上的优化,增加了[用户配置](/dev/config.md)功能

- 增加控制台的 UserConfig 功能,详情请看[用户配置文档](/dev/config.md)
- 优化控制台编辑时`definition`后缀为`.d.ts`的地址,自动识别增加自动补全
- 优化控制台的运行日志 ui
- 优化控制台脚本列表,`运行状态`列鼠标放置可显示下一次运行时间等描述
- 优化弹出页面 ui,增加脚本运行数角标
- 优化弹出页面运行脚本页显示当前页面上所执行的脚本
- 优化弹出页面增加后台脚本项,可直接在弹出页上执行脚本
- 优化安装页面增加脚本的开启开关
- 支持`GM_registerMenuCommand`和`GM_unregisterMenuCommand`
- 支持`GM_xmlhttpRequest`填写一些 unsafe 的 header

## v0.3.4

- 新建脚本默认开启(从远程安装的后端脚本依旧默认为不开启)
- 管理面板简单的分页功能
- 增加开机启动自动运行
- 支持`@require-css`直接引入 css 文件
- 支持`document-menu`执行方式
- 支持`@include`和`@exclude`
- 移除`@debug`,新增菜单条
- 修复若干 bug

## v0.3.0

> 开始支持油猴脚本了

- 支持油猴脚本!暂时支持 match 进行匹配
- 支持`@require`引用其他脚本
- 将 GM_set/getValue 函数使其实时全局同步
- 添加了`CAT_click`API,可进行真实点击
- 支持了`GM_setClipboard`

## v0.2.0

> 第一个可用的版本

- 后台脚本,可以使你的脚本持续的运行在后台.
- 定时脚本,可以每日定时执行,每天通过脚本定时处理事务.可用于自动签到,定时提醒等功能.
- 基本的 API,初步规划好了 API 规则
- 脚本管理面板
