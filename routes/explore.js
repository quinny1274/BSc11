var express = require('express');
var router = express.Router();
const plants = require("../controllers/plants");

router.get('/', function(req, res, next) {
  let result = plants.getAll()
  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data, sort: "" });
  })
});

router.get('/sort/date_time', function(req, res, next) {
  let result = plants.getAll({date: -1})

  console.log("Sort date time");

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data, sort: "Date/Time" });
  })
});

router.get('/sort/identification', function(req, res, next) {
  let result = plants.getAll({name: 1}) // TODO: add additional enableUserSuggestions filter

  console.log("Sort date time");

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data, sort: "Identification" });
  })
});

module.exports = router;