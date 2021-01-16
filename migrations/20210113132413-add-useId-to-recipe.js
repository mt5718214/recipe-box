'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Recipes', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Users',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Recipes', 'UserId')
  }
};
