require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const user_routes = require("./routes/user-routes");
const blog_routes = require("./routes/blog-routes");
const comment_routes = require("./routes/comment-routes");
const { verifyUser } = require("./middlewares/auth");
const adminRoutes = require("./routes/admin-route")
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");

// const port = process.env.PORT

const MongoDB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URI;

mongoose
  .connect(MongoDB_URI)
  .then(() => {
    console.log(`connected to ${MongoDB_URI}`);
  })
  .catch((err) => console.log(err));

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static("public"));

// ensure the log directory exists
const logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
 
// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

// use morgan middleware with the rotating file streat for logging
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Hello Node");
});

app.use("/users", user_routes);
app.use("/blogs", blog_routes);
app.use("/comments", verifyUser, comment_routes);
app.use("/admin", verifyUser, adminRoutes)
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError") res.status(400);
  else if (err.name === "CastError") res.status(400);
  res.json({ error: err.message });
});

// Unknown Path
app.use((req, res) => {
  res.status(404).json({ error: "Path Not Found" });
});

module.exports = app;
