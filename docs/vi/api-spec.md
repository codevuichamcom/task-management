# Task Management API — Đặc Tả

**Base URL:** `http://localhost:3000`
**Content-Type:** `application/json`
**Xác thực:** Bearer token (JWT) qua header `Authorization: Bearer <token>`

---

## Xác Thực

Tất cả endpoint ngoại trừ `POST /auth/register` và `POST /auth/login` đều yêu cầu JWT token hợp lệ.

Token hết hạn sau **24 giờ**. Lấy token bằng cách đăng nhập.

---

## Mã Lỗi

| HTTP Status | Ý nghĩa |
|-------------|---------|
| 400 | Bad Request — dữ liệu không hợp lệ hoặc thiếu trường bắt buộc |
| 401 | Unauthorized — thiếu hoặc token không hợp lệ |
| 403 | Forbidden — đã xác thực nhưng không có quyền |
| 404 | Not Found — tài nguyên không tồn tại |
| 409 | Conflict — tài nguyên trùng lặp (ví dụ: email đã được đăng ký) |
| 500 | Internal Server Error |

---

## Endpoint Xác Thực

### POST /auth/register

Đăng ký tài khoản người dùng mới.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| email | string | có | Địa chỉ email hợp lệ, phải là duy nhất |
| password | string | có | Tối thiểu 6 ký tự |
| role | string | có | `USER` hoặc `ADMIN` |

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "USER"
}
```

**Response 409:**
```json
{
  "statusCode": 409,
  "message": "Email already in use"
}
```

---

### POST /auth/login

Xác thực và nhận JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| email | string | có | Email đã đăng ký |
| password | string | có | Mật khẩu tài khoản |

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

> **Lưu ý:** Sử dụng giá trị của trường `token` làm Bearer token trong các request tiếp theo.

**Response 401:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## Endpoint Dự Án

Tất cả endpoint dự án đều yêu cầu xác thực.

### POST /projects

Tạo dự án mới. Người dùng đang xác thực sẽ tự động trở thành chủ sở hữu.

**Request Body:**
```json
{
  "name": "Dự Án Mới"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| name | string | có | Tên dự án, không được để trống |

**Response 201:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Dự Án Mới",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### GET /projects

Lấy danh sách tất cả dự án của người dùng đang xác thực.

**Response 200:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Alpha Project",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
]
```

---

### PATCH /projects/:id

Cập nhật dự án. Chỉ chủ sở hữu dự án mới được phép cập nhật.

**Path Parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| id | UUID | ID của dự án |

**Request Body:**
```json
{
  "name": "Tên Dự Án Đã Cập Nhật"
}
```

**Response 200:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Tên Dự Án Đã Cập Nhật",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

**Response 404:**
```json
{
  "statusCode": 404,
  "message": "Project not found"
}
```

---

### DELETE /projects/:id

Xóa dự án. Chỉ chủ sở hữu dự án mới được phép xóa.

**Path Parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| id | UUID | ID của dự án |

**Response 200:**
```json
{
  "message": "deleted"
}
```

---

## Endpoint Công Việc (Task)

Tất cả endpoint task đều yêu cầu xác thực.

### POST /tasks

Tạo task mới.

**Request Body:**
```json
{
  "title": "Triển khai tính năng đăng nhập",
  "description": "Xây dựng endpoint đăng nhập JWT",
  "status": "TODO",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| title | string | có | Tiêu đề task, không được để trống |
| description | string | không | Mô tả chi tiết |
| status | string | không | `TODO`, `IN_PROGRESS`, hoặc `DONE`. Mặc định là `TODO` |
| projectId | UUID | có | ID của dự án cha |
| assigneeId | UUID | không | ID người dùng được giao task |

**Response 201:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "title": "Triển khai tính năng đăng nhập",
  "description": "Xây dựng endpoint đăng nhập JWT",
  "status": "TODO",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

### GET /tasks

Lấy danh sách task với tùy chọn lọc và phân trang.

**Query Parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| page | number | Số trang, bắt đầu từ 1. `page=1` trả về trang đầu tiên. Mặc định: `1` |
| limit | number | Số item mỗi trang. Mặc định: `10` |
| status | string | Lọc theo trạng thái chính xác: `TODO`, `IN_PROGRESS`, hoặc `DONE` |
| projectId | UUID | Lọc task thuộc một dự án cụ thể |

**Ví dụ Request:**
```
GET /tasks?page=1&limit=5&status=TODO&projectId=660e8400-e29b-41d4-a716-446655440001
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "title": "Triển khai tính năng đăng nhập",
      "description": "Xây dựng endpoint đăng nhập JWT",
      "status": "TODO",
      "projectId": "660e8400-e29b-41d4-a716-446655440001",
      "assigneeId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "project": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Alpha Project" },
      "assignee": { "id": "550e8400-e29b-41d4-a716-446655440000", "email": "alice@test.com" }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 42
  }
}
```

> **Lưu ý:** Tham số lọc là `status` (không phải `statusFilter`). Kết quả khớp chính xác theo giá trị enum.

---

### PATCH /tasks/:id

Cập nhật task. Chỉ những người dùng thuộc dự án của task mới được phép cập nhật.

**Path Parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| id | UUID | ID của task |

**Request Body:**
```json
{
  "title": "Tiêu đề task đã cập nhật",
  "description": "Mô tả đã cập nhật",
  "status": "IN_PROGRESS",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| title | string | không | Tiêu đề task mới |
| description | string | không | Mô tả mới |
| status | string | không | Phải là `TODO`, `IN_PROGRESS`, hoặc `DONE` |
| assigneeId | UUID | có | ID người dùng được giao lại task |

**Response 200:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "title": "Tiêu đề task đã cập nhật",
  "description": "Mô tả đã cập nhật",
  "status": "IN_PROGRESS",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

### DELETE /tasks/:id

Xóa task. Chỉ những người dùng thuộc dự án của task mới được phép xóa.

**Path Parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| id | UUID | ID của task |

**Response 200:**
```json
{
  "message": "deleted"
}
```

---

## Người Dùng Mặc Định

Các người dùng sau được tạo sẵn khi khởi động lần đầu:

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| admin@test.com | Admin123! | ADMIN |
| alice@test.com | Alice123! | USER |
| bob@test.com | Bob123! | USER |
| charlie@test.com | Charlie123! | USER |

---

## Giá Trị Trạng Thái (Status)

| Giá trị | Mô tả |
|---------|-------|
| `TODO` | Task chưa bắt đầu |
| `IN_PROGRESS` | Task đang được thực hiện |
| `DONE` | Task đã hoàn thành |

Quy tắc chuyển trạng thái: task ở trạng thái `DONE` không thể chuyển ngược về `TODO` hoặc `IN_PROGRESS`.
