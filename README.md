# Todo Task Management Application

A full-stack task management system built with React + TypeScript on the frontend and Express.js + Prisma on the backend, following a clean Controller -> Service architecture.

Create, manage, complete, filter, and export tasks through a responsive dashboard and a structured REST API with JWT authentication, Swagger documentation, and PostgreSQL persistence.

---

## Tech Stack

### Frontend

| Technology               | Purpose                                 |
| ------------------------ | --------------------------------------- |
| React 19 + TypeScript    | UI framework with type safety           |
| Vite                     | Build tool and dev server               |
| Material UI (MUI) v6     | Component library and responsive UI     |
| TanStack React Query     | Server state and async cache management |
| React Router v7          | Client-side routing and route guards    |
| Axios                    | HTTP client with authenticated requests |
| Recharts                 | Dashboard charts and visualizations     |
| SCSS                     | Theme styling and CSS modules           |
| ESLint + Prettier        | Code quality and formatting             |
| Vitest + Testing Library | Frontend unit and integration testing   |

### Backend

| Technology              | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| Express.js              | Node.js web framework                    |
| TypeScript + ES Modules | Type safety and modern runtime structure |
| Prisma v7               | ORM and database access layer            |
| PostgreSQL              | Relational database                      |
| Zod                     | Request validation and type inference    |
| JSON Web Token (JWT)    | Authentication                           |
| bcryptjs                | Password hashing                         |
| Pino                    | Structured logging                       |
| Swagger (OpenAPI 3.0)   | Interactive API documentation            |
| json2csv                | CSV export support                       |
| Jest + Supertest        | Backend unit and integration testing     |

---

## Key Features

### Authentication

- User registration and login with JWT
- Protected frontend routes and authenticated API access
- Profile update and password change
- Persistent session using local storage token handling

### Task Management

- Create, edit, delete, and complete tasks
- Description required for both create and update flows
- Paginated task table with status filtering and sorting
- Dedicated Manage Todos page for task operations

### Dashboard

- Welcome header with personalized user greeting
- Quick create-task form
- Recent pending tasks with one-click Done action
- Summary stat cards for total, completed, pending, and completion rate
- Tasks-by-day chart and status breakdown visualization

### Reports and Export

- Task filtering by status and date range
- CSV export endpoint
- JSON export endpoint
- Report page for task insights and summaries

### API and Developer Experience

- Swagger UI for live API exploration
- Prisma schema and migrations for database versioning
- Modular backend route structure
- Separate frontend and backend test suites

---

## Project Structure

```text
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/theme/           # Theme tokens, base styles, SCSS
│   │   ├── components/             # Feature and shared UI components
│   │   │   ├── dashboard/          # Welcome, stat cards, recent tasks, charts
│   │   │   ├── profile/            # Profile card, profile form, password form
│   │   │   ├── shared/             # Alerts, dialogs, loaders, headers
│   │   │   └── todos/              # Filters, table, edit dialog
│   │   ├── context/                # Auth context
│   │   ├── core/                   # Exception handling and core helpers
│   │   ├── hooks/                  # Auth, tasks, dashboard, export hooks
│   │   ├── pages/                  # Auth, Dashboard, ManageTodos, Profile, Reports
│   │   ├── routes/                 # Route config and private route handling
│   │   ├── services/               # Axios service layer
│   │   ├── templates/              # App layout and shell
│   │   ├── utilities/              # Constants, helpers, models
│   │   └── index.tsx               # Frontend entry point
│   ├── test/                       # Vitest unit and integration tests
│   └── package.json
│
├── server/                         # Express backend
│   ├── prisma/
│   │   ├── migrations/             # Prisma migration history
│   │   └── schema.prisma           # User and Task models
│   ├── scripts/
│   │   └── seed.ts                 # Seed script
│   ├── src/
│   │   ├── config/                 # DB, logger, swagger config
│   │   ├── generated/prisma/       # Generated Prisma client output
│   │   ├── middleware/             # Auth, validation, error handling
│   │   ├── modules/
│   │   │   ├── auth/               # Auth schema, service, controller, routes
│   │   │   ├── dashboard/          # Dashboard APIs
│   │   │   └── tasks/              # Task schema, service, controller, routes
│   │   ├── routes/                 # Route aggregator
│   │   ├── shared/                 # Constants and response utilities
│   │   └── server.ts               # Backend entry point
│   ├── test/                       # Jest unit and integration tests
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- PostgreSQL running locally or remotely
- npm

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Basic_ToDo_App-Node_Express_React_PostgreSql_Docker_Swagger
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` and configure values like:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_app_db
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

Create the database, then run migrations and start the API:

