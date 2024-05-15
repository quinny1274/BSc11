var express = require('express');
var router = express.Router();
const plants = require("../controllers/plants");

router.get('/', function(req, res, next) {
  let result = plants.getAll()
  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data });
  })
});

//TODO find a better way to do this for indexdb caching
router.get('/allPlants', function (req, res, next) {
  plants.getAll().then(todos => {
    console.log(todos);
    return res.status(200).send(todos);
  }).catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
})

router.get('/sort/date_time', function(req, res, next) {
  let result = plants.getAll({date: -1})

  console.log("Sort date time");

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data });
  })
});

router.get('/sort/identification', function(req, res, next) {
  let result = plants.getAll({name: 1}) // TODO: add additional enableUserSuggestions filter

  console.log("Sort date time");

  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data });
  })
});

module.exports = router;