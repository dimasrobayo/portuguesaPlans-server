const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const key = require('./keys');
const User = require('../models/user');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = key.secretOrKey;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id, (error, user) => {
            if(error) {
                return done(error, false);
            }
            if(user) {
                return done(null, user);
            }else{
                return done(null, false);
            }
        })
    }))
}