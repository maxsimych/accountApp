const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  try {
    done(null, user.dataValues.guid);
  } catch (error) {
    done(error)
  }
});
passport.deserializeUser(async (userGuid, done) => {
  try {
    await User.sync();
    const user = await User.findOne({
      where: {guid: userGuid, deleted: false}
    })
    done(null, user);
  } catch (error) {
    done(error)
  }
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:4000/auth/google/redirect"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      await User.sync();
      const user = (await User.findOrCreate({ where: { email: profile.emails[0].value, deleted: false }, defaults: {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value
      }}))[0];
      user.googleId = profile.id;
      await user.save();
      done(null, user);
    } catch (error) {
      done(error)
    }
  })
);
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "http://localhost:4000/auth/facebook/redirect",
  profileFields: ['id', 'name', 'photos', 'email']
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      await User.sync();
      const user = (await User.findOrCreate({ where: { email: profile.emails[0].value, deleted: false}, defaults: {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0].value
      }}))[0];
      user.facebookId = profile.id;
      await user.save();
      done(null, user);
    } catch (error) {
      done(error)
    }
  })
);
passport.use(new LocalStrategy({
  usernameField: 'email',
  },
  async (username, password, done) => {
    try {
      await User.sync();
      const user = await User.findOne({where: { email: username, deleted: false}});
      if(!user) {
        return done(null, false)
      };
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user)
      } else {
        return done(null, false)
      };
    } catch (error) {
      done(error)
    }
  }
));

module.exports = passport;

