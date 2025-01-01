const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

const RefreshTokens = sequelize.define('refreshtokens', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = RefreshTokens;

