const Sequelize = require('sequelize');
const Users = require('./Users')


const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
  host: 'localhost',
  dialect: 'mysql',
})

// Defina o model Circuito
const CircuitsThreeTable = sequelize.define('circuitsthreetable', {
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

Users.hasMany(CircuitsThreeTable, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',  // Se o usuário for deletado, os circuitos relacionados também serão
});

CircuitsThreeTable.belongsTo(Users, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',  // Se o usuário for deletado, o circuito será deletado
});

   (async () => {
    try {
     await sequelize.sync({ alter: true });
     console.log('Tabela de circuitos 3 sincronizada com sucesso!');
   } catch (err) {
     console.error('Erro ao sincronizar a tabela Circuito:', err);
   }
  })()
   
// Exporte o modelo
module.exports = CircuitsThreeTable;
