const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const app = express();

//In case of uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('ERROR: uncaught exception');
  console.log(err.name, err.message);
});

const connectDB = require('./config/connect');
const tours = require('./router/tourRouter');
const users = require('./router/userRouter');
const reviews = require('./router/reviewRouter');
const views = require('./router/viewsRouter');
const bookings = require('./router/bookingRouter');
const AppError = require('./utils/appError');
const globalAppErrorHandler = require('./controllers/errorController');

const port = process.env.PORT || 3000;

require('dotenv').config({ path: './.env' });

app.enable('trust proxy');
//Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARES:
//Cross origin ...
app.use(cors());

app.options('*', cors());
//Serving the static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security http headers
app.use(helmet());

//Limit requests from a single IP
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 60 * 1000,
  message: 'Too many request from this IP, try again in the next hour',
});

app.use('/api', limiter);

//Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NOsql query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration'],
  })
);

app.use(compression());

//Routes
app.use('/', views);
app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/bookings', bookings);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalAppErrorHandler);

//Connecting to our database and starting the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Listening on port ${port}...`));
    //console.log(process.env.NODE_ENV)
  } catch (error) {
    console.log(error);
  }
};

start();

process.on('unhandledRejecion', (err) => {
  console.log(err.name, err.message);
});
