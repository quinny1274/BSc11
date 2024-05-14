let globalUserId = null;
let globalPlantId = null;
let socket = io();

function init(plantId, userId) {
    socket.on('joined', function (plantId, userId) {
        if (userId === globalUserId) {
        } else {
            writeOnHistory('<b>' + userId + '</b>' + 'joined room' + plantId)
        }
    });
    socket.on('chat', function (plantId, userId, chatText) {
        let who = userId
        if (userId === globalUserId) {
            who = 'Me';
        }
        writeOnHistory('<b>' + who + ':</b> ' + chatText)
    })
    connectToPlantChat(plantId, userId)
    socket.emit('history', globalUserId);
}

function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    console.log('chat', globalPlantId, globalUserId, chatText)
    socket.emit('chat', globalPlantId, globalUserId, chatText);
}

function connectToPlantChat(plantId, userId) {
    globalPlantId = plantId;
    globalUserId = userId;
    socket.emit('join', plantId, userId);
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph)
    document.getElementById('chat_input').value = '';
}

function back() {

}