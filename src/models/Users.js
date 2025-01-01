const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../db/connection'); // Importa a instância de conexão

const Users = sequelize.define('users', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  cellNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Método para criar usuário com senha hash
Users.createWithHash = async (name, username, email, cellNumber, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return Users.create({ name, username, email, cellNumber, password: hashedPassword });
};

module.exports = Users;
