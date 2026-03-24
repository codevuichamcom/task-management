# Hướng dẫn dùng Postman collection cho Task Management

Tài liệu này giúp anh/chị import nhanh collection, hiểu cách dùng biến môi trường, và chạy được toàn bộ flow API theo một chuỗi liền mạch.

## File cần dùng

### Collection

- [task-management.postman_collection.json](/d:/Develop/Testing/task-management/postman/task-management.postman_collection.json)

### Environment

- [task-management.local.postman_environment.json](/d:/Develop/Testing/task-management/postman/task-management.local.postman_environment.json)

## Collection này dùng để làm gì

Collection bao phủ các nhóm API chính của dự án:

- `Auth`
- `Projects`
- `Tasks`
- một nhóm `Negative Checks` để test nhanh validation và unauthorized

Collection có sẵn script để:

- tự lưu `access_token` sau khi login
- tự lưu `project_id` sau khi tạo project
- tự lưu `task_id` sau khi tạo task
- kiểm tra schema cơ bản của response ở từng request

Hiểu ngắn gọn:

`Import xong là có thể test flow liên tục mà không phải copy token hay id bằng tay.`

## Cách import

1. Mở Postman.
2. Chọn `Import`.
3. Import cả 2 file JSON ở trên.
4. Chọn environment `Task Management Local`.

## Biến môi trường quan trọng

| Biến | Ý nghĩa |
|------|--------|
| `baseUrl` | địa chỉ API, mặc định `http://localhost:3000` |
| `login_email` | tài khoản seed để login |
| `login_password` | mật khẩu của tài khoản seed |
| `access_token` | token được lưu tự động sau login |
| `current_user_id` | id user hiện tại |
| `project_id` | id project vừa tạo |
| `task_id` | id task vừa tạo |
| `assignee_id` | id assignee dùng cho task |
| `status_filter` | status dùng cho request lọc task |
| `page` / `limit` | biến phân trang |

## Collection tự lưu biến như thế nào

### Sau `Login - Seed User`

Collection tự lưu:

- `access_token`
- `current_user_id`
- `current_user_email`

### Sau `Create Project`

Collection tự lưu:

- `project_id`
- `project_owner_id`

### Sau `Create Task`

Collection tự lưu:

- `task_id`

## Thứ tự chạy khuyến nghị

Để chạy mượt nhất, nên bấm theo thứ tự:

1. `01 Auth / Register - Random User`
2. `01 Auth / Login - Seed User`
3. `02 Projects / Create Project`
4. `02 Projects / List My Projects`
5. `02 Projects / Update Project`
6. `03 Tasks / Create Task`
7. `03 Tasks / List Tasks - All`
8. `03 Tasks / Update Task - Valid Status`
9. `03 Tasks / List Tasks - Filtered By Status`
10. `04 Negative Checks / Register - Invalid Email`
11. `04 Negative Checks / Projects - No Token`
12. `04 Negative Checks / Update Task - Invalid Status`
13. `03 Tasks / Delete Task`
14. `03 Tasks / Delete Project`

Nếu chỉ muốn smoke test nhanh, chỉ cần chạy:

1. `Login - Seed User`
2. `Create Project`
3. `Create Task`
4. `Update Task - Valid Status`
5. `List Tasks - Filtered By Status`
6. `Delete Task`
7. `Delete Project`

## Ý nghĩa từng folder

## `01 Auth`

- `Register - Random User`: tự tạo email theo timestamp để tránh trùng.
- `Login - Seed User`: login bằng user seed và tự lưu token.

## `02 Projects`

- `Create Project`: tạo project mới, lưu `project_id`, check schema response.
- `List My Projects`: check response là array và project vừa tạo có xuất hiện.
- `Update Project`: đổi tên project vừa tạo và check schema response.

## `03 Tasks`

- `Create Task`: dùng `project_id` đã lưu, tạo task mới và lưu `task_id`.
- `List Tasks - All`: check schema list response và `meta`.
- `Update Task - Valid Status`: update status sang `IN_PROGRESS`.
- `List Tasks - Filtered By Status`: verify filter `statusFilter`.
- `Delete Task`: xóa task vừa tạo.
- `Delete Project`: xóa project vừa tạo.

## `04 Negative Checks`

- `Register - Invalid Email`: kỳ vọng `400`.
- `Projects - No Token`: kỳ vọng `401`.
- `Update Task - Invalid Status`: kỳ vọng `400`.

## Collection đang kiểm tra schema như thế nào

Collection không dùng schema validator phức tạp.
Nó dùng Postman test scripts cơ bản để kiểm:

- field có tồn tại không
- type có đúng không
- một số giá trị quan trọng có đúng không

Ví dụ:

- login phải có `access_token`
- create project phải có `ownerId`
- list tasks phải có `meta.page` là number

Ưu điểm của cách này:

- dễ đọc
- dễ sửa
- phù hợp để vừa test vừa ôn phỏng vấn

## Khi nào cần sửa environment

Anh/chị chỉ cần sửa vài biến nếu:

- đổi `baseUrl`
- đổi `login_email` hoặc `login_password`
- muốn filter task theo status khác bằng `status_filter`
- muốn đổi `page` hoặc `limit`

## Nếu collection chạy lỗi, kiểm tra gì trước

1. API đã chạy chưa: mở `http://localhost:3000/api-docs`
2. Sau login đã có `access_token` trong environment chưa
3. Đã có `project_id` trước khi chạy task requests chưa
4. Đã có `task_id` trước khi chạy update/delete task chưa

Nếu data cũ gây nhiễu, nên reset:

```bash
docker-compose down -v
docker-compose up --build
```

## Cách dùng collection để ôn phỏng vấn

Collection này cũng rất hợp để kể kinh nghiệm trong phỏng vấn.

Có thể mô tả ngắn như sau:

`Em thường dựng Postman collection có environment variables để tái sử dụng token, id và test data. Sau đó em thêm test scripts để check status code, response schema và lưu các giá trị cần cho request sau, giúp em test flow liên tục và ổn định hơn.`
