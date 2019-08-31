import User from '../models/User';
import Github from '../models/Github';

class ProviderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const providers = await User.findAll({
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(providers);
  }

  async show(req, res) {
    try {
      const { name } = req.params;

      const user = await User.findByPk(req.userId);

      if (!user.provider) {
        return res.status(401).json({ error: 'User not provider' });
      }

      const response = await Github.findOne({
        where: { login: name },
      });

      if (!response) {
        return res.status(400).json({ error: 'Dev not found' });
      }

      const data = {
        name: response.login,
        bio: response.bio,
        locale: response.locale,
        html_url: response.html_url,
      };

      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: `${err}` });
    }
  }
}

export default new ProviderController();
