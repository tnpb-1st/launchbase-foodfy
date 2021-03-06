const db = require('./../config/db');
const { date } = require('./../../lib/utils');

module.exports = {
    all() {
        try {
            return db.query(`
            SELECT recipes.id, recipes.title, 
            chefs.name as chef_name,
            recipe_files.file_id,
            files.path
            FROM recipes
            LEFT JOIN chefs on (recipes.chef_id = chefs.id)
            LEFT JOIN recipe_files on (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files on (recipe_files.file_id = files.id)
            ORDER BY recipes.title ASC`);
        }catch(err) {
            console.error(err);
        }
    },

    create(data) {
        try {
            const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `

            values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now()).iso
            ];

            return db.query(query, values);
        }catch(err) {
            console.error(err);
        }
    },
    
    find(id) {
        try {
            query = `
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes 
            LEFT JOIN chefs on (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1
            `

            return db.query(query, [id]);
        }catch(err) {
            console.error(err);
        }
    },

    findBy(filter) {
        try {
            return db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs on (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY recipes.title ASC`);
        }catch(err) {
            console.error(err);
        }
    },

    update(data) {
        try {
            const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6
            `;

            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.id
            ];

            return db.query(query, values);
        }catch(err) {
            console.error(err);
        }
    },

    delete(id) {
        // deletar as ligações ==> os arquivos ==> as receitas
        try {
            query = `
        DELETE FROM recipes WHERE id = $1
        `

        return db.query(query, [id]);
        }catch(err) {
            console.error(err);
        }
    },

    chefSelectOptions() {
        try {
            return db.query('SELECT name,id FROM chefs');
        }catch(err) {
            console.error(err);
        }
    }, 

    async paginate(params) {
        const { filter, limit, offset, callback } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`;

        if (filter) {
            
            filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT recipes.id, recipes.title, 
        ${totalQuery} , chefs.name AS chef_name,
        recipe_files.file_id, files.path
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        LEFT JOIN recipe_files on (recipe_files.recipe_id = recipes.id)
        LEFT JOIN files on (recipe_files.file_id = files.id)
        ${filterQuery}
        ORDER BY recipes.title ASC
        LIMIT $1 OFFSET $2
        `;

        db.query(query, [limit,offset], function(err, results) {
            if (err) throw `Database error! ${err}`;

            callback(results.rows);
        });
    }
}