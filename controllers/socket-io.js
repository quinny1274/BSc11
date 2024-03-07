exports.init = function (io) {
    io.sockets.on('connection', function (socket) {
        try {
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                io.sockets.to(room).emit('joined', room, userId);
            });
            socket.on('chat', function (room, userId, chatText) {
                io.sockets.to(room).emit('chat', room, userId, chatText);
            });
            socket.on('disconect', function () {
                console.log('someone disconnected');
            });
        } catch (e) {
            console.log(e)
        }
    });
}