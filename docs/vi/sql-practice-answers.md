# Đáp án chi tiết cho bộ câu hỏi SQL tinh gọn

Các đáp án dưới đây dùng cú pháp PostgreSQL, bám theo schema của project `task-management`.

## Nhóm A: Cơ bản

### Câu 1

```sql
SELECT id, email, role, "createdAt"
FROM users
ORDER BY "createdAt" DESC;
```

Giải thích:
Query này lấy danh sách user và sắp xếp mới nhất trước bằng `ORDER BY ... DESC`.

### Câu 2

```sql
SELECT id, title, status, "projectId", "assigneeId", "createdAt"
FROM tasks
WHERE status = 'TODO';
```

Giải thích:
Đây là filter exact match theo status. Kiểu query này dùng nhiều khi đối soát task list hoặc kiểm tra kết quả filter của API.

### Câu 3

```sql
SELECT id, title, status, "projectId", "createdAt"
FROM tasks
WHERE "assigneeId" IS NULL;
```

Giải thích:
`IS NULL` dùng để tìm record chưa được assign. Không dùng `= NULL`.

### Câu 4

```sql
SELECT status, COUNT(*) AS task_count
FROM tasks
GROUP BY status
ORDER BY status;
```

Giải thích:
Đây là aggregate cơ bản để đếm số lượng task theo từng trạng thái.

## Nhóm B: JOIN và Aggregate

### Câu 5

```sql
SELECT
  t.id,
  t.title,
  t.status,
  p.name AS project_name,
  u.email AS assignee_email
FROM tasks t
JOIN projects p ON p.id = t."projectId"
LEFT JOIN users u ON u.id = t."assigneeId"
ORDER BY t."createdAt" DESC;
```

Giải thích:
`JOIN` với `projects` vì task luôn phải thuộc một project.
`LEFT JOIN` với `users` vì có task chưa assign.

### Câu 6

```sql
SELECT
  p.id,
  p.name,
  p."ownerId",
  u.email AS owner_email,
  p."createdAt"
FROM projects p
JOIN users u ON u.id = p."ownerId"
ORDER BY p."createdAt" DESC;
```

Giải thích:
Query này rất hợp để verify project trả ra có đúng owner hay không.

### Câu 7

```sql
SELECT
  p.id,
  p.name,
  COUNT(t.id) AS task_count
FROM projects p
LEFT JOIN tasks t ON t."projectId" = p.id
GROUP BY p.id, p.name
ORDER BY p.name;
```

Giải thích:
Phải dùng `LEFT JOIN` để project không có task vẫn hiện ra với `task_count = 0`.

### Câu 8

```sql
SELECT
  u.id,
  u.email,
  COUNT(t.id) AS assigned_task_count
FROM users u
LEFT JOIN tasks t ON t."assigneeId" = u.id
GROUP BY u.id, u.email
ORDER BY assigned_task_count DESC, u.email;
```

Giải thích:
Query này dùng tốt cho phân bổ workload và verify assignment.

### Câu 9

```sql
SELECT
  p.id,
  p.name,
  COUNT(t.id) AS task_count
FROM projects p
LEFT JOIN tasks t ON t."projectId" = p.id
GROUP BY p.id, p.name
ORDER BY task_count DESC, p.name
LIMIT 1;
```

Giải thích:
Nếu chỉ cần một project top 1 thì dùng `ORDER BY ... DESC LIMIT 1`.
Nếu muốn lấy tất cả project đồng hạng cao nhất thì cần query nâng cao hơn.

## Nhóm C: Data Verification đúng kiểu Tester

### Câu 10

```sql
SELECT
  t.id AS task_id,
  t.title,
  t.status,
  p.name AS project_name,
  u.email AS assignee_email
FROM tasks t
JOIN projects p ON p.id = t."projectId"
LEFT JOIN users u ON u.id = t."assigneeId"
ORDER BY t."createdAt" DESC;
```

Giải thích:
Đây là query đối soát điển hình giữa API response và DB. Khi bug report, có thể chụp response API ở một bên và output SQL ở bên còn lại để chứng minh record thiếu field hoặc sai relation.

