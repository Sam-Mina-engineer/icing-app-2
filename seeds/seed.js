const sequelize = require('../config/connection');
const { Employee, Order } = require('../models');  // Corrected the model names

const employeeData = require('./employeeData.json');
const orderData = require('./orderData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: false }); //changed to false to protect database in Render

 
  const employees = await Employee.bulkCreate(employeeData, {
    individualHooks: true,  // Ensures password hashing hook is applied
    returning: true,        // Returns the created employee records
  });

  // Create orders, associating each order with an employee's ID
  
  for (const order of orderData) {
    await Order.create({
      ...order,
      employee_id: employees[Math.floor(Math.random() * employees.length)].id,  // Assign random employee_id
    });
  }

  process.exit(0);
};

seedDatabase();
