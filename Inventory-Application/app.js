const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');

const app = express();

// Set up mongoose connection
const connectionString = require('./connection-string');
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = connectionString;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A multer error occurred when uploading.
    console.error('Multer error:', err);
    res.status(500).send('Multer error occurred.');
  } else {
    next(err);  // Pass error to next middleware or error handler
  }
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

module.exports = app;
