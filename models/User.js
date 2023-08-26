// const { DataTypes } = require('sequelize');
// const sequelize = require('../db');
// const Chatbot = require('./Chatbot');

// const User = sequelize.define('User', {
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true,
//       },
//     },
//     // Define other properties of your user
//   });

// User.hasMany(Chatbot);

// module.exports = User;


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
  // Add more attributes as needed
});

// Define associations
const Chatbot = require('./Chatbot');
User.hasMany(Chatbot);

module.exports = User;
