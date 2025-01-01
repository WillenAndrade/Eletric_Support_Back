const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

const CircuitsTwoTable = sequelize.define('circuitstwotable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cabe: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  tension: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  patternInfo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  potence: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  totalPotence: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  amper: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = CircuitsTwoTable;

