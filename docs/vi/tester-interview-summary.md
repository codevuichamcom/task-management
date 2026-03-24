# Tóm tắt kiến thức phỏng vấn Tester theo JD Extreme VN

Tài liệu này là bản tổng hợp ngắn gọn, có hệ thống, dễ ôn nhanh trước phỏng vấn.

Mục tiêu:

- hiểu nhà tuyển dụng đang cần gì
- biết nên ôn phần nào trước
- nắm được các khái niệm cốt lõi theo cách đơn giản
- có khung tư duy để trả lời phỏng vấn rõ ràng, không lan man

## I. JD này đang tìm người như thế nào

Đây không phải JD cho tester chỉ test UI.

Nhà tuyển dụng đang tìm người có thể:

- viết test case tốt
- test `API`
- verify dữ liệu bằng `SQL`
- hiểu `batch`, `async`
- biết nhìn `risk`
- báo cáo bug và evidence rõ ràng
- nếu senior hơn thì có tư duy review, report, quản lý chất lượng

Hiểu ngắn gọn:

`Họ cần một tester thiên về hệ thống, dữ liệu và logic nghiệp vụ, không phải click tester.`

## II. Bản đồ kiến thức cần ôn

Hãy nhớ theo 6 trụ cột:

1. `Test Design`
2. `API Testing`
3. `SQL / Data Verification`
4. `Batch / Async`
5. `Bug Report / Test Evidence`
6. `Performance + tư duy senior`

Nếu ít thời gian, ưu tiên học theo thứ tự:

1. `SQL`
2. `API Testing`
3. `Decision Table / Test Design`
4. `Batch / Async`
5. `Bug report / Evidence`
6. `Performance`

## III. Trụ cột 1: Test Design

### A. Test Design là gì

Là cách suy nghĩ để tạo test case có hệ thống, không test theo cảm giác.

Mục tiêu:

- không bỏ sót case quan trọng
- không chỉ test happy path
- tập trung vào chỗ dễ lỗi và có risk cao

### B. 4 kỹ thuật nên nhớ

#### 1. Equivalence Partitioning

Chia dữ liệu thành các nhóm tương đương.

Ví dụ:

- tuổi hợp lệ: `18-60`
- tuổi không hợp lệ: `<18`, `>60`, `null`, chữ

Ý tưởng:

- mỗi nhóm chỉ cần chọn vài đại diện
- không cần test mọi giá trị

#### 2. Boundary Value Analysis

Lỗi hay xuất hiện ở biên.

Ví dụ:

- min tuổi = `18`
- nên test: `17`, `18`, `19`

Nhớ nhanh:

`đừng chỉ test ở giữa, hãy test ở mép`

#### 3. Decision Table Test

Dùng khi hệ thống có nhiều điều kiện kết hợp.

Ví dụ:

- user có token hay không
- role là `ADMIN` hay `USER`
- project có thuộc owner hay không

Mỗi tổ hợp điều kiện có thể cho ra hành vi khác nhau.

Rất hợp với:

- fraud rule
- approval rule
- permission rule
- business rule nhiều nhánh

#### 4. State Transition

Dùng khi đối tượng có trạng thái.

Ví dụ task:

- `TODO`
- `IN_PROGRESS`
- `DONE`

Cần kiểm tra:

- trạng thái ban đầu là gì
- chuyển trạng thái có đúng không
- có case nào bị chuyển sai không

### C. Tư duy quan trọng

Đừng chỉ hỏi:

- `case đúng là gì`

Hãy hỏi thêm:

- `case sai là gì`
- `case thiếu dữ liệu thì sao`
- `case sai format thì sao`
- `case quyền không đúng thì sao`
- `case dữ liệu lưu xuống DB có đúng không`

## IV. Trụ cột 2: API Testing

### A. API là gì

API là nơi frontend hoặc hệ thống khác gọi vào để lấy hoặc cập nhật dữ liệu.

Tester cần hiểu:

- endpoint
- method
- request
- response
- status code
- auth token

### B. 5 thứ phải kiểm khi test API

#### 1. Status code

Ví dụ:

- `200`: thành công
- `201`: tạo mới thành công
- `400`: request sai
- `401`: chưa đăng nhập / token sai
- `403`: không có quyền
- `404`: không tìm thấy
- `500`: lỗi server

#### 2. Response body

Phải kiểm:

- có đủ field không
- tên field có đúng không
- type có đúng không
- value có đúng business không

#### 3. Validation

Ví dụ cần test:

- thiếu field
- field rỗng
- sai type
- sai enum
- format email sai

#### 4. Authorization

Ví dụ:

- Bob có sửa được project của Alice không
- user A có xem được task của user B không

#### 5. DB persistence

Sau khi gọi API, dữ liệu trong DB có đúng như response không.

Đây là chỗ `API + SQL` đi cùng nhau.

