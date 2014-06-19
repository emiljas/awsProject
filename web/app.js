var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//google auth BEGIN
var authConfig = require('./oauth.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserService = require("../services/UserService");

var userService = new UserService();

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: authConfig.google.clientID,
    clientSecret: authConfig.google.clientSecret,
    callbackURL: authConfig.google.callbackURL
},

function(accessToken, refreshToken, profile, done) {
    console.log('before');
    var googleId = JSON.parse(profile).id;
    console.log('after');
    console.log(googleId);
    userService.findByGoogleIdOrCreate(googleId, function(user) {
        return done(null, user);
    });
}));
//google auth END

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport BEGIN
app.use(passport.initialize());
app.use(passport.session());
//passport END

app.use('/', routes);
app.use('/users', users);

//login page BEGIN
app.get('/auth/google',
passport.authenticate('google', {scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
]}),

function(req, res) {});
app.get('/auth/google/callback',
passport.authenticate('google', {
    failureRedirect: '/'
}),
function(req, res) {
    console.log('successful auth');
    res.redirect('/account');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
//login page END

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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