const express = require('express')
const router = express.Router()

const db = require('../../models')
const User = db.User
const Recipe = db.Recipe
const Ingredient = db.Ingredient
const Direction = db.Direction

//使用者的食譜頁面
router.get('/my-recipe', (req, res) => {
  const currentUserId = req.user.id
  User.findByPk(currentUserId, {
    include: [
      { model: Recipe, include: [Ingredient, Direction] }
    ]
  })
    .then(user => {
      console.log(user.toJSON())
      res.render('recipe', {
        user: user.toJSON()
      })
    })
})

module.exports = router