### C. Cách nhớ nhanh khi test API

Hãy tự hỏi 5 câu:

1. Gọi vào bằng gì
2. Dữ liệu gửi lên là gì
3. API trả về gì
4. Có đúng quyền không
5. DB có lưu đúng không

Tài liệu thực hành liên quan:

- [Postman guide](./postman-guide.md)
- `postman/task-management.postman_collection.json`
- `postman/task-management.local.postman_environment.json`

## V. Trụ cột 3: SQL / Data Verification

### A. Vì sao SQL quan trọng

Vì tester senior không chỉ nhìn UI hay response.

Tester cần biết:

- dữ liệu thực tế nằm ở đâu
- record nào được tạo
- record nào sai
- có thiếu, trùng, mồ côi hay không

### B. Những keyword phải quen

- `SELECT`
- `WHERE`
- `ORDER BY`
- `COUNT`
- `GROUP BY`
- `HAVING`
- `JOIN`
- `LEFT JOIN`
- `IS NULL`
- `CTE`

### C. 4 bài toán SQL hay gặp nhất

#### 1. Verify dữ liệu sau API

Ví dụ:

- gọi API update task
- query DB xem status thật là gì

#### 2. Kiểm tra integrity

Ví dụ:

- task có `projectId` không tồn tại
- task có `assigneeId` không tồn tại

Đây là `orphan data`

#### 3. Kiểm tra duplicate hoặc missing

Ví dụ:

- trùng title trong cùng project
- thiếu record sau khi import batch

#### 4. Làm report hoặc đối soát

Ví dụ:

- đếm task theo status
- đếm task theo owner
- so sánh expected và actual

### D. Cách nhớ tư duy SQL

SQL không chỉ để “lấy dữ liệu”.

SQL dùng để trả lời:

- có đúng không
- sai ở đâu
- sai record nào
- bằng chứng là gì

Tài liệu thực hành liên quan:

- [SQL practice compact](./sql-practice-compact.md)
- [SQL practice answers](./sql-practice-answers.md)

## VI. Trụ cột 4: Batch / Async

### A. Batch là gì

Batch là xử lý dữ liệu theo lô, theo đợt.

Ví dụ:

- import 1000 records
- chạy cuối ngày
- đồng bộ dữ liệu giữa 2 hệ thống

### B. Async là gì

Async là xử lý không trả kết quả hoàn tất ngay.

Ví dụ:

- gọi API tạo job
- API trả `accepted`
- hệ thống xử lý phía sau
- một lúc sau DB mới cập nhật

### C. Tester cần quan tâm gì

#### 1. Missing record

Đáng ra có 100 record, thực tế chỉ lưu 98.

#### 2. Duplicate record

Một record bị xử lý 2 lần.

#### 3. Wrong mapping

Dữ liệu vào đúng nhưng dữ liệu ra map sai field.

#### 4. Timing issue

Kiểm tra quá sớm thì chưa có dữ liệu.
Kiểm tra quá muộn có thể bị process khác ghi đè.

#### 5. Retry / idempotency

Gọi lại nhiều lần có bị nhân đôi dữ liệu không.

### D. Cách nhớ nhanh

Khi test batch hoặc async, luôn nghĩ:

- vào bao nhiêu
- ra bao nhiêu
- thiếu không
- trùng không
- đúng trạng thái không
- đúng thời điểm kiểm tra chưa

Tài liệu thực hành liên quan:

- [Batch practice guide](./batch-practice-guide.md)
- [Postman guide](./postman-guide.md)
- [SQL practice answers](./sql-practice-answers.md)

## VII. Trụ cột 5: Bug Report và Test Evidence

### A. Bug report tốt cần gì

Một bug report tốt phải giúp dev hoặc lead hiểu ngay:

- lỗi ở đâu
- làm sao để tái hiện
- expected là gì
- actual là gì
- mức độ nghiêm trọng ra sao

### B. Khung bug report đơn giản

- `Title`
- `Environment`
- `Steps to reproduce`
- `Expected result`
- `Actual result`
- `Evidence`
- `Severity`

### C. Evidence tốt là gì

Nên có kết hợp:

- request API
- response API
- ảnh chụp giao diện nếu có
- output SQL nếu liên quan dữ liệu

### D. Ví dụ ngắn

Expected:

- update task sang `IN_PROGRESS` thì DB phải lưu `IN_PROGRESS`

Actual:

- API gọi update thành công
- DB vẫn là `TODO`

Evidence:

- request body
- response body
- query SQL theo `task id`

## VIII. Trụ cột 6: Performance và tư duy senior

### A. Performance testing mức cơ bản

Không cần quá sâu, nhưng nên hiểu:

- `Load test`: kiểm tra tải bình thường
- `Stress test`: đẩy quá tải để xem hệ thống chịu tới đâu
- `P95`: 95% request có thời gian phản hồi nhỏ hơn hoặc bằng một giá trị nào đó

