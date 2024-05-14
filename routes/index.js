var express = require('express');
var router = express.Router();
var plants = require('../controllers/plants');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/explore', function(req, res, next) {
  let result = plants.getAll()
  result.then(plants => {
    let data = JSON.parse(plants);
    res.render('explore', { title: 'Explore', data: data });
  })
});

router.get('/display', function(req, res, next) {
  let result = plants.getAll()
  result.then(students => {
    let data = JSON.parse(students);
    res.render('display', {title: 'View All Students', data: data});
  })
});

router.get('/explore/sort/date_time', function(req, res, next) {
    let result = plants.getAll({date: -1})

    console.log("Sort date time");

    result.then(plants => {
        let data = JSON.parse(plants);
        res.render('explore', { title: 'Explore', data: data });
    })
});

router.get('/explore/sort/identification', function(req, res, next) {
    let result = plants.getAll({name: 1}) // TODO: add additional enableUserSuggestions filter

    console.log("Sort date time");

    result.then(plants => {
        let data = JSON.parse(plants);
        res.render('explore', { title: 'Explore', data: data });
    })
});

module.exports = router;
