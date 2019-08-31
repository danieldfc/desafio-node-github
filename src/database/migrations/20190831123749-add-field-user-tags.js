module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('githubs', 'tags', {
      type: Sequelize.STRING,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('githubs', 'tags');
  },
};
