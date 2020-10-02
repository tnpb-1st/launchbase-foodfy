const db = require('../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(callback) {
        db.query(`
        SELECT chefs.*, recipes.id, recipes.image, recipes.title, 
        recipes.id as recipe_id, chefs.id as chef_id,
        count(recipes.id) AS recipes_number
        FROM chefs
        LEFT JOIN recipes on (recipes.chef_id = chefs.id)
        GROUP BY recipes.id, chefs.id
        ORDER BY chefs.id ASC`, function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
        });
    },

    create(data, callback) {
        const query = `
        INSERT INTO chefs (
            name,
            avatar_url,
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
        `

        values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ];

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows[0].id);
        });
    },
    
    find(id, callback) {
        query = `
        SELECT * FROM 
        chefs 
        WHERE id = $1
        `

        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows[0]);
        });
    },

    update(data, callback) {
        const query = `
        UPDATE chefs SET
            name=($1),
            avatar_url=($2)
        WHERE id = $3
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ];

        db.query(query, values, function(err, results) {
            if (err) throw `Database error! ${err}`;

            callback();
        });
    },

    delete(id, callback) {
        query = `
        DELETE FROM chefs WHERE id = $1
        `

        db.query(query, [id], function(err) {
            if (err) throw `Database error! ${err}`;

            callback();
        });
    },

    getChefRecipes(id, callback) {
        query = `
        SELECT image, title, id 
        FROM recipes
        WHERE (recipes.chef_id = $1)
        ORDER BY title ASC
        `;

        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
        });
    }
}