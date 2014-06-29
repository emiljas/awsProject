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
            done(null, user);
        });
        passport.deserializeUser(function(user, done) {
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
            var googleUser = {
                id: profile.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                displayName: profile.displayName,
                email: profile.emails[0].value
            };
        
            userService.findGoogleUserOrCreate(googleUser, function(user) {
                if(user.accessToken != accessToken)
                    userService.updateAccessToken(user.googleId, accessToken, function() {
                        user.accessToken = accessToken;
                        done(null, user);
                    });
                else
                    done(null, user);
            });
        }));
    };
    
    this.configUrls = function(){
        app.get('/auth/google',
        passport.authenticate('google', {
            scope:
            [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "https://picasaweb.google.com/data/"
            ],
            session: true
        }),
        
        function(req, res) {});
        app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/'
        }),
        
        function(req, res) {
            res.redirect('/');
        });
        
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    };
};

module.exports = PassportAuth;