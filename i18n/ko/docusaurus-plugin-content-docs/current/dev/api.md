---
title: API 문서
---

## 개요

이 확장 프로그램의 API 정의는 [Tampermonkey 문서](https://www.tampermonkey.net/documentation.php)를 기반으로 합니다. 시간과 노력의 제약으로 현재 일부 API만 구현되었으며 계속 반복될 것입니다. 이 확장 프로그램이 확장하거나 원래 GM API와 다른 모든 API는 문서에서 특별히 표시됩니다(`*` 사용). 일부 API는 `GM.*` 규칙을 따르는 동기 스타일 대응물도 제공합니다 — 자세한 내용은 문서 콘텐츠를 참조하세요.

자세한 API 정의는 문서가 항상 최신이 아닐 수 있으므로 `scriptcat.d.ts` 또는 기본 제공 편집기 힌트를 참조하세요. 이 확장 프로그램에 특화된 API는 [CatApi 문서](cat-api.md)를 참조하세요.

[예제 디렉터리](https://github.com/scriptscat/scriptcat/tree/main/example)에서 관련 예제도 찾을 수 있습니다.

## 정의

### GM_info

스크립트에 대한 정보를 가져옵니다. 메타데이터 및 런타임 환경 매개변수를 포함합니다. 일반적으로 사용되는 필드에는 `scriptHandler`, `version`, `scriptMetaStr`, `scriptUpdateURL`, `downloadMode` 등이 있습니다. 자세한(완전하지는 않은) 정의는 `scriptcat.d.ts`를 참조하세요.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode`는 현재 `raw` 값만 있습니다. `runAt`은 지원되지 않습니다. `userAgentData`는 지원되지만 Tampermonkey와 정확히 일치하지 않을 수 있습니다.
* `userLanguage`(v1.5+)는 ScriptCat의 현재 인터페이스 언어입니다(예: `"zh-CN"`, `"en-US"`, `"ja-JP"`). 스크립트는 이를 기준으로 자체 표시 언어를 정할 수 있습니다. 값은 스크립트가 시작될 때 결정됩니다. `@early-start` 스크립트가 동기적으로 읽으면 빈 문자열일 수 있으므로 `CAT_scriptLoaded()` 이후에 읽으세요.

### GM_log \*

로깅 함수. 백그라운드 스크립트의 로그는 대시보드의 실행 로그에서 볼 수 있습니다(실행 상태 열 클릭). Tampermonkey와 비교하여 로그 `level`이 추가되었습니다.

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

저장소의 값을 가져오거나 설정합니다. 동일한 [**storageName**](meta.md#storagename-) 아래의 데이터는 공유되고 실시간으로 동기화될 수 있습니다.

```typescript
// 데이터 추가 — 데이터는 bool/string/number/object 중 하나만 될 수 있습니다. 클래스 인스턴스는 저장할 수 없습니다
declare function GM_setValue(name: string, value: any): void;
// 데이터 가져오기
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
// 데이터 삭제, 다시 가져오면 undefined 또는 defaultValue 반환
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### 참고: `GM_setValue`가 `undefined`로 호출되면 ScriptCat은 `undefined`를 값으로 저장하는 Tampermonkey/GreaseMonkey와 달리 해당 키를 삭제합니다.

#### 참고: 데이터 작업은 비동기이므로 `GM_setValue` 또는 `GM_deleteValue` 직후에 `window.close()`를 호출하면 데이터가 올바르게 업데이트되지 않을 수 있습니다. 데이터 작업 완료를 보장하려면 `await GM.setValue` 또는 `await GM.deleteValue`를 사용하는 것이 좋습니다.

### GM_listValues

모든 키를 나열합니다.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

일괄 가져오기/설정 API (확장 프로그램).

```typescript
// 여러 값을 설정합니다. values는 키가 값 이름이고 값이 값 내용인 객체입니다
declare function GM_setValues(values: { [key: string]: any }): void;
// 여러 값을 가져옵니다. keysOrDefaults가 객체이면 그 값이 기본값으로 사용됩니다
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
// 여러 값을 삭제합니다. names는 문자열 배열입니다
declare function GM_deleteValues(names: string[]): void;
```

```js
// 일괄 설정
GM_setValues({ a: 1, b: 2 });
// 일괄 가져오기 (없으면 기본값 반환)
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
// 일괄 삭제
GM_deleteValues(["a", "b"]);
```

#### 참고: 데이터 작업은 비동기이므로 `GM_setValues` 또는 `GM_deleteValues` 직후에 `window.close()`를 호출하면 데이터가 올바르게 업데이트되지 않을 수 있습니다. 데이터 작업 완료를 보장하려면 `await GM.setValues` 또는 `await GM.deleteValues`를 사용하는 것이 좋습니다.

### GM_add/removeValueChangeListener

> `tabid`는 0.17.0-alpha 이후 제거되었습니다 — 자세한 내용은 [GM_cookie](#gm_cookie-) 참조.

값 변경을 수신합니다. `add`는 수신기 ID를 반환하고 `remove`는 수신기를 취소하는 데 사용할 수 있습니다. 이 메서드는 간단한 통신을 구현하는 데 사용할 수 있습니다. [**storageName**](meta.md#storagename-)을 사용하면 스크립트 간 통신이 가능합니다.

```typescript
// tabid는 백그라운드 스크립트에서 수신할 때만 존재합니다
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

`@resource`로 선언된 리소스 정보를 가져옵니다.

```typescript
// GM_getResourceText는 리소스의 텍스트 데이터를 가져옵니다. 이미지 같은 바이트 유형 데이터는 빈 문자열을 반환합니다 — 그런 경우 GM_getResourceURL을 사용하세요
declare function GM_getResourceText(name: string): string | undefined;
// GM_getResourceURL은 base64 인코딩 데이터를 가져옵니다. 두 번째 매개변수로 blob URL도 얻을 수 있습니다
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

페이지에 요소를 삽입합니다. CSP 제한을 우회할 수 있습니다.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
// 스크립트 삽입
GM_addElement("script", { src: "https://example.com/app.js" });
// 스타일 삽입
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

페이지에 스타일을 추가하고 스타일 DOM 노드를 반환합니다. CSP 제한을 우회할 수 있습니다.

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

새 창을 엽니다.

```typescript
declare function GM_openInTab(url: string, options: GMTypes.OpenTabOptions): GMTypes.Tab;
declare function GM_openInTab(url: string, loadInBackground: boolean): GMTypes.Tab;
declare function GM_openInTab(url: string): GMTypes.Tab;

declare namespace GMTypes {
  interface OpenTabOptions {
    /**
     * 새 탭이 열릴 때 초점을 받는지 여부를 결정합니다.
     *
     * - `true` → 새 탭이 즉시 전경으로 전환됩니다.
     * - `false` → 새 탭이 백그라운드에서 열리며 현재 페이지에서 초점을 빼앗지 않습니다.
     *
     * 기본값: true
     */
    active?: boolean;

    /**
     * 새 탭이 삽입되는 위치를 결정합니다.
     *
     * - `boolean`이면:
     *   - `true` → 현재 탭 바로 뒤에 삽입됩니다.
     *   - `false` → 창 끝에 삽입됩니다.
     * - `number`이면:
     *   - `0` → 현재 탭보다 한 위치 앞에 삽입됩니다.
     *   - `1` → 현재 탭보다 한 위치 뒤에 삽입됩니다.
     *
     * 기본값: true
     */
    insert?: boolean | number;

    /**
     * 부모 탭(즉 `openerTabId`)이 설정되는지 여부를 결정합니다.
     *
     * - `true` → 브라우저가 자식 탭을 연 탭을 추적할 수 있으며,
     *   이는 일부 확장 프로그램(탭 트리 관리자 등)이 부모/자식 관계를 식별하는 데 도움이 됩니다.
     *
     * 기본값: true
     */
    setParent?: boolean;

    /**
     * 시크릿(incognito) 창에서 탭을 열지 여부.
     *
     * 참고: ScriptCat의 manifest.json은 `"incognito": "split"`으로 설정하므로
     * 일반 창에서 실행할 때 tabId/windowId를 사용할 수 없으며
     * "새 탭 열기" 작업만 수행할 수 있습니다.
     *
     * 기본값: false
     */
    incognito?: boolean;

    /**
     * 레거시 호환 필드, Tampermonkey만 지원합니다.
     * 의미는 `active`의 **반대**입니다:
     *
     * - `true` → `active = false`와 동일 (백그라운드에서 로드).
     * - `false` → `active = true`와 동일 (전경에서 로드).
     *
     * ⚠️ 권장하지 않음: `active`와 겹치고 혼동하기 쉽습니다.
     *
     * 기본값: false
     * @deprecated 대신 `active`를 사용하세요
     */
    loadInBackground?: boolean;

    /**
     * 새 탭을 브라우저 탭 모음의 왼쪽에 고정할지 여부.
     *
     * - `true` → 새 탭이 고정됩니다.
     * - `false` → 일반 탭.
     *
     * 기본값: false
     */
    pinned?: boolean;

    /**
     * `chrome.tabs.create` 대신 `window.open`을 사용하여 새 탭을 엽니다.
     * `vscode://`, `m3u8dl://` 같은 특수 프로토콜이 있는 링크를 열 때 유용합니다.
     * 이 열기 방법을 사용하면 다른 매개변수는 효과가 없습니다.
     *
     * 관련: Issue #178 #1043
     * 기본값: false
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
tab.onclose = () => console.log("closed");
tab.close();
```

### GM_closeInTab

`GM_openInTab`으로 연 탭을 닫습니다.

```typescript
declare function GM_closeInTab(tabId: string): void;
```

### GM_get/saveTab/GM_getTabs

`GM_setValue`와 유사한 데이터 저장 방법이지만 이 방법의 수명은 단일 브라우저 탭의 열림→닫힘 주기에 연결되어 있으며 백그라운드 스크립트에서는 사용할 수 없습니다.

```typescript
// 탭 데이터 가져오기
declare function GM_getTab(callback: (obj: object) => void): void;
// 탭 데이터 저장
declare function GM_saveTab(obj: object): void;
// 모든 탭의 데이터 가져오기
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* 팝업 페이지와 오른쪽 클릭 메뉴에 나타나는 메뉴 항목을 등록합니다. 클릭하면 `listener` 함수를 호출합니다.
* 기본적으로 Tampermonkey와 일치하도록 동일한 표시 텍스트의 메뉴 항목은 한 번만 표시됩니다.
* `id`를 지정하면 메뉴 항목을 업데이트할 수 있습니다.
* `name`이 빈 문자열이고 `listener`가 없으면 오른쪽 클릭 메뉴에 구분선이 추가됩니다.

```typescript
function GM_registerMenuCommand(
  name: string,
  listener?: (inputValue?: any) => void,
  options_or_accessKey?:
    | {
        id?: number | string;
        accessKey?: string;
        autoClose?: boolean; // ScriptCat 전용 옵션, 기본값 true이며 false는 클릭 후 팝업 메뉴 페이지를 열어 둡니다
        nested?: boolean; // ScriptCat 전용 옵션, 기본값 true이며 false는 브라우저의 오른쪽 클릭 메뉴 항목을 3단계에서 2단계 메뉴로 올립니다
        individual?: boolean; // ScriptCat 전용 옵션, 기본값 false이며 true는 동일한 메뉴 항목이 병합되지 않음을 의미합니다
      }
    | string
): number;
```

```js
const cmdId = GM_registerMenuCommand("Test Command 01", () => alert("Called 01"));
GM_registerMenuCommand("Test Command 02", () => alert("Called 02"), {id: "custom-id"});
```

### GM_unregisterMenuCommand

ID로 등록된 메뉴 항목을 제거합니다.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

```js
GM_unregisterMenuCommand(cmdId);
GM_unregisterMenuCommand("custom-id");
```

### GM_notification \*

`progress` 및 `buttons` 기능(Firefox에서 지원되지 않음)을 제공하는 알림 메시지를 보내므로 알림에 진행률 표시줄이나 버튼을 표시할 수 있습니다. 또한 `GM_closeNotification` 및 `GM_updateNotification`(Firefox에서 지원되지 않음) 두 가지 추가 메서드를 제공합니다.

[예제](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

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
    // 최대 2개 존재할 수 있습니다
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

#### 참고: `GM_closeNotification` 및 `GM_updateNotification`은 ScriptCat 전용입니다. 알림을 업데이트하려면 `tag`를 사용하세요.


```js
GM_notification({ title: "Progress", text: "Loading", progress: 50, tag: "notification01"});
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01"}); // 진행률 업데이트
GM_notification({ title: "Progress", text: "Done", progress: 100, tag: "notification01", timeout: 1}); // 1ms 후 닫힘
```

### GM_setClipboard \*

클립보드를 설정합니다. Tampermonkey와 달리 콜백은 아직 지원되지 않습니다.

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

* CSP를 우회할 수 있는 교차 출처 HTTP 요청으로 `@connect`로 선언된 도메인을 지원합니다. 일부 기능이 누락되었으며 쿠키 기능은 현재 Firefox에서 지원되지 않습니다. 일반 액세스에는 사용자 인증이 필요합니다. `@connect`로 설명된 호스트는 사용자 인증을 건너뛸 수 있습니다.

* `anonymous` 및 `cookie`는 Tampermonkey와 다르게 처리됩니다: `anonymous`가 true이고 `cookie`가 있으면 다른 쿠키 없이 지정된 쿠키만 전송됩니다.

* 특수 헤더도 지원됩니다:

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
    responseType?: "text" | "arraybuffer" | "blob" | "json" | "document" | "stream"; // stream은 현재 버전에서 상당히 기본적인 구현입니다
    overrideMimeType?: string;
    anonymous?: boolean;
    fetch?: boolean;
    user?: string;
    password?: string;
    nocache?: boolean;
    redirect?: "follow" | "error" | "manual"; // Tampermonkey와 일관성을 유지하기 위해 maxRedirects는 v0.17.0 이후 redirect로 대체되어 사용 중단되었습니다. redirect는 fetch 모드를 강제합니다
    
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

* 헤더 및 기타 옵션을 구성할 수 있는 파일 다운로드. Tampermonkey와 비교하여 cookie 및 anonymous 옵션도 지원합니다. blob URL이 주어지면 다운로드를 직접 열고 `onload` 이벤트만 발생시킵니다 — 이는 Tampermonkey와 다르며 그렇지 않으면 다운로드를 만들 수 없는 백그라운드 스크립트를 지원하기 위해 존재합니다(보고서 생성 같은 시나리오에 유용).
* Promise 객체를 반환하고 `abort()` 메서드를 제공합니다.
* Tampermonkey와 달리 ScriptCat의 `native` 다운로드 모드(기본값)는 `@connect`를 존중합니다: 다운로드 URL의 호스트가 스크립트의 `@connect` 선언으로 처리되지 않으면 ScriptCat은 다운로드 전에 사용자 확인을 요청합니다. `@connect`로 처리되는 호스트는 자동으로 다운로드되며 블랙리스트 호스트는 항상 거부됩니다. `browser` 다운로드 모드는 이 검사 대상이 아닙니다. (Tampermonkey에서 `@connect`는 `GM_xmlhttpRequest`에만 적용되며 `GM_download`에는 적용되지 않습니다.)

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
// 콜백 형식
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

페이지 쿠키에 대해 비동기적으로 작업하며 교차 출처, HttpOnly 및 파티션 쿠키를 지원합니다.

> v0.17.0-alpha 이후 `store` 및 `tabid` 관련 매개변수가 제거되었습니다. ScriptCat은 현재 있는 창에 따라 시크릿 또는 일반 창에서 쿠키를 가져올지 결정합니다.

작동하는 호스트를 `@connect`로 선언해야 하며 사용하려면 사용자 인증이 필요합니다. Tampermonkey의 `GM_cookie.list` 작업과 호환되지만 일관성을 위해 권장되지 않습니다.

* `sameSite`는 지원되지 않습니다.

```typescript
// name과 domain이 동시에 비어 있을 수 없습니다
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

// 콜백 형식
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

// Promise 형식
const cookies = await GM.cookie.list({ url: "https://example.com" });
await GM.cookie.set({ name: "foo", value: "bar", domain: "example.com" });
await GM.cookie.delete("foo", { domain: "example.com" });
```

**참고**: 메타데이터에서 `@connect example.com`을 사용하여 허용된 도메인을 선언해야 합니다.
