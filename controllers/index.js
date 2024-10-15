const express = require('express');
const router = express.Router();

// Import routes from the api.js file

const apiRoutes = require('./api');

// Set up API routes at /api



// Add a GET route for /login to render the login page

router.get('/', (req, res) => {
  console.log('hello')
  res.render('login');  
});

router.get('/login', (req, res) => {
  res.render('login');  // Render the login.handlebars template
});


router.use('/api', apiRoutes);

// router.use((req, res) => {
//   res.status(404).render('404');  
// });

module.exports = router;
