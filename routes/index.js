const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const auth = require('./modules/auth')
const recipe = require('./modules/recipe')
const { authenticator } = require('../middleware/auth')

router.use('/recipes', authenticator, recipe)
router.use('/auth', auth)
router.use('/', home)

module.exports = router