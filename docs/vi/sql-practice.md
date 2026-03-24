# Bộ câu hỏi SQL ôn phỏng vấn Tester

Tài liệu này bám theo:

- JD Tester của Extreme VN: nhấn mạnh `SQL/Database`, `API/Batch`, `data verification`, `abnormal case`, `test evidence`
- Project hiện tại `task-management`: phù hợp để luyện `JOIN`, `Aggregate`, `data integrity`, `authorization check`, `pagination/filter verification`

## 1. Schema cần nắm trước khi làm

### Bảng `users`

- `id`
- `email`
- `password`
- `role`
- `createdAt`

### Bảng `projects`

- `id`
- `name`
- `ownerId`
- `createdAt`

### Bảng `tasks`

- `id`
- `title`
- `description`
- `status`
- `projectId`
- `assigneeId`
- `createdAt`

### Quan hệ

- `projects.ownerId -> users.id`
- `tasks.projectId -> projects.id`
- `tasks.assigneeId -> users.id`

## 2. Cách ôn đúng theo JD

- Tự viết câu SQL trước, không nhìn gợi ý.
- Sau khi viết xong, tự giải thích miệng: `vì sao join kiểu này`, `vì sao dùng left join`, `query này verify được bug/risk gì`.
- Với mỗi câu, nên trả lời thêm 2 ý:
  - Nếu dữ liệu lớn 1000+ records thì query này có rủi ro gì?
  - Nếu đưa vào bug report/test evidence thì screenshot hoặc output nào là đủ?

## 3. Bộ câu hỏi theo cấp độ

## Level 1: Cơ bản

### Câu 1

Viết SQL lấy danh sách tất cả user gồm `id`, `email`, `role`, `createdAt`, sắp xếp theo `createdAt` mới nhất trước.

### Câu 2

Viết SQL chỉ lấy các user có role `USER`.

### Câu 3

Viết SQL lấy tất cả task có status `TODO`.

### Câu 4

Viết SQL lấy các task chưa được assign cho ai.

### Câu 5

Viết SQL đếm tổng số project hiện có trong hệ thống.

### Câu 6

Viết SQL đếm tổng số task hiện có trong hệ thống.

### Câu 7

Viết SQL đếm số task theo từng status.

### Câu 8

Viết SQL tìm project có tên là `Alpha Project`.

Mục tiêu Level 1:

- `SELECT`
- `WHERE`
- `ORDER BY`
- `COUNT`
- làm quen schema

## Level 2: JOIN và Aggregate

### Câu 9

Viết SQL lấy danh sách task kèm:

- `task.title`
- `task.status`
- tên project
- email assignee

Yêu cầu: task chưa assign vẫn phải hiện ra.

### Câu 10

Viết SQL lấy danh sách project kèm email owner.

### Câu 11

Viết SQL đếm số task trong từng project.

Yêu cầu:

- hiện cả project không có task
- output gồm `project name`, `task_count`

### Câu 12

Viết SQL đếm số task được assign cho từng user.

Yêu cầu:

- user không có task vẫn phải xuất hiện
- output gồm `email`, `assigned_task_count`

### Câu 13

Viết SQL tìm các user hiện không được assign task nào.

### Câu 14

Viết SQL tính số task theo từng status trong từng project.

Gợi ý kỹ năng cần có:

- `JOIN`
- `LEFT JOIN`
- `GROUP BY`
- `COUNT`
- `CASE WHEN` nếu cần pivot nhẹ

### Câu 15

Viết SQL tìm project có nhiều task nhất.

### Câu 16

Viết SQL lấy danh sách owner và tổng số task thuộc các project mà họ sở hữu.

Mục tiêu Level 2:

- join nhiều bảng
- aggregate theo nghiệp vụ
- hiểu khác nhau giữa `JOIN` và `LEFT JOIN`

## Level 3: SQL cho data verification của Tester

### Câu 17

JD yêu cầu tester phải verify dữ liệu chứ không chỉ nhìn UI.

