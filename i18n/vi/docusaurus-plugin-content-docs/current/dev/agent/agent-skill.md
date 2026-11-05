---
title: API quản lý Skills
---

`@grant CAT.agent.skills`

API quản lý Skills cho phép script truy vấn, cài đặt, xóa và gọi các gói tiện ích mở rộng Skill.

Để phát triển và đóng gói Skills, xem [Hướng dẫn phát triển Skills](../agent-skill-dev). Ví dụ Skills chính thức: [scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills).

## list — liệt kê Skills đã cài đặt

```javascript
const skills = await CAT.agent.skills.list();
```

**Trả về `SkillSummary[]`:**

| Trường | Kiểu | Mô tả |
|------|------|------|
| `name` | `string` | Tên Skill |
| `description` | `string` | Mô tả Skill |
| `toolNames` | `string[]` | Tên các công cụ SkillScript chứa trong đó |
| `referenceNames` | `string[]` | Tên các tệp tài liệu tham khảo chứa trong đó |
| `hasConfig` | `boolean` | Có khai báo trường cấu hình không |
| `enabled` | `boolean` | Có được bật không (mặc định `true`) |
| `installtime` | `number` | Thời gian cài đặt |
| `updatetime` | `number` | Thời gian cập nhật gần nhất |

> Lưu ý: `version` và `installUrl` (được sử dụng bởi tính năng kiểm tra cập nhật của trang quản lý) không được trả về thông qua API script này — chúng chỉ được sử dụng nội bộ bởi logic kiểm tra cập nhật và giao diện trang quản lý.

## get — lấy chi tiết Skill

```javascript
const skill = await CAT.agent.skills.get(name);
```

Trả về `SkillRecord` đầy đủ, hoặc `null` nếu không tồn tại.

**Cấu trúc `SkillRecord`:**

Kế thừa tất cả các trường từ `SkillSummary`, cộng thêm:

| Trường | Kiểu | Mô tả |
|------|------|------|
| `prompt` | `string` | Nội dung Markdown của `SKILL.cat.md` (prompt đưa cho AI) |
| `config` | `Record<string, SkillConfigField>` | Định nghĩa trường cấu hình (schema) |

**Cấu trúc `SkillConfigField`:**

| Trường | Kiểu | Mô tả |
|------|------|------|
| `title` | `string` | Tiêu đề hiển thị |
| `type` | `"text" \| "number" \| "select" \| "switch"` | Kiểu trường |
| `secret` | `boolean` | Có nhạy cảm không (ẩn trong giao diện) |
| `required` | `boolean` | Có bắt buộc không |
| `default` | `unknown` | Giá trị mặc định |
| `values` | `string[]` | Danh sách tùy chọn (chỉ kiểu `select`) |

## install — cài đặt Skill

```javascript
const record = await CAT.agent.skills.install(skillMd, scripts?, references?);
```

**Tham số:**

| Tham số | Kiểu | Mô tả |
|------|------|------|
| `skillMd` | `string` | Nội dung tệp `SKILL.cat.md` (bắt buộc) |
| `scripts` | `Array<{ name, code }>` | Danh sách tệp SkillScript |
| `references` | `Array<{ name, content }>` | Danh sách tệp tài liệu tham khảo |

Nếu đã tồn tại Skill với cùng tên, nó sẽ được cập nhật.

```javascript
const record = await CAT.agent.skills.install(
  `---
name: my-search
description: Công cụ tìm kiếm tùy chỉnh
---

Sử dụng công cụ tìm kiếm khi người dùng cần tìm kiếm.`,
  [{ name: "search.js", code: skillScriptCode }],
  [{ name: "api-docs.md", content: "# Tài liệu API\n..." }]
);
```

## remove — gỡ cài đặt Skill

```javascript
const success = await CAT.agent.skills.remove(name);
```

Trả về `true` nếu xóa thành công, `false` nếu Skill không tồn tại.

## call — gọi trực tiếp SkillScript

```javascript
const result = await CAT.agent.skills.call(skillName, scriptName, params?);
```

Thực thi SkillScript trong Skill được chỉ định trực tiếp, không qua cuộc trò chuyện AI.

**Tham số:**

| Tham số | Kiểu | Mô tả |
|------|------|------|
| `skillName` | `string` | Tên Skill (bắt buộc) |
| `scriptName` | `string` | Tên SkillScript (bắt buộc) |
| `params` | `Record<string, unknown>` | Các tham số truyền vào (khớp với các khai báo `@param`) |

```javascript
// Gọi trực tiếp script tìm kiếm trong Skill
const results = await CAT.agent.skills.call(
  "my-search",
  "search",
  { query: "ScriptCat", limit: 5 }
);
```

> Thực thi SkillScript có thời gian chờ (300 giây mặc định, có thể tùy chỉnh bằng `@timeout`).
