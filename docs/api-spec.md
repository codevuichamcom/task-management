# Task Management API Specification

**Base URL:** `http://localhost:3000`  
**Content-Type:** `application/json`  
**Authentication:** Bearer token (JWT) via `Authorization: Bearer <access_token>`

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## POST /auth/register

Register a new user.

**Request**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | string | yes | Must be a valid email |
| password | string | yes | Minimum 8 characters |
| role | string | no | `USER` or `ADMIN`, defaults to `USER` |

**Response 201**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "USER"
}
```

## POST /auth/login

Authenticate and receive a JWT token.

**Request**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

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

Create a new project. The authenticated user becomes the owner.

**Request**

```json
{
  "name": "My New Project"
}
```

**Response 201**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "My New Project",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## GET /projects

List projects owned by the authenticated user.

## PATCH /projects/:id

Update a project. Only the project owner may update it.

## DELETE /projects/:id

Delete a project and all associated tasks. Only the project owner may delete it.

**Response 200**

```json
{
  "message": "deleted"
}
```

## POST /tasks

Create a new task.

**Request**

```json
{
  "title": "Implement login feature",
  "description": "Build the JWT login endpoint",
  "status": "TODO",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | Non-empty |
| description | string | no | Optional |
| status | string | no | `TODO`, `IN_PROGRESS`, or `DONE` |
| projectId | UUID | yes | Must reference an existing project |
| assigneeId | UUID | no | Must reference an existing user when provided |

## GET /tasks

List tasks with optional filtering and pagination.

| Query Param | Type | Notes |
|-------------|------|-------|
| page | number | 1-indexed, default `1` |
| limit | number | default `10` |
| statusFilter | string | Primary status filter, exact case-insensitive match |
| status | string | Legacy alias for `statusFilter`, still accepted temporarily |
| projectId | UUID | Filter by project |

**Example**

```text
GET /tasks?page=1&limit=5&statusFilter=TODO&projectId=660e8400-e29b-41d4-a716-446655440001
```

**Response 200**

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

## PATCH /tasks/:id

Update a task. Only the project owner or the current assignee may update it.

**Request**

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "assigneeId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## DELETE /tasks/:id

Delete a task. Only the project owner or the current assignee may delete it.
