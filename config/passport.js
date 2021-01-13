const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const oauth = require('../oauth')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const TwitterStrategy = require('passport-twitter').Strategy

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  //本地驗證策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error', '此信箱未註冊!'))
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('error', '信箱或密碼輸入錯誤'))
        }
        return done(null, user)
      })
      .catch(err => done(err, null))
  }))

  //Facebook認證策略
  passport.use(new FacebookStrategy({
    clientID: oauth.facebook.clientID,
    clientSecret: oauth.facebook.clientSecret,
    callbackURL: oauth.facebook.callbackURL,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json

    User.findOne({ where: { email } })
      .then(user => {
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  //資料序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  //資料反序列化
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user.toJSON()
        return done(null, user)
      })
  })
}