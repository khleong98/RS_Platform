const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use routes
const taskManagement = require('./routes/taskManagement');
app.use('/task_management', taskManagement);

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
