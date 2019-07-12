require('dotenv').config();
const express = require('express');
const passport = require('./middleware/passportStrategy');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const routes = require('./routes');
const cookieSession = require('cookie-session');
const methodOverrie = require('method-override');

app.disable('x-powered-by');
app.use(methodOverrie('_method'));
app.use(cookieSession({
  maxAge: 30*24*60*60*1000,
  keys: ['secrekey']
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));
app.use('/', routes.pageRoutes);
app.use('/auth', routes.authRoutes);
app.use('/users', routes.userRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ error: error.message });
});

module.exports = app;