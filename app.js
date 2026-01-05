const express = require('express');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const userRoute = require('./routes/userRoute');
const serviceRoute = require('./routes/serviceRoute');
const serviceOptionRoute = require('./routes/serviceOptionRoute');
const reviewRoute = require('./routes/reviewRoute');
const settingRoute = require('./routes/settingRoute');
const doctorSchedualeRoute = require('./routes/doctorSchedualeRoute');
const bookingRoute = require('./routes/bookingRoute');
const notificationRoute = require('./routes/notificationRoute');

const app = express();

// 🔒 Security Headers
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));

// 🚦 Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cookieParser());

// 🛡️ Data Sanitization
app.use(mongoSanitize());
app.use(xss());

// 🚫 Parameter Pollution Protection
app.use(
  hpp({
    whitelist: ['receiver', 'type', 'title', 'message', 'data'],
  })
);

app.use('/api/v1/user', userRoute);
app.use('/api/v1/service', serviceRoute);
app.use('/api/v1/sub-service', serviceOptionRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/settings', settingRoute);
app.use('/api/v1/doctor-schedule', doctorSchedualeRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/notification', notificationRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
