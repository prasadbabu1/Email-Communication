const express = require("express")
const session = require("express-session")
const passport = require('passport')
const dotenv = require("dotenv")

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const app = express()
app.use(session({secret:"Mysecret!!",
  resave: false,  
      saveUninitialized: false,}))
  app.use(passport.initialize())
  app.use(passport.session())

  

passport.use(new GoogleStrategy({
    clientID:"16876064151-ahne517rodcshvsi124bcvhjpatm00ec.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:31415/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    done(null,profile)
  }
));


passport.serializeUser((user,done)=>{
  done(null,user)
})

passport.deserializeUser((user,done)=>{
  done(null,user)
})
