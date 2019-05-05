import createError from 'http-errors'
import config from 'config'
import express from 'express'
import path from 'path'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import apiRouter from './routes/api'
import mongoose from 'mongoose'

var app = express();

// mongoose.connect(`mongodb://192.168.250.125:27017/pos-utils`)
console.log(`mongodb://${config.get('database.host')}:${config.get('database.port')}/${config.get('database.name')}`)
mongoose.connect(`mongodb://${config.get('database.host')}:${config.get('database.port')}/${config.get('database.name')}`)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(fileUpload({
  // useTempFiles: true,
  // tempFileDir: '/tmp/',
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter)

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


export default app
