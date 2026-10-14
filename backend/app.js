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
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


// Middleware
    // Tillåt bara vår frontend att anropa API:et från en webbläsare
    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

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

//Måste ligga sist, annars fångas alla rutter som inte finns upp av notFound
app.use(notFound);
app.use(errorHandler);

module.exports = app;