const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

const Projects = sequelize.define('myprojects', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  linkNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = Projects;

