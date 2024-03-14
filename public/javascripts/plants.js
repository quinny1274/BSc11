let name = null;
let roomNo = null;
let socket = io();

function init(a, b) {
    socket.on('joined', function (room, userId) {
        if (userId === name) {
        } else {
            writeOnHistory('<b>'+userId+'</b>'+'joined room'+room)
        }
    });
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>'+who+'</b>'+chatText)
    })
    connectToRoomUUID(a, b)
}

function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    console.log('chat', roomNo, name, chatText)
    socket.emit('chat', roomNo, name, chatText);
}

function connectToRoomUUID(a, b) {
    roomNo = a;
    name = b;
    socket.emit('join', roomNo, name);
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph)
    document.getElementById('chat_input').value = '';
}
