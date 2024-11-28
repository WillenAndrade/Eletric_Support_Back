const Sequelize = require('sequelize');

const bcrypt = require('bcryptjs');


const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
  host: 'localhost',
  dialect: 'mysql',
});

// Defina o model Usuários
const Users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email :  {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cellNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
 
}); 

// Método para criar usuário com senha hash
Users.createWithHash = async (name, username, email, cellNumber, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return Users.create({ name, username, email,  cellNumber, password: hashedPassword });
};

(async () => {
  try {
    await sequelize.sync({alter: true});
    console.log('Tabela de usuários sincronizada com sucesso!');
  } catch (err) {
    console.error('Erro ao sincronizar a tabela de usuários:', err);
  }
})();

 
module.exports = Users;