### Câu 11

```sql
SELECT id, email, role
FROM users
WHERE email NOT LIKE '%@%';
```

Giải thích:
Đây là cách tìm dữ liệu email bất thường ở mức đơn giản. Nếu muốn kiểm chặt hơn có thể dùng regex.

### Câu 12

```sql
SELECT id, email, password
FROM users
WHERE password NOT LIKE '$2%';
```

Giải thích:
Với project này dùng `bcryptjs`, password hash thường bắt đầu bằng `$2`. Query này giúp rà nhanh record có dấu hiệu lưu plaintext hoặc sai format hash.

### Câu 13

```sql
SELECT
  t.id,
  t.title,
  t."projectId"
FROM tasks t
LEFT JOIN projects p ON p.id = t."projectId"
WHERE p.id IS NULL;
```

Giải thích:
Đây là query chuẩn để tìm `orphan task`. Cực hữu ích khi verify sau thao tác xóa project.

### Câu 14

```sql
SELECT
  t.id,
  t.title,
  t."assigneeId"
FROM tasks t
LEFT JOIN users u ON u.id = t."assigneeId"
WHERE t."assigneeId" IS NOT NULL
  AND u.id IS NULL;
```

Giải thích:
Phải thêm điều kiện `t."assigneeId" IS NOT NULL` để tránh nhầm task chưa assign với task có foreign key sai.

### Câu 15

```sql
SELECT
  "projectId",
  title,
  COUNT(*) AS duplicate_count
FROM tasks
GROUP BY "projectId", title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, title;
```

Giải thích:
`HAVING` dùng để lọc sau khi aggregate. Đây là mẫu query rất hay cho duplicate check.

## Nhóm D: Verify bug thực tế của project

### Câu 16

```sql
SELECT id, name, "ownerId"
FROM projects
ORDER BY name;
```

```sql
SELECT
  p.id,
  p.name,
  p."ownerId"
FROM projects p
JOIN users u ON u.id = p."ownerId"
WHERE u.email = 'bob@test.com'
ORDER BY p.name;
```

Giải thích:
Query thứ nhất là actual data toàn hệ thống.
Query thứ hai là expected data nếu API lọc đúng theo owner của `bob@test.com`.
So sánh hai tập kết quả là cách rất tốt để chứng minh bug authorization.

### Câu 17

```sql
SELECT
  t.id AS task_id,
  t.title,
  t."projectId",
  t."assigneeId",
  owner.email AS project_owner_email,
  assignee.email AS assignee_email
FROM tasks t
JOIN projects p ON p.id = t."projectId"
JOIN users owner ON owner.id = p."ownerId"
LEFT JOIN users assignee ON assignee.id = t."assigneeId"
WHERE t.id = '<task-id>';
```

Giải thích:
Query này gom đủ context để chứng minh task thuộc project nào, owner là ai, assignee là ai. Khi một user không liên quan vẫn update được task thì output này là evidence rất mạnh.

### Câu 18

```sql
SELECT id, title, status
FROM tasks
WHERE id = '<task-id>';
```

Giải thích:
Sau khi gọi API update với `status = 'IN_PROGRESS'`, chạy query này để xác nhận DB thực lưu gì. Nếu DB vẫn là `TODO` thì có bug logic/persistence, không phải chỉ là bug hiển thị.

### Câu 19

```sql
SELECT id, title, status
FROM tasks
WHERE status = 'TODO'
ORDER BY "createdAt";
```

```sql
SELECT id, title, status
FROM tasks
WHERE status ILIKE '%DO%'
ORDER BY "createdAt";
```

Giải thích:
Query đầu là exact match đúng kỳ vọng business.
Query thứ hai mô phỏng cách filter wildcard có thể match cả `TODO` và `DONE`.

### Câu 20

```sql
SELECT id, title, status, "createdAt"
FROM tasks
ORDER BY "createdAt"
LIMIT 5 OFFSET 0;
```

```sql
SELECT id, title, status, "createdAt"
FROM tasks
ORDER BY "createdAt"
LIMIT 5 OFFSET 5;
```