Viết SQL để kiểm tra task list trả về từ API có đủ thông tin liên quan hay không, tối thiểu gồm:

- task id
- task title
- status
- project name
- assignee email

Sau đó giải thích: query này sẽ dùng trong test evidence như thế nào.

### Câu 18

Viết SQL để kiểm tra dữ liệu user có email lỗi định dạng, ví dụ không chứa ký tự `@`.

Đây là dạng verify phù hợp với bug validation.

### Câu 19

Viết SQL để kiểm tra password có vẻ đang lưu plaintext hay đã được hash.

Gợi ý: bcrypt thường bắt đầu bằng chuỗi như `"$2"`.

### Câu 20

Viết SQL để tìm các task có `projectId` không tồn tại ở bảng `projects`.

Giải thích:

- đây là loại lỗi gì
- mức độ ảnh hưởng ra sao với QA

### Câu 21

Viết SQL để tìm các task có `assigneeId` không tồn tại ở bảng `users`.

### Câu 22

Viết SQL để kiểm tra có project nào không có owner hợp lệ hay không.

### Câu 23

Viết SQL để kiểm tra trong cùng một project có bị trùng `title` task hay không.

Đây là bài luyện cho tư duy abnormal case.

### Câu 24

Viết SQL tìm các task có `description` bị null.

Sau đó trả lời miệng:

- trường hợp này là hợp lệ hay bất thường
- cần đối chiếu với spec hay business rule nào trước khi raise bug

Mục tiêu Level 3:

- đối soát dữ liệu
- tìm dữ liệu bất thường
- nói được `expected vs actual`

## Level 4: SQL bám bug thực tế của project

### Câu 25

Bug của project cho thấy user có thể nhìn thấy project của người khác.

Viết SQL:

- câu thứ nhất: lấy tất cả project hiện có
- câu thứ hai: lấy đúng project mà `bob@test.com` đáng ra được thấy nếu filter đúng theo owner

Sau đó giải thích vì sao 2 kết quả này là test evidence tốt cho bug authorization.

### Câu 26

Viết SQL để verify một task đã bị update trái phép bởi user không liên quan.

Output mong muốn:

- `task id`
- `title`
- `projectId`
- `assigneeId`
- email owner project
- email assignee

### Câu 27

Bug thực tế có lỗi `status=IN_PROGRESS` nhưng DB lại lưu thành `TODO`.

Viết SQL để verify sau khi gọi API update, task thực sự đang có status gì trong DB.

Sau đó nói rõ:

- expected
- actual
- query nào dùng để chụp evidence

### Câu 28

Viết 2 câu SQL để so sánh:

- exact match cho status `TODO`
- partial match cho input `DO`

Mục tiêu là chứng minh vì sao filter kiểu wildcard có thể trả sai dữ liệu.

### Câu 29

Project có bug pagination off-by-one.

Viết SQL mô phỏng:

- page 1, limit 5 theo logic đúng
- page 1, limit 5 theo logic bug

Yêu cầu sắp xếp theo `createdAt`.

### Câu 30

Viết SQL kiểm tra có task nào bị nhân đôi khi query join dư hay không.

Gợi ý:

- group theo `task.id`
- đếm số lần xuất hiện

Mục tiêu Level 4:

- verify bug bằng SQL
- biết dùng SQL làm bằng chứng thay vì mô tả cảm tính

## Level 5: Nâng cao theo kiểu Senior Tester

### Câu 31

Viết SQL tạo báo cáo số task theo `owner` và `status`.

Output mong muốn:

- owner email
- số task TODO
- số task IN_PROGRESS
- số task DONE

Đây là dạng query rất gần với test report hoặc quality report.

### Câu 32

Viết SQL tìm user đang bị assign nhiều task nhất.

Nếu có nhiều người cùng hạng nhất thì phải hiện tất cả.

### Câu 33

Viết SQL tìm project không có task `DONE` nào.

