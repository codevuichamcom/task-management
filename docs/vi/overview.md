# Tổng quan hệ thống Task Management

Đây là một backend nhỏ để luyện các kỹ năng tester thường gặp:

- đọc tài liệu API
- gửi request bằng Swagger, Postman hoặc curl
- kiểm tra phân quyền
- đối chiếu dữ liệu trong PostgreSQL
- so sánh response API với dữ liệu thực trong database

## Phạm vi

Hệ thống gồm 3 module chính:

- Xác thực
- Quản lý dự án
- Quản lý task

## Cách sử dụng gợi ý

1. Đọc `./api-spec.md` để nắm public contract.
2. Đọc `./jira-tickets.md` để hiểu ngữ cảnh yêu cầu.
3. Thử API qua Swagger UI hoặc Postman.
4. Dùng SQL để verify dữ liệu đã lưu.

## Tài liệu tham khảo

- Đặc tả API: `./api-spec.md`
- Jira-style requirements: `./jira-tickets.md`
- Swagger UI: `http://localhost:3000/api-docs`
