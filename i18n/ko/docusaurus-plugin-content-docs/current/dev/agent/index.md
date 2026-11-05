---
title: Agent
---

:::caution 테스트 단계
Agent 기능은 현재 테스트 단계에 있습니다. 아래의 API와 동작은 공식 릴리스 전에 변경될 수 있습니다.
:::

## 개요

ScriptCat v1.4는 AI 대화, 브라우저 자동화, 파일 관리 및 예약 작업을 포함한 일련의 기능을 사용자 스크립트에 제공하는 Agent 시스템을 도입합니다.

스크립트는 `CAT.agent.*` 네임스페이스를 통해 이러한 기능을 호출하며, 모든 API는 해당 권한을 `@grant`로 선언해야 합니다.

## 기능 모듈

| 모듈 | 권한 | 설명 |
|------|---------|------|
| [대화](./agent-conversation) | `@grant CAT.agent.conversation` | AI 대화 생성, 메시지 전송, 스트리밍 응답, 사용자 지정 도구 정의 |
| [DOM 작업](./agent-dom) | `@grant CAT.agent.dom` | 페이지 탐색, 스크린샷, 클릭, 채우기, 스크롤, DOM 모니터링 |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Skill 패키지 설치/제거/호출 |
| [예약 작업](./agent-task) | `@grant CAT.agent.task` | Cron 예약 작업, 이벤트 수신 |
| [모델](./agent-model) | `@grant CAT.agent.model` | 구성된 모델 정보 쿼리 (읽기 전용) |
| [OPFS 파일](./agent-opfs) | `@grant CAT.agent.opfs` | Agent 작업 영역 파일 읽기/쓰기 |
| [MCP](./agent-mcp) | — | MCP 서버 연결 구성 (관리 페이지만, 스크립트 API 없음) |
| [Skill 개발](./agent-skill-dev) | — | SKILL.cat.md + SkillScript 개발 가이드 |

## 빠른 시작

가장 간단한 Agent 스크립트:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Hi, please introduce yourself");
console.log(reply.content);
```

## 아키텍처 개요

Agent 시스템은 브라우저 확장 프로그램 내의 여러 격리된 컨텍스트에 걸쳐 있습니다:

```
User script → Sandbox (isolated execution)
              ↓ WindowMessage
           Offscreen (DOM access)
              ↓ ExtensionMessage
           Service Worker (core scheduling)
              ├── LLM Provider (OpenAI / Anthropic)
              ├── ToolRegistry (tool registration and execution)
              ├── SkillScriptExecutor (Skill script execution)
              ├── MCPClient (MCP protocol client)
              └── TaskScheduler (scheduled task scheduling)
```

### 저장 구조

Agent는 브라우저의 OPFS(Origin Private File System)를 사용하여 데이터를 저장합니다:

```
agents/
├── conversations/       # 대화 기록
├── attachments/         # 첨부 파일 (이미지, 파일)
├── skills/{name}/       # Skill 패키지 파일
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # 예약 작업 구성 및 실행 기록
└── workspace/           # 사용자 작업 영역 파일 (opfs_* 도구가 작업하는 디렉터리)
```

### 지원 모델

| 제공자 | 형식 | 기능 |
|----------|------|------|
| OpenAI 호환 | OpenAI Chat Completions API | GPT-4o, DeepSeek 및 기타 호환 모델 지원 |
| Anthropic | Anthropic Messages API | Claude 제품군, Prompt Caching 지원 |
| Zhipu | Zhipu API | GLM 모델 제품군 지원 |

대시보드의 "모델 구성"에서 제공자와 API 키를 추가하여 사용하세요.

### Skill 생태계

Skill은 프롬프트 + 도구 스크립트 + 참조 자료를 결합한 패키지로, Agent에 도메인별 지식과 사용자 지정 도구를 주입할 수 있습니다.

**공식 Skill 저장소: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

브라우저 자동화, 예약 작업, Skill 생성 도구, 대화/DOM/구성 예제 등을 위한 즉시 사용 가능한 Skill이 포함되어 있습니다.

**설치 방법:**

- **URL 설치** — `SKILL.cat.md` URL을 브라우저에서 직접 엽니다. ScriptCat이 자동으로 가로채서 설치 페이지를 표시합니다. 대시보드의 Agent → Skill 관리에 URL을 붙여넣을 수도 있습니다.
- **스크립트 설치** — `CAT.agent.skills.install()` API를 통해 프로그래밍 방식으로 설치

**업데이트 확인:**

URL로 설치된 Skill은 설치 소스를 기록합니다. 대시보드에서 업데이트를 확인하고 원클릭 업그레이드할 수 있습니다(`version` 필드의 semver 비교 기반).

자세한 내용은 [Skill 관리 API](./agent-skill) 및 [Skill 개발 가이드](./agent-skill-dev)를 참조하세요.
