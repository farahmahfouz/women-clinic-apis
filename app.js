const express = require('express');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const userRoute = require('./routes/userRoute');
const serviceRoute = require('./routes/serviceRoute');
const serviceOptionRoute = require('./routes/serviceOptionRoute');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/service', serviceRoute);
app.use('/api/v1/sub-service', serviceOptionRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
