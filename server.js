const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const path = require('path');
const exphbs = require('express-handlebars');  // Handlebars
const db = require('./models');

// Load environment variables

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Session setup

app.use(session({
  secret: process.env.SESSION_SECRET,  // Store the secret in .env 
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: db.sequelize  // Store sessions in PostgreSQL using Sequelize
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));

// Middleware to parse incoming requests with JSON and URL encoded data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory

app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars

const { engine } = require('express-handlebars');  // Updated way to require express handlebars
app.set('view engine', 'handlebars');

// Routes (linking to controller file)

app.use(require('./controllers/api'));

// Default route 
app.get('/', (req, res) => {
  res.redirect('/login');  // Redirect to the login page
});

// Start the server

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Unable to connect:', err));
