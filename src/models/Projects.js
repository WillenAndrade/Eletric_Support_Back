
const Sequelize = require('sequelize')
const Users = require('./Users')

const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
    host: 'localhost',
    dialect: 'mysql',
  });


  const Projects = sequelize.define('myprojects', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      type: Sequelize.INTEGER,
      references: {
        model: 'users',  // Reference the 'users' table
        key: 'id'        // Reference the 'id' column in 'users' table
      }
    }
}, {
  timestamps: true, // Isso garante que o Sequelize preencha createdAt e updatedAt
});

      // Define associations
    Users.hasMany(Projects, {
      foreignKey: 'userId', // This is the foreign key in the Projects table
      onDelete: 'CASCADE'   // If a user is deleted, their projects will also be deleted
    });
    Projects.belongsTo(Users, {
      foreignKey: 'userId', // The foreign key in Projects pointing to Users
      onDelete: 'CASCADE'   // If a user is deleted, delete their projects
    });

  
(async () => {
  try {
   await sequelize.sync({ alter: true });
   console.log('Tabela de projetos sincronizada com sucesso!');
 } catch (err) {
   console.error('Erro ao sincronizar a tabela Projetos:', err);
 }
})();

  module.exports = Projects

