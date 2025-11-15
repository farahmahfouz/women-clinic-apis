const express = require("express");
const cookieParser = require('cookie-parser')

const userRoute = require('./routes/userRoute');
const AppError = require("./utils/AppError");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.use('/api/v1/user', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;