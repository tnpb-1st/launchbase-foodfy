const db = require('./../config/db');
const fs = require('fs');

module.exports = {
    create({recipe_id, file_id}) {
        try {
            const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
            `
    
            values = [
                recipe_id,
                file_id
            ];
    
            return db.query(query, values);
        }catch(err) {
            console.error(err);
        }
    },

    async delete(file_id) {
        try {

            const query = `
            DELETE FROM recipe_files WHERE file_id = $1
            `
            return db.query(query, [file_id]);
        
        }catch(err) {
            console.error(err);
        }
    }
}

