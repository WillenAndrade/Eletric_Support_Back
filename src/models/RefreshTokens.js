const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize')
const Users = require('./Users'); 

const sequelize = new Sequelize('eletricsupport', 'root', 'tsqeupaf2025A', {
    host: 'localhost',
    dialect: 'mysql',
  });

const RefreshTokens = sequelize.define('RefreshTokens', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'refresh_tokens', 
    timestamps: true, 
    underscored: true, 
});

RefreshTokens.associate = (models) => {
    RefreshTokens.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
    });
}; 

(async () => {
    try {
     await sequelize.sync({ alter: true });
     console.log('Tabela de RefreshTokens sincronizada com sucesso!');
   } catch (err) {
     console.error('Erro ao sincronizar a tabela Refreshtokens:', err);
   }
  })();



module.exports = RefreshTokens;