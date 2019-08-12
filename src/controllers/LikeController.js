const DevModel = require('../models/DevModel');

module.exports = {
    async store(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await DevModel.findById(user);
        const targetDev = await DevModel.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }

            console.log('It\'s a Match');
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}