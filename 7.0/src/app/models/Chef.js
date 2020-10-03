const db = require('../../config/db');
const { date } = require('./../../lib/utils');

module.exports = {
    all() {
        try {
            return db.query(`
            SELECT chefs.*,  files.path, COUNT(recipes.id) as recipes_quantity
            FROM chefs
            LEFT JOIN recipes on (recipes.chef_id = chefs.id)
            LEFT JOIN files on (files.id = chefs.file_id)
            GROUP BY chefs.id, files.path
            ORDER BY chefs.id ASC`
            );
        }catch(err) {
            console.error(err);
        }
    },

    create(data) {
        try {
            const query = `
        INSERT INTO chefs (
            name,
            created_at,
            file_id
        ) VALUES ($1, $2, $3)
        RETURNING id
        `

        values = [
            data.name,
            date(Date.now()).iso,
            data.file_id
        ];

        return db.query(query, values);

        }catch(err) {
            console.error(err);
        }
    },
    
    find(id) {
        try {
            query = `
            SELECT * FROM 
            chefs 
            WHERE id = $1
            `

            return db.query(query, [id]);
        
        }catch(err) {
            console.error(err);
        }
    },

    update(data) {
        try {
            const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
            `;

            const values = [
                data.name,
                data.file_id,
                data.id
            ];

            return db.query(query, values);
        }catch(err) {
            console.error(err);
        }
    },

    delete(id) {
        // deletar o arquivo do avatar ==> deletar o chefe
        try {
            query = `
            DELETE FROM chefs WHERE id = $1
            `

            return db.query(query, [id]);
        }catch(err) {
            console.error(err);
        }
    },

    getChefRecipes(chef_id) {
        try {
            query = `
            SELECT recipes.id, recipes.title, recipes.created_at, 
            recipe_files.id as conection_id, recipe_files.file_id, 
            files.name as file_name, files.path as file_path
            FROM recipes
            LEFT JOIN recipe_files on (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files on (recipe_files.file_id = files.id)
            WHERE (recipes.chef_id = $1)
            ORDER BY created_at DESC
            `;

            return db.query(query, [chef_id]);
        }catch(err) {
            console.error(err);
        }
    }
}