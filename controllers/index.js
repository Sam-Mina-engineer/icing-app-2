const express = require('express');
const router = express.Router();
const { Employee, Order } = require('../models'); // Import the models

// Middleware to check session verification

const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return next(); // Proceed if authenticated
  } else {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
};

// Import routes from the api.js file

const apiRoutes = require('./api');

// Set up API routes at /api

router.use('/api', apiRoutes);

// Add a GET route for /login to render the login page

router.get('/login', (req, res) => {
  res.render('login');  // Render the login.handlebars template
});

// Add a GET route for /

router.get('/', (req, res) => {
  res.redirect('/login');  // Redirect to login
});

// Add a POST route for logout

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/login');  // Redirect to login after logout
  });
});

// Add a GET route for /dashboard with session authentication

router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // Fetch all orders and employees to pass to the dashboard
    const ordersData = await Order.findAll(); // Fetch all orders
    const employeesData = await Employee.findAll(); // Fetch all employees

    // Transform Sequelize models to plain objects
    const orders = ordersData.map(order => order.get({ plain: true }));
    const employees = employeesData.map(employee => employee.get({ plain: true }));

    // Log orders for debugging purposes
    console.log('Orders:', orders); // Ensure orders are being fetched correctly

    // Render the dashboard view with the fetched data
    res.render('dashboard', { orders, employees, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
