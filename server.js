require("dotenv").config(); // Load environment variables from .env file

// Import required dependencies
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app); // Create a server with Express
const io = socketIo(server); // Initialize Socket.io on the server

const PORT = process.env.PORT || 3000; // Get the port from environment or default to 3000

// Middleware for logging HTTP requests in 'dev' format
app.use(require("morgan")("dev"));

//Enable CORS for requests
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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

// Socket.io Connection and Event Handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Handle event sharing (like sharing events, to-dos, etc.)
  socket.on("shareEvent", (eventData) => {
    console.log("Event shared:", eventData);

    // Broadcast to other users
    socket.broadcast.emit("newEvent", eventData);
  });

  // Optionally, handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server with Socket.io
server.listen(PORT, () => {
  console.log(`Server and Socket.io listening on port ${PORT}...`);
});
