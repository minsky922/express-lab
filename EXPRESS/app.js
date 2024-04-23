global.__base = __dirname + "/";

var express = require('express');
var path = require('path');
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require('morgan');
var cors = require("cors");

var createError = require('http-errors');
var cookieParser = require('cookie-parser');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();




var server = require('https').createServer(app);

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});



server.listen(3001, function () {
  console.log("Socket IO server listening on port 3001");
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('ping', msg => {
    console.log(msg);
    socket.emit('pong', {
      msg: new Date().getTime()
    })
  })
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
