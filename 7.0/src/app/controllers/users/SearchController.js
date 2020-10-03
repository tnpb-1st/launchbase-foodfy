const Recipe = require('../../models/Recipe');

module.exports = {
    async index(req, res) {
        try {
                let results,
                    params = {}

                const { filter } = req.query;

                if (!filter) return res.redirect('/');

                params.filter = filter;

                results = await Recipe.search(params);
                const recipes = results.rows;

                const usedRecipesIds = [];
                let final_recipes = [];

                recipes.map(recipe => {
                    if (!(usedRecipesIds.includes(recipe.id))) {
                        usedRecipesIds.push(recipe.id);
                        final_recipes.push(recipe);
                    }
                })

                final_recipes = final_recipes.map(recipe => ({
                    ...recipe,
                    src: `${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                }));

                const search = {
                    term: req.query.filter,
                    total: recipes.length
                }

                return res.render("./site/search/recipes.njk", { recipes:final_recipes, search })
            
        } catch (err) {

            console.error(err);
        }
    }
}