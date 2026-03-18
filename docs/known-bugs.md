# Known Bugs — Hidden Reference Document

> **INTERNAL USE ONLY — DO NOT SHARE WITH QA TESTERS**
> This document is the answer key for the QA training exercise.
> Each bug listed here corresponds to a deliberate defect in the codebase.

---

## BUG-01 — Missing Global ValidationPipe

**Category:** Validation
**Severity:** High
**Affected Endpoints:** All — POST /auth/register, POST /auth/login, POST /tasks, PATCH /tasks/:id, POST /projects, PATCH /projects/:id

**Root Cause:**
`src/main.ts` does not call `app.useGlobalPipes(new ValidationPipe())`. As a result, all `class-validator` decorators in DTOs (`@IsEmail`, `@IsString`, `@IsNotEmpty`, `@IsEnum`, `@IsUUID`, etc.) are never executed.

**How to Reproduce:**
1. POST /auth/register with body `{ "email": "not-an-email", "password": 12345 }`
2. Expected: 400 Bad Request with validation error messages
3. Actual: 201 Created — the invalid payload is accepted and persisted

**Expected Behavior:**
Invalid request bodies should return HTTP 400 with a descriptive list of validation errors.

**Actual Behavior:**
All payloads pass through to the service layer regardless of field type or format. The database may throw a constraint error for extreme cases (e.g. null required fields), returning an unhandled 500 instead of a clean 400.

**Fix:**
```typescript
// src/main.ts
import { ValidationPipe } from '@nestjs/common';
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```

**SQL to Verify:**
```sql
SELECT email FROM users WHERE email NOT LIKE '%@%';
```

---

## BUG-02 — Invalid Status Value Accepted on Task Update

**Category:** Validation
**Severity:** Medium
**Affected Endpoints:** PATCH /tasks/:id

**Root Cause:**
`src/tasks/dto/update-task.dto.ts` declares `status` as `string` with no `@IsEnum(TaskStatus)` decorator. Even if ValidationPipe were enabled, any string would pass the `@IsString()` check.

**How to Reproduce:**
1. Login and obtain a JWT token
2. PATCH /tasks/:id with body `{ "status": "INVALID_VALUE" }`
3. Expected: 400 Bad Request — invalid enum value
4. Actual: Either accepted silently or causes a 500 PostgreSQL enum constraint error

**Expected Behavior:**
Request rejected with 400 and message indicating valid status values are `TODO`, `IN_PROGRESS`, `DONE`.

**Actual Behavior:**
Without ValidationPipe (BUG-01), the string passes DTO validation. TypeORM then attempts to persist the invalid enum to PostgreSQL, which throws a DB-level error resulting in an unhandled 500 Internal Server Error.

**Fix:**
```typescript
// update-task.dto.ts
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

@IsOptional()
@IsEnum(TaskStatus)
status?: TaskStatus;
```

---

## BUG-03 — Authorization: All Projects Visible / Editable by Any User

**Category:** Authorization
**Severity:** High
**Affected Endpoints:** GET /projects, PATCH /projects/:id, DELETE /projects/:id

**Root Cause:**
`src/projects/projects.service.ts` — `findAll()` calls `this.projectsRepository.find()` with no filter. `update()` and `remove()` call `findOne()` by ID only, with no check that `ownerId === userId`.

**How to Reproduce:**
1. Login as alice@test.com, create a project, note the project ID
2. Login as bob@test.com
3. GET /projects — Actual: Returns alice's projects too (all projects in DB)
4. PATCH /projects/:alice-project-id with `{ "name": "Hacked" }` — Actual: 200, project renamed
5. DELETE /projects/:alice-project-id — Actual: 200, project deleted

**Expected Behavior:**
- GET /projects returns only projects where `ownerId = current user`
- PATCH /DELETE return 403 Forbidden if current user is not the owner

**Actual Behavior:**
Any authenticated user can view, modify, and delete any project in the system.

**SQL to Verify:**
```sql
-- Check project ownership
SELECT id, name, "ownerId" FROM projects;

-- Simulate filtered query (what the code SHOULD do)
SELECT id, name FROM projects WHERE "ownerId" = '<alice-user-id>';
```

