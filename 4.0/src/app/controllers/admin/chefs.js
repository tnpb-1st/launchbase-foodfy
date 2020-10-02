const { date } = require('../../../lib/utils');
const Chef = require('../../models/Chef');

module.exports = {
    index(req, res) {
        
        Chef.all(function(chefs){
            return res.render('./admin/chefs/index', {chefs});
        });

    },

    create(req, res) {
        return res.render(`./admin/chefs/create`);
    },

    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        Chef.create(req.body, function(id) {
            res.redirect(`/admin/chefs/${id}`)
        });
    },

    show(req,res) {
        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send('Chef not found!');

            chef.created_at = date(Date(chef.created_at)).format;

            Chef.getChefRecipes(req.params.id, function(recipesOptions) {
                
                return res.render('./admin/chefs/show', {chef, recipesOptions});
            });
        });
    },

    edit(req,res) {
        Chef.find(req.params.id, function(chef) {
            if (!chef) return res.send('Chef not found!');

            return res.render('./admin/chefs/edit', {chef});
        });
    },

    put(req,res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`);
        });
    },

    delete(req,res) {
        Chef.getChefRecipes(req.body.id, (recipes) => {
            if (!recipes) return res.send("Recipes not found")

            if (recipes.length == 0){
                Chef.delete(req.body.id, function () {
                    return res.redirect('/admin/chefs');
                });
            } else {
                return res.send("Não é possível deleter um chef que possui receitas")
            }
        })
        
    },

    // site

    showChefsOnSite(req, res) {
        Chef.all(function(chefs) {
            return res.render('./site/chefs', {chefs});
        });
    }
}