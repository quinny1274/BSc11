function addNewCreatePlantButtonEventListener(ev)  {
  ev.preventDefault();

  const formData = new FormData(document.getElementById("createPlantForm"));
  let allFieldsFilled = true;
  const requiredFields = document.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    console.log("Form data: " + field.id);
    if(!field.value.trim()) {
      allFieldsFilled = false;
      return;
    }
  })

  console.log("Form data: " + requiredFields);
  if (allFieldsFilled) {
    openSyncPlantsIndexDB().then((db) => {
      addNewPlantToSync(db, formData);
    });

    console.log('myImage', myImage);
    localStorage.setItem('myImage', myImage);

    window.location.href = '/explore';
  }else {
    alert('Please fill in all required fields.');
  }


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