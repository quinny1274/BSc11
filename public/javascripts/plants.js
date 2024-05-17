let globalUserId = null;
let globalPlantId = null;
let socket = io();

function init(plantId) {
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
  let userId = localStorage.getItem('userID');
  connectToPlantChat(plantId, userId)
  socket.emit('history', globalPlantId);
  if (!navigator.onLine) {
    openChatsIndexDB().then((db) => {
      getAllChats(db).then((chats) => {
        chats.forEach(chat => {
          if (chat.plantId === plantId){
            let who = chat.userId
            if (who === userId) {
              who = 'Me';
            }
            writeOnHistory('<b>' + who + ':</b> ' + chat.message)
          }
        })
      });
    });
  }
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
