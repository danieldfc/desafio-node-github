import * as Yup from 'yup';

import User from '../models/User';

import api from '../../services/api';
import Github from '../models/Github';

class GithubController {
  async store(req, res) {
    try {
      const { login } = req.body;

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

      const { locale, name, bio, html_url, user_id } = await Github.create(
        {
          login,
          locale: response.data.location,
          name: response.data.name,
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

      return res.json({
        login,
        locale,
        name,
        bio,
        html_url,
        user_id,
      });
    } catch (err) {
      return res.status(400).json({ error: `${err}` });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string(),
      locale: Yup.string(),
      bio: Yup.string(),
      html_url: Yup.string(),
      user_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Date isn't avalible." });
    }

    const { login, tags } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'User is not provider' });
    }

    const github = await Github.findOne({ where: { login } });

    if (login && !github) {
      return res.status(400).json({ error: 'Dev not found.' });
    }

    const { id, bio, locale, html_url } = await github.update(req.body);

    return res.json({
      github: {
        id,
        bio,
        locale,
        html_url,
        tags,
      },
    });
  }
}

export default new GithubController();
