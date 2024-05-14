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

// // Example usage:
// const plantName = "Rose";
// queryDBpedia(plantName)
//     .then(data => {
//         console.log(data);
//         // Process data here
//     })
//     .catch(error => {
//         console.error(error);
//     });

module.exports = router;
