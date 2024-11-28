const Sequelize = require('sequelize');
const Users = require('./Users')

const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
  host: 'localhost',
  dialect: 'mysql',
})


const CircuitsOneTable = sequelize.define('circuitsonetable', {
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
    // Definição de outros campos da tabela...
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',  // Nome da tabela que você quer referenciar
        key: 'id',       // A chave primária da tabela Users
      },
      allowNull: false  // Defina como necessário (true ou false)
    },
  }, );

  Users.hasMany(CircuitsOneTable, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',  // Se o usuário for deletado, os circuitos relacionados também serão
  });
  
  CircuitsOneTable.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',  // Se o usuário for deletado, o circuito será deletado
  });

   (async () => {
  try {
   await sequelize.sync({alter: true});
   console.log('Tabela de circuitos 1 sincronizada com sucesso!');
 } catch (err) {
   console.error('Erro ao sincronizar a tabela Circuito:', err);
 }
})();

// Exporte o modelo
module.exports = CircuitsOneTable;
