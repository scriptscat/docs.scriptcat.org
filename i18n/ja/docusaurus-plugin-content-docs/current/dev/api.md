---
title: API ドキュメント
---

## 概要

この拡張機能の API 定義は [Tampermonkey ドキュメント](https://www.tampermonkey.net/documentation.php) に基づいています。時間と労力の制約により、現在は一部の API のみが実装されており、今後も継続的に改善されます。この拡張機能が拡張する API や、元の GM API と異なる API はドキュメントで特別にマークされています（`*` を使用）。一部の API は `GM.*` のルールに従った同期版も提供しています。詳細はドキュメント本文を参照してください。

詳細な API 定義については `scriptcat.d.ts` またはビルトインエディタのヒントを参照してください。ドキュメントが常に最新ではない場合があります。この拡張機能固有の API については [CatApi ドキュメント](cat-api.md) を参照してください。

関連する例は [example ディレクトリ](https://github.com/scriptscat/scriptcat/tree/main/example) でも確認できます。

## 定義

### GM_info

スクリプトに関する情報を取得します。メタデータやランタイム環境パラメータが含まれます。よく使用されるフィールドには `scriptHandler`、`version`、`scriptMetaStr`、`scriptUpdateURL`、`downloadMode` などがあります。詳細（完全ではない）な定義は `scriptcat.d.ts` を参照してください。

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` は現在 `raw` のみの値です。`runAt` はサポートされていません。`userAgentData` はサポートされていますが、Tampermonkey と完全に一致するとは限りません。
* `userLanguage`（v1.5+）は ScriptCat の現在のインターフェース言語です（例：`"zh-CN"`、`"en-US"`、`"ja-JP"`）。スクリプトはこれをもとに自身の表示言語を決められます。値はスクリプトの起動時に確定します。`@early-start` スクリプトが同期的に読み取ると空文字列になる場合があるため、`CAT_scriptLoaded()` の後に読み取ってください。

### GM_log \*

ログ関数。バックグラウンドスクリプトのログはダッシュボードの実行ログで確認できます（実行状態列をクリック）。Tampermonkey と比較して、ログ `level` が追加されています。

```typescript
declare function GM_log(message: string, level?: GMTypes.LoggerLevel): void;

declare namespace GMTypes {
  type LoggerLevel = "debug" | "info" | "warn" | "error";
}
```

```js
GM_log("debug info", "debug");
```

### GM_get/set/deleteValue

ストレージの値を取得または設定します。同じ [**storageName**](meta.md#storagename-) 下のデータは共有され、リアルタイムで同期されます。

```typescript
// データを追加 — データは bool/string/number/object のいずれかのみで、クラスインスタンスは保存できません
declare function GM_setValue(name: string, value: any): void;
// データを取得
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// データを削除。再取得すると undefined または defaultValue が返されます
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### 注意: `GM_setValue` に `undefined` を渡した場合、Tampermonkey/GreaseMonkey が `undefined` を値として保存するのとは異なり、ScriptCat はそのキーを削除します。

#### 注意: データ操作は非同期であるため、`GM_setValue` や `GM_deleteValue` の直後に `window.close()` を呼び出すと、データが正しく更新されない場合があります。データ操作の完了を保証するには `await GM.setValue` または `await GM.deleteValue` の使用を推奨します。

### GM_listValues

すべてのキーを一覧表示します。

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

バッチ取得/設定 API（拡張機能）。

```typescript
// 複数の値を設定。values はキーが値名、値が内容のオブジェクトです
declare function GM_setValues(values: { [key: string]: any }): void;
// 複数の値を取得。keysOrDefaults がオブジェクトの場合、その値がデフォルトとして使用されます
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// 複数の値を削除。names は文字列の配列です
declare function GM_deleteValues(names: string[]): void;
```

```js
// バッチセット
GM_setValues({ a: 1, b: 2 });
// バッチ取得（存在しない場合はデフォルトを返す）
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// バッチ削除
GM_deleteValues(["a", "b"]);
```

#### 注意: データ操作は非同期であるため、`GM_setValues` や `GM_deleteValues` の直後に `window.close()` を呼び出すと、データが正しく更新されない場合があります。データ操作の完了を保証するには `await GM.setValues` または `await GM.deleteValues` の使用を推奨します。

### GM_add/removeValueChangeListener

> `tabid` は 0.17.0-alpha 以降削除されました。詳細は [GM_cookie](#gm_cookie-) を参照してください。

値の変更をリッスンします。`add` はリッスン ID を返し、`remove` でリッスンをキャンセルできます。このメソッドはシンプルな通信を実装するために使用でき、[**storageName**](meta.md#storagename-) を使用するとスクリプト間の通信が可能になります。

```typescript
// tabid はバックグラウンドスクリプトからリッスンする場合のみ存在します
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

`@resource` で宣言されたリソース情報を取得します。

```typescript
// GM_getResourceText はリソースのテキストデータを取得します。画像などのバイト型データは空文字列を返します — その場合は GM_getResourceURL を使用してください
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL は base64 エンコードされたデータを取得します。第二パラメータで blob URL も取得できます
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

ページに要素を挿入します。CSP 制限を迂回できます。

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// スクリプトを挿入
GM_addElement("script", { src: "https://example.com/app.js" });
// スタイルを挿入
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

ページにスタイルを追加し、スタイル DOM ノードを返します。CSP 制限を迂回できます。

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

新しいウィンドウを開きます。

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    active?: boolean;
    insert?: boolean | number;
    setParent?: boolean;
    incognito?: boolean;
    loadInBackground?: boolean;
    pinned?: boolean;
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
tab.onclose = () => console.log("closed");
tab.close();
```

### GM_get/saveTab/GM_getTabs

`GM_setValue` に似たデータ保存方法ですが、このメソッドのライフタイムは単一のブラウザタブのオープン→クローズ サイクルに紐づいており、バックグラウンドスクリプトからは使用できません。

```typescript
// タブデータを取得
declare function GM_getTab(callback: (obj: object) => void): void;
// タブデータを保存
declare function GM_saveTab(obj: object): void;
// すべてのタブのデータを取得
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* ポップアップページと右クリックメニューに表示されるメニューアイテムを登録します。クリックすると `listener` 関数が呼び出されます。
* デフォルトでは Tampermonkey と同様に、同じ表示テキストのメニューアイテムは1つだけ表示されます。
* `id` を指定するとメニューアイテムを更新できます。
* `name` が空文字列で `listener` がない場合、右クリックメニューに区切り線が追加されます。

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat 固有のオプション。デフォルトは true。false にするとクリック後もポップアップメニューを開いたままにする
        nested?: boolean; // ScriptCat 固有のオプション。デフォルトは true。false にするとブラウザの右クリックメニューアイテムを3階層目から2階層目に引き上げる
        individual?: boolean; // ScriptCat 固有のオプション。デフォルトは false。true にすると同じメニューアイテムをマージしない
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

ID を指定して登録されたメニューアイテムを削除します。

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

通知メッセージを送信します。`progress` と `buttons` 機能を提供します（Firefox では非対応）。通知にプログレスバーやボタンを表示できます。また、`GM_closeNotification` と `GM_updateNotification` の2つの追加メソッドも提供します（Firefox では非対応）。

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
    // 最大2つまで
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
GM_notification({ title: "Progress", text: "Loading", progress: 50 });
```

#### 注意: `GM_closeNotification` と `GM_updateNotification` は ScriptCat 固有です。通知を更新するには `tag` を使用してください。

```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // 進捗を更新
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // 1ms 後に閉じる
```

### GM_setClipboard \*

クリップボードを設定します。Tampermonkey とは異なり、コールバックはまだサポートされていません。

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

* CSP を迂回できるクロスオリジン HTTP リクエスト。`@connect` で宣言されたドメインをサポートします。一部の機能が欠落しています。Cookie 機能は Firefox では現在サポートされていません。通常のアクセスにはユーザー認証が必要です。`@connect` で記述されたホストはユーザー認証をスキップできます。

* `anonymous` と `cookie` は Tampermonkey と異なる方法で処理されます。`anonymous` が true で `cookie` が存在する場合、指定された cookie のみが送信され、他の cookie は添付されません。

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream";
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual";
    
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

* ファイルをダウンロードします。ヘッダーとその他のオプションを設定可能。Tampermonkey と比較して、cookie と anonymous オプションもサポートしています。blob URL を渡した場合、直接ダウンロードを開始し、`onload` イベントのみ発火します。これは Tampermonkey とは異なり、バックグラウンドスクリプトをサポートするためのものです。

* Promise オブジェクトを返し、`abort()` メソッドを提供します。
* Tampermonkey とは異なり、ScriptCat の `native` ダウンロードモード（デフォルト）は `@connect` を認識します。ダウンロード URL のホストがスクリプトの `@connect` 宣言でカバーされていない場合、ScriptCat はダウンロード前にユーザーに確認を促します。`@connect` でカバーされたホストはサイレントにダウンロードされ、ブラックリストされたホストは常に拒否されます。

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
// コールバック形式
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

ページのクッキーを非同期で操作します。クロスオリジン、HttpOnly、およびパーティショニングされたクッキーをサポートします。

> v0.17.0-alpha 以降、`store` と `tabid` 関連のパラメータは削除されました。ScriptCat は現在のウィンドウに基づいて、プライベートまたは通常のウィンドウからクッキーを取得するかどうかを判断します。

操作するホストを `@connect` で宣言する必要があり、使用にはユーザー認証が必要です。Tampermonkey の `GM_cookie.list` 操作と互換性がありますが、一貫性のためにこれは推奨されません。

* `sameSite` はサポートされていません。

```typescript
// name と domain は両方とも空にできません
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

// コールバック形式
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

**注意**: メタデータで `@connect example.com` を使用して許可されたドメインを宣言する必要があります。
