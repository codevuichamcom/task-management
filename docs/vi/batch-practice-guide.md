# Hướng dẫn thực hành Batch với project task-management

Tài liệu này giúp bạn luyện phần `batch` theo cách sát phỏng vấn tester nhưng không cần dựng một hệ thống async phức tạp.

Project đã được thêm một endpoint mới:

- `POST /tasks/batch`

Mục tiêu của endpoint này không phải mô phỏng enterprise batch thật 100%.
Mục tiêu là tạo một chỗ để bạn luyện:

- gửi nhiều record trong một request
- đối chiếu `input` và `output`
- kiểm tra `missing`, `duplicate`, `failed row`
- dùng `Postman` và `SQL` để làm evidence

---

## 1. Endpoint này dùng để làm gì

`POST /tasks/batch` nhận một mảng `items`.

Mỗi item là một task cần tạo.

Response trả về:

- `total`
- `createdCount`
- `failedCount`
- `results` theo từng dòng

Nói ngắn gọn:

```text
input nhiều dòng
-> server xử lý từng dòng
-> trả về kết quả từng dòng
```

Đây là kiểu rất tốt để tập tư duy `batch reconciliation`.

---

## 2. Trước khi chạy cần chuẩn bị gì

Bạn cần:

- API đang chạy ở `http://localhost:3000`
- có token login
- có sẵn `projectId` hợp lệ
- nếu muốn gán người nhận task thì cần `assigneeId` hợp lệ

Nếu muốn thao tác nhanh, dùng:

- [Postman guide](./postman-guide.md)

Collection hiện đã có sẵn request:

- `03 Tasks / Create Tasks - Batch All Valid`
- `03 Tasks / Create Tasks - Batch Mixed Result`

Nếu muốn tra contract:

- [Đặc tả API](./api-spec.md)

---

## 3. Request mẫu đầu tiên

Ví dụ:

```json
{
  "items": [
    {
      "clientRef": "row-001",
      "title": "Batch row 1",
      "description": "Valid row",
      "status": "TODO",
      "projectId": "<project-id>"
    },
    {
      "clientRef": "row-002",
      "title": "Batch row 2",
      "description": "Another valid row",
      "status": "IN_PROGRESS",
      "projectId": "<project-id>"
    }
  ]
}
```

Header:

```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 4. Cách luyện bằng Postman

### Bước 1

Login bằng collection sẵn có để lấy token.

### Bước 2

Tạo hoặc lấy một `projectId`.

### Bước 3

Tạo request mới:

- method: `POST`
- url: `{{baseUrl}}/tasks/batch`

### Bước 4

Gắn token vào header.

### Bước 5

Paste request body mẫu và gửi.

Nếu muốn chạy nhanh ngay bằng collection, dùng:

- `Create Tasks - Batch All Valid` cho case tất cả dòng đều thành công
- `Create Tasks - Batch Mixed Result` cho case vừa thành công vừa lỗi

---

## 5. 5 bài tập nên làm

## Bài 1: Batch toàn bộ hợp lệ

Mục tiêu:

- tất cả dòng đều tạo thành công

Bạn cần check:

- `total = 2`
- `createdCount = 2`
- `failedCount = 0`
- trong DB thực sự có đủ 2 task mới

## Bài 2: Batch trộn đúng và sai

Ví dụ:

- 1 dòng dùng `projectId` hợp lệ
- 1 dòng dùng `projectId` giả

Mục tiêu:

- xem response có phản ánh đúng số dòng fail không
- dòng fail có trả `error` rõ không
- dòng đúng có vẫn được tạo không

Đây là bài rất hay để luyện `partial success`.

## Bài 3: Batch có duplicate title

Gửi 2 dòng có cùng `title` trong cùng project.

Mục tiêu:

- kiểm tra hệ thống hiện tại có cho tạo cả hai không
- nếu có, đó có phải bug nghiệp vụ không
- dùng SQL để chứng minh duplicate

## Bài 4: Retry cùng một payload

Gửi cùng một body hai lần liên tiếp.

Mục tiêu:

- xem hệ thống có tạo trùng không
- nếu tạo trùng, bạn sẽ report đây là gì:
  - expected behavior
  - hay bug idempotency

## Bài 5: Đối soát input và output

Dùng `clientRef` để đối chiếu:

- input có bao nhiêu dòng
- response success bao nhiêu dòng
- response fail bao nhiêu dòng
- DB thực tế lưu bao nhiêu record

Đây là bài sát nhất với tư duy `batch tester`.

---

## 6. SQL nên dùng để verify

Ví dụ query kiểm tra các task vừa tạo:

```sql
SELECT id, title, status, "projectId", "assigneeId", "createdAt"
FROM tasks
WHERE title IN ('Batch row 1', 'Batch row 2')
ORDER BY "createdAt" DESC;
```

Ví dụ query tìm duplicate title trong cùng project:

```sql
SELECT "projectId", title, COUNT(*) AS duplicate_count
FROM tasks
GROUP BY "projectId", title
HAVING COUNT(*) > 1;
```

Nếu muốn luyện sâu hơn phần đối soát:

- [SQL practice answers](./sql-practice-answers.md)

---

## 7. Nên kết luận bài test như thế nào

Đừng chỉ nói:

- batch chạy được

Hãy nói kiểu có evidence:

```text
Em gửi batch gồm 3 dòng.
Kết quả API trả createdCount = 2, failedCount = 1.
Hai dòng hợp lệ được lưu trong DB, một dòng dùng projectId không tồn tại nên fail với thông báo "Project not found".
Kết quả input, response và DB khớp nhau.
```

Hoặc:

```text
Em gửi lại cùng một payload hai lần và hệ thống tạo trùng task.
Nếu nghiệp vụ yêu cầu idempotent retry thì đây là bug duplicate data.
```

---

## 8. Có nên sửa code thêm nữa không

Có thể, nhưng chỉ nên sửa nhẹ.

Mức hiện tại đã đủ tốt để luyện:

- batch input/output
- mixed success
- duplicate
- retry
- SQL reconciliation

Chỉ nên nâng thêm nếu bạn thật sự còn thời gian, ví dụ:

- thêm `dryRun`
- thêm `batchId`
- thêm `createdByBatchAt`
- thêm endpoint async kiểu `POST /imports` rồi `GET /imports/:id`

Nếu đang ôn gấp, chưa cần đi xa đến đó.