---

## BUG-04 — Authorization: Task Ownership Not Checked

**Category:** Authorization
**Severity:** High
**Affected Endpoints:** PATCH /tasks/:id, DELETE /tasks/:id

**Root Cause:**
`src/tasks/tasks.service.ts` — `update()` and `remove()` accept any authenticated user's `userId` but never verify the user has any relationship to the task or its project.

**How to Reproduce:**
1. Login as alice@test.com
2. Login as bob@test.com, note bob's token
3. Using bob's token: PATCH /tasks/:alice-task-id with `{ "title": "Bob was here" }`
4. Expected: 403 Forbidden
5. Actual: 200 OK — task is modified

**Expected Behavior:**
Only members of a task's project (or the task's assignee) should be able to update or delete the task. Others receive 403.

**Actual Behavior:**
Any authenticated user can modify or delete any task in the system.

**SQL to Verify:**
```sql
-- Verify task was modified by unauthorized user
SELECT id, title, "projectId", "assigneeId" FROM tasks WHERE id = '<task-id>';
```

---

## BUG-05 — Status Transition Flipped: IN_PROGRESS Sets Status to TODO

**Category:** Logic
**Severity:** High
**Affected Endpoints:** PATCH /tasks/:id

**Root Cause:**
`src/tasks/tasks.service.ts` — the `update()` method contains an inverted conditional:

```typescript
if (dto.status === 'IN_PROGRESS') {
  task.status = TaskStatus.TODO;   // BUG: should be TaskStatus.IN_PROGRESS
} else if (dto.status) {
  task.status = dto.status as TaskStatus;
}
```

When a user sends `{ "status": "IN_PROGRESS" }`, the task is actually saved as `TODO`.

**How to Reproduce:**
1. Find a task with status `TODO`
2. PATCH /tasks/:id with `{ "status": "IN_PROGRESS" }`
3. Expected: Task status becomes `IN_PROGRESS`
4. Actual: Task status remains `TODO`

**Expected Behavior:**
Setting status to `IN_PROGRESS` updates the task's status to `IN_PROGRESS`.

**Actual Behavior:**
Setting status to `IN_PROGRESS` silently keeps the status as `TODO`. Setting status to `TODO` or `DONE` works correctly via the `else if` branch.

**SQL to Verify:**
```sql
-- After PATCH with status=IN_PROGRESS, task should show IN_PROGRESS
SELECT id, title, status FROM tasks WHERE id = '<task-id>';
```

---

## BUG-06 — Project Delete Orphans Tasks

**Category:** Logic
**Severity:** Medium
**Affected Endpoints:** DELETE /projects/:id

**Root Cause:**
`src/projects/entities/project.entity.ts` — the `@OneToMany` relation has no `cascade: ['remove']` option. `src/projects/projects.service.ts` — `remove()` only deletes the project row without first deleting or reassigning the related tasks.

**How to Reproduce:**
1. Login, create a project with 3 tasks
2. Note the project ID and task IDs
3. DELETE /projects/:id
4. Expected: Project and all 3 tasks are deleted
5. Actual: Project row deleted, 3 tasks remain in the database with a dangling `projectId` foreign key

**Expected Behavior:**
Deleting a project should cascade-delete all tasks belonging to that project.

**Actual Behavior:**
Tasks remain orphaned in the database. Since `projectId` references a now-deleted row, the tasks become permanently unreachable via normal API endpoints (GET /tasks?projectId=... returns nothing). They still exist in the DB.

**SQL to Verify:**
```sql
-- After deleting project, check for orphaned tasks
SELECT t.id, t.title, t."projectId"
FROM tasks t
LEFT JOIN projects p ON t."projectId" = p.id
WHERE p.id IS NULL;
```

---

## BUG-07 — Duplicate Rows from Double JOIN

**Category:** SQL
**Severity:** Medium
**Affected Endpoints:** GET /tasks

**Root Cause:**
`src/tasks/tasks.service.ts` — the query builder joins `task.project` twice under different aliases:

```typescript
.leftJoinAndSelect('task.project', 'project')
.leftJoin('task.project', 'p2')   // BUG: redundant join on same relation
```

