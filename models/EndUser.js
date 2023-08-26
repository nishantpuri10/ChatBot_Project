const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Conversation = require('./Conversation'); // Import the Conversation model

const EndUser = sequelize.define('EndUser', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  // Add more attributes as needed
});

// Define associations


module.exports = EndUser;
