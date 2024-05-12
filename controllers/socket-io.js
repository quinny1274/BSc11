const chats = require("../controllers/chats");

exports.init = function (io) {
    io.sockets.on('connection', function (socket) {
        try {
            socket.on('join', function (room, userId) {
                socket.join(room);
                io.sockets.to(room).emit('joined', room, userId);
            });
            socket.on('chat', function (room, userId, chatText) {
                io.sockets.to(room).emit('chat', room, userId, chatText);
                chats.create(room, chatText, userId);
            });
            socket.on('disconect', function () {
                console.log('someone disconnected');
            });
            socket.on('history', async function (room) {
                chatList = await chats.getChats(room);
                if (chatList) {
                    chatList.forEach(chat => io.sockets.to(socket.id).emit('chat', room, chat.user, chat.message));
                }
            });
        } catch (e) {
            console.log(e)
        }
    });
}