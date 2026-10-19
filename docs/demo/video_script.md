# Demo Video Script

Total length: 5 min 55 sec. Everyone's parts are recorded and in `Demo_Video.mp4`.

| # | Time | Section | Speaker | Length |
|---|------|---------|---------|--------|
| 1 | 0:00 | Title and team | Rounak | 18 sec |
| 2 | 0:18 | Problem | Shivam | 20 sec |
| 3 | 0:38 | Our solution | Shivam | 19 sec |
| 4 | 0:57 | Architecture | Rounak | 22 sec |
| 5 | 1:18 | Database | Rounak | 22 sec |
| 6 | 1:40 | Login flow | Rounak | 18 sec |
| 7 | 1:58 | Live demo | Shashank | 1 min 29 sec |
| 8 | 3:27 | Testing | Priyansh | 33 sec |
| 9 | 4:00 | Diagrams | Priyansh | 21 sec |
| 10 | 4:21 | Limitations | Priyansh | 27 sec |
| 11 | 4:48 | Remaining work | Shivam | 14 sec |
| 12 | 5:02 | Contributions | Rounak 5:02, Priyansh 5:16, Shashank 5:31, Shivam 5:39 | 8 to 15 sec each |
| 13 | 5:52 | Thank you | Shivam | 3 sec |

The live demo was recorded again to match Shashank's narration, so each step on screen happens while he describes it.

## 1. Title and team (Rounak, 20 sec)

Hi everyone, I'm Rounak Das, and our team is me, Priyansh Agarwal, Shashank Karn and Shivam Verma. Our project for Software Engineering is a Task and To-Do Management System.

## 2. Problem (Shivam, 30 sec)

Students usually have a lot of tasks going on at once, like assignments, labs and project work. Most people keep these in notebooks or phone notes, so things get forgotten and deadlines get missed. Tools like Jira and Trello exist, but they have way more features than a student needs.

## 3. Our solution (Shivam, 30 sec)

So we made a simple web app. You sign up, log in, and add your tasks with a title, description, priority, due date and status. The tasks show up on a Kanban board with three columns: To Do, In Progress and Done. Each user only sees their own tasks.

## 4. Architecture (Rounak, 25 sec)

The frontend is made with React and Vite. It talks to our backend, which is Node.js with Express, through a REST API using JSON. The backend checks the login token, runs the logic, and saves everything in a SQLite database.

## 5. Database (Rounak, 20 sec)

We have two tables, users and tasks. One user can have many tasks, and every task has a user id. Passwords are saved as bcrypt hashes, not plain text. Due dates are saved as year month day so they sort properly.

## 6. Login flow (Rounak, 15 sec)

When you log in, the server checks the password with bcrypt and sends back a JWT token. The frontend saves the token and sends it with every request, so the server knows which user it is.

## 7. Live demo (Shashank, 1 min 29 sec, recorded)

First I sign up with a new account, and I get an empty board. Now I add a task, with a title, description, high priority and a due date. The due date is in month, day and year format. I add a second task, and if I type the date in the wrong format, it shows an error, and so I will fix it and save it. I can move tasks between columns using the status dropdown. I can edit a task and change its title. And I can delete a task after confirmation, and if I log in with a wrong password, I get an error. And this is the demo account with some sample tasks.

## 8. Testing (Priyansh, 33 sec, recorded)

For testing we did both automated and manual testing. We wrote 15 automated backend tests using Jest and Supertest. They check sign up, duplicate emails, short passwords, login with right and wrong passwords, adding tasks, wrong input like a missing title, a wrong priority or a bad date, updating and deleting tasks, and that one user can't see or delete another user's tasks. We also did 9 manual tests in the browser. All 24 test cases passed.

## 9. Diagrams (Priyansh, 21 sec, recorded)

We also made the design diagrams. The use case diagram shows everything a user can do, like signing up, logging in and managing tasks, plus the planned features. The activity diagram shows the steps for adding a task, including the checks for the date format and the token.

## 10. Limitations (Priyansh, 27 sec, recorded)

There are still some limitations right now. There's no search or filter, so with a lot of tasks it's harder to find one. There's no drag and drop yet, so you move tasks with the status dropdown. Sprints and the progress chart aren't there yet either. The app only runs locally, it's not deployed online, and there are no reminders or notifications for due dates.

## 11. Remaining work (Shivam, 20 sec)

In the second half of the semester we will add search and filter, drag and drop, sprints with a progress chart, highlighting overdue tasks and dark mode, plus more tests and the final report.

## 12. Contributions (12 sec each, Priyansh 15 sec)

**Rounak:** I'm Rounak, I did the backend and database. I made the Express server, login with JWT and bcrypt, the task routes, the SQLite database and the backend tests.

**Priyansh (recorded):** I'm Priyansh, and I did testing and diagrams. I made the test case table with all 24 test cases, collected the test evidence and screenshots, and made the use case, sequence and activity diagrams and the architecture diagram.

**Shashank (recorded):** I'm Shashank, I did frontend and UI. I worked on the UI, the wireframes, and recorded and edited this demo video.

**Shivam:** I'm Shivam, I did the report and project management. I wrote the SRS and the final report, kept the meeting notes and project plan, and I'm putting together the final submission.

## 13. Thank you (Shivam, 5 sec)

Thank you for watching.
