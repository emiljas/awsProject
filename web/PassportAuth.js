var authConfig = require('./oauth-config.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserService = require("../services/UserService");
var userService = new UserService();

var PassportAuth = function(app) {
    this.init = function() {
        app.use(passport.initialize());
        app.use(passport.session());
        this.config();
    };
    
    this.config = function() {
        passport.serializeUser(function(user, done) {
            console.log('serializeUser', user);
            done(null, user);
        });
        passport.deserializeUser(function(user, done) {
            console.log('deserializeUser', user);
            done(null, user);
        });
        
        this.useGoogleStrategy();
    };
    
    this.useGoogleStrategy = function() {
        passport.use(new GoogleStrategy({
            clientID: authConfig.google.clientID,
            clientSecret: authConfig.google.clientSecret,
            callbackURL: authConfig.google.callbackURL,
            passReqToCallback: true
        },
        
        function(req, accessToken, refreshToken, profile, done) {
            //TODO: delete access and refresh token if useless
            var googleUser = {
                id: profile.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                displayName: profile.displayName,
                email: profile.emails[0].value
            };
        
            userService.findGoogleUserOrCreate(googleUser, function(user) {
                return done(null, user);
            });
        }));
    };
    
    this.configUrls = function(){
        app.get('/auth/google',
        passport.authenticate('google', {
            scope:
            [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email"
            ],
            session: true
        }),
        
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
    };
};

module.exports = PassportAuth;