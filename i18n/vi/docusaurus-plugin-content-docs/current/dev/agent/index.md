---
title: Agent
---

:::caution Giai đoạn thử nghiệm
Tính năng Agent hiện vẫn đang trong giai đoạn thử nghiệm; các API và hành vi sau có thể thay đổi trước khi phát hành chính thức.
:::

## Tổng quan

ScriptCat v1.4 giới thiệu hệ thống Agent, cung cấp cho script người dùng một tập hợp các khả năng bao gồm trò chuyện AI, tự động hóa trình duyệt, quản lý file và tác vụ theo lịch trình.

Script gọi các khả năng này thông qua namespace `CAT.agent.*`, và mỗi API yêu cầu quyền tương ứng được khai báo bằng `@grant`.

## Các mô-đun tính năng

| Mô-đun | Quyền | Mô tả |
|------|---------|------|
| [Trò chuyện](./agent-conversation) | `@grant CAT.agent.conversation` | Tạo trò chuyện AI, gửi tin nhắn, phát trực tuyến phản hồi, định nghĩa công cụ tùy chỉnh |
| [Thao tác DOM](./agent-dom) | `@grant CAT.agent.dom` | Điều hướng trang, chụp ảnh màn hình, nhấp, điền, cuộn, giám sát DOM |
| [Skill](./agent-skill) | `@grant CAT.agent.skills` | Cài đặt/gỡ bỏ/gọi các gói Skill |
| [Tác vụ theo lịch trình](./agent-task) | `@grant CAT.agent.task` | Tác vụ Cron theo lịch trình, lắng nghe sự kiện |
| [Mô hình](./agent-model) | `@grant CAT.agent.model` | Truy vấn thông tin mô hình đã cấu hình (chỉ đọc) |
| [File OPFS](./agent-opfs) | `@grant CAT.agent.opfs` | Đọc/ghi file không gian làm việc của Agent |
| [MCP](./agent-mcp) | — | Cấu hình kết nối server MCP (chỉ trang quản lý, không có API script) |
| [Phát triển Skill](./agent-skill-dev) | — | Hướng dẫn phát triển SKILL.cat.md + SkillScript |

## Bắt đầu nhanh

Script Agent đơn giản nhất:

```javascript
// ==UserScript==
// @name        Hello Agent
// @match       *://*/*
// @grant       CAT.agent.conversation
// ==/UserScript==

const conv = await CAT.agent.conversation.create();
const reply = await conv.chat("Xin chào, vui lòng giới thiệu bản thân");
console.log(reply.content);
```

## Tổng quan kiến trúc

Hệ thống Agent trải rộng trên nhiều ngữ cảnh bị cô lập trong tiện ích mở rộng trình duyệt:

```
Script người dùng → Sandbox (thực thi bị cô lập)
              ↓ WindowMessage
           Offscreen (truy cập DOM)
              ↓ ExtensionMessage
           Service Worker (lịch trình cốt lõi)
              ├── Nhà cung cấp LLM (OpenAI / Anthropic)
              ├── ToolRegistry (đăng ký và thực thi công cụ)
              ├── SkillScriptExecutor (thực thi script Skill)
              ├── MCPClient (client giao thức MCP)
              └── TaskScheduler (lịch trình tác vụ)
```

### Cấu trúc lưu trữ

Agent lưu dữ liệu bằng OPFS (Origin Private File System) của trình duyệt:

```
agents/
├── conversations/       # lịch sử trò chuyện
├── attachments/         # tệp đính kèm (hình ảnh, file)
├── skills/{name}/       # file gói Skill
│   ├── SKILL.cat.md
│   ├── scripts/
│   └── references/
├── tasks/               # cấu hình và bản ghi thực thi tác vụ theo lịch trình
└── workspace/           # file không gian làm việc của người dùng (thư mục mà các công cụ opfs_* thao tác)
```

### Mô hình được hỗ trợ

| Nhà cung cấp | Định dạng | Tính năng |
|----------|------|------|
| Tương thích OpenAI | API OpenAI Chat Completions | Hỗ trợ GPT-4o, DeepSeek và các mô hình tương thích khác |
| Anthropic | API Anthropic Messages | Hỗ trợ họ Claude, Prompt Caching |
| 智譜 | API 智譜 | Hỗ trợ họ mô hình GLM |

Thêm nhà cung cấp và Khóa API trong "Cấu hình mô hình" trên bảng điều khiển để sử dụng.

## Hệ sinh thái Skill

Skill là gói kết hợp prompt + script công cụ + tài liệu tham khảo, cho phép bạn inject kiến thức chuyên ngành và công cụ tùy chỉnh vào Agent.

**Kho Skill chính thức: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)**

Bao gồm Skill sẵn sàng sử dụng cho tự động hóa trình duyệt, tác vụ theo lịch trình, công cụ tạo Skill, ví dụ về trò chuyện/DOM/cấu hình và nhiều hơn nữa.

**Phương thức cài đặt:**

- **Cài đặt qua URL** — mở trực tiếp URL `SKILL.cat.md` trong trình duyệt; ScriptCat tự động chặn nó và hiển thị trang cài đặt. Bạn cũng có thể dán URL dưới Agent → Quản lý Skill trong bảng điều khiển.
- **Cài đặt qua script** — cài đặt qua chương trình bằng API `CAT.agent.skills.install()`

**Kiểm tra cập nhật:**

Skill cài đặt qua URL ghi lại nguồn cài đặt; bảng điều khiển cho phép bạn kiểm tra cập nhật và nâng cấp bằng một cú nhấp (dựa trên so sánh semver của trường `version`).

Xem [API quản lý Skill](./agent-skill) và [Hướng dẫn phát triển Skill](./agent-skill-dev) để biết chi tiết.
