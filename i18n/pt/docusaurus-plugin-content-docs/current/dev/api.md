---
title: Documentação da API
---

## Visão Geral

As definições de API desta extensão são baseadas na [documentação do Tampermonkey](https://www.tampermonkey.net/documentation.php). Devido a restrições de tempo e esforço, apenas parte da API foi implementada até agora. Cada API que esta extensão estende ou que difere da API GM original é especialmente marcada na documentação (usando `*`). Algumas APIs também fornecem uma contraparte de estilo síncrono seguindo a regra `GM.*`.

Para definições detalhadas da API, consulte `scriptcat.d.ts` ou as dicas integradas do editor. Para APIs específicas desta extensão, consulte a [Documentação da CatApi](cat-api.md).

Exemplos relacionados podem ser encontrados no [diretório de exemplos](https://github.com/scriptscat/scriptcat/tree/main/example).

## Definições

### GM_info

Obtém informações sobre o script, incluindo metadados e parâmetros do ambiente de execução.

```js
console.log(GM_info.scriptHandler);
console.log(GM_info.version);
console.log(GM_info.scriptMetaStr);
```

* `sandboxMode` atualmente só tem o valor `raw`. `runAt` não é suportado.
* `userLanguage` (v1.5+) é o idioma atual da interface do ScriptCat, por exemplo `"zh-CN"`, `"en-US"`, `"ja-JP"`, permitindo que um script escolha seu próprio idioma de exibição. O valor é definido quando o script inicia; um script `@early-start` pode obter uma string vazia ao lê-lo de forma síncrona, portanto leia-o após `CAT_scriptLoaded()`.

### GM_log \*

Função de registro. Logs de um script de fundo podem ser visualizados no log de execução do painel.

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

Obtém ou define um valor no armazenamento. Dados sob o mesmo [**storageName**](meta.md#storagename-) podem ser compartilhados e sincronizados em tempo real.

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

#### Nota: Quando `GM_setValue` é chamado com `undefined`, ScriptCat deleta essa chave, diferentemente do Tampermonkey/GreaseMonkey que armazena `undefined` como valor.

#### Nota: Como as operações de dados são assíncronas, chamar `window.close()` imediatamente após `GM_setValue` ou `GM_deleteValue` pode impedir que os dados sejam atualizados corretamente. Recomenda-se usar `await GM.setValue` ou `await GM.deleteValue`.

### GM_listValues

Lista todas as chaves.

```typescript
declare function GM_listValues(): string[];
```

```js
console.log(GM_listValues());
```

### GM_setValues / GM_getValues / GM_deleteValues \*

APIs de obtenção/definição em lote (extensão).

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

> `tabid` foi removido após 0.17.0-alpha.

Escuta mudanças em um valor. `add` retorna um ID de listener, `remove` pode ser usado para cancelar.

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

Obtém informações de recursos declarados com `@resource`.

```typescript
declare function GM_getResourceText(name: string): string | undefined;
declare function GM_getResourceURL(name: string, isBlobUrl?: boolean): string | undefined;
```

```js
const css = GM_getResourceText("mystyle");
const imgUrl = GM_getResourceURL("logo");
```

### GM_addElement

Insere um elemento na página. Pode contornar restrições CSP.

```typescript
declare function GM_addElement(tag: string, attributes: any): HTMLElement;
declare function GM_addElement(parentNode: Element, tag: string, attrs: any): HTMLElement;
```

```js
GM_addElement("script", { src: "https://example.com/app.js" });
GM_addElement(document.head, "style", { textContent: ".foo{color:blue}" });
```

### GM_addStyle

Adiciona um estilo à página e retorna o nó DOM do estilo. Pode contornar restrições CSP.

```typescript
declare function GM_addStyle(css: string): HTMLElement;
```

### GM_openInTab \*

Abre uma nova janela.

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

Um método para armazenar dados similar ao `GM_setValue`, mas o ciclo de vida deste método está vinculado ao ciclo abrir→fechar de uma única aba do navegador.

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

* Registra um item de menu que aparece na página popup e no menu de contexto.
* Por padrão, itens de menu com o mesmo texto exibido aparecem apenas uma vez.
* Especificar um `id` permite atualizar o item.

```typescript
function GM_registerMenuCommand(name: string, listener?: (inputValue?: any) => void, options_or_accessKey?: { id?: number | string; accessKey?: string; autoClose?: boolean; nested?: boolean; individual?: boolean; } | string): number;
```

### GM_unregisterMenuCommand

Remove um item de menu registrado pelo seu ID.

```typescript
declare function GM_unregisterMenuCommand(id: number): void;
```

### GM_notification \*

Envia uma mensagem de notificação, fornecendo capacidades de `progress` e `buttons`. Também fornece `GM_closeNotification` e `GM_updateNotification`.

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

#### Nota: `GM_closeNotification` e `GM_updateNotification` são específicos do ScriptCat. Use `tag` para atualizar.

### GM_setClipboard \*

Define a área de transferência. Callback ainda não é suportado.

```typescript
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
```

```js
GM_setClipboard("Hello World", "text");
```

### GM_xmlhttpRequest \*

* Uma requisição HTTP de origem cruzada que pode contornar CSP. É necessária autorização de usuário; hosts descritos por `@connect` podem pular a autorização.

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

* Faz o download de um arquivo. Retorna um objeto Promise e fornece um método `abort()`.

```typescript
declare function GM_download(details: GMTypes.DownloadDetails): GMTypes.AbortHandle<boolean>;
declare function GM_download(url: string, filename: string): GMTypes.AbortHandle<boolean>;
```

```js
const dl = GM_download({ url: "https://example.com/file.zip", name: "file.zip", onload: () => alert("Done") });
dl.abort();
```

### GM_cookie \*

Opera assincronamente nos cookies da página, suportando cookies de origem cruzada, HttpOnly e particionados.

> Após v0.17.0-alpha, os parâmetros relacionados a `store` e `tabid` foram removidos.

O host operado deve ser declarado com `@connect` e requer autorização do usuário.

```typescript
declare function GM_cookie(action: GMTypes.CookieAction, details: GMTypes.CookieDetails, ondone: (cookie: GMTypes.Cookie[], error: unknown | undefined) => void): void;
```

**Nota**: Você deve declarar o domínio permitido nos metadados usando `@connect example.com`.
