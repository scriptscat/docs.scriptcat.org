---
title: Instalação e uso de Skills
---

Uma Skill é um pacote de extensão para Agent que injeta conhecimentos específicos do domínio e ferramentas personalizadas na IA. Esta página aborda como instalar, configurar e gerenciar Skills.

:::tip Repositório oficial de Skills
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Skills prontas para uso em automação de navegador, tarefas agendadas, análise de arquivos, assistência no desenvolvimento de scripts e mais.
:::

## Métodos de instalação

### Método 1: instalar a partir de uma URL

Abra diretamente uma URL de `SKILL.cat.md` na barra de endereços do seu navegador; o ScriptCat irá interceptá-la e exibir uma página de confirmação de instalação.

Por exemplo, para instalar a Skill oficial de automação de navegador:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Também é possível fazer isso pela página de gerenciamento:

1. Abra a página de gerenciamento do ScriptCat → **Agent → Skills**
2. Clique no botão **URL** no canto superior direito
3. Cole a URL do `SKILL.cat.md`
4. Clique em Instalar

O ScriptCat busca automaticamente o `SKILL.cat.md` juntamente com os scripts e arquivos de material de referência que ele declara.

### Método 2: instalar um ZIP

1. Abra a página de gerenciamento do ScriptCat → **Agent → Skills**
2. Clique no botão **+** no canto superior direito
3. Selecione um pacote Skill no formato `.zip`

A estrutura de diretórios do ZIP deve seguir o formato padrão da Skill (deve conter `SKILL.cat.md`).

## Lista oficial de Skills

Clique com o botão direito em **Copiar link**, cole o link no campo URL de gerenciamento de Skills para instalar.

| Skill | Descrição | Instalar |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Análise de páginas, manipulação de DOM, preenchimento de formulários, capturas de tela, navegação | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Tarefas Cron agendadas (execução automática por LLM/callback de script) | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Ajuda a criar, testar e empacotar novas Skills | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Analisa arquivos Excel, PDF, Word, CSV e PPT | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Assistente de desenvolvimento de scripts ScriptCat/Tampermonkey | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Leitura/escrita de planilhas Synology Office | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Assistente de operações de conta oficial do WeChat | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Assistente de operações Xiaohongshu (RED) | [Instalar](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Configurar uma Skill

Algumas Skills requerem configuração (como uma chave de API):

1. Encontre a Skill instalada na página **Agent → Skills**
2. Clique no ícone de **Configurações** (engrenagem)
3. Preencha os campos de configuração e salve

Os campos marcados como `secret` na configuração são mascarados na interface.

## Ativar / desativar

Na página de gerenciamento de Skills, use o toggle no cartão de uma Skill para controlar se ela está ativada. Skills desativadas não são carregadas nas conversas.

## Verificar atualizações

Skills instaladas via URL suportam verificação de versão:

1. Clique no botão **Verificar atualizações** no canto superior direito da página de Skills
2. Os cartões de Skills com nova versão disponível exibirão um botão **Atualizar**
3. Clique para atualizar com um clique

As atualizações são comparadas usando o campo `version` (formato semver) declarado no `SKILL.cat.md`.

## Usando Skills em uma conversa

Skills instaladas estão automaticamente disponíveis nas conversas do Agent. A IA decide quando carregar e chamar as ferramentas de uma Skill com base no conteúdo da conversa.

Você também pode especificar quais Skills carregar ao criar uma conversa:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Carrega todas as Skills automaticamente
  // ou especifique Skills específicas
  // skills: ["browser-automation", "file-parser"]
});
```

## Saiba mais

- [API de gerenciamento de Skills](./agent-skill.md) — gerencie Skills programaticamente a partir de um script
- [Guia de desenvolvimento de Skills](./agent-skill-dev.md) — crie sua própria Skill
