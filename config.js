// config.js
{
    const dotenv = require('dotenv');
    dotenv.config();
    module.exports = {
        host: process.env.SQLHOST,
        database: process.env.DATABASENAME
    };
}