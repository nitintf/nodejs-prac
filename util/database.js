const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-prac', 'root', 'Shadow@0802', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