Đây là dạng câu interviewer hay dùng để xem ứng viên có xử lý được logic nghiệp vụ không.

### Câu 34

Viết SQL tìm các project mà owner chưa tự làm task nào trong chính project của mình.

Nói cách khác:

- project có owner
- nhưng không có task nào trong project được assign cho chính owner đó

### Câu 35

Viết SQL dùng `CTE` để tạo một danh sách `incoming_batch` giả gồm 5 task ID, sau đó kiểm tra:

- ID nào có thật trong DB
- ID nào không tồn tại

Đây là bài luyện rất sát JD vì mô phỏng verify input batch.

### Câu 36

Viết SQL dùng `CTE` để mô phỏng một batch cập nhật trạng thái mong đợi, rồi đối soát với dữ liệu thực tế trong DB để tìm record lệch giữa:

- `expected_status`
- `actual_status`

Mục tiêu Level 5:

- `CTE`
- đối soát input/output
- tư duy batch verification
- kiểu bài dễ gặp khi phỏng vấn senior tester hoặc test lead

## Level 6: Câu hỏi mở kiểu phỏng vấn

### Câu 37

Nếu interviewer hỏi: `Em không chỉ viết query, em dùng SQL để phát hiện bug như thế nào?`

Hãy trả lời dựa trên 1 ví dụ thật trong project này:

- authorization
- orphan data
- status update sai
- pagination/filter sai

### Câu 38

Nếu interviewer hỏi: `Khi nào em dùng LEFT JOIN thay vì INNER JOIN trong kiểm thử dữ liệu?`

Hãy trả lời bằng chính 2 case:

- tìm task mồ côi
- tìm user chưa có task

### Câu 39

Nếu interviewer hỏi: `Khi dữ liệu lên 1000 records hoặc hơn, em verify bằng SQL thế nào cho nhanh và tin cậy?`

Hãy tự trả lời theo khung:

- verify count
- verify missing
- verify duplicate
- verify mismatch theo key business

### Câu 40

Nếu interviewer hỏi: `Làm sao phân biệt bug do API response với bug do DB persistence?`

Hãy dùng project này để nêu ít nhất 2 ví dụ cụ thể.

## 4. Thứ tự luyện khuyến nghị trong 2 buổi

### Buổi 1

- Câu 1 -> 16
- mục tiêu: viết trơn tay `SELECT`, `JOIN`, `GROUP BY`

### Buổi 2

- Câu 17 -> 40
- mục tiêu: nói được ngôn ngữ của tester senior
- không chỉ viết query đúng mà còn giải thích được `query này verify điều gì`

## 5. Checklist trước khi đi phỏng vấn

- Tự viết được query join 3 bảng `tasks -> projects -> users`
- Tự viết được query aggregate theo `project`, `owner`, `assignee`, `status`
- Tự viết được query tìm `orphan`, `missing`, `duplicate`, `invalid`
- Tự giải thích được `LEFT JOIN`, `GROUP BY`, `COUNT`, `HAVING`, `CTE`
- Tự kể được ít nhất 3 tình huống dùng SQL để verify bug

## 6. Nguồn bám theo project

- [user.entity.ts](/d:/Develop/Testing/task-management/src/users/entities/user.entity.ts)
- [project.entity.ts](/d:/Develop/Testing/task-management/src/projects/entities/project.entity.ts)
- [task.entity.ts](/d:/Develop/Testing/task-management/src/tasks/entities/task.entity.ts)
- [seed.service.ts](/d:/Develop/Testing/task-management/src/database/seed.service.ts)
- [tasks.service.ts](/d:/Develop/Testing/task-management/src/tasks/tasks.service.ts)
- [projects.service.ts](/d:/Develop/Testing/task-management/src/projects/projects.service.ts)
- [README.md](/d:/Develop/Testing/task-management/README.md)
- [Extreme VN_JD Tester.md](/d:/Develop/Testing/task-management/JD/Extreme%20VN_JD%20Tester.md)
