const chats = require("../controllers/chats");

exports.init = function (io) {
    io.sockets.on('connection', function (socket) {
        try {
            socket.on('join', function (plantId, userId) {
                socket.join(plantId);
                io.sockets.to(plantId).emit('joined', plantId, userId);
            });
            socket.on('chat', function (plantId, userId, message) {
                io.sockets.to(plantId).emit('chat', plantId, userId, message);
                chats.create(plantId, message, userId);
            });
            socket.on('disconect', function () {
                console.log('someone disconnected');
            });
            socket.on('history', async function (plantId) {
                let chatList = await chats.getChats(plantId);
                if (chatList) {
                    chatList.forEach(chat => io.sockets.to(socket.id).emit('chat', plantId, chat.userId, chat.message));
                }
            });
        } catch (e) {
            console.log(e)
        }
    });
}