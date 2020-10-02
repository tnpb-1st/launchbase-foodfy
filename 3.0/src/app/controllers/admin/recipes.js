const { date } = require('../../../lib/utils');
const data = require("../../../../data.json")
const fs = require("fs")

function findRecipe(id) {
    const foundRecipe = data.recipes.find(recipe => {
        return recipe.id == id
    })

    return foundRecipe
}

module.exports = {
    // admin foodfy
    
    index(req, res) {
        
        const recipes = data.recipes
        
        return res.render('./admin/recipes/index', {recipes});

    },

    create(req, res) {
        
        return res.render('./admin/recipes/create')
    },

    show(req,res) {
        const id = req.params.id
        
        const recipe = findRecipe(id)
        if (!recipe) return res.send("Recipe not found!")

        return res.render("./admin/recipes/show", {recipe})
    },

    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        req.body.id = Number(data.recipes.length) + 1

        const recipe = {
            ...req.body
        }

        data.recipes.push(recipe)

        fs.writeFile("data.json", JSON.stringify(data, null, 4), (err) => {
            if (err) return res.send("Write file error")

            return res.redirect("/admin/recipes")
        })

    },

    edit(req,res) {
        const id = req.params.id
        
        const recipe = findRecipe(id)
        if (!recipe) return res.send("Recipe not found!")

        return res.render("./admin/recipes/edit", {recipe})
    },

    put(req,res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        let index = 0
        data.recipes.find((recipe, foundIndex) => {
            if (recipe.id == req.body.id) {
                index = foundIndex
                return true
            }
        })

        const foundRecipe = data.recipes[index]

        const recipe = {
            ...foundRecipe,
            ...req.body
        }

        data.recipes[index] = recipe

        fs.writeFile("../../../../data.json", JSON.stringify(data, null, 4), (err) => {
            if (err) return res.send("Write file error")

            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },

    delete(req,res) {
        const id = req.body.id

        const filteredRecipes = data.recipes.filter(recipe => {
            return recipe.id != id
        })

        data.recipes = filteredRecipes

        fs.writeFile("data.json", JSON.stringify(data, null, 4), (err) => {
            if (err) return res.send("Write file error")

            return res.redirect(`/admin/recipes`)
        })
    },

    // site

    showHomepage(req,res) {
        const recipes = data.recipes

        return res.render('./site/index', {recipes})
    },

    about(req, res) {
       return res.render('./site/about');
    },

    showRecipesPage(req, res) {
        const recipes = data.recipes

        return res.render('./site/recipes', {recipes})
    },

    showSpecificRecipe(req, res) {
        const id = req.params.id

        const recipe = findRecipe(id)
        if (!recipe) return res.send("Recipe not found!")

        return res.render('./site/show', {recipe})
    }
}