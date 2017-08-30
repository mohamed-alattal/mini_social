var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy
  , logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , methodOverride = require('method-override');

var FACEBOOK_APP_ID = "1593603714012782"
var FACEBOOK_APP_SECRET = "fc096d010e91960e836164e995c9cf8a";
var db = require('./config/database.js');
db.connect();

var routes = require('./routes/index');

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
//setting up facebook auth
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log(profile.id, profile.displayName); // print names
	     db.dbInsert(profile);

      // the user's Facebook profile is returned to
      // represent the logged-in user.
      return done(null, profile);
    });
  }
));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// view engine setup
app.set('views', __dirname + '/views');
 app.set('view engine', 'ejs');
 app.use(logger());
 app.use(cookieParser());
 app.use(bodyParser());
 app.use(methodOverride());
 app.use(session({ secret: 'keyboard cat' }));
 // Initialize Passport!  Also use passport.session() middleware, to support
 // persistent login sessions (recommended).
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(express.static(__dirname + '/public'));

app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
