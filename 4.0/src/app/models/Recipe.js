const db = require('../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(callback) {
        db.query(`
        SELECT recipes.*, chefs.name as chef_name
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        ORDER BY recipes.title ASC`, function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
        });
    },

    create(data, callback) {
        const query = `
        INSERT INTO recipes (
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `

        values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information
        ];

        db.query(query, values, function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows[0].id);
        });
    },
    
    find(id, callback) {
        query = `
        SELECT recipes.*, chefs.name as chef_name
        FROM recipes 
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `

        db.query(query, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows[0]);
        });
    },

    findBy(filter, callback) {
        db.query(`
        SELECT recipes.*, chefs.name as chef_name
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.title ASC`, function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
        });
    },

    update(data, callback) {
        const query = `
        UPDATE recipes SET
            chef_id=($1),
            image=($2),
            title=($3),
            ingredients=($4),
            preparation=($5),
            information=($6)
        WHERE id = $7
        `;

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ];

        db.query(query, values, function(err, results) {
            if (err) throw `Database error! ${err}`;

            callback();
        });
    },

    delete(id, callback) {
        query = `
        DELETE FROM recipes WHERE id = $1
        `

        db.query(query, [id], function(err) {
            if (err) throw `Database error! ${err}`;

            callback();
        });
    },

    chefSelectOptions(callback) {
        db.query('SELECT name,id FROM chefs', function(err, results) {
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
        });
    }, 

    paginate(params) {
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
        SELECT recipes.*, ${totalQuery} , chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `;

        db.query(query, [limit,offset], function(err, results) {
            if (err) throw `Database error! ${err}`;

            callback(results.rows);
        });
    }
}