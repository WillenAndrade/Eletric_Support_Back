const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
  host: 'mysql', // Nome do host ou contêiner (como definido no Docker)
  dialect: 'mysql', // Tipo de banco de dados
});

module.exports = sequelize;