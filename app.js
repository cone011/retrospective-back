const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config();

const MONGODB_URL = process.env.MONGO_URL;

const userRouter = require("./routes/users");
const boardRouter = require("./routes/board");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
const port = process.env.PORT || 5050;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((error, req, res, next) => {
  const stauts = error.statusCode || 500;
  const message = error.message;
  res.status(stauts).json({ isError: true, message: message });
});

app.use("/api", userRouter);
app.use("/api", boardRouter);

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    const serverPort = app.listen(process.env.PORT || 5050);
    const io = require("./socket/socket").init(serverPort);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
