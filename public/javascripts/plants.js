let globalUserId = null;
let globalPlantId = null;
let socket = io();

function init(plantId) {
  socket.on('join', function (plantId, userId) {
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
  } else {
    socket.emit('history', globalPlantId);
  }
}

function sendChatText() {
  let chatText = document.getElementById('chat_input').value;
  if (!navigator.onLine) {
    openSyncChatsIndexDB().then((db) => {
      addNewChatToSync(db, globalPlantId, chatText, globalUserId);
      writeOnHistory('<b>' + 'Me' + ':</b> ' + chatText)
    });
  } else {
    console.log('chat', globalPlantId, globalUserId, chatText)
    socket.emit('chat', globalPlantId, globalUserId, chatText);
  }
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
