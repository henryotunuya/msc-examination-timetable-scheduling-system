var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

var storeOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'session_test',
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 11000,
    expiration: 1000000,
    connectionLimit: 1,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};
var sessionStore = new MySQLStore(storeOptions);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var studentprofileRouter = require('./routes/studentprofile');
var staffprofileRouter = require('./routes/staffprofile');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var uploadRouter = require('./routes/upload');
var querydbRouter = require('./routes/querydb');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var staticoptions = {
    dotfiles: 'ignore',
    index: false,
    extensions: ['htm', 'html']
};

app.use(logger('dev'));
app.use(session({secret: 'qw1223', savaUninitialized: false, resave: false, store: sessionStore}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), staticoptions));
app.use(express.static(path.join(__dirname, 'bin'), staticoptions));

app.use('/', indexRouter);
app.use('/staff/admin', adminRouter);
app.use('/student/profile', studentprofileRouter);
app.use('/staff/profile', upload.none(), staffprofileRouter);
app.use('/', loginRouter);
app.use('/', logoutRouter);
app.use('/staff/admin/upload', upload.single('csvuploadfile'), uploadRouter);
// This 'csvuploadfile' is sort of generic. It represents the student list OR result
// Depending on which form was submitted.
app.use('/staff/admin/querydb', upload.none(), querydbRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    //res.locals.message = err.message;
    res.locals.message = "Access denied!";
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: 'Error!'});
});

//clear cached data
app.use(function (req,res,next) {
  //  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  //  next();  
});

module.exports = app;