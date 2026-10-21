---
title: API 文档
---

## 说明

本扩展 API 定义参考 [Tampermonkey 文档](https://www.tampermonkey.net/documentation.php)，由于时间和精力问题，只实现了部分 API，后续将继续迭代。本扩展进行扩充或者与原 GM 不同的 API 将在文档中特殊标注（使用 * 号）。对于某些 API 还提供了同步函数，同步函数规则：`GM.*`，具体请看文档内容。

API 的详细定义，请看 `scriptcat.d.ts` 或者内置编辑器提示，文档更新可能不会及时。对于本扩展特有的 API，请看 [CatApi 文档](cat-api.md)。

另外可以在 [example](https://github.com/scriptscat/scriptcat/tree/main/example) 查看相关示例。

## 定义

### GM_info

获取脚本相关信息，包括元数据和运行环境参数。常用字段有 `scriptHandler`、`version`、`scriptMetaStr`、`scriptUpdateURL`、`downloadMode` 等。详细定义请参考 `scriptcat.d.ts`（并不完全）。

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` 目前只有 `raw` 值。 `runAt` 未支持。 `userAgentData` 支持但不一定和TM一致。
* `userLanguage`（v1.5+）为脚本猫当前的界面语言，如 `"zh-CN"`、`"en-US"`、`"ja-JP"`，脚本可据此决定自身的显示语言。该值在脚本启动时确定；`@early-start` 脚本同步读取时可能为空字符串，请在 `CAT_scriptLoaded()` 之后读取。

### GM_log \*

日志函数，后台脚本的日志将在控制面板的运行日志中看到（点击运行状态栏）。相比于 TM 增加了一个日志的 level。

```typescript
declare function GM_log(message: string, level?: GMTypes.LoggerLevel): void;

declare namespace GMTypes {
  type LoggerLevel = "debug" | "info" | "warn" | "error";
}
```

```js
GM_log("调试信息", "debug");
```

### GM_get/set/deleteValue

从储存中获取或者设置值，数据在同一 [**storageName**](meta.md#storagename-) 中可以共享，且可以实时的同步。

```typescript
// 添加数据，请注意数据只能为 bool;string;number;object 四种类型，不能存储对象实例
declare function GM_setValue(name: string, value: any): void;
// 获取数据
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// 删除数据，再获取会返回 undefined 或 defaultValue
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### 注意：当使用 `GM_setValue` 传入 `undefined` 时，ScriptCat 会将该键删除，而不会像油猴（Tampermonkey/GreaseMonkey）那样将 `undefined` 存储为值。

#### 注意：由于数据操作是异步，执行 GM_setValue 或 GM_deleteValue 后立即 `window.close()` 的话会无法正确修改数据。建议使用 `await GM.setValue` 或 `await GM.deleteValue` 以确保数据操作完成。

### GM_listValues

列出所有 key。

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

批量存取 API（扩展）。

```typescript
// 设置多个值, values是一个对象, 键为值的名称, 值为值的内容
declare function GM_setValues(values: { [key: string]: any }): void;
// 获取多个值, 如果keysOrDefaults是一个对象, 则使用对象的值作为默认值
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// 删除多个值, names是一个字符串数组
declare function GM_deleteValues(names: string[]): void;
```

```js
// 批量设置
GM_setValues({ a: 1, b: 2 });
// 批量获取（不存在时返回默认）
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// 批量删除
GM_deleteValues(["a", "b"]);
```

#### 注意：由于数据操作是异步，执行 GM_setValues 或 GM_deleteValues 后立即 `window.close()` 的话会无法正确修改数据。建议使用 `await GM.setValues` 或 `await GM.deleteValues` 以确保数据操作完成。

### GM_add/removeValueChangeListener

> tabid 于 0.17.0-alpha 后删除，详情见 [GM_cookie](#gm_cookie-)

对值的监听操作，add 会返回一个监听 id，使用 remove 可以取消监听。可以使用这个方法实现一个简单的通信，使用 [**storageName**](meta.md#storagename-) 可以实现跨脚本通信。

```typescript
// tabid 是只有后台脚本监听才有的参数
type ValueChangeListener = (
  name: string,
  oldValue: any,
  newValue: any,
  remote: boolean,
  tabid?: number
) => any;

declare function GM_addValueChangeListener(
  name: string,
  listener: GMTypes.ValueChangeListener
): number;

declare function GM_removeValueChangeListener(listenerId: number): void;
```

```js
const id = GM_addValueChangeListener("foo", (k, oldV, newV, remote) => {
  console.log(k, oldV, newV, remote);
});
GM_removeValueChangeListener(id);
```

### GM_getResourceText/GM_getResourceURL

获取 `@resource` 声明的资源信息。

```typescript
// GM_getResourceText 获取资源文本数据，image 等 byte 类型的数据会返回空文本，需要使用 GM_getResourceURL 获取
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL 获取经过 base64 后的数据，也可以通过第二个参数获取 blob url
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

在页面中插入元素。可以绕过 CSP 限制。

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// 插入脚本
GM_addElement("script", { src: "https://example.com/app.js" });
// 插入样式
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

添加样式到页面中，返回样式 DOM。可以绕过 CSP 限制。

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

```js
GM_addStyle(`
  body { background: #f0f0f0; }
  .btn { color: red; }
`);
```

### GM_openInTab \*

打开一个新窗口。

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * 决定新标签页是否在打开时获得焦点。
     *
     * - `true` → 新标签页会立即切换到前台。
     * - `false` → 新标签页在后台打开，不会打断当前页面的焦点。
     *
     * 默认值：true
     */
    active?: boolean;

    /**
     * 决定新标签页插入位置。
     *
     * - 如果是 `boolean`：
     *   - `true` → 插入在当前标签页之后。
     *   - `false` → 插入到窗口末尾。
     * - 如果是 `number`：
     *   - `0` → 插入到当前标签前一格。
     *   - `1` → 插入到当前标签后一格。
     *
     * 默认值：true
     */
    insert?: boolean | number;

    /**
     * 决定是否设置父标签页（即 `openerTabId`）。
     *
     * - `true` → 浏览器能追踪由哪个标签打开的子标签，
     *   有助于某些扩展（如标签树管理器）识别父子关系。
     *
     * 默认值：true
     */
    setParent?: boolean;

    /**
     * 是否在隐私窗口（无痕模式）中打开标签页。
     *
     * 注意：ScriptCat 的 manifest.json 配置了 `"incognito": "split"`，
     * 在 normal window 中执行时，tabId/windowId 将不可用，
     * 只能执行「打开新标签页」动作。
     *
     * 默认值：false
     */
    incognito?: boolean;

    /**
     * 历史兼容字段，仅 TM 支持。
     * 语义与 `active` **相反**：
     *
     * - `true` → 等价于 `active = false`（后台加载）。
     * - `false` → 等价于 `active = true`（前台加载）。
     *
     * ⚠️ 不推荐使用：与 `active` 功能重复且容易混淆。
     *
     * 默认值：false
     * @deprecated 请使用 `active` 替代
     */
    loadInBackground?: boolean;

    /**
     * 是否将新标签页固定（pin）在浏览器标签栏左侧。
     *
     * - `true` → 新标签页为固定状态。
     * - `false` → 普通标签页。
     *
     * 默认值：false
     */
    pinned?: boolean;

    /**
     * 使用 `window.open` 打开新标签，而不是 `chrome.tabs.create`
     * 在打开一些特殊协议的链接时很有用，例如 `vscode://`, `m3u8dl://`
     * 其他参数在这个打开方式下无效
     *
     * 相关：Issue #178 #1043
     * 默认值：false
     */
    useOpen?: boolean;
  }

  interface Tab {
    close(): void;
    onclose?: () => void;
    closed?: boolean;
    name?: string;
  }
}
```

```js
const tab = GM_openInTab("https://example.com", { active: false });
tab.onclose = () => console.log("已关闭");
tab.close();
```

### GM_get/saveTab/GM_getTabs

类似 `GM_setValue` 的一个储存数据的方法，但是本方法的生命周期为一个浏览器页面窗口的打开->关闭，后台脚本中无法使用。

```typescript
// 获取tab数据
declare function GM_getTab(callback: (obj: object) => void): void;
// 保存tab数据
declare function GM_saveTab(obj: object): void;
// 获取所有tab数据
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("已保存"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* 注册一个菜单选项到弹出页面及右键菜单中，点击时会调用 `listener` 方法。
* 默认情况下，跟TM一样，相同显示的菜单项目只会显示一个。
* 指定 id 能更新菜单项目。
* `name` 为空字串及没有 `listener` 的时候，会在右键菜单新增一条分隔线。

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // SC特有配置，默认为 true，false 时点击后不关闭弹出菜单页面
        nested?: boolean; // SC特有配置，默认为 true，false 的话浏览器右键菜单项目由三级菜单升至二级菜单
        individual?: boolean; // SC特有配置，默认为 false，true 表示相同的菜单项不合并显示
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("测试命令01", () => alert("调用01"));
GM_registerMenuCommand("测试命令02", () => alert("调用02"), {id: "自订ID"});
```

### GM_unregisterMenuCommand

通过 id 删除一个已经注册了的菜单项。

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("自订ID");
```

### GM_notification \*

发送消息通知，提供了 `progress` 和 `buttons` 的能力（Firefox 不支持），可以显示进度条类型和按钮类型的通知，多提供了 `GM_closeNotification`、`GM_updateNotification`（Firefox 不支持）两个方法。

[example](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

```typescript
declare function GM_notification(
  details: GMTypes.NotificationDetails,
  ondone?: GMTypes.NotificationOnDone
): void;
declare function GM_notification(
  text: string,
  title: string,
  image: string,
  onclick: GMTypes.NotificationOnClick
): void;
declare function GM_closeNotification(id: string): void;
declare function GM_updateNotification(id: string, details: GMTypes.NotificationDetails): void;

declare namespace GMTypes {
  interface NotificationDetails {
    text?: string;
    title?: string;
    tag?: string;
    image?: string;
    highlight?: boolean;
    silent?: boolean;
    timeout?: number;
    url?: string;
    onclick?: NotificationOnClick;
    ondone?: NotificationOnDone;
    progress?: number;
    oncreate?: NotificationOnClick;
    // 只能存在2个
    buttons?: NotificationButton[];
  }

  interface NotificationThis extends NotificationDetails {
    id: string;
  }

  type NotificationOnClickEvent = {
    event: "click" | "buttonClick";
    id: string;
    isButtonClick: boolean;
    buttonClickIndex: number | undefined;
    byUser: boolean | undefined;
    preventDefault: () => void;
    highlight: NotificationDetails["highlight"];
    image: NotificationDetails["image"];
    silent: NotificationDetails["silent"];
    tag: NotificationDetails["tag"];
    text: NotificationDetails["tag"];
    timeout: NotificationDetails["timeout"];
    title: NotificationDetails["title"];
    url: NotificationDetails["url"];
  };
  type NotificationOnClick = (this: NotificationThis, event: NotificationOnClickEvent) => unknown;
  type NotificationOnDone = (this: NotificationThis, user?: boolean) => unknown;

  interface NotificationButton {
    title: string;
    iconUrl?: string;
  }

}

```

```js
GM_notification({ title: "进度", text: "加载中", progress: 50 });
```

#### 注意：`GM_closeNotification` 及 `GM_updateNotification` 为SC特有。需要更新的话应该使用 `tag`。


```js
GM_notification({ title: "进度", text: "加载中", progress: 50, tag: "通知01"});
GM_notification({ title: "进度", text: "加载完成", progress: 100, tag: "通知01"}); // 更新进度
GM_notification({ title: "进度", text: "加载完成", progress: 100, tag: "通知01", timeout: 1}); // 1ms后关闭
```

### GM_setClipboard \*

设置剪辑板，相比TM暂不支持回调。

```typescript
declare function GM_setClipboard(
  data: string,
  info?: string | { type?: string; mimetype?: string }
): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* 跨域 HTTP 请求，可以绕过 CSP，支持 `@connect` 声明域。部分功能缺失，cookie 功能 Firefox 暂不支持。需要用户授权才可正常访问，使用 `@connect` 描述的 host 可跳过用户授权。

* 对于 anonymous 和 cookie 相比 TM 做了特殊处理，anonymous 为 true 且 cookie 存在时，发送的 cookie 为设置的 cookie 不会带上其他 cookie。

* 特殊 header 也是支持的：

  - user-agent
  - origin
  - referer
  - cookie
  - host
  - ...

```typescript
declare function GM_xmlhttpRequest(details: GMTypes.XHRDetails): GMTypes.AbortHandle<void>;

declare namespace GMTypes {
  interface XHRResponse {
    finalUrl?: string;
    readyState?: 0 | 1 | 2 | 3 | 4;
    responseHeaders?: string;
    status?: number;
    statusText?: string;
    response?: any;
    responseText?: string;
    responseXML?: Document | null;
  }

  interface XHRProgress extends XHRResponse {
    done: number;
    lengthComputable: boolean;
    loaded: number;
    position: number;
    total: number;
    totalSize: number;
  }

  type Listener<OBJ> = (event: OBJ) => any;

  interface XHRDetails {
    method?: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
    url: string;
    headers?: { [key: string]: string };
    data?: string | FormData;
    cookie?: string;
    binary?: boolean;
    timeout?: number;
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream 在当前版本是一个较为简陋的实现
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // 为了与tm保持一致, 在v0.17.0后废弃maxRedirects, 使用redirect替代, 会强制使用fetch模式
    
    onload?: Listener<XHRResponse>;
    onloadstart?: Listener<XHRResponse>;
    onloadend?: Listener<XHRResponse>;
    onprogress?: Listener<XHRProgress>;
    onreadystatechange?: Listener<XHRResponse>;
    ontimeout?: () => void;
    onabort?: () => void;
    onerror?: (err: string) => void;
  }
}
```

```js
GM_xmlhttpRequest({
  method: "GET",
  url: "https://api.example.com/data",
  onload: res => console.log(res.responseText)
});
```

### GM_download

* 下载文件，可设置 header 等内容，相比 TM 多了 cookie 和 anonymous 的功能。如果为 blob url，将会直接打开下载，只有 onload 事件，这是与 TM 不同的一个特性（为后台脚本无法创建下载而服务，可能会在一些生成报表的场景使用到）。
* 返回 Promise 对象，并提供 `abort()` 方法。
* 与 TM 不同：`native` 下载模式（默认）会遵循 `@connect`。当下载地址的域名不在脚本 `@connect` 声明内时，会弹窗询问用户，允许后才下载；已在 `@connect` 内的域名静默下载，黑名单域名始终拒绝。`browser` 下载模式不受此限制。（TM 的 `@connect` 仅作用于 `GM_xmlhttpRequest`，不影响 `GM_download`。）

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;

declare namespace GMTypes {
  interface DownloadError {
    error:
      | "not_enabled"
      | "not_whitelisted"
      | "not_permitted"
      | "not_supported"
      | "not_succeeded"
      | "unknown";
    details?: string;
  }

  interface DownloadDetails {
    method?: "GET" | "POST";
    downloadMode?: "native" | "browser";
    url: string;
    name: string;
    headers?: { [key: string]: string };
    saveAs?: boolean;
    timeout?: number;
    cookie?: string;
    anonymous?: boolean;

    onerror?: Listener<DownloadError>;
    ontimeout?: () => void;
    onload?: Listener<object>;
    onprogress?: Listener<XHRProgress>;
  }
}
```

```js
// 回调形式
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("完成") });
dl.abort();
```

### GM_cookie \*

异步操作页面 Cookie，支持跨域、HttpOnly 和分区。

> v0.17.0-alpha 后删除 store 与 tabid 相关的参数，现在会根据当前所在的窗口来决定获取隐身窗口还是普通窗口的 cookie。  

必须使用 `@connect` 声明操作的 host，且经过用户授权才可使用。虽然兼容 TM 的 `GM_cookie.list` 操作，但是为了统一，不建议这样。

* `sameSite` 未支持

```typescript
// name和domain不能都为空
declare function GM_cookie(
  action: GMTypes.CookieAction,
  details: GMTypes.CookieDetails,
  ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void
): void;

declare namespace GMTypes {
  type CookieAction = "list" | "delete" | "set";
  interface CookieDetails {
    url?: string;
    name?: string;
    value?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    session?: boolean;
    httpOnly?: boolean;
    expirationDate?: number;
    partitionKey?: CookieDetailsPartitionKeyType;
  }
  interface Cookie {
    domain: string;
    name: string;
    value: string;
    session: boolean;
    hostOnly: boolean;
    expirationDate?: number;
    path: string;
    httpOnly: boolean;
    secure: boolean;
  }
}

// 回调形式
GM_cookie("list", { url: "https://example.com" }, (cookies) => {
  console.log(cookies);
  GM_cookie("set", {
    name: "foo",
    value: "bar",
    domain: "example.com"
  }, (result) => {
    console.log(result);
    GM_cookie("delete", { name: "foo", domain: "example.com" }, (result) => {
      console.log(result);
    });
  });
});

// Promise 形式
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**注意**：需在元信息中使用 `@connect example.com` 声明允许域。
