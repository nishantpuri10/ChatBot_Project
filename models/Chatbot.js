
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Chatbot = sequelize.define('Chatbot', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});




module.exports = Chatbot;
