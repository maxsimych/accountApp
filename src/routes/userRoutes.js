const catchException = require('../middleware/catchException');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Router } = require('express');
const router = new Router;
const User = require('../models/user');

router.post('/', catchException(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ firstName: firstName, lastName: lastName, email: email, password: hash});
  if(user) {
    res.redirect('/login');
  } else {
    res.redirect('/signup');
  }
}));
router.delete('/:email', catchException(async (req, res) => {
  console.log(req.params.email);
  const user = await User.findOne({ where: {email: req.params.email, deleted:false }});
  user.email = `deleted(${user.guid}):${user.email}`;
  user.googleId = `deleted(${user.guid}):${user.googleId}`;
  user.facebookId = `deleted(${user.guid}):${user.facebookId}`;
  user.deleted = true;
  user.save();
  req.logout();
  res.redirect('/');
}));

module.exports = router;