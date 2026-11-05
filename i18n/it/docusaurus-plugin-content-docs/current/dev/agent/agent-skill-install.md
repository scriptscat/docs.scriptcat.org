---
title: Installazione e utilizzo delle Skill
---

Una Skill è un pacchetto di estensione per Agent che inietta conoscenze specifiche del dominio e strumenti personalizzati nell'AI. Questa pagina descrive come installare, configurare e gestire le Skill.

:::tip Repository ufficiale delle Skill
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Skill pronte all'uso per automazione del browser, task programmati, analisi file, assistenza allo sviluppo di script e altro.
:::

## Metodi di installazione

### Metodo 1: installare da un URL

Aprire direttamente un URL di `SKILL.cat.md` nella barra degli indirizzi del browser; ScriptCat lo intercetterà e visualizzerà una pagina di conferma dell'installazione.

Ad esempio, per installare la Skill ufficiale di automazione del browser:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

È possibile farlo anche dalla pagina di gestione:

1. Aprire la pagina di gestione di ScriptCat → **Agent → Skills**
2. Cliccare sul pulsante **URL** in alto a destra
3. Incollare l'URL di `SKILL.cat.md`
4. Cliccare su Installa

ScriptCat recupera automaticamente `SKILL.cat.md` insieme agli script e ai file di materiale di riferimento dichiarati.

### Metodo 2: installare un ZIP

1. Aprire la pagina di gestione di ScriptCat → **Agent → Skills**
2. Cliccare sul pulsante **+** in alto a destra
3. Selezionare un pacchetto Skill in formato `.zip`

La struttura delle directory dello ZIP deve seguire il formato standard della Skill (deve contenere `SKILL.cat.md`).

## Elenco ufficiale delle Skill

Cliccare destro su **Copia link**, poi incollare il link nel campo URL della gestione delle Skill per installare.

| Skill | Descrizione | Installa |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Analisi pagine, manipolazione DOM, compilazione moduli, screenshot, navigazione | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Task programmati Cron (esecuzione automatica da LLM/callback script) | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Aiuta a creare, testare e impacchettare nuove Skill | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Analizza file Excel, PDF, Word, CSV e PPT | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Assistente di sviluppo script ScriptCat/Tampermonkey | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Lettura/scrittura di fogli di calcolo Synology Office | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Assistente operazioni account ufficiale WeChat | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Assistente operazioni Xiaohongshu (RED) | [Installa](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Configurare una Skill

Alcune Skill richiedono configurazione (come una chiave API):

1. Trovare la Skill installata nella pagina **Agent → Skills**
2. Cliccare sull'icona **Impostazioni** (ingranaggio)
3. Compilare i campi di configurazione e salvare

I campi contrassegnati come `secret` nella configurazione sono mascherati nell'interfaccia.

## Abilita / disabilita

Nella pagina di gestione delle Skill, usa l'interruttore sulla scheda di una Skill per controllare se è abilitata. Le Skill disabilitate non vengono caricate nelle conversazioni.

## Verifica aggiornamenti

Le Skill installate tramite URL supportano il controllo della versione:

1. Cliccare sul pulsante **Verifica aggiornamenti** in alto a destra della pagina delle Skill
2. Le schede delle Skill con una nuova versione disponibile mostreranno un pulsante **Aggiorna**
3. Cliccare per aggiornare con un clic

Gli aggiornamenti vengono confrontati usando il campo `versione` (formato semver) dichiarato in `SKILL.cat.md`.

## Usare le Skill in una conversazione

Le Skill installate sono automaticamente disponibili nelle conversazioni di Agent. L'AI decide quando caricare e chiamare gli strumenti di una Skill in base al contenuto della conversazione.

Puoi anche specificare quali Skill caricare quando crei una conversazione:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Carica automaticamente tutte le Skill
  // oppure specificare Skill particolari
  // skills: ["browser-automation", "file-parser"]
});
```

## Scopri di più

- [API di gestione delle Skill](./agent-skill.md) — gestisci le Skill programmaticamente da uno script
- [Guida allo sviluppo delle Skill](./agent-skill-dev.md) — crea la tua Skill
