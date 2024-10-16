const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Employee, Order } = require('../../models');

// Middleware for validating new order data.

// This is the new technology. JOI validation. 

const validateNewOrder = (req, res, next) => {
  const schema = Joi.object({
    customer_name: Joi.string().min(3).required(),
    item_ordered: Joi.string().required(),
    pickup_date: Joi.string().required(),
    details: Joi.string().allow(null, ''),
    employee_id: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect('/login');
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

    req.session.employeeId = employee.id;
    req.session.loggedIn = true;

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST route for logout

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.status(500).send('Failed to logout');
    }
    res.status(204).send(); // Send no content to indicate successful logout
  });
});

// Dashboard and order management routes.

// POST route to create a new order

router.post('/orders', isAuthenticated, validateNewOrder, async (req, res) => {
  try {
    const { customer_name, item_ordered, pickup_date, details, employee_id } = req.body;

    const order = await Order.create({
      customer_name,
      item_ordered,
      pickup_date,
      details,
      employee_id,
    });
    console.log('Order created:', order); // Log the created order to verify
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create new order' });
  }
});

module.exports = router;
