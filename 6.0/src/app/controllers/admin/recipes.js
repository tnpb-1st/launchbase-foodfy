const { date } = require('./../../../lib/utils');
const Recipe = require('./../../models/Recipe');
const File = require('./../../models/File');
const R_Files = require('./../../models/Recipe_Files');

module.exports = {
    // admin foodfy
    
    async index(req, res) {
        
        let results = await Recipe.all()
        let recipes = results.rows.map(recipe => ({
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
        }));

        const used_ids = []
        const final_recipes = [];
        recipes = recipes.map(recipe => {
            if (!(used_ids.includes(recipe.id))) {
                used_ids.push(recipe.id);
                final_recipes.push(recipe);
            }
        })

        return res.render('./admin/recipes/index', {recipes: final_recipes});
    },

    async create(req, res) {
        let results = await Recipe.chefSelectOptions();
        const chefsOptions = results.rows;

        return res.render(`./admin/recipes/create`, {chefsOptions});
    },

    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all the fields!');
            }
        }

        if (req.files.length == 0) {
            return res.send('Please, send at least one recipe image!');
        }

        let results = await Recipe.create(req.body);
        var recipe_id = results.rows[0].id;

        let filesPromise = req.files.map(file => {
            return File.create({...file});
        });
        
        let filesIdArray = []
        results = await Promise.all(filesPromise);
        results.forEach(result => filesIdArray.push(result.rows[0].id));

        async function relateFilesAndRecipes() {
            for (let i = 0; i < req.files.length; i++) {
                let file_id = filesIdArray[i];
                await R_Files.create({recipe_id, file_id});
            }
        }
        
        relateFilesAndRecipes();

        return res.redirect(`/admin/recipes/${recipe_id}`);
    },

    async show(req,res) {
        const { id } = req.params;
        
        let results = await Recipe.find(id);
        const recipe = results.rows[0];

        results = await File.getFiles(id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));
        
        if (!recipe) return res.send('Recipe not found!');
        recipe.created_at = date(Date(recipe.created_at)).format;

        results = await Recipe.chefSelectOptions();
        const chefsOptions = results.rows;

        return res.render(`./admin/recipes/show`, {recipe, chefsOptions, files});
    },

    async edit(req,res) {
        const { id } = req.params;
        
        let results = await Recipe.find(id);
        const recipe = results.rows[0];
        
        if (!recipe) return res.send('Recipe not found!');

        // get chefs
        results = await Recipe.chefSelectOptions();
        const chefsOptions = results.rows;

        // get images
        results = await File.getFiles(id);
        let files = results.rows;
        
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        
        return res.render('./admin/recipes/edit', {recipe, chefsOptions, files});
    },

    async put(req,res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all the fields!');
            }
        }

        if (req.files.length != 0) {
            let recipe_id = req.body.id;
            
            let filesPromise = req.files.map(file => {
                return File.create({...file});
            });
            
            let filesIdArray = []
            let results = await Promise.all(filesPromise);
            results.forEach(result => filesIdArray.push(result.rows[0].id));
    
            async function relateFilesAndRecipes() {
                for (let i = 0; i < req.files.length; i++) {
                    let file_id = filesIdArray[i];
                    await R_Files.create({recipe_id, file_id});
                }
            }
            
            relateFilesAndRecipes();
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removeFilesConnections = removedFiles.map(file_id => R_Files.delete(file_id));
            const removedFilesPromise = removedFiles.map(id => File.delete(id));

            await Promise.all(removeFilesConnections);
            await Promise.all(removedFilesPromise);
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);
    },

    async delete(req,res) {
        const { id:recipe_id } = req.body;

        let results = await File.getFiles(recipe_id);
        let files = results.rows;
        
        // delete the connections bewtween the files recipe_files
        const deleteConnections = files.map(file => {R_Files.delete(file.id)});
        await Promise.all(deleteConnections);

        // deleting files
        const deleteFiles = files.map(file => {File.delete(file.id)});
        await Promise.all(deleteFiles);

        // delete the recipe

        await Recipe.delete(recipe_id);

        return res.redirect('/admin/recipes');
    },

    // site

   async showHomepage(req,res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);
        
        const params = {
            filter,
            page,
            limit,
            offset
        }


        let results = await Recipe.paginate(params);
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

        if (recipes[0]) {
            total =  Math.ceil(recipes[0].total/limit);
        }else {
            total = 0
        }

        const pagination = {
            total,
            page
        }

        return res.render('./site/general/home', {recipes:final_recipes, pagination, search});
        
        
    },

    about(req, res) {
        res.render('./site/general/about');
    },

    async showRecipesPage(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;
        let offset = limit * (page - 1);
        
        const params = {
            filter,
            page,
            limit,
            offset
        }

        let results = await Recipe.paginate(params);
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

        if (recipes[0]) {
            total =  Math.ceil(recipes[0].total/limit);
        }else {
            total = 0
        }

        const pagination = {
            total,
            page
        }

        return res.render('./site/recipes/recipes', {recipes:final_recipes, pagination, search});
    },

    async showSpecificRecipe(req, res) {
        const { id } = req.params;
        
        let results = await Recipe.find(id);
        const recipe = results.rows[0];
        
        if (!recipe) return res.send('Recipe not found!');

        results = await File.getFiles(id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        results = await Recipe.chefSelectOptions();
        const chefsOptions = results.rows;


        return res.render('./site/recipes/show', { recipe, chefsOptions, files });
    }
}