const { Pool } = require('pg');

module.exports = new Pool({
    user: 'postgres',
    password: '1930',
    host: 'localhost',
    port: '5432',
    database: 'test'
});