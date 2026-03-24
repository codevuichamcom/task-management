# Bộ câu hỏi SQL tinh gọn cho phỏng vấn Tester

Tài liệu này chỉ giữ lại đề bài và phần giải thích mục tiêu của từng câu để luyện nhanh.

## Nhóm A: Cơ bản

### Câu 1

Viết SQL lấy danh sách tất cả user gồm `id`, `email`, `role`, `createdAt`, sắp xếp mới nhất trước.

Giải thích:
Luyện `SELECT`, `ORDER BY`, và khả năng đọc dữ liệu nền của hệ thống.

### Câu 2

Viết SQL lấy tất cả task có status `TODO`.

Giải thích:
Luyện `WHERE` cơ bản và xác định đúng dữ liệu theo điều kiện business.

### Câu 3

Viết SQL lấy các task chưa được assign cho ai.

Giải thích:
Luyện kiểm tra dữ liệu null, rất hay gặp khi verify dữ liệu từ API xuống DB.

### Câu 4

Viết SQL đếm số task theo từng status.

Giải thích:
Luyện `COUNT` và `GROUP BY`, đồng thời là dạng query rất thực tế khi đối soát số lượng.

## Nhóm B: JOIN và Aggregate

### Câu 5

Viết SQL lấy danh sách task kèm:

- `task.title`
- `task.status`
- tên project
- email assignee

Yêu cầu: task chưa assign vẫn phải hiện ra.

Giải thích:
Luyện `JOIN` và `LEFT JOIN`, cũng là dạng query hay dùng để đối chiếu response API với dữ liệu DB.

### Câu 6

Viết SQL lấy danh sách project kèm email owner.

Giải thích:
Luyện join hai bảng theo khóa ngoại và hiểu mối quan hệ `projects -> users`.

### Câu 7

Viết SQL đếm số task trong từng project.

Yêu cầu:

- project không có task vẫn phải hiện
- output gồm `project name`, `task_count`

Giải thích:
Luyện aggregate theo nhóm và hiểu khi nào phải dùng `LEFT JOIN` để không làm mất dữ liệu.

### Câu 8

Viết SQL đếm số task được assign cho từng user.

Yêu cầu:

- user không có task vẫn phải hiện

Giải thích:
Luyện kiểm đếm theo assignee và tư duy báo cáo phân bổ công việc.

### Câu 9

Viết SQL tìm project có nhiều task nhất.

Giải thích:
Luyện `GROUP BY`, `ORDER BY`, `LIMIT`, và khả năng rút insight từ dữ liệu thay vì chỉ đọc raw rows.

## Nhóm C: Data Verification đúng kiểu Tester

### Câu 10

Viết SQL để kiểm tra task list trả về từ API có đủ:

- task id
- title
- status
- project name
- assignee email

Sau đó giải thích query này dùng làm test evidence như thế nào.

Giải thích:
Đây là dạng verify rất sát công việc tester senior: không chỉ gọi API mà còn đối soát dữ liệu thật trong DB.

### Câu 11

Viết SQL kiểm tra có user nào có email sai format, ví dụ không chứa `@`.

Giải thích:
Luyện kiểu query phục vụ test validation và phát hiện dữ liệu bất thường sau khi persist.

### Câu 12

Viết SQL kiểm tra password đang có dấu hiệu lưu plaintext hay đã hash.

Giải thích:
Đây là ví dụ verify về security/data storage, thể hiện tư duy không chỉ test UI hay API response.

### Câu 13

Viết SQL tìm các task có `projectId` không tồn tại ở bảng `projects`.

Giải thích:
Luyện tìm `orphan data`, là kiểu lỗi integrity rất quan trọng trong hệ thống thực tế.

### Câu 14

Viết SQL tìm các task có `assigneeId` không tồn tại ở bảng `users`.

Giải thích:
Tiếp tục luyện data integrity, nhưng ở quan hệ khác để tránh tư duy một chiều.

### Câu 15

Viết SQL kiểm tra trong cùng một project có bị trùng `title` task hay không.

Giải thích:
Luyện phát hiện duplicate data và abnormal case, rất hợp tinh thần JD.

## Nhóm D: Verify bug thực tế của project

### Câu 16

Viết 2 câu SQL:

- lấy toàn bộ project trong hệ thống
- lấy đúng project mà `bob@test.com` đáng ra được nhìn thấy nếu filter đúng theo owner

Giải thích:
Dùng SQL để chứng minh bug authorization bằng dữ liệu DB, thay vì mô tả cảm tính.

### Câu 17

Viết SQL để verify một task đã bị update trái phép:

- `task id`
- `title`
- `projectId`
- `assigneeId`
- email owner project
- email assignee

Giải thích:
Luyện cách dùng join nhiều bảng để dựng evidence đầy đủ cho bug quyền truy cập.

### Câu 18

Viết SQL để kiểm tra sau khi gọi update status = `IN_PROGRESS`, DB thực sự lưu status gì.

Giải thích:
Đây là dạng phân biệt bug logic/persistence rất hay bị hỏi trong phỏng vấn.

### Câu 19

Viết 2 câu SQL để so sánh:

- exact match với status `TODO`
- partial match với input `DO`

Giải thích:
Luyện cách chứng minh lỗi filter bằng dữ liệu thực tế và so sánh expected/actual rõ ràng.

### Câu 20

Viết SQL mô phỏng pagination:

- page 1, limit 5 theo logic đúng
- page 1, limit 5 theo logic bug

Giải thích:
Đây là bài luyện rất tốt cho tư duy verify phân trang bằng DB chứ không nhìn cảm giác trên UI/API.

### Câu 21

Viết SQL kiểm tra có task nào bị nhân đôi khi query join dư hay không.

Giải thích:
Luyện cách tìm duplicate rows sinh ra từ query sai, rất sát thực tế khi test API list.

## Nhóm E: Nâng cao vừa đủ cho Senior

### Câu 22

Viết SQL tạo báo cáo số task theo `owner` và `status`.

Output mong muốn:

- owner email
- số task TODO
- số task IN_PROGRESS
- số task DONE

Giải thích:
Đây là dạng query gần với report thực tế cho lead, PM hoặc quality report.

### Câu 23

Viết SQL tìm user đang được assign nhiều task nhất.

Nếu đồng hạng thì hiện tất cả.

Giải thích:
Luyện aggregate nâng cao hơn một chút và cách xử lý trường hợp đồng hạng.

### Câu 24

Viết SQL tìm project không có task `DONE` nào.

Giải thích:
Đây là kiểu câu hỏi nghiệp vụ dễ gặp trong phỏng vấn senior tester.

### Câu 25

Viết SQL dùng `CTE` để tạo danh sách `incoming_batch` giả, rồi kiểm tra:

- ID nào có trong DB
- ID nào không có trong DB

Giải thích:
Luyện tư duy verify input batch, rất sát JD vì JD nhấn mạnh kiểm tra dữ liệu đầu vào/đầu ra.

### Câu 26

Viết SQL dùng `CTE` để đối soát giữa:

- `expected_status`
- `actual_status`

Giải thích:
Đây là bài mô phỏng reconciliation, rất phù hợp để nói theo phong cách tester senior/data-heavy.
