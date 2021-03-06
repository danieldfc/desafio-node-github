import Sequelize, { Model } from 'sequelize';

class Github extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        login: Sequelize.STRING,
        bio: Sequelize.STRING,
        locale: Sequelize.STRING,
        html_url: Sequelize.STRING,
        tags: [Sequelize.STRING],
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Github;
