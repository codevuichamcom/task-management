# Hướng dẫn dùng Google Antigravity để test UI (AI hỗ trợ kiểm thử)

Tài liệu này giúp người làm QA làm quen cách **dùng AI (Google Antigravity) để kiểm tra giao diện web**, không thay thế tư duy tester mà **bổ sung**: nhanh hơn khi khám phá, ghi lại bằng chứng, và lặp lại kịch bản có cấu trúc.

---

## 1. Google Antigravity là gì (góc nhìn tester)

[Google Antigravity](https://antigravity.google/) là nền tảng phát triển phần mềm theo hướng **agent-first**: AI có thể làm việc trên nhiều “mặt” (editor, terminal, **trình duyệt**).

Với người test UI, điểm quan trọng nhất là:

- **Browser-in-the-loop**: agent có thể **điều khiển trình duyệt** để mở trang, click, nhập liệu, chụp màn hình.
- **Artifacts (đầu ra có hình dạng)**: agent có thể tạo **danh sách bước, kế hoạch, walkthrough, ảnh chụp màn hình, bản ghi trình duyệt** — dễ đưa vào bug report hơn là chỉ log kỹ thuật thuần túy.
- **Nhấn mạnh verification**: sản phẩm hướng tới việc agent **không chỉ làm** mà còn **kiểm tra** công việc (phù hợp tư duy QC).

Bạn có thể tải và cài từ trang chính thức: [Download Antigravity](https://antigravity.google/download). Tài liệu chi tiết: [Antigravity docs](https://antigravity.google/docs).

---

## 2. Khi nào nên dùng AI cho test UI

| Phù hợp | Hạn chế |
|--------|---------|
| Khám phá nhanh flow mới (đăng nhập → form → kết quả) | AI có thể **bỏ sót** edge case hoặc hiểu sai nghiệp vụ nếu prompt mơ hồ |
| Lặp lại smoke test sau khi build mới | Không nên coi kết quả AI là **bằng chứng duy nhất** cho release production |
| Ghi lại bước tái hiện + screenshot cho Jira | Cần **người** xác nhận expected theo spec / AC |
| So sánh “trước / sau” khi sửa bug | Môi trường (staging, cookie, locale) có thể làm AI kết luận sai |

**Nguyên tắc:** AI là **trợ lý thực hiện và ghi chép**; người QA vẫn là người **định nghĩa đúng/sai** và **chấp nhận rủi ro**.

---

## 3. Quy trình gợi ý (4 bước)

1. **Chuẩn bị context cho agent**
   - URL đầy đủ (http/https), môi trường (local / staging).
   - Tài khoản test (nếu cần), hoặc ghi rõ “dùng guest”.
   - Tiêu chí pass/fail ngắn (ví dụ: “sau login phải thấy nút X”).

2. **Giao nhiệm vụ rõ ràng**
   - Một phiên = một mục tiêu chính (vd: “flow đăng ký”).
   - Liệt kê bước mong muốn hoặc để agent đề xuất rồi bạn duyệt.

3. **Xem Artifacts**
   - Đọc walkthrough / checklist agent tạo.
   - Xem screenshot hoặc recording nếu có — đối chiếu với spec.

4. **Tự kiểm chứng (human gate)**
   - Lặp lại thủ công 1–2 bước quan trọng.
   - Ghi bug theo format team (repro steps, expected, actual, env).

---

## 4. Mẫu prompt (copy chỉnh sửa)

### 4.1 Smoke test một trang

```text
Bạn là agent test UI. Mở [URL], dùng trình duyệt tích hợp.

Nhiệm vụ:
1. Kiểm tra trang tải được, không lỗi console nghiêm trọng (nếu quan sát được).
2. Thử [hành động chính: ví dụ điền form đăng nhập với user test X].
3. Chụp màn hình bước quan trọng và tóm tắt pass/fail theo tiêu chí sau:
   - Pass: [mô tả]
   - Fail: [mô tả]

Không thay đổi dữ liệu production nếu URL là production.
```

### 4.2 So sánh với spec (AC)

```text
Theo đặc tả sau: [dán 1 đoạn AC hoặc bullet từ Jira].

Hãy thực hiện trên [URL] và cho biết:
- AC nào đạt (kèm bằng chứng: mô tả UI + screenshot nếu có).
- AC nào không đạt (bước tái hiện cụ thể).

Nếu không chắc, ghi rõ “cần xác nhận thủ công” thay vì đoán.
```

### 4.3 Khám phá (exploratory) có hướng

```text
Exploratory test 15 phút trên [URL], tập trung vào [module: ví dụ giỏ hàng].

Báo cáo dạng:
- Điều tốt (3 bullet)
- Nghi ngờ / bug tiềm ẩn (mỗi mục: bước tái hiện)
- Gợ ý test case tiếp theo cho QA người chạy tay
```

---

## 5. Kỹ năng “AI testing” cần rèn (không phụ thuộc tool)

- **Viết prompt rõ ràng:** mục tiêu, phạm vi, dữ liệu test, điều **không** được làm.
- **Đọc artifact như đọc báo cáo:** kiểm tra logic, không tin mù quáng.
- **Phân biệt:** lỗi UI vs lỗi mạng vs lỗi backend (F12 / Network nếu bạn tự mở devtools).
- **Bảo mật:** không dán mật khẩu thật, secret, PII vào chat; dùng account test.

---

## 6. Liên hệ với project task-management (nếu luyện API + UI)

Repo này chủ yếu là **backend API**; UI có thể là Swagger tại `/api-docs` hoặc frontend riêng. Khi test UI thật, hãy ghi rõ URL frontend hoặc “chỉ test Swagger UI” trong prompt để agent không nhầm phạm vi.

Tài liệu liên quan trong repo:

- [Đặc tả API](./api-spec.md) — contract để đối chiếu khi test end-to-end.
- [Mục lục học](./study-index.md) — các bài Postman, JMeter, SQL.

---

## 7. Tài liệu tham khảo chính thức

- Trang sản phẩm: [antigravity.google](https://antigravity.google/)
- Blog giới thiệu: [Introducing Google Antigravity](https://antigravity.google/blog/introducing-google-antigravity) (browser control, verification, artifacts)
- Docs: [antigravity.google/docs](https://antigravity.google/docs)

---

## 8. Checklist nhanh trước khi kết luận “đạt”

- [ ] Đã có URL + môi trường rõ ràng  
- [ ] Đã có tiêu chí pass/fail (từ spec hoặc AC)  
- [ ] Đã xem lại screenshot / bước do agent ghi  
- [ ] Đã tự thử lại ít nhất một luồng quan trọng  
- [ ] Bug (nếu có) đủ để dev tái hiện  

Chúc bạn tập dùng AI như một **cộng sự kiểm thử**, không thay thế sự cẩn trọng của người làm QA.
