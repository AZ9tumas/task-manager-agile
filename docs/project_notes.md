**Task Manager project notes**
Software Engineering, midsem

&nbsp;

**PLAN**

Project: task manager web app with a kanban board (To Do, In Progress, Done)
Trello / Jira too big for what we need, so making a simple one
Stack: React (Vite) for frontend, Node + Express backend, SQLite db, JWT + bcrypt for login, Jest + Supertest for tests
SQLite because no db server to install, its just one file

Sprint 1 (before midsem)
  signup / login / logout
  add, edit, delete tasks
  task has title, description, priority, due date, status
  board with 3 columns
  backend tests

Sprint 2 (after midsem)
  search and filter
  drag and drop between columns
  sprints + progress chart
  highlight overdue tasks
  dark mode

&nbsp;

**MEETING NOTES**
Date: Oct 18, 2026
Present: Rounak, Priyansh, Shashank, Shivam

Progress
  backend + frontend first version working (Rounak)
  login and add task working end to end, this is our working feature for midsem
  report draft done

Decided
  due date always MM-DD-YYYY on the site
  browser date picker shows dd/mm/yyyy on some laptops so using a normal text box instead
  db stores date as yyyy mm dd so it sorts properly, frontend converts it
  everyone use node 20 or newer (better sqlite3 doesnt install on old node)
  no drag and drop for now, status dropdown on the card, drag and drop in sprint 2
  check input on both frontend and backend (empty title, wrong priority, bad date)
  each user only sees their own tasks
  priority = low / medium / high
  status = todo / in progress / done
  demo user for testing: demo@example.com / password123

Midsem stuff still left
  diagrams as pdfs, test cases, SRS, PM docs, demo video (5 to 7 min), zip

Work split
  Rounak: backend and database, repo cleanup, readme, db design pdf, source code folder for zip
  Priyansh: testing and diagrams, test cases pdf + screenshots, uml + architecture pdfs, use cases pdf
  Shashank: frontend and UI, wireframes pdf, record app demo, edit + upload video, video link txt
  Shivam: SRS, final report, project plan, meeting log, contribution record, make zip + upload on moodle

Everyone
  read and understand all the code
  record about 1 min on your part for the video
  send name + reg no to Shivam
  check report before submitting

Everyone ok with the work split

&nbsp;

**WHO DID WHAT**

Rounak Das (backend and database)
  express server, login/signup with JWT + bcrypt, task routes, sqlite db, sample data, backend tests, first version of frontend, report draft

Priyansh Agarwal (testing and diagrams)
  test cases table, test evidence, UML diagrams, architecture diagram, use cases

Shashank Karn (frontend and UI)
  UI fixes, wireframes, demo recording and editing, video link

Shivam Verma (report and project management)
  SRS, final report, project plan, meeting log, contribution record, zip + upload

All 4 of us checked this and agreed: Rounak Das, Priyansh Agarwal, Shashank Karn, Shivam Verma
