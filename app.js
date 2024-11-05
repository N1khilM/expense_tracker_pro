require("express-async-errors");

const express = require("express");
const cors = require("cors");
const errorHandler = require("./handlers/errorhandler");
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionsRoutes = require("./modules/transactions/transactions.routes");

require("dotenv").config();

const app = express();
app.use(cors());
mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("error connecting to database");
  });

// models initialization
require("./models/user.model");
require("./models/transactions.model");

app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionsRoutes);

//end of all routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: " not found",
  });
});
app.use(errorHandler);

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