Giải thích:
Query đầu là logic đúng cho `page = 1, limit = 5`.
Query sau là logic bug khi offset bị tính thành `page * limit`.

### Câu 21

```sql
SELECT
  t.id,
  COUNT(*) AS occurrences
FROM tasks t
LEFT JOIN projects p1 ON p1.id = t."projectId"
LEFT JOIN projects p2 ON p2.id = t."projectId"
GROUP BY t.id
HAVING COUNT(*) > 1
ORDER BY occurrences DESC, t.id;
```

Giải thích:
Query này mô phỏng trường hợp join dư cùng một relation và kiểm tra task nào bị xuất hiện nhiều lần trong result set.

## Nhóm E: Nâng cao vừa đủ cho Senior

### Câu 22

```sql
SELECT
  owner.email AS owner_email,
  COUNT(CASE WHEN t.status = 'TODO' THEN 1 END) AS todo_count,
  COUNT(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 END) AS in_progress_count,
  COUNT(CASE WHEN t.status = 'DONE' THEN 1 END) AS done_count
FROM projects p
JOIN users owner ON owner.id = p."ownerId"
LEFT JOIN tasks t ON t."projectId" = p.id
GROUP BY owner.email
ORDER BY owner.email;
```

Giải thích:
Đây là report tổng hợp theo owner. Rất phù hợp để nói về reporting hoặc quality summary trong phỏng vấn.

### Câu 23

```sql
WITH task_counts AS (
  SELECT
    u.id,
    u.email,
    COUNT(t.id) AS assigned_task_count
  FROM users u
  LEFT JOIN tasks t ON t."assigneeId" = u.id
  GROUP BY u.id, u.email
)
SELECT id, email, assigned_task_count
FROM task_counts
WHERE assigned_task_count = (
  SELECT MAX(assigned_task_count) FROM task_counts
)
ORDER BY email;
```

Giải thích:
Dùng `CTE` để tính trước, sau đó lấy tất cả user đồng hạng cao nhất.

### Câu 24

```sql
SELECT
  p.id,
  p.name
FROM projects p
LEFT JOIN tasks t
  ON t."projectId" = p.id
 AND t.status = 'DONE'
WHERE t.id IS NULL
ORDER BY p.name;
```

Giải thích:
Kỹ thuật này rất tốt để tìm những project không có record thỏa điều kiện nào đó.

### Câu 25

```sql
WITH incoming_batch AS (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid AS task_id
  UNION ALL
  SELECT '22222222-2222-2222-2222-222222222222'::uuid
  UNION ALL
  SELECT '33333333-3333-3333-3333-333333333333'::uuid
  UNION ALL
  SELECT '44444444-4444-4444-4444-444444444444'::uuid
  UNION ALL
  SELECT '55555555-5555-5555-5555-555555555555'::uuid
)
SELECT
  b.task_id,
  t.id AS existing_task_id,
  CASE
    WHEN t.id IS NULL THEN 'MISSING'
    ELSE 'FOUND'
  END AS verify_result
FROM incoming_batch b
LEFT JOIN tasks t ON t.id = b.task_id
ORDER BY b.task_id;
```

Giải thích:
Đây là kiểu query mô phỏng đối soát input batch với dữ liệu thật trong DB.

### Câu 26

```sql
WITH expected_updates AS (
  SELECT '11111111-1111-1111-1111-111111111111'::uuid AS task_id, 'DONE'::text AS expected_status
  UNION ALL
  SELECT '22222222-2222-2222-2222-222222222222'::uuid, 'IN_PROGRESS'::text
  UNION ALL
  SELECT '33333333-3333-3333-3333-333333333333'::uuid, 'TODO'::text
)
SELECT
  e.task_id,
  e.expected_status,
  t.status AS actual_status
FROM expected_updates e
LEFT JOIN tasks t ON t.id = e.task_id
WHERE t.id IS NULL
   OR t.status::text <> e.expected_status
ORDER BY e.task_id;
```

Giải thích:
Đây là query đối soát `expected vs actual` rất sát bài toán batch reconciliation. Nếu record không tồn tại hoặc status khác kỳ vọng thì sẽ bị lộ ra ngay.
