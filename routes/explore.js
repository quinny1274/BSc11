var express = require('express');
var router = express.Router();
const plants = require("../controllers/plants");
const chats = require("../controllers/chats");

router.get('/', function(req, res, next) {
  let result = plants.getAll()

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data, sort: "" });
  })
});

//TODO find a better way to do this for indexdb caching
router.get('/allPlants', function (req, res, next) {
  plants.getAll().then(plants => {
    console.log(plants);
    return res.status(200).send(plants);
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
})

router.get('/allChats', function (req, res, next) {
  chats.getAll().then(chats => {
    console.log(chats);
    return res.status(200).send(chats);
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
})

router.get('/sort/date_time', function(req, res, next) {
  let result = plants.getAll({date: -1})

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data, sort: "Date/Time" });
  })
});

router.get('/sort/identification', function(req, res, next) {
  let result = plants.getAll({name: 1})

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data, sort: "Identification" });
  })
});

router.get('/sort/location', function(req, res, next) {

  const userLat = req.query.lat;
  const userLong = req.query.long;

  const { lat, long } = { lat: userLat, long: userLong };

  let result = plants.getAll();

  result.then(plants => {
    let data = JSON.parse(plants);

    // Calculate distance for each plant and add it as a property
    data.forEach(plant => {
      const { lat: plantLat = 0, long: plantLong = 0 } = extractLatLong(plant.location) || {};
      plant.distance = calculateDistance(lat, long, plantLat, plantLong);
    });

    // Sort the data based on distance
    data.sort((a, b) => a.distance - b.distance);

    res.render('explore', { title: 'Explore', data: data, sort: "Identification" });
  })
});

// Location extraction
function extractLatLong(locationString) {
  // Regular expression to match latitude and longitude values
  const regex = /lat\s*(-?\d+\.\d+)\s*long\s*(-?\d+\.\d+)/;
  const match = locationString.match(regex);

  if (match) {
    // Extract latitude and longitude from the regex match
    const lat = parseFloat(match[1]);
    const long = parseFloat(match[2]);
    return { lat, long };
  } else {
    // No match
    return null;
  }
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

module.exports = router;