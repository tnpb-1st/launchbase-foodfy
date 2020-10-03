const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const RecipesController = require('../app/controllers/users/RecipesController')
const UserController = require('../app/controllers/users/UserController')
const Validator = require('../app/validators/user')

const { onlyUsers } = require('../app/middlewares/session')

routes.get("/recipes", onlyUsers, RecipesController.index) // Mostrar a lista de receitas
routes.get("/recipes/create", onlyUsers, RecipesController.create) // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, RecipesController.show) // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, RecipesController.edit) // Mostrar formulário de edição de receita

routes.post("/recipes",  multer.array("photos", 6), RecipesController.post) // Cadastrar nova receita
routes.put("/recipes", multer.array("photos", 6), RecipesController.put) // Editar uma receita
routes.delete("/recipes", RecipesController.delete) // Deletar uma receita


// personal user management
routes.get('/user-information', onlyUsers, Validator.show, UserController.show)
routes.put('/', onlyUsers, Validator.update, UserController.update)
module.exports = routes