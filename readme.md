# Task & To-Do Management System

A web app for creating, organising, and tracking tasks on a Kanban board (To Do, In Progress, Done). Built using Agile, in two one-day sprints, as a Software Engineering course project.

## Features

- Sign up and log in
- Add, view, edit, and delete tasks (title, description, priority, due date, status)
- Kanban board with drag-and-drop
- Search and filter tasks
- Sprints with a progress chart of tasks left
- Overdue highlighting and dark mode

## Tech stack

| Part | Tool |
| --- | --- |
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | SQLite |
| Login | JWT + bcrypt |
| Testing | Jest + Supertest |

## Folder structure

```
client/       React frontend
server/       Express backend and SQLite database
docs/         Requirements, diagrams, test cases
```

## Setup

You need Node.js 18 or newer.

1. Clone the repo:
   ```
   git clone https://github.com/<your-username>/task-manager-agile.git
   cd task-manager-agile
   ```
2. Set up the backend:
   ```
   cd server
   npm install
   cp .env.example .env
   npm run db:init
   npm run dev
   ```
   The `db:init` script creates the SQLite database and adds sample data.
3. In a new terminal, set up the frontend:
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173 in your browser.

## Configuration

`server/.env.example` shows the settings the backend needs:

```
PORT=5000
JWT_SECRET=change-me
DB_FILE=./data/tasks.db
```

Do not commit your real `.env` file.

## Running tests

```
cd server
npm test
```

## Team

| Member | Role |
| --- | --- |
| Member 1 | Backend |
| Member 2 | Frontend |
| Member 3 | Testing and diagrams |
| Member 4 | Report and documentation |
