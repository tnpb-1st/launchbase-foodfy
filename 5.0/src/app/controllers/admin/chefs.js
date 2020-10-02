const { date } = require('./../../../lib/utils');
const Chef = require('./../../models/Chef');
const File = require('./../../models/File');
const R_Files = require('./../../models/Recipe_Files');
const Recipe = require('./../../models/Recipe')

module.exports = {
    async index(req, res) {
        
        let results = await Chef.all();
        let chefs = results.rows.map(chef => ({
            ...chef,
            avatar: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }));

        return res.render('./admin/chefs/index', {chefs});
    },

    create(req, res) {
        return res.render(`./admin/chefs/create`);
    },

    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        const { filename, path } = req.files[0];
        
        let results = await File.create({filename, path});
        let avatar_id = results.rows[0].id;

        req.body.file_id = avatar_id;

        results = await Chef.create(req.body);
        let id = results.rows[0].id;

        
        return res.redirect(`/admin/chefs/${id}`)
    },

    async show(req,res) {
        const { id } = req.params;

        let results = await Chef.find(id);
        const chef = results.rows[0];

        if (!chef) return res.send('Chef not found!');

        results = await File.getFileById(chef.file_id);
        chef.avatar = `${req.protocol}://${req.headers.host}${results.rows[0].path.replace("public", "")}`;

        chef.created_at = date(Date(chef.created_at)).format;
        
        results = await Chef.getChefRecipes(id);

        const final_recipes = [];
        const used_ids = [];
        const recipes = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.file_path.replace("public", "")}`
        }));

        recipes.forEach(recipe => {
            if (!(used_ids.includes(recipe.id))){
                used_ids.push(recipe.id);
                final_recipes.push(recipe);
            }
        })
        
        
        return res.render('./admin/chefs/show', {chef, recipes: final_recipes});
    },

    async edit(req,res) {
        const { id } = req.params;

        let results = await Chef.find(id);
        const chef = results.rows[0];

        if (!chef) return res.send('Chef not found!');

        results = await File.getFileById(chef.file_id);
        const file = results.rows[0];
        
        return res.render(`./admin/chefs/edit`, { chef, file });
    },

    async put(req,res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        let results = await Chef.find(req.body.id);
        let old_file_id = results.rows[0].file_id;
        let file_id = old_file_id;

        if (req.files.length != 0) {
            const { filename, path } = req.files[0];
            results = await File.create({filename, path});
            let new_id = results.rows[0].id;
            file_id = new_id;
        }

        req.body.file_id = file_id;
        await Chef.update(req.body);
        
        if (file_id != old_file_id) {
            await File.delete(old_file_id);
        }

        return res.redirect(`/admin/chefs/${req.body.id}`);
    },

    async delete(req,res) {
        // delete connections => files => recipes => avatar => chef
        const { id:chef_id } = req.body;

        let results = await Chef.getChefRecipes(chef_id);

        const delConnectionsPromises = results.rows.map(recipe => {R_Files.delete(recipe.file_id)});
        await Promise.all(delConnectionsPromises);

        const delFilesPromises = results.rows.map(recipe => {File.delete(recipe.file_id)});
        await Promise.all(delFilesPromises);

        const deletedRecipesIds = [];
        const delRecipesPromises = results.rows.map(recipe => {
            if (!(deletedRecipesIds.includes(recipe.id))) {
                deletedRecipesIds.push(recipe.id);
                Recipe.delete(recipe.id);
            }
            return;
        });

        await Promise.all(delRecipesPromises);

        results = await File.getChefAvatar(chef_id);
        const file_id = results.rows[0].id;

        await Chef.delete(chef_id);
        await File.delete(file_id);
        return res.redirect('/admin/chefs');
    },

    // site

    async showChefsOnSite(req, res) {
        let results = await Chef.all();
        
        const chefs = results.rows.map(chef => ({
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }));

        return res.render('./site/chefs', {chefs});
    }
}