Tài liệu mở rộng:

- [Bộ tổng ôn JMeter](./jmeter-review-guide.md)
- [Hướng dẫn thực hành JMeter](./jmeter-practice-guide.md)

Ví dụ:

`P95 <= 800ms` nghĩa là đa số request phải phản hồi trong 800ms hoặc nhanh hơn.

### B. Tư duy senior tester

Senior tester khác ở chỗ:

- không test máy móc
- biết chọn cái gì test trước theo risk
- biết nhìn impact
- biết dùng evidence để nói chuyện với dev/PM
- biết phân biệt bug spec, bug logic, bug data, bug auth

### C. Khi deadline gấp, test theo gì

Ưu tiên:

1. luồng chính
2. dữ liệu quan trọng
3. quyền truy cập
4. rule nghiệp vụ
5. case dễ gây ảnh hưởng rộng

## IX. Phần nghiệp vụ tài chính cần nắm mức cơ bản

JD nhắc đến tài chính, nhưng trong phỏng vấn tester thường chỉ cần hiểu ở mức nền.

Nên nhớ:

- `doanh thu`: tiền kiếm được
- `chi phí`: tiền bỏ ra
- `lợi nhuận`: doanh thu trừ chi phí
- `đối soát`: so sánh dữ liệu giữa các nguồn để đảm bảo khớp nhau

Vì sao tester tài chính phải kỹ:

- sai 1 con số có thể ảnh hưởng báo cáo
- sai quyền truy cập có thể lộ dữ liệu nhạy cảm
- sai timing hoặc duplicate có thể gây lệch giao dịch

## X. Khung tư duy 5 bước khi gặp một tính năng mới

Khi được đưa một chức năng để test, hãy đi theo 5 bước:

### A. Hiểu chức năng làm gì

Ví dụ:

- tạo task
- update status
- list task có filter

### B. Xác định rule chính

Ví dụ:

- status chỉ nhận `TODO`, `IN_PROGRESS`, `DONE`
- user chỉ được sửa dữ liệu của mình

### C. Xác định dữ liệu vào và dữ liệu ra

Ví dụ:

- request body
- response body
- record trong DB

### D. Liệt kê risk

Ví dụ:

- sai quyền
- sai validation
- sai status
- sai dữ liệu DB
- duplicate hoặc missing

### E. Chuẩn bị evidence

Ví dụ:

- request
- response
- SQL query

## XI. Mẫu trả lời ngắn trong phỏng vấn

### A. Nếu bị hỏi: Em mạnh nhất phần nào

`Em mạnh ở API testing và SQL verification. Em thường không chỉ dừng ở response mà còn kiểm tra dữ liệu trong DB để chắc rằng hệ thống lưu đúng và không có lỗi integrity như missing, duplicate hoặc orphan data.`

### B. Nếu bị hỏi: Em thiết kế test case như thế nào

`Em bắt đầu từ business rule, sau đó xác định happy path, abnormal case, boundary và các trường hợp quyền truy cập. Nếu rule có nhiều điều kiện kết hợp thì em ưu tiên dùng Decision Table để tránh sót case.`

### C. Nếu bị hỏi: Em dùng SQL để làm gì

`Em dùng SQL để verify dữ liệu sau khi gọi API, đối soát expected và actual, kiểm tra integrity và tạo evidence rõ ràng cho bug report.`

### D. Nếu bị hỏi: Khi nào dùng LEFT JOIN

`Em dùng LEFT JOIN khi muốn giữ toàn bộ dữ liệu bảng chính kể cả khi bảng liên quan không có record khớp, ví dụ task chưa có assignee hoặc project chưa có task.`

### E. Nếu bị hỏi: Em test batch thế nào

`Em sẽ kiểm tra số lượng input và output, record thiếu, record trùng, mapping field, trạng thái xử lý và thời điểm verify vì batch hoặc async có thể chưa cập nhật DB ngay.`

## XII. Checklist ôn nhanh trước phỏng vấn

Trước buổi phỏng vấn, chỉ cần chắc những ý này:

- hiểu 4 kỹ thuật test design cơ bản
- hiểu cách test API: validation, auth, response, DB verification
- viết được SQL cơ bản và join nhiều bảng
- hiểu `batch`, `async`, `retry`, `duplicate`, `missing`
- biết viết bug report và chuẩn bị evidence
- nói được tư duy risk-based testing

## XIII. Cách học tài liệu này cho dễ nhớ

Đừng cố học thuộc từng dòng.

Hãy nhớ theo công thức:

`Rule -> Test case -> API -> DB -> Evidence`

Hoặc ngắn hơn:

`Yêu cầu gì -> test gì -> dữ liệu ra sao -> chứng minh bằng gì`

Nếu trả lời được theo khung này, phần lớn câu hỏi phỏng vấn sẽ không bị rối.
