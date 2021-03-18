const User = require('../models/User');
const { SECRET } = require('../config/index');
const { Strategy, ExtractJwt } = require('passport-jwt');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

//passport-jwt pour protéger les routes en vérifiant qu'elles aient bien un token

module.exports = (passport) => {
    passport.use(new Strategy(opts, async(payload, done) => {
        await User.findById(payload.user_id).then(async user => {
            if(user) {
                return done(null, user);
            }
            return done(null, false)
        }).catch((err) => {
            return done(null, false);
        })
    }))
};