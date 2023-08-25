// ///Connecting Database
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'database.sqlite', // Name of the SQLite database file
// });

// module.exports = sequelize;

// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
