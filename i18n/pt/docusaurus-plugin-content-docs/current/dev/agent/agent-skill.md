---
title: API de gerenciamento de Skills
---

`@grant CAT.agent.skills`

A API de gerenciamento de Skills permite que um script consulte, instale, remova e chame pacotes de extensão Skill.

Para desenvolvimento e empacotamento de Skills, consulte o [Guia de desenvolvimento de Skills](../agent-skill-dev). Exemplos oficiais de Skills: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — listar Skills instaladas

```javascript
const skills = await CAT.agent.skills.list();
```

**Retorna `SkillSummary[]`:**

| Campo | Tipo | Descrição |
|------|------|------|
| `name` | `string` | Nome da Skill |
| `description` | `string` | Descrição da Skill |
| `toolNames` | `string[]` | Nomes das ferramentas SkillScript que contém |
| `referenceNames` | `string[]` | Nomes dos arquivos de material de referência que contém |
| `hasConfig` | `boolean` | Se declara campos de configuração |
| `enabled` | `boolean` | Se está habilitada (padrão `true`) |
| `installtime` | `number` | Carimbo de data/hora da instalação |
| `updatetime` | `number` | Carimbo de data/hora da última atualização |

> Nota: `version` e `installUrl` (usados pela funcionalidade de verificação de atualizações da página de gerenciamento) não são retornados através desta API de script — são usados internamente pela lógica de verificação de atualizações e pela interface da página de gerenciamento.

## get — obter detalhes de uma Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Retorna o `SkillRecord` completo, ou `null` se não existir.

**Estrutura de `SkillRecord`:**

Hereda todos os campos de `SkillSummary`, mais:

| Campo | Tipo | Descrição |
|------|------|------|
| `prompt` | `string` | O corpo Markdown de `SKILL.cat.md` (o prompt dado à IA) |
| `config` | `Record<string, SkillConfigField>` | Definições de campos de configuração (esquema) |

**Estrutura de `SkillConfigField`:**

| Campo | Tipo | Descrição |
|------|------|------|
| `title` | `string` | Título de exibição |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Tipo de campo |
| `secret` | `boolean` | Se é sensível (mascarado na interface) |
| `required` | `boolean` | Se é obrigatório |
| `default` | `unknown` | Valor padrão |
| `values` | `string[]` | Lista de opções (apenas tipo `select`) |

## install — instalar uma Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|------|------|------|
| `skillMd` | `string` | Conteúdo do arquivo `SKILL.cat.md` (obrigatório) |
| `scripts` | `Array<{ name, code }>` | Lista de arquivos SkillScript |
| `references` | `Array<{ name, content }>` | Lista de arquivos de material de referência |

Se já existe uma Skill com o mesmo nome, ela é atualizada.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Ferramenta de busca personalizada
---

Use a ferramenta de busca quando o usuário precisar pesquisar.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# Documentação da API\n..." }]
);
```

## remove — desinstalar uma Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Retorna `true` se removida com sucesso, `false` se a Skill não existir.

## call — chamar um SkillScript diretamente

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Executa um SkillScript na Skill especificada diretamente, sem passar por uma conversa com IA.

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|------|------|------|
| `skillName` | `string` | Nome da Skill (obrigatório) |
| `scriptName` | `string` | Nome do SkillScript (obrigatório) |
| `params` | `Record<string, unknown>` | Parâmetros a passar (correspondentes às declarações `@param`) |

```javascript
// Chamar o script de busca dentro de uma Skill diretamente
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> A execução de SkillScript tem um timeout (300 segundos por padrão, personalizável via `@timeout`).
