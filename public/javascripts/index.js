// Function to insert a todo item into the list
// const insertTodoInList = (todo) => {
//     if (todo.text) {
//         const copy = document.getElementById("todo_template").cloneNode()
//         copy.removeAttribute("id") // otherwise this will be hidden as well
//         copy.innerText = todo.text
//         copy.setAttribute("data-todo-id", todo.id)
//
//         // Insert sorted on string text order - ignoring case
//         const todolist = document.getElementById("todo_list")
//         const children = todolist.querySelectorAll("li[data-todo-id]")
//         let inserted = false
//         for (let i = 0; (i < children.length) && !inserted; i++) {
//             const child = children[i]
//             const copy_text = copy.innerText.toUpperCase()
//             const child_text = child.innerText.toUpperCase()
//             if (copy_text < child_text) {
//                 todolist.insertBefore(copy, child)
//                 inserted = true
//             }
//         }
//         if (!inserted) { // Append child
//             todolist.appendChild(copy)
//         }
//     }
// }

// Register service worker to control making site work offline
// const plants = require("../../controllers/plants");
window.onload = function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
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
      // plants.getAll()
      .then(function (res) {
        return res.json();
      }).then(function (newTodos) {
      openPlantsIndexDB().then((db) => {
        // insertTodoInList(db, newTodos)
        deleteAllExistingPlantFromIndexDB(db).then(() => {
          addNewPlantsToIndexDB(db, newTodos).then(() => {
            console.log("All new plants added to IDB")
          })
        });
      });
    });

  } else {
    console.log("Offline mode")
    openPlantsIndexDB().then((db) => {
      getAllPlants(db).then((todos) => {
        for (const todo of todos) {
          // insertTodoInList(todo)
        }
      });
    });

  }
}