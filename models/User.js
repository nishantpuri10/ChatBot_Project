// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  // Define other properties of your user
});

module.exports = User;
