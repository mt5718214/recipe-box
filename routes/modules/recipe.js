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
      res.render('myrecipe', {
        user: user.toJSON()
      })
    })
})

//新增食譜頁面
router.get('/new', (req, res) => {
  res.render('new')
})

//新增食譜
router.post('/new', (req, res) => {
  const { title, description } = req.body
  const promiseArray = []

  //檢查title,description是否為空值
  if (!title.trim() || !description.trim()) {
    req.flash('warning_msg', '標題和描述為必填')
    return res.redirect('back')
  }

  return Recipe.create({
    name: title,
    description: description,
    UserId: req.user.id
  }).then(recipe => {
    if (req.body.ingredientsItems) {
      const ingredientsPromise = new Promise((resolve, reject) => {
        return resolve(Ingredient.create({
          content: req.body.ingredientsItems,
          RecipeId: recipe.id
        }))
      })
      promiseArray.push(ingredientsPromise)
    }
    if (req.body.stepsItems) {
      const directionsPromise = new Promise((resolve, reject) => {
        return resolve(Direction.create({
          content: req.body.stepsItems,
          RecipeId: recipe.id
        }))
      })
      promiseArray.push(directionsPromise)
    }

    return Promise.all(promiseArray)
      .then(([ingredients, directions]) => {
        res.redirect('/recipes/my-recipe')
      })
  })
})

//瀏覽食譜
router.get('/:recipeId', (req, res) => {
  Recipe.findByPk(req.params.recipeId, {
    include: [Ingredient, Direction, User]
  })
    .then(recipe => {
      res.render('recipe', {
        recipe: recipe.toJSON()
      })
    })
})

module.exports = router