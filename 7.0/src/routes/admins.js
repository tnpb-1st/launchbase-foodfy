const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const recipes = require('../app/controllers/admin/recipes')
const chefs = require('../app/controllers/admin/chefs')
const UserController = require('../app/controllers/users/UserController')
const Validator = require('../app/validators/user')

const { onlyAdms } = require('../app/middlewares/session')
const { on } = require('nodemon')


// Admin
//recipes
routes.get("/recipes", onlyAdms, recipes.index) // Mostrar a lista de receitas
routes.get("/recipes/create", onlyAdms, recipes.create) // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyAdms, recipes.show) // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyAdms, recipes.edit) // Mostrar formulário de edição de receita

routes.post("/recipes",  multer.array("photos", 6), recipes.post) // Cadastrar nova receita
routes.put("/recipes", multer.array("photos", 6), recipes.put) // Editar uma receita
routes.delete("/recipes", recipes.delete) // Deletar uma receita

//chefs
routes.get("/chefs", onlyAdms, chefs.index) 
routes.get("/chefs/create", onlyAdms, chefs.create) 
routes.get("/chefs/:id", onlyAdms, chefs.show) 
routes.get("/chefs/:id/edit", onlyAdms, chefs.edit) 

routes.post("/chefs", multer.array("avatar", 1), chefs.post) 
routes.put("/chefs", multer.array("avatar", 1), chefs.put) 
routes.delete("/chefs", chefs.delete)

// users 

routes.get('/', Validator.show, UserController.show) // admin account page
routes.get('/users',  onlyAdms, UserController.showUsers) // every user withou adm

// user register
routes.get('/user-register', onlyAdms, UserController.registerForm)
routes.post('/user-register', onlyAdms, Validator.post, UserController.post)

// update
routes.get('/user-update/:id', onlyAdms ,Validator.update, UserController.updateForm )
routes.put('/user-update', UserController.update)

// delete
routes.delete('/user-delete/:id', onlyAdms , UserController.delete)

module.exports = routes