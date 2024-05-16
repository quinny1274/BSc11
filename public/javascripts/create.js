const addNewCreatePlantButtonEventListener = (event) => {
  // event.preventDefault();
  //TODO check form data is populated
  console.log('Button listener added');
  const formData = new FormData(document.getElementById("createPlantForm"));
  console.log(formData);
  openSyncPlantsIndexDB().then((db) => {
    addNewPlantToSync(db, formData);
  });
  console.log('fuck this');

  const myImage = document.getElementById('myImage').value;
  console.log('myImage', myImage);
  localStorage.setItem('myImage', myImage);

  window.location.href = '/explore';


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