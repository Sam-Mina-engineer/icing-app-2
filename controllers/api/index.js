const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Employee, Order } = require('../../models');

// Middleware for validating new order data.

// This is the new technology. JOI validation. 

const validateNewOrder = (req, res, next) => {
  const schema = Joi.object({
    customerName: Joi.string().min(3).required(),
    itemOrdered: Joi.string().required(),
    pickupDate: Joi.string().required(),
    details: Joi.string().allow(null, ''), // To allow incomplete submissions
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

module.exports = router;
