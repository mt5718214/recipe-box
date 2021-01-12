const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const TwitterStrategy = require('passport-twitter').Strategy

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  //本地驗證策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false)
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false)
        }
        return done(null, user)
      })
      .catch(err => done(err, null))
  }))

  //資料序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  //資料反序列化
  passport.deserializeUser((id, done) => {
    User.findByPk({ id })
      .then(user => {
        user.toJSON()
        return done(null, user)
      })
  })
}