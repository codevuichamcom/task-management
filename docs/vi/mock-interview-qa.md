# Mock Interview QA cho Tester

Tài liệu này là phần chốt cuối để luyện trước phỏng vấn.

Cách dùng tốt nhất:

- đọc câu hỏi
- tự trả lời miệng trong `30-60 giây`
- so lại với khung trả lời gợi ý

Mục tiêu không phải học thuộc từng chữ.
Mục tiêu là trả lời gọn, có cấu trúc, có ví dụ, và không bị lan man.

---

## 1. Cách luyện tài liệu này

Mỗi câu nên trả lời theo khung:

```text
1. Em hiểu câu hỏi đang hỏi gì
2. Em trả lời ngắn ý chính
3. Em đưa ví dụ thực tế từ project
4. Em chốt bằng cách em verify hoặc làm evidence
```

Ví dụ công thức rất ngắn:

```text
Khái niệm -> cách em test -> ví dụ trong project -> cách em chứng minh
```

---

## 2. Nhóm câu hỏi nền tảng

### Câu 1: Em mạnh nhất phần nào

Interviewer đang dò:

- bạn có biết điểm mạnh thật của mình không
- bạn có nói được bằng ví dụ không

Khung trả lời:

```text
Em mạnh ở API testing và SQL verification.
Khi test em không chỉ nhìn response mà còn kiểm tra dữ liệu trong DB để chắc là hệ thống lưu đúng.
Ví dụ trong project này em có thể login, tạo task, update task rồi query DB để đối chiếu status thực tế.
```

### Câu 2: Em thường bắt đầu test một tính năng mới như thế nào

Interviewer đang dò:

- bạn có tư duy có hệ thống hay không

Khung trả lời:

```text
Em bắt đầu từ việc hiểu chức năng, xác định rule chính, dữ liệu vào ra, risk, rồi chuẩn bị evidence.
Ví dụ với task management, em sẽ đọc API spec, Jira tickets, sau đó xác định happy path, validation, authorization và DB persistence.
```

### Câu 3: Khi ít thời gian, em ưu tiên test gì trước

Khung trả lời:

```text
Em ưu tiên luồng chính, dữ liệu quan trọng, quyền truy cập và những case có impact rộng.
Nếu deadline gấp em không cố phủ hết, em chọn phần rủi ro cao trước.
```

---

## 3. Nhóm API Testing

### Câu 4: Khi test API em kiểm những gì

Khung trả lời:

```text
Em kiểm status code, response body, validation, authorization và dữ liệu lưu trong DB.
Ví dụ với POST /tasks em sẽ kiểm request hợp lệ, request thiếu field, sai enum, user không có quyền và dữ liệu thực tế trong bảng tasks.
```

### Câu 5: Em dùng Postman như thế nào

Khung trả lời:

```text
Em thường dùng collection và environment variables để tái sử dụng token, project_id, task_id.
Sau login em lưu access_token, sau create project em lưu project_id, như vậy em có thể chạy flow liên tục mà không copy tay.
```

Liên quan thực hành:

- [Postman guide](./postman-guide.md)

### Câu 6: Authorization khác Authentication thế nào

Khung trả lời:

```text
Authentication là xác minh bạn là ai.
Authorization là sau khi đã xác minh rồi thì bạn có quyền làm gì.
Ví dụ login là authentication, còn Bob có sửa được project của Alice hay không là authorization.
```

---

## 4. Nhóm SQL

### Câu 7: Em dùng SQL để làm gì trong công việc test

Khung trả lời:

```text
Em dùng SQL để verify dữ liệu sau khi gọi API, kiểm tra integrity, đối soát expected và actual, và làm evidence cho bug report.
Ví dụ update task xong em query lại bảng tasks để xem status thực sự đã đổi chưa.
```

### Câu 8: Khi nào dùng LEFT JOIN

Khung trả lời:

```text
Em dùng LEFT JOIN khi muốn giữ dữ liệu bảng chính kể cả khi bảng liên quan không có record khớp.
Ví dụ muốn lấy danh sách task kể cả task chưa có assignee thì dùng LEFT JOIN từ tasks sang users.
```

### Câu 9: Em sẽ tìm duplicate data thế nào

Khung trả lời:

```text
Em thường dùng GROUP BY kết hợp HAVING COUNT(*) > 1.
Ví dụ tìm task trùng title trong cùng project để xem có lỗi duplicate hay không.
```

Liên quan thực hành:

- [SQL practice compact](./sql-practice-compact.md)
- [SQL practice answers](./sql-practice-answers.md)

---

## 5. Nhóm Batch / Async

### Câu 10: Em test batch như thế nào

Khung trả lời:

```text
Em kiểm số lượng input và output, record thiếu, record trùng, mapping field, trạng thái xử lý và thời điểm verify.
Với batch em luôn đối chiếu cả request đầu vào, response trả về và dữ liệu thực tế trong DB.
```

### Câu 11: Retry và idempotency em hiểu thế nào

Khung trả lời:

```text
Retry là gửi lại khi xử lý lỗi hoặc timeout.
Idempotency là gửi lại cùng một yêu cầu nhưng hệ thống không tạo ra tác dụng phụ lặp lại ngoài mong đợi.
Nếu gửi cùng payload hai lần mà dữ liệu bị tạo trùng thì có thể là bug duplicate hoặc bug idempotency tùy nghiệp vụ.
```

### Câu 12: Với project này em luyện batch thực hành gì

Khung trả lời:

```text
Em dùng POST /tasks/batch để gửi nhiều dòng trong một request, sau đó đối chiếu total, createdCount, failedCount và query DB để xem dữ liệu thực tế có khớp không.
Em có thể luyện cả case all valid, mixed result, duplicate title và retry cùng payload.
```

Liên quan thực hành:

- [Batch practice guide](./batch-practice-guide.md)

---

## 6. Nhóm Bug Report

### Câu 13: Một bug report tốt cần gì

Khung trả lời:

```text
Một bug report tốt cần title rõ, môi trường test, bước tái hiện, expected, actual, evidence và severity.
Mục tiêu là để dev hoặc lead nhìn vào là hiểu ngay lỗi ở đâu và tái hiện được.
```

### Câu 14: Evidence tốt là gì

Khung trả lời:

```text
Evidence tốt nên có request, response, ảnh chụp nếu có UI và query SQL nếu liên quan dữ liệu.
Với bug API hoặc batch thì SQL thường là bằng chứng rất mạnh.
```

---

## 7. Nhóm JMeter / Performance

### Câu 15: P95 là gì

Khung trả lời:

```text
P95 nghĩa là 95 phần trăm request có thời gian phản hồi nhỏ hơn hoặc bằng một giá trị nào đó.
Em ưu tiên nhìn P95 hơn average vì average có thể che mất một nhóm request rất chậm.
```

### Câu 16: Load test khác stress test thế nào

Khung trả lời:

```text
Load test là kiểm tra hệ thống ở mức tải dự kiến.
Stress test là đẩy vượt ngưỡng để tìm giới hạn chịu tải của hệ thống.
```

### Câu 17: Với project này em sẽ dựng JMeter flow nào đầu tiên

Khung trả lời:

```text
Em sẽ bắt đầu từ flow login, extract token, rồi gọi GET /tasks.
Flow này có auth, có dữ liệu thật và dễ đọc P95, error percent, throughput.
```

Liên quan thực hành:

- [JMeter review guide](./jmeter-review-guide.md)
- [JMeter practice guide](./jmeter-practice-guide.md)

---

## 8. 10 phút cuối trước phỏng vấn

Nếu chỉ còn 10 phút, hãy tự nói thành tiếng các ý này:

1. Em test API theo 5 điểm nào.
2. Em dùng SQL để verify gì.
3. Em phân biệt authentication và authorization thế nào.
4. Em test batch theo những góc nào.
5. Em giải thích P95 thế nào.
6. Em viết bug report với những thành phần gì.

Nếu nói trơn được 6 ý này, bạn đã đủ nền để vào phỏng vấn với bộ repo hiện tại.

---

## 9. Kết luận

Tài liệu này là phần luyện trả lời miệng.

Nên dùng sau khi đã xem:

- [Tổng ôn phỏng vấn tester](./tester-interview-summary.md)
- [Postman guide](./postman-guide.md)
- [SQL practice answers](./sql-practice-answers.md)
- [Batch practice guide](./batch-practice-guide.md)
- [JMeter review guide](./jmeter-review-guide.md)
