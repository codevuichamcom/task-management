# JIRA Tickets — Task Management System

**Project:** TMS
**Sprint:** 1
**Status Legend:** To Do | In Progress | Done | Blocked

---

## TASK-001 — User Registration

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As a new user, I want to register an account so that I can access the task management system.

**Acceptance Criteria:**
- User can submit an email and password to create an account
- Email must be unique across the system; duplicate registration returns an error
- Password is stored securely (hashed, never plaintext)
- Successful registration returns the created user's id, email, and role
- Default role is USER if not specified

**Notes:**
- Admin accounts can be created by passing `role: "ADMIN"` in the request body
- No email verification required for this sprint

---

## TASK-002 — User Login

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As a registered user, I want to log in with my email and password to receive an authentication token.

**Acceptance Criteria:**
- User submits email and password
- Returns a JWT token on success
- Returns 401 if credentials are invalid
- Token must be usable for all protected endpoints

**Notes:**
- Token expiry is 24 hours
- The response structure should follow the project's standard auth response format

---

## TASK-003 — Create Project

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As an authenticated user, I want to create a project so I can organize my tasks.

**Acceptance Criteria:**
- Authenticated user can POST to /projects with a project name
- The creating user automatically becomes the project owner
- Response includes the full project object including id, name, ownerId, and createdAt

**Notes:**
- Project name must not be empty

---

## TASK-004 — List Projects

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As a user, I want to see my projects so I can navigate to the right one.

**Acceptance Criteria:**
- Authenticated user can GET /projects
- Users should only see their own projects
- Response is an array of project objects

**Notes:**
- Behavior for admin users seeing all projects vs only their own is not yet defined — defer to sprint 2

---

## TASK-005 — Update Project

**Type:** Story
**Priority:** Medium
**Status:** Done

**Description:**
As a project owner, I want to rename my project.

**Acceptance Criteria:**
- Authenticated user can PATCH /projects/:id with a new name
- Returns 404 if project does not exist
- Returns updated project object

**Notes:**
- It is assumed that only the owner should be able to update the project name

---

## TASK-006 — Delete Project

**Type:** Story
**Priority:** Medium
**Status:** Done

**Description:**
As a project owner, I want to delete a project I no longer need.

**Acceptance Criteria:**
- Authenticated user can DELETE /projects/:id
- Returns `{ "message": "deleted" }` on success
- Returns 404 if project not found

**Notes:**
- What happens to tasks belonging to a deleted project is left to the developer's discretion for now
- Only the project owner should be able to delete

---

## TASK-007 — Create Task

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As a user, I want to create a task within a project.

**Acceptance Criteria:**
- Authenticated user can POST to /tasks
- Task must belong to a valid project (projectId required)
- Task can optionally be assigned to a user (assigneeId)
- Status defaults to TODO if not provided
- Response includes the full task object

**Notes:**
- Validate task inputs before persisting — required fields must be enforced

---

## TASK-008 — List Tasks

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As a user, I want to list tasks so I can see what needs to be done.

**Acceptance Criteria:**
- Authenticated user can GET /tasks
- Results include related project and assignee details
- Tasks can be filtered by project and status
- Results are paginated

**Notes:**
- No specific mention of exact vs partial match for status filter — use whatever makes sense
- Pagination details to be finalized

---

## TASK-009 — Paginate Task Results

**Type:** Task
**Priority:** Medium
**Status:** Done

**Description:**
Task list results should be paginated to avoid returning large datasets.

**Acceptance Criteria:**
- GET /tasks accepts `page` and `limit` query parameters
- Response includes a `meta` object with `page`, `limit`, and `total` fields
- Default page size is 10

**Notes:**
- Pagination should be consistent — page 1 should return the first set of results
- No specific offset formula documented; developer to implement standard pagination

---

## TASK-010 — Filter Tasks by Status

**Type:** Task
**Priority:** Medium
**Status:** Done

**Description:**
Users should be able to filter the task list by status value.

**Acceptance Criteria:**
- GET /tasks accepts a query parameter to filter by status
- Filtering by `TODO` returns only TODO tasks
- Filtering by `IN_PROGRESS` returns only IN_PROGRESS tasks
- Filtering by `DONE` returns only DONE tasks

**Notes:**
- Parameter name not finalized — check with lead developer
- Whether this is exact match or partial match left to developer judgment

---

## TASK-011 — Update Task

**Type:** Story
**Priority:** High
**Status:** Done

**Description:**
As a user, I want to update a task's title, description, status, or assignee.

**Acceptance Criteria:**
- Authenticated user can PATCH /tasks/:id
- Any combination of title, description, status, assigneeId can be updated
- Returns the updated task object

**Notes:**
- Status validation: status must be one of the valid enum values
- Only relevant project members should be able to update tasks

---

## TASK-012 — Task Status Workflow

**Type:** Task
**Priority:** Medium
**Status:** Done

**Description:**
Define and enforce valid task status transitions.

**Acceptance Criteria:**
- Tasks start in TODO status by default
- Statuses can be changed by authorized users
- Setting status to IN_PROGRESS should correctly update the task to IN_PROGRESS
- Setting status to DONE should correctly update the task to DONE

**Notes:**
- No specific transition restrictions required (e.g. DONE can go back to TODO)
- Make sure the update logic correctly applies the status provided in the request

---

## TASK-013 — Delete Task

**Type:** Story
**Priority:** Medium
**Status:** Done

**Description:**
As a user, I want to delete a task that is no longer relevant.

**Acceptance Criteria:**
- Authenticated user can DELETE /tasks/:id
- Returns `{ "message": "deleted" }` on success
- Returns 404 if task not found

**Notes:**
- Authorization rules for who can delete a task are not explicitly defined — use reasonable defaults
- Task deletion should be permanent

---
