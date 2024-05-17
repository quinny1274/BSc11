const plantsIndexDBName = "plants"
const syncPlantsIndexDBName = "sync-plants"

// Function to handle adding a new plant
const addNewPlantToSync = (syncPlantIndexDB, formData) => {
  console.log("Starting Sync add");
  console.log(formData);
  if (formData) {
    console.log("Sync add");
    const transaction = syncPlantIndexDB.transaction([syncPlantsIndexDBName], "readwrite")
    const plantStore = transaction.objectStore(syncPlantsIndexDBName)

    const image = formData.get("myImage");

    // Check if an image was selected
    if (image instanceof File) {
      const addRequest = plantStore.add({
        name: formData.get("name"),
        enableSuggestions: formData.get("enableSuggestions") === 'on',
        date: formData.get("date"),
        location: formData.get("location"),
        description: formData.get("description"),
        size: formData.get("size"),
        flowers: formData.get("flowers") === 'on',
        leaves: formData.get("leaves") === 'on',
        fruit: formData.get("fruit") === 'on',
        sunExposure: formData.get("sunExposure"),
        flowerColour: formData.get("flowerColour"),
        img: image,
        userId: formData.get("userID")
      })

      addRequest.addEventListener("success", () => {
        console.log("Added " + "#" + addRequest.result + ": " + formData)
        const getRequest = plantStore.get(addRequest.result)
        getRequest.addEventListener("success", () => {
          console.log("Found " + JSON.stringify(getRequest.result))
          // Send a sync message to the service worker
          navigator.serviceWorker.ready.then((sw) => {
            sw.sync.register("sync-plant")
          }).then(() => {
            console.log("Sync registered");
          }).catch((err) => {
            console.log("Sync registration failed: " + JSON.stringify(err))
          })
        })
      })
    }
  } else {
    console.log("No image selected.");
  }
}

// Function to add new plants to IndexedDB and return a promise
const addNewPlantsToIndexDB = (plantIndexDB, plants) => {
  return new Promise((resolve, reject) => {
    const transaction = plantIndexDB.transaction([plantsIndexDBName], "readwrite");
    const plantStore = transaction.objectStore(plantsIndexDBName);

    const addPromises = plants.map(plant => {
      return new Promise((resolveAdd, rejectAdd) => {
        const addRequest = plantStore.add(plant);
        addRequest.addEventListener("success", () => {
          console.log("Added " + "#" + addRequest.result + ": " + plant);
          const getRequest = plantStore.get(addRequest.result);
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


// Function to remove all plants from idb
const deleteAllExistingPlantFromIndexDB = (plantIndexDB) => {
  const transaction = plantIndexDB.transaction([plantsIndexDBName], "readwrite");
  const plantStore = transaction.objectStore(plantsIndexDBName);
  const clearRequest = plantStore.clear();

  return new Promise((resolve, reject) => {
    clearRequest.addEventListener("success", () => {
      resolve();
    });

    clearRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
};


// Function to get the plant list from the IndexedDB
const getAllPlants = (plantIndexDB) => {
  return new Promise((resolve, reject) => {
    const transaction = plantIndexDB.transaction([plantsIndexDBName]);
    const plantStore = transaction.objectStore(plantsIndexDBName);
    const getAllRequest = plantStore.getAll();

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


// Function to get the plant list from the IndexedDB
const getAllSyncPlants = (syncPlantIndexDB) => {
  return new Promise((resolve, reject) => {
    const transaction = syncPlantIndexDB.transaction([syncPlantsIndexDBName]);
    const plantStore = transaction.objectStore(syncPlantsIndexDBName);
    const getAllRequest = plantStore.getAll();

    getAllRequest.addEventListener("success", () => {
      resolve(getAllRequest.result);
    });

    getAllRequest.addEventListener("error", (event) => {
      reject(event.target.error);
    });
  });
}

// Function to delete a syn
const deleteSyncPlantFromIndexDB = (syncPlantIndexDB, id) => {
  const transaction = syncPlantIndexDB.transaction([syncPlantsIndexDBName], "readwrite");
  const plantStore = transaction.objectStore(syncPlantsIndexDBName);
  const deleteRequest = plantStore.delete(id);
  deleteRequest.addEventListener("success", () => {
    console.log("Deleted " + id);
  })
}

function openPlantsIndexDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(plantsIndexDBName, 1);

    request.onerror = function (event) {
      reject(new Error(`Database error: ${event.target}`));
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(plantsIndexDBName, {keyPath: '_id'});
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };
  });
}


function openSyncPlantsIndexDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(syncPlantsIndexDBName, 1);

    request.onerror = function (event) {
      reject(new Error(`Database error: ${event.target}`));
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(syncPlantsIndexDBName, {keyPath: 'id', autoIncrement: true});
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      resolve(db);
    };
  });
}
