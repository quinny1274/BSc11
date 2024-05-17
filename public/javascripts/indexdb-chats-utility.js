const chatsIndexDBName = "chats"

// Function to add new chats to IndexedDB and return a promise
const addNewChatsToIndexDB = (chatIndexDB, chats) => {
  return new Promise((resolve, reject) => {
    const transaction = chatIndexDB.transaction([chatsIndexDBName], "readwrite");
    const chatStore = transaction.objectStore(chatsIndexDBName);

    const addPromises = chats.map(chat => {
      return new Promise((resolveAdd, rejectAdd) => {
        const addRequest = chatStore.add(chat);
        addRequest.addEventListener("success", () => {
          console.log("Added " + "#" + addRequest.result + ": " + chat);
          const getRequest = chatStore.get(addRequest.result);
          getRequest.addEventListener("success", () => {
            console.log("Found " + JSON.stringify(getRequest.result));
            // insertTodoInList(getRequest.result);
            resolveAdd(); // Resolve the add promise
          });
          getRequest.addEventListener("error", (event) => {
            rejectAdd(event.target.error); // Reject the add promise if there's an error
          });
        });
        addRequest.addEventListener("error", (event) => {
          rejectAdd(event.target.error); // Reject the add promise if there's an error
        });
      });
    });

    // Resolve the main promise when all add operations are completed
    Promise.all(addPromises).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
};


// Function to remove all chats from idb
const deleteAllExistingChatFromIndexDB = (chatIndexDB) => {
  const transaction = chatIndexDB.transaction([chatsIndexDBName], "readwrite");
  const chatStore = transaction.objectStore(chatsIndexDBName);
  const clearRequest = chatStore.clear();

  return new Promise((resolve, reject) => {
    clearRequest.addEventListener("success", () => {
      resolve();
    });

    clearRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
};


// Function to get the chat list from the IndexedDB
const getAllChats = (chatIndexDB, plantId) => {
  return new Promise((resolve, reject) => {
    const transaction = chatIndexDB.transaction([chatsIndexDBName]);
    const chatStore = transaction.objectStore(chatsIndexDBName);
    const getAllRequest = chatStore.getAll(); //TODO add the plant id filter after

    // Handle success event
    getAllRequest.addEventListener("success", (event) => {
      resolve(event.target.result); // Use event.target.result to get the result
    });

    // Handle error event
    getAllRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
}

function openChatsIndexDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(chatsIndexDBName, 1);

    request.onerror = function (event) {
      reject(new Error(`Database error: ${event.target}`));
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(chatsIndexDBName, {keyPath: '_id'});
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };
  });
}


