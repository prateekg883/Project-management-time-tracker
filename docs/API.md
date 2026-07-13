# API Documentation

**Base URL:** `http://localhost:8080`  
**All endpoints are prefixed with** `/api`  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Dashboard](#2-dashboard)
3. [Projects](#3-projects)
4. [Tasks](#4-tasks)
5. [Kanban](#5-kanban)
6. [Time Logs](#6-time-logs)
7. [Time Entries (Live Timer)](#7-time-entries-live-timer)
8. [Reports](#8-reports)
9. [Health](#9-health)

---

## 1. Authentication

### POST `/api/auth/login`
Login with username and password.

**Request Body:**
```json
{
  "username": "alice",
  "password": "alice123"
}
```

**Response `200 OK`:**
```json
{
  "id": 2,
  "username": "alice",
  "role": "ADMIN",
  "fullName": "Alice Johnson"
}
```

**Response `401 Unauthorized`:**
```json
{ "error": "Invalid credentials" }
```

---

### POST `/api/auth/logout`
Logout the current session.

**Response `200 OK`:**
```json
{ "status": "logged out" }
```

---

### GET `/api/auth/me`
Get the currently logged-in user.

**Response `200 OK`:**
```json
{
  "id": 2,
  "username": "alice",
  "role": "ADMIN",
  "fullName": "Alice Johnson"
}
```

**Response `401 Unauthorized`:**
```json
{ "error": "unauthenticated" }
```

---

## 2. Dashboard

### GET `/api/dashboard/stats`
Get summary statistics for the dashboard.

**Response `200 OK`:**
```json
{
  "projects": 3,
  "tasks": 2,
  "totalTasks": 4,
  "users": 6,
  "hours": 26
}
```

| Field | Description |
|-------|-------------|
| `projects` | Total number of projects |
| `tasks` | Number of tasks currently IN_PROGRESS |
| `totalTasks` | Total number of tasks across all statuses |
| `users` | Total number of registered users |
| `hours` | Total hours logged across all time logs |

---

## 3. Projects

### GET `/api/projects`
Get all projects.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "E-Commerce Platform",
    "description": "Building an online shopping platform",
    "status": "IN_PROGRESS",
    "startDate": "2026-05-13",
    "endDate": "2026-11-13"
  }
]
```

---

### GET `/api/projects/{id}`
Get a single project by ID.

**Response `200 OK`:**
```json
{
  "id": 1,
  "title": "E-Commerce Platform",
  "description": "Building an online shopping platform",
  "status": "IN_PROGRESS"
}
```

---

### POST `/api/projects`
Create a new project.

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description"
}
```

**Response `200 OK`:**
```json
{
  "id": 4,
  "title": "New Project",
  "description": "Project description"
}
```

---

### POST `/api/projects/{id}`
Update a project.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response `200 OK`:** Returns updated project object.

---

### DELETE `/api/projects/{id}`
Delete a project by ID.

**Response `200 OK`:** Empty body.

---

### POST `/api/projects/{id}/delete`
Alternative delete endpoint (form-friendly).

**Response `200 OK`:**
```json
{ "success": true }
```

---

### GET `/api/projects/manager/{managerId}`
Get all projects assigned to a specific manager.

**Response `200 OK`:** Array of Project objects.

---

## 4. Tasks

### GET `/api/tasks`
Get all tasks.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "Setup Database",
    "description": "Configure PostgreSQL and migrations",
    "status": "TODO",
    "projectId": 1,
    "assignedUserId": 6
  }
]
```

---

### GET `/api/tasks/{id}`
Get a task by ID.

**Response `200 OK`:** Full Task entity.

---

### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "projectId": 1,
  "userId": 2
}
```

**Response `200 OK`:**
```json
{
  "id": 5,
  "title": "New Task",
  "description": "Task description"
}
```

---

### PUT `/api/tasks/{id}`
Update a task.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response `200 OK`:** Full updated Task entity.

---

### DELETE `/api/tasks/{id}`
Delete a task.

**Response `200 OK`:** Empty body.

---

### POST `/api/tasks/{id}/delete`
Alternative delete endpoint.

**Response `200 OK`:**
```json
{ "success": true }
```

---

## 5. Kanban

### GET `/api/kanban/columns`
Get all Kanban columns with their cards.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "To Do",
    "cards": [
      {
        "id": 1,
        "title": "Sample Task 1",
        "description": "This is a sample Kanban card",
        "position": 1,
        "assignee": {
          "id": 6,
          "fullName": "Alice Developer"
        }
      }
    ]
  },
  {
    "id": 2,
    "name": "In Progress",
    "cards": [ ... ]
  }
]
```

---

### POST `/api/kanban/columns`
Create a new Kanban column.

**Request Body:**
```json
{
  "name": "Review"
}
```

**Response `200 OK`:**
```json
{
  "id": 4,
  "name": "Review",
  "position": 4
}
```

---

### POST `/api/kanban/cards`
Create a new card in a column.

**Request Body:**
```json
{
  "columnId": 1,
  "title": "New Card",
  "description": "Card details"
}
```

**Response `200 OK`:**
```json
{
  "id": 4,
  "title": "New Card",
  "description": "Card details",
  "position": 3
}
```

---

### POST `/api/kanban/cards/{id}`
Update a card's title or description.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description"
}
```

---

### POST `/api/kanban/cards/{id}/move`
Move a card to a different column and/or position.

**Request Body:**
```json
{
  "destColumnId": 2,
  "destPosition": 1
}
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "columnId": 2,
  "position": 1
}
```

---

### POST `/api/kanban/cards/{id}/delete`
Delete a card.

**Response `200 OK`:**
```json
{ "success": true }
```

---

## 6. Time Logs

Manual time log entries (e.g. "I worked 8 hours on this task today").

### GET `/api/timelogs`
Get all time logs.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "taskTitle": "Setup Database",
    "userName": "Alice Developer",
    "date": "2026-07-11",
    "hours": 8.0,
    "description": "Initial database setup completed"
  }
]
```

---

### POST `/api/timelogs`
Create a manual time log entry.

**Request Body:**
```json
{
  "taskId": 1,
  "userId": 6,
  "date": "2026-07-13",
  "hoursSpent": 4.5,
  "description": "Fixed database indexing issues"
}
```

> `hoursSpent` is the preferred field name. `hours` is also accepted for legacy compatibility.

**Response `200 OK`:**
```json
{
  "id": 5,
  "taskTitle": "Setup Database",
  "hours": 4.5
}
```

---

### POST `/api/timelogs/{id}/delete`
Delete a time log entry.

**Response `200 OK`:**
```json
{ "success": true }
```

---

### GET `/api/timelogs/total`
Get total hours logged across all entries.

**Response `200 OK`:**
```json
{ "totalHours": 26.5 }
```

---

## 7. Time Entries (Live Timer)

Live start/stop timer sessions tracked in real time.

### GET `/api/time-entries`
Get all time entries.

**Response `200 OK`:** Array of TimeEntry objects.

---

### GET `/api/time-entries/{id}`
Get a single time entry by ID.

---

### POST `/api/time-entries/start`
Start a live timer for a task.

**Request Body:**
```json
{
  "taskId": 1,
  "userId": 6,
  "description": "Working on database setup"
}
```

**Response `200 OK`:** TimeEntry object with `startTime` set and `endTime` null.

---

### PUT `/api/time-entries/{id}/stop`
Stop a running timer. Sets the `endTime` to now.

**Response `200 OK`:** Updated TimeEntry object with `endTime` filled.

---

### PUT `/api/time-entries/{id}`
Update a time entry's description.

**Request Body:**
```json
{ "description": "Updated notes" }
```

---

### DELETE `/api/time-entries/{id}`
Delete a time entry.

**Response `200 OK`:** Empty body.

---

### GET `/api/time-entries/user/{userId}`
Get all time entries for a specific user.

---

### GET `/api/time-entries/task/{taskId}`
Get all time entries for a specific task.

---

### GET `/api/time-entries/task/{taskId}/total`
Get total tracked minutes for a task.

**Response `200 OK`:**
```json
{ "totalMinutes": 135 }
```

---

## 8. Reports

All report endpoints return a `Map<String, Object>` with aggregated analytics data.

### GET `/api/reports/dashboard`
Full overview report — combines project count, task breakdown, hours, and team size.

---

### GET `/api/reports/project-progress`
Per-project progress data — task counts by status, completion percentages.

---

### GET `/api/reports/time-tracking`
Time tracking report — hours logged per user, hours per date, weekly activity.

---

### GET `/api/reports/task-completion`
Task completion statistics — breakdown by status (TODO, IN_PROGRESS, DONE).

---

### GET `/api/reports/team-productivity`
Team productivity report — output per team member.

---

## 9. Health

### GET `/actuator/health`
Spring Boot Actuator health check.

**Response `200 OK`:**
```json
{ "status": "UP" }
```

---

## Error Responses

| Status | Meaning |
|--------|---------|
| `200 OK` | Success |
| `201 Created` | Resource created |
| `400 Bad Request` | Missing or invalid request data |
| `401 Unauthorized` | Invalid credentials or not logged in |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Unexpected server error |

Error body format:
```json
{ "error": "Error message here" }
```

---

## Data Models

### User Roles
```
ADMIN           – Full system access
PROJECT_MANAGER – Manage projects and tasks
TEAM_MEMBER     – Log time, update own tasks
```

### Task Statuses
```
TODO        – Not started
IN_PROGRESS – Currently being worked on
DONE        – Completed
```

### Project Statuses
```
PLANNING    – Not yet started
IN_PROGRESS – Active
COMPLETED   – Finished
ON_HOLD     – Paused
```
