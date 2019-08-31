import User from '../models/User';
import Github from '../models/Github';

class DeleteGithubServices {
  async run({ provider_id, user_id }) {
    const isProvider = await User.findOne({
      where: {
        id: user_id,
        provider: true,
      },
    });

    if (!isProvider) {
      throw new Error('User is not provider.');
    }

    const github = await Github.findOne({
      where: {
        id: provider_id,
        user_id,
      },
    });

    if (!github) {
      throw new Error('Github not found');
    }

    await github.destroy();

    const recived = await Github.findAll({
      attributes: ['id', 'name', 'login', 'bio', 'user_id', 'tags'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return recived;
  }
}

export default new DeleteGithubServices();
