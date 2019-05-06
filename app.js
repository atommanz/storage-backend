import createError from 'http-errors'
import config from 'config'
import express from 'express'
import path from 'path'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import firebase from 'firebase'
import apiRouter from './routes/api'

var app = express();

const firebaseConfig = {
  apiKey: "AIzaSyDouD51Vy2XOFsvU6YaVRsGMRdGvwirH4A",
  authDomain: "storage-app-a1a12.firebaseapp.com",
  databaseURL: "https://storage-app-a1a12.firebaseio.com",
  projectId: "storage-app-a1a12",
  storageBucket: "storage-app-a1a12.appspot.com",
  messagingSenderId: "313730066033",
  appId: "1:313730066033:web:763c4950b2748d6b"
};

firebase.initializeApp(firebaseConfig);
console.log('connected')

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
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


export default app
