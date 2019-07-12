const catchException = require('../middleware/catchException');
const passport = require('../middleware/passportStrategy');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Router } = require('express');
const router = new Router;
const User = require('../models/user');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/' }),
  catchException((req, res) => {
    if(req.user.dataValues.password) {
      res.redirect('/')
    } else {
      res.redirect('/createPassword')
    }
  })
);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] })
);
router.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  catchException((req, res) => {
    if(req.user.dataValues.password) {
      res.redirect('/')
    } else {
      res.redirect('/createPassword')
    }
  })
);
router.post('/login', passport.authenticate('local',
  {successRedirect: '/',
  failureRedirect: '/login',
  })
);
router.post('/createPassword', catchException(async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = await User.findOne({where: {email: email, deleted: false}});
  user.password = hash;
  await user.save();
  passport.authenticate('local',
    {successRedirect: '/',
      failureRedirect: '/login',
    })(req, res);
}));
router.get('/logout', catchException((req, res) => {
  req.logout();
  res.redirect('/');
}));

module.exports = router;