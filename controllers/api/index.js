const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Employee, Order, Customer } = require('../../models');

// Middleware for validating new order data

const validateNewOrder = (req, res, next) => {
  const schema = Joi.object({
    customerName: Joi.string().min(3).required(),
    itemOrdered: Joi.string().required(),
    pickupDate: Joi.string().required(),
    details: Joi.string().allow(null, ''), // To allow for incomplete submissions 
    employeeId: Joi.number().required()  // Employee ID for assignment
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

// Middleware to check session verification

const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return next(); // Proceed if authenticated
  } else {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
};

// POST route for handling login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const employee = await Employee.findOne({ where: { email } });

    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set up session

    req.session.employeeId = employee.id;
    req.session.loggedIn = true;

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET route for displaying the dashboard (Protected by authentication)

router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // Fetch all orders and employees to pass to the dashboard

    const orders = await Order.findAll();
    const employees = await Employee.findAll();

    res.render('dashboard', { orders, employees });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// POST route for adding a new order 

router.post('/orders', isAuthenticated, validateNewOrder, async (req, res) => {
  try {
    const { customerName, itemOrdered, pickupDate, details, employeeId } = req.body;

    // Create new order and link it to the employee

    const order = await Order.create({
      customerName,
      itemOrdered,
      pickupDate,
      details,
      employeeId
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to create new order' });
  }
});

// PUT route for updating an order status 

router.put('/orders/:id', isAuthenticated, async (req, res) => {
  try {
    const updatedOrder = await Order.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE route for deleting an order 

router.delete('/orders/:id', isAuthenticated, async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to deleted order' });
  }
});

module.exports = router;
