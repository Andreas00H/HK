// Express-appen: kopplar middleware och rutter
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const categoryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");
const borrowRequestRoutes = require("./routes/borrowRequestRoutes");
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/items", itemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/borrow-requests", borrowRequestRoutes);
app.use("/api/contacts", contactRoutes);


// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rutter

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;