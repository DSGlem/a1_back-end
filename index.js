require('module-alias/register')
require('dotenv').config()
const sequelize = require('./database')
const app = require('express')()
const router = require('./routes')
const bodyParser = require('body-parser')
const errorMiddleware = require('./middleware/error')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


router(app)

app.use(errorMiddleware);

async function start() {
  try {
    await sequelize.sync()
    app.listen(3001, function () {
      console.log(`Example app listening on port 3001!`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
