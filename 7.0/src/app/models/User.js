const db = require('../../config/db')
const { create } = require('browser-sync')

module.exports = {
    async findOne(filters) {
        try {
                let query = "SELECT * FROM users"

                Object.keys(filters).map(key => {
                    // WHERE | OR
                    query = `${query}
                    ${key}
                    `

                    Object.keys(filters[key]).map(field => {
                        query = `${query} ${field} = '${filters[key][field]}'`
                    })
                })

                const results = await db.query(query)
                return results.rows[0]
            
            } catch (err) {
                console.error(err)
            }
    },

    async create(data) {
        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id`

            values = [
                data.name,
                data.email,
                data.password,
                data.is_admin || false
            ]

            const results = await db.query(query, values)
            return results.rows[0].id

        } catch(err) {
            console.error(err)
        }
    },

    async getAll(admId) {
        try {
            query = `SELECT * FROM users WHERE id != $1 ORDER BY name ASC`

            const results = await db.query(query, [admId])
            
            const users = results.rows

            return users
            
        } catch (err) {
            console.error(err)
        }
    },

    async update(id, fields) {
        let query = 'UPDATE users SET'

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    },

    async getUserRecipes(userId) {
        try {
            const query = `
            SELECT recipes.* AS recipe_id
            FROM recipes
            LEFT JOIN users on (users.id = recipes.user_id)
            WHERE users.id = $1
            ORDER BY recipes.id ASC`

            const results = await db.query(query, [userId])
            const recipes = results.rows

            return recipes
        } catch (err) {
            console.error(err)
        }
    },

    delete(userId) {
        try {
            return db.query('DELETE FROM users WHERE id = $1', [userId])

        } catch (err) {
            console.error(err)
        }
    }
}