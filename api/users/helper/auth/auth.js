const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/auth.env' })
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const userService = require('../../service')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const store = new MongoStore({
    mongooseConnection: mongoose.connection
})

const sessionMiddleware = session({
    genid: (req) => {
        return uuid()
    },
    store : store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
})

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            let user = await userService.getItem({
                email
            })
            if(!user) return done(
                null,
                false,
                {
                    message : 'Incorrect email or password'
                }
            )
            const match = await new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, function (err, matching) {
                    if (err) reject(err)
                    if (matching) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                });
            })
            if(!match) return done(
                null,
                false,
                {
                    message: 'Incorrect email or password'
                }
            )
            return done(null,user) 
            
        } catch (e) {
            return done(e)
        }
    }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userService.getItem({
            _id: id
        })
        done(null, user);
    }
    catch (err) {
        done(err, false)
    }
});

const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info) return res.status(400).json({
            status: 400,
            ...info
        })
        if (err) return next(err)
        req.login(user, (err) => {
            if (err) return next(err)
            return res.status(200).json({
                status: 200,
                message: 'Successfully logged in'
            });
        })
    })(req, res, next);
}

const authRequired = async (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({
            status: 401,
            message : 'Unauthorized'
        })
    }
}

const logout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) console.log(err)
        return res.status(200).json({
            status: 200,
            message: 'Successfully Logged out'
        })
    })
    
}

module.exports.authMiddleWare = [sessionMiddleware,passport.initialize(),passport.session()]
module.exports.login = login
module.exports.authRequired = authRequired
module.exports.logout = logout