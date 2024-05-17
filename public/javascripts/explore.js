window.onload = function () {

  if (navigator.onLine) {
    fetch('http://localhost:3000/explore/allPlants')
      .then(function (res) {
        return res.json();
      }).then(function (newPlants) {
      openPlantsIndexDB().then((db) => {
        deleteAllExistingPlantFromIndexDB(db).then(() => {
          addNewPlantsToIndexDB(db, newPlants).then(() => {
            console.log("All new plants added to IDB")
            buildAndInsertPlants(db)
          })
        });
      });
    });

  } else {
    console.log("Offline mode")
    openPlantsIndexDB().then((db) => {
      buildAndInsertPlants(db)
    });

  }
}


function extractLatLong(locationString) {
  // Regular expression to match latitude and longitude values
  const regex = /lat\s*(-?\d+\.\d+)\s*long\s*(-?\d+\.\d+)/;
  const match = locationString.match(regex);

  if (match) {
    // Extract latitude and longitude from the regex match
    const lat = parseFloat(match[1]);
    const long = parseFloat(match[2]);
    return {lat, long};
  } else {
    // No match
    return null;
  }
}

function formatCoordinates(lat, lng) {
  const formattedLat = `Lat: ${lat?.toFixed(5)}...`;
  const formattedLng = `Long: ${lng?.toFixed(5)}...`;
  return `${formattedLat}, ${formattedLng}`;
}

// Get the userID from localStorage
const userID = localStorage.getItem('userID');

function buildAndInsertPlants(db) {
  getAllPlants(db).then((plants) => {
    let htmlContent = ``;
    for (const plant of plants) {
      htmlContent += `
            <div class="col">
                <a href="/plants/${plant._id}?userID=${encodeURIComponent(userID)}">
                    <div class="card h-100 hover-shadow">
                        <img src="/${plant.img}" class="card-img-top cropped-image" alt="...">
                        <div class="card-body">
                        `;
      if (plant.name) {
        htmlContent += `<h5 class="card-title">${plant.name}</h5>`;
      }
      if (plant.enableSuggestions) {
        htmlContent += `<h6><span class="badge bg-warning px-2 py-1">Not Identified</span></h6>`;
      } else {
        htmlContent += `<h6><span class="badge bg-custom-primary px-2 py-1">Identified</span></h6>`;
      }
      htmlContent += `
        <p class="card-text">${plant.description}</p>
        </div>
        <div class="card-footer">`;
      const date = new Date(Date.parse(plant.date));
      const location = extractLatLong(plant.location);
      const formattedCoordinates = formatCoordinates(location?.lat, location?.long);

      htmlContent += `
          <small class="text-muted">Found at <strong>${formattedCoordinates}</strong>,on <strong>${date.toLocaleDateString('en-GB')}</strong></small>
        </div>
      </div>
      </a>
      </div>
`;
    }
    document.getElementById('content').innerHTML = htmlContent;
  });
}