# Task Management System — QA Training Backend

A NestJS REST API built for QA manual testing practice. The system contains **12 intentional bugs** across validation, authorization, business logic, SQL queries, and API spec compliance. Your job as a QA tester is to find them.

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports `3000` and `5432` available on your machine

### Start the system

```bash
docker-compose up --build
```

The application will:
1. Start a PostgreSQL 15 database
2. Build and start the NestJS API
3. Auto-seed the database with test users, projects, and tasks on first run

The API is available at: `http://localhost:3000`

### Stop the system

```bash
docker-compose down
```

To also remove the database volume (reset all data):

```bash
docker-compose down -v
```

---

## Seed Users

The following accounts are created automatically on first startup:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin123! | ADMIN |
| alice@test.com | Alice123! | USER |
| bob@test.com | Bob123! | USER |
| charlie@test.com | Charlie123! | USER |

---

## Seed Data

On first startup, the following data is created:

**Projects:**
| Name | Owner |
|------|-------|
| Alpha Project | alice@test.com |
| Beta Project | alice@test.com |
| Gamma Project | bob@test.com |
| Delta Project | charlie@test.com |

**Tasks (10 total):** Distributed across all four projects with various statuses (TODO, IN_PROGRESS, DONE) and assignees.

---

## API Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /auth/register | No | Register a new user |
| POST | /auth/login | No | Login and get JWT token |
| POST | /projects | Yes | Create a new project |
| GET | /projects | Yes | List projects |
| PATCH | /projects/:id | Yes | Update a project |
| DELETE | /projects/:id | Yes | Delete a project |
| POST | /tasks | Yes | Create a new task |
| GET | /tasks | Yes | List tasks (with filters + pagination) |
| PATCH | /tasks/:id | Yes | Update a task |
| DELETE | /tasks/:id | Yes | Delete a task |

### Authentication

After logging in, include the token in all protected requests:

```
Authorization: Bearer <your-token-here>
```

### Task List Query Parameters

```
GET /tasks?page=1&limit=10&status=TODO&projectId=<uuid>
```

---

## PostgreSQL Direct Access

You can connect directly to the database for verification and debugging:

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
-- List all users
SELECT id, email, role, "createdAt" FROM users;

-- List all projects with owner email
SELECT p.id, p.name, u.email AS owner, p."createdAt"
FROM projects p
JOIN users u ON p."ownerId" = u.id;

-- List all tasks with project name and assignee email
SELECT t.id, t.title, t.status, p.name AS project,
       u.email AS assignee, t."createdAt"
FROM tasks t
JOIN projects p ON t."projectId" = p.id
LEFT JOIN users u ON t."assigneeId" = u.id
ORDER BY t."createdAt";

-- Check for orphaned tasks (tasks with no matching project)
SELECT t.id, t.title, t."projectId"
FROM tasks t
LEFT JOIN projects p ON t."projectId" = p.id
WHERE p.id IS NULL;
```

---

## Notes for QA Testers

This system is intentionally broken in several places. As you test, look for:

### Areas to Investigate

1. **Input Validation** — Try submitting requests with missing fields, wrong data types, empty strings, and invalid enum values. Do you get appropriate 400 errors?

2. **Authentication** — What happens when you call protected endpoints without a token, with an expired token, or with a malformed token?

3. **Authorization** — Can User A access, modify, or delete resources that belong to User B? Test this across both projects and tasks.

4. **Business Logic** — When you update a task's status, does the response reflect the value you sent? Try all three status values.

5. **API Response Shapes** — Compare every response body against the API spec in `docs/api-spec.md`. Are all documented fields present? Are field names exactly as documented? Are types correct (number vs string)?

6. **Pagination** — Test `GET /tasks` with various `page` and `limit` values. Does page 1 return the first set of results? Is the `meta` object accurate?

7. **Filtering** — Test the status filter with exact values (`TODO`, `IN_PROGRESS`, `DONE`) and with partial strings. Does the filter behave as expected?

8. **Cascade Operations** — When you delete a project, what happens to its tasks? Can you still retrieve them?

### Tips

- Use a tool like **Postman**, **Insomnia**, or **curl** to send requests
- Log in as different users and use their tokens to test cross-user access
- Check the database directly via psql to verify what was actually stored vs what the API returned
- Read `docs/api-spec.md` carefully — it is the source of truth for expected behavior
- Read `docs/jira-tickets.md` for the original requirements behind each feature

### Reporting Bugs

When reporting a bug, include:
- The endpoint and HTTP method
- The request body / query params used
- The expected response (from the spec)
- The actual response received
- Steps to reproduce
- Severity assessment (High / Medium / Low)

---

## Project Structure

```
task-management/
├── src/
│   ├── main.ts                        # Application entry point
│   ├── app.module.ts                  # Root module
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── users/
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── projects/
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   ├── projects.module.ts
│   │   ├── entities/
│   │   │   └── project.entity.ts
│   │   └── dto/
│   │       ├── create-project.dto.ts
│   │       └── update-project.dto.ts
│   ├── tasks/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   ├── entities/
│   │   │   └── task.entity.ts
│   │   └── dto/
│   │       ├── create-task.dto.ts
│   │       ├── update-task.dto.ts
│   │       └── query-task.dto.ts
│   └── database/
│       ├── seed.service.ts
│       └── seed.module.ts
├── docs/
│   ├── api-spec.md                    # API specification (source of truth)
│   ├── jira-tickets.md                # Original requirements
│   └── known-bugs.md                  # INTERNAL — bug answer key
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Development (without Docker)

If you prefer to run without Docker, you need a local PostgreSQL instance.

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your local DB credentials

# Install dependencies
npm install

# Start in development mode (with watch)
npm run start:dev
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | ^10 | Web framework |
| TypeORM | ^0.3 | ORM / database layer |
| PostgreSQL | 15 | Relational database |
| passport-jwt | ^4 | JWT authentication |
| class-validator | ^0.14 | DTO validation decorators |
| bcryptjs | ^2.4 | Password hashing |
| Docker Compose | v3.8 | Container orchestration |
