const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const cors = require('cors');

require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
});

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});