# Interview Guide — Project Management Time Tracker
> Prepared by Prateek | 2026

---

## 1. PROJECT INTRODUCTION (Say this first)

> "I built a full-stack Project Management and Time Tracking web application using Spring Boot for the backend and React with TypeScript for the frontend. The app allows teams to manage projects, track tasks on a Kanban board, log time against tasks, and view analytics reports — all through a REST API. I also implemented role-based access control with three user roles: Admin, Project Manager, and Team Member."

---

## 2. TECH STACK — What I Used and WHY

### Backend
| Technology | Why I Used It |
|-----------|--------------|
| **Java 17** | LTS version, widely used in enterprise, supported until 2029 |
| **Spring Boot 3.2** | Reduces boilerplate, auto-configuration, production-ready framework |
| **Spring Data JPA** | Simplifies database operations using ORM — no raw SQL needed |
| **Spring Security** | Handles authentication, CORS configuration, request filtering |
| **Flyway** | Version-controlled database migrations — schema changes tracked in code |
| **H2 Database** | In-memory DB for development — zero setup, fast startup |
| **PostgreSQL** | Production-grade relational database — persistent, scalable |
| **Spring Boot Actuator** | Built-in health check endpoint `/actuator/health` for monitoring |
| **Maven** | Build tool — manages dependencies, builds JAR file |

### Frontend
| Technology | Why I Used It |
|-----------|--------------|
| **React 18** | Component-based UI, reusable components, fast rendering |
| **TypeScript** | Type safety — catches errors at compile time, better code quality |
| **Vite 5** | Extremely fast dev server and build tool, replaces Create React App |
| **React Router v6** | Client-side routing — SPA navigation without page reload |
| **Axios** | HTTP client for API calls — cleaner than fetch, supports interceptors |
| **CSS** | Custom styling — dark/light theme, responsive layout |

---

## 3. ARCHITECTURE

```
[React Frontend :5173]
        |
        | HTTP /api/* (proxied by Vite in dev)
        |
[Spring Boot Backend :8080]
        |
        | JPA / Hibernate
        |
[H2 (dev) / PostgreSQL (prod)]
```

> "It's a decoupled architecture. The React frontend talks to the Spring Boot REST API. In development, Vite proxies all /api calls to port 8080, so there are no CORS issues. In production, CORS is configured to only allow the frontend domain."

---

## 4. DATABASE DESIGN — 9 Entities

| Entity | Purpose |
|--------|---------|
| **User** | Stores user credentials, full name, email, role |
| **UserRole** | Enum — ADMIN, PROJECT_MANAGER, TEAM_MEMBER |
| **Project** | A project with title, description, start/end dates, status |
| **Task** | Task belonging to a project, assigned to a user, with status |
| **TimeLog** | Manual time entry — user logs hours against a task |
| **TimeEntry** | Live timer — tracks start/stop time in real time |
| **Board** | Kanban board owned by a user |
| **KanbanColumn** | Column in a board (To Do, In Progress, Done) |
| **Card** | A card inside a column, assigned to a user |

### Key Relationships
- Project → has many Tasks
- Task → has many TimeLogs and TimeEntries
- Board → has many KanbanColumns → has many Cards
- User → can be assigned to Tasks and Cards

---

## 5. KEY FEATURES — How to Explain Each

### Authentication & Registration
> "Users can register with a username, password, full name, email, and choose their role — Admin, Project Manager, or Team Member. On login, credentials are validated against the database and user info is stored in localStorage for session management."

### Dashboard
> "The dashboard fetches live stats from the backend — total projects, active tasks, team members, and total hours logged. It shows all projects and tasks in a clean card layout."

### Kanban Board
> "The Kanban board has columns (To Do, In Progress, Done). Cards can be moved between columns, added, edited, and deleted. All changes are persisted to the database via REST API calls."

### Time Tracking
> "There are two ways to log time — a live start/stop timer that records exact timestamps, and manual log entries where you enter hours directly. Both are stored in the database and shown in a filterable list."

