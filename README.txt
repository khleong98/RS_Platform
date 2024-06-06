Welcome to RS Platform!

This README provides an overview of the web stacks, components, setup instructions, and how to launch the web app.

============================== Web Stacks ==============================

1. Backend  : Express.js

2. Frontend : Vue.js with Quasar

3. Database : SQLite

============================== Components ==============================

1. Task Record
   URL         : localhost:9000/#/task_management/task_record
   Description : Allows users to check all tasks and their statuses.

2. Task Detail
   URL         : localhost:9000/#/task_management/task_detail/{taskId}
   Description : Enables users to view and modify task details and statuses.

3. New Task
   URL         : localhost:9000/#/task_management/new_task
   Description : Allows users to initiate tasks.

================================ Setup =================================

Make sure you have Node.js and npm installed on your machine. Follow these steps:

1. Clone the repository:
   git clone https://github.com/khleong98/RS_Platform.git

2. Navigate to the web app directory:
   cd RS_Platform

3. Install the dependencies:
   npm install

========================= Launching the Web App =========================

Express with npm:

1. Navigate to the backend directory:
   cd backend

2. Run the Express app:
   node app.js

Vue with npm:

1. Navigate to the frontend directory:
   cd frontend

2. Run the Quasar development server:
   npx quasar dev