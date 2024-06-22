var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users.js');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, users) => {
            if (err) {
                return done(err, false, false);
            }
            else if (users) {
                return done(null, users, false);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = (req,res,next) => {
    passport.authenticate("jwt",{session: false}, (err,user) => {
        if(err){
            return next(err);
        }
        if(!user || !user.admin){
            const err = new Error(
                "You are not authorized to perform this operation!"
            );
            err.status = 403;
            return next(err);
        }
        next();
    })(req,res,next);
}