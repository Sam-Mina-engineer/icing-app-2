const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    item_ordered: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickup_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    
    // Updated this field from "employee" to "employee_id"

    // The foreign key now references the 'id' column in the 'employee' table.

    employee_id: {
      type: DataTypes.INTEGER,  // Changed from STRING to INTEGER to reference the Employee ID
      references: {
        model: 'employee',  // References the 'employee' model's 'id' field
        key: 'id',          // Refers to the 'id' field.
      },
      onDelete: 'CASCADE',  // Ensures that when an employee is deleted, their orders are also deleted
    },
    details: {
      type: DataTypes.STRING,

      // Optional field to include additional order information
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,

    // Fixed the model name from 'project' to 'order'

    modelName: 'order',  // Corrected model name to 'order' to match.
    tableName: 'bakeryorder', // Changing name of table to avoid PostgreSQL conflict
  }
);

module.exports = Order;
