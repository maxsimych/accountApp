const catchException = require('../middleware/catchException');
const { Router } = require('express');
const router = new Router;


router.get('/', catchException((req, res) => {
  if(req.user) {
    res.redirect('/account');
  } else {
    res.render('home');
  };
}));
router.get('/signup', catchException((req, res) => {
  if(req.user) {
    res.redirect('/account');
  } else {
    res.render('signup')
  };
}));
router.get('/login', catchException((req, res) => {
  if(req.user) {
    res.redirect('/account');
  } else {
    res.render('login')
  };
}));
router.get('/account', catchException((req, res) => {
  if(req.user) {
    var google = 'not connected';
    var facebook = 'not connected';
    if (req.user.dataValues.googleId) google = `connected (id - ${req.user.dataValues.googleId})`;
    if (req.user.dataValues.facebookId) facebook = `connected (id - ${req.user.dataValues.facebookId})`;
    res.render('account', {
      name: req.user.dataValues.firstName,
      fullName: `${req.user.dataValues.firstName} ${req.user.dataValues.lastName}`,
      email: req.user.dataValues.email,
      avatar: req.user.dataValues.avatar,
      createdAt: req.user.dataValues.createdAt.toLocaleDateString(),
      updatedAt: req.user.dataValues.updatedAt.toLocaleDateString(),
      google: google,
      facebook: facebook
    })
  } else {
    res.redirect('/');
  };
}));
router.get('/createPassword', catchException(async (req, res) => {
  const user = req.user;
  req.logout();
  res.render('createPassword', {name: user.dataValues.firstName, email: user.dataValues.email});
}));

module.exports = router;