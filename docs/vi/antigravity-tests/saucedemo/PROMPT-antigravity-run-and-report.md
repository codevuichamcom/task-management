# Prompt — Antigravity: đọc suite, chạy test, sinh báo cáo tổng hợp

Copy **toàn bộ khối** trong fence `text` bên dưới vào Google Antigravity.  
Điều chỉnh đường dẫn workspace nếu repo của bạn khác vị trí mặc định.

---

```text
Bạn là agent test UI dùng trình duyệt tích hợp (browser-in-the-loop).

NHIỆM VỤ (theo thứ tự, không bỏ bước):

1) ĐỌC TÀI LIỆU trong workspace (mở từng file theo thứ tự):
   - docs/vi/antigravity-tests/saucedemo/README.md
   - docs/vi/antigravity-tests/saucedemo/01-environment.md
   - docs/vi/antigravity-tests/saucedemo/02-definition-of-done.md
   - docs/vi/antigravity-tests/saucedemo/cases/tc-01-login-success.md
   - docs/vi/antigravity-tests/saucedemo/cases/tc-02-wrong-password.md
   - docs/vi/antigravity-tests/saucedemo/cases/tc-03-locked-out.md
   - docs/vi/antigravity-tests/saucedemo/cases/tc-04-sort-inventory.md
   - docs/vi/antigravity-tests/saucedemo/cases/tc-05-cart.md
   - docs/vi/antigravity-tests/saucedemo/90-report-template.md

2) THỰC HIỆN TEST trên https://www.saucedemo.com/ :
   - Chạy TC-01 → TC-05 đúng bước và kỳ vọng trong từng file case.
   - TC-04 và TC-05 cần trạng thái đã login; nếu session mất thì login lại bằng standard_user / secret_sauce (xem 01-environment.md).

3) SINH BÁO CÁO TỔNG HỢP:
   - Dùng docs/vi/antigravity-tests/saucedemo/90-report-template.md làm khung.
   - Điền đầy đủ: Metadata, tóm tắt, bảng kết quả, chi tiết từng TC, artifacts, mục cần xác nhận thủ công, kết luận.
   - Với mỗi TC: Pass / Fail / Cần xác nhận thủ công; Fail phải có bước tái hiện.
   - Chụp screenshot các bước quan trọng nếu công cụ cho phép (login OK, lỗi login, inventory sau sort, cart).

4) ĐẦU RA CUỐI:
   - Xuất một file Markdown hoàn chỉnh (nội dung đã điền, không còn placeholder <!-- --> trống nếu có thông tin).
   - Đặt tên gợi ý: reports/YYYY-MM-DD-saucedemo-antigravity-report.md (tạo thư mục reports nếu chưa có, dưới docs/vi/antigravity-tests/saucedemo/reports/).
   - Nếu không thể ghi file, in toàn bộ báo cáo vào chat để người dùng copy.

RÀNG BUỘC:
- Chỉ dùng tài khoản demo trong 01-environment.md; không dùng secret thật hay PII.
- Nếu không chắc Pass/Fail, ghi "Cần xác nhận thủ công" và giải thích ngắn.
```

---

## Ghi chú cho người dùng

- Nếu Antigravity **không đọc được đường dẫn tương đối**, mở từng file trong IDE rồi nhắc agent: *“Nội dung spec nằm trong các file sau…”* và dán đường dẫn tuyệt đối Windows, ví dụ:  
  `d:\Develop\Testing\task-management\docs\vi\antigravity-tests\saucedemo\README.md`
- Thư mục `reports/` dùng lưu báo cáo đã generate; có thể thêm vào `.gitignore` nếu không muốn commit.
