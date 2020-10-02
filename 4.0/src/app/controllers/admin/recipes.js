const { date } = require('../../../lib/utils');
const Recipe = require('../../models/Recipe');

module.exports = {
    // admin foodfy
    
    index(req, res) {
        
        Recipe.all(function(recipes){

            return res.render('./admin/recipes/index', {recipes});
        });

    },

    create(req, res) {
        Recipe.chefSelectOptions(function(chefsOptions) {

            return res.render(`./admin/recipes/create`, {chefsOptions});
        });
    },

    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        Recipe.create(req.body, function(id) {
            res.redirect(`/admin/recipes/${id}`)
        });
    },

    show(req,res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Recipe not found!');

            recipe.created_at = date(Date(recipe.created_at)).format;

            Recipe.chefSelectOptions(function(chefsOptions) {
                return res.render(`./admin/recipes/show`, {recipe, chefsOptions});
            });
        });
    },

    edit(req,res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send('Recipe not found!');

            Recipe.chefSelectOptions(function(chefsOptions) {
                return res.render('./admin/recipes/edit', {recipe, chefsOptions});
            });
        });
    },

    put(req,res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        Recipe.update(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`);
        });
    },

    delete(req,res) {

        Recipe.delete(req.body.id, function () {
            return res.redirect('/admin/recipes');
        });
    },

    // site

    showHomepage(req,res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                
                if (recipes[0]) {
                    total =  Math.ceil(recipes[0].total/limit);
                }else {
                    total = 0
                }

                const pagination = {
                    total,
                    page
                }
                return res.render('./site/index', {recipes, pagination, filter});
            }
        }

        Recipe.paginate(params);
    },

    about(req, res) {
        res.render('./site/about');
    },

    showRecipesPage(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 9;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                if (recipes[0]) {
                    total =  Math.ceil(recipes[0].total/limit);
                }else {
                    total = 0
                }

                const pagination = {
                    page
                }

                return res.render('./site/recipes', {recipes, pagination, filter});
            }
        }

        Recipe.paginate(params);
    },

    showSpecificRecipe(req, res) {
        const id = req.params.id;

        Recipe.find(id, function(recipe) {
            return res.render('./site/showRecipe', {recipe});
        });
    }
}