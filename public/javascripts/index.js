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

  // Check if the browser supports the Notification API
  // if ("Notification" in window) {
  //     // Check if the user has granted permission to receive notifications
  //     if (Notification.permission === "granted") {
  //         // Notifications are allowed, you can proceed to create notifications
  //         // Or do whatever you need to do with notifications
  //     } else if (Notification.permission !== "denied") {
  //         // If the user hasn't been asked yet or has previously denied permission,
  //         // you can request permission from the user
  //         Notification.requestPermission().then(function (permission) {
  //             // If the user grants permission, you can proceed to create notifications
  //             if (permission === "granted") {
  //                 navigator.serviceWorker.ready
  //                     .then(function (serviceWorkerRegistration) {
  //                         serviceWorkerRegistration.showNotification("Todo App",
  //                             {body: "Notifications are enabled!"})
  //                             .then(r =>
  //                                 console.log(r)
  //                             );
  //                     });
  //             }
  //         });
  //     }
  // }
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