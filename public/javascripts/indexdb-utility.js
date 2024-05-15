// Function to handle adding a new todo
// const plantModel = require('../models/plants');
//
// const addNewPlantToSync = (syncPlantIndexDB, plant) => {
//     // Retrieve todo text and add it to the IndexedDB
//
//     if (plant !== "") {
//         const transaction = syncPlantIndexDB.transaction(["sync-plants"], "readwrite")
//         const plantStore = transaction.objectStore("sync-plants")
//         const addRequest = plantStore.add({plantModel: plant}) //TODO this might not work,
//         addRequest.addEventListener("success", () => {
//             console.log("Added " + "#" + addRequest.result + ": " + plant)
//             const getRequest = plantStore.get(addRequest.result)
//             getRequest.addEventListener("success", () => {
//                 console.log("Found " + JSON.stringify(getRequest.result))
//                 // Send a sync message to the service worker
//                 navigator.serviceWorker.ready.then((sw) => {
//                     sw.sync.register("sync-plant")
//                 }).then(() => {
//                     console.log("Sync registered");
//                 }).catch((err) => {
//                     console.log("Sync registration failed: " + JSON.stringify(err))
//                 })
//             })
//         })
//     }
// }

// Function to add new todos to IndexedDB and return a promise
const addNewPlantsToIndexDB = (plantIndexDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIndexDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + plant);
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + JSON.stringify(getRequest.result));
                        // Assume insertTodoInList is defined elsewhere
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


// Function to remove all todos from idb
const deleteAllExistingPlantFromIndexDB = (plantIndexDB) => {
        const transaction = plantIndexDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");
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




// Function to get the todo list from the IndexedDB
const getAllPlants = (plantIndexDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIndexDB.transaction(["plants"]);
        const plantStore = transaction.objectStore("plants");
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


// // Function to get the todo list from the IndexedDB
// const getAllSyncTodos = (syncTodoIDB) => {
//     return new Promise((resolve, reject) => {
//         const transaction = syncTodoIDB.transaction(["sync-todos"]);
//         const todoStore = transaction.objectStore("sync-todos");
//         const getAllRequest = todoStore.getAll();
//
//         getAllRequest.addEventListener("success", () => {
//             resolve(getAllRequest.result);
//         });
//
//         getAllRequest.addEventListener("error", (event) => {
//             reject(event.target.error);
//         });
//     });
// }
//
// // Function to delete a syn
// const deleteSyncTodoFromIDB = (syncTodoIDB, id) => {
//     const transaction = syncTodoIDB.transaction(["sync-todos"], "readwrite")
//     const todoStore = transaction.objectStore("sync-todos")
//     const deleteRequest = todoStore.delete(id)
//     deleteRequest.addEventListener("success", () => {
//         console.log("Deleted " + id)
//     })
// }

function openPlantsIndexDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('plants', {keyPath: '_id'});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

// function openSyncTodosIDB() {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open("sync-todos", 1);
//
//         request.onerror = function (event) {
//             reject(new Error(`Database error: ${event.target}`));
//         };
//
//         request.onupgradeneeded = function (event) {
//             const db = event.target.result;
//             db.createObjectStore('sync-todos', {keyPath: 'id', autoIncrement: true});
//         };
//
//         request.onsuccess = function (event) {
//             const db = event.target.result;
//             resolve(db);
//         };
//     });
// }
