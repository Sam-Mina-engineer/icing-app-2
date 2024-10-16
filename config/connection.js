const Sequelize = require('sequelize');
require('dotenv').config();

// Expanding to rely on individual variables. 

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, );
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
  
    }
  );
}

module.exports = sequelize;
