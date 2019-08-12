const axios = require('axios');
const DevModel = require('../models/DevModel');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await DevModel.findById(user);

        const devs = await DevModel.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } }
            ]
        });

        return res.json(devs);
    },

    async store(req, res) {
        const { username } = req.body;

        if (username) {

            try {
                const userExists = await DevModel.findOne({ user: username });

                if (userExists) {
                    return res.json(userExists);
                }

                const response = await axios.get(`https://api.github.com/users/${username}`);

                const { name, bio, avatar_url: avatar } = response.data;

                const dev = await DevModel.create({
                    name,
                    user: username,
                    bio,
                    avatar
                });

                return res.json(dev);
            } catch (exc) {
                return res.status(404).json({ error: exc.message });
            }
        }

        return res.status(400).json({ error: 'username is null' });
    }
}