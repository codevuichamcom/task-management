# Task Management System Backend

A NestJS REST API for practicing tester workflows such as API validation, SQL verification, authorization checks, and data consistency analysis.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Ports `3000` and `5432` available

### Start the system

```bash
docker-compose up --build
```

The application will:

1. Start a PostgreSQL 15 database
2. Build and start the NestJS API
3. Seed the database with sample users, projects, and tasks on first startup

API base URL: `http://localhost:3000`

Swagger UI: `http://localhost:3000/api-docs`

### Stop the system

```bash
docker-compose down
```

To reset the database volume:

```bash
docker-compose down -v
```

## Seed Users

The following accounts are created automatically on first startup:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin123! | ADMIN |
| alice@test.com | Alice123! | USER |
| bob@test.com | Bob123! | USER |
| charlie@test.com | Charlie123! | USER |
| diana@test.com | Diana123! | USER |
| eric@test.com | Eric123! | USER |
| fiona@test.com | Fiona123! | USER |
| george@test.com | George123! | USER |
| helen@test.com | Helen123! | USER |

## Seed Data

On first startup, the database is seeded with:

- `11` projects
- `40` tasks
- multiple status combinations across `TODO`, `IN_PROGRESS`, and `DONE`
- assigned and unassigned tasks
- empty projects and users with no assignments for reporting and SQL practice

## API Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /auth/register | No | Register a new user |
| POST | /auth/login | No | Login and get JWT token |
| POST | /projects | Yes | Create a new project |
| GET | /projects | Yes | List current user's projects |
| PATCH | /projects/:id | Yes | Update a project owned by the current user |
| DELETE | /projects/:id | Yes | Delete a project owned by the current user |
| POST | /tasks | Yes | Create a new task |
| POST | /tasks/batch | Yes | Create multiple tasks and return per-row results |
| GET | /tasks | Yes | List tasks with filters and pagination |
| PATCH | /tasks/:id | Yes | Update a task if current user is the project owner or assignee |
| DELETE | /tasks/:id | Yes | Delete a task if current user is the project owner or assignee |

### Authentication

After logging in, include the token in all protected requests:

```text
Authorization: Bearer <access_token>
```

### Task List Query Parameters

```text
GET /tasks?page=1&limit=10&statusFilter=TODO&projectId=<uuid>
```

`statusFilter` is the primary query parameter. The legacy alias `status` is still accepted temporarily for compatibility.

### Batch Task Import

The API also supports a lightweight batch practice endpoint:

```text
POST /tasks/batch
```

Request body shape:

```json
{
  "items": [
    {
      "clientRef": "row-001",
      "title": "Batch row 1",
      "description": "Created from a batch request",
      "status": "TODO",
      "projectId": "<uuid>",
      "assigneeId": "<uuid>"
    }
  ]
}
```

The response includes `total`, `createdCount`, `failedCount`, and per-row results so testers can practice reconciliation and mixed-success scenarios.

## PostgreSQL Direct Access

| Setting | Value |
|---------|-------|
| Host | localhost |
| Port | 5432 |
| Database | taskdb |
| Username | postgres |
| Password | postgres |

### Connect via psql

```bash
psql -h localhost -p 5432 -U postgres -d taskdb
```

### Useful queries

```sql
SELECT id, email, role, "createdAt" FROM users;

SELECT p.id, p.name, u.email AS owner, p."createdAt"
FROM projects p
JOIN users u ON p."ownerId" = u.id;

SELECT t.id, t.title, t.status, p.name AS project,
       u.email AS assignee, t."createdAt"
FROM tasks t
JOIN projects p ON t."projectId" = p.id
LEFT JOIN users u ON t."assigneeId" = u.id
ORDER BY t."createdAt";
```

## Documentation

- API specification: `docs/api-spec.md`
- Jira-style requirements: `docs/jira-tickets.md`
- Overview: `docs/qa-overview.md`

## Development Without Docker

If you prefer to run without Docker, configure a local PostgreSQL instance and then:

```bash
cp .env.example .env
npm install
npm run start:dev
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | ^10 | Web framework |
| TypeORM | ^0.3 | ORM / database layer |
| PostgreSQL | 15 | Relational database |
| passport-jwt | ^4 | JWT authentication |
| class-validator | ^0.14 | Validation decorators |
| bcryptjs | ^2.4 | Password hashing |
| Docker Compose | v3.8 | Local orchestration |
