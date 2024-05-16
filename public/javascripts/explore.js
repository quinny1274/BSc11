window.onload = function () {

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