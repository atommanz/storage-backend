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

import mongoose from 'mongoose'

var app = express();

// // mongoose.connect(`mongodb://192.168.250.125:27017/pos-utils`)
// console.log(`mongodb://${config.get('database.host')}:${config.get('database.port')}/${config.get('database.name')}`)
// mongoose.connect(`mongodb://${config.get('database.host')}:${config.get('database.port')}/${config.get('database.name')}`)

// firebase.initializeApp({
//   apiKey: '### FIREBASE API KEY ###',
//   authDomain: '### FIREBASE AUTH DOMAIN ###',
//   projectId: '### CLOUD FIRESTORE PROJECT ID ###'
// });
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

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
db.collection("storage").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(doc.type)
      // console.log(`${doc.id} => ${doc.data()}`);
  });
});

var docRef = db.collection("storage").doc("test");

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
// var userOneDocumentRef = db.doc('storage/test');
// var storageCollection = db.collection('storage');
// console.log(userOneDocumentRef)
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
