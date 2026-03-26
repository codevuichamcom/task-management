# Suite test UI — Sauce Demo (multi-file cho Antigravity)

**Trang mục tiêu:** [Sauce Demo](https://www.saucedemo.com/)

**Cách dùng:** Đọc các file **theo thứ tự bên dưới**, sau đó mở [`PROMPT-antigravity-run-and-report.md`](./PROMPT-antigravity-run-and-report.md) — copy toàn bộ prompt vào Google Antigravity.

## Thứ tự đọc tài liệu (bắt buộc)

| Thứ tự | File | Nội dung |
|--------|------|----------|
| 1 | [01-environment.md](./01-environment.md) | URL, tài khoản test, lưu ý bảo mật |
| 2 | [02-definition-of-done.md](./02-definition-of-done.md) | Tiêu chí Pass/Fail chung |
| 3 | [cases/tc-01-login-success.md](./cases/tc-01-login-success.md) | TC-01 |
| 4 | [cases/tc-02-wrong-password.md](./cases/tc-02-wrong-password.md) | TC-02 |
| 5 | [cases/tc-03-locked-out.md](./cases/tc-03-locked-out.md) | TC-03 |
| 6 | [cases/tc-04-sort-inventory.md](./cases/tc-04-sort-inventory.md) | TC-04 |
| 7 | [cases/tc-05-cart.md](./cases/tc-05-cart.md) | TC-05 |
| 8 | [90-report-template.md](./90-report-template.md) | Khung báo cáo — agent **điền kết quả** vào đây |

## Sau khi chạy

- Báo cáo tổng hợp do Antigravity tạo theo `90-report-template.md` — lưu thành file mới (ví dụ `reports/YYYY-MM-DD-saucedemo-report.md`) hoặc dán vào ticket.
- Checklist human gate: [99-human-checklist.md](./99-human-checklist.md)

## Tham khảo

- [antigravity-ui-testing-guide.md](../../antigravity-ui-testing-guide.md)
