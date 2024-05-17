window.onload = function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (reg) {
        console.log('Service Worker Registered!', reg);
      })
      .catch(function (err) {
        console.log('Service Worker registration failed: ', err);
      });
  }

  if (navigator.onLine) {
    fetch('http://localhost:3000/explore/allPlants')
      .then(function (res) {
        return res.json();
      }).then(function (newPlants) {
      openPlantsIndexDB().then((db) => {
        deleteAllExistingPlantFromIndexDB(db).then(() => {
          addNewPlantsToIndexDB(db, newPlants).then(() => {
            console.log("All new plants added to IDB")
          })
        });
      });
    });

    fetch('http://localhost:3000/explore/allChats')
      .then(function (res) {
        return res.json();
      }).then(function (newChats) {
      openChatsIndexDB().then((db) => {
        deleteAllExistingChatFromIndexDB(db).then(() => {
          addNewChatsToIndexDB(db, newChats).then(() => {
            console.log("All new chats added to IDB")
          })
        });
      });
    });
  }
}