```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend URLs:

- API base: `http://localhost:5000/api/v1`
- Swagger docs: `http://localhost:5000/api-docs`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

If needed, set the frontend API base URL in `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Frontend URL:

- App: `http://localhost:5173`

---

## Available Scripts

### Backend (`server/`)

| Command                    | Description                   |
| -------------------------- | ----------------------------- |
| `npm run dev`              | Start backend in watch mode   |
| `npm run build`            | Compile TypeScript            |
| `npm start`                | Run compiled backend          |
| `npm run seed`             | Seed database data            |
| `npm run lint`             | Run ESLint                    |
| `npm run lint:fix`         | Fix lint issues               |
| `npm run format`           | Format backend source         |
| `npm run format:check`     | Check formatting              |
| `npm run prisma:migrate`   | Run Prisma migrate dev        |
| `npm run prisma:generate`  | Generate Prisma client        |
| `npm run prisma:studio`    | Open Prisma Studio            |
| `npm run test`             | Run backend tests             |
| `npm run test:unit`        | Run backend unit tests        |
| `npm run test:integration` | Run backend integration tests |
| `npm run test:coverage`    | Run backend coverage          |

### Frontend (`client/`)

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start Vite dev server         |
| `npm run build`         | Build frontend for production |
| `npm run preview`       | Preview production build      |
| `npm run lint`          | Run ESLint                    |
| `npm run lint:fix`      | Fix lint issues               |
| `npm run format`        | Format frontend files         |
| `npm run test`          | Run Vitest once               |
| `npm run test:watch`    | Run Vitest in watch mode      |
| `npm run test:coverage` | Run frontend coverage         |
| `npm run test:ui`       | Open Vitest UI                |

---

## API Endpoints

| Method | Endpoint                                 | Description                           | Auth |
| ------ | ---------------------------------------- | ------------------------------------- | ---- |
| POST   | `/api/v1/auth/register`                  | Register a new user                   | No   |
| POST   | `/api/v1/auth/login`                     | Login user                            | No   |
| GET    | `/api/v1/auth/profile`                   | Get current profile                   | Yes  |
| PUT    | `/api/v1/auth/profile`                   | Update current profile                | Yes  |
| PUT    | `/api/v1/auth/change-password`           | Change current password               | Yes  |
| GET    | `/api/v1/tasks/recent`                   | Get recent pending tasks              | Yes  |
| POST   | `/api/v1/tasks`                          | Create a task                         | Yes  |
| GET    | `/api/v1/tasks`                          | Get tasks with filters and pagination | Yes  |
| GET    | `/api/v1/tasks/:id`                      | Get task by id                        | Yes  |
| PUT    | `/api/v1/tasks/:id`                      | Update a task                         | Yes  |
| PATCH  | `/api/v1/tasks/:id/done`                 | Mark task as completed                | Yes  |
| DELETE | `/api/v1/tasks/:id`                      | Delete a task                         | Yes  |
| GET    | `/api/v1/tasks/export/csv`               | Export tasks as CSV                   | Yes  |
| GET    | `/api/v1/tasks/export/json`              | Export tasks as JSON                  | Yes  |
| GET    | `/api/v1/dashboard/summary`              | Dashboard summary stats               | Yes  |
| GET    | `/api/v1/dashboard/tasks-by-day`         | Tasks by day chart data               | Yes  |
| GET    | `/api/v1/dashboard/completion-over-time` | Completion trend data                 | Yes  |
| GET    | `/api/v1/dashboard/status-breakdown`     | Status breakdown data                 | Yes  |
| GET    | `/api/v1/health`                         | Health check                          | No   |

Interactive docs are available at `http://localhost:5000/api-docs`.

---

## Environment Variables

### Backend (`server/.env`)

| Variable         | Description                  | Default                 |
| ---------------- | ---------------------------- | ----------------------- |
| `PORT`           | API server port              | `5000`                  |
| `NODE_ENV`       | Runtime environment          | `development`           |
| `DATABASE_URL`   | PostgreSQL connection string | None                    |
| `JWT_SECRET`     | JWT signing secret           | None                    |
| `JWT_EXPIRES_IN` | JWT expiry time              | `7d`                    |
| `CORS_ORIGIN`    | Allowed frontend origin      | `http://localhost:5173` |
| `LOG_LEVEL`      | Logger level                 | `info`                  |

### Frontend (`client/.env`)

| Variable            | Description          | Default                        |
| ------------------- | -------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## Notes

- The backend Prisma schema currently contains `User` and `Task` models.
- Recent dashboard tasks only show pending items and can be completed directly from the dashboard.
- Task description is required in both create and update flows.
- Frontend and backend are documented and tested separately inside `client/` and `server/`.

---
