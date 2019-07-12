'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/userdb');

const User = sequelize.define('user', {
  guid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  email: {
    type: Sequelize.STRING(200),
    unique: true,
    allowNull: false
  },
  googleId: {
    type: Sequelize.STRING(200),
    unique: true,
  },
  facebookId: {
    type: Sequelize.STRING(200),
    unique: true,
  },
  avatar: {
    type: Sequelize.STRING(200)
  },
  firstName:  {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING(200),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(200)
  },
  deleted: {
    type: Sequelize.BOOLEAN(),
    defaultValue: false
  }
});

module.exports = User;