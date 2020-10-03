const express = require('express')
const routes = express.Router()
const recipes = require('../app/controllers/admin/recipes')
const chefs = require('../app/controllers/admin/chefs')
const SearchController = require('../app/controllers/users/SearchController')

const admins = require('./admins')
const users = require('./users')
const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/session')

routes.use('/admin', admins)
routes.use('/users', users)

// Home
routes.get('/', recipes.showHomepage)

// Public
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.showRecipesPage)
routes.get('/recipes/search', SearchController.index)
routes.get('/recipes/:id', recipes.showSpecificRecipe)
routes.get('/chefs', chefs.showChefsOnSite)


//login/logout
routes.get('/users/login', SessionController.loginForm)
routes.post('/users/login', SessionValidator.show, SessionController.login)
routes.post('/users/logout',SessionController.logout)

// reset password / forgot
routes.get('/users/forgot-password', SessionController.forgotForm)
routes.post('/users/forgot-password', SessionValidator.forgot, SessionController.forgot)

routes.get('/users/password-reset',SessionController.resetForm)
routes.post('/users/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes
