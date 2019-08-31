import * as Yup from 'yup';

import api from '../../services/api';

import User from '../models/User';

class ProviderController {
  async index(req, res) {
    const providers = User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email'],
    });

    return res.json(providers);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string,
    });

    if (!(await schema.isValid())) {
      return res.status(401).json({ error: 'Validation invalid' });
    }

    const { name } = req.params;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!user.provider) {
      return res.status(401).json({ error: 'User not provider' });
    }

    const response = await api.get(`/users/${name}`);

    const data = {
      id: response.data.id,
      name: response.data.name,
      bio: response.data.bio,
      html_url: response.data.html_url,
    };

    return res.json(data);
  }
}

export default new ProviderController();
