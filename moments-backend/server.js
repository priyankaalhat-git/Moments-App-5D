require("dotenv").config();
const express = require("express");
const connectToDB = require("./db/connect");
const initializeMiddlewares = require("./middlewares");
const userRoutes = require("./routes/userRoutes");
const momentRoutes = require("./routes/momentRoutes");
const app = express();
const err = require("./error/index");
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/**
 * Initialize Middlewares
 */

initializeMiddlewares(app);

/**
 * Connect to databse
 */

connectToDB();

/**
 * Routes
 */

app.get("/", (_, res) =>
  res.send({ success: true, message: "App is functioning properly!" })
);
app.use("/api/auth", userRoutes);
app.use("/api/moments", momentRoutes);

/**
 * Handle Errors and Exceptions
 */

app.use(err.iRouteHandler);
app.use(err.errorHandler);
err.exceptionHandler();

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
