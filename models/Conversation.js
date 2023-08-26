const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Chatbot = require('./Chatbot');
const EndUser = require('./EndUser'); // Import the EndUser model when you create it

const Conversation = sequelize.define('Conversation', {
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    allowNull: false,
    defaultValue: 'active',
},
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Other conversation properties
});

Conversation.belongsTo(Chatbot);

module.exports = Conversation;
