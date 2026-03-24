# Mock Interview QA cho Tester

Tài liệu này là phần chốt cuối để luyện trước phỏng vấn.

Cách dùng tốt nhất:

- đọc câu hỏi
- tự trả lời miệng trong `30-60 giây`
- so lại với khung trả lời gợi ý

Mục tiêu không phải học thuộc từng chữ.
Mục tiêu là trả lời gọn, có cấu trúc, có ví dụ, và không bị lan man.

---

## I. Cách luyện tài liệu này

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

## II. Nhóm câu hỏi nền tảng

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

Interviewer đang dò:

- bạn có tư duy ưu tiên theo risk hay không
- bạn có biết chọn phần quan trọng thay vì cố test dàn đều

Khung trả lời:

```text
Em ưu tiên luồng chính, dữ liệu quan trọng, quyền truy cập và những case có impact rộng.
Nếu deadline gấp em không cố phủ hết, em chọn phần rủi ro cao trước.
```

---

## III. Nhóm API Testing

### Câu 4: Khi test API em kiểm những gì

Interviewer đang dò:

- bạn có checklist rõ ràng hay không
- bạn có dừng ở response hay biết verify xuống DB

Khung trả lời:

```text
Khi test API em thường kiểm 5 nhóm chính: status code, response body, validation, authorization và DB persistence.
Em sẽ xem request hợp lệ thì trả gì, request thiếu field hoặc sai format thì trả gì, user không có quyền thì có bị chặn đúng không, và sau cùng dữ liệu thực tế trong DB có đúng với response không.
Ví dụ với POST /tasks em sẽ test case hợp lệ, case thiếu title, case sai status, case projectId không tồn tại, rồi query bảng tasks để đối chiếu dữ liệu đã lưu.
```

### Câu 5: Em dùng Postman như thế nào

Interviewer đang dò:

- bạn có thực sự dùng Postman theo flow hay chỉ gửi request lẻ
- bạn có biết dùng biến môi trường, collection, test script hay không

Khung trả lời:

```text
Em thường dùng collection và environment variables để tái sử dụng token, project_id, task_id.
Sau login em lưu access_token, sau create project em lưu project_id, như vậy em có thể chạy flow liên tục mà không copy tay.
```

Liên quan thực hành:

- [Postman guide](./postman-guide.md)

### Câu 6: Authorization khác Authentication thế nào

Interviewer đang dò:

- bạn có phân biệt rõ hai khái niệm rất cơ bản này không
- bạn có đưa được ví dụ thực tế thay vì định nghĩa khô không

Khung trả lời:

```text
Authentication là xác minh bạn là ai.
Authorization là sau khi đã xác minh rồi thì bạn có quyền làm gì.
Ví dụ login là authentication, còn Bob có sửa được project của Alice hay không là authorization.
```

---

## IV. Nhóm SQL

### Câu 7: Em dùng SQL để làm gì trong công việc test

Interviewer đang dò:

- bạn có thực sự dùng SQL trong test hay chỉ biết ở mức lý thuyết
- bạn có hiểu SQL là công cụ verify và làm evidence không

Khung trả lời:

```text
Em dùng SQL để verify dữ liệu sau khi gọi API, kiểm tra integrity, đối soát expected và actual, và làm evidence cho bug report.
Ví dụ update task xong em query lại bảng tasks để xem status thực sự đã đổi chưa.
```

### Câu 8: Khi nào dùng LEFT JOIN

Interviewer đang dò:

- bạn có hiểu bản chất join hay chỉ nhớ cú pháp
- bạn có biết áp vào case tester thực tế không

Khung trả lời:

```text
Em dùng LEFT JOIN khi muốn giữ dữ liệu bảng chính kể cả khi bảng liên quan không có record khớp.
Ví dụ muốn lấy danh sách task kể cả task chưa có assignee thì dùng LEFT JOIN từ tasks sang users.
```

### Câu 9: Em sẽ tìm duplicate data thế nào

Interviewer đang dò:

- bạn có biết cách phát hiện dữ liệu trùng bằng SQL không
- bạn có biến một yêu cầu nghiệp vụ thành query kiểm chứng được không

Khung trả lời:

```text
Em thường dùng GROUP BY kết hợp HAVING COUNT(*) > 1.
Ví dụ tìm task trùng title trong cùng project để xem có lỗi duplicate hay không.
```

Liên quan thực hành:

- [SQL practice compact](./sql-practice-compact.md)
- [SQL practice answers](./sql-practice-answers.md)

---

## V. Nhóm Batch / Async

### Câu 10: Em test batch như thế nào

Interviewer đang dò:

- bạn có hiểu tư duy kiểm thử batch hay không
- bạn có nghĩ đến input, output, timing và reconciliation không

Khung trả lời:

```text
Em kiểm số lượng input và output, record thiếu, record trùng, mapping field, trạng thái xử lý và thời điểm verify.
Với batch em luôn đối chiếu cả request đầu vào, response trả về và dữ liệu thực tế trong DB.
```

