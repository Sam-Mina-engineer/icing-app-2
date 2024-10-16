const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const path = require('path');
const exphbs = require('express-handlebars');  // Handlebars
const sequelize = require('./config/connection');


// Load environment variables

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create()
// Session setup

app.use(session({
  secret: process.env.SESSION_SECRET,  // Store the secret in .env 
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize  // Store sessions in PostgreSQL using Sequelize
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));

// Middleware to parse incoming requests with JSON and URL encoded data

app.engine('handlebars', hbs.engine) 
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./controllers/index'));


// Serve static files from the public directory

app.use(express.static(path.join(__dirname, 'public')));


// Routes (linking to controller file)

app.use(require('./controllers/api')); //corrected path



// Start the server

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Unable to connect:', err));
