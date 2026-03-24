# Đặc tả API Task Management

**Base URL:** `http://localhost:3000`  
**Content-Type:** `application/json`  
**Xác thực:** Bearer token (JWT) qua `Authorization: Bearer <access_token>`

## Mã lỗi

| HTTP Status | Ý nghĩa |
|-------------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## POST /auth/register

Đăng ký người dùng mới.

**Request**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

| Trường | Kiểu | Bắt buộc | Ghi chú |
|--------|------|----------|--------|
| email | string | có | Phải là email hợp lệ |
| password | string | có | Tối thiểu 8 ký tự |
| role | string | không | `USER` hoặc `ADMIN`, mặc định là `USER` |

## POST /auth/login

Đăng nhập và nhận JWT token.

**Response 200**

```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

## POST /projects

Tạo dự án mới. Người dùng hiện tại sẽ là owner.

**Response 201**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Dự án mới",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## GET /projects

Lấy danh sách dự án do người dùng hiện tại sở hữu.

## PATCH /projects/:id

Cập nhật dự án. Chỉ owner mới được phép cập nhật.

## DELETE /projects/:id

Xóa dự án và toàn bộ task liên quan. Chỉ owner mới được phép xóa.

## POST /tasks

Tạo task mới.

| Trường | Kiểu | Bắt buộc | Ghi chú |
|--------|------|----------|--------|
| title | string | có | Không được để trống |
| description | string | không | Tùy chọn |
| status | string | không | `TODO`, `IN_PROGRESS`, `DONE` |
| projectId | UUID | có | Phải tham chiếu tới project tồn tại |
| assigneeId | UUID | không | Nếu có thì phải tham chiếu tới user tồn tại |

## POST /tasks/batch

Tạo nhiều task trong một request để luyện bài toán `batch input/output reconciliation`.

**Request**

```json
{
  "items": [
    {
      "clientRef": "row-001",
      "title": "Batch import row 1",
      "description": "Create from batch request",
      "status": "TODO",
      "projectId": "a3f1c2d4-89ab-4cde-b012-3456789abcde",
      "assigneeId": "b4f1c2d4-89ab-4cde-b012-3456789abcde"
    },
    {
      "clientRef": "row-002",
      "title": "Batch import row 2",
      "projectId": "a3f1c2d4-89ab-4cde-b012-3456789abcde"
    }
  ]
}
```

| Trường | Kiểu | Bắt buộc | Ghi chú |
|--------|------|----------|--------|
| items | array | có | Tối thiểu `1`, tối đa `50` phần tử |
| items[].clientRef | string | không | Mã tham chiếu phía client, được echo lại trong kết quả |
| items[].title | string | có | Không được để trống |
| items[].description | string | không | Tùy chọn |
| items[].status | string | không | `TODO`, `IN_PROGRESS`, `DONE` |
| items[].projectId | UUID | có | Project phải tồn tại |
| items[].assigneeId | UUID | không | Nếu có thì user phải tồn tại |

**Response 200**

```json
{
  "total": 2,
  "createdCount": 1,
  "failedCount": 1,
  "results": [
    {
      "index": 0,
      "clientRef": "row-001",
      "ok": true,
      "taskId": "770e8400-e29b-41d4-a716-446655440001",
      "title": "Batch import row 1",
      "projectId": "a3f1c2d4-89ab-4cde-b012-3456789abcde",
      "status": "TODO"
    },
    {
      "index": 1,
      "clientRef": "row-002",
      "ok": false,
      "error": "Project not found"
    }
  ]
}
```

Hiểu ngắn gọn:

- endpoint này không chạy async thật
- nhưng rất hữu ích để luyện:
  - `missing / duplicate`
  - đối chiếu `input vs output`
  - bài toán retry và idempotency ở mức tester

## GET /tasks

Lấy danh sách task với lọc và phân trang.

| Query Param | Kiểu | Ghi chú |
|-------------|------|--------|
| page | number | Bắt đầu từ `1`, mặc định `1` |
| limit | number | Mặc định `10` |
| statusFilter | string | Tham số chính để lọc status, so khớp chính xác không phân biệt hoa thường |
| status | string | Alias cũ của `statusFilter`, còn hỗ trợ tạm thời |
| projectId | UUID | Lọc theo project |

## PATCH /tasks/:id

Cập nhật task. Chỉ owner của project hoặc assignee hiện tại mới được phép cập nhật.

## DELETE /tasks/:id

Xóa task. Chỉ owner của project hoặc assignee hiện tại mới được phép xóa.
