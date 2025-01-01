const Sequelize = require('sequelize');
const sequelize = require('../db/connection');

// Importando os modelos
const Users = require('./Users');
const CircuitsOneTable = require('./CircuitsOne');
const CircuitsTwoTable = require('./CircuitsTwo');
const CircuitsThreeTable = require('./CircuitsThree');
const Projects = require('./Projects');
const RefreshTokens = require('./RefreshTokens');

// Definindo as associações entre os modelos
Users.hasMany(CircuitsOneTable, { foreignKey: 'userId', onDelete: 'CASCADE' });
CircuitsOneTable.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });

Users.hasMany(CircuitsTwoTable, { foreignKey: 'userId', onDelete: 'CASCADE' });
CircuitsTwoTable.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });

Users.hasMany(CircuitsThreeTable, { foreignKey: 'userId', onDelete: 'CASCADE' });
CircuitsThreeTable.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });

Users.hasMany(Projects, { foreignKey: 'userId', onDelete: 'CASCADE' });
Projects.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });

Users.hasMany(RefreshTokens, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshTokens.belongsTo(Users, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Sincronizando os modelos com o banco de dados
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados bem-sucedida!');
    
    // Sincronizando os modelos
    await sequelize.sync({ alter: false }); // 'alter: false' para não alterar as tabelas automaticamente
    console.log('Todos os modelos foram sincronizados com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar os modelos:', error);
  }
})();

module.exports = { Users, CircuitsOneTable, CircuitsTwoTable, CircuitsThreeTable, Projects, RefreshTokens };