const { Router } = require('express')
const products = require('@/controllers/products.controller')


const access = require('@/middleware/access')

const routes = new Router()

routes.get('/products', access, products.get)

routes.get('/products/:id', access, products.getById)

routes.post('/products', registerValidations, products.create)

routes.delete('/products/:id', resetValidations, products.delete)

routes.put('/products/:id', restorePassword, products.update)

module.exports = routes
