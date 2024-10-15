const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: {
      require: true, // For Render
      rejectUnauthorized: false 
    }
  }
});

module.exports = sequelize;
