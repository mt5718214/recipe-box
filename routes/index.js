const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const auth = require('./modules/auth')
const recipe = require('./modules/recipe')

router.use('/recipes', recipe)
router.use('/auth', auth)
router.use('/', home)

module.exports = router