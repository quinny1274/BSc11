const syncChatsIndexDBName = "sync-chats"

const addNewChatToSync = (syncChatIndexDB, plantId, message, userId) => {
  console.log("Starting Sync add");
  console.log(plantId, message, userId);
  if (plantId && message && userId) {
    console.log("Sync add");
    const transaction = syncChatIndexDB.transaction([syncChatsIndexDBName], "readwrite")
    const chatStore = transaction.objectStore(syncChatsIndexDBName)

    // Check if an image was selected
    const addRequest = chatStore.add({
      plantId: plantId,
      message: message,
      userId: userId
    })

    addRequest.addEventListener("success", () => {
      console.log("Added " + "#" + addRequest.result + ": " + plantId + message + userId)
      const getRequest = chatStore.get(addRequest.result)
      getRequest.addEventListener("success", () => {
        console.log("Found " + JSON.stringify(getRequest.result))
        // Send a sync message to the service worker
        navigator.serviceWorker.ready.then((sw) => {
          sw.sync.register("sync-chat")
        }).then(() => {
          console.log("Sync registered");
        }).catch((err) => {
          console.log("Sync registration failed: " + JSON.stringify(err))
        })
      })
    })

  } else {
    console.log("No image selected.");
  }
}


// Function to get the chat list from the IndexedDB
const getAllSyncChats = (syncChatIndexDB) => {
  return new Promise((resolve, reject) => {
    const transaction = syncChatIndexDB.transaction([syncChatsIndexDBName]);
    const chatStore = transaction.objectStore(syncChatsIndexDBName);
    const getAllRequest = chatStore.getAll();

    getAllRequest.addEventListener("success", () => {
      resolve(getAllRequest.result);
    });

    getAllRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
}

// Function to delete a syn
const deleteSyncChatFromIndexDB = (syncChatIndexDB, id) => {
  console.log("HERE");
  const transaction = syncChatIndexDB.transaction([syncChatsIndexDBName], "readwrite");
  const chatStore = transaction.objectStore(syncChatsIndexDBName);
  console.log(id);
  const deleteRequest = chatStore.delete(id);
  deleteRequest.addEventListener("success", () => {
    console.log("Deleted " + id);
  })
}

function openSyncChatsIndexDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(syncChatsIndexDBName, 1);

    request.onerror = function (event) {
      reject(new Error(`Database error: ${event.target}`));
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(syncChatsIndexDBName, {keyPath: 'id', autoIncrement: true});
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };
  });
}
