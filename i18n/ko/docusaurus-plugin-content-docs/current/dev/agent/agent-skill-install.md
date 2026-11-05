---
title: Skill 설치 및 사용
---

Skill은 AI에 도메인별 지식과 사용자 지정 도구를 주입하는 Agent용 확장 패키지입니다. 이 페이지에서는 Skill을 설치, 구성 및 관리하는 방법을 다룹니다.

:::tip 공식 Skill 저장소
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — 브라우저 자동화, 예약 작업, 파일 구문 분석, 스크립트 개발 지원 등을 위한 즉시 사용 가능한 Skill.
:::

## 설치 방법

### 방법 1: URL에서 설치

브라우저 주소 표시줄에서 `SKILL.cat.md` URL을 직접 엽니다. ScriptCat이 이를 가로채서 설치 확인 페이지를 표시합니다.

예를 들어 공식 브라우저 자동화 Skill을 설치하려면:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

관리 페이지에서도 할 수 있습니다:

1. ScriptCat 관리 페이지 열기 → **Agent → Skills**
2. 오른쪽 상단의 **URL** 버튼 클릭
3. `SKILL.cat.md` URL 붙여넣기
4. 설치 클릭

ScriptCat은 `SKILL.cat.md`와 함께 선언된 스크립트 및 참조 자료 파일을 자동으로 가져옵니다.

### 방법 2: ZIP 설치

1. ScriptCat 관리 페이지 열기 → **Agent → Skills**
2. 오른쪽 상단의 **+** 버튼 클릭
3. `.zip` 형식의 Skill 패키지 선택

ZIP의 디렉터리 구조는 표준 Skill 형식을 따라야 합니다(`SKILL.cat.md` 포함).

## 공식 Skill 목록

**링크 복사**를 마우스 오른쪽 버튼으로 클릭한 다음 Skills 관리 URL 필드에 붙여넣어 설치하세요.

| Skill | 설명 | 설치 |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | 페이지 분석, DOM 조작, 양식 작성, 스크린샷, 탐색 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Cron 예약 작업 (LLM / 스크립트 콜백에 의한 자동 실행) | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | 새 Skill 생성, 테스트 및 패키징 지원 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Excel, PDF, Word, CSV 및 PPT 파일 구문 분석 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | ScriptCat/Tampermonkey 스크립트 개발 도우미 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Synology Office 스프레드시트 읽기/쓰기 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | WeChat 공식 계정 운영 도우미 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Xiaohongshu(RED) 운영 도우미 | [설치](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Skill 구성

일부 Skill은 구성이 필요합니다(API 키 등):

1. **Agent → Skills** 페이지에서 설치된 Skill 찾기
2. **설정** 아이콘(기어) 클릭
3. 구성 필드를 채우고 저장

구성에서 `secret`으로 표시된 필드는 UI에서 마스킹됩니다.

## 활성화 / 비활성화

Skills 관리 페이지에서 Skill 카드의 토글을 사용하여 활성화 여부를 제어합니다. 비활성화된 Skill은 대화에서 로드되지 않습니다.

## 업데이트 확인

URL로 설치된 Skill은 버전 확인을 지원합니다:

1. Skills 페이지 오른쪽 상단의 **업데이트 확인** 버튼 클릭
2. 새 버전이 있는 Skill 카드에 **업데이트** 버튼이 표시됩니다
3. 클릭하여 원클릭 업그레이드

업데이트는 `SKILL.cat.md`에 선언된 `version` 필드(semver 형식)를 사용하여 비교됩니다.

## 대화에서 Skill 사용

설치된 Skill은 Agent 대화에서 자동으로 사용할 수 있습니다. AI는 대화 내용에 따라 Skill의 도구를 언제 로드하고 호출할지 결정합니다.

대화를 만들 때 로드할 Skill을 지정할 수도 있습니다:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // 모든 Skill 자동 로드
  // 또는 특정 Skill 지정
  // skills: ["browser-automation", "file-parser"]
});
```

## 자세히 알아보기

- [Skill 관리 API](./agent-skill.md) — 스크립트에서 프로그래밍 방식으로 Skill 관리
- [Skill 개발 가이드](./agent-skill-dev.md) — 자신만의 Skill 만들기
