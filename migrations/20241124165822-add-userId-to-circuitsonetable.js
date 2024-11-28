'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CircuitsOneTable', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',  // Tabela de usuários
        key: 'id',       // Chave primária de usuários
      },
      allowNull: false,  // Modifique conforme necessário
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CircuitsOneTable', 'userId');
  },
};

