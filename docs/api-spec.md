# Task Management API — Specification

**Base URL:** `http://localhost:3000`
**Content-Type:** `application/json`
**Authentication:** Bearer token (JWT) via `Authorization: Bearer <token>` header

---

## Authentication

All endpoints except `POST /auth/register` and `POST /auth/login` require a valid JWT token.

Tokens expire after **24 hours**. Obtain a token by logging in.

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Bad Request — invalid or missing fields |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — authenticated but not permitted |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — duplicate resource (e.g. email already registered) |
| 500 | Internal Server Error |

---

## Auth Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Valid email address, must be unique |
| password | string | yes | Minimum 8 characters |
| role | string | no | `USER` or `ADMIN`, defaults to `USER` |

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

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Registered email |
| password | string | yes | Account password |

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

> **Note:** The `access_token` field contains the JWT to use in subsequent requests.

**Response 401:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## Projects Endpoints

All project endpoints require authentication.

### POST /projects

Create a new project. The authenticated user becomes the owner.

**Request Body:**
```json
{
  "name": "My New Project"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Project name, non-empty |

**Response 201:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "My New Project",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### GET /projects

List all projects owned by the authenticated user.

**Response 200:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Alpha Project",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-10T08:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "name": "Beta Project",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-12T09:15:00.000Z"
  }
]
```

---

### PATCH /projects/:id

Update a project. Only the project owner may update it.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Project ID |

**Request Body:**
```json
{
  "name": "Updated Project Name"
}
```

**Response 200:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Updated Project Name",
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

Delete a project and all its associated tasks. Only the project owner may delete it.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Project ID |

**Response 200:**
```json
{
  "message": "deleted"
}
```

---

## Tasks Endpoints

All task endpoints require authentication.

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Implement login feature",
  "description": "Build the JWT login endpoint",
  "status": "TODO",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Task title, non-empty |
| description | string | no | Detailed description |
| status | string | no | `TODO`, `IN_PROGRESS`, or `DONE`. Defaults to `TODO` |
| projectId | UUID | yes | ID of the parent project |
| assigneeId | UUID | no | User ID to assign the task to |

**Response 201:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "title": "Implement login feature",
  "description": "Build the JWT login endpoint",
  "status": "TODO",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

### GET /tasks

List tasks with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number, 1-indexed. page=1 returns the first page. Default: 1 |
| limit | number | Items per page. Default: 10 |
| statusFilter | string | Filter by exact status value: `TODO`, `IN_PROGRESS`, or `DONE` |
| projectId | UUID | Filter tasks belonging to a specific project |

**Example Request:**
```
GET /tasks?page=1&limit=5&statusFilter=TODO&projectId=660e8400-e29b-41d4-a716-446655440001
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "title": "Implement login feature",
      "description": "Build the JWT login endpoint",
      "status": "TODO",
      "projectId": "660e8400-e29b-41d4-a716-446655440001",
      "assigneeId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "project": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Alpha Project"
      },
      "assignee": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "alice@test.com"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 42
  }
}
```

> **Note:** The `page` field in `meta` is a number. The `statusFilter` query parameter performs an exact, case-insensitive match against the status enum values.

---

### PATCH /tasks/:id

Update a task. Only users who belong to the task's project may update it.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Task ID |

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | no | New task title |
| description | string | no | New description |
| status | string | no | Must be `TODO`, `IN_PROGRESS`, or `DONE`. Setting to `IN_PROGRESS` sets status to `IN_PROGRESS`. |
| assigneeId | UUID | no | Reassign to another user |

**Response 200:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

### DELETE /tasks/:id

Delete a task. Only users who belong to the task's project may delete it.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Task ID |

**Response 200:**
```json
{
  "message": "deleted"
}
```

---

## Seed Users

The following users are pre-loaded on first startup:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin123! | ADMIN |
| alice@test.com | Alice123! | USER |
| bob@test.com | Bob123! | USER |
| charlie@test.com | Charlie123! | USER |

---

## Status Values

Tasks support the following status values:

| Value | Description |
|-------|-------------|
| `TODO` | Task not yet started |
| `IN_PROGRESS` | Task currently being worked on |
| `DONE` | Task completed |

Valid status transitions: any status can be set to any other status value.
