const { Sequelize } = require('sequelize');
const dbConfig = require('./db'); // Import the configuration


// Create a new Sequelize instance using the configuration
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

module.exports = sequelize; // Export the Sequelize instance
