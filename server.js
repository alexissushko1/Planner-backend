require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;

app.use(require("morgan")("dev"));
app.use(express.json());

app.use(require("./api/generalApi/auth").router);
app.use("/api/stickers", require("./api/generalApi/stickers"));
app.use("/api/events", require("./api/generalApi/events"));
app.use("/api/lists", require("./api/generalApi/lists"));
app.use("/api/journals", require("./api/generalApi/journals"));
app.use(
  "/api/personalPasswords",
  require("./api/personalApi/personalPasswords")
);
app.use("/api/food", require("./api/personalApi/food"));
app.use("/api/personalFinances", require("./api/personalApi/personalFinances"));
app.use("/api/medical", require("./api/personalApi/medical"));
app.use("/api/habits", require("./api/personalApi/habits"));
app.use("/api/plans", require("./api/classroomApi/plans"));
app.use("/api/seating", require("./api/classroomApi/seating"));
app.use("/api/jobs", require("./api/classroomApi/jobs"));
app.use("/api/schoolPasswords", require("./api/classroomApi/schoolPasswords"));
app.use("/api/rewards", require("./api/classroomApi/rewards"));
app.use("/api/iep", require("./api/classroomApi/iep"));
app.use("/api/grades", require("./api/classroomApi/grades"));
app.use("/api/transportation", require("./api/classroomApi/transportation"));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// 404
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

// Error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
