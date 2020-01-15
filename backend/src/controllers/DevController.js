const Dev = require('../models/Dev');
const axios = require('axios');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    const existDev = await Dev.findOne({ github_username });
    if (existDev) return res.json(existDev);

    try {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );
      console.log(response.data);
      const { name = login, avatar_url, bio } = response.data;
      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      const dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      return res.json(dev);
    } catch {
      return res.status(404).send({ message: 'User not found' });
    }
  }
};