The extra `.leftJoin('task.project', 'p2')` causes TypeORM's underlying SQL to have duplicate join logic, which can produce duplicated rows in the result set when the project has multiple related records or when combined with `getManyAndCount()`.

**How to Reproduce:**
1. GET /tasks with no filters
2. Compare the `total` in `meta` vs the actual number of unique task IDs in `data`
3. Expected: `total` equals unique task count, each task appears once
4. Actual: `total` may be inflated, duplicate task objects may appear in `data`

**Expected Behavior:**
Each task appears exactly once in the result set. `total` reflects the true count of distinct tasks.

**Actual Behavior:**
Tasks associated with projects that have multiple tasks can appear duplicated. `getManyAndCount()` may return an inflated total.

**SQL to Verify:**
```sql
-- Check for duplicate task IDs in the query
SELECT "task"."id", COUNT(*) as occurrences
FROM tasks "task"
LEFT JOIN projects "project" ON "project"."id" = "task"."projectId"
LEFT JOIN projects "p2" ON "p2"."id" = "task"."projectId"
GROUP BY "task"."id"
HAVING COUNT(*) > 1;
```

---

## BUG-08 — Pagination Off-By-One: Page 1 Skips First Page

**Category:** SQL / Pagination
**Severity:** Medium
**Affected Endpoints:** GET /tasks

**Root Cause:**
`src/tasks/tasks.service.ts` — the offset formula is wrong:

```typescript
const offset = pageNum * limit;   // BUG: should be (pageNum - 1) * limit
```

For `page=1, limit=10`:
- Correct offset: `(1 - 1) * 10 = 0` (returns rows 1–10)
- Actual offset: `1 * 10 = 10` (skips first 10 rows, returns rows 11–20)

For `page=0, limit=10`:
- Actual offset: `0 * 10 = 0` (accidentally returns the first page)

**How to Reproduce:**
1. Seed the database (10 tasks exist)
2. GET /tasks?page=1&limit=5
3. Expected: Returns first 5 tasks (rows 1–5)
4. Actual: Returns tasks 6–10 (offset of 5 applied)
5. GET /tasks?page=0&limit=5 — Actual: Returns tasks 1–5 (the "correct" first page)

**Expected Behavior:**
`page=1` returns the first page of results. `page=2` returns the second page, etc.

**Actual Behavior:**
`page=1` skips the first page. `page=0` behaves like the correct `page=1`. There is no way to retrieve the first page using page=1.

**SQL to Verify:**
```sql
-- Manually check what page=1,limit=5 should return
SELECT * FROM tasks ORDER BY "createdAt" LIMIT 5 OFFSET 0;

-- What the buggy code actually does for page=1, limit=5
SELECT * FROM tasks ORDER BY "createdAt" LIMIT 5 OFFSET 5;
```

---

## BUG-09 — Status Filter Uses ILIKE Wildcard (Partial Match)

**Category:** SQL
**Severity:** Medium
**Affected Endpoints:** GET /tasks?status=...

**Root Cause:**
`src/tasks/tasks.service.ts` — the status filter uses a wildcard ILIKE pattern:

```typescript
qb.andWhere('task.status ILIKE :status', { status: `%${query.status}%` });
```

The `%` wildcards on both sides turn this into a substring match. The query parameter `status` is also misnamed — the spec documents it as `statusFilter` but the implementation reads `status`.

**How to Reproduce:**
1. GET /tasks?status=DO
2. Expected: 0 results or 400 error (no status value is exactly "DO")
3. Actual: Returns both TODO and DONE tasks (both contain the substring "DO")

**Expected Behavior:**
`status=TODO` returns only tasks with status exactly `TODO`. `status=DONE` returns only DONE tasks. The query parameter should be named `statusFilter` per spec.

**Actual Behavior:**
- `status=DO` matches `TODO` and `DONE`
- `status=IN` matches `IN_PROGRESS`
- `status=O` matches `TODO`, `IN_PROGRESS`, and `DONE`
- The parameter name is `status` in code but `statusFilter` in the API spec (mismatch)

**SQL to Verify:**
```sql
-- Simulates what the buggy code does for status=DO
SELECT id, title, status FROM tasks WHERE status ILIKE '%DO%';

-- What it should do (exact match)
SELECT id, title, status FROM tasks WHERE status = 'TODO';
```

