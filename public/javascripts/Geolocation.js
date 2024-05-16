function initMap(){
    // Sets zoomed out
    window.plantLocMap = L.map("map").setView([40,2], 2);
    window.plantLocMap.on('click', clickUpdate)
    // Link to open street map API
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
        {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
        .addTo(window.plantLocMap);
}

function updateForm(lat,long){
    // Crude update of form, change into more useful format
    document.getElementById("location").value = "lat " + lat + " long" + long
}

function updateMapWindow(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    // Set view around geolocated area
    window.plantLocMap.setView([lat,long], 13);
    // Adds marker
    window.marker = L.marker([lat,long]).addTo(window.plantLocMap);
    window.marker.bindPopup("Plant Location")
    updateForm(lat,long)
}
function clickUpdate(e){
    updateForm(e.latlng.lat,e.latlng.lng);
    //Moves marker
    window.marker.setLatLng(e.latlng)
}
function errorNoGeo(error){
    alert(error.message);
}
function getLocation(){
    if (navigator.geolocation) {
        // Geolocation of device
        navigator.geolocation.getCurrentPosition(updateMapWindow, errorNoGeo);
    }
    else {
        alert("Geolocation is not possible on your browser");
    }
}

initMap();
getLocation();