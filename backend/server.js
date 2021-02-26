require("dotenv").config();
const express = require("express");
const color = require("colors");
const connectDB = require("./config/database.utils");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const uploadRoutes = require("./routes/upload.routes");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/upload", uploadRoutes);

//Make uploads folder static
app.use("/backend/uploads", express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(__dirname + "/build"));

  app.get("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));
} else {
  app.get("/", (req, res) => {
    res.send("API is running ....".cyan.bold);
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
