import api from '../../services/api';

import User from '../models/User';
import Github from '../models/Github';

import DeleteGithubServices from '../services/DeleteGithubServices';

class GithubController {
  async store(req, res) {
    try {
      const { login, name } = req.body;

      const user = await User.findByPk(req.userId);

      if (!user.provider) {
        return res.status(401).json({ error: 'User not provider' });
      }

      const git = await Github.findOne({ where: { login } });

      if (git) {
        return res.status(401).json({ error: 'User already exists' });
      }

      const response = await api.get(`/users/${login}`);

      if (!response) {
        return res.status(400).json({ error: 'Dev not found' });
      }

      await Github.create(
        {
          name,
          login,
          locale: response.data.location,
          bio: response.data.bio,
          html_url: response.data.html_url,
          user_id: req.userId,
        },
        {
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        }
      );

      const received = await Github.findAll({
        attributes: ['id', 'name', 'login', 'bio', 'user_id', 'tags'],
        order: [['login', 'ASC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      return res.json(received);
    } catch (err) {
      return res.status(400).json({ error: `${err}` });
    }
  }

  async update(req, res) {
    const { login } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'User is not provider' });
    }

    const github = await Github.findOne({ where: { login } });

    if (login && !github) {
      return res.status(400).json({ error: 'Dev not found.' });
    }

    await github.update(req.body);

    const received = await Github.findAll({
      attributes: ['id', 'name', 'login', 'bio', 'user_id', 'tags'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(received);
  }

  async delete(req, res) {
    const received = await DeleteGithubServices.run({
      provider_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(received);
  }
}

export default new GithubController();
