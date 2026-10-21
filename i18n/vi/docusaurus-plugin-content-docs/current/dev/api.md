---
title: Tài liệu API
---

## Tổng quan

Các định nghĩa API của tiện ích mở rộng này dựa trên [tài liệu Tampermonkey](https://www.tampermonkey.net/documentation.php). Do giới hạn thời gian và công sức, hiện chỉ một phần API đã được triển khai. Mỗi API mà tiện ích mở rộng này mở rộng hoặc khác với API GM gốc được đánh dấu đặc biệt trong tài liệu (dùng `*`). Một số API cũng cung cấp đối tác kiểu đồng bộ theo quy tắc `GM.*`.

Để xem định nghĩa API chi tiết, tham khảo `scriptcat.d.ts` hoặc gợi ý tích hợp của trình soạn thảo. Đối với API đặc thù của tiện ích mở rộng này, xem [Tài liệu CatApi](cat-api.md).

Các ví dụ liên quan có thể tìm thấy trong [thư mục ví dụ](https://github.com/scriptscat/scriptcat/tree/main/example).

## Định nghĩa

### GM_info

Lấy thông tin về script, bao gồm siêu dữ liệu và tham số môi trường thực thi.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` hiện chỉ có giá trị `raw`. `runAt` không được hỗ trợ.
* `userLanguage` (v1.5+) là ngôn ngữ giao diện hiện tại của ScriptCat, ví dụ `"zh-CN"`, `"en-US"`, `"ja-JP"`, giúp script tự chọn ngôn ngữ hiển thị. Giá trị được xác định khi script khởi động; script `@early-start` có thể nhận chuỗi rỗng khi đọc đồng bộ, vì vậy hãy đọc sau `CAT_scriptLoaded()`.

### GM_log \*

Hàm ghi log. Log của script nền có thể xem trong nhật ký chạy của bảng điều khiển.

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

Lấy hoặc đặt giá trị trong bộ nhớ. Dữ liệu dưới cùng [**storageName**](meta.md#storagename-) có thể được chia sẻ và đồng bộ theo thời gian thực.

```typescript
declare function GM_setValue(name: string, value: any): void;
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;
declare function GM_deleteValue(name: string): void;
```

```js
GM_setValue("foo", 42);
const v = GM_getValue("foo", 0);
GM_deleteValue("foo");
```

#### Lưu ý: Khi gọi `GM_setValue` với `undefined`, ScriptCat xóa key đó, khác với Tampermonkey/GreaseMonkey lưu `undefined` làm giá trị.

#### Lưu ý: Vì các thao tác dữ liệu bất đồng bộ, gọi `window.close()` ngay sau `GM_setValue` hoặc `GM_deleteValue` có thể ngăn dữ liệu được cập nhật đúng cách. Nên dùng `await GM.setValue` hoặc `await GM.deleteValue`.

### GM_listValues

Liệt kê tất cả các khóa.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

API lấy/đặt hàng loạt (mở rộng).

```typescript
declare function GM_setValues(values: { [key: string]: any }): void;
declare function GM_getValues(keysOrDefaults: { [key: string]: any } | string[] | null | undefined): { [key: string]: any };
declare function GM_deleteValues(names: string[]): void;
```

```js
GM_setValues({ a: 1, b: 2 });
const { a, b, c = 3 } = GM_getValues({ a: 0, b: 0, c: 3 });
GM_deleteValues(["a", "b"]);
```

### GM_add/removeValueChangeListener

> `tabid` đã bị xóa sau 0.17.0-alpha.

Lắng nghe thay đổi của giá trị. `add` trả về ID listener, `remove` dùng để hủy.

```typescript
type ValueChangeListener = (name: string, oldValue: any, newValue: any, remote: boolean, tabid?: number) => any;
declare function GM_addValueChangeListener(name: string, listener: GMTypes.ValueChangeListener): number;
declare function GM_removeValueChangeListener(listenerId: number): void;
```

```js
const id = GM_addValueChangeListener("foo", (k, oldV, newV, remote) => {
  console.log(k, oldV, newV, remote);
});
GM_removeValueChangeListener(id);
```

### GM_getResourceText/GM_getResourceURL

Lấy thông tin tài nguyên đã khai báo với `@resource`.

```typescript
declare function GM_getResourceText(name: string): string | undefined;
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Chèn phần tử vào trang. Có thể bỏ qua hạn chế CSP.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
GM_addElement("script", { src: "https://example.com/app.js" });
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Thêm kiểu vào trang và trả về node DOM của kiểu. Có thể bỏ qua hạn chế CSP.

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

### GM_openInTab \*

Mở cửa sổ mới.

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

Phương thức lưu dữ liệu tương tự `GM_setValue`, nhưng vòng đời của phương thức này gắn liền với chu kỳ mở→đóng của một tab trình duyệt duy nhất.

```typescript
declare function GM_getTab(callback: (obj: object) => void): void;
declare function GM_saveTab(obj: object): void;
declare function GM_getTabs(callback: (objs: { [key: number]: object }) => void): void;
```

```js
GM_saveTab({ foo: 1 }, () => console.log("saved"));
GM_getTab(tab => console.log(tab));
GM_getTabs(tabs => console.log(tabs));
```

### GM_registerMenuCommand *

* Đăng ký mục menu xuất hiện trên trang popup và menu ngữ cảnh.
* Mặc định, các mục menu cùng nội dung chỉ hiển thị một lần.
* Chỉ định `id` cho phép cập nhật mục menu.

```typescript
function GM_registerMenuCommand(name: string, listener?: (inputValue?: any) => void, options_or_accessKey?: { id?: number | string; accessKey?: string; autoClose?: boolean; nested?: boolean; individual?: boolean; } | string): number;
```

### GM_unregisterMenuCommand

Xóa mục menu đã đăng ký theo ID.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

### GM_notification \*

Gửi thông báo, cung cấp khả năng `progress` và `buttons`. Cũng cung cấp `GM_closeNotification` và `GM_updateNotification`.

[example](https://github.com/scriptscat/scriptcat/blob/main/example/gm_notification.js)

```typescript
declare function GM_notification(details: GMTypes.NotificationDetails, ondone?: GMTypes.NotificationOnDone): void;
declare function GM_notification(text: string, title: string, image: string, onclick: GMTypes.NotificationOnClick): void;
declare function GM_closeNotification(id: string): void;
declare function GM_updateNotification(id: string, details: GMTypes.NotificationDetails): void;
```

```js
GM_notification({ title: "Progress", text: "Loading", progress: 50 });
```

#### Lưu ý: `GM_closeNotification` và `GM_updateNotification` đặc thù của ScriptCat. Dùng `tag` để cập nhật.

### GM_setClipboard \*

Đặt bộ nhớ tạm. Callback chưa được hỗ trợ.

```typescript
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* Yêu cầu HTTP cross-origin có thể bỏ qua CSP. Cần xác thực người dùng; host được mô tả bởi `@connect` có thể bỏ qua xác thực.

```typescript
declare function GM_xmlhttpRequest(details: GMTypes.XHRDetails): GMTypes.AbortHandle<void>;
```

```js
GM_xmlhttpRequest({
  method: "GET",
  url: "https://api.example.com/data",
  onload: res => console.log(res.responseText)
});
```

### GM_download

* Tải xuống tệp. Trả về đối tượng Promise và cung cấp phương thức `abort()`.

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;
```

```js
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Thao tác cookie trang bất đồng bộ, hỗ trợ cookie cross-origin, HttpOnly và phân vùng.

> Sau v0.17.0-alpha, các tham số liên quan đến `store` và `tabid` đã bị xóa.

Host thao tác phải được khai báo bằng `@connect` và cần xác thực người dùng.

```typescript
declare function GM_cookie(action: GMTypes.CookieAction, details: GMTypes.CookieDetails, ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void): void;
```

**Lưu ý**: Bạn phải khai báo miền được phép trong siêu dữ liệu bằng `@connect example.com`.
