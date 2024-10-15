const express = require('express');
const router = express.Router();

// Import routes from the api.js file

const apiRoutes = require('./api/api');

// Set up API routes at /api

router.use('/api', apiRoutes);

// Add a GET route for /login to render the login page

router.get('/login', (req, res) => {
  res.render('login');  // Render the login.handlebars template
});


router.get('/', (req, res) => {
  res.render('homepage');  
});

router.use((req, res) => {
  res.status(404).render('404');  
});

module.exports = router;
