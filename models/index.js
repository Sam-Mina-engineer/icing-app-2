const Sequelize = require('sequelize');  // Import Sequelize
const sequelize = require('../config/connection');  // Import the Sequelize instance

const Employee = require('./employee');
const Order = require('./order');

// Define associations

Employee.hasMany(Order, {
  foreignKey: 'employee_id',
  onDelete: 'CASCADE'
});

Order.belongsTo(Employee, {
  foreignKey: 'employee_id'
});

// Export the models and the sequelize connection

module.exports = { sequelize, Employee, Order };