---

## BUG-10 — Login Response Fields Mismatch

**Category:** API Spec
**Severity:** High
**Affected Endpoints:** POST /auth/login

**Root Cause:**
`src/auth/auth.service.ts` — the `login()` method returns:
```json
{ "token": "...", "userId": "..." }
```

But the API spec documents the response as:
```json
{ "access_token": "...", "user": { "id": "...", "email": "..." } }
```

**How to Reproduce:**
1. POST /auth/login with valid credentials
2. Expected: Response body contains `access_token` and `user` object
3. Actual: Response body contains `token` and `userId` — different field names, no email in response

**Expected Behavior:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alice@test.com"
  }
}
```

**Actual Behavior:**
```json
{
  "token": "eyJhbGci...",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Impact:**
Any frontend or API client that follows the spec and reads `response.access_token` will receive `undefined`. The token cannot be used without reading `response.token` instead.

---

## BUG-11 — Pagination Meta: page Returned as String

**Category:** API Spec
**Severity:** Low
**Affected Endpoints:** GET /tasks

**Root Cause:**
`src/tasks/tasks.service.ts` — query params are strings in NestJS by default. The `page` value is read from `query.page` (a string) and placed directly into the `meta` response without being parsed to a number:

```typescript
const page = query.page;   // string, e.g. "2"
// ...
return {
  meta: {
    page: query.page,  // BUG: returns "2" (string) instead of 2 (number)
    limit,             // limit IS parsed to number via parseInt
    total,
  }
};
```

**How to Reproduce:**
1. GET /tasks?page=2&limit=5
2. Inspect the response `meta.page` field
3. Expected: `"meta": { "page": 2, "limit": 5, "total": 10 }` (page as integer)
4. Actual: `"meta": { "page": "2", "limit": 5, "total": 10 }` (page as string)

**Expected Behavior:**
`meta.page` is a number (integer).

**Actual Behavior:**
`meta.page` is a string. `meta.limit` and `meta.total` are numbers, creating an inconsistent response type.

**SQL to Verify:** N/A (application-level bug)

---

## BUG-12 — Create Project Returns Incomplete Response

**Category:** API Spec
**Severity:** Low
**Affected Endpoints:** POST /projects

**Root Cause:**
`src/projects/projects.service.ts` — the `create()` method only returns `id` and `name`:

```typescript
return { id: saved.id, name: saved.name };
```

But the API spec documents the response as containing `id`, `name`, `ownerId`, and `createdAt`.

**How to Reproduce:**
1. POST /projects with `{ "name": "Test Project" }`
2. Expected: Response contains `id`, `name`, `ownerId`, `createdAt`
3. Actual: Response contains only `id` and `name`

**Expected Behavior:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Test Project",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Actual Behavior:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Test Project"
}
```

**Impact:**
Client applications cannot obtain the `ownerId` or `createdAt` from the creation response. They must make a separate GET request to retrieve the full object.

**SQL to Verify:**
```sql
-- Confirm ownerId is stored but not returned
SELECT id, name, "ownerId", "createdAt" FROM projects ORDER BY "createdAt" DESC LIMIT 5;
```

---

## Summary Table

| Bug ID | Category | Severity | Endpoint(s) |
|--------|----------|----------|-------------|
| BUG-01 | Validation | High | All POST/PATCH |
| BUG-02 | Validation | Medium | PATCH /tasks/:id |
| BUG-03 | Authorization | High | GET/PATCH/DELETE /projects |
| BUG-04 | Authorization | High | PATCH/DELETE /tasks/:id |
| BUG-05 | Logic | High | PATCH /tasks/:id |
| BUG-06 | Logic | Medium | DELETE /projects/:id |
| BUG-07 | SQL | Medium | GET /tasks |
| BUG-08 | SQL | Medium | GET /tasks |
| BUG-09 | SQL | Medium | GET /tasks |
| BUG-10 | API Spec | High | POST /auth/login |
| BUG-11 | API Spec | Low | GET /tasks |
| BUG-12 | API Spec | Low | POST /projects |
