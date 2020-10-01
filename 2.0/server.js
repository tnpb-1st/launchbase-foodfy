const express = require('express');
const nunjucks = require('nunjucks');

const server = express();
const recipes = require('./data');

server.use(express.static('public'));
server.use(express.static('images'));

server.set("view engine", "njk");

nunjucks.configure('views', {
    express: server,
    autoescape: false
}); 

server.get("/", (req, res) => {
    return res.render('index', {recipes:recipes});
});

server.get('/about', (req, res) => {
    return res.render('about');
});

server.get('/recipes', (req, res) => {
    return res.render('recipes', {recipes:recipes});
});

server.get('/recipes/:index', (req, res) => {
    const recipeArray = recipes;
    const recipeIndex = req.params.index;
    const selectedRecipe = recipeArray[recipeIndex];

    return res.render('recipe-info', {recipe:selectedRecipe});

});

server.listen(5000, function () {
    console.log("Server is running!");
});