const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const recipes = require('./app/controllers/admin/recipes');
const chefs = require('./app/controllers/admin/chefs');
const searchController = require('./app/controllers/user/searchController');

// Home
routes.get('/', recipes.showHomepage);

// User
routes.get('/about', recipes.about);
routes.get('/recipes', recipes.showRecipesPage);
routes.get('/recipes/search', searchController.index);
routes.get('/recipes/:id', recipes.showSpecificRecipe);
routes.get('/chefs', chefs.showChefsOnSite);

// Admin

//recipes
routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", multer.array("photos", 6), recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 6), recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

//chefs
routes.get("/admin/chefs", chefs.index); 
routes.get("/admin/chefs/create", chefs.create); 
routes.get("/admin/chefs/:id", chefs.show); 
routes.get("/admin/chefs/:id/edit", chefs.edit); 

routes.post("/admin/chefs", multer.array("avatar", 1), chefs.post); 
routes.put("/admin/chefs", multer.array("avatar", 1), chefs.put); 
routes.delete("/admin/chefs", chefs.delete); 

module.exports = routes;
