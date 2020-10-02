const db = require('./../config/db');
const fs = require('fs');
const { query } = require('./../config/db');

module.exports = {
    create({filename, path}) {
        try {
            const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
            `
    
            values = [
                filename,
                path
            ];
    
            return db.query(query, values);
        }catch(err) {
            console.error(err);
        }
    },

    getFileIdByName(filename) {
        try {
            query = `
            SELECT id
            FROM files
            WHERE files.name LIKE '${filename}'
            `
        }catch(err) {
            console.error(err);
        }
    },

    getFiles(recipe_id) {
        const query = `
        SELECT files.*, recipe_files.recipe_id
        FROM files
        LEFT JOIN recipe_files on (files.id = recipe_files.file_id)
        WHERE (recipe_files.recipe_id = $1)
        `;

        return db.query(query, [recipe_id]);
    },

    async delete(id) {
        
        const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
        const file = result.rows[0];

        fs.unlinkSync(file.path) // deleta a imagem
        
        try {
            const query = `
            DELETE FROM files WHERE id = $1
            `
            return db.query(query, [id]);
        }catch(err) {
            console.error(err);
        }
    },

    getFileById(id) {
        try {
            return db.query(`SELECT files.* FROM files WHERE id = $1`, [id]);
        
        }catch(err) {
            console.error(err);
        }
    },

    getChefAvatar(chef_id) {
        const query = `
        SELECT files.*, chefs.id as chef_id 
        FROM files
        LEFT JOIN chefs on (files.id = chefs.file_id)
        WHERE chefs.id = $1
        `
        return db.query(query, [chef_id])
    } 
}

