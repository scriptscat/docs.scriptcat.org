---
title: Agent
---

:::caution Fase de testes
A funcionalidade Agent ainda está atualmente em fase de testes; as seguintes APIs e comportamentos podem mudar antes do lançamento oficial.
:::

## Visão geral

ScriptCat v1.4 introduz o sistema Agent, fornecendo aos scripts de usuário um conjunto de capacidades que incluem conversação com IA, automação do navegador, gerenciamento de arquivos e tarefas agendadas.

Os scripts chamam essas capacidades através do namespace `CAT.agent.*`, e cada API requer que a permissão correspondente seja declarada com `@grant`.

## Módulos de funcionalidade

| Módulo | Permissão | Descrição |
|------|---------|------|
| [Conversação](./agent-conversation) | `@grant CAT.agent.conversation` | Criar conversas com IA, enviar mensagens, transmitir respostas, definir ferramentas personalizadas |
| [Operações DOM](./agent-dom) | `@grant CAT.agent.dom` | Navegação de páginas, capturas de tela, cliques, preenchimento, rolagem, monitoramento DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Instalar/desinstalar/invocar pacotes Skill |
| [Tarefas agendadas](./agent-task) | `@grant CAT.agent.task` | Tarefas Cron agendadas, escuta de eventos |
| [Modelo](./agent-model) | `@grant CAT.agent.model` | Consultar informações de modelos configurados (somente leitura) |
| [Arquivos OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Ler/escrever arquivos do espaço de trabalho do Agent |
| [MCP](./agent-mcp) | — | Configurar conexões de servidores MCP (apenas página de administração, sem API de script) |
| [Desenvolvimento de Skill](./agent-skill-dev) | — | Guia de desenvolvimento de SKILL.cat.md + SkillScript |

## Início rápido

O script Agent mais simples possível:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Olá, por favor apresente-se");
console.log(reply.content);
```

## Visão geral da arquitetura

O sistema Agent se estende por múltiplos contextos isolados dentro da extensão do navegador:

```
Script do usuário → Sandbox (execução isolada)
              ↓ WindowMessage
           Offscreen (acesso DOM)
              ↓ ExtensionMessage
           Service Worker (agendamento central)
              ├── Provedor LLM (OpenAI / Anthropic)
              ├── ToolRegistry (registro e execução de ferramentas)
              ├── SkillScriptExecutor (execução de scripts Skill)
              ├── MCPClient (cliente de protocolo MCP)
              └── TaskScheduler (agendamento de tarefas)
```

### Estrutura de armazenamento

O Agent armazena dados usando o OPFS (Origin Private File System) do navegador:

```
agents/
├── conversations/       # histórico de conversas
├── attachments/         # anexos (imagens, arquivos)
├── skills/{name}/       # arquivos de pacotes Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # configuração e registros de execução de tarefas agendadas
└── workspace/           # arquivos do espaço de trabalho do usuário (o diretório que as ferramentas opfs_* operam)
```

### Modelos suportados

| Provedor | Formato | Recursos |
|----------|------|------|
| Compatível com OpenAI | API OpenAI Chat Completions | Suporta GPT-4o, DeepSeek e outros modelos compatíveis |
| Anthropic | API Anthropic Messages | Suporta a família Claude, Prompt Caching |
| 智譜 | API 智譜 | Suporta a família de modelos GLM |

Adicione um Provedor e Chave de API em "Configuração de modelo" no painel de controle para usá-lo.

### O ecossistema Skill

Um Skill é um pacote que combina prompts + scripts de ferramentas + material de referência, permitindo que você injete conhecimento específico do domínio e ferramentas personalizadas no Agent.

**Repositório oficial de Skills: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Inclui Skills prontos para uso para automação do navegador, tarefas agendadas, uma ferramenta de criação de Skills, exemplos de conversação/DOM/configuração e mais.

**Métodos de instalação:**

- **Instalação por URL** — abra diretamente a URL do `SKILL.cat.md` no navegador; o ScriptCat a intercepta automaticamente e mostra a página de instalação. Você também pode colar a URL sob Agent → Gerenciamento de Skill no painel de controle.
- **Instalação por script** — instale programaticamente através da API `CAT.agent.skills.install()`

**Verificação de atualizações:**

Um Skill instalado por URL registra sua fonte de instalação; o painel de controle permite verificar atualizações e atualizar com um clique (baseado na comparação semver do campo `version`).

Consulte [API de gerenciamento de Skill](./agent-skill) e [Guia de desenvolvimento de Skill](./agent-skill-dev) para detalhes.
