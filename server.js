require("dotenv").config(); // Load environment variables from .env file

// Import required dependencies
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware for logging HTTP requests in 'dev' format
app.use(require("morgan")("dev"));

// Middleware for parsing incoming JSON requests
app.use(express.json());

// Register routes for various API endpoints (general endpoints)
app.use(require("./api/generalApi/auth").router);
app.use("/api/stickers", require("./api/generalApi/stickers"));
app.use("/api/events", require("./api/generalApi/events"));
app.use("/api/lists", require("./api/generalApi/lists"));
app.use("/api/journals", require("./api/generalApi/journals"));

// Personal API routes
app.use(
  "/api/personalPasswords",
  require("./api/personalApi/personalPasswords")
);
app.use("/api/food", require("./api/personalApi/food"));
app.use("/api/personalFinances", require("./api/personalApi/personalFinances"));
app.use("/api/medical", require("./api/personalApi/medical"));
app.use("/api/habits", require("./api/personalApi/habits"));

// Classroom API routes
app.use("/api/plans", require("./api/classroomApi/plans"));
app.use("/api/seating", require("./api/classroomApi/seating"));
app.use("/api/jobs", require("./api/classroomApi/jobs"));
app.use("/api/schoolPasswords", require("./api/classroomApi/schoolPasswords"));
app.use("/api/rewards", require("./api/classroomApi/rewards"));
app.use("/api/iep", require("./api/classroomApi/iep"));
app.use("/api/grades", require("./api/classroomApi/grades"));
app.use("/api/transportation", require("./api/classroomApi/transportation"));
app.use("/api/rosters", require("./api/classroomApi/rosters"));

// Middleware for logging HTTP request details
// This will log method and URL of each incoming request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Handling 404 errors
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

// Error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});

// Start the Express server on the specified port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