### Câu 11: Retry và idempotency em hiểu thế nào

Interviewer đang dò:

- bạn có hiểu lỗi dữ liệu trùng sinh ra từ retry không
- bạn có phân biệt được khái niệm kỹ thuật với impact nghiệp vụ không

Khung trả lời:

```text
Retry là gửi lại khi xử lý lỗi hoặc timeout.
Idempotency là gửi lại cùng một yêu cầu nhưng hệ thống không tạo ra tác dụng phụ lặp lại ngoài mong đợi.
Nếu gửi cùng payload hai lần mà dữ liệu bị tạo trùng thì có thể là bug duplicate hoặc bug idempotency tùy nghiệp vụ.
```

### Câu 12: Với project này em luyện batch thực hành gì

Interviewer đang dò:

- bạn có biết gắn lý thuyết vào project đang làm không
- bạn có đưa ra được bài luyện cụ thể thay vì nói chung chung không

Khung trả lời:

```text
Em dùng POST /tasks/batch để gửi nhiều dòng trong một request, sau đó đối chiếu total, createdCount, failedCount và query DB để xem dữ liệu thực tế có khớp không.
Em có thể luyện cả case all valid, mixed result, duplicate title và retry cùng payload.
```

Liên quan thực hành:

- [Batch practice guide](./batch-practice-guide.md)

---

## VI. Nhóm Bug Report

### Câu 13: Một bug report tốt cần gì

Interviewer đang dò:

- bạn có biết thế nào là một bug report dùng được thật không
- bạn có tư duy hỗ trợ dev tái hiện lỗi hay không

Khung trả lời:

```text
Một bug report tốt cần title rõ, môi trường test, bước tái hiện, expected, actual, evidence và severity.
Mục tiêu là để dev hoặc lead nhìn vào là hiểu ngay lỗi ở đâu và tái hiện được.
```

### Câu 14: Evidence tốt là gì

Interviewer đang dò:

- bạn có biết chứng minh bug bằng dữ liệu hay không
- bạn có hiểu khi nào nên dùng API response, khi nào nên dùng SQL không

Khung trả lời:

```text
Evidence tốt nên có request, response, ảnh chụp nếu có UI và query SQL nếu liên quan dữ liệu.
Với bug API hoặc batch thì SQL thường là bằng chứng rất mạnh.
```

---

## VII. Nhóm JMeter / Performance

### Câu 15: P95 là gì

Interviewer đang dò:

- bạn có hiểu chỉ số performance cơ bản không
- bạn có biết vì sao không nên chỉ nhìn average không

Khung trả lời:

```text
P95 nghĩa là 95 phần trăm request có thời gian phản hồi nhỏ hơn hoặc bằng một giá trị nào đó.
Em ưu tiên nhìn P95 hơn average vì average có thể che mất một nhóm request rất chậm.
```

### Câu 16: Load test khác stress test thế nào

Interviewer đang dò:

- bạn có phân biệt được hai loại test dễ bị nhầm này không
- bạn có hiểu mục tiêu của từng loại test không

Khung trả lời:

```text
Load test là kiểm tra hệ thống ở mức tải dự kiến.
Stress test là đẩy vượt ngưỡng để tìm giới hạn chịu tải của hệ thống.
```

### Câu 17: Với project này em sẽ dựng JMeter flow nào đầu tiên

Interviewer đang dò:

- bạn có biết bắt đầu từ flow nào là hợp lý không
- bạn có ưu tiên được bài test đơn giản nhưng có giá trị không

Khung trả lời:

```text
Em sẽ bắt đầu từ flow login, extract token, rồi gọi GET /tasks.
Flow này có auth, có dữ liệu thật và dễ đọc P95, error percent, throughput.
```

Liên quan thực hành:

- [JMeter review guide](./jmeter-review-guide.md)
- [JMeter practice guide](./jmeter-practice-guide.md)

---

## VIII. 10 phút cuối trước phỏng vấn

Nếu chỉ còn 10 phút, hãy tự nói thành tiếng các ý này:

1. Em test API theo 5 điểm nào.
2. Em dùng SQL để verify gì.
3. Em phân biệt authentication và authorization thế nào.
4. Em test batch theo những góc nào.
5. Em giải thích P95 thế nào.
6. Em viết bug report với những thành phần gì.

Nếu nói trơn được 6 ý này, bạn đã đủ nền để vào phỏng vấn với bộ repo hiện tại.

---

## IX. Kết luận

Tài liệu này là phần luyện trả lời miệng.

Nên dùng sau khi đã xem:

- [Tổng ôn phỏng vấn tester](./tester-interview-summary.md)
- [Postman guide](./postman-guide.md)
- [SQL practice answers](./sql-practice-answers.md)
- [Batch practice guide](./batch-practice-guide.md)
- [JMeter review guide](./jmeter-review-guide.md)
