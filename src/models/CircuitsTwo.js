const Sequelize = require('sequelize');
const Users = require('./Users')

const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
  host: 'localhost',
  dialect: 'mysql',
});

const CircuitsTwoTable = sequelize.define('circuitstwotable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: Sequelize.INTEGER,
    references: {
      model: 'users',  // Reference the 'users' table
      key: 'id'        // Reference the 'id' column in 'users' table
    },
    allowNull : false
  } 
}); 

Users.hasMany(CircuitsTwoTable, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',  // Se o usuário for deletado, os circuitos relacionados também serão
});

CircuitsTwoTable.belongsTo(Users, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',  // Se o usuário for deletado, o circuito será deletado
});

// Exporte o modelo
(async () => {
  try {
   await sequelize.sync({alter: true});
   console.log('Tabela de circuitos 2 sincronizada com sucesso!');
 } catch (err) {
   console.error('Erro ao sincronizar a tabela Circuito:', err);
 }
})();

module.exports = CircuitsTwoTable;
