---
title: Skill Yönetim API'si
---

`@grant CAT.agent.skills`

Skill yönetim API'si, bir betiğin Skill uzantı paketlerini sorgulamasını, kurmasını, kaldırmasını ve çağırmasını sağlar.

Skill geliştirme ve paketleme için [Skill Geliştirme Rehberi](../agent-skill-dev) bölümüne bakın. Resmi Skill örnekleri: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — kurulu Skill'leri listele

```javascript
const skills = await CAT.agent.skills.list();
```

**`SkillSummary[]` döndürür:**

| Alan | Tür | Açıklama |
|------|------|------|
| `name` | `string` | Skill adı |
| `description` | `string` | Skill açıklaması |
| `toolNames` | `string[]` | İçerdiği SkillScript araçlarının adları |
| `referenceNames` | `string[]` | İçerdiği referans materyal dosyalarının adları |
| `hasConfig` | `boolean` | Yapılandırma alanları bildirip bildirmediği |
| `enabled` | `boolean` | Etkin olup olmadığı (varsayılan `true`) |
| `installtime` | `number` | Kurulum zaman damgası |
| `updatetime` | `number` | Son güncelleme zaman damgası |

> Not: `version` ve `installUrl` (yönetim sayfasının güncelleme kontrolü özelliği tarafından kullanılır) bu betik API'si üzerinden döndürülmez — yalnızca güncelleme kontrolü mantığı ve yönetim sayfası arayüzü tarafından dahili olarak kullanılırlar.

## get — Skill ayrıntılarını al

```javascript
const skill = await CAT.agent.skills.get(name);
```

Tam `SkillRecord` değerini veya yoksa `null` döndürür.

**`SkillRecord` biçimi:**

`SkillSummary` içindeki tüm alanları devralır, artı:

| Alan | Tür | Açıklama |
|------|------|------|
| `prompt` | `string` | `SKILL.cat.md` dosyasının Markdown gövdesi (AI'ya verilen istem) |
| `config` | `Record<string, SkillConfigField>` | Yapılandırma alanı tanımları (şema) |

**`SkillConfigField` biçimi:**

| Alan | Tür | Açıklama |
|------|------|------|
| `title` | `string` | Görünen başlık |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Alan türü |
| `secret` | `boolean` | Hassas olup olmadığı (arayüzde maskelenir) |
| `required` | `boolean` | Zorunlu olup olmadığı |
| `default` | `unknown` | Varsayılan değer |
| `values` | `string[]` | Seçenek listesi (yalnızca `select` türü) |

## install — bir Skill kur

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parametreler:**

| Parametre | Tür | Açıklama |
|------|------|------|
| `skillMd` | `string` | `SKILL.cat.md` dosyasının içeriği (zorunlu) |
| `scripts` | `Array<{ name, code }>` | SkillScript dosyalarının listesi |
| `references` | `Array<{ name, content }>` | Referans materyal dosyalarının listesi |

Aynı ada sahip bir Skill zaten varsa, bu çağrı onu günceller.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Custom search tool
---

Use the search tool when the user needs to search.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# API Docs\n..." }]
);
```

## remove — bir Skill kaldır

```javascript
const success = await CAT.agent.skills.remove(name);
```

Başarıyla kaldırılırsa `true`, Skill yoksa `false` döndürür.

## call — bir SkillScript'i doğrudan çağır

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Belirtilen Skill içindeki bir SkillScript'i, bir AI sohbetinden geçmeden doğrudan çalıştırır.

**Parametreler:**

| Parametre | Tür | Açıklama |
|------|------|------|
| `skillName` | `string` | Skill adı (zorunlu) |
| `scriptName` | `string` | SkillScript adı (zorunlu) |
| `params` | `Record<string, unknown>` | İletilecek parametreler (`@param` bildirimleriyle eşleşen) |

```javascript
// Bir Skill içindeki arama betiğini doğrudan çağır
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> SkillScript çalıştırmasının bir zaman aşımı vardır (varsayılan 300 saniye, `@timeout` ile özelleştirilebilir).