### Reports & Analytics
> "The reports page shows task status distribution (pie-style bars), per-project progress, hours logged by each team member, and weekly activity — all computed on the backend and rendered on the frontend."

### Dark/Light Theme
> "The app supports dark and light mode. The preference is saved in localStorage so it persists across sessions."

---

## 6. SPRING BOOT CONCEPTS — Interview Questions

### Q: What is Spring Boot?
> "Spring Boot is a framework built on top of Spring that provides auto-configuration, embedded server (Tomcat), and production-ready features. It eliminates most boilerplate configuration."

### Q: What is Spring Data JPA?
> "It's an abstraction over JPA/Hibernate that provides repository interfaces. Instead of writing SQL, I define methods like `findByUsername()` and Spring generates the query automatically."

### Q: What is Spring Security?
> "It's a framework for authentication and authorization. In this project I used it to configure CORS (which frontend origins are allowed), disable CSRF for REST APIs, and set up the password encoder."

### Q: What is Flyway?
> "Flyway is a database migration tool. Every schema change is a numbered SQL file like V1__init.sql. Flyway runs these in order, so every developer gets the exact same database schema. It's version control for your database."

### Q: What is the difference between H2 and PostgreSQL?
> "H2 is an in-memory database — data lives in RAM, zero setup, perfect for development. PostgreSQL is a production-grade relational database that persists data to disk. I use Spring profiles to switch between them — `dev` profile uses H2, `prod` profile uses PostgreSQL."

### Q: What is CommandLineRunner?
> "It's a Spring Boot interface that runs code after the application starts. I used it in DataLoader.java to seed sample users, projects, tasks, and Kanban cards into the database automatically on startup."

### Q: What are Spring Profiles?
> "Profiles allow different configurations for different environments. My `dev` profile uses H2 with no migration, and my `prod` profile uses PostgreSQL with proper credentials injected as environment variables."

### Q: What is CORS?
> "Cross-Origin Resource Sharing. Since the frontend (port 5173) and backend (port 8080) are on different origins, the browser blocks requests by default. I configured CORS in Spring Security to allow only the frontend URL."

### Q: What is Spring Boot Actuator?
> "It adds production-ready endpoints automatically. The most important is `/actuator/health` which returns `{status: UP}` — used by monitoring systems to check if the app is running."

---

## 7. REACT CONCEPTS — Interview Questions

### Q: Why React?
> "React uses a component-based architecture — each page and UI element is a reusable component. It uses a Virtual DOM for efficient updates — only changed parts re-render, making it fast."

### Q: Why TypeScript over JavaScript?
> "TypeScript adds static typing. It catches type errors at compile time before the code runs, gives better IDE autocompletion, and makes large codebases easier to maintain."

### Q: Why Vite instead of Create React App?
> "Vite uses native ES modules and is significantly faster — dev server starts in milliseconds instead of seconds. It's the modern standard, Create React App is deprecated."

### Q: What is React Router?
> "React Router enables client-side routing in a Single Page Application. When you navigate to /kanban, the URL changes but the page doesn't reload — React just renders a different component."

### Q: What is Context API?
> "I used React Context for the theme (dark/light mode). Context allows sharing state across all components without passing props through every level — called prop drilling."

### Q: What is Axios?
> "Axios is an HTTP client for making API calls. I created a centralized Axios instance in client.ts with the base URL set to /api, so all API calls automatically go to the backend."

### Q: What is localStorage?
> "Browser storage that persists data across page refreshes. I used it to store the logged-in user object and theme preference — so users stay logged in even after closing the tab."

---

## 8. DATABASE QUESTIONS

### Q: Why PostgreSQL for production?
> "PostgreSQL is a robust, open-source relational database used widely in production. It supports complex queries, ACID transactions, and scales well. H2 is only for development."

### Q: What is ORM / Hibernate?
> "ORM (Object-Relational Mapping) maps Java classes to database tables. Hibernate is the ORM implementation. Instead of writing INSERT/SELECT SQL, I work with Java objects and Hibernate generates the SQL."

### Q: What is JPA?
> "Java Persistence API — a specification that defines how Java objects map to database tables. Hibernate implements JPA. Spring Data JPA builds on top to provide repository interfaces."

### Q: What is `ddl-auto=update`?
> "It tells Hibernate to automatically update the database schema when entity classes change — adds new columns, creates new tables. Used in production with Railway since Flyway is disabled there."

---

## 9. GENERAL QUESTIONS

### Q: What was the most challenging part?
> "The Kanban drag-and-drop feature was challenging because moving a card requires updating both the column ID and the position of all other cards in the affected columns. I solved this in the KanbanService by recalculating positions after every move."

### Q: What would you improve?
> "I would add JWT-based stateless authentication, switch to BCryptPasswordEncoder for password hashing, add pagination to list endpoints, write unit and integration tests using JUnit and Mockito, and deploy with Railway and Vercel."

### Q: What design pattern did you use?
> "I followed the standard layered architecture — Controller → Service → Repository. Controllers handle HTTP requests, Services contain business logic, Repositories handle database access. This separation makes the code testable and maintainable."

### Q: What is REST API?
> "REST is an architectural style for building APIs. Each resource has a URL (/api/projects), and HTTP methods define the action — GET to read, POST to create, PUT to update, DELETE to remove. The backend returns JSON which the frontend consumes."

### Q: How does a user login work in your app?
> "User enters username and password → React sends POST /api/auth/login → Spring Boot checks credentials against the database → if valid, returns user object (id, username, role, fullName) → React stores it in localStorage → user is redirected to dashboard."

### Q: How does registration work?
> "User fills the register form and picks a role → React sends POST /api/auth/register → backend checks if username already exists → if not, saves new user to database → auto-logs in → redirects to dashboard."

---

## 10. PROJECT STATS — Say These Confidently

| Stat | Value |
|------|-------|
| Backend language | Java 17 |
| Framework | Spring Boot 3.2.9 |
| Frontend | React 18 + TypeScript |
| REST API endpoints | 35+ |
| Database entities | 9 |
| Frontend pages | 6 (Home, Login, Register, Dashboard, Kanban, Time, Reports) |
| User roles | 3 (Admin, Project Manager, Team Member) |
| Sample data on startup | 6 users, 3 projects, 4 tasks, 1 Kanban board, 4 time logs |

---

## 11. ONE-LINE ANSWERS — Quick Fire Round

| Question | Answer |
|----------|--------|
| What is Spring Boot? | Framework that auto-configures Spring applications with embedded server |
| What is JPA? | Java specification for mapping objects to database tables |
| What is Hibernate? | ORM framework that implements JPA |
| What is Flyway? | Database migration tool — version control for SQL schema |
| What is CORS? | Browser security that blocks cross-origin requests — configured in Spring Security |
| What is React? | JavaScript library for building component-based UIs |
| What is TypeScript? | Typed superset of JavaScript that catches errors at compile time |
| What is Vite? | Fast frontend build tool and dev server |
| What is React Router? | Library for client-side routing in React SPAs |
| What is Axios? | HTTP client for making API requests from React |
| What is REST? | Architectural style using HTTP methods to interact with resources |
| What is Maven? | Java build tool that manages dependencies and builds the project |
| What is H2? | In-memory database for development — no setup needed |
| What is PostgreSQL? | Production-grade relational database |
| What is Actuator? | Spring Boot module that adds health check and monitoring endpoints |
| What is CommandLineRunner? | Spring Boot interface to run code after app startup |
| What is localStorage? | Browser storage for persisting data across page refreshes |
| What is Context API? | React feature for sharing state without prop drilling |
| What is LTS? | Long Term Support — Java version with extended security updates |
| What is DataLoader? | My class that seeds sample data into DB on every startup |

---

## 12. GITHUB LINK

```
https://github.com/prateekg883/Project-management-time-tracker
```

> "You can clone and run it with just run.bat — it starts both the backend and frontend automatically. Java 17 and Node.js are the only prerequisites."

---

*Good luck with your interviews! You built this — own it confidently.* 🚀
