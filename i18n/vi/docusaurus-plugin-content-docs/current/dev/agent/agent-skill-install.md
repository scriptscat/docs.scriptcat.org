---
title: Cài đặt và sử dụng Skills
---

Skill là một gói tiện ích mở rộng cho Agent, giúp inject kiến thức chuyên môn và các công cụ tùy chỉnh vào AI. Trang này hướng dẫn cách cài đặt, cấu hình và quản lý Skills.

:::tip Kho Skills chính thức
**[scriptscat/scriptcat-skills](https://github.com/scriptscat/scriptcat-skills)** — Các Skills sẵn sàng sử dụng cho tự động hóa trình duyệt, tác vụ theo lịch trình, phân tích tệp, hỗ trợ phát triển script và nhiều hơn nữa.
:::

## Phương thức cài đặt

### Phương thức 1: cài đặt từ URL

Mở trực tiếp URL `SKILL.cat.md` trong thanh địa chỉ của trình duyệt; ScriptCat sẽ chặn lại và hiển thị trang xác nhận cài đặt.

Ví dụ, để cài đặt Skill tự động hóa trình duyệt chính thức:

```
https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md
```

Bạn cũng có thể thực hiện từ trang quản lý:

1. Mở trang quản lý ScriptCat → **Agent → Skills**
2. Nhấp nút **URL** ở góc trên bên phải
3. Dán URL `SKILL.cat.md`
4. Nhấp Cài đặt

ScriptCat tự động tải `SKILL.cat.md` cùng với các script và tệp tài liệu tham khảo mà nó khai báo.

### Phương thức 2: cài đặt ZIP

1. Mở trang quản lý ScriptCat → **Agent → Skills**
2. Nhấp nút **+** ở góc trên bên phải
3. Chọn gói Skill định dạng `.zip`

Cấu trúc thư mục của ZIP phải tuân theo định dạng Skill chuẩn (phải chứa `SKILL.cat.md`).

## Danh sách Skills chính thức

Nhấp chuột phải **Sao chép liên kết**, sau đó dán liên kết vào trường URL quản lý Skills để cài đặt.

| Skill | Mô tả | Cài đặt |
|-------|------|------|
| [browser-automation](https://github.com/scriptscat/scriptcat-skills/tree/main/browser-automation) | Phân tích trang, thao tác DOM, điền biểu mẫu, chụp ảnh màn hình, điều hướng | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/browser-automation/SKILL.cat.md) |
| [scheduled-tasks](https://github.com/scriptscat/scriptcat-skills/tree/main/scheduled-tasks) | Tác vụ Cron theo lịch trình (tự động chạy bởi LLM/callback script) | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scheduled-tasks/SKILL.cat.md) |
| [skill-creator](https://github.com/scriptscat/scriptcat-skills/tree/main/skill-creator) | Hỗ trợ tạo, kiểm tra và đóng gói Skills mới | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/skill-creator/SKILL.cat.md) |
| [file-parser](https://github.com/scriptscat/scriptcat-skills/tree/main/file-parser) | Phân tích tệp Excel, PDF, Word, CSV và PPT | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/file-parser/SKILL.cat.md) |
| [scriptcat-dev](https://github.com/scriptscat/scriptcat-skills/tree/main/scriptcat-dev) | Trợ lý phát triển script ScriptCat/Tampermonkey | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/scriptcat-dev/SKILL.cat.md) |
| [synology-office-sheet](https://github.com/scriptscat/scriptcat-skills/tree/main/synology-office-sheet) | Đọc/ghi bảng tính Synology Office | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/synology-office-sheet/SKILL.cat.md) |
| [wechat-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/wechat-publisher) | Trợ lý vận hành tài khoản chính thức WeChat | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/wechat-publisher/SKILL.cat.md) |
| [xiaohongshu-publisher](https://github.com/scriptscat/scriptcat-skills/tree/main/xiaohongshu-publisher) | Trợ lý vận hành Xiaohongshu (RED) | [Cài đặt](https://raw.githubusercontent.com/scriptscat/scriptcat-skills/main/xiaohongshu-publisher/SKILL.cat.md) |

## Cấu hình Skill

Một số Skills yêu cầu cấu hình (như khóa API):

1. Tìm Skill đã cài đặt trên trang **Agent → Skills**
2. Nhấp biểu tượng **Cài đặt** (bánh răng)
3. Điền các trường cấu hình và lưu

Các trường được đánh dấu `secret` trong cấu hình sẽ được ẩn trong giao diện.

## Bật / tắt

Trên trang quản lý Skills, sử dụng công tắc trên thẻ Skill để kiểm soát xem nó có được bật không. Các Skill bị tắt sẽ không được tải trong cuộc trò chuyện.

## Kiểm tra cập nhật

Skills cài đặt qua URL hỗ trợ kiểm tra phiên bản:

1. Nhấp nút **Kiểm tra cập nhật** ở góc trên bên phải trang Skills
2. Các thẻ Skill có phiên bản mới sẽ hiển thị nút **Cập nhật**
3. Nhấp để nâng cấp bằng một cú nhấp

Các bản cập nhật được so sánh bằng trường `version` (định dạng semver) được khai báo trong `SKILL.cat.md`.

## Sử dụng Skills trong cuộc trò chuyện

Các Skill đã cài đặt tự động khả dụng trong các cuộc trò chuyện Agent. AI quyết định khi nào tải và gọi các công cụ của Skill dựa trên nội dung cuộc trò chuyện.

Bạn cũng có thể chỉ định Skill nào cần tải khi tạo cuộc trò chuyện:

```javascript
const conv = await CAT.agent.conversation.create({
  skills: "auto"              // Tự động tải tất cả Skills
  // hoặc chỉ định các Skill cụ thể
  // skills: ["browser-automation", "file-parser"]
});
```

## Tìm hiểu thêm

- [API quản lý Skills](./agent-skill.md) — quản lý Skills theo chương trình từ script
- [Hướng dẫn phát triển Skills](./agent-skill-dev.md) — tạo Skill của riêng bạn
