const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const PORT = process.env.PORT || 3000
const app = express()

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`)
})