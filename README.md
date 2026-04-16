# LegalFIR — Legal Case & FIR Management System

A full-stack web application for managing First Information Reports (FIRs), legal cases, documents, and notifications. The system provides a citizen-facing portal and a privileged admin panel, backed by a Spring Boot REST API and a React + TypeScript frontend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Prerequisites](#prerequisites)
- [Getting Started — Linux / macOS](#getting-started--linux--macos)
- [Getting Started — Windows](#getting-started--windows)
- [Environment & Configuration](#environment--configuration)
- [Default Credentials](#default-credentials)
- [Troubleshooting](#troubleshooting)

---

## Overview

LegalFIR is designed to digitise the FIR and case management workflow for legal authorities and citizens. Registered users can file FIRs online, track their cases, search the legal section database, and upload related documents — all from a single responsive dashboard. Administrators get a dedicated panel with reporting, user management, notification broadcasting, and full CRUD control over all entities.

---

## Features

### Citizen / User
| Feature | Details |
|---|---|
| Authentication | Register, Login, JWT-based session, Password Reset |
| FIR Management | File a new FIR, view all personal FIRs, view FIR detail |
| Case Tracking | View cases linked to the user, view full case details and activity logs |
| Legal Database | Search IPC / legal sections by keyword, view bail eligibility |
| Document Vault | Upload documents attached to a case, download or delete them |
| Notifications | Receive in-app notifications from admins, mark as read |

### Admin
| Feature | Details |
|---|---|
| Admin Panel | Summary dashboard with quick stats |
| FIR Management | View and update status of all FIRs |
| Case Management | Create, update, change status, and add activity log notes to any case |
| Legal Section CRUD | Add, edit, or delete legal sections in the database |
| User Management | View all registered users |
| Reports | View summary stats, FIR statistics, and user-activity reports with charts |
| Notifications | Send targeted or broadcast notifications to users |

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2.3 |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| Persistence | Spring Data JPA + Hibernate |
| Database | SQLite (file-based, `legalfir.db`) |
| Utilities | Lombok, Bean Validation |
| Build tool | Maven (Maven Wrapper included) |

### Frontend
| Layer | Technology |
|---|---|
| Language | TypeScript 5.9 |
| UI Library | React 19 |
| Routing | React Router DOM 7 |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod validation |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Build tool | Vite 7 |

---

## Project Structure

```
nan/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/legalfir/
│   │   ├── LegalFirApplication.java    # Entry point
│   │   ├── config/                     # Security & CORS config
│   │   ├── controller/                 # REST controllers
│   │   │   ├── AuthController.java
│   │   │   ├── FIRController.java
│   │   │   ├── CaseController.java
│   │   │   ├── LegalController.java
│   │   │   ├── DocumentController.java
│   │   │   ├── NotificationController.java
│   │   │   ├── ReportController.java
│   │   │   └── AdminController.java
│   │   ├── dto/                        # Request / Response DTOs
│   │   ├── entity/                     # JPA entities (User, FIR, Case, …)
│   │   ├── exception/                  # Global exception handler
│   │   ├── repository/                 # Spring Data repositories
│   │   └── service/                    # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties      # App configuration
│   │   └── data.sql                    # Seed / init SQL
│   ├── legalfir.db                     # SQLite database (auto-created)
│   ├── pom.xml
│   ├── mvnw                            # Maven wrapper (Linux/macOS)
│   └── mvnw.cmd                        # Maven wrapper (Windows)
│
└── frontend/                   # React + TypeScript SPA
    ├── src/
    │   ├── api/index.ts                # Axios API clients for every module
    │   ├── components/                 # Shared layout components
    │   ├── context/                    # AuthContext, ThemeContext
    │   ├── pages/                      # Route-level page components
    │   │   ├── Login.tsx / Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── FIRForm.tsx / MyFIRs.tsx / FIRDetail.tsx
    │   │   ├── LegalSearch.tsx / LegalDetail.tsx
    │   │   ├── MyCases.tsx / CaseDetail.tsx
    │   │   ├── Documents.tsx
    │   │   └── admin/                  # Admin-only pages
    │   ├── types/                      # TypeScript type definitions
    │   └── lib/                        # Utility helpers
    ├── public/
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

---

## API Reference

All REST endpoints are prefixed with `/api`. The backend runs on port **8080** by default.

| Module | Base path | Notes |
|---|---|---|
| Auth | `/api/auth` | Public — register, login, reset-password |
| FIR | `/api/fir` | Authenticated — users see own FIRs; admins see all |
| Case | `/api/case` | Authenticated |
| Legal | `/api/legal` | GET endpoints are public; CUD requires admin |
| Document | `/api/document` | File upload (max 10 MB) and download |
| Notification | `/api/notification` | Users read own; admins send / broadcast |
| Report | `/api/report` | Admin only |
| Admin | `/api/admin` | Admin only |

Authentication is Bearer-token based. After login, include the JWT in every request:

```
Authorization: Bearer <token>
```

---

## Prerequisites

Make sure the following are installed before proceeding:

| Tool | Minimum version | Download |
|---|---|---|
| Java JDK | 17 | https://adoptium.net or https://www.oracle.com/java/technologies/downloads/ |
| Node.js | 18 LTS | https://nodejs.org |
| npm | 9+ (bundled with Node) | — |
| Git | any | https://git-scm.com |

You do **not** need Maven installed globally — the Maven Wrapper (`mvnw` / `mvnw.cmd`) is included.

---

## Getting Started — Linux / macOS

### 1. Clone the repository

```bash
git clone https://github.com/karanxa1/nan.git
cd nan
```

### 2. Start the Backend

```bash
cd backend

# Make the Maven wrapper executable (first time only)
chmod +x mvnw

# Build and run
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.  
The SQLite database file `legalfir.db` is created automatically in the `backend/` directory.

> **Tip:** To build a standalone JAR instead:
> ```bash
> ./mvnw clean package -DskipTests
> java -jar target/legalfir-backend-1.0.0.jar
> ```

### 3. Start the Frontend

Open a **new terminal** in the project root:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Open the app

Navigate to `http://localhost:5173` in your browser.  
Register a new account or use the [default credentials](#default-credentials).

---

## Getting Started — Windows

### 1. Clone the repository

Open **Command Prompt** or **PowerShell**:

```cmd
git clone https://github.com/karanxa1/nan.git
cd nan
```

### 2. Start the Backend

```cmd
cd backend
mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`.

> **Tip:** To build a standalone JAR:
> ```cmd
> mvnw.cmd clean package -DskipTests
> java -jar target\legalfir-backend-1.0.0.jar
> ```

### 3. Start the Frontend

Open a **new** Command Prompt or PowerShell window:

```cmd
cd frontend

rem Install dependencies (first time only)
npm install

rem Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Open the app

Navigate to `http://localhost:5173` in your browser.

> **Windows tip:** If `mvnw.cmd` shows an error about execution policy in PowerShell, run:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

## Environment & Configuration

### Backend — `backend/src/main/resources/application.properties`

| Property | Default | Description |
|---|---|---|
| `spring.datasource.url` | `jdbc:sqlite:legalfir.db` | Path to the SQLite database |
| `server.port` | `8080` | Port the API listens on |
| `jwt.secret` | *(see file)* | HMAC-SHA secret — change in production! |
| `jwt.expiration` | `86400000` | Token expiry in ms (24 hours) |
| `spring.servlet.multipart.max-file-size` | `10MB` | Max document upload size |

### Frontend — API base URL

The frontend points to `http://localhost:8080/api` by default (configured in `frontend/src/api/index.ts`).  
To connect to a remote backend, change the `baseURL` value in that file or set the `VITE_API_BASE_URL` environment variable in a `.env` file:

```env
# frontend/.env
VITE_API_BASE_URL=https://your-backend-host/api
```

And update `frontend/src/api/index.ts` accordingly:

```ts
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
```

---

## Default Credentials

The database is seeded via `backend/src/main/resources/data.sql`.  
Check that file for any pre-loaded admin or demo user accounts.

If no seed data is present, register a new user through the UI at `/register`.  
Admin privileges must be assigned directly in the database or via a seeded admin account.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `JAVA_HOME` not set | Set `JAVA_HOME` to your JDK 17 install directory and add `$JAVA_HOME/bin` to `PATH` |
| Port 8080 already in use | Change `server.port` in `application.properties` to another port (e.g. `8081`) |
| Port 5173 already in use | Run `npm run dev -- --port 3000` to use a different port |
| `legalfir.db` permission error on Windows | Run the terminal as Administrator, or change the SQLite path to a writable directory |
| CORS errors in browser | Ensure the backend is running and the frontend `baseURL` matches the backend host/port |
| `npm install` fails | Make sure Node.js ≥ 18 is installed: `node -v` |
| Maven wrapper not executable (Linux) | Run `chmod +x backend/mvnw` |

---

## License

This project is for educational / demonstration purposes. Add a license file as appropriate before distributing.
