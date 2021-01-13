const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes')

const PORT = process.env.PORT || 3000
const app = express()

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))

app.use(session({
  secret: 'MyRecipeBoxSecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`)
})