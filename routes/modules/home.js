const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

module.exports = router