const express = require('express');
const router = express.Router();

// Import routes from the api.js file

const apiRoutes = require('./api');

// Set up API routes at /api

router.use('/api', apiRoutes);

// Add a GET route for /login to render the login page

router.get('/login', (req, res) => {
  res.render('login');  // Render the login.handlebars template
});

// Add a GET route

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

module.exports = router;
