dotenv.config();
const createError = require('http-errors');
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import viewRouter from './routes/view';
import usersRouter from './routes/users';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import passport from 'passport';
import passportConfig from './js/passport';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import connect from './mongoose/db.js';


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../server/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan(process.env.LOG_FORMAT));app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024, // 10 GiB
    },
    abortOnLimit: true,
    createParentPath: true,
    useTempFiles: true,
    debug: true,
  })
);
app.use(cors());
app.use(hpp());
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결


app.use('/', indexRouter);
app.use('/view', viewRouter)
app.use('/users', usersRouter);
app.use('/file', fileRouter);

connect();
passportConfig();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
