import createError from 'http-errors'; 
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan';
import express from 'express';
import { createTables } from './config/dbinit.js';



//import indexRouter  from './routes/index.js';
import usersRouter from  './modules/user/user.routes.js';
import eventsRouter from './modules/events/event.routes.js';
import bookingRouter from './modules/bookings/booking.routes.js';


const app = express();

// view engine setup
createTables()
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use('/',indexRouter);
app.use('/auth', usersRouter);
app.use('/events',eventsRouter);
app.use('/', bookingRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
export default app;
