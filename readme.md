# Task Manager

Our Software Engineering project. A simple website where you can sign up, log in and add your tasks to a board with 3 columns: To Do, In Progress and Done.

## What you need

1. Node.js version 20 or newer (download from https://nodejs.org, npm comes with it)
2. A browser like Chrome
3. VS Code or any code editor (optional)

## How to run

You need 2 terminals open, one for the backend and one for the frontend.

**Terminal 1 (backend)**

```
cd server
npm install
cp .env.example .env
npm run db:init
npm run dev
```

On Windows use `copy .env.example .env` instead of the `cp` line.

You only need to do `npm install`, `cp` and `npm run db:init` the first time. After that just `npm run dev`.

**Terminal 2 (frontend)**

```
cd client
npm install
npm run dev
```

Now open http://localhost:5173 in your browser.

## Login

You can sign up with your own email, or use the demo account:

Email: demo@example.com
Password: password123

## Tests

```
cd server
npm test
```

## Team

Rounak Das, Priyansh Agarwal, Shashank Karn, Shivam Verma
