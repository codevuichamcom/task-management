# Mục lục tài liệu học và tra cứu

Trang này là điểm vào nhanh cho toàn bộ tài liệu tiếng Việt trong project `task-management`.

Bạn có thể dùng theo 2 cách:

- ôn theo lộ trình từ tổng quan đến thực hành
- mở nhanh đúng tài liệu đang cần để tra cứu

---

## 0. Tài nguyên thực hành nhanh

Nếu cần vào thẳng công cụ hoặc file để luyện thực hành, dùng các mục này:

- `postman/task-management.postman_collection.json`: collection Postman chính
- `postman/task-management.local.postman_environment.json`: environment local cho Postman
- `jmeter/task-management-login-tasks.jmx`: test plan JMeter mẫu
- `jmeter/users.csv`: dữ liệu account cho JMeter
- `POST /tasks/batch`: endpoint luyện batch reconciliation

---

## 1. Bắt đầu nhanh

Nếu mới vào project, nên đi theo thứ tự này:

1. [Tổng quan hệ thống](./overview.md)
2. [Đặc tả API](./api-spec.md)
3. [Jira tickets](./jira-tickets.md)
4. [Tổng ôn phỏng vấn tester](./tester-interview-summary.md)
5. [Postman guide](./postman-guide.md)
6. [Batch practice guide](./batch-practice-guide.md)
7. [SQL practice compact](./sql-practice-compact.md)
8. [SQL practice answers](./sql-practice-answers.md)
9. [JMeter review guide](./jmeter-review-guide.md)
10. [JMeter practice guide](./jmeter-practice-guide.md)

---

## 2. Nhóm tài liệu theo mục đích sử dụng

## Tổng quan dự án

### [Tổng quan hệ thống](./overview.md)

Dùng khi cần nắm nhanh project này là gì, gồm module nào, và nên bắt đầu test từ đâu.

### [Đặc tả API](./api-spec.md)

Dùng khi cần xem endpoint, request body, response mẫu, mã lỗi, auth và contract mong đợi.

### [Jira tickets](./jira-tickets.md)

Dùng khi cần hiểu ngữ cảnh nghiệp vụ, yêu cầu tính năng và cách đối chiếu expected behavior.

---

## Ôn phỏng vấn tester

### [Tổng ôn phỏng vấn tester](./tester-interview-summary.md)

Dùng khi cần ôn nhanh các trụ cột chính như API testing, SQL, bug reporting, performance, tư duy senior và cách trả lời phỏng vấn.

---

## Ôn SQL

### [SQL practice compact](./sql-practice-compact.md)

Phiên bản đề bài ngắn gọn để tự luyện trước, phù hợp khi muốn ôn nhanh hoặc tự làm lại từ đầu.

### [SQL practice answers](./sql-practice-answers.md)

Phiên bản có giải thích chi tiết, phù hợp khi cần hiểu cách viết query, cách verify dữ liệu và cách suy nghĩ kiểu tester.

---

## Ôn Postman

### [Postman guide](./postman-guide.md)

Dùng khi cần biết cách test API bằng Postman trên chính project này, đặc biệt hữu ích nếu muốn luyện flow request thủ công trước khi sang automation hoặc performance.

### File Postman trong repo

- `postman/task-management.postman_collection.json`: collection chính
- `postman/task-management.local.postman_environment.json`: environment local

---

## Ôn JMeter

### [JMeter review guide](./jmeter-review-guide.md)

Tài liệu lý thuyết dễ hiểu về `load test`, `stress test`, `P95`, `Thread Group`, `Sampler`, `JSON Extractor`, `Assertion` và cách đọc report.

### [JMeter practice guide](./jmeter-practice-guide.md)

Tài liệu thực hành đi cùng file mẫu trong repo, dùng khi cần mở `JMeter` lên và chạy flow `login -> GET /tasks` ngay.

### File thực hành JMeter trong repo

- `jmeter/task-management-login-tasks.jmx`: test plan mẫu
- `jmeter/users.csv`: dữ liệu account để chạy nhiều user

---

## Ôn Batch / Async

### [Batch practice guide](./batch-practice-guide.md)

Dùng khi cần luyện tư duy kiểm thử `batch` bằng dữ liệu thật trong repo: gửi nhiều record trong một request, đối chiếu `input`, `response` và `DB`.

### Tài nguyên batch trong repo

- endpoint thực hành: `POST /tasks/batch`
- có sẵn request trong Postman collection:
  - `03 Tasks / Create Tasks - Batch All Valid`
  - `03 Tasks / Create Tasks - Batch Mixed Result`

---

## 3. Chọn tài liệu theo nhu cầu

Nếu bạn đang cần:

- hiểu hệ thống thật nhanh: xem [Tổng quan hệ thống](./overview.md)
- test API đúng spec: xem [Đặc tả API](./api-spec.md)
- hiểu yêu cầu nghiệp vụ: xem [Jira tickets](./jira-tickets.md)
- ôn phỏng vấn tổng quát: xem [Tổng ôn phỏng vấn tester](./tester-interview-summary.md)
- luyện SQL từ ngắn đến sâu: xem [SQL practice compact](./sql-practice-compact.md) rồi sang [SQL practice answers](./sql-practice-answers.md)
- luyện Postman: xem [Postman guide](./postman-guide.md), rồi import `postman/task-management.postman_collection.json`
- luyện batch: xem [Batch practice guide](./batch-practice-guide.md)
- ôn JMeter lý thuyết: xem [JMeter review guide](./jmeter-review-guide.md)
- chạy JMeter thực chiến: xem [JMeter practice guide](./jmeter-practice-guide.md)

---

## 4. Lộ trình ôn gợi ý

## Lộ trình 30 phút

Phù hợp khi cần ôn rất nhanh trước buổi phỏng vấn:

1. [Tổng ôn phỏng vấn tester](./tester-interview-summary.md)
2. [Postman guide](./postman-guide.md)
3. [Batch practice guide](./batch-practice-guide.md)
4. [SQL practice compact](./sql-practice-compact.md)
5. [JMeter review guide](./jmeter-review-guide.md)

## Lộ trình 1 buổi

Phù hợp khi cần vừa ôn vừa hiểu rõ project:

1. [Tổng quan hệ thống](./overview.md)
2. [Đặc tả API](./api-spec.md)
3. [Jira tickets](./jira-tickets.md)
4. [Postman guide](./postman-guide.md)
5. [Batch practice guide](./batch-practice-guide.md)
6. [SQL practice compact](./sql-practice-compact.md)
7. [SQL practice answers](./sql-practice-answers.md)
8. [JMeter review guide](./jmeter-review-guide.md)
9. [JMeter practice guide](./jmeter-practice-guide.md)

---

## 5. Ghi chú sử dụng

- Nếu muốn đọc nhanh trong trình duyệt, dùng bản HTML trong `docs/html/vi/`
- Nếu muốn chỉnh sửa nội dung, sửa trực tiếp file `.md` trong `docs/vi/`
- Nếu thêm tài liệu mới sau này, nên gắn luôn vào trang mục lục này để tránh bị phân tán
