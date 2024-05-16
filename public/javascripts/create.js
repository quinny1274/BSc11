const addNewCreatePlantButtonEventListener = () => {
  // if (navigator.offline) {
  console.log('Button listener added');
  const formData = new FormData(document.getElementById("createPlantForm"));
  console.log(formData);
  openSyncPlantsIndexDB().then((db) => {
    addNewPlantToSync(db, formData);
  });
  // }
  // navigator.serviceWorker.ready
  //   .then(function (serviceWorkerRegistration) {
  //     serviceWorkerRegistration.showNotification("Todo App",
  //       {body: "Todo added! - " + formData})
  //       .then(r =>
  //         console.log(r)
  //       );
  //   });
}

window.onload = function () {
  // Add event listeners to buttons
  console.log('Button listener start');
  const createPlantButton = document.getElementById("createPlantButton")
  createPlantButton.addEventListener("click", addNewCreatePlantButtonEventListener